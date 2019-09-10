/**
 * @type {Date}
 *
 *
 * @properties={typeid:35,uuid:"CE1FC1B7-F233-4E04-89EB-9E1906ADD5F0",variableType:93}
 */
var last_click_timestamp_squadrati = null;

/**
 * Mostra il menu contestuale per le squadrature
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"F21F966B-AA6F-47CA-AAB3-B6441F7279C7"}
 */
function apriPopupVistaMensileSquadrature(_event)
{	
	var _idGiornaliera = forms[_event.getFormName()].foundset.getSelectedRecord()['idgiornaliera'];
	var _idGiornalieraEventi = forms[_event.getFormName()].foundset.getSelectedRecord()[_event.getElementName()];
	var _idLavoratore = globals.getIdLavoratoreDaIdGiornaliera(_idGiornaliera);
	var _idDitta = globals.getDitta(_idLavoratore);
	var _giorno = globals.getGiornoDaIdGiornaliera(forms[_event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);
	var _giorni = [];
	for(var g = 1; g <= foundset.getSize(); g++)
	{
		_giorni.push(globals.getGiornoDaIdGiornaliera(forms[_event.getFormName()].foundset.getRecord(g)['idgiornaliera']));
	}
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	
	// Copincolla giornata
//	var copiaGiornataMenu = _popUpMenu.addMenuItem('Copia giornata', copiaGiornata);
//		copiaGiornataMenu.methodArguments = [foundset.getSelectedIndex() - globals.offsetGg];
//	var incollaGiornataMenu = _popUpMenu.addMenuItem('Incolla giornata', incollaGiornata);
//		incollaGiornataMenu.methodArguments = [vGiornataDaCopiare];
//		incollaGiornataMenu.enabled = vGiornataDaCopiare !== 0;
//	
//	_popUpMenu.addSeparator();
	
//		var _popUpMenuEventi = _popUpMenu.addMenu('Gestione eventi ');
		var _addEvento = _popUpMenu.addMenuItem('Aggiungi un evento ', aggiungiEventoDaMenuSquadrature);
		_addEvento.methodArguments = [_event,_idLavoratore,_giorno];
		var _editEvento = _popUpMenu.addMenuItem('Modifica l\'evento selezionato ', modificaEventoDaMenuSquadrature);
		_editEvento.methodArguments = [_event,_idLavoratore,_giorno];
		_editEvento.enabled = _idGiornalieraEventi != null ? true : false;
		var _delEvento = _popUpMenu.addMenuItem('Elimina l\'evento ', eliminaEventoDaMenuSquadrature);
		_delEvento.methodArguments = [_event,_idGiornalieraEventi,_idLavoratore,_giorno];
        _delEvento.enabled = _idGiornalieraEventi != null ? true : false;

        _popUpMenu.addSeparator();
			
//	    var _addEventoMultiplo = _popUpMenu.addMenuItem('Aggiungi un evento multiplo ', aggiungiEventoMultiploDaMenuSquadrature);
//			_addEventoMultiplo.methodArguments = [_event];
		var _cambiaEvento = _popUpMenu.addMenuItem('Cambia un evento ', cambiaEventoDaMenuSquadrature);
			_cambiaEvento.methodArguments = [_event];
			_cambiaEvento.enabled = _idGiornalieraEventi != null ? true : false;
		
		_popUpMenu.addSeparator();
		
		var isInterinale = globals.isInterinale(_idDitta);
	    var haOrologio = globals.haOrologio(isInterinale ? globals.getDittaRiferimento(_idDitta) : _idDitta) === 0;	// 0 - no timbrature
	    
	    if(haOrologio)
		{
			var _compila = _popUpMenu.addMenuItem('Compila i giorni selezionati ', compilaDalAlDaMenuSquadrature)
	            _compila.methodArguments = [_event]
	    }
		else
	    {
	        var _conteggia = _popUpMenu.addMenuItem('Conteggia i giorni selezionati ', conteggiaTimbratureDaMenuSquadrature)
		        _conteggia.methodArguments = [_event];
		}
	    
		var _riconteggiabili = _popUpMenu.addMenuItem('Rendi i giorni selezionati riconteggiabili', rendiGiorniRiconteggiabiliDaMenuSquadrature);
		    _riconteggiabili.methodArguments = [_event];    
		    
		if(_source != null)
		   _popUpMenu.show(_source)
}

/**
 * Gestisce la grafica della form
 *
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"9F4AFC32-76AA-4729-A2AD-2F5096E92E2A"}
 */
function onRenderSquadrature(event) 
{
	var recInd = event.getRecordIndex();
	var recRen = event.getRenderable();
	var recCol = event.getRecord();
	
	if(recInd % 2 != 0)
	{
		recRen.bgcolor = globals.Colors.ODD.background;
		recRen.fgcolor = globals.Colors.ODD.foreground;
	}
	else
	{
		recRen.bgcolor = globals.Colors.EVEN.background;
		recRen.fgcolor = globals.Colors.EVEN.foreground;
	}
	
	if (recCol != null)
	{
		recRen.enabled = true;

//		if (event.isRecordSelected())
//		{
//			recRen.bgcolor = '#abcdef';
//			recRen.fgcolor = globals.Colors.SELECTED.foreground;
//		}

		if (recCol['festivo']) 
		{
			recRen.bgcolor = globals.Colors.HOLYDAYS.background; // darker than sat/sun
			recRen.fgcolor = globals.Colors.HOLYDAYS.foreground; // white
		}

		if (recCol['squadrato'] == 1)
			recRen.fgcolor = 'red';
	}
}

/**
 * Effettua i controlli quando un campo viene selezionato con il click
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"06D4E8F0-038F-49CB-B777-8994CB576DF9"}
 */
function onFieldSelectionSquadrature(event) {
	
	var _timeStamp = event.getTimestamp();
	var _lastClickTimeStamp = forms[event.getFormName()].last_click_timestamp_squadrati;
	var _idLavoratore = globals.getIdLavoratoreDaIdGiornaliera(forms[event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);
	var _giorno = globals.getGiornoDaIdGiornaliera(forms[event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);	
		
	if(_timeStamp - _lastClickTimeStamp < globals.intervalForDblClk)
		modificaEventoSquadrature(event,_idLavoratore,_giorno);
		
	forms[event.getFormName()].last_click_timestamp_squadrati = _timeStamp;
	
}
 
/**
* Lancia l'operazione di aggiunta dalla selezione della voce di menu
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"28E00EC1-A7CB-4654-9C62-2E66A6088425"}
*/
function aggiungiEventoDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav,_giorno)
{
	var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
    aggiungiEventoSquadrature(_event,_idLav,_giorno,selectedTabIndex == 4 ? true : false);
}

/**
 * Lancia l'operazione di compilazione delle giornate selezionate
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"5C59446B-B9B7-422B-B681-15D77C5A524B"}
 */
function compilaDalAlDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
	var frmOpt = selectedTabIndex == 4 ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	
	// creazione oggetto array per raccolta dati 
	var objDipsParams = [];

	for(var l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
	{
		var arrGiorniSel = [];
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel} */
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
				arrGiorniSel.push(globals.getGiornoDaIdGiornaliera(frmSquadratureDip.foundset.getRecord(sq)['idgiornaliera']).getDate());
		}
		
		if(arrGiorniSel.length > 0)
			   objDipsParams.push({
                                     idlavoratore : frmOpt.arrDipSquadrati[l],
				                     giorni_selezionati : arrGiorniSel
			                        });
	}

	var retVal;
	var periodo = frmOpt.annoRif * 100 * frmOpt.meseRif;
	              
	for(var lg = 0; lg < objDipsParams.length; lg++)
	{
		retVal = false;
		var objDipParams = objDipsParams[lg];
				
		retVal = globals.compilaDalAlSingolo(objDipParams.idlavoratore,objDipParams.giorni_selezionati,true);
		if(retVal)
		{
			switch(selectedTabIndex)
			{
				case 3 :
					globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
						                                             globals.getAnnoDaPeriodo(periodo),
																	 globals.getMeseDaPeriodo(periodo));
					break;
				case 4 :
				    globals.aggiornaEventiGiornalieraDipendente(objDipParams.idlavoratore,
												                     globals.getAnnoDaPeriodo(periodo),
																	 globals.getMeseDaPeriodo(periodo));
					break;
				default:
					break;
			}
		}
		else
			globals.ma_utl_showWarningDialog('Errore la compilazione dei giorni per il dipendente ' + globals.getNominativo(objDipParams.idlavoratore),'Si è verificato un errore durante la compilazione');
		
	}
}

