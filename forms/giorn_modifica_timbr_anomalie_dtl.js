/**
 * @properties={typeid:35,uuid:"7734126A-ADEC-47BB-BD85-EBE4079D382C",variableType:-4}
 */
var _idLav = null;

/**
 * @type {String}
 *
 * @param {String}
 * 
 * @properties={typeid:35,uuid:"54B21EDF-FE68-4E21-BD67-C5C96ED9DB56"}
 */
var _contFormName = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C773BE69-79F4-422F-B912-8FF2D4884015"}
 * @SuppressWarnings(unused)
 */
function confermaModificaTimbrAnomalie(event)
{		
		var fsTimbr;
		var recTimbr;
		var _timbrGg = new Date(_yy, _MM - 1, _gg);

		var validationResult = globals.validaInserimentoTimbratura(_idLav,timbratura_oremin,_timbrGg,senso,ggsucc);
		switch (validationResult)
		{
			case 0:
				try 
				{
					var autosave = databaseManager.getAutoSave();
					databaseManager.setAutoSave(false);
					databaseManager.startTransaction();
	
					recTimbr = foundset.getSelectedRecord();	
	
					recTimbr['iddip'] = _idLav;
					recTimbr['nr_badge'] = globals.getNrBadge(_idLav, _timbrGg);
					recTimbr['senso'] = senso;
					recTimbr['indirizzo'] = _solocartolina ? 'wb' : 'mn';
					recTimbr['timbeliminata'] = 0;
					recTimbr['idgruppoinst'] = globals.getGruppoInstallazioneLavoratore(_idLav);
					recTimbr['ggsucc'] = 0;
					recTimbr['sensocambiato'] = 0;
	
					var _hh = _solocartolina ? parseInt(utils.stringLeft(foundset.getSelectedRecord()['timbratura_oremin'], 2), 10) :
						      _ggSucc ? parseInt(utils.stringLeft(recTimbr['timbratura_oremin'], 2), 10) + 24 : parseInt(utils.stringLeft(recTimbr['timbratura_oremin'], 2), 10);
					var _mm = _solocartolina ? parseInt(utils.stringRight(foundset.getSelectedRecord()['timbratura_oremin'], 2), 10) : parseInt(utils.stringRight(recTimbr['timbratura_oremin'], 2), 10);
					recTimbr['timbratura'] = _timbrGg.getFullYear() * 100000000 + (_timbrGg.getMonth() + 1) * 1000000 + _timbrGg.getDate() * 10000 + _hh * 100 + _mm;
					
					// ulteriore controllo sulla validità della timbratura e del senso inseriti
					if(recTimbr['timbratura'] == null || recTimbr['senso'] == null)
						throw new Error('Controllare che i valori della timbratura siano corretti.', 'Inserimento timbrature anomalie');
					
					if (!databaseManager.commitTransaction()) 
					{
						globals.ma_utl_showErrorDialog('Inserimento timbratura non riuscito.</br><strong>Ripristinare le timbrature per verificare la presenza di eventuali doppioni.</strong>', 'Modifica timbratura');
						databaseManager.rollbackTransaction();
						return;
					}
	
					canClose = true;
					globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
					globals.svy_mod_closeForm(event);
	
					// situazione anomalia partenza
					var anomaliaPre = globals.getAnomalieGiornata(_idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
	
					// analizza pre conteggio
					forms.giorn_timbr.analizzaPreConteggio(_gg);
	
					// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
					// la compilazione di base che ve a creare il record nella tabella e2giornaliera
					if(globals.getIdGiornalieraDaIdLavGiorno(_idLav,_timbrGg) == null)
					   globals.compilaDalAlSingolo(_idLav,[_gg]);
					
					// situazione anomalia partenza
					var anomaliaPost = globals.getAnomalieGiornata(_idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
	
					//aggiorna la visualizzazione
					globals.aggiornaAnomalieTimbratureDipendente(_idLav,_timbrGg.getFullYear(),_timbrGg.getMonth()+1,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate());
					
					break;
				}
				catch (ex) 
				{
					application.output(ex.message, LOGGINGLEVEL.ERROR);
					databaseManager.rollbackTransaction();
					globals.ma_utl_showErrorDialog(ex.message);
					break;
				}
				finally 
				{
					databaseManager.setAutoSave(autosave);
					break;
				}
				
			case 1:
				globals.ma_utl_showWarningDialog('Controllare che tutti i campi necessari siano compilati', 'Inserimento timbrature da anomalie');
				break;
				
			case 2:
				globals.ma_utl_showWarningDialog('Controllare che i valori della timbratura siano corretti', 'Inserimento timbrature da anomalie');
				break;
				
			case 3:
				globals.ma_utl_showWarningDialog('Esiste già una timbratura con questi valori!', 'Inserimento timbrature da anomalie');
				break;
			default:
				break;
		}
		
		_competenzaGGPrec = false;
}

/**
 * @param {Object} _firstShow
 * @param {Object} _event
 *
 * @properties={typeid:24,uuid:"19ACCDE9-A1B2-400B-8D20-E37A4172AE00"}
 */
function onShowForm(_firstShow, _event) {
	elements.fld_senso.enabled = false;
}
