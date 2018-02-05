/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"F61C9784-8B83-46C6-9915-A92BBFD671A7",variableType:-4}
 */
var canClose = false;

/**
 * @type {Continuation}
 * 
 * @properties={typeid:35,uuid:"234A1C2C-A76E-4E62-A1B4-1B942FE8EF7D",variableType:-4}
 */
var dialogContinuation = null;

/**
 * @properties={typeid:35,uuid:"286AC725-CD8D-49DD-9FC6-152318BF5E21",variableType:-4}
 */
var returnValue = null;

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 *
 * @properties={typeid:24,uuid:"ED9C65BB-2C28-4DA2-A29F-F4CD1D9D9A2E"}
 */
function onHide(event) 
{
	if(canClose)
	{
		if(dialogContinuation && application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT)
			dialogContinuation(returnValue);
		
		return true;
	}

	return false;
}
