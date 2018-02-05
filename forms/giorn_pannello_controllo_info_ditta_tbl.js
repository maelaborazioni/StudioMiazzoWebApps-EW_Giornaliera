/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @private
 *
 * @properties={typeid:24,uuid:"9D14EE08-2D26-4C41-8BE7-82EB3DD4DDFA"}
 * @SuppressWarnings(unused)
 */
function apriInfoRettifica(event) {
	
	var _frmName = 'giorn_pannello_controllo_info_rettifica_tbl_temp'
	
	forms.giorn_pannello_controllo_info_rettifica.elements.tab_info_rett.removeAllTabs()
	
	if(solutionModel.getForm(_frmName) != null ){
		
		history.removeForm(_frmName)
		solutionModel.removeForm(_frmName)
		
	}
	
	var _frm = solutionModel.cloneForm(_frmName,solutionModel.getForm('giorn_pannello_controllo_info_rettifica_tbl'))
	var _sqlInfoDip = "SELECT GU.idUpload, GU.idGruppoInst, GU.DataUpload AS DataInvio, L.Codice CodDipendente, "+ 
	                  "RTRIM(ISNULL(L.CodiceFiscale, '')) /*+ ' ' + RTRIM(ISNULL(L.NOME, ''))*/ AS Nominativo " +
					  "FROM E2LU_GestioneUpload GU INNER JOIN E2LU_GestioneUpload_Rettifiche GUR ON GU.IdUpload = GUR.IdUpload " + 
                      "INNER JOIN MA_Anagrafiche.dbo.Lavoratori L ON GUR.idDip = L.idLavoratore " +  
                      "WHERE (GU.idDitta = ? AND (GU.DaInviare = 0)) AND (GU.Periodo = ?)"    	
    var _arrInfoDip = new Array() //da passare idDitta e periodo
        _arrInfoDip.push(forms['giorn_pannello_controllo_tbl_temp']['_idDitta'])
		_arrInfoDip.push(forms['giorn_pannello_controllo_tbl_temp']['_periodo'])
	var _dsInfoDip = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlInfoDip,_arrInfoDip,250)
	var _dSourceInfoDip = _dsInfoDip.createDataSource('dSourceInfoDip',[JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.DATETIME,JSColumn.NUMBER,JSColumn.TEXT])
	
	solutionModel.getForm(_frmName).dataSource = _dSourceInfoDip
	solutionModel.getForm(_frmName).getField('fld_codice').dataProviderID = 'CodDipendente'
	solutionModel.getForm(_frmName).getField('fld_nominativo').dataProviderID = 'Nominativo'
	
	forms.giorn_pannello_controllo_info_rettifica.elements.tab_info_rett.addTab(_frmName,'',null,null,null)

	var winPannelloRett = application.createWindow('win_pannello_info_rettifica',JSWindow.MODAL_DIALOG)
    winPannelloRett.setInitialBounds(JSWindow.DEFAULT,JSWindow.DEFAULT,400,225)
    winPannelloRett.title = 'Dettaglio dipendenti rettificati'
   	winPannelloRett.show(forms.giorn_pannello_controllo_info_rettifica)
	
}


