/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"46EDF5B2-6774-44CF-8740-89904ED64724",variableType:93}
 */
var vAl = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F55BC4AC-E1EE-4574-82E7-2DE22EED11D7"}
 */
var vCentroDiCosto = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"59E9A321-0BE2-43EA-8139-318828124895",variableType:4}
 */
var vChkCentroDiCosto = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D91568BD-165E-44E8-A0EB-191D9C38E85A",variableType:4}
 */
var vChkDip = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1EA7F4AC-8DB0-4605-99B3-049285AAD7E4",variableType:4}
 */
var vChkPeriodo = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"21CE5C06-A79C-49E4-BBE3-C30361960A51",variableType:4}
 */
var vChkSede = 0;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"24267566-6469-43A9-9990-6106434E480E",variableType:93}
 */
var vDal = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C19320B1-FE0A-4216-8AFE-55447A240B2E"}
 */
var vDip = '';

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"396FC933-C402-4028-B1A2-41919BE9BD25",variableType:8}
 */
var vIdCentroDiCosto = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"6D12FFD6-0F97-4B73-B58D-766ABCECC3C7",variableType:8}
 */
var vIdDip = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"1CD90E95-FFDB-4764-B2CB-DD1D46780CF9",variableType:8}
 */
var vIdDitta = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"674B2C8E-90F7-4C91-B08B-256DEC20BF50",variableType:8}
 */
var vIdSede = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3D057B52-DC2B-42C6-8EEA-C796FBCD76D0"}
 */
var vSede = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9ABBBB81-86B0-4ACA-B422-65892BC76651"}
 */
function goToEditVisualizzaSituazione(event) {
	
	elements.btn_refresh.enabled = true;
    elements.btn_browse_visualizza_situazione.enabled = true;
    elements.btn_edit_visualizza_situazione.enabled = false;
    
    elements.chk_periodo.enabled = true;
    elements.chk_sede.enabled = true;
    elements.chk_dipendente.enabled = true;
    elements.chk_centro_di_costo.enabled = true;
    
    if(vChkPeriodo)
    {
        elements.btn_calendar_dal.enabled = true;
    	elements.btn_calendar_al.enabled = true;
    }
    if(vChkDip)
    	elements.btn_lkp_dipendente.enabled = true;
    if(vChkSede)
    	elements.btn_lkp_sede.enabled = true;
    if(vChkCentroDiCosto)
    	elements.btn_lkp_centro_di_costo.enabled = true;
    
    globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5467869D-08AE-4CCE-B59F-01AC021415B0"}
 */
function goToBrowseVisualizzaSituazione(event) {
	
	elements.btn_refresh.enabled = false;
    elements.btn_browse_visualizza_situazione.enabled = false;
    elements.btn_edit_visualizza_situazione.enabled = true;
    
    elements.chk_periodo.enabled = false;
    elements.chk_sede.enabled = false;
    elements.chk_dipendente.enabled = false;
    elements.chk_centro_di_costo.enabled = false;
    
    elements.btn_calendar_dal.enabled = false;
	elements.btn_calendar_al.enabled = false;
	
    elements.btn_lkp_dipendente.enabled = false;
    elements.btn_lkp_sede.enabled = false;
    elements.btn_lkp_centro_di_costo.enabled = false;

    globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"0CF6122B-23F7-4738-9FFA-088D3DEAB3F3"}
 */
function FiltraDitta(fs)
{
//	fs.addFoundSetFilterParam('idlavoratore','IN',globals.foundsetToArray(forms.rp_elenco_richieste.foundset,'idlavoratore'));
	fs.addFoundSetFilterParam('idditta','=',vIdDitta);
	fs.loadAllRecords();
	
	return fs;
}

/**
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"BB20C34F-2893-480C-A588-4452BEEA1ED1"}
 * @AllowToRunInFind
 */
function FiltraCdc(fs)
{
	var idDittaClassificazione = null;
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_classificazioni>}*/
	var fsCl = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'ditte_classificazioni');
	if(fsCl.find())
	{
		fsCl.idditta = vIdDitta;
 	    fsCl.descrizione = 'Centro di costo';
        if(fsCl.search())
        {
        	idDittaClassificazione = fsCl.iddittaclassificazione;
//        	codDittaClassificazione = fsCl.codice;
//        	codTipoCampo = fsCl.codtipocampo;
        	fs.addFoundSetFilterParam('iddittaclassificazione','=',idDittaClassificazione);
        	fs.loadAllRecords();
        }
	}
	
	return fs;
}

