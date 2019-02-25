/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F9B0B1A4-FF54-4E40-9657-43EB329A31B0",variableType:8}
 */
var _gg;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0CAB5702-DA23-49EA-85C0-3EB3AB7595B0",variableType:8}
 */
var _MM;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8FA9D1CD-9BD9-41FC-8D4C-9D5732668144",variableType:8}
 */
var _yy;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"171CA4C3-555E-4B6D-8978-02B5DA40F3CD",variableType:-4}
 */
var _ggSucc = true;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"7166C19C-6605-43A0-BC27-6103F5196CF2",variableType:-4}
 */
var _isModifica = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"95CEC89B-FC45-4D13-B0E6-4B0BD21A636A",variableType:4}
 */
var _idTimbratura = -1;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7E6C8583-F1F4-462D-AF8D-2C7A0DBF50AC",variableType:8}
 */
var _timbratura = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"8590DF7C-1AE8-4FC6-B7F6-DE679BA61406",variableType:-4}
 */
var _competenzaGGPrec = false;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"F3C71DCA-E2A6-4726-920F-1944895AB19C",variableType:-4}
 */
var _solocartolina = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A1B50855-9787-43AC-A3A9-2B6CA412BA13",variableType:8}
 */
var _senso = null;

/** 
 * @param _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"A79A1D0E-C522-4A11-954C-A80B2959344A"}
 */
function onShowForm(_firstShow, _event) 
{
	plugins.busy.prepare();
	elements.btn_conferma.enabled = false;
}

/**
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DA478603-25D7-41F5-94AA-C95235C5F23F"}
 */
