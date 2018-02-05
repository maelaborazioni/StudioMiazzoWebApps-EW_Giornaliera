/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2723D62C-2EC0-4EBF-8520-7999800C5311",variableType:4}
 */
var _idDitta = -1
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"5B50DEFB-ABE0-4A41-98BB-4B10C5131A9C",variableType:4}
 */
var _periodo = -1

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FF3F2513-8287-450C-85EB-F4B1A5D56ED1"}
 * @SuppressWarnings(unused)
 */
function apriInfoDitta(event) {
	
	var _frmName = 'giorn_pannello_controllo_info_ditta_tbl_temp'
	
	forms.giorn_pannello_controllo_info_ditta.elements.tab_info_ditta.removeAllTabs()
	
	if(solutionModel.getForm(_frmName) != null ){
		
		history.removeForm(_frmName)
		solutionModel.removeForm(_frmName)
		
	}
	
	var _frm = solutionModel.cloneForm(_frmName,solutionModel.getForm('giorn_pannello_controllo_info_ditta_tbl'))
	
	var _sqlInfoDitta = "SELECT GU.idUpload, GU.idGruppoInst, GU.DataUpload AS DataInvio, COUNT(GUR.idDip) AS NumDip FROM E2LU_GestioneUpload GU LEFT OUTER JOIN E2LU_GestioneUpload_Rettifiche GUR ON GU.IdUpload = GUR.IdUpload WHERE (GU.idDitta = ?) AND (GU.DaInviare = 0) AND (GU.Periodo = ?) GROUP BY GU.idUpload, GU.idGruppoInst, GU.DataUpload ORDER BY DataInvio"
    var _arrInfoDitta = new Array() //da passare idDitta e periodo
        _arrInfoDitta.push(_idDitta)
		_arrInfoDitta.push(_periodo)
	var _dsInfoDitta = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlInfoDitta,_arrInfoDitta,200)
	var _numDip
	if (_dsInfoDitta.addColumn('Info', 5) && _dsInfoDitta.addColumn('Rettifica', 6, JSColumn.NUMBER) 
			&& _dsInfoDitta.addColumn('Tipo',7,JSColumn.TEXT) && _dsInfoDitta.addColumn('OraInvio',8,JSColumn.DATETIME)) {
		for (var i = 1; i <= _dsInfoDitta.getMaxRowIndex(); i++) {

			//impostiamo il flag visivo di stato a seconda della presenza o meno di una incongruenza
			if (_dsInfoDitta.getValue(i, 4) > 0){
				
				_numDip = _dsInfoDitta.getValue(i,4)
				_dsInfoDitta.setValue(i,5,"media:///hr_q_info_16.png")
				_dsInfoDitta.setValue(i,6,1)
			    _dsInfoDitta.setValue(i,7,"Numero rettifiche : " + _numDip)
				
			}else{
				_dsInfoDitta.setValue(i, 6, 0)
				_dsInfoDitta.setValue(i,7,"Giornaliera completa")
			}	
			_dsInfoDitta.setValue(i,8,_dsInfoDitta.getValue(i,3))
		}

	}
	var _dSourceInfoDitta = _dsInfoDitta.createDataSource('_dSourceInfoDitta',[JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.DATETIME,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.DATETIME])	
	
	solutionModel.getForm(_frmName).dataSource = _dSourceInfoDitta
	solutionModel.getForm(_frmName).getField('fld_data_invio').dataProviderID = 'DataInvio'
	solutionModel.getForm(_frmName).getField('fld_ora_invio').dataProviderID = 'OraInvio'
	solutionModel.getForm(_frmName).getField('fld_rettifica').dataProviderID = 'Rettifica'
	solutionModel.getForm(_frmName).getField('fld_tipo').dataProviderID = 'Tipo'
	solutionModel.getForm(_frmName).getField('fld_info').dataProviderID = 'Info'
		
	var _nomeMese = globals.getNomeMese(forms.giorn_pannello_controllo._mese)
	
	forms.giorn_pannello_controllo_info_ditta.elements.tab_info_ditta.addTab(_frmName,'',null,null,null)
	forms.giorn_pannello_controllo_info_ditta.elements.lbl_header.text = 'Ditta in esame : ' + foundset['ragionesociale'] + '- Periodo : ' + _nomeMese + ' ' + forms.giorn_pannello_controllo._anno
	
	var winPannelloInfoDitta = application.createWindow('win_pannello_info_ditta',JSWindow.MODAL_DIALOG)
	winPannelloInfoDitta.setInitialBounds(JSWindow.DEFAULT,JSWindow.DEFAULT,425,275)
	winPannelloInfoDitta.title = 'Dettaglio flusso mensile'
		
	winPannelloInfoDitta.show(forms.giorn_pannello_controllo_info_ditta)
	
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"BFFAFC06-91CB-4B24-A7D8-DD3014D60870"}
 */
function onRecordSelection(event, _form) {

	_idDitta = foundset['idditta']
	return _super.onRecordSelection(event, _form)
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F4C65BBA-C428-4FB7-AFBD-01E44E41E1B1"}
 */
function onShow(firstShow, event) {

	_periodo = forms.giorn_pannello_controllo._anno * 100 + forms.giorn_pannello_controllo._mese
    foundset.setSelectedIndex(1)
}
