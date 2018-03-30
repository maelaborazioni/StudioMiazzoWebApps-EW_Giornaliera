/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"3C1BC6E6-388E-4791-84F5-779BC81A745E",variableType:8}
 */
var vIdLavoratore = null; 

/**
 * Aggiorna il foundset in memoria in seguito alla selezione della fascia oraria
 * 
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"C560268D-5AB9-45A4-9AC8-C5F670CB7B44"}
 */
function AggiornaFasciaProgTurni(rec)
{
	// impostazione flag di editing sulla form generale 
	forms.giorn_prog_turni_fasce.isEditing = true;
	
	// aggiornamento dati foundset temporaneo
    var formName = 'giorn_turni_temp';
    var fs = forms[formName].foundset;
    var selRec = fs.getSelectedRecord();
    selRec['idfasciaorariaprog'] = rec['idfasciaoraria'];
    selRec['modificato'] = 1;
    selRec['codicefascia'] = rec['codicefascia'];
    selRec['descrizione'] = rec['descrizione'];
    selRec['totaleorefascia'] = rec['totaleorefascia'];
    selRec['descrizionemostrata'] = selRec['codicefascia'] + ' - ' + selRec['descrizione'] + 
                                    ' (Ore fascia : ' + (selRec['totaleorefascia'] / 100).toFixed(2) + ')';

    // update visualizzazione                                
    globals.verificaProgrammazioneTurniOrePeriodo(fs.duplicateFoundSet());                                     
    globals.aggiornaFasceProgrammazioneTurni();
    globals.disegnaProgrammazioneTurni(fs.getDataSource());                                
}

/**
 * Aggiorna il foundset in memoria in seguito alla selezione del tipo di turno
 * 
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"77924FAB-8CF9-462C-B5B4-704C06B9594F"}
 */
function AggiornaTipoRiposoTurni(rec)
{
	// impostazione flag di editing sulla form generale 
	forms.giorn_prog_turni_fasce.isEditing = true;
	
	// aggiornamento dati foundset temporaneo
	var formName = 'giorn_turni_temp';
    var fs = forms[formName].foundset;
    var selRec = fs.getSelectedRecord();
    selRec['modificato'] = 1;
    selRec['tiporiposoprog'] = selRec['tiporiposovisualizzato'] = rec['codice'];
    
    // update visualizzazione
    globals.verificaProgrammazioneTurniOrePeriodo(fs.duplicateFoundSet());                                     
    globals.aggiornaFasceProgrammazioneTurni();
    globals.disegnaProgrammazioneTurni(fs.getDataSource());
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"763AC1DE-1174-4AFC-AEA6-B26A92400233"}
 */
function onRenderProgTurni(event) 
{
//	var recInd = event.getRecordIndex();
	var recRen = event.getRenderable();
	var recCol = event.getRecord();
	
//	var currColor = recRen.bgcolor;
	
	if(recCol != null)
	{
		switch (recCol['nomegiorno'])
		{
			case 'SA':
				//caso giorno = sabato
				if(!event.isRecordSelected())
		        	recRen.bgcolor = '#DADADA';
		        break;

		    case 'DO':
		    	//caso giorno = domenica, in realtà dovrebbe dipendere dalla fascia oraria
				if(!event.isRecordSelected())
	                recRen.bgcolor = '#BABDB9';
		        break;
	   }
			   
	   if(recCol['festivo'])
	   {
			if(!event.isRecordSelected())
				recRen.bgcolor = '#AAAAAA';	// darker than sat/sun
	       
	       recRen.fgcolor = '#FFFFFF';	// white
	   }
	   
	}
}


/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F1B051C2-0155-4BCC-9961-C78097856E54"}
 */
