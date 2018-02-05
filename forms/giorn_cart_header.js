/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"65313EED-CDF7-4D7D-85FA-2C1927B02DDF"}
 */
function onShowForm(_firstShow, _event) 
{
	var soloCartolina = true;
	_super.onShowForm(_firstShow, _event, soloCartolina);
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F081C09C-A477-4D2E-A2E3-EBFA8231E846"}
 */
function onRecordSelection(event, _form)
{
	var soloCartolina = true;
	_super.onRecordSelection(event, _form,soloCartolina);
}


