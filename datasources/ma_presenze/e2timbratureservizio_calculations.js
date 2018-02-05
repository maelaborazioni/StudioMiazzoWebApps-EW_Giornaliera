/**
 * @properties={type:12,typeid:36,uuid:"114C345A-8C2A-45A1-A323-19B534994E5B"}
 */
function annoMeseGiorno()
{
	return dataeora.getFullYear() * 10000 + dataeora.getMonth() * 100 + dataeora.getDate();
}

/**
 * @properties={type:12,typeid:36,uuid:"2EB04C03-4F4E-4A54-8DC5-C10EF3F9724E"}
 */
function timbratura_senso()
{
	if(!sensocambiato){
		if(senso)
			return 'Uscita';
		else return 'Entrata';
	}else{
		if(senso)
			return 'Entrata';
		else return 'Uscita';
	}
	
}

/**
 * @properties={type:12,typeid:36,uuid:"A9B98A78-D2F6-4474-9963-9110CB417310"}
 */
function timbratura_oremin()
{
	if(dataeora == null)
		return '';
	
	var _ore = dataeora.getHours();
	var _min = dataeora.getMinutes();
	
	var _timbrOreMin;
//	if(_ore >= 24){
//		_ore = _ore - 24;
//		_timbrOreMin = _ore.toString() + '.' + utils.stringRight(_timbr,2);
//	}
	if(_ore < 10)
	   _timbrOreMin = '0' + _ore.toString();
	else
	   _timbrOreMin = _ore.toString();
	
	_timbrOreMin += '.';
	
	if(_min < 10)
	   _timbrOreMin += ('0' + _min.toString());
	else
	   _timbrOreMin += _min.toString();
	
	return _timbrOreMin;
}
