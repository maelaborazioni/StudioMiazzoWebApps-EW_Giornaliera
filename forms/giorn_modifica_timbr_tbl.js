/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A97DB91F-B766-4760-AA55-2226CEBB37A5",variableType:8}
 */
var _gg;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"47E87298-4855-497D-B2F2-50AA419D96E2",variableType:-4}
 */
var _ggSucc = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4F3DC275-019C-4AFF-94D7-1DAF9DF059E9",variableType:4}
 */
var _idTimbratura = -1;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"6F5A5EAB-383F-4C60-9066-0D451FE8759E",variableType:-4}
 */
var _isModifica = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"43CF5C83-7712-480A-AA48-37DD48B68F2C",variableType:8}
 */
var _MM;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E6435278-F9A0-47C9-9EC3-21EA7895F06B",variableType:8}
 */
var _yy;

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"7884FB71-0A53-4840-876B-8B857AA65770"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
	return;
}



/**
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CC3D66BA-8586-4CC6-815B-AF2529890CF4"}
 */
function annullaModificaTimbr(event){

	databaseManager.revertEditedRecords(foundset);
	databaseManager.refreshRecordFromDatabase(foundset,0);
	globals.svy_nav_dc_setStatus('browse','giorn_modifica_timbr_dtl',true);
    globals.svy_mod_closeForm(event);
	
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
 * @properties={typeid:24,uuid:"784C5E55-CDC8-4715-8AA0-19958209B880"}
 */
function onTimbrChange(oldValue, newValue, event) {
	
	// Gestione modifica timbratura 
	var _timbrOreMin = foundset.timbratura_oremin; 
	var _timbrH,_timbrM;
	_timbrH = parseInt(utils.stringLeft(_timbrOreMin,2),10);
	_timbrM = parseInt(utils.stringRight(_timbrOreMin,2),10);
	
	if(_timbrH <= 23 && _timbrM <= 59)
		elements['lbl_timbratura'].fgcolor = 'red';
	
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
 * @properties={typeid:24,uuid:"6A4C1683-BC5B-44DB-94F3-A54DB8ADA774"}
 */
function onDataChangeTimbratura(oldValue, newValue, event) {
	
	if(!foundset.indirizzo)
	   // se la timbratura è modificata manualmente
	   foundset.indirizzo = 'mn';
	
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
 * @properties={typeid:24,uuid:"483DF76D-525B-47D7-8CBE-0F3879E14A00"}
 */
function onDataChangeSenso(oldValue, newValue, event) {
	
//	sensocambiato = true;
    return true
}