function onShow(firstShow, event) 
{
	elements.fascia_prog.readOnly = true;
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
 * @private
 *
 * @properties={typeid:24,uuid:"37D3BBE6-DC36-4B21-A35F-32071137FA07"}
 * @AllowToRunInFind
 */
function onDataChangeFascia(oldValue, newValue, event)
{
	if(newValue != oldValue)
	{
		// aggiornamento dati foundset temporaneo
		var formName = 'giorn_turni_temp';
	    var fs = forms[formName].foundset;
	    var selIndex = fs.getSelectedIndex();
	    var selRec = fs.getSelectedRecord();
	    
	    // impostazione flag di editing sulla form generale 
		forms.giorn_prog_turni_fasce.isEditing = true;
		selRec['idfasciaorariaprog'] = newValue;
		selRec['modificato'] = 1;
		selRec['totaleorefascia'] = globals.getTotaleOreFascia(newValue);
						
	    // update visualizzazione
	    globals.verificaProgrammazioneTurniOrePeriodo(fs.duplicateFoundSet());                                     
	    globals.disegnaProgrammazioneTurni(fs.getDataSource());
	    
	    controller.setSelectedIndex(selIndex + 1);
	    controller.setSelectedIndex(selIndex);
	}
	
	return true;
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
 * @private
 *
 * @properties={typeid:24,uuid:"E32CA4F4-6148-4F98-B4A1-66462AB63FF9"}
 */
function onDataChangeRiposo(oldValue, newValue, event) 
{
	if(newValue != oldValue)
	{
	   // impostazione flag di editing sulla form generale 
	   forms.giorn_prog_turni_fasce.isEditing = true;
	
	   // aggiornamento dati foundset temporaneo
	   var formName = 'giorn_turni_temp';
       var fs = forms[formName].foundset;
       var selIndex = fs.getSelectedIndex();
       var selRec = fs.getSelectedRecord();
       
       if(newValue != 0 && selRec['totaleorefascia'] > 0)
       {
    	   globals.ma_utl_showWarningDialog('Non è possibile associare un riposo primario o secondario per la fascia indicata','Tipo di riposo');
    	   selRec['tiporiposovisualizzato'] = oldValue;
       }
       else
       {
    	   selRec['modificato'] = 1;
           selRec['tiporiposoprog'] = selRec['tiporiposovisualizzato'] = newValue;
        
           // update visualizzazione
           globals.verificaProgrammazioneTurniOrePeriodo(fs.duplicateFoundSet());                                     
           globals.disegnaProgrammazioneTurni(fs.getDataSource());    	 
           
           controller.setSelectedIndex(selIndex + 1);
   	       controller.setSelectedIndex(selIndex);
       }
       
	}
	
	return true;
}


/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1C007642-6D52-4B03-AC77-47410D9F6ECB"}
 * @AllowToRunInFind
 */
function onRecordSelection(event) 
{
	// controllo aggiunto perchè nell'onRender viene scatenato l'onRecordSelection, anche in un caso non corrispondente a nessun records
	if(event.getSource()['_sv_rowid'] == null)
		return;
	
	// verifica di tutte le regole attive per il dipendente nel periodo considerato 
	var arrRegolePeriodo = [];
	for(var g = 1; g <= foundset.getSize(); g++)
	{
		var idRegola = foundset.getRecord(g)['idregole'];
		if(arrRegolePeriodo.indexOf(idRegola) == -1)
		   arrRegolePeriodo.push(idRegola);
	}
	
	/** @type {JSFoundset<db:/ma_presenze/e2regolefasceammesse>}*/
	var fsAmmesse = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.REGOLE_FASCE_AMMESSE);
	if(fsAmmesse.find())
	{
		fsAmmesse.idregole = arrRegolePeriodo;//foundset.getSelectedRecord()['idregole'];
		fsAmmesse.search();
	}
	var arrAmmesse = globals.foundsetToArray(fsAmmesse,'idfasciaoraria');
	
	var sqlFasceOrarie = "SELECT idFasciaOraria,CodiceFascia + ' - ' + CAST(Descrizione AS varchar)\
					      FROM E2FO_FasceOrarie WHERE idDitta = ?\
					      AND idFasciaOraria IN (" + arrAmmesse.map(function(fa){return fa}).join(',') +  ")\
					      ORDER BY CodiceFascia";
	var idDitta = globals.getDitta(globals.getIdLavoratoreProgTurni() || forms.giorn_prog_turni_dip.idlavoratore);
	var arrFasceOrarie = [(globals.getTipologiaDitta(idDitta) != globals.Tipologia.STANDARD 
			              && globals.getTipoDittaEsterna(idDitta) == 0) ? globals.getDittaRiferimento(idDitta) : idDitta ];
	var dsFasceOrarie = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,
														  sqlFasceOrarie,
														  arrFasceOrarie,
														  -1);
	var realValues = new Array();
	var displayValues = new Array();

	if (dsFasceOrarie && dsFasceOrarie.getMaxRowIndex() > 0) {
		realValues[0] = -1;
		displayValues[0] = '';

		realValues = realValues.concat(dsFasceOrarie.getColumnAsArray(1));
		displayValues = displayValues.concat(dsFasceOrarie.getColumnAsArray(2));

	}
	//else
	//{
	//elements.error.text = i18n.getI18NMessage('ma.sec.lbl.no_group_for_user');
	//vGroup = null;
	//}

	application.setValueListItems('vls_fasce_orarie', displayValues, realValues);
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C5BC30D0-99FA-429D-9254-CAB36D6EA747"}
 */
function onRenderBloccoRiga(event) 
{
	var _rec = event.getRecord();
	if (_rec && _rec['anomalia'] == 0)
		event.getRenderable().bgcolor = globals.Colors.UNACTIVE.background;
	else
		event.getRenderable().bgcolor = globals.Colors.SELECTED.background;
	
	event.getRenderable().fgcolor = globals.Colors.SELECTED.foreground;
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0AE5E3E1-5AA1-4386-921E-2A6C2343F3B4"}
 */
function onRenderRegola(event) {
	event.getRenderable().bgcolor = globals.Colors.UNACTIVE.background;
	event.getRenderable().fgcolor = globals.Colors.SELECTED.foreground;
}
