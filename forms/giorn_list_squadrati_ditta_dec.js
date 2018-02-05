/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"34E033CD-4377-4325-A95E-FF3AF91A2DE8"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);
	var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),32,event.getSource().controller.getName().length));
	/** @type {RuntimeForm} */
	var frmPannDec = forms.giorn_dd_main;
	var fsPannDec = frmPannDec.foundset;
	if(fsPannDec.find())
	{
		fsPannDec.idlavoratore = idLavoratore;
		fsPannDec.search();
		
		// "ritorno" al primo tab per poter visualizzare i dati delle squadrature
		forms['giorn_list_squadrati_ditta_tab_temp'].elements['tab_squadrati_ditta_tabpanel_' + idLavoratore].tabIndex = 1;
		
		globals.ma_utl_showFormInDialog(frmPannDec.controller.getName(),'Decorrenze - ' + globals.getNominativo(idLavoratore));
	}
}
