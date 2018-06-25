/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"92C9809B-0788-46F7-AAE3-EA223305FDEC",variableType:93}
 */
var _alGG = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"851FB950-27A3-444F-9624-11D76048126C",variableType:8}
 */
var _anno;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"ED0E2B32-4474-4495-8AE2-A2610C1B2551",variableType:8}
 */
var _chkLimitaAlPeriodo = 0;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"37F34F78-C913-4823-B983-34ECDB01405F",variableType:93}
 */
var _dalGG = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"460C3703-25BC-42C4-B62D-7B7D6FB9F8E9",variableType:4}
 */
var _mese;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"84EBF3A1-26AD-4268-ABF3-84FAFD8C3C79",variableType:4}
 */
var _formDiOrigine = 0;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"4F1D3939-7E21-4E33-9E5E-26C70ECA0B94",variableType:-4}
 */
var _ftrBloccanti = false;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"A0669CD8-CB2F-41AF-BC34-655C3E49CF43",variableType:-4}
 */
var _arrCatBloccanti = [];

/**
 * Applica i filtri selezionati aggiornando la selezione in giornaliera
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"12092771-BCDC-45B6-9AEF-27AA91AAFCB3"}
 */
function confermaFiltriSelezionati(event)
{
	var params = {
		processFunction: process_conferma_filtri,
		message: '',
		opacity: 0.5,
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
 * @properties={typeid:24,uuid:"D818B784-7587-41AF-92A3-72F4E15550ED"}
 */
function process_conferma_filtri(event)
{
	var dsFiltri = globals.ottieniDipendentiFiltrati();
	if(dsFiltri.getMaxRowIndex() > 0)
	{
	  forms.giorn_vista_mensile._filtroAttivo = 1;
	  globals.ma_utl_setTabProperty(globals.ma_utl_getCurrentTabName(), 'filtro_anag', true);
	  globals.aggiornaDipendentiFiltrati(dsFiltri);
	  globals.aggiornaIntestazioni();
	  forms.giorn_header.preparaGiornaliera(true,null,false);
	}
	else
		globals.nessunDipendenteFiltrato();
	
	globals.ma_utl_setStatus(globals.Status.BROWSE, forms.giorn_filtri_anagrafici.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE, forms.giorn_filtri_timbrature.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE, forms.giorn_filtri_giornaliera.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE, forms.giorn_filtri.controller.getName());
	globals.svy_mod_closeForm(event);
	
	plugins.busy.unblock();
}

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"3F748285-2DF2-45CB-B092-CF0ABF2024C6"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event)
    
	plugins.busy.prepare();
	
	_anno = globals.getAnno();
	_mese = globals.getMese();
	
	var grLav = globals.getGruppoLavoratori();
	if(grLav != '')
	{
		var frmFtrAnag = forms.giorn_filtri_anagrafici;
		frmFtrAnag.vFilterGruppiLavoratori = 1;
		frmFtrAnag.vGruppoLavoratori = grLav;
		frmFtrAnag.vGruppoLavoratoriString = grLav + ' - ' + globals.getDescGruppoLavoratori(forms.giorn_header.idditta,grLav);
		frmFtrAnag.elements.btn_gruppo_lavoratori.enabled = false;
		frmFtrAnag.elements.chk_gruppo_lavoratori.enabled = false;
		frmFtrAnag.elements.fld_gruppo_lavoratori.enabled = false;
	}
	
	/** @type {Array<Number>} */
	var _arrGiorni = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel;
	if(_arrGiorni.length > 0)
	{
		_dalGG = new Date(_anno,_mese -1, _arrGiorni[0])
		_alGG = new Date(_anno,_mese -1, _arrGiorni[_arrGiorni.length - 1])
		_chkLimitaAlPeriodo = 1
		
		elements.fld_dal_gg.enabled = true
	    elements.fld_al_gg.enabled = true
	    elements.fld_dal_gg.editable = true
	    elements.fld_al_gg.editable = true
		elements.fld_dal_gg.readOnly = false
		elements.fld_al_gg.readOnly = false
		
	}else
	{
	   _dalGG = new Date(_anno,_mese-1,1)
       _alGG = new Date(_anno,_mese-1,globals.getTotGiorniMese(_mese,_anno))
	   _chkLimitaAlPeriodo = 0
	
	   elements.fld_dal_gg.enabled = false
	    elements.fld_al_gg.enabled = false
	    elements.fld_dal_gg.editable = false
	    elements.fld_al_gg.editable = false
		elements.fld_dal_gg.readOnly = true
		elements.fld_al_gg.readOnly = true
		
	}
	
	
	elements.fld_limitaalperiodo.readOnly = false
	
	globals.azzeraFiltri();
	
	globals.ma_utl_setStatus(globals.Status.EDIT,'giorn_filtri_anagrafici')
		
	elements.tab_filtri.removeAllTabs();
	
	// se la ditta non ha orologio, disabilita il tab dei filtri su timbrature
	if(!forms.giorn_header.lavoratori_to_ditte.ditte_to_ditte_presenze.timbrature_gestioneorologio)
	{
		elements.tab_filtri.addTab('giorn_filtri_anagrafici','filtri_timbr','Filtri anagrafici',null,null,null,null,null,0)
	    elements.tab_filtri.addTab('giorn_filtri_giornaliera','filtri_giorn','Filtri giornaliera',null,null,null,null,null,1)
		elements.tab_filtri.tabIndex = 2;  
		
	}else
	{
		
		elements.tab_filtri.addTab('giorn_filtri_anagrafici','filtri_anag','Filtri anagrafici',null,null,null,null,null,0)
		elements.tab_filtri.addTab('giorn_filtri_timbrature','filtri_timbr','Filtri timbrature',null,null,null,null,null,1)
		elements.tab_filtri.addTab('giorn_filtri_giornaliera','filtri_giorn','Filtri giornaliera',null,null,null,null,null,2)
		_formDiOrigine == 0 ? elements.tab_filtri.tabIndex = 3 : elements.tab_filtri.tabIndex = 2;  
		   
		globals.ma_utl_setStatus(globals.Status.EDIT,'giorn_filtri_timbrature');
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,'giorn_filtri_anagrafici');
	globals.ma_utl_setStatus(globals.Status.EDIT,'giorn_filtri_giornaliera');
		
}

