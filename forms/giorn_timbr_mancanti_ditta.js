/**
 * @type {Array<Number>}
 *
 * @properties={typeid:35,uuid:"9FF2DB3F-CDD6-4F12-A4F5-7C31B896A645",variableType:-4}
 */
var arrDipAnomalie = [];

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2A88FDA4-105A-4EB4-BE96-7A67E3BED61B",variableType:8}
 */
var pages;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"6E60C672-361F-4140-BB4A-D890E21F8D84",variableType:4}
 */
var currPage = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"34A42FE4-9E79-44ED-AE66-088D73A7F52D",variableType:4}
 */
var dipPerPage = 10;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"DE8946E1-7782-4259-86CE-854903CA89BF",variableType:8}
 */
var annoRif = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E5B8707D-9676-448D-8F85-C329BB73E923",variableType:8}
 */
var meseRif = null;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"5656C903-D945-40D8-B2E6-B5FB56B2CEC3",variableType:93}
 */
var ggRif = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A9CB2582-EC77-40A3-BA3B-9B43D41F4E2F",variableType:4}
 */
var tipoAnomalie = 0;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"E26E2B3B-0DE6-4A68-BA93-CE1159C23FF3",variableType:93}
 */
var limitaAl = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EFFFD39F-82CF-4868-9355-4C6EA4DAAFA1",variableType:4}
 */
var chkLimitaAl = 0;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"264DE09B-B694-4484-87FD-5F51E344579E",variableType:-4}
 */
var daPannello = false;

/**
 * @properties={typeid:24,uuid:"0DE1D628-E0C8-45D7-BE7E-332E58BA3083"}
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
 * @param {Number} _idDitta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Date}   _limitaAlGiorno
 * @param {Array<Number>} [arrDipFiltrati]
 *  
 * @properties={typeid:24,uuid:"19162263-42A9-4326-ACA5-6D908DF70BFC"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function preparaAnomalieDitta(_idDitta,_anno,_mese,_limitaAlGiorno,arrDipFiltrati)
{
	// settaggio nome form contenitore
	var oriForm = forms.giorn_timbr_mancanti_ditta_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	   
    // recuperiamo gli id dei dipendenti con anomalie nelle timbrature
    var dal = new Date(_anno, _mese - 1,1);
    var al = _limitaAlGiorno;
     
    // considerare i diversi casi di tipologia anomalie	                    
    arrDipAnomalie = globals.ottieniArrayDipConAnomalie(_idDitta,
    	                                                dal,
    												    al,
														arrDipFiltrati);
    
    if(arrDipAnomalie == null)
    {
    	// visualizzazione messaggio errore foundset (il medesimo di getGiorniSelezionati)... chiudere e riaprire il tab 
    	globals.ma_utl_showWarningDialog('Errore durante il recupero dei dati, si consiglia di chiudere e riaprire il tab','Anomalie su timbrature ditta');
    	return;
    }
    
    // rimozione di tabpanels precedenti
    elements.tab_timbr_mancanti_ditta.removeAllTabs();
    elements.tab_timbr_mancanti_ditta.transparent = false;
    
    // nel caso di un numero di lavoratori con anomalie inferiore od uguale al numero di dipendenti
    // visualizzabili in una singola pagina
	if(arrDipAnomalie.length <= dipPerPage)
	{
		elements.btn_last.visible = 
    	elements.btn_next.visible = 
    	elements.btn_first.visible = 
    	elements.btn_prev.visible = 
    	elements.fld_curr_page.visible = 
    	elements.lbl_pagina_di.visible = 
    	elements.lbl_totale_pagine.visible = false;
    	
		// se addirittura non vi sono lavoratori con anomalie
		if(arrDipAnomalie.length == 0)
		{
			elements.tab_timbr_mancanti_ditta.transparent = true;
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
    pages = Math.ceil(arrDipAnomalie.length / dipPerPage);
    
    // per gestire eventuali refresh in cui il nuovo numero di pagine è minore di quello della precedente visualizzazione  
    if(pages < currPage)
    	currPage = pages >= 1 ? pages : 1;
    
    // l'ultima pagina potrebbe avere meno dei dipendenti per pagina classici
    currPage == pages ? arrDipAnomalie.length - (currPage - 1) * dipPerPage : dipPerPage; 
    
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
	
    // se non vi sono dipendenti con anomalie nel periodo
    if(arrDipAnomalie.length == 0)
    {
    	elements.tab_timbr_mancanti_ditta.transparent = true;
    	return;
    }
    
    // creazione della nuova form dinamica 
    var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
    
    var currIndex = (currPage - 1) * dipPerPage;
    var maxIndex = Math.min(currPage * dipPerPage,arrDipAnomalie.length);
        
    for (var i = currIndex; i < maxIndex; i++)
    {
    	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>} */
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
    	if(fs.find())
    	{
    		fs.idlavoratore = arrDipAnomalie[i];
    		fs.search();
    	}
    	
    	// Dataset dei giorni nei quali sono presenti anomalie
    	var dsAnomalie = globals.ottieniDataSetAnomalie(arrDipAnomalie[i],
                                                        dal,
                                                        al);
    	tabHeight = 50 + dsAnomalie.getMaxRowIndex() * 20;
    	totHeight += tabHeight;    	
    	
    	// rimozione forms anomalie timbrature lavoratore
    	var timbrFormOri = forms.giorn_timbr_cartolina_mancanti;
    	var timbrFormOriName = timbrFormOri.controller.getName();
    	var timbrFormName = timbrFormOriName + '_' + arrDipAnomalie[i];
    	    	
    	if(solutionModel.getForm(timbrFormName))
        {
        	history.removeForm(timbrFormName);
        	solutionModel.removeForm(timbrFormName);
        }
    	
        // rimozione forms lavoratori con anomalie
        var dipFormOri = forms.giorn_timbr_mancanti_dipendente;
    	var dipFormOriName = dipFormOri.controller.getName();
    	var dipFormName = dipFormOriName + '_' + arrDipAnomalie[i];
    	
    	if(solutionModel.getForm(dipFormName))
        {
        	forms[dipFormName].elements.tab_timbr_mancanti_dip.removeAllTabs();
        	history.removeForm(dipFormName);
        	solutionModel.removeForm(dipFormName);
        }
    	
        // rimozione forms visualizza presenze lavoratore
        var giornFormPannOri = forms.giorn_timbr_mancanti_ditta_giorn_pannello;
    	var giornFormPannOriName = giornFormPannOri.controller.getName();
    	var giornFormPannName = giornFormPannOriName + '_' + arrDipAnomalie[i];
    	
    	if(solutionModel.getForm(giornFormPannName))
        {
        	history.removeForm(giornFormPannName);
        	solutionModel.removeForm(giornFormPannName);
        }
    	
        // rimozione forms apri giornaliera lavoratori con anomalie
