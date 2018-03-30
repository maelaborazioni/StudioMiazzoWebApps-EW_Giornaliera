/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1A0E7193-EC76-4240-B5EA-0CA272C999AD",variableType:4}
 */
var show_events = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CF6BC6DA-2CE9-47B6-934A-1E667A847F55",variableType:4}
 */
var show_clockings = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"29C19478-A4C0-4DAF-90BD-15B2422EEA14",variableType:4}
 */
var show_causalized = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"6A9A4682-2189-4559-A4CD-E703899EAFFA",variableType:8}
 */
var vTotale = 0.00;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"DC586D81-EB19-4A82-9686-1438B501264A"}
 */
var _tipoGiornaliera = 'N';

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"07CA1547-ADEC-4A20-86CF-E98F546E738B",variableType:-4}
 */
var _filtroAttivo = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D6348F7B-4ABD-496A-955A-77D017D54B7F",variableType:8}
 */
var idGiornalieraPrimoGiorno;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B433ADE8-21B1-43B4-9342-D3090770859A"}
 */
var _totPeriodo = "";

/**
 * Disegna la griglia con la giornaliera del dipendente selezionato
 * per il periodo indicato
 * 
 * @param {Number} idlavoratore
 * @param {Number} anno
 * @param {Number} mese
 * @param {String} tipoGiornaliera
 * @param {Number} indexToUpdate
 * @param {Boolean} [daPannello]
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"3F533E94-D2DD-41DE-9B7D-823B117CEF91"}
 *
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function preparaGiornaliera(idlavoratore, anno, mese, tipoGiornaliera, indexToUpdate, daPannello, forzaRidisegno)
{
	vIdLavoratore = idlavoratore;
	var periodo = vPeriodo = globals.toPeriodo(anno, mese);
	var selectionForm = getSelectionForm();
	var mainForm = getMainForm();
	
	/**
	 * 1. Calcola i parametri necessari per il calcolo
	 */
	var index_sel = (selectionForm && selectionForm.foundset.getSelectedIndex())
	                || (mainForm && mainForm.foundset.getSelectedIndex()) || (1 + globals.offsetGg);
	if (index_sel < 1 + globals.offsetGg)
		index_sel += globals.offsetGg;
	
	// variabile per la definizione dell'offset nel disegno delle fasce orarie
	var offsetFasce = 0;
	// per poter disegnare gli ultimi giorni del mese precedente
	var numGiorniMese     = globals.getTotGiorniMese(mese, anno);
	var numGiorniMesePrec = globals.getTotGiorniMese(mese - 1,anno);
	
	var dataAssunzione = globals.getDataAssunzione(idlavoratore); //forms.giorn_header.foundset.assunzione; 
	var dataCessazione = globals.getDataCessazione(idlavoratore); //forms.giorn_header.foundset.cessazione;
	var primoGiornoLavoratoNelMese;
	var ultimoGiornoLavoratoNelMese;
	
	var ultimoGiornoMese = new Date(anno, mese - 1, numGiorniMese);
	var primoGiornoMese  = new Date(anno,mese - 1, 1);
	
	var primoGiornoVista = new Date(primoGiornoMese);
	    primoGiornoVista.setDate(primoGiornoVista.getDate() - globals.offsetGg);
	
	// calcolo del valore di offset per poter disegnare il riepilogo delle fasce
    var inizioGestionePresenze = globals.getPeriodoInizialeGestionePresenze(globals.getDitta(idlavoratore));
	// a) caso assunto dopo il primo giorno della situazione visualizzata (non prima quindi degli ultimi gg del mese precedente)
	if(primoGiornoVista < dataAssunzione)
	{
		 // se assunto in corso di mese
		 if(dataAssunzione > primoGiornoMese)
			 offsetFasce = dataAssunzione.getDate() - primoGiornoMese.getDate() + globals.offsetGg;
		 else if(dataAssunzione == primoGiornoMese)
			 offsetFasce = globals.offsetGg;
		 else 
			 offsetFasce = dataAssunzione.getDate() - primoGiornoVista.getDate();
	}
	// b) caso primo mese di gestione : offset = differenza giorni di offset standard
	else if(inizioGestionePresenze == periodo)
		offsetFasce = globals.offsetGg;
	else
		offsetFasce = 0;
	
	var primoGiornoString = utils.dateFormat(primoGiornoMese, globals.EU_DATEFORMAT); 
	var ultimoGiornoString;
	
	// se cessato in corso di mese
	if(dataCessazione && dataCessazione < ultimoGiornoMese)
	{
	   ultimoGiornoString          = utils.dateFormat(dataCessazione, globals.EU_DATEFORMAT);
	   ultimoGiornoLavoratoNelMese = dataCessazione;
	   numGiorniMese               = dataCessazione.getDate();
	}
	else
	{
	   ultimoGiornoString = utils.dateFormat(ultimoGiornoMese, globals.EU_DATEFORMAT);	
	   ultimoGiornoLavoratoNelMese = ultimoGiornoMese;
	}
		
	// se assunto in corso di mese
	if(primoGiornoMese < dataAssunzione)
		primoGiornoLavoratoNelMese = new Date(dataAssunzione);
	else 
		primoGiornoLavoratoNelMese = new Date(primoGiornoMese);
	
	// Recuperiamo lo schema degli eventi per costruire a priori la giornaliera 
    var colOrd = 0;		// O (ordinari)
    var colSos = 0;		// S (sostitutivi)
    var colAgg = 0;		// A (aggiuntivi)
    var colSta = 0;		// T (statistici)
    var tipoColOrd = 0;

