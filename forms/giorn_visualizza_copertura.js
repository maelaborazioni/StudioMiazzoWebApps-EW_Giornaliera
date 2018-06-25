/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4A0530A4-134F-4FD0-8139-3B0B74663A04",variableType:8}
 */
var pages;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C20D10C4-504F-43D2-984D-DEDD57718B13",variableType:4}
 */
var currPage = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EA52E963-57DE-4C24-9E89-A3FE0CD832DF",variableType:4}
 */
var dipPerPage = 10;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"006A0B4E-B73D-4AEA-AFD3-8AB576BFFD60"}
 * @AllowToRunInFind
 */
function refreshCoperturaAssenze(event) {

	// identificazione da quale form opzioni è stato generato l'evento
	var frmName = event.getFormName() || 'rp_visualizza_copertura_situazione';
	// associazione del nome della form contenitore
	var frmContName = (frmName == 'rp_visualizza_copertura_situazione' || frmName == 'rp_visualizza_copertura_situazione_multi')  ? 'rp_visualizza_copertura' : controller.getName();
	
	/** @type{RuntimeForm<giorn_visualizza_copertura_situazione>}*/
	var frm = forms[frmName];
	var _dal = frm.vDal;
	var _al = frm.vAl;
	
	var numGiorni = Math.floor((_al - _dal)/86400000) + 1;
	
	var abilitataGestore = globals.ma_utl_hasKey(globals.Key.AUT_GESTORE);
	var abilitataVCTutti = globals.ma_utl_hasKey(globals.Key.AUT_VC_TUTTI);
	var abilitataVCLivello = globals.ma_utl_hasKey(globals.Key.AUT_VC_LIVELLO_GERARCHICO) 
	                         && _to_sec_organization.sec_organization_to_sec_organization_hierarchy_children == null;
	
	// rimozione eventuali filtri su singola ditta
	databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_idditta');
	
	// rimozione filtri dipendenti e/o gerarchici
	if(abilitataVCTutti 
		|| abilitataVCLivello
		|| abilitataGestore)
		databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_dati_lavoratori_gerarchia');
	
	// filtra i lavoratori
	if(foundset.find())
	{
		foundset.assunzione = '^||<=' + utils.dateFormat(_al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		foundset.cessazione = '^||>=' + utils.dateFormat(_dal,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
    }
	
    // filtro su tutte le ditte standard del gruppo
    if(abilitataVCTutti || abilitataGestore)
       	foundset.idditta = globals.getDitte();
    
    // filtro sui lavoratori appartenenti allo stesso livello gerarchico nel caso di nodo foglia
    else if(abilitataVCLivello)
    	foundset.idlavoratore = globals.getLavoratoriLivelloGerarchico(globals.svy_sec_lgn_user_org_id);
    
    if(frm.vIdDitta && frm.vIdDitta != -1)
    	foundset.idditta = frm.vIdDitta;
    
    // se indicato un gruppo considera solo i dipendenti del gruppo specificato
	if (frm.vGroupId != -1 || frm.vArrGroupId.length > 0) 
	{
//		if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) 
//		{
			// recupero dell'array con tutti i lavoratori appartenenti a i gruppi scelti
			if(frm.vArrGroupId.length)
			{
				var arrLavReparti = [];
				for(var _g = 0; _g < frm.vArrGroupId.length; _g++)
				{
					var arrLavReparto = globals.getLavoratoriReparto(frm.vArrGroupId[_g]);
					for(var _r = 0; _r <= arrLavReparto.length; _r++)
					{
						if(arrLavReparti.indexOf(arrLavReparto[_r]) == -1)
							arrLavReparti.push(arrLavReparto[_r]);
					}
				}
				foundset.idlavoratore = arrLavReparti;
			}
			else
				foundset.idlavoratore = globals.getLavoratoriReparto(frm.vGroupId);
//		}
//		else
//		{
//			/** @type {JSFoundset<db:/svy_framework/sec_user_right>}*/
//			var fsUserRight = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_right');
//			
//			if (fsUserRight.find())
//			{
//				fsUserRight.group_id = (frm.vArrGroupId && frm.vArrGroupId.length) ? frm.vArrGroupId : frm.vGroupId;
//				fsUserRight.sec_user_right_to_sec_security_key.is_client = 1;
//				if (fsUserRight.search()) 
//				{
//					/** @type {JSFoundset<db:/ma_framework/v_sec_filtrilavoratori>} */
//					var fsSecLavoratori = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, 'v_sec_filtrilavoratori');
//					if (fsSecLavoratori.find()) 
//					{
//						fsSecLavoratori.exclude = 0;
//						fsSecLavoratori.idchiave = globals.foundsetToArray(fsUserRight.sec_user_right_to_sec_security_key, 'security_key_id');
//						fsSecLavoratori.search();
//						foundset.idlavoratore = globals.foundsetToArray(fsSecLavoratori, 'idlavoratore');
//					} 
//					else
//					{
//						globals.ma_utl_showErrorDialog('Errore nel recupero dei dati dei lavoratori associati alla chiave', 'Visualizza copertura');
//						return;
//					}
//				}
//			}
//			else 
//			{
//				globals.ma_utl_showErrorDialog('Errore nel recupero dei dati delle chiavi utenti', 'Visualizza copertura');
//				return;
//			}
//		}
	}
	
	// filtro su sede di lavoro
	if(frm.vChkSedeDiLavoro)
	   foundset.iddittasede = (frm.vArrIdSede && frm.vArrIdSede.length) ? frm.vArrIdSede : frm.vIdSede;
	// filtro su centro di costo
	if(frm.vChkCentroDiCosto)
		foundset.lavoratori_to_lavoratori_classificazioni.codclassificazione = (frm.vArrCodCentroDiCosto && frm.vArrCodCentroDiCosto.length) ? 
				                                                                frm.vArrCodCentroDiCosto : 
	                                                                            frm.vCodCentroDiCosto.toString();
	
	// rimozione di tabpanels precedenti
    forms[frmContName].elements.tab_copertura.removeAllTabs();
    forms[frmContName].elements.tab_copertura.transparent = false;
    forms[frmContName].elements.tab_riepilogo.removeAllTabs();
    
    // dataset copertura assenze
	var size = foundset.search();
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.INTEGER];
	var columns = ['IdLavoratore','Codice','Nominativo','HaRichieste'];
	var dsCop = databaseManager.createEmptyDataSet(size,columns);
	
	// dataset riepilogo
	var typesRiep = [JSColumn.TEXT];
	var columnsRiep = ['Intestazione'];
	var dsRiep = databaseManager.createEmptyDataSet(1,columnsRiep);
	dsRiep.setValue(1,1,'% COPERTURA DEL GIORNO');
	
	for(var G = 1; G <= numGiorni; G++)
	{
		// per eventuale gestione della visualizzazione del codice evento
		types.push(JSColumn.TEXT);
		dsCop.addColumn('giorno_'+ G,G + 4,JSVariable.TEXT);
		
		typesRiep.push(JSColumn.NUMBER);
		dsRiep.addColumn('perc_cop_'+ G,G + 1,JSVariable.NUMBER);
	}
	
	var arrFasceRaggruppamento = [];
	if(frm.vChkGruppoFasce)
	   arrFasceRaggruppamento = globals.getFasceOrarieDaRaggruppamento(frm.vIdGruppoFasce);
	
	// ciclo su tutti i lavoratori
	for(var l = 1; l <= size; l++)
	{
		// recupero del record originale dei lavoratori
	    var rec = foundset.getRecord(l); 
	    // inizializzazione valori
	    dsCop.setValue(l,1,rec.idlavoratore);
	    dsCop.setValue(l,2,rec.codice);
	    dsCop.setValue(l,3,rec.lavoratori_to_ditte.ditte_to_ditte_legami.getSelectedRecord() == null ? rec.lavoratori_to_persone.nominativo : rec.lavoratori_to_lavoratori_personeesterne.nominativo);
		dsCop.setValue(l,4,0);
	    
		// recupero del record della giornaliera
	    var recGiorn = rec.lavoratori_to_e2giornaliera;
	    
	    var _giorno = new Date(_dal.getFullYear(),_dal.getMonth(),_dal.getDate());
	    var _tipoAssenza; 
	    var _tipoGiornaliera;
	    			    
	    // ciclo su tutti i giorni
	    for (var g = 1; g <= numGiorni; g++) 
		{
			_giorno = new Date(_dal.getFullYear(),_dal.getMonth(),_dal.getDate() + (g - 1));
	
			var _isConteggiato = globals.isGiornoConteggiato(rec.idlavoratore,_giorno); 
			// verifica della tipologia evento da considerare : se il giorno è conteggiato e senza anomalie considero gli eventi della 
			// giornaliera normale altrimenti verifica quelli della budget 
			if(_isConteggiato)
				_tipoGiornaliera = globals.TipoGiornaliera.NORMALE;
			else
			    _tipoGiornaliera = globals.TipoGiornaliera.BUDGET;
			
			// verifica della presenza o meno nel turno richiesto
			var _isInTurno = false;
			if(frm.vChkGruppoFasce)
			{
				var objFascia = globals.ottieniInformazioniFasciaGiorno(rec.idlavoratore,_giorno);
				if(arrFasceRaggruppamento.indexOf(objFascia['idfascia']) != -1)
	               _isInTurno = true;
				else
				{
					_tipoAssenza = globals.TipoAssenza.NON_IN_TURNO
					dsCop.setValue(l,g + 4,_tipoAssenza);
				}
			}
			
			if(recGiorn.find())
			{
				recGiorn.giorno = _giorno;
				recGiorn.tipodirecord = _tipoGiornaliera;
				
				if(frm.vChkGruppoFasce)
				   recGiorn.e2giornaliera_to_e2fo_fasceorarie.idfasciaoraria = arrFasceRaggruppamento;
				
				// considera prima gli eventi in giornaliera normale, altrimenti quelli in budget
				if(recGiorn.search() > 0)
				{
					// recupero del record per gli eventi di giornaliera
					var currRecGiorn = recGiorn.e2giornaliera_to_e2giornalieraeventi;
					var resSize = currRecGiorn.getSize();
					var totOreEvSost = 0;
					var _oreTeoricheGiorno = recGiorn.e2giornaliera_to_e2fo_fasceorarie ? 
							                 recGiorn.e2giornaliera_to_e2fo_fasceorarie.totaleorefascia : null; // per tener conto di eventuali assunzioni/cessazioni nel periodo
					var currRecGiornEv = null;
					var currRecGiornIdEv = null;
					for(var r = 1; r <= resSize; r++)
					{
						currRecGiornEv = currRecGiorn.getRecord(r);
						
						// condizioni da soddisfare per visualizzare o meno gli eventi in copertura 
						if(currRecGiornEv 
								&& currRecGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo == 'S'
								&& currRecGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconperiodi == 0)
						{
							if(currRecGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconstorico)
								_tipoAssenza = globals.TipoAssenza.STORICO;
							// eventuali eventi da definire per giorni già conteggiati nel futuro non vengono considerati
						    if(currRecGiornEv.e2giornalieraeventi_to_e2eventi.evento == '?' 
						       && _giorno > globals.TODAY)
						    	break;
						    
						    totOreEvSost += currRecGiornEv.ore;
							currRecGiornIdEv = currRecGiornEv.idgiornalieraeventi;
						    
						}
						
					}
					
					// compilazione valori tabella
					if(totOreEvSost > 0)
					{	
                       if(dsCop.getValue(l,4) == 0)
							dsCop.setValue(l,4,1); // setta ad uno il valore del campo haRichieste
					   
                       // impostazione tipo assenza in base al tipo di giornaliera ed al numero di ore dell'evento
                       if(_tipoGiornaliera != globals.TipoGiornaliera.BUDGET)
                       {
                          if(totOreEvSost == _oreTeoricheGiorno)
						     _tipoAssenza = globals.TipoAssenza.TOTALE;
					      else
						     _tipoAssenza = globals.TipoAssenza.PARZIALE;
                       }   
                       else
                    	   _tipoAssenza = globals.TipoAssenza.BUDGET;
                    	   
                       dsCop.setValue(l,g + 4,currRecGiornIdEv + _tipoAssenza);
											    
					}
					else
					{
						if(frm.vChkGruppoFasce && !_isInTurno)
						{
							_tipoAssenza = globals.TipoAssenza.NON_IN_TURNO
							dsCop.setValue(l,g + 4,_tipoAssenza);
						}
						else
					        dsCop.setValue(l,g + 4,null);
					}			
				}
								
			}
			
			// altrimenti, se il giorno non è ancora stato conteggiato, verifica possibili coperture date da richieste non ancora confermate
			if(!_isConteggiato 
					&& dsCop.getValue(l,g + 4) == null)
			{
				_tipoAssenza = globals.TipoAssenza.RICHIESTA;
				// recupera giorni ed eventi di richieste non ancora confermate
				var recRigaGiorno = globals.ottieniRichiesteSospeseGiorno(rec.idlavoratore,_giorno);	
				if(recRigaGiorno && (!frm.vChkGruppoFasce || (frm.vChkGruppoFasce && _isInTurno)))
				{
				   if(dsCop.getValue(l,4) != 2)
	                  dsCop.setValue(l,4,2); // setta a due il valore del campo haRichieste	
				   dsCop.setValue(l,g + 4,recRigaGiorno.idlavoratoregiustificativorighe + _tipoAssenza);
				}
				else if(frm.vChkGruppoFasce)
				{
					_tipoAssenza = _isInTurno ? globals.TipoAssenza.IN_TURNO : globals.TipoAssenza.NON_IN_TURNO;
					dsCop.setValue(l,g + 4,_tipoAssenza);
				}
			}
			
		}
	}
	
	// riga riepilogo % copertura
	for (g = 1; g <= numGiorni; g++) 
	{
		_giorno = new Date(_dal.getFullYear(),_dal.getMonth(),_dal.getDate() + (g - 1));
		var totOreTeoricheGiorno = 0;
		var totOreAssenzaGiorno = 0;
		
		for(l = 1; l <= size; l++)
		{
			if(!frm.vChkGruppoFasce 
				|| (frm.vChkGruppoFasce 
				   && arrFasceRaggruppamento.indexOf(globals.ottieniInformazioniFasciaGiorno(dsCop.getValue(l,1),_giorno).idfascia) != -1))
				   {
						totOreTeoricheGiorno += globals.ottieniOreTeoricheGiorno(dsCop.getValue(l,1),_giorno)/100;
						totOreAssenzaGiorno += (globals.isGiornoConteggiato(dsCop.getValue(l,1),_giorno) ?
								                globals.getTotaleOreSostitutive(dsCop.getValue(l,1),_giorno,_giorno,arrFasceRaggruppamento) :
								                globals.getTotaleOreSostitutiveInBudget(dsCop.getValue(l,1),_giorno,_giorno,arrFasceRaggruppamento) 
								                + globals.getTotaleOreSostitutiveRichieste(dsCop.getValue(l,1),_giorno,_giorno));
				   }
		}
		
		totOreAssenzaGiorno == 0 ? dsRiep.setValue(1,g + 1,100) :
	 	                           dsRiep.setValue(1,g + 1,Math.round(((totOreTeoricheGiorno - totOreAssenzaGiorno)/totOreTeoricheGiorno)*100));
	}
	
	// in caso di flag vanno considerati solo dipendenti con richieste
	if(frm.vSoloDipConRichieste)
	{
		var arrDipConRichieste = dsCop.getColumnAsArray(4);
		var arrSize = arrDipConRichieste.length;
		var dsSize = dsCop.getMaxRowIndex();
		for(var k=1; k <= arrSize; k++)
		{
			if(frm.vTipoRichieste == 2 && arrDipConRichieste[k-1] != 2
				|| frm.vTipoRichieste == 1 && arrDipConRichieste[k-1] == 0)
		    dsCop.removeRow(k - (dsSize - dsCop.getMaxRowIndex()));
		}
	}
		
	// nel caso di nessun dipendente presente nella selezione mostriamo un messaggio
	if(dsCop.getMaxRowIndex() == 0)
		forms[frmContName].elements.tab_copertura.transparent = true;	
	else
	{
		var idDitta = (frm.vIdDitta && frm.vIdDitta != -1) ?  frm.vIdDitta :
			globals.getDitta(idlavoratore) ? globals.getDitta(idlavoratore) : globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].idditta;
		var numDip = dsCop.getMaxRowIndex();
		dsCop.sort(3,true)
		
		var dSCop = dsCop.createDataSource('_vcDataSource_' + idDitta + '_' + numGiorni + '_' + numDip, types);
		var dSRiep = dsRiep.createDataSource('_vcDataSourceRiep_' + idDitta + '_' + numGiorni + '_' + numDip,typesRiep);
		
		setVCParams(idDitta,dSCop,numGiorni,numDip,_dal,_al);
		
		globals.disegnaVisualizzazioneCoperturaAssenze(dSCop,
					                                   idDitta,
													   numGiorni,
													   numDip,
													   _dal,
													   frmContName,
													   dSRiep);
	}	
	
	// riapplicazione filtri sui lavoratori e/o filtri gerarchici
	if(abilitataVCLivello)
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.LAVORATORI,
			'idlavoratore',
			globals.ComparisonOperator.IN,
			globals.ma_sec_setUserHierarchy(globals.svy_sec_lgn_user_org_id,
				                            globals.ma_sec_lgn_groupid),
			'ftr_dati_lavoratori_gerarchia'
		);
	
