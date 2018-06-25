/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"A3700EEF-8CBC-4CD4-B170-392F7733132E"}
 */
function FiltraSediInstallazione(_fs){		
	
	_fs.addFoundSetFilterParam('idditta','=', _idditta)

	return _fs
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"61FDD9D8-9559-488F-86E1-8E221AC89142"}
 */
function FiltraGruppiLavoratori(_fs){		
	
	_fs.addFoundSetFilterParam('idDitta','=', _idditta)

	return _fs
}

/**
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"06BD5C2A-AB50-4941-BF60-D0FC97E061C9"}
 * @AllowToRunInFind
 */
function AggiornaSelezioneDitta(_rec) 
{		
	if (_idditta != -1)
	{
		_codditta = _rec['codice'];
		_ragionesociale = _rec['ragionesociale'];		
	
		onDataChangeDitta(-1,_codditta,new JSEvent);
		
		
		
		controller.focusField('fld_mese',false);
	}
	
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"E40E5C68-7A15-4E3B-B0EA-8A78B530AAB6"}
 */
function AggiornaGruppiLavoratori(_rec)
{	
    _descgrlav = _rec['descrizione']
	_codgrlav = _rec['codice']
}

/**
 * @param {JSRecord} _rec
 *  *
 * @properties={typeid:24,uuid:"BCE88798-7B82-43C7-982C-A9DDBF268940"}
 */
function AggiornaSediInstallazione(_rec){
	
	_idgruppoinst = _rec['idgruppoinst']
	_descgruppoinst = _rec['descrizione']
		
}



/**
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3BF47C5B-9E77-43D4-BDF1-80F7597AC1DA"}
 * @AllowToRunInFind
 */