/**
 * Lancia l'operazione di conteggio delle giornate selezionate
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"2100AD92-FBD4-424D-A9FE-6500B7D45930"}
 */
function conteggiaTimbratureDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var _params = {
        processFunction: process_conteggia_squadrature,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: []
    };
	plugins.busy.block(_params);
}

/**
 * @properties={typeid:24,uuid:"AD103F6C-EBB9-45AB-884A-3DD9A6931339"}
 */
function process_conteggia_squadrature()
{
	try
	{
		var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab; 
		var frmOpt = selectedTabIndex == 4 ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
		
		// creazione oggetto array per raccolta dati 
		var objDipsParams = [];
	
		for(var l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
		{
			var arrGiorniSel = [];
			var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
			/** @type {RuntimeTabPanel} */
			var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
			var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
			for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
			{
				if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
					arrGiorniSel.push(parseInt(frmSquadratureDip.foundset.getRecord(sq)['giornomese'],10));
			}
			
			if(arrGiorniSel.length > 0)
				   objDipsParams.push({
	                                     idlavoratore : frmOpt.arrDipSquadrati[l],
					                     giorni_selezionati : arrGiorniSel
				                        });
		}
	
		var retVal;
		var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
		              
		for(var lg = 0; lg < objDipsParams.length; lg++)
		{
			retVal = false;
			var objDipParams = objDipsParams[lg];
					
			retVal = globals.conteggiaTimbratureSingoloDaMenu([objDipParams.idlavoratore]
					                                            ,objDipParams.giorni_selezionati
																,false
																,frmOpt.idditta
																,periodo
																,globals.TipoGiornaliera.NORMALE
																,false);
			if(retVal && retVal['returnValue'])
			{
				switch(selectedTabIndex)
				{
					case 3 :
						globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
							                                             globals.getAnnoDaPeriodo(periodo),
																		 globals.getMeseDaPeriodo(periodo));
						break;
					case 4 :
					    globals.aggiornaEventiGiornalieraDipendente(objDipParams.idlavoratore,
													                     globals.getAnnoDaPeriodo(periodo),
																		 globals.getMeseDaPeriodo(periodo));
						break;
					default:
						break;
				}
			}
			else
				globals.ma_utl_showWarningDialog('Errore la compilazione dei giorni per il dipendente ' + globals.getNominativo(objDipParams.idlavoratore),'Si è verificato un errore durante la compilazione');
			
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_conteggia_squadrature : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Rendi riconteggiabili le giornate selezionate
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"EC31B55B-BAF7-4B94-8BE5-44582453016B"}
 */
function rendiGiorniRiconteggiabiliDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
	var frmOpt = selectedTabIndex == 4 ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	
	// creazione oggetto array per raccolta dati 
	var objDipsParams = [];

	for(var l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
	{
		var arrGiorniSel = [];
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel} */
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
				arrGiorniSel.push(parseInt(frmSquadratureDip.foundset.getRecord(sq)['giornomese'],10));
		}
		
		if(arrGiorniSel.length > 0)
			   objDipsParams.push({
                                     idlavoratore : frmOpt.arrDipSquadrati[l],
				                     giorni_selezionati : arrGiorniSel
			                        });
	}

	var retVal;
	var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
	              
	for(var lg = 0; lg < objDipsParams.length; lg++)
	{
		retVal = false;
		var objDipParams = objDipsParams[lg];
				
		retVal = globals.rendiGiorniRiconteggiabili([objDipParams.idlavoratore]
		                                            ,objDipParams.giorni_selezionati
													,frmOpt.idditta
													,periodo
													,globals.TipoConnessione.CLIENTE);
		if(retVal)
		{
			switch(selectedTabIndex)
			{
				case 3 :
					globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
						                                             globals.getAnnoDaPeriodo(periodo),
																	 globals.getMeseDaPeriodo(periodo));
					break;
				case 4 :
				    globals.aggiornaEventiGiornalieraDipendente(objDipParams.idlavoratore,
												                     globals.getAnnoDaPeriodo(periodo),
																	 globals.getMeseDaPeriodo(periodo));
					break;
				default:
					break;
			}
		}
		else
			globals.ma_utl_showWarningDialog('Errore la compilazione dei giorni per il dipendente ' + globals.getNominativo(objDipParams.idlavoratore),'Si è verificato un errore durante la compilazione');
		
	}
}

