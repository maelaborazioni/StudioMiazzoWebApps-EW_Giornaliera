/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"459FB40E-57A7-41BB-A922-4645457DD137",variableType:4}
 */
var vIdDitta = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C881474F-5AF3-4703-9B51-6F5C9C794C8E",variableType:4}
 */
var vPeriodo = 0;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"EEB6A727-DD6B-48C3-A790-2272775A1DEE",variableType:-4}
 */
var vEventiSelezionabili = [];

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"569B5EB8-B297-46C1-9236-94016E3F2EB5"}
 */
var vCodEventoOld = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"BB270F98-D738-4E8C-9C15-B088D9141FD5"}
 */
var vDescEventoOld = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F300F971-10D6-432B-AAF5-3A56FA30AE8E"}
 */
var vCodEventoNew = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6AB17DF6-86DD-4156-A1CB-226DC0AB6DA4"}
 */
var vDescEventoNew = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"50C4EE59-4B1E-4C13-A36D-983756DDF507",variableType:4}
 */
var vIdEventoOld = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4577E6DC-02BB-4866-AAB4-C8D7442240CF",variableType:4}
 */
var vIdEventoNew = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3B155113-881A-47E1-AE53-D2BA9F89CF09",variableType:4}
 */
var vIdEventoClasseOld = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"607C2970-382D-4B3E-ABDB-7AD1A8DD7BA2",variableType:4}
 */
var vIdEventoClasseNew = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D18BDDF7-C608-43DB-980E-871F12D4921F"}
 */
var vCodProprietaOld = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CEEB8FB1-66C3-4B28-9E03-CF426283DD10"}
 */
var vDescProprietaOld = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B9973212-0ED2-4BE4-A6EC-5357B1CB27FD"}
 */
var vCodProprietaNew = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6AA534FC-CF9E-443E-AC2A-B5C16490025D"}
 */
var vDescProprietaNew = '';

/**
 * @type {Date}
 * @properties={typeid:35,uuid:"025010D6-93D8-4B5E-9D10-E274217B0372",variableType:93}
 */
var vDateFrom = null;

/**
 * @type {Date}
 * @properties={typeid:35,uuid:"90B2A755-7E55-453F-B245-1BC92B602F3E",variableType:93}
 */
var vDateTo = null;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"18393E04-BBF0-44C6-8625-FAACBC2B60FC",variableType:-4}
 */
var _arrIdPropSelezionabili = [];

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"FB7CF15F-D781-486E-A0C6-037418696C1D"}
 */
var vProprietaOld = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"7148A852-DF92-4F37-9315-048423D12472"}
 */
var vProprietaNew = null;

/**
 * @properties={typeid:35,uuid:"CF4D0D7D-0FD7-4F3A-B8AE-156BDCAF11E5",variableType:-4}
 */
var boolNew = false;


/**
 * @type {JSRecord<db:/ma_presenze/e2eventi>}
 * 
 * @properties={typeid:35,uuid:"E5189CC0-3F79-4D13-B6A8-57513F864662",variableType:-4}
 */
var rec = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F9B75AEE-9B17-491D-B582-1B65CF0431CC"}
 */
