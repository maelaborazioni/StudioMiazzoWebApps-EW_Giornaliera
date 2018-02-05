/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2230CC30-CF4B-4243-96E3-AD5DEC8293AC"}
 * @AllowToRunInFind
 */
function confermaSelezioneAnomalieTimbrature(event) 
{
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		return;
	}
	/** @type {Array<Number>}*/
	var arrDitte = globals.getDitte();
	var dataUltimoScarico = globals.getDataUltimoScarico(arrDitte);
	var _annoUltimoScarico = dataUltimoScarico.getFullYear();
	var _meseUltimoScarico = dataUltimoScarico.getMonth() + 1;
	
	if(dataUltimoScarico == null ||_annoUltimoScarico < _anno || _annoUltimoScarico == _anno && _meseUltimoScarico < _mese)
	{
		globals.svy_mod_closeForm(event);
		globals.ma_utl_showInfoDialog('Non sono ancora state acquisite delle timbrature per il periodo selezionato',
			                          'Anomalie timbrature ditta');
		return;
	}
	
	var params = {
		processFunction: process_anomalie_timbrature,
		message: '',
		opacity: 0.5,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [event,dataUltimoScarico]
	};
	plugins.busy.block(params);
}

/**
 * @param {JSEvent} event
 * @param {Date} dataUltimoScarico
 *
 * @properties={typeid:24,uuid:"70BAC726-E3CC-446B-BD4C-964AA3C4DD99"}
 */
function process_anomalie_timbrature(event,dataUltimoScarico)
{
	try
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
			
		salvaSelezione(_codditta.toString(),_anno,_mese,_idgruppoinst,_codgrlav);
				
		apriProgramAnomalie(dataUltimoScarico);	
	}
	catch(ex)
	{
		var msgEx = 'Metodo process_anomalie_timbrature : ' + ex.message;
		globals.ma_utl_showErrorDialog(msgEx)
	}
	finally
	{
		plugins.busy.unblock();
		globals.svy_mod_closeForm(event);
	}
}

/**
 * @param {Date} [dataUltimoScaricoEffettuato]
 * 
 * @properties={typeid:24,uuid:"FCA1E672-547B-4191-98FB-863CACBC3453"}
 */
function apriProgramAnomalie(dataUltimoScaricoEffettuato)
{
	/** @type {Array<Number>}*/
	var arrDitte = globals.getDitte();
	var dataUltimoScarico = dataUltimoScaricoEffettuato ? dataUltimoScaricoEffettuato : globals.getDataUltimoScarico(arrDitte);
	var _meseUltimoScarico = dataUltimoScarico.getMonth() + 1;
	var _ggUltimoScarico = dataUltimoScarico.getDate();
	
	var _progName = 'TimbratureMancantiDitta';
	var _progObj = globals.nav.program[_progName];
	_progObj.empty_foundset = true;
	_progObj.filter = null;  
    _progObj.foundset = null;	
    
	var _ggUltimo = _meseUltimoScarico == _mese ? new Date(_anno,_mese - 1,_ggUltimoScarico - 1) 
	                                              : new Date(_anno,_mese - 1 ,globals.getTotGiorniMese(_mese,_anno));
	
	var _parObj = { anno : _anno,
                    mese : _mese,
					al : _ggUltimo
                  };
	
	if(globals.haAnomalieTimbrDitta(_idditta,_anno,_mese,_ggUltimo.getDate()))
	{
	   globals.openProgram(_progName,_parObj,true);
	   var frm = forms.giorn_timbr_mancanti_ditta;
	   frm.foundset.loadRecords(_idditta);
       frm.annoRif = _anno;
       frm.meseRif = _mese;
       frm.ggRif = _ggUltimo;
       frm.limitaAl = _ggUltimo;
	}
	else
	   globals.ma_utl_showInfoDialog('Nessuna anomalia nelle timbrature per il periodo selezionato','Anomalie timbrature ditta');
	
}
