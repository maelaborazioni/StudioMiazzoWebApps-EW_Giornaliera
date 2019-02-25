/**
 * @properties={typeid:24,uuid:"7D193153-8BD1-4142-BF0F-F523F80F8109"}
 */
function getButtonObject()
{
	var btnObj = _super.getButtonObject();

	btnObj.btn_new = { visible: false };
	btnObj.btn_edit = { visible: false };
	btnObj.btn_delete = { visible: false };
	btnObj.btn_duplicate = { visible: false };
	return btnObj;
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 * @param {Boolean} [_soloCartolina]
 * 
 * @properties={typeid:24,uuid:"783B6783-7F4E-4D9B-9AA4-1DC7F3B67868"}
 * @AllowToRunInFind
 */
function onRecordSelection(event, _form,_soloCartolina)
{
	_super.onRecordSelection(event, _form);
	 
	// se la selezione proviene dalla form header delle commesse, salta il disegno della giornaliera/cartolina
	if(event.getFormName() != 'giorn_header')
		return;
	
	globals._arrIdEvSelezionabili = null;
}

/**
 * Procedura che costruisce e visualizza nella parte inferiore la vista mensile, 
 * il resoconto delle timbrature e delle voci per il lavoratore selezionato nella parte superiore
 * 
 * @param {Boolean} [useCache] defaults to false
 * @param {Number} [indexToUpdate] defaults to all
 * @param {Boolean} [soloCartolina]
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"62D9783D-CBF2-40B0-A349-D6EE0BC4E265"}
 * 
 * @AllowToRunInFind
 * @SuppressWarnings(wrongparameters)
 */
function preparaGiornaliera(useCache, indexToUpdate, soloCartolina, forzaRidisegno)
{
	var frm = forms.svy_nav_fr_openTabs;
	if (frm.vSelectedTab != null && globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]]) 
	{
		_params = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]];
		/** @type {Number}*/
		var anno = _params['anno'];
		/** @type {Number}*/
		var mese = _params['mese'];
		var firstIdLavoratore = null;
		
		if(idlavoratore == null)
		{
			if(soloCartolina)
				firstIdLavoratore = forms.giorn_cart_header.idlavoratore;
			else
			{
				var arrIdLavoratori = globals.getLavoratoriDittaDalAl([_params['idditta']],new Date(anno,mese - 1,1),new Date(anno,mese,1));
				if(arrIdLavoratori.length > 0)
				   firstIdLavoratore = arrIdLavoratori[0];
			}
		}
		
		switch (_params['selected_tab']) 
		{
			case 1:
				if(soloCartolina == true)
				{
					forms.giorn_mostra_timbr_cartolina.is_dirty = forms.giorn_mostra_timbr_cartolina.is_dirty || !useCache;
					forms.giorn_mostra_timbr_cartolina.preparaTimbratura
					(
						anno
						, mese
						, idlavoratore || firstIdLavoratore
						, soloCartolina
						, indexToUpdate || null
						, null
						, true
					);
					forms.giorn_mostra_timbr_cartolina.clearSelection();
				}
				
				break;
			case 2:
				if(soloCartolina == true)
				{
					forms.giorn_vista_mensile_dipendente.preparaGiornaliera(
						idlavoratore  || firstIdLavoratore
						,anno
						,mese
						,globals.TipoGiornaliera.NORMALE
						,indexToUpdate
						,false
						,forzaRidisegno
						,true);
				}
				else
				{
					forms.giorn_vista_mensile.is_dirty = forms.giorn_vista_mensile.is_dirty || !useCache;
					forms.giorn_vista_mensile.preparaGiornaliera
					(
						  idlavoratore || firstIdLavoratore
						, anno
						, mese
						, forms.giorn_vista_mensile._tipoGiornaliera
						, indexToUpdate || null
						, null
						, forzaRidisegno
					);
					forms.giorn_vista_mensile.clearSelection();
					globals.aggiornaIntestazioni();
				}
				break;

			case 3:
				forms.giorn_mostra_timbr.is_dirty = forms.giorn_mostra_timbr.is_dirty || !useCache;
				forms.giorn_mostra_timbr.preparaTimbratura
				(
					anno
					,mese
					, idlavoratore || firstIdLavoratore
					, soloCartolina
					, indexToUpdate || null
					, forzaRidisegno);
				forms.giorn_mostra_timbr.clearSelection();
				globals.aggiornaIntestazioni();

				break;
		}
	}
}