function confermaDittaPeriodo(event)
{	
	var params = {
        processFunction: process_ditta_periodo,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * Operazione di apertura della giornaliera
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"34E51643-32C4-4C68-A910-949A3C99DBEF"}
 */
function process_ditta_periodo(event)
{
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		plugins.busy.unblock();
		return;
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
	var _frmScheda = forms.giorn_scheda_ditta;
	var _frmSchedaFs = _frmScheda.foundset;
	    _frmSchedaFs.removeFoundSetFilterParam('ftr_schedaDaDitta');
		_frmSchedaFs.addFoundSetFilterParam('idditta','=',_idditta,'ftr_schedaDaDitta');
	    _frmSchedaFs.loadAllRecords();
	    
    var _periodo = globals.toPeriodo(_anno, _mese);
	var _params = globals.inizializzaParametriAttivaMese(_idditta,_periodo,_idgruppoinst,_codgrlav,globals._tipoConnessione);
	/** @type {Array} */
	var _arrDipSenzaRegole = _params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(_params) : globals.getElencoDipendentiSenzaRegoleAssociate(_params);
	var tipoInst
	var response
	var msg = '<html>Ci sono dipendenti senza regola associata.<br/>Procedere, se prevista, allo scarico della giornaliera del Cliente?</html>';
	
	var fineInizioGestionePresenze = globals.getPeriodoFinaleGestionePresenze(_idditta);
	if(fineInizioGestionePresenze != null && _periodo > fineInizioGestionePresenze)
	{
		globals.ma_utl_showWarningDialog('Non è possibile utilizzare la funzionalità oltre il periodo di fine gestione','Giornaliera elettronica');
		plugins.busy.unblock();
		return;
	}
	
	//se esiste la scheda interna della ditta (e siamo nel caso di connessione sede)
	if (_frmSchedaFs.getSize() == 1 && globals._tipoConnessione == 0) {
		
		if (_frmSchedaFs.annotazioni) {

			//aggiorniamo i parametri necessari alla successiva attivazione del mese
			_frmScheda._idditta = _idditta;
			_frmScheda._anno = _anno;
			_frmScheda._mese = _mese;
			_frmScheda._gruppoinst = _idgruppoinst;
			_frmScheda._gruppolav = _codgrlav;
			//impostiamo la label di info
			_frmScheda.elements.lbl_scheda_ditta.text = 'Ditta : ' + _codditta + ' - ' + _ragionesociale;

			plugins.busy.unblock();
			
			//apriamo la finestra di visualizzazione scheda interna
			var winSchedaInternaDitta = application.createWindow('win_scheda_interna_ditta', JSWindow.MODAL_DIALOG);
			winSchedaInternaDitta.setInitialBounds(JSWindow.DEFAULT, JSWindow.DEFAULT, 610, 470);
			winSchedaInternaDitta.title = 'Scheda interna ditta';
			winSchedaInternaDitta.show(_frmScheda);
			
		} else {

			//controlliamo la presenza di dipendenti senza regole associate
			forms.giorn_controllo_dip_senza_regole_associate._isInGiornaliera = false;
			if(_arrDipSenzaRegole != null && _arrDipSenzaRegole.length > 0)
			{	
				tipoInst = globals.getTipoInstallazione(_idditta,_periodo);
				
				switch (tipoInst){
					
					case 2:
						
					    response = globals.ma_utl_showYesNoQuestion(msg,'Dipendenti senza regole associate');
					    if (response)
					    {	
					    	globals.importaTracciatoDaFtp(_idditta,_periodo,_idgruppoinst,_codgrlav);
					    	plugins.busy.unblock();
					        return;
					        
					    }
					    break;
					    
					default:
						break;
				}
				 
				//altrimenti visualizza i dipendenti senza regole ed impedisce l'accesso in giornaliera
				var frm = globals.costruisciRiepilogoRegoleNonAssociate(_arrDipSenzaRegole);
				frm['_isInGiornaliera'] = false;
				plugins.busy.unblock();
				globals.ma_utl_showFormInDialog(frm.controller.getName(),'Dipendenti senza regole');
			
			 }else
			    // Apri il program della giornaliera che sarà disabilitato
			    globals.apriGiornaliera(event, _idditta, _anno, _mese, _anno, _mese, _idgruppoinst, _codgrlav);
		}
	}
	else
		// Apri il program della giornaliera
		globals.apriGiornaliera(event, _idditta, _anno, _mese, _anno, _mese, _idgruppoinst, _codgrlav);
	
	//Salva la selezione corrente per poterla riproporre nella prossima entrata in giornaliera	
	salvaSelezione(_codditta.toString(),_anno,_mese,_idgruppoinst,_codgrlav);		
	
	plugins.busy.unblock();
		
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"B9DA9225-2D6B-4746-B4D6-658412F88926"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
	plugins.busy.prepare();
	
	_super.onShowForm(_firstShow, _event)
	
	elements.fld_cod_ditta.readOnly = false
	elements.fld_mese.readOnly = false
	elements.fld_anno.readOnly = false
	elements.btn_selditta.enabled = true
	
	if(_to_sec_user$user_id.flag_super_administrator ||
			_to_sec_user$user_id.flag_system_administrator)
		return;
	
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Ditte'].server_name,
                                                globals.nav.program['LEAF_Lkp_Ditte'].table_name)
		
	// se esiste salvata una selezione precedente
	if(databaseManager.getFoundSetCount(_to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera) > 0)
	{				
		// se è attivo il filtro ditta, anno e mese rimangono quelli della selezione precedente
		// mentre il codice ditta è relativo alla ditta selezionata nel filtro
        if(globals._filtroSuDitta != null){
			
			var _codDitta = -1
			
			var _fs = _foundset.duplicateFoundSet()
			
			if(_fs.find()){
				
				_fs['idditta'] = globals._filtroSuDitta
				_fs.search()
				
				if(_fs.getSize() > 0){
				   
					_codDitta = _fs['codice']
					_codditta = _codDitta
				    onDataChangeDitta(-1,_codDitta,new JSEvent)
					
				}    
			}
			// se il filtro è attivo, la sola ditta selezionabile è quella indicata nel filtro
			elements.btn_selditta.enabled = false;
														
		}
        // se il filtro ditta non è attivo recupera i dati salvati
		else
        {
		   _codditta = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.codice_ditta
		   if(_to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_installazione != null)
		      _idgruppoinst = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_installazione
		   		   
		   if(_to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_lavoratori != '')
		      _codgrlav = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_lavoratori
		   		   
		   onDataChangeDitta(-1,_codditta,new JSEvent)
        
        }	
		
        // completa l'aggiornamento dei dati relativi al periodo del cedolino
        if(_event.getFormName() == 'pv_selezione')
        {
        	var periodoCed = globals.ma_utl_getUltimoCedolinoStampato(globals.convert_DitteCliente2Sede(_idditta));
        	if(periodoCed)
        	{
        		_annoCed = parseInt(utils.stringLeft(periodoCed.toString(),4),10);
        		_meseCed = parseInt(utils.stringRight(periodoCed.toString(),2),10);
        	
        	    if(_meseCed == 12)
        	    {
        	       _annoCed++;
        	       _meseCed = 1;
        	    }
        	    else
        	       _meseCed++;
        	    
        		aggiornaPeriodoGiornaliera(_annoCed,_meseCed);
        	}
        	else
        		_annoCed = _meseCed = _anno = _mese = null;
        	    		
        }
        else
        {
        	_anno = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.anno ? _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.anno : globals.TODAY.getFullYear();
			_mese = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.mese ? _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.mese : globals.TODAY.getMonth() + 1;
        	aggiornaPeriodoCedolino(_anno,_mese);
        }
	}
	else
	{
		// non esiste una seleziona salvata per l'utente ed è la prima volta che apre la giornaliera
		if (_firstShow) 
			_annoCed = _meseCed = _anno = _mese = null;
		
		// se il filtro ditta è attivo la selezione è legata a quel valore
        if(globals._filtroSuDitta != null)
        {
			var _codDittaFiltro = -1
			var _fsFiltro = _foundset.duplicateFoundSet()
			
			if(_fsFiltro.find()){
				
				_fsFiltro['idditta'] = globals._filtroSuDitta
				_fsFiltro.search()
				
				if(_fsFiltro.getSize() > 0){
				   
					_codDittaFiltro = _fsFiltro['cod_ditta']
					_codditta = _codDittaFiltro
				    onDataChangeDitta(-1,_codDitta,new JSEvent)
					
				}    
			}
			// se il filtro è attivo, la sola ditta selezionabile è quella indicata nel filtro
			elements.btn_selditta.enabled = false;
														
		}
		//altrimenti la maschera è tutta vuota
		else
		{
			_codditta = ''
			_descgruppoinst = ''
			_codgrlav = null
			_idditta = null
			_idgruppoinst = null
			_ragionesociale = ''
			_annoCed = _meseCed = _anno = _mese = null;
		}
		
	}
	
   controller.focusField('fld_cod_ditta',true);
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"1F1B249B-6189-4F64-B09A-86801F741B9C"}
 * @AllowToRunInFind
 */