/**
 * Apre la dialog per l'aggiunta del nuovo evento
 * 
 * @param {JSEvent} _event
 * @param {Number} _idLav
 * @param {Date} _giorno
 * @param {Boolean} [_daEventiSel]
 *
 * @properties={typeid:24,uuid:"3B09F1F0-B884-479C-A1B9-4ECC0FCCFD4F"}
 */
function aggiungiEventoSquadrature(_event,_idLav,_giorno,_daEventiSel)
{
	var frmOpt = _daEventiSel ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	var isCheckedGiorno = false;
	for(var l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
	{		
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel} */
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
			{
				isCheckedGiorno = true;
			    break;
			}
		}
		if(isCheckedGiorno)
			break;
	}
	
	if(!isCheckedGiorno)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un giorno di un dipendente!');
		return;
	}
		
	var _frm = forms.giorn_modifica_eventi_squadrature_dtl;
	    _frm._isInModifica = false;
	    _frm._idLav = _idLav;
	    _frm._periodo = _giorno.getFullYear()*100 + _giorno.getMonth() + 1;
	    _frm._giornoEvento = _giorno.getDate();
	    _frm._daEventiSel = _daEventiSel != null ? _daEventiSel : false;
	var _idGiornaliera = foundset['idgiornaliera'];
	    _frm._idGiornaliera = _idGiornaliera;
	var _totOre = globals.getTotOreGiornata(_idGiornaliera);
	var _totOreTeorico = parseFloat(foundset['orarioprevisto'])*100;
    
	_frm.inizializzaValoriEvento(-1,-1,'','','','',null,0,-1,'','',null,_frm._giornoEvento);
	//setta il valore delle ore lavorate
	_frm._totOre = _totOre;
	//setta il valore delle ore lavorabili teoriche
	_frm._totOreTeorico = _totOreTeorico;
	//sull'aggiunta di un evento il flag di copertura è sempre impostato ad 1 
	_frm.vCoperturaOrarioTeorico = true;
	//nel caso di aggiunta evento il campo valore è sempre non visibile
	_frm.elements.fld_mod_valore.visible = false;
	_frm.elements.lbl_mod_valore.visible = false;
	_frm._importo = 0;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
	globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Aggiungi il nuovo evento');
}

