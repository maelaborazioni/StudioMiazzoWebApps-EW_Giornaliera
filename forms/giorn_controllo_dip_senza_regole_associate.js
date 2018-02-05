/**
 * @properties={typeid:35,uuid:"87999DAB-3F3B-42EF-A5CC-FFED3B2EEA06",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"37C208B9-62E6-4750-B7CC-1CA342E6C398",variableType:-4}
 */
var vOpenProg = false;

/**
 * @properties={typeid:35,uuid:"D4F90C60-451C-4C0C-94D7-76C13E214CE8",variableType:-4}
 */
var vProgParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"5CED0309-BF40-4C5A-89E8-95B1362B7A8E",variableType:-4}
 */
var vPrimoIngresso = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"0E99797E-7AA4-4F25-A8F7-6319E2E76521",variableType:-4}
 */
var _isInGiornaliera = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"03D6B041-7738-4B45-9E2F-16BAC2C56E63",variableType:4}
 */
var _idditta = -1;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"BABC7759-CE6C-446A-91CB-838949028712",variableType:-4}
 */
var _arrCodLavoratori = [];

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0EC61AE2-B16E-4181-8E4E-027843A420CD"}
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
	globals.ma_utl_showWarningDialog('Non sarà possibile entrare nella giornaliera del mese prima di aver inserito <br/>  \
                                      le decorrenze mancanti da <b>Dati decorrenza</b> del menu <b>Lavoratori</b>','Dipendenti senza regole associate');
	
}

/**
 * Apre la gestione decorrenze filtrando per i dipendenti che non hanno
 * regole associate
 * 
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"BD3FEA66-4522-45A6-A35A-601DC3264B8B"}
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
 * @properties={typeid:24,uuid:"18136206-68B8-452D-8F06-5EF1ED114A32"}
 * @AllowToRunInFind
 */
function confermaElenco(event) 
{
	// aggiornamento delle regole mancanti con quelle inserite
	var frm = event.getFormName() == forms.giorn_dip_modifica_decorrenze.controller.getName() ? forms['giorn_dip_modifica_decorrenze_tbl_temp'] : forms['giorn_controllo_dip_senza_regole_associate_tbl_temp'];
	var fs = frm.foundset;

	/** @type JSFoundset<db:/ma_presenze/e2dcg_decorrenza>*/
	var fsDec = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.LAVORATORI_DECORRENZE);

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

			databaseManager.startTransaction();

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
			} else
				throw new Error('Non è possibile inserire una regola nulla per il dipendente: ' + fsLav.lavoratori_to_persone.nominativo);

			// eventuale aggiornamento valore badge
//			if (globals.haOrologio(idditta)) {
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
//				else
//					throw new Error('Non si può inserire un badge nullo per il dipendente: ' + fsLav.lavoratori_to_persone.nominativo);
//			}

			// eventuale aggiornamento codice turnista
			if (globals.haGestioneTurno(idditta)) {
				if (rec['codiceturnista']) {
					/** @type JSRecord<db:/ma_presenze/e2dcg_decorrenza>*/
					var recTurnista = fsDec.getRecord(fsDec.newRecord());
					recTurnista.iddcg_campi = 23;
					recTurnista.id_legato = idlavoratore.toString();
					recTurnista.decorrenza = assunzione; //data assunzione del lavoratore
					recTurnista.valore = rec['codiceturnista'].toString();
					recTurnista.valoreagg = null;
					recTurnista.stato = 1; //?
					recTurnista.richiestoda = security.getUserName();
					recTurnista.richiestoil = globals.TODAY;
					recTurnista.idcliente = null;
				}
				else
	 			    throw new Error('Non si può inserire un tipo di turnista nullo per il dipendente: ' + fsLav.lavoratori_to_persone.nominativo);
			} 

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
 * @properties={typeid:24,uuid:"4B2BD064-5ED2-4E16-8DF5-ACA504C6BE61"}
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
 * @properties={typeid:24,uuid:"DF7710B1-3A6E-4A88-A061-900FD82A88CD"}
 */
function onHide(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	return _super.onHide(event)
}
