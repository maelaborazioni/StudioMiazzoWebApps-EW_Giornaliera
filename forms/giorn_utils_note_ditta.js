/**
 * Conferma le modifiche e chiude la finestra
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * 
 * @properties={typeid:24,uuid:"47A7213C-B7E8-42A1-AFD2-372488BCC4B6"}
 */
function confermaNote(event) {
	
//	if(!databaseManager.commitTransaction())
//	{
//		globals.ma_utl_showErrorDialog('Salvataggio dati non riuscito, riprovare','Conferma note')
//		databaseManager.rollbackTransaction()
//	}
//
//	globals.svy_nav_dc_setStatus('browse','giorn_utils_note_ditta',true)

	globals.svy_mod_closeForm(event)
}

/**
 * Annulla eventuali modifiche e chiude la finestra
 * 
 * @param {JSEvent} event
 *
 * 
 *
 * @properties={typeid:24,uuid:"2540A077-EEE3-448B-8980-1EB495D44C74"}
 */
function annullaNote(event){
	
//	databaseManager.rollbackTransaction()
	
	globals.svy_nav_dc_setStatus('browse','giorn_utils_note_ditta',true)

	globals.svy_mod_closeForm(event)
	
}
/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AE33863B-CF8C-4CF3-8631-99206A844C1F"}
 */
function onHide(event) {
	
	return annullaNote(event);
}
