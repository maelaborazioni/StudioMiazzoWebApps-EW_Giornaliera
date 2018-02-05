/**
 * @type {Object}
 * 
 * @properties={typeid:35,uuid:"93617230-7CA2-48FE-944C-30741D42A3A1",variableType:-4}
 */
var params = null
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"89DE1D57-BFB6-4F66-8DFE-4C3A2F99AC9B"}
 */
function confermaEliminazione(event) {
	
	scopes.giornaliera.cancellaChiusuraDipPerOperazione([forms.giorn_header.idlavoratore],forms.giorn_header.idditta)
	
	var _retObj = globals.eliminaEvento(params);
	var _retVal = _retObj.returnValue;
	
	if(false === _retVal)		
		globals.svy_mod_dialogs_global_showErrorDialog('i18n:svy.fr.lbl.excuse_me','Ops! Si è verificato un errore: ' + _retObj.message,'Elimina evento');	
	else
	{

		forms.giorn_header.preparaGiornaliera();
		
		databaseManager.refreshRecordFromDatabase(forms.giorn_vista_mensile_dettagli.foundset.e2giornaliera_to_e2giornalieraeventi,-1);
		
		globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		
		globals.svy_mod_closeForm(event);

	}
	
}