//        var giornFormOri = forms.giorn_timbr_mancanti_ditta_giorn;
//    	var giornFormOriName = giornFormOri.controller.getName();
//    	var giornFormName = giornFormOriName + '_' + arrDipAnomalie[i];
//    	
//    	if(solutionModel.getForm(giornFormName))
//        {
//        	history.removeForm(giornFormName);
//        	solutionModel.removeForm(giornFormName);
//        }
    	 
        // rimozione forms apri decorrenza lavoratori con anomalie
        var decFormOri = forms.giorn_timbr_mancanti_ditta_dec;
    	var decFormOriName = decFormOri.controller.getName();
    	var decFormName = decFormOriName + '_' + arrDipAnomalie[i];
    	
    	if(solutionModel.getForm(decFormName))
        {
        	history.removeForm(decFormName);
        	solutionModel.removeForm(decFormName);
        }
    	
        var tabPanelTimbrDip = newForm.newTabPanel('tab_timbr_mancanti_ditta_tabpanel_' + arrDipAnomalie[i]
                                                   ,x
		                                           ,y
		                                           ,tabWidth
		                                           ,tabHeight);
        tabPanelTimbrDip.visible = true;
        tabPanelTimbrDip.transparent = true;
        tabPanelTimbrDip.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelTimbrDip.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST;
        tabPanelTimbrDip.scrollTabs = false;
        
    	var dipForm = solutionModel.cloneForm(dipFormName
    	                                      ,solutionModel.getForm(dipFormOriName));
    	var presForm = solutionModel.cloneForm(giornFormPannName
                                               ,solutionModel.getForm(giornFormPannOriName));
