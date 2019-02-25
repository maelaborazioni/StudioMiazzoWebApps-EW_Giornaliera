/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AC2B2DDC-941E-4C94-96A3-0BDB58CED68D"}
 */
var vPeriodoStr = '';
/**
 * Attiva in giornaliera il mese corrente per la ditta  
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"81B39FAE-8CD0-4066-82FE-D703800DB58C"}
 */
function abilitaMese(event)
{
	var params = {
		processFunction: process_mese_abilita,
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
 * @properties={typeid:24,uuid:"6AB4AA8F-84B9-4B77-9F87-6E6EEC18D707"}
 */
function process_mese_abilita(event)
{
	try
	{
		var answer = true;
		var active_filter = forms.giorn_vista_mensile._filtroAttivo; 
		if(active_filter)
			answer = globals.ma_utl_showYesNoQuestion("Il filtro sui dipendenti della giornaliera è attivo. <br/> Attivando il mese il filtro verrà rimosso. Proseguire?","Attivazione mese");
		
		if(answer)
		{
			var params = globals.inizializzaParametriAttivaMese(
				forms.giorn_header.idditta,
	            globals.getPeriodo(),
				globals.getGruppoInstallazione(), 
				globals.getGruppoLavoratori(),
				globals._tipoConnessione,
				forms.giorn_header.idlavoratore);
			
			// la disattivazione di eventuali filtri implica che ci si riposizioni sul primo dipendente
			// perciò la facciamo esclusivamente in presenza di filtri attivi
			if(active_filter)	
			{
			   globals.disattivaFiltri(event);
			   forms.giorn_header.preparaGiornaliera(true,null,false);
			}
			
			globals.attivaMese(params,false,null,false);
			
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_mese_abilita : ' + ex.message;
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
 * @properties={typeid:24,uuid:"DD0EB6F6-887F-4D9A-90D4-76FB48BCEEBD"}
 */
function vaiAllaGiornalieraDiBudget(event) 
{
	var params = {
		processFunction: process_giornaliera_budget,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"2318BFCB-0B75-4994-8704-FCC92C0624A8"}
 */
function process_giornaliera_budget()
{
	try
	{
		if(globals.esistonoGiorniUtilizzabiliInBudget(forms.giorn_header.idlavoratore
			                                          ,globals.getMese() 
													  ,globals.getAnno()))
	    {
	    	//passa alla gestione della giornaliera normale
	    	forms.giorn_vista_mensile._tipoGiornaliera = globals.TipoGiornaliera.BUDGET;
	    	forms.giorn_header.preparaGiornaliera();
	        forms.giorn_vista_mensile.elements.tab_main.setTabEnabledAt(2,true);
	        forms.intestaVistaMensile.elements.btn_giornbudget.enabled = false;
	        forms.intestaVistaMensile.elements.btn_giornnormale.enabled = true;
	        forms.giorn_vista_mensile.elements.lbl_vista_comunicazioni_tipo_giorn.text = 'Giornaliera budget';
	    }
	    else
		{
		    globals.ma_utl_showWarningDialog('<html>Non esistono giorni utilizzabili con la giornaliera di budget</html>','Giornaliera di budget');
		    forms.giorn_vista_mensile._tipoGiornaliera = globals.TipoGiornaliera.NORMALE;
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_giornaliera_budget : ' + ex.message;
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
 * @properties={typeid:24,uuid:"412BB871-D382-4255-AC14-9426EE990528"}
 */
function vaiAllaGiornalieraNormale(event)
{
	var params = {
		processFunction: process_giornaliera_normale,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"D9F6B576-D281-4767-B7FC-F98C3C8286DC"}
 */
function process_giornaliera_normale()
{
	try
	{
		//passa alla gestione della giornaliera normale
		forms.giorn_vista_mensile._tipoGiornaliera = globals.TipoGiornaliera.NORMALE;
		forms.giorn_header.preparaGiornaliera();
		
		globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		
		forms.giorn_vista_mensile.elements.tab_main.setTabEnabledAt(1,true);
	    forms.intestaVistaMensile.elements.btn_giornbudget.enabled = true;
	    forms.intestaVistaMensile.elements.btn_giornnormale.enabled = false;
	    forms.giorn_vista_mensile.elements.lbl_vista_comunicazioni_tipo_giorn.text = 'Giornaliera normale';
	}
	catch(ex)
	{
		var msg = 'Metodo process_giornaliera_normale : ' + ex.message;
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
 * @properties={typeid:24,uuid:"6ECB822D-E662-4F4C-85E8-AB84F8A9AA5B"}
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
 * @properties={typeid:24,uuid:"B9C9326E-F8F8-4A41-8B80-98ACA0990BAC"}
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
 * @properties={typeid:24,uuid:"7879C560-CD5D-4230-BA2C-1059C6E7728A"}
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
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"BFF65BEF-27BD-43C0-B573-58755382869A"}
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AD246D85-D98C-4335-9FDA-817A70B6B497"}
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
		processArgs: []
	};
	plugins.busy.block(params);
	
}

/**
 * @properties={typeid:24,uuid:"11549FEC-0291-4D54-BA09-B39C840265FA"}
 */
function process_mese_anno()
{
	try
	{
		forms.giorn_header.preparaGiornaliera();
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
 * @properties={typeid:24,uuid:"5FAD9A87-83E6-4C52-BA94-D77362446A5C"}
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
 * @properties={typeid:24,uuid:"98FA9868-58F2-4B21-8BD0-EF48EB3BE137"}
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
 * @properties={typeid:24,uuid:"BBAB47D7-C720-4EC8-B562-738BCE2ED713"}
 */
function process_disattiva_filtri(event)
{
	try
	{
		scopes.globals.disattivaFiltri(event);
		forms.giorn_header.preparaGiornaliera(true,null,false);
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

/**
 * Gestisce la visualizzazione delle label e dei pulsanti a seconda del caso
 * in cui vi sia solo la visualizzazione della situazione dipendente o la visualizzazione intera
 * da parte del gestore
 * 
 * @param {Boolean} _soloDipendente
 *
 * @properties={typeid:24,uuid:"AEF6B1ED-744B-4EF2-B33C-94183D24D9A0"}
 */
function aggiornaIntestazioni(_soloDipendente)
{
	elements.btn_attivamese.visible = 
	elements.lbl_filtro_giornaliera.visible =
	elements.btn_filtroattivo.visible = 
	elements.btn_filtrodisattivato.visible =
	elements.lbl_tipo_giornaliera.visible =
	elements.btn_giornbudget.visible = 
	elements.btn_giornnormale.visible = 
	elements.btn_meseprec.enabled = 
	elements.btn_mesesucc.enabled = 
	elements.btn_selperiodo.enabled = !_soloDipendente;		
}
