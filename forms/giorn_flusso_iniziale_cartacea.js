/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1BE1BA09-299F-4678-AB38-26DF2D3FD1E8"}
 */
function compilaMeseDittaCartacea(event) {
	
	var _idditta = forms.giorn_header.idditta;
	var _periodo = globals.getAnno() * 100 + globals.getMese();
	var _gruppoinst = globals.getGruppoInstallazione();
	var _gruppolav = globals.getGruppoLavoratori();

	var params = globals.inizializzaParametriAttivaMese(_idditta,_periodo,_gruppoinst,_gruppolav,globals._tipoConnessione);
	// add new operation info for future updates
	var operation = scopes.operation.create(_idditta,_gruppoinst,_periodo,globals.OpType.AM);
	if(operation == null || operation.operationId == null)
	{
		globals.ma_utl_showErrorDialog('Errore durante la preparazione dell\'operazione lunga. Riprovare o contattare il  servizio di Assistenza.');
		return;
	}
	
	params.operationid = operation.operationId;
	params.operationhash = operation.operationHash;

	globals.attivazioneMese(params);
}
