/**
 * @type {Object}
 * 
 * @properties={typeid:35,uuid:"42DDBBE4-B2FF-42D2-85D4-45CADD33DC8F",variableType:-4}
 */
var params = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4F361872-869E-4A24-AA30-EE030D0C78BD"}
 */
function confermaIncolla(event) {
	
	scopes.giornaliera.cancellaChiusuraDipPerOperazione([forms.giorn_header.idlavoratore],forms.giorn_header.idditta);
	
	var response = globals.copiaRigaInGiornaliera(params);
			
	if(response['returnValue'])
	{
	   forms.giorn_header.preparaGiornaliera();
	   globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
	}
	else
		globals.svy_mod_dialogs_global_showErrorDialog('Errore durante l\'operazione di copia/incolla','Si è verificato un errore...','Chiudi');
	
	plugins.busy.unblock()
	globals.svy_mod_closeForm(event);	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7AF2A184-1ECA-4D7C-8CF8-FB1C2CC8A392"}
 */
function annullaIncolla(event) 
{
	globals.svy_mod_closeForm(event);
}

