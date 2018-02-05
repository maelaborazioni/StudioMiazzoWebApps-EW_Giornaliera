/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"88B2170D-3582-4009-8695-3DF66CCC2063",variableType:8}
 */
var _coddipendente = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D20FC566-71B7-4978-A9F2-251FB8D87906"}
 */
var _codditta = '';

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"4FD3087F-CA58-44F5-A978-B4BBCE5F0E44",variableType:8}
 */
var _gruppoinst = -1;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"31C84F5E-167F-410F-8F13-45A3886CF7BF"}
 */
var _gruppolav = '';

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E8E3443B-B6AE-4079-B424-0BA483052D32",variableType:8}
 */
var _iddipendente = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E43052C8-78C3-409D-9730-CFBDE45CA570",variableType:8}
 */
var _idditta = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C714DB1A-10DF-495E-9B4C-BD680CCA8D35"}
 */
var _nominativo = '';

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"43890F76-959A-416D-97DC-042848ADE600"}
 */
var _percorsoFile = '';

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"5C744F7F-DBEA-4D40-B6E8-553DC4E7C8AA",variableType:93}
 */
var _periodo = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"61A2C60C-7CDE-420D-B686-6992FA082C3B"}
 */
var _ragionesociale = '';

/**
 * @type {plugins.file.JSFile}
 * 
 * @properties={typeid:35,uuid:"D0F4D457-4D10-4BED-A650-6B5854E910D4",variableType:-4}
 */
var vFile = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C7B2BFDC-980C-4926-A563-5E97679E53AE"}
 */
function importaTimbratureDaFile(event)
{
	if (!_percorsoFile || _percorsoFile == '')
	{
		globals.ma_utl_showWarningDialog('Nessun file selezionato per l\'acquisizione','Acquisizione timbrature')
	    return;
	}
	var _response = globals.ma_utl_showYesNoQuestion('Procedere con l\'acquizione?','Acquisizione timbrature')
	
	if(_response)
	{	

	   globals.svy_mod_closeForm(event);
	   	   
	   //TODO implementazione metodo con acquisizione timbrature
//	   var periodo = globals.toPeriodo(_periodo.getFullYear(), _periodo.getMonth() + 1);
//       var params = globals.inizializzaParametriTracciatoMese(idditta, periodo, _gruppoinst, _gruppolav, _arrDip,globals._tipoConnessione);  
//	   globals.importazioneTracciato(params, vFile);

	}else
		
	   globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D9DB4D50-E8CA-4861-8EFC-611AD3D2CACC"}
 * @SuppressWarnings(wrongparameters)
 */
function chooseFile(event) 
{
	plugins.file.showFileOpenDialog(null, null, false, impostaTimbratura, 'Seleziona file da importare');
}

/**
 * @param {Array<plugins.file.JSFile>} files
 *
 * @properties={typeid:24,uuid:"29F3E1A4-3922-4F18-9C7F-538A239A1E04"}
 */
function impostaTimbratura(files)
{
	if(files && files[0])// && globals.endsWith('.txt', files[0].getName(), true))
	{
		_percorsoFile = files[0].getName();
		salvaFileTimbratura(files);
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
 * @properties={typeid:24,uuid:"4A64B51B-E016-4952-9DAF-E71E68577103"}
 */
function salvaFileTimbratura(files) 
{
	// Store files to later pass them on to the web service
	vFile = files[0];
}

/**
 * @param {Date} periodo
 *
 * @properties={typeid:24,uuid:"D3866207-2310-4150-A1DD-297ED9B8082B"}
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
 * @properties={typeid:24,uuid:"41658E27-AFB3-4255-AEB2-A672BAF431C0"}
 * @AllowToRunInFind
 */
function onShowForm(firstShow, event) 
{
	_super.onShowForm(firstShow, event);
	
	if(foundset.find())
	{
		idditta = _idditta
		foundset.search()
	}
	
	globals.svy_nav_dc_setStatus('edit', controller.getName(), true);
	
//	if(foundset.find())
//	{
//		foundset.idditta = _idditta
//		foundset.search()
//	}
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EB917FB3-94A6-4181-B365-075596BC980D"}
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
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"2B21F04C-0464-444E-9AC9-AB8FB67E9DD6"}
 */
function CercaLavoratoreTimbr(_rec)
{
	_iddipendente = _rec['idlavoratore']
	_coddipendente = _rec['codice']
	_nominativo = _rec['lavoratori_to_persone.nominativo']
	
}

/**
 * @param {JSFoundset} _fs
 * 
 * @return {JSFoundset}
 *
 * @properties={typeid:24,uuid:"6CA05D36-4962-4BB2-B10E-2A43B7A3F20F"}
 */
function FiltraAnagraficheLavoratoriTimbr(_fs) 
{
	var filters = forms.giorn_header.foundset.getFoundSetFilterParams();	
	for (var i = 0; i < filters.length; i++)
		_fs.addFoundSetFilterParam(filters[i][1], filters[i][2], filters[i][3], filters[i][4]);
	
	_fs.loadAllRecords()
	
	return _fs;
}
