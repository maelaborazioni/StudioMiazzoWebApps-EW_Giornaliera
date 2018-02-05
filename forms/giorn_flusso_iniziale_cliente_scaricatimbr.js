/**
 * Lancia l'operazione di scarico delle timbrature.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"2C37652B-204D-47BE-9DB7-06905DD9C837"}
 */
function scaricaTimbrature(event) {
	
	var _idditta = globals.getTipologiaDitta(forms.giorn_header.idditta) == globals.Tipologia.ESTERNA ?
			       forms.giorn_header.lavoratori_to_ditte.ditte_to_ditte_legami.iddittariferimento : forms.giorn_header.idditta;
	var _periodo = globals.getPeriodo();
	var _gruppoinst = globals.getGruppoInstallazioneDitta(_idditta);
	var _gruppolav = globals.getGruppoLavoratori();
	
	var _params = globals.inizializzaParametriScaricaTimbrature(_idditta,_periodo,_gruppoinst,_gruppolav,globals._tipoConnessione);
    globals.scaricaTimbratureDaFtp(_params);	
}

/**
 * Lancia l'operazione di acquisizione giornaliera del mese in esame
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"40F588FC-712F-4456-B306-88DF9AF2278B"}
 */
function acquisisciGiornaliera(event) 
{
	var _idditta = forms.giorn_header.idditta
	var _periodo;
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