/**
*
* Lancia l'operazione di modifica dalla selezione della voce di menu
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"6AF22813-C853-43B6-9F4E-53E94859DC5E"}
*/
function modificaEventoDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav,_giorno)
{
	var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
    modificaEventoSquadrature(_event,_idLav,_giorno,selectedTabIndex == 4 ? true : false);
}

/**
 * Apre la form di modifica dell'evento selezionato
 * 
 * @param {JSEvent} _event
 * @param {Number} _idLav
 * @param {Date} _giorno
 * @param {Boolean} [_daEventiSel]
 *
 * @properties={typeid:24,uuid:"9DD1EFF2-457D-4DC3-ADF2-32D39CFB0B3A"}
 * @AllowToRunInFind
 */
function modificaEventoSquadrature(_event,_idLav,_giorno,_daEventiSel)
{
	var frmOpt = _daEventiSel ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	var isCheckedGiorno = false;
	for(var l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
	{		
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel} */
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
			{
				isCheckedGiorno = true;
			    break;
			}
		}
		if(isCheckedGiorno)
			break;
	}
	
	if(!isCheckedGiorno)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un giorno di un dipendente!');
		return;
	}
	
	databaseManager.setAutoSave(false);

	var _idGiornalieraEventi = foundset[_event.getElementName()];
	var _frm = forms.giorn_modifica_eventi_squadrature_dtl;
	    _frm._isInModifica = true;
	    _frm._idLav = _idLav;
	    _frm._periodo = _giorno.getFullYear()*100 + _giorno.getMonth() + 1;
	    _frm._giornoEvento = _giorno.getDate();
	    _frm._daEventiSel = _daEventiSel != null ? _daEventiSel : false;
	var _idGiornaliera = foundset['idgiornaliera'];
	    _frm._idGiornaliera = _idGiornaliera;
	var _totOre = globals.getTotOreGiornata(_idGiornaliera);
	var _totOreTeorico = parseFloat(foundset['orarioprevisto'])*100;
	var _fs = _frm.foundset;
	var _rows = -1;
	
    if(_idGiornalieraEventi != null)
    {
		//effettuiamo il rollback perchè il find sulla selezione delle proprietà
		//a volte blocca il find successivo
		databaseManager.revertEditedRecords(_fs);
		
		//cerchiamo nel foundset il record con il corrispondente idGiornalieraEventi
    	if(_fs.find()){
	 	
	    	_fs.idgiornalieraeventi = _idGiornalieraEventi;
		    _rows = _fs.search();
		
	    }
    	else
    	{
    		globals.ma_utl_showErrorDialog('Cannot go to find mode','Servoy error');
			return;
    	}
       
		//se è presente
	    if(_rows > 0)
	    {
	    	 //se in presenza di un evento relativo ad un certificato mostra la gestione dello storico
			 if(globals.needsCertificate(_fs.e2giornalieraeventi_to_e2eventi.ideventoclasse))
			    globals.showStorico(_fs.e2giornalieraeventi_to_e2eventi.ideventoclasse,
			    	                foundset.getSelectedIndex() - globals.offsetGg,
									forms.giorn_header.idlavoratore,
									forms.giorn_header.idditta);
			 //in presenza di un evento sospensivo mostra la gestione del periodo associato
//			 else if(_fs.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconperiodi)
//				 forms.giorn_eventi_sospensivi.showRiepilogoSospensivi(_fs.idevento,forms.giorn_header.idlavoratore,_giorno);
			 //altrimenti procedi con la gestione della modifica
			 else
		     {
		    	 var _descrizione = _fs.e2giornalieraeventi_to_eventiproprieta ?
		    	                    _fs.e2giornalieraeventi_to_eventiproprieta.descrizione : '';
		    	 //inizializza i valori dell'evento
		    	 _frm.inizializzaValoriEvento(_fs.idevento
		    		                          ,_fs.e2giornalieraeventi_to_e2eventi.ideventoclasse
											  ,_fs.e2giornalieraeventi_to_e2eventi.evento
											  ,_fs.e2giornalieraeventi_to_e2eventi.descriz
											  ,_fs.codiceproprieta ? _fs.codiceproprieta : ''
											  ,_descrizione
											  ,_fs.ore_effettive
											  ,_fs.valore
											  ,_fs.idevento
											  ,_fs.e2giornalieraeventi_to_e2eventi.evento
											  ,_fs.codiceproprieta ? _fs.codiceproprieta : ''
											  ,_fs.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassiproprieta.ideventoclasseproprieta
											  ,_giorno.getDate());
		    	 //setta il valore delle ore lavorate
		    	 _frm._totOre = _totOre;
		    	 //setta il valore delle ore lavorabili teoriche
		    	 _frm._totOreTeorico = _totOreTeorico;
		    	 //nel caso di modifica evento il campo valore è sempre visibile
		    	 _frm.elements.fld_mod_valore.visible = true;
		    	 _frm.elements.lbl_mod_valore.visible = true;
				
		    	 globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
		    	 globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Modifica l\'evento selezionato');

		     }
		
		}
	    //idgiornaliera presente ma record non trovato...(strano ma lo consideriamo) mostriamo la gestione dell'aggiunta evento
	    else
	    {		
	    	//inizializza i valori dell'evento
	    	_frm.inizializzaValoriEvento(-1,-1,'','','','',null,0,-1,'','', _frm._giornoEvento);
	    	//setta il valore delle ore lavorate
	        _frm._totOre = _totOre;
	    	//setta il valore delle ore lavorabili teoriche
	    	_frm._totOreTeorico = _totOreTeorico;
	    	
	    	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
		    globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Aggiungi il nuovo evento');
		}
	}
	//se non è presente (si è cliccato su una cella vuota...) mostriamo la gestione dell'aggiunta evento
    else
       	aggiungiEventoSquadrature(_event,_idLav,_giorno);
}