function confermaCambiaEvento(event) 
{
	if (validaCambioEvento()) 
	{
		var params = {
	        processFunction: process_cambia_evento,
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
	} else
		globals.ma_utl_showWarningDialog('Controllare i campi inseriti e riprovare', 'Cambio evento');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"24283E49-4C71-48B8-85B3-27B1629BB29F"}
 */
function process_cambia_evento(event)
{
	try
	{
		var dipendentiSelezionati = forms[elements.dipendenti_tabless.getTabFormNameAt(1)].getSelectedElements();
			
		globals.cambiaEventoAsync(vIdDitta
				                 ,vPeriodo
								 ,dipendentiSelezionati
								 ,vDateFrom
								 ,vDateTo
								 ,vIdEventoOld
								 ,vIdEventoNew
								 ,vProprietaOld == null ? '' : vProprietaOld
								 ,vProprietaNew == null ? '' : vProprietaNew
								 ,forms.giorn_vista_mensile._tipoGiornaliera
								 ,globals.TipoConnessione.CLIENTE);
		
		globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_cambia_evento : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
		
}

/**
 * @properties={typeid:24,uuid:"7156FC1B-30DF-4229-8932-2035457A15A1"}
 */
function validaCambioEvento()
{
	if(!vIdEventoClasseOld || !vIdEventoClasseNew  
			|| (elements.fld_proprieta_old.enabled && vProprietaOld == null) 
			|| (elements.fld_proprieta_new.enabled && vProprietaNew == null))
	    return false;
	else
		return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"69138CBE-9A74-4E38-A64C-63BBA091404C"}
 */
function annullaCambiaEvento(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Aggiorna i campi codice e vento e descrizione dopo la selezione dell'evento desiderato e
 * la valuelist delle proprietà selezionabili per il determinato evento
 *  
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 *
 * @properties={typeid:24,uuid:"84E42FF5-7B16-4F25-8BE1-63940047EB88"}
 */
function AggiornaEventoOld(_rec) 
{	
	vIdEventoOld = _rec.idevento;
	vIdEventoClasseOld = _rec.e2eventi_to_e2eventiclassi.ideventoclasse;
	vCodEventoOld = _rec.evento;
	vDescEventoOld = _rec.descriz;
	
    updateVlsProprietaOld();
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * @properties={typeid:24,uuid:"38E6E097-8F33-4182-84B7-1D3B15F711AA"}
 */
function updateVlsProprietaOld()
{
    var numPropEv = globals.getVlsProprietaEvento(vIdEventoOld);
	
	switch(numPropEv)
	{
		case 2 :
		elements.fld_proprieta_old.enabled = true;	
		vProprietaOld = 'D';
		application.setValueListItems('vls_evento_proprieta',new Array('Diurno','Notturno'),new Array('D','N'));
		break;
		case 4 :
		elements.fld_proprieta_old.enabled = true;	
		vProprietaOld = 'G';
		application.setValueListItems('vls_evento_proprieta',new Array('Accantonata','Goduta','Retribuita','Non retribuita'),new Array('A','G','R','N'));
	    break;
	    default:
	    elements.fld_proprieta_old.enabled = false;	
	    application.setValueListItems('vls_evento_proprieta',new Array(),new Array());
	    vProprietaOld = null;
	    break;
	}
}

/**
 * Aggiorna i campi codice evento e descrizione dopo la selezione dell'evento desiderato e
 * la valuelist delle proprietà selezionabili per il determinato evento
 * 
 * @param {JSRecord<db:/ma_presenze/e2eventi>} _rec
 *
 * @properties={typeid:24,uuid:"16D04B98-4672-4FC0-8BAF-3C4E43225A3D"}
 */
function AggiornaEventoNew(_rec) 
{	
	vIdEventoNew = _rec.idevento;
	vIdEventoClasseNew = _rec.e2eventi_to_e2eventiclassi.ideventoclasse;
	vCodEventoNew = _rec.evento;
	vDescEventoNew = _rec.descriz;
	
	updateVlsProprietaNew();
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * @properties={typeid:24,uuid:"C5CF801E-C5E2-4144-A18F-C4CE6AD55409"}
 */
function updateVlsProprietaNew()
{
	var numPropEv = globals.getVlsProprietaEvento(vIdEventoNew);
	
	switch(numPropEv)
	{
		case 2 :
		elements.fld_proprieta_new.enabled = true;	
		vProprietaNew = 'D';
		application.setValueListItems('vls_evento_proprieta_new',new Array('Diurno','Notturno'),new Array('D','N'));
		break;
		case 4 :
		elements.fld_proprieta_new.enabled = true;	
		vProprietaNew = 'G';
		application.setValueListItems('vls_evento_proprieta_new',new Array('Accantonata','Goduta','Retribuita','Non retribuita'),new Array('A','G','R','N'));
	    break;
	    default:
	    elements.fld_proprieta_new.enabled = false;	
	    application.setValueListItems('vls_evento_proprieta_new',new Array(),new Array());
	    vProprietaNew = null;
	    break;
	}
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"C26BB49B-C8F0-4D26-8FFF-8469AA358020"}
 */
function AggiornaProprietaOld(_rec)
{	
	vCodProprietaOld = _rec['codiceproprieta'];
	vDescProprietaOld = _rec['descrizione'];
}

/**
 * @param {Object} _rec
 *
 * @properties={typeid:24,uuid:"C094EDF5-23FB-437F-B28D-D1A3A30E90E8"}
 */
function AggiornaProprietaNew(_rec)
{	
	vCodProprietaNew = _rec['codiceproprieta'];
	vDescProprietaNew = _rec['descrizione'];
}

/**
*
* @param {JSFoundset} _fs
*
* @properties={typeid:24,uuid:"08A94F98-2749-4CE7-821F-1FF23E8696FA"}
*/
function FiltraProprieta(_fs)
{
	_fs.addFoundSetFilterParam('idevento','=',vIdEventoNew,'idEventoFilter');
	_fs.addFoundSetFilterParam('ideventoclasse','=',vIdEventoClasseNew,'eventoClasseFilter');
	return _fs;	
}

/**
 * @param {Number} idEvento
 *
 * @properties={typeid:24,uuid:"4217548B-6AA0-416C-B587-8E67ECF32EC2"}
 */
function FiltraProprietaSelezionabili(idEvento)
{	
	var bReturn = false;
	var url = globals.WS_URL + "/Eventi/FiltraProprieta";
	/** @type Number*/
	var periodo = globals.getPeriodo();
	
	var gg = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel - globals.offsetGg;
		
	var params = globals.inizializzaParametriFiltroEvento(
					 forms.giorn_header.idditta
					,periodo
					,forms.giorn_vista_mensile._tipoGiornaliera //,globals.TipoGiornaliera.NORMALE
					,globals._tipoConnessione
					,[gg]
					,[-1]
					,idEvento
					);
	
	var response = globals.getWebServiceResponse(url, params);

	/** @type {Array} */
	_arrIdPropSelezionabili = response['proprieta'];
	if (_arrIdPropSelezionabili.length > 0)
	    bReturn = true;
	else
		globals.ma_utl_showWarningDialog('Non esistono proprietà selezionabili, riprovare o verificare','i18n:hr.msg.attention');
		
	return bReturn;
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"01CD13A2-9DC0-434A-88FE-99DE738900C2"}
 */
function FiltraProprietaOld(_fs)
{
	_fs.addFoundSetFilterParam('ideventoclasse','=',vIdEventoClasseOld,'ftr_propSelezionabiliIdEventoClasse');
	_fs.addFoundSetFilterParam('idevento', '=', vIdEventoOld, 'ftr_propSelezionabiliIdEvento');
	
	return _fs;	
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"92F60FA0-7ECC-4F85-A206-63C8EC95D2D8"}
 */
function FiltraProprietaNew(_fs)
{
	_fs.addFoundSetFilterParam('ideventoclasse','=',vIdEventoClasseNew,'ftr_propSelezionabiliIdEventoClasse');
	_fs.addFoundSetFilterParam('idevento', '=', vIdEventoNew, 'ftr_propSelezionabiliIdEvento');
	
	return _fs;	
}

/**
 * Filtra gli eventi presenti e modificabili in giornaliera per la ditta nel mese indicato
 * (non presenta gli eventi gestiti con storico)
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"27D7BF84-5DAC-417C-A267-AA7994E5E650"}
 */
function FiltraEventiOld(_fs)
{
	var _sqlEvSel = 'SELECT EEP.idEvento FROM F_Gio_ElencoEventiPeriodo(?,?,?,?) EEP \
	                 INNER JOIN E2EventiClassi EC \
                     ON EEP.idEventoClasse = EC.IdEventoClasse \
                     WHERE EC.GestitoConStorico = 0';
	
	var _arrEvSel = [forms.giorn_header.idditta,
	                 globals.dateFormat(globals.getFirstDatePeriodo(globals.getPeriodo()),globals.ISO_DATEFORMAT),
					 globals.dateFormat(globals.getLastDatePeriodo(globals.getPeriodo()),globals.ISO_DATEFORMAT),
					 forms.giorn_vista_mensile._tipoGiornaliera];
	var _dsEvSel = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlEvSel,_arrEvSel,-1);
		
	_fs.addFoundSetFilterParam('idevento','IN', _dsEvSel.getColumnAsArray(1), 'ftr_evSelezionati');
    
	return _fs;
}

/**
 * Filtra gli eventi selezionabili per la ditta
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"E619BBCB-6A06-4E5E-B80E-291B830EC056"}
 */
function FiltraEventiNew(_fs)
{
	// TODO 
	var sqlEv = "SELECT idEvento FROM E2Eventi E INNER JOIN E2EventiClassi EC \
 	           ON E.IdEventoClasse = EC.IdEventoClasse WHERE EC.GestitoConStorico = 0";
	var dsEv = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlEv,[],-1);
	
	_fs.addFoundSetFilterParam('idevento','IN',dsEv.getColumnAsArray(1));
	_fs.addFoundSetFilterParam('idevento','IN',globals._arrIdEvSelezionabili);
	return _fs;

}

/**
 * @properties={typeid:24,uuid:"281B7BB1-881F-409D-BE52-FA0DE1A5344C"}
 */
function onShowForm(firstShow, event)
{
	_super.onShowForm(firstShow, event);
	
//	elements.btn_codproprieta_old_lkp.enabled =
//		elements.btn_codproprieta_new_lkp.enabled =
//			elements.fld_codiceproprieta_old.enabled =
//				elements.fld_codiceproprieta_new.enabled =
//					elements.fld_descproprieta_new.enabled =
//						elements.fld_descproprieta_old.enabled = false;
//	elements.btn_idevento_old_lkp.enabled = 
//		elements.btn_idevento_new_lkp.enabled = 
//			elements.fld_idevento_old.enabled = 
//				elements.fld_descevento_old.enabled = 
//					elements.fld_idevento_new.enabled = 
//						elements.fld_descevento_old.enabled = true;
	
	vProprietaOld = vProprietaNew = null;
	
	elements.fld_proprieta_old.enabled =
		elements.fld_proprieta_new.enabled = false;
						
    globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	
    //vIdEventoOld = 
    vIdEventoNew = null;
	//vCodEventoOld = 
	vCodEventoNew = '';
	//vDescEventoOld = 
	vDescEventoNew = '';
	//vCodProprietaOld = 
	vCodProprietaNew = '';
	//vDescProprietaOld = 
	vDescProprietaNew = '';
	
	if(rec == null)
	   application.setValueListItems('vls_evento_proprieta',new Array(),new Array());
	else
       AggiornaEventoOld(rec);
	
	//vCodProprietaOld = 
    vCodProprietaNew = null;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	
	if(globals._arrIdEvSelezionabili == null)
		   globals.FiltraEventiSelezionabili
		   (
			   forms.giorn_header.idlavoratore, 
			   globals.getAnno() * 100 + globals.getMese(),
			   forms.giorn_vista_mensile._tipoGiornaliera
		   );	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1E0E7CC4-B713-411F-BAFF-F0777648B995"}
 */
function onHide(event)
{
	if(_super.onHide(event))
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		return true;
	}
	
	return false;
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CDEB13F1-65C7-4B5B-BB56-8F2129C3C07A"}
 */
function onDataChangeEventoOld(oldValue, newValue, event) {
	
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventi'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventi'].table_name);
	
	// Filtra gli eventi selezionabili
	_foundset.addFoundSetFilterParam('idevento','IN',globals._arrIdEvSelezionabili,'ftr_evSelezionabili');
	_foundset.addFoundSetFilterParam('evento', '=', newValue.toUpperCase());
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {
		
		if (globals.needsCertificate(_foundset.ideventoclasse)) 
		{
		    globals.ma_utl_showWarningDialog('L\'evento è gestibile solo attraverso le certificazioni','Conferma selezione evento');
		    vCodEventoNew = '';
		    return true;
		}

		vIdEventoOld = _foundset['idevento'];
		vDescEventoOld = _foundset['descriz'];
		vIdEventoClasseOld = _foundset['ideventoclasse'];
		
		AggiornaEventoOld(_foundset.getSelectedRecord());
		
	} else {
		vCodEventoOld = oldValue;
		showLkpAlberoEventiOld(event);
	}

	return true;
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"448F2650-1DE7-4575-BB3D-CC20C9ED221B"}
 */
function onDataChangeEventoNew(oldValue, newValue, event) {
	
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */
	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventi'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventi'].table_name);
	
	// Filtra gli eventi selezionabili
	_foundset.addFoundSetFilterParam('idevento','IN',globals._arrIdEvSelezionabili,'ftr_evSelezionabili');
	_foundset.addFoundSetFilterParam('evento', '=', newValue.toUpperCase());
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {

		if (globals.needsCertificate(_foundset.ideventoclasse)) 
		{
		    globals.ma_utl_showWarningDialog('L\'evento è gestibile solo attraverso le certificazioni','Conferma selezione evento');
		    vCodEventoNew = oldValue;
		    return true;
		}
		
		vIdEventoNew = _foundset['idevento'];
		vDescEventoNew = _foundset['descriz'];
		vIdEventoClasseNew = _foundset['ideventoclasse'];
		
		AggiornaEventoNew(_foundset.getSelectedRecord());
		
	} else {
		vCodEventoNew = oldValue;
		showLkpAlberoEventiNew(event);
	}

	return true;
}