// OLD algoritmo di calcolo preventivo del numero di colonne necessario per il disegno della giornaliera - non copriva tutti i casi...    
//    TipoColonne serve nel caso di più eventi di tipo ordinario, per conoscere a priori le proprietà
//    var tipoColOrd = 3;
//    var datasetColonneGiorn = globals.ottieniDataSetColonne(idlavoratore,
//								                            utils.dateFormat(primoGiornoVista,globals.ISO_DATEFORMAT),
//								        					utils.dateFormat(ultimoGiornoMese,globals.ISO_DATEFORMAT),
//															tipoGiornaliera);
//    var ds = globals.ottieniDataSetColonne_old(idlavoratore,utils.dateFormat(primoGiornoVista,globals.ISO_DATEFORMAT),
//								        					utils.dateFormat(ultimoGiornoMese,globals.ISO_DATEFORMAT),
//															tipoGiornaliera);
//    datasetColonneGiorn = ds;
//    
//    // Calcola il numero di colonne per ogni tipo di evento (caso peggiore)
//    for(var r = 1; r <= datasetColonneGiorn.getMaxRowIndex(); r++)
//    {
//        switch(datasetColonneGiorn.getValue(r,1))
//		{
//			case 'O' :
//				colOrd = datasetColonneGiorn.getValue(r,2);
//				tipoColOrd = globals.ottieniProprietaColonneEventiOrdinari(idlavoratore,
//																		   utils.dateFormat(primoGiornoVista,globals.ISO_DATEFORMAT),
//																		   utils.dateFormat(ultimoGiornoMese,globals.ISO_DATEFORMAT),
//																		   tipoGiornaliera);
//				// nel caso di un solo tipo di evento controlliamo il tipo di proprietà
//				// ad esempio 9t(d) e 9t(n)
////				if(colOrd == 1 && tipoColOrd == 3 )
//					colOrd = 2;
//				break;
//				
//			case 'S':
//				colSos = datasetColonneGiorn.getValue(r,2);
//				break;
//				
//			case 'A':
//				colAgg = datasetColonneGiorn.getValue(r,2);
//				break;
//				
//			case 'T':
//				colSta = datasetColonneGiorn.getValue(r,2);
//				break;
//				
//			case 'F':
//				colFes = datasetColonneGiorn.getValue(r,2);
//				break;
//		}
//   }
   
   // Recupera i dati della giornaliera 
   var datasetGiornaliera = globals.ottieniDataSetGiornaliera(idlavoratore,primoGiornoVista,ultimoGiornoLavoratoNelMese,tipoGiornaliera);
   
   // nel caso di giornaliera di budget dobbiamo abilitare i giorni della normale non conteggiati o che presentano anomalie
   var datasetGiornalieraBudget;
   if(tipoGiornaliera == globals.TipoGiornaliera.BUDGET)
      datasetGiornalieraBudget = ottieniDataSetGiornalieraBudget(idlavoratore,ultimoGiornoString);

   // ciclo per la determinazione del caso peggiore del numero di colonne relativamente
   // ai vari tipi di evento presenti nei dati mensili 
   var arrProprOrd = []; // array contenitore delle diverse proprietà presenti in generale 
                         // --> serve nel caso di unico evento ma con diverse proprietà nel corso di mese
   
   // creiamo il foundset a partire dal dataset degli eventi (il foundset è più facile da gestire per i nostri scopi!)
   var dS = datasetGiornaliera.createDataSource('dS');
   var fs = databaseManager.getFoundSet(dS);
   // ciclo sui giorni visualizzabili
   /** @type {Date} */
   var g = primoGiornoVista;
   while(g <= ultimoGiornoMese)
   {
	   var maxColOrdGiorn = 0;
	   var maxTipoColOrdGiorn = 0;
	   var maxColSostGiorn = 0;
	   var maxColAggGiorn = 0;
	   var maxColStaGiorn = 0;
	   var maxColFestGiorn = 0;
	   	   
	   fs.find();
	   fs.giorno = globals.dateFormat(g,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
	   if(fs.search())
	   {
		   for(var s = 1; s <= fs.getSize(); s++)
		   {
			   switch(fs.getRecord(s)['tipo'])
			   {
				   case globals.TipoEvento.ORDINARIO:
					   maxColOrdGiorn++;
					   if(arrProprOrd.indexOf(fs.getRecord(s)['codiceproprieta']) == -1)
						   arrProprOrd.push(fs.getRecord(s)['codiceproprieta']);
					   
					   switch(fs.getRecord(s)['codiceproprieta'])
					   {
						   case 'D':
							   maxTipoColOrdGiorn += 1;
							   break;
						   case 'N':
							   maxTipoColOrdGiorn += 2;
							   break;
						   case '':
							   maxTipoColOrdGiorn += 4;
							   break;
						   default:
							   break;
					   }
					   break;
				   case globals.TipoEvento.SOSTITUTIVO:
					   maxColSostGiorn++;
				       break;
				   case globals.TipoEvento.AGGIUNTIVO:
					   maxColAggGiorn++;
				       break;
				   case globals.TipoEvento.STATISTICO:
					   maxColStaGiorn++;
				   	   break;    
				   case globals.TipoEvento.FESTIVITA:
					   switch(fs.getRecord(s)['codiceproprieta'])
					   {
						   case 'FG':
							   maxColSostGiorn++;
							   break;
						   case 'FR':
							   maxColAggGiorn++;
							   break;
						   case 'FA':
						   case 'FN':
							   maxColStaGiorn++;
							   break;
						   default: 
							   break; 	   
					   }
				       break;
				   default:
					   break;
			   }
		   }
		   
		   if(colOrd < maxColOrdGiorn)
			   colOrd = maxColOrdGiorn;
		   if(tipoColOrd < maxTipoColOrdGiorn)
			   tipoColOrd = maxTipoColOrdGiorn;
		   if(colSos < maxColSostGiorn)
			   colSos = maxColSostGiorn;
		   if(colAgg < maxColAggGiorn)
			   colAgg = maxColAggGiorn;
		   if(colSta < maxColStaGiorn)
			   colSta = maxColStaGiorn;
		   
	   }
	   
	   g = new Date(g.getFullYear(), g.getMonth(), g.getDate() + 1);
   }
   
   // ulteriore controllo per verificare, in caso di unico evento nel giorno, se in corso di mese l'evento cambia proprietà
   // in tal caso visualizziamo la situazione su più colonne
   if(colOrd == 1)
   {
	   var tempTipoColOrd = 0;
	   for(var a = 0; a < arrProprOrd.length; a++)
		  switch(arrProprOrd[a])
	      {
		   case 'D':
			   tempTipoColOrd += 1;
			   break;
		   case 'N':
			   tempTipoColOrd += 2;
			   break;
		   case '':
			   tempTipoColOrd += 4;
			   break;
		   default:
			   break;
	      }
	   
	   if(tempTipoColOrd != 1 && tempTipoColOrd != 2 && tempTipoColOrd != 4)
	   {
		   if(tempTipoColOrd == 7)
			   colOrd = 3;
		   else
		       colOrd = 2;
		   tipoColOrd = tempTipoColOrd;
	   }
   }
   
   // variabile array contenitore per le distinte triple (evento,tipo,proprieta)
//   var arrTipoEvProp = [];
//   var tipoEvProp;
//   var objIndex = -1;
//   // ciclo sul dataset per determinare il numero delle distinte triple nel periodo richiesto 
//   for(var d = 1; d <= datasetGiornaliera.getMaxRowIndex(); d++)
//   {
//	   // oggetto tripla
//	   tipoEvProp = {
//		             evento    : datasetGiornaliera.getValue(d,9),
//		             tipo      : datasetGiornaliera.getValue(d,23),
//		             proprieta : datasetGiornaliera.getValue(d,10)
//					};
//	   // ricerca dell'oggetto nell'array contenitore : se non ancora presente viene aggiunto
//	   objIndex = -1;
//	   arrTipoEvProp.forEach(function(obj, arrIndex) {
//		                     if (this.evento == obj.evento 
//		                    		 && this.tipo == obj.tipo
//									 && this.proprieta == obj.proprieta)
//		                    	 objIndex = arrIndex;
//		                         return;
//		                     }, tipoEvProp);
//	   if(objIndex == -1)
//	   	arrTipoEvProp.push(tipoEvProp);
//   }
//   
//   // ciclo sull'array di oggetti evento-tipo-proprieta per determinare il numero delle varie colonne
//   for(var ep = 0; ep < arrTipoEvProp.length; ep++)
//   {
//	   tipoEvProp = arrTipoEvProp[ep];
//	   switch(tipoEvProp.tipo)
//	   {
//		   case globals.TipoEvento.ORDINARIO:
//			   colOrd++;
//			   // per gli eventi di tipo ordinario va considerata anche la proprietà : la combinazione tra le proprietà presenti
//			   // determinerà il corretto posizionamento dell'evento nelle colonne 
//			   switch(tipoEvProp.proprieta)
//			   {
//				   case 'D':
//					   tipoColOrd += 1;
//					   break;
//				   case 'N':
//					   tipoColOrd += 2;
//					   break;
//				   case '':
//					   tipoColOrd += 4;
//					   break;
//				   default:
//					   break;
//			   }
//		       break;
//		   case globals.TipoEvento.SOSTITUTIVO:
//		   colSos++;    
//		   break;	   
//		   case globals.TipoEvento.AGGIUNTIVO:
//		   colAgg++;
//		   break;
//		   case globals.TipoEvento.STATISTICO:
//		   colSta++;
//		   break;  
//		   case globals.TipoEvento.FESTIVITA:
//		   colFes++;   
//		   default:
//			   break;
//	   }
//   }
      
   // Numero di colonne totali necessarie alla visualizzazione in giornaliera degli eventi del mese
   var colTot = colOrd + colSos + colAgg + colSta;
   var datasourceNameGiorn = '_gDataSourceGiornList_' + (colTot > globals.stdColGg ? colTot : '');
   
   // Numero giorni totali visualizzati in giornaliera
   var numGiorniTotali = numGiorniMese + globals.offsetGg;
   // Creazione matrice giornaliera
   var arrCurrMese = new Array(numGiorniTotali);
   
   var foundsetGiornaliera = null;
   
   /**
    * 2. Ricalcola i dati (su esplicita richiesta o perché non ancora in cache)
    */
   if(is_dirty || !isCached(datasourceNameGiorn, idlavoratore, periodo))
   {
	   // Numero di colonne ausiliare in aggiunta agli eventi veri e propri (vedi variabili sottostanti)
	   var auxColsNo = 10;
	   
	   var currIdGiornEv, currGiorno, recCurrGiorno, currEvId, currEvProp, currEvCod, precEvProp;
	   var offset = 0;
	
	   // Gestisci la colorazione delle festività
	   var festivo = new Array(numGiorniTotali);
	   var giorniFestivi = globals.getFestivitaDipendente(globals.getDitta(idlavoratore), idlavoratore, globals.toPeriodo(anno, mese));
	   if (giorniFestivi)
	   {
		  for(var i = 0; i < giorniFestivi.length && 0 !== giorniFestivi[i]; i++)
	   	      festivo[globals.offsetGg + giorniFestivi[i] - 1] = 1;
	   }
	      
	   // Primo ciclo per preparazione giornaliera vuota e costruzione date e festività
	   var data = new Date(primoGiornoVista);
	   for(g = 0; g < numGiorniTotali; g++)
	   {
		   arrCurrMese[g] = new Array(colTot + auxColsNo);
		   
		   //selezione iniziale -> nessun selezionato
		   arrCurrMese[g][0] = 0;
		   
		   // Giorno del mese
		   arrCurrMese[g][2] = globals.getNumGiorno(data);
		   
		   // Nome del giorno
		   arrCurrMese[g][3] = globals.getNomeGiorno(data);
		   
		   // Festività
		   arrCurrMese[g][5] = festivo[g] || 0;
		   
		   // idlavoratore
		   arrCurrMese[g][8] = idlavoratore;
		   
		   // giorno
		   arrCurrMese[g][9] = new Date(data);
		   
		   // Incrementiamo la data da considerare
		   data.setDate(data.getDate() + 1);
	   }
	      
	   // inizializzazione giornaliera di budget, non essendoci tutti i record come accade per la normale,
	   // ha bisogno di una fase di costruzione in più
	   if(tipoGiornaliera == globals.TipoGiornaliera.BUDGET)
	   {
		   for(var bg = 0; bg < numGiorniTotali; bg++)
		   { 
			   arrCurrMese[bg][1] = null; //idGiornaliera
			   arrCurrMese[bg][4] = 0;    //squadrato
			   arrCurrMese[bg][6] = ''    //tooltip orario previsto
			   arrCurrMese[bg][7] = 0;    //anomalie giornata  
		   }
	   }
	   
	   // Indice del puntatore per la scansione
	   var arrRow = 0;
	   // Cicla sul foundset per ricostruire la matrice della giornaliera
	   for(var row = 1; row <= datasetGiornaliera.getMaxRowIndex(); row++)
	   {
		   /** @type {Date} */
		   var datetemp = datasetGiornaliera.getValue(row,3);	// giorno
	       
		   if(mese != datetemp.getMonth() + 1)
		   	   arrRow = (globals.offsetGg) - (numGiorniMesePrec - datetemp.getDate()) - 1;
		   else
			   arrRow = (globals.offsetGg) + datetemp.getDate() - 1;
		   
		   currIdGiornEv = datasetGiornaliera.getValue(row,37);	// idGiornalieraEvento
		   currEvId      = datasetGiornaliera.getValue(row,9);  // idEvento
		   currEvProp    = datasetGiornaliera.getValue(row,10);	// codProprietaEvento
		   currEvCod     = datasetGiornaliera.getValue(row,20);	// codEvento
		   
		   // idGiornaliera
		   arrCurrMese[arrRow][1] = datasetGiornaliera.getValue(row,1);
	
		   // Squadrato
		   arrCurrMese[arrRow][4] = datasetGiornaliera.getValue(row,38);
		   
		   // Tooltip orario previsto
		   arrCurrMese[arrRow][6] = (datasetGiornaliera.getValue(row,24) / 100).toFixed(2)
		   
		   // Valore anomalie giornata
		   arrCurrMese[arrRow][7] = datasetGiornaliera.getValue(row,7);
		   	   
		   //impostiamo il valore dell' idGiornaliera del primo giorno per il successivo calcolo della sezione Voci
		   if(currGiorno == 0)
			   idGiornalieraPrimoGiorno = datasetGiornaliera.getValue(row, 1);
		   
		   if(currEvId)
		   {
			   var tipoEvento = datasetGiornaliera.getValue(row,23);
			   switch (tipoEvento) 
			   {
				   case 'O':	// ordinario
				   	   switch (colOrd)	// numero di eventi ordinari
					   {
						   case 1:
							   arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
							   break;
																			   
						   case 2:
								// in base al valore di tipoColonne posso avere una qualche combinazione di proprietà 'D', 'N' e ''
								switch (tipoColOrd) 
								{
									case 2: // due eventi ordinari con stessa proprietà diurno
									case 4:	// due eventi ordinari con la stessa proprietà notturno 
										if(arrCurrMese[arrRow][auxColsNo] == undefined)
	         							   arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
										else
	   								       arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
										break;
									case 3:
										switch (currEvProp)
										{
											case 'D':
												arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
												break;
											case 'N':
											    arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
												break;
										}									
										break;
									case 5: // due eventi ordinari uno con proprietà diurno e l'altro senza proprietà
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
				
									case 6: // due eventi ordinari uno con proprietà notturno e l'altro senza proprietà
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
									
									case 8: // due eventi ordinari entrambi senza proprietà
									       if(arrCurrMese[arrRow][auxColsNo] == undefined)
                                     		  arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
									       else
   								    	      arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
									       
								}			// FINE switch tipo colonne							
								break;	// FINE case 2
					   
						   case 3:
							   switch(tipoColOrd)
							   {
			    				  case 3: // tre eventi ordinari tutti con la stessa proprietà diurno
			    					if(arrCurrMese[arrRow][auxColsNo] == undefined)
			    						arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
			    					else if(arrCurrMese[arrRow][auxColsNo + 1] == undefined)
			    						arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
			    					else
			    						arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
							      case 4: // tre eventi ordinari due con la stessa proprietà diurno ed il terzo notturno
									switch (currEvProp)
									{
										case 'D':
										   if(arrCurrMese[arrRow][auxColsNo] == undefined)
                                    		  arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
									       else
  								    	      arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv; 
											break;
										case 'N':
										    arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
											break;
									}
									break;
									
							      case 5: // tre eventi ordinari due con la stessa proprietà notturno ed il terzo diurno
									switch (currEvProp)
									{
										case 'N':
										   if(arrCurrMese[arrRow][auxColsNo + 1] == undefined)
                                    		  arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
									       else
  								    	      arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv; 
											break;
										case 'D':
										    arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
											break;
									}
									break;
								   case 7:
									   switch(currEvProp)
									   {
										   case 'D':
										      arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
											  break;
										   case 'N':
											  arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
											  break;
										   case '':
											  arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
											  break;	  
									   }
									   break;
								   case 9:
								   switch(currEvProp)
								   {
									   case 'D':
									      arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
										  break;
									   case '':
										  if(arrCurrMese[arrRow][auxColsNo + 1] == undefined)  
									         arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
										  else
    									     arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
										  break;	  
								   }
								   break;
								   
								   case 10:
									   case 'N':
									      arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
										  break;
									   case '':
										  if(arrCurrMese[arrRow][auxColsNo + 1] == undefined)  
									         arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
										  else
										     arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
										  break;
									   
								   case 12:
									   break;
							   }
						   	   break;
								   
						   case 4 :
						   if(arrCurrMese[arrRow][auxColsNo] == undefined)
	    						arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
	    					else if(arrCurrMese[arrRow][auxColsNo + 1] == undefined)
	    						arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
	    					else if(arrCurrMese[arrRow][auxColsNo + 2] == undefined)
	    						arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
	    					else
	    						arrCurrMese[arrRow][auxColsNo + 3] = currIdGiornEv;
							   break;
							   
//						   switch (currEvProp) 
//						   {
//							   
//							   case 'D':	// diurno
//							   	   arrCurrMese[arrRow][auxColsNo] = currIdGiornEv;
//							   	   break;
//							   
//							   case 'N':	// notturno
//							   	   arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
//							   	   break;
//							   	   
//							   case '':		// non definito (caso particolare)
//								   if(arrCurrMese[arrRow][auxColsNo + 1] != null)
//								      arrCurrMese[arrRow][auxColsNo + 2] = currIdGiornEv;
//								   else
//									  arrCurrMese[arrRow][auxColsNo + 1] = currIdGiornEv;
//								   break;
//						   }						   
//						   break;	
						}	// FINE case evento ordinario					
						break;
						
					case 'S':	// sostitutivo
						// Cerca la prima colonna libera successiva agli eventi ordinari
						while(arrCurrMese[arrRow][auxColsNo + colOrd + offset])
							offset++;
		
						//proprietà e numero ore
						arrCurrMese[arrRow][auxColsNo + colOrd + offset] = currIdGiornEv;
						offset = 0;					
						break;
						
					case 'A':	// aggiuntivo
						// Cerca la prima colonna libera successiva agli eventi sostitutivi
						while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset])
							offset++;
		
						//proprietà e numero ore
						arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset] = currIdGiornEv;
						offset = 0;					
						break;
						
					case 'T':	// statistico
						// Cerca la prima colonna libera successiva agli eventi aggiuntivi
						while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset])
							offset++;
		
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
									offset++;
																
								arrCurrMese[arrRow][auxColsNo + colOrd + offset] = currIdGiornEv;
								offset = 0;
								break;
								
							case 'FR':	// retribuita
								// Cerca la prima colonna libera successiva agli eventi sostitutivi
								while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset] != null)
									offset++;
								
								arrCurrMese[arrRow][auxColsNo + colOrd + colSos + offset] = currIdGiornEv;
								offset = 0;					
								break;
								
							case 'FA':	// accantonata
							case 'FN':	// non retribuita
								// Cerca la prima colonna libera successiva agli eventi aggiuntivi
								while(arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset] != null)
									offset++;
								
								arrCurrMese[arrRow][auxColsNo + colOrd + colSos + colAgg + offset] = currIdGiornEv;
								offset = 0;			
								break;
								
					}	// FINE switch evento
				}	// FINE if evento
			}	// FINE gestione evento
	   }	// FINE ciclo giorni
	   
	   //Aggiornamento anomalie presenti in giornaliera normale da estendere in giornaliera di budget
	   //per rendere i giorni modificabili
	   if(tipoGiornaliera == globals.TipoGiornaliera.BUDGET && datasetGiornalieraBudget)
	   {
		   for(var b=1; b<=datasetGiornalieraBudget.getMaxRowIndex();b++)
		   {
			   /** @type {Date} */
			   var dd = datasetGiornalieraBudget.getValue(b,1);
			   var gg = dd.getDate();
			   
		       arrCurrMese[gg - 1 + globals.offsetGg][7] = datasetGiornalieraBudget.getValue(b,2); 
		   }
	   }
		             
	   /** @type {JSDataSet} */
	   var datasetGiornList = null;
	   var datasourceGiornList = null;
	   
	   // Costruzione del dataset da assegnare alla form della giornaliera
	   // Definizione delle colonne "fisse"
	   var cols = ['checked',
    	           'idgiornaliera',
    			   'giornomese', 
    			   'nomegiorno',
    			   'squadrato',
    			   'festivo',
    			   'orarioprevisto',
    			   'anomalie',
    			   'idlavoratore',
    			   'giorno'];
	   
	   // Definizione dei tipi
	   var types = [JSColumn.NUMBER
	                , JSColumn.NUMBER
	                , JSColumn.TEXT
					, JSColumn.TEXT
					, JSColumn.INTEGER
					, JSColumn.INTEGER
					, JSColumn.TEXT
					, JSColumn.NUMBER
					, JSColumn.INTEGER
					, JSColumn.DATETIME];
	   
	   // Aggiunta delle colonne per gli eventi
	   var evTot = colTot > globals.stdColGg ? colTot : globals.stdColGg;
	   for(var ev = 0; ev < evTot; ev++)
	   {
		   cols.push('evento_' + (ev + 1));
		   types.push(JSColumn.NUMBER);
	   }
	   
	   datasourceGiornList = datasourceGiornList || 'mem:' + datasourceNameGiorn;
	   
	   try
	   {
		   if(!databaseManager.dataSourceExists(datasourceGiornList))
		   {
			   datasetGiornList = databaseManager.createEmptyDataSet(0, cols);
			   datasourceGiornList = datasetGiornList.createDataSource(datasourceNameGiorn, types);
		   }		   

		   foundsetGiornaliera = databaseManager.getFoundSet(datasourceGiornList);		   
		   foundsetGiornaliera = filterMainFoundset(idlavoratore, primoGiornoVista, ultimoGiornoMese, foundsetGiornaliera);
		   
		   var recordGiornaliera, c;
		   
		   // rollback di eventuali transazioni attive
		   databaseManager.rollbackTransaction();
		   
		   databaseManager.startTransaction();
		   		   
		   /**
			 * Aggiornamento di righe già calcolate.
			 */
		   if(isCached(datasourceGiornList, idlavoratore, periodo))
		   {
			   var start = indexToUpdate || 1;
 			   var end   = indexToUpdate || foundsetGiornaliera.getSize();
			   
			   for(var ur = start; ur <= end; ur++)
			   {
					recordGiornaliera = foundsetGiornaliera.getRecord(ur);
					for(c = 0; c < cols.length; c++)
					{
						if(recordGiornaliera[cols[c]] && /^evento_[0-9]+$/i.test(cols[c]))
							databaseManager.refreshRecordFromDatabase(recordGiornaliera['giornaliera_to_e2giornalieraeventi_' + cols[c]], 0);
						recordGiornaliera[cols[c]] = arrCurrMese[ur - 1][c];
						// Ricarica i dati dal database per le colonne relative agli eventi (in caso di modifica)
						if(recordGiornaliera[cols[c]] && /^evento_[0-9]+$/i.test(cols[c]))
							databaseManager.refreshRecordFromDatabase(recordGiornaliera['giornaliera_to_e2giornalieraeventi_' + cols[c]], 0);
					}
			   }
		   }
		   /**
			 * Inserimento di nuove righe. Cancella le righe eventualmente già presenti, poiché calcolate
			 * per un periodo diverso da quello corrente (es. giorni mese precedente)
			 */
		   else 
		   {
			   if(foundsetGiornaliera.getSize() > 0)
				   foundsetGiornaliera.deleteAllRecords();
			   
			   for(var nr = 0; nr < arrCurrMese.length; nr++)
			   {
				   recordGiornaliera = foundsetGiornaliera.getRecord(foundsetGiornaliera.newRecord(nr + 1, false));
				   if(-1 == recordGiornaliera)
						throw new Error("preparaGiornaliera: Could not create record");
				   
				   for(c = 0; c < cols.length; c++)
					   recordGiornaliera[cols[c]] = arrCurrMese[nr][c];
			   }
			   
			   setCached(datasourceGiornList, idlavoratore, periodo);
		   }
		   
		   if(!databaseManager.commitTransaction())
		      throw new Error("preparaGiornaliera: could not commit transaction (updating existent rows or creating new rows)");
		   
	   }
	   catch(ex)
	   {
		   application.output(ex.message, LOGGINGLEVEL.ERROR);
		   databaseManager.rollbackTransaction();
		   return false;
	   }

	   // Prepara e disegna la colonna con le fasce orarie
	   globals.preparaRegoleFasce(anno, mese, idlavoratore, utils.dateFormat(primoGiornoVista,globals.EU_DATEFORMAT),utils.dateFormat(ultimoGiornoLavoratoNelMese,globals.EU_DATEFORMAT), offsetFasce,daPannello);
	
	   is_dirty = false;
	}
   
	/**
	 * 3. Aggiorna i dati a contorno
	 */
	// Riepilogo totale eventi per il mese corrente
    disegnaRiepilogoMensile(ottieniDataSetRiepilogoMensile(idlavoratore, anno, mese),daPannello);
	
	// Disegna la giornaliera, aggiungendo le colonne per gli eventi se necessario
	disegnaGiornaliera(colTot, datasourceGiornList || 'mem:' + datasourceNameGiorn,daPannello,forzaRidisegno);
	   
	// Aggiorna indicazione periodo in intestazione e filtri attivi
	globals.aggiornaPeriodoIntestazione(anno,mese,daPannello != null ? !daPannello : false);
	
	// filtra escludendo i giorni posteriori alla fine del mese
	if(selectionForm)
	{
		var selection_fs = selectionForm.foundset;
		if (selection_fs && selection_fs.find())
		{
			selection_fs['__index__'] = '<=' + (ultimoGiornoMese.getDate() + globals.offsetGg);
			selection_fs.search();
		}
	}
	
	/**
	 * 5. Filtra il foundset corrente.
	 */
    filterMainFoundset(idlavoratore, primoGiornoVista, ultimoGiornoMese);
	
	if(daPannello == undefined || !daPannello)
	   aggiornaSelezione(index_sel);
	
	return true;
}

