/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"378B717B-1BD0-4782-B041-D77794E3797B"}
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);
	
	var frm = forms.giorn_list_squadrati_ditta;
    globals.apriGiornaliera(event,frm.idditta,frm.annoRif,frm.meseRif,frm.annoRif,frm.meseRif,globals.getGruppoInstallazioneDitta(frm.idditta),'');
	var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),34,event.getSource().controller.getName().length));
    globals.lookup(idLavoratore,forms.giorn_header.controller.getName());
}