//	forms[frmContName].elements.tab_legenda.visible = showLegenda;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"A391706E-9BFB-428B-ABAC-7EA3E377D490"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function refreshCoperturaTurni(event) {

	// identificazione da quale form opzioni è stato generato l'evento
	var frmName = event.getFormName() || event.data.formname;
	// associazione del nome della form contenitore
	var frmContName = forms.giorn_prog_turni_visualizza_copertura.controller.getName();
	
	/** @type{RuntimeForm<giorn_prog_turni_visualizza_copertura_situazione>}*/
	var frm = forms[frmName];
	var _dal = frm.vDal;
	var _al = frm.vAl;
	
	var numGiorni = Math.floor((_al - _dal)/86400000) + 1;
	
	var abilitataGestore = globals.ma_utl_hasKey(globals.Key.AUT_GESTORE);
	var abilitataVCTutti = globals.ma_utl_hasKey(globals.Key.AUT_VC_TUTTI);
	var abilitataVCLivello = globals.ma_utl_hasKey(globals.Key.AUT_VC_LIVELLO_GERARCHICO) 
	                         && _to_sec_organization.sec_organization_to_sec_organization_hierarchy_children == null;
	
	// rimozione eventuali filtri su singola ditta
	databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_idditta');
		
	// rimozione filtri dipendenti e/o gerarchici
	if(abilitataVCTutti || abilitataVCLivello)
		databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_dati_lavoratori_gerarchia');
	
	// filtra i lavoratori
	if(foundset.find())
	{
		foundset.assunzione = '^||<=' + utils.dateFormat(_al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		foundset.cessazione = '^||>=' + utils.dateFormat(_dal,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
    }
	
    // filtro su tutte le ditte standard del gruppo
    if(abilitataVCTutti || abilitataGestore)
       	foundset.idditta = globals.getDitte();
    // filtro sui lavoratori appartenenti allo stesso livello gerarchico nel caso di nodo foglia
    else if(abilitataVCLivello)
    	foundset.idlavoratore = globals.getLavoratoriLivelloGerarchico(globals.svy_sec_lgn_user_org_id);
    
    if(frm.vIdDitta && frm.vIdDitta != -1)
    	foundset.idditta = frm.vIdDitta;
    
    // se indicato un gruppo considera solo i dipendenti del gruppo specificato
	if (frm.vGroupId != -1 || frm.vArrGroupId.length > 0) 
	{
//		if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) 
//		{
			// recupero dell'array con tutti i lavoratori appartenenti a i gruppi scelti
			if(frm.vArrGroupId.length)
			{
				var arrLavReparti = [];
				for(var _g = 0; _g < frm.vArrGroupId.length; _g++)
				{
					var arrLavReparto = globals.getLavoratoriReparto(frm.vArrGroupId[_g]);
					for(var _r = 0; _r <= arrLavReparto.length; _r++)
					{
						if(arrLavReparti.indexOf(arrLavReparto[_r]) == -1)
							arrLavReparti.push(arrLavReparto[_r]);
					}
				}
				foundset.idlavoratore = arrLavReparti;
			}
			else
				foundset.idlavoratore = globals.getLavoratoriReparto(frm.vGroupId);
//		}
//		else
//		{
//			/** @type {JSFoundset<db:/svy_framework/sec_user_right>}*/
//			var fsUserRight = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_right');
//			
//			if (fsUserRight.find())
//			{
//				fsUserRight.group_id = (frm.vArrGroupId && frm.vArrGroupId.length) ? frm.vArrGroupId : frm.vGroupId;
//				fsUserRight.sec_user_right_to_sec_security_key.is_client = 1;
//				if (fsUserRight.search()) 
//				{
//					/** @type {JSFoundset<db:/ma_framework/v_sec_filtrilavoratori>} */
//					var fsSecLavoratori = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, 'v_sec_filtrilavoratori');
//					if (fsSecLavoratori.find()) 
//					{
//						fsSecLavoratori.exclude = 0;
//						fsSecLavoratori.idchiave = globals.foundsetToArray(fsUserRight.sec_user_right_to_sec_security_key, 'security_key_id');
//						fsSecLavoratori.search();
//						foundset.idlavoratore = globals.foundsetToArray(fsSecLavoratori, 'idlavoratore');
//					} 
//					else
//					{
//						globals.ma_utl_showErrorDialog('Errore nel recupero dei dati dei lavoratori associati alla chiave', 'Visualizza copertura');
//						return;
//					}
//				}
//			}
//			else 
//			{
//				globals.ma_utl_showErrorDialog('Errore nel recupero dei dati delle chiavi utenti', 'Visualizza copertura');
//				return;
//			}
//		}
	}
	
	// filtro su sede di lavoro
	if(frm.vChkSedeDiLavoro)
		foundset.iddittasede = (frm.vArrIdSede && frm.vArrIdSede.length) ? frm.vArrIdSede : frm.vIdSede;
	// filtro su centro di costo
	if(frm.vChkCentroDiCosto)
		foundset.lavoratori_to_lavoratori_classificazioni.codclassificazione = (frm.vArrCodCentroDiCosto && frm.vArrCodCentroDiCosto.length) ? 
																			    frm.vArrCodCentroDiCosto : 
																			    frm.vCodCentroDiCosto.toString();
	
	 // rimozione di tabpanels precedenti
    forms[frmContName].elements.tab_copertura.removeAllTabs();
    forms[frmContName].elements.tab_copertura.transparent = false;
    forms[frmContName].elements.tab_riepilogo.removeAllTabs();
    
    // dataset copertura turni
	var size = foundset.search();
	foundset.sort('lavoratori_to_persone.nominativo asc');
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT];
	var columns = ['IdLavoratore','Codice','Nominativo'];
	var dsCop = databaseManager.createEmptyDataSet(size,columns);
	
	// dataset riepilogo
	// verifichiamo se è stato selezionato uno specifico gruppo di fasce 
	/** @type{Array<Number>}*/
	var arrFasceRaggruppamento = [];
	// tutte le fasce di raggruppamento (eventualmente solo quelle del raggruppamento indicato)
	if(frm.vIdGruppoFasce)
		arrFasceRaggruppamento = globals.getFasceOrarieDaRaggruppamento(frm.vIdGruppoFasce);
	var arrCodiciTurno = [];
	arrCodiciTurno = globals.getCodiciTurno(arrFasceRaggruppamento);
	
	var typesRiep = [JSColumn.TEXT];
	var columnsRiep = ['Intestazione'];
	var rows = arrCodiciTurno.length ? arrCodiciTurno.length + 1 : 1; 
	
	var dsRiep = databaseManager.createEmptyDataSet(rows,columnsRiep);
	dsRiep.setValue(1,1,'DIPENDENTI PRESENTI');
		
	for(var ar = 0; ar < arrCodiciTurno.length; ar++)
		// aggiungere righe di riepilogo
		dsRiep.setValue(ar + 2, 1, arrCodiciTurno[ar]); 		
		
	for(var G = 1; G <= numGiorni; G++)
	{
		// per eventuale gestione della visualizzazione del codice evento
		types.push(JSColumn.TEXT);
		dsCop.addColumn('giorno_'+ G,G + 3,JSVariable.TEXT);
		
		typesRiep.push(JSColumn.NUMBER);
		dsRiep.addColumn('perc_cop_'+ G,G + 1,JSVariable.NUMBER);
	}
	
	// ciclo su tutti i lavoratori
	for(var l = 1; l <= size; l++)
	{
		// recupero del record originale dei lavoratori
	    var rec = foundset.getRecord(l); 
	    // inizializzazione valori
	    dsCop.setValue(l,1,rec.idlavoratore);
	    dsCop.setValue(l,2,rec.codice);
	    dsCop.setValue(l,3,rec.lavoratori_to_ditte.ditte_to_ditte_legami.getSelectedRecord() == null ? rec.lavoratori_to_persone.nominativo : rec.lavoratori_to_lavoratori_personeesterne.nominativo);
		
	    // recupero del record della giornaliera
	    /** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>}*/
	    var recGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	    
	    var _tipoAssenza; 
	    var _tipoGiornaliera;
	    
	    // ciclo su tutti i giorni
	    for (var g = 1; g <= numGiorni; g++) 
	    {
			var _giorno = new Date(frm.vDal.getFullYear(),frm.vDal.getMonth(),frm.vDal.getDate() + g - 1);
			if(_giorno >= rec.assunzione && (rec.cessazione == null || _giorno <= rec.cessazione))
			{
				var _isConteggiato = globals.isGiornoConteggiato(rec.idlavoratore,_giorno); 
				// verifica della tipologia evento da considerare : se il giorno è conteggiato e senza anomalie considero gli eventi della 
				// giornaliera normale altrimenti verifica quelli della budget 
				_isConteggiato ? _tipoGiornaliera = globals.TipoGiornaliera.NORMALE : _tipoGiornaliera = globals.TipoGiornaliera.BUDGET;
				
				// informazioni sulla fascia associata al giorno
				var objFascia = globals.ottieniInformazioniFasciaGiorno(rec.idlavoratore,_giorno);
								
				if(recGiorn.find())
				{
					recGiorn.iddip = rec.idlavoratore;
					recGiorn.giorno = globals.dateFormat(_giorno,globals.ISO_DATEFORMAT) + '|yyyyMMdd'; 
					recGiorn.tipodirecord = _tipoGiornaliera;
					
					// considera prima gli eventi in giornaliera normale, altrimenti quelli in budget
					if(recGiorn.search() > 0)
					{
						// recupero del record per gli eventi di giornaliera
						var currRecGiorn = recGiorn.e2giornaliera_to_e2giornalieraeventi;
						var resSize = currRecGiorn.getSize();
						var totOreEvSost = 0;
						var _oreTeoricheGiorno = recGiorn.e2giornaliera_to_e2fo_fasceorarie ? 
								                 recGiorn.e2giornaliera_to_e2fo_fasceorarie.totaleorefascia : null; // per tener conto di eventuali assunzioni/cessazioni nel periodo
						var currRecGiornEv = null;
						for(var r = 1; r <= resSize; r++)
						{
							currRecGiornEv = currRecGiorn.getRecord(r);
							
							// condizioni da soddisfare per visualizzare o meno gli eventi in copertura 
							if(currRecGiornEv 
									&& currRecGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo == 'S'
									&& currRecGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconperiodi == 0)
							{
								if(currRecGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconstorico)
									_tipoAssenza = globals.TipoAssenza.STORICO;
								// eventuali eventi da definire per giorni già conteggiati nel futuro non vengono considerati
							    if(currRecGiornEv.e2giornalieraeventi_to_e2eventi.evento == '?' 
							       && _giorno > globals.TODAY)
							    	break;
							    
							    totOreEvSost += currRecGiornEv.ore;
							}													
						}
						
						// compilazione valori tabella
						if(totOreEvSost > 0)
						{	
	                       // impostazione tipo assenza in base al tipo di giornaliera ed al numero di ore dell'evento
	                       if(_tipoGiornaliera != globals.TipoGiornaliera.BUDGET)
	                       {
	                          if(totOreEvSost == _oreTeoricheGiorno)
							     _tipoAssenza = globals.TipoAssenza.TOTALE;
						      else
							     _tipoAssenza = globals.TipoAssenza.PARZIALE;
	                       }   
	                       else
	                    	   _tipoAssenza = globals.TipoAssenza.BUDGET;
	                    	   
	                       dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' + _tipoAssenza : null);
												    
						}
						else
							// verifica della presenza o meno nel/i turno/i richiesto/i
							if(frm.vChkGruppoFasce)
							{
								if(arrFasceRaggruppamento.indexOf(objFascia['idfascia']) == -1)
								{
									_tipoAssenza = globals.TipoAssenza.NON_IN_TURNO
									dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' + _tipoAssenza : null);
								}
								else
									dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' : null);
							}
							else
								dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' : null);
									
					}
					else
						// verifica della presenza o meno nel/i turno/i richiesto/i
						if(frm.vChkGruppoFasce)
						{
							if(arrFasceRaggruppamento.indexOf(objFascia['idfascia']) == -1)
							{
								_tipoAssenza = globals.TipoAssenza.NON_IN_TURNO
								dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' + _tipoAssenza : null);
							}
							else
								dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' : null);
						}
						else
							dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' : null);
									
				}
				
				// altrimenti, se il giorno non è ancora stato conteggiato, verifica possibili coperture date da richieste non ancora confermate
				if(!_isConteggiato && dsCop.getValue(l,g + 3) == null)
				{
					_tipoAssenza = globals.TipoAssenza.RICHIESTA;
					// recupera giorni ed eventi di richieste non ancora confermate
					var recRigaGiorno = globals.ottieniRichiesteSospeseGiorno(rec.idlavoratore,_giorno);	
					if(recRigaGiorno)
						   dsCop.setValue(l,g + 3,objFascia.codalternativo ? objFascia.codalternativo + '_' + g + '_' + _tipoAssenza : null);
				}
			}
			else
				dsCop.setValue(l,3 + g,null);
		}
				
	}
	
	// riga riepilogo numero dipendenti copertura
	for (g = 1; g <= numGiorni; g++) 
	{
		_giorno = new Date(_dal.getFullYear(),_dal.getMonth(),_dal.getDate() + (g - 1));
		var numDipPresenti = null;
		
		for(l = 1; l <= size; l++)
		{
			if(frm.vIdGruppoFasce 
					&& arrFasceRaggruppamento.length
					&& utils.stringRight(dsCop.getValue(l,g + 3),1) == globals.TipoAssenza.NON_IN_TURNO)
				continue;
			if(dsCop.getValue(l,g + 3) == null)
				continue;
			if(globals.isGiornoConteggiato(dsCop.getValue(l,1),_giorno) ?
						globals.getTotaleOreSostitutive(dsCop.getValue(l,1),_giorno,_giorno) == 0 : 
						globals.getTotaleOreSostitutiveInBudget(dsCop.getValue(l,1),_giorno,_giorno) + globals.getTotaleOreSostitutiveRichieste(dsCop.getValue(l,1),_giorno,_giorno) == 0)
			{
				numDipPresenti++;
				var str = dsCop.getValue(l,g + 3);
				var firstIndex = utils.stringPosition(str,'_',0,1);
				var prefix = utils.stringLeft(str,firstIndex - 1);
				for(var t = 2; t <= dsRiep.getMaxRowIndex(); t++)
					if(prefix == dsRiep.getValue(t,1))
						dsRiep.setValue(t, g + 1, dsRiep.getValue(t, g + 1) + 1);
			}
		}
		
		dsRiep.setValue(1,g + 1,numDipPresenti);
		
	}
	
	// nel caso di nessun dipendente presente nella selezione mostriamo un messaggio
	if(dsCop.getMaxRowIndex() == 0)
		globals.ma_utl_showInfoDialog('Nessun dipendente per la selezione indicata','Visualizzazione copertura');
	else
	{
		var numDip = dsCop.getMaxRowIndex();
		var dSCopName = ['_vtDataSource_'
				         ,globals.dateFormat(_dal,globals.ISO_DATEFORMAT)
						 ,globals.dateFormat(_al,globals.ISO_DATEFORMAT)
						 ,frm.vIdDitta
						 ,frm.vGroupId
						 ,frm.vIdSede
						 ,frm.vCodCentroDiCosto
						 ].join('_');
		frmName = ['giorn_visualizza_copertura_turni_tbl'
				 ,globals.dateFormat(_dal,globals.ISO_DATEFORMAT)
				 ,globals.dateFormat(_al,globals.ISO_DATEFORMAT)
				 ,frm.vGroupId
				 ,frm.vIdDitta
				 ,frm.vIdSede
				 ,frm.vCodCentroDiCosto
				 ].join('_');
		
		var dSCop = dsCop.createDataSource(dSCopName, types);
		var dSRiep = dsRiep.createDataSource('_vcDataSourceRiep_' + '_' + numGiorni + '_' + numDip,typesRiep);
		
		globals.disegnaVisualizzazioneCoperturaTurni(dSCop,
				                                    frmName,
													frmContName,
													_dal,
													numDip,
													numGiorni,
													dSRiep);
	}	
	
	// riapplicazione filtri sui lavoratori e/o filtri gerarchici
	if(abilitataVCLivello)
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.LAVORATORI,
			'idlavoratore',
			globals.ComparisonOperator.IN,
			globals.ma_sec_setUserHierarchy(globals.svy_sec_lgn_user_org_id,
				                            globals.ma_sec_lgn_groupid),
			'ftr_dati_lavoratori_gerarchia'
		);
		
	
