/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4A8B97E7-5B72-4B12-96DE-C76A5E49A7F0"}
 */
function showInfo(event) 
{
//	var frm = forms.rp_elenco_richieste_tbl_info;
//	var fs = frm.foundset;
//	globals.lookupFoundset(foundset.idlavoratoregiustificativotesta,fs);
//	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Note richiesta');
}

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"1F39D9A3-156D-4483-84F9-3BC6E93F403B"}
 */
function onRecordSelection(_event, _form) {
	
	_super.onRecordSelection(_event, _form);
	
//	var frm = forms.rp_elenco_richieste;
//	frm.vNote = foundset.note;
//	frm.vNoteApp = foundset.noteapp;
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"FB50D6B1-6873-41F6-9F31-9A9BA26B9C89"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
   _super.onShowForm(_firstShow, _event)
   
   globals.refreshElencoTimbrature(_event,false);
}
