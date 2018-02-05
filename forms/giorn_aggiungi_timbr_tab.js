/**
 * @type {Number}
 *  
 * @properties={typeid:35,uuid:"4D15DBBB-660F-4DEA-82A3-3CC1ED0DBD5C",variableType:8}
 */
var vSelectedGiorno = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"0CC5440C-A675-45C2-A523-84DCC014693F",variableType:93}
 */
var vGiornoTimbr = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"BD506E18-5B6B-47B4-A130-9B8DC83EFB37",variableType:-4}
 */
var vSoloCartolina = false;

/**
 * @param _firstShow
 * @param _event
 * 
 * @properties={typeid:24,uuid:"EBBD904C-2006-4749-A1F1-55A51293A47F"}
 */
function onShowForm(_firstShow, _event) 
{ 	
	plugins.busy.prepare();
	
	elements.btn_add_timbr.enabled = 
	elements.btn_conferma_inserimento.enabled =	false;
	
	var _nrBadge = vSoloCartolina ? forms.giorn_cart_header._vNrBadge : forms.giorn_header._vNrBadge;
	if (_nrBadge != null)
	{
		vGiornoTimbr = new Date(globals.getAnno()
			                    , globals.getMese() - 1
			                    , vSelectedGiorno);

		var frm = forms.giorn_aggiungi_timbr_tbl;
		var frmname = frm.controller.getName();
		var frmnameTemp = frmname + '_temp';
		elements.tab_timbr.removeAllTabs();

		if (forms[frmnameTemp] != null)
		{
			solutionModel.removeForm(frmnameTemp);
			history.removeForm(frmnameTemp);
		}

		var arrCols = ['senso', 'timbratura', 'orologio', 'ggsucc','causale'];
		var arrTypes = [JSColumn.INTEGER, JSColumn.TEXT, JSColumn.TEXT, JSColumn.INTEGER, JSColumn.TEXT];
		var ds = databaseManager.createEmptyDataSet(1, arrCols);
		ds.setValue(1, 1, 0);
		ds.setValue(1, 2, "");
		vSoloCartolina ? ds.setValue(1, 3, globals.TipiTimbratura.WEB) : ds.setValue(1, 3, globals.TipiTimbratura.MANUALE);
		ds.setValue(1, 4, 0);
		ds.setValue(1, 5, null);
		
		var dS = ds.createDataSource('dSTimbr_' + application.getUUID(), arrTypes);

		var newFrm = solutionModel.cloneForm(frmnameTemp, solutionModel.getForm(frmname));
		solutionModel.getForm(newFrm.name).dataSource = dS;
		solutionModel.getForm(newFrm.name).getField('fld_senso').dataProviderID = 'senso';
		solutionModel.getForm(newFrm.name).getField('fld_timbr').dataProviderID = 'timbratura';
		solutionModel.getForm(newFrm.name).getField('fld_orologio').dataProviderID = 'orologio';
		solutionModel.getForm(newFrm.name).getField('fld_ggsucc').dataProviderID = 'ggsucc';
		solutionModel.getForm(newFrm.name).getField('fld_causale').dataProviderID = 'causale';
		
		elements.tab_timbr.addTab(newFrm.name);

		globals.ma_utl_setStatus(globals.Status.EDIT, newFrm.name);
	}
	else
	   globals.ma_utl_showWarningDialog('Il dipendente non ha un numero di badge valido', 'Aggiunta timbrature multiple');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B8DE9ABB-7B9D-4F36-A26C-CE418D15F13C"}
 */
function annullaInserimento(event) 
{
	canClose = true;
	
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"008A89F7-6718-4691-8DAF-CDB8CFC62ADA"}
 */
function confermaInserimento(event) 
{		
	canClose = true;
	
	var params = {
        processFunction: process_timbratura_multipla,
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
 * @properties={typeid:24,uuid:"F94BDC11-C700-4796-9A07-297AF2C81FDA"}
 */
function process_timbratura_multipla(event)
{
	var _respRiconteggia;
	// foundset della form di inserimento
	var fs = forms['giorn_aggiungi_timbr_tbl_temp'].foundset;
	// foundset generale della tabella delle timbrature
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/ 
	var fsTimbr = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	/** @type {JSFoundset<db:/ma_presenze/e2timbratureservizio>}*/ 
	var fsTimbrServ = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE_SERVIZIO);
	
	// flag per indicare la validità di tutte le timbrature
	var validaTimbrature = 0;
	
	var idLav = forms.giorn_header.idlavoratore ? forms.giorn_header.idlavoratore : forms.giorn_cart_header.idlavoratore;
	var nrBadge = forms.giorn_header.idlavoratore ? forms.giorn_header._vNrBadge : forms.giorn_cart_header._vNrBadge;
	var idGrInst = globals.getGruppoInstallazioneLavoratore(idLav);
	
	for(var j=1; j<=fs.getSize(); j++)
	{
		var recNew = fs.getRecord(j);
		
		if(validaTimbrature != 0)
			break;
		validaTimbrature = globals.validaInserimentoTimbratura(idLav
								                               ,recNew['timbratura']
								                               ,vGiornoTimbr
															   ,recNew['senso']
															   ,recNew['ggsucc']);
	}
	
	switch (validaTimbrature)
	{
	case 0:
		// gestione inserimento timbrature valide
		databaseManager.setAutoSave(false);
        		
		try 
		{
			// situazione anomalia partenza
			var anomaliaPre = globals.getAnomalieGiornata(idLav, utils.dateFormat(vGiornoTimbr, globals.ISO_DATEFORMAT));
						
			databaseManager.startTransaction();   
			
			for (var i = 1; i <= fs.getSize(); i++) 
			{
				var rec = fs.getRecord(i);
				var recTimbr,recTimbrServ;
//				if (vSoloCartolina)
//				/** @type {JSRecord<db:/ma_presenze/e2timbraturedipendenti>} */
//					recTimbr = fsTimbr.getRecord(fsTimbr.newRecord(false));
//				else
				
				// se specificata una causale inseriamo una timbratura causalizzata
				if(rec['causale'])
				{
					/** @type {JSRecord<db:/ma_presenze/e2timbratureservizio>} */
					recTimbrServ = fsTimbrServ.getRecord(fsTimbrServ.newRecord());
					
					recTimbrServ.iddip = idLav;
					recTimbrServ.nr_badge = nrBadge;
					recTimbrServ.dataeora = new Date(vGiornoTimbr.getFullYear(),vGiornoTimbr.getMonth(),vGiornoTimbr.getDate(),_hh,_mm);
					recTimbrServ.senso = rec['senso'];
					recTimbrServ.indirizzo = (vSoloCartolina ? globals.TipiTimbratura.WEB : globals.TipiTimbratura.MANUALE);
					recTimbrServ.causale = rec['causale'];
					recTimbrServ.timbeliminata = false;
					recTimbrServ.idgruppoinst = idGrInst;
					recTimbrServ.ggsucc = rec['ggsucc'];
					recTimbrServ.sensocambiato = 0;
				}
				else
				{
					// se non è stata indicata alcuna causale inseriamo una timbratura effettiva
					/** @type {JSRecord<db:/ma_presenze/e2timbratura>} */
					recTimbr = fsTimbr.getRecord(fsTimbr.newRecord());
	
					if (!recTimbr)
						throw new Error('<html>Inserimento di una o più timbrature non riuscito, verificare e riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.</html>');
					
					recTimbr.iddip = idLav;
					recTimbr.nr_badge = nrBadge;
					recTimbr.senso = rec['senso'];
					recTimbr.indirizzo = rec['causale'] ? globals.TipiTimbratura.CAUSALIZZATA : (vSoloCartolina ? globals.TipiTimbratura.WEB : globals.TipiTimbratura.MANUALE);
					recTimbr.timbeliminata = false;
					recTimbr.idgruppoinst = idGrInst;
					recTimbr.ggsucc = rec['ggsucc'];
					recTimbr.sensocambiato = 0;
	
					var _hh = parseInt(utils.stringLeft(rec['timbratura'], 2), 10);
					var _mm = parseInt(utils.stringRight(rec['timbratura'], 2), 10);
					recTimbr['timbratura'] = scopes.utl.FromDateToTimbratura(vGiornoTimbr, _hh, _mm);		
				}
			}

			var success = databaseManager.commitTransaction();
			if (!success) 
			{
				globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
				globals.svy_mod_closeForm(event);
				var failedrecords = databaseManager.getFailedRecords();
				if (failedrecords && failedrecords.length > 0)
					throw new Error('<html>Inserimento timbrature multiple non riuscito, verificare e riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.</html>');
            }
            globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
			globals.svy_mod_closeForm(event);
            
			forms.giorn_mostra_timbr.is_dirty = true;
			
			// analizza pre conteggio
			forms.giorn_timbr.analizzaPreConteggio(vGiornoTimbr.getDate());
			
			// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
			// la compilazione di base che ve a creare il record nella tabella e2giornaliera
			if(globals.getIdGiornalieraDaIdLavGiorno(idLav,vGiornoTimbr) == null)
			   globals.compilaDalAlSingolo(idLav,[vGiornoTimbr.getDate()]);
			
			// situazione anomalia partenza
			var anomaliaPost = globals.getAnomalieGiornata(idLav, utils.dateFormat(vGiornoTimbr, globals.ISO_DATEFORMAT));
			
			//se il giorno della timbratura modificata risulta già conteggiato
			if (anomaliaPre == 0 && anomaliaPre != anomaliaPost)
			{
				_respRiconteggia = !vSoloCartolina && globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?', 'Modifica timbrature');
				if (_respRiconteggia)
					globals.conteggiaTimbratureSingoloDiretto([idLav],[vGiornoTimbr.getDate()]);
				// ridisegniamo il mostra timbrature
				forms.giorn_header.preparaGiornaliera(false, null, vSoloCartolina);
                
                break;
			} else {
				// ridisegniamo il mostra timbrature
				forms.giorn_header.preparaGiornaliera(false, null, vSoloCartolina);
				break;
			}

			globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);

		} catch (ex) {
			application.output(ex.message, LOGGINGLEVEL.ERROR);
			databaseManager.rollbackTransaction();
			globals.ma_utl_showErrorDialog(ex.message);
			break;
		} finally {
			databaseManager.setAutoSave(false);
		    break;
		}
	case 1:
		globals.ma_utl_showWarningDialog('Timbratura ' + (j - 1) + ': controllare che tutti i campi necessari siano compilati', 'Inserimento timbrature');
		break;
	case 2:
		globals.ma_utl_showWarningDialog('Timbratura ' + (j - 1) + ': controllare che i valori della timbratura siano corretti', 'Inserimento timbrature');
		break;
	case 3:
		globals.ma_utl_showWarningDialog('Timbratura ' + (j - 1) + ': esiste già una timbratura con questi valori!', 'Inserimento timbrature');
		break;
	default:
		break;
	}
	
	plugins.busy.unblock();	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Aggiunge un record per l'inserimento di una nuova timbratura del giorno 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"99BE370F-A913-4667-AAFC-D321B0A05162"}
 */
function aggiungiNuovaTimbrMulti(event)
{
	var frmName = 'giorn_aggiungi_timbr_tbl_temp';
	var fs = forms[frmName].foundset;
	var recIndex = fs.newRecord(false);
	if(recIndex == -1)
	{
		globals.ma_utl_showErrorDialog('Errore durante l\'aggiunta della nuova timbratura','Aggiungi una timbratura alla giornata (multipla)');
		return;
	}
		
	var rec = fs.getRecord(recIndex);
	rec['senso'] = (fs.getRecord(recIndex - 1) ? !fs.getRecord(recIndex - 1)['senso'] : 0);
	rec['timbratura'] = "";
	vSoloCartolina ? rec['orologio'] = 'wb' : rec['orologio'] = "mn";
	rec['ggsucc'] = 0;
	rec['sensocambiato'] = 0;
	
}

/**
 * Elimina un record precedentemente creato per la timbratura del giorno
 * 
 * @param {JSEvent} event
 *
 * @private
 * 
 * @properties={typeid:24,uuid:"7F88FF13-A629-4804-AE03-95466AAD9478"}
 */
function eliminaTimbrMulti(event)
{
	var frmName = 'giorn_aggiungi_timbr_tbl_temp';
	var fs = forms[frmName].foundset;
	var rec = fs.getSelectedRecord();
	fs.deleteRecord(rec);
}
