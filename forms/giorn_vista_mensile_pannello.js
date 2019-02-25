/**
 * @properties={typeid:35,uuid:"30C9AC9B-76CD-41D7-9562-CD8B792042FE",variableType:-4}
 */
var vCurrCaseOfUse = globals.TipoUtilizzoGiornalieraPannello.RIEPILOGO_EVENTI; 

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"735F9E70-CA77-4A21-B523-AD9F55EDD66D"}
 */
function onShow(firstShow, event)
{
	// aggiorna le intestazioni per la giornaliera standard
	aggiornaIntestazioni(false);
	
	if(!globals.haOrologio(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].idditta))
	   abilitaTabTimbrature(false);
	else
	   abilitaTabTimbrature(true);
			
	// abilita o meno la visualizzazione del tab delle commesse
	abilitaTabCommesse(globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE_COMMESSE));// && globals.haCommesse(forms.giorn_header.idditta));
	
	return;
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0FFD0C99-5750-448E-8320-71F5D3E350D0"}
 */
function onLoad(event) {
	return;
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E6194645-6E5D-4E59-A413-20019CF33A28"}
 */
function onHide(event) 
{
	var idLavoratore = forms[event.getFormName()].vIdLavoratore;
	var periodo = forms[event.getFormName()].vPeriodo;
	_super.onHide(event);
	
	visualizzaSituazioneAggiornata(idLavoratore,periodo);
}

/**
 * In base alla situazione in cui è stata aperta la giornaliera 'da pannello', aggiorna la situazione del lavoratore
 * che potrebbe essere stata modificata
 * 
 * @param {Number} idLav
 * @param {Number} [periodo]
 * 
 * @properties={typeid:24,uuid:"FECF554A-AA95-445D-B51A-13F8529D5FBB"}
 */
function visualizzaSituazioneAggiornata(idLav,periodo)
{
	switch(vCurrCaseOfUse)
	{
		case globals.TipoUtilizzoGiornalieraPannello.RIEPILOGO_EVENTI:
			var frmOpt = forms.giorn_visualizza_copertura_situazione;
			forms['giorn_visualizza_copertura_dipendente_' + idLav].preparaGiornalieraLavoratore(idLav,frmOpt.vDal,frmOpt.vAl);
			break;
		case globals.TipoUtilizzoGiornalieraPannello.ANOMALIE_TIMBRATURE_PANNELLO:
			var ultimoGgScarico = globals.getDataUltimoScarico([globals.getDitta(idLav)]);
			var ultimoGgNelMese = globals.getLastDatePeriodo(periodo || globals.getPeriodo());
			var ultimoGgDisponibile = (ultimoGgScarico > ultimoGgNelMese) ? ultimoGgNelMese : ultimoGgScarico;
		    globals.aggiornaAnomalieTimbratureDipendente(idLav,globals.getAnno(),globals.getMese(),ultimoGgDisponibile.getDate());	
		break;
		case globals.TipoUtilizzoGiornalieraPannello.ANOMALIE_EVENTI_PANNELLO:
			globals.aggiornaSquadratureGiornalieraDipendente(idLav
				                                             ,periodo ? globals.getLastDatePeriodo(periodo).getFullYear() : globals.getAnno()
				                                             ,periodo ? globals.getLastDatePeriodo(periodo).getMonth() + 1 : globals.getMese());
			break;
		case globals.TipoUtilizzoGiornalieraPannello.EVENTI_GIORNALIERA_PANNELLO:
			globals.aggiornaEventiGiornalieraDipendente(idLav
				                                        ,periodo ? globals.getLastDatePeriodo(periodo).getFullYear() : globals.getAnno()
			                                            ,periodo ? globals.getLastDatePeriodo(periodo).getMonth() + 1 : globals.getMese());
			break;
		default:
			break;
	}
	
}