function confermaModificaTimbr(event)
{
	var params = {
        processFunction: process_timbratura,
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
 * @properties={typeid:24,uuid:"45384187-490C-44A7-861A-D1CE5B1D80FA"}
 */
function process_timbratura(event)
{
	var idLav = _solocartolina ? forms.giorn_cart_header.idlavoratore : forms.giorn_header.idlavoratore;
	var _timbrGg = new Date(_yy, _MM - 1, _gg);
	var timbraturaInConflitto = { };
	var anomaliaPre, anomaliaPost;
	var _respRiconteggia;
	
	var validationResult = globals.validaInserimentoTimbratura(idLav
		                                                       ,timbratura_oremin
															   ,_timbrGg
															   ,senso
															   ,_ggSucc
															   , _solocartolina ? true : false);
	switch(validationResult)
	{
		case 0:
			var recTimbr;
			try
			{
				var _hh;
				var _mm;
				databaseManager.startTransaction();
				
				recTimbr = foundset.getSelectedRecord();
				recTimbr['iddip'] = idLav;
				recTimbr['nr_badge'] = globals.getNrBadge(idLav, _timbrGg);
				recTimbr['senso'] = senso;
				recTimbr['indirizzo'] = _solocartolina ? globals.TipiTimbratura.WEB : foundset.indirizzo;
				recTimbr['timbeliminata'] = 0;
				recTimbr['idgruppoinst'] = globals.getGruppoInstallazioneLavoratore(idLav);
				recTimbr['ggsucc'] = 0;
				recTimbr['sensocambiato'] = 0;
	
				_hh = _ggSucc ? parseInt(utils.stringLeft(recTimbr['timbratura_oremin'], 2), 10) + 24 : parseInt(utils.stringLeft(recTimbr['timbratura_oremin'], 2), 10);
				_mm = parseInt(utils.stringRight(recTimbr['timbratura_oremin'], 2), 10);
				recTimbr['timbratura'] = _timbrGg.getFullYear() * 1e8 + (_timbrGg.getMonth() + 1) * 1e6 + _timbrGg.getDate() * 1e4 + _hh * 1e2 + _mm;
				
				// ulteriore controllo sulla validità della timbratura e del senso inseriti
				if(recTimbr['timbratura'] == null || recTimbr['senso'] == null)
					throw new Error('Controllare che i valori della timbratura siano corretti.', 'Inserimento timbrature');
				
				// effettua la transazione (dovrebbe iniziare nella fase di modifica..)
				if(!databaseManager.commitTransaction()) 
				{
					canClose = true;
					globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
					globals.svy_mod_closeForm(event);
					throw new Error("Inserimento timbratura non riuscito, riprovare.<br/>Ripristinare le timbrature per verificare la presenza di eventuali doppioni")
				}
	
				canClose = true;
				globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
				globals.svy_mod_closeForm(event);
				
				// situazione anomalia partenza
				anomaliaPre = globals.getAnomalieGiornata(idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));

				// analizza pre conteggio
				forms.giorn_timbr.analizzaPreConteggio(_gg);

				// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
				// la compilazione di base che ve a creare il record nella tabella e2giornaliera
				if(globals.getIdGiornalieraDaIdLavGiorno(idLav,_timbrGg) == null)
				   globals.compilaDalAlSingolo(idLav,[_gg]);
				
				// situazione anomalia partenza
				anomaliaPost = globals.getAnomalieGiornata(idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
				
				//se il giorno della timbratura modificata risulta già conteggiato
				if (anomaliaPre == 0 && anomaliaPre != anomaliaPost) 
				{
					_respRiconteggia = !_solocartolina && globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?', 'Modifica timbrature');
					if (_respRiconteggia)
						globals.conteggiaTimbratureSingoloDiretto([idLav], [_gg]);
					
				}
				
				// la modifica o l'aggiunta di una timbratura non implica il ridisegno della giornaliera
				// modificata ma solamente delle timbrature
				forms.giorn_header.preparaGiornaliera(null,null,_solocartolina);
				
				globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
			} 
			catch (ex) 
			{
				databaseManager.rollbackTransaction();
				globals.ma_utl_showErrorDialog(ex.message,'Modifica timbratura');
			} 
	
			_competenzaGGPrec = false;	  
			break;
		
		case 1:
			globals.ma_utl_showWarningDialog('Controllare che tutti i campi necessari siano compilati', 'Inserimento timbrature');
			databaseManager.rollbackTransaction();
			break;
		
		case 2:
			globals.ma_utl_showWarningDialog('Controllare che i valori della timbratura siano corretti', 'Inserimento timbrature');
			databaseManager.rollbackTransaction();
			break;
			
		case 3:
			globals.ma_utl_showWarningDialog('Esiste già una timbratura con questi valori!', 'Inserimento timbrature');
			databaseManager.rollbackTransaction();
			break;
			
		case 4:
			try
			{
				var answer = globals.ma_utl_showYesNoQuestion('Esiste già una timbratura eliminata con questi valori! Si desidera ripristinarla?', 'Inserimento timbrature');
				if (answer && timbraturaInConflitto && timbraturaInConflitto.id)
				{
					// rollback della transazione in corso e creazione di una nuova transazione
					databaseManager.rollbackTransaction();
					databaseManager.startTransaction();
					
					if(scopes.giornaliera.RipristinaTimbraturaEliminata(timbraturaInConflitto.id) && databaseManager.commitTransaction())
					{
						canClose = true;
						globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
						globals.svy_mod_closeForm(event);
						
						if (_solocartolina)
							forms.giorn_mostra_timbr.preparaTimbratura(_yy, _MM, idLav, _solocartolina);
						else 
						{
							// situazione anomalia partenza
							anomaliaPre = globals.getAnomalieGiornata(idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
			
							// analizza pre conteggio
							forms.giorn_timbr.analizzaPreConteggio(_gg);
			
							// situazione anomalia partenza
							anomaliaPost = globals.getAnomalieGiornata(idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
							
							//se il giorno della timbratura modificata risulta già conteggiato
							if (anomaliaPre == 0 && anomaliaPre != anomaliaPost) 
							{
								_respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?', 'Modifica timbrature');
								if (_respRiconteggia)
									globals.conteggiaTimbratureSingoloDiretto([idLav], [_gg]);
								
								// ridisegniamo le timbrature della cartolina o della gestione giornaliera
								forms.giorn_header.preparaGiornaliera();
							} 
							else
								// la modifica o l'aggiunta di una timbratura non implica il ridisegno della giornaliera
								// modificata ma solamente delle timbrature
								forms.giorn_header.preparaGiornaliera();
							
							globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
						}
					}
					else
						throw new Error("Inserimento timbratura non riuscito, riprovare.<br/>Ripristinare le timbrature per verificare la presenza di eventuali doppioni")
				}
			}
			catch (ex)
			{
				databaseManager.rollbackTransaction();
				globals.ma_utl_showWarningDialog('Errore durante il ripristino della timbratura', 'Inserimento timbrature');
			}
						
			break;
	}
	
	plugins.busy.unblock();
}

/**
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E6C7E109-314B-46B6-BCDF-B04F8F403242"}
 */
function annullaModificaTimbr(event)
{
	_competenzaGGPrec = false;    
	canClose = true;
	
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,event.getFormName());
	globals.svy_mod_closeForm(event);	
}



/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A6E7783E-5B3E-41C0-8F1E-F03E3702433E"}
 */
function onTimbrChange(oldValue, newValue, event) {
	
	// Gestione modifica timbratura 
	var _timbrOreMin = foundset.timbratura_oremin; 
	var _timbrH,_timbrM;
	_timbrH = parseInt(utils.stringLeft(_timbrOreMin,2),10);
	_timbrM = parseInt(utils.stringRight(_timbrOreMin,2),10);
	
	if(_timbrH <= 23 && _timbrM <= 59)
		elements.lbl_timbratura.fgcolor = 'red';
	
	return true;
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"89A567B9-7128-49D9-BC32-C0FACE9B7DB7"}
 */
function onDataChangeTimbratura(oldValue, newValue, event)
{
	// se è una timbratura aggiunta manualmente l'orologio di riferimento sarà quello manuale
	// nel caso di cartolina dipendente, si porrà l'etichetta "da autorizzare" per poter sottoporre poi la timbratura
	// inserita al giudizio del gestore
	if(!_solocartolina)
	  foundset.indirizzo = 'mn';
	else
	  foundset.indirizzo = 'wb';
	
	if(globals.validaTimbratura(timbratura_oremin))
	{
	   elements.btn_conferma.enabled = true;
	   return true;
	}
	else
	{
	   elements.btn_conferma.enabled = false;
	   return false;
	}

}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"41DB86D3-D04F-440D-98A4-A0934C07A45B"}
 */
function onDataChangeSenso(oldValue, newValue, event) {
	
	if(newValue == 1)
	{
       foundset.senso = newValue;
       elements.fld_ggsucc.enabled = true;
	}
	else
	{
	   foundset.senso = 0;
	   elements.fld_ggsucc.enabled = false;
	   _ggSucc = 0;	    
	}
	
	if((timbratura_oremin))
	{
		if(globals.validaTimbratura(timbratura_oremin))
		{
		   elements.btn_conferma.enabled = true;
		   return true;
		}
		else
		{
		   elements.btn_conferma.enabled = false;
		   return false;
		}
	}
	
	return true;
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"80B32DE8-808E-4AC8-94C1-5C134390D48D"}
 */
function onHide(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	databaseManager.rollbackTransaction();
	return globals.svy_mod_closeForm(event);
	//_super.onHide(event)
}
