/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"57E2ABA8-6BA3-49BB-B6F5-2CDCBFDD7C58",variableType:4}
 */
var _eb = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0BBC5FDB-A24D-4C81-AEFB-BF87C73EAAB5"}
 */
var _ebStr = 'EB';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"FF16D321-1B9F-4198-AC94-262394B7A0D6",variableType:4}
 */
var _gs = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2267AC10-0D77-4B21-869D-2148984E0F78"}
 */
var _gsStr = 'GS';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"AC123069-7BE3-44D2-8BFB-3B113A6CE941",variableType:4}
 */
var _nc = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"965352B4-0346-4FA6-9712-F40BFC392D21"}
 */
var _ncStr = 'NC';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1ACC311E-5EBA-487C-B85F-A33CEA1C87EB",variableType:4}
 */
var _te = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F89A4037-993D-44DF-AC27-978B0D5CAA46"}
 */
var _teStr = 'TE';

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"A502F4F6-B882-4365-80EC-A12F6F1F0FF1"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event)

	plugins.busy.prepare();
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	
	elements.fld_ev_bloccanti.enabled = true
	elements.lbl_ev_bloccanti.enabled = true
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
 * @properties={typeid:24,uuid:"DE33176F-F9B5-4DF9-B90F-D38A714CD4B2"}
 */
function tornaAllaGiornaliera(event) 
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
    globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"45E9864E-48AF-452D-A967-A161898CB8DF"}
 */
function vaiAllaGiornalieraFiltrata(event) 
{
	var _fs = forms.giorn_header.foundset
	var _catArr = new Array
	if(_eb) _catArr.push(_ebStr)
	if(_gs) _catArr.push(_gsStr)
	if(_te) _catArr.push(_teStr)
	if(_nc) _catArr.push(_ncStr)
	
	if(_catArr.length == 0)
	{
		tornaAllaGiornaliera(event);
		return;
	}
	
	try
	{
		/** @type Array<Number>*/
		var arrLav = globals.foundsetToArray(_fs,'idlavoratore');
		/** @type {JSDataSet} */
		var _dipCatDs = globals.ottieniDipendentiBloccanti(_catArr,_fs.idditta,arrLav,globals.getPeriodo());
		
		if (_dipCatDs.getMaxRowIndex() > 0)
		{ 
			var params = {
		        processFunction: process_filtro_dipendenti_bloccanti,
		        message: '', 
		        opacity: 0.5,
		        paneColor: '#434343',
		        textColor: '#EC1C24',
		        showCancelButton: false,
		        cancelButtonText: '',
		        dialogName : 'This is the dialog',
		        fontType: 'Arial,4,25',
		        processArgs: [event,_dipCatDs,_fs,_catArr]
		    };
			plugins.busy.block(params);
		}
	}
	catch(ex)
	{
		var msg = 'Metodo vaiAllaGiornalieraFiltrata : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
}

/**
 * @param {JSEvent} event
 * @param {JSDataSet} _dipCatDs
 * @param {JSFoundset} _fs
 * @param {Array} _catArr
 *
 * @properties={typeid:24,uuid:"A643AD2B-5DF6-4245-9164-83E515245800"}
 */
function process_filtro_dipendenti_bloccanti(event,_dipCatDs,_fs,_catArr)
{
	try
	{
		var _arrDsAnag = [];
		
		//ho copiato in toto il codice della parte di filtri giornaliera
		//il nome del filtro è lo stesso così da avere un solo filtro allo stesso tempo
		//update dell'array generale (per rendere effettivo il filtro nella lookup)
		//quindi o è attivo il filtro dei dipendenti che bloccano la chiusura 
		//o è attivo il filtro classico in giornaliera
		_arrDsAnag = _dipCatDs.getColumnAsArray(1);
		forms.giorn_header._arrDsAnag = _arrDsAnag;
		   
		_fs.removeFoundSetFilterParam('ftr_filtriGiornaliera');
		_fs.addFoundSetFilterParam('idlavoratore', 'IN', _arrDsAnag, 'ftr_filtriGiornaliera');
		_fs.loadAllRecords();
		 
		globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag = true;
	    
		globals.azzeraFiltri();
				
		forms.giorn_vista_mensile._filtroAttivo = true;
		forms.giorn_filtri._ftrBloccanti = true;
		forms.giorn_filtri._arrCatBloccanti = _catArr;
		globals.aggiornaIntestazioni();
		
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_filtro_dipendenti_bloccanti : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
		
}

/** *
 * @param event
 *
 * @properties={typeid:24,uuid:"61E155E0-36E7-4A3E-873A-050BA2B04808"}
 */
function onHide(event) {

	_super.onHide(event);
	
	plugins.busy.unblock();
	
    globals.aggiornaIntestazioni();
    globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * @properties={typeid:24,uuid:"B0A17D46-12F6-4D5F-A39F-ED7E76BC6F66"}
 */
function azzeraChecks()
{
	_eb = 0;
	_gs = 0;
	_nc = 0;
	_te = 0;
}