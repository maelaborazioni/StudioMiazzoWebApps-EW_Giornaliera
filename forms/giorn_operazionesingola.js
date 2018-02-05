/**
 * @properties={typeid:35,uuid:"F7616DB6-91EF-48C4-AE73-807BCE65248E",variableType:-4}
 */
var vOperation = null;

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"F6B2448D-2187-41BD-9E51-27ED1AD9CADA",variableType:-4}
 */
var vOperationArgs = null;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"40F7E14D-17DF-4A71-AE3B-8E74056B2002",variableType:-4}
 */
var vArrDip = []

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"C628AFC6-B3E9-410D-89D7-9113C06A4924"}
 */
function startOperation(event)
{
	/** @type {Array} */
	var giorniSelezionati = forms[elements.giorni_tabless.getTabFormNameAt(1)].getSelectedElements();
	/** @type {Array} */
	var dipendentiSelezionati = vArrDip
	
	if(giorniSelezionati.length === 0)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un giorno ed un dipendente', 'i18n:hr.msg.attention');
		return;
	}
	
	if(vOperationArgs)
		vOperationArgs = [dipendentiSelezionati, giorniSelezionati].concat(vOperationArgs);
	else
		vOperationArgs = [dipendentiSelezionati, giorniSelezionati];
		
	// Start the operation and close the dialog
	globals.operazioneSingola(vOperation, vOperationArgs);	
	globals.svy_mod_closeForm(event);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"FAE164B6-C63D-485E-BBB0-CF41757CED91"}
 */
function onHide(event)
{
	if(_super.onHide(event))
	{
		vOperationArgs = null;
		return true;
	}
	
	return false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EC8E6297-BFDB-4901-A60C-C83EE998C991"}
 */
function cancelOperation(event)
{
	globals.svy_mod_closeForm(event);
}
