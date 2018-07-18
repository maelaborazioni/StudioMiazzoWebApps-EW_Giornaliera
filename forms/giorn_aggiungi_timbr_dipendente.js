/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8AB702DC-3C9C-4E5C-8023-CE68C67E9FA1",variableType:4}
 */
var vSenso = 0;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"4B8925F9-1D03-41DD-BEBF-3765D69744EE",variableType:93}
 */
var vTimbratura = null;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C5027AB6-60FF-4470-9579-635AF4C12863",variableType:4}
 */
var vChkCausalizzata = 0;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"D75A496F-4982-44B8-ADCE-380632D34FD3",variableType:8}
 */
var vCausale = null;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"3D448B8E-4A61-48F3-8DDD-682A854A154A",variableType:-4}
 */
var vDaCartolina = null;

/** 
 * @param _firstShow
 * @param _event
 * 
 * @properties={typeid:24,uuid:"89C8E34C-5F5A-4397-916D-BB458E277302"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{ 	
	plugins.busy.prepare();
	
	var idLavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	vTimbratura = globals.TODAY;
	
	elements.btn_conferma_inserimento.enabled =	false;
	
	// 
	/** @type{JSFoundSet<db:/ma_presenze/e2timbratureserviziogestione>} */
	var fsCaus = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE_SERVIZIOGESTIONE);
	if(fsCaus.find())
	{
		fsCaus.idditta = globals.getDitta(idLavoratore);
		elements.fld_causalizzata.enabled =
			elements.fld_causale.enabled = fsCaus.search();
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FF18BAD4-16F5-4D26-860B-7A642883029C"}
 */
function annullaInserimento(event) 
{
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Azione di default sul pulsante : prepara il processo di inserimento timbratura dipendente
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DC3ABAD2-8E1C-43D4-A7EC-89AF9E6ED664"}
 */
function confermaInserimento(event) 
{
	var params = {
        processFunction: process_timbratura_dipendente,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * Operazione di gestione inserimento della nuova timbratura
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DE2DEBB1-A20C-4CDC-997A-992478B3BBC7"}
 */
function process_timbratura_dipendente(event)
{
	var idLavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	
	var	validaTimbrature = globals.validaInserimentoTimbratura(idLavoratore
		                                                       ,utils.dateFormat(vTimbratura,'HH.mm')
			                                                   ,vTimbratura
											                   ,vSenso
															   ,0
															   ,null
															   ,null
															   ,1);											                   
	
	// ulteriore controllo specifica della causale quando richiesta una timbratura causalizzata
	if(vChkCausalizzata && vCausale == 0)
	   validaTimbrature = 5;
	
	switch (validaTimbrature)
	{
		case 0:
			// gestione inserimento timbrature valide
			try 
			{
				var nrBadge = globals.getNrBadge(idLavoratore,vTimbratura);
				if(nrBadge == null)
					throw new Error('Nessun numero di badge associato al dipendente. L\'inserimento non può avvenire');
				
				databaseManager.setAutoSave(false);
				databaseManager.startTransaction();
				
				// crea un nuovo record per la timbratura
				if(vCausale != null)
				{
					/** @type{JSFoundSet<db:/ma_presenze/e2timbratureservizio>}*/
					var fsCaus = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE_SERVIZIO);
					var recCaus = fsCaus.getRecord(fsCaus.newRecord());
					if(recCaus)
					{
						// inizializzazione valori del record
						recCaus.iddip = idLavoratore;
						recCaus.indirizzo = globals.TipiTimbratura.WEB;
						recCaus.senso = vSenso;
						recCaus.sensocambiato = 0;
						recCaus.nr_badge = nrBadge;
						recCaus.competegiornoprima = 0;
						recCaus.idgruppoinst = globals.getGruppoInstallazioneLavoratore(idLavoratore);
						recCaus.dataeora = vTimbratura;
						recCaus.causale = vCausale;
					}
				}
				else
				{
					/** @type{JSFoundSet<db:/ma_presenze/e2timbratura>}*/
					var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
					var rec = fs.getRecord(fs.newRecord());
					if(rec)
					{
						//inizializzazione valori del record
						rec.iddip = idLavoratore;
						rec.indirizzo = globals.TipiTimbratura.WEB;
						rec.senso = vSenso;
						rec.nr_badge = nrBadge;
						rec.sensocambiato = 0;
						rec.timbeliminata = 0;
						rec.ggsucc = 0;
						rec.idgruppoinst = globals.getGruppoInstallazioneLavoratore(idLavoratore);
						rec.timbratura = vTimbratura.getFullYear() * 100000000 + (vTimbratura.getMonth() + 1) * 1000000 
						                 + vTimbratura.getDate() * 10000 + vTimbratura.getHours() * 100 + vTimbratura.getMinutes(); 
				    }							
				}
				
				var success = databaseManager.commitTransaction();
				if (!success) 
				{
					var failedrecords = databaseManager.getFailedRecords();
					if (failedrecords && failedrecords.length > 0)
						throw new Error('Inserimento timbrature non riuscito, verificare e riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.');
	
				}
				
				forms.giorn_mostra_timbr_cartolina.is_dirty = true;
				// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
				// la compilazione di base che ve a creare il record nella tabella e2giornaliera
				if(globals.getIdGiornalieraDaIdLavGiorno(idLavoratore,vTimbratura) == null)
				   globals.compilaDalAlSingoloSync(idLavoratore,[vTimbratura.getDate()],vTimbratura.getFullYear() * 100 + vTimbratura.getMonth() + 1);
				
				if(vDaCartolina)
					forms.giorn_header.preparaGiornaliera(false,null,true);
				else
					globals.ma_utl_showWarningDialog('Timbratura inserita correttamente!','Inserimento timbratura');
				
			} catch (ex) {
				application.output(ex.message, LOGGINGLEVEL.ERROR);
				databaseManager.rollbackTransaction();
				globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
				globals.ma_utl_showErrorDialog(ex.message);
				break;
			} finally {
				databaseManager.setAutoSave(false);
			    break;
			}
		case 1:
			globals.ma_utl_showWarningDialog('Controllare che tutti i campi necessari siano compilati', 'Inserimento timbratura commessa');
			break;
		case 2:
			globals.ma_utl_showWarningDialog('Controllare che i valori della timbratura siano corretti', 'Inserimento timbratura commessa');
			break;
		case 3:
		case 4:	
			globals.ma_utl_showWarningDialog('Esiste già una timbratura con questi valori!', 'Inserimento timbratura commessa');
			break;
		case 5:
		    globals.ma_utl_showWarningDialog('Inserisci la causale della timbratura!', 'Inserimento timbratura commessa');
		    break;
		default:
			break;
	}

	plugins.busy.unblock();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"02CEBA78-CB71-4D94-A36C-BDB536474E51"}
 */
function onActionInfo(event) {
	
	// visualizza le timbrature già presenti nella giornata selezionata
	var frm = forms.giorn_timbr_dipendente;
	var fs = frm.foundset;
	var idGiornaliera = globals.getIdGiornalieraDaIdLavGiorno(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
		                                                      ,vTimbratura);
	fs.loadRecords(idGiornaliera);
	
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Riepilogo del giorno ' + globals.dateFormat(vTimbratura,globals.EU_DATEFORMAT));
}

/**
 * Handle changed data.
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2DA650B0-115C-4C73-957A-AD8A99D210E4"}
 */
function onDataChangeTimbratura(oldValue, newValue, event)
{
	if(newValue != null)
	{
		elements.btn_conferma_inserimento.enabled = true;
		return true;
	}
	else
	{
		elements.btn_conferma_inserimento.enabled = false;
	    return false;
	}
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0DD0E5C4-1E1B-48A4-9958-00071A0CD37E"}
 */
function onDataChangeCausalizzata(oldValue, newValue, event) 
{
	elements.fld_causale.enabled =
		  elements.lbl_causale.enabled = newValue;
	
	if(newValue == 0)	  
	  vCausale = null;

	return true;
}
