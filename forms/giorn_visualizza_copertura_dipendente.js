/**
 * Prepara la struttura riepilogativa della giornaliera per la visualizzazione 
 * dei dati relativi alle presenze del lavoratore nel periodo richiesto
 *  
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 * @param {Array} [righeEvProp]
 *
 * @properties={typeid:24,uuid:"3A46ECD6-BC0D-4DF7-9395-14D4973745B2"}
 */
function preparaGiornalieraLavoratore(idLavoratore,dal,al,righeEvProp)
{
    // Numero giorni totali visualizzati in giornaliera	
	var numGiorni = Math.floor((al - dal)/86400000) + 1;
    
	// Array per gestione dati
	var types = [JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT];
	var cols = ['idevento','evento','proprieta','descrizione'];
	
	// Costruzione struttura tipi e colonne della matrice
	for(var col = 0; col < numGiorni; col++)
	{
		types.push(JSColumn.NUMBER);
		cols.push('giorno_' + globals.dateFormat(new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + col),globals.ISO_DATEFORMAT));
	}
	
	// Aggiunta colonna totali
	types.push(JSColumn.NUMBER);
	cols.push('totale');
	
	// array per il riepilogo coppie (evento,proprieta)
    var arrRigheEvProp = [];
    
    if(righeEvProp)
    	arrRigheEvProp = righeEvProp;
    else
    {
	    var datasetRigheGiorn = globals.ottieniDataSetRighe(idLavoratore,
	    	                                                utils.dateFormat(dal,globals.ISO_DATEFORMAT),
															utils.dateFormat(al,globals.ISO_DATEFORMAT));
	
	   // Calcola il numero di colonne per ogni tipo di evento (caso peggiore)
	   for(var r = 1; r <= datasetRigheGiorn.getMaxRowIndex(); r++)
	   {
	        var arrRigaEvProp = [datasetRigheGiorn.getValue(r,1),
	                             datasetRigheGiorn.getValue(r,2)];
	        if(datasetRigheGiorn.getValue(r,1) != null)
	           arrRigheEvProp.push(arrRigaEvProp);
	   }
    }
	
	// Creazione matrice giornaliera
    var dsCurrMese = databaseManager.createEmptyDataSet(arrRigheEvProp.length,cols);
	
    if(arrRigheEvProp.length == 0)
    {
    	forms['giorn_visualizza_copertura_dipendente_' + idLavoratore].elements.tab_visualizza_copertura_dip.transparent = true;
	    return;
    }
    else
    	forms['giorn_visualizza_copertura_dipendente_' + idLavoratore].elements.tab_visualizza_copertura_dip.transparent = false;
       
    // Compilazione iniziale matrice giornaliera
    for(var rg = 0; rg < arrRigheEvProp.length; rg++)
    {
    	dsCurrMese.setValue(rg + 1,1,arrRigheEvProp[rg][0]);
    	dsCurrMese.setValue(rg + 1,2,globals.getCodiceEvento(arrRigheEvProp[rg][0]));
    	dsCurrMese.setValue(rg + 1,3,arrRigheEvProp[rg][1]);
    	dsCurrMese.setValue(rg + 1,4,globals.getDescrizioneEvento(arrRigheEvProp[rg][0]));
    	
    	for(col = 1; col <= (numGiorni + 1); col++)
    		dsCurrMese.setValue(rg + 1,4 + col,null);
    		
    }	
    
    // Ottenimento dati giornaliera
    var datasetGiornaliera = globals.ottieniDataSetGiornaliera(idLavoratore,dal,al,globals.TipoGiornaliera.NORMALE);
    var colTot = dsCurrMese.getMaxColumnIndex();
    for(var row = 1; row <= datasetGiornaliera.getMaxRowIndex(); row++)
	{
		for(rg = 1; rg <= dsCurrMese.getMaxRowIndex(); rg++)
		{			
			if(dsCurrMese.getValue(rg,1) == datasetGiornaliera.getValue(row,9)
				&& dsCurrMese.getValue(rg,3) == datasetGiornaliera.getValue(row,10))
			{
				var gg = datasetGiornaliera.getValue(row,3);
				var colIndex = Math.floor((gg - dal)/86400000) + 1;
				//dsCurrMese.setValue(rg,4 + colIndex,datasetGiornaliera.getValue(row,37)); // idgiornaliera
				dsCurrMese.setValue(rg,4 + colIndex,datasetGiornaliera.getValue(row,11) / 100);
			    dsCurrMese.setValue(rg,colTot,dsCurrMese.getValue(rg,colTot) + dsCurrMese.getValue(rg,4 + colIndex));
			}
		}
	}
		
	/** @type {String}*/
	var dSGiorn = dsCurrMese.createDataSource('dSGiorn_' + idLavoratore + '_Dal' + utils.dateFormat(dal,globals.ISO_DATEFORMAT) +
		                                      'Al_' + utils.dateFormat(al,globals.ISO_DATEFORMAT) + '_' + arrRigheEvProp.length,types);
		
	disegnaGiornalieraLavoratore(idLavoratore,dal,al,dSGiorn);
}

/**
 * Gestisce il disegno della giornaliera riepilogativa per il lavoratore nel periodo richiesto
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 * @param {String} datasource
 *
 * @properties={typeid:24,uuid:"D440706F-7929-4758-B61D-F294FECECF57"}
 */
