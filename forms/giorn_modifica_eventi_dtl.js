/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"CF3A31CF-DE66-4B07-9268-FA4D5CE93445"}
 * @SuppressWarnings(wrongparameters)
 */
function confermaModificaEvento(event)
{
	if(event.getElementName() != 'btn_mod_conferma')
	{
	    var response = controllaInformativiStatistici();
		if(!gestioneInformativiStatistici(response))			
		   return;
	}
	
	canClose = true;
	
	var arrGgSel = globals.getGiorniSelezionatiEv();
	var arrGiorniSel = [];
	var anno = globals.getAnno();
	var mese = globals.getMese();
	
	for(var g = 0; g < arrGgSel.length; g++)
		arrGiorniSel.push(new Date(anno,mese - 1,arrGgSel[g]));
		
	var params = {
        processFunction: process_modifica_evento,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: [event
                      , _idGiornaliera ? globals.getIdLavoratoreDaIdGiornaliera(_idGiornaliera) : null
					  , _isInModifica ? [globals.getGiornoDaIdGiornaliera(_idGiornaliera)] : arrGiorniSel
					  ]
    };
	plugins.busy.unblock();
	plugins.busy.block(params);
		
}

/**
 * Esegue l'operazione di modifica dell'evento selezionato
 * 
 * @param {JSEvent} event
 * @param {Number} [idLav]
 * @param {Array<Date>} [giorni]
 * 
 * @properties={typeid:24,uuid:"BF237088-5CB5-4D05-8B8B-C266B8E9A8B5"}
 */