/**
 * 
 * @param {Object} oldValue
 * @param {Object} newValue
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"42CA4FEE-9A3F-43FD-86C6-1426ACB2A4E7"}
 */
function onDataChangePropOld(oldValue, newValue, event) {

	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventiproprieta'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventiproprieta'].table_name)
	
	_foundset.addFoundSetFilterParam('ideventoclasse', '=', vIdEventoClasseOld);
	_foundset.addFoundSetFilterParam('codiceproprieta', '=', newValue);
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {
		vIdEventoClasseOld = _foundset['ideventoclasseproprieta'];
		vCodProprietaOld = _foundset['codiceproprieta'];
		vDescProprietaOld = _foundset['descrizione'];
		
	} else {
		
		vCodProprietaOld = oldValue;
		
		globals.svy_nav_showLookupWindow(event, 'vCodProprietaOld', 'LEAF_Lkp_Eventiproprieta', 'AggiornaProprietaOld',
			                             'FiltraProprietaOld', null, null, 'codiceproprieta', true);
	}

	return true;
}

/**
 * 
 * @param {Object} oldValue
 * @param {Object} newValue
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4C6EF96D-DABE-40E5-9469-1D1DC3941599"}
 */
function onDataChangePropNew(oldValue, newValue, event) {

	var _foundset = databaseManager.getFoundSet(globals.nav.program['LEAF_Lkp_Eventiproprieta'].server_name,
		                                        globals.nav.program['LEAF_Lkp_Eventiproprieta'].table_name)
	
	_foundset.addFoundSetFilterParam('ideventoclasse', '=', vIdEventoClasseNew);
	_foundset.addFoundSetFilterParam('codiceproprieta', '=', newValue);
	_foundset.loadAllRecords();

	if (_foundset.getSize() == 1) {
		vIdEventoClasseNew = _foundset['ideventoclasseproprieta'];
		vCodProprietaNew = _foundset['codiceproprieta'];
		vDescProprietaNew = _foundset['descrizione'];
		
	} else {
		
		vCodProprietaNew = oldValue;
		
		globals.svy_nav_showLookupWindow(event, 'vCodProprietaNew', 'LEAF_Lkp_Eventiproprieta', 'AggiornaProprietaNew',
			                             'FiltraProprietaNew', null, null, 'codiceproprieta', true);
	}

	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"67F5EE5A-1FEB-4CC0-ABED-AA7FA6EF1C87"}
 */
