/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E626D79A-B316-4DC9-8308-A15FD8ECF3E8",variableType:4}
 */
var vIdRegola = -1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D5F6D814-4D74-47AB-9543-1C087BC51357",variableType:4}
 */
var vIdDitta = -1;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"88185397-1B4A-4D54-ABE5-95D9CB765AC4"}
 */
var currFrmName = forms.giorn_controllo_dip_senza_regole_associate_tbl.controller.getName() + '_temp';

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"F6B0C11A-AA1A-4BC3-B24C-BD6A6964BA96"}
 * @AllowToRunInFind
 */
function FiltraDittaRO(_fs) {

    var idDittaMain; 	
	
    //nel caso di ditta esterna di tipo interinale
    var arrDitteInterinali = globals.getDitteInterinali();
    if(arrDitteInterinali.indexOf(vIdDitta) != -1)
        idDittaMain = globals.getDittaRiferimento(vIdDitta);
    else
    	idDittaMain =  vIdDitta;
    
	_fs.addFoundSetFilterParam('idditta','=',idDittaMain);
	return _fs;

}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"1FC7F4AF-FAAC-4471-8B2A-823BDCFFB472"}
 */
function FiltraRegola(_fs) 
{
	_fs.addFoundSetFilterParam('idregole','=',vIdRegola);
	return _fs;

}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"50857E49-9432-4571-B273-662500B4C770"}
 * @AllowToRunInFind
 */
function AggiornaRegola(_rec) {
	
	_codRegola = _rec['codiceregola'];
	_descRegola = _rec['descrizioneregola'];
	vIdRegola = _rec['idregole'];
	
	var ass = forms[currFrmName]['assunzione']; //forms['giorn_controllo_dip_senza_regole_associate_tbl_temp']['assunzione'];
	var giorno =  utils.stringRight(ass,4) + utils.stringMiddle(ass,4,2) + utils.stringLeft(ass,2);

//  TODO AggiornaRegola verifica esistenza decorrenza	
	if(!ass || !giorno)
	{
		globals.ma_utl_showWarningDialog('Controllare la data di assunzione','Aggiornamento regola');
      return;
	}
	
	// se la regola è cambiata o non è ancora stato inserito un giorno di partenza va aggiornato il giorno di partenza stesso
	if (!_valoreAgg || _codRegola != _oldCodRegola)
	{
		var sqlRigaRegola = 'SELECT dbo.F_Regola_DefaultPartenza(?,?)';
		var arrRigaRegola = [_rec['idregole'], utils.parseDate(giorno, globals.ISO_DATEFORMAT)];
		var dsRigaRegola = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlRigaRegola, arrRigaRegola, 1);
		var riga = dsRigaRegola.getValue(1, 1);

		//aggiorniamo automaticamente il giorno di partenza della regola
		var fsGiorno = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, 'e2regolefasce');
		if (fsGiorno.find())
		{
			fsGiorno['idregole'] = _rec['idregole'];
			fsGiorno['riga'] = riga;
			fsGiorno.search();

		}
		_valoreAgg = riga;
		_descRiga = fsGiorno['e2regolefasce_to_e2fo_fasceorarie']['descrizautogenerata'];
	}
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A6B56848-E617-4B8C-9734-1D9EFDB1A470"}
 */
function annullaNuovaRegola(event) {
	
   globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
   globals.svy_mod_closeForm(event);
   
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private 
 * 
 * @properties={typeid:24,uuid:"461246A3-9BB6-43C2-A8D0-AF80B1A60DA8"}
 */
function confermaNuovaRegola(event) {
	
   if(validaRegola())
   {
     //Salva la/e nuova/e decorrenza/e
     var frm = forms[currFrmName]; //forms['giorn_controllo_dip_senza_regole_associate_tbl_temp'];
     var fs = frm.foundset;
   
     var rec = fs.getSelectedRecord();
     rec['valore'] = vIdRegola;
     rec['valoreagg'] = _valoreAgg;
     rec['regola'] = _codRegola + ' - ' + _descRegola;
  
     globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
     globals.svy_mod_closeForm(event);
   }
   else
	   globals.ma_utl_showWarningDialog('Controllare i valori inseriti per la regola','Inserimento nuova regola');
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
 * @properties={typeid:24,uuid:"35D452D0-1FB6-4F25-8707-49FC56220F23"}
 * @AllowToRunInFind
 */
function onDataChangeRegola(oldValue, newValue, event) {
	
	/** @type {JSFoundset<db:/ma_presenze/e2regole>} */
	var _foundset = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.REGOLE);

	if(_foundset.find())
	{
		var arrDitteInterinali = globals.getDitteInterinali();
	    if(arrDitteInterinali.indexOf(vIdDitta) != -1)
			_foundset.idditta = globals.getDittaRiferimento(vIdDitta);
		else
			_foundset.idditta = vIdDitta;
		_foundset.codiceregola = newValue;
	    _foundset.search();
	}
	if (_foundset.getSize() == 1)
	{
		_oldCodRegola = oldValue;
		AggiornaRegola(_foundset.getSelectedRecord());
		
	} else
		showLkpRegoleOrarie(event);
	
	return true;
}

/**
 * @param {JSEvent}  event
 * 
 * @properties={typeid:24,uuid:"CE343636-FCFA-4C81-9872-48847F953A57"}
 */
function showLkpRegoleOrarie(event)
{
	_oldCodRegola = _codRegola;
	globals.svy_nav_showLookupWindow(event, null, 'LEAF_Lkp_Regoleorarie', 'AggiornaRegola',
	                                 'FiltraDittaRO', null, null, '', true);
	
}

/**
 * @properties={typeid:24,uuid:"4BA84C10-525A-4A0C-BE88-C1B6D1721C4F"}
 * @AllowToRunInFind
 */
function validaRegola()
{
	if(vIdRegola && _codRegola && _valoreAgg)
	{
		/** @type {JSFoundset<db:/ma_presenze/e2regole>} */
		var _foundset = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.REGOLE);

		if(_foundset.find())
		{
			var arrDitteInterinali = globals.getDitteInterinali();
		    if(arrDitteInterinali.indexOf(vIdDitta) != -1)
				_foundset.idditta = globals.getDittaRiferimento(vIdDitta);
			else
				_foundset.idditta = vIdDitta;
			_foundset.codiceregola = _codRegola;
		    _foundset.search();
		}
		if (_foundset.getSize() == 1)
		return true;
	}
	
	return false;
}