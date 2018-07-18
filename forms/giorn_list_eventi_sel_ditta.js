
/**
 * @properties={typeid:24,uuid:"2E32ECAB-7080-4711-A558-17222D235916"}
 */
function goToEditSquadratureDitta() 
{
	elements.btn_lkp_eventi.enabled = true;
	return _super.goToEditSquadratureDitta();
}

/**
 * @properties={typeid:24,uuid:"678B20CA-AD00-4A20-8A37-3F29B45C4A9F"}
 */
function goToBrowseSquadratureDitta()
{
	elements.btn_lkp_eventi.enabled = false;
	return _super.goToBrowseSquadratureDitta();
}

/**
 * Filtra gli eventi selezionabili per il filtro
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"BEBA69D1-6ED0-4380-8A68-91E6AD4641AD"}
 */
function FiltraEventiPeriodo(_fs)
{
	var _ftrEv = 'SELECT * FROM F_Gio_ElencoEventiPeriodo(?,?,?,?)';
	var _arrEv = new Array();
	    _arrEv.push(idditta);
	    _arrEv.push(limitaDal && chkLimitaDal ? limitaDal : new Date(annoRif,meseRif - 1,1));
		_arrEv.push(limitaAl && chkLimitaAl ? limitaAl : new Date(annoRif,meseRif - 1,globals.getTotGiorniMese(meseRif,annoRif)));
		_arrEv.push(globals.TipoGiornaliera.NORMALE);
		
	var _dsEv = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_ftrEv,_arrEv,-1);

	_fs.addFoundSetFilterParam('idevento','IN',_dsEv.getColumnAsArray(1),'ftr_elencoEventiPeriodo');

	return _fs;
	
}


/**
 * Aggiorna la visualizzazione degli eventi selezionati per il filtro
 * 
 * @param {Array<JSRecord<db:/ma_presenze/e2eventi>>} _recs
 *
 * @properties={typeid:24,uuid:"CA906054-777D-4BA5-AF3E-7ECD103D0FD4"}
 */