//	forms[frmContName].elements.tab_legenda.visible = showLegenda;
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"80401FA3-84EB-482A-A32D-A9B54249EF94"}
 */
function refreshCoperturaCalendario(event) {

	var frm = forms.giorn_visualizza_copertura_situazione;
	
	var _dal = frm.vDal;
	var _al = frm.vAl;
	var idDitta = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].idditta;
	var numGiorni = Math.floor((_al - _dal)/86400000) + 1;
	
	var abilitataVCTutti = globals.ma_utl_hasKey(globals.Key.AUT_VC_TUTTI);
	var abilitataVCLivello = globals.ma_utl_hasKey(globals.Key.AUT_VC_LIVELLO_GERARCHICO) 
	                         && _to_sec_organization.sec_organization_to_sec_organization_hierarchy_children == null;
	
	// rimozione filtri dipendenti e/o gerarchici
	if(abilitataVCTutti || abilitataVCLivello)
		databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_dati_lavoratori_gerarchia');
	
	// filtra i lavoratori
	if(foundset.find())
	{
		foundset.assunzione = '^||<=' + utils.dateFormat(_al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		foundset.cessazione = '^||>=' + utils.dateFormat(_dal,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
    }
	
    // filtra la/e ditta/e di riferimento
    // filtro su tutte le ditte standard del gruppo
    if(abilitataVCTutti)
    {
    	foundset.idditta = globals.getDitte();
    }
    // filtro sui lavoratori appartenenti allo stesso livello gerarchico nel caso di nodo foglia
    else if(abilitataVCLivello)
    	foundset.idlavoratore = globals.getLavoratoriLivelloGerarchico(globals.svy_sec_lgn_user_org_id);
    else
    // filtro standard sulla ditta selezionata precedentemente o impostata nel filtro
    {
    	if(idDitta && idDitta != -1)
        	foundset.idditta = idDitta;
    }
    
    // se indicato un gruppo considera solo i dipendenti del gruppo specificato
	if (frm.vGroupId != -1 || frm.vArrGroupId.length > 0) 
	{
//		if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) 
//		{
			// recupero dell'array con tutti i lavoratori appartenenti a i gruppi scelti
			if(frm.vArrGroupId.length)
			{
				var arrLavReparti = [];
				for(var _g = 0; _g < frm.vArrGroupId.length; _g++)
				{
					var arrLavReparto = globals.getLavoratoriReparto(frm.vArrGroupId[_g]);
					for(var _r = 0; _r <= arrLavReparto.length; _r++)
					{
						if(arrLavReparti.indexOf(arrLavReparto[_r]) == -1)
							arrLavReparti.push(arrLavReparto[_r]);
					}
				}
				foundset.idlavoratore = arrLavReparti;
			}
			else
				foundset.idlavoratore = globals.getLavoratoriReparto(frm.vGroupId);
//		}
//		else
//		{
//			/** @type {JSFoundset<db:/svy_framework/sec_user_right>}*/
//			var fsUserRight = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_right');
//			
//			if (fsUserRight.find())
//			{
//				fsUserRight.group_id = (frm.vArrGroupId && frm.vArrGroupId.length) ? frm.vArrGroupId : frm.vGroupId;
//				fsUserRight.sec_user_right_to_sec_security_key.is_client = 1;
//				if (fsUserRight.search()) 
//				{
//					/** @type {JSFoundset<db:/ma_framework/v_sec_filtrilavoratori>} */
//					var fsSecLavoratori = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, 'v_sec_filtrilavoratori');
//					if (fsSecLavoratori.find()) 
//					{
//						fsSecLavoratori.exclude = 0;
//						fsSecLavoratori.idchiave = globals.foundsetToArray(fsUserRight.sec_user_right_to_sec_security_key, 'security_key_id');
//						fsSecLavoratori.search();
//						foundset.idlavoratore = globals.foundsetToArray(fsSecLavoratori, 'idlavoratore');
//					} 
//					else
//					{
//						globals.ma_utl_showErrorDialog('Errore nel recupero dei dati dei lavoratori associati alla chiave', 'Visualizza copertura');
//						return;
//					}
//				}
//			}
//			else 
//			{
//				globals.ma_utl_showErrorDialog('Errore nel recupero dei dati delle chiavi utenti', 'Visualizza copertura');
//				return;
//			}
//		}
	}
	
	// filtro su sede di lavoro
	if(frm.vChkSedeDiLavoro)
	   foundset.iddittasede = (frm.vArrIdSede && frm.vArrIdSede.length) ? frm.vArrIdSede : frm.vIdSede;
	// filtro su centro di costo
	if(frm.vChkCentroDiCosto)
		foundset.lavoratori_to_lavoratori_classificazioni.codclassificazione = (frm.vArrCodCentroDiCosto && frm.vArrCodCentroDiCosto.length) ? 
				                                                                frm.vArrCodCentroDiCosto : 
	                                                                            frm.vCodCentroDiCosto.toString();
	
	var size = foundset.search();
	if(size == 0)
	{
		globals.ma_utl_showInfoDialog('Nessun dipendente per la selezione indicata','Visualizzazione copertura');
		return;
	}
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT];
	var columns = ['IdLavoratore','Codice','Nominativo'];
	var dsCop = databaseManager.createEmptyDataSet(size,columns);
	
	// TODO verifica : recupero dei dati di base per il disegno della griglia 
	var dsProgTurni = globals.ottieniDataSetProgTurniCalendario(foundset.idlavoratore,_dal,_al);
	var periodicita = dsProgTurni.getValue(1,7);
	var rigaIniziale = dsProgTurni.getValue(1,6);
	var numBlocchi = 1;
	
	var offset = 0;
	if(rigaIniziale != 1)
	   offset = periodicita - rigaIniziale;
	
	// creazione delle giornate
	for(var g = 1; g <= numGiorni; g++)
	{
		// per eventuale gestione della visualizzazione del codice evento
		types.push(JSColumn.TEXT);
		dsCop.addColumn('giorno_'+ g,g + 3,JSVariable.TEXT);
		// gestione del riepilogo per blocco
		if(rigaIniziale == periodicita)
		{
		   numBlocchi++;
		   rigaIniziale = 1;
		}
		rigaIniziale++;
	}
	
	// creazione dei riepiloghi di controllo
	for(var r = 1; r <= numBlocchi; r++)
	{
		// creazione del campo di controllo contatore ore lavorate
		types.push(JSColumn.NUMBER);
		dsCop.addColumn('lavorate_' + r,r + numGiorni + 3,JSVariable.NUMBER);
		
		// creazione del campo ore lavorabili
//		types.push(JSColumn.NUMBER);
//		dsCop.addColumn('lavorabili_' + R,,JSVariable.NUMBER);
	}
		
	// ciclo su tutti i lavoratori
	for(var l = 1; l <= size; l++)
	{
		// recupero del record originale dei lavoratori
	    var rec = foundset.getRecord(l); 
	    // inizializzazione valori
	    dsCop.setValue(l,1,rec.idlavoratore);
	    dsCop.setValue(l,2,rec.codice);
	    dsCop.setValue(l,3,rec.lavoratori_to_ditte.ditte_to_ditte_legami.getSelectedRecord() == null ? rec.lavoratori_to_persone.nominativo : rec.lavoratori_to_lavoratori_personeesterne.nominativo);
				
		dsProgTurni = globals.ottieniDataSetProgTurniCalendario(rec.idlavoratore,_dal,_al);
		var numGiorniEffettivi = dsProgTurni.getMaxRowIndex(); 
		for(g = 1; g <= numGiorni; g++)
		{
		   	//TODO mettere le eventuali timbrature - imposta codici turno
		   	dsCop.setValue(l,g + 3,dsProgTurni.getValue(g,9));
		}
		for(r = 1; r <= numBlocchi; r++)
		{
			//TODO calcolo lavorate - NB mettiamo 0 per iniziare, andranno calcolate
			dsCop.setValue(l,r + numGiorni + 3,0)
		}
				
	}
		
	var numDip = dsCop.getMaxRowIndex();
	var dSCop = dsCop.createDataSource('_cDataSource_' + idDitta + '_' + numGiorni + '_' + numDip, types);
				
	setVCParams(idDitta,dSCop,numGiorni,numDip,_dal,_al);
	
	globals.disegnaVisualizzazioneCoperturaCalendario(dSCop,
			                                    idDitta,
												numGiorniEffettivi,
												numDip,
												_dal,
												numBlocchi,
												offset);
		
	
	// riapplicazione filtri sui lavoratori e/o filtri gerarchici
	if(abilitataVCLivello)
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.LAVORATORI,
			'idlavoratore',
			globals.ComparisonOperator.IN,
			globals.ma_sec_setUserHierarchy(globals.svy_sec_lgn_user_org_id,
				                            globals.ma_sec_lgn_groupid),
			'ftr_dati_lavoratori_gerarchia'
		);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2CBAA242-632B-4E52-A1E5-FB451647B721"}
 * @AllowToRunInFind
 */
