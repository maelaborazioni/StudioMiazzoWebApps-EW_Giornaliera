/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"06BF06B7-8A87-4ECF-A95E-90B48D8B4AA0"}
 */
var vPeriodoStr = '';
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CD8CEEF0-D303-4608-911A-706C0AAA5593"}
 */
function abilitaMese(event)
{
	var params = {
		processFunction: process_abilita_mese,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"1548C053-810F-4CC3-842A-5F6BB33CBF7F"}
 */
function process_abilita_mese(event)
{
	try
	{
	    var answer = true;
	    var active_filter = forms.giorn_vista_mensile._filtroAttivo;
		if(active_filter)
			answer = globals.ma_utl_showYesNoQuestion("Il filtro sui dipendenti della giornaliera è attivo. <br/> Attivando il mese il filtro verrà rimosso. Proseguire?","Attivazione mese");
		
		if(answer)
		{
		   var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta, 
				                                               globals.getPeriodo(),
															   globals.getGruppoInstallazione(), 
															   globals.getGruppoLavoratori(),
															   globals._tipoConnessione,
															   forms.giorn_header.idlavoratore)
	       
		   // la disattivazione di eventuali filtri implica che ci si riposizioni sul primo dipendente
		   // perciò la facciamo esclusivamente in presenza di filtri attivi
		   if(active_filter)
		   {
			   globals.disattivaFiltri(event);
			   forms.giorn_header.preparaGiornaliera(true, null, false, true);
		   }
		   
		   globals.attivaMese(params,false,null);
		}
		
	}
	catch(ex)
	{
		var msg = 'Metodo process_abilita_mese : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
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
 * @private
 *
 * @properties={typeid:24,uuid:"9C6D6DFD-1B4A-4600-82B8-1928182BEBC3"}
 */
function vaiAlMesePrecedente(event) 
{
	var params = {
		processFunction: process_mese_prec,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"68FA503F-310A-4730-BE67-10B252D5DA85"}
 */
function process_mese_prec(event)
{
	try
	{
		globals.giornMesePrec(event,forms.giorn_header.idlavoratore);
	}
	catch(ex)
	{
		var msg = 'Metodo process_mese_prec : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
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
 * @private
 *
 * @properties={typeid:24,uuid:"1CB2F520-6A31-4D5E-BFD0-B6E453A02D68"}
 */
function vaiAlMeseSuccessivo(event) 
{
	var params = {
		processFunction: process_mese_succ,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: '',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4733B82F-36FA-4781-80F6-B778ABC858B4"}
 */
function process_mese_succ(event)
{
	try
	{
		globals.giornMeseSucc(event,forms.giorn_header.idlavoratore);
	}
	catch(ex)
	{
		var msg = 'Metodo process_mese_succ : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Gestisce la visualizzazione delle label e dei pulsanti a seconda del caso
 * in cui vi sia solo la visualizzazione della cartolina del dipendente o la gestione delle timbrature
 * da parte del gestore
 * 
 * @param {Boolean} _soloCartolina
 *
 * @properties={typeid:24,uuid:"AA505B14-8CD8-4DB8-BD2F-48DFA01AC942"}
 */
function aggiornaIntestazioni(_soloCartolina)
{
	elements.btn_attivamese.visible = 
	elements.lbl_filtro__giornaliera.visible =
	elements.btn_filtroattivo.visible = 
	elements.btn_filtrodisattivato.visible =
	elements.lbl_tipo_giornaliera.visible =
	elements.btn_giornbudget.visible = 
	elements.btn_giornnormale.visible = 
	elements.btn_meseprec.enabled = 
	elements.btn_mesesucc.enabled = 
	elements.btn_selperiodo.enabled = !_soloCartolina;		
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"29FF2A54-06B4-4A21-9F27-73A97B13F8C2"}
 */
function onActionMeseAnno(event) 
{
	var params = {
		processFunction: process_mese_anno,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"58A29E56-BD23-4DE4-90F6-72E64C03C78C"}
 */
function process_mese_anno()
{
	try
	{
		forms.giorn_header.preparaGiornaliera(false, null, false, true);
	}
	catch(ex)
	{
		var msg = 'Metodo process_mese_anno : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"6FD79947-6155-46C1-97B3-DD19140BC2AE"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	plugins.busy.prepare();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A2254FF4-CF64-4A77-823A-D874FD8A8414"}
 */
function onActionDisattivaFiltri(event) 
{
	var params = {
		processFunction: process_disattiva_filtri,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"73AA6A92-7B68-46B3-B3E2-56D6BB07A114"}
 */
function process_disattiva_filtri(event)
{
	try
	{
		scopes.globals.disattivaFiltri(event);
		forms.giorn_header.preparaGiornaliera(true, null, false, true);
	}
	catch(ex)
	{
		var msg = 'Metodo process_disattiva_filtri : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}
