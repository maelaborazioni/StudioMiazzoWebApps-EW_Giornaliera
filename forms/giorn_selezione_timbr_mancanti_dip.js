/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1F542EF4-60ED-43E0-B4C0-09A5A5116FD3"}
 * @AllowToRunInFind
 */
function confermaDittaPeriodo(event) 
{
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		return;
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	globals.svy_mod_closeForm(event);
	
	var idLav =	_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	
	var _progName = 'TimbratureMancanti';
	var _progObj = globals.nav.program[_progName];
	var _filter = new Object();
	_filter.filter_name = 'ftr_idlavoratore';
	_filter.filter_field_name = 'idlavoratore';
	_filter.filter_operator = '=';
	_filter.filter_value = idLav;
	_progObj.filter = [_filter];  
    _progObj.foundset = null;	

	/** @type {Array<Object>} */
	var _parArr = new Array();
	
	if(globals.haAnomalieTimbrDipendente(idLav,_anno,_mese))
	{
	   globals.openProgram(_progName,_parArr);
	   forms.giorn_timbr_mancanti_dipendente.preparaAnomalieLavoratore(idLav,_anno,_mese,globals.getLastDate(new Date(_anno,_mese,1)).getDate());
	}
	else
	   globals.ma_utl_showInfoDialog('Nessuna anomalia nelle timbrature per il periodo selezionato','Anomalie timbrature dipendente');
	
}

