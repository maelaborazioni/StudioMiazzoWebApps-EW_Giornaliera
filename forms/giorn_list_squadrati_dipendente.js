/** @type {JSDataSet}
 *
 * @properties={typeid:35,uuid:"48F85567-5532-499E-906A-F6ACCC1C6C0E",variableType:-4}
 */
var dsSquadrature = null;

/**
 * Prepara il recupero e la visualizzazione delle squadrature del lavoratore
 * per il periodo selezionato
 * 
 * @param {Number} idLavoratore
 * @param {Number} anno
 * @param {Number} mese
 * @param {String} formContenitore
 * 
 * @properties={typeid:24,uuid:"618FED48-71A1-422E-8875-BD855A8A0870"}
 * @SuppressWarnings(unused)
 */
function preparaSquadratureLavoratore(idLavoratore,anno,mese,formContenitore)
{
	var dal = new Date(anno,mese-1,1);
	var al = (forms.giorn_list_squadrati_ditta.chkLimitaAl == 1 && forms.giorn_list_squadrati_ditta.limitaAl != null) ? 
	          forms.giorn_list_squadrati_ditta.limitaAl : new Date(anno,mese-1,globals.getTotGiorniMese(mese,anno));

	// Numero di giorni con squadrature
	var numGiorniTotali = dsSquadrature.getMaxRowIndex();
	
	// Ottieni il dataset delle colonne necessarie
	var dsEventi = globals.ottieniDataSetColonne(idLavoratore,
		                                         utils.dateFormat(dal,globals.ISO_DATEFORMAT),
												 utils.dateFormat(al,globals.ISO_DATEFORMAT),
												 globals.TipoGiornaliera.NORMALE);
	
	var numEventi = dsEventi.getMaxRowIndex();
	
	// Recuperiamo lo schema degli eventi per costruire a priori la giornaliera 
    var colOrd = 0		// O (ordinari)
    var colSos = 0		// S (sostitutivi)
    var colAgg = 0		// A (aggiuntivi)
    var colSta = 0		// T (statistici)
    // TipoColonne serve nel caso di più eventi di tipo ordinario, per conoscere a priori le proprietà
    var tipoColonne = 3;
    
    for(var e = 1; e <= numEventi; e++)
    {
        switch (dsEventi.getValue(e,1))
		{
           case 'O' :
               colOrd = dsEventi.getValue(e,2);
               tipoColonne = dsEventi.getValue(e,3);
               break;

           case 'S':
        	   colSos = dsEventi.getValue(e,2);
               break;

           case 'A' :
               colAgg = dsEventi.getValue(e,2);
               break;

           case 'T' :
               colSta = dsEventi.getValue(e,2);
               break;
		}
   }
   // Numero di colonne totali necessarie alla visualizzazione in giornaliera degli eventi del mese
   var colTot = colOrd + colSos + colAgg + colSta;
   
   //   aggiornaEventiGiornaliera(_idDip,_primoGiornoMese,_ultimoGiornoMese);
   
   // Recupera i dati della giornaliera 
   var _gDataSetDatiDipGiorn = globals.ottieniDataSetSquadratureLavoratore(idLavoratore,
	                                                                       utils.dateFormat(dal,globals.ISO_DATEFORMAT),
																		   utils.dateFormat(al,globals.ISO_DATEFORMAT),
																		   dsSquadrature ? dsSquadrature.getColumnAsArray(1) : null);
   var _gMaxRowIndex = _gDataSetDatiDipGiorn.getMaxRowIndex();
   
   // nel caso di giornaliera di budget dobbiamo abilitare i giorni della normale non conteggiati o che presentano anomalie
//   var _bDs;
//   if(_tipoGiornaliera == globals.TipoGiornaliera.BUDGET)
//      _bDs = ottieniDataSetGiornalieraBudget(_idDip,_ultimoGiorno);
	   
   // Creazione matrice giornaliera
   var arrCurrMese = new Array(numGiorniTotali);
   
   // Numero di colonne ausiliare in aggiunta agli eventi veri e propri (vedi variabili sottostanti)
   var auxColsNo = 9;
   
   var currIdGiornEv, currEvId, currEvProp, currEvCod;
   var offset = 0;

   // Gestisci la colorazione delle festività
   var festivo = new Array(numGiorniTotali);
//   var _idDitta;
//   if(foundset != null && foundset != undefined && foundset.getSize() > 0)
//   {
//	   _idDitta = foundset.e2giornaliera_to_lavoratori.idditta;
//	   var giorniFestivi = globals.getFestivitaDipendente(_idDitta, _idDip, globals.toPeriodo(_anno, _mese));
//	   if(giorniFestivi)
//	   {
//		  for(var i = 0; i < giorniFestivi.length && 0 !== giorniFestivi[i]; i++)
//	   	   festivo[globals.offsetGg + giorniFestivi[i] - 1] = 1;
//	   }
//   }
      
   // Primo ciclo per preparazione giornaliera vuota e costruzione date e festività
   for (var g = 0; g < numGiorniTotali; g++)
   {
	   var data = new Date(dsSquadrature.getValue(g+1,1));
	   
	   arrCurrMese[g] = new Array(colTot + auxColsNo);
	   
	   //selezione iniziale -> nessun selezionato
	   arrCurrMese[g][0] = 0;
	   
	   // campo conteggiato 
	   arrCurrMese[g][1] = globals.isGiornoConteggiato(idLavoratore,data) ? 1 : 0;
	   
	   // Giorno del mese
	   arrCurrMese[g][3] = globals.getNumGiorno(data);
	   
	   // Nome del giorno
	   arrCurrMese[g][4] = globals.getNomeGiorno(data);
	   
	   // Festività
	   arrCurrMese[g][6] = festivo[g] || 0;
	   
   }
      
   // Indice del puntatore per la scansione
   var arrRow = 0;
   /** @type {Date} */
   var currDay = null;
   // Cicla sul foundset per ricostruire la matrice della giornaliera
   for (var row = 1; row <= _gMaxRowIndex; row++)
   {
	   /** @type {Date} */
	   var datetemp = _gDataSetDatiDipGiorn.getValue(row,3);	// giorno
       
	   if(currDay != null && datetemp != currDay)
	      arrRow++;
	   currDay = datetemp;
	   
	   currIdGiornEv = _gDataSetDatiDipGiorn.getValue(row,37);	// idEventoGiornaliera
	   currEvId =  _gDataSetDatiDipGiorn.getValue(row,9); 		// idEvento
	   currEvProp = _gDataSetDatiDipGiorn.getValue(row,10);		// codProprietaEvento
	   currEvCod = _gDataSetDatiDipGiorn.getValue(row,20);	 	// codEvento
	   
	   // idGiornaliera
	   arrCurrMese[arrRow][2] = _gDataSetDatiDipGiorn.getValue(row,1);

	   // Squadrato
	   arrCurrMese[arrRow][5] = _gDataSetDatiDipGiorn.getValue(row,38);
	   
	   // Tooltip orario previsto
	   arrCurrMese[arrRow][7] = (_gDataSetDatiDipGiorn.getValue(row,24) / 100).toFixed(2)
	   
	   // Valore anomalie giornata
	   arrCurrMese[arrRow][8] = _gDataSetDatiDipGiorn.getValue(row,7);
	   	   
	   if(currEvId)
	   {
		   forms.giorn_eventi.foundset.removeFoundSetFilterParam('ftr_evento');
		   forms.giorn_eventi.foundset.addFoundSetFilterParam('idEvento', '=', currEvId, 'ftr_evento');
		   forms.giorn_eventi.foundset.loadAllRecords();
		   
		   switch (forms.giorn_eventi.foundset.e2eventi_to_e2eventiclassi.tipo) 
		   {
			   case 'O':	// ordinario
			   	   switch (colOrd)	// numero di eventi ordinari
				   {
					   case 1:
						   arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
						   break;
						   
					   case 3:
						   switch (currEvProp) 
						   {
							   case 'D':	// diurno
							   	   arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
							   	   break;
							   
							   case 'N':	// notturno
							   	   arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
							   	   break;
							   	   
							   case '':		// non definito (caso particolare)
								   arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
								   break;
						   }						   
						   break;
						   
						case 2:
							// in base al valore di tipoColonne posso avere una qualche combinazione di proprietà 'D', 'N' e ''
							switch (tipoColonne) 
							{
								case 3:
									switch (currEvProp)
									{
										case 'D':
											if(arrCurrMese[arrRow][auxColsNo] != null)
												arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
											else
											    arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
											break;
										case 'N':
										    if(arrCurrMese[arrRow][auxColsNo + 1] != null)
											    arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
										    else
										        arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
											break;
									}									
									break;
			
								case 5:
									switch (currEvProp) 
									{			
										case 'D':
											arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
											break;
										case '':
											arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
											break;
									}
									break;
			
								case 6:
									switch (currEvProp) 
									{			
										case 'N':
											arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
											break;
										case '':
											arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
											break;
									}
									break;
							}			// FINE switch tipo colonne							
							break;	// FINE case 2
					}	// FINE case evento ordinario					
					break;
					
				case 'S':	// sostitutivo
					// Cerca la prima colonna libera successiva agli eventi ordinari
					while(arrCurrMese[arrRow][auxColsNo + colOrd + offset])
					{
						offset++;
					}
	
					//proprietà e numero ore
					arrCurrMese[arrRow][auxColsNo + colOrd + offset] = currIdGiornEv;
					offset = 0;					
					break;
					
				case 'A':	// aggiuntivo
					// Cerca la prima colonna libera successiva agli eventi sostitutivi
					while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset])
					{
						offset++;
					}
	
					//proprietà e numero ore
					arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset] = currIdGiornEv;
					offset = 0;					
					break;
					
				case 'T':	// statistico
					// Cerca la prima colonna libera successiva agli eventi aggiuntivi
					while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset])
					{
						offset++;
					}
	
					arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset] = currIdGiornEv;
					offset = 0;					
					break;
	
				case 'F':	// festa
					//Nel caso della festività la posizione è data dalla proprietà
					switch (currEvProp) 
					{
						case 'FG':	// goduta
							// Cerca la prima colonna libera successiva agli eventi ordinari
							while(arrCurrMese[arrRow][auxColsNo + colOrd + offset] != null)
							{
								offset++;
							}
							
							// Aggiunti la festività al totale degli eventi sostitutivi qualora necessario
							if(offset >= colSos)
								colSos++;
							
							arrCurrMese[arrRow][auxColsNo + colOrd + offset] = currIdGiornEv;
							offset = 0;
							break;
							
						case 'FR':	// retribuita
							// Cerca la prima colonna libera successiva agli eventi sostitutivi
							while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset] != null)
							{
								offset++;
							}
							
							// Aggiunti la festività al totale degli eventi aggiuntivi qualora necessario
							if(offset >= colAgg)
								colAgg++;
							
							arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset] = currIdGiornEv;
							offset = 0;					
							break;
							
						case 'FA':	// accantonata
						case 'FN':	// non retribuita
							// Cerca la prima colonna libera successiva agli eventi aggiuntivi
							while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset] != null)
							{
								offset++;
							}
							
							// Aggiunti la festività al totale degli eventi statistici qualora necessario
							if(offset >= colSta)
								colSta++;
							
							arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset] = currIdGiornEv;
							offset = 0;			
							break;
							
				}	// FINE switch evento
			}	// FINE if evento

			
		}	// FINE gestione evento
   }	// FINE ciclo giorni
         
   // Ricalcolo il totale degli eventi considerando anche le eventuali feste aggiunte
   colTot = colOrd + colSos + colAgg + colSta;
             
   // Costruzione del dataset da assegnare alla form della giornaliera
   // Definizione delle colonne "fisse"
   var cols = ['checked',
               'conteggiato',
               'idgiornaliera',
			   'giornomese', 
			   'nomegiorno',
			   'squadrato',
			   'festivo',
			   'orarioprevisto',
			   'anomalie'];
   // Definizione dei tipi
   var types = [JSColumn.NUMBER
                , JSColumn.NUMBER
                , JSColumn.NUMBER
				, JSColumn.TEXT
				, JSColumn.TEXT
				, JSColumn.INTEGER
				, JSColumn.INTEGER
				, JSColumn.TEXT
				, JSColumn.NUMBER];
   
   // Aggiunta delle colonne per gli eventi
   var evTot = colTot > globals.stdColGg ? colTot : globals.stdColGg;
   for(var ev = 0; ev < evTot; ev++)
   {
	   cols.push('evento_' + (ev + 1));
	   types.push(JSColumn.NUMBER);
   }
   
    // Creazione del dataset vuoto di partenza
   var _gDataSetGiornList = databaseManager.createEmptyDataSet(0, cols);
	// Popolamento del dataset con i valori della matrice costruita ad hoc
   for(var gr = 0; gr < arrCurrMese.length; gr++)
       _gDataSetGiornList.addRow(gr+1, arrCurrMese[gr]);
    
   // Creazione datasource      
   var _gDataSourceGiornList = _gDataSetGiornList.createDataSource('_gDataSourceGiornSquadrList_' + idLavoratore + '_' + evTot, types);
   var datasourceGiornList = datasourceGiornList;
   var foundsetGiornaliera = databaseManager.getFoundSet(_gDataSourceGiornList);
   foundsetGiornaliera.loadAllRecords();
   
   databaseManager.startTransaction();
   
   for(var fg = 1; fg <= foundsetGiornaliera.getSize(); fg++)
   {
	   var recordGiornaliera = foundsetGiornaliera.getRecord(fg);
	   for(var c = 0; c < cols.length; c++)
	   {
		   if(recordGiornaliera[cols[c]] && /^evento_[0-9]+$/i.test(cols[c]))
				databaseManager.refreshRecordFromDatabase(recordGiornaliera['giornaliera_to_e2giornalieraeventi_' + cols[c]], 0);
			recordGiornaliera[cols[c]] = arrCurrMese[fg - 1][c];
			// Ricarica i dati dal database per le colonne relative agli eventi (in caso di modifica)
			if(recordGiornaliera[cols[c]] && /^evento_[0-9]+$/i.test(cols[c]))
				databaseManager.refreshRecordFromDatabase(recordGiornaliera['giornaliera_to_e2giornalieraeventi_' + cols[c]], 0);
	   }
   }
   
   if(!databaseManager.commitTransaction())
	  throw new Error("preparaGiornaliera: could not commit transaction (updating existent rows or creating new rows)");
   
   // Disegna la giornaliera parziale del lavoratore
   disegnaSquadratureLavoratore(idLavoratore,colTot,_gDataSourceGiornList,formContenitore,1,true);
   
