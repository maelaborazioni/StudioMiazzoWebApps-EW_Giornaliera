/**
 * @type {Array<Number>}
 *
 * @properties={typeid:35,uuid:"5BFF1F15-87D0-4807-A6BC-FB47AE223008",variableType:-4}
 */
var arrDipSquadrati = [];

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"81F6F9A1-445C-465B-91F1-648C941AC680",variableType:-4}
 */
var arrEventiFiltro = [];

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"72250B58-E0C6-47EA-9C1C-421A59853CA3"}
 */
var strEventiFiltro = ''; 
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"9BFEFBC2-0DD1-4FA7-B87F-A7D781B96FBF",variableType:8}
 */
var pages;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2D36EF95-28F4-459B-B156-8C56A38C84FA",variableType:4}
 */
var currPage = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B570AA72-8C83-4872-B373-5A70AD5C6E42",variableType:4}
 */
var dipPerPage = 10;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"353CCBF1-4ACD-4E42-81D7-501067EA2B21",variableType:8}
 */
var annoRif = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"2BB596B1-F02F-4833-8FB0-9D5F82891F22",variableType:8}
 */
var meseRif = null;

/**
 * @properties={typeid:35,uuid:"B43D9156-36F2-4EF3-8E7D-89B045E4E742",variableType:-4}
 */
var ggRif = null;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"05036F57-9D50-4DA6-89F2-4F4FB9F40455",variableType:93}
 */
var limitaDal = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"EC2ED641-66DA-4246-A8C8-DB4AE024F7C7",variableType:93}
 */
var limitaAl = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"AC29D0BF-8B61-4B2D-9126-15E5B79A4E01",variableType:4}
 */
var chkLimitaDal = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"08755072-4387-4F7B-9867-9FE27AF528B5",variableType:4}
 */
var chkLimitaAl = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8E281348-B784-475C-B3CE-F9D90BFF07B6",variableType:4}
 */
var vOptSquadratiDitta = 1;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"A22FE329-0C57-4CEF-98F9-6F07C3454172",variableType:-4}
 */
var daPannello = false;
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
 * @properties={typeid:24,uuid:"BE4194B8-EAA1-4765-8E71-8A0A7D5BB62B"}
 * @AllowToRunInFind
 */