/**
 * Elimina l'evento selezionato
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idGiornEv
 * @param {Boolean} _daEventiSel
 *
 * @properties={typeid:24,uuid:"7B3D94A7-8CB6-4BDE-AC2D-D13150ADF79C"}
 * @AllowToRunInFind
 * @SuppressWarnings(wrongparameters)
 */
function eliminaEventoDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _idGiornEv, _daEventiSel) 
{
	var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
	var frmOpt = selectedTabIndex == 4 ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	var l;
	var sq;
	var isCheckedGiorno = false;
	for(l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
	{
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel} */
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
			{
				isCheckedGiorno = true;
			    break;
			}
		}
		if(isCheckedGiorno)
			break;
	}
	
	if(!isCheckedGiorno)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un giorno di un dipendente!');
		return;
	}
	
	selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
	
	/** @type {JSFoundSet<db:/ma_presenze/e2giornalieraeventi>} */
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_EVENTI);
	var msg = '';
	if (_idGiornEv) 
	{
		if (_fs.find()) 
		{
			_fs.idgiornalieraeventi = _idGiornEv;
			if (_fs.search()) 
			{
				/** @type {JSRecord<db:/ma_presenze/e2giornalieraeventi>} */
				var _rec = _fs.getSelectedRecord();
				var _ideventoclasse = _rec.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.ideventoclasse;
				
				msg = "Procedere con l'eliminazione dell\'evento " + _rec.e2giornalieraeventi_to_e2eventi.evento + " per i giorni selezionati ?";

				var answer = globals.ma_utl_showYesNoQuestion(msg, "Elimina eventi");

				if (answer) 
				{
					// se è un evento derivante dalla gestione eventi lunghi, viene gestito con lo storico
					if (globals.needsCertificate(_ideventoclasse))
					{
						globals.ma_utl_showWarningDialog('L\'evento è gestito tramite la gestione dei certificati, utilizzare la giornaliera standard','Elimina eventi')
						return;
					}
					// in presenza di un evento sospensivo passa dalla gestione eventi anche per l'eliminazione
					//	    	else if(_fs.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconperiodi)
					//	    	{
					//	    		forms.giorn_eventi_sospensivi.showRiepilogoSospensivi(_fs.idevento,forms.giorn_header.idlavoratore,_arrGiorni[0]);
					//	    	    return;
					//	    	}
				
					frmOpt = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab == 4 ?
							     forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
					
					// creazione oggetto per raccolta dati 
					var objDipsParams = {
						                 lavoratori_giorni : [],
										 idevento : _rec.idevento,
										 ore : 0,
										 proprieta : _rec.codiceproprieta,
										 importo : 0,
										 copertura_teorico : false
							            };
	
					for(l = (frmOpt.currPage - 1) * frmOpt.dipPerPage; l < Math.min(frmOpt.currPage *  frmOpt.dipPerPage,frmOpt.arrDipSquadrati.length); l++)
					{
						/** @type Array<Number>*/
						var arrGiorniSel = [];
						var frmDipSquadrato_l = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
						/** @type {RuntimeTabPanel} */
						var tab_l = frmDipSquadrato_l.elements['tab_squadrati_dip'];
						var frmSquadratureDip_l = forms[tab_l.getTabFormNameAt(1)];
						for(sq = 1; sq <= frmSquadratureDip_l.foundset.getSize(); sq++)
						{
							if(frmSquadratureDip_l.foundset.getRecord(sq)['checked'])
								arrGiorniSel.push(globals.getGiornoDaIdGiornaliera(frmSquadratureDip_l.foundset.getRecord(sq)['idgiornaliera']).getDate());
						}
						
						if(arrGiorniSel.length > 0)
							   objDipsParams.lavoratori_giorni.push({
								                                     idlavoratore : frmOpt.arrDipSquadrati[l],
												                     giorni_selezionati : arrGiorniSel
											                        });
					}
	
					var retVal;
					var periodo = _rec.e2giornalieraeventi_to_e2giornaliera.giorno.getFullYear() * 100 + 
					              _rec.e2giornalieraeventi_to_e2giornaliera.giorno.getMonth() + 1;
					              
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
						retVal = globals.eliminaEvento(evParams);
						if(retVal)
						{
							switch(selectedTabIndex)
							{
								case 3:
											globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
												                                             globals.getAnnoDaPeriodo(periodo),
																							 globals.getMeseDaPeriodo(periodo));
											break;
								case 4:
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
				}
				else
					return;
			}
			else
				globals.ma_utl_showWarningDialog('Errore durante il recupero dell\' evento selezionato','Elimina evento da squadrature');
		}
	}
	else
		globals.ma_utl_showWarningDialog('Nessun evento selezionato per l\'eliminazione','Elimina evento dasquadrature');
}

