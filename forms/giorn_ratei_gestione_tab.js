/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"5B4B17A3-89AD-4F50-812A-7DE4C3F28A15",variableType:-4}
 */
var _isFromGiorn = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9857EE17-9653-4CDB-B434-74A77430A4DA",variableType:4}
 */
var _idlavoratore = -1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C335A8F7-B260-4F7D-A3AB-CE016126F08A",variableType:4}
 */
var _mese = -1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"FDC07D2E-DBD2-4943-A0ED-E5323BFEA145",variableType:4}
 */
var _anno = -1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F26FB886-5180-4342-B115-D29CD30614C2",variableType:4}
 */
var _idditta = -1;

/**
 * Inizializza i parametri per la gestione dei ratei
 * 
 * @param {Number} idDitta
 * @param {Number} idDip
 * @param {Number} mese
 * @param {Number} anno
 *
 * @properties={typeid:24,uuid:"323725B5-A61A-4C60-9B0B-5A7711C12760"}
 */
function inizializzaParametriGestioneRatei(idDitta,idDip,mese,anno)
{
	_idditta = idDitta;
	_idlavoratore = idDip;
	_mese = mese;
	_anno = anno;
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"C54C7B14-3283-45A9-889E-2B39ADC93091"}
 */
function onShowForm(_firstShow, _event) {
	
	gestisciRiepilogoRatei();	
	gestisciRiepilogoMovimentazione();
	gestisciRiepilogoSituazione();

}

/**
 * @properties={typeid:24,uuid:"CCD7B602-8D68-43D5-9E81-304D4556FC2A"}
 */
function gestisciRiepilogoRatei()
{
	var _firstMonthDay = new Date(_anno,_mese -1,1);
	var _lastMonthDay = new Date(_anno,_mese - 1,globals.getTotGiorniMese(_mese,_anno));
	var _ratSql = "SELECT CodiceRateo,TipoRateo,Valore,ForzatoManuale,DataRateo FROM E2RateiMovimenti WHERE IdDip = ? AND DataRateo >= ? AND DataRateo <= ?";
	var _ratArr = new Array();
	    _ratArr.push(_idlavoratore,_firstMonthDay,_lastMonthDay);
	var _ratDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_ratSql,_ratArr,1000);
	
	var vFormName = 'giorn_ratei_gestione_tab_tbl'; 
    var vFormNameTemp = vFormName + '_temp';
    
    forms.giorn_ratei_gestione_tab.elements.tab_rateo_sel_tbl.removeAllTabs();
    
	if (forms[vFormNameTemp] != null){
		
		history.removeForm(vFormNameTemp);	
	    solutionModel.removeForm(vFormNameTemp);
		
	}
	var vDataSourceRateiDip = _ratDs.createDataSource('_ratDS',[JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.DATETIME]);
	
	solutionModel.cloneForm(vFormNameTemp, solutionModel.getForm(vFormName));
	solutionModel.getForm(vFormNameTemp).dataSource = vDataSourceRateiDip;
	solutionModel.getForm(vFormNameTemp).getField('fld_codice').dataProviderID = 'CodiceRateo';
	solutionModel.getForm(vFormNameTemp).getField('fld_tipo').dataProviderID = 'TipoRateo';
    solutionModel.getForm(vFormNameTemp).getField('fld_valore').dataProviderID = 'valore';
    solutionModel.getForm(vFormNameTemp).getField('fld_forzato').dataProviderID = 'ForzatoManuale';
    solutionModel.getForm(vFormNameTemp).getField('fld_data').dataProviderID = 'DataRateo';
        
    forms.giorn_ratei_gestione_tab.elements.tab_rateo_sel_tbl.addTab(vFormNameTemp);	
	elements.lbl_gestione_ratei.text = 'Periodo : ' + globals.getNomeMese(_mese) + ' ' + _anno;
}

/**
 * @properties={typeid:24,uuid:"EA2A5C42-4A86-4B48-BC4A-3822CB87F3B0"}
 */
function gestisciRiepilogoMovimentazione(){
	
	var _fromDate = utils.dateFormat(new Date(_anno,_mese,1),globals.ISO_DATEFORMAT);
	var _toDate = utils.dateFormat(new Date(_anno, _mese, globals.getTotGiorniMese(_mese,_anno)),globals.ISO_DATEFORMAT);
	
    var _vFormName = 'giorn_ratei_mov'; 
    var _vFormNameTemp = _vFormName + '_temp';
	
    forms.giorn_ratei_gestione_tab.elements.tab_rateo_mov_per.removeAllTabs();
    
    if (forms[_vFormNameTemp] != null){
		history.removeForm(_vFormNameTemp);	
	    solutionModel.removeForm(_vFormNameTemp);	
	}
    
    var _vQuery = "SELECT CodiceRateo,Descrizione,MaturatoAnno,Accantonate,GodutoAnno,LiquidatoAnno,VariazionePeriodo FROM F_Ratei_Lav_VariazioniPeriodo(?,?,?)"    
    var _vArr = new Array();
        _vArr.push(_idlavoratore,_fromDate,_toDate);
    var vDatasetRateiDip = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _vQuery, _vArr, 100);    
    var vDataSourceRateiDip = vDatasetRateiDip.createDataSource('vDataSourceMovRateiDip',[JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER]);
	
	solutionModel.cloneForm(_vFormNameTemp, solutionModel.getForm(_vFormName));
	solutionModel.getForm(_vFormNameTemp).dataSource = vDataSourceRateiDip;
	solutionModel.getForm(_vFormNameTemp).getField('fld_descrizione').dataProviderID = 'Descrizione';
	solutionModel.getForm(_vFormNameTemp).getField('fld_maturato_anno').dataProviderID = 'MaturatoAnno';
    solutionModel.getForm(_vFormNameTemp).getField('fld_accantonate').dataProviderID = 'Accantonate';
    solutionModel.getForm(_vFormNameTemp).getField('fld_goduto_anno').dataProviderID = 'GodutoAnno';
    solutionModel.getForm(_vFormNameTemp).getField('fld_liquidato_anno').dataProviderID = 'LiquidatoAnno';
    solutionModel.getForm(_vFormNameTemp).getField('fld_residuo').dataProviderID = 'VariazionePeriodo';	
        	
    forms.giorn_ratei_gestione_tab.elements.tab_rateo_mov_per.addTab(_vFormNameTemp);
	
}

/**
 * @properties={typeid:24,uuid:"FBFE344D-F4CB-4E58-959A-0BCF3C284E67"}
 */
function gestisciRiepilogoSituazione(){
	
	var _allaData = new Date(_anno,_mese - 1,globals.getTotGiorniMese(_mese,_anno));
	
    forms.agl_ratei_main.gestisciTabRateiTbl('giorn_ratei_gestione_tab','tab_rateo_situaz_al','agl_ratei_main_tbl',_allaData,_idlavoratore);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6A496DE4-7842-40E8-947E-AC7A399BA87F"}
 */
function stampaSituazioneRateiDipendente(event) {
	
	globals.svy_mod_closeForm(event);
	globals.selezione_ditta_stampa_situazione_ratei(forms.giorn_header.idditta,forms.giorn_header.idlavoratore);
}
