/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C034F649-A4FC-4813-840F-8B3CD92D38A4",variableType:4}
 */
var show_events = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"842A5A91-C305-41C7-9FFD-C8970A945F35",variableType:4}
 */
var show_causalized = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"173B3284-7B31-4184-B005-7518EC1DFCBF",variableType:4}
 */
var show_clockings = 0;

/**
 * @param {Number} anno
 * @param {Number} mese
 * @param {Number} [idlavoratore]
 * @param {Boolean} [cartolina]
 * @param {Number} [indexToUpdate]
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"5656AC25-3DD2-44B5-B074-398C9CF904E9"}
 * @SuppressWarnings(unused)
 * @AllowToRunInFind
 */
function preparaTimbratura(anno, mese, idlavoratore, cartolina, indexToUpdate, forzaRidisegno)
{
	var periodo = vPeriodo = globals.toPeriodo(anno, mese);
	var selectionForm = getSelectionForm();
	var mainForm = getMainForm();
	
	/**
	 * 1. Calcola i parametri necessari per il calcolo
	 */
	idlavoratore = idlavoratore || forms.giorn_header.idlavoratore || forms.giorn_cart_header.idlavoratore;
	
	vIdLavoratore = idlavoratore;
	
	var index_sel = (selectionForm && selectionForm.foundset.getSelectedIndex())
                    || (mainForm && mainForm.foundset.getSelectedIndex()) || (1 + globals.offsetGg);
	if (index_sel < 1 + globals.offsetGg)
		index_sel += globals.offsetGg;
	
	// variabile per la gestione della cartolina dipendente
	var soloCartolina = cartolina ? cartolina : false;
	// variabile per la definizione dell'offset fasce orarie
	var offsetFasce = 0;
	
	var numGiorniMese = globals.getTotGiorniMese(mese,anno);
	var numGiorniMesePrec = globals.getTotGiorniMese(mese - 1, anno);
	
	var dataAssunzione = soloCartolina ? forms.giorn_cart_header.foundset.assunzione : forms.giorn_header.foundset.assunzione; 
	var dataCessazione = soloCartolina ? forms.giorn_cart_header.foundset.cessazione : forms.giorn_header.foundset.cessazione;
	
	var primoGiornoLavoratoNelMese;
	var ultimoGiornoLavoratoNelMese;
	
	var ultimoGiornoMese = new Date(anno,mese - 1, numGiorniMese);
	var primoGiornoMese  = new Date(anno,mese - 1, 1);
	
	var primoGiornoVista = new Date(primoGiornoMese);
	    primoGiornoVista.setDate(primoGiornoVista.getDate() - globals.offsetGg);
    
	var primoGiorno = primoGiornoVista.getDate() + (primoGiornoVista.getMonth() + 1) * 100 +  primoGiornoVista.getFullYear() * 10000; 
	var ultimoGiorno;
	
	if(dataCessazione != null && dataCessazione < ultimoGiornoMese)
	{
	   ultimoGiorno = dataCessazione.getDate() +  mese * 100 + anno * 10000;
	   ultimoGiornoLavoratoNelMese = dataCessazione;
	   numGiorniMese = dataCessazione.getDate();
	}
	else
	{
	   ultimoGiorno = numGiorniMese +  mese * 100 + anno * 10000;	
	   ultimoGiornoLavoratoNelMese = ultimoGiornoMese;
	}
	
	if(primoGiornoMese < dataAssunzione)
		primoGiornoLavoratoNelMese = new Date(dataAssunzione);
	else 
		primoGiornoLavoratoNelMese = new Date(primoGiornoVista);
	
	var datasetGiornTimbr;
	var datasourceGiornTimbr;
	var datasourceNameGiornTimbr = '_tDataSourceMostraTimbr_';
	
	var foundsetTimbrature = null;
	
	/**
	 * 2. Controlla se è necessario ricalcolare i dati
	 */
    if(is_dirty || !isCached(datasourceNameGiornTimbr, idlavoratore, periodo))
    {
    	// Ottieni il dataset delle fasce orarie
        //var datasetFasce = globals.ottieniDataSetFasceOrarie(idlavoratore, primoGiornoVista, ultimoGiornoMese);
    	
        // Ottieni il dataset delle timbrature
        var datasetTimbrature = globals.ottieniDataSetTimbrature(idlavoratore, primoGiornoVista, ultimoGiornoLavoratoNelMese, soloCartolina);
    													 
        // Numero giorni totali visualizzati in giornaliera
        var numGiorniTotali = numGiorniMese + globals.offsetGg;
        // Creazione matrice timbrature
    	var arrCurrMese = new Array(numGiorniTotali);
        
    	// aggiornamento degli eventi nella tabella di riepilogo eventi del giorno 
    	globals.aggiornaEventiGiornaliera(idlavoratore, primoGiornoMese, ultimoGiornoMese);
    	
    	var data = new Date(primoGiornoVista);
 
    	// calcolo del valore di offset per poter disegnare il riepilogo delle fasce
        // a) caso assunto dopo il primo giorno della situazione visualizzata (non prima quindi degli ultimi gg del mese precedente)
    	var inizioGestionePresenze = globals.getPeriodoInizialeGestionePresenze(globals.getDitta(idlavoratore));
    	if(dataAssunzione && dataAssunzione > primoGiornoVista)
    		offsetFasce = Math.floor((dataAssunzione - primoGiornoVista)/(24*3600*1000)) + 1;
    	// b) caso primo mese di gestione : offset = differenza giorni di offset standard
    	else
    		if(inizioGestionePresenze == periodo)
        		offsetFasce = globals.offsetGg + 1;
    	else
    		offsetFasce = 0//globals.offsetGg;
    	
    	// Inizializzazione matrice con fasce orarie ottenute
    	for (var tf = 0; tf < numGiorniTotali; tf++) 
    		arrCurrMese[tf] = [];
    	    	
    	// Gestisci la colorazione delle festività
        var festivo = new Array(numGiorniTotali);
        var giorniFestivi = globals.getFestivitaDipendente(globals.getDitta(idlavoratore), idlavoratore, globals.toPeriodo(anno, mese));
        if (giorniFestivi)
        {
            for(var i = 0; i < giorniFestivi.length && 0 !== giorniFestivi[i]; i++)
       	        festivo[globals.offsetGg + giorniFestivi[i] - 1] = 1;
        }

        // Gestisci giorni squadrati per il caso della cartolina dipendente
        var squadrato = new Array(numGiorniTotali);
        var giorniSquadrati = globals.ottieniGiorniSquadratiDipendente(idlavoratore, primoGiornoLavoratoNelMese, ultimoGiornoLavoratoNelMese);
        
        if(foundset != null && foundset != undefined && foundset.getSize() > 0)
        {
        	for(var j=0; j<giorniSquadrati.length; j++)
        		squadrato[globals.offsetGg + giorniSquadrati[j].getDate() - 1] = 1;
        }
        
    	//Inizializzazione matrice con nomi giorni e fasce orarie
        for (var ti = 0; ti < numGiorniTotali; ti++)
        {
        	// selezione iniziale -> nessun selezionato 
            arrCurrMese[ti][0] = 0;
            
            // Giorno del mese
            arrCurrMese[ti][1] = globals.getNumGiorno(data);
            
            // Nome del giorno
            arrCurrMese[ti][2] = globals.getNomeGiorno(data);
                  
            // Situazione anomalie
            arrCurrMese[ti][12] = null;
           
            // Festività
            arrCurrMese[ti][13] = festivo[ti] || 0;
            
            // Squadrature
            arrCurrMese[ti][14] = squadrato[ti] || 0;
     	   
            // idlavoratore
            arrCurrMese[ti][15] = idlavoratore;
     	   
            // giorno
            arrCurrMese[ti][16] = new Date(data);     	        	   
     	   
            // verifica delle informazioni inerenti la fascia (se il dipendente è in forza nella data)
            if(dataAssunzione <= data && (dataCessazione == null || dataCessazione >= data))
            {
	            var fascia = globals.ottieniInformazioniFasciaGiorno(idlavoratore,data);
	            
	            arrCurrMese[ti][3] = fascia.codicefascia;
	            arrCurrMese[ti][4] = fascia.codalternativo;
	            arrCurrMese[ti][6] = fascia.descrizione;
            }
            
    	   	// Incrementiamo la data da considerare
           	data.setDate(data.getDate() + 1);
        }
            
        // Variabili per la gestione della matrice
        /** @type {Number} */
        var idtimbratura
        /** @type {Number} */
        var lastGiorno;
        /** @type {Number} */
        var currGiorno;
        /** @type {Number} */
        var currMese;
        /** @type {Number} */
        var currAnno;
        /** @type {Number} */
    	var lastTimbrX;
    	/** @type {Number} */
    	var lastTimbrY;
    	/** @type {Number} */
    	var maxTimbrPerRow;
    	/** @type {Number} */
    	var currTimbrNum;
    	/** @type {String} */
    	var currTimbr;
    	/** @type {Number} */
    	var currTimbrSenso = null;
    	/** @type {Number} */
    	var currTimbrSensoPrec;
    	/** @type {Boolean} */
    	var currTimbrGGSucc;
    	/** @type {Number} */
    	var currTimbrGiorno = null;
    		
    	lastGiorno = null;
        lastTimbrX = -1;
    	lastTimbrY = -1;

    	/** @type {Number}*/
    	var currMinuti;
    	/** @type {Number} */
    	var _diff;
        	
    	currTimbrGiorno = null;
    	currTimbrSenso = null;
        lastGiorno = null;
    	lastTimbrX = 0;
    	lastTimbrY = 0;
    	maxTimbrPerRow = 6;	// la form supporta 3 coppie entrata/uscita di default
    	
    	var offset = globals.fieldsTimbr;		// salta i campi aggiuntivi iniziali
    	
    	// Indice del puntatore per la scansione
    	var arrRow = 0;
    	
        // Cicla sul foundset per ricostruire la matrice delle timbrature
        for (var row = 1; row <= datasetTimbrature.getMaxRowIndex(); row++)
        {
        	/** @type {Date} */
        	var giornoRiga = datasetTimbrature.getValue(row, 14);
        	
        	// Calcola giorno, mese ed anno per la riga corrente, a partire dal campo Giorno (yyyyMMdd)
        	currGiorno	= giornoRiga.getDate();
        	currMese	= giornoRiga.getMonth() + 1;
        	currAnno	= giornoRiga.getFullYear();

        	if(mese !== currMese)
        		arrRow = (globals.offsetGg) - (numGiorniMesePrec - currGiorno) - 1 ;
        	else
        		arrRow = (globals.offsetGg) + currGiorno - 1;
    		  
        	//valore della timbratura  
        	currTimbrNum = datasetTimbrature.getValue(row,5);
        	if(currTimbrNum)
        	{
        		//timbratura in formato aaaaMMggoomm
        		currTimbr = currTimbrNum.toString();

        		//idtimbratura
        		idtimbratura = datasetTimbrature.getValue(row,1);

				//giorno della timbratura in formato aaaaMMgg
				currTimbrGiorno = parseInt(utils.stringLeft(currTimbr,8),10);

        		//senso della timbratura
        		if((!datasetTimbrature.getValue(row,4) && !datasetTimbrature.getValue(row,7)) ||
    			   ( datasetTimbrature.getValue(row,4) &&  datasetTimbrature.getValue(row,7)))
    			   currTimbrSenso = 0;
        		else
    			   currTimbrSenso = 1;
        		
        		//senso della timbratura precedente
        		if((!datasetTimbrature.getValue(row-1,4) && !datasetTimbrature.getValue(row-1,7)) ||
    			   ( datasetTimbrature.getValue(row-1,4) &&  datasetTimbrature.getValue(row-1,7)))
        			currTimbrSensoPrec = 0;
        		else
        			currTimbrSensoPrec = 1;
    		   		
        		//competenza giorno successivo e aggiornamento per l'indice
        		currTimbrGGSucc = datasetTimbrature.getValue(row,10);
        		if(currTimbrGGSucc)
        			currGiorno++;
        	}
        	else
        		idtimbratura = null;
     	  	   
        	if(currGiorno == lastGiorno)
        	{
        		//se ci sono due timbrature con lo stesso senso bisogna lasciare uno spazio
        		if(currTimbrSenso == currTimbrSensoPrec)
        		{
        			arrCurrMese[lastTimbrX][lastTimbrY] = null;
        			lastTimbrY++;
        		}
        		
        		arrCurrMese[lastTimbrX][lastTimbrY] = idtimbratura;
        	}
        	// Nuova giornata
        	else
        	{
        		//l'indice per l'inserimento nell'array
        		lastTimbrX = arrRow;
        		
        		// idGiornaliera della giornata
            	arrCurrMese[lastTimbrX][5] = datasetTimbrature.getValue(row, 13);
            	
            	// anomalia della giornata
                if(arrCurrMese[lastTimbrX][5])
                {
                	var anomalia = datasetTimbrature.getValue(row, 15);
                	arrCurrMese[lastTimbrX][12] = anomalia;
                	// aggiorniamo per l'esposizione ed il tooltip in caso di aver utilizzato una fascia alternativa
        		    // per il conteggio delle timbrature
                	if(anomalia === 512)
                	{
                		arrCurrMese[lastTimbrX][3] = '[' + arrCurrMese[lastTimbrX][3] + ']';
                		arrCurrMese[lastTimbrX][6] = arrCurrMese[lastTimbrX][6] + ' - Fascia alternativa';
                	}
                }
        		
//        		// Salva le informazioni aggiuntive			   
//        		arrCurrMese[lastTimbrX][6] = datasetFasce.getValue(lastTimbrX + 1, 4);
//
//        		var inizioOrario = datasetFasce.getValue(lastTimbrX + 1, 5);
//        		arrCurrMese[lastTimbrX][7] = inizioOrario;
//    	        
//        		var inizioPausa = datasetFasce.getValue(lastTimbrX + 1, 6);
//        		arrCurrMese[lastTimbrX][8] = inizioPausa;
//    	        
//        		var finePausa = datasetFasce.getValue(lastTimbrX + 1, 7);
//        		arrCurrMese[lastTimbrX][9] = finePausa;
//    	        
//        		var fineOrario = datasetFasce.getValue(lastTimbrX + 1, 8);
//        		arrCurrMese[lastTimbrX][10] = fineOrario;
//    	        
//        		var totOreFascia = datasetFasce.getValue(lastTimbrX + 1, 9);
//        		arrCurrMese[lastTimbrX][11] = (totOreFascia/100).toFixed(2);
    	       	       	       
        		// Memorizza il massimo numero di timbrature prima di reimpostarle
        		if((lastTimbrY - offset) > maxTimbrPerRow)
        			maxTimbrPerRow = lastTimbrY - offset;
    		   
        		//l'inserimento delle timbrature inizia dalla 12a cella da sx a meno che la prima timbratura presente sia un'uscita
        		lastTimbrY = offset;
        		if(currTimbrSenso == 1)
        		{
        			arrCurrMese[lastTimbrX][lastTimbrY] = null
        			lastTimbrY++;
				}

				arrCurrMese[lastTimbrX][lastTimbrY] = idtimbratura
    		   
				lastGiorno = currGiorno;
    		}
    	   
    	    lastTimbrY++;
        }
    
	    var cols = 
	    [
		      'checked'
			, 'giornomese'
			, 'nomegiorno'
			, 'fascia'
			, 'turno'
			, 'idgiornaliera'
			, 'descrizionefascia'
			, 'inizioorario'
			, 'iniziopausa'
			, 'finepausa'
			, 'fineorario'
			, 'totorefascia'
			, 'anomalie'
			, 'festivo'
			, 'squadrato'
			, 'idlavoratore'
			, 'giorno'
		];
	
		var types = 
		[
			   JSColumn.NUMBER
			 , JSColumn.TEXT
			 , JSColumn.TEXT
			 , JSColumn.TEXT
			 , JSColumn.TEXT
			 , JSColumn.NUMBER
			 , JSColumn.TEXT
			 , JSColumn.NUMBER
			 , JSColumn.NUMBER
			 , JSColumn.NUMBER
			 , JSColumn.NUMBER
			 , JSColumn.TEXT
			 , JSColumn.NUMBER
			 , JSColumn.NUMBER
			 , JSColumn.NUMBER
			 , JSColumn.INTEGER
			 , JSColumn.DATETIME
		];
		
		// calcolo del numero delle colonne per le timbrature
		var coppieTot = Math.ceil(maxTimbrPerRow / 2);
		
		if (maxTimbrPerRow <= globals.stdColTimbr)
			maxTimbrPerRow = globals.stdColTimbr;
		else   	
			datasourceNameGiornTimbr += coppieTot;
				
		// Aggiunta delle colonne per le timbrature
	    for(var timbr = 0; timbr < coppieTot; timbr++)
		{
			// Aggiungi una coppia entrata uscita alle colonne del dataset
			cols.push('entrata_' + (timbr + 1));
			cols.push('uscita_' + (timbr + 1));
			// Aggiungi il tipo per la coppia appena creata
			types.push(JSColumn.INTEGER);
			types.push(JSColumn.INTEGER);
		}
	    
		datasourceGiornTimbr = datasourceGiornTimbr || 'mem:' + datasourceNameGiornTimbr;
		   
		try
		{
			if(!databaseManager.dataSourceExists(datasourceGiornTimbr))
			{
				datasetGiornTimbr = databaseManager.createEmptyDataSet(0, cols);
				datasourceGiornTimbr = datasetGiornTimbr.createDataSource(datasourceNameGiornTimbr, types);
			}		   
	
			foundsetTimbrature = databaseManager.getFoundSet(datasourceGiornTimbr);
			foundsetTimbrature = filterMainFoundset(idlavoratore, primoGiornoVista, ultimoGiornoMese, foundsetTimbrature);
			
			var recordTimbrature, c;
			
			databaseManager.startTransaction();
		
			/**
			 * Aggiornamento di righe già calcolate.
			 */
			if(isCached(datasourceGiornTimbr, idlavoratore, periodo))
			{
				var start = indexToUpdate || 1;
				var end   = indexToUpdate || foundsetTimbrature.getSize();
				
				for(var ur = start; ur <= end; ur++)
				{
					recordTimbrature = foundsetTimbrature.getRecord(ur);
					for(c = 0; c < cols.length; c++)
					{
						recordTimbrature[cols[c]] = arrCurrMese[ur - 1][c];
						// Ricarica i dati dal database per le colonne relative alle timbrature (in caso di modifica)
						if(recordTimbrature[cols[c]] && /^(?:entrata|uscita)_[0-9]+$/i.test(cols[c]))
							databaseManager.refreshRecordFromDatabase(recordTimbrature['timbrature_to_e2timbrature_' + cols[c]], 0);
					}
				}
			}
			/**
			 * Inserimento di nuove righe. Cancella le righe eventualmente già presenti, poiché calcolate
			 * per un periodo diverso da quello corrente (es. giorni mese precedente)
			 */
			else 
			{
				if(foundsetTimbrature.getSize() > 0)
					foundsetTimbrature.deleteAllRecords();
				
				for(var nr = 0; nr < arrCurrMese.length; nr++)
				{
					recordTimbrature = foundsetTimbrature.getRecord(foundsetTimbrature.newRecord(nr + 1, false));
					if(-1 == recordTimbrature)
						throw new Error("preparaTimbrature: Could not create record");
					
					for(c = 0; c < cols.length; c++)
						recordTimbrature[cols[c]] = arrCurrMese[nr][c];
				}
				
				setCached(datasourceGiornTimbr, idlavoratore, periodo);
			}
			
			databaseManager.commitTransaction();
		}
		catch(ex)
		{
			application.output(ex.message, LOGGINGLEVEL.ERROR);
			databaseManager.rollbackTransaction();
			return false;
		}
		   		
	    is_dirty = false;
	}
    
    // Disegna la tabella delle timbrature, aggiungendo le colonne per le timbrature aggiuntive se necessario
    disegnaTimbrature(coppieTot, datasourceGiornTimbr || 'mem:' + datasourceNameGiornTimbr, soloCartolina, forzaRidisegno);
    
    // Aggiorna il periodo dell'intestazione
	globals.aggiornaPeriodoIntestazione();
	
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
	 * Filtra il foundset corrente.
	 */
	filterMainFoundset(idlavoratore, primoGiornoVista, ultimoGiornoMese);
	
	aggiornaSelezione(index_sel);
	
//	if(selectionForm)
//	   selectionForm['visibleForm'] = controller.getName();
			
	return true;
}