/**
* Richiama la funzionalità di aggiunta evento multiplo
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
* @properties={typeid:24,uuid:"C65020A2-B0F7-456D-A3FD-9E2F94D888B4"}
*/
function aggiungiEventoMultiploDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    aggiungiEventoMultiploSquadrature(_event);
}

/**
* Richiama la funzionalità di cambio evento
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
* @properties={typeid:24,uuid:"37D9F4CB-B765-437B-A7FA-E2ED7AB3800E"}
*/
function cambiaEventoDaMenuSquadrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    cambiaEventoSquadrature(_event);
}

/**
 * Apre la form per la gestione dell'aggiunta di un evento su più giorni per più dipendenti
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"60B5765E-BA93-4619-95E8-3493C725649A"}
 */
function aggiungiEventoMultiploSquadrature(event)
{
//	var frmOpt = forms.giorn_list_squadrati_ditta;
//	var idDitta = frmOpt.idditta;
//	var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
	
//	globals.ma_utl_showWarningDialog('NB. Verranno visualizzati tutti gli eventi possibili, è ancora in realizzazione il filtro per ditta');

// TODO filtraggio eventi selezionabili per  la ditta nel periodo
//	var _idGiornalieraEventi = foundset[event.getElementName()];
//  globals.FiltraEventiSelezionabiliDittaPeriodo(idDitta,periodo);
	
	// visualizza maschera inserimento evento, solo per dipendenti della schermata, indipendenza dai giorni : quelli li trovo dalla selezione 
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.giorn_list_squadrati_evento_multiplo.controller.getName());
	globals.ma_utl_showFormInDialog(forms.giorn_list_squadrati_evento_multiplo.controller.getName(),'Aggiungi un evento multiplo');
}