function refreshCoperturaGiornaliera(event)
{
	// identificazione da quale form opzioni è stato generato l'evento
	var frmName = forms.giorn_visualizza_copertura_situazione.controller.getName();
	// associazione del nome della form contenitore
//	var frmContName = frmName == 'rp_visualizza_copertura_situazione' ? 'rp_visualizza_copertura' : controller.getName();
	
	/** @type{RuntimeForm<giorn_visualizza_copertura_situazione>}*/
	var frm = forms[frmName];
	var _dal = frm.vDal;
	var _al = frm.vAl;
	
	var abilitataGestore = globals.ma_utl_hasKey(globals.Key.AUT_GESTORE);
	var abilitataVCTutti = globals.ma_utl_hasKey(globals.Key.AUT_VC_TUTTI);
	var abilitataVCLivello = globals.ma_utl_hasKey(globals.Key.AUT_VC_LIVELLO_GERARCHICO) 
	                         && _to_sec_organization.sec_organization_to_sec_organization_hierarchy_children == null;
	
	// rimozione eventuali filtri su singola ditta
	databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_idditta');
	
	// rimozione filtri dipendenti e/o gerarchici
	if(abilitataVCTutti 
		|| abilitataVCLivello
		|| abilitataGestore)
		databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_dati_lavoratori_gerarchia');
	
	// filtra i lavoratori
	if(foundset.find())
	{
		foundset.assunzione = '^||<=' + utils.dateFormat(_al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		foundset.cessazione = '^||>=' + utils.dateFormat(_dal,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
   }
	
   // filtro su tutte le ditte del gruppo
   if(abilitataVCTutti || abilitataGestore)
      	foundset.idditta = globals.getDitte();
   // filtro sui lavoratori appartenenti allo stesso livello gerarchico nel caso di nodo foglia
   else if(abilitataVCLivello)
   	foundset.idlavoratore = globals.getLavoratoriLivelloGerarchico(globals.svy_sec_lgn_user_org_id);
   
   if(frm.vIdDitta && frm.vIdDitta != -1)
   	foundset.idditta = frm.vIdDitta;
   
    // se indicato un gruppo considera solo i dipendenti del gruppo specificato
	if (frm.vGroupId != -1 || frm.vArrGroupId.length > 0) 
	{
//		if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) 
//		{
			// recupero dell'array con tutti i lavoratori appartenenti a i gruppi scelti
			if(frm.vArrGroupId.length)
			{
				var arrLavReparti = [];
				for(var _g = 0; _g < frm.vArrGroupId.length; _g++)
				{
					var arrLavReparto = globals.getLavoratoriReparto(frm.vArrGroupId[_g]);
					for(var _r = 0; _r <= arrLavReparto.length; _r++)
					{
						if(arrLavReparti.indexOf(arrLavReparto[_r]) == -1)
							arrLavReparti.push(arrLavReparto[_r]);
					}
				}
				foundset.idlavoratore = arrLavReparti;
			}
			else
				foundset.idlavoratore = globals.getLavoratoriReparto(frm.vGroupId);
//		}
//		else
//		{
//			/** @type {JSFoundset<db:/svy_framework/sec_user_right>}*/
//			var fsUserRight = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_right');
//			
//			if (fsUserRight.find())
//			{
//				fsUserRight.group_id = (frm.vArrGroupId && frm.vArrGroupId.length) ? frm.vArrGroupId : frm.vGroupId;
//				fsUserRight.sec_user_right_to_sec_security_key.is_client = 1;
//				if (fsUserRight.search()) 
//				{
//					/** @type {JSFoundset<db:/ma_framework/v_sec_filtrilavoratori>} */
//					var fsSecLavoratori = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, 'v_sec_filtrilavoratori');
//					if (fsSecLavoratori.find()) 
//					{
//						fsSecLavoratori.exclude = 0;
//						fsSecLavoratori.idchiave = globals.foundsetToArray(fsUserRight.sec_user_right_to_sec_security_key, 'security_key_id');
//						fsSecLavoratori.search();
//						foundset.idlavoratore = globals.foundsetToArray(fsSecLavoratori, 'idlavoratore');
//					} 
//					else
//					{
//						globals.ma_utl_showErrorDialog('Errore nel recupero dei dati dei lavoratori associati alla chiave', 'Visualizza copertura');
//						return;
//					}
//				}
//			}
//			else 
//			{
//				globals.ma_utl_showErrorDialog('Errore nel recupero dei dati delle chiavi utenti', 'Visualizza copertura');
//				return;
//			}
//		}
	}
	
	// filtro su sede di lavoro
	if(frm.vChkSedeDiLavoro)
	   foundset.iddittasede = (frm.vArrIdSede && frm.vArrIdSede.length) ? frm.vArrIdSede : frm.vIdSede;
	// filtro su centro di costo
	if(frm.vChkCentroDiCosto)
		foundset.lavoratori_to_lavoratori_classificazioni.codclassificazione = (frm.vArrCodCentroDiCosto && frm.vArrCodCentroDiCosto.length) ? 
				                                                                frm.vArrCodCentroDiCosto : 
	                                                                            frm.vCodCentroDiCosto.toString();
	
	var size = foundset.search();
	if(size == 0)
	{
		globals.ma_utl_showInfoDialog('Nessun dipendente per la selezione indicata','Visualizzazione copertura');
		return;
	}
	////////////////////////////////// termine fase di filtro su dipendenti
	
	// settaggio nome form contenitore
	var oriForm = forms.giorn_visualizza_copertura_ditta_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	   
    // recuperiamo gli id dei dipendenti aventi squadrature ed/o eventi da definire in giornaliera
	var arrDipGiornaliera = globals.foundsetToArray(foundset,'idlavoratore');

    var x=0;
    var y=0;
    var tabWidth = 640;
    var tabHeight = 135;
    var totHeight = 0;
    
    // rimozione di tabpanels precedenti
    elements.tab_copertura.removeAllTabs();
    elements.tab_copertura.transparent = false;
    
    // rimozione eventuali form anomalie ditta con lo stesso nome esistenti
    if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }

    // se non vi sono dipendenti con squadrature nel periodo selezionato
	if(arrDipGiornaliera.length == 0)
	{
    	elements.tab_copertura.transparent = true;
    	return;
	}
	    
    // nel caso di un numero di lavoratori inferiore od uguale al numero di dipendenti
    // visualizzabili in una singola pagina
	if(arrDipGiornaliera.length <= dipPerPage)
	{
		elements.btn_last.visible = 
    	elements.btn_next.visible = 
    	elements.btn_first.visible = 
    	elements.btn_prev.visible = 
    	elements.fld_curr_page.visible = 
    	elements.lbl_pagina_di.visible = 
    	elements.lbl_totale_pagine.visible = false;
    	
		// se addirittura non vi sono lavoratori con anomalie
		if(arrDipGiornaliera.length == 0)
		{
			elements.tab_copertura.transparent = true;
	    	return;
		}
	}
	else
		elements.btn_last.visible = 
		elements.btn_next.visible = 
		elements.btn_first.visible = 
		elements.btn_prev.visible = 
		elements.fld_curr_page.visible = 
		elements.lbl_pagina_di.visible = 
		elements.lbl_totale_pagine.visible = true;
   
	// numero di pagine necessarie    
	pages = Math.ceil(arrDipGiornaliera.length / dipPerPage);
	    
	// per gestire eventuali refresh in cui il nuovo numero di pagine è minore di quello della precedente visualizzazione  
	if(pages < currPage)
	   currPage = pages >= 1 ? pages : 1;
	    
	// l'ultima pagina potrebbe avere meno dei dipendenti per pagina classici
	currPage == pages ? arrDipGiornaliera.length - (currPage - 1) * dipPerPage : dipPerPage; 
	
	// creazione della nuova form dinamica contenitrice 
	var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
	            
	var currIndex = (currPage - 1) * dipPerPage;
	var maxIndex = Math.min(currPage * dipPerPage,arrDipGiornaliera.length);   
	    
    for(var i = currIndex; i < maxIndex; i++)
    {
    	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>} */
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
    	if(fs.find())
    	{
    		fs.idlavoratore = arrDipGiornaliera[i];
    		fs.search();
    	}
    	
    	// array per il riepilogo coppie (evento,proprieta)
        var arrRigheEvProp = [];
        
        var datasetRigheGiorn = globals.ottieniDataSetRighe(arrDipGiornaliera[i],
        	                                                utils.dateFormat(_dal,globals.ISO_DATEFORMAT),
    														utils.dateFormat(_al,globals.ISO_DATEFORMAT));

       // Calcola il numero di colonne per ogni tipo di evento (caso peggiore)
       for(var r = 1; r <= datasetRigheGiorn.getMaxRowIndex(); r++)
       {
            var arrRigaEvProp = [datasetRigheGiorn.getValue(r,1),
                                 datasetRigheGiorn.getValue(r,2)];
            if(datasetRigheGiorn.getValue(r,1) != null)
               arrRigheEvProp.push(arrRigaEvProp);
       }
       
       // Numero di colonne totali necessarie alla visualizzazione in giornaliera degli eventi del mese
       var righeTot = arrRigheEvProp.length;
       
    	tabHeight = 70 + righeTot * 20;
    	totHeight += tabHeight;
    	    	
        // rimozione forms giornaliera lavoratori
        var dipFormOri = forms.giorn_visualizza_copertura_dipendente;
    	var dipFormOriName = dipFormOri.controller.getName();
    	var dipFormName = dipFormOriName + '_' + arrDipGiornaliera[i];
    	
    	if(solutionModel.getForm(dipFormName))
        {
        	forms[dipFormName].elements.tab_visualizza_copertura_dip.removeAllTabs();
        	history.removeForm(dipFormName);
        	solutionModel.removeForm(dipFormName);
        }
    	
        // rimozione forms visualizza presenze lavoratore
        var giornFormPannOri = forms.giorn_visualizza_copertura_giorn_pannello;
    	var giornFormPannOriName = giornFormPannOri.controller.getName();
    	var giornFormPannName = giornFormPannOriName + '_' + arrDipGiornaliera[i];
    	
    	if(solutionModel.getForm(giornFormPannName))
        {
        	history.removeForm(giornFormPannName);
        	solutionModel.removeForm(giornFormPannName);
        }
        
        var tabPanelGiornDip = newForm.newTabPanel('tab_giornaliera_ditta_tabpanel_' + arrDipGiornaliera[i]
                                                   ,x
		                                           ,y
		                                           ,tabWidth
		                                           ,tabHeight);
        tabPanelGiornDip.visible = true;
        tabPanelGiornDip.transparent = true;
        tabPanelGiornDip.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelGiornDip.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST;

    	var dipForm = solutionModel.cloneForm(dipFormName
    	                                      ,solutionModel.getForm(dipFormOriName));
    	
    	var presForm = solutionModel.cloneForm(giornFormPannName
    										   ,solutionModel.getForm(giornFormPannOriName));
    	
    	var tabGiornDipHeader = fs.codice + ' - ' + (fs.codicefiscale ?  
    			                                     (fs.lavoratori_to_persone ? fs.lavoratori_to_persone.nominativo : fs.lavoratori_to_lavoratori_personeesterne.nominativo)
													 : '');
    	tabPanelGiornDip.newTab('tab_ore_presenze_dip_' + arrDipGiornaliera[i],tabGiornDipHeader,dipForm);
    	
    	var tabListPres = tabPanelGiornDip.newTab('tab_pres_' + arrDipGiornaliera[i],'Giornaliera',presForm);    	
    	tabListPres.toolTipText = 'Visualizza la giornaliera mensile del dipendente';
    	
 	   	y += tabHeight;									  
    	 	   	
// 	    if(dsGiornaliera.getMaxRowIndex() == 0)
// 	    	continue;
 	    	
 	   /** @type {Number}*/
	   	var idLavoratore = arrDipGiornaliera[i];
	   	var currFrmName = 'giorn_visualizza_copertura_dipendente_' + arrDipGiornaliera[i];
	   	/** @type {RuntimeForm<giorn_visualizza_copertura_dipendente>} */
	   	var currFrm = forms[currFrmName];
	 	    currFrm.preparaGiornalieraLavoratore(idLavoratore,_dal,_al,arrRigheEvProp);
	 	    
    }
    
    solutionModel.getForm(newFormName).getBodyPart().height = totHeight;
    
    elements.tab_copertura.addTab(newFormName,newFormName);
           
}