/**
 * Disegna la tabella delle timbrature   
 *
 * @param {Number} _numCol
 * @param {String} _dataSource 
 * @param {Boolean} _soloCartolina
 * @param {Boolean} [_forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"85905BC0-B941-4BA0-93B0-4E89C7F5F832"}
 */
function disegnaTimbrature(_numCol, _dataSource, _soloCartolina, _forzaRidisegno) 
{
	var _oriFormName = _soloCartolina ? 'giorn_timbr_cartolina' : 'giorn_timbr';
	var _tempFormName = _oriFormName + '_temp';
	var attivo = false;
	var _currFieldNo = 3;
	var annoCorrente = globals.getAnno();
	var meseCorrente = globals.getMese();
	var annoAttivo = globals.getAnnoAttivo();
	var meseAttivo = globals.getMeseAttivo();

	if (meseCorrente == meseAttivo && annoCorrente == annoAttivo)
		attivo = true;

	if (forms[_tempFormName])
		_currFieldNo = _soloCartolina ? Math.floor((solutionModel.getForm(_tempFormName).extendsForm.getFields().length - globals.stdColTimbr + 1) / 2) : Math.floor((solutionModel.getForm(_tempFormName).getFields().length - globals.stdColTimbr + 1) / 2);

	if (!forms[_tempFormName] || _currFieldNo != _numCol || _forzaRidisegno) 
	{
		var tabFrm = _soloCartolina ? forms['giorn_mostra_timbr_cartolina'] : forms['giorn_mostra_timbr'];
		tabFrm.elements.tab_main.removeAllTabs();
		
		if (history.removeForm(_tempFormName))
			solutionModel.removeForm(_tempFormName);

		/**@type {JSForm} */
		var tempForm = solutionModel.cloneForm(_tempFormName, solutionModel.getForm(_oriFormName))
		tempForm.getBodyPart().height = tempForm.getBodyPart().height + 20;
		
		if(_numCol * 2 == globals.stdColTimbr)
			tempForm.scrollbars = SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER;
		else
			tempForm.scrollbars = SM_SCROLLBAR.SCROLLBARS_WHEN_NEEDED;

		var fields = _soloCartolina ? tempForm.extendsForm.getFields() : tempForm.getFields();
		var fieldNo = fields.length != 0 ? Math.floor((fields.length - globals.stdColTimbr + 1) / 2) : 3;

		if (!attivo) 
		{
			for (var f = 0; f < fields.length; f++)
				fields[f].enabled = false;

			//abilita pulsanti di attivazione mese
			forms.intestaVistaMensile.elements.btn_attivamese.enabled = true;
			forms.intestaMostraTimbr.elements.btn_attivamese.enabled = true;
		} 
		else 
		{
			//disabilita pulsante di attivazione mese
			forms.intestaVistaMensile.elements.btn_attivamese.enabled = false;
			forms.intestaMostraTimbr.elements.btn_attivamese.enabled = false;
		}

		// Aggiungiamo i fields delle timbrature
		if (fieldNo < _numCol) 
		{
			var onRightClickMethod = _soloCartolina ? tempForm.getMethod('apriPopupCartolinaDipendente') : tempForm.getMethod('apriPopupMostraTimbr');
			var onRenderMethod = _soloCartolina ? tempForm.getMethod('onRenderTimbrCartolina') : tempForm.getMethod('onRenderTimbr');
			
			for (var i = fieldNo + 1; i <= _numCol; i++) 
			{
				tempForm.width = tempForm.width + 78;

				var newEntrata = tempForm.newField(null, JSField.TEXT_FIELD, 630, 0, 78, 15);
				newEntrata.dataProviderID = 'none';
				newEntrata.name = 'entrata_' + i;
				newEntrata.styleClass = 'table';
				newEntrata.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newEntrata.enabled = attivo;
				newEntrata.editable = false;
				newEntrata.onRightClick = onRightClickMethod;
				newEntrata.onRender = onRenderMethod;

				var newUscita = tempForm.newField(null, JSField.TEXT_FIELD, 630, 0, 78, 15);
				newUscita.dataProviderID = 'none';
				newUscita.name = 'uscita_' + i;
				newUscita.styleClass = 'table';
				newUscita.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newUscita.enabled = attivo
				newUscita.editable = false;
				newUscita.onRightClick = onRightClickMethod;
				newUscita.onRender = onRenderMethod;
			}
		}

		// Associamo alla form temporanea il datasource ottenuto in precedenza
		solutionModel.getForm(_tempFormName).dataSource = _dataSource;
		// Crea una nuova relazione per ogni timbratura in giornaliera
		for (var t = 0; t < _numCol * 2; t++) 
		{
			var timbrType;

			if (t % 2 === 0)
				timbrType = 'entrata_' + (Math.floor(t / 2) + 1)
			else
				timbrType = 'uscita_' + (Math.floor(t / 2) + 1)

			// Crea la relazione che lega le righe della giornaliera con le timbrature
			var relName = 'timbrature_to_e2timbrature_' + (timbrType + (t + 1));
			var timbrRel = solutionModel.getRelation(relName);

			//Se la relazione esite già conserviamola, altrimenti creiamone una nuova
			if (!timbrRel)
			{
				timbrRel = solutionModel.newRelation(relName,
					_dataSource,
					databaseManager.getTable(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE).getDataSource(),
					JSRelation.INNER_JOIN);

				timbrRel.newRelationItem(timbrType, '=', 'idtimbrature');
				timbrRel.allowCreationRelatedRecords = false;
				timbrRel.deleteRelatedRecords = false;
				timbrRel.allowParentDeleteWhenHavingRelatedRecords = true;
			}

			var timbrField = solutionModel.getForm(_tempFormName).getField(timbrType)
			if (timbrField) {
				timbrField.dataProviderID = timbrRel.name + '.timbratura_formattata'
                timbrField.toolTipText = '%%' + timbrRel.name +  '.timbratura_anomalia%%';
				timbrField.displaysTags = true;
			}
		}

		var giornoField = solutionModel.getForm(_tempFormName).getField('giorno_mese');
		giornoField.dataProviderID = 'giornomese';
		giornoField.toolTipText = '%%giorno%%' + ' - Fascia: ' + '%%fascia%%' + ' - ' + '%%descrizionefascia%%';
		giornoField.displaysTags = true;

		var nomeGiornoField = solutionModel.getForm(_tempFormName).getField('nome_giorno');
		nomeGiornoField.dataProviderID = 'nomegiorno';
		nomeGiornoField.toolTipText = '%%giorno%%' + ' - Fascia: ' + '%%fascia%%' + ' - ' + '%%descrizionefascia%%';
		nomeGiornoField.displaysTags = true;

		var fasciaField = solutionModel.getForm(_tempFormName).getField('fascia');
		fasciaField.dataProviderID = 'Fascia';
		fasciaField.toolTipText = '%%giorno%%' + ' - Fascia: ' + '%%fascia%%' + ' - ' + '%%descrizionefascia%%';
		fasciaField.displaysTags = true;

		solutionModel.getForm(_tempFormName).getField('turno').dataProviderID = 'Turno';
		solutionModel.getForm(_tempFormName).getField('id_giornaliera').dataProviderID = 'IdGiornaliera';
		
		// Aggiungi la form temporanea come tab del pannello contenitore
		tabFrm.elements.tab_main.addTab(_tempFormName, '', 'Timbrature', '', null, '#000000', '#BBCCEE', 1)
	}

	// Aggiorna la visualizzazione della intestazione
	forms.intestaMostraTimbr.aggiornaIntestazioni(_soloCartolina);
	
	forms[_tempFormName]['numeroTimbrature'] = _numCol;

	return true;
}