function preparaSquadratureDitta(idDitta,anno,mese,limitaDalGiorno,limitaAlGiorno,arrDipFiltrati)
{
	// settaggio nome form contenitore
	var oriForm = forms.giorn_list_squadrati_ditta_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	   
    // recuperiamo gli id dei dipendenti aventi squadrature ed/o eventi da definire in giornaliera
	var dal = limitaDalGiorno ? limitaDalGiorno : new Date(anno, mese - 1,1);
    var al = limitaAlGiorno ? limitaAlGiorno : new Date(anno, mese - 1, globals.getTotGiorniMese(mese,anno)); 
    
    arrEventiFiltro = vOptSquadratiDitta == 1 ? globals.getEventiDaDefinire() : arrEventiFiltro;
    
    arrDipSquadrati = globals.ottieniArrayDipConSquadrature(idDitta, dal, al, vOptSquadratiDitta,arrEventiFiltro,arrDipFiltrati);

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
															  vOptSquadratiDitta,
															  arrEventiFiltro);
    	
    	tabHeight = 50 + dsSquadrature.getMaxRowIndex() * 20;
    	totHeight += tabHeight;
    	
    	// rimozione forms squadrature lavoratori
    	var squadrFormOri = forms.giorn_list_squadrati;
    	var squadrFormOriName = squadrFormOri.controller.getName();
    	var squadrFormName = squadrFormOriName + '_' + arrDipSquadrati[i];
    	    	
    	if(solutionModel.getForm(squadrFormName))
        {
        	history.removeForm(squadrFormName);
        	solutionModel.removeForm(squadrFormName);
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
        var giornFormPannOri = forms.giorn_list_squadrati_ditta_giorn_pannello;
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
        var decFormOri = forms.giorn_list_squadrati_ditta_dec;
    	var decFormOriName = decFormOri.controller.getName();
    	var decFormName = decFormOriName + '_' + arrDipSquadrati[i];
    	
    	if(solutionModel.getForm(decFormName))
        {
        	history.removeForm(decFormName);
        	solutionModel.removeForm(decFormName);
        }
    	
        var tabPanelSquadrDip = newForm.newTabPanel('tab_squadrati_ditta_tabpanel_' + arrDipSquadrati[i]
                                                   ,x
		                                           ,y
		                                           ,tabWidth
		                                           ,tabHeight);
        tabPanelSquadrDip.visible = true;
        tabPanelSquadrDip.transparent = true;
        tabPanelSquadrDip.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelSquadrDip.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST;

    	var dipForm = solutionModel.cloneForm(dipFormName
    	                                      ,solutionModel.getForm(dipFormOriName));
    	var presForm = solutionModel.cloneForm(giornFormPannName
                                               ,solutionModel.getForm(giornFormPannOriName));
//    	var giornForm = solutionModel.cloneForm(giornFormName
//                                                ,solutionModel.getForm(giornFormOriName));
        var decForm = solutionModel.cloneForm(decFormName
                                              ,solutionModel.getForm(decFormOriName));

    	var tabSquadrDipHeader = fs.codice + ' - ' + (globals.getTipologiaDitta(idDitta) == globals.Tipologia.ESTERNA ? 
    												  fs.lavoratori_to_lavoratori_personeesterne.nominativo : fs.lavoratori_to_persone.nominativo);
    	tabPanelSquadrDip.newTab('tab_squadrati_dip_' + arrDipSquadrati[i],tabSquadrDipHeader,dipForm);
    	var tabListPres = tabPanelSquadrDip.newTab('tab_pres_' + arrDipSquadrati[i],'Giornaliera',presForm);    	
    	tabListPres.toolTipText = 'Visualizza la giornaliera mensile del dipendente';
//    	var tabListGiorn = tabPanelSquadrDip.newTab('tab_giorn_' + arrDipSquadrati[i],'Giornaliera',giornForm);    	
//    	tabListGiorn.toolTipText = 'Vai alla giornaliera del dipendente';
    	var tabListDec = tabPanelSquadrDip.newTab('tab_dec_' + arrDipSquadrati[i],'Decorrenze',decForm);    	
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
 * @properties={typeid:24,uuid:"B9A68140-0B18-4F45-AE5F-CB5FFA92CFB8"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
	
	var frm = forms.svy_nav_fr_openTabs;
	var paramsObj = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]];
	annoRif = paramsObj['anno'];
	meseRif = paramsObj['mese'];
	limitaDal = paramsObj['dal'];
	limitaAl = paramsObj['al'];
	
	globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].selected_tab = 3;
	
	var params = {
        processFunction: process_prepara_squadrati_ditta,
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
                      ,paramsObj['dipendenti_filtrati']]
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
 * @properties={typeid:24,uuid:"53BC2A4B-7693-4E60-8194-8F456C6FF8FA"}
 */
