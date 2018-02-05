/**
 * @properties={typeid:35,uuid:"ADC8BA27-302B-4F14-A843-30C26D95E070",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"A11B1C1A-ACC5-4FD2-9DEF-3C4489AED0CD",variableType:-4}
 */
var vOpenProg = false;

/**
 * @properties={typeid:35,uuid:"8938FD5F-0F7D-465C-8D4F-DAA184BE2584",variableType:-4}
 */
var vProgParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"0FF426C1-C52E-427B-B2C5-3E054361BB04",variableType:-4}
 */
var vPrimoIngresso = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"6130FA0A-719B-4002-8379-2365A9F63900",variableType:-4}
 */
var _isInGiornaliera = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A1574619-CBC1-4B09-9331-788A8DCF353B",variableType:4}
 */
var _idditta = -1;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"96EFB942-F0C9-457C-AE76-CBCA54FDE2B9",variableType:-4}
 */
var _arrCodLavoratori = [];

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D26FA8DF-445D-45AE-98A1-F1525E7F70AA"}
 */
function chiudiElenco(event) {
	
//	//se fossimo già all'interno della giornaliera (ad esempio : spostamento di mese)
//	if(_isInGiornaliera)
//	{
//		//deve essere chiuso il tab della giornaliera corrispondente...
//		globals.closeTab(forms.svy_nav_fr_openTabs.vSelectedTab);
//	}
	
    globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
}

/**
 * Apre la gestione decorrenze filtrando per i dipendenti che non hanno
 * regole associate
 * 
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"AAE990B3-E169-4275-BA24-66EF42C89121"}
 */
function apriGestioneDecorrenze(event)
{
	globals.svy_mod_closeForm(event);
	
	var _progName = 'AGL_DatiDecorrenza';
	var _filter_1 = new Object();
	_filter_1.filter_name = 'ftr_idditta';
	_filter_1.filter_field_name = 'idditta';
	_filter_1.filter_operator = '=';
	 
    _filter_1.filter_value = _idditta;
	
    var _filter_2 = new Object();
    _filter_2.filter_name = 'ftr_lavoratori';
    _filter_2.filter_field_name = 'codice'
    _filter_2.filter_operator = 'IN';
    
    _filter_2.filter_value = _arrCodLavoratori;
    
	var _progObj = globals.nav.program[_progName];
	_progObj.filter = [_filter_1,_filter_2];  
	_progObj.foundset = null;
	
    globals.openProgram(_progName);
    
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"721B59F1-93D8-49A1-B40E-86B9860062B6"}
 * @AllowToRunInFind
 */
