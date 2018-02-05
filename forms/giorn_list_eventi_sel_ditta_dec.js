/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E2EDBFD7-AED6-4DB1-88D2-4409343CF137"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);
	var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),33,event.getSource().controller.getName().length));
	/** @type {RuntimeForm}*/
	var frmPannDec = forms.giorn_dd_main;
	var fsPannDec = frmPannDec.foundset;
	if(fsPannDec.find())
	{
		fsPannDec.idlavoratore = idLavoratore;
		fsPannDec.search();
		
		// "ritorno" al primo tab per poter visualizzare i dati delle squadrature
		forms['giorn_list_squadrati_ditta_tab_temp'].elements['tab_ev_ditta_tabpanel_' + idLavoratore].tabIndex = 1;
		
		globals.ma_utl_showFormInDialog(frmPannDec.controller.getName(),'Decorrenze - ' + globals.getNominativo(idLavoratore));
	}
}