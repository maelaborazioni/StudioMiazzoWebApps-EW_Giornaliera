/**
 * @properties={typeid:24,uuid:"986971D6-F54E-4645-9B31-E544809A85CE"}
 */
function mostraTabs()
{
	var frmAcquisizioneName = forms.giorn_flusso_acquisizione.controller.getName();
	var frmOperativaName = forms.giorn_flusso_operativa.controller.getName();
	var frmControlloName = forms.giorn_flusso_controllo.controller.getName();
	var frmInvioName = forms.giorn_flusso_invio.controller.getName();
	
	aggiornaTabForms(frmAcquisizioneName,frmOperativaName,frmControlloName,frmInvioName);
}

/**
 * @param {String} frmAcquisizioneName
 * @param {String} frmOperativaName
 * @param {String} frmControlloName
 * @param {string} frmInvioName
 *
 * @properties={typeid:24,uuid:"A1FD0A05-AD59-4F40-89D6-6A38FB889077"}
 */
function aggiornaTabForms(frmAcquisizioneName,frmOperativaName,frmControlloName,frmInvioName)
{
	var frmAcquisizione = forms[frmAcquisizioneName];
	var frmOperativa = forms[frmOperativaName];
	var frmControllo = forms[frmControlloName];
	var frmInvio = forms[frmInvioName];
	
	var frm = forms.svy_nav_fr_openTabs;
	if(frm.vSelectedTab != null 
			&& globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	{
		var idDitta = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].idditta;
		var periodo = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].periodo || (globals.TODAY.getFullYear() * 100 + globals.TODAY.getMonth() + 1);
		var tipologiaDitta = globals.getTipologiaDitta(idDitta);
		var isInterinale = globals.isInterinale(idDitta);
		
		switch (isInterinale ? globals.haOrologio(globals.getDittaRiferimento(idDitta)) : globals.haOrologio(idDitta))
		{
			case 0:
				frmAcquisizione.elements['btn_scarica'].visible = 
					frmAcquisizione.elements['lbl_scarica'].visible = 
						frmAcquisizione.elements['lbl_scarica_info'].visible = false;
				frmControllo.elements['btn_stampa_cartolina'].visible = 
					frmControllo.elements['lbl_stampa_cartoline'].visible = 
						frmControllo.elements['lbl_stampa_cartoline_info'].visible = false;
				frmControllo.elements['btn_stampa_anomalie'].visible = 
					frmControllo.elements['lbl_stampa_anomalie'].visible =
					   frmControllo.elements['lbl_stampa_anomalie_info'].visible = false;
				frmOperativa.elements['btn_compila'].visible = 
				   frmOperativa.elements['lbl_compila'].visible = 
					   frmOperativa.elements['lbl_compila_info'].visible = true;
				frmOperativa.elements['btn_conteggia_timbrature'].visible = 
					frmOperativa.elements['lbl_conteggia'].visible = 
						frmOperativa.elements['lbl_conteggia_info'].visible = false;
				if(globals.useTracciatiEsterni(idDitta,periodo))	
				{
					frmAcquisizione.elements['lbl_scarica_tracciato_info'].visible =
					frmAcquisizione.elements['lbl_scarica_tracciato'].visible =
					frmAcquisizione.elements['btn_scarica_tracciato'].visible = true;
				
					frmAcquisizione.elements['btn_scarica_tracciato'].setLocation(670,5);
					frmAcquisizione.elements['lbl_scarica_tracciato'].setLocation(710,5);
					frmAcquisizione.elements['lbl_scarica_tracciato_info'].setLocation(710,25);
					
					frmAcquisizione.elements['lbl_scarica_tracciato_info'].enabled =
					frmAcquisizione.elements['lbl_scarica_tracciato'].enabled =
					frmAcquisizione.elements['btn_scarica_tracciato'].enabled = scopes.giornaliera.isMeseDaAttivare({idditta : idDitta, periodo : periodo});
				}
				break;
			case 1:
			    frmAcquisizione.elements['btn_scarica'].visible = 
			       frmAcquisizione.elements['lbl_scarica'].visible = 
				      frmAcquisizione.elements['lbl_scarica_info'].visible = true;
			    frmControllo.elements['btn_stampa_cartolina'].visible = 
				   frmControllo.elements['lbl_stampa_cartoline'].visible = 
					  frmControllo.elements['lbl_stampa_cartoline_info'].visible = true;
			    frmControllo.elements['btn_stampa_anomalie'].visible = 
				   frmControllo.elements['lbl_stampa_anomalie'].visible =
				      frmControllo.elements['lbl_stampa_anomalie_info'].visible = true;
		        frmOperativa.elements['btn_compila'].visible = 
				   frmOperativa.elements['lbl_compila'].visible = 
					   frmOperativa.elements['lbl_compila_info'].visible = false;
				frmOperativa.elements['btn_conteggia_timbrature'].visible = 
					frmOperativa.elements['lbl_conteggia'].visible = 
						frmOperativa.elements['lbl_conteggia_info'].visible = true;
				if(globals.useTracciatiEsterni(idDitta,periodo))
				{
					frmAcquisizione.elements['lbl_scarica_tracciato_info'].visible =
					frmAcquisizione.elements['lbl_scarica_tracciato'].visible =
					frmAcquisizione.elements['btn_scarica_tracciato'].visible = true;
					
					frmAcquisizione.elements['lbl_scarica_tracciato_info'].enabled =
					frmAcquisizione.elements['lbl_scarica_tracciato'].enabled =
					frmAcquisizione.elements['btn_scarica_tracciato'].enabled = scopes.giornaliera.isMeseDaAttivare({idditta : idDitta, periodo : periodo});
				}
		        break;
			default:
				globals.ma_utl_showErrorDialog('Identificazione presenza orologio non riuscita, contattare il gruppo informatico', 'Errore tracciati');
				break;
		}
	
		// per le ditte di tipo non standard disabilitiamo lo scarico della giornaliera e le operazioni
		// di controlli preliminari,di predisposizione ed invio perchè superflue
		if (idDitta)
		{			   
			frmAcquisizione.elements['btn_scarica_giornaliera'].enabled = tipologiaDitta == globals.Tipologia.STANDARD;
			frmOperativa.elements['btn_controlli_preliminari'].enabled = (tipologiaDitta == globals.Tipologia.STANDARD 
					                                                   || tipologiaDitta == globals.Tipologia.GESTITA_UTENTE);
			frmInvio.elements['btn_chiusura_mese'].enabled = (tipologiaDitta == globals.Tipologia.STANDARD 
                                                           || tipologiaDitta == globals.Tipologia.GESTITA_UTENTE);
			frmInvio.elements['btn_invia_giornaliera'].enabled = (tipologiaDitta == globals.Tipologia.STANDARD 
                                                               || tipologiaDitta == globals.Tipologia.GESTITA_UTENTE);
			
		}
		
		// verifica l'eventuale presenza di un blocco impostato sull'invio della giornaliera tramite chiave
		if(globals.ma_utl_hasKey(globals.Key.BLOCCA_INVIO_GIORNALIERA))
		{
			frmInvio.elements['btn_chiusura_mese'].enabled = 
				frmInvio.elements['btn_invia_giornaliera'].enabled = false;
		}
		
		if(globals.ma_utl_hasKey(globals.Key.BLOCCA_IMPORTAZIONE_TIMBR))
		{
			frmAcquisizione.elements['btn_scarica'].enabled = false;
		}
		
		if(globals.ma_utl_hasKey(globals.Key.FTP_NO_CONTROLLO))
		{
			frmAcquisizione.elements['btn_ricevi_tabelle'].enabled =
				frmAcquisizione.elements['btn_scarica_giornaliera'].enabled = false;
		}
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DD5648C1-F041-42B0-A88F-1852EF8DEDCB"}
 */
function onShow(firstShow, event) {
	
	var frm = forms.svy_nav_fr_openTabs;
	if(!firstShow 
			&& frm.vSelectedTab != null 
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
 * @properties={typeid:24,uuid:"5C601B9D-C0B7-43D9-A377-CB3D332105F5"}
 */
function onLoad(event) 
{
	return _super.onLoad(event);
}
