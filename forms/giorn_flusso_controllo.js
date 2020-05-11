/**
 * Apre la finestra con le opzioni per il lancio della stampa delle presenze in giornaliera
 *  
 * @properties={typeid:24,uuid:"AABA6340-39E4-4BE2-AB25-465D15F13DFB"}
 */
function stampaGiornalieraPannello()
{	
	var anno = globals.getAnno();
	var mese = globals.getMese();
	
	forms.stampa_giornaliera_opzioni.vAnno = anno;
	forms.stampa_giornaliera_opzioni.vMese = mese;
	
	var form = forms.stampa_giornaliera;
	form.selectedElements = forms && forms.giorn_header && forms.giorn_header.idlavoratore ? [forms.giorn_header.idlavoratore] : [];	
	var formName = form.controller.getName();
	var fs = forms.giorn_header.lavoratori_to_ditte;
	
	globals.abilitaRaggruppamenti(forms.stampa_filtri_anagrafici.controller.getName(),true);
	globals.ma_utl_setStatus(globals.Status.EDIT, formName);
	globals.ma_utl_showFormInDialog(formName, 'Opzioni di stampa', fs);
}

/**
 * Apre la finestra con le opzioni per il lancio della stampa delle cartoline presenze
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"BFCA26B7-ECD3-4943-B2EC-682F68BC2575"}
 */
function stampaCartolinePresenzePannello(event)
{
	var formOpt = forms.stampa_cartolina_presenze_opzioni;
	var form = forms.stampa_cartolina_presenze;
	var formName = form.controller.getName();
	form.selectedElements = forms && forms.giorn_header && forms.giorn_header.idlavoratore ? [forms.giorn_header.idlavoratore] : [];
	formOpt.vPeriodo = formOpt.vPeriodoAl = new Date(globals.getAnno(),globals.getMese()-1,1);
		
	var fs = forms.giorn_header.lavoratori_to_ditte;
	
	globals.abilitaRaggruppamenti(forms.stampa_filtri_anagrafici.controller.getName(),true);
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	globals.ma_utl_showFormInDialog(formName, 'Opzioni di stampa', fs);
}

/**
 * Apre la finestra con le opzioni per il lancio della stampa delle anomalie sulle timbrature
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"FB44DED9-5BBC-43EC-BAC1-2C298C9F5C3B"}
 */
function stampaAnomalieTimbraturePannello(event)
{
	var form = forms.stampa_anomalie_timbrature.controller.getName();
	
	var fs = forms.giorn_header.lavoratori_to_ditte;
	
	globals.abilitaRaggruppamenti(forms.stampa_filtri_anagrafici.controller.getName(),true);
	globals.ma_utl_setStatus(globals.Status.EDIT,form);
	globals.ma_utl_showFormInDialog(form, 'Opzioni di stampa', fs);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"33F4124E-876B-4F0F-B88A-554141CFA195"}
 */
function ottieniRapportoTracciatoMensa(event) 
{
	
	// TODO richiesta di selezione tipo tracciato (se esiste)
	var iddittamensa = 3;
	
	globals.generaTracciatoMensa(forms.giorn_header.idditta
		                         ,globals.getPeriodo()
								 ,iddittamensa);
	
	return null;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0A8DDCB1-D5FE-4558-8D54-C2DECF20BA74"}
 */
function onShow(firstShow, event) 
{
    var enabledMensa = globals.usaMensa(forms.giorn_header.idditta);
    elements.btn_stampa_tracciato_mensa.visible =
    	elements.lbl_stampa_tracciato_mensa.visible = 
    		elements.lbl_stampa_tracciato_mensa_info.visible = enabledMensa;
    
}
