/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"F8472472-7512-41E9-8416-B66768380C6B",variableType:93}
 */
var _today = null;

/**
 * @properties={typeid:35,uuid:"23DBF900-71FE-4CC5-A003-6AFAEA56A266",variableType:-4}
 */
var vDaCartolina = false;

/**
 * @param  _firstShow
 * @param  _event
 *
 * @properties={typeid:24,uuid:"65E40D3B-4E24-4D87-A519-ABAEE7C2B23D"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	
	plugins.busy.prepare();
	
	_today = new Date();
	
	var hh = _today.getHours();
	var mm = _today.getMinutes();
	
	_timbr = (hh >= 10 ? hh : '0' + hh) + '.' + (mm >= 10 ? mm : '0' + mm);
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
	var params = {
        processFunction: process_timbratura_immediata_dipendente,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"723A3B8F-0F0D-4EDF-A416-4975290C1663"}
 */
function process_timbratura_immediata_dipendente(event)
{
	_super.confermaAggiungiTimbr(event,_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore,_today);
	plugins.busy.unblock();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"67E7E890-4230-4021-A569-D6F45D0AB006"}
 */
function onActionInfo(event)
{
	// visualizza le timbrature già presenti nella giornata selezionata
	var frm = forms.giorn_timbr_dipendente;
	var fs = frm.foundset;
	var idGiornaliera = globals.getIdGiornalieraDaIdLavGiorno(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
		                                                      ,globals.TODAY);
	fs.loadRecords(idGiornaliera);
	
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Riepilogo del giorno ' + globals.dateFormat(globals.TODAY,globals.EU_DATEFORMAT));
}
