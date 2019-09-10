/**
 * @param {Number} [idDitta]
 * 
 * @properties={typeid:24,uuid:"467E49C8-0A51-4B5F-B376-93987278BFF1"}
 */
function mostraTabs(idDitta)
{
	elements.tab_iniziale.removeAllTabs()
	elements.tab_centrale_l.removeAllTabs()
	elements.tab_centrale_r.removeAllTabs()
	
	var isInterinale = globals.isInterinale(idDitta);
	
	if (globals._tipoConnessione == globals.Connessione.SEDE) {
		
		var tipoInst = globals.getTipoInstallazione(forms.giorn_header.idditta,globals.getPeriodo());
		
		switch (tipoInst) {	
			
		case 0:
			elements.tab_iniziale.addTab('giorn_flusso_iniziale_cartacea', 'Ditta cartacea', null, null);
			break;
		case 1:
			elements.tab_iniziale.addTab('giorn_flusso_iniziale_dischetto', 'Scarico da file', null, null);
			elements.tab_centrale_r.addTab("giorn_flusso_centrale_solo_1", 'Stampa anomalie/cartoline', null, null);
			break;
		case 2:
			elements.tab_iniziale.addTab('giorn_flusso_iniziale_ftp', 'Scarico da ftp', null, null);
			elements.tab_centrale_r.addTab('giorn_flusso_centrale_solo_1', 'Stampa anomalie/cartoline', null, null);
			break;
		default:
			globals.ma_utl_showErrorDialog('Tipologia di tracciato sconosciuta, contattare il gruppo informatico', 'Errore tracciati')
			break;
		}
		
		forms.giorn_flusso_finale.elements.tab_flusso_finale_1.removeAllTabs();
		forms.giorn_flusso_finale.elements.tab_chiusura_mese.addTab('giorn_flusso_finale_chiusura');
		forms.giorn_flusso_finale.elements.tab_flusso_finale_1.addTab('giorn_flusso_finale_invio');
		forms.giorn_flusso_finale.elements.tab_flusso_finale_1.visible = true;
//		forms.giorn_flusso_finale_invio.elements.lbl_invia_giornaliera_info.text = 'Invia la definitiva al cliente';
		elements.tab_finale_sede.visible = true;
		
	} else {
		
		switch (globals.haOrologio(isInterinale ? globals.getDittaRiferimento(idDitta) : idDitta)) {

		case 0:
			elements.tab_iniziale.addTab('giorn_flusso_iniziale_cliente_compiladalal','Compilazione giornaliera',null,null);
			forms.giorn_flusso_centrale_comune.elements.btn_stampa_cartolina.visible = false;
			forms.giorn_flusso_centrale_comune.elements.lbl_stampa_cartoline.visible = false;
			forms.giorn_flusso_centrale_comune.elements.lbl_stampa_cartoline_info.visible = false;
			if (globals.getTipologiaDitta(forms.giorn_header.idditta)) 
				forms.giorn_flusso_iniziale_cliente_compiladalal.elements.btn_scarica_giornaliera.enabled = false;
			
			break;
		case 1:
			elements.tab_iniziale.addTab('giorn_flusso_iniziale_cliente_scaricatimbr');
			forms.giorn_flusso_dtl.elements.tab_centrale_r.addTab('giorn_flusso_centrale_solo_1', 'Stampa anomalie/cartoline', null, null);
			forms.giorn_flusso_centrale_comune.elements.btn_stampa_cartolina.visible = true;
			forms.giorn_flusso_centrale_comune.elements.lbl_stampa_cartoline.visible = true;
			forms.giorn_flusso_centrale_comune.elements.lbl_stampa_cartoline_info.visible = true;
			if (globals.getTipologiaDitta(forms.giorn_header.idditta)) 
				forms.giorn_flusso_iniziale_cliente_scaricatimbr.elements.btn_scarica_giornaliera.enabled = false;
			
			break;
		case 2:
		elements.tab_iniziale.addTab('giorn_flusso_iniziale_cliente_scaricatimbr');
		forms.giorn_flusso_dtl.elements.tab_centrale_r.addTab('giorn_flusso_centrale_solo_1', 'Stampa anomalie/cartoline', null, null);
		forms.giorn_flusso_centrale_comune.elements.btn_stampa_cartolina.visible = true;
		forms.giorn_flusso_centrale_comune.elements.lbl_stampa_cartoline.visible = true;
		forms.giorn_flusso_centrale_comune.elements.lbl_stampa_cartoline_info.visible = true;
		if (globals.getTipologiaDitta(forms.giorn_header.idditta)) 
			forms.giorn_flusso_iniziale_cliente_scaricatimbr.elements.btn_scarica_giornaliera.enabled = false;
		
		break;
			
		default:
			globals.ma_utl_showErrorDialog('Identificazione presenza orologio non riuscita, contattare il gruppo informatico', 'Errore tracciati');
			break;
		}

		forms.giorn_flusso_finale.elements.tab_flusso_finale_1.removeAllTabs();
		forms.giorn_flusso_finale.elements.tab_chiusura_mese.addTab('giorn_flusso_finale_chiusura');
		forms.giorn_flusso_finale.elements.tab_flusso_finale_1.addTab('giorn_flusso_finale_invio');
		forms.giorn_flusso_finale.elements.tab_flusso_finale_1.visible = true;
//		forms.giorn_flusso_finale_invio.elements.lbl_invia_giornaliera_info.text = 'Invia la giornaliera allo studio';
		elements.tab_finale_sede.visible = false;
		
		// se la ditta è esterna od interinale disabilitiamo le opzioni di chiusura ed invio che sono superflue
		if (globals.getTipologiaDitta(forms.giorn_header.idditta)) {
			forms.giorn_flusso_finale.elements.btn_controlli_preliminari.enabled = false;
			forms.giorn_flusso_finale_invio.elements.btn_invia_giornaliera.enabled = false;
			forms.giorn_flusso_finale_chiusura.elements.btn_chiusura_mese.enabled = false;
		}
	}
	elements.tab_centrale_l.addTab('giorn_flusso_centrale_comune','Gestione ratei',null,null)
	if (globals.getTipologiaDitta(forms.giorn_header.idditta)
			&& forms.giorn_flusso_centrale_comune.elements.btn_gestione_ratei) 
		forms.giorn_flusso_centrale_comune.elements.btn_gestione_ratei.enabled = false;
	
//	elements.tab_intestazione.enabled = false;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"110395F9-187E-405C-8FF5-B24444E4D4A0"}
 */
function onShow(firstShow, event) {
	
	var frm = forms.svy_nav_fr_openTabs;
	if(frm.vSelectedTab != null 
			&& globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	   globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].selected_tab = 1;
	mostraTabs();
    globals.aggiornaPeriodoIntestazione();
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"89CE08A2-54F7-483F-8AB2-6F32E5EA86C0"}
 */
function onLoad(event) 
{
	return _super.onLoad(event);
}
