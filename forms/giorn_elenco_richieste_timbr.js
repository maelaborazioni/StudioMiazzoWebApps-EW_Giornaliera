/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"8E08512C-BF43-4932-B2E4-07475D63118C"}
 */
var vNote = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"F1066FF2-091C-4597-85DB-403717C19EF8"}
 */
var vNoteApp = null;

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"4B5886BD-2136-45C1-8904-3B6061E9F9BE"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	
	var frm = forms.giorn_elenco_richieste_timbr_situazione;
	frm.vDal = null;
	frm.vAl = null;
	if(_firstShow)
	   frm.goToBrowseVisualizzaSituazione(_event);
    	
}

/** 
 * @param event
 *
 * @properties={typeid:24,uuid:"4BDAC7B1-1E0C-466F-80FF-EEB32680E459"}
 */
function onHide(event) 
{
	_super.onHide(event);
	
	var frm = forms.giorn_elenco_richieste_timbr_situazione;
	globals.ma_utl_setStatus(globals.Status.BROWSE,frm.controller.getName());
}
