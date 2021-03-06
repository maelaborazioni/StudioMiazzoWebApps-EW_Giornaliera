/**
 * Lancia l'operazione di compilazione della ditta per il mese in esame
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F0A1B603-16D6-4254-B36C-21BDA4A9AF88"}
 */
function compilaMeseDittaCartacea(event) {
	
	var _idditta = forms.giorn_header.idditta
	var _periodo = globals.getPeriodo();
	var _gruppoinst = globals.getGruppoInstallazione();
	var _gruppolav = globals.getGruppoLavoratori();

	var params = globals.inizializzaParametriAttivaMese(_idditta,_periodo,_gruppoinst,_gruppolav,globals._tipoConnessione)
	globals.attivazioneMese(params);

}

/**
 * Lancia l'operazione di acquisizione giornaliera del mese in esame
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"43450EA3-1F68-44E1-9F94-678C9BB14FD2"}
 */
function acquisisciGiornaliera(event) {
	
	var _idditta = forms.giorn_header.idditta
	var _periodo = globals.getPeriodo();
	var _gruppoinst = globals.getGruppoInstallazione();
	var _gruppolav = globals.getGruppoLavoratori();
	
	if(globals._tipoConnessione == globals.TipoConnessione.SEDE)
		_periodo = globals.getPeriodo();
	else
	{
		if(globals.getMese() == 1)
			_periodo = (globals.getAnno() - 1) * 100 + 12;
		else
			_periodo = globals.getPeriodo() - 1;
	}
	
    globals.importaTracciatoDaFtp(_idditta,_periodo,_gruppoinst,_gruppolav);
}