/**
 * Disegna la tabella delle timbrature
 * 
 * @param {JSDataSet} _dataSet
 * @param {Boolean} [_daPannello]
 * 
 * @properties={typeid:24,uuid:"3D799B77-BD71-4ECD-926C-3387D7F4E393"}
 * @SuppressWarnings(unused)
 */
function disegnaRiepilogoMensile(_dataSet,_daPannello) {

	// nome delle forms (originale e clone) del riepilogo mensile eventi
	var _tempFormName = _daPannello ? 'riepilogoMensileEventiPannello_temp' : 'riepilogoMensileEventi_temp';
	var _oriFormName = 'riepilogoMensileEventi';
	  
	var _dataSource = _dataSet.createDataSource('_gDataSourceRiepMensile_' + _daPannello ? 'pannello' : 'giornaliera'
		, [JSColumn.TEXT, JSColumn.TEXT, JSColumn.NUMBER, JSColumn.TEXT]
	);

	// Aggiorna il totale per il riepilogo
	var totaleRiepilogo = 0;
	if (_dataSet != null)
		_dataSet.getColumnAsArray(3).forEach(function(item) {
			totaleRiepilogo += item;
		}
		);
	_totPeriodo = 'Totale mese: ' + totaleRiepilogo.toFixed(2);
	
	if (forms[_tempFormName] == null) 
	{
		if(_daPannello)
		{
			elements['tab_vista_riepilogo_pannello'].removeAllTabs();
			forms.giorn_voci_riep_mensile_tab.elements.tab_riep_mensile_riepilogo.removeAllTabs();
		}
		else
		{
			elements.tab_vista_riepilogo.removeAllTabs();
			forms.giorn_voci_riep_mensile_tab.elements.tab_riep_mensile_riepilogo.removeAllTabs();
		}
		history.removeForm(_tempFormName);
		solutionModel.removeForm(_tempFormName);
	

		var tempForm = solutionModel.cloneForm(_tempFormName, solutionModel.getForm(_oriFormName));
		
		solutionModel.getForm(_tempFormName).dataSource = _dataSource;
		solutionModel.getForm(_tempFormName).getField('fld_riepEvento').dataProviderID = 'Evento';
		solutionModel.getForm(_tempFormName).getField('fld_riepProp').dataProviderID = 'Proprieta';
		solutionModel.getForm(_tempFormName).getField('fld_riepDescr').dataProviderID = 'Descrizione';
		solutionModel.getForm(_tempFormName).getField('fld_riepOre').dataProviderID = 'Ore';
	
		// Aggiungi il tab di riepilogo
		if(_daPannello)
		{
			elements['tab_vista_riepilogo_pannello'].addTab(_tempFormName, '', 'Riepilogo mese', '', null, '#000000', '#BBCCEE', 1);
			forms.giorn_voci_riep_mensile_tab.elements.tab_riep_mensile_riepilogo.addTab(_tempFormName, '', 'Riepilogo mese', '', null, null);
		}
		else
		{
			elements.tab_vista_riepilogo.addTab(_tempFormName, '', 'Riepilogo mese', '', null, '#000000', '#BBCCEE', 1);
			forms.giorn_voci_riep_mensile_tab.elements.tab_riep_mensile_riepilogo.addTab(_tempFormName, '', 'Riepilogo mese', '', null, null);
		}
	}
}

