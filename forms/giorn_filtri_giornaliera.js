/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"FD4A3170-D50C-49E9-A466-FF879DD174BE",variableType:-4}
 */
 var _arrEvFiltri = [];

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"22C1929B-BFAA-448C-9AB3-C904BEDC2013",variableType:-4}
 */
var _chkAnnotazioni = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"876A2481-1AB2-4FC2-9303-8ADF0EAE35F0",variableType:-4}
 */
var _chkEventiLunghi = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"0867CE8D-C958-48B9-85EC-4B8CA69920BD",variableType:-4}
 */
var _chkEventiLunghiDaCalc = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"2EFC93C0-F987-491B-AE0C-7E120FF5365E",variableType:-4}
 */
var _chkEvento = false;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"0A2A87BC-BBB4-43CF-9544-39ADBBD82A37",variableType:-4}
 */
var _chkSquadrati = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CCF2CA0F-A617-40D6-B18E-143CD7F5396F"}
 */
var _idEvento = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8BAE8010-F7E4-445F-AAA6-81A03E4D825F"}
 */
var _strRiep = ''

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
 * @properties={typeid:24,uuid:"4C58B5EF-B913-407B-802A-6D09CFB595F0"}
 */
function onDataChangeChkEvento(oldValue, newValue, event) {
	
	if(newValue == true){
		
		elements.lbl_evento.enabled = true
		elements.btn_filtri_ev.enabled = true
		
	}else{
		
		elements.lbl_evento.enabled = false
		elements.btn_filtri_ev.enabled = false
		
	}

	return true
	
}

/**
 * @param {JSFoundset} _fs
 * 
 * @properties={typeid:24,uuid:"58286119-D87B-48E9-98E6-E3132BF8B07B"}
 */
function FiltraEventiPeriodo(_fs)
{
	var _ftrEv = 'SELECT * FROM F_Gio_ElencoEventiPeriodo(?,?,?,?)';
	var _arrEv = new Array();
	    _arrEv.push(forms.giorn_header.idditta);
	    _arrEv.push(forms.giorn_filtri._dalGG);
		_arrEv.push(forms.giorn_filtri._alGG);
		_arrEv.push(forms.giorn_vista_mensile._tipoGiornaliera);
		
	var _dsEv = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_ftrEv,_arrEv,-1);

	_fs.removeFoundSetFilterParam('ftr_elencoEventiPeriodo');
	_fs.addFoundSetFilterParam('idevento','IN',_dsEv.getColumnAsArray(1),'ftr_elencoEventiPeriodo');

	return _fs;
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"B5206C17-ABBB-40AB-9DB9-6556C784AA81"}
 */
function aggiornaRiepilogoEventi(_rec){
	
	var _numFtr = _arrEvFiltri.length
	var _dsFtr = null
	var _strFtr = 'SELECT Evento,descriz FROM E2Eventi WHERE idEvento = ?'
	var _arrFtr = []
	_strRiep = ''
	
	for (var i=0; i<_numFtr; i++){
	    
		_arrFtr = new Array()
	    _arrFtr.push(_arrEvFiltri[i])
		_dsFtr = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_strFtr,_arrFtr,5)
		_strRiep = _strRiep.concat(_dsFtr.getValue(1,1), ' - ', _dsFtr.getValue(1,2), '\n')
		
	}
	
}