function showLkpAlberoEventiOld(event) 
{
	var _sqlEvSel = 'SELECT EEP.idEvento FROM F_Gio_ElencoEventiPeriodo(?,?,?,?) EEP \
			         INNER JOIN E2EventiClassi EC \
			         ON EEP.idEventoClasse = EC.IdEventoClasse \
			         WHERE EC.GestitoConStorico = 0';

    var _arrEvSel = [forms.giorn_header.idditta,
			         globals.dateFormat(globals.getFirstDatePeriodo(globals.getPeriodo()),globals.ISO_DATEFORMAT),
					 globals.dateFormat(globals.getLastDatePeriodo(globals.getPeriodo()),globals.ISO_DATEFORMAT),
					 globals.TipoGiornaliera.NORMALE];
    
    var _dsEvSel = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlEvSel,_arrEvSel,-1);
    
    globals._arrIdEvSelezionabiliCE = _dsEvSel.getColumnAsArray(1);
    
    boolNew = false;
    forms.giorn_lkp_eventi._destFormName = controller.getName();
    forms.giorn_lkp_eventi.arrIdEventi = globals._arrIdEvSelezionabiliCE;
	globals.ma_utl_showFormInDialog(forms.giorn_lkp_eventi.controller.getName(),'Eventi selezionabili');
}