function onDataChangeDitta(oldValue, newValue, event)
{
	_ragionesociale = ''
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte>} */
	var _foundset = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE)
	/** @type {JSFoundset<db:/ma_presenze/e2sediinstallazione>} */
	var _foundsetGrInst = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.SEDI_INSTALLAZIONE);
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_presenzegruppigestione>} */
	var _foundsetGruppi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_PRESENZE_GRUPPI);				
	
	var arrDitteEpi = globals.getDitteGestiteEpi2();
	_foundset.addFoundSetFilterParam('idditta','IN',arrDitteEpi);
	_foundset.addFoundSetFilterParam('codice', '=', newValue);
	_foundset.loadAllRecords();
	
	if (_foundset.getSize() == 1)
	{
		//aggiorniamo la parte di selezione ditta
		_codditta = newValue //_foundset.codice.toString();
		_idditta = _foundset.idditta;
		_ragionesociale = _foundset.ragionesociale;
		
		//aggiorniamo la parte delle sedi di installazione
		//controlliamo di non essere in presenza di ditte interinali/esterne senza alcuna sede
		if (_foundset.ditte_to_ditte_sedi.getSize() > 0) {

			_foundsetGrInst = _foundset.ditte_to_ditte_sedi_sedeoperativa.ditte_sedi_to_ditte_sedigruppiinst.ditte_sedigruppiinst_to_e2sediinstallazione;

			// se una ditta è installata (il foundset corrispondente al gruppo di installazione
			// sarà non nullo) e con più sedi, gestisci la selezione
			if (_foundsetGrInst != null 
					&& _foundsetGrInst.getSize() >= 1)
			{
				_idgruppoinst = _foundsetGrInst.idgruppoinst;
				_descgruppoinst = _foundsetGrInst.descrizione;

				if (_foundsetGrInst.getSize() > 1)
				{
					if(elements.btn_selgruppoinst)
					   elements.btn_selgruppoinst.enabled = true;
					if(elements.fld_cod_gr_inst)
					   elements.fld_cod_gr_inst.enabled = true;
					if(elements.fld_gruppo_inst)
					   elements.fld_gruppo_inst.enabled = true;

				}
				else 
				{
					if(elements.btn_selgruppoinst)
					   elements.btn_selgruppoinst.enabled = false;
					if(elements.fld_cod_gr_inst)
					   elements.fld_cod_gr_inst.enabled = false;
					if(elements.fld_gruppo_inst)
					   elements.fld_gruppo_inst.enabled = false;
				}

			} else {
				
				_idgruppoinst = null;
				_descgruppoinst = '';
				if(elements.btn_selgruppoinst)
				   elements.btn_selgruppoinst.enabled = false;
				if(elements.fld_cod_gr_inst)
				   elements.fld_cod_gr_inst.enabled = false;
				if(elements.fld_gruppo_inst)
				   elements.fld_gruppo_inst.enabled = false;
			
			}
		}
		else 
		{
			
			_idgruppoinst = null;
			_descgruppoinst = '';
			if(elements.btn_selgruppoinst)
			   elements.btn_selgruppoinst.enabled = false;
			if(elements.fld_cod_gr_inst)
			   elements.fld_cod_gr_inst.enabled = false;
			if(elements.fld_gruppo_inst)
			   elements.fld_gruppo_inst.enabled = false;
		
		}
    		
			_foundsetGruppi = _foundset.ditte_to_ditte_presenzegruppigestione;

			if (_foundsetGruppi.getSize() > 1) 
			{
				if(elements.btn_selgruppolav)
				   elements.btn_selgruppolav.enabled = true;
				if(elements.fld_cod_gr_lav)
				   elements.fld_cod_gr_lav.enabled = true;
				if(elements.fld_cod_gr_lav)
				   elements.fld_cod_gr_lav.editable = true;

			} else
			{
				if(elements.btn_selgruppolav)
				   elements.btn_selgruppolav.enabled = false;
				if(elements.fld_cod_gr_lav)
				   elements.fld_cod_gr_lav.enabled = false;
				if(elements.fld_cod_gr_lav)
				   elements.fld_cod_gr_lav.editable = false;
			}

			_codgrlav = ''
			_descgrlav = ''
        
			var periodoCed = globals.ma_utl_getUltimoCedolinoStampato(globals.convert_DitteCliente2Sede(_idditta));
        	if(periodoCed)
        	{
        		_annoCed = parseInt(utils.stringLeft(periodoCed.toString(),4),10);
        		_meseCed = parseInt(utils.stringRight(periodoCed.toString(),2),10);
        	
        	    if(_meseCed == 12)
        	    {
        	       _annoCed++;
        	       _meseCed = 1;
        	    }
        	    else
        	       _meseCed++;
        	    
        		aggiornaPeriodoGiornaliera(_annoCed,_meseCed);
        	}
        	else
        		_annoCed = _meseCed = _anno = _mese = null;	
			
		globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());	
			
	}
	else
	   globals.svy_nav_showLookupWindow(event, '_idditta', 'LEAF_Lkp_Ditte', 'AggiornaSelezioneDitta', 'filterDitta', null, null, '', true)
			
	return true;
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B9388802-3E35-426D-B74B-87988D4A27F8"}
 */
