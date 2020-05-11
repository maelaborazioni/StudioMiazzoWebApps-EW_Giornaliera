/**
 * @type {Number}
 * @properties={typeid:35,uuid:"13D3C992-8384-4E1D-AFB0-4750E475B44E",variableType:8}
 */
var iddip = null;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C7B54D55-C252-4F7D-83FC-7C9EC5F61B97"}
 */
var header = '';

/**
 * @type {JSDataSet}
 * 
 * @properties={typeid:35,uuid:"639D5325-DCA5-4152-845F-739C626FBF81",variableType:-4}
 */
var dsAnomalie = null;

/**
 * @properties={typeid:24,uuid:"566416F9-5DD8-4B46-8154-8511F254EB75"}
 */
function getButtonObject()
{
	var btnObj = _super.getButtonObject();

	btnObj.btn_new = { enabled: false };
	btnObj.btn_edit = { enabled: false };
	btnObj.btn_delete = { enabled: false };
	btnObj.btn_duplicate = { enabled: false };
	return btnObj;
}

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"099F8898-CC92-43CD-B4EC-53AB0D7BFC3E"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	
}


/**
 * @param {Number} idLavoratore
 * @param {Number} anno
 * @param {Number} mese
 * @param {Number} gg
 * @param {String} [formContenitore]
 * @param {Boolean} [forzaRidisegno]
 * @param {Boolean} [isEliminazione]
 * 
 * @properties={typeid:24,uuid:"65FE3856-D83A-4C03-8DC5-243E5368CB12"}
 * 
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function preparaAnomalieLavoratore(idLavoratore,anno,mese,gg,formContenitore,forzaRidisegno,isEliminazione)
{
	iddip = idLavoratore;
	
	var dal = new Date(anno,mese - 1,1);
	var al = new Date(anno,mese - 1,gg);
	
	// Numero di giorni con anomalie
	var numAnomalie = dsAnomalie.getMaxRowIndex();
		
	// Ottieni il dataset delle fasce orarie
    var _tDataSetFoa = globals.ottieniDataSetFasceOrarie(idLavoratore, dal, al);
    
    // Dataset delle timbrature corrispondenti alle anomalie su timbrature
	var dsTimbrMancanti = globals.ottieniDataSetAnomalieLavoratore(idLavoratore,
		                                                           utils.dateFormat(dal,globals.ISO_DATEFORMAT),
		                                                           utils.dateFormat(al,globals.ISO_DATEFORMAT),
																   dsAnomalie ? dsAnomalie.getColumnAsArray(1) : null);
	var numTimbrMancanti = dsTimbrMancanti.getMaxRowIndex();
			
	var arrCurrMese = new Array(numAnomalie);
	for(var c = 0; c < numAnomalie; c++)
	{
		arrCurrMese[c] = [];
		
		// Giorno del mese
        arrCurrMese[c][0] = utils.dateFormat(dsAnomalie.getValue(c+1,4),globals.EU_DATEFORMAT);
        
        // Nome del giorno
        arrCurrMese[c][1] = globals.getNomeGiorno(dsAnomalie.getValue(c+1,4));
	    
        //IdGiornaliera
        arrCurrMese[c][2] = null;
        
        //Anomalia
        arrCurrMese[c][3] = dsAnomalie.getValue(c+1,9);
	}
	
    // Variabili per la gestione della matrice
    /** @type {Number} */
    var idtimbr
    /** @type {Number} */
	var _tipoDiGiornata;
	/** type {Number} */
	var _fasciaOrAss;
    /** @type {Number} */
	var _codFasciaAss;
    /** @type {Number} */
    var lastGiorno;
    /** @type {Number} */
    var currGiorno;
    /** @type {Number} */
    var currMese;
    /** @type {Number} */
    var currAnno;
    /** @type {Number} */
	var lastTimbr;
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
	/** @type {Date} */
	var currTimbrDate;
	/** @type {Number} */
	var currTimbrSenso;
	/** @type {Number} */
	var currTimbrSensoPrec;
	/** @type {Boolean} */
	var currTimbrGGSucc;
	/** @type {Number} */
	var currTimbrGiorno;
	/** @type {Number}*/
	var currMinuti;
	/** @type {Number} */
	var _diff;
		
	currTimbrGiorno = null;
	currTimbrDate = null;
	currTimbrSenso = null;
    lastGiorno = null;
    lastTimbr = -1;
	lastTimbrX = -1;
	lastTimbrY = -1;
	maxTimbrPerRow = 6;	// la form supporta 3 coppie entrata/uscita di default
	
	var offset = 12;		// salta i campi aggiuntivi iniziali
			
    // Cicla sul foundset per ricostruire la matrice delle timbrature
    for (var row = 1; row <= numTimbrMancanti; row++)
    {
    	// Calcola giorno, mese ed anno per la riga corrente, a partire dal campo GiornoNum (yyyyMMdd)
    	currGiorno	= (Math.floor(dsTimbrMancanti.getValue(row, 12) % 100));
    	currMese	= (Math.floor(dsTimbrMancanti.getValue(row, 12) / 100) % 100);
    	currAnno	= (Math.floor(dsTimbrMancanti.getValue(row, 12) / 10000));
    	
    	var rowDate = new Date(currAnno, currMese - 1, currGiorno);
 	   		  
	   //valore della timbratura  
 	   currTimbrNum = dsTimbrMancanti.getValue(row,5);
 	   if(currTimbrNum)
 	   {
	       //timbratura in formato aaaaMMggoomm
	 	   currTimbr = currTimbrNum.toString();
	 	   
	 	   //idtimbratura
	       idtimbr = dsTimbrMancanti.getValue(row,1)
		   	 	   
		   //giorno della timbratura in formato aaaaMMgg
		   currTimbrGiorno = parseInt(utils.stringLeft(currTimbr,8),10);
		   
		   //senso della timbratura 
		   if((!dsTimbrMancanti.getValue(row,4) && !dsTimbrMancanti.getValue(row,7)) ||
				   (dsTimbrMancanti.getValue(row,4) && dsTimbrMancanti.getValue(row,7)))
			   currTimbrSenso = 0;
		   else 
			   currTimbrSenso = 1;
		   
		   //senso della timbratura precedente
		   if((!dsTimbrMancanti.getValue(row-1,4) && !dsTimbrMancanti.getValue(row-1,7)) ||
				     (dsTimbrMancanti.getValue(row-1,4) && dsTimbrMancanti.getValue(row-1,7)))
			   currTimbrSensoPrec = 0;
		   else 
			   currTimbrSensoPrec = 1;
		   			   
		   //competenza giorno successivo e aggiornamento per l'indice	   
		   currTimbrGGSucc = dsTimbrMancanti.getValue(row,10);
		   if(currTimbrGGSucc)
			   currGiorno++;
 	   }
 	   else
 	  	   idtimbr = null;
 	  	   
 	   if(currGiorno == lastGiorno)
	   {
		   //se ci sono due timbrature con lo stesso senso bisogna lasciare uno spazio
		   if(currTimbrSenso == currTimbrSensoPrec)
		   {
			  arrCurrMese[lastTimbrX][lastTimbrY] = null;
			  lastTimbrY++;
		   }
		   
		   arrCurrMese[lastTimbrX][lastTimbrY] = idtimbr;
	   }
	   // Nuova giornata
	   else
	   {
		   application.output(arrCurrMese);
		   
		   // L'indice per l'inserimento nell'array. 
		   // Salta fino al giorno corretto nel caso di giorni senza timbrature ma non ancora conteggiati (e quindi non presenti nel dataset)
		   do
		   {
			   lastTimbrX++; //currGiorno - 1;
		   }
		   while(utils.parseDate(arrCurrMese[lastTimbrX][0], globals.EU_DATEFORMAT) != rowDate)
			   
		   
		   // Salva le informazioni aggiuntive			   
		   var idGiornaliera = dsTimbrMancanti.getValue(row, 13);
		   arrCurrMese[lastTimbrX][2] = idGiornaliera;
		   
		   //Codice fascia
		   arrCurrMese[lastTimbrX][4] = _tDataSetFoa.getValue(currGiorno, 2);

		   //Codice turno
		   if(_tDataSetFoa.getValue(c + 1, 3) != null)
			   arrCurrMese[lastTimbrX][5] = _tDataSetFoa.getValue(currGiorno, 3);
		   else
			   arrCurrMese[lastTimbrX][5] = '';
		   
		   arrCurrMese[lastTimbrX][6] = _tDataSetFoa.getValue(currGiorno, 4);

		   var inizioOrario = _tDataSetFoa.getValue(currGiorno, 5);
		   arrCurrMese[lastTimbrX][7] = inizioOrario;
	        
		   var inizioPausa = _tDataSetFoa.getValue(currGiorno, 6);
		   arrCurrMese[lastTimbrX][8] = inizioPausa;
	        
	       var finePausa = _tDataSetFoa.getValue(currGiorno, 7);
	       arrCurrMese[lastTimbrX][9] = finePausa;
	        
	       var fineOrario = _tDataSetFoa.getValue(currGiorno, 8);
	       arrCurrMese[lastTimbrX][10] = fineOrario;
	        
	       var totOreFascia = _tDataSetFoa.getValue(lastTimbrX+1, 9);
	       arrCurrMese[lastTimbrX][11] = (totOreFascia/100).toFixed(2);
		   
		   //l'inserimento delle timbrature inizia dalla 3a cella da sx a meno che la prima timbratura presente sia un'uscita
		   lastTimbrY = offset;
		   if(currTimbrSenso == 1)
		   {
			   arrCurrMese[lastTimbrX][lastTimbrY] = null
			   lastTimbrY++;
		   }

		   arrCurrMese[lastTimbrX][lastTimbrY] = idtimbr
		   
		   lastGiorno = currGiorno;
		}
	
		lastTimbrY += 1;
		
		// Memorizza il massimo numero di timbrature prima di reimpostarle
		if((lastTimbrY - offset)  > maxTimbrPerRow)
		   maxTimbrPerRow = (lastTimbrY - offset);
		
    }
	    	   
	var cols = ['GiornoMese'
	            ,'NomeGiorno'
	            ,'IdGiornaliera'
				,'Anomalie'
				,'Fascia'
				,'Turno'
				,'DescrizioneFascia'
				,'InizioOrario'
				,'InizioPausa'
				,'FinePausa'
				,'FineOrario'
				,'TotOreFascia'
	           ];

    var types = [JSColumn.TEXT
		 ,JSColumn.TEXT
		 ,JSColumn.NUMBER
		 ,JSColumn.NUMBER
		 ,JSColumn.TEXT
		 ,JSColumn.TEXT
		 ,JSColumn.TEXT
		 ,JSColumn.NUMBER
		 ,JSColumn.NUMBER
		 ,JSColumn.NUMBER
		 ,JSColumn.NUMBER
		 ,JSColumn.NUMBER
		 ];
	
    var colTot = Math.ceil(maxTimbrPerRow / 2);
	
	// Aggiunta delle colonne per le timbrature
    for(var timbr = 0; timbr < colTot; timbr++)
	{
		// Aggiungi una coppia entrata uscita alle colonne del dataset
		cols.push('Entrata_' + (timbr + 1));
		cols.push('Uscita_' + (timbr + 1));
		// Aggiungi il tipo per la coppia appena creata
		types.push(JSColumn.INTEGER);
		types.push(JSColumn.INTEGER);
				
	}
	// Create the dataset to associate with the form
    var _tDataSetMostraTimbr = databaseManager.createEmptyDataSet(0, cols);
    for(var ar = 0; ar < arrCurrMese.length; ar++)
        _tDataSetMostraTimbr.addRow(ar+1, arrCurrMese[ar].map(function(item){ return item || null; }));
        
    var _tDataSourceMostraTimbr = _tDataSetMostraTimbr.createDataSource('_tDataSourceTimbrMancanti_' + idLavoratore + '_' + colTot, types); 
    
    // Disegna la tabella delle anomalie, aggiungendo le colonne se necessario
    disegnaAnomalieLavoratore(idLavoratore,colTot,_tDataSourceMostraTimbr,formContenitore,forzaRidisegno,isEliminazione);
}