function AggiornaEventiPeriodo(_recs)
{
	strEventiFiltro = '';
	arrEventiFiltro = [];
	
	if(_recs)
	{
		for(var recIndex = 0; recIndex < _recs.length; recIndex++)
		{
			arrEventiFiltro.push(_recs[recIndex].idevento);
			strEventiFiltro += _recs[recIndex].evento + ' - ' + _recs[recIndex].descriz + '\n';
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F41D225F-9A4C-4121-928E-3464FB082C11"}
 */
function onActionLkpEventiFiltro(event)
{
	// TODO visualizzazione e selezione degli eventi da filtrare
	var params = {
		event : event,
		lookup : 'LEAF_Lkp_Eventi',
		methodToAddFoundsetFilter : 'FiltraEventiPeriodo',
		allowInBrowse : true,
		multiSelect : true,
		methodToExecuteAfterMultipleSelection : 'AggiornaEventiPeriodo',
		returnFullRecords : true
	};
	
	globals.ma_utl_showLkpWindow(params);
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2AC044AE-DDB0-4892-83A4-226CA02D11CC"}
 */
function onActionRefresh(event) 
{
	var params = {
		processFunction: process_refresh_eventi_selezionati,
		message: '',
		opacity: 0.5,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"9461A74A-3088-4DB0-A599-5830DDA883B3"}
 */
function process_refresh_eventi_selezionati()
{
	try
	{
		refreshEventiSelezionati();
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh_eventi_selezionati : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @properties={typeid:24,uuid:"02AA1ADF-5F5A-42B4-8B3E-D02795B0CEBA"}
 */
function refreshEventiSelezionati()
{
	var frm = forms.svy_nav_fr_openTabs;
	if (frm.vSelectedTab != null && globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	{
		var idDitta = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].idditta;
		var arrDipFiltrati = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dipendenti_filtrati;
//		forms.pann_header_dtl.foundset.loadRecords(idDitta);
		limitaDal = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dal;
		limitaAl = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al;
	    meseRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
	    annoRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno;
	}	
	
	var dal = chkLimitaDal && limitaDal ? limitaDal : new Date(annoRif,meseRif - 1,1);
	var al = chkLimitaDal && limitaAl ? limitaAl : new Date(annoRif,meseRif - 1,globals.getTotGiorniMese(meseRif,annoRif));
	
	if(chkLimitaDal)
	{
		if(dal == null || al == null)
		{	
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('Compilare entrambe i campi data.','Prepara eventi selezionati ditta');
		    return;
		}
		else if(dal > al)
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('La data di fine non può essere minore di quella di inizio.','Prepara eventi selezionati ditta');
            return;	
		}
	}
	
	if(arrEventiFiltro == null	|| arrEventiFiltro.length == 0)
	{
		plugins.busy.unblock();
		globals.ma_utl_showWarningDialog('Nessun evento su cui filtrare selezionato.','Prepara eventi selezionati ditta');
		return;
	}
	 
	preparaEventiDitta(idDitta ? idDitta : idditta,annoRif,meseRif,dal,al,arrDipFiltrati && arrDipFiltrati.length ? arrDipFiltrati : null);

}

/**
 * Recupera i dati sulle squadrature della ditta nel periodo selezionato
 * e ne costruisce la visualizzazione 
 * 
 * @param {Number} idDitta
 * @param {Number} anno
 * @param {Number} mese
 * @param {Date} limitaDalGiorno
 * @param {Date} limitaAlGiorno
 * @param {Array<Number>} [arrDipFiltrati]
 * 
 * @properties={typeid:24,uuid:"C3564929-F4C8-469E-84EB-546AC6BAF069"}
 * @AllowToRunInFind
 */
function preparaEventiDitta(idDitta,anno,mese,limitaDalGiorno,limitaAlGiorno,arrDipFiltrati)
{
	// settaggio nome form contenitore
	var oriForm = forms.giorn_list_squadrati_ditta_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	   
    // recuperiamo gli id dei dipendenti aventi squadrature ed/o eventi da definire in giornaliera
	var dal = limitaDalGiorno ? limitaDalGiorno : new Date(anno, mese - 1,1);
    var al = limitaAlGiorno ? limitaAlGiorno : new Date(anno, mese - 1, globals.getTotGiorniMese(mese,anno)); 
    arrDipSquadrati = globals.ottieniArrayDipConSquadrature(idDitta, dal, al, 3, arrEventiFiltro, arrDipFiltrati);

    // rimozione di tabpanels precedenti
    elements.tab_squadrati_ditta.removeAllTabs();
    elements.tab_squadrati_ditta.transparent = false;
    
    // nel caso di un numero di lavoratori con anomalie inferiore od uguale al numero di dipendenti
    // visualizzabili in una singola pagina
	if(arrDipSquadrati.length <= dipPerPage)
	{
		elements.btn_last.visible = 
    	elements.btn_next.visible = 
    	elements.btn_first.visible = 
    	elements.btn_prev.visible = 
    	elements.fld_curr_page.visible = 
    	elements.lbl_pagina_di.visible = 
    	elements.lbl_totale_pagine.visible = false;
    	
		// se addirittura non vi sono lavoratori con anomalie
		if(arrDipSquadrati.length == 0)
		{
			elements.tab_squadrati_ditta.transparent = true;
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
    pages = Math.ceil(arrDipSquadrati.length / dipPerPage);
    
    // per gestire eventuali refresh in cui il nuovo numero di pagine è minore di quello della precedente visualizzazione  
    if(pages < currPage)
    	currPage = pages >= 1 ? pages : 1;	
		
    // l'ultima pagina potrebbe avere meno dei dipendenti per pagina classici
    currPage == pages ? arrDipSquadrati.length - (currPage - 1) * dipPerPage : dipPerPage;
    
    var x=0;
    var y=0;
    var tabWidth = 640;
    var tabHeight = 135;
    var totHeight = 0;
        
    // rimozione eventuali form anomalie ditta con lo stesso nome esistenti
    if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }

    // codice gestione pulsanti delle pagine    
    elements.btn_last.enabled = true;
	elements.btn_next.enabled = true;
	elements.btn_first.enabled = true;
	elements.btn_prev.enabled = true;
	
    // se non vi sono dipendenti con squadrature nel periodo selezionato
	if(arrDipSquadrati.length == 0)
	{
    	elements.tab_squadrati_ditta.transparent = true;
    	return;
	}
	
    // creazione della nuova form dinamica 
    var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
    
    var currIndex = (currPage - 1) * dipPerPage;
    var maxIndex = Math.min(currPage * dipPerPage,arrDipSquadrati.length);
    
    for (var i = currIndex; i < maxIndex; i++)
    {
    	/** @type {JSFoundSet<db:/ma_anagrafiche/lavoratori>} */
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
    	if(fs.find())
    	{
    		fs.idlavoratore = arrDipSquadrati[i];
    		fs.search();
    	}
    	
    	// Dataset dei giorni nei quali sono presenti squadrature
    	var dsSquadrature = globals.ottieniDataSetSquadrature(arrDipSquadrati[i],
    		                                                  dal,
															  al,
															  3,
															  arrEventiFiltro);
    	
    	tabHeight = 50 + dsSquadrature.getMaxRowIndex() * 20;
    	totHeight += tabHeight;
    	
    	// rimozione forms squadrature lavoratori
    	var evFormOri = forms.giorn_list_squadrati;
    	var evFormOriName = evFormOri.controller.getName();
    	var evFormName = evFormOriName + '_' + arrDipSquadrati[i];
    	    	
    	if(solutionModel.getForm(evFormName))
        {
        	history.removeForm(evFormName);
        	solutionModel.removeForm(evFormName);
        }
    	
        // rimozione forms lavoratori con squadrature
        var dipFormOri = forms.giorn_list_squadrati_dipendente;
    	var dipFormOriName = dipFormOri.controller.getName();
    	var dipFormName = dipFormOriName + '_' + arrDipSquadrati[i];
    	
    	if(solutionModel.getForm(dipFormName))
        {
        	forms[dipFormName].elements.tab_squadrati_dip.removeAllTabs();
        	history.removeForm(dipFormName);
        	solutionModel.removeForm(dipFormName);
        }
    	
        // rimozione forms visualizza presenze lavoratore
        var giornFormPannOri = forms.giorn_list_eventi_sel_ditta_giorn_pannello;
    	var giornFormPannOriName = giornFormPannOri.controller.getName();
    	var giornFormPannName = giornFormPannOriName + '_' + arrDipSquadrati[i];
    	
    	if(solutionModel.getForm(giornFormPannName))
        {
        	history.removeForm(giornFormPannName);
        	solutionModel.removeForm(giornFormPannName);
        }
        
        // rimozione forms apri giornaliera lavoratori con squadrature
//        var giornFormOri = forms.giorn_list_squadrati_ditta_giorn;
//    	var giornFormOriName = giornFormOri.controller.getName();
//    	var giornFormName = giornFormOriName + '_' + arrDipSquadrati[i];
//    	
//    	if(solutionModel.getForm(giornFormName))
//        {
//        	history.removeForm(giornFormName);
//        	solutionModel.removeForm(giornFormName);
//        }
    	 
        // rimozione forms apri decorrenza lavoratori con anomalie
        var decFormOri = forms.giorn_list_eventi_sel_ditta_dec;
    	var decFormOriName = decFormOri.controller.getName();
    	var decFormName = decFormOriName + '_' + arrDipSquadrati[i];
    	
    	if(solutionModel.getForm(decFormName))
        {
        	history.removeForm(decFormName);
        	solutionModel.removeForm(decFormName);
        }
    	
        var tabPanelEvDip = newForm.newTabPanel('tab_ev_ditta_tabpanel_' + arrDipSquadrati[i]
                                                 ,x
	                                             ,y
		                                         ,tabWidth
		                                         ,tabHeight);
        tabPanelEvDip.visible = true;
        tabPanelEvDip.transparent = true;
        tabPanelEvDip.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelEvDip.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST;

    	var dipForm = solutionModel.cloneForm(dipFormName
    	                                      ,solutionModel.getForm(dipFormOriName));
    	var presForm = solutionModel.cloneForm(giornFormPannName
                                               ,solutionModel.getForm(giornFormPannOriName));
        var decForm = solutionModel.cloneForm(decFormName
                                              ,solutionModel.getForm(decFormOriName));

    	var tabEvDipHeader = fs.codice + ' - ' + (globals.getTipologiaDitta(idDitta) == globals.Tipologia.ESTERNA ? 
    											  fs.lavoratori_to_lavoratori_personeesterne.nominativo : fs.lavoratori_to_persone.nominativo);
    	tabPanelEvDip.newTab('tab_squadrati_dip_' + arrDipSquadrati[i],tabEvDipHeader,dipForm);
    	var tabListPres = tabPanelEvDip.newTab('tab_pres_' + arrDipSquadrati[i],'Giornaliera',presForm);    	
    	tabListPres.toolTipText = 'Visualizza la giornaliera mensile del dipendente';
    	var tabListDec = tabPanelEvDip.newTab('tab_dec_' + arrDipSquadrati[i],'Decorrenze',decForm);    	
    	tabListDec.toolTipText = 'Vai alla gestione decorrenze del dipendente';
    	
 	   	y += tabHeight;									  
    	 	   	
 	    if(dsSquadrature.getMaxRowIndex() == 0)
 	    	continue;
 	    	
 	   /** @type {Number}*/
	   	var idLavoratore = arrDipSquadrati[i];
	   	var currFrmName = 'giorn_list_squadrati_dipendente_' + idLavoratore;
	   	/** @type {Form<giorn_list_squadrati_dipendente>} */
	   	var currFrm = forms[currFrmName];
	 	    currFrm.dsSquadrature = dsSquadrature;
	 	    currFrm.preparaSquadratureLavoratore(idLavoratore,anno,mese,currFrmName);
	 	    
    }
    
    solutionModel.getForm(newFormName).getBodyPart().height = totHeight;//tabHeight * arrDipSquadrati.length;
    
    elements.tab_squadrati_ditta.addTab(newFormName,newFormName);
    
//  gestione delle pagine    
    if(currPage == pages)
    {
    	elements.btn_last.enabled = false;
    	elements.btn_next.enabled = false;
    }
    if(currPage == 1)
    {
    	elements.btn_first.enabled = false;
    	elements.btn_prev.enabled = false;
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
 * @properties={typeid:24,uuid:"D06E89C3-9DF4-4D79-B57B-0874BC97F782"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
	
	var frm = forms.svy_nav_fr_openTabs;
	var objParams = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]];
	annoRif = objParams['anno'];
	meseRif = objParams['mese'];
	limitaDal = objParams['dal'];
	limitaAl = objParams['al'];
	
	globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].selected_tab = 4;
	
	var params = {
        processFunction: process_prepara_eventi_ditta,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [idditta
                      ,annoRif
					  ,meseRif
					  ,chkLimitaDal && limitaDal ? limitaDal : new Date(annoRif, meseRif - 1,1)
					  ,chkLimitaAl && limitaAl ? limitaAl : new Date(annoRif, meseRif - 1, globals.getTotGiorniMese(meseRif,annoRif))
                      ,objParams['dipendenti_filtrati']
                      ]
    };
	plugins.busy.block(params);
}

/**
 * @param idDitta
 * @param anno
 * @param mese
 * @param dal
 * @param al
 * @param arrDipFiltrati
 *
 * @properties={typeid:24,uuid:"B70C9364-065C-45A8-AC6E-4F2E6A1D63A6"}
 */
function process_prepara_eventi_ditta(idDitta,anno,mese,dal,al,arrDipFiltrati)
{
	try
	{
	    preparaEventiDitta(idDitta
	    	               ,anno
						   ,mese
						   ,dal
						   ,al
						   ,arrDipFiltrati);
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_eventi_ditta : ' + ex.message;
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
 * @properties={typeid:24,uuid:"345657C8-35AF-4D23-B886-F98D36A683AA"}
 */
function onActionFirst(event)
{
	currPage = 1;
	
	var params = {
		processFunction: process_eventi_ditta,
		message: '',
		opacity: 0.5,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"9A48BAB1-25DA-4B96-8799-965E3890FA85"}
 */
function process_eventi_ditta()
{
	try
	{
		preparaEventiDitta(idditta,
		                    annoRif,
							meseRif,
							chkLimitaDal && limitaDal ? limitaDal : null, 
							chkLimitaDal && limitaAl ? limitaAl : null);

	}
	catch(ex)
	{
		var msg = 'Metodo process_eventi_ditta : ' + ex.message;
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
 * @properties={typeid:24,uuid:"AAA7EBC9-5404-4A1C-924B-A1734C752ED4"}
 */
function onActionLast(event) 
{
	currPage = pages; 
	
	var params = {
		processFunction: process_eventi_ditta,
		message: '',
		opacity: 0.5,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1542B57D-E064-44CD-A4A6-5CB97E38C18A"}
 */
function onActionPrev(event) 
{
	--currPage;
	
	var params = {
		processFunction: process_eventi_ditta,
		message: '',
		opacity: 0.5,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"50EF2FC6-19BA-4848-9CD9-43FDF8C97B41"}
 */
function onActionNext(event)
{
	currPage++;
		
	var params = {
		processFunction: process_eventi_ditta,
		message: '',
		opacity: 0.5,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: []
	};
	plugins.busy.block(params);
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
 * @properties={typeid:24,uuid:"F58B3297-D825-4DFF-9A00-A69EF3A00896"}
 */
function onDataChangePage(oldValue, newValue, event) {
	
	if(newValue > 0 && newValue <= pages)
	{
		var params = {
			processFunction: process_eventi_ditta,
			message: '',
			opacity: 0.5,
			paneColor: '#434343',
			textColor: '#EC1C24',
			showCancelButton: false,
			cancelButtonText: '',
			dialogName: 'This is the dialog',
			fontType: 'Arial,4,25',
			processArgs: []
		};
		plugins.busy.block(params);
		return true;
	}
	
	return false;
}
