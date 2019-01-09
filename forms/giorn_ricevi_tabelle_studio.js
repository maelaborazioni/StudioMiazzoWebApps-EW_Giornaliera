/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"338FC5BA-D3D4-4BB0-BCEA-492BB90FF3B2",variableType:8}
 */
var _idditta = null;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FF43D503-243D-41AB-96F6-12CBA396D446"}
 */
var _codditta = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2F7A05AC-5E73-4062-9D5E-63C9B01BF956"}
 */
var _ragionesociale = ''
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A8CEBF83-D7B9-4BA6-A1E6-F569FE8E5545"}
 */
var _descgrlav = ''
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F58B2FCA-3E36-4163-8240-CA8F639B7171"}
 */
var _codgrlav = ''
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"15915A54-0B9B-4611-88FF-92CF2996C845",variableType:8}
 */
var _idgruppoinst = null
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"418EFC69-860E-4CB2-8B34-CBB2213574AA"}
 */
var _descgruppoinst = ''
	
/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"C2410330-D1CC-4B9A-B18A-02230FC757F2"}
 */
function FiltraSediInstallazione(_fs){		
	
	_fs.addFoundSetFilterParam('idditta','=', _idditta)

	return _fs
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"13038AFC-7100-4C99-9B9F-1C01930968EF"}
 */
function FiltraGruppiLavoratori(_fs){		
	
	_fs.addFoundSetFilterParam('idDitta','=', _idditta)

	return _fs
}

/**
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"56ACF43B-B429-4CBA-87B4-02849EFDBF62"}
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
 * @properties={typeid:24,uuid:"9D1823ED-730B-478A-B280-3BC814776699"}
 */
function AggiornaGruppiLavoratori(_rec)
{	
    _descgrlav = _rec['descrizione']
	_codgrlav = _rec['codice']
	
}

/**
 * @param {JSRecord} _rec
 *  *
 * @properties={typeid:24,uuid:"3427341A-7C96-429A-B8EF-653BBA2F7A59"}
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
 * @properties={typeid:24,uuid:"9DC30318-B604-460A-B4B6-9FFB3E7A84FA"}
 * @AllowToRunInFind
 */