/** *
 * @param event
 *
 * @properties={typeid:24,uuid:"8C031CA5-4594-48AD-B5B2-24DA5F2F62C9"}
 */
function onHide(event) {
	
	_super.onHide(event);
	
//	globals.aggiornaFiltri();
    globals.aggiornaIntestazioni();
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
 * @properties={typeid:24,uuid:"1F581200-1E81-4111-8A42-8632FB1080EA"}
 */
function onSelLimitaAlPeriodo(oldValue, newValue, event) {
	
	if(newValue == 1)
	{
		elements.fld_dal_gg.enabled = true;
	    elements.fld_al_gg.enabled = true;
	    elements.fld_dal_gg.editable = true;
	    elements.fld_al_gg.editable = true;
		elements.fld_dal_gg.readOnly = false;
		elements.fld_al_gg.readOnly = false;
	    
	}
	else
	{
		elements.fld_dal_gg.enabled = false;
	    elements.fld_al_gg.enabled = false;
	    elements.fld_dal_gg.editable = false;
	    elements.fld_al_gg.editable = false;
	    elements.fld_dal_gg.readOnly = true;
		elements.fld_al_gg.readOnly = true;
			
	}
	
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C7E027E3-A33E-4A9E-8B6A-A685A9F6F82A"}
 */
function annullaSelezioneFiltri(event) {
	
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag = false;
	globals.ma_utl_setStatus(globals.Status.BROWSE,forms.giorn_filtri_anagrafici.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE,forms.giorn_filtri_timbrature.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE,forms.giorn_filtri_giornaliera.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());	
	globals.azzeraFiltri();
	globals.svy_mod_closeForm(event);
	
}

/**
 * @properties={typeid:24,uuid:"845839D2-EED9-4F96-A5B8-1A175C2CD935"}
 */
function esistonoFiltriGiorn()
{
	var frmFtrTimbr = forms.giorn_filtri_timbrature;
	var frmFtrGiorn = forms.giorn_filtri_giornaliera;
	
	if(frmFtrTimbr._chkAbbuoni
	   || frmFtrTimbr._chkAnomalie
	   || frmFtrTimbr._chkGiornateNonConteggiate
	   || frmFtrTimbr._chkNessunaFascia
	   || frmFtrGiorn._chkAnnotazioni
	   || frmFtrGiorn._chkEventiLunghi
	   || frmFtrGiorn._chkEventiLunghiDaCalc
	   || (frmFtrGiorn._chkEvento && frmFtrGiorn._arrEvFiltri.length > 0)
	   || frmFtrGiorn._chkSquadrati)
	return true;
	
	return false;
	
}

/**
 * @properties={typeid:24,uuid:"59DBFFAB-7298-4D81-AF7B-22AC23C98DC3"}
 */
function esistonoFiltriClassificazioni()
{
	var frmFtrAnag = forms.giorn_filtri_anagrafici;
	if(frmFtrAnag.vFilterRaggruppamento)
		return true;
	return false;
}
