/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"352365B5-B953-4D10-8A29-7A73793B40A9"}
 * @AllowToRunInFind
 */
function onRecordSelection(event, _form) {
	
	var _dtlFrm = forms.giorn_ratei_gestione_tab_dtl;
	var _fs = forms['giorn_ratei_gestione_tab_tbl_temp'].foundset;
	_dtlFrm._codRateo = _fs['codicerateo'];
	
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'ditte_ratei');
	if(fs.find())
	{
		fs['codice'] = _dtlFrm._codRateo;
		fs['idditta'] = forms.giorn_ratei_gestione_tab._idditta;
		fs.search();
	}
	_dtlFrm._descRateo = fs['descrizione'];
	_dtlFrm._tipoRateo = _fs['tiporateo'];
	_dtlFrm._valoreRateo = _fs['valore'];
	_dtlFrm._dataRateo = _fs['datarateo'];
	
	return _super.onRecordSelection(event, _form);

}