/**
 *
 * Disegna la giornaliera standard (ed aggiunge eventuali campi aggiuntivi)
 * 
 * @param {Number} _numEv
 * @param {String} _dataSource
 * @param {Boolean} _daPannello
 * @param {Boolean} [_forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"C0919619-5CBF-4B4B-B5D4-1AF6D27283AE"}
 */
function disegnaGiornaliera(_numEv, _dataSource, _daPannello, _forzaRidisegno) 
{
	var _oriFormName = _daPannello ? 'giorn_list_pannello' : 'giorn_list';
	var _tempFormName = _oriFormName + '_temp';
	var _currFieldNo = globals.stdColGg;
	var _numColNecessarie = _numEv > globals.stdColGg ? _numEv : globals.stdColGg;
	
	if (forms[_tempFormName])
		_currFieldNo = solutionModel.getForm(_tempFormName).getFields().length - globals.fieldsGg;

	if (!forms[_tempFormName] || _currFieldNo != _numColNecessarie || _forzaRidisegno) 
	{
		// Eliminiamo il tab panel esistente e rimuoviamo eventuali form omonime già esistenti
		elements.tab_main.removeAllTabs();

		if (history.removeForm(_tempFormName))
			solutionModel.removeForm(_tempFormName);

		var tempForm = solutionModel.cloneForm(_tempFormName, solutionModel.getForm(_oriFormName));
		tempForm.getBodyPart().height = tempForm.getBodyPart().height + 20;
		
		if(_numEv <= globals.stdColGg)
			tempForm.scrollbars = SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER;
		else
			tempForm.scrollbars = SM_SCROLLBAR.SCROLLBARS_WHEN_NEEDED;

		// Aggiungiamo i fields degli eventi nel caso siano in numero > del caso standard
		var fieldNo = tempForm.getFields().length - globals.fieldsGg;
		if (fieldNo < _numEv) 
		{
			for (var i = fieldNo + 1; i <= _numEv; i++) 
			{
				var newEv = tempForm.newField(null, JSField.TEXT_FIELD, tempForm.width, 0, 90, 13);
				tempForm.width = tempForm.width + 90;
				newEv.dataProviderID = 'none';
				newEv.name = 'evento_' + i;
				newEv.styleClass = 'table';
				newEv.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newEv.enabled = true;
				newEv.editable = false;
				newEv.onRender = tempForm.getMethod('onRenderGiorn');
				newEv.onRightClick = tempForm.getMethod('apriPopupVistaMensile');
			}
		}

		// Associamo alle form temporanee i datasources ottenuti in precedenza
		solutionModel.getForm(_tempFormName).dataSource = _dataSource;
		// Crea una nuova relazione per ogni evento in giornaliera ed assegnane la descrizione al campo associato
		var ev = 0;
		for (ev = 0; ev < _numColNecessarie; ev++) 
		{
			// Crea la relazione che lega le righe della giornaliera con gli eventi
			var relName = 'giornaliera_to_e2giornalieraeventi_evento_' + (ev + 1);
			var giorn2EventiRel = solutionModel.getRelation(relName);

			// Se la relazione esiste già conserviamola, altrimenti creiamone una nuova
			if (!giorn2EventiRel) 
			{
				giorn2EventiRel = solutionModel.newRelation(relName
					, _dataSource
					, databaseManager.getTable(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_EVENTI).getDataSource()
					, JSRelation.INNER_JOIN
				);

				giorn2EventiRel.newRelationItem('evento_' + (ev + 1), '=', 'idgiornalieraeventi');
				giorn2EventiRel.allowCreationRelatedRecords = false;
				giorn2EventiRel.deleteRelatedRecords = false;
				giorn2EventiRel.allowParentDeleteWhenHavingRelatedRecords = true;
			}

			var evField = solutionModel.getForm(_tempFormName).getField('evento_' + (ev + 1));
			evField.dataProviderID = giorn2EventiRel.name + ".descrizione";
			evField.toolTipText = '%%' + giorn2EventiRel.name + '.tooltip%%';
			evField.displaysTags = true;
    	}

		solutionModel.getForm(_tempFormName).getField('id_giornaliera').dataProviderID = 'IdGiornaliera';

		var giornoField = solutionModel.getForm(_tempFormName).getField('giorno_mese');
			giornoField.dataProviderID = 'giornomese';
			giornoField.toolTipText = '%%giorno%%' + ' -  Orario Previsto: ' + '%%orarioprevisto%%';
			giornoField.displaysTags = true;
		
		var nomeGiornoField = solutionModel.getForm(_tempFormName).getField('nome_giorno');
			nomeGiornoField.dataProviderID = 'nomegiorno';
			nomeGiornoField.toolTipText = '%%giorno%%' + ' - Orario Previsto: ' + '%%orarioprevisto%%';
			nomeGiornoField.displaysTags = true;
			
		// Aggiungi la form temporanea come tab del pannello contenitore
		if (_tipoGiornaliera === globals.TipoGiornaliera.NORMALE)
			elements.tab_main.addTab(_tempFormName, 'tab_giorn_normale', 'Normale');
		else
			elements.tab_main.addTab(_tempFormName, 'tab_giorn_budget', 'Budget');
	}
		
	forms[_tempFormName]['numeroEventi'] = _numEv;

	if(_daPannello)
	   forms.giorn_vista_mensile_pannello.aggiornaRiepiloghiGiorno(forms[_tempFormName].foundset['idgiornaliera']);
	else
	   forms.giorn_vista_mensile.aggiornaRiepiloghiGiorno(forms[_tempFormName].foundset['idgiornaliera']);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"65BA3DCC-0B40-42ED-8EAF-813222FA2AE4"}
 */
