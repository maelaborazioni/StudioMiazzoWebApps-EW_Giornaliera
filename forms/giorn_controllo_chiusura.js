/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E4DECF1C-4461-4A44-9B8B-569393944F87",variableType:4}
 */
var _el = 0

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D62EF425-8FD0-4793-A6A4-3BB39A4D32EB",variableType:4}
 */
var _eb = 0

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B5BD553C-1D58-4A24-B492-6B638A9D78C9",variableType:4}
 */
var _gs = 0

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D5BE89FA-A950-4441-BB82-FC63E4BC095B",variableType:4}
 */
var _te = 0

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"63A83598-4726-4BB1-90D5-44904458AD3F",variableType:4}
 */
var _nc = 0

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"12F92FFC-A8A7-4121-880D-0D0D58312C05"}
 */
var _elStr = 'EL'
	/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"93AEE51E-22C0-49D8-90AB-AEA0BFB05B56"}
 */
var _ebStr = 'EB'
		/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9FA1F4D8-6820-4E00-8B66-E3BF0EFEC48C"}
 */
var _gsStr = 'GS'
			/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0AC028EE-669A-4A5E-9C90-71B34D8A57FC"}
 */
var _teStr = 'TE'
				/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A7E2112B-32F2-4FCD-8DF5-EF1369A9DBD7"}
 */
var _ncStr = 'NC'
	
/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"57BD6030-839D-4EBF-B2B0-C4350D1B34A5"}
 */
function onShowForm(_firstShow, _event) {

	elements.fld_ev_bloccanti.enabled = true
	elements.lbl_ev_bloccanti.enabled = true
	elements.fld_ev_lunghi.enabled = true
	elements.fld_ev_lunghi.enabled = true
	elements.fld_giorni_squadrati.enabled = true
	elements.lbl_giorni_squadrati.enabled = true
	elements.fld_giorn_non_cont.enabled = true
	elements.lbl_giorn_non_cont.enabled = true
	elements.fld_timbr_err.enabled = true
	elements.lbl_timbr_err.enabled = true
	
    if (!_eb){
    	elements.fld_ev_bloccanti.enabled = false
    	elements.lbl_ev_bloccanti.enabled = false
    }
    
    if (!_el){
    	elements.fld_ev_lunghi.enabled = false
		elements.fld_ev_lunghi.enabled = false
    }
    
    if (!_gs){
    	elements.fld_giorni_squadrati.enabled = false
		elements.lbl_giorni_squadrati.enabled = false
    }
    if (!_nc){
    	elements.fld_giorn_non_cont.enabled = false
		elements.lbl_giorn_non_cont.enabled = false
    }
    if (!_te){
    	elements.fld_timbr_err.enabled = false
		elements.lbl_timbr_err.enabled = false
    }
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D49B9F52-4A2D-45FC-A1EC-46DFF737E7B9"}
 */
function tornaAllaGiornaliera(event) {
	
    globals.svy_mod_closeForm(event);

}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A9585893-283B-4F28-A91F-3F346972FB84"}
 */
function vaiAllaGiornalieraFiltrata(event) {
	
	var _fs = forms.giorn_header.foundset
	var _arrDsAnag = [];
	var _catArr = new Array
	if(_el) _catArr.push(_elStr)
	if(_eb) _catArr.push(_ebStr)
	if(_gs) _catArr.push(_gsStr)
	if(_te) _catArr.push(_teStr)
	if(_nc) _catArr.push(_ncStr)
	
	/** @type Array<Number>*/
	var arrLav = globals.foundsetToArray(_fs,'idlavoratore');
	/** @type {JSDataSet} */
	var _dipCatDs = globals.ottieniDipendentiBloccanti(_catArr,_fs.idditta,arrLav,globals.getPeriodo());
	
	if (_dipCatDs.getMaxRowIndex() > 0){ 
	
		//ho copiato in toto il codice della parte di filtri giornaliera
		//il nome del filtro è lo stesso così da avere un solo filtro allo stesso tempo
		//update dell'array generale (per rendere effettivo il filtro nella lookup)
		//quindi o è attivo il filtro dei dipendenti che bloccano la chiusura 
		//o è attivo il filtro classico in giornaliera
		forms.giorn_header._arrDsAnag = _arrDsAnag;
		   
		_fs.removeFoundSetFilterParam('ftr_filtriGiornaliera');
		_fs.addFoundSetFilterParam('idlavoratore', 'IN', _dipCatDs.getColumnAsArray(1), 'ftr_filtriGiornaliera');
		_fs.loadAllRecords();
		 
		globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag = true;
		
		globals.azzeraFiltri();
		
		forms.giorn_vista_mensile._filtroAttivo = true;
		forms.giorn_filtri._arrCatBloccanti = _catArr;
		globals.aggiornaIntestazioni();
		
		globals.svy_mod_closeForm(event);
		   
	}else
		globals.ma_utl_showErrorDialog('Recupero giornaliera filtrata non riuscito, riprovare','Chiusura mese');
}

/** *
 * @param event
 *
 * @properties={typeid:24,uuid:"AC660CEA-74FC-4B33-BD5D-3E333C046550"}
 */
function onHide(event) {

	_super.onHide(event)
//    globals.aggiornaFiltri();
    globals.aggiornaIntestazioni();
}

/**
 * @properties={typeid:24,uuid:"9C2D8E98-E903-46E0-8A26-595CE69429A1"}
 */
function azzeraChecks()
{
	_eb = 0;
	_el = 0;
	_gs = 0;
	_nc = 0;
	_te = 0;
}