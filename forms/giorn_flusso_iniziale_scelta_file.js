/**
 * @type {plugins.file.JSFile}
 * 
 * @properties={typeid:35,uuid:"6D94E128-5FA9-43C2-896A-F71024EA1C97",variableType:-4}
 */
var vFile = null;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"0B82AE12-0899-46BB-B0A7-3F81254C6B70",variableType:93}
 */
var _periodo = null

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"726BBD35-A97F-48C0-8F61-368A43D5E739",variableType:8}
 */
var _idditta = null

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"14567DA6-3A22-4B7D-A7E8-F777A03AA70B",variableType:8}
 */
var _gruppoinst = -1

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"258DE528-0FC8-4215-92EC-54E6131E420F"}
 */
var _gruppolav = ''

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B5117306-CBF7-4252-877F-C4E5C609A787"}
 */
var _codditta = ''
	
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"73B8BDCD-4553-485A-BE12-11275A277AAA",variableType:8}
 */
var _iddipendente = -1;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"EECC3652-8889-4B69-9F5D-FD44E7BE4962",variableType:8}
 */
var _coddipendente = null

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3C7593A3-60B1-4C74-B809-00323D02E402"}
 */
var _ragionesociale = ''
	
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0416C39C-3838-46A0-8E3A-CE4E60C696AA"}
 */
var _nominativo = ''

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"62D29474-0468-44B9-B3A7-71BDCECD7F7E"}
 */
var _percorsoFile = '';//"F:\\2501-201205-TracciatoPresenze.txt"

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"77139E2A-EEF8-4E63-B377-3968E94EEA54",variableType:-4}
 */
var _chkSingoloDipendente = false

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"B0A53A84-013F-47EC-8284-616D44BFE1D6",variableType:-4}
 */
var _chkSingoloTracciato = false

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"171C06E2-F293-49EF-9BDF-11068A8DE4F9",variableType:8}
 */
var _idTracciatoConversione = -1;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"B447C899-5A13-4B2D-9105-1A75A38E32EA",variableType:-4}
 */
var _multitracciato = false

/**
 * Procedura per l'importazione del tracciato da file (dischetto) 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4788827A-16EA-4F4D-A05E-E33AB2071C0F"}
 */
function importaTracciatoDaFile(event)
{
//	if (_multitracciato)
//	{
//		globals.ma_utl_showWarningDialog('Ditta multitracciato, selezionare quello desiderato','Importazione tracciato')
//	    return;
//	}	
//	if (!_percorsoFile || _percorsoFile == '')
//	{
//		globals.ma_utl_showWarningDialog('Nessun file selezionato per l\'importazione','Importazione tracciato')
//	    return;
//	}
//	var _response = globals.ma_utl_showYesNoQuestion('Procedere con l\'importazione?','Importazione tracciato')
//	
//	if(_response)
//	{	
//
//	   svy_mod_closeForm(event);
//	   
//	   if(_chkSingoloDipendente)
//	   {
//		   if(_iddipendente == -1)
//		   {
//			  globals.ma_utl_showWarningDialog('Selezionare il dipendente da importare','Importazione tracciato');
//		      return;
//	   
//		   }
//	   }
//	   
//	   var periodo = globals.toPeriodo(_periodo.getFullYear(), _periodo.getMonth() + 1);
//       application.output(_iddipendente);
//	   var arrDip = [_iddipendente];
//	   var params = globals.inizializzaParametriTracciatoMese(idditta, periodo, _gruppoinst, _gruppolav, arrDip, _idTracciatoConversione, globals._tipoConnessione);  
	   
       //gestione segnalazione dipendenti senza regole associate
       //TODO 
//       var _dipSenzaRegole = globals.elencoDipendentiSenzaRegoleAssociate(params);
//       if (_dipSenzaRegole)
//       {
//          globals.ma_utl_showInfoDialog('<html>Ci sono dipendenti senza regole associate.<br/>Sistemare le regole prima di proseguire.</html>','Importazione giornaliera')
//          globals.svy_mod_closeForm(event);
//
//          return;
//       }
       
	   // TODO creare importazione tracciato
//       globals.importazioneTracciato(params, vFile);
//
//	}else
//	   globals.svy_mod_closeForm(event);
}

/**
 * Mostra la dialog per la selezione del file da importare
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8A3EC686-4608-4B8B-AC64-54C1AAB02A23"}
 */
function chooseFile(event) 
{
	plugins.file.showFileOpenDialog(null,null,false,null,impostaTracciato,'Seleziona file da importare');
}

/**
 * Imposta il tracciato 
 * 
 * @param {Array<plugins.file.JSFile>} files
 *
 * @properties={typeid:24,uuid:"2DD38EE1-4210-4FBD-A460-DE327671E3AC"}
 */
