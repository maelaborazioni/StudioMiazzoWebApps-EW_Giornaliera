/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5F18EE59-5A82-48EC-B89C-582508E50F5B"}
 */
function onShow(firstShow, event)
{
	var frmOpt = forms.giorn_list_eventi_sel_ditta;
    var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),44,event.getSource().controller.getName().length));
	var idDitta = globals.getDitta(idLavoratore);
	var isInterinale = globals.isInterinale(idDitta);
	var frm = forms.giorn_vista_mensile_pannello;
	frm.vCurrCaseOfUse = globals.TipoUtilizzoGiornalieraPannello.EVENTI_GIORNALIERA_PANNELLO;
	
	// abilita o meno la visualizzazione del tab delle timbrature
	if(!globals.haOrologio(isInterinale ? globals.getDittaRiferimento(idDitta) : idDitta))
	   frm.abilitaTabTimbrature(false,idDitta,true);
	else
	   frm.abilitaTabTimbrature(true,idDitta,true);
		
	// abilita o meno la visualizzazione del tab delle commesse
	frm.abilitaTabCommesse(globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) && globals.haCommesse(forms.giorn_header.idditta));
		
	// disegno della giornaliera e visualizzazione finestra di dialogo
	frm.preparaGiornaliera(idLavoratore,frmOpt.annoRif,frmOpt.meseRif,globals.TipoGiornaliera.NORMALE,null,true);
	
	// "ritorno" al primo tab per poter visualizzare i dati delle squadrature
	forms['giorn_list_squadrati_ditta_tab_temp'].elements['tab_ev_ditta_tabpanel_' + idLavoratore].tabIndex = 1;

	globals.ma_utl_showFormInDialog(frm.controller.getName()
		                            ,'Giornaliera dipendente : ' + globals.getCodLavoratore(idLavoratore) + ' - ' + globals.getNominativo(idLavoratore),null,true);
}
