/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"C2F35F94-E3BB-4DC0-95D8-0C88D1B0E030",variableType:93}
 */
var _dataricerca = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F23A6FC5-FDCD-4BFE-B320-2E841F948482",variableType:8}
 */
var _numerobadge = null;

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"6D8F2814-A76D-48E6-AA4B-4570D8F58ED3"}
 */
function onShowForm(_firstShow, _event) {
	
	 _super.onShowForm(_firstShow, _event)

	 _dataricerca = new Date()
	 
	 globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	 
     return
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F0410442-EA09-4D78-8D00-C3CBDDBEBA8D"}
 */
function cercaBadge(event)
{
	var _badgeSql = 'SELECT * FROM [dbo].[F_Badge_AppartenenteA](?,?,?)';
	var _arrBadge = new Array()
	var _grInst = globals.getGruppoInstallazioneDitta(forms.giorn_header.lavoratori_to_ditte.idditta);//forms.giorn_header.lavoratori_to_ditte.ditte_to_ditte_sedi_sedeoperativa.ditte_sedi_to_ditte_sedigruppiinst.idgruppoinst
	
	_arrBadge.push(_grInst,_numerobadge.toString(),utils.dateFormat(_dataricerca,globals.ISO_DATEFORMAT))
	
	var _dsBadge = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_badgeSql,_arrBadge,10)
	var _infoBadgeMsg = ''
	/** @type Date*/
	var _decBadge = _dsBadge.getValue(1,7) 	
	
	if(_dsBadge.getMaxRowIndex() > 0)
	{
		_infoBadgeMsg = "<html>Alla data " + _dataricerca.getDate() + ' ' + globals.getNomeMese(_dataricerca.getMonth() + 1) + ' ' + _dataricerca.getFullYear()  +  ' il badge '+ _numerobadge + ' risulta appartenente a ' + _dsBadge.getValue(1,10) + ' ' + _dsBadge.getValue(1,11) 
		              + '<br/> dipendente della ditta  ' + _dsBadge.getValue(1,3) + ' - ' + _dsBadge.getValue(1,9) 
					  + '<br/> con decorrenza ' + _decBadge.toLocaleDateString() + "</html>"
		
	}
	else
	{
	    _infoBadgeMsg = 'Nessun dipendente trovato per i parametri inseriti'
	}
	
	globals.ma_utl_showInfoDialog(_infoBadgeMsg,'Ricerca badge');
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"553F2694-D0B7-48F6-9357-9E50E0D6C1F0"}
 */
function annullaCercaBadge(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event)
}
