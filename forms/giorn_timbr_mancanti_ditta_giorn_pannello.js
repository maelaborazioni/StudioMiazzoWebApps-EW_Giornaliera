
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"42314E1A-35D1-4300-88A7-51B1FCC2C22C"}
 */
function onShow(firstShow, event)
{
	var frmOpt = forms.giorn_timbr_mancanti_ditta;
    var idLavoratore = parseInt(utils.stringMiddle(event.getSource().controller.getName(),43,event.getSource().controller.getName().length));
	var idDitta = globals.getDitta(idLavoratore);
	var frm = forms.giorn_vista_mensile_pannello;
	frm.vCurrCaseOfUse = globals.TipoUtilizzoGiornalieraPannello.ANOMALIE_TIMBRATURE_PANNELLO;
	
	// abilita o meno la visualizzazione del tab delle timbrature
	if(!globals.haOrologio(idDitta))
	   frm.abilitaTabTimbrature(false,idDitta,true);
	else
	   frm.abilitaTabTimbrature(true,idDitta,true);
		
	// abilita o meno la visualizzazione del tab delle commesse
	frm.abilitaTabCommesse(globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) && globals.haCommesse(forms.giorn_header.idditta));
	
	// disegno della giornaliera e visualizzazione finestra di dialogo
	frm.preparaGiornaliera(idLavoratore,frmOpt.annoRif,frmOpt.meseRif,globals.TipoGiornaliera.NORMALE,null,true,true);
	
	// "ritorno" al primo tab per poter visualizzare i dati delle squadrature
	forms['giorn_timbr_mancanti_ditta_tab_temp'].elements['tab_timbr_mancanti_ditta_tabpanel_' + idLavoratore].tabIndex = 1;
	
	globals.ma_utl_showFormInDialog(frm.controller.getName()
		                            ,'Giornaliera dipendente : ' + globals.getCodLavoratore(idLavoratore) + ' - ' + globals.getNominativo(idLavoratore),null,true);
}