//    	var giornForm = solutionModel.cloneForm(giornFormName
//                                              ,solutionModel.getForm(giornFormOriName));
    	var decForm = solutionModel.cloneForm(decFormName
                                              ,solutionModel.getForm(decFormOriName));

    	var tabTimbrDipHeader = fs.codice + ' - ' + (globals.getTipologiaDitta(_idDitta) == globals.Tipologia.ESTERNA ? 
    			                                     fs.lavoratori_to_lavoratori_personeesterne.nominativo : fs.lavoratori_to_persone.nominativo);
    	tabPanelTimbrDip.newTab('tab_timbr_mancanti_dip_' + arrDipAnomalie[i],tabTimbrDipHeader,dipForm);
    	var tabListPres = tabPanelTimbrDip.newTab('tab_pres_' + arrDipAnomalie[i],'Giornaliera',presForm);    	
    	tabListPres.toolTipText = 'Visualizza la giornaliera mensile del dipendente';
//    	var tabTimbrGiorn = tabPanelTimbrDip.newTab('tab_giorn_' + arrDipAnomalie[i],'Giornaliera',giornForm);    	
//    	tabTimbrGiorn.toolTipText = 'Vai alla giornaliera del dipendente';
    	var tabTimbrDec = tabPanelTimbrDip.newTab('tab_dec_' + arrDipAnomalie[i],'Decorrenze',decForm);    	
    	tabTimbrDec.toolTipText = 'Visualizza le decorrenze del dipendente';
    	
    	y += tabHeight;									  
  
    	/** @type {Number}*/
    	var idLavoratore = arrDipAnomalie[i];
    	var currFrmName = 'giorn_timbr_mancanti_dipendente_' + idLavoratore;
    	/** @type {Form<giorn_timbr_mancanti_dipendente>} */
    	var currFrm = forms[currFrmName];
    	currFrm.dsAnomalie = dsAnomalie;
    	currFrm.preparaAnomalieLavoratore(idLavoratore,_anno,_mese,al.getDate(),currFrmName);
    }
           
    solutionModel.getForm(newFormName).getBodyPart().height = totHeight; //tabHeight * arrDipAnomalie.length;
    
    elements.tab_timbr_mancanti_ditta.addTab(newFormName,newFormName);
    
    // gestione delle pagine    
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
 * @properties={typeid:24,uuid:"45CFBDBA-1171-4223-A5A5-C6798CA662EA"}
 */
function onShow(firstShow, event) 
{		
	plugins.busy.prepare();
	
	elements.fld_tipo_anomalie.readOnly = false;

	var frm = forms.svy_nav_fr_openTabs;
	var _params = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]];
	annoRif = _params['anno'];
	meseRif = _params['mese'];
	limitaAl = _params['al'];
	
	globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].selected_tab = 2;
	
	var params = {
        processFunction: process_prepara_anomalie_ditta,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [idditta,annoRif,meseRif,limitaAl,_params['dipendenti_filtrati'] ? _params['dipendenti_filtrati'] : null]
    };
	plugins.busy.block(params);
}

/**
 * Lancia il processo per la visualizzazione delle anomalie su timbrature per la ditta
 * 
 * @param idDitta
 * @param anno
 * @param mese
 * @param al
 * @param arrDipFiltrati
 *
 * @properties={typeid:24,uuid:"3B7B8699-92CF-4C39-81BD-FDEE47E18C58"}
 */
