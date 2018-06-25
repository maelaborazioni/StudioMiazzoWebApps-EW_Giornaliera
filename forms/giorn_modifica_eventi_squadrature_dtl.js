/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"22C57E9F-903B-4CE4-B83A-728E00FF6133",variableType:8}
 */
var _idLav = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"2B2721FD-A4CE-4EF3-9FC6-500EB43B456D",variableType:8}
 */
var _periodo = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"34BF4DD1-0F7B-4203-8B68-74501451E5B2",variableType:-4}
 */
var _daEventiSel = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CDC33D88-1138-4A39-BC68-F0637ADD8440"}
 * @SuppressWarnings(wrongparameters)
 */
function confermaModificaEventoSquadrature(event) 
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
        processFunction: process_modifica_evento_squadrature,
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
 * @properties={typeid:24,uuid:"AB61242C-42FB-4ABD-ADFA-91EE07204B4E"}
 * @SuppressWarnings(wrongparameters)
 */
function process_modifica_evento_squadrature(event)
{
	var frmOpt = _daEventiSel ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	
	// creazione oggetto per raccolta dati 
	var objDipsParams = {
		                 lavoratori_giorni : [],
						 idevento : _idevento,
						 ore : _ore,
						 proprieta : _codprop,
						 importo : _importo,
						 copertura_teorico : vCoperturaOrarioTeorico
			            };

	for(var l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
	{
		var arrGiorniSel = [];
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel}*/
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
				arrGiorniSel.push(globals.getGiornoDaIdGiornaliera(frmSquadratureDip.foundset.getRecord(sq)['idgiornaliera']).getDate());
		}
		
		if(arrGiorniSel.length > 0)
			   objDipsParams.lavoratori_giorni.push({
				                                     idlavoratore : frmOpt.arrDipSquadrati[l],
								                     giorni_selezionati : arrGiorniSel
							                        });
	}

	var retVal;
	var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
	              
	for(var lg = 0; lg < objDipsParams.lavoratori_giorni.length; lg++)
	{
		retVal = false;
		var objDipParams = objDipsParams.lavoratori_giorni[lg];
		var evParams = globals.inizializzaParametriEvento(globals.getDitta(objDipParams.idlavoratore)
			                                              ,periodo
														  ,0
														  ,objDipParams.giorni_selezionati
														  ,globals.TipoGiornaliera.NORMALE
														  ,globals.TipoConnessione.CLIENTE
														  ,[objDipParams.idlavoratore]
														  ,objDipsParams.idevento
														  ,objDipsParams.proprieta
														  ,objDipsParams.ore
														  ,objDipsParams.importo
														  ,objDipsParams.idevento
														  ,objDipsParams.proprieta
														  ,objDipsParams.copertura_teorico);
		// se cambia un evento il dipendente dovrà essere (ri)chiuso in fase di consolidamento
		scopes.giornaliera.cancellaChiusuraDipPerOperazione(objDipParams.idlavoratore,globals.getDitta(objDipParams.idlavoratore),periodo);
		retVal = globals.salvaEvento(evParams);
		if(retVal)
		{
			switch(_daEventiSel)
			{
				case false:
							globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
								                                             globals.getAnnoDaPeriodo(periodo),
																			 globals.getMeseDaPeriodo(periodo));
							break;
				case true:
							globals.aggiornaEventiGiornalieraDipendente(objDipParams.idlavoratore,
													                    globals.getAnnoDaPeriodo(periodo),
																		globals.getMeseDaPeriodo(periodo));
			                break;
			    default:
			    	break;
			}
		}
		else
			globals.ma_utl_showWarningDialog('Errore durante il salvataggio dell\'evento','Si è verificato un errore durante l\'eliminazione');
		
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);

	plugins.busy.unblock();
	