/**
 * Calcola il numero massimo assoluto di colonne necessarie al disegno delle timbrature per le date fornite.
 * <p>
 * Il razionale è il seguente: ad ogni timbratura è assegnato un numero di colonna, secondo l'ordinamento delle
 * timbrature nel giorno, utilizzato per legare le entrate alle uscite immediatamente successive 
 * (uscita.colonna = entrata.colonna + 1) e viceversa le uscite alle entrate immediatamente precedenti 
 * (entrata.colonna = uscita.colonna - 1), qualora presenti; queste costituiscono le timbrature correttamente 
 * accoppiate, mentre le timbrature non legate sono spaiate.<br/>
 * A queste ultime sono quindi assegnate due colonne nel computo del numero necessario per il disegno, per tener 
 * conto della timbratura mancante, mentre quelle appaiate sono contate una sola volta.
 * </p>
 * 
 * @param idlavoratore
 * @param dal
 * @param al
 * 
 * 
 * @return {Number} il massimo numero di colonne sufficiente a disegnare tutte le coppie (appaiate e non) di timbrature
 *
 * @properties={typeid:24,uuid:"D92F9050-7CAD-405E-B617-89515509D837"}
 */
function numeroMaxColonneTimbrature(idlavoratore, dal, al)
{
	var sqlQuery = "SELECT TOP 1 \
						SUM(CASE WHEN TRight.column_number IS NULL THEN 2 ELSE 1 END) AS NumeroColonne \
					FROM \
					( \
						SELECT \
							  CASE WHEN SensoCambiato = 1 THEN 1 - Senso ELSE Senso END AS senso_finale \
							, ROW_NUMBER() OVER (PARTITION BY GiornoNum ORDER BY Timbratura) - 1 AS column_number \
							, GiornoNum AS giorno \
						FROM \
							dbo.F_Gio_Lav_TimbraturePeriodo(?, ?, ?) \
					) TLeft \
					LEFT OUTER JOIN \
					( \
						SELECT \
							  CASE WHEN SensoCambiato = 1 THEN 1 - Senso ELSE Senso END AS senso_finale \
							, ROW_NUMBER() OVER (PARTITION BY GiornoNum ORDER BY Timbratura) - 1 AS column_number \
							, GiornoNum AS giorno \
						FROM \
							dbo.F_Gio_Lav_TimbraturePeriodo(? ,? ,?) \
					) TRight \
						ON  TRight.giorno = TLeft.giorno \
						AND TRight.senso_finale = 1 - TLeft.senso_finale \
						AND \
						( \
							(TLeft.senso_finale = 0 AND TRight.column_number = TLeft.column_number + 1) \
							OR \
							(TLeft.senso_finale = 1 AND TRight.column_number = TLeft.column_number - 1) \
						) \
					GROUP BY \
						TLeft.giorno \
					ORDER BY \
						NumeroColonne DESC \
					;";
	
	var dalInt   = parseInt(utils.dateFormat(dal, globals.ISO_DATEFORMAT));
	var alInt    = parseInt(utils.dateFormat(al, globals.ISO_DATEFORMAT));
    var args     = [
					  idlavoratore
					, dalInt
					, alInt
					, idlavoratore
					, dalInt
					, alInt
				   ];
 var dataset = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlQuery, args, -1);

 return dataset && dataset.getValue(1,1);

}


