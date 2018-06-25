/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3C96FB3D-D105-47F1-BF3D-43FFD024C0C8",variableType:8}
 */
var vCodDitta = null;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C8CCB2CC-8514-4F8E-8854-690136A214FB",variableType:8}
 */
var vGrInstDitta = null;
/**
 * @type {Array<String>}
 *
 * @properties={typeid:35,uuid:"4BD4AE53-0E0D-4C28-AC39-419FC2032802",variableType:-4}
 */
var vFileString = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"0BB39CE9-5855-41BF-AD60-99F5A7F304FD",variableType:8}
 */
var vNrBadge = null;
/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"BACFBED2-27FD-4707-8120-E4E1152BF309",variableType:93}
 */
var vAl = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5A231A67-7584-4743-8839-70EB1DBF4A57"}
 */
function annullaEliminazione(event) 
{
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E228D069-95DA-43F7-A68A-5F56016A5884"}
 * @AllowToRunInFind
 */
function confermaEliminazione(event)
{
	var params = {
        processFunction: process_conferma_eliminazione,
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
 * Lancia l'operazione di aggiornamento del file di timbrature non assegnate
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DCF991FC-62D7-47CC-AFC9-16C5850812A7"}
 */
function process_conferma_eliminazione(event)
{
	try
	{
		// recupero delle righe non selezionate del dataset
		var frmName = 'giorn_manutenzione_timbr_tbl_temp';
		var fs = forms[frmName].foundset;
		
		// recupero delle stringhe di timbratura relative ai record delle timbrature non da eliminare
		// (per ricostruire il file delle timbrature non associate aggiornato) 
		fs.loadAllRecords();
		var strNewTimbr = '';
		for(var t = 1; t <= fs.getSize(); t++)
			if(fs.getRecord(t)['selected'] == 0)
		       strNewTimbr += (vFileString[t - 1] + '\n');
			
		// chiamata al metodo di pulizia del web service
		// acquisisci lettura file da ws
		var params = globals.inizializzaParametriFileTimbrature(globals.getIdDitta(vCodDitta),
			                                                    globals.TODAY.getFullYear() * 100 + globals.TODAY.getMonth() + 1,
																vGrInstDitta,
																'',
																strNewTimbr)
		var url = globals.WS_URL + "/Timbrature/SetFileTimbrature";
		var response = globals.getWebServiceResponse(url,params);
		
		globals.svy_mod_closeForm(event);
		
		if(response['returnValue'])
		   globals.ma_utl_showWarningDialog(response['returnMessage'],'Gestione file timbrature non associate');
		else
		   globals.ma_utl_showErrorDialog('Errore durante l\'operazione : ' + response['returnMessage'],'Gestione file timbrature non associate');		
		}
	catch(ex)
	{
		var msg = 'Metodo process_conferma_eliminazione : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"844B5BB0-5872-472D-BA2A-F8E6AF737926"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
	vAl = null;
	vNrBadge = null;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"14DA53F0-402F-4E64-A14F-BDAFC917D2F6"}
 * @AllowToRunInFind
 */
function onActionFilter(event) 
{
	var frmName = 'giorn_manutenzione_timbr_tbl_temp';
	var fs = forms[frmName].foundset;
	
	if(fs.find())
	{
		if(vNrBadge)
			fs['badge'] = vNrBadge;
		if(vAl)
			fs['giorno'] = '<=' + globals.dateFormat(vAl,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		
		fs.search();
	
		elements.btn_filter.enabled = false;
		elements.btn_unfilter.enabled = true;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"64CCFFDA-9BDB-4298-9439-05E34558180F"}
 */
function onActionUnfilter(event) 
{
	var frmName = 'giorn_manutenzione_timbr_tbl_temp';
	var fs = forms[frmName].foundset;
	
	fs.loadAllRecords();
	vNrBadge= null;	
	vAl = null;
	elements.btn_filter.enabled = true;
	elements.btn_unfilter.enabled = false;
}