// OLD code	
//	var params;
//	var _idDitta = globals.getDitta(_idLav);
//	var _arrDip = [_idLav];
//	var _retVal;
//	
//	// se cambia un evento il dipendente dovrà essere (ri)chiuso in fase di consolidamento
//	globals.cancellaChiusuraDipPerOperazione(_arrDip,_idDitta,_periodo);
//	
//	//se è flaggato il valore di copertura orario il numero di ore da inserire è pari al numero di ore dell'orario standard	
//    if(vCoperturaOrarioTeorico)
//    	_ore = _totOreTeorico;
//	if(_ore == null)
//		_ore = 0.00;
//		
//	//se le ore inserite sono riferite ad un evento ordinario,festivo o sostitutivo non sospensivo
//	//e superano quelle utilizzabili viene segnalato all'utente il superamento dell'orario teorico	
//	//a meno che ci sia il flag nella copertura dell'orario teorico
//	if(!vCoperturaOrarioTeorico)
//	{
//		var _message = '<html>Le ore inserite superano l\'orario previsto per questa giornata.<br/>Inserire solo fino a concorrenza dell\'orario teorico?</html>';
//	    var _response = false;
//		var _tipologiaEv = globals.getTipologiaEvento(_idevento);
//	    if(_tipologiaEv.tipo === globals.TipologiaEvento.SOSPENSIVO 
//	    		&& _tipologiaEv.scalo === true) 
//	    {
//	    	var _totOreSost;
//	    	
//	    	if(_isInModifica)
//	    		_totOreSost = globals.getTotOreSostitutiveGiorno(_idGiornaliera,_idevento);
//	    	else
//	    	    _totOreSost = globals.getTotOreSostitutiveGiorno(_idGiornaliera);
//	    	
//	    	if(_ore*100 > _totOreTeorico - _totOreSost)
//	    	{	
//	    	   _response = globals.ma_utl_showYesNoQuestion(_message,'Conferma inserimento');
//		
//	    	   if(_response)
//		          _ore = ((_totOreTeorico - _totOreSost)/100).toFixed(2);
//	    	}
//	    }
//	    else if(_tipologiaEv.tipo === globals.TipologiaEvento.ORDINARIO)
//	    {
//	    	var _totOreOrd;
//	    	
//	    	if(_isInModifica)
//	    	   _totOreOrd = globals.getTotOreOrdinarieGiorno(_idGiornaliera,_idevento);
//	    	else
//	    		_totOreOrd = globals.getTotOreOrdinarieGiorno(_idGiornaliera);	
//	    		
//	    	if(_ore*100 > _totOreTeorico - _totOreOrd)
//	    	{
//	    	   _response = globals.ma_utl_showYesNoQuestion(_message,'Conferma inserimento');
//		       
//	    	   if(_response)
//		          _ore = ((_totOreTeorico - _totOreOrd)/100).toFixed(2);
//	    	}
//	    }
//		    	    
//	}
//	
//	var giorniSelezionati = [_giornoEvento]; 
//	
//	params = globals.inizializzaParametriEvento(_idDitta,
//		                                        _periodo,
//												0,
//												giorniSelezionati,
//												globals.TipoGiornaliera.NORMALE,
//												globals._tipoConnessione,
//                                                _arrDip,
//												_idevento,
//												_codprop,
//												_ore,
//												_importo,
//												_oldIdEvento,
//												_oldCodProp,
//												vCoperturaOrarioTeorico);	
//  
//	_retVal = globals.salvaEvento(params);
//		
//	if(_retVal)
//	{
//		canClose = true;
//		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
//		globals.svy_mod_closeForm(event);
//		globals.aggiornaSquadratureGiornalieraDipendente(_idLav,
//			                                             globals.getAnnoDaPeriodo(_periodo),
//														 globals.getMeseDaPeriodo(_periodo));
//	}
//	else
//		globals.svy_mod_dialogs_global_showErrorDialog('Errore durante il salvataggio dell\'evento','Si è verificato un errore...','Chiudi');
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AA05E9F0-D376-4113-BC9E-8A52A43A92F9"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
	
	globals.FiltraEventiSelezionabili(_idLav,
                                      _periodo,
	                                  globals.TipoGiornaliera.NORMALE);
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6DADD8B7-EA55-4A9B-802B-7E3FD971DAEA"}
 */
function onDataChangeEventoSquadrature(oldValue, newValue, event)
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventi'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventi'].table_name);

	_oldIdEvento = _idevento;
	_oldIdPropCl = _idpropcl;
	_oldCodProp = _codprop;

	// Filtra gli eventi selezionabili
	_foundset.addFoundSetFilterParam('idevento','IN',globals._arrIdEvSelezionabili,'ftr_evSelezionabili');
	_foundset.addFoundSetFilterParam('evento', '=', newValue);
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {

		_idevento = _foundset['idevento'];
		_descevento = _foundset['descriz'];
		_ideventoclasse = _foundset['ideventoclasse'];
		
		if (globals.needsCertificate(_ideventoclasse)) {
			
			// Open the form to handle the correct type of certificate
			globals.svy_mod_closeForm(event);
			globals.showStorico(_ideventoclasse,
				                _giornoEvento,
								_idLav ? _idLav : forms.giorn_header.idlavoratore,
								_idLav ? globals.getDitta(_idLav) :	forms.giorn_header.idditta);
		
		}else
			AggiornaSelezioneEventoSquadrature(_foundset.getSelectedRecord(),event,_idLav);
		
	} else {
		_codevento = oldValue;
		showLkpAlberoEventi(event);
	}

	return true;
}

/**
 * @param {JSRecord<db:/ma_presenze/e2eventi>} rec
 * @param {JSEvent} event
 * @param {Number} idLavoratore
 *
 * @properties={typeid:24,uuid:"57094C76-6AD1-48FE-8D93-E2F0B869A6D0"}
 */
