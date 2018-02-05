/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"32E00407-1958-4732-AC4B-605652810067"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) {

	_super.onShowForm(_firstShow, _event)
//    if(foundset.find())
//    {
//    	foundset.idlavoratore = forms.giorn_header.idlavoratore
//		foundset.search()
//    }
    	
}

/**
 * Conferma le modificeh e chiude la finestra
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"900D8CC3-8B53-4F2B-ACF4-620D89D6F744"}
 */
function confermaNote(event) {
	
	if(!databaseManager.commitTransaction())
	{
		globals.ma_utl_showErrorDialog('Salvataggio dati non riuscito, riprovare','Conferma note anagrafiche');
		databaseManager.rollbackTransaction();
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Annulla eventuali modifiche e chiude la finestra
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7C5080F4-FCB3-404E-8631-A5FB30D761E9"}
 */
function annullaNote(event){
	
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
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
 * @properties={typeid:24,uuid:"6E480294-F47B-4218-A771-9044B1CA2DA5"}
 */
function onHide(event)
{
    return annullaNote(event);
}
