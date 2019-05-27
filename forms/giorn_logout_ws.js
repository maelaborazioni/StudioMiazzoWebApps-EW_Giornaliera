/**
 * @properties={typeid:24,uuid:"75D83E34-F61F-4E7E-9BE6-A9A0CC88A875"}
 */
function ws_create()
{
    var args = arguments[0];
	
	var username = args['username'];
	var ipaddress = args['host'];
	var solutionName = 'PresenzaSemplice';
	
	var arrClients = plugins.clientmanager.getConnectedClients();
	
	if(arrClients)
		for(var c = 0; c < arrClients.length; c++)
		{
			var client = arrClients[c];
			if(client.getUserName() == username
			   && client.getHostAddress() == ipaddress
			   && client.getOpenSolutionName() == solutionName)
			   plugins.clientmanager.shutDownClient(client.getClientID());
		}	
	
		return { logoff : true};
}