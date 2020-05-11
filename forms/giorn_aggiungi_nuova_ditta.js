/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B768C5F1-49DC-49A5-A0E0-1DF5AA6CCD34"}
 */
var codiceAttivazione = "";
/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"6CCBE33A-8910-4BCC-885B-5C4C7A2598C5"}
 */
function aggiungiNuovaDitta(event)
{
	var now = new Date();
	var params = {
		userid : security.getUserName(),
		clientid : security.getClientID(),
		server : globals.server_db_name,
		databasecliente : globals.customer_dbserver_name,
		idditta : 999999,
		codiceattivazione : codiceAttivazione,
		periodo : now.getFullYear() * 100 + now.getMonth() + 1,
		tipoconnessione : globals.TipoConnessione.CLIENTE
	}
	
	// add new operation info for future updates
	var operation = scopes.operation.create(params.idditta,globals.getGruppoInstallazioneDitta(params.idditta),params.periodo,globals.OpType.AND);
	if(operation == null || operation.operationId == null)
	{
		globals.ma_utl_showErrorDialog('Errore durante la preparazione dell\'operazione lunga. Riprovare o contattare il  servizio di Assistenza.');
		return;
	}
	
	params.operationid = operation.operationId;
	params.operationhash = operation.operationHash;
	
	globals.svy_mod_closeForm(event);
    var url = globals.WS_CALENDAR + "/Admin32/AttivazioneNuovaDitta";
	
	globals.addJsonWebServiceJob(url,params);
}
