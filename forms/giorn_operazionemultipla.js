/**
 * @properties={typeid:35,uuid:"BE86B255-BD65-4A6B-A64D-1529043463C7",variableType:-4}
 */
var vOperation = null;

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"B78D894C-B8FD-4B43-B066-5DF59ABC98A5",variableType:-4}
 */
var vOperationArgs = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1D3B37E3-DEB1-44A0-BED7-69243DEF0328",variableType:8}
 */
var vChkSoloNonConteggiati = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"92FF7FA1-F62D-495A-AE64-676534B08370"}
 */
function startOperation(event)
{
	/** @type {Array} */
	var giorniSelezionati = forms[elements.giorni_tabless.getTabFormNameAt(1)].getSelectedElements(false,true);
	/** @type {Array} */
	var dipendentiSelezionati = forms[elements.dipendenti_tabless.getTabFormNameAt(1)].getSelectedElements(false,true);
	
	var busyMessage = '';
	
	if(!giorniSelezionati || !dipendentiSelezionati)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un <b>Giorno</b> ed almeno un <b>Dipendente</b>', 'i18n:hr.msg.attention');
		return;
	}
	
	if(vOperationArgs)
		vOperationArgs = [dipendentiSelezionati, giorniSelezionati, vChkSoloNonConteggiati].concat(vOperationArgs);
	else
		vOperationArgs = [dipendentiSelezionati, giorniSelezionati, vChkSoloNonConteggiati];
	
//	if(vOperation.name == 'compilaDalAlCommesse')
//	   busyMessage = 'Compilazione da ore su commesse in corso...';
	
	var params = {
        processFunction: process_operazione_multipla,
        message: busyMessage, 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: [event,vOperation,vOperationArgs]
    };
	plugins.busy.block(params);

}

/**
 * @param {JSEvent} event
 * @param op
 * @param {Array} opArgs
 * 
 * @properties={typeid:24,uuid:"9FE5EFD8-91BC-4FE1-A5BE-3428E660BC40"}
 */
function process_operazione_multipla(event,op,opArgs)
{	
	try
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
		globals.operazioneMultipla(op,opArgs);
	}
	catch(ex)
	{
		var msg = 'Metodo process_operazione_multipla : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"09CD2D13-BB16-4703-B36D-3CBD7E9AE74D"}
 */
function onHide(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	vOperationArgs = null;
	
	forms.giorn_operazionemultipla_aggiungievento.elements.fld_proprieta.enabled = false;	
    application.setValueListItems('vls_evento_proprieta',new Array(),new Array());
    forms.giorn_operazionemultipla_aggiungievento._oldProprieta = null;
	
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6D958095-DB32-423E-B067-5C4D4E9A8595"}
 */
function cancelOperation(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"16B4653F-15D0-428D-B84F-477802248FC6"}
 */
function onShow(firstShow, event)
{
	plugins.busy.prepare();
	vChkSoloNonConteggiati = 0;
}
