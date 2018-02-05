/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"F8472472-7512-41E9-8416-B66768380C6B",variableType:93}
 */
var _today = null;

/**
 * @param  _firstShow
 * @param  _event
 *
 * @properties={typeid:24,uuid:"65E40D3B-4E24-4D87-A519-ABAEE7C2B23D"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
	
	_today = new Date();
	
	var hh = _today.getHours();
	var mm = _today.getMinutes();
	
	_timbr = (hh > 10 ? hh : '0' + hh) + '.' + (mm > 10 ? mm : '0' + mm);
	_orologio = globals.TipiTimbratura.WEB;
    
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"895EAA9D-C879-4058-897F-49D9085CD269"}
 */
function confermaAggiungiTimbImm(event) 
{
	_super.confermaAggiungiTimbr(event,_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore,_today);
}
