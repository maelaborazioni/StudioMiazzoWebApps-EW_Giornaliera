/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"5A7D3EBE-F01D-417B-A6E5-54817FD1C909"}
 */
function onShow(firstShow, event)
{
	var frmOpt = forms.giorn_visualizza_copertura_situazione;
    var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),43,event.getSource().controller.getName().length));
	var idDitta = globals.getDitta(idLavoratore);
	var frm = forms.giorn_vista_mensile_pannello;
	frm.vCurrCaseOfUse = globals.TipoUtilizzoGiornalieraPannello.RIEPILOGO_EVENTI;
	
	// recupero degli eventi selezionabili
	globals.FiltraEventiSelezionabili(idLavoratore,frmOpt.vDal.getFullYear() * 100 + frmOpt.vDal.getMonth() + 1,globals.TipoGiornaliera.NORMALE);
	
	// abilita o meno la visualizzazione del tab delle timbrature
	if(!globals.haOrologio(idDitta))
	   frm.abilitaTabTimbrature(false,idDitta,true);
	else
	   frm.abilitaTabTimbrature(true,idDitta,true);
		
	// abilita o meno la visualizzazione del tab delle commesse
	frm.abilitaTabCommesse(globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) && globals.haCommesse(idDitta));
		
	// disegno della giornaliera e visualizzazione finestra di dialogo
	frm.preparaGiornaliera(idLavoratore,frmOpt.vDal.getFullYear(),frmOpt.vDal.getMonth() + 1,globals.TipoGiornaliera.NORMALE,null,true);
	
	// "ritorno" al primo tab per poter visualizzare i dati delle squadrature
	forms['giorn_visualizza_copertura_ditta_tab_temp'].elements['tab_giornaliera_ditta_tabpanel_' + idLavoratore].tabIndex = 1;

	globals.ma_utl_showFormInDialog(frm.controller.getName()
		                            ,'Giornaliera dipendente : ' + globals.getCodLavoratore(idLavoratore) + ' - ' + globals.getNominativo(idLavoratore),null,true);
}
