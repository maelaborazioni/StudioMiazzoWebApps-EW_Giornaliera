/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D767A3CE-0AA4-4998-ABA7-4CEB8EA0CB69"}
 */
var _codiceFascia = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E7021688-DB7A-4130-9589-101D61F79950"}
 */
var _codiceFasciaPre= '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"42B9E97E-67AB-45F8-9617-E2963D9CB7B8"}
 */
var _descrFascia = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F1062718-0CAE-4EF0-AFEA-8E29D013D865"}
 */
var _descrFasciaPre = '';
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"A477C221-1FE3-49BA-9984-7F2CAEFC53FF",variableType:8}
 */
var _idFascia = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"6E8296CC-CDEF-465C-BD73-1D341822E3FE",variableType:8}
 */
var _idGiornalieraFascia = null;

/**
 * @type {Array<Number>}
 *
 * @properties={typeid:35,uuid:"333F1DA1-B1B5-4921-B34A-EE518C6A848C",variableType:-4}
 */
var _arrGiorni = [];

/**
 * Filtra le fasce orarie selezionabili a partire dalla ditta
 * 
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"A634BF9A-5042-435E-8B7D-ECDE606A4717"}
 */
function FiltraFasciaForzata(fs)
{
	fs.addFoundSetFilterParam('idditta','=',forms.giorn_header.idditta);
	return fs;
}


/**
 * Aggiorna in seguito alla selezione della fascia oraria
 * 
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"F7200E11-F7C8-44E1-BF75-E2B956EE6B31"}
 */
function AggiornaFasciaForzata(rec)
{
   _idFascia = rec['idfasciaoraria'];	
   _codiceFascia = rec['codicefascia'];
   _descrFascia = rec['descrizione_fascia'];
}

/**
 * Conferma l'inserimento della fascia forzata per il giorno selezionato
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"219C01E4-5B58-4D9A-9AD4-DAD1A985FB48"}
 * @AllowToRunInFind
 */
function confermaFasciaForzata(event) {
	
   var _fs = forms['giorn_timbr_temp'].foundset;
   
   for(var g=0; g<_arrGiorni.length; g++)
   {
	   var _rec = _fs.getRecord(_arrGiorni[g] + globals.offsetGg);
	   var _idGiornaliera = _rec['idgiornaliera'];
	   
	   if(_idGiornaliera && foundset.find())
	   {
		   databaseManager.startTransaction();
		   
	  	   foundset.idgiornaliera = _idGiornaliera;
	   	   if(foundset.search() > 0)
	   	      foundset.idfasciaorariaforzata = _idFascia;
	   	   else
	   		  globals.ma_utl_showErrorDialog('Nessun record modificabile trovato','Errore');
	   	   	     	   	   
	   	   if(databaseManager.commitTransaction())
			   forms.giorn_timbr.analizzaPreConteggio(_arrGiorni[g]);
		   else
		   {
			   globals.ma_utl_showErrorDialog('Errore durante il salvataggio della fascia forzata per il giorno ' + _arrGiorni[g] + ', riprovare','Errore');
			   databaseManager.rollbackTransaction();
		   }
	   }
	   else
		   globals.ma_utl_showErrorDialog('Errore durante il salvataggio della fascia forzata per il giorno ' + _arrGiorni[g] + ', riprovare','Errore');
   }
   
   // dopo un'operazione di inserimento, puliamo eventuali selezioni precedenti 
   globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = [];
   
   globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());	  
   globals.svy_mod_closeForm(event);
   
   forms.giorn_header.preparaGiornaliera(); 
   
   globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
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
 * @properties={typeid:24,uuid:"63FBB565-E93E-46DF-9027-CA8E8E0A58F7"}
 * @AllowToRunInFind
 */
function onDataChangeFascia(oldValue, newValue, event) {
	
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, 'e2fo_fasceorarie');
	
	if(fs.find())
	{
		fs['codicefascia'] = _codiceFascia;
		
		if(fs.search() == 1)
		{
		  _descrFascia = fs['descrizione_fascia'];
		  _idFascia = fs['idfasciaoraria'];
		}
		else
			globals.svy_nav_showLookupWindow(event,null,'LEAF_Lkp_FasceOrarie','AggiornaFasciaForzata','FiltraFasciaForzata');
	    
		return true;	
	}
	
	return false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"78B85123-23B1-4616-BCC4-BBBB186655DC"}
 */
function annullaFasciaForzata(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());	  
	globals.svy_mod_closeForm(event);
}
