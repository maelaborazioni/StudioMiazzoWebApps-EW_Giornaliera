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
		user_id : security.getUserName(),
		client_id : security.getClientID(),
		idditta : 999999,
		codiceattivazione : codiceAttivazione,
		periodo : now.getFullYear() * 100 + now.getMonth() + 1,
		tipoconnessione : globals.TipoConnessione.CLIENTE
	}
	
	globals.svy_mod_closeForm(event);
     var url = globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ? globals.WS_ADMIN_URL + "/Attivazione/AttivaNuovaDitta" : globals.WS_ADMIN_URL + "/Giornaliera/AttivaNuovaDitta";
	
	globals.addJsonWebServiceJob(url,params);
		
}