function process_prepara_squadrati_ditta(idDitta,anno,mese,dal,al,arrDipFiltrati)
{
	try
	{
	    preparaSquadratureDitta(idDitta,
			                    anno,
								mese,
								dal, 
								al,
								arrDipFiltrati);
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_squadrati_ditta : ' + ex.message;
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
 * @properties={typeid:24,uuid:"F2ED5813-EBBC-4C43-BB72-94C007739537"}
 */
function onActionFirst(event)
{
	currPage = 1;
	
	var params = {
		processFunction: process_on_action,
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
 * @properties={typeid:24,uuid:"FE1A4D6A-00FA-4487-BA6A-7E8C3F2AF64A"}
 */
function process_on_action()
{
	try
	{
		preparaSquadratureDitta(idditta,
			                    annoRif,
								meseRif,
								chkLimitaDal && limitaDal ? limitaDal : null, 
								chkLimitaDal && limitaAl ? limitaAl : null);
	}
	catch(ex)
	{
		var msg = 'Metodo process_on_action : ' + ex.message;
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
 * @properties={typeid:24,uuid:"5B961E8C-33B3-4D20-92BC-17AE5F12B408"}
 */
function onActionLast(event) 
{
	currPage = pages; 
	
	var params = {
		processFunction: process_on_action,
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
 * @properties={typeid:24,uuid:"F617F824-823E-4F22-BDCF-3AAA7FA364B2"}
 */
function onActionPrev(event) 
{
	--currPage;
	
	var params = {
		processFunction: process_on_action,
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
 * @properties={typeid:24,uuid:"D4DBF897-1D94-4358-98E9-8B40D357A869"}
 */
function onActionNext(event)
{
	currPage++;
	
	var params = {
		processFunction: process_on_action,
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
 * @properties={typeid:24,uuid:"4D766E8F-F0E8-44CE-B892-0B6F8CF00E42"}
 */
function onDataChangePage(oldValue, newValue, event) {
	
	if(newValue > 0 && newValue <= pages)
	{
		onActionRefresh(event);
		return true;
	}
	
	return false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0DB29E75-D176-4469-96FE-0C307CB42864"}
 */
function onActionRefresh(event) 
{
	var params = {
		processFunction: process_refresh_squadrature,
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
 * @properties={typeid:24,uuid:"0B413CBA-B226-4008-AF8A-1302D59F346A"}
 */
function process_refresh_squadrature()
{
	try
	{
		refreshSquadratureDitta();
	}
	catch(ex)
	{
		var msg = 'Metodo process_refrsh_squadrature : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @properties={typeid:24,uuid:"55416BDD-3982-45CA-A817-2AA6573702C7"}
 */
function refreshSquadratureDitta()
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
			globals.ma_utl_showWarningDialog('Compilare entrambe i campi data.','Prepara squadrature ditta');
		    return;
		}
		else if(dal > al)
		{
			globals.ma_utl_showWarningDialog('La data di fine non può essere minore di quella di inizio.','Prepara squadrature ditta');
            return;	
		}
	}
	
	preparaSquadratureDitta(idDitta ? idDitta : idditta,annoRif,meseRif,dal,al,arrDipFiltrati && arrDipFiltrati.length ? arrDipFiltrati : null);
}

/**
 * @properties={typeid:24,uuid:"9A1D0323-B1C2-4151-9A25-BC299EFF4FDE"}
 */
function goToEditSquadratureDitta()
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * @properties={typeid:24,uuid:"0788B63F-B7E0-478B-824E-656189160164"}
 */
function goToBrowseSquadratureDitta()
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}


/**
 * Handle changed data.
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A5949F5F-882F-4124-89B3-7EF5322F711C"}
 */
function onDataChangeData(oldValue, newValue, event) 
{
	var frm = forms.svy_nav_fr_openTabs;
	if(frm.vSelectedTab != null 
			&& globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	{
		var inizioMese = new Date(annoRif,meseRif - 1,1);
		var fineMese = new Date(annoRif,meseRif - 1,globals.getTotGiorniMese(meseRif,annoRif));
		if(newValue < inizioMese || newValue > fineMese)
		    return false;
		
		if(event.getElementName() == 'fld_dal')
		    globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dal = newValue;
		else
			globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al = newValue;
	}
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
 * @properties={typeid:24,uuid:"0290D5C4-F53C-4213-A913-551572A9F1FB"}
 */
function onDataChangeOptSquadrature(oldValue, newValue, event) 
{
	newValue == 1 ? elements.lbl_nessuna_anomalia.text = 'Nessun evento da definire per la ditta nel periodo selezionato'
		            : elements.lbl_nessuna_anomalia.text = 'Nessuna giornata squadrata per la ditta nel periodo selezionato'
	return true
}
