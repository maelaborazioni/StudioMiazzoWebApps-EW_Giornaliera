/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"D4B9D774-0FF1-4DDC-B837-83B8E347B520"}
 */
function FiltraSediInstallazione(_fs){		
	
	_fs.addFoundSetFilterParam('idditta','=', _idditta)

	return _fs
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"C13B5DA7-F705-4126-B461-11F954A78C0E"}
 */
function FiltraGruppiLavoratori(_fs){		
	
	_fs.addFoundSetFilterParam('idDitta','=', _idditta)

	return _fs
}

/**
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"6842C64A-35F4-4D55-8780-D08E80F7CAC1"}
 * @AllowToRunInFind
 */
function AggiornaSelezioneDitta(_rec) 
{		
	if (_idditta != -1)
	{
		_codditta = _rec['codice']
		_ragionesociale = _rec['ragionesociale']		
	
		onDataChangeDitta(-1,_codditta,new JSEvent)
		
		controller.focusField('fld_mese',true)
	}
	
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"AF9CAB4E-CF81-49A7-BB9A-1B08CCF7F76F"}
 */
function AggiornaGruppiLavoratori(_rec)
{	
    _descgrlav = _rec['descrizione']
	_codgrlav = _rec['codice']
	
}

/**
 * @param {JSRecord} _rec
 *  *
 * @properties={typeid:24,uuid:"62FC1262-645E-4D5A-848A-766CF56FFF6E"}
 */
function AggiornaSediInstallazione(_rec){
	
	_idgruppoinst = _rec['idgruppoinst']
	_descgruppoinst = _rec['descrizione']
	
	
}

/**
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0B4FBCDA-8B18-47D3-BC72-A1DB400ED57E"}
 * @AllowToRunInFind
 */
function confermaDittaPeriodo(event)
{	
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		return;
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	globals.svy_mod_closeForm(event);
	
	globals.apriCartolina(event, _idditta, _anno, _mese, _anno, _mese, _idgruppoinst, _codgrlav,_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore);	
	
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"29A13223-C8DD-41BB-9B7B-6A4DD9A56D63"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event) 
{
	//_super.onShowForm(_firstShow, _event);
	
	elements.fld_cod_ditta.readOnly = false
	elements.fld_mese.readOnly = false
	elements.fld_anno.readOnly = false
//	if(elements.btn_selditta)
//	   elements.btn_selditta.enabled = true
//	if(elements.btn_selgruppoinst)
//	   elements.btn_selgruppoinst.enabled = false
//    if(elements.fld_cod_gr_inst)
//	   elements.fld_cod_gr_inst.enabled = false
//    if(elements.fld_gruppo_inst)
//       elements.fld_gruppo_inst.enabled = false
//	if(elements.btn_selgruppoinst)
//       elements.btn_selgruppoinst.enabled = true
			
    controller.focusField('fld_cod_ditta',true);
}

/**
 * @return {Boolean} whether the form is filled correctly
 * 
 * @properties={typeid:24,uuid:"EEFAD513-39F9-4687-9CDC-FFCBEE340B31"}
 */
function isFilled()
{
	return !(!_anno || !_mese || !_idditta); 
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
 * @properties={typeid:24,uuid:"7AF2ECB9-CEE2-4FBB-90A1-6D06FAF5CB04"}
 */
function onDataChangeMese(oldValue, newValue, event)
{
  	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"55A7F007-715F-4A59-9425-49858A997B61"}
 */
function annullaSelezione(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    globals.svy_mod_closeForm(event);
}


