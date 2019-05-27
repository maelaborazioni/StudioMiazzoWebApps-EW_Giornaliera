/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E4E93BC6-0B57-42A7-B66E-CD293E62E936",variableType:8}
 */
var vIdDitta = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"DAE6C92C-D7E0-4C89-A99C-0CD9EDA4EB8C",variableType:8}
 */
var vPeriodo = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"0E8B843C-AA64-427D-BBA3-A61191849055",variableType:8}
 */
var vIdGruppoInst = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E0BE1D93-A0B0-4995-BAB9-DAFFE759179C"}
 */
function onActionUploadExternalTrack(event) 
{
	plugins.file.showFileOpenDialog(null,null,false,null,uploadFile,'Seleziona file da importare');
}

/**
 * @param {Array<plugins.file.JSFile>} files
 *
 * @properties={typeid:24,uuid:"E9F603F4-FBC6-48B4-A615-5E56CE77AFD2"}
 */
function uploadFile(files) {
	var message = '';

	try {
		if (files && files[0]) 
		{
			var uri = globals.URI_FTP_SITO;
			var codDitta = globals.getCodDitta(vIdDitta);
			var fileDir = 'liveupdate/cliente/dati/' + codDitta + "/" + vIdGruppoInst + "/Tracciati";
			var fileName = codDitta + '_' + vPeriodo + '_Tracciato';
			
			var file = plugins.file.createTempFile(fileName,globals.FileExtension.TRK);
			file.setBytes(files[0].getBytes(), true);

			var content = plugins.file.readFile(file);
			if (content) {
				message = 'File caricato correttamente!';

				// upload to ftp
				var ftp = plugins.it2be_ftp.createJFTPclient(uri, globals.Security.FTP_GIORNALIERE.user, globals.Security.FTP_GIORNALIERE.password);
				if (!ftp || !ftp.connect())
					throw new Error('Impossibile connettersi al server ftp ' + uri);

				if (!ftp.cd(fileDir))
					throw new Error('Impossibile recuperare la directory ' + fileDir);

				ftp.put(file.getAbsolutePath(), fileName + globals.FileExtension.TRK);

				if (file)
					file.deleteFile();
			
				elements.btn_info.visible = true;
				elements.lbl_info.text = message;
				elements.lbl_info.fgcolor = 'green';
				elements.btn_confermaselgiorn.enabled = true;
				
			}
		}
	} catch (ex) 
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		message = 'Errore durante il caricamento del file. Contattare il servizio di assistenza dello studio';
		elements.btn_info.visible = true;
		elements.lbl_info.text = message;
		elements.lbl_info.fgcolor = 'red';
		//globals.ma_utl_showInfoDialog(message);
	}
	finally
	{
		if(ftp)
			ftp.disconnect();
	}
}
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3469B166-8F2D-4B91-BF44-A81EDFEF2865"}
 */
function onShow(firstShow, event) 
{
	_super.onShowForm(firstShow,event);
	
	plugins.busy.prepare();
	
	elements.lbl_info.text = '';
	elements.btn_info.visible = false;

	elements.btn_confermaselgiorn.enabled = false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"374ABEC5-91F5-43F0-939B-339C16754C2E"}
 */
function annullaImportazione(event) 
{
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7BD5F384-EC10-4570-A400-623296763CC3"}
 */
function confermaImportazione(event) 
{
	elements.lbl_info.text = '';
	elements.btn_info.visible = false;
	
	var params = {
        processFunction: process_importazione,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"2EFBA0AC-7E98-4D31-9867-9BF7CD61A2CD"}
 */
function process_importazione(event)
{
	globals.svy_mod_closeForm(event);
	globals.importaTracciatoDaFileEsterno(vIdDitta,vPeriodo,vIdGruppoInst);
	plugins.busy.unblock();
}