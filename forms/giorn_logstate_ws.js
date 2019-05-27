/**
 * @properties={typeid:24,uuid:"825B877C-B689-4D04-98F9-9957FBDDB9C4"}
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
			   return { logged : true };
		}
	
    return { logged : false };
}