/**
 * Apre la form per la gestione del cambio di un evento su più giorni per più dipendenti
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"748BB6D8-291A-4337-91E5-D2023C7CBAE4"}
 * @AllowToRunInFind
 */
function cambiaEventoSquadrature(event)
{
	var selectedTabIndex = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab;
	var frmOpt = selectedTabIndex == 4 ? forms.giorn_list_eventi_sel_ditta : forms.giorn_list_squadrati_ditta;
	var idDitta = frmOpt.idditta;
	var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
	
	var formObj = forms.giorn_list_squadrati_cambia_evento;
	formObj.vIdDitta = idDitta;
	formObj.vPeriodo = periodo;
	formObj.vDateFrom = frmOpt.chkLimitaDal && frmOpt.limitaDal ? frmOpt.limitaDal : globals.getFirstDatePeriodo(periodo);
	formObj.vDateTo = frmOpt.chkLimitaDal && frmOpt.limitaAl ? frmOpt.limitaAl : globals.getLastDatePeriodo(periodo);
		
	var dipendentiFormName = forms.giorn_cambiaevento_dipendenti.controller.getName();
	var dipendentiForm = globals.ma_utl_addMultipleSelection(dipendentiFormName);
	
//	if(forms.giorn_header.idlavoratore)
//	{
		var dipendentiFs = forms[dipendentiForm.name].foundset;
		if(dipendentiFs.find())
		{
			dipendentiFs.idlavoratore = frmOpt.arrDipSquadrati;
			dipendentiFs.search();
		}
		//			dipendentiFs.loadRecords(fs);
//			
//		if(dipendentiFs.find())
//		{
//			dipendentiFs['idlavoratore'] = forms.giorn_header.idlavoratore;
//			dipendentiFs.search();
//			
//			var dipendentiFsUpdater = databaseManager.getFoundSetUpdater(dipendentiFs);
//			dipendentiFsUpdater.setColumn('checked', 1);
//			dipendentiFsUpdater.performUpdate();
//			dipendentiFs.loadAllRecords();
//		}		
//	}
	
	// Sort the foundset
	dipendentiFs.sort(function (x,y){
		if(x['lavoratori_to_persone.nominativo'] > y['lavoratori_to_persone.nominativo'])
			return 1;
		else
			return -1;
			
	});
	
	// Set the tab with the modified form
	formObj.elements.dipendenti_tabless.addTab(dipendentiForm.name);
	
	globals.ma_utl_showFormInDialog(formObj.controller.getName(), 'Cambia evento');
}