//  CODICE PRECEDENTE --> il flag 'conteggiato' era visibile solo per le anomalie eventi nel caso giornate squadrate...   
//  // Disegna la giornaliera, rendendo visibile o meno il riferimento al campo conteggiato ed
//  // aggiungendo le colonne per gli eventi se necessario
//  forms.giorn_list_squadrati_ditta.vOptSquadratiDitta == 2 ?
//	   disegnaSquadratureLavoratore(idLavoratore,colTot,_gDataSourceGiornList,formContenitore,1,true) 
//	   : disegnaSquadratureLavoratore(idLavoratore,colTot,_gDataSourceGiornList,formContenitore,0,true);
  
}

/**
 * @param {Number} idDipendente
 * @param {Number} numCol
 * @param {String} datasource
 * @param {String} formContenitore
 * @param {Number} visualizzaConteggiato 
 * @param {Boolean} [forzaRidisegno]
 *
 * @properties={typeid:24,uuid:"C017DF29-220C-4C8C-B931-42AD0C34C00A"}
 */
function disegnaSquadratureLavoratore(idDipendente,numCol,datasource,formContenitore,visualizzaConteggiato,forzaRidisegno) 
{
 	var templateFormName = forms.giorn_list_squadrati.controller.getName();
	var cloneFormName = elements.tab_squadrati_dip.getTabFormNameAt(1);
	var currFieldNo = globals.stdColGg;
	var sel_index = 1;
	var dx = 87;
	var dy = 20;
	
	var _numColNecessarie = numCol > globals.stdColGg ? numCol : globals.stdColGg;
	
	if (forms[cloneFormName])
	{	
		currFieldNo = solutionModel.getForm(cloneFormName).getFields().length - globals.fieldsGg;
        sel_index = forms[cloneFormName].foundset.getSelectedIndex();	
 	}
	
	if(!forms[cloneFormName] || forzaRidisegno || currFieldNo != _numColNecessarie || forms.giorn_list_squadrati_ditta.vOptSquadratiDitta == 3)
	{
		elements.tab_squadrati_dip.removeTabAt(1);

		if (forms[cloneFormName])
		{
			history.removeForm(cloneFormName);
			solutionModel.removeForm(cloneFormName);
		}
		
		var cloneForm = solutionModel.cloneForm(templateFormName + application.getUUID(), solutionModel.getForm(templateFormName));

		// Aggiungiamo i fields degli eventi nel caso siano in numero > del caso standard
		if (currFieldNo < numCol)
		{
			for (var i = currFieldNo + 1; i <= numCol; i++) 
			{
				var newEv = cloneForm.newField(null, JSField.TEXT_FIELD, cloneForm.width, dy, dx, dy);
				newEv.dataProviderID = 'none';
				newEv.name = 'evento_' + i;
				newEv.styleClass = 'table';
				newEv.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newEv.enabled = true;
				newEv.editable = false;
				newEv.onRender = cloneForm.getMethod('onRenderSquadrature');
				newEv.onRightClick = cloneForm.getMethod('apriPopupVistaMensile');
				
				var newEvLbl = cloneForm.newLabel('Evento ' + i,cloneForm.width, 0, dx, dy);
				newEvLbl.name = 'lbl_evento_' + i;
				newEvLbl.labelFor = newEv.name;
				newEvLbl.styleClass = 'table_header';
			
				cloneForm.width = cloneForm.width + dx;
			}
		}

		// Associamo alle form temporanee i datasources ottenuti in precedenza
		cloneForm.dataSource = datasource;
		// Crea una nuova relazione per ogni evento in giornaliera ed assegnane la descrizione al campo associato
		var ev = 0;
		for (ev = 0; ev < _numColNecessarie; ev++) {
			// Crea la relazione che lega le righe della giornaliera con gli eventi
			var relName = 'giornaliera_to_e2giornalieraeventi_evento_' + (ev + 1);
			var giorn2EventiRel = solutionModel.getRelation(relName);

			// Se la relazione esiste già conserviamola, altrimenti creiamone una nuova
			if (!giorn2EventiRel) {
				giorn2EventiRel = solutionModel.newRelation(relName
					, datasource
					, databaseManager.getTable(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_EVENTI).getDataSource()
					, JSRelation.INNER_JOIN
				);

				giorn2EventiRel.newRelationItem('evento_' + (ev + 1), '=', 'idgiornalieraeventi');
				giorn2EventiRel.allowCreationRelatedRecords = false;
				giorn2EventiRel.deleteRelatedRecords = false;
				giorn2EventiRel.allowParentDeleteWhenHavingRelatedRecords = true;
			}

			var evField = cloneForm.getField('evento_' + (ev + 1));
			if(evField && giorn2EventiRel)
			{
				evField.dataProviderID = giorn2EventiRel.name + ".descrizione";
				evField.toolTipText = '%%' + giorn2EventiRel.name + '.tooltip%%';
				evField.displaysTags = true;
			}
    	}

		//solutionModel.getForm(_tempFormName).getField('checked').dataProviderID = 'checked';
		cloneForm.getField('id_giornaliera').dataProviderID = 'IdGiornaliera';

		var _meseAnno = utils.dateFormat(new Date(forms.giorn_list_squadrati_ditta.annoRif, forms.giorn_list_squadrati_ditta.meseRif - 1, 1), 'MM/yyyy');

		var checkField = cloneForm.getField('checked');
		checkField.dataProviderID = 'checked';
		checkField.toolTipText = 'Seleziona/deseleziona';
		checkField.displaysTags = true;
		
		var conteggiatoField = cloneForm.getField('conteggiato');
		conteggiatoField.dataProviderID = 'conteggiato';
		conteggiatoField.toolTipText = 'Giorno conteggiato/non ancora conteggiato';
		conteggiatoField.displaysTags = true;
		conteggiatoField.visible = visualizzaConteggiato;
		
		var giornoField = cloneForm.getField('giorno_mese');
		giornoField.dataProviderID = 'giornomese';
		giornoField.toolTipText = '%%giornomese%%' + '/' + _meseAnno + ' - Orario Previsto: ' + '%%orarioprevisto%%';
		giornoField.displaysTags = true;
		
		var nomeGiornoField = cloneForm.getField('nome_giorno');
		nomeGiornoField.dataProviderID = 'nomegiorno';
		nomeGiornoField.toolTipText = '%%giornomese%%' + '/' + _meseAnno + ' - Orario Previsto: ' + '%%orarioprevisto%%';
		nomeGiornoField.displaysTags = true;

		var teoricoField = cloneForm.getField('teorico');
		teoricoField.dataProviderID = 'orarioprevisto';
		teoricoField.displaysTags = true;
		
		// aggiornamento visualizzazione delle label
		var conteggiatoLbl = cloneForm.getLabel('lbl_conteggiato');
		conteggiatoLbl.visible = visualizzaConteggiato;
		var giornoLbl = cloneForm.getLabel('lbl_giorno_mese');
		visualizzaConteggiato ? giornoLbl.x  : giornoLbl.x = giornoLbl.x - 40
		var nomeGiornoLbl = cloneForm.getLabel('lbl_nome_giorno');
		visualizzaConteggiato ? nomeGiornoLbl.x : nomeGiornoLbl.x = nomeGiornoLbl.x - 40;
		var teoricoLbl = cloneForm.getLabel('lbl_teorico');
		visualizzaConteggiato ? teoricoLbl.x : teoricoLbl.x = teoricoLbl.x - 40;
		
		for (i = 1; i <= _numColNecessarie; i++) 
		{
			var eventoLbl = cloneForm.getLabel('lbl_evento_' + i);
			visualizzaConteggiato ? eventoLbl.x : eventoLbl.x = eventoLbl.x - 40;
		}
		
		// Aggiorna i foundset delle eventuali relazioni esistenti per tenere conto delle variazioni esterne a Servoy
//		for (ev = 0; ev < _numCol; ev++) {
//			// Crea la relazione che lega le righe della giornaliera con gli eventi
//			var currRel = 'giornaliera_to_e2giornalieraeventi_evento_' + (ev + 1);
//			var currEventiRel = solutionModel.getRelation(currRel);
//			if (currEventiRel)
//			{
//				for (var GG = 1; GG < forms['giorn_list_temp'].foundset.getSize(); GG++)
//		    			databaseManager.refreshRecordFromDatabase(forms[_tempFormName].foundset.getRecord(GG)[currRel], 0);
//			}
//		}
	
		// Aggiungi la form temporanea come tab del pannello contenitore
//		_tabFrm.elements['tab_squadrati_dip'].addTab(_tempFormName, '', 'Squadrature', '', 'null', '#000000', '#BBCCEE', 1);

		elements.tab_squadrati_dip.addTab(cloneForm.name);
		forms[cloneForm.name].foundset.setSelectedIndex(sel_index);
	}
	
    return true;
}