function confermaDitta(event)
{	
	if(!globals.verificaDatiDittaFtp(_idditta,_idgruppoinst))
	{
		globals.svy_mod_closeForm(event);
		globals.ma_utl_showWarningDialog('Non esistono aggiornamenti dati da scaricare per la ditta selezionata','Ricezione tabelle studio');
		return;
	}
	
	var params = {
        processFunction: process_ricevi_tabelle_studio,
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
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2C0CC526-9FF0-4122-BB38-9C59F7EEF8DF"}
 */
function process_ricevi_tabelle_studio(event)
{
	try
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
		
		var params = globals.inizializzaParametriRiceviTabelle(_idditta,_idgruppoinst,_codgrlav,globals._tipoConnessione,0); 
		
		globals.riceviTabelleDittaDipendenti(params,[_idditta]);
	}
	catch(ex)
	{
		var msg = 'Metodo process_ricevi_tabelle_studio : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
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
 * @properties={typeid:24,uuid:"0202E08D-F341-43DA-A203-18A7E50A23B9"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
	plugins.busy.prepare();
	
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
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"061CC9B8-D1C7-45E2-87D1-EF3F4629AD92"}
 * @AllowToRunInFind
 */
function onDataChangeDitta(oldValue, newValue, event) 
{	
	_ragionesociale = ''
	
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>}*/
	var _foundset = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE)
    var arrDitteEpi = globals.getDitteGestiteEpi2();

	if(_foundset.find())
	{
		_foundset.idditta = arrDitteEpi;
		_foundset.ditte_to_ditte_sedi.codtiposede = globals.TipiSedeLavoro.SEDE_OPERATIVA;
		_foundset.codice = newValue;
	
		_foundset.search();
	}
		
	if (_foundset.getSize() == 1) {
		
		//aggiorniamo la parte di selezione ditta
		_idditta = _foundset['idditta']
		_ragionesociale = _foundset['ragionesociale']
		
		//aggiorniamo la parte delle sedi di installazione
		//controlliamo di non essere in presenza di ditte interinali/esterne senza alcuna sede
		if (_foundset['ditte_to_ditte_sedi_sedeoperativa'].getSize() > 0) {

			/** @type {JSFoundset} */
			var _fsSedi = _foundset['ditte_to_ditte_sedi_sedeoperativa']['ditte_sedi_to_ditte_sedigruppiinst']['ditte_sedigruppiinst_to_e2sediinstallazione']

				// se una ditta è installata (il foundset corrispondente al gruppo di installazione
			// sarà non nullo) e con più sedi, gestisci la selezione
			if (_fsSedi != null && _fsSedi.getSize() >= 1) {
				_idgruppoinst = _fsSedi['idgruppoinst']
				_descgruppoinst = _fsSedi['descrizione']

				if (_fsSedi.getSize() > 1) {
					elements.btn_selgruppoinst.enabled = true
					elements.fld_cod_gr_inst.enabled = true
					elements.fld_gruppo_inst.enabled = true

				} else {
					elements.btn_selgruppoinst.enabled = false
					elements.fld_cod_gr_inst.enabled = false
					elements.fld_gruppo_inst.enabled = false
				}

			} else {
				
				_idgruppoinst = null
				_descgruppoinst = ''
				elements.btn_selgruppoinst.enabled = false
				elements.fld_cod_gr_inst.enabled = false
				elements.fld_gruppo_inst.enabled = false
			
			}
		}
		else {
			
			_idgruppoinst = null
			_descgruppoinst = ''
			elements.btn_selgruppoinst.enabled = false
			elements.fld_cod_gr_inst.enabled = false
			elements.fld_gruppo_inst.enabled = false
		
		}
		
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
 * @properties={typeid:24,uuid:"7C759ADA-E3F8-41D7-B591-8E45D69B5573"}
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
		
//		var _retVal = globals.filtroEntrataInGiornaliera(_idditta,_idgruppoinst,_codgrlav)
//		if (_retVal.returnValue){
//			
//			_stringaFiltro = _retVal.filterStr
//			
//		}
			
		
	}else
	     globals.svy_nav_showLookupWindow(event, '_codgrlav', 'LEAF_Lkp_Gruppigestione', 'AggiornaGruppiLavoratori', '', null, null, '', true)
											
    return true
}

/**
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"388B824B-6A90-4231-BC15-8EE7F5D57C60"}
 * @AllowToRunInFind
 */
function FiltraDitteRicezione(fs)
{
//	var _arrDitteGestiteEpi2 = [];
//	var _dsDitteGestiteEpi2 = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,'SELECT idditta FROM ditte_presenze WHERE Ore_GestioneEpi2 = 1',null,3000)
//	    _arrDitteGestiteEpi2 = _dsDitteGestiteEpi2.getColumnAsArray(1);
//		
//	fs.removeFoundSetFilterParam('ftr_ditteGestiteEpi2');
//	fs.addFoundSetFilterParam('idditta','IN',_arrDitteGestiteEpi2,'ftr_ditteGestiteEpi2');	
	
	fs.addFoundSetFilterParam('tipologia','IN',[globals.Tipologia.STANDARD,globals.Tipologia.GESTITA_UTENTE])
	return fs;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FF3D9546-0DB9-48D5-9FD9-C02AB9A96770"}
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
 * @properties={typeid:24,uuid:"2B52B8B5-439F-4FC6-A298-156D7CF58AF6"}
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
 * @properties={typeid:24,uuid:"135D1222-B7AF-40A4-BECB-68865AB39182"}
 */
function showLkpSelDitta(event) {
	// TODO Auto-generated method stub
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
 * @private
 *
 * @properties={typeid:24,uuid:"C52313F7-6719-4067-8E4A-398ADD88D346"}
 */
function onDataChangeMese(oldValue, newValue, event) {
	
  	return true
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
 * @properties={typeid:24,uuid:"225CB470-9D29-416F-B8B3-8CAEA60F3885"}
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
 * @private
 *
 * @properties={typeid:24,uuid:"D6C1C65E-0626-4702-B4D8-C20736DB432A"}
 */
function annullaSelezione(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/** *
 * @param event
 *
 * @properties={typeid:24,uuid:"267E49FF-88F9-4078-9946-152FB2A93CC9"}
 */
function onHide(event) {
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	return _super.onHide(event)
}
