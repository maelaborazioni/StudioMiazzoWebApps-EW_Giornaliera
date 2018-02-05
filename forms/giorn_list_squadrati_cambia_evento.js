/**
 * Aggiorna i campi codice evento e descrizione dopo la selezione dell'evento desiderato e
 * la valuelist delle proprietà selezionabili per il determinato evento
 * 
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 *
 * @properties={typeid:24,uuid:"EE344F7A-B96C-4241-A750-004922F66E7D"}
 */
function AggiornaEventoNew_(_rec) 
{	
	vIdEventoClasseNew = _rec.idevento;
	vCodEventoNew = _rec.evento;
	vDescEventoNew = _rec.descriz;
	
	var numPropEv = globals.getVlsProprietaEvento(vIdEventoClasseNew);
	
	switch(numPropEv)
	{
		case 2 :
		elements.fld_proprieta_new.enabled = true;	
		vProprietaNew = 'D';
		application.setValueListItems('vls_evento_proprieta',new Array('Diurno','Notturno'),new Array('D','N'));
		break;
		case 4 :
		elements.fld_proprieta_new.enabled = true;	
		vProprietaNew = 'G';
		application.setValueListItems('vls_evento_proprieta',new Array('Accantonata','Goduta','Retribuita','Non retribuita'),new Array('A','G','R','N'));
	    break;
	    default:
	    elements.fld_proprieta_new.enabled = false;	
	    application.setValueListItems('vls_evento_proprieta',new Array(),new Array());
	    vCodProprietaNew = null;
	    break;
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * Filtra gli eventi selezionabili per la ditta
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"49A6F03E-4D72-4AA4-A899-10E0D75529B4"}
 */
function FiltraEventiNew(_fs)
{
	// TODO Filtraggio sugli eventi selezionabili per la ditta (metodo FiltraEventiSelezionabiliDitta) 
	return _fs;
}

/**
 * Filtra gli eventi presenti  per la ditta
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"3C18C3E1-C92E-4E2A-BC48-EE244F1F4016"}
 */
function FiltraEventiOld(_fs)
{
	// TODO Filtraggio sugli eventi selezionabili per la ditta (metodo FiltraEventiSelezionabiliDitta) 
	return _fs;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3756165A-B94C-4BC3-BA26-CBD73920F602"}
 */
function confermaCambiaEvento_sync(event) 
{
	var frmOpt = forms.giorn_list_squadrati_ditta;
	var idDitta = frmOpt.idditta;
	var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
//	var dallaData = frmOpt.chkLimitaDal && frmOpt.limitaDal ? frmOpt.limitaDal : new Date(frmOpt.annoRif,frmOpt.meseRif - 1,1);
//	var allaData = frmOpt.chkLimitaAl && frmOpt.limitaAl ? frmOpt.limitaAl : new Date(frmOpt.annoRif,frmOpt.meseRif - 1,globals.getTotGiorniMese(frmOpt.meseRif,frmOpt.annoRif));
	
	var objDipsParams = {
		                 lavoratori_giorni : [],
						 idevento_old : vIdEventoOld,
						 proprieta_old : vProprietaOld,
						 id_evento_new : vIdEventoNew,
						 proprieta_new : vProprietaNew
			            };
	
	for(var l = 0; l < frmOpt.arrDipSquadrati.length; l++)
	{
		var arrGiorniSel = [];
		var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
		/** @type {RuntimeTabPanel} */
		var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
		var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
		for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
		{
			if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
				arrGiorniSel.push(globals.getGiornoDaIdGiornaliera(frmSquadratureDip.foundset.getRecord(sq)['idgiornaliera']));
		}
		
		if(arrGiorniSel.length > 0)
		   objDipsParams.lavoratori_giorni.push({idlavoratore : frmOpt.arrDipSquadrati[l],
							                     giorni_selezionati : arrGiorniSel
						                        });
		
	}
		
	var retVal;
	for(var lg = 0; lg < objDipsParams.lavoratori_giorni.length; lg++)
	{
		retVal = false;
		var objDipParams = objDipsParams.lavoratori_giorni[lg];
		
		for(var g = 0; g < objDipParams.giorni_selezionati.length; g++)
		{
			var currGiorno = objDipParams.giorni_selezionati[g];
		    retVal = globals.cambiaEventoSync(idDitta
			                              ,periodo
										  ,[objDipParams.idlavoratore]
										  ,currGiorno
										  ,currGiorno
										  ,objDipsParams.idevento_old
										  ,objDipsParams.id_evento_new
										  ,objDipsParams.proprieta_old
										  ,objDipsParams.proprieta_new
										  ,globals.TipoGiornaliera.NORMALE
										  ,globals.TipoConnessione.CLIENTE);
		}
	
		if(retVal)
		{
			globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
			globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
				                                             globals.getAnnoDaPeriodo(periodo),
															 globals.getMeseDaPeriodo(periodo));
		}
	}
 
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
 * @properties={typeid:24,uuid:"3231B924-6949-445E-BB11-0100E572B20B"}
 */
function annullaCambiaEvento(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"67C134DA-CDD0-4497-9E80-749F9E3CFF30"}
*/
function onHide(event) {
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	_super.onHide(event);
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
 * @properties={typeid:24,uuid:"6EC7CF62-A3D1-44F9-AAF1-88AF5FA87703"}
 */
function onDataChangeEventoNew(oldValue, newValue, event) 
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventi'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventi'].table_name);
	
	// Filtra gli eventi selezionabili
	// TODO contemplare il filtro sugli eventi selezionabili per la ditta
//	_foundset.addFoundSetFilterParam('idevento','IN',globals._arrIdEvSelezionabili,'ftr_evSelezionabili');
	_foundset.addFoundSetFilterParam('evento', '=', newValue.toUpperCase());
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {

		vIdEventoNew = _foundset['idevento'];
		vDescEventoNew = _foundset['descriz'];
		vIdEventoClasseNew = _foundset['ideventoclasse'];
		
		AggiornaEventoNew(_foundset.getSelectedRecord());
		
	} else {
		vCodEventoOld = oldValue;
		showLkpAlberoEventiNew(event);
	}

	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6A44F914-A328-4563-977F-6F735B03CB5A"}
 */
function showLkpAlberoEventiOld(event) 
{
	var _sqlEvSel = 'SELECT EEP.idEvento FROM F_Gio_ElencoEventiPeriodo(?,?,?,?) EEP \
			         INNER JOIN E2EventiClassi EC \
			         ON EEP.idEventoClasse = EC.IdEventoClasse \
			         WHERE EC.GestitoConStorico = 0';

    var _arrEvSel = [vIdDitta,
			         utils.dateFormat(vDateFrom,globals.ISO_DATEFORMAT),
					 utils.dateFormat(vDateTo,globals.ISO_DATEFORMAT),
					 globals.TipoGiornaliera.NORMALE];
    
    var _dsEvSel = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlEvSel,_arrEvSel,-1);
    
    globals._arrIdEvSelezionabiliCE = _dsEvSel.getColumnAsArray(1);
    
    globals._arrIdEvSelezionabili = globals.getEventiGiornalieraPeriodo(vIdDitta,vDateFrom,vDateTo);
    
    boolNew = false;
    forms.giorn_lkp_eventi._destFormName = controller.getName();
    forms.giorn_lkp_eventi.arrIdEventi = globals._arrIdEvSelezionabiliCE;
	globals.ma_utl_showFormInDialog(forms.giorn_lkp_eventi.controller.getName(),'Evento da sostituire');
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"871301D4-ACE9-4C11-8684-499335DE499B"}
 */
