/**
 * 
 * @param {Object} event
 *
 * @properties={typeid:24,uuid:"9F68ED2E-70C0-4480-935B-813F623EA97A"}
 */
function closeLoadingForm(event){
	
	application.getWindow('win_loading_form').destroy()
}

/**
 * Apre la finestra di selezione del tracciato da file.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"602497CA-6A44-45CD-B47B-E2471D45C8CF"}
 */
function selezionaFileTracciato(event) {
	
	var _frmSceltaFile = forms.giorn_flusso_iniziale_scelta_file
	var ditta = forms.giorn_header.lavoratori_to_ditte.idditta;
	
	var periodo = utils.parseDate(globals.getPeriodo().toString(10), globals.PERIODO_DATEFORMAT);
	_frmSceltaFile.init(periodo);
	_frmSceltaFile._idditta = ditta
	globals.ma_utl_showFormInDialog(_frmSceltaFile.controller.getName(), 'Importa tracciato');
}
