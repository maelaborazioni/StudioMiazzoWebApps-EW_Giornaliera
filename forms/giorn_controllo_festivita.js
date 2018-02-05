/**
 * @properties={typeid:35,uuid:"B47D4DEB-6F5A-4619-B00A-3DAA43CC2FD2",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"C5731392-0EF9-43F7-BB61-27ADED4FD400",variableType:-4}
 */
var vOpenProg = false;

/**
 * @properties={typeid:35,uuid:"579A7890-866D-4D2F-A4A8-CCF1A877337B",variableType:-4}
 */
var vProgParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"EB8A9E65-BD26-4A57-8E64-7D1E1343A993",variableType:-4}
 */
var vPrimoIngresso = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"714A8F0F-D926-46E4-B9DC-FF198275A700"}
 */
function onActionBtnGiornaliera(event)
{	
	var params = {
    	processFunction: process_controllo_festivita,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: '',
		fontType: 'Arial,4,25',
		processArgs: [event]
    }
    
    plugins.busy.block(params);
	
}

/**
 * Lancia le operazioni di attivazione del mese o di controllo turnisti 
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"256DA0E5-A507-469E-B89D-AD60DE89F580"}
 */
function process_controllo_festivita(event)
{
	try
	{
		globals.svy_mod_closeForm(event);
		globals.controlloTurni(vParams,vOpenProg,vProgParams,vPrimoIngresso);
	}
	catch(ex)
	{
		var msg = 'Metodo process_controllo_festivita : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"65EBF361-ABCB-4129-9493-85F8E354A9B3"}
 * @AllowToRunInFind
 * @SuppressWarnings(wrongparameters)
 */
function onActionBtnCalendario(event)
{
	globals.svy_mod_closeForm(event);
	
	var program = 'AGD_Presenze';
	
	globals.svy_nav_showForm('agd_header_dtl', program, true, true,null,null,{selected_tab: 3})
	globals.lookup(vParams['idditta'], 'agd_header_dtl')
	
}

/**
*
* @param {Boolean} _firstShow
* @param {JSEvent} _event
*
* @properties={typeid:24,uuid:"A1D5D830-1076-4634-84E3-385FEBC5B04E"}
*/
function onShowForm(_firstShow, _event) 
{
	 _super.onShowForm(_firstShow, _event);
	 plugins.busy.prepare();
}