/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CB70CE64-F804-4EF1-AE57-270F9D9E1576"}
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);

    plugins.busy.prepare();
	
	var params = {
        processFunction: process_prepara_timbrature,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : controller.getName(),
        fontType: 'Arial,4,25',
        processArgs: []
    };
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"F1EAADC3-11B1-423A-971D-7BE260105BC8"}
 */
function process_prepara_timbrature()
{
	try
	{
		//il cliente non visualizza la gestione delle fasce orarie mentre la sede sì
		if(globals.getTipoConnessione() == globals.Connessione.CLIENTE)
		   forms.giorn_mostra_timbr.elements.btn_fasce_orarie.visible = false;
	
		var frm = forms.svy_nav_fr_openTabs;
		globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].selected_tab = 3;
		
		forms.giorn_header.preparaGiornaliera(null,null,null,true);
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_timbrature : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"283E4771-40E7-481B-B3DF-76289BEA6E36"}
 */
function onActionBtnApriFasce(event) 
{
	forms.giorn_mostra_timbr_fascia_forzata.apriVisualizzaFasceOrarieGiorno(event);
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
 * @properties={typeid:24,uuid:"3C744AD6-215C-42FC-AD89-EEF30B5588A6"}
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
 * @properties={typeid:24,uuid:"28577260-6DA6-420F-BB59-0B1AD0003DA8"}
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
 * @properties={typeid:24,uuid:"12ED863E-8230-40E5-BF21-AAAA9D2A207E"}
 */
function onDataChangeEventi(oldValue, newValue, event)
{
	aggiornaRiepilogoEventi(foundset);
	return true;
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param fs_giornaliera
 *
 * @properties={typeid:24,uuid:"1418F65A-CBB8-4CCA-AD10-A8872A925145"}
 */
function aggiornaRiepilogoEventi(fs_giornaliera)
{
	/**
	 * Aggiorna il riepilogo degli eventi
	 */
	if(!show_events && fs_giornaliera.e2giornaliera_to_e2giornalieraeventi && fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.find())
	{
		fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.idevento = '^';
		fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.search();
	}
	else if(show_events && fs_giornaliera.e2giornaliera_to_e2giornalieraeventi)
		fs_giornaliera.e2giornaliera_to_e2giornalieraeventi.loadAllRecords();
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param fs_giornaliera
 *
 * @properties={typeid:24,uuid:"770B0254-7F42-4EF5-940D-1D74E6208847"}
 */
function aggiornaRiepilogoTimbratureCausalizzate(fs_giornaliera)
{
	/**
	 * Aggiorna le timbrature causalizzate
	 */
	if(!show_causalized && fs_giornaliera.e2giornaliera_to_e2timbratureservizio && fs_giornaliera.e2giornaliera_to_e2timbratureservizio.find())
	{
		fs_giornaliera.e2giornaliera_to_e2timbratureservizio.ide2timbratureservizio = '^';
		fs_giornaliera.e2giornaliera_to_e2timbratureservizio.search();
	}
	else if(show_causalized && fs_giornaliera.e2giornaliera_to_e2timbratureservizio)
		fs_giornaliera.e2giornaliera_to_e2timbratureservizio.loadAllRecords();
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param fs_giornaliera
 *
 * @properties={typeid:24,uuid:"D75FBEC0-C86C-4C25-A17A-51BA134DCD9D"}
 */
function aggiornaRiepilogoTimbrature(fs_giornaliera)
{
	/**
	 * Aggiorna le timbrature del giorno
	 */
	if(fs_giornaliera.e2giornaliera_to_e2timbratura && fs_giornaliera.e2giornaliera_to_e2timbratura.find())
	{
		if(!show_clockings)
			fs_giornaliera.e2giornaliera_to_e2timbratura.idtimbrature = '^';
		else
			fs_giornaliera.e2giornaliera_to_e2timbratura.timbeliminata = 0;
		
		if(fs_giornaliera.e2giornaliera_to_e2timbratura.search() > 0)
			fs_giornaliera.e2giornaliera_to_e2timbratura.sort('timbratura asc'); //forziamo il sort per ordinare eventuali timbrature inserite manualmente	    	
	}
}

/**
 * Visualizza il valore effettivo del badge per il giorno selezionato (standard, sostitutivo, occasionale)
 * 
 * @param [fs_giornaliera]
 *
 * @properties={typeid:24,uuid:"85191599-BA6F-46A8-8ECF-4B6AAFF78EA9"}
 */
function aggiornaBadgeEffettivo(fs_giornaliera)
{
	/**
     * Aggiorna il badge effettivo del giorno
     */
    if(fs_giornaliera 
    		&& fs_giornaliera.e2giornaliera_to_e2timbratura 
			&& fs_giornaliera.e2giornaliera_to_e2timbratura.nr_badge != null)
    {
	   forms.giorn_header._vNrBadge = 
	   forms.giorn_cart_header._vNrBadge = fs_giornaliera.e2giornaliera_to_e2timbratura.nr_badge;
    }
    else if(fs_giornaliera)
    {
    	forms.giorn_header._vNrBadge = 
         	forms.giorn_cart_header._vNrBadge = 	
         		globals.getNrBadge(fs_giornaliera.iddip, fs_giornaliera.giorno);
    }
    else
    	forms.giorn_header._vNrBadge = 
    		forms.giorn_cart_header._vNrBadge = 	
    			globals.getNrBadge(forms.giorn_header.idlavoratore ? forms.giorn_header.idlavoratore : forms.giorn_cart_header.idlavoratore, globals.TODAY);
}

/**
 * @AllowToRunInFind
 * 
 * Aggiorna le informazioni aggiuntive del giorno selezionato in giornaliera
 * 
 * @param {Number} idGiornaliera
 *
 * @properties={typeid:24,uuid:"1ADC53D8-AA62-4CC3-BB93-3C518FB135F8"}
 */
function aggiornaRiepiloghiGiorno(idGiornaliera)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>} */
	var fs_giornaliera = foundset;
	fs_giornaliera.loadRecords(idGiornaliera);
	
	aggiornaRiepilogoTimbrature(fs_giornaliera);
	aggiornaRiepilogoTimbratureCausalizzate(fs_giornaliera);
	aggiornaRiepilogoEventi(fs_giornaliera);
    aggiornaRiepilogoTimbratureGiornata(idGiornaliera);	
}

/**  
 * Calcola la somma delle ore lavorate nella giornata sulla base delle timbrature
 * e ne disegna il riepilogo
 * 
 * @param {Number} idGiornaliera
 * 
 * @properties={typeid:24,uuid:"FDBB7502-7FA7-4A0C-8C27-C31A8D911E1E"}
 * @SuppressWarnings(unused)
 */
function aggiornaRiepilogoTimbratureGiornata(idGiornaliera){
	
	var _trFormName = 'giorn_mostra_timbr_riepilogo_tbl'
	var _trFormNameTemp = 'giorn_mostra_timbr_riepilogo_tbl_temp'
	var _idDip = forms.giorn_header.foundset.idlavoratore ? forms.giorn_header.foundset.idlavoratore 
			                                                : forms.giorn_cart_header.idlavoratore;
    
	try
	{
		var _giorno = globals.getGiornoDaIdGiornaliera(idGiornaliera);
	    var _anno = _giorno.getFullYear();
	    var _mese = _giorno.getMonth() + 1;
		var _gg = 10000 * _anno + 100 * _mese + _giorno.getDate(); 
	    var _ggPrec ;
		if(_giorno != 1)
			_ggPrec = _gg - 1;
		else{
			if(_mese == 1)
			   _ggPrec = 10000 * (_anno - 1) + 100 * 12 + 31;
			else
			   _ggPrec = 10000 * _anno + 100 * (_mese - 1) + globals.getTotGiorniMese(_mese-1,_anno); 
			
		}
		
		var _timbrQuery = " SELECT * FROM E2Timbratura \
							WHERE \
								(idDip = ?)	AND (LEFT(Timbratura, 8) = ?) AND (TimbEliminata = 0) AND (GGSucc = 1) \
							OR \
								(idDip = ?)	AND (LEFT(Timbratura, 8) = ?) AND (TimbEliminata = 0) AND (GGSucc = 0) \
							ORDER BY \
								Timbratura";
								
	    var _timbrArr = [_idDip, _ggPrec, _idDip, _gg]
	    
		var _trDataSetTimbrGiorno = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _timbrQuery, _timbrArr, -1)
	
		var arrCurrGiorno = new Array()
		var _arInd = -1
		var _trSenso = false
		var _trSensoPrec = false
		var _trSensoCamb = false
	
		/** @type {Number}*/
		var _trTimbrPrec = -1
		/** @type {Number}*/
		var _trTimbr = -1
		/** @type {String}*/
		var _timbrPrec = ''
		/** @type {String}*/
		var _timbr = ''
		/** @type {String}*/
		var _timbrOreMin = ''
		/** @type {Object} */
		var _objOre 
		/** @type {Number} */
		var _minuti
		/** @type {String} */
		var delta = '0000'
		/** @type {String} */
		var totOrario = '0000'
	
		
		for (var i = 1; i <= _trDataSetTimbrGiorno.getMaxRowIndex(); i++) {
	
			_trTimbr = _trDataSetTimbrGiorno.getValue(i, 5)
			_trSenso = _trDataSetTimbrGiorno.getValue(i, 4)
			_trSensoCamb = _trDataSetTimbrGiorno.getValue(i, 7)
			_timbr = utils.stringLeft(utils.stringRight(_trTimbr.toString(), 4), 2) + ':' + utils.stringRight(utils.stringRight(_trTimbr.toString(), 4), 2)
			_objOre = globals.getOreEffettiveDaTimbr(_trTimbr.toString(),0)
			_minuti = globals.getMinDaTimbrFormattata(_trTimbr)
			_timbrOreMin = _objOre.ore + '.' + _minuti
			if (i > 1) {
	
				if ( (!_trDataSetTimbrGiorno.getValue(i - 1, 4) && !_trDataSetTimbrGiorno.getValue(i - 1, 7)) || (_trDataSetTimbrGiorno.getValue(i - 1, 4) && _trDataSetTimbrGiorno.getValue(i - 1, 7)))
					_trSensoPrec = 0
				else
					_trSensoPrec = 1
	
			}
	
			//timbratura in entrata
			if ( (!_trSenso && !_trSensoCamb) || (_trSenso && _trSensoCamb)) {
	
				arrCurrGiorno.push(new Array(3))
				_arInd = arrCurrGiorno.length - 1
				arrCurrGiorno[_arInd][0] = _timbrOreMin
				_timbrPrec = _timbrOreMin
				arrCurrGiorno[_arInd][1] = '--.--'
				arrCurrGiorno[_arInd][2] = '--.--'
	
				if (i > 1 && !_trSensoPrec)
					totOrario = '----'
			}
			//timbratura in uscita
			else {
				if (i == 1) {
	
					arrCurrGiorno.push(new Array(3))
					_arInd = arrCurrGiorno.length - 1
					arrCurrGiorno[_arInd][0] = '--.--'
					arrCurrGiorno[_arInd][1] = _timbrOreMin
					arrCurrGiorno[_arInd][2] = '--.--'
					totOrario = '----'
	
				} else {
					//la timbratura precedente era una entrata
					if (!_trSensoPrec) {
	
						arrCurrGiorno[_arInd][1] = _timbrOreMin
						delta = deltaOrario(_timbr, _timbrPrec)
						arrCurrGiorno[_arInd][2] = utils.stringLeft(delta, 2) + ':' + utils.stringRight(delta, 2)
						totOrario = totaleOrario(totOrario, delta)
					}
					//la timbratura precedente era un'altra uscita
					else {
						arrCurrGiorno.push(new Array(3))
						_arInd = arrCurrGiorno.length - 1
						arrCurrGiorno[_arInd][0] = '--.--'
						arrCurrGiorno[_arInd][1] = _timbrOreMin
						arrCurrGiorno[_arInd][2] = ''
						totOrario = '----'
					}
				}
			}
	
		}
	
		var _trDataSetTimbrRiep = databaseManager.createEmptyDataSet(0, new Array('Entrata', 'Uscita', 'Totale'))
	
		//arrCurrGiorno.push(new Array('', '', utils.stringLeft(totOrario,2) + ':' + utils.stringRight(totOrario,2)))
		forms.giorn_mostra_timbr_riepilogo.elements.lbl_mostra_timbr_riep_totale.text = utils.stringLeft(totOrario, 2) + ' Ore - ' + utils.stringRight(totOrario, 2) + ' Minuti'
	
		for (var tr = 0; tr < arrCurrGiorno.length; tr++) 
			_trDataSetTimbrRiep.addRow(tr + 1, arrCurrGiorno[tr])
	
		var _trDataSourceTimbrRiep = _trDataSetTimbrRiep.createDataSource('_trDataSetTimbrRiep', [JSColumn.TEXT, JSColumn.TEXT, JSColumn.TEXT])
	
		if (forms[_trFormNameTemp] == null) 
		{
			forms.giorn_mostra_timbr_riepilogo.elements.tab_timbr_riepilogo_tbl.removeAllTabs();
			history.removeForm(_trFormNameTemp);
			solutionModel.removeForm(_trFormNameTemp);
		
		    var tempForm = solutionModel.cloneForm(_trFormNameTemp, solutionModel.getForm(_trFormName))
		    solutionModel.getForm(_trFormNameTemp).dataSource = _trDataSourceTimbrRiep
		    solutionModel.getForm(_trFormNameTemp).getField('fld_entrata').dataProviderID = 'Entrata'
		    solutionModel.getForm(_trFormNameTemp).getField('fld_uscita').dataProviderID = 'Uscita'
		    solutionModel.getForm(_trFormNameTemp).getField('fld_totale').dataProviderID = 'Totale'
	
		    forms.giorn_mostra_timbr_riepilogo.elements.tab_timbr_riepilogo_tbl.addTab(_trFormNameTemp);
		}
	}
	catch(ex)
	{
		forms.giorn_mostra_timbr_riepilogo.elements.tab_timbr_riepilogo_tbl.removeAllTabs();
		history.removeForm(_trFormNameTemp);
		solutionModel.removeForm(_trFormNameTemp);
	}
	
}

/**
 * Calcola il delta dell'orario
 *
 * @param {String} _timbr
 * @param {String} _timbrPrec
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"363FA11A-E9AC-4A22-AA74-3E2678A7EEB8"}
 */
function deltaOrario(_timbr, _timbrPrec) {

	var tH,tM,tpH,tpM
	var deltaH = -1
	var deltaM = -1
	var dH = ''
	var dM = ''

	if (_timbr == '--.--' || _timbrPrec == '--.--')
	    return '----'
	
	tH = parseInt(utils.stringLeft(_timbr, 2), 10)
	tM = parseInt(utils.stringRight(_timbr, 2), 10)
	tpH = parseInt(utils.stringLeft(_timbrPrec, 2), 10)
	tpM = parseInt(utils.stringRight(_timbrPrec, 2), 10)
	
	
	if ( (tM - tpM) < 0) {

		tM = tM + 60
		tH = tH - 1
	}

	deltaH = (tH - tpH)
	deltaM = (tM - tpM)

	if (deltaH < 10)
		dH = '0' + deltaH.toString()
	else
		dH = deltaH.toString()

	if (deltaM < 10)
		dM = '0' + deltaM.toString()
	else
		dM = deltaM.toString()

	return dH + dM
	//return 'Ore : ' + deltaH.toString() + ' - Minuti : ' + deltaM.toString()
}

/**
*
* @param {String} _delta
* @param {String} _totOrPrec
*
* @return {String}
*
* @properties={typeid:24,uuid:"84CDFC6E-7BC5-4467-A8FC-148A52A7E4D9"}
*/
function totaleOrario(_totOrPrec, _delta) {

	if(_totOrPrec == '----')
		
		return '----'
	
	else{	
		
		var tH = parseInt(utils.stringLeft(_delta, 2), 10)
		var tM = parseInt(utils.stringRight(_delta, 2), 10)
		var tpH = parseInt(utils.stringLeft(_totOrPrec, 2), 10)
		var tpM = parseInt(utils.stringRight(_totOrPrec, 2), 10)
		var deltaH = -1
		var deltaM = -1
		var dH = ''
		var dM = ''

		if ( (tM + tpM) > 60) {

			tH = tH + 1
			tM = tM - 60
		}

		deltaH = (tH + tpH)
		deltaM = (tM + tpM)

		if (deltaH < 10)
			dH = '0' + deltaH.toString()
		else
			dH = deltaH.toString()

		if (deltaM < 10)
			dM = '0' + deltaM.toString()
		else
			dM = deltaM.toString()

		return dH + dM
	}
}