function process_prepara_anomalie_ditta(idDitta,anno,mese,al,arrDipFiltrati)
{
	try
	{
		preparaAnomalieDitta(idDitta,
					         anno,
							 mese,
							 al,
							 arrDipFiltrati);
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_anomalie_ditta : ' + ex.message;
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
 * @properties={typeid:24,uuid:"796C94F1-E0BB-4CBC-8519-0F1C9B182527"}
 */
function onActionPrev(event) 
{
	--currPage;
	var frm = forms.svy_nav_fr_openTabs;
	limitaAl = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al;
    meseRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
    annoRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno;
	var arrDipFiltrati = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dipendenti_filtrati;
	
	var params = {
		processFunction: process_on_action,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [idditta,annoRif,meseRif,limitaAl,arrDipFiltrati]
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
 * @properties={typeid:24,uuid:"781F9500-8ABD-4CB2-A7D0-8ABF4373162E"}
 */
function onActionNext(event)
{
	currPage++;
	var frm = forms.svy_nav_fr_openTabs;
	limitaAl = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al;
    meseRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
    annoRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno;
	var arrDipFiltrati = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dipendenti_filtrati;
	
	var params = {
		processFunction: process_on_action,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [idditta,annoRif,meseRif,limitaAl,arrDipFiltrati]
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
 * @properties={typeid:24,uuid:"A072FA04-C0AB-4658-89D5-E4C79C60BA0E"}
 */
function onActionFirst(event)
{
	currPage = 1;
	var frm = forms.svy_nav_fr_openTabs;
	limitaAl = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al;
    meseRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
    annoRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno;
	var arrDipFiltrati = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dipendenti_filtrati;
	
	var params = {
		processFunction: process_on_action,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [idditta,annoRif,meseRif,limitaAl,arrDipFiltrati]
	};
	plugins.busy.block(params);
}

/**
 * @param _idditta
 * @param _annoRif
 * @param _meseRif
 * @param _limitaAl
 * @param _arrDipFiltrati
 *
 * @properties={typeid:24,uuid:"516EE73C-9D44-47D6-8DBD-359F11ED7540"}
 */
function process_on_action(_idditta,_annoRif,_meseRif,_limitaAl,_arrDipFiltrati)
{
	preparaAnomalieDitta(_idditta,_annoRif,_meseRif,_limitaAl,_arrDipFiltrati);
	plugins.busy.unblock();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E1841229-2801-4F04-A41B-5A6BAF1F1097"}
 */
function onActionLast(event) 
{
	currPage = pages; 
	var frm = forms.svy_nav_fr_openTabs;
	limitaAl = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al;
    meseRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
    annoRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno;
	var arrDipFiltrati = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dipendenti_filtrati;
	
	var params = {
		processFunction: process_on_action,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [idditta,annoRif,meseRif,limitaAl,arrDipFiltrati]
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
 * @properties={typeid:24,uuid:"4666FDD2-91C0-4BA0-A822-2209655523E1"}
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
 * @properties={typeid:24,uuid:"E34B60A0-D28C-488B-81BB-F3C892A4CC29"}
 */
function onActionRefresh(event) 
{
	var params = {
		processFunction: process_refresh_anomalie,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event]
	};
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"55E5809E-1A04-4460-A0AD-FA4114A02629"}
 */
function process_refresh_anomalie(event)
{
    refreshAnomalieDitta(event);
    plugins.busy.unblock();
}

/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"FF6AA7F0-01C6-40A2-8708-65F041FFB935"}
 */
function refreshAnomalieDitta(event)
{
	var frm = forms.svy_nav_fr_openTabs;
	if (frm.vSelectedTab != null && globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	{
		var idDitta = -1;
		var arrDipFiltrati = null;
		
		idDitta = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].idditta;
		limitaAl = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al;
        meseRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
        annoRif = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno;
		
		if(utils.stringLeft(frm.vTabNames[frm.vSelectedTab],1) == 'L')
		{
		   arrDipFiltrati = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].dipendenti_filtrati;
//		   forms.pann_header_dtl.foundset.loadRecords(idDitta);
    	}
		else
		{
			idDitta = foundset.idditta;
		    meseRif = limitaAl.getMonth() + 1;
		    annoRif = limitaAl.getFullYear();
		}		
	}	
	preparaAnomalieDitta(idDitta ? idDitta : idditta,annoRif,meseRif,limitaAl,arrDipFiltrati && arrDipFiltrati.length ? arrDipFiltrati : null);
}

/**
 * @properties={typeid:24,uuid:"617389BB-EBE6-47A6-AE98-389F456CBC97"}
 */
function goToEditTimbrMancantiDitta()
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * @properties={typeid:24,uuid:"18BDE7D0-C48D-4786-90F7-96466A8F8252"}
 */
function goToBrowseTimbrMancantiDitta()
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
 * @properties={typeid:24,uuid:"A7684FD4-C6F5-4222-B0E7-2166B08EB250"}
 */
function onDataChangeAl(oldValue, newValue, event) 
{
	var frm = forms.svy_nav_fr_openTabs;
	
	// bloccare selezione se al di fuori del periodo selezionato
	var periodo = globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].anno * 100 + globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].mese;
	if(newValue < globals.getFirstDatePeriodo(periodo) || newValue > globals.getLastDatePeriodo(periodo))
		return false;
		
	if(frm.vSelectedTab != null 
			&& globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]])
	   globals.objGiornParams[frm.vTabNames[frm.vSelectedTab]].al = newValue;
	
	return true;
}
