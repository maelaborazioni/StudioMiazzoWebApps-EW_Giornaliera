/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"03798165-39A8-4991-9B93-7CF0DB321D22"}
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
 * @properties={typeid:24,uuid:"805E007E-B966-48FB-B8F3-8ADD9021E053"}
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
 * @properties={typeid:24,uuid:"005B8006-CC9D-4A5C-B42F-E7FEB514058F"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event)
    
	globals.refreshElencoTimbrature(_event,true);
}