function showLkpAlberoEventiNew(event)
{
	// TODO solo eventi selezionabili per la ditta in questione
	var _sqlEvSel = 'SELECT E.idEvento FROM E2Eventi E \
			        INNER JOIN E2EventiClassi EC \
			        ON E.idEventoClasse = EC.IdEventoClasse \
			        WHERE EC.GestitoConStorico = 0';

    var _arrEvSel = [];

    var _dsEvSel = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlEvSel,_arrEvSel,-1);

    globals._arrIdEvSelezionabiliCE = _dsEvSel.getColumnAsArray(1);

    globals._arrIdEvSelezionabili = globals.getEventiGiornalieraPeriodo(vIdDitta,vDateFrom,vDateTo);
    
    boolNew = true;
    forms.giorn_lkp_eventi._destFormName = controller.getName();
    forms.giorn_lkp_eventi.arrIdEventi = globals._arrIdEvSelezionabiliCE; 
    globals.ma_utl_showFormInDialog(forms.giorn_lkp_eventi.controller.getName(),'Evento da inserire');
}

/**
 * @param {Number} idevento
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"12BB8914-4351-4610-BA51-241C00E03CE5"}
 */
function confermaSelezioneEventoDaAlbero(idevento)
{
	/** @type {JSFoundset<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = idevento;
    	eventiFs.search();
    	
    	boolNew ? AggiornaEventoNew(eventiFs.getRecord(1)) : AggiornaEventoOld(eventiFs.getRecord(1));
    	
    }
}