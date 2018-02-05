/**
 * @properties={typeid:35,uuid:"EAD92854-3D11-4EA1-8E5E-0D9340CDF2AB",variableType:-4}
 */
var _idLav = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4F84BC16-4156-4CBF-A083-21971A42418D"}
 */
var _giorno = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7F0FC08A-E688-4965-8013-78C97EFF146D"}
 */
var _contFormName = '';


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0665EF3C-470E-42FB-A506-0CEF2DCE035F"}
 */
function confermaModificaEvento(event)
{
	// verifica dei dati inseriti
		if(!validaModifica())
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('Controllare i valori inseriti prima di poter proseguire','Conferma modifica evento');
			canClose = false;
			return;
		}
		
		canClose = true;
		
		var params = {
	        processFunction: process_modifica_evento_anomalie,
	        message: '', 
	        opacity: 0.5,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,25',
	        processArgs: [event]
	    };
		plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"AABFB76E-E58A-40C3-B9CF-7BA3347779E7"}
 */
function process_modifica_evento_anomalie(event)
{
		/** @type {Number} */
		var _periodo = globals.getPeriodo();
		
		/** @type {Array<Number>}*/
		var _arrDip = [_idLav]; 
		var params;
		var _retVal;
		
		// se cambia un evento il dipendente dovrà essere (ri)chiuso in fase di consolidamento
		scopes.giornaliera.cancellaChiusuraDipPerOperazione(_arrDip,globals.getDitta(_idLav));
		
		//se è flaggato il valore di copertura orario il numero di ore da inserire è pari al numero di ore dell'orario standard	
	    if(vCoperturaOrarioTeorico)
	    	_ore = _totOreTeorico;
		if(_ore == null)
			_ore = 0.00;
			
		//se le ore inserite sono riferite ad un evento ordinario,festivo o sostitutivo non sospensivo
		//e superano quelle utilizzabili viene segnalato all'utente il superamento dell'orario teorico	
		//a meno che ci sia il flag nella copertura dell'orario teorico
		if(!vCoperturaOrarioTeorico)
		{
			var _message = 'Le ore inserite superano l\'orario previsto per questa giornata.<br/>Inserire solo fino a concorrenza dell\'orario teorico?';
		    var _response = false;
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
		
		/** @type {Array<Number>} */
		var giorniSelezionati = [parseInt(_giorno,10)]; 
		
		params = globals.inizializzaParametriEvento(globals.getDitta(_idLav)
			                                        ,_periodo
													,0
													,giorniSelezionati
													,globals.TipoGiornaliera.NORMALE
													,globals.TipoConnessione.CLIENTE
													,_arrDip
													,_idevento
													,_codprop
													,_ore
													,_importo
													,_oldIdEvento
													,_oldCodProp
													,vCoperturaOrarioTeorico);	
	  
		_retVal = globals.salvaEvento(params);
			
		if(_retVal)
		{
			canClose = true;
			globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
			globals.svy_mod_closeForm(event);
			
		//TODO aggiornamento squadrature lavoratore
		//	globals.aggiornaSquadratureGiornalieraDipendente(_idLav,yy,MM,[dsSquadrature])
						
		}
		else
			globals.svy_mod_dialogs_global_showErrorDialog('Errore durante il salvataggio dell\'evento','Si è verificato un errore...','Chiudi');

		plugins.busy.unblock();
}
