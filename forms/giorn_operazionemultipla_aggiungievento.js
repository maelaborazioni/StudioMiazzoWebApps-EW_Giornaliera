/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"F4D202C6-A8E5-4B08-8B37-A933FF3D7B12"}
 */
var vProprieta = null;

/**
 * @properties={typeid:24,uuid:"93F846D3-EB3E-4330-825C-52AB96FAE3C7"}
 */
function FiltraEvento(fs)
{
	// TODO Filtraggio sugli eventi selezionabili per la ditta (metodo FiltraEventiSelezionabiliDitta)
    return fs;
}

/**
 * Aggiorna i campi codice e vento e descrizione dopo la selezione dell'evento desiderato e
 * la valuelist delle proprietà selezionabili per il determinato evento
 * 
 * @param _rec
 *
 * @properties={typeid:24,uuid:"FFF795C1-C295-48EA-BD4A-4EB1F151CA24"}
 */
function AggiornaProprietaEventoMultiplo(_rec)
{
	_idevento = _rec.idevento;
	_codevento = _rec.evento;
	_descevento = _rec.descriz;
	 
	_oldOre = 0,00;
	vCoperturaOrarioTeorico = 0;
	
	var numPropEv = globals.getVlsProprietaEvento(_idevento);
	
	switch(numPropEv)
	{
		case 2 :
		elements.fld_proprieta.enabled = true;	
		_oldProprieta = 'D';
		application.setValueListItems('vls_evento_proprieta',new Array('Diurno','Notturno'),new Array('D','N'));
		break;
		case 4 :
		elements.fld_proprieta.enabled = true;	
		_oldProprieta = 'G';
		application.setValueListItems('vls_evento_proprieta',new Array('Accantonata','Goduta','Retribuita','Non retribuita'),new Array('A','G','R','N'));
	    break;
	    default:
	    elements.fld_proprieta.enabled = false;	
	    application.setValueListItems('vls_evento_proprieta',new Array(),new Array());
	    _oldProprieta = null;
	    break;
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}


/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AB74D17E-B48D-497B-97A6-E6057C62D8A1"}
 */
function onShow(firstShow, event)
{
	elements.fld_proprieta.enabled = false;	
    application.setValueListItems('vls_evento_proprieta',new Array(),new Array());
    _oldProprieta = null;
}

/**
 * Visualizza l'albero con gli eventi selezionabili
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"38FE163C-72F7-4599-812A-00C4048DA4B9"}
 */
function showLkpAlberoEventiEvMult(event)
{
	// TODO solo eventi selezionabili per la ditta in questione
	var _sqlEvSel = 'SELECT E.idEvento FROM E2Eventi E \
			        INNER JOIN E2EventiClassi EC \
			        ON E.idEventoClasse = EC.IdEventoClasse \
			        WHERE EC.GestitoConStorico = 0';

    var _arrEvSel = [];

    var _dsEvSel = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlEvSel,_arrEvSel,-1);

    globals._arrIdEvSelezionabili = _dsEvSel.getColumnAsArray(1);

    forms.giorn_lkp_eventi._destFormName = controller.getName();
    forms.giorn_lkp_eventi.arrIdEventi = globals._arrIdEvSelezionabili; 
    globals.ma_utl_showFormInDialog(forms.giorn_lkp_eventi.controller.getName(),'Eventi selezionabili');
}

/**
 * @param {Number} idEvento
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"DDE4B020-B1AC-4AFB-ABAB-D3BE947F7997"}
 */
function confermaSelezioneEventoDaAlbero(idEvento)
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = idEvento;
    	eventiFs.search();
    	
    	if (globals.needsCertificate(eventiFs.ideventoclasse)) 
		{
		    globals.ma_utl_showWarningDialog('L\'evento è gestibile solo attraverso le certificazioni','Conferma selezione evento');
		    return;
		}
    	
    	if(eventiFs.e2eventi_to_e2eventiclassi.tipo == globals.TipoEvento.STATISTICO
    		|| eventiFs.e2eventi_to_e2eventiclassi.tipo == globals.TipoEvento.AGGIUNTIVO)
		{
			elements.chk_copertura.enabled = false;
			vCoperturaOrarioTeorico = 0;
		}
		else
		    elements.chk_copertura.enabled = true;
    	
    	AggiornaProprietaEventoMultiplo(eventiFs.getRecord(1));
    	
    }
}


/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"86E5A93A-5305-4A6B-B759-20E608F3CE12"}
 */
function onDataChangeEvento(oldValue, newValue, event) 
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventi'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventi'].table_name);
	
	// Filtra gli eventi selezionabili
	_foundset.addFoundSetFilterParam('idevento','IN',globals._arrIdEvSelezionabili,'ftr_evSelezionabili');
	_foundset.addFoundSetFilterParam('evento', '=', newValue.toUpperCase());
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {

		if (globals.needsCertificate(_foundset.ideventoclasse)) 
		{
		    globals.ma_utl_showWarningDialog('L\'evento è gestibile solo attraverso le certificazioni','Conferma selezione evento');
		    _codevento = oldValue;
		    return true;
		}
		
		_idevento = _foundset['idevento'];
		_descevento = _foundset['descriz'];
		_ideventoclasse = _foundset['ideventoclasse'];
				
		if(_foundset.e2eventi_to_e2eventiclassi.tipo == globals.TipoEvento.STATISTICO
			|| _foundset.e2eventi_to_e2eventiclassi.tipo == globals.TipoEvento.AGGIUNTIVO)
		{
			elements.chk_copertura.enabled = false;
			vCoperturaOrarioTeorico = 0;
		}
		else
		    elements.chk_copertura.enabled = true;
		
		AggiornaProprietaEventoMultiplo(_foundset.getSelectedRecord());
		
	} else {
		_codevento = oldValue;
		showLkpAlberoEventiEvMult(event);
	}

	return true;
}