/**
 * @AllowToRunInFind
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"C90D0E97-9AE1-44D9-82C7-1F87A027CEBF"}
 */
function refreshCoperturaCommesse(event)
{
   var frm = forms.giorn_visualizza_copertura_situazione;
	
	var _dal = frm.vDal;
	var _al = frm.vAl;
	var idDitta = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].idditta;
		
	var abilitataVCTutti = globals.ma_utl_hasKey(globals.Key.AUT_VC_TUTTI);
	var abilitataVCLivello = globals.ma_utl_hasKey(globals.Key.AUT_VC_LIVELLO_GERARCHICO) 
	                         && _to_sec_organization.sec_organization_to_sec_organization_hierarchy_children == null;
	
	// rimozione filtri dipendenti e/o gerarchici
	if(abilitataVCTutti || abilitataVCLivello)
		databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,'ftr_dati_lavoratori_gerarchia');
	
	// filtra i lavoratori
	if(foundset.find())
	{
		foundset.assunzione = '^||<=' + utils.dateFormat(_al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		foundset.cessazione = '^||>=' + utils.dateFormat(_dal,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
    }
	
    // filtra la/e ditta/e di riferimento od il filtro su tutte le ditte standard del gruppo
    if(abilitataVCTutti)
    {
    	foundset.idditta = globals.getDitte();
    }
    // filtro sui lavoratori appartenenti allo stesso livello gerarchico nel caso di nodo foglia
    else if(abilitataVCLivello)
    	foundset.idlavoratore = globals.getLavoratoriLivelloGerarchico(globals.svy_sec_lgn_user_org_id);
    else
    // filtro standard sulla ditta selezionata precedentemente o impostata nel filtro
    {
    	if(idDitta && idDitta != -1)
        	foundset.idditta = idDitta;
    }
    
    // se indicato uno o più gruppi considera solo i dipendenti del/i gruppo/i specificato/i
	if (frm.vGroupId != -1 || frm.vArrGroupId.length > 0) 
	{
		if (globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA)) 
		{
			// recupero dell'array con tutti i lavoratori appartenenti a i gruppi scelti
			if(frm.vArrGroupId.length)
			{
				var arrLavReparti = [];
				for(var g = 0; g < frm.vArrGroupId.length; g++)
				{
					var arrLavReparto = globals.getLavoratoriReparto(frm.vArrGroupId[g]);
					for(var r = 0; r <= arrLavReparto.length; r++)
					{
						if(arrLavReparti.indexOf(arrLavReparto[r]) == -1)
							arrLavReparti.push(arrLavReparto[r]);
					}
				}
				foundset.idlavoratore = arrLavReparti;
			}
			else
				foundset.idlavoratore = globals.getLavoratoriReparto(frm.vGroupId);
		}
		else
		{
			/** @type {JSFoundset<db:/svy_framework/sec_user_right>}*/
			var fsUserRight = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_right');
			
			if (fsUserRight.find())
			{
				fsUserRight.group_id = (frm.vArrGroupId && frm.vArrGroupId.length) ? frm.vArrGroupId : frm.vGroupId;
				fsUserRight.sec_user_right_to_sec_security_key.is_client = 1;
				if (fsUserRight.search()) 
				{
					/** @type {JSFoundset<db:/ma_framework/v_sec_filtrilavoratori>} */
					var fsSecLavoratori = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK, 'v_sec_filtrilavoratori');
					if (fsSecLavoratori.find()) 
					{
						fsSecLavoratori.exclude = 0;
						fsSecLavoratori.idchiave = globals.foundsetToArray(fsUserRight.sec_user_right_to_sec_security_key, 'security_key_id');
						fsSecLavoratori.search();
						foundset.idlavoratore = globals.foundsetToArray(fsSecLavoratori, 'idlavoratore');
					} 
					else
					{
						globals.ma_utl_showErrorDialog('Errore nel recupero dei dati dei lavoratori associati alla chiave', 'Visualizza copertura');
						return;
					}
				}
			}
			else 
			{
				globals.ma_utl_showErrorDialog('Errore nel recupero dei dati delle chiavi utenti', 'Visualizza copertura');
				return;
			}
		}
	}
	
	// filtro su sede di lavoro
	if(frm.vChkSedeDiLavoro)
	   foundset.iddittasede = (frm.vArrIdSede && frm.vArrIdSede.length) ? frm.vArrIdSede : frm.vIdSede;
	// filtro su centro di costo
	if(frm.vChkCentroDiCosto)
		foundset.lavoratori_to_lavoratori_classificazioni.codclassificazione = (frm.vArrCodCentroDiCosto && frm.vArrCodCentroDiCosto.length) ? 
				                                                                frm.vArrCodCentroDiCosto : 
	                                                                            frm.vCodCentroDiCosto.toString();
	var size = foundset.search();
	if(size == 0)
	{
		globals.ma_utl_showInfoDialog('Nessun dipendente per la selezione indicata','Visualizzazione copertura');
		return;
	}
	////////////////////////////////// termine fase di filtro su dipendenti
	
	// settaggio nome form contenitore
	var oriForm = forms.giorn_visualizza_copertura_ditta_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	   
    // recuperiamo gli id dei dipendenti aventi squadrature ed/o eventi da definire in giornaliera
	/** @type {Array<Number>}*/
	var arrDipCommesse = globals.foundsetToArray(foundset,'idlavoratore');

    // l'ultima pagina potrebbe avere meno dei dipendenti per pagina classici
    var currDipPerPage = arrDipCommesse.length; 
    var x=0;
    var y=0;
    var tabWidth = 640;
    var tabHeight = 135;
    var totHeight = 0;
    
    // rimozione di tabpanels precedenti
    elements.tab_copertura.removeAllTabs();
    elements.tab_copertura.transparent = false;
    
    // rimozione eventuali form anomalie ditta con lo stesso nome esistenti
    if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }

    // se non vi sono dipendenti con squadrature nel periodo selezionato
	if(arrDipCommesse.length == 0)
	{
    	elements.tab_copertura.transparent = true;
    	return;
	}
	
    // creazione della nuova form dinamica contenitrice 
    var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
            
    var currIndex = 0//(currPage - 1) * dipPerPage;
    var maxIndex = arrDipCommesse.length;
    
    if(currDipPerPage > 30)
    {
    	maxIndex = 30;
    	var msg = 'Per consentire una corretta visualizzazione della situazione vengono visualizzati al massimo 30 dipendenti alla volta \
    	           (la selezione corrente conterrebbe ' + currDipPerPage + ' dipendenti).<br/>\
    	           Per una migliore gestione si consiglia di effettuare un filtro più stringente.';
    	globals.ma_utl_showWarningDialog(globals.getHtmlString(msg),'Visualizzazione eventi');
    }
	
    for(var i = currIndex; i < maxIndex; i++){
    	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>} */
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
    	if(fs.find())
    	{
    		fs.idlavoratore = arrDipCommesse[i];
    		fs.search();
    	}
    	    	
    	// Rilevazione del numero di commesse a cui il dipednente ha lavorato nel periodo richiesto 
    	var datasetRigheCommesse = globals.getFasiCommesseLavoratore(arrDipCommesse[i],
    																 _dal,
    																 _al);
        var righeTot = datasetRigheCommesse.getMaxRowIndex();
        
    	tabHeight = 100 + righeTot * 20;
    	totHeight += tabHeight;
    	    	
        // rimozione forms commesse lavoratori
        var dipFormOri = forms.comm_visualizza_copertura_dipendente;
    	var dipFormOriName = dipFormOri.controller.getName();
    	var dipFormName = dipFormOriName + '_' + arrDipCommesse[i];
    	
    	if(solutionModel.getForm(dipFormName))
        {
        	forms[dipFormName].elements.tab_visualizza_copertura_dip.removeAllTabs();
        	history.removeForm(dipFormName);
        	solutionModel.removeForm(dipFormName);
        }
    	
        var tabPanelGiornDip = newForm.newTabPanel('tab_giornaliera_ditta_tabpanel_' + arrDipCommesse[i]
                                                   ,x
		                                           ,y
		                                           ,tabWidth
		                                           ,tabHeight);
        tabPanelGiornDip.visible = true;
        tabPanelGiornDip.transparent = true;
        tabPanelGiornDip.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelGiornDip.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST;

    	var dipForm = solutionModel.cloneForm(dipFormName
    	                                      ,solutionModel.getForm(dipFormOriName));
    	
    	var tabGiornDipHeader = fs.codice + ' - ' + (fs.codicefiscale ?  
    			                                     (fs.lavoratori_to_persone ? fs.lavoratori_to_persone.nominativo : fs.lavoratori_to_lavoratori_personeesterne.nominativo)
													 : '');
    	tabPanelGiornDip.newTab('tab_squadrati_dip_' + arrDipCommesse[i],tabGiornDipHeader,dipForm);
    	
 	   	y += tabHeight;									  
    	 	   	
