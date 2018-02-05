/**
 * @properties={typeid:24,uuid:"ADF46487-C115-40A3-BF86-336587278E03"}
 */
function stampaGiornaliera()
{	
	var anno = globals.getAnno();
	var mese = globals.getMese();
	
	forms.stampa_giornaliera_opzioni.vAnno = anno;
	forms.stampa_giornaliera_opzioni.vMese = mese;
	
	var form = forms.stampa_giornaliera;
	form.selectedElements = forms && forms.giorn_header && forms.giorn_header.idlavoratore ? [forms.giorn_header.idlavoratore] : [];
	var formName = form.controller.getName();
	var fs = forms.giorn_header.lavoratori_to_ditte;
	globals.ma_utl_setStatus(globals.Status.EDIT, formName);
	globals.ma_utl_showFormInDialog(formName, 'Opzioni di stampa', fs);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D12B01C2-02F3-4393-A8AC-D4B508384610"}
 */
function apriGestioneRatei(event) {
	
	forms.giorn_ratei_gestione_tab.inizializzaParametriGestioneRatei(forms.giorn_header.idditta,
		                                                             forms.giorn_header.idlavoratore,
                                                                     globals.getMese(),
		                                                             globals.getAnno());
    globals.ma_utl_showFormInDialog('giorn_ratei_gestione_tab','Gestione ratei');
}
