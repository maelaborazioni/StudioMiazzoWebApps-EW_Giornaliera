/**
 * @properties={type:4,typeid:36,uuid:"339556E8-D9AB-4346-B01F-C67E4145B4C5"}
 */
function timbratura_manuale()
{
	return indirizzo == 'mn' ? 1 : 0;
}

/**
 * @properties={type:12,typeid:36,uuid:"846969F5-7455-4D62-A922-E1DD0F6E9584"}
 */
function timbrature_servizio()
{
	var fs = e2timbratura_to_e2timbratureservizio;
	var text = '<html><head></head><body>';
	if(fs.getSize())
	{
	   text += 'Timbrature di servizio : <br/>';
	   for (var i = 1; i < fs.getSize(); i++)
	   {
		  text += fs.senso;
		  text += ' - ' + fs.dataeora.getHours() + '.' + fs.dataeora.getMinutes();
		  text += ' - Orologio : ' + fs.indirizzo; 
		  text += ' - Causale : ' + fs.e2timbratureservizio_to_e2timbratureserviziogestione.descrizione;
	      text += '<br/>';
	   }
	}
	text += '</body></html>';
	
	return text;
}

/**
 * @properties={type:93,typeid:36,uuid:"0A063259-AA4D-4275-9E31-C4E1C72F574B"}
 */
function timbratura_giorno_fine()
{
	var timbrDate = new Date(giorno);
	timbrDate.setHours(23,59);
	
	return timbrDate;
}

/**
 * @properties={type:93,typeid:36,uuid:"478AE445-7030-486C-80A7-C1AA06F21D54"}
 */
function timbratura_giorno_inizio()
{
	var timbrDate = new Date(giorno);
	timbrDate.setHours(0,0);
	
	return timbrDate;
}

/**
 * @properties={type:8,typeid:36,uuid:"56E447D4-D85D-459A-A9B7-4FB8CC55B28C"}
 */
function timbratura_ggsucc()
{
	//ore e minuti della timbratura
	var _objOre = globals.getOreEffettiveDaTimbr(timbratura.toString(),ggsucc);
	
	if (_objOre.vaAlGiornoSucc || _objOre.vaAlGiornoPrec) 
        return 1;
	else
        return 0;
	
}

/**
 * @properties={type:12,typeid:36,uuid:"2BFA2161-AD84-4985-B50D-8FC687DDCC8C"}
 */
function timbratura_formattata()
{
	//ore e minuti della timbratura
	var _objOre = globals.getOreEffettiveDaTimbr(timbratura.toString(),ggsucc);
	var currMinuti = globals.getMinDaTimbrFormattata(timbratura);
    //timbratura formattata ore - minuti - indirizzo
	var _timbrFormattata = _objOre.ore + '.' + currMinuti + ' - '+ indirizzo 
	
	if (_objOre.vaAlGiornoSucc) {
		//se sfora al giorno successivo aggiungo un flag visivo
		return  _timbrFormattata + ' >';
	} else if (_objOre.vaAlGiornoPrec) {
		return '< ' + _timbrFormattata;
	} else {
		return _timbrFormattata;
	}
}

/**
 * @properties={type:8,typeid:36,uuid:"B2467304-5512-457E-837B-9D6D3D17E500"}
 */
function timbratura_hhmm_number()
{
	var hhmm = timbratura % 1e4;
	
	if(hhmm >= 2400)
		hhmm -= 2400;
	
	return hhmm / 1e2;
}

/**
 * @properties={type:93,typeid:36,uuid:"CD2FDAEC-AF07-424A-AAA2-BC85B5047E55"}
 */
function timbratura_datetime()
{
	var timbrDate = new Date(giorno);
	var _objOre = globals.getOreEffettiveDaTimbr(timbratura.toString(),ggsucc);
	var currMinuti = globals.getMinDaTimbrFormattata(timbratura);
	timbrDate.setHours(parseInt(_objOre.ore,10),parseInt(currMinuti,10));
	
	return timbrDate;
}

/**
 * @properties={type:12,typeid:36,uuid:"78EFC71E-202E-41B1-8CDB-960232640BDD"}
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
 * @properties={type:93,typeid:36,uuid:"0710453E-904F-40F8-86A0-ED55FB43F627"}
 * 
 * @return {Date}
 */
function giorno()
{
	var _y = parseInt(utils.stringLeft(timbratura.toString(), 4),10);
	var _m = parseInt(utils.stringMiddle(timbratura.toString(),5,2),10);
	var _d = parseInt(utils.stringMiddle(timbratura.toString(),7,2),10);
  
    return new Date(_y,_m-1,_d);
}

/**
 * @properties={type:12,typeid:36,uuid:"FEF47C37-18F3-4B0F-86B8-80F8ED8662EC"}
 * 
 * @return {String}
 * 
 */
function timbratura_oremin()
{
	var _timbr 
	
	if (timbratura) 
		_timbr = utils.stringRight(timbratura.toString(),4);
	else
		return null;
		
	var _ore = parseInt(utils.stringLeft(_timbr,2),10);
	var _timbrOreMin;
	if(_ore >= 24){
		_ore = _ore - 24;
		_timbrOreMin = _ore.toString() + '.' + utils.stringRight(_timbr,2);
	}if(_ore < 10)
	   _timbrOreMin = '0' + _ore.toString() + '.' + utils.stringRight(_timbr,2);
	else
	   _timbrOreMin = _ore.toString() + '.' + utils.stringRight(_timbr,2);
	
	return _timbrOreMin;
}

/**
 * @properties={type:12,typeid:36,uuid:"3C837A0F-F457-4B33-BE18-B4544D465E74"}
 * 
 * @return {String}
 */
function timbratura_giorno()
{
	var _timbratura = timbratura.toString();
	var _timbGiorno = utils.stringLeft(_timbratura,8);

	return _timbGiorno;
}

/**
 * @properties={type:4,typeid:36,uuid:"1C7C8008-FEE3-442D-91AF-AB2EC14ED235"}
 */
function timbratura_hhmm()
{
	var _timbratura = timbratura.toString();
	var _timbHhmm = utils.stringRight(_timbratura,4);
	var _timbHh = utils.stringLeft(_timbHhmm,2);
	var _timbMm = utils.stringRight(_timbHhmm,2);
	
	return parseInt(_timbHh,10) * 100 + parseInt(_timbMm,10);
}

/**
 * @return {String}
 * 
 * @properties={type:12,typeid:36,uuid:"E8A6513A-87D7-43A1-B07F-6092979141FD"}
 */
function timbratura_anomalia()
{
	var msgAnomalie = '';
	switch (e2timbratura_to_e2giornaliera.anomalie)
	{
		case 1:
		case 2:
			msgAnomalie = i18n.getI18NMessage('i18n:ma.msg.giorni_non_conteggiati');
			break;
		case 5:
		case 6:	
			msgAnomalie = i18n.getI18NMessage('i18n:ma.msg.entrata_senza_uscita');
			break;
		case 9:
		case 10:	
		    msgAnomalie = i18n.getI18NMessage('i18n:ma.msg.uscita_senza_entrata');
			break;
		default:
			break;
	}
	return msgAnomalie;
}