/**
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"956D8F80-2F91-4F40-9687-8C19487BFA11"}
 */
function AggiornaDip(rec)
{
	vIdDip = rec['idlavoratore'];
	vDip = rec['lavoratori_to_persone.nominativo'];
}

/**
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"09FBFF49-2EC5-4A6C-B4DB-2AD0BEDBBB53"}
 */
function AggiornaSede(rec)
{
	vIdSede = rec['iddittasede'];
	vSede = rec['descrizione'];
}

/**
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"94B456A7-1789-47D9-8ABB-3046AC2E248D"}
 */
function AggiornaCdc(rec)
{
	vIdCentroDiCosto = rec['iddittaclassificazionedettaglio'];
	vCentroDiCosto = rec['codice'] + ' - ' + rec['descrizione'];
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
 * @properties={typeid:24,uuid:"10E08A06-D9CA-46CC-81EF-D591296582CD"}
 */
function onDataChangeChkDip(oldValue, newValue, event) {
	
	elements.btn_lkp_dipendente.enabled = newValue;
	return true
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
 * @properties={typeid:24,uuid:"34010145-6871-4326-93A5-7D36981D389B"}
 */
function onDataChangeChkSede(oldValue, newValue, event) {
	
    elements.btn_lkp_sede.enabled = newValue;
	return true
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
 * @properties={typeid:24,uuid:"F41DEC42-0DBE-4D54-92A6-B771B29AAC10"}
 */
function onDataChangeChkCdc(oldValue, newValue, event) {
	
	elements.btn_lkp_centro_di_costo.enabled = newValue;
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F013DF35-3ABB-4B58-B08F-66605C1A8879"}
 */
function onActionRefresh(event) 
{
	var tabIndex = globals.nav.program['RP_ElencoRichieste'].tab.selected;
	var daEvadere = tabIndex == 1 ? true : false;
	
	globals.refreshElencoTimbrature(event,daEvadere);
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
 * @properties={typeid:24,uuid:"7A5D75F2-C6C3-4902-8818-4FEF5DE89BEB"}
 */
function onDataChangeChkPeriodo(oldValue, newValue, event) {
	
	elements.btn_calendar_dal.enabled = newValue;
	elements.btn_calendar_al.enabled = newValue;
	return true;
}

/**
 * @properties={typeid:24,uuid:"64360560-FDA6-4B01-AED3-E54ED537601C"}
 */
function validaParameters()
{
	if(vChkDip && vIdDip)
	{
		globals.ma_utl_showWarningDialog('Selezionare un dipendente o deselezionare il filtro sul dipendente','Elenco richieste');
	    return false;
	}
	if(vChkSede && vIdSede)
	{
		globals.ma_utl_showWarningDialog('Selezionare una sede o deselezionare il filtro sulla sede di lavoro','Elenco richieste');
	    return false;
	}
	if(vChkCentroDiCosto && !vIdCentroDiCosto)
	{
		globals.ma_utl_showWarningDialog('Selezionare un centro di costo o deselezionare il filtro sul centro di costo','Elenco richieste');
	    return false;
	}
	
	if(!vDal && !vAl)
		return true;
	
	if (vDal && vAl)
	{
		if(vDal > vAl)
		{	
			globals.ma_utl_showWarningDialog('La data di inizio visualizzazione non può superare la data di fine','Elenco richieste');
	        return false;
		}
		
		return true;
	}	
	else
	{
		globals.ma_utl_showWarningDialog('Inserire le date di inizio e fine visualizzazione','Elenco richieste');
	    return false;
	}
	
}