function onDataChangeGruppoLav(oldValue, newValue, event) {
	
	var _foundsetGruppi = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Gruppigestione'].server_name,
		                                              globals.nav.program['LEAF_Lkp_Gruppigestione'].table_name)				

	_foundsetGruppi.removeFoundSetFilterParam('ftr_gruppiGestDaDitta')					
	_foundsetGruppi.removeFoundSetFilterParam('ftr_gruppiGestDaCodice')
	_foundsetGruppi.addFoundSetFilterParam('idditta','=',_idditta,'ftr_gruppiGestDaDitta')
    _foundsetGruppi.addFoundSetFilterParam('codice','=',newValue,'ftr_gruppiGestDaCodice')
	_foundsetGruppi.loadAllRecords()
	
	if(_foundsetGruppi.getSize() == 1){
		
		_codgrlav = _foundsetGruppi['codice']
		_descgrlav = _foundsetGruppi['descrizione']
		
	}else
	     globals.svy_nav_showLookupWindow(event, '_codgrlav', 'LEAF_Lkp_Gruppigestione', 'AggiornaGruppiLavoratori', '', null, null, '', true)
											
    return true;
}
/**
 * @return {Boolean} whether the form is filled correctly
 * 
 * @properties={typeid:24,uuid:"C9AEF2AE-42F6-4BAE-B85C-AC7BC09A2D65"}
 */
