/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E2DD717B-441F-431C-B8FB-67FAD27B9EC0",variableType:8}
 */
var _gg;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"9F4E7D48-9C29-434E-9627-1F66B4125E72",variableType:8}
 */
var _ggSucc;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C85BFDE8-9515-419F-A58F-BBEE56BAAB3B",variableType:8}
 */
var _MM;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"70D6DDDE-FF6F-4C18-A692-F0D3467986F1"}
 */
var _orologio = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3B4BE750-1BCA-4631-AD72-E34EC8DD986C",variableType:4}
 */
var _senso;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F7677658-BBD8-4398-BF57-02B9C2511858"}
 */
var _timbr = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"660495C1-34FE-49EF-BA87-F8731887D7A0",variableType:8}
 */
var _yy;

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"52AF209A-40EB-402F-910B-5BBCCB6C15F4"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
	
	_senso = 0;
	_timbr = '--.--';
	_orologio = null;
	_ggSucc = 0;
	
	databaseManager.startTransaction();
	
	return;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Number}  [idlavoratore]
 * @param {Date} [day]
 * @param {Boolean} [daCartolina]
 *
 * @properties={typeid:24,uuid:"FB953547-A9EF-4A7C-BA13-8C60544160AD"}
 */
function confermaAggiungiTimbr(event,idlavoratore,day,daCartolina) {
	
	var nrBadge = globals.getNrBadge(idlavoratore ? idlavoratore : foundset.iddip,day); 
	if(nrBadge == null)
	{
		globals.ma_utl_showWarningDialog('Nessun numero di badge associato al dipendente. L\'inserimento non può avvenire','Inserimento timbratura immediata');
		globals.ma_utl_setStatus(globals.Status.BROWSE,event.getFormName());
		globals.svy_mod_closeForm(event);
	}
	
	databaseManager.setAutoSave(false);
	
	if(foundset.newRecord())
	{
		foundset.iddip = idlavoratore;
		foundset.nr_badge = nrBadge;
		foundset.senso = _senso;
		foundset.indirizzo = _orologio;
		foundset.timbeliminata = false;
		foundset.ggsucc = _ggSucc;
		foundset.idgruppoinst = globals.getGruppoInstallazioneLavoratore(idlavoratore);
		var _hh = parseInt(utils.stringLeft(_timbr,2),10);
		var _mm = parseInt(utils.stringRight(_timbr,2),10);
		_yy = day.getFullYear();
		_MM = day.getMonth() + 1;
		_gg = day.getDate();
		
        var _newTimbr = _yy * 100000000 + _MM * 1000000 + _gg * 10000 + _hh * 100 + _mm;
		foundset.timbratura = _newTimbr;
	
	}
    
	if(!databaseManager.commitTransaction())
	{
		databaseManager.rollbackTransaction();
		globals.ma_utl_showWarningDialog('Inserimento non riuscito, si prega di riprovare','Inserimento timbratura immediata');
	}
	else
	{
		// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
		// la compilazione di base che ve a creare il record nella tabella e2giornaliera
		if(globals.getIdGiornalieraDaIdLavGiorno(idlavoratore,day) == null)
		   globals.compilaDalAlSingoloSync(idlavoratore,[_gg],day.getFullYear() * 100 + day.getMonth() + 1);
		
		if(daCartolina)
			forms.giorn_header.preparaGiornaliera(false,null,true);
		else
			globals.ma_utl_showWarningDialog('Timbratura inserita correttamente!','Inserimento timbratura immediata');
	}   
	globals.ma_utl_setStatus(globals.Status.BROWSE,event.getFormName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D1774C0C-4F5E-428B-B6AB-04073404A11E"}
 */
function annullaAggiungiTimbr(event) {
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,event.getFormName());
	globals.svy_mod_closeForm(event);
}