function confermaElenco(event) 
{
	// aggiornamento con le nuove regole inserite
	var frm = forms['giorn_dip_modifica_decorrenze_tbl_temp'];
	var fs = frm.foundset;

	/** @type JSFoundset<db:/ma_presenze/e2dcg_decorrenza>*/
	var fsDec = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.LAVORATORI_DECORRENZE);

	try
	{
		var autosave = databaseManager.getAutoSave();
		databaseManager.setAutoSave(false);

		for (var i = 1; i <= fs.getSize(); i++) {
			var rec = fs.getRecord(i);
			var idditta;
			var idlavoratore;
			var assunzione;

			/** @type JSFoundset<db:/ma_anagrafiche/lavoratori>*/
			var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);
			if (fsLav.find()) {
				fsLav.idlavoratore = rec['id_lavoratore'];
				if (fsLav.search()) 
				{
					idlavoratore = fsLav.idlavoratore;
					idditta = fsLav.idditta;
					assunzione = fsLav.assunzione;
				} else
					throw new Error("Recupero id lavoratore non riuscito, codice del lavoratore : " + fs['cod_lavoratore']);
			} else
				throw new Error("Recupero id lavoratore non riuscito, codice del lavoratore : " + fs['cod_lavoratore']);

			// aggiornamento regola
			if (rec['valore']) {
				/** @type JSRecord<db:/ma_presenze/e2dcg_decorrenza>*/
				var recDec = fsDec.getRecord(fsDec.newRecord());
				recDec.iddcg_campi = 3;
				recDec.id_legato = idlavoratore.toString();
				recDec.decorrenza = assunzione; //data assunzione del lavoratore
				recDec.valore = rec['valore'].toString();
				recDec.valoreagg = rec['valoreagg'].toString();
				recDec.stato = 1; //?
				recDec.richiestoda = security.getUserName();
				recDec.richiestoil = globals.TODAY;
				recDec.idcliente = null;
			} 
			
			// eventuale aggiornamento valore badge
			if (rec['badge']) {
				/** @type JSRecord<db:/ma_presenze/e2dcg_decorrenza>*/
				var recBadge = fsDec.getRecord(fsDec.newRecord());
				recBadge.iddcg_campi = 2;
				recBadge.id_legato = idlavoratore.toString();
				recBadge.decorrenza = assunzione; //data assunzione del lavoratore
				recBadge.valore = rec['badge'].toString();
				recBadge.valoreagg = null;
				recBadge.stato = 1; //?
				recBadge.richiestoda = security.getUserName();
				recBadge.richiestoil = globals.TODAY;
				recBadge.idcliente = null;
			} 
			
			// eventuale aggiornamento codice turnista
//			if (globals.haGestioneTurno(idditta)) {
//				if (rec['codiceturnista']) {
//					/** @type JSRecord<db:/ma_presenze/e2dcg_decorrenza>*/
//					var recTurnista = fsDec.getRecord(fsDec.newRecord());
//					recTurnista.iddcg_campi = 23;
//					recTurnista.id_legato = idlavoratore.toString();
//					recTurnista.decorrenza = assunzione; //data assunzione del lavoratore
//					recTurnista.valore = rec['codiceturnista'].toString();
//					recTurnista.valoreagg = null;
//					recTurnista.stato = 1; //?
//					recTurnista.richiestoda = security.getUserName();
//					recTurnista.richiestoil = globals.TODAY;
//					recTurnista.idcliente = null;
//				}
//				else
//					continue;
//	 			    throw new Error('Non si può inserire un tipo di turnista nullo per il dipendente: ' + fsLav.lavoratori_to_persone.nominativo);
//			} 

			if(rec['valore'] || rec['badge'])
				databaseManager.startTransaction();
			else
				continue;
			
			var success = databaseManager.commitTransaction();
			if (!success) {
				var failedRecords = databaseManager.getFailedRecords();
				if (failedRecords && failedRecords.length > 0)
					throw new Error('Errore durante l\'inserimento multiplo per il dipendente: ' + fsLav.lavoratori_to_persone.nominativo + failedRecords[0].exception.getMessage());
			}

			var params = globals.inizializzaParametriDecorrenza(idditta
																, idlavoratore
																, assunzione.getFullYear() * 100 + assunzione.getMonth() + 1,
																assunzione,
																null,
																true);
			//aggiornamento regola in giornaliera
			if (!globals.aggiornaRegolaGiornaliera(params))
				throw new Error(globals.getHtmlString('Errore durante l\'aggiornamento della regola in giornaliera per il dipendente :' + fsLav.lavoratori_to_persone.nominativo + '<br/>' ));

		}

		// chiusura finestra ed entrata in giornaliera
		globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
		globals.svy_mod_closeForm(event);
		globals.controlloFestivita(vParams, vOpenProg, vProgParams, vPrimoIngresso);
		
	} catch (ex) {
		
		globals.ma_utl_showErrorDialog(ex.message);
     	databaseManager.rollbackTransaction();

	} finally {
		databaseManager.setAutoSave(autosave);
	}
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"DB968056-38C8-4271-BAB8-A5155F5AB9E3"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
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
 * @properties={typeid:24,uuid:"43C05718-9C12-4021-87D3-B820FB8CC75A"}
 */
function onHide(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	return _super.onHide(event)
}