/**
 * @properties={typeid:24,uuid:"F5977F8A-90B8-476C-B371-B9C1139D7BB6"}
 */
function preparaCartolinaDipendente()
{
	var frm = forms.svy_nav_fr_openTabs;
	if (frm.vSelectedTab != null && globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]]) 
	{
		globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = [];
		var anno = globals.getAnno();
		var mese = globals.getMese();
		forms.giorn_mostra_timbr_cartolina.preparaTimbratura(anno,
			                                                 mese,
															 forms.giorn_cart_header.idlavoratore,
															 true);
	}
}

/**
 * Filtra i lavoratori che hanno avuto presenze e quindi una giornaliera 
 * nel periodo richiesto
 * 
 * @param {JSFoundset} _fs
 * 
 * @return {JSFoundset}
 *
 * @properties={typeid:24,uuid:"6E4D9366-CD23-4688-A9E9-365DA3A60C9E"}
 */
function FiltraAnagraficaLavoratoriGiorn(_fs) 
{
	var filters = foundset.getFoundSetFilterParams();	
	for (var i = 0; i < filters.length; i++)
		_fs.addFoundSetFilterParam(filters[i][1], filters[i][2], filters[i][3], filters[i][4]);
		
	return _fs;
}

/** 
 * @param event
 *
 * @properties={typeid:24,uuid:"583F879E-BD35-430D-B006-8CC777C5781A"}
 */
function onHide(event)
{
	return _super.onHide(event)
}

/**
 * Cambia la ditta selezionata e ricalcola la giornaliera
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B4418762-9208-44EF-9D71-BCC1F487440B"}
 */
function onActionBtnCambiaDitta(event)
{
	companyId = null;
	
	globals._showLkp(event, 'LEAF_Lkp_Ditte', 'companyId', null, null, null, true);
	if(companyId)
	{
		globals.ricalcolaGiornaliera(globals.toDate(globals.getPeriodo())
			                         , companyId
									 , null
									 , null);
	}
}

/** *
 * @param _firstShow
 * @param _event
 * @param {Boolean} _soloCartolina
 * 
 * @properties={typeid:24,uuid:"B280BC41-F3A3-4A8D-B99B-84F2B876C70C"}
 */