// 	    if(dsGiornaliera.getMaxRowIndex() == 0)
// 	    	continue;
 	    	
 	   /** @type {Number}*/
	   	var idLavoratore = arrDipCommesse[i];
	   	var currFrmName = 'comm_visualizza_copertura_dipendente_' + idlavoratore;
	   	/** @type {RuntimeForm<comm_visualizza_copertura_dipendente>} */
	   	var currFrm = forms[currFrmName];
	 	    currFrm.preparaCommesseLavoratore(idLavoratore,_dal,_al,datasetRigheCommesse.getColumnAsArray(1));
	 	    
    }
    
    solutionModel.getForm(newFormName).getBodyPart().height = totHeight;
    
    elements.tab_copertura.addTab(newFormName,newFormName);
    
}

/**
 * Salva i parametri per la visualizzazione copertura richiesta
 * 
 * @param {Number} id
 * @param {String} ds
 * @param {Number} numgiorni
 * @param {Number} numdip
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"8E1AD159-0C3F-46E4-BB52-D976F6B75978"}
 */
function setVCParams(id,ds,numgiorni,numdip,dal,al)
{
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].idditta = id;
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].ds = ds;
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].numgiorni = numgiorni;
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].numdip = numdip;
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].dal = dal;
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].al = al;
}

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"C19EA71B-EB1A-442D-BC79-FAD0826EA75D"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	plugins.busy.prepare();
}