function disegnaGiornalieraLavoratore(idLavoratore,dal,al,datasource)
{
	var numGiorni = Math.floor((al - dal)/86400000) + 1;
	
	// creazione della form dinamica base da clonare per il disegno degli eventi
    var newFormGiornName = 'giorn_list_visualizza_copertura_' + idLavoratore;
        
    if(solutionModel.getForm(newFormGiornName))
    {
    	elements.tab_visualizza_copertura_dip.removeAllTabs();
    	history.removeForm(newFormGiornName);
    	solutionModel.removeForm(newFormGiornName);
    }
    
	var newFormGiorn = solutionModel.newForm(newFormGiornName,datasource,'leaf_style_table',false,640,100);
    newFormGiorn.view = JSForm.LOCKED_TABLE_VIEW;
    newFormGiorn.dataSource = datasource;
    
    var dxDesc = 150;
    var dxCod = 60;
    var dxProp = 50;
    var dxEv = 45;
    var dy = 20;
    
    var newCod = newFormGiorn.newField('evento',JSColumn.TEXT,0,dy,dxCod,dy);
	    newCod.name = 'fld_cod';
	    newCod.displayType = JSField.TEXT_FIELD;
	    newCod.styleClass = 'table';
	    newCod.horizontalAlignment = SM_ALIGNMENT.CENTER;
	    newCod.editable = false;
    var newLblCod = newFormGiorn.newLabel('lbl_evento',0,0,dxCod,dy);
        newLblCod.labelFor = newCod.name;
        newLblCod.styleClass = 'table_header';
        newLblCod.text = 'Evento';     
	    newLblCod.horizontalAlignment = SM_ALIGNMENT.CENTER;
        
    var newDesc = newFormGiorn.newField('descrizione',JSColumn.TEXT,dxCod,dy,dxDesc,dy);
        newDesc.name = 'fld_desc';
        newDesc.displayType = JSField.TEXT_FIELD;
        newDesc.styleClass = 'table';
        newDesc.editable = false;
    var newLblDesc = newFormGiorn.newLabel('lbl_descrizione',dxCod,0,dxDesc,dy);
        newLblDesc.labelFor = newDesc.name;
        newLblDesc.styleClass = 'table_header';
        newLblDesc.text = 'Descrizione';
        newLblDesc.horizontalAlignment = SM_ALIGNMENT.CENTER;
        
    var newProp = newFormGiorn.newField('proprieta',JSColumn.TEXT,dxCod + dxDesc,dy,dxProp,dy);
        newProp.name = 'fld_prop';
        newProp.displayType = JSField.TEXT_FIELD;
        newProp.styleClass = 'table';
        newProp.horizontalAlignment = SM_ALIGNMENT.CENTER;
        newProp.editable = false;
    var newLblProp = newFormGiorn.newLabel('lbl_proprieta',dxCod + dxDesc,0,dxProp,dy);
	    newLblProp.labelFor = newProp.name;
	    newLblProp.styleClass = 'table_header';
	    newLblProp.text = 'Prop.';
	    newLblProp.horizontalAlignment = SM_ALIGNMENT.CENTER;
        
    for(var g = 1; g <= numGiorni; g++)
    {
    	var gDay = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + (g - 1));
    	var gFormat = globals.dateFormat(gDay,globals.ISO_DATEFORMAT);
    	var strTimbr = globals.getTimbratureGiornoStr(idLavoratore,gDay);
    	var strTimbrCaus = scopes.giornaliera.haTimbratureCausalizzate(globals.getDitta(idLavoratore)) ? globals.getTimbratureServizioGiornoStr(idLavoratore,gDay) : '';
    	
    	var newFld = newFormGiorn.newField('giorno_' + gFormat,JSColumn.NUMBER,dxCod + dxDesc + dxProp + dxEv * (g - 1),0,dxEv,20);
    	    newFld.name = 'fld_giorno_' + gFormat;
    	    newFld.displayType = JSField.TEXT_FIELD;
    	    newFld.styleClass = 'table';
    	    newFld.horizontalAlignment = SM_ALIGNMENT.CENTER;
    	    newFld.editable = false;
    	    newFld.toolTipText = 'Riepilogo timbrature : \n' + strTimbr + (strTimbrCaus != '' ? '\n\nRiepilogo causalizzate : \n' + strTimbrCaus : '');
//    	    newFld.onRightClick = solutionModel.getGlobalMethod('globals','apriPopupRiepiloghiPresenze');
    	var newLbl = newFormGiorn.newLabel('lbl_giorno_' + gFormat,dxCod + dxDesc + dxProp + dxEv * (g - 1),0,dxEv,20);
	    	newLbl.labelFor = newFld.name;
	    	newLbl.styleClass = 'table_header';
	    	newLbl.text = globals.getNomeGiorno(gDay) + ' ' + globals.getNumGiorno(gDay);
	    	newLbl.horizontalAlignment = SM_ALIGNMENT.CENTER;
    }
    
    var newTotale = newFormGiorn.newField('totale',JSColumn.TEXT,dxCod + dxDesc + dxProp + dxEv * numGiorni,dy,dxProp,dy);
	    newTotale.name = 'fld_totale';
	    newTotale.displayType = JSField.TEXT_FIELD;
	    newTotale.styleClass = 'table';
	    newTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
	    newTotale.fontType = 'Arial,1,11';
	    newTotale.editable = false;
    var newLblTotale = newFormGiorn.newLabel('lbl_totale',dxCod + dxDesc,0,dxProp,dy);
	    newLblTotale.labelFor = newTotale.name;
	    newLblTotale.styleClass = 'table_header';
	    newLblTotale.text = 'Totale';
	    newLblTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
    
	    forms['giorn_visualizza_copertura_dipendente_' + idLavoratore].elements.tab_visualizza_copertura_dip.addTab(newFormGiornName);
}