function onShowForm(_firstShow, _event,_soloCartolina) {
	
	_super.onShowForm(_firstShow, _event, _soloCartolina);
	
	plugins.busy.prepare();
	
	if(!_soloCartolina)
	{
		if(lavoratori_to_ditte.tipologia == globals.Tipologia.ESTERNA)
		{
			elements.nominativo.visible = false;
			elements.nominativo_esterni.visible = true;
		}
		else
		{
		    elements.nominativo.visible = true;
	  	    elements.nominativo_esterni.visible = false;
		}
	}
	
	/** @type {RuntimeTabPanel}*/
	var tabElements = null;
	//le ditte che non timbrano non hanno il tab di Mostra timbrature 
    var _haOrologio = null;
    
	if(_event.getFormName() == 'comm_lav_header_dtl') 
	{
		tabElements = forms['Commesse_Lavoratore_tab'].elements['tabs'];
	    _haOrologio = globals.haOrologio(forms['comm_lav_header_dtl'].idditta);
	    
	    if(!_haOrologio)
	    	tabElements.removeTabAt(2);
	}
	else
	{
		if(_soloCartolina)
		{
			preparaCartolinaDipendente();
			return;
		}
				
		//in caso di connessione di tipo cliente il tab delle voci non è visibile
		if(globals.isCliente())
		{
			tabElements = forms['LEAF_Giornaliera_tab'].elements['tabs'];
			_haOrologio = globals.haOrologio(forms.giorn_header.idditta);
			
			tabElements.removeTabAt(4);
		
			if(!_haOrologio)
			{
				if(tabElements.getMaxTabIndex() === 3)
					tabElements.removeTabAt(3);
				
			}
			else
			{	
				// passando da una situazione senza timbrature ad una con timbrature va riaggiunto il tab!
				if(!(tabElements.getMaxTabIndex() === 3))
					tabElements.addTab('giorn_mostra_timbr','LEAF_GI_MostraTimbr','Mostra timbrature',
		                'Mostra timbrature',null,null,'lavoratori_to_e2timbratura',2);
				
			}
		}
		else
		{
			if(!_haOrologio)
			{
				if(tabElements.getMaxTabIndex() === 4)
					tabElements.removeTabAt(3);
			}else
			{	
				// passando da una situazione senza timbrature ad una con timbrature va riaggiunto il tab!
				if(!(tabElements.getMaxTabIndex() === 4))
					tabElements.addTab('giorn_mostra_timbr','LEAF_GI_MostraTimbr','Mostra timbrature',
		                'Mostra timbrature',null,null,'lavoratori_to_e2timbratura',2);
			}
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AFDE2AF2-50A5-492A-904A-C03A7B8F0A8C"}
 */
function apriPopupUtilita(event) {
	
    var source = event.getSource();
	
	var popUpMenu = plugins.window.createPopupMenu();
	
	// solamente le ditte che timbrano hanno la gestione timbrature
	if (globals.haOrologio(idditta))
	{
		var cercaBadge = popUpMenu.addMenuItem('Cerca badge', apriCercaBadge);
		cercaBadge.methodArguments = [event];
		
		popUpMenu.addSeparator();
	}
	
	var modDecorrenze = popUpMenu.addMenuItem('Modifica multipla decorrenze',globals.apriModificaMultiplaDecorrenze);
	    modDecorrenze.methodArguments = [event,idditta];
	    
	    popUpMenu.addSeparator();
	
	var noteAnagrafiche = popUpMenu.addMenuItem('Note anagrafiche',apriNoteAnagrafiche);
	    noteAnagrafiche.methodArguments = [event];
	if(!globals.isCliente())
	{
	    var noteDitta = popUpMenu.addMenuItem('Note ditta',apriNoteDitta);
	    noteDitta.methodArguments = [event];
	}
	var noteMensili = popUpMenu.addMenuItem('Note mensili',apriNoteMensili);
	    noteMensili.methodArguments = [event];

	    
	if(source != null)
		popUpMenu.show(elements.btn_utilita.getLocationX() + elements.btn_utilita.getWidth() + 100,
			           elements.btn_utilita.getLocationY() + elements.btn_utilita.getHeight() + 100);
}

/**
* @AllowToRunInFind 
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
*
* @properties={typeid:24,uuid:"A0EDBBF5-0608-4EF3-A8A8-6D28FB2BB203"}
*/
function apriGestioneRatei(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	forms.giorn_ratei_gestione_tab.inizializzaParametriGestioneRatei(forms.giorn_header.idditta,
		                                                             forms.giorn_header.idlavoratore,
		                                                             globals.getMese(),
																	 globals.getAnno());
	globals.ma_utl_showFormInDialog('giorn_ratei_gestione_tab','Gestione ratei');
	
}

/**
 * @AllowToRunInFind 
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"98562BDD-C827-4B13-8A43-E75A9EFEAA9B"}
 */
function apriNoteAnagrafiche(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event) {
	
	var _frm = forms.giorn_utils_note_anag;
	var _fs = _frm.foundset;
	
	if(_fs.find())
	{
		_fs.idlavoratore = forms.giorn_header.idlavoratore;
		_fs.search();		
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
	databaseManager.startTransaction();
    globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Gestione note anagrafiche');
		
}


/**
 * @AllowToRunInFind
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"B8149A16-D523-46DB-8763-3ABDA4410B52"}
 */
function apriNoteMensili(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event) {
	
	/** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>}*/
	var fsGiornaliera = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	var _periodo = globals.getPeriodo();
	var _assunzione = forms.giorn_header.assunzione;
	var _idGiorn = -1;
	
	if(!scopes.giornaliera.isPrimaAttivazione(idditta,_periodo))
	{
		var primoGgPeriodo = new Date(globals.getAnno(),globals.getMese() - 1,1);
		if(primoGgPeriodo < _assunzione)
			primoGgPeriodo = _assunzione;
		if(fsGiornaliera.find())
		{
			fsGiornaliera.iddip = idlavoratore;
			fsGiornaliera.giorno = '=' + globals.dateFormat(primoGgPeriodo,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
			if(fsGiornaliera.search())
				_idGiorn = fsGiornaliera.idgiornaliera;
		}
	}
	
//	var _idGiornStr = 'SELECT dbo.F_Lav_idGiornaliera(?,?,?)';
//		
//	var _idGiornArr = [forms.giorn_header.idlavoratore,_periodo,_assunzioneFormat];	
//	var _dsGiorn = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_idGiornStr,_idGiornArr,100);
//	var _idGiorn = _dsGiorn.getValue(1,1);
	var _frm = forms.giorn_utils_note_mensili;
	var _fs = _frm.foundset;
		
	//inizializziamo le variabili della form
	_frm._noteAuto = '';
	_frm._noteMese = '';
	_frm._noteIdGiorn = _idGiorn;
	
	//se esistono note relative all'idgiornaliera ottenuto recuperiamo i valori della form 
	if (_idGiorn > -1) {

		if (_fs.find()) {
			_fs.idgiornaliera = _idGiorn;
			var _recNum = _fs.search();
			if (_recNum > 0) {
				_frm._noteIns = true;
				for (var i = 1; i <= _recNum; i++) {
					var _rec = _fs.getRecord(i);
					//note generate automaticamente
					if (_rec.origine == 0)
						_frm._noteAuto == '' ? _frm._noteAuto = _rec.info :
					                                 _frm._noteAuto = _frm._noteAuto + '\n' + _rec.info;
					//note mensili
					else if (_rec.origine == 1)
						_frm._noteMese = _rec.info;
										
				}
				if(_frm._noteAuto != '')
				   _frm._noteAuto = _frm._noteAuto;
			}
			else
			   _frm._noteIns = false;
		}
	}
	else
	{
		globals.ma_utl_showWarningDialog('Si è verificato un errore nel recupero delle note mensili.<br/> Se il periodo non è ancora attivato, procedere con l\'attivazione. In caso di periodo già attivato, comunicare al servizio di assistenza il lavoratore ed il periodo di inserimento.','Gestione note mensili');
		return;
	}
	
	//poniamo la form pronta in inserimento/modifica
	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
	globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Gestione note mensili');
	
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"68C7F5F1-2110-45D8-A408-F33F32396735"}
 */
function apriNoteDitta(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event) {
	
	var _idGiornStr = 'SELECT dbo.F_Lav_idGiornaliera(?,?,?)'
	var _idGiornArr = [forms.giorn_header.idlavoratore,globals.getPeriodo(),utils.dateFormat(forms.giorn_header.assunzione,globals.ISO_DATEFORMAT)]	
	var _dsGiorn = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_idGiornStr,_idGiornArr,100)
	var _idGiorn = _dsGiorn.getValue(1,1)
    var _frm = forms.giorn_utils_note_ditta
	var _fsNoteDitta = _frm.foundset
	
	if(_fsNoteDitta.find())
	{
		_fsNoteDitta.idgiornaliera = _idGiorn;
		_fsNoteDitta.origine = 1;
		_fsNoteDitta.search();
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
	globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Gestione note ditta');
}


/**
 * @AllowToRunInFind 
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"BC575B3E-8F13-49AA-A44F-6F6DA71057EE"}
 */
function apriCercaBadge(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.ma_utl_showFormInDialog(forms.giorn_utils_cerca_badge.controller.getName(),'Ricerca badge');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C6B1E112-C70C-450D-8BEA-05F8663484C3"}
 * @AllowToRunInFind
 */
function showStorico(event) 
{
	if(globals._tipoConnessione == 0 
			|| _to_sec_user$user_id.flag_super_administrator)
	{
		var response = globals.ma_utl_showYesNoQuestion('Vuoi aprire la gestione dello storico dei certificati per il lavoratore?','Gestione storico certificati');
	    if(response)
	    {
	    	var frm = forms.storico_gestione;
	    	var fs = frm.foundset;
	    	if(fs.find())
	    	{
	    	   fs.idlavoratore = idlavoratore;
	    	   if(fs.search() > 0)
	    	   {
	    		  globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	    	      globals.ma_utl_showFormInDialog(frm.controller.getName()
	    		                                  ,'Gestione storico');
	    	   }
	    	}
	    }
	    //altrimenti viene visualizzato solamente l'id del lavoratore
	    else
	       globals.ma_utl_showInfoDialog('L\'identificativo del dipendente è : ' + idlavoratore.toString(),'Identificativo lavoratore');
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"16FD9D6F-999F-4594-AD51-D5151436E5DA"}
 */
function apriPopUpDitta(event) {
	
    globals.apriPopupAnaDitta(event,idditta);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B83D4E51-2C24-429A-A8D5-3B693B9129E6"}
 */
function apriPopUpLav(event) {
	
    globals.apriPopupAnaLav(event,idditta,idlavoratore,foundset);
}

/**
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"F6ADF269-118F-4156-BC61-D81BDED991BF"}
 */
function apriLkpElencoDipendenti(_event)
{
	var program;
	
	if(lavoratori_to_ditte.tipologia == 1)
    	program = 'AG_Lkp_LavoratoriEsterni';
	else
	    program = 'AG_Lkp_Lavoratori';
	
	globals.ma_utl_showLkpWindow({
		event : _event
		,lookup : program
		,methodToAddFoundsetFilter : 'FiltraAnagraficaLavoratoriGiorn'
		,methodToExecuteAfterSelection : (_event.getFormName() == 'comm_lav_header_dtl' ? 'CercaLavoratoreComm' : 'CercaLavoratoreGiorn')
		,allowInBrowse : true
	});
}

/** 
 * @param _event
 *
 * @properties={typeid:24,uuid:"D5FF5064-8988-4815-9892-31A7D8CFF376"}
 */
function dc_rec_next(_event)
{
	if(foundset.getSelectedIndex() == foundset.getSize())
	   globals.ma_utl_showInfoDialog("E\' stato raggiunto l\'ultimo dipendente.","Vai al dipendente successivo");
	else
	{
		var params = {
	        processFunction: process_next,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,25',
	        processArgs: [_event]
	    };
		plugins.busy.block(params);
	    
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DC60BAAE-098E-460F-949B-E194FFD6EC19"}
 */
function process_next(event)
{
	try
	{
		_super.dc_rec_next(event);
		preparaGiornaliera(true,null,false);//_soloCartolina);
	}
	catch(ex)
	{
		var msg = 'Metodo process_next : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/** *
 * @param _event
 *
 * @properties={typeid:24,uuid:"0A1100D4-A4E9-44D5-80A7-314F13018216"}
 */
function dc_rec_prev(_event) {
	
	if(foundset.getSelectedIndex() == 1)
	   globals.ma_utl_showInfoDialog("E\' stato raggiunto il primo dipendente.","Vai al dipendente precedente");
	else
	{
		var params = {
	        processFunction: process_prev,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,25',
	        processArgs: [_event]
	    };
		plugins.busy.block(params);
	}
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"6B5EB077-089E-45B3-9B88-1B648A5212FE"}
 */
function process_prev(event)
{
	try
	{
		 _super.dc_rec_prev(event);
		 preparaGiornaliera(true,null,false)//_soloCartolina);
	}
	catch(ex)
	{
		var msg = 'Metodo process_prev : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
*
* @param {JSEvent} _event
*
* @properties={typeid:24,uuid:"FA8B54DB-15E3-494D-8010-268808EAD189"}
*/
function dc_rec_first(_event) 
{
	if (foundset.getSelectedIndex() == 1)
		globals.ma_utl_showInfoDialog("E\' stato raggiunto il primo dipendente.", "Vai al dipendente precedente");
	else {
		var params = {
			processFunction: process_first,
			message: '',
			opacity: 0.2,
			paneColor: '#434343',
			textColor: '#EC1C24',
			showCancelButton: false,
			cancelButtonText: '',
			dialogName: 'This is the dialog',
			fontType: 'Arial,4,25',
			processArgs: [_event]
		};
		plugins.busy.block(params);
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _event
 *
 * @properties={typeid:24,uuid:"96FFA2BF-C8F1-4A32-96DF-BAEBA6F9295A"}
 */
function process_first(_event)
{
	try
	{
		_super.dc_rec_first(_event);
		preparaGiornaliera(true,null,false);//_soloCartolina);
	}
	catch(ex)
	{
		var msg = 'Metodo process_first : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
*
* @param {JSEvent} _event
*
* @properties={typeid:24,uuid:"6CB2F22F-ADE6-43DC-9043-135A2DB2231B"}
*/
function dc_rec_last(_event) 
{
	if (foundset.getSelectedIndex() == foundset.getSize())
		globals.ma_utl_showInfoDialog("E\' stato raggiunto l\'ultimo dipendente.", "Vai al dipendente successivo");
	else {
		var params = {
			processFunction: process_last,
			message: '',
			opacity: 0.2,
			paneColor: '#434343',
			textColor: '#EC1C24',
			showCancelButton: false,
			cancelButtonText: '',
			dialogName: 'This is the dialog',
			fontType: 'Arial,4,25',
			processArgs: [_event]
		};
		plugins.busy.block(params);
	}
}

/**
 * @param _event
 *
 * @properties={typeid:24,uuid:"ED3DBEDE-FE6C-41E4-98FA-52EC4B55E011"}
 */
function process_last(_event)
{
	try
	{
		_super.dc_rec_last(_event);
		preparaGiornaliera(true,null,false);//_soloCartolina);
	}
	catch(ex)
	{
		var msg = 'Metodo process_last : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * 
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"DF533D4A-0A1C-4F08-82A8-61B98B873469"}
 */
function CercaLavoratoreGiorn(_rec)
{
	if(_rec && _rec['idlavoratore'])
	{
		globals.lookup(_rec['idlavoratore'],'giorn_header');
	    preparaGiornaliera(true,null,false)//soloCartolina)
	}
	else
		globals.ma_utl_showWarningDialog('Dipendente non trovato','Cerca giornaliera del dipendente');
}

/**
 * 
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"21DAB6BC-0781-4BD9-932E-1F53DF6F754C"}
 */
function CercaLavoratoreComm(_rec)
{
	if(_rec && _rec['idlavoratore'])
	{
	   globals.lookup(_rec['idlavoratore'],'comm_lav_header_dtl');
	   preparaGiornaliera(true,null,false)//soloCartolina
	}
	else
       globals.ma_utl_showWarningDialog('Dipendente non trovato','Cerca situazione commesse del dipendente');
}