function isFilled()
{
	return !(!_anno || !_mese || !_idditta); 
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"A6283941-4760-4E69-A357-B0AD2D62DBBF"}
 */
function showLkpSelDitta(event) {
	globals.svy_nav_showLookupWindow(event, '_idditta', 'LEAF_Lkp_Ditte', 'AggiornaSelezioneDitta', 'filterDitta', null, null, '', true)
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"E294CB0F-AD28-44BD-BDB4-45A1F6E6F83D"}
 */
function onDataChangeMese(oldValue, newValue, event) 
{
	if(newValue && _anno)
		aggiornaPeriodoCedolino(_anno,newValue);
	return true;
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3366C919-4F1F-4B9F-BA40-CC1E0853E048"}
 */
function onDataChangeGruppoInst(oldValue, newValue, event) {

	var _foundsetGruppi = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_GruppoInst'].server_name,
		globals.nav.program['LEAF_Lkp_GruppoInst'].table_name)

	_foundsetGruppi.removeFoundSetFilterParam('ftr_gruppiGestDaGrInst')

	_foundsetGruppi.addFoundSetFilterParam('idditta', '=', _idditta, 'ftr_gruppiGestDagrInst')
	_foundsetGruppi.loadAllRecords()

	if (_foundsetGruppi.getSize() >= 1) {

		_idgruppoinst = _foundsetGruppi['idgruppoinst']
		_descgruppoinst = _foundsetGruppi['descrizione']

	} else
		globals.svy_nav_showLookupWindow(event, '_idgruppoinst', 'LEAF_Lkp_GruppoInst', 'AggiornaSediInstallazione', '', null, null, '', true)

	return true
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"18AEBD0E-8B32-4791-8335-097F1EE65891"}
 */
