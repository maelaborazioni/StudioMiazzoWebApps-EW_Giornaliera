/**
 * Lancia l'operazione di scarico delle timbrature.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"A8C66916-6298-4642-A08A-0AA763995317"}
 */
function scaricaTimbraturePannello(event) 
{
	var frm = forms.giorn_header;
	var _anno = globals.getAnno();
	var _mese = globals.getMese();
	var _idditta = globals.getTipologiaDitta(frm.idditta) == globals.Tipologia.ESTERNA ?
	               frm.foundset.lavoratori_to_ditte.ditte_to_ditte_legami.iddittariferimento : frm.idditta;
    var _periodo = _anno * 100 + _mese; 
    var _gruppoinst = globals.getGruppoInstallazioneDitta(_idditta);
    var _gruppolav = ''; // globals.getGruppoLavoratori();

	var _timbParams = globals.inizializzaParametriFileTimbrature(_idditta,_periodo,_gruppoinst,_gruppolav,globals._tipoConnessione);
	if(globals.verificaPresenzaFileTimbrature(_timbParams)
	   || globals.ma_utl_showYesNoQuestion('Nessun nuovo file di timbrature da acquisire presente.\n Si desidera procedere comunque per la riassegnazione di eventuali timbrature precedentemente scartate?','Acquisizione timbrature'))
	{
		var params = {
	        processFunction: process_scarica_timbrature_pannello,
	        message: '', 
	        opacity: 0.5,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : 'This is the dialog',
	        fontType: 'Arial,4,25',
	        processArgs: [event,_timbParams]
	    };
		plugins.busy.block(params);
	}
	
}

/**
 * @param {JSEvent} event
 * @param {Object} _params 
 * 
 * @properties={typeid:24,uuid:"D6567618-B5C0-4137-A908-EB4A7095EC5D"}
 */
function process_scarica_timbrature_pannello(event,_params)
{
	try
	{
		globals.scaricaTimbratureDaFtp(_params);
	}
	catch(ex)
	{
		var msg = 'Metodo process_scarica_timbrature_pannello : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Lancia l'operazione di acquisizione giornaliera del mese in esame
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EEDB398B-517A-4464-B2B5-54C067315785"}
 */
function acquisisciGiornalieraPannello(event) 
{
	var params = {
        processFunction: process_acquisisci_giornaliera_pannello,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * Lancia l'operazione di acquisizione della giornaliera definitiva del mese precedente
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D01F2FF6-C74F-4611-B2CB-913454223DCD"}
 */
function process_acquisisci_giornaliera_pannello(event)
{
	try
	{
		var frm = forms.giorn_header;
		var _anno = globals.getAnno();
		var _mese = globals.getMese();
		var _idditta = frm.idditta;
		var _periodo = _mese == 1 ? (_anno - 1) * 100 + 12 : _anno * 100 + (_mese - 1);
		var _gruppoinst = globals.getGruppoInstallazioneDitta(_idditta);
		var _gruppolav = ''; // TODO globals.getGruppoLavoratori();
		
		var ctrlRes = scopes.giornaliera.esisteGiornalieraDaImportare(_idditta,_periodo,_gruppoinst,_gruppolav);
		if(ctrlRes['returnValue'] == 0)
		{
			var msg = ctrlRes['returnMessage'] + '<br/>';
			
			var recOpDitta = scopes.giornaliera.getUltimaOperazioneDitta(_idditta,
															             _gruppoinst,
																		 _gruppolav,
																		 _periodo,
																		 globals.getIdTabAttivita(globals.AttivitaDitta.IMPORTAZIONE_GIORNALIERA))
			
			if(recOpDitta)
			msg += ('Ultima acquisizione effettuata il ' + globals.dateFormat(recOpDitta.ultimaesecuzioneil,globals.LOGINFO_DATEFORMAT));
			
			globals.svy_mod_closeForm(event);
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog(msg,'Importa giornaliera');
			return;
		}
		
	    globals.importaTracciatoDaFtp(_idditta,_periodo,_gruppoinst,_gruppolav);
	}
	catch(ex)
	{
		msg = 'Metodo process_acquisisci_giornaliera_pannello : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg);
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
    		
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"75937288-B3F8-4BC8-83CB-FFB1B718BE85"}
 */
function riceviTabelleStudio(event) 
{
	if(!globals.verificaDatiDittaFtp(forms.giorn_header.idditta,globals.getGruppoInstallazioneDitta(forms.giorn_header.idditta)))
	{
		globals.svy_mod_closeForm(event);
		globals.ma_utl_showWarningDialog('Non esistono aggiornamenti dati da scaricare per la ditta selezionata','Ricezione tabelle studio');
		return;
	}
	
	var params = {
        processFunction: process_ricevi_tabelle,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0FF7E788-A9C1-45E0-9799-630F1E7DC591"}
 */
function process_ricevi_tabelle(event)
{
	try
	{
		var frm = forms.giorn_header;
		var _idditta = frm.idditta;
		var _gruppoinst = globals.getGruppoInstallazioneDitta(_idditta);
		var _gruppolav = '';
		
		var _params = globals.inizializzaParametriRiceviTabelle(_idditta,_gruppoinst,_gruppolav,globals.TipoConnessione.CLIENTE);
		globals.riceviTabelleDittaDipendenti(_params,[_idditta]);
	}
	catch(ex)
	{
		var msg = 'Metodo process_ricevi_tabelle : ' + ex.message;
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
 * @properties={typeid:24,uuid:"14A3DFA1-237D-4C7C-90F3-A926E200A60E"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
}
