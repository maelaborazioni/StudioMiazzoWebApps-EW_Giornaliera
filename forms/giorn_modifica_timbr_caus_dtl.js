/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"31457E70-8EAC-41C7-A0B1-795C15DDA9D4",variableType:8}
 */
var _gg;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2A9C870B-7652-4A25-B033-66D1273D0953",variableType:8}
 */
var _MM;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"75B3F2A1-4D0C-4794-AE2E-4E154E77A160",variableType:8}
 */
var _yy;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0B57AFA2-2788-416B-B90E-EC2CDB08C9E5",variableType:-4}
 */
var _ggSucc = true;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"A1D15242-14B2-4645-B81B-00F505C7ED16",variableType:-4}
 */
var _isModifica = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3BCB49FD-74AB-431E-A004-1DA45B9C3466",variableType:4}
 */
var _idTimbratura = -1;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7542D5AD-4EC3-4B92-9A67-726B97E730DA",variableType:8}
 */
var _timbratura = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"0AA49EA5-FE6D-4361-9A7E-979BAE002275",variableType:-4}
 */
var _competenzaGGPrec = false;

/**
 * @properties={typeid:35,uuid:"EBEB2D96-CD01-4D88-A6A3-A73A4008990E",variableType:-4}
 */
var _solocartolina = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3272B3A6-F51F-4060-A7FC-2875D5ED98D5",variableType:8}
 */
var _senso = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C6A67568-6E9F-48B5-9E83-A97CBC8DA549"}
 */
var _causale = '';

/** 
 * @param _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"4693920A-86B2-479D-A660-34D92DAF1E7F"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
	
	elements.btn_conferma.enabled = false;
}

/**
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EA83DF00-9FFF-47F2-8084-5924DAB78955"}
 */
function confermaModificaTimbr(event)
{
	var idLav = forms.giorn_header.idlavoratore;
	var _timbrGg = new Date(_yy, _MM - 1, _gg);
	
	switch(globals.validaInserimentoTimbratura(idLav,timbratura_oremin,_timbrGg,senso,_ggSucc))
	{
		case 0:
			var recTimbr;
			var autosave = databaseManager.getAutoSave();
			
			try
			{
				databaseManager.setAutoSave(false);
				databaseManager.startTransaction();
		
				recTimbr = foundset.getSelectedRecord();
				recTimbr.causale = causale;
				recTimbr.iddip = idLav;
				recTimbr.nr_badge = globals.getNrBadge(idLav, _timbrGg);
				recTimbr.senso = senso;
				recTimbr.indirizzo = foundset.indirizzo;
				recTimbr.timbeliminata = 0;
				recTimbr.idgruppoinst = globals.getGruppoInstallazioneLavoratore(idLav);
				recTimbr.competegiornoprima = 0;
				recTimbr.sensocambiato = 0;
	
				_timbrGg.setHours(parseInt(utils.stringLeft(timbratura_oremin, 2), 10));
				_timbrGg.setMinutes(parseInt(utils.stringRight(timbratura_oremin, 2), 10));
				recTimbr.dataeora = _timbrGg;
												
				if(!databaseManager.commitTransaction()) 
				{
					globals.ma_utl_showErrorDialog('Inserimento timbratura non riuscito, riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.', 'Modifica timbratura');
					databaseManager.rollbackTransaction();
					return;
				}
	
				globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
				globals.svy_mod_closeForm(event);
	
				// situazione anomalia partenza
				var anomaliaPre = globals.getAnomalieGiornata(idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
	
				// analizza pre conteggio
				forms.giorn_timbr.analizzaPreConteggio(_gg);
	
				// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
				// la compilazione di base che ve a creare il record nella tabella e2giornaliera
				if(globals.getIdGiornalieraDaIdLavGiorno(idLav,_timbrGg) == null)
				   globals.compilaDalAlSingolo(idLav,[_gg]);
				
				// situazione anomalia partenza
				var anomaliaPost = globals.getAnomalieGiornata(idLav, utils.dateFormat(_timbrGg, globals.ISO_DATEFORMAT));
				
				forms.giorn_mostra_timbr.is_dirty = true;
				var indexToUpdate = forms.giorn_mostra_timbr.getMainForm().foundset.getSelectedIndex();
	
				//se il giorno della timbratura modificata risulta già conteggiato
				if (anomaliaPre == 0 && anomaliaPre != anomaliaPost) 
				{
					var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?', 'Modifica timbrature');
					if (_respRiconteggia)
						globals.conteggiaTimbratureSingolo([idLav], [_gg]);
					else
					// ridisegniamo le timbrature della cartolina o della gestione giornaliera
						forms.giorn_mostra_timbr.preparaTimbratura(_yy, _MM, idLav, null, indexToUpdate);
	
				} 
				else
					// la modifica o l'aggiunta di una timbratura non implica il ridisegno della giornaliera
					// modificata ma solamente delle timbrature
					forms.giorn_mostra_timbr.preparaTimbratura(_yy, _MM, idLav, null, indexToUpdate);
			} 
			catch (ex) 
			{
				application.output(ex.message, LOGGINGLEVEL.ERROR);
				databaseManager.rollbackTransaction();
				globals.ma_utl_showErrorDialog(ex.message);
			} 
			finally 
			{
				databaseManager.setAutoSave(autosave);
			}
	
			_competenzaGGPrec = false;	  
			break;
		
		case 1:
			globals.ma_utl_showWarningDialog('Controllare che tutti i campi necessari siano compilati', 'Inserimento timbrature causalizzate');
			break;
		
		case 2:
			globals.ma_utl_showWarningDialog('Controllare che i valori della timbratura siano corretti', 'Inserimento timbrature causalizzate');
			break;
			
		case 3:
		case 4:
			globals.ma_utl_showWarningDialog('Esiste già una timbratura con questi valori!', 'Inserimento timbrature causalizzate');
			break;
	}	
}

/**
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8FB64F93-F709-480C-B2E8-9AF97765B172"}
 */
function annullaModificaTimbr(event){

	_competenzaGGPrec = false;
	
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
 * @properties={typeid:24,uuid:"76F89229-1668-4337-B0F3-4E6D6DEFE74E"}
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
 * @properties={typeid:24,uuid:"C30FEA8F-57F8-48C5-A4F0-0021E0BCFBA9"}
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
 * @properties={typeid:24,uuid:"EECC33EF-26CA-4137-81BF-39254E0FA7F7"}
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
	
	return true;
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EDA76F7A-78E6-48BB-ABDC-1B4FFDD58919"}
 */
function onHide(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	return _super.onHide(event)
}
