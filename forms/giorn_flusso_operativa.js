/**
 * Lancia l'operazione lunga di conteggio delle timbrature
 * 
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"1266F0A7-9E0C-4ACF-9289-C74C5C921674"}
 */
function conteggiaTimbratureMultiploPannello(event)
{
	var dipGiornaliera = globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore');
	var dipSel = [];
	var giorniSel = [];
	
	dipSel = [forms.giorn_header.idlavoratore];
	
	globals.showOperazioneMultipla
	(
		  globals.conteggiaTimbrature
		, forms.giorn_operazionemultipla.controller.getName()
		, giorniSel
		, dipSel
		, true
		, function(fs)
		  { 
			  fs.addFoundSetFilterParam('idlavoratore','IN',dipGiornaliera);
		  }
	    ,null
		,null
		,null
		,'Conteggio timbrature'  
	);
}

/**
 * Lancia la compilazione dei giorni secondo la programmazione dei turni impostata od il teorico
 *
 * @param event
 *
 * @properties={typeid:24,uuid:"8503A17C-8DFA-46C7-87D3-38A001FE1BD4"}
 */
function compilaDalAlMultiploPannello(event)
{
	var dipGiornaliera = globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore');
	var dipSel = [];
	var giorniSel = [];
	dipSel = [forms.giorn_header.idlavoratore];
	
	globals.showOperazioneMultipla
	(
		globals.ma_utl_hasKey(globals.Key.COMMESSE_COMPILA_GIORNALIERA) ? globals.compilaDalAlCommesse : globals.compilaDalAl
		, forms.giorn_operazionemultipla.controller.getName()
		, giorniSel
		, dipSel
		, true
		, function(fs)
		  { 
			  fs.addFoundSetFilterParam('idlavoratore','IN',dipGiornaliera);
		  }
	    ,null
		,null
		,null
		,'Compilazione giorni'
	);
}

/**
 * Lancia l'operazione di controlli preliminari per la conversione eventi degli eventi
 * second i piano di conversione della ditta
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"646E9B3C-0FD1-46C9-9790-D1BF98BC2B22"}
 */
function controlliPreliminariDittaPannello(event)
{
	var params = {
        processFunction: process_controlli_preliminari,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: []
    };
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"CA856057-4B15-4025-B317-D48AEC194025"}
 */
function process_controlli_preliminari()
{
	try
	{
		var params = globals.inizializzaParametriAttivaMese(
		                                                    forms.giorn_header.idditta,
		                                                    globals.getPeriodo(),
		                                                    globals.getGruppoInstallazione(),
		                                                    globals.getGruppoLavoratori(),
		                                                    globals._tipoConnessione
		                                                    );
		/** @type {Array} */
		var _arrDipSenzaRegole = params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
		if(_arrDipSenzaRegole && _arrDipSenzaRegole.length > 0)
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('<html>Ci sono nuovi dipendenti senza regola associata non presenti in fase di apertura della giornaliera.<br/> \
		                                Chiudere e riaprire la giornaliera per sistemare le regole e poter proseguire.<html>');
			return;
		                                
		}
		globals.controlliPreliminari([]);
	}
	catch(ex)
	{
		var msg = 'Metodo process_controlli_preliminari : ' + ex.message;
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
 * @properties={typeid:24,uuid:"522DFDDA-B298-4E9E-ABA3-88F880B776BB"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
}