function onShow(firstShow, event)
{
	_super.onShowForm(firstShow,event);
	
	plugins.busy.prepare();
	
	var params = {
        processFunction: process_prepara_giornaliera,
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
 * @properties={typeid:24,uuid:"AC0D681C-FA75-4FF9-809A-0D0DDBAD91B9"}
 */
function process_prepara_giornaliera()
{
	try
	{
		// abilita o meno la visualizzazione del tab delle timbrature
		if(!globals.haOrologio(forms.giorn_header.idditta))
		   abilitaTabTimbrature(false);
		else
		   abilitaTabTimbrature(true);
			
		// abilita o meno la visualizzazione del tab delle commesse
		abilitaTabCommesse(globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE_COMMESSE));// && globals.haCommesse(forms.giorn_header.idditta));
		
		// aggiorna le intestazioni per la giornaliera standard
		aggiornaIntestazioni(true);
		
		//il cliente non visualizza la gestione delle fasce orarie mentre la sede sì
		if(globals.isCliente())
			forms.giorn_vista_mensile.elements.btn_fasce_orarie.visible = false;
			
		var frm = forms.svy_nav_fr_openTabs;
		globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].selected_tab = 2;
	
		forms.giorn_vista_mensile.is_dirty = true;
		
		forms.giorn_header.preparaGiornaliera(null,null,null,true);
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_giornaliera : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Nasconde e/o ridisegna il tab a seconda che la ditta timbri o meno
 * 
 * @param {Boolean} abilita
 * @param {Number} [idDitta]
 * @param {Boolean} [daPannello]
 * 
 * @properties={typeid:24,uuid:"BA99A0B7-B434-4B2E-B915-E323E6153AF3"}
 */
function abilitaTabTimbrature(abilita,idDitta,daPannello)
{
	var causalizzate = globals.haTimbratureCausalizzate(idDitta ? idDitta : forms.giorn_header.idditta);
	
	elements.lbl_riep_timbr.visible = abilita;
	elements.lbl_riep_timbr_header.visible = abilita;
	elements.btn_conteggia_giorno.visible = abilita;
	elements.btn_fasce_orarie.visible = abilita;
	elements.tab_vista_dettagli_timbr.visible = abilita;
	elements.chk_timbrature.visible = abilita;

	if(!abilita)
	{
		elements.lbl_t_caus_header.visible = false;
		elements.lbl_t_caus.visible = false;
		if(daPannello)
			elements['tab_vista_t_caus_pannello'].visible = false;
		else
			elements.tab_vista_t_caus.visible = false;
		elements.chk_causalizzate.visible = false;
		elements.lbl_gest_eventi.setLocation(650,0);
	    elements.lbl_gest_eventi_header.setLocation(650,0);
	    elements.chk_eventi.setLocation(650,0);
	    if(daPannello)
	    	elements['tab_gestione_eventi_giorno_pannello'].setLocation(650,20);
	    else
	        elements.tab_gestione_eventi_giorno.setLocation(650,20);
	}
	else
	{
		if(!causalizzate)
		{
			elements.lbl_t_caus_header.visible = false;
			elements.lbl_t_caus.visible = false;
			if(daPannello)
				elements['tab_vista_t_caus_pannello'].visible = false;
			else
				elements.tab_vista_t_caus.visible = false;
			elements.chk_causalizzate.visible = false;
			elements.lbl_gest_eventi.setLocation(650,140);
		    elements.lbl_gest_eventi_header.setLocation(650,140);
		    elements.chk_eventi.setLocation(650,140);
		    if(daPannello)
		    	elements['tab_gestione_eventi_giorno_pannello'].setLocation(650,160);
		    else
		    	elements.tab_gestione_eventi_giorno.setLocation(650,160);
		    forms.giorn_vista_mensile_timbr_tbl.controller.recreateUI();
		}
		else
		{
			elements.lbl_t_caus_header.visible = true;
			elements.lbl_t_caus.visible = true;
			if(daPannello)
				elements['tab_vista_t_caus_pannello'].visible = true;
			elements.tab_vista_t_caus.visible = true;
		    elements.lbl_gest_eventi.setLocation(650,242);
	        elements.lbl_gest_eventi_header.setLocation(650,242);
	        elements.chk_eventi.setLocation(650,242);
	        if(daPannello)
	        	elements['tab_gestione_eventi_giorno_pannello'].setLocation(650,262);
	        else
	            elements.tab_gestione_eventi_giorno.setLocation(650,262);
	        forms.giorn_vista_mensile_timbr_tbl.controller.recreateUI();
		}
	}
}

/**
 * Nasconde e/o ridisegna il tab a seconda che la ditta utilizzi le commesse o meno
 * 
 * @param {Boolean} abilita
 *
 * @properties={typeid:24,uuid:"B2881B07-C847-4C42-928E-BC8FC2AA73D1"}
 */
function abilitaTabCommesse(abilita)
{
	elements.lbl_riep_commesse.visible = abilita;
	elements.lbl_riep_commesse_header.visible = abilita;
	elements.tab_vista_commesse.visible = abilita;
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A34C5121-13B7-4147-BBE4-EB1376F4AA79"}
 */
function conteggiaGiornoSelezionato(event) {
	globals.conteggiaTimbrature([forms.giorn_header.idlavoratore],
		                        [forms['giorn_list_temp'].foundset.getSelectedIndex() - globals.offsetGg]);
}

/**
 * @param {Number} idDip
 * @param {String} al
 *
 * @properties={typeid:24,uuid:"BC3F2C42-84FF-43AE-9093-6821F653BBCC"}
 */
function ottieniDataSetGiornalieraBudget(idDip,al)
{
	var dal = '01' + al.substring(2);
	var	_bQuery = 'SELECT DISTINCT(Giorno),Anomalie FROM [dbo].[F_Gio_Lav_Dati](?,?,?) WHERE TipoDiRecord = \'N\' AND Anomalie IN (1,2,3,4,5,6,9,10) ORDER BY Giorno' //AND Anomalie IN (1,2,3)';
	var _bArrGiorn = 
		[
	   	   idDip
	   	   ,utils.parseDate(dal,globals.EU_DATEFORMAT)
		   ,utils.parseDate(al,globals.EU_DATEFORMAT)
		];
	
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_bQuery,_bArrGiorn,100);
}

/**
 * @param {Number} idDip
 * @param {Number} anno
 * @param {Number} mese
 *
 * @return JSDataSet
 * 
 * @properties={typeid:24,uuid:"91D7D24E-37E5-48BC-892E-C4F2A27B792E"}
 */
function ottieniDataSetRiepilogoMensile(idDip,anno,mese)
{
	// Riepilogo totale per il mese corrente
	var periodo = globals.toPeriodo(anno, mese);
	var sql = "SELECT * FROM [dbo].[F_Gio_DatiRiepilogoMese](?,?,?,?)";
	
	return databaseManager.getDataSetByQuery
	(
		 globals.Server.MA_PRESENZE
		,sql
		,[
			  idDip
			, globals.getFirstDatePeriodo(periodo)
			, globals.getLastDatePeriodo(periodo)  
		    , _tipoGiornaliera
			]
		, -1
		);
	    
}

/**
 * @AllowToRunInFind
 * 
 * Aggiorna le informazioni aggiuntive del giorno selezionato in giornaliera
 * 
 * @param {Number} idGiornaliera
 * @param {Boolean} [daPannello]
 *
 * @properties={typeid:24,uuid:"7F4165B0-FBC3-4246-8F6D-A0FF965FAF04"}
 */
function aggiornaRiepiloghiGiorno(idGiornaliera,daPannello)
{
	if(!idGiornaliera)
		return;
	
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>} */
	var fs_giornaliera = foundset;
	fs_giornaliera.loadRecords(idGiornaliera);
	
	aggiornaRiepilogoTimbrature(fs_giornaliera,daPannello);
	aggiornaRiepilogoTimbratureCausalizzate(fs_giornaliera,daPannello);
	aggiornaRiepilogoEventi(fs_giornaliera,daPannello);
	aggiornaBadgeEffettivo(fs_giornaliera,daPannello);
}

/**
 * @AllowToRunInFind
 * 
 * @param fs_giornaliera
 * @param [daPannello]
 * 
 * @properties={typeid:24,uuid:"FCA4502D-E0E6-4EB8-81B2-69FF382918F2"}
 */
function aggiornaRiepilogoTimbrature(fs_giornaliera,daPannello)
{
	/**
	 * Aggiorna le timbrature del giorno
	 */
	var show = daPannello || show_clockings;
	
	if(fs_giornaliera.e2giornaliera_to_e2timbratura && fs_giornaliera.e2giornaliera_to_e2timbratura.find())
	{
		if(!show)
			fs_giornaliera.e2giornaliera_to_e2timbratura.idtimbrature = '^';
		else
			fs_giornaliera.e2giornaliera_to_e2timbratura.timbeliminata = 0;
		
		if(fs_giornaliera.e2giornaliera_to_e2timbratura.search() > 0)
		{
			if(daPannello)
				forms.giorn_vista_mensile_timbr_tbl_pannello.foundset.loadRecords(fs_giornaliera.e2giornaliera_to_e2timbratura);
			else
			    fs_giornaliera.e2giornaliera_to_e2timbratura.sort('timbratura asc'); //forziamo il sort per ordinare eventuali timbrature inserite manualmente	    	
		}
		else
			if(daPannello)
				forms.giorn_vista_mensile_timbr_tbl_pannello.foundset.loadRecords(fs_giornaliera.e2giornaliera_to_e2timbratura);
	}
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param fs_giornaliera
 * @param [daPannello]
 *
 * @properties={typeid:24,uuid:"8F72D67B-7A52-4B9A-9B28-07641796A7FC"}
 */
function aggiornaRiepilogoTimbratureCausalizzate(fs_giornaliera,daPannello)
{
	/**
	 * Aggiorna le timbrature causalizzate
	 */
	 var show = daPannello || show_causalized;
	 
	if(!show && fs_giornaliera.e2giornaliera_to_e2timbratureservizio && fs_giornaliera.e2giornaliera_to_e2timbratureservizio.find())
	{
		fs_giornaliera.e2giornaliera_to_e2timbratureservizio.ide2timbratureservizio = '^';
		fs_giornaliera.e2giornaliera_to_e2timbratureservizio.search();
	}
	else if(show && fs_giornaliera.e2giornaliera_to_e2timbratureservizio)
	{
		if(daPannello)
			forms.giorn_mostra_timbr_t_caus_tbl_pannello.foundset.loadRecords(fs_giornaliera.e2giornaliera_to_e2timbratureservizio);
		else
		    fs_giornaliera.e2giornaliera_to_e2timbratureservizio.loadAllRecords();
    }
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param fs_giornaliera
 * @param [daPannello]
 * 
 * @properties={typeid:24,uuid:"1ED52683-128F-429F-BA68-DBA71B50AA2F"}
 */
function aggiornaRiepilogoEventi(fs_giornaliera,daPannello)
{
	/**
	 * Aggiorna il riepilogo degli eventi
	*/
	var show = daPannello || show_events;
	
	if(!show && fs_giornaliera.e2giornaliera_to_e2giornalieraeventi && fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.find())
	{
		fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.idevento = '^';
		fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.search();
	}
	else if(show && fs_giornaliera.e2giornaliera_to_e2giornalieraeventi)
	{
		if(daPannello)
			forms.giorn_vista_mensile_eventi_tbl_pannello.foundset.loadRecords(fs_giornaliera.e2giornaliera_to_e2giornalieraeventi);
		else
 		    fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.loadAllRecords();
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param fs_giornaliera
 * @param [daPannello]
 * 
 * @properties={typeid:24,uuid:"89E4F8F8-52CE-4782-ACAB-AFA90847619C"}
 */
function aggiornaBadgeEffettivo(fs_giornaliera,daPannello)
{
	/**
     * Aggiorna il badge effettivo del giorno
     */
	if(daPannello)
		return;
	
    if(fs_giornaliera.e2giornaliera_to_e2timbratura && fs_giornaliera.e2giornaliera_to_e2timbratura.nr_badge != null)
    {
	   forms.giorn_header._vNrBadge = 
	   forms.giorn_cart_header._vNrBadge = fs_giornaliera.e2giornaliera_to_e2timbratura.nr_badge;
    }
    else
    {
        forms.giorn_header._vNrBadge = 
       	forms.giorn_cart_header._vNrBadge = globals.getNrBadge(fs_giornaliera.iddip, fs_giornaliera.giorno);
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
 * @properties={typeid:24,uuid:"5733A77A-5DDB-4960-88B7-C79145F2798C"}
 */
function onDataChangeTimbrature(oldValue, newValue, event)
{
	aggiornaRiepilogoTimbrature(foundset);
	return true;
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
 * @properties={typeid:24,uuid:"1CB74653-3B3A-43D6-8B8F-7A0D8F7407E1"}
 */
function onDataChangeTimbratureCausalizzate(oldValue, newValue, event)
{
	aggiornaRiepilogoTimbratureCausalizzate(foundset);
	return true;
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
 * @properties={typeid:24,uuid:"C9AB11BE-5629-4AE2-B5A8-893D0E6C8D8F"}
 */
function onDataChangeEventi(oldValue, newValue, event)
{
	aggiornaRiepilogoEventi(foundset);
	return true;
}

/**
 * @return {RuntimeForm}
 * 
 * @properties={typeid:24,uuid:"5D3FF488-4F1E-4DA3-A64D-185DD4F83225"}
 */
function getMainForm()
{
	return forms[elements.tab_main.getTabFormNameAt(1)];
}

/**
 * Aggiorna la visualizzazione delle intestazioni della giornaliera
 *  
 * @param {Boolean} visible
 *
 * @properties={typeid:24,uuid:"8CC3DC2B-7C87-4EDF-83AA-F0B0BA8FB8CD"}
 */
function aggiornaIntestazioni(visible)
{
	var frmIntesta = forms.intestaVistaMensile;
	frmIntesta.elements.btn_attivamese.visible = 
		frmIntesta.elements.btn_filtroattivo.visible = 
			frmIntesta.elements.btn_filtrodisattivato.visible = 
				frmIntesta.elements.btn_giornbudget.visible = 
					frmIntesta.elements.btn_giornnormale.visible = 
						frmIntesta.elements.btn_meseprec.enabled = 
							frmIntesta.elements.btn_mesesucc.enabled = 
								frmIntesta.elements.btn_selperiodo.enabled =
									frmIntesta.elements.lbl_tipo_giornaliera.visible = 
										frmIntesta.elements.lbl_filtro_giornaliera.visible = visible;
	
}