/**
 * Visualizza l'albero di selezione del nuovo evento per la ditta
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"32BB8DDB-CDDB-4042-B280-9D47E6FE79CF"}
 */
function showLkpAlberoEventiNew(event)
{
	// TODO solo eventi selezionabili per la ditta in questione
	var _sqlEvSel = 'SELECT E.idEvento FROM E2Eventi E \
			        INNER JOIN E2EventiClassi EC \
			        ON E.idEventoClasse = EC.IdEventoClasse \
			        WHERE EC.GestitoConStorico = 0';

    var _arrEvSel = [];

    var _dsEvSel = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlEvSel,_arrEvSel,-1);

    globals._arrIdEvSelezionabiliCE = _dsEvSel.getColumnAsArray(1);

    boolNew = true;
    forms.giorn_lkp_eventi._destFormName = controller.getName();
    forms.giorn_lkp_eventi.arrIdEventi = globals._arrIdEvSelezionabiliCE; 
    globals.ma_utl_showFormInDialog(forms.giorn_lkp_eventi.controller.getName(),'Eventi selezionabili');
}

/**
 * @param {Number} idevento
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"27936B50-4D00-4BCD-AD45-DE01654B6F5C"}
 */
function confermaSelezioneEventoDaAlbero(idevento)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */    
    var eventiFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
    
    if(eventiFs.find())
    {
    	eventiFs.idevento = idevento;
    	eventiFs.search();
    	
    	boolNew ? AggiornaEventoNew(eventiFs.getRecord(1)) : AggiornaEventoOld(eventiFs.getRecord(1));
    	
    }
}

