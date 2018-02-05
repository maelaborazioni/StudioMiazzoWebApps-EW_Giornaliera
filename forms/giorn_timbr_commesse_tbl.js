/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"551FD68C-D4C9-4AEE-AB0B-3B2499CB0FB6",variableType:8}
 */
var _gg;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"326E2C47-F4D4-4007-B8C3-1DD04315F51E",variableType:-4}
 */
var _ggSucc = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"73FAA70D-6EE4-4BB6-8347-313E8D6F6994",variableType:4}
 */
var _idTimbratura = -1;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"1E1D9D63-7850-4164-A2A3-2A47BAC55D0E",variableType:-4}
 */
var _isModifica = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"FE0FB521-AD25-4943-94EB-78E99819C99A",variableType:8}
 */
var _MM;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C719B979-19C1-4CE7-B81A-AFC038DAFDBC",variableType:8}
 */
var _yy;

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"33934A32-4AD9-4105-9437-2D8C27A92166"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
	return;
}

/**
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"AAF26EE4-E408-4E8E-A47E-7CF30A5B863B"}
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
 * @properties={typeid:24,uuid:"94D9EEF8-CD1F-4161-B63C-0676D9F92199"}
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
 * @properties={typeid:24,uuid:"1F05D163-2B02-45A6-976B-DB191D4D9BF5"}
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
 * @properties={typeid:24,uuid:"80ADD5E0-4855-4583-9BE9-A5A0459709AE"}
 */
function onDataChangeSenso(oldValue, newValue, event) {
	
//	sensocambiato = true;
    return true
}