/** 
 * @param event
 *
 * @properties={typeid:24,uuid:"E337438C-13A7-4157-817D-D957078BBCC3"}
 */
function onHide(event) 
{
	var frm = forms.giorn_visualizza_copertura_situazione;
	frm.goToBrowseVisualizzaSituazione(event);
	_super.onHide(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"8313B597-1565-468C-9EDA-AD10476AA9A5"}
 */
function onActionPrev(event) 
{
	--currPage;
	
	var params = {
        processFunction: process_refresh_giornaliera,
        message: '', 
        opacity: 0.2,
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"625F2B27-0218-4998-9A1D-AB695FD3DE6A"}
 */
function onActionNext(event)
{
	currPage++;
	
	var params = {
        processFunction: process_refresh_giornaliera,
        message: '', 
        opacity: 0.2,
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"10DCA1B6-9282-4A0C-9639-3AD71A53E10E"}
 */
function onActionFirst(event)
{
	currPage = 1;
	
	var params = {
        processFunction: process_refresh_giornaliera,
        message: '', 
        opacity: 0.2,
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A482CAB5-B95A-48D9-9D65-CAD284E28576"}
 */
function onActionLast(event) 
{
	currPage = pages; 
	
	var params = {
        processFunction: process_refresh_giornaliera,
        message: '', 
        opacity: 0.2,
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
 * Aggiorna e ridisegna la visualizzazione della copertura 
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"239ADED7-02DB-4BE2-8139-69A526ACA2D9"}
 */
function process_refresh_giornaliera(event)
{
	try
	{
		refreshCoperturaGiornaliera(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh_giornaliera : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
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
 * @properties={typeid:24,uuid:"05FE2AB2-D32C-49FC-8008-33945CBE5231"}
 */
function onDataChangePage(oldValue, newValue, event) {
	
	if(newValue > 0 && newValue <= pages)
	{
		refreshCoperturaGiornaliera(event);
		return true;
	}
	
	return false;
}