function confermaDittaPeriodoDaAcquisire(event) {
	
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		return;
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	var ctrlRes = scopes.giornaliera.esisteGiornalieraDaImportare(_idditta,
	                  											  _anno * 100 + _mese,
																  _idgruppoinst,
																  _codgrlav);
	if(ctrlRes['returnValue'] == 0)
	{
		var msg = ctrlRes['returnMessage'] + '<br/>';
		
		var recOpDitta = scopes.giornaliera.getUltimaOperazioneDitta(_idditta,
							                                         _idgruppoinst,
																	 _codgrlav,
																	 _anno * 100 + _mese,
																	 globals.getIdTabAttivita(globals.AttivitaDitta.IMPORTAZIONE_GIORNALIERA))
		
	    if(recOpDitta)
	       msg += ('Ultima acquisizione effettuata il ' + globals.dateFormat(recOpDitta.ultimaesecuzioneil,globals.LOGINFO_DATEFORMAT));
		
		globals.svy_mod_closeForm(event);
		globals.ma_utl_showWarningDialog(msg,'Importa giornaliera');
		return;
	}
	
	var params = {
        processFunction: process_acquisizione,
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
 * Lancia l'operazione di acquisizione della giornaliera definitiva del mese precedente
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"8E9EF0B1-7ADB-4D0E-87AE-D478971F6660"}
 */
function process_acquisizione(event)
{
	try
	{
	    globals.svy_mod_closeForm(event);
		
		globals.importaTracciatoDaFtp(_idditta
		                              ,_anno * 100 + _mese
		                              ,_idgruppoinst
		                              ,_codgrlav);
	}
	catch(ex)
	{
		var msg = 'Metodo process_acquisizione : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
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
 * @properties={typeid:24,uuid:"BE604E88-D07F-4657-AFEC-41F6B00D3858"}
 */
function annullaSelezione(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    globals.svy_mod_closeForm(event);
}

/**
 * @AllowToRunInFind
 * 
 * Salva la selezione attuale per la prossima apertura della giornaliera
 * 
 * @param {String} codDitta
 * @param {Number} anno
 * @param {Number} mese
 * @param {Number} gruppo_inst
 * @param {String} gruppo_lav
 *
 * @properties={typeid:24,uuid:"F3DDC315-54DB-4C8A-8719-831EB2F5728E"}
 */
function salvaSelezione(codDitta,anno,mese,gruppo_inst,gruppo_lav)
{
	/** @type {JSFoundset} <db:/svy_framework/sec_user_to_giornaliera> */
	var _fsLeafGiorn = databaseManager.getFoundSet('svy_framework','sec_user_to_giornaliera')
	if(_fsLeafGiorn.find())
	{
	   _fsLeafGiorn['user_id'] = _to_sec_user$user_id.user_id
	  
	   var _result = _fsLeafGiorn.search()
	   if(_result > 0)
	   {
		   _fsLeafGiorn['codice_ditta'] = codDitta;
		   _fsLeafGiorn['mese'] = mese;
		   _fsLeafGiorn['anno'] = anno;
		   _fsLeafGiorn['gruppo_installazione'] = gruppo_inst;
		   _fsLeafGiorn['gruppo_lavoratori'] = gruppo_lav;
		   
	   }else
	   {
		  var _newRec = _fsLeafGiorn.newRecord(false)
		  if(_newRec != -1)
		  {
			  _fsLeafGiorn.user_id = _to_sec_user$user_id.user_id 
			  _fsLeafGiorn.codice_ditta = _codditta
			  _fsLeafGiorn.mese = _mese
			  _fsLeafGiorn.anno = _anno
			  _fsLeafGiorn.gruppo_installazione = _idgruppoinst
			  _fsLeafGiorn.gruppo_lavoratori = _codgrlav
			  
		  }
		   
	   }
	   
	   databaseManager.startTransaction()
	   
	   if(!databaseManager.commitTransaction())
	   {
		   databaseManager.revertEditedRecords(_fsLeafGiorn)
		   globals.svy_mod_dialogs_global_showErrorDialog('Errore durante l\'operazione', 'Si è verificato un errore...', 'Chiudi');
	   }
	}
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EC153156-AB46-4C7C-BE5E-F3340836205F"}
 */
function onHide(event) {
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	return _super.onHide(event)
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"811E348E-48C6-44AE-B2FE-95906ED1E7CD"}
 */
function onDataChangeAnno(oldValue, newValue, event) 
{
	if(newValue && _mese)
		aggiornaPeriodoCedolino(newValue,_mese);
	return true;
}

/**
 * Aggiorna mese ed anno del cedolino
 * 
 * @param {Number} anno
 * @param {Number} mese
 *
 * @properties={typeid:24,uuid:"75F68301-A706-4A76-9ECB-FA547924C1CE"}
 */
function aggiornaPeriodoCedolino(anno,mese)
{
	if(_idditta == null)
		return;
	
	if(globals.isDittaMesePrecedente(_idditta,anno * 100 + mese))
	{
		if(mese == 12)
		{
			_annoCed = anno + 1;
			_meseCed = 1;
		}
		else
		{
			_annoCed = _anno;
			_meseCed = mese + 1;
		}
	}
	else
	{
		_annoCed = anno;
		_meseCed = mese;
	}
}

/**
 * Aggiorna mese ed anno della giornaliera 
 * 
 * @param {Number} anno
 * @param {Number} mese
 *
 * @properties={typeid:24,uuid:"3A4C2251-1B82-4BF4-88F9-3BF3163A1467"}
 */
function aggiornaPeriodoGiornaliera(anno,mese)
{
	if(_idditta == null)
		return;
	
	if(globals.isDittaMesePrecedente(_idditta,anno * 100 + mese))
	{
		if(mese == 1)
		{
			_anno = anno - 1;
			_mese = 12;
		}
		else
		{
			_anno = anno;
			_mese = mese - 1;
		}
	}
	else
	{
		_anno = anno;
		_mese = mese;
	}
}