function impostaTracciato(files)
{
	if(files && files[0])// && globals.endsWith('.txt', files[0].getName(), true))
	{
		_percorsoFile = files[0].getName();
		salvaFileTracciato(files);
	}
	else
	{
		globals.ma_utl_showErrorDialog('Selezionare un file TXT', 'i18n:svy.fr.lbl.excuse_me');
		_percorsoFile = null;
	}
}

/**
 * @param {Array<plugins.file.JSFile>} files
 * 
 * @properties={typeid:24,uuid:"15E3E8AB-EE78-40BD-B664-860C52FA1449"}
 */
function salvaFileTracciato(files) 
{
	// Store files to later pass them on to the web service
	vFile = files[0];
}

/**
 * @param {Date} periodo
 *
 * @properties={typeid:24,uuid:"1BCFBFB3-FE67-4D2F-87C0-EE2CAF8FC8F0"}
 */
function init(periodo)
{
	_periodo = periodo;
	_percorsoFile = null;
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6DF2138D-70B9-4C2C-811F-21DADDBFC562"}
 * @AllowToRunInFind
 */
function onShowForm(firstShow, event) 
{
	_super.onShowForm(firstShow, event);
	
	elements.fld_multitracciato.enabled = false;
	
	foundset.addFoundSetFilterParam('idditta','=',_idditta);
	
	foundset.loadAllRecords();
	
	if(foundset.getSize()>0)
	{
		_idTracciatoConversione = foundset.ditte_to_ditte_presenzetracciatiore.iddittapresenzetracciatoore;
		
		if(foundset.ditte_to_ditte_presenzetracciatiore.getSize() > 1)
	    {
	    	
	    	elements.fld_multitracciato.enabled = true;
	    	_multitracciato = true;
	    	
	    }
	    else
		{
			_multitracciato = false;
				
		}
			
		globals.svy_nav_dc_setStatus('edit', controller.getName(), true);
    }
    else
    	globals.ma_utl_showWarningDialog('Controllare la tabella di conversione tracciati ditta','Importazione tracciato');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"42998CB4-CBB1-4B75-90C7-D90F6D930166"}
 */
function onHide(event)
{
	if(_super.onHide(event))
	{
		globals.svy_nav_dc_setStatus('browse', controller.getName(), true);
		return true;
	}
	
	return false;
}

/**
 * Abilita o disabilita i pulsanti per la selezione del singolo dipendente
 * da scaricare
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"29C707A5-A933-4338-ACE1-D7CC7C639E1F"}
 */
function abilitaSoloDip(oldValue, newValue, event) {
	
	_chkSingoloDipendente = newValue
	
    if(newValue == 1)
    {
    	elements.fld_cod_dip.enabled = true
		elements.fld_nominativo.enabled = true
		elements.btn_lkp_dip.enabled = true
    
    }
    else
    {
    	_iddipendente = -1;
    	elements.fld_cod_dip.enabled = false
		elements.fld_nominativo.enabled = false
		elements.btn_lkp_dip.enabled = false
    }
	return true
}

/**
 * Abilita o disabilita i pulsanti per la selezione del contratto 
 * da scaricare
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6C1050B2-8FBF-485D-A321-E253C8AD12D3"}
 */
function abilitaCtr(oldValue, newValue, event) {
	
	_chkSingoloTracciato = newValue
	
    if(newValue == 1)
    {
    	elements.fld_contratto.enabled = true
		elements.btn_lkp_contratti.enabled = true
    
    }
    else
    {
    	elements.fld_contratto.enabled = false
		elements.btn_lkp_contratti.enabled = false
    }
	return true
}

/**
 * Restituisce il record del lavoratore selezioanto
 * 
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"24337CCD-6B86-45C0-8E03-E72437ED0A83"}
 */
function CercaLavoratoreTracciato(_rec)
{
	_iddipendente = _rec['idlavoratore']
	_coddipendente = _rec['codice']
	_nominativo = _rec['lavoratori_to_persone.nominativo']
	
}

/**
 * Filtra i lavoratori selezionabili per lo scarico della singola giornaliera
 * 
 * @param {JSFoundset} _fs
 * 
 * @return {JSFoundset}
 *
 * @properties={typeid:24,uuid:"2A0A4BD2-7E4B-4989-A287-B157F93B17F2"}
 */
function FiltraAnagraficheLavoratoriTracciato(_fs) 
{
	var filters = forms.giorn_header.foundset.getFoundSetFilterParams();	
	for (var i = 0; i < filters.length; i++)
		_fs.addFoundSetFilterParam(filters[i][1], filters[i][2], filters[i][3], filters[i][4]);
	
	_fs.loadAllRecords()
	
	return _fs;
}