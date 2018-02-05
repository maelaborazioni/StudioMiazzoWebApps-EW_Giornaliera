/**
 * @properties={type:12,typeid:36,uuid:"32D6B5AB-4A6D-43EF-88A2-FA5107D7F403"}
 */
function tooltip()
{
	var retValue = e2giornalieraeventi_to_e2eventi.descriz;
	if(e2giornalieraeventi_to_eventiproprieta && e2giornalieraeventi_to_eventiproprieta.descrizione)
	{
		retValue += ' (' + e2giornalieraeventi_to_eventiproprieta.descrizione + ')';
	}

	return retValue;
}

/**
 * @properties={type:12,typeid:36,uuid:"FA9CC04C-6EA1-41BA-B508-175B76AD48FE"}
 */
function descrizione()
{
	var vistaOre;
	var tipoEvento = e2giornalieraeventi_to_e2eventi.evento;
	
    if (null === tipoEvento)
    {
    	vistaOre = null;
    }
    else
    {
    	if('9' === tipoEvento)
    		tipoEvento = 'L.D.';
    	
    	vistaOre = tipoEvento + ' ' +((ore/100).toFixed(2));
    }

    return vistaOre;
}

/**
 * @properties={type:12,typeid:36,uuid:"96582697-C5FD-40AB-B757-4A58E5D166AA"}
 */
function codice_proprieta_format()
{
	if(codiceproprieta)
	   return codiceproprieta;
	else 
	   return ''
}

/**
 * @type {String}
 * @properties={type:8,typeid:36,uuid:"6C16062B-A06F-41D5-9E33-6EE29B45CFBE"}
 */
function ore_effettive()
{
	/**@type {Number}	 */
	var _oreEffettive = ore/100
	
	return _oreEffettive.toFixed(2);
}