/**
 * @param {Number} iddipendente
 * @param {Number} numCol
 * @param {String} datasource
 * @param {String} formContenitore
 * @param {Boolean} forzaRidisegno
 * @param {Boolean} [isEliminazione]
 * 
 * @properties={typeid:24,uuid:"1A697D97-421A-4185-9499-41B4C48CC67D"}
 * @SuppressWarnings(unused)
 */
function disegnaAnomalieLavoratore(iddipendente, numCol, datasource, formContenitore, forzaRidisegno, isEliminazione)
{
	var templateFormName = forms.giorn_timbr_cartolina_mancanti.controller.getName();
	var cloneFormName    = elements.tab_timbr_mancanti_dip.getTabFormNameAt(1);
	var tabFormName      = formContenitore ? forms[formContenitore] : controller.getName();
	var currFieldNo      = 3;
	var sel_index        = 1;
	
	if(forms[cloneFormName])
	{
		currFieldNo = Math.floor((solutionModel.getForm(cloneFormName).getFields().length - globals.stdColTimbr + 1) / 2);
		sel_index = forms[cloneFormName].foundset.getSelectedIndex();
	}
	
	if(!forms[cloneFormName] || forzaRidisegno || currFieldNo != numCol)
	{
		elements.tab_timbr_mancanti_dip.removeTabAt(1);
		
		if(forms[cloneFormName])
		{		
			history.removeForm(cloneFormName);
			solutionModel.removeForm(cloneFormName);
		}
	
		var cloneForm = solutionModel.cloneForm(templateFormName + application.getUUID(), solutionModel.getForm(templateFormName));
	
		var fields  = cloneForm.getFields();
		var fieldNo = Math.floor((fields.length - globals.stdColTimbr + 1) / 2);
		
		// Aggiungiamo i fields delle timbrature
		if (fieldNo < numCol) 
		{
			var tabSeq = fieldNo
			for (var i = fieldNo + 1; i <= numCol; i++)
			{
				cloneForm.width = cloneForm.width + 160;

				var newEntrata = cloneForm.newField(null, JSField.TEXT_FIELD, cloneForm.width - 200, 20, 80, 20);
				newEntrata.dataProviderID = 'none';
				newEntrata.name = 'entrata_' + i;
				newEntrata.styleClass = 'table';
				newEntrata.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newEntrata.enabled = true;
				newEntrata.editable = true;
				newEntrata.format = "##.##|mask";
				newEntrata.onRightClick = cloneForm.getMethod('apriPopupMostraTimbr');
                newEntrata.onDataChange = cloneForm.getMethod('onDataChangeTimbratura');
                newEntrata.onRender = cloneForm.getMethod('onRenderTimbrMancanti');
				
                var newUscita = cloneForm.newField(null, JSField.TEXT_FIELD, cloneForm.width - 120, 20, 80, 20);
				newUscita.dataProviderID = 'none';
				newUscita.name = 'uscita_' + i;
				newUscita.styleClass = 'table';
				newUscita.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newUscita.enabled = true;
				newUscita.editable = true;
				newUscita.format = "##.##|mask"
				newUscita.onRightClick = cloneForm.getMethod('apriPopupMostraTimbr');
				newUscita.onDataChange = cloneForm.getMethod('onDataChangeTimbratura');
				newUscita.onRender = cloneForm.getMethod('onRenderTimbrMancanti');
				
				var newLblEntrata = cloneForm.newLabel('Entrata',cloneForm.width - 200,0,80,20);
				newLblEntrata.name = 'lbl_entrata_' + i;
				newLblEntrata.styleClass = 'table_header';
				newLblEntrata.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newLblEntrata.verticalAlignment = SM_ALIGNMENT.CENTER;
				newLblEntrata.labelFor = newEntrata.name;
				newLblEntrata.transparent = false;
				
				var newLblUscita = cloneForm.newLabel('Uscita',cloneForm.width - 120,0,80,20);
				newLblUscita.name = 'lbl_uscita_' + i;
				newLblUscita.styleClass = 'table_header';
				newLblUscita.horizontalAlignment = SM_ALIGNMENT.CENTER;
				newLblUscita.verticalAlignment = SM_ALIGNMENT.CENTER;
				newLblUscita.labelFor = newUscita.name;
				newLblUscita.transparent = false;
				
				cloneForm.getLabel('btn_ripristino').x += 160;
				cloneForm.getLabel('btn_causalizzate').x += 160;
				cloneForm.getLabel('lbl_btn_ripristino').x += 160;
				cloneForm.getLabel('lbl_causalizzate').x += 160;
			}
		}
				
		// Associamo alla form temporanea il datasource ottenuto in precedenza
		cloneForm.dataSource = datasource;
		// Crea una nuova relazione per ogni timbratura in giornaliera
		for (var t = 0; t < numCol * 2; t++)
		{
			var timbrType

			if (t % 2 === 0)
				timbrType = 'entrata_' + (Math.floor(t / 2) + 1)
			else
				timbrType = 'uscita_' + (Math.floor(t / 2) + 1)

			// Crea la relazione che lega le righe della giornaliera con le timbrature
			var relName = 'timbrature_to_e2timbrature_' + timbrType;
			var timbrRel = solutionModel.getRelation(relName);

			//Se la relazione esite già conserviamola, altrimenti creiamone una nuova
			if (!timbrRel)
			{
				timbrRel = solutionModel.newRelation
				(
					relName,
					datasource,
					databaseManager.getTable(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE).getDataSource(),
					JSRelation.INNER_JOIN
				);

				timbrRel.newRelationItem(timbrType, '=', 'idtimbrature');
				timbrRel.allowCreationRelatedRecords = false;
				timbrRel.deleteRelatedRecords = false;
				timbrRel.allowParentDeleteWhenHavingRelatedRecords = true;
			}

			var timbrField = cloneForm.getField(timbrType);
			if (timbrField) 
			{
				timbrField.dataProviderID = timbrRel.name + '.timbratura_hhmm_number';
				timbrField.format = '00.00|mask';
                timbrField.displaysTags = true;
			}
		}
		
		var giornoField = cloneForm.getField('giorno_mese');
			giornoField.dataProviderID = 'giornomese';
			giornoField.toolTipText = '%%giornomese%%' + ' - Fascia: ' + '%%fascia%%' + ' - ' + '%%descrizionefascia%%';
			giornoField.displaysTags = true;

		var nomeGiornoField = cloneForm.getField('nome_giorno');
			nomeGiornoField.dataProviderID = 'nomegiorno';
			nomeGiornoField.toolTipText = '%%giornomese%%' + ' - Orario Previsto: ' + '%%totorefascia%%' + ' ore';
			nomeGiornoField.displaysTags = true;
		
		var fasciaField = cloneForm.getField('fascia');
			fasciaField.dataProviderID = 'fascia';
			fasciaField.toolTipText = '%%fascia%%' + ' - ' + '%%descrizionefascia%%';
			fasciaField.displaysTags = true;
			
		elements.tab_timbr_mancanti_dip.addTab(cloneForm.name);
		
		forms[cloneForm.name]['iddipendente'] = iddipendente;
		forms[cloneForm.name].foundset.setSelectedIndex(sel_index);
	}
	
	return true;	
}