/**
 * Filtra i dipendenti correntemente visualizzati
 * 
 * @param {JSFoundSet<db:/ma_anagrafiche/lavoratori>} fs
 *
 * @properties={typeid:24,uuid:"DF7D0BD1-BCFD-4D71-82C5-BC0C72291AB4"}
 * @AllowToRunInFind
 */
function FiltraLavoratoriSquadratiCorrenti(fs)
{
	var frmOpt = forms.giorn_list_squadrati_ditta;
	var page = frmOpt.currPage;
	var arrDipCorrenti = [];
	for(var d = (page - 1) * 5; d < 5; d++)
		arrDipCorrenti.push(frmOpt.arrDipSquadrati[d]);
	
	if(fs.find())
	{
		fs.idlavoratore = arrDipCorrenti;
		fs.search();
	}
	
	return fs;
}
/**
 * Aggiorna la selezione/deselezione dei giorni nelle form di ciascun dipendente
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5165C947-5AC0-469A-850F-29487FA35E42"}
 */
function onActionSelezionaTuttiIGiorni(event) 
{
	var check = 1;
	for(var r = 1; r <= foundset.getSize(); r++)
	{
	    if(foundset.getRecord(r)['checked'] == 1)
	    {
	    	check = 0;
	    	break;
	    }
	}
	
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset);
	fsUpdater.setColumn('checked', check);
	fsUpdater.performUpdate();
}
