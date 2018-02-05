/**
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"BFE5FFD4-0473-479E-AF50-0039FDFB4E8A"}
 * @AllowToRunInFind
 */
function AggiornaSelezioneDitta(_rec) 
{		
	if (_idditta != -1)
	{
		_codditta = _rec['codice']
		_ragionesociale = _rec['ragionesociale']		
	
		onDataChangeDitta(-1,_codditta,new JSEvent)
		
		controller.focusField('fld_mese',true)
	}
	
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"07BAAC3C-074A-4B7D-8E0E-A35C7465539B"}
 */
function AggiornaGruppiLavoratori(_rec)
{	
    _descgrlav = _rec['descrizione']
	_codgrlav = _rec['codice']
	
}

/**
 * @param {JSRecord} _rec
 *  *
 * @properties={typeid:24,uuid:"83D2639A-CE81-4E09-BFCC-30764821F1AE"}
 */
function AggiornaSediInstallazione(_rec){
	
	_idgruppoinst = _rec['idgruppoinst']
	_descgruppoinst = _rec['descrizione']
	
	
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0BED2E60-DFE5-4A3F-B5BA-E26F03B630A1"}
 * @AllowToRunInFind
 */
function confermaDittaPeriodo(event)
{	
	var params = {
        processFunction: process_acquisisci_giornaliera_admin,
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
 * Lancia l'operazione di acquisizione giornaliera
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9DAA28F4-CF72-45C5-A8B6-CC9BA0E2FF18"}
 */
function process_acquisisci_giornaliera_admin(event)
{
	try
	{
		globals.inizializzaParametriAttivaMese(_idditta,_anno * 100 +  _mese,_idgruppoinst,_codgrlav);
		globals.importaTracciatoDaFtp(_idditta,_anno * 100 +  _mese,_idgruppoinst,_codgrlav);
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_acquisisci_giornaliera_admin : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg);
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"FE9B9745-7975-4BDD-9FEB-5183A8E93E7C"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event)
	
	elements.fld_cod_ditta.readOnly = false
	elements.btn_selditta.enabled = true
	elements.btn_selgruppoinst.enabled = false
    elements.fld_cod_gr_inst.enabled = false
	elements.fld_gruppo_inst.enabled = false
	elements.btn_selgruppoinst.enabled = true
	
	// se esiste salvata una selezione precedente
	if(databaseManager.getFoundSetCount(_to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera) > 0)
	{
		// se è attivo il filtro ditta, anno e mese rimangono quelli della selezione precedente
		// mentre il codice ditta è relativo alla ditta selezionata nel filtro
        if(globals._filtroSuDitta != null){
			
			var _codDitta = -1
			var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Ditte'].server_name,
			 	                                        globals.nav.program['LEAF_Lkp_Ditte'].table_name)
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
		   {
//			   onDataChangeGruppoInst(-1,_to_sec_user$user_id.sec_user_to_leaf_giornaliera.gruppo_installazione,new JSEvent)
		       _idgruppoinst = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_installazione
		   }
		   
		   if(_to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_lavoratori != '')
		   {
//			   onDataChangeGruppoLav(-1,_to_sec_user$user_id.sec_user_to_leaf_giornaliera.gruppo_lavoratori,new JSEvent)
		       _codgrlav = _to_sec_user$user_id.sec_user_to_sec_user_to_giornaliera.gruppo_lavoratori
		   }
		   
		   onDataChangeDitta(-1,_codditta,new JSEvent)
        
        }	
	}
	else
	{
		// se il filtro ditta è attivo la selezione è legata a quel valore
        if(globals._filtroSuDitta != null){
			
			var _codDittaFiltro = -1
			var _fsFiltro = _foundset.duplicateFoundSet()
			
			if(_fsFiltro.find()){
				
				_fsFiltro['idditta'] = globals._filtroSuDitta
				_fsFiltro.search()
				
				if(_fsFiltro.getSize() > 0){
				   
					_codDittaFiltro = _fs['cod_ditta']
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
			//_anno = null
			_codditta = ''
			_descgruppoinst = ''
			_codgrlav = null
			_idditta = null
			_idgruppoinst = null
			//_mese = null
			_ragionesociale = ''

		}
		
	}
	
    //elements.fld_cod_ditta.requestFocus()
   controller.focusField('fld_cod_ditta',true)
}




/**
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"61C669B6-4971-411B-A5EC-C6C08B63AACA"}
 * @AllowToRunInFind
 */
function filterDitta(fs)
{
	var _arrDitteGestiteEpi2 = [];
	var _dsDitteGestiteEpi2 = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,'SELECT idditta FROM ditte_presenze WHERE Ore_GestioneEpi2 = 1',null,3000)
	    _arrDitteGestiteEpi2 = _dsDitteGestiteEpi2.getColumnAsArray(1);
		
	fs.removeFoundSetFilterParam('ftr_ditteGestiteEpi2');
	fs.addFoundSetFilterParam('idditta','IN',_arrDitteGestiteEpi2,'ftr_ditteGestiteEpi2');	
	
	return fs;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9120346F-5804-4EF9-A62F-64002E54938B"}
 */
function onAction(event)
 {
	globals.ma_utl_showInfoDialog(application.getServerURL(),'Info sul server')
}

/**
 * Handle focus gained event of the element.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F58C1001-6035-4752-80B8-E7CC5A8D5245"}
 */
function onFocusGained(event) {
	// TODO Auto-generated method stub
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"23A67A21-72AD-4D17-855B-AE542967DE25"}
 */
function showLkpSelDitta(event) {
	// TODO Auto-generated method stub
	globals.svy_nav_showLookupWindow(event, '_idditta', 'LEAF_Lkp_Ditte', 'AggiornaSelezioneDitta', 'filterDitta', null, null, '', true)
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"41A611E6-DDA0-4931-85E9-300496A37B42"}
 */
function onShow(firstShow, event) {
	
	elements.fld_cod_ditta.readOnly = false
	elements.fld_mese.readOnly = false
	elements.fld_anno.readOnly = false
	elements.btn_selditta.enabled = true
	elements.btn_selgruppoinst.enabled = false
    elements.fld_cod_gr_inst.enabled = false
	elements.fld_gruppo_inst.enabled = false
	elements.btn_selgruppoinst.enabled = true
	
	//_anno = null;
	_codditta = '';
	_descgruppoinst = '';
	_codgrlav = null;
	_idditta = null;
	_idgruppoinst = null;
	//_mese = null;
	_ragionesociale = '';
		
	controller.focusField('fld_cod_ditta',true);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A1AE0957-5CFB-45B2-B8C7-874EB326842B"}
 */
function annullaSelezione(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}
