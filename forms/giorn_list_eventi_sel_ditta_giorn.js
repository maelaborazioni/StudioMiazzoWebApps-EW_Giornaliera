/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B8EEA518-5D63-405E-87D6-BBFD2C148F2A"}
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);
	
	var frm = forms.giorn_list_squadrati_ditta;
    globals.apriGiornaliera(event,frm.idditta,frm.annoRif,frm.meseRif,frm.annoRif,frm.meseRif,globals.getGruppoInstallazioneDitta(frm.idditta),'');
	var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),34,event.getSource().controller.getName().length));
    globals.lookup(idLavoratore,forms.giorn_header.controller.getName());
}
