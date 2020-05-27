/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7515F70E-1E4B-4EF9-8945-E95EE80AEA96"}
 */
function onActionBtnOk(event) 
{
	globals.svy_mod_closeForm(event);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"51D85D3B-8810-42F8-BF86-7AB5C27E4AB3"}
 */
function onHide(event)
{
	foundset.clear();
	_super.onHide(event);
}