function AggiornaSelezioneEventoSquadrature(rec,event,idLavoratore)
{
	_idevento = rec['idevento'];
	_ideventoclasse = rec['ideventoclasse'];
	
	var response = controllaInformativiStatistici(idLavoratore,_periodo,_giornoEvento);
	
	response = gestioneInformativiStatistici(response);
	
	if(response)
	{
		if (globals.needsCertificate(_ideventoclasse)) 
        {
        	globals.showStorico(_ideventoclasse, _giornoEvento, forms.giorn_header.idlavoratore, forms.giorn_header.idditta);
        	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
				
        	if(event)
				globals.svy_mod_closeForm(event);
		}
		else
		{
			AggiornaProprietaEvento(rec);
			controller.focusField(elements.fld_mod_ore.getName(),false);
		}
	}
}

/**
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 *
 * @properties={typeid:24,uuid:"8760703B-FA83-4818-973E-81992386FBC8"}
 * @AllowToRunInFind
 */
function AggiornaProprietaEventoSquadrature(_rec) 
{
	_idevento = _rec['idevento'];
	_codevento = _rec['evento'];
	_descevento = _rec['descriz'];
	_ideventoclasse = _rec['ideventoclasse'];

	if (_rec.e2eventi_to_e2eventiclassi && (_rec.e2eventi_to_e2eventiclassi.tipo == 'O'
		                                      || _rec.e2eventi_to_e2eventiclassi.tipo == 'S'))
	{
		if(!_isInModifica)
		   vCoperturaOrarioTeorico = true;
		
		elements.chk_copertura.enabled = true;
		elements.lbl_copertura.enabled = true;
		
	}
	else
	{
		if(!_isInModifica)
		   vCoperturaOrarioTeorico = false;
		
		elements.chk_copertura.enabled = false;
		elements.lbl_copertura.enabled = false;
	}

	// Seleziona la prima proprietà disponibile per l'evento selezionato nel giorno selezionato
	FiltraProprietaSelezionabili(_idevento,_idLav,_periodo,_giornoEvento,globals.TipoGiornaliera.NORMALE);

	var proprietaFoundset = _rec.e2eventi_to_e2eventiclassiproprieta;

	if (proprietaFoundset.find()) 
	{
		proprietaFoundset.ideventoclasseproprieta = _arrIdPropSelezionabili;
		proprietaFoundset.search();

		if (proprietaFoundset && proprietaFoundset.getSize() > 0) 
		{
			if(_oldCodProp)
			{
			   var propCopyFoundset = proprietaFoundset.duplicateFoundSet();
			   if(propCopyFoundset.find())
			   {
				   propCopyFoundset.codiceproprieta = _oldCodProp;
				   if(propCopyFoundset.search() == 0)
				   {
					   _codprop = proprietaFoundset.codiceproprieta;
					   _descprop = proprietaFoundset.descrizione;   
				   }
			   }
			   else
			   {
				   _codprop = proprietaFoundset.codiceproprieta;
				   _descprop = proprietaFoundset.descrizione;
			   }
			   
			}
			else
			{
				_codprop = proprietaFoundset.codiceproprieta;
				_descprop = proprietaFoundset.descrizione;
			}
			abilitaProprieta(true);
		}
		else
		{
			_codprop = "";
			_descprop = "";
			
			abilitaProprieta(false);
		}
		
		globals.svy_nav_setFieldsColor(controller.getName(),globals.Status.EDIT);
	} 
	else
	{
		globals.ma_utl_showErrorDialog('Cannot go to find mode : proprieta', 'Servoy Error')
		_codprop = "";
		_descprop = "";
	}
}

/**
 * @param {Number} idEvento
 * 
 * @properties={typeid:24,uuid:"4F9EF55D-BFE7-4C5C-B42D-2E7A21FE088D"}
 * @AllowToRunInFind
 */
function confermaSelezioneEventoDaAlbero(idEvento)
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = idEvento;
    	eventiFs.search();
    	
    	if (globals.needsCertificate(eventiFs.ideventoclasse)) 
		{
		    globals.ma_utl_showWarningDialog('L\'evento è gestibile solo attraverso le certificazioni','Conferma selezione evento');
		    _codevento = '';
		    return;
		}
    	
    	if(eventiFs.e2eventi_to_e2eventiclassi.tipo == globals.TipoEvento.STATISTICO
    		|| eventiFs.e2eventi_to_e2eventiclassi.tipo == globals.TipoEvento.AGGIUNTIVO)
		{
			elements.chk_copertura.enabled = false;
			vCoperturaOrarioTeorico = 0;
		}
		else
		    elements.chk_copertura.enabled = true;
    	
    	AggiornaSelezioneEventoSquadrature(eventiFs.getRecord(1),new JSEvent,_idLav);
    	
    }	
  
}

/**
*
* @param {JSFoundset} _fs
*
* @properties={typeid:24,uuid:"76FA040C-9CF2-46DD-A0EE-1990493DC4AF"}
*/
function FiltraProprietaSquadrature(_fs)
{
	_fs.addFoundSetFilterParam('ideventoclasse','=',_ideventoclasse,'ftr_propSelezionabiliIdEventoClasse');
	_fs.addFoundSetFilterParam('idevento', '=', _idevento, 'ftr_propSelezionabiliIdEvento');
	
	return _fs;	
}