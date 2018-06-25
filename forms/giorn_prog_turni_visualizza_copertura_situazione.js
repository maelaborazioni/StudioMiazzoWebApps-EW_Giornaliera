/**
 *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"0F4DAC6F-8AC8-470C-A327-814341B979E1"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	
	vTipoVisualizzazione = 3;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4A2A193B-D17B-48F2-BC19-9274A4379120"}
 * @AllowToRunInFind
 */
function onActionRefresh(event) {
	
	if(validaDate() && validaParametri())
	{	
		var params = {
	        processFunction: process_refresh,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,35',
	        processArgs: [event]
	    };
		plugins.busy.block(params);	
	}
}

/**
 * @properties={typeid:24,uuid:"78EEC4A3-54E7-4109-81E2-B69891EF68DE"}
 */
function fromOutsideRefresh()
{
	var event = new JSEvent();
	event.data = {formname : forms.giorn_prog_turni_visualizza_copertura_situazione.controller.getName()};
	
	forms.giorn_visualizza_copertura.refreshCoperturaTurni(event);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9EA407FD-5F37-422D-BF74-817EDE4BEFD3"}
 */
function process_refresh(event)
{
	try
	
	{
		setLastSelection(event);	
		forms.giorn_visualizza_copertura.refreshCoperturaTurni(event);
		goToBrowseVisualizzaSituazione(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}