function process_modifica_evento(event,idLav,giorni)
{
	try
	{
		// verifica dei dati inseriti
		if(!validaModifica())
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('Controllare i valori inseriti prima di poter proseguire','Conferma modifica evento');
			canClose = false;
			return;
		}
		
		var idLavoratore = idLav ? idLav : forms.giorn_header.idlavoratore;
		var idDitta = globals.getDitta(idLavoratore);
		var anno = giorni? giorni[0].getFullYear() : globals.getAnno(); 
		var mese = giorni ? giorni[0].getMonth() + 1 : globals.getMese();
		var giorniSelezionati = giorni ? globals.getGiorniSelezionatiFromDates(giorni) : (_isInModifica ? [forms[event.getFormName()].foundset.getSelectedIndex() - globals.offsetGg] : globals.getGiorniSelezionatiEv()); 
		
		for(var g = 0; g < giorniSelezionati.length; g++)
		{
			var day = new Date(anno, mese - 1,giorniSelezionati[g]);
			if(globals.ottieniOreAssenzaCertificazioniGiorno(idLavoratore,day) != null)
			{
				var answer = globals.ma_utl_showYesNoQuestion('Tra i giorni selezionati figurano giorni di assenza con certificati.<br> Vuoi davvero proseguire?','Conferma evento');
				if(answer)
					break;
				else
					return;
			}
		}
		
		var _arrDip = [idLavoratore]; 
		var params;
		var _retVal;
		
		// se cambia un evento il dipendente dovrà essere (ri)chiuso in fase di consolidamento
		scopes.giornaliera.cancellaChiusuraDipPerOperazione(_arrDip,idDitta);
		
		//se è flaggato il valore di copertura orario il numero di ore da inserire è pari al numero di ore dell'orario standard	
	    if(vCoperturaOrarioTeorico)
	    	_ore = _totOreTeorico;
		if(_ore == null)
			_ore = 0.00;
		
		//(controllo da effettuare in presenza di un singolo giorno)
		//se le ore inserite sono riferite ad un evento ordinario,festivo o sostitutivo non sospensivo
		//e superano quelle utilizzabili viene segnalato all'utente il superamento dell'orario teorico	
		//a meno che ci sia il flag nella copertura dell'orario teorico
		if(giorniSelezionati.length == 1 && !vCoperturaOrarioTeorico)
		{
			var _message = 'Le ore inserite superano l\'orario previsto per questa giornata.<br/>Inserire solo fino a concorrenza dell\'orario teorico?';
		    var _response = false; //globals.ma_utl_showYesNoQuestion(_message,'Superamento orario teorico');
			var _tipologiaEv = globals.getTipologiaEvento(_idevento);
		    if(_tipologiaEv.tipo === globals.TipologiaEvento.SOSPENSIVO 
		    		&& _tipologiaEv.scalo === true) 
		    {
		    	var _totOreSost;
		    	
		    	if(_isInModifica)
		    		_totOreSost = globals.getTotOreSostitutiveGiorno(_idGiornaliera,_idevento);
		    	else
		    	    _totOreSost = globals.getTotOreSostitutiveGiorno(_idGiornaliera);
		    	
		    	if(_ore*100 > _totOreTeorico - _totOreSost)
		    	{	
		    	   _response = globals.ma_utl_showYesNoQuestion(_message,'Conferma inserimento');
			
		    	   if(_response)
			          _ore = ((_totOreTeorico - _totOreSost)/100).toFixed(2);
		    	}
		    }
		    else if(_tipologiaEv.tipo === globals.TipologiaEvento.ORDINARIO)
		    {
		    	var _totOreOrd;
		    	
		    	if(_isInModifica)
		    	   _totOreOrd = globals.getTotOreOrdinarieGiorno(_idGiornaliera,_idevento);
		    	else
		    		_totOreOrd = globals.getTotOreOrdinarieGiorno(_idGiornaliera);	
		    		
		    	if(_ore*100 > _totOreTeorico - _totOreOrd)
		    	{
		    	   _response = globals.ma_utl_showYesNoQuestion(_message,'Conferma inserimento');
		    	   if(_response)
			          _ore = ((_totOreTeorico - _totOreOrd)/100).toFixed(2);
		    	}
		    }
			    	    
		}
			
		params = globals.inizializzaParametriEvento
		(
			  idDitta
			, anno * 100 + mese
			, giorniSelezionati
			, forms.giorn_vista_mensile._tipoGiornaliera
			, globals.TipoConnessione.CLIENTE
			, _arrDip
			, _idevento
			, _codprop
			, _ore
			, _importo
			, _oldIdEvento
			, _oldCodProp 
			, vCoperturaOrarioTeorico
		);
		
		_retVal = globals.salvaEvento(params);
		if(_retVal)
		{
			canClose = true;
			globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
			globals.svy_mod_closeForm(event);
			
			if(forms.svy_nav_fr_openTabs.vOpenTabs[forms.svy_nav_fr_openTabs.vSelectedTab] == 'LEAF_VisualizzaCopertura')
			   forms.giorn_vista_mensile_pannello.preparaGiornaliera(idLav,anno,mese,globals.TipoGiornaliera.NORMALE,null,true,true);
			else
			{
			   forms.giorn_header.preparaGiornaliera();
			   globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
			}
			
			plugins.busy.unblock();
			
			if(dialogContinuation)
				dialogContinuation(_retVal);		
		}
		else
			throw new Error('Errore durante il salvataggio dell\'evento, riprovare o contattare il servizio di assistenza','Si è verificato un errore...');
	}
	catch(ex)
	{
		globals.ma_utl_showErrorDialog(ex.message,'Modifica evento');
	}
	finally
	{
		plugins.busy.unblock();	
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"94F0A87D-C636-485B-8F42-37096F72BE0F"}
 */
function annullaModificaEvento(event)
{	
	canClose = true;
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);

	_totOre = _totOre - _ore*100
}

/**
 * @return {Boolean}
 * @properties={typeid:24,uuid:"60D0036B-7617-421E-8C8A-62C893507725"}
 */
function validaModifica()
{
	if(_idevento != null 
	   && (_ore != null || vCoperturaOrarioTeorico))
		return true;
	
	return false;	
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"48A5F18C-B9A3-43DC-BEAE-A82219416228"}
*/
function onHide(event) 
{
	annullaModificaEvento(event);
}