/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"BEA924C3-B674-48A5-B81E-4B2DF13A000F"}
 */
var _tipoDiGiornaliera = 'N';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C5AC6134-E840-4D29-9010-3AAEEAD871DB",variableType:4}
 */
var _isVoceDiTestata = 1
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F66A21B9-D361-4F03-AC84-E13FC7442ED8",variableType:4}
 */
var _isNotVoceTestata = 0
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5650638D-B1AF-49CB-8A7D-F65F5F43B735",variableType:4}
 */
var _isVoceManuale = 1
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"52D74A3F-B748-4568-BEC1-8C67731509F5",variableType:4}
 */
var _isNotVoceManuale = 0
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7D22CF4A-4700-4D3D-857A-6EF564CB5C58",variableType:4}
 */
var _isVoceCalcolata = 1

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"5EDB7B9F-D894-4EA8-ABCF-38CAB3BB671E",variableType:-4}
 */
var _isAnnullaInserimento = false

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E23A4355-8A1F-488F-A064-CCAF846F2AE1"}
 */
var _infoMsgSelGiorno = "<html><center>Selezionare almeno un giorno in giornaliera...</center></html>"
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"86B24F58-770A-49D9-909E-14D8485BA1BD"}
 */
var _infoTitleSelGiorno = "Nessun giorno selezionato"
	
/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"44D72BB2-287D-4006-A379-83AD2B57050C",variableType:-4}
 */
var _arrDipSelezionati = []

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2032909D-0382-4050-85FD-3B80575F34B0",variableType:4}
 */
var intervalForDblClk = 1000;

/**
 * @properties={typeid:35,uuid:"1472FAAE-2D1C-4FA6-8B6C-43E2898DE2B5",variableType:-4}
 */
var _paramsPostControlli = null;

/**
 * @properties={typeid:35,uuid:"6412A3F7-40B7-4B4E-85A7-6A584607BAE8",variableType:-4}
 */
var _arrDipDaInviare = [];

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F5C6E483-66B4-4FB2-90F8-E40B620506A1",variableType:4}
 */
var offsetVisualizzaCoperturaAssenza = 5; //row_id,idlavoratore,codice,nominativo,haRichieste

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"33CA2DF8-09BD-4952-B522-729856B1673D",variableType:4}
 */
var offsetVisualizzaCoperturaTurni = 4; //row_id,idlavoratore,codice,nominativo

/**
 * @properties={typeid:35,uuid:"99A32BE5-1B27-4C55-BA09-2F9D6224C9C6",variableType:-4}
 */
var TipologiaEvento =
{
	ORDINARIO   : 'O',
	SOSTITUTIVO : 'S',
	AGGIUNTIVO  : 'A',
	STATISTICO  : 'T',
	SOSPENSIVO  : 'S',
	FESTIVO     : 'F'
}

/**
 * @properties={typeid:35,uuid:"8251204B-D429-4E98-A24F-E5748E915E72",variableType:-4}
 */
var TipologiaFesta =
{
	ACCANTONATA: 'FA',
	GODUTA: 'FG',
	RETRIBUITA: 'FR'
}

/**
 * @properties={typeid:35,uuid:"55D5990D-2F47-4A1F-A15A-107D360601FF",variableType:-4}
 */
var TipoAssenza = {
	TOTALE : 'T',
	PARZIALE : 'P',
    BUDGET : 'B',
	RICHIESTA : 'R',
	STORICO : 'S',
	IN_TURNO : 'I',
	NON_IN_TURNO : 'N'
}

/**
 * @type {String}
 * @properties={typeid:35,uuid:"4234EC77-382B-412B-BF46-B2E38B47CF57"}
 */
var riceviTabelleMsg = i18n.getI18NMessage('ma.msg.ricevi_tabelle');

/**
* @AllowToRunInFind
*
* @properties={typeid:24,uuid:"A9393FCD-8E71-4CED-B92F-475309CFDE9F"}
*/
function selezione_giornaliera() 
{
	var form = forms.giorn_selezione.controller.getName();
	globals.ma_utl_setStatus(globals.Status.EDIT,form);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(form))
		globals.ma_utl_showFormInDialog(form, 'Seleziona ditta e periodo giornaliera');
}

/**
 * @properties={typeid:24,uuid:"8D70ACA5-A9DC-4D5F-9224-32623996A0FC"}
 * @AllowToRunInFind
 */
function selezione_cartolina_dipendente()
{
	var form = forms.giorn_selezione_cartolina;
	var formName = form.controller.getName();
	
	var idlavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	if(!idlavoratore)
	{
		globals.ma_utl_showWarningDialog('All\'utente non è stato associato alcun identificativo','Cartolina dipendente');
	    return;
	}
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
	if(fs.find())
	{
		fs.idditta = globals.getDitta(idlavoratore);
		if(fs.search() > 0)
		{
			form._idditta = fs.idditta;
			form._codditta = fs.codice;
			form._ragionesociale = fs.ragionesociale;
			form._idgruppoinst = globals.getGruppoInstallazioneLavoratore(idlavoratore);
		}
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Seleziona ditta e periodo cartolina');
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"0EC44C11-39EE-46CC-A2FB-05648C3A003A"}
 */
function selezione_timbr_mancanti_dipendente()
{
	var form = forms.giorn_selezione_timbr_mancanti_dip;
	var formName = form.controller.getName();
	
	var idlavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	if(!idlavoratore)
	{
		globals.ma_utl_showWarningDialog('All\'utente non è stato associato alcun identificativo','Cartolina dipendente');
	}
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
	if(fs.find())
	{
		fs.idditta = globals.getDitta(idlavoratore);
		if(fs.search() > 0)
		{
			form._idditta = fs.idditta;
			form._codditta = fs.codice;
			form._ragionesociale = fs.ragionesociale;
		}
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Seleziona ditta e periodo');
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"BC520CD2-CD83-4B66-813C-87BFE3F3051C"}
 */
function selezione_timbr_mancanti_ditta()
{
	var form = forms.giorn_selezione_timbr_mancanti_ditta;
	var formName = form.controller.getName();
		
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Seleziona ditta e periodo anomalie');
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"8456D7C0-D20E-4BE4-A608-80D12332D1BA"}
 */
function selezione_squadrati_ditta()
{
	var form = forms.giorn_selezione_list_squadrati_ditta;
	var formName = form.controller.getName();
		
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Seleziona ditta e periodo squadrature');
}

/**
 * @properties={typeid:24,uuid:"93457354-5A74-4C36-A401-AE47F22D816C"}
 */
function selezione_programmazione_turni()
{
	var form = forms.giorn_selezione_prog_turni;
	var formName = form.controller.getName();
		
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Seleziona ditta e periodo per la programmazione dei turni');
}

/**
 * @properties={typeid:24,uuid:"767BE98D-D9C5-4AEA-8180-813093147EE0"}
 */
function selezione_ER_Timbr()
{	
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità cliente','Elenco richieste');
		return;
	}
	
	var recSingolaDitta = globals.getSingolaDitta(globals.Tipologia.STANDARD);
	if(recSingolaDitta)
		ApriER_Timbr(recSingolaDitta);
	else if (globals._filtroSuDitta != null) {

		currDitta = globals._filtroSuDitta;
		
		ApriER_Timbr(null);
		
	} else {

		currDitta = -1;

		globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
			                             'ApriER_Timbr', 'FiltraLavoratoriDittaStandard', null, null, '', true);
	}
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"091AB511-D79D-42A4-929D-4E12EFFA190A"}
 * @AllowToRunInFind
 */
function ApriER_Timbr(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_idlavoratore';
	_filter.filter_field_name = 'idlavoratore';
	_filter.filter_operator = 'IN';
	
	var ditta = _rec ? _rec['idditta'] : currDitta;
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
	if(fs.find())
	{
		fs.idditta = ditta;
		fs.search();
	}
	
	_filter.filter_value = globals.foundsetToArray(fs,'idlavoratore');
	    
	var _progObj = globals.nav.program['LEAF_ElencoRichieste'];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
	
    globals.openProgram('LEAF_ElencoRichieste');
	
	forms.giorn_elenco_richieste_timbr_situazione.vIdDitta = ditta;
}

/**
 * @param {Object} nOre
 * @param {Object} tipoEvento
 *
 * @properties={typeid:24,uuid:"2F39AF89-2816-4E0A-87EE-53B31E195DE1"}
 */
function getVistaOre(nOre,tipoEvento){
          
            var vistaOre

            if (tipoEvento == null){

                        vistaOre = null

            }else{

                        if(tipoEvento == '9')

                                   tipoEvento = 'L.D.'

                        vistaOre = tipoEvento + ' ' +((nOre/100).toFixed(2))

            }

            return vistaOre

}

/**
 * 
 * @param {String} _timbratura
 * 
 * @type {Number}
 *
 * @properties={typeid:24,uuid:"19F4A386-870D-48E9-B732-1E2075153A66"}
 */
function getGiornoDaTimbr(_timbratura){
	
	/** @type {String} */
	var _tGiorno = utils.stringMiddle(_timbratura, 7, 2)	
	return parseInt(_tGiorno, 10)
	
}

/**
 * 
 * @param {String} _timbratura
 *
 * @type {Number}
 *
 * @properties={typeid:24,uuid:"33D4F0FE-15AC-48E1-867F-E7F2D8280409"}
 */
function getMeseDaTimbr(_timbratura){
	
	var _tMese = utils.stringMiddle(_timbratura, 5, 2);
    return parseInt(_tMese, 10);
}

/**
 * 
 * @param {String} _timbratura
 *
 * @type {Number}
 * 
 * @properties={typeid:24,uuid:"C91CBB94-6F04-4FDE-9FDE-C7897B9BDD96"}
 */
function getAnnoDaTimbr(_timbratura){
	
	var _tAnno = utils.stringMiddle(_timbratura, 1, 4)
    return parseInt(_tAnno, 10)
}

/**
 * Ritorna le ore della timbratura 
 *  
 * @param {Number} _timbratura
 * 
 * @return {Number}
 * 
 *
 * @properties={typeid:24,uuid:"42155A46-751D-46B1-BD00-5D46C3D3B895"}
 */
function getOreDaTimbr(_timbratura){
	
	var _tOre = parseInt(utils.stringMiddle(_timbratura.toString(), 9, 2), 10);
	return _tOre;
}

/**
 * Ritorna un oggetto avente come elementi 
 * - le ore della timbratura in formato stringa
 * - un flag relativo alla competenza al giorno successivo
 * - un flag relativo alla competenza al giorno precedente
 * 
 * @param {String} _timbratura
 * @param {Number} _ggsucc
 * 
 * @type {{ vaAlGiornoSucc : Boolean, vaAlGiornoPrec : Boolean, ore: String }}
 * 
 * @properties={typeid:24,uuid:"0F43488E-FF6C-42F1-9732-6E0888B49C8D"}
 */
function getOreEffettiveDaTimbr(_timbratura,_ggsucc){
	
	var _objOre = new Object()
    _objOre.vaAlGiornoSucc = false
    _objOre.vaAlGiornoPrec = false
	
	var _tOre = parseInt(utils.stringMiddle(_timbratura, 9, 2), 10);
	
	if (_ggsucc) {
		
		if (_tOre >= 24) {
			_tOre = _tOre - 24
			_objOre.vaAlGiornoSucc = false
		}else
		    _objOre.vaAlGiornoPrec = true	
		
	} else {

		if (_tOre >= 24) {
			_tOre = _tOre - 24
			_objOre.vaAlGiornoSucc = true
		}

	}
	
	if (_tOre < 10)
		_objOre.ore = '0' + _tOre.toString()
	else
		_objOre.ore = _tOre.toString()
	
	return _objOre

}

/**
 * 
 * @param {Number} _timbratura
 *
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"B4FB61B0-9AE4-440E-A4DB-8D586263321D"}
 */
function getMinDaTimbr(_timbratura){
	
	var _tMin = parseInt(utils.stringMiddle(_timbratura.toString(), 11, 2),10);
	return _tMin;
}


/**
 * @param {Number} _timbratura
 *
 * @return {String}
 * 
 * @properties={typeid:24,uuid:"2797A108-0937-4847-9B0B-67D00E14BF08"}
 */
function getMinDaTimbrFormattata(_timbratura){
	
	var _tMin = parseInt(utils.stringMiddle(_timbratura.toString(), 11, 2),10);
	var _tMinStr = '';
	_tMin >= 10 ? _tMinStr = _tMin.toString() : _tMinStr = '0'+_tMin;
	return _tMinStr;
}

/**
 * Salvataggio della nuova voce o della voce modificata
 * 
 * @param {Object} _vociParams
 *
 * @properties={typeid:24,uuid:"0575640A-E277-4E45-8060-94C1F03854C3"}
 */
function salvaVoce(_vociParams)
{
	var url = WS_URL + "/Voci/Salva"
    return getWebServiceResponse(url,_vociParams);
}

/**
 * @properties={typeid:24,uuid:"71752951-4B89-4890-B861-69D8D5A8C38B"}
 */
function showDettagliEventiGiorno() {
	
	var winModalDettagliEv = application.createWindow('win_giorn_modal_dettagli_ev',JSWindow.MODAL_DIALOG)
    winModalDettagliEv.title = 'Dettagli eventi del giorno'
	winModalDettagliEv.setInitialBounds(JSWindow.DEFAULT,JSWindow.DEFAULT,360,270)
	
	winModalDettagliEv.show(forms['giorn_modal_dettagli_eventi'])
}

/**
 * @properties={typeid:24,uuid:"F78991AC-D370-4D05-B90B-CAD1494AD486"}
 */
function showDettagliTimbrGiorno() {		
	var winModalDettagliTim = application.createWindow('win_giorn_modal_dettagli_tim',JSWindow.MODAL_DIALOG)
    winModalDettagliTim.title = 'Dettagli timbrature del giorno'
	winModalDettagliTim.setInitialBounds(JSWindow.DEFAULT,JSWindow.DEFAULT,415,195)
	
	winModalDettagliTim.show(forms['giorn_modal_dettagli_timbr'])		 		
}

/**
 * @param {JSEvent} event the event that triggered the action
 * 
 * @properties={typeid:24,uuid:"943C29A2-A134-45AB-BA48-6DF824B6B026"}
 */
function apriModificaTimbrature(event){
	
	var _params = new Object()
	_params.mode = "editcommit"
	
	globals.svy_nav_showLookupWindow(event,"",'LEAF_Show_ModificaTimbr',"AggiornaTimbrature","FiltraTimbrature",_params,null,"",true)
    
}

/**
 * Apre la programmazione turni come program
 * 
 * @param {JSEvent} _event
 * @param {Number} _idditta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Number} [_iddip]
 *
 * @properties={typeid:24,uuid:"E0230807-D66F-49F9-B51E-21DB284B806C"}
 */
function apriProgrammazioneTurni(_event,_idditta,_anno,_mese,_iddip)
{
	var periodo = _anno * 100 + _mese;
	var primoGiorno = globals.getFirstDatePeriodo(periodo);	
    var ultimoGiorno = globals.getLastDatePeriodo(periodo);
	var gruppoInst = getGruppoInstallazioneDitta(_idditta);
				
	var _filterDitta = { filter_name: 'ftr_idditta', filter_field_name: 'idditta', filter_operator: '=', filter_value: _idditta };
	var _filterAssunzione =	{ filter_name: 'ftr_data_assunzione', 	 filter_field_name: 'assunzione', 	  filter_operator: '^||<=', filter_value: ultimoGiorno };
	var _filterCessazione =	{ filter_name: 'ftr_data_fine_rapporto', filter_field_name: 'cessazione', filter_operator: '^||>=', filter_value: primoGiorno };
	
	//ottieni stringa per filtro, recupera l'array di iddip per il filtraggio
	var params = globals.inizializzaParametriAttivaMese
					(
						_idditta, 
		                periodo,
						gruppoInst, 
						"",
						globals._tipoConnessione
					);
					
    var dipendenti = globals.getLavoratoriGruppo(params,_idditta);
	if(dipendenti) 
	{
		globals.svy_mod_closeForm(_event);
		
		var progName = 'ProgrammazioneTurni';
		var progObj = globals.nav.program[progName];
		
		// evita che sia caricato l'ultimo foundset del program
		progObj['foundset'] = null;

		progObj.filter = [_filterDitta, _filterAssunzione, _filterCessazione];
				
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);

		for(var f in progObj.filter)
			fs.addFoundSetFilterParam(progObj.filter[f].filter_field_name, progObj.filter[f].filter_operator, progObj.filter[f].filter_value, progObj.filter[f].filter_name);
			
		if(fs.loadAllRecords() && fs.getSize() === 0)
			globals.ma_utl_showInfoDialog('Nessun dipendente per il periodo selezionato', 'i18n:svy.fr.lbl.excuse_me');
		else
		{
			/** @type {{anno:Number,mese:Number,periodo:Number,idlavoratore:Number,idditta:Number}} */
			var progParams = {};
				progParams.anno  = _anno
				progParams.mese  = _mese
				progParams.periodo = globals.toPeriodo(_anno, _mese);
				progParams.idlavoratore = dipendenti[0];
				progParams.idditta = _idditta;
				
 		    	globals.openProgram(progName,progParams,true);
		  		    
		}
	}	// FINE if(dipendenti)
	else
		globals.ma_utl_showErrorDialog('La richiesta al server è fallita, riprovare', 'Errore di comunicazione');
}

/**
 * Apri la gestione della cartolina del dipendente
 * 
 * @param {JSEvent} _event
 * @param {Number} _idDitta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Number} _annoAttivo
 * @param {Number} _meseAttivo
 * @param {Number} _grInst
 * @param {String} _grLav
 * @param {Number} _idLav
 *
 * @properties={typeid:24,uuid:"16298707-05C1-4E4E-8250-FDC2BF22C83D"}
 */
function apriCartolina(_event, _idDitta, _anno, _mese, _annoAttivo, _meseAttivo, _grInst, _grLav, _idLav)
{
	var periodo = _anno * 100 + _mese

	var dipendenti = [_idLav];

	if (dipendenti) {
		globals.svy_mod_closeForm(_event);

		var progObj = globals.nav.program['LEAF_CartolinaDipendente'];

		// evita che sia caricato l'ultimo foundset del program
		progObj['foundset'] = null;

		var filterGruppoLav = { filter_name: 'ftr_gruppo_lav', filter_field_name: 'idlavoratore', filter_operator: 'IN', filter_value: dipendenti };
		progObj.filter = [filterGruppoLav];
		var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);
		for(var f in progObj.filter)
			fs.addFoundSetFilterParam(progObj.filter[f].filter_field_name, progObj.filter[f].filter_operator, progObj.filter[f].filter_value, progObj.filter[f].filter_name);
		
		if (fs.loadAllRecords() && fs.getSize() === 0)
			globals.ma_utl_showInfoDialog('Nessun dipendente per il periodo selezionato', 'i18n:svy.fr.lbl.excuse_me');
		else {

			var params = globals.inizializzaParametriAttivaMese
			(_idDitta,
				periodo,
				_grInst,
				_grLav,
				globals._tipoConnessione
			);

			var response = globals.isMeseDaAttivare(params);
			if (response && response.returnValue && response['returnValue'] === true) {
//				if (response['activate'] === false) {
					/** @type {{anno:Number,mese:Number,anno_attivo:Number,mese_attivo:Number,
					 *                     periodo:Number,periodo_attivo:Number,giorni_sel:Array,index_sel:Number,
					 *                     gruppo_inst:Number,gruppo_lav:String,idditta:Number,
					 *                     filtro_anag:Boolean,selected_tab:Number,selected_elements:Array,op_id:String}} */
					var progParams = { };
					progParams.anno = _anno
					progParams.mese = _mese
					progParams.periodo = globals.toPeriodo(_anno, _mese);
					progParams.anno_attivo = _anno;
					progParams.mese_attivo = _mese;
					progParams.periodo_attivo = globals.toPeriodo(_anno, _mese);
					progParams.giorni_sel = [];
					progParams.index_sel = globals.offsetGg + 1;
					progParams.gruppo_inst = _grInst;
					progParams.gruppo_lav = _grLav;
					progParams.idditta = _idDitta;
					progParams.filtro_anag = false;
					progParams.selected_tab = 1;
					progParams.selected_elements = [];
					progParams.op_id = null;

					globals.openProgram('LEAF_CartolinaDipendente', progParams, true);
					
//				} else
//					globals.ma_utl_showWarningDialog('Non è possibile gestire le timbrature del mese selezionato', 'Cartolina dipendente');
			} else
				globals.ma_utl_showErrorDialog('Operazione non riuscita, riprovare', 'Cartolina dipendente');
		}
	} // FINE if(dipendenti)
	else
		globals.ma_utl_showErrorDialog('La richiesta al server è fallita, riprovare', 'Errore di comunicazione');

}


/**
 * Lancia l'operazione sincrona di conferma eventi e se va a buon fine
 * procede con la chiusura del mese
 * 
 * @param {Object} params
 * @param {Boolean} bloccaChiusura
 * 
 * @properties={typeid:24,uuid:"E8AF8E64-02B3-45D2-B215-209E6CAE21DE"}
 */
function confermaEventi(params,bloccaChiusura)
{
	var url = WS_URL + "/Trattamenti/ConfermaEventi";
	var response = getWebServiceResponse(url,params);
	if (response && response.returnValue) {
		if (response['processing'] === true) {
			
			//se la chiusura è bloccata, il processo di conferma degli eventi selezionati è completato ma non essendo
			//ancora stati confermati tutti gli eventi non si può procedere con la chiusura
			if(bloccaChiusura)
				return;
			
			//altrimenti verifichiamo la presenza di annotazioni inserite dalla ditta
			forms.giorn_controllo_annotazioni_ditta._daControlliPreliminari = false;
			
			//recuperiamo il dataset dei dipendenti con annotazioni da confermare
			var dsDipAnnotazioni = globals.elencoAnnotazioniDitta(params['idditta'],params['periodo'],params['idgruppoinstallazione']);
			
			//in caso ve ne siano vanno stampati a video
			if(dsDipAnnotazioni.getMaxRowIndex() > 0)
			{
				forms.giorn_controllo_annotazioni_ditta._daControlliPreliminari = true;
				globals.costruisciRiepilogoConfermaAnnotazioni(dsDipAnnotazioni);
				globals.ma_utl_showFormInDialog('giorn_controllo_annotazioni','Controllo annotazioni ditta');
			}
			else
				if(!forms.giorn_controllo_cp._daControlliPreliminari)
				   //si può procedere con la chiusura
			       chiudiMeseSelezionato(params);
				// altrimenti vengono confermati gli eventi e semplicemente non verranno visualizzati 
				// nella successiva fase di chiusura
				else 
					return;
		}
		else
		{
			if(!forms.giorn_controllo_cp._daControlliPreliminari)
			   globals.ma_utl_showWarningDialog('Confermare tutti gli eventi per poter procedere con la fase di chiusura','Conferma eventi');
			return; //viene chiusa la finestra e non accade nulla
	
		}
	}
	else
		globals.ma_utl_showErrorDialog('La chiamata di conferma eventi non ha avuto successo, riprovare', 'Errore');
}

/**
 * Recupera il dataset con l'elenco dei turnisti per il mese selezionato
 * 
 * @param {Object} params
 * 
 * @return {JSDataSet} 
 * 
 * @properties={typeid:24,uuid:"B8C34E45-3EE7-4C63-9CC7-B2429F9AD378"}
 */
function elencoTurnisti(params)
{
	var sqlTurnisti = "SELECT L.CodDipendente AS Codice, RTRIM(ISNULL(L.COGNOME, '')) + ' ' + RTRIM(ISNULL(L.NOME, '')) AS Nominativo \
              , DCG.Decorrenza, TTT.Descrizione AS TipoTurnista \
               FROM dbo.F_Dec_Ditta_PeriodoTipo(?, ?, ?, 23) DCG  \
               INNER JOIN F_Ditta_ElencoDip(?, ?, ?, -1) L ON DCG.id_Legato = L.idLavoratore  \
               LEFT OUTER JOIN E2TabTipiTurno TTT ON DCG.Valore = TTT.Codice ORDER BY L.Cognome, L.NOME";
    var arrTurnisti = [params['idditta'],utils.dateFormat(params['primoggmese'],'yyyyMMdd'),utils.dateFormat(params['ultimoggmese'],'yyyyMMdd'),
                       params['idditta'],utils.dateFormat(params['primoggmese'],'dd/MM/yyyy'),utils.dateFormat(params['ultimoggmese'],'dd/MM/yyyy')];
    var dsTurnisti =  databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlTurnisti,arrTurnisti,-1);
   
	return dsTurnisti;

}

/**
 * Lancia l'importazione della giornaliera da ftp (operazione lunga)
 * 
 * @param {Object} params
 *
 * @properties={typeid:24,uuid:"B03CC451-8575-4599-981F-1430C6A690AE"}
 */
function importaDaFtp(params)
{
	var ftpUrl = WS_MULTI_URL + "/Giornaliera/ImportaDaFtp";
	addJsonWebServiceJob(ftpUrl,
		                 params,
						 vUpdateOperationStatusFunction);
}

/**
 * Lancia l'operazione di scarico delle timbrature dal folder sull'ftp
 * (operazione lunga)
 *  
 * @param {Object} params
 * @param {Boolean} [doCallback]
 * 
 * @properties={typeid:24,uuid:"C31557DE-70DB-48D5-96D4-96046CF0C541"}
 */
function scaricaTimbratureDaFtp(params,doCallback)
{
	var ftpUrl = WS_MULTI_URL + "/Timbrature/ScaricaTimbratureDaFtp";
	if(doCallback)
	{
	   apriGestioneAnomalie();	
	   addJsonWebServiceJob(ftpUrl,params,vUpdateOperationStatusFunction);
	}
	else
	   addJsonWebServiceJob(ftpUrl,params,vUpdateOperationStatusFunction);	
}

/**
 * Verifica la presenza di un file di timbrature da scaricare nella repository del sito ftp
 * 
 * @param {Object} params
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"1F767448-2500-4063-A8C4-A13FFAA8385C"}
 */
function verificaPresenzaFileTimbrature(params)
{
	var ftpUrl = WS_URL + "/Timbrature/VerificaPresenzaFileTimbrature";
	var response = getWebServiceResponse(ftpUrl,params);
	
	if(response)
	   return response.returnValue;
	return false;
}

/**
 * Apre la giornaliera come program
 * 
 * @param {JSEvent} _event
 * @param {Number} _idDitta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Number} _annoAttivo
 * @param {Number} _meseAttivo
 * @param {Number} _grInst
 * @param {String} _grLav
 *
 * @properties={typeid:24,uuid:"70983D54-81FC-4BBC-8504-496CAF019914"}
 */
function apriGiornaliera(_event, _idDitta, _anno, _mese, _annoAttivo, _meseAttivo, _grInst, _grLav)
{	
	var periodo = _anno * 100 + _mese
	var periodoFiltroMP = periodo;
	if(globals.isDittaMesePrecedente(_idDitta,periodo) != 0)
	{
		if(_mese < 12)
			periodoFiltroMP = _anno * 100 + _mese + 1;
		else
			periodoFiltroMP = (_anno + 1) * 100 + 1;
	}
	
 	var primoGiorno = globals.getFirstDatePeriodo(periodo);	
    var ultimoGiorno = globals.getLastDatePeriodo(periodoFiltroMP);
    
    var gruppoInst = -1
	var gruppoLav = ''
	
	if(_grLav)
		gruppoLav = _grLav;	   
	if(_grInst)
	    gruppoInst = _grInst;
		
	var _filterDitta = { filter_name: 'ftr_idditta', filter_field_name: 'idditta', filter_operator: '=', filter_value: _idDitta };
	var _filterAssunzione =	{ filter_name: 'ftr_data_assunzione', 	 filter_field_name: 'assunzione', 	  filter_operator: '^||<=', filter_value: ultimoGiorno };
	var _filterCessazione =	{ filter_name: 'ftr_data_fine_rapporto', filter_field_name: 'cessazione', filter_operator: '^||>=', filter_value: primoGiorno };
	var _filterGruppoLav	 =	null;
	
	//ottieni stringa per filtro, recupera l'array di iddip per il filtraggio
	var params = globals.inizializzaParametriAttivaMese
					(
						_idDitta, 
		                periodo,
						gruppoInst, 
						gruppoLav
					);
					
    var dipendenti = globals.getLavoratoriGruppo(params,_idDitta);
	if (dipendenti) 
	{
		var progObj = globals.nav.program['LEAF_Giornaliera'];
		
		// evita che sia caricato l'ultimo foundset del program
		progObj['foundset'] = null;

		if(dipendenti.length > 0)
		{
			_filterGruppoLav = { filter_name: 'ftr_gruppo_lav', filter_field_name: 'idlavoratore', filter_operator: 'IN', filter_value: dipendenti };
			progObj.filter = [_filterDitta, _filterAssunzione, _filterCessazione, _filterGruppoLav];
		}
		else
		    progObj.filter = [_filterDitta, _filterAssunzione, _filterCessazione];
				
    	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);

		for(var f in progObj.filter)
			fs.addFoundSetFilterParam(progObj.filter[f].filter_field_name, progObj.filter[f].filter_operator, progObj.filter[f].filter_value, progObj.filter[f].filter_name);
		
		if(fs.loadAllRecords() && fs.getSize() === 0)
			globals.ma_utl_showInfoDialog('Nessun dipendente per il periodo selezionato', 'i18n:svy.fr.lbl.excuse_me');
		else
		{
		
			/** @type {{ anno:Number,mese:Number,anno_attivo:Number,mese_attivo:Number,
			 *           periodo:Number,periodo_attivo:Number,giorni_sel:Array,index_sel:Number,
			 *           gruppo_inst:Number,gruppo_lav:String,idditta:Number,
			 *           filtro_anag:Boolean,selected_tab:Number,selected_elements:Array,op_id:String }} 
			 */
			var progParams = {};
				progParams.anno  = _anno
				progParams.mese  = _mese
				progParams.periodo = globals.toPeriodo(_anno, _mese);
				progParams.anno_attivo = _anno;	
				progParams.mese_attivo = _mese;
				progParams.periodo_attivo = globals.toPeriodo(_anno,_mese);
				progParams.giorni_sel = [];
				progParams.index_sel = globals.offsetGg + 1;
				progParams.gruppo_inst = _grInst;
				progParams.gruppo_lav = _grLav;
				progParams.idditta = _idDitta;
				progParams.filtro_anag = false;
				progParams.selected_tab = 1;
				progParams.selected_elements = [];
				progParams.op_id = null;
				
 		    globals.attivaMese(params, true, progParams,true);
		}
	}	// FINE if(dipendenti)
	else
		globals.ma_utl_showErrorDialog('La richiesta al server è fallita, riprovare', 'Errore di comunicazione');
}

/**
 * @properties={typeid:24,uuid:"48F99BAB-2C87-4981-9CF7-17B144A53B26"}
 */
function apriGestioneAnomalie()
{
	forms.giorn_selezione_timbr_mancanti_ditta.apriProgramAnomalie();
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2B61AC4C-C4BF-42BF-A6A5-137BE69E4F2F"}
 */
function selezione_ditta_tabelle_studio(event)
{
	var frm = forms.giorn_ricevi_tabelle_studio;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
    globals.ma_utl_showFormInDialog(frm.controller.getName(),'Ricevi dati studio');
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0FF6D4BB-3473-4DFC-9F29-68DEF7DD7A2D"}
 */
function selezione_ditta_giornaliera(event)
{
	var frm = forms.giorn_ricevi_giornaliera_studio;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Ricevi giornaliera');
}

/**
 * Lancia l'operazione lunga di creazione ed upload del file di giornaliera
 * sul folder ftp
 * 
 * @param {Object} params
 *
 * @properties={typeid:24,uuid:"C31C37C2-7142-4CF3-96BF-775961A662A2"}
 */
function inviaGiornalieraSuFtp(params)
{
	var ftpUrl = WS_MULTI_URL + "/Giornaliera/InviaGiornalieraSuFtp";
	addJsonWebServiceJob(ftpUrl,params);
	
}

/**
 * Lancia l'operazione d chiusura del mese (operazione lunga)
 * 
 * @param {Object} params
 *
 * @properties={typeid:24,uuid:"DA0D6A27-47AB-4A6A-90C2-FC830584096F"}
 * 
 * @AllowToRunInFind
 */
function chiusuraMese(params)
{
	var url = WS_MULTI_URL + "/Trattamenti/ChiusuraMese";
	addJsonWebServiceJob(url,params);	
}

/**
 * Lancia l'operazione di invio della giornaliera seguendo le operazioni nei due seguenti casi : 
 * - se ci sono dipendenti da predisporre, predispone questi ultimi e viene chiesto se procedere con l'invio
 * - se non vi sono dipendenti da predisporre, viene chiesto se procedere con l'invio
 * 
 * Se la risposta è affermativa, vengono presentati i dipendenti che verranno inviati allo Studio
 *  
 * @param params
 *
 * @properties={typeid:24,uuid:"25BEE5E8-3146-4B8C-BD56-9300A1861F4B"}
 */
function chiusuraEdInvio(params)
{
	var arrIdDipDaChiudere = params.iddipendentidachiudere;
	var arrIdDipDaInviare = params.iddipendentidainviare;
	var arrIdDipIngresso = params.iddipendentiingresso;
	
	// eliminazione parametri per evitare problemi di lunghezza nella deserializzazione della stringa JSON
	params.iddipendentidachiudere = [];
	params.iddipendentidainviare = [];
	params.iddipendentiingresso = [];
	
	if(arrIdDipDaChiudere && arrIdDipDaChiudere.length)
	{		
		// settaggio del parametro 'iddipendenti' per l'operazione di chiusura del mese
		params.iddipendenti = arrIdDipDaChiudere;
		
		var url = WS_MULTI_URL + "/Trattamenti/ChiusuraMese";
		addJsonWebServiceJob(url,
					         params,
							 vUpdateOperationStatusFunction,
							 null
							 ,function(retObj)
							 {
								    if(!retObj || retObj['status']['op_status'] == 255) 
								    //se non dovesse essere abbastanza || retObj['status']['op_message'] == 'Chiusura mese terminata correttamente'
								    {
								    	plugins.busy.unblock();
										globals.ma_utl_showWarningDialog('L\'operazione di predisposizione per l\'invio non è terminata correttamente. <br/>Contattare il servizio di assistenza per ulteriori informazioni.','Invia giornaliera');	
										return;
								    }
								    
									if(scopes.giornaliera.esisteGiornalieraInviata(params.idditta,params.periodo,params.gruppoinst,params.gruppolav))
									{
										plugins.busy.unblock();
										globals.ma_utl_showWarningDialog('La giornaliera risulta già inviata e non ancora acquisita dallo Studio. <br/>Contattare il servizio di assistenza per ulteriori informazioni.','Invia giornaliera');	
										return;
									}
																		
									// settaggio del parametro 'iddipendenti' per l'operazione di invio della giornaliera
									params.iddipendenti = ottieniArrayDipDaInviare(params.idditta,params.periodo)//params.iddipendentidainviare;
									
									var arrDipPredisposizione = globals.ma_utl_showLkpWindow({
																  event							: new JSEvent
																, lookup						: 'AG_Lkp_Lavoratori'
																, methodToAddFoundsetFilter		: params.dapannello ? 'FiltraLavoratoriPannello' : 'FiltraLavoratoriGiornaliera' //'FiltraDipendentiDaInviare'
																, allowInBrowse					: true
																, multiSelect					: true
																, selectedElements				: arrIdDipDaInviare
																, unselectableElements          : arrIdDipIngresso
																});
									if(arrDipPredisposizione && arrDipPredisposizione.length)
									{
										inviaGiornalieraSuFtp(params);
										forms.mao_history.operationDone(retObj);
									}
									else
									{
										plugins.busy.unblock();
										forms.mao_history.operationDone(retObj);
										globals.ma_utl_showWarningDialog('Confermare l\'elenco per procedere con l\'invio della giornaliera','Invia giornaliera');	
										return;
									}
							    
							});

	}
	else
	{
		if(scopes.giornaliera.esisteGiornalieraInviata(params.idditta,params.periodo,params.gruppoinst,params.gruppolav))
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('La giornaliera risulta già inviata e non ancora acquisita dallo Studio. <br/>Contattare il servizio di assistenza per ulteriori informazioni.','Invia giornaliera');	
			return;
		}
		
		var arrDipInvio = globals.ma_utl_showLkpWindow({
			  event							: new JSEvent
			, lookup						: 'AG_Lkp_Lavoratori'
			, methodToAddFoundsetFilter		: params.dapannello ? 'FiltraLavoratoriPannello' : 'FiltraLavoratoriGiornaliera'
			, allowInBrowse					: true
			, multiSelect					: true
			, selectedElements				: arrIdDipDaInviare
			, unselectableElements          : arrIdDipIngresso
			});
		if(arrDipInvio && arrDipInvio.length)
		{
			params.iddipendenti = params.iddipendentidainviare;
			inviaGiornalieraSuFtp(params);
		}
		else
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('Confermare l\'elenco per procedere con l\'invio della giornaliera','Invia giornaliera');	
			return;
		}
						
	}
}

/**
 * Ottiene la stringa da concatenare alla query per ottenere l'array 
 * dei dipendenti ancora da chiudere (NON USATA)
 * 
 * @param {Object} params
 * 
 * @return {String}
 *
 * @properties={typeid:24,uuid:"2E4686D6-371C-4482-9573-C2422E92895D"}
 */
function ottieniStrDipChiusura(params){
	
	/** @type {String} */
	var _retStr = null
	var url = WS_URL + "/Trattamenti/ElencoDipendentiChiusura"
	var _responseObj = getWebServiceResponse(url,params)	
	
	if (_responseObj != null){
	
		if(_responseObj['returnValue'] == true){
	
		    _retStr = _responseObj['sqlStr']   
		
		}else		
			globals.ma_utl_showErrorDialog('Si è verificato il seguente errore : ' + _responseObj['message'],'Chiusura annullata')
									
	}else		
		globals.ma_utl_showErrorDialog('Il server non risponde, si prega di riprovare','Errore di comunicazione')
	
	return _retStr;

}
				
/**
 * Ottiene l'array dei dipendenti non ancora chiusi
 * 
 * @param {Object} params
 * 
 * @return {Object} 
 * 
 * @properties={typeid:24,uuid:"AE623DCC-B368-41B3-8D9F-EBD40B61462B"}
 */
function ottieniArrayDipDaChiudere(params){
	
    var arrDipDaChiudere = [];
	
	var sqlDipDaChiudere = 'SELECT LUR.idLavoratore FROM dbo.F_LU_DipendentiStato(?, ?, ?) LUR \
                            WHERE LUR.DataChiusura IS NULL';
	var arrSqlDipDaChiudere = [params['idditta'],params['periodo'],1];
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlDipDaChiudere,arrSqlDipDaChiudere,-1);
	if(ds.getMaxRowIndex())
		arrDipDaChiudere = ds.getColumnAsArray(1);
	
	/** @type Object */
	var _objMancanti = new Object();
	    _objMancanti.response = false;
		_objMancanti.arrMancanti = [];
			
		_objMancanti.response = true;
		_objMancanti.arrMancanti = arrDipDaChiudere; //_responseObj['dipArray'];
	
	return _objMancanti;
}

/**
 * Restituisce l'array con gli identificativi dei lavoratori che risultano ancora da inviare nel periodo
 * (o non sono mai stati inviati o sono stati modificati e da allora mai re-inviati) 
 * 
 * @param {Number} idDitta
 * @param {Number} periodo
 * 
 * @return {Array<Number>}
 *
 * @properties={typeid:24,uuid:"E3088A8D-AB59-4909-B980-E2B385892005"}
 * @AllowToRunInFind
 */
function ottieniArrayDipDaInviare(idDitta,periodo)
{
	var arrDipDaInviare = [];
	
	var sqlDipDaInviare = 'SELECT LUR.idLavoratore FROM dbo.F_LU_DipendentiStato(?, ?, ?) LUR \
                           WHERE LUR.DataInvio IS NULL OR LUR.DataInvio < ISNULL(LUR.DataChiusura,\'20991231\')';
	var arrSqlDipDaInviare = [idDitta,periodo,1];
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlDipDaInviare,arrSqlDipDaInviare,-1);
	if(ds.getMaxRowIndex())
		arrDipDaInviare = ds.getColumnAsArray(1);
		
	return arrDipDaInviare;
}

/**
 * Controlla se la chiusura mese del cliente è già stata effettuata ed è
 * avvenuta in maniera corretta (utilizzata per valutare se è possibile inviare 
 * la giornaliera del mese)
 * 
 * @param {Object} params
 * @return {Object}
 * @properties={typeid:24,uuid:"2CD4C4D4-8A49-4AAA-AD1C-BF12C8A4C78A"}
 */
function controlloChiusuraMeseCliente(params)
{
	//otteniamo l'array dei dipendenti mancanti
    var _objDipManc = ottieniArrayDipDaChiudere(params);
	return _objDipManc;
	
}

/** 
 * Controlla se è possibile effettuare la chiusura mese cliente, in caso affermativo
 * procede con la chiusura chiamando il metodo chiudiMeseSelezionato od il metodo chiudiEdInviaMeseSelezionato 
 * 
 * @param {Object} params
 * @param {Boolean} [fromPannelloVariazioni]
 * 
 * @properties={typeid:24,uuid:"6549C76F-2116-4B2E-A3D6-6F8A53D19726"}
 */
function chiusuraMeseCliente(params,fromPannelloVariazioni) {

	// controlla la presenza di eventuali richieste di ferie/permessi ancora in sospeso per la ditta in questione
	if (globals.ma_utl_hasKey(globals.Key.AUTORIZZAZIONI)) 
	{
		var arrRicSosp = globals.getRichiesteInSospeso(params['idditta'],
			                                           globals.getMeseDaPeriodo(params['periodo']),
													   globals.getAnnoDaPeriodo(params['periodo']));
		if (arrRicSosp.length) {
			var _msgRicSosp = 'Ci sono ancora in sospeso richieste di ferie e permessi per la ditta nel periodo indicato.<br/> \
		                       Procedere confermandole o rifiutandole prima di proseguire.';
			globals.ma_utl_showWarningDialog(_msgRicSosp, 'Chiusura mese');
            
			return;
		}
	}
	
	/** @type {Array} */
	var _arrDipSenzaRegole = params['codgruppogestione'] ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
	if(_arrDipSenzaRegole && _arrDipSenzaRegole.length > 0)
	{
		globals.ma_utl_showWarningDialog('Ci sono nuovi dipendenti senza regola associata non presenti in fase di apertura della giornaliera.<br/> \
	                                      Chiudere e riaprire la giornaliera per sistemare le regole e poter proseguire.');
		return;
	                                
	}
	
	var _response;
	var _retvalue;
	var _noconnection;
	   
    if (globals.getTipologiaDitta(params['idditta']) == globals.Tipologia.GESTITA_UTENTE) 
    {
    	_response = true;
    	_retvalue = 1;
    	_noconnection = false;
    }
    else
    {	
    	//controllo su acquisizioni mesi precedenti
		var response = scopes.giornaliera.controllaAcquisizioneCM(params);
		if (response)
		{
			_noconnection = false;
			_response = response['returnValue'];
			_retvalue = response['retValue'];
		}
		else
		{
			_noconnection = true;
			_response = false;
			_retvalue = 0;
		}		
    }

	if (_noconnection == false) {
		// risposta ottenuta
		if (_response == true) {
			// acquisizioni precedenti ok, proseguire con i controlli chiusura
			if (_retvalue == 1)
			{
				var _frmCtrChiusura = forms.giorn_controllo_chiusura_cliente;
					
				var _objCatBloccanti = ottieniCategorieBloccanti(params['idditta'],params['periodo'],_frmCtrChiusura);
								
				if(_objCatBloccanti.bloccante)
				{	
					plugins.busy.unblock();
					
					if(fromPannelloVariazioni)
					{
						//TODO arrivando dal pannello variazioni, deve essere aperta la giornaliera (od eventualmente ci si deve posizionare sulla giornaliera aperta) 
						//con i dipendenti derivanti dal filtro sugli eventi bloccanti
						globals.ma_utl_showWarningDialog('Sistemare le eventuali giornate squadrate, gli eventi da definire e gli eventi bloccanti \
						                                  dalla <b>Giornaliera elettronica</b> o dal <b>Pannello giornaliera</b> prima di proseguire!','Predisposizione invio');
                        return;
					}
					else
					    //altrimenti nel caso di giornaliera standard viene mostrata la form di riepilogo
						globals.ma_utl_showFormInDialog(_frmCtrChiusura.controller.getName(),'Riepilogo controllo chiusura');
				}
				else
				{
					if(_objCatBloccanti.messaggio)
					{
						//la chiusura è consentita ma all'utente viene notificato un messaggio che lo
						//responsabilizza sull'esito finale dell'operazione
						var _msg = "<html>Ci sono ancora timbrature errate e/o giorni non conteggiati in giornaliera <br/>";
						_msg += "Tale situazione non è bloccante per lo studio, tuttavia potrebbero verificarsi incongruenze. <br/>";
						_msg += "Procedere comunque ? </html>";
						var _responseCM = globals.ma_utl_showYesNoQuestion(_msg, 'Chiusura mese');

						//in caso di risposta affermativa procedi con la chiusura
						if (_responseCM)
							chiudiMeseSelezionato(params);
						//altrimenti ripresenta la giornaliera e basta
						else return;
				    } else
					      chiudiMeseSelezionato(params);
			    }
			}
			// acquisizioni precedenti non ok, verificare se necessario chiedere scarico timbrature
			else 
			{
			   var answer = globals.ma_utl_showYesNoQuestion('Completare le importazioni dei periodi precedenti prima di proseguire.<br/> Procedere con lo scarico?', 'Controllo acquisizione giornaliere');
			   if(answer)
			   {				
				   var periodoPrec;
				   var mese = globals.getMese();
				   var anno = globals.getAnno();
				   
				   if(mese == 1)
					  periodoPrec = (anno - 1) * 100 + 12;
				   else
					  periodoPrec = params['periodo'] - 1;
					
                   globals.importaTracciatoDaFtp(params['idditta']
                	                             ,periodoPrec
												 ,params['idgruppoinstallazione']
												 ,params['codgruppogestione']);				
			   }
				   
				return;
			}
		} else
			globals.ma_utl_showWarningDialog('Non sono state scaricare le giornaliere dei periodi precedenti', 'Chiusura mese cliente');

	} else
		globals.ma_utl_showErrorDialog('Errore nel contattare il server, riprovare', 'Chiusura mese cliente');

}

/**
 * Lancia la procedura di chiusura del mese
 * 
 * @param {Object} params
 *
 * @properties={typeid:24,uuid:"93383FC7-B199-44AB-BCE0-46913EE862C8"}
 */
function chiudiMeseSelezionato(params)
{
	//otteniamo l'array dei dipendenti mancanti
    var _objDipManc = ottieniArrayDipDaChiudere(params);
	if (_objDipManc != null) {
		
		//se il recupero è andato a buon fine...
		if (_objDipManc.response == true) {
						
			var arrDipIngresso = globals.getLavoratoriGruppo(params,params['idditta']);
			var arrDipDaInviare = ottieniArrayDipDaInviare(params['idditta'],params['periodo']);
		
			//recupera l'array dei dipendenti mancanti
			var arrDipManc = _objDipManc.arrMancanti;
					
			// TODO PANNELLO VARIAZIONI
//					if(!scopes.richieste.markRequestsAsSent(pvRequests))
//					{
//						plugins.busy.unblock();
//						forms.pvs_richieste_lavoratore_main.setStatusError('i18n:ma.err.generic_error');
//					    return;
//					}
//				}
				
				params.iddipendenti = []; 
				params.iddipendentidachiudere = arrDipManc; // dipendenti da chiudere
				params.iddipendentidainviare = arrDipDaInviare; // dipendenti che risultano da inviare
				params.iddipendentiingresso = arrDipIngresso;
				chiusuraEdInvio(params);
//			}
						
        }else
        	globals.ma_utl_showErrorDialog('Recupero dipendenti mancanti per la chiusura non riuscito, riprovare', 'Predisposizione per l\'invio della giornaliera');
        
	}else
		globals.ma_utl_showErrorDialog('Il server non è stato raggiunto, riprovare', 'Predisposizione per l\'invio della giornaliera');
	
	plugins.busy.unblock();
}

/**
 * @param {Number} periodo
 *
 * @properties={typeid:24,uuid:"627A03E7-4DD1-48FA-B4DB-985EC3E0CB82"}
 */
function setPeriodo(periodo)
{
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]])
	{
		if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]])
		   globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].periodo = periodo;
		else
	       globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]] = { periodo: periodo };
		
	    // aggiorniamo di conseguenza i valori di anno e mese
	    globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].anno = globals.trunc(periodo / 100);
	    globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].mese = periodo % 100;
    }
}

/**
 * Elimina una voce manuale esistente
 * 
 * @param {Object} _vociParams
 *
 *
 * @properties={typeid:24,uuid:"BA5B5438-70E7-4502-A4BB-E47453743FCD"}
 */
function eliminaVoce(_vociParams){
	
	var url = WS_URL + "/Voci/Elimina"
	return getWebServiceResponse(url, _vociParams);
}

/**
 * Elimina un evento esistente
 * 
 * @param {Object} _evParams
 * 
 * @return {{ returnValue: Boolean, message: String }}
 *
 * @properties={typeid:24,uuid:"6EE3374C-FB0A-4BF5-AA46-398557031C4C"}
 */
function eliminaEvento(_evParams)
{
	var url = WS_URL + "/Eventi/Elimina";	
	/** @type {{ returnValue: Boolean, message: String }} */
	var response = getWebServiceResponse(url,_evParams);
	
	return response;
}

/**
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"434E1DC6-748F-4A45-A966-66089B1D0B3F"}
 */
function FiltraLavoratoriDittaGiorn(_fs)
{
	_fs.addFoundSetFilterParam('idditta','=', _fs['idditta'])
	
	return _fs
}

/**
 * Passa alla vista mensile del mese precedente
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Number} [idlav]
 * 
 * @properties={typeid:24,uuid:"81B3CD61-3348-45A0-A79F-582F815D9622"}
 */
function giornMesePrec(event,idlav)
{
	// se sono presenti dei filtri di ricerca informa l'utente che verranno rimossi con il cambio di mese
	var answer = true;
	if (forms.giorn_vista_mensile._filtroAttivo)
		answer = globals.ma_utl_showYesNoQuestion(globals.getHtmlString("Il filtro sui dipendenti della giornaliera è attivo. <br/> Attivando il mese il filtro verrà rimosso. Proseguire?"), "Attivazione mese");

	if (answer) {
		
		/** @type {Date} */
		var oldPeriodo = utils.parseDate(getPeriodo().toString(10), PERIODO_DATEFORMAT);
		var year = oldPeriodo.getMonth() == 0 ? oldPeriodo.getFullYear() - 1 : oldPeriodo.getFullYear();
		var month = oldPeriodo.getMonth() == 0 ? 11 : oldPeriodo.getMonth() - 1;
		var periodo = year * 100 + month + 1;
		var newPeriodo = new Date(year, month, 1);
		var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta,
			periodo,
			globals.getGruppoInstallazione(),
			globals.getGruppoLavoratori(),
			globals._tipoConnessione);

		// nel caso in cui sia selezionata la giornaliera di budget verifichiamo se per il dipendente
		// esistano dei giorni nel mese precedente compilabili in budget, in caso negativo lo comunichiamo
		// all'utente e rimaniamo sulla giornaliera attualmente aperta
		if (forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET
		    && !globals.esistonoGiorniUtilizzabiliInBudget(idlav ? idlav : forms.giorn_header.idlavoratore,
			    	                                       month + 1,
				    									   year))
		{
	         globals.ma_utl_showWarningDialog('Non esistono giorni utilizzabili con la giornaliera di budget \
	         								  <br/>nel mese precedente', 'Giornaliera di budget');
	         return;
        }
		
		// disattiviamo eventuali filtri sulla giornaliera (indipendentemente dalla risposta)
		globals.disattivaFiltri(event);
				
		//controlliamo la presenza di dipendenti senza regole associate
		var _arrDipSenzaRegole = params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
		if (_arrDipSenzaRegole != null && _arrDipSenzaRegole.length > 0) {
			forms.giorn_controllo_dip_senza_regole_associate._idditta = params.idditta;

			//in presenza di utenti sede, se la ditta prevede le timbrature, c'è la possibilità
			//di scaricare la giornaliera dall'ftp
			//TODO regole non associate : a regime bisognerà toglierla
			//		if (globals._tipoConnessione == 0) {
			//
			//			tipoInst = globals.getTipoInstallazione(_idditta, _periodo);
			//
			//			switch (tipoInst) {
			//
			//			case 2:
			//
			//				response = globals.ma_utl_showYesNoQuestion(msg, 'Dipendenti senza regole associate');
			//				if (response) {
			//					globals.importaTracciatoDaFtp(event, _idditta, _periodo, _idgruppoinst, _codgrlav);
			//					return;
			//				}
			//				break;
			//
			//			default:
			//				break;
			//			}
			//		}

			//visualizza i dipendenti senza regole ed impedisce l'accesso in giornaliera
			var frmDipSenzaRegole = globals.costruisciRiepilogoRegoleNonAssociate(_arrDipSenzaRegole, params.idditta);
			frmDipSenzaRegole['_isInGiornaliera'] = false;
			frmDipSenzaRegole['vParams'] = params;
			frmDipSenzaRegole['vOpenProg'] = null;
			frmDipSenzaRegole['vProgParams'] = null;
			frmDipSenzaRegole['vPrimoIngresso'] = null;

			globals.ma_utl_showFormInDialog(frmDipSenzaRegole.controller.getName(), 'Dipendenti senza regole');

			return;
		}

		// ricalcoliamo la giornaliera : essendo già impostati i filtri relativi ai gruppi di installazione e
		// dei lavoratori, non li dobbiamo aggiungere di nuovo
		idlav ? ricalcolaGiornaliera(newPeriodo
			                         , forms.giorn_header.idditta
									 , globals.getGruppoInstallazione()
									 , globals.getGruppoLavoratori()
									 , idlav) :
		        ricalcolaGiornaliera(newPeriodo
		        	                 , forms.giorn_header.idditta
									 , globals.getGruppoInstallazione()
									 , globals.getGruppoLavoratori()
									 , forms.giorn_header.idlavoratore);
	} else
		return;
		
	return;
}

/**
 * @param {Date} periodo
 * @param {Number} [idDitta]
 * @param {Number} [gruppoInstallazione]
 * @param {String} [gruppoLavoratori]
 * @param {Number} [idLavoratore]
 * 
 * @properties={typeid:24,uuid:"1279E712-0727-4B8D-8CBD-AB1B90456772"}
 */
function ricalcolaGiornaliera(periodo, idDitta, gruppoInstallazione, gruppoLavoratori, idLavoratore)
{
	var program = 'LEAF_Giornaliera'; 	
	
	// Get the main form
	var progObj = globals.nav.program[program];
	var template = globals.nav.template_types[progObj['view']];
	var form = progObj['form'][forms[template].has1()][2];
	
	/** @type JSFoundset */
	var programFsOri = progObj['foundset'];
    var programFs = programFsOri.duplicateFoundSet();
	/** @type {Array} */
	var programFilter = progObj['filter'];
	
   	var primoGiorno = new Date(periodo.getFullYear(),  periodo.getMonth(), 1);	
	var ultimoGiorno = new Date(periodo.getFullYear(),  periodo.getMonth() + 1, 0);
	
	setPeriodo(periodo.getFullYear() * 100 + periodo.getMonth() + 1);
	
	if(idDitta)
	{
		// Ricostruisci il filtro relativo alla ditta
		programFilter[0]['filter_value'] = idDitta;
		
	}else
	{
		idDitta = forms.giorn_header.idditta
		// Ricostruisci il filtro relativo alla ditta
		programFilter[0]['filter_value'] = idDitta;
		
	}
	
	//le ditte che non timbrano non hanno il tab di Mostra timbrature
    var _haOrologio = globals.haOrologio(idDitta);
	//in caso di connessione di tipo cliente il tab delle voci non è visibile
	if(globals._tipoConnessione == 1)
	{
		forms['LEAF_Giornaliera_tab'].elements['tabs'].removeTabAt(4);
	
		if(!_haOrologio)
		{
			if(forms['LEAF_Giornaliera_tab'].elements['tabs'].getMaxTabIndex() === 3)
			   forms['LEAF_Giornaliera_tab'].elements['tabs'].removeTabAt(3);
			
		}else
		{	
			// passando da una situazione senza timbrature ad una con timbrature va riaggiunto il tab!
			if(!(forms['LEAF_Giornaliera_tab'].elements['tabs'].getMaxTabIndex() === 3))
	             forms['LEAF_Giornaliera_tab'].elements['tabs'].addTab('giorn_mostra_timbr','LEAF_GI_MostraTimbr','Mostra timbrature',
	                'Mostra timbrature',null,null,'lavoratori_to_e2timbratura',2);
		}
	}
	else
	{
		if(!_haOrologio)
		{
			if(forms['LEAF_Giornaliera_tab'].elements['tabs'].getMaxTabIndex() === 4)
			   forms['LEAF_Giornaliera_tab'].elements['tabs'].removeTabAt(3);
		}else
		{	
			// passando da una situazione senza timbrature ad una con timbrature va riaggiunto il tab!
			if(!(forms['LEAF_Giornaliera_tab'].elements['tabs'].getMaxTabIndex() === 4))
	             forms['LEAF_Giornaliera_tab'].elements['tabs'].addTab('giorn_mostra_timbr','LEAF_GI_MostraTimbr','Mostra timbrature',
	                'Mostra timbrature',null,null,'lavoratori_to_e2timbratura',2);
		}
	}
	
    var _gruppoLavoratori = gruppoLavoratori == null  ? '' : gruppoLavoratori;
    // Ricostruisci il filtro relativo al gruppo lavoratori
	var params = globals.inizializzaParametriAttivaMese(idDitta, 
		                                                parseInt(utils.dateFormat(periodo, PERIODO_DATEFORMAT), 10),
														gruppoInstallazione,
														_gruppoLavoratori,
														globals._tipoConnessione);
	var employees = globals.getLavoratoriGruppo(params,idDitta);
	if(employees)
	{
		if(employees.length > 0)
		{
			programFilter[3]['filter_value'] = employees;
		}
		else if(programFilter[3])
		{
			programFs.removeFoundSetFilterParam(programFilter[3].filter_name);
			programFilter[3] = null;
		}
	}
	else
	{
		globals.ma_utl_showErrorDialog('Errore durante la richiesta', 'Errore');
		return;
	}
	
	// Ricostruisci i filtri di assunzione e cessazione relativi al nuovo periodo
	programFilter[1]['filter_value'] = ultimoGiorno	// assunzione
	programFilter[2]['filter_value'] = primoGiorno	// cessazione
	
	// Riapplica i filtri del program
	for (var f = 0; f < programFilter.length; f++)
	{
		if(programFilter[f])
		{
			programFs.removeFoundSetFilterParam(programFilter[f].filter_name);
			programFs.addFoundSetFilterParam(programFilter[f].filter_field_name, programFilter[f].filter_operator, programFilter[f].filter_value, programFilter[f].filter_name);
		}
	}
	
	programFs.loadAllRecords();
	if(programFs.getSize() > 0)
	{
		forms[form].foundset.loadRecords(programFs);
		
		if(idLavoratore != null	&& idLavoratore != undefined && employees.lastIndexOf(idLavoratore) != -1)
			globals.lookupFoundset(idLavoratore,forms[form].foundset);
				
		forms.giorn_header.preparaGiornaliera();
		
		globals.verificaDipendentiFiltrati(idLavoratore);
		
		aggiornaIntestazioni();
		   
	}else
		globals.ma_utl_showWarningDialog('i18n:ma.msg.nessun_lavoratore_presente', 'i18n:svy.fr.lbl.excuse_me');
}

/**
 * Passa alla vista mensile del mese successivo
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Number} [idlav]
 * 
 * @properties={typeid:24,uuid:"FEDC7099-D061-40BB-A6D0-62AA557677CC"}
 */
function giornMeseSucc(event,idlav) 
{
	// se presenti dei filtri di ricerca informa l'utente che verranno automaticamente
	// rimossi con il cambio di mese
	var answer = true;
	if (forms.giorn_vista_mensile._filtroAttivo)
		answer = globals.ma_utl_showYesNoQuestion("Il filtro sui dipendenti della giornaliera è attivo. <br/> Attivando il mese il filtro verrà rimosso. Proseguire?", "Attivazione mese");

	if (answer)
	{
		/** @type {Date} */
		var oldPeriodo = utils.parseDate(getPeriodo().toString(10), PERIODO_DATEFORMAT);
		var year = oldPeriodo.getMonth() == 11 ? oldPeriodo.getFullYear() + 1 : oldPeriodo.getFullYear();
		var month = oldPeriodo.getMonth() == 11 ? 0 : oldPeriodo.getMonth() + 1;
		var periodo = year * 100 + month + 1;
		var newPeriodo = new Date(year, month, 1);

		var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta,
			periodo,
			globals.getGruppoInstallazione(),
			globals.getGruppoLavoratori(),
			globals._tipoConnessione);
		
		// nel caso in cui sia selezionata la giornaliera di budget verifichiamo se per il dipendente
		// esistano dei giorni nel mese successivo compilabili in budget, in caso negativo rimaniamo sulla
		// giornaliera attualmente aperta
		if (forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET 
				&& !globals.esistonoGiorniUtilizzabiliInBudget(idlav ? idlav : forms.giorn_header.idlavoratore, month + 1, year)) {
			globals.ma_utl_showWarningDialog('Non esistono giorni utilizzabili con la giornaliera di budget \
                                   <br/>nel mese successivo', 'Giornaliera di budget');
			return;
		}
		
		// disattiviamo eventuali filtri sulla giornaliera (indipendentemente dalla risposta)
		globals.disattivaFiltri(event);
		
		//controlliamo la presenza di dipendenti senza regole associate
		var _arrDipSenzaRegole = params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
		if (_arrDipSenzaRegole != null && _arrDipSenzaRegole.length > 0) {
			forms.giorn_controllo_dip_senza_regole_associate._idditta = params.idditta;

			//in presenza di utenti sede, se la ditta prevede le timbrature, c'è la possibilità
			//di scaricare la giornaliera dall'ftp
			//TODO regole non associate : a regime bisognerà toglierla
			//if (globals._tipoConnessione == 0) {
			//
			//tipoInst = globals.getTipoInstallazione(_idditta, _periodo);
			//
			//switch (tipoInst) {
			//
			//case 2:
			//
			//response = globals.ma_utl_showYesNoQuestion(msg, 'Dipendenti senza regole associate');
			//if (response) {
			//globals.importaTracciatoDaFtp(event, _idditta, _periodo, _idgruppoinst, _codgrlav);
			//return;
			//}
			//break;
			//
			//default:
			//break;
			//}
			//}

			//visualizza i dipendenti senza regole ed impedisce l'accesso in giornaliera
			var frmDipSenzaRegole = globals.costruisciRiepilogoRegoleNonAssociate(_arrDipSenzaRegole, params.idditta);
			frmDipSenzaRegole['_isInGiornaliera'] = false;
			frmDipSenzaRegole['vParams'] = params;
			frmDipSenzaRegole['vOpenProg'] = null;
			frmDipSenzaRegole['vProgParams'] = null;
			frmDipSenzaRegole['vPrimoIngresso'] = null;

			globals.ma_utl_showFormInDialog(frmDipSenzaRegole.controller.getName(), 'Dipendenti senza regole');

			return;
		}
		
		// ricalcoliamo la giornaliera : essendo già impostati i filtri relativi ai gruppi di installazione e
		// dei lavoratori, non li dobbiamo aggiungere di nuovo
		idlav ? ricalcolaGiornaliera(newPeriodo
			                         ,forms.giorn_header.idditta
									 ,globals.getGruppoInstallazione()
									 ,globals.getGruppoLavoratori()
									 ,idlav) : 
		        ricalcolaGiornaliera(newPeriodo
		        	                 ,forms.giorn_header.idditta
									 ,globals.getGruppoInstallazione()
									 ,globals.getGruppoLavoratori()
									 ,forms.giorn_header.idlavoratore);
	} else
		return;

	//	var msg = '<html>Ci sono dipendenti senza regola associata.<br/>Procedere, se prevista, allo scarico della giornaliera del Cliente?</html>';
	//	var _params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta,
	//		                                                 periodo,
	//														 globals.getGruppoInstallazione(),
	//														 globals.getGruppoLavoratori(),
	//														 globals._tipoConnessione);
	//	var _arrDipSenzaRegole = globals.elencoDipendentiSenzaRegoleAssociate(_params);
	//	if(_arrDipSenzaRegole != null && _arrDipSenzaRegole['length'] > 0)
	//	{
	//		forms.giorn_controllo_dip_senza_regole_associate._idditta = forms.giorn_header.idditta;
	//
	//		//in presenza di utenti sede, se la ditta prevede le timbrature, c'è la possibilità
	//		//di scaricare la giornaliera dall'ftp
	//		//TODO regole non associate : a regime bisognerà toglierla
	//		if (globals._tipoConnessione == 0) {
	//
	//			var tipoInst = globals.getTipoInstallazione(forms.giorn_header.idditta, globals.getPeriodo());
	//
	//			switch (tipoInst) {
	//
	//			case 2:
	//
	//				var response = globals.ma_utl_showYesNoQuestion(msg, 'Dipendenti senza regole associate');
	//				if (response) {
	//					globals.importaTracciatoDaFtp(event, forms.giorn_header.idditta,periodo,globals.getGruppoInstallazione(),globals.getGruppoLavoratori());
	//					return;
	//				}
	//				break;
	//
	//			default:
	//				break;
	//			}
	//		}
	//
	//		//altrimenti visualizza i dipendenti senza regole ed impedisce l'accesso in giornaliera
	//		globals.costruisciRiepilogoRegoleNonAssociate(_arrDipSenzaRegole);
	//		forms.giorn_controllo_dip_senza_regole_associate._isInGiornaliera = true;
	//		globals.ma_utl_showFormInDialog('giorn_controllo_dip_senza_regole_associate','Dipendenti senza regole');
	//
	//	}
	//	else
	//	{
	//	    var newPeriodo = new Date(year, month, 1);
	//
	// ricalcoliamo la giornaliera : essendo già impostati i filtri relativi ai gruppi di installazione e
	// dei lavoratori, non li dobbiamo aggiungere di nuovo
	//	    if(application.isInDeveloper())
	//	    	ricalcolaGiornaliera(newPeriodo,forms.giorn_header.idditta,null,null,forms.giorn_header.idlavoratore);
	//	    else
	//		    globals.execAsyncMethod
	//			(
	//				  'EW_Giornaliera'
	//				, controller.getName()
	//				, 'ricalcolaGiornaliera'
	//				, [newPeriodo, forms.giorn_header.idditta, null, null, forms.giorn_header.idlavoratore]
	//			);
	//	}
}

/**
 * Aggiorna la visualizzazione della giornaliera del lavoratore passato
 * (o di quello attualmente selezionato)
 * [utile per aggiornare la visualizzazione al termine di una operazione lunga]
 * 
 * @param {Number} [idLavoratore]
 *
 * @properties={typeid:24,uuid:"02E0E051-4704-47D4-9EE6-29A8C782A220"}
 */
function aggiornaGiornaliera(idLavoratore)
{
	forms.giorn_header.preparaGiornaliera();
    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
}

/**
 * @param {JSEvent} _event
 * @param {Number} [idlav]
 * 
 * @properties={typeid:24,uuid:"1BE7ABBE-A20F-4ABC-A155-0C5B64093110"}
 */
function apriPopupSceltaPeriodo(_event,idlav){
	
	var anno = globals.getAnno();
	var mese = globals.getMese();
	var _arrPer = new Array()
    /** @type Object*/
	var _currPer
	
	var _currMese,_currAnno
	
	//6 mesi precedenti
    for(var down=6;down>0;--down){ 
		
		_currAnno = anno
		_currMese = mese - down
		if(_currMese < 1){
			_currAnno = anno - 1
			if(_currMese < 0)
				_currMese = 12 + _currMese
			else _currMese = 12 -_currMese 
		}
		_currPer = new Object()
		_currPer.y = _currAnno
		_currPer.m = _currMese
	    _arrPer.push(_currPer)
    }
    
    //mese corrente
    _currPer = new Object()
    _currPer.y = anno
	_currPer.m = mese
    _arrPer.push(_currPer)
	
	//6 mesi successivi
	for(var up=1;up<=6;up++){
	    
		_currAnno = anno
	    _currMese = mese + up
		if(_currMese > 12){
			_currAnno = anno + 1
			_currMese = _currMese - 12
		}
		_currPer = new Object()
		_currPer.y = _currAnno
		_currPer.m = _currMese
	    _arrPer.push(_currPer)
	}
		
	var _source = _event.getSource()
	var _popUpMenu = plugins.window.createPopupMenu();
	
	// Aggiungi una voce per ogni periodo
	_arrPer.forEach
	(
		function(periodo)
		{
			var item = _popUpMenu.addMenuItem(globals.getNomeMese(periodo.m).concat(' ', periodo.y), cambiaPeriodoGiornaliera);
				item.methodArguments = [_event, periodo.y, periodo.m,idlav];
		}
	);

	if(_source != null)
		_popUpMenu.show(_source);
	
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Number} [_idlav]
 * 
 * @properties={typeid:24,uuid:"67995738-B977-4FB5-89EF-79C11ED0E208"}
 * @SuppressWarnings(wrongparameters)
 */
function cambiaPeriodoGiornaliera(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _anno, _mese,_idlav) 
{
	var params = {
		processFunction: process_cambia_periodo_giornaliera,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: 'This is the dialog',
		fontType: 'Arial,4,25',
		processArgs: [_event, _anno, _mese,_idlav]
	};
	plugins.busy.block(params);
		
}

/**
 * @param {JSEvent} _event
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Number} _idlav
 *
 * @properties={typeid:24,uuid:"E20594BE-F372-4ECA-BB84-9C0B72075707"}
 */
function process_cambia_periodo_giornaliera(_event,_anno,_mese,_idlav)
{
	// se presenti dei filtri di ricerca informa l'utente che verranno automaticamente
	// rimossi con il cambio di mese
	var answer = true;
	var idLavoratore = _idlav ? _idlav : forms.giorn_header.idlavoratore;
	if (forms.giorn_vista_mensile._filtroAttivo)
		answer = globals.ma_utl_showYesNoQuestion("Il filtro sui dipendenti della giornaliera è attivo. <br/> Attivando il mese il filtro verrà rimosso. Proseguire?", "Attivazione mese");

	if (answer) {
	
		var periodo = _anno * 100 + _mese;
		var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta,
			periodo,
			globals.getGruppoInstallazione(),
			globals.getGruppoLavoratori(),
			globals._tipoConnessione);
		
		// nel caso di giornaliera di budget verfifichiamo se esistano nel mese selezionato dei giorni
		// compilabili altrimenti rimaniamo sulla giornaliera attuale
		if (forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET 
				&& !globals.esistonoGiorniUtilizzabiliInBudget(forms.giorn_header.idlavoratore, _mese, _anno)) 
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('<html>Non esistono giorni utilizzabili con la giornaliera di budget \
	                                          <br/>nel mese selezionato </html>', 'Giornaliera di budget');
			return;
		}
		
	// disattiviamo eventuali filtri sulla giornaliera (indipendentemente dalla risposta)
	globals.disattivaFiltri(_event);
	
	//controlliamo la presenza di dipendenti senza regole associate
//	var msg = '<html>Ci sono dipendenti senza regola associata.<br/>Procedere, se prevista, allo scarico della giornaliera del Cliente?</html>';
	var _arrDipSenzaRegole = params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
	if (_arrDipSenzaRegole != null && _arrDipSenzaRegole.length > 0) 
	{
		forms.giorn_controllo_dip_senza_regole_associate._idditta = params.idditta;
		
		//visualizza i dipendenti senza regole ed impedisce l'accesso in giornaliera
		var frmDipSenzaRegole = globals.costruisciRiepilogoRegoleNonAssociate(_arrDipSenzaRegole, params.idditta);
		frmDipSenzaRegole['_isInGiornaliera'] = false;
		frmDipSenzaRegole['vParams'] = params;
		frmDipSenzaRegole['vOpenProg'] = null;
		frmDipSenzaRegole['vProgParams'] = null;
		frmDipSenzaRegole['vPrimoIngresso'] = null;

		plugins.busy.unblock();
		globals.ma_utl_showFormInDialog(frmDipSenzaRegole.controller.getName(), 'Dipendenti senza regole');

		return;
	}

	// ricalcoliamo la giornaliera
	ricalcolaGiornaliera(globals.getFirstDatePeriodo(periodo)
		                 ,forms.giorn_header.idditta
						 ,globals.getGruppoInstallazione()
						 ,globals.getGruppoLavoratori(),
						 idLavoratore); 
	plugins.busy.unblock();	
	}
	else
	{
		plugins.busy.unblock();
		return;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"AFFE2DFB-C884-400F-B1F5-B362AF3EEDB7"}
 */
function apriSelezionaFiltri(event) {

	if(event.getFormName() == 'intestaMostraTimbr')
	   forms.giorn_filtri._formDiOrigine = 1;
	else
	   forms.giorn_filtri._formDiOrigine = 0;
	   
   forms.giorn_filtri._anno = globals.getAnno();
   forms.giorn_filtri._mese =  globals.getMese();
   
   globals.svy_mod_showFormInDialog(forms.giorn_filtri, -1, -1, 540, 360, 'Operazioni di filtro', false, false, 'win_giorn_filtri', true);
}

/**
 * Rende selezionati tutti giorni del mese (e viceversa) per la vista mensile
 * e per il mostra timbrature
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Number} [selezione] 1 per selezionare, 0 per deselezionare
 * @param {String} [formName] il nome della form per la quale rendere selezionati i giorni
 *  
 * @properties={typeid:24,uuid:"AA491A73-728A-4285-95D8-C5CBD9EC54EA"}
 */
function selezionaTuttoIlMese(event,selezione,formName)
{
	if(event && (event.getFormName() == 'giorn_vista_mensile' || event.getFormName() == 'giorn_mostra_timbr'))
		formName = 'giorn_selezione_multipla_clone';
	
	var selection_form = formName;
	
	if(forms[selection_form])
	{
		var _tSel = 0;
		var fs = forms[selection_form].foundset;
		
		if(fs.getSize() == 0)
			return;
		
		/** @type {Array} */
		var _tParArr =  [];
		
		if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]]
		   && globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel)
			_tParArr = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel;
		
		if(selezione != null)
		   _tSel = selezione;
		else
		{
			if(_tParArr.length > 0)
				_tSel = 0;
			else 
				_tSel = 1;
		}
	
		var fsUpdater = databaseManager.getFoundSetUpdater(fs);
			fsUpdater.setColumn('checked', _tSel);
			fsUpdater.performUpdate();
			
		var offsetSelezione =  forms.giorn_header.assunzione > new Date(globals.getAnno(),globals.getMese() - 1,1) ?
	        forms.giorn_header.assunzione.getDate() +  globals.offsetGg - 1 : globals.offsetGg;	
		
        for (var i = 1; i < offsetSelezione + 1; i++)
        	fs.getRecord(i)['checked'] = 0;
        
        var _totGiorni = globals.getTotGiorniMese
		(
			globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].mese,
            globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].anno
		);
		
		var _arrSelGiorni = [];
		if (_tSel)
		{
			for (var g = 1; g <= _totGiorni; g++) 
			{
				if (_tSel)
				_arrSelGiorni.push(g)
			}
		}
		
		globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = _arrSelGiorni;
	}
	
//	/** @type {String}*/
//	var _tFName,_lFName;
//	var _eFName = event.getFormName();
//	 
//	if(_eFName === 'giorn_vista_mensile' || _eFName === 'giorn_list_temp')
//	{
//		_tFName = 'giorn_list_temp';
//		_lFName = 'giorn_timbr_temp';
//	}
//	else if(_eFName === 'giorn_mostra_timbr' || _eFName === 'giorn_timbr_temp')
//	{
//		_tFName = 'giorn_timbr_temp';
//		_lFName = 'giorn_list_temp';
//	}
//	else
//	{
//		if(formName)
//		{
//			_tFName = formName;
//			if(formName === 'giorn_list_temp')
//				_lFName = 'giorn_timbr_temp';
//			else
//				_lFName = 'giorn_list_temp';
//		}
//		else
//		{
//			_tFName = '';
//			_lFName = '';
//		}
//	}
//	
//    if(forms[_tFName])
//	{
//		var _tFFoundset = forms[_tFName].foundset
//		var _tSel = 0;
//		
//		/** @type {Array} */
//		var _tParArr =  [];
//		
//		if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]]
//		   && globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel)
//			_tParArr = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel;
//		
//		if(selezione != null)
//		   _tSel = selezione;
//		else
//		{
//			if(_tParArr.length > 0)
//				_tSel = 0;
//			else 
//				_tSel = 1;
//			
//		}
//	
//		var fsUpdaterT = databaseManager.getFoundSetUpdater(_tFFoundset);
//			fsUpdater.setColumn('checked', _tSel);
//			fsUpdater.performUpdate();
//		var offsetSelezione =  forms.giorn_header.assunzione > new Date(globals.getAnno(),globals.getMese() - 1,1) ?
//	        forms.giorn_header.assunzione.getDate() +  globals.offsetGg - 1 : globals.offsetGg;	
//		
//        for (var i = 1; i < offsetSelezione + 1; i++){
//			_tFFoundset.getRecord(i)['checked'] = 0;
//		}
//	
//		if (forms[_lFName]) 
//		{
//			var _lFFoundset = forms[_lFName].foundset;
//			var fsUpdaterL = databaseManager.getFoundSetUpdater(_lFFoundset);
//			fsUpdaterL.setColumn('checked', _tSel);
//			fsUpdaterL.performUpdate();
//	
//			for (var j = 1; j < offsetSelezione + 1; j++) {
//				forms[_lFName].foundset.getRecord(j)['checked'] = 0;
//			}
//		}
//
}

/**
 * Disattiva i filtri attivi per la giornaliera ed aggiorna la visualizzazione
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"126037A8-B664-486A-8D3B-24E59F25B291"}
 */
function disattivaFiltri(event) {
	
	// Azzeriamo le indicazioni sui filtri
	azzeraFiltri();
	
	/** @type JSFoundset */
	var _fs = forms.giorn_header.foundset;
	
	// Aggiorniamo le proprietà relative al filtro anagrafico 
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag = false;
	forms.giorn_vista_mensile._filtroAttivo = false;
	// Rimuoviamo i filtri applicati in fase di filtro
	_fs.removeFoundSetFilterParam('ftr_filtriGiornaliera');
	// Ricarichiamo il foundset originale
	_fs.loadAllRecords();
	// Riposizioniamo sul primo dipendente in ordine alfabetico (non manteniamo quindi eventuali selezioni)
	_fs.setSelectedIndex(1);
	
//	forms.giorn_header.preparaGiornaliera(true,null,false);	
	
	//Aggiorniamo l'intestazione
	aggiornaIntestazioni();
			
}

/**
 * Azzera tutte le variabili di filtro
 * 
 * @properties={typeid:24,uuid:"E52188AF-E826-4C8E-9506-0300F9136FB8"}
 */
function azzeraFiltri()
{
	//resetta i parametri alla selezione standard
	forms.giorn_filtri_timbrature._chkAbbuoni = false;
	forms.giorn_filtri_timbrature._chkAnomalie = false;
	forms.giorn_filtri_timbrature._chkGiornateNonConteggiate = false;
	forms.giorn_filtri_timbrature._chkNessunaFascia = false;
	forms.giorn_filtri_giornaliera._arrEvFiltri = [];
	forms.giorn_filtri_giornaliera._chkAnnotazioni = false;
	forms.giorn_filtri_giornaliera._chkEventiLunghi = false;
	forms.giorn_filtri_giornaliera._chkEventiLunghiDaCalc = false;
	forms.giorn_filtri_giornaliera._chkEvento = false;
	forms.giorn_filtri_giornaliera._chkSquadrati = false;
	forms.giorn_filtri_giornaliera._strRiep = '';
	forms.giorn_filtri_giornaliera.elements.btn_filtri_ev.enabled = false;
	
	forms.giorn_filtri._arrCatBloccanti = [];
	forms.giorn_filtri._ftrBloccanti = false;
	
}

/**
 * This function is used as a method to filter the program 'LEAF_Giornaliera'
 * in the lookup window 
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"451C05CE-2E9A-41F8-8641-ABE60430E886"}
 */
function FiltraLavoratoriGiornaliera(_fs)
{
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag)
	{
		var response = globals.ma_utl_showYesNoQuestion('Sono presenti dei filtri attivi. Rimuoverli prima di proseguire?','Predisposizione invio');
		if(response)
		{
			globals.disattivaFiltri(new JSEvent);
			forms.giorn_header.preparaGiornaliera(true,null,false);
		}
	}
	_fs.addFoundSetFilterParam('idlavoratore','IN',globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore'));
	return _fs;

}

/**
 * @properties={typeid:24,uuid:"7023C9C7-9CD1-4BED-AF95-2F168E20339D"}
 */
function apriPannelloDiControllo(){
	
	costruisciPannelloDiControllo()
	
	globals.svy_nav_showForm('giorn_pannello_controllo','LEAF_PDC',true)
	
}

/**
 * Costruzione pannello di controllo
 * 
 * @param {Number} [periodo]
 * @param {Number} [soloInstallate]
 * @param {Number} [periodoInizInc]
 * @param {Number} [periodoFinInc]
 *
 * @properties={typeid:24,uuid:"1AD2A40D-B97C-42F8-9B64-19A921056CF7"}
 * @SuppressWarnings(unused)
 */
function costruisciPannelloDiControllo(periodo,soloInstallate,periodoInizInc,periodoFinInc){
	
	var _periodo;
	var _soloInstallate = forms.giorn_pannello_controllo._soloinstallate;
	var _periodoInizInc = 201111;
	var _periodoFinInc ;
	var _today = new Date();
	var _frmName = 'giorn_pannello_controllo_tbl_temp'
	var _frmOri = 'giorn_pannello_controllo_tbl'	
	
	if(periodo != null && periodo != undefined && periodo != ''){
	
		_periodo = periodo
		
	    if(periodoFinInc != null && periodoFinInc != undefined && periodoFinInc != '')
	        _periodoFinInc = periodoFinInc
	    else	
	    	_periodoFinInc = _periodo 
	    
	    forms.giorn_pannello_controllo._anno = _periodo / 100;
		forms.giorn_pannello_controllo._mese = _periodo % 100;
	}	
	else{
		
		forms.giorn_pannello_controllo._anno = _today.getFullYear();
		forms.giorn_pannello_controllo._mese = _today.getMonth() + 1;
		
		_periodo = forms.giorn_pannello_controllo._anno * 100 + forms.giorn_pannello_controllo._mese;
		if(forms.giorn_pannello_controllo._mese > 1)
			_periodoFinInc = _periodo - 1
		else
			_periodoFinInc = (forms.giorn_pannello_controllo._anno - 1) * 100 + 1
	}
	forms.giorn_pannello_controllo._condizione = 'AND'
	
	forms.giorn_pannello_controllo.elements.lbl_header.text = 
		"Periodo Giornaliera in esame " + globals.getNomeMese(forms.giorn_pannello_controllo._mese) +
		" " + forms.giorn_pannello_controllo._anno

	forms.giorn_pannello_controllo.elements.tab_pannello_controllo.removeAllTabs()
	
	if(solutionModel.getForm(_frmName) != null){
		history.removeForm(_frmName)
		solutionModel.removeForm(_frmName)
	}
	
	var _pdcFrm = solutionModel.cloneForm(_frmName,solutionModel.getForm(_frmOri))
	
	var _pdcSql = 'SELECT idDitta,CodDitta,RagioneSociale,Installato,Incongruente,Pervenuta,Acquisita,Chiusa,Stampata,Inviata,AcquisitaCliente FROM F_LU_PannelloDitte(?,?,?,?) WHERE Ore_GestioneEpi2 = 1'
		
	    if(forms.giorn_pannello_controllo._codice != '' && forms.giorn_pannello_controllo._codice != null)
	    	_pdcSql += ' AND CodDitta = '.concat(forms.giorn_pannello_controllo._codice);
	    
	    _pdcSql += ' ORDER BY CodDitta'
	
	    var _pdcArr = new Array()
	    _pdcArr.push(_periodo)
		_pdcArr.push(_soloInstallate)
		_pdcArr.push(_periodoInizInc)
		_pdcArr.push(_periodoFinInc)
    var _pdcDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_pdcSql,_pdcArr,5000)
	
	if (_pdcDs.addColumn('Info', 12)) {
		for (var i = 1; i <= _pdcDs.getMaxRowIndex(); i++) {

			//impostiamo il flag visivo di stato a seconda della presenza o meno di una incongruenza
			if (_pdcDs.getValue(i, 5) == 0)
				_pdcDs.setValue(i, 5, "media:///record_20_verde.png")
			else
				_pdcDs.setValue(i, 5, "media:///record_20_rosso.png")

			//impostiamo il flag visivo di info a seconda che una ditta abbia o meno installato il software	
			if (_pdcDs.getValue(i, 4) == 1)
			{
				_pdcDs.setValue(i, 12, "media:///hr_q_info_16.png")
			    _pdcDs.getValue(i,6) == null ? _pdcDs.setValue(i,6,null) : _pdcDs.setValue(i,6,utils.dateFormat(_pdcDs.getValue(i,6),globals.EU_DATEFORMAT))
			   	_pdcDs.getValue(i,7) == null ? _pdcDs.setValue(i,7,null) : _pdcDs.setValue(i,7,utils.dateFormat(_pdcDs.getValue(i,7),globals.EU_DATEFORMAT))
			   	_pdcDs.getValue(i,8) == null ? _pdcDs.setValue(i,8,null) : _pdcDs.setValue(i,8,utils.dateFormat(_pdcDs.getValue(i,8),globals.EU_DATEFORMAT))		
			   	_pdcDs.getValue(i,9) == null ? _pdcDs.setValue(i,9,null) : _pdcDs.setValue(i,9,utils.dateFormat(_pdcDs.getValue(i,9),globals.EU_DATEFORMAT))		
			   	_pdcDs.getValue(i,10) == null ? _pdcDs.setValue(i,10,null) : _pdcDs.setValue(i,10,utils.dateFormat(_pdcDs.getValue(i,10),globals.EU_DATEFORMAT))
			   	_pdcDs.getValue(i,11) == null ? _pdcDs.setValue(i,11,null) : _pdcDs.setValue(i,11,utils.dateFormat(_pdcDs.getValue(i,11),globals.EU_DATEFORMAT))
						
			}else
				{
					//impostiamo le virgolette per le ditte non installate già stampate
					if(_pdcDs.getValue(i,9) != null)
					{
						_pdcDs.setValue(i,6,'//')
						_pdcDs.setValue(i,7,'//')
						_pdcDs.setValue(i,10,'//')
						_pdcDs.setValue(i,11,'//')
						
					}
					
					_pdcDs.getValue(i,8) == null ? _pdcDs.setValue(i,8,null) : _pdcDs.setValue(i,8,utils.dateFormat(_pdcDs.getValue(i,8),globals.EU_DATEFORMAT))		
					_pdcDs.getValue(i,9) == null ? _pdcDs.setValue(i,9,null) : _pdcDs.setValue(i,9,utils.dateFormat(_pdcDs.getValue(i,9),globals.EU_DATEFORMAT))
				
				}
						
		}

	}
	
//	var _pdcDSource = _pdcDs.createDataSource('_pdcDSource',[JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.TEXT,JSColumn.NUMBER])
	var _pdcDSource = _pdcDs.createDataSource('_pdcDSource',[JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT])
	solutionModel.getForm(_frmName).dataSource = _pdcDSource
	solutionModel.getForm(_frmName).getField('fld_idditta').dataProviderID = 'idDitta'
	solutionModel.getForm(_frmName).getField('fld_codice').dataProviderID = 'CodDitta'
	solutionModel.getForm(_frmName).getField('fld_ragione_sociale').dataProviderID = 'RagioneSociale'
	solutionModel.getForm(_frmName).getField('fld_installato').dataProviderID = 'Installato'
	solutionModel.getForm(_frmName).getField('fld_stato').dataProviderID = 'Incongruente'
	solutionModel.getForm(_frmName).getField('fld_pervenuta').dataProviderID = 'Pervenuta'
	solutionModel.getForm(_frmName).getField('fld_acquisita').dataProviderID = 'Acquisita'
	solutionModel.getForm(_frmName).getField('fld_chiusa').dataProviderID = 'Chiusa'
	solutionModel.getForm(_frmName).getField('fld_stampata').dataProviderID = 'Stampata'
	solutionModel.getForm(_frmName).getField('fld_inviata').dataProviderID = 'Inviata'
	solutionModel.getForm(_frmName).getField('fld_acquisita_cliente').dataProviderID = 'AcquisitaCliente'
	solutionModel.getForm(_frmName).getField('fld_info').dataProviderID = 'Info'
		
	forms.giorn_pannello_controllo.elements.tab_pannello_controllo.addTab(_frmName,'',null,null,null)
}

/**
 * @param {String} userID
 * @param {Number} idditta
 * @param {Number} iddipendente
 * @param {Number} periodo
 * 
 * * @return true if there are concurrent operations, false otherwise.
 * 
 * @properties={typeid:24,uuid:"BD7E982E-D7FD-44F6-A662-1BDB8BD506BC"}
 */
function checkForConcurrentOperations(userID, idditta, iddipendente, periodo)
{
	var msg = 'Un\'altra operazione potrebbe essere in corso sui dati richiesti.<br/>I dati potrebbero non essere aggiornati.';
	var response = globals.askForConcurrentOperations(userID, idditta, iddipendente, periodo);

	if(response.returnValue && response.returnValue === false)
	{
		globals.ma_utl_showErrorDialog(response.message,'Errore');
		return false;
	}
	else if(response.status !== 0)
	{		
		if(response.status === 1)
		{
			// Same user's operation
			globals.ma_utl_showWarningDialog('<br/>Per una lista delle operazioni, selezionare la voce <strong>\'Storico operazioni\'</strong><br/>dal menu Giornaliera','i18n:hr.msg.attention');
		}
		else if(response.status === -1)
		{
			// Other users' operations
			globals.ma_utl_showWarningDialog(msg,'i18n:hr.msg.attention');
		}
		
		return false;
	}
	
	return true;
}

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6F521B86-AD5F-4501-B877-3BBF1816C199"}
 */
var jsonParams = '';




/**
 * 
 * @param {Number} _idditta
 * @param {Number} _periodo
 * @param {Number} _tipoconnessione
 * @param {Array} _giornisel
 * @param {Array} _idDipsel
 * @param {Boolean} _bSingoloDip
 *
 * @properties={typeid:24,uuid:"6062A4A6-1100-40CF-81BB-74547F4951B7"}
 */
function inizializzaParametriControlli(_idditta, _periodo, _tipoconnessione, _giornisel, _idDipsel, _bSingoloDip)
{	
	return {
		user_id            		 : security.getUserName(), 
		client_id           	 : security.getClientID(),
		idditta					 : _idditta,
		idgruppoinstallazione	 : globals.getGruppoInstallazioneDitta(_idditta), 
		periodo					 : _periodo,
		tipoconnessione			 : _tipoconnessione,
		giorniselezionati		 : _giornisel,
		iddipendenti			 : _idDipsel,
		singolodipendente		 : _bSingoloDip
	};
}

/**
 * Inizializza i parametri per l'inserimento/modifica di una voce
 * 
 * @param {Number} _idditta
 * @param {Number} _periodo
 * @param {Number} _tipoOperazione
 * @param {Array} _iddipendenti
 * @param {String} _codicepaghe
 * @param {Number} _quantita
 * @param {Number} _importo
 * @param {Number} _base
 * @param {Number} _percentuale
 * @param {Number} _portasujob
 * @param {Boolean} _isinmodifica
 * @param {Number} _tipoconnessione
 *
 * @properties={typeid:24,uuid:"E61699C4-81B5-4785-87E4-B9E388B9E952"}
 */
function inizializzaParametriVoce(_idditta,_periodo,_tipoOperazione,_iddipendenti,_codicepaghe,
								  _quantita,_importo,_base,_percentuale,_portasujob,_isinmodifica,_tipoconnessione)
{
	
	return {
		user_id                 : security.getUserName(), 
		client_id               : security.getClientID(),
		idditta                 : _idditta,
	    periodo                 : _periodo,
	    tipooperazione          : _tipoOperazione,
	    iddipendenti            : _iddipendenti,
	    codicepaghe             : _codicepaghe,
	    quantita                : _quantita,
	    importo                 : _importo,
	    base                    : _base,
	    percentuale             : _percentuale,
	    portasujob              : _portasujob,
	    modifica                : _isinmodifica,
		tipoconnessione         : _tipoconnessione
		 
	};
}
/**
 * Inizializza i parametri per l'importazione del tracciato del mese
 * 
 * @param {Number} _idditta
 * @param {Number} _periodo
 * @param {Number} _gruppoinst
 * @param {String} _gruppolav
 * @param {Array} _iddipendenti
 * @param {Number} _tracciatoOre
 * @param {Number} [_tipoconnessione]
 * 
 * @properties={typeid:24,uuid:"820A25A2-F941-4939-87F5-CF0EEABB6B8A"}
 */
function inizializzaParametriTracciatoMese(_idditta, _periodo, _gruppoinst, _gruppolav, _iddipendenti,_tracciatoOre,_tipoconnessione)
{
	return {
		user_id                 : security.getUserName(), 
		client_id               : security.getClientID(),
		idditta					: _idditta,
		periodo					: _periodo,
		idgruppoinstallazione	: _gruppoinst, // TODO da eliminare
		gruppoinstallazione	    : _gruppoinst,
		gruppolavoratori		: _gruppolav,
		iddipendenti            : _iddipendenti,
		idtracciatoore          : _tracciatoOre,
		tipoconnessione         : _tipoconnessione
		
	};
}

/**
 * Inizializza i parametri per la funzione di scarico delle timbrature
 * 
 * @param {Number} _idditta
 * @param {Number} _periodo
 * @param {Number} _gruppoinst
 * @param {String} _gruppolav
 * @param {Number} _tipoconnessione
 * 
 * @properties={typeid:24,uuid:"B00BBACE-AA24-41B8-904C-EB2314D6D3A1"}
 */
function inizializzaParametriScaricaTimbrature(_idditta, _periodo, _gruppoinst, _gruppolav,_tipoconnessione)
{
	return {
		user_id                : security.getUserName(), 
		client_id              : security.getClientID(),
		idditta                : _idditta,
		periodo                : _periodo,
		idgruppoinstallazione  : _gruppoinst, //TODO da eliminare
		gruppoinstallazione    : _gruppoinst,
	    gruppolavoratori       : _gruppolav,
		tipoconnessione        : _tipoconnessione
	};
}

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"F941AA33-F1D0-442C-9048-C8B9892101B5",variableType:-4}
 */
var idDipendenti = [];

/**
 * @param {Function} operazione
 * @param {Array} [args]
 * @param {Boolean} [showLookup]
 *
 * @properties={typeid:24,uuid:"4D406A4C-5688-4CB7-8EC4-B2E513DF9FC4"}
 */
function operazioneMultipla(operazione, args, showLookup)
{	
	if(showLookup)
	{
		globals.ma_utl_showMultiSelectLookup(
			 null
			,'idDipendenti'
			,'LEAF_Giornaliera'
			,null
			,'giorn_header.FiltraAnagraficaLavoratoriGiorn'
			,null
			,true
			);
		
		if(args)
			args.push(idDipendenti);
		else
			args = [idDipendenti];
	}		
	
	if(args.length > 0)
		operazione.apply(null, args);
}

/**
 * @param {Function} operazione
 * @param {Array} [args]
 *
 * @properties={typeid:24,uuid:"65C6BF53-1B5B-4DFC-828F-79912CEE78BE"}
 */
function operazioneSingola(operazione, args)
{
	if(args.length > 0)
		operazione.apply(null, args);
}

/**
 * @param {Function} operazione
 * @param {String} form
 * @param {Array} [arrayGiorni]
 * @param {Array} [arrayDipendenti]
 *
 * @properties={typeid:24,uuid:"5A1EDCCB-70C9-475D-BFF9-2687B317D018"}
 * @AllowToRunInFind
 */
function showOperazioneSingola(operazione, form, arrayGiorni, arrayDipendenti)
{
	/** @type {Form<giorn_operazionesingola>} */
	var formObj = forms[form];
	formObj.vOperation = operazione;
	formObj.vArrDip = arrayDipendenti
	
	// Empty the days and employees tabs
	formObj.elements.giorni_tabless.removeAllTabs();
	
	// Genera la form di selezione dei giorni, aggiungendo la checkbox di selezione multipla
	var giorniFormName = forms.giorn_operazionemultipla_mese.controller.getName();
	var giorniCloneName = giorniFormName + '_clone';
	
	var periodo = globals.getPeriodo();
	/** @type {Date} */
	var firstDay = utils.parseDate(periodo.toString(10), globals.PERIODO_DATEFORMAT);
	var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
	var days = lastDay.getDate();
	
	var daysDs = databaseManager.createEmptyDataSet(0, ['checked', 'day']);
	for(var d = 0; d < days; d++)
	{		
		daysDs.addRow([0, new Date(firstDay.getFullYear(), firstDay.getMonth(), d + 1)]);
	}
	
	// Forse si potrebbe evitare ricostruendo semplicemente il datasource...
	var giorniForm;
	if(forms[giorniCloneName])
	{
		history.removeForm(giorniCloneName);
		solutionModel.removeForm(giorniCloneName);
	}
	
	giorniForm = solutionModel.cloneForm(giorniCloneName, solutionModel.getForm(giorniFormName));		
	giorniForm.dataSource = daysDs.createDataSource('giorniFormDs_' + application.getUUID(), [JSColumn.INTEGER, JSColumn.DATETIME]);
	giorniForm.getField('fld_giorno').dataProviderID = 'day';
	
	var giorniFormMs = globals.ma_utl_addMultipleSelection(giorniForm.name);
	if(arrayGiorni)
	{
		var giorniFs = forms[giorniFormMs.name].foundset;
			giorniFs.loadAllRecords();
			
		if(giorniFs.find())
		{
			giorniFs['_sv_rowid'] = arrayGiorni;
			giorniFs.search();
			
			var giorniFsUpdater = databaseManager.getFoundSetUpdater(giorniFs);
			giorniFsUpdater.setColumn('checked', 1);
			giorniFsUpdater.performUpdate();
			
			giorniFs.loadAllRecords();
		}		
	}
	// Set the tab with the modified form
	formObj.elements.giorni_tabless.addTab(giorniFormMs.name);
	
	globals.ma_utl_showFormInDialog(formObj.controller.getName(), 'Seleziona i giorni');
}



/**
 * @param {Number} employeesId
 * @param {Array} [arrayGiorni]
 * @param {Boolean} [askYesNo]
 * @param {Number} [periodo]
 *
 * @properties={typeid:24,uuid:"23AB96FD-5D4D-47A6-88CB-C5A59F9F7F66"}
 */
function compilaDalAlSingolo(employeesId, arrayGiorni, askYesNo, periodo)
{
	/** @type {Number} */
	var _periodo = periodo != null ? periodo : globals.getPeriodo();
	
	var params = globals.inizializzaParametriCompilaConteggio(
	                     forms.giorn_header.idditta,
	                     _periodo,
	                     forms.giorn_vista_mensile._tipoGiornaliera,
	                     globals._tipoConnessione,
	                     arrayGiorni,
	                     [employeesId],
						 false
	             );
	
	//lanciamo il calcolo per la compilazione 
	var url = globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ? WS_MULTI_URL + "/Giornaliera/CompilaDalAl" : WS_URL + "/Eventi/CompilaDalAl"
	
	var msg = "Procedere con la compilazione?";
	var answer =  askYesNo ? globals.ma_utl_showYesNoQuestion(msg,'Compilazione giorni') : true;
	
	if (answer) 
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione([employeesId], forms.giorn_header.idditta))
			return;
		
		var _params = {
	        processFunction: process_compila_singolo_dip,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : '',
	        fontType: 'Arial,4,25',
	        processArgs: [url,params]
	    };
		plugins.busy.block(_params);
			
	} else
		return;
}

/**
 * @param {Number} employeesId
 * @param {Array<Number>} arrayGiorni
 * @param {Number} periodo
 *
 * @properties={typeid:24,uuid:"E6DE4764-BCE7-46B1-A44C-D46786CC910F"}
 */
function compilaDalAlSingoloSync(employeesId, arrayGiorni, periodo)
{
	/** @type {Number} */
	var _periodo = periodo != null ? periodo : globals.getPeriodo();
	
	var params = globals.inizializzaParametriCompilaConteggio(
	                     forms.giorn_header.idditta,
	                     _periodo,
	                     forms.giorn_vista_mensile._tipoGiornaliera,
	                     globals._tipoConnessione,
	                     arrayGiorni,
	                     [employeesId],
						 false
	             );
	
	//lanciamo il calcolo per la compilazione 
	var url = globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ? WS_MULTI_URL + "/Giornaliera/CompilaDalAl" : WS_URL + "/Eventi/CompilaDalAl"
	
	var response = globals.getWebServiceResponse(url + 'Singolo', params);
	if (!response['returnValue'])
		globals.ma_utl_showErrorDialog('Si è verificato un errore durante l\'aggiornamento della giornaliera, riprovare', 'Inserimento timbratura dipendente');
}

/**
 * @param url
 * @param params
 *
 * @properties={typeid:24,uuid:"C99A2563-037D-490E-B6F5-E66DA81DEB19"}
 */
function process_conteggia_singolo_dip(url,params)
{		
	try
	{
		var response = globals.getWebServiceResponse(url + 'Singolo', params);
		if (!response['returnValue'])
			globals.ma_utl_showErrorDialog('Si è verificato un errore durante il conteggio, riprovare', 'Conteggia timbrature giorni');
		else
		{
		    forms.giorn_header.preparaGiornaliera();
		    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_conteggia_singolo_dip : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @param url
 * @param params
 *
 * @properties={typeid:24,uuid:"8B32541F-6F7B-426E-9C83-7065F8255ADF"}
 */
function process_compila_singolo_dip(url,params)
{
	try
	{
		if(globals.ma_utl_hasKey(globals.Key.NEGOZIO))
		   inizializzaGiornProgFasceNonCompilate(params.iddipendenti,params.periodo,params.giorniselezionati);
		
		var response = globals.getWebServiceResponse(url + 'Singolo', params);
		if (!response['returnValue'])
			globals.ma_utl_showErrorDialog('Si è verificato un errore durante la compilazione, riprovare', 'Compilazione giorni');
		else
		{
		    forms.giorn_header.preparaGiornaliera();
		    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_compila_singolo_dip : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Compila gli eventi in giornaliera a partire dalle ore inserite su commessa
 * 
 * @param {Number} employeesId
 * @param {Array<Number>} arrayGiorni
 * @param {Boolean} [askYesNo]
 *
 * @properties={typeid:24,uuid:"355F4AFD-6379-47B4-B840-2C0E5A96D40B"}
 */
function compilaDalAlCommesseSingolo(employeesId, arrayGiorni, askYesNo) 
{
	var anno = globals.getAnno();
	var mese = globals.getMese();
	var soloAutorizzate = globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA) ? 1 : 0;

	var msg = "Procedere con la compilazione?";
	var answer = askYesNo ? globals.ma_utl_showYesNoQuestion(msg,'Compilazione giorni') : true;

	if (answer) 
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if (!scopes.giornaliera.cancellaChiusuraDipPerOperazione([employeesId], forms.giorn_header.idditta))
			return;

		var _params = {
	        processFunction: process_compila_singolo_dip_da_commesse,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : '',
	        fontType: 'Arial,4,25',
	        processArgs: [employeesId,anno,mese,arrayGiorni,soloAutorizzate]
	    };
		plugins.busy.block(_params);

	} else
		return;

}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Number} idLavoratore
 * @param {Number} anno
 * @param {Number} mese
 * @param {Array<Number>} arrayGiorni
 * @param {Number} soloAutorizzate
 *
 * @properties={typeid:24,uuid:"4F198D45-6F71-4853-AAD2-56F9F0FB6C33"}
 */
function process_compila_singolo_dip_da_commesse(idLavoratore,anno,mese,arrayGiorni,soloAutorizzate)
{
	try
	{
		// verifica festività dipendente nel periodo
		/** @type {Array<Date>}*/
		var arrGiorniFestivi = [];
		var idDitta = getDitta(idLavoratore);
		var arrFestivitaDip = globals.getFestivitaDipendente(idDitta,
			                                                 idLavoratore,
															 anno * 100 + mese);
		for(var f = 0; f < arrFestivitaDip.length; f++)
			arrGiorniFestivi.push(new Date(anno, mese - 1, arrFestivitaDip[f]));
				
		for (var g = 0; g < arrayGiorni.length; g++) 
		{
			var currGiorno = new Date(anno, mese - 1, arrayGiorni[g]);
			var isFestivo = arrGiorniFestivi.indexOf(currGiorno) != -1;
			var oreTeo = (globals.ottieniOreTeoricheGiorno(idLavoratore, currGiorno) / 100);
			var oreComm = globals.getTotOreCommesseGiornoDipendente(currGiorno, idLavoratore, soloAutorizzate);
			var idEv;
			var propEv;
			var oreEv;
	
			var params = globals.inizializzaParametriCompilaConteggio(idDitta,
																	  anno * 100 + mese,
																	  forms.giorn_vista_mensile._tipoGiornaliera,
																	  globals._tipoConnessione,
																	  [arrayGiorni[g]],
																	  [idLavoratore],
																	  false
																	);
	
			//lanciamo il calcolo per la compilazione
			var url = WS_URL + "/Eventi/CompilaDalAl"
			
			// operazione di compilazione iniziale
			globals.getWebServiceResponse(url + 'Singolo', params);
	
			if(oreComm == null)
				oreComm = 0;
			
			if (oreComm > oreTeo || oreComm > 0 && isFestivo) 
			{
				// evento aggiuntivo da inserire : LS (D) per dipendente part time, S (D) per dipendente full time
				// in futuro potrebbe essere lo straordinario da definire 672 oppure direttamente l'evento indicato come
				// da generare per la specifica commessa
				if(globals.getPercentualePartTime(idLavoratore) != 0)
					idEv = 602 //681; // LSD lavoro supplementare da definire
				else
					idEv = 480 //672; // SD straordinario da definire 
				
				var arrProp = getProprietaSelezionabili(idEv,idLavoratore,anno * 100 + mese,arrayGiorni[g],forms.giorn_vista_mensile._tipoGiornaliera);	
				propEv = globals.getCodiceProprieta(arrProp);
				oreEv = isFestivo ? oreComm : oreComm - oreTeo;
			}
			else
			{
				var oreSostBudget = globals.getTotaleOreSostitutiveInBudget(idLavoratore,currGiorno,currGiorno);
				// TODO PD solamente se previsto, altrimenti F/ROL 
				idEv = 630;
				propEv = '';
				oreEv = oreTeo - (oreComm + oreSostBudget);
				oreEv > 0 ? oreEv : 0;
			}
	
			if(oreEv != 0)
			{
				params = globals.inizializzaParametriEvento(idDitta
					, anno * 100 + mese
					, 0
					, [arrayGiorni[g]]
					, forms.giorn_vista_mensile._tipoGiornaliera
					, globals.TipoConnessione.CLIENTE
					, [idLavoratore]
					, idEv
					, propEv
					, oreEv
					, 0
					, -1
					, ''
					, 0);
	
				if(!globals.salvaEvento(params))
					throw new Error('Errore durante il salvataggio dell\'evento');
			}
		}
	
		forms.giorn_header.preparaGiornaliera();
		
		globals.verificaDipendentiFiltrati(idLavoratore);
	}
	catch(ex)
	{
		var msg = 'Metodo process_compila_singolo_dip_da_commesse : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}	
}

/**
 * @param {Array<Number>} employeesIds
 * @param {Array<Number>} [arrayGiorni]
 * @param {Boolean} [soloNonConteggiati]
 * @param {Number} [idDitta]
 * @param {Number} [periodo]
 * @param {Boolean} [askYesNo]
 *
 * @properties={typeid:24,uuid:"A9EFA225-27B4-45FA-B321-3BEEDC6163B9"}
 */
function compilaDalAl(employeesIds, arrayGiorni, soloNonConteggiati, idDitta, periodo, askYesNo)
{
	var _idDitta = idDitta != null ? idDitta : forms.giorn_header.idditta;
	var _periodo = periodo != null ? periodo : globals.getPeriodo();
	var _tipoGiorn = forms.giorn_vista_mensile && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET ?
			         globals.TipoGiornaliera.BUDGET : globals.TipoGiornaliera.NORMALE; // TODO da verificare...
		
	var params = globals.inizializzaParametriCompilaConteggio(   _idDitta,
											                     _periodo,
											                     _tipoGiorn,
											                     globals._tipoConnessione,
											                     arrayGiorni,
											                     employeesIds,
																 false
	                                                         );
	
	//lanciamo il calcolo per la compilazione 
	var url = globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ? WS_MULTI_URL + "/Giornaliera/CompilaDalAl" : WS_MULTI_URL + "/Eventi/CompilaDalAl";
	
	var msg = "Procedere con la compilazione?";
	var answer = askYesNo ? globals.ma_utl_showYesNoQuestion(msg,'Compilazione giorni') : true;
	
	if (answer)
	{
		// nel caso di programmazione negozio, precompilare le fasce non ancora programmate (altrimenti considererebbe il numero di ore teoriche)
		if(globals.ma_utl_hasKey(globals.Key.NEGOZIO))
		   inizializzaGiornProgFasceNonCompilate(employeesIds,_periodo,arrayGiorni);
		
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds, _idDitta))
			return;
		globals.addJsonWebServiceJob(url,
			                         params,
									 vUpdateOperationStatusFunction);
	}
	else
		return;
}

/**
 * @properties={typeid:24,uuid:"BF6B606B-E85E-4A0F-B5D8-6D990C10C789"}
 */
function compilaDalAlSync(params, nonInteractive)
{
	nonInteractive = nonInteractive == true;
	
	/** @type {{ returnValue: Boolean, message: String }} */ 
	var result;
	var url = globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ? WS_MULTI_URL + "/Giornaliera/CompilaDalAlSync" : WS_MULTI_URL + "/Eventi/CompilaDalAlSync"
	
	var answer = nonInteractive || globals.ma_utl_showYesNoQuestion('Procedere con la compilazione?', 'Compilazione giorni');
	if (answer)
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(scopes.giornaliera.cancellaChiusuraDipPerOperazione(params.iddipendenti, params.idditta, params.periodo))
			result = globals.getWebServiceResponse(url, params);
	}
	
	return { error: !result.returnValue, message: result.message };
}

/**
 * @param {Array} employeesIds
 * @param {Array} arrayGiorni
 * @param {Array} unknown
 * @param {Array} argsEvento
 * 
 * @properties={typeid:24,uuid:"1336C5B0-E0CB-447B-87FF-E4A027112891"}
 */
function salvaEventoMultiplo(employeesIds, arrayGiorni, unknown, argsEvento)
{
	var params = {
		user_id                 : security.getUserName(), 
		client_id               : security.getClientID(),
		periodo                 : globals.getPeriodo(),
		idditta                 : forms.giorn_header.idditta,
		iddipendenti            : employeesIds,
		giorniselezionati       : arrayGiorni,
		idevento                : argsEvento['idevento'],
		ideventomod             : argsEvento['ideventomod'],
		codproprieta            : argsEvento['codproprieta'] != null ? argsEvento['codproprieta'] : "",
		codproprietamod         : argsEvento['codproprietamod'] != null ? argsEvento['codproprietamod'] : "",
		ore                     : argsEvento['ore'],
		coperturaorarioteorico  : argsEvento['coperturaorarioteorico'],
		tipogiornaliera         : argsEvento['tipogiornaliera'],
		tipoconnessione         : argsEvento['tipoconnessione'],
		ricalcolaproprieta      : argsEvento['ricalcolaproprieta']
	}
	
	var url = WS_MULTI_URL + "/Eventi/SalvaAsync";
	
	//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
	if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds, forms.giorn_header.idditta))
		return;
	
	globals.addJsonWebServiceJob
	(
		  url
		, params
		, vUpdateOperationStatusFunction
		, null
		, function(retObj)
		  {
			  forms.giorn_vista_mensile.markAsDirty(params.iddipendenti, params.periodo);
			  forms.giorn_mostra_timbr.markAsDirty(params.iddipendenti, params.periodo);
			  
			  forms.mao_history.operationDone(retObj);
		  }
	);
	
}

/**
 * @param {JSEvent} event
 * @param {Boolean} [timbr]
 * @param {Boolean} [daFlusso]
 * 
 * @properties={typeid:24,uuid:"E72962F1-948E-4B7E-AFC4-FE7CEF37FCB6"}
 */
function compilaDalAlMultiplo(event,timbr,daFlusso)
{
	var dipGiornaliera = globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore');
	var dipSel = [];
	var giorniSel = [];
	if(!daFlusso)
	{
		giorniSel = timbr ? globals.getGiorniSelezionatiTimbr() : globals.getGiorniSelezionatiEv();
		dipSel = [forms.giorn_header.idlavoratore];
	}
	
	showOperazioneMultipla(
	    globals.ma_utl_hasKey(globals.Key.COMMESSE_COMPILA_GIORNALIERA) ? compilaDalAlCommesse : compilaDalAl
		, forms.giorn_operazionemultipla.controller.getName()
		, giorniSel
		, dipSel
		, true
		, function(fs)
		  { 
			  fs.addFoundSetFilterParam('idlavoratore','IN',dipGiornaliera);			  
		  }
	    ,null
		,null
		,null
		,'Compilazione giorni'
	);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7E0ECB6B-726D-46B3-B788-98369B7E6FB3"}
 */
function compilaDalAlCommesseMultiplo(event)
{
	var dipGiornaliera = globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore');
	var dipSel = [];
	var giorniSel = [];
	
	giorniSel = globals.getGiorniSelezionatiEv();
	dipSel = [forms.giorn_header.idlavoratore];
		
	showOperazioneMultipla(
		compilaDalAlCommesse
		, forms.giorn_operazionemultipla.controller.getName()
		, giorniSel
		, dipSel
		, true
		, function(fs)
		  { 
			  fs.addFoundSetFilterParam('idlavoratore','IN',dipGiornaliera);			  
		  }
	    ,null
		,null
		,null
		,'Compilazione giorni da ore su commessa'
	);
}

/**
 * @param {JSEvent} event
 * @param {Boolean} [timbr]
 * @param {Boolean}  [daFlusso]
 * 
 * @properties={typeid:24,uuid:"650F1CB5-C16E-43E2-B59D-7FE9DD7E2924"}
 */
function conteggiaTimbratureMultiplo(event,timbr,daFlusso)
{
	var dipGiornaliera = globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore');
	var dipSel = [];
	var giorniSel = [];
	if(!daFlusso)
	{
		giorniSel = timbr ? globals.getGiorniSelezionatiTimbr() : globals.getGiorniSelezionatiEv();
		dipSel = [forms.giorn_header.idlavoratore];
	}
	
	showOperazioneMultipla
	(
		  conteggiaTimbrature
		, forms.giorn_operazionemultipla.controller.getName()
		, giorniSel
		, dipSel
		, true
		, function(fs)
		  { 
			  fs.addFoundSetFilterParam('idlavoratore','IN',dipGiornaliera);
		  }
  	   ,null
	   ,null
	   ,null
	   ,'Conteggio timbrature'  
	);
}

/**
 * @param {Array<Number>} employeesIds
 * @param {Array} arrayGiorni
 * @param {Boolean} [soloNonConteggiati]
 * @param {Number} [idDitta]
 * @param {Number} [periodo]
 * @param {String} [tipoGiorn]
 * @param {Boolean} [askYesNo]
 * 
 * @properties={typeid:24,uuid:"8D58B8E6-CDB1-40B6-80DD-4F8C1A7B78EF"}
 */
function conteggiaTimbratureSingolo(employeesIds, arrayGiorni, soloNonConteggiati,idDitta,periodo,tipoGiorn,askYesNo)
{
	var params = globals.inizializzaParametriCompilaConteggio(
	                     idDitta != null ? idDitta : forms.giorn_header.idditta,
                   		 periodo != null ? periodo : globals.getPeriodo(),
	                     tipoGiorn != null ? tipoGiorn : forms.giorn_vista_mensile._tipoGiornaliera,
	                     globals.TipoConnessione.CLIENTE,
	                     arrayGiorni,
	                     employeesIds,
						 soloNonConteggiati != null ? soloNonConteggiati : false
	             );
	
	//lanciamo il calcolo per la compilazione 
	var url = WS_URL + "/Timbrature/Conteggia";
	
	var msg =  "Procedere con il conteggio?";
	var answer = askYesNo ? globals.ma_utl_showYesNoQuestion(msg ,'Conteggia timbrature') : true;
	
	if (answer) 
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds
			                                         , idDitta != null ? idDitta : forms.giorn_header.idditta
			                                         , periodo ? periodo : globals.getPeriodo()))
			return;
		
		var _params = {
	        processFunction: process_conteggia_singolo_dip,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : '',
	        fontType: 'Arial,4,25',
	        processArgs: [url,params]
	    };
		plugins.busy.block(_params);
						
	} else
		return;
}

/**
 * @param employeesIds
 * @param arrayGiorni
 * @param [soloNonConteggiati]
 * @param [idDitta]
 * @param [periodo]
 *
 * @return {Object}
 * @properties={typeid:24,uuid:"155841F7-3A90-43E1-83D4-27F953AB6131"}
 */
function conteggiaTimbratureSingoloDiretto(employeesIds, arrayGiorni, soloNonConteggiati,idDitta,periodo)
{
	var params = globals.inizializzaParametriCompilaConteggio(
						idDitta != null ? idDitta : forms.giorn_header.idditta,
						periodo != null ? periodo : globals.getPeriodo(),
						forms.giorn_vista_mensile._tipoGiornaliera,
					    globals.TipoConnessione.CLIENTE,
					    arrayGiorni,
					    employeesIds,
					    soloNonConteggiati != null ? soloNonConteggiati : false
					    );

	//lanciamo il calcolo per la compilazione 
	var url = WS_URL + "/Timbrature/Conteggia";
	
	//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
	if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds
	                                , idDitta != null ? idDitta : forms.giorn_header.idditta
	                                , periodo ? periodo : globals.getPeriodo()))
	return false;
	var response = globals.getWebServiceResponse(url + 'Singolo', params);
	return response;
}

/**
 * @param {Array<Number>} employeesIds
 * @param {Array} arrayGiorni
 * @param {Boolean} [soloNonConteggiati]
 * @param {Number} [idDitta]
 * @param {Number} [periodo]
 * @param {String} [tipoGiorn]
 * @param {Boolean} [askYesNo]
 * 
 * @return {Object}
 * 
 * @properties={typeid:24,uuid:"2727C308-C428-479F-8597-C7F5C4399B92"}
 */
function conteggiaTimbratureSingoloDaMenu(employeesIds, arrayGiorni, soloNonConteggiati,idDitta,periodo,tipoGiorn,askYesNo)
{
	var params = globals.inizializzaParametriCompilaConteggio(
	                     idDitta != null ? idDitta : forms.giorn_header.idditta,
                   		 periodo != null ? periodo : globals.getPeriodo(),
	                     tipoGiorn != null ? tipoGiorn : forms.giorn_vista_mensile._tipoGiornaliera,
	                     globals.TipoConnessione.CLIENTE,
	                     arrayGiorni,
	                     employeesIds,
						 soloNonConteggiati != null ? soloNonConteggiati : false
	             );
	
	//lanciamo il calcolo per la compilazione 
	var url = WS_URL + "/Timbrature/Conteggia";
	
	var msg =  "Procedere con il conteggio?";
	var answer = askYesNo ? globals.ma_utl_showYesNoQuestion(msg ,'Conteggia timbrature') : true;
	
	if (answer) 
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds
			                                         , idDitta != null ? idDitta : forms.giorn_header.idditta
			                                         , periodo ? periodo : globals.getPeriodo()))
			return false;
		
		var response = globals.getWebServiceResponse(url + 'Singolo', params);
		return response;
//		if (!response['returnValue'])
//				globals.ma_utl_showErrorDialog('Si è verificato un errore durante il conteggio, riprovare', 'Conteggio timbrature');
//			else
//			    forms.giorn_header.preparaGiornaliera();		
				
	} else
		return false;
}

/**
 * @param {Array} employeesIds
 * @param {Array} arrayGiorni
 * @param {Boolean} [soloNonConteggiati]
 * @param {Number} [idDitta]
 * @param {Number} [periodo]
 * @param {String} [tipoGiorn]
 * @param {Boolean} [askYesNo]
 * 
 * @properties={typeid:24,uuid:"E76B9FC0-B4A4-421C-8A47-02FEE67F22E0"}
 */
function conteggiaTimbrature(employeesIds, arrayGiorni, soloNonConteggiati,idDitta,periodo,tipoGiorn,askYesNo)
{
	/** @type {Number} */
	var _periodo = periodo != null ? periodo : globals.getPeriodo();
	var _idDitta = idDitta != null ? idDitta : forms.giorn_header.idditta;
	var _tipoGiorn = globals.TipoGiornaliera.NORMALE;
    
	var params = globals.inizializzaParametriCompilaConteggio(
	                     _idDitta,
	                     _periodo,
	                     _tipoGiorn,
	                     globals._tipoConnessione,
	                     arrayGiorni,
	                     employeesIds,
						 soloNonConteggiati != null ? soloNonConteggiati : false
	             );
	
	//lanciamo il calcolo per la compilazione 
	var url = WS_MULTI_URL + "/Timbrature/Conteggia";
	
	var msg =  "Procedere con il conteggio?";
	var answer = askYesNo ? globals.ma_utl_showYesNoQuestion(msg ,'Conteggia timbrature') : true;
	
	if (answer) 
	{
		//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
		if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds, _idDitta,_periodo))
			return;
		else
			globals.addJsonWebServiceJob
			(
				  url
				, params
				, vUpdateOperationStatusFunction
				, null
				, function(retObj)
				  {
					  if(idDitta == null)
					  {
						  forms.giorn_mostra_timbr.markAsDirty(employeesIds, _periodo);
						  forms.giorn_vista_mensile.markAsDirty(employeesIds, _periodo);
					  }
					  
					  forms.mao_history.operationDone(retObj);
				  }
			);
	} else
		return;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param employeesIds
 * @param giorniSelezionati
 * @param idDitta
 * @param periodo
 * @param tipoConn
 *
 * @properties={typeid:24,uuid:"B690392E-5F87-4A46-BCF0-DA2DDA877C79"}
 */
function rendiGiorniRiconteggiabili(employeesIds, giorniSelezionati, idDitta,periodo,tipoConn)
{
	var url = globals.WS_URL + '/Timbrature/Riconteggia'
	var params =
	{
		idditta				:	idDitta,
		periodo				:	periodo,
		giorniselezionati	:	giorniSelezionati,
		iddipendenti		:	employeesIds,
		tipoconnessione     :   globals.TipoConnessione.CLIENTE
	};
	
    var response = globals.getWebServiceResponse(url, params);
			
	return response;
	
}

/**
 * @properties={typeid:24,uuid:"7C5A3998-7598-438D-93C7-833A28F6305C"}
 */
function controlliPreliminariDitta(event)
{
	var params = globals.inizializzaParametriAttivaMese(
	                                                    forms.giorn_header.idditta,
	                                                    globals.getPeriodo(),
	                                                    globals.getGruppoInstallazione(),
	                                                    globals.getGruppoLavoratori(),
	                                                    globals._tipoConnessione
	                                                    );
	/** @type {Array} */
	var _arrDipSenzaRegole = params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
	if(_arrDipSenzaRegole && _arrDipSenzaRegole.length > 0)
	{
		globals.ma_utl_showWarningDialog('Ci sono nuovi dipendenti senza regola associata non presenti in fase di apertura della giornaliera.<br/> \
	                                      Chiudere e riaprire la giornaliera per sistemare le regole e poter proseguire.');
		return;
	                                
	}
	controlliPreliminari([]);
}

/**
 * @param {Array} employeesIds
 * @param {Boolean} [singoloDipendente]
 * @param {Number} [idDitta]
 * @param {Number} [anno]
 * @param {Number} [mese]
 * @param {String} [gruppoLav]
 *
 * @properties={typeid:24,uuid:"EC7111AC-BB7A-49DE-97F9-3AC146CFFB1A"}
 */
function controlliPreliminari(employeesIds, singoloDipendente, idDitta, anno, mese, gruppoLav) 
{
    var _idDitta = idDitta != null ? idDitta : forms.giorn_header.idditta;
    var _anno = anno != null ? anno : globals.getAnno();
    var _mese = mese != null ? mese : globals.getMese();
	var _periodo = anno != null && mese != null ? anno * 100 + mese : globals.getPeriodo();
    var _gruppoLav = gruppoLav != null ? gruppoLav : globals.getGruppoLavoratori();
	
	/** @type {Array} */
	var _arrGiorni = globals.getGiorniSelezionatiEv();
		
	if (!scopes.giornaliera.cancellaChiusuraDipPerOperazione(employeesIds, _idDitta)) {
		plugins.busy.unblock();
		globals.ma_utl_showWarningDialog('<html>Errore in cancellazione chiusura operazione</html>', 'Controlli preliminari');
		return;
	}
	var ctrParams = globals.inizializzaParametriAttivaMese( _idDitta,
															_periodo,
															globals.getGruppoInstallazioneDitta(_idDitta),
															_gruppoLav, // TODO globals.getGruppoLavoratori(),
															globals._tipoConnessione
															);
	
	// procedi con i controlli preliminari
	var params = globals.inizializzaParametriControlli(_idDitta,
														_periodo,
														globals._tipoConnessione,
														_arrGiorni,
														employeesIds,
														singoloDipendente === true ? singoloDipendente : false
														);
    params.tipogiornaliera = globals.TipoGiornaliera.NORMALE;
    _paramsPostControlli = params;

    var url = WS_MULTI_URL + "/Ratei/ControlliPreliminari";
    	
    // nel caso cliente va verificato che il flusso sia completo quindi che abbia
    // scaricato la giornaliera del mese precedente
	
    var _response;
	var _retvalue;
	var _noconnection;
	   
    if (globals.getTipologiaDitta(params.idditta) == globals.Tipologia.GESTITA_UTENTE) 
    {
    	_response = true;
    	_retvalue = 1;
    	_noconnection = false;
    }
    else
    {	
    	//controllo su acquisizioni mesi precedenti
	    var response = scopes.giornaliera.controllaAcquisizioneCP(params);
		if (response)
		{
			_noconnection = false;
			_response = response['returnValue'];
			_retvalue = response['retValue'];
		}
		else
		{
			_noconnection = true;
			_response = false;
			_retvalue = 0;
		}		
    }

 	// risposta ottenuta
	if(!_noconnection && _response == 1)
	{
    	// acquisizione precedente ok, procedere con i controlli preliminari
	    if (_retvalue == 1) 
		   // procedi con i controlli preliminari
		   globals.addJsonWebServiceJob(url,
			                            params, 
										vUpdateOperationStatusFunction,
										null,
										vOperationDoneFunction);

	    // acquisizioni periodi precedenti non completate
	    else {
			   var answer = globals.ma_utl_showYesNoQuestion('Completare le importazioni dei periodi precedenti prima di proseguire.<br/> Procedere con lo scarico?', 'Controllo acquisizione giornaliere');
			   if(answer)
			   {				
				   var periodoPrec;
				   if(globals._tipoConnessione == globals.TipoConnessione.SEDE)
						periodoPrec = globals.getPeriodo();
					else
					{
						if(_mese == 1)
							periodoPrec = (_anno - 1) * 100 + 12;
						else
							periodoPrec = _periodo - 1;
					}
                   globals.importaTracciatoDaFtp(_idDitta
                	                             ,periodoPrec
												 ,ctrParams.idgruppoinstallazione
												 ,ctrParams.codgruppogestione);				
			   }
			   return;

	    }
     } else {
	   globals.ma_utl_showWarningDialog('Errore in controllo acquisizione, riprovare.', 'Controlli preliminari');
	   return;
     }
	
}

/**
 * @param {Number} idDitta
 * @param {Number} periodo
 * @param {Date} [dallaData]
 * @param {Date} [allaData]
 * @param {Number} [idEvento]
 * @param {String} [propEvento]
 * 
 * @properties={typeid:24,uuid:"960398B8-3674-42C8-BDC1-BB74F3AEBEAD"}
 * @AllowToRunInFind
 */
function showCambiaEvento(idDitta, periodo, dallaData, allaData, idEvento, propEvento)
{
	var formObj = forms.giorn_cambiaevento;
	formObj.vIdDitta = idDitta;
	formObj.vPeriodo = periodo;
	formObj.vDateFrom = dallaData;
	formObj.vDateTo = allaData;
	
	var rec = null;
	
	if(idEvento)
	{
		/** @type {JSFoundset<db:/ma_presenze/e2eventi>}*/
		var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
		if(fs.find())
		{
			fs.idevento = idEvento;
			if(fs.search())
			{
				rec = fs.getSelectedRecord();
				formObj.vIdEventoOld = idEvento; // idevento
				formObj.vCodEventoOld = rec.evento; // codice evento
				formObj.vDescEventoOld = rec.descriz; // descrizione evento
				formObj.vIdEventoClasseOld = rec.ideventoclasse; // classe evento
				
			}
		}
					
	}
	
	formObj.rec = rec;
		
//		if(propEvento)
//		{
//			formObj.vCodProprietaOld = propEvento; // proprietà evento
//			formObj.vDescProprietaOld = globals.getDescrizioneProprietaEvento(formObj.vIdEventoClasseOld,propEvento); // descrizione proprietà evento
//		}
		
	var dipendentiFormName = forms.giorn_cambiaevento_dipendenti.controller.getName();
	globals.ma_utl_copyFoundSetFilters(forms.giorn_header.foundset, forms[dipendentiFormName].foundset,true);
	
	var dipendentiForm = globals.ma_utl_addMultipleSelection(forms.giorn_cambiaevento_dipendenti.controller.getName());
	
	if(forms.giorn_header.idlavoratore)
	{
		var dipendentiFs = forms[dipendentiForm.name].foundset;
			dipendentiFs.loadAllRecords();
			
		if(dipendentiFs.find())
		{
			dipendentiFs['idlavoratore'] = forms.giorn_header.idlavoratore;
			dipendentiFs.search();
			
			var dipendentiFsUpdater = databaseManager.getFoundSetUpdater(dipendentiFs);
			dipendentiFsUpdater.setColumn('checked', 1);
			dipendentiFsUpdater.performUpdate();
			dipendentiFs.loadAllRecords();
		}		
	}
	
	// Sort the foundset
	dipendentiFs.sort(function (x,y){
		if(x['lavoratori_to_persone.nominativo'] > y['lavoratori_to_persone.nominativo'])
			return 1;
		else
			return -1;
			
	});
	
	// Set the tab with the modified form
	formObj.elements.dipendenti_tabless.addTab(dipendentiForm.name);
	
	globals.ma_utl_showFormInDialog(formObj.controller.getName(), 'Cambia evento');
	
}

	
/**
 * Controlla ed eventualmente mostra l'elenco delle festivita prima dell'attivazione del mese
 * 
 * @param params
 * @param {Boolean} [openProg]
 * @param [progParams]
 * @param [primoIngresso]
 * 
 * @properties={typeid:24,uuid:"3D2089D0-7473-46C2-B52F-6CDA83BD9F3B"}
 */
function controlloFestivita(params, openProg, progParams, primoIngresso) {
	
	var url = WS_URL + "/Trattamenti/ElencoFestivita";

	/** @type {{ returnValue: Boolean, festivita: Array<Array> }} */
	var response = getWebServiceResponse(url, params);
	if (response && response.returnValue === true)
	{
		var dataset = databaseManager.createEmptyDataSet(0, ['data', 'descrizione', 'accinfra', 'accriposo']);

		var festivita = response.festivita;
		if (//!primoIngresso && 
		    festivita && festivita.length > 0)
		{
			for (var f = 0; f < festivita.length; f++) {
				dataset.addRow(festivita[f]);
			}

			var datasource = dataset.createDataSource('elenco_festivita', [JSColumn.TEXT, JSColumn.TEXT, JSColumn.INTEGER, JSColumn.INTEGER]);

			var formObj = forms.giorn_controllo_festivita_tbl;
			var form = formObj.controller.getName();
			var cloneForm = form + '_clone';

			var cloneJsForm = solutionModel.getForm(cloneForm);
			if (!cloneJsForm) {
				cloneJsForm = solutionModel.cloneForm(cloneForm, solutionModel.getForm(form));

				cloneJsForm.dataSource = datasource;
				cloneJsForm.getField(formObj.elements.fld_data.getName()).dataProviderID = 'data';
				cloneJsForm.getField(formObj.elements.fld_descrizione.getName()).dataProviderID = 'descrizione';
				cloneJsForm.getField(formObj.elements.fld_accinfra.getName()).dataProviderID = 'accinfra';
				cloneJsForm.getField(formObj.elements.fld_accriposo.getName()).dataProviderID = 'accriposo';

				forms.giorn_controllo_festivita.elements.tabless_feste.removeAllTabs();
				forms.giorn_controllo_festivita.elements.tabless_feste.addTab(cloneForm, 'feste_tab');
			}

			var festivitaForm = forms.giorn_controllo_festivita.controller.getName();
			forms[festivitaForm]['vParams'] = params;
			forms[festivitaForm]['vOpenProg'] = openProg;
			forms[festivitaForm]['vProgParams'] = progParams;
			forms[festivitaForm]['vPrimoIngresso'] = primoIngresso

			if (params) {
				/** @type {Date} */
				var periodo = utils.dateFormat(params.periodo.toString(10), PERIODO_DATEFORMAT);
				var title = 'Elenco festività di ' + getNomeMese(periodo.getMonth() + 1) + ' ' + periodo.getFullYear() +
				            ' - Ditta : ' + globals.getCodDitta(params.idditta) + ' - ' + globals.getRagioneSociale(params.idditta);
				            
				globals.ma_utl_showFormInDialog(festivitaForm, title);
			    
				return;
			}
		} 
		else
		{
		      controlloTurni(params,openProg,progParams,primoIngresso);
		      return;
		}
	}else
		globals.ma_utl_showErrorDialog('Il server non risponde, riprovare','Errore di comunicazione');
}

/**
 * @param params
 * @param {Boolean} [openProg]
 * @param [progParams]
 * @param [primoIngresso]
 * 
 * @properties={typeid:24,uuid:"DF33CDB7-B131-4335-8E89-828055110D96"}
 */
function controlloTurni(params, openProg, progParams, primoIngresso)
{
	if (globals.haGestioneTurno(params.idditta)) 
	{
		var turnoParams = {
			idditta: params.idditta,
			primoggmese: globals.getFirstDatePeriodo(parseInt(params.periodo)),
			ultimoggmese: globals.getLastDatePeriodo(parseInt(params.periodo))
		}
		var dsTurnisti = globals.elencoTurnisti(turnoParams);
		if (dsTurnisti.getMaxRowIndex() > 0)
		{
			var frmTurnisti = forms.giorn_controllo_turnisti;
			frmTurnisti.vParams = params;
			frmTurnisti.vOpenProg = openProg;
			frmTurnisti.vProgParams = progParams;
			frmTurnisti.vPrimoIngresso = primoIngresso;
			
			return globals.costruisciRiepilogoTurnisti(dsTurnisti);
	
		}
	}
		
	//primo ingresso in un mese senza turnisti : lancia operazione lunga
	if (primoIngresso) 
	{
		globals.openProgram('LEAF_Giornaliera', progParams, true);
		globals.attivazioneMese(params);
	}
	//attiva il mese e calcola la giornaliera in modalità sincrona
	else 
	{
		var response = globals.isMeseDaAttivare(params);
	    if (response && response['returnValue'] != null && response['returnValue'] === true) 
	    {
		   if(response['activate'] === false)
			  globals.attivazioneMeseSync(params);
		   else
		      globals.attivazioneMese(params);
	    }
	    else
	    {
	    	globals.ma_utl_showErrorDialog('Si è verificato un errore, si prega di riprovare','Attivazione mese');
	    	return null;
	    }
	    
	    forms.intestaVistaMensile.elements.btn_attivamese.enabled = false;
		forms.intestaMostraTimbr.elements.btn_attivamese.enabled = false;
		
		if (openProg) 
			globals.openProgram('LEAF_Giornaliera', progParams, true);
		else 
		{
			var currIdDip = params['iddipendenti'][0] ? params['iddipendenti'][0] : null;
			ricalcolaGiornaliera(toDate(params.periodo)
				                 ,forms.giorn_header.idditta
								 ,globals.getGruppoInstallazione()
								 ,globals.getGruppoLavoratori()
								 ,currIdDip);
		}
    }
	return null;
}

/**
 * @param {Object} params the parameters for the web request
 * @param {Boolean} [openProg]
 * @param {Object} [progParams] parameters to set on the program
 * @param {Boolean} [primoIngresso] true se è necessario lanciare un'operazione lunga
 * 
 * @properties={typeid:24,uuid:"1A111D7D-641B-42C6-9B7B-72C6ED8FBB14"}
 */
function attivaMese(params, openProg, progParams, primoIngresso)
{
	var response = globals.preAttivaMese(params);

	if(response !== globals.TipoAttivazione.NEGATA)
	{
		//controlliamo la presenza di dipendenti senza regole associate
		var _arrDipSenzaRegole = params['codgruppogestione'] != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(params) : globals.getElencoDipendentiSenzaRegoleAssociate(params);
		if(_arrDipSenzaRegole != null && _arrDipSenzaRegole.length > 0)
		{	
			forms.giorn_controllo_dip_senza_regole_associate._idditta = params['idditta'];
			
			//visualizza i dipendenti senza regole ed impedisce l'accesso in giornaliera
			var frmDipSenzaRegole = globals.costruisciRiepilogoRegoleNonAssociate(_arrDipSenzaRegole,params['idditta']);
			frmDipSenzaRegole['_isInGiornaliera'] = false;
			frmDipSenzaRegole['vParams'] = params;
			frmDipSenzaRegole['vOpenProg'] = openProg;
			frmDipSenzaRegole['vProgParams'] = progParams;
			frmDipSenzaRegole['vPrimoIngresso'] = primoIngresso;
			globals.ma_utl_showFormInDialog(frmDipSenzaRegole.controller.getName(),'Dipendenti senza regole');
						
			return;
		}

	}
	
	if (response !== globals.TipoAttivazione.AUTORIZZATA) // Nessuna attivazione o attivazione implicita
	{
		if (response === globals.TipoAttivazione.NON_NECESSARIA) // Attivazione implicita
		{
			forms.intestaVistaMensile.elements.btn_attivamese.enabled = false;
			forms.intestaMostraTimbr.elements.btn_attivamese.enabled = false;
				
			// Controlla se vi siano o meno dipendenti da attivare
			var responseChkDip = checkDipendentiDaAttivare(params);
			if (responseChkDip && responseChkDip['returnValue'] === true && responseChkDip['activate'] === true)
				globals.attivazioneMese(params);
			else if(!primoIngresso)
			{
				globals.controlloFestivita(params, openProg, progParams, primoIngresso);
				return;
			}

		} 
		else // L'utente ha scelto di non attivare nonostante esplicita richiesta
		{
			if (progParams != null 
					&& progParams != undefined)
			{
				progParams.anno_attivo = 0;
				progParams.mese_attivo = 0;
			}

			forms.intestaVistaMensile.elements.btn_attivamese.enabled = true;
			forms.intestaMostraTimbr.elements.btn_attivamese.enabled = true;
		}

		if (openProg)
			globals.openProgram('LEAF_Giornaliera', progParams, primoIngresso);
    	else
			ricalcolaGiornaliera(globals.toDate(params['periodo'])
				                 , params['idditta']
				                 , params['idgruppoinstallazione']
				                 , params['codgruppogestione']
				                 , params['iddipendenti'][0]);
	}
	else // L'utente ha scelto di attivare dietro esplicita richiesta
	{
		forms.intestaVistaMensile.elements.btn_attivamese.enabled = false;
		forms.intestaMostraTimbr.elements.btn_attivamese.enabled = false;
		globals.controlloFestivita(params, openProg, progParams, primoIngresso);
		return;
	}
}


/**
 * @properties={typeid:24,uuid:"FEF0E1D6-D9D4-4696-BD7A-0EBD22479305"}
 */
function copiaRigaInGiornaliera(params)
{
	var url = WS_URL + '/Giornaliera/CopiaGiornata';	
	return getWebServiceResponse(url, params);
}

/**
 * Calcola il totale delle ore risultanti in giornaliera per il giorno
 * con l'idgiornaliera passato 
 * 
 * @param {Number} idgiornaliera
 *
 * @return Number
 * 
 * @properties={typeid:24,uuid:"FE6A2CD6-4856-46C0-871D-BE06A9A47FF9"}
 */
function getTotOreGiornata(idgiornaliera){
	
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>} */
	var _fsGiornEv = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2giornalieraeventi');
	_fsGiornEv.removeFoundSetFilterParam('ftr_giornEvDaIdGiorn');
	_fsGiornEv.addFoundSetFilterParam('idgiornaliera','=',idgiornaliera,'ftr_giornEvDaIdGiorn');
	_fsGiornEv.loadAllRecords();
	var _maxOGEventi = _fsGiornEv.getSize();
	
	var _totOre = 0;
	
	for (var i=1; i<=_maxOGEventi; i++)
	{
		_fsGiornEv.setSelectedIndex(i)
		
		//il totale delle ore della giornata è dato dalla sommatoria delle ore degli eventi : 
		// - ordinari (O)
		// - festivi (F) ma non accantonata
		// - sostitutivi (S) ma non sospensivi
		if(_fsGiornEv.e2giornalieraeventi_to_e2eventi
           && _fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi
		   && (_fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo === 'S'
			   && _fsGiornEv.e2giornalieraeventi_to_e2eventi.prioritaperscalo === 0
			   || _fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo === 'O'
			   || _fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo === 'F'
				   && _fsGiornEv.codiceproprieta != 'FA')
			   )
					_totOre += _fsGiornEv.ore
			
	}

	return _totOre;
}

/**
 * @AllowToRunInFind
 * 
 * Calcola il totale delle ore ordinarie utilizzate
 * per determinare il superamento o meno dell'orario teorico
 * 
 * @param {Number} idgiornaliera
 * @param {Number} [idevento]
 * 
 * @properties={typeid:24,uuid:"FC4FE4A0-BC28-4DE4-B6F1-D18DFACFD384"}
 */
function getTotOreOrdinarieGiorno(idgiornaliera,idevento)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>} */
	var _fsGiornEv = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2giornalieraeventi');
	if(_fsGiornEv.find())
	{
		_fsGiornEv.idgiornaliera = idgiornaliera;
		_fsGiornEv.search();
	}
	var _maxOGEventi = _fsGiornEv.getSize();
	
	var _totOreOrd = 0;
	
	//per ciascun evento riferito all'idgiornaliera passato
	for (var i=1; i<=_maxOGEventi; i++)
	{
		_fsGiornEv.setSelectedIndex(i);
		
		//ritorna il totale delle ore di tipo ordinario (o festività non accantonata) 
		if(_fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo === 'O' 
			|| _fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo === 'F'
				&& _fsGiornEv.codiceproprieta != 'FA')
		{
			//se non è stato passato l'idevento siamo in fase di aggiunta di un nuovo evento
		    if(!idevento)
		    	_totOreOrd += _fsGiornEv.ore;
			//altrimenti in fase di modifica di un evento esistente	
		    else
		       	//non considero in sommatoria le ore riferite all'evento che sto modificando
		    	if(_fsGiornEv.idevento != idevento)
		    		_totOreOrd += _fsGiornEv.ore;
		}
			
	}
	
	return _totOreOrd;
}

/**
 * Calcola il totale delle ore di eventi sostitutivi non sospensivi
 * per determinare il superamento o meno dell'orario teorico
 * 
 * @param {Number} idgiornaliera
 * @param {Number} [idevento]
 *
 * @properties={typeid:24,uuid:"AB746B5B-06A9-4308-A4AF-7EE0C6DD95D7"}
 * @AllowToRunInFind
 */
function getTotOreSostitutiveGiorno(idgiornaliera,idevento)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>} */
	var _fsGiornEv = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2giornalieraeventi');
	if(_fsGiornEv.find())
	{
		_fsGiornEv.idgiornaliera = idgiornaliera;
		_fsGiornEv.search();
	}
	var _maxOGEventi = _fsGiornEv.getSize();
	
	var _totOreSost = 0;
	
	//per ciascun evento riferito all'idgiornaliera passato
	for (var i=1; i<=_maxOGEventi; i++)
	{
		_fsGiornEv.setSelectedIndex(i);
		
		//se è di tipo sostitutivo	
		if(_fsGiornEv.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.tipo === 'S')
		{
			//e non sospensivo
			if(_fsGiornEv.e2giornalieraeventi_to_e2eventi.prioritaperscalo === 0)
			{
				//se non è stato passato l'idevento siamo in fase di aggiunta di un nuovo evento
			    if(!idevento)
			    	_totOreSost += _fsGiornEv.ore;
				//altrimenti in fase di modifica di un evento esistente	
			    else
			       	//non considero in sommatoria le ore riferite all'evento che sto modificando
			    	if(_fsGiornEv.idevento != idevento)
			    		_totOreSost += _fsGiornEv.ore;
			    				
			}
		}
	
	}

    return _totOreSost;
  
}

/**
 * Calcola la somma degli eventi sostitutivi inseriti nella giornaliera per il periodo
 * indicato
 * 
 * @param {Number} idLav
 * @param {Date} dal
 * @param {Date} al
 * @param {Array} [arrFasceOrarie]
 * 
 * @properties={typeid:24,uuid:"D1AA7C57-9120-4857-845E-304AF433A52E"}
 */
function getTotaleOreSostitutive(idLav,dal,al,arrFasceOrarie)
{
	var sqlOre =
		"SELECT RTRIM(CAST(EP.Evento AS Varchar)) AS Evento\
		       , RTRIM(ISNULL(GE.CodiceProprieta, '')) AS Prop\
		       , RTRIM(EP.descriz) + ' ' + RTRIM(ISNULL(EP.Descrizione, '')) AS Descrizione\
		       , G.TipoDiRecord , EP.OrdineStampa , EP.OrdineDiEsposizione , EP.Tipo , EP.RilevanteMesePrecedente\
	           , SUM(CAST(GE.Ore AS MONEY) / 100) AS Ore, SUM(GE.Valore) AS Importo\
	          FROM E2Giornaliera G \
	          INNER JOIN E2GiornalieraEventi GE \
              ON G.IdGiornaliera = GE.IdGiornaliera \
              LEFT OUTER JOIN EventiProprieta EP \
              ON GE.IdEvento = EP.idEvento \
              AND (ISNULL(GE.CodiceProprieta,'') = EP.CodiceProprieta) \
              INNER JOIN E2Eventi E \
              ON E.idEvento = GE.idEvento \
              INNER JOIN E2EventiClassi EC \
              ON  EC.idEventoClasse = E.idEventoClasse ";
	
	if(arrFasceOrarie && arrFasceOrarie.length)
		sqlOre += "LEFT OUTER JOIN E2FO_FasceOrarie FO \
		                ON FO.idFasciaOraria = G.idFasciaOrariaAssegnata "; 
		
	sqlOre += " WHERE \
	          (G.Giorno BETWEEN ? AND ?) \
	          AND (G.TipoDiRecord = 'N') \
	          AND (G.IdDip = ?) \
	          AND (EC.Tipo = 'S')";
	
	if(arrFasceOrarie && arrFasceOrarie.length)
		sqlOre += "AND FO.idFasciaOraria IN (" + arrFasceOrarie.map(function (fo){return fo}).join(',')+") ";
	
	sqlOre += " GROUP BY\
		      RTRIM(CAST(EP.Evento AS Varchar))\
		      , RTRIM(ISNULL(GE.CodiceProprieta, ''))\
		      , RTRIM(EP.descriz) + ' ' + RTRIM(ISNULL(EP.Descrizione, ''))\
		      , G.TipoDiRecord\
		      , EP.OrdineStampa\
		      , EP.OrdineDiEsposizione\
		      , EP.Tipo\
		      , EP.RilevanteMesePrecedente";
	var arrOre = [utils.dateFormat(dal,globals.ISO_DATEFORMAT),
	              utils.dateFormat(al,globals.ISO_DATEFORMAT),
	              idLav];
	var dsOre = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlOre,arrOre,-1);
	var totOre = 0.00;
	for(var i=1; i<= dsOre.getMaxRowIndex(); i++)
		totOre += dsOre.getValue(i,9);
	
	return totOre;
}

/**
 * Recupera l'oggetto relativo alle info sulle categorie bloccanti
 * 
 * @param {Number} idditta
 * @param {Number} periodo
 * @param {JSForm<giorn_controllo_chiusura_cliente>|RuntimeForm<giorn_controllo_chiusura_cliente>} formCtr
 * @param {Array<Number>} [arrDipChiusura]
 * 
 * @return {Object}
 * 
 * @properties={typeid:24,uuid:"71A9B62F-3FC7-4FE8-B87E-FCB6E0D87322"}
 */
function ottieniCategorieBloccanti(idditta,periodo,formCtr,arrDipChiusura)
{
	var _bloccante = false;
	var _messaggio = false;
    
    // array di id dei lavoratori appartenenti alla selezione (devo considerare un eventuale filtro su gruppo di lavoro,etc)
	var _arrDip = arrDipChiusura != null ? arrDipChiusura : globals.foundsetToArray(forms.giorn_header.foundset,"idlavoratore");
	
	// recuperiamo gli idlavoratori interessati e le tipologie di categoria 
	var _catSql = "SELECT idDip,Categoria FROM F_Gio_ControlliChiusura(?,?,?) WHERE idDip IN (" + _arrDip.map(function(c){return c}).join(',') + ")";
	var _catArr = [idditta,periodo,globals._tipoConnessione];
	var _catDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _catSql, _catArr, -1);
		
	if (_catDs.getMaxRowIndex() > 0) {

		formCtr.azzeraChecks();   
		   
		for (var i = 1; i <= _catDs.getMaxRowIndex(); i++) {

			switch (_catDs.getValue(i, 2)) {

			//caso eventi lunghi esclusivo del caso sede
			case 'EL':
				formCtr['_el'] = 1;
				_bloccante = true;
				break;
			case 'EB':
				formCtr['_eb'] = 1;
				_bloccante = true;
				break
			case 'GS':
				formCtr['_gs'] = 1;
				_bloccante = true;
				break;
			case 'TE':
				formCtr['_te'] = 1;
				_messaggio = true;
				break;
			case 'NC':
				formCtr['_nc'] = 1;
				_messaggio = true;
				break;
			}
		}
	}
	   
	return {
		bloccante : _bloccante,
		messaggio : _messaggio
	};
}

/**
 * Ottieni l'array di dipendenti che bloccano la chiusura
 * 
 * @param {Array} _catArr categorie blocchi selezionate
 * @param {Number} _idditta
 * @param {Array<Number>} _dipArr array dipendenti tra i quali cercare eventuali blocchi
 * @param {Number} _periodo
 * 
 * @return JSDataSet
 * 
 * @properties={typeid:24,uuid:"C1CF0A08-1D90-4FCB-B6B9-A38E02DAD67D"}
 */
function ottieniDipendentiBloccanti(_catArr,_idditta,_dipArr,_periodo){
	
	// array di id dei lavoratori appartenenti alla selezione (devo considerare un eventuale filtro su gruppo di lavoro,etc)
	var _gioContrCh = "F_Gio_ControlliChiusura(?,?,?)";
	var _dipCatSql = " SELECT DISTINCT idDip FROM " + _gioContrCh + " WHERE Categoria IN (" + _catArr.map(function(){return '?'}).join(',') + ")"
	                 + " AND idDip IN (" + _dipArr.map(function(d){return d}).join(',') + ")";
	var _dipCatArr = new Array();
	    _dipCatArr.push(_idditta);
		_dipCatArr.push(_periodo);
		_dipCatArr.push(globals._tipoConnessione);
		_dipCatArr = _dipCatArr.concat(_catArr);
		
	var _dipCatDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_dipCatSql,_dipCatArr,-1);
	
	return _dipCatDs;
	
}


/**
 * Ottiene il data set con i dipendenti che soddisfano i criteri 
 * anagrafici e relativi a timbrature/giornaliere richiesti
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"46AD0BBC-CAE3-47B4-9A14-752DE06AACE5"}
 * @SuppressWarnings(unused)
 */
function ottieniDipendentiFiltrati()
{
	var frmFtr = forms.giorn_filtri;
	var frmFtrAnag = forms.giorn_filtri_anagrafici;
	var fs = forms.giorn_header.foundset;
	/** @type {String} */
	var sqlFiltri;
	
	if(globals.getTipologiaDitta(fs.idditta) == globals.Tipologia.ESTERNA)
		sqlFiltri = "SELECT L.idLavoratore AS idDip, P.Nominativo FROM Lavoratori L INNER JOIN Lavoratori_PersoneEsterne P ON L.idLavoratore = P.idLavoratore";
	else
		sqlFiltri = "SELECT L.idLavoratore AS idDip, P.Nominativo FROM Lavoratori L INNER JOIN Persone P ON L.CodiceFiscale = P.CodiceFiscale";
			
	var arrFiltri = [];
 
	var annoEff = frmFtr._anno ? frmFtr._anno : globals.getAnno();
	var meseEff = frmFtr._mese ? frmFtr._mese : globals.getMese();
	var periodo = annoEff * 100 + meseEff;
	
	// se esistono filtri su timbrature e/o giornaliere
	if (frmFtr.esistonoFiltriGiorn()) 
	{
		/** @type {Date} */
		var primoGG = frmFtr._chkLimitaAlPeriodo && frmFtr._dalGG != null ? frmFtr._dalGG : globals.getFirstDatePeriodo(periodo);
		/** @type {Date} */
		var ultimoGG = frmFtr._chkLimitaAlPeriodo && frmFtr._alGG != null ? frmFtr._alGG : globals.getLastDatePeriodo(periodo);
		var ftrStrEv = '';
		var ftrNum = forms.giorn_filtri_giornaliera._arrEvFiltri.length;
           		
		/** @type Number*/
		var non_conteggiati, preconteggio, abbuoni, nessuna_fascia, squadrati, _annotazioni, eventi_lunghi, eventi_lunghi_da_calc;

		forms.giorn_filtri_timbrature._chkGiornateNonConteggiate ? non_conteggiati = 1 : non_conteggiati = 0;
		forms.giorn_filtri_timbrature._chkAnomalie ? preconteggio = 1 : preconteggio = 0; // TODO verificare perchè preconteggio è impostato a priori...
		forms.giorn_filtri_timbrature._chkAbbuoni ? abbuoni = 1 : abbuoni = 0;
		forms.giorn_filtri_timbrature._chkNessunaFascia ? nessuna_fascia = 1 : nessuna_fascia = 0;
		forms.giorn_filtri_giornaliera._chkSquadrati ? squadrati = 1 : squadrati = 0;
		forms.giorn_filtri_giornaliera._chkAnnotazioni ? _annotazioni = 1 : _annotazioni = 0;
		forms.giorn_filtri_giornaliera._chkEventiLunghi ? eventi_lunghi = 1 : eventi_lunghi = 0;
		forms.giorn_filtri_giornaliera._chkEventiLunghiDaCalc ? eventi_lunghi_da_calc = 1 : eventi_lunghi_da_calc = 0;

		for (var j = 0; j < ftrNum; j++) {
			if (j == ftrNum - 1)
				ftrStrEv = ftrStrEv + forms.giorn_filtri_giornaliera._arrEvFiltri[j];
			else
				ftrStrEv = ftrStrEv + forms.giorn_filtri_giornaliera._arrEvFiltri[j] + ',';
		}

		//@idDitta,@Periodo BIGINT @NonConteggiati,@PreConteggio,@Abbuoni,@NessunaFascia,@Squadrati,
		//@Eventi VARCHAR(2000),@Annotazioni BIT, @EventiLunghi, @EventiLunghiCalc
		arrFiltri = [fs.idditta,
		utils.dateFormat(primoGG, globals.ISO_DATEFORMAT),
		utils.dateFormat(ultimoGG, globals.ISO_DATEFORMAT),
		non_conteggiati,
		preconteggio,
		abbuoni,
		nessuna_fascia,
		squadrati,
		ftrStrEv,
		_annotazioni,
		eventi_lunghi,
		eventi_lunghi_da_calc];
		
		sqlFiltri += (" INNER JOIN F_Gio_Filtro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) Gio ON L.idLavoratore = Gio.idDip ");

	}
	// se esistono filtri sulle classificazioni
	if (frmFtr.esistonoFiltriClassificazioni())
	{
		sqlFiltri += (" INNER JOIN Lavoratori_Classificazioni CL ON L.idLavoratore = CL.idLavoratore")
		
		sqlFiltri += (" WHERE CL.CodTipoClassificazione = " + frmFtrAnag.vRaggruppamentoCodice) //frmFtrAnag.vRaggruppamento
			
		if (frmFtrAnag.vFilterRaggruppamento && frmFtrAnag.vRaggruppamentiDettaglio) 
		{
			sqlFiltri += (" AND CL.CodClassificazione IN (" + frmFtrAnag.vRaggruppamentiDettaglio.join() + ")")  //frmFtrAnag.vRaggruppamentoDettaglio
							
			if (frmFtrAnag.vFilterContratto && frmFtrAnag.vContratto)
				sqlFiltri += (" AND L.CodContratto  IN (" + frmFtrAnag.vContratto.join() + ")") //frmFtrAnag.vContratto
							
			if (frmFtrAnag.vFilterQualifica && frmFtrAnag.vQualifica)
				sqlFiltri += (" AND L.CodQualifica  IN ('" + frmFtrAnag.vQualifica.join("','") + "')") //frmFtrAnag.vQualifica
					
			if (frmFtrAnag.vFilterSedeLavoro && frmFtrAnag.vSediLavoro)
				sqlFiltri += (" AND L.idDittaSede  IN (" + frmFtrAnag.vSediLavoro.join() + ")") //frmFtrAnag.vSediLavoro
						
			if (frmFtrAnag.vFilterPosizioneInps && frmFtrAnag.vPosizioniInps)
				sqlFiltri += (" AND L.PosizioneInps  IN (" + frmFtrAnag.vPosizioniInps.join() + ")") //frmFtrAnag.vPosizioniInps
		}
	}
	else
	{
		if (frmFtrAnag.vFilterContratto && frmFtrAnag.vContratto) 
		{
			sqlFiltri += (" WHERE L.CodContratto IN (" + frmFtrAnag.vContratto.join() + ")") //frmFtrAnag.vContratto
						
			if (frmFtrAnag.vFilterQualifica && frmFtrAnag.vQualifica)
				sqlFiltri += (" AND L.CodQualifica IN ('" + frmFtrAnag.vQualifica.join("','") + "')") //frmFtrAnag.vQualifica
			if (frmFtrAnag.vFilterSedeLavoro && frmFtrAnag.vSediLavoro)
				sqlFiltri += (" AND L.idDittaSede IN (" + frmFtrAnag.vSediLavoro.join() + ")") //frmFtrAnag.vSediLavoro
			if (frmFtrAnag.vFilterSedeLavoro && frmFtrAnag.vPosizioniInps)
				sqlFiltri += (" AND L.PosizioneInps IN (" + frmFtrAnag.vPosizioniInps.join() + ")") //frmFtrAnag.vPosizioniInps
			
		}
		else if (frmFtrAnag.vFilterQualifica && frmFtrAnag.vQualifica)
		{
			sqlFiltri += (" WHERE L.CodQualifica IN ('" + frmFtrAnag.vQualifica.join("','") + "')")
							
			if (frmFtrAnag.vFilterSedeLavoro && frmFtrAnag.vFilterSedeLavoro)
				sqlFiltri += (" AND L.idDittaSede IN (" + frmFtrAnag.vSediLavoro.join() + ")") //frmFtrAnag.vSediLavoro
			if (frmFtrAnag.vFilterPosizioneInps && frmFtrAnag.vPosizioniInps)
				sqlFiltri += (" AND L.PosizioneInps IN (" + frmFtrAnag.vPosizioniInps.join() + ")") //frmFtrAnag.vPosizioniInps
		}
		else if (frmFtrAnag.vFilterSedeLavoro && frmFtrAnag.vSediLavoro)
		{
			sqlFiltri += (" AND L.idDittaSede IN (" + frmFtrAnag.vSediLavoro.join(',') + ")")
						
			if (frmFtrAnag.vFilterPosizioneInps &&  frmFtrAnag.vPosizioniInps)
				sqlFiltri += (" AND L.PosizioneInps IN (" + frmFtrAnag.vPosizioniInps.join(',') + ")") //frmFtrAnag.vPosizioniInps
		}
		else if (frmFtrAnag.vFilterPosizioneInps && frmFtrAnag.vPosizioniInps)
			sqlFiltri += (" AND L.PosizioneInps IN (" + frmFtrAnag.vPosizioniInps.join(',') + ")") //frmFtrAnag.vPosizioniInps
	}
	
	if(frmFtrAnag.vFilterGruppiLavoratori && frmFtrAnag.vGruppoLavoratori != '')
	{
		var params = globals.inizializzaParametriAttivaMese
		(
			fs.idditta, 
            periodo,
			globals.getGruppoInstallazioneDitta(fs.idditta), 
			frmFtrAnag.vGruppoLavoratori,
			globals._tipoConnessione
		);
		
        var dipendenti = globals.getLavoratoriGruppo(params,params.idditta);

		sqlFiltri += (" AND L.idLavoratore IN (" + dipendenti.join(',') + ")");
	}
	
    var dsFiltri = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlFiltri,arrFiltri,-1);
    
	return dsFiltri;
	
}

/**
 * @properties={typeid:24,uuid:"0712CE5B-0C3B-4AAE-BE4E-2348B39C2347"}
 */
function aggiornaFiltri()
{
	globals.svy_nav_dc_setStatus('browse','giorn_filtri_anagrafici',true);
	globals.svy_nav_dc_setStatus('browse','giorn_filtri_timbrature',true);
	globals.svy_nav_dc_setStatus('browse','giorn_filtri_giornaliera',true);
	globals.svy_nav_dc_setStatus('browse','giorn_filtri',true);
	
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag)
	{
		forms.giorn_vista_mensile.elements.lbl_vista_comunicazioni_filtro.text = 'Filtro attivo';
		forms.giorn_mostra_timbr.elements.lbl_timbr_comunicazioni.text = 'Filtro applicato';
		forms.intestaVistaMensile.elements.btn_filtroattivo.enabled = false;
		forms.intestaMostraTimbr.elements.btn_filtroattivo.enabled = false;
        forms.intestaVistaMensile.elements.btn_filtrodisattivato.enabled = true;
        forms.intestaMostraTimbr.elements.btn_filtrodisattivato.enabled = true;
        
	}else
	{
		
		forms.giorn_vista_mensile.elements.lbl_vista_comunicazioni_filtro.text = 'Nessun filtro attivo';
		forms.giorn_mostra_timbr.elements.lbl_timbr_comunicazioni.text = 'Nessun filtro applicato';
		forms.intestaVistaMensile.elements.btn_filtroattivo.enabled = true;
		forms.intestaMostraTimbr.elements.btn_filtroattivo.enabled = true;
		forms.intestaVistaMensile.elements.btn_filtrodisattivato.enabled = false;
        forms.intestaMostraTimbr.elements.btn_filtrodisattivato.enabled = false;
		
	}
}

/**
 * Applica i filtri al foundset della giornaliera
 *  
 * @param {JSDataSet} dsDip
 * @param {Number} [idDip]
 *
 * @properties={typeid:24,uuid:"CE98A4C0-41DE-4655-9E53-62FCA43A144A"}
 */
function aggiornaDipendentiFiltrati(dsDip,idDip)
{
	var frm = forms.giorn_header;
	var fs = frm.foundset;

	//update dell'array generale (per rendere effettivo il filtro nella lookup)
	forms.giorn_header._arrDsAnag = [];

	fs.removeFoundSetFilterParam('ftr_filtriGiornaliera');
	fs.addFoundSetFilterParam('idlavoratore', 'IN', dsDip.getColumnAsArray(1), 'ftr_filtriGiornaliera');
	fs.loadAllRecords();

	if(idDip)	
		globals.lookup(idDip,frm.controller.getName());
}

/**
 * @properties={typeid:24,uuid:"2E57CDF5-F353-401F-9E1D-90C1B1EE5EBC"}
 */
function nessunDipendenteFiltrato()
{
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag = false;
	globals.ma_utl_showInfoDialog('<html><center>Nessun altro dipendente soddisfa i requisiti richiesti.</center></html>','Operazioni di filtro');

}

/**
 * @param {Number} iddipendente
 * @param {JSDataSet} dsAggiornato
 * 
 * @return {Boolean}
 * 
 * @properties={typeid:24,uuid:"5E8FAFD5-4AE0-43D4-A12C-988A1FBF92B1"}
 */
function esisteDipendenteTraFiltrati(iddipendente,dsAggiornato)
{
	
	//cerca nel nuovo dataset aggiornato la presenza o meno dell'id del dipendente
	var _maxRows = dsAggiornato.getMaxRowIndex()
	for (var i=1; i<=_maxRows; i++)
	{
		//se lo trova alla posizione i-esima
	    if(dsAggiornato.getValue(i,1) === iddipendente)
	    {
	    	return true;
	    }
	}
		
	return false;
		
}

/**
 * Verifica se gestire o meno l'aggiornamento dei dipendenti filtrati
 * 
 * @param {Number} iddipendente
 * 
 * @return {Boolean} true se il dipendente soddisfa i criteri di filtro, false altrimenti
 *
 * @properties={typeid:24,uuid:"DB693940-FF1B-4632-B330-16F3A3276791"}
 */
function verificaDipendentiFiltrati(iddipendente) 
{
	var frm = forms.giorn_filtri;
	var fs = forms.giorn_header.foundset;
	var frmTabs = forms.svy_nav_fr_openTabs;
	//verifichiamo solo in presenza di filtri attivi
	if (frmTabs 
			&& globals.objGiornParams[frmTabs.vTabNames[frmTabs.vSelectedTab]]
		&& globals.objGiornParams[frmTabs.vTabNames[frmTabs.vSelectedTab]].filtro_anag
		&& globals.objGiornParams[frmTabs.vTabNames[frmTabs.vSelectedTab]].idditta == globals.getDitta(iddipendente)
		)
	{		
		//ottieni il nuovo insieme dei filtrati
		var _dsAggiornato;
		if(frm._ftrBloccanti)
		{
			/** @type {Array<Number>}*/
			var arrLav = globals.foundsetToArray(fs,'idlavoratore');
			_dsAggiornato = globals.ottieniDipendentiBloccanti(frm._arrCatBloccanti,fs.idditta,arrLav,globals.getPeriodo());
		}
		else
		    _dsAggiornato = ottieniDipendentiFiltrati();
		            
        /** @type {Object} */
		var _objResp = esisteDipendenteTraFiltrati(iddipendente, _dsAggiornato);
		if(!_objResp) 
		{
			var _msg = 'Il dipendente non soddisfa più i criteri di filtro attivi. <br/> Rimuoverlo e passare al successivo?';
			var response = globals.ma_utl_showYesNoQuestion(_msg, 'Filtro dipendenti');
			if (response) 
			{
				//recupera dal foundset l'id dell'eventuale dipendente su cui posizionarsi
				var _idDipNext = ottieniDipendenteFiltratoSucc(forms.giorn_header.foundset);
				if (_idDipNext != -1)
					aggiornaDipendentiFiltrati(_dsAggiornato, _idDipNext);
				else 
				{
					nessunDipendenteFiltrato();
					disattivaFiltri(new JSEvent);
				}
				
				forms.giorn_header.preparaGiornaliera(true,null,false);
								
				// Il dipendente è rimosso dall'elenco dei filtrati
				return false;
			}
			// Il dipendente è lasciato nell'elenco dei filtrati dietro esplicita richiesta, anche se non soddisfa più i criteri
			return true;
		}
	}
	
	// Il dipendente soddisfa ancora i criteri di filtro, o il filtro non è impostato
	return true;
}


/**
 * 
 * @param {JSFoundset} fs 
 * 
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"01D52FE8-9AE0-4AD6-B72E-AF2BBCC95969"}
 */
function ottieniDipendenteFiltratoSucc(fs)
{
	var _idDipSucc = -1;
	var _fsSize = fs.getSize()

	//se vi è un solo dipendente il successivo non esiste
	if (_fsSize != 1)  
	{   
		//se è l'ultimo della lista, il successivo è di nuovo il primo
		if (fs.getSelectedIndex() == _fsSize)
			_idDipSucc = fs.getRecord(1)['idlavoratore']
		//altrimenti è il successivo
		else
		    _idDipSucc = fs.getRecord(fs.getSelectedIndex()+1)['idlavoratore']
	}
	 
	return _idDipSucc;	
}

/**
 * @param {Number} idDitta
 * @param {Date} dal
 * @param {Date} al
 * @param {String} [tipoGiornaliera]
 * 
 * @properties={typeid:24,uuid:"570C2C32-67DF-4D25-82FD-B01F642BB1EE"}
 */
function getEventiGiornalieraPeriodo(idDitta,dal,al,tipoGiornaliera)
{
	var sqlQuery = 'SELECT idevento FROM F_Gio_ElencoEventiPeriodo(?,?,?,?)';
	var args = [idDitta, 
	            utils.dateFormat(dal,globals.ISO_DATEFORMAT),
				utils.dateFormat(al,globals.ISO_DATEFORMAT),
				tipoGiornaliera ? tipoGiornaliera : globals.TipoGiornaliera.NORMALE];
	
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, sqlQuery, args, -1);
    
	return ds.getColumnAsArray(1);
	
}

/**
 * Costruisce il riepilogo dei dipendenti senza regole associate
 * 
 * @param {Array} arrDip
 * @param {Number} [idDitta]
 * 
 * @return {RuntimeForm}
 * 
 * @properties={typeid:24,uuid:"76390B89-6F91-4873-BBF6-718C7881AAC7"}
 * @SuppressWarnings(unused)
 */
function costruisciRiepilogoRegoleNonAssociate(arrDip,idDitta)
{
	var frmName = 'giorn_controllo_dip_senza_regole_associate_tbl';
	var frmNameTemp = 'giorn_controllo_dip_senza_regole_associate_tbl_temp';
	/** @type {RuntimeForm}*/
	var frmCont;
	
	var haorologio = globals.haOrologio(idDitta);
	var hagestioneturno = globals.haGestioneTurno(idDitta);
	if(haorologio && hagestioneturno)
		frmCont = forms.giorn_controllo_dip_senza_regole_associate;
	else if(haorologio)
		frmCont = forms.giorn_controllo_dip_senza_regole_associate_no_turnista;
	else
		frmCont = forms.giorn_controllo_dip_senza_regole_associate_solo_regole;
		
    frmCont.elements['tab_dip_senza_regole'].removeAllTabs();	

    if(idDitta)
    	frmCont._idditta = idDitta
    else
        frmCont._idditta = forms.giorn_header.idditta;
    
    if (forms[frmNameTemp] != null)
    {
		history.removeForm(frmNameTemp);
        solutionModel.removeForm(frmNameTemp);
    }
    
    solutionModel.cloneForm(frmNameTemp,solutionModel.getForm(frmName));

	// descregola,id_lavoratore,valore,valoreagg non utilizzati
	var cols = ['cod_lavoratore','cognome','nome','assunzione','cessazione','qualifica','regola','id_lavoratore','valore','valoreagg'];
	if(haorologio)
		cols.push('badge');
	if(hagestioneturno)
	{
	    cols.push('tipoturnista');	
		cols.push('codiceturnista');
	}
	var types = [JSColumn.TEXT,
	             JSColumn.TEXT,
				 JSColumn.TEXT,
				 JSColumn.TEXT,
				 JSColumn.TEXT,
				 JSColumn.TEXT,
				 JSColumn.TEXT,
				 JSColumn.NUMBER,
				 JSColumn.NUMBER,
				 JSColumn.NUMBER];
	if(haorologio)
	   types.push(JSColumn.INTEGER);
	if(hagestioneturno)
	{
	   types.push(JSColumn.TEXT);
	   types.push(JSColumn.TEXT);
	}
	forms.giorn_controllo_dip_senza_regole_associate._arrCodLavoratori = [];
	var dsRNA = databaseManager.createEmptyDataSet(0,cols);
	
	for(var i=0; i < arrDip.length; i++)
	{
		var row = arrDip[i];
		if(row['id_lavoratore'] == null)
		{
			row['id_lavoratore'] = globals.getIdLavoratoreFromCodiceDitta(row['cod_lavoratore'],row['codice_ditta']);
			row['cognome'] = globals.getCognome(row['id_lavoratore']);
			row['nome'] = globals.getNome(row['id_lavoratore']);
		    row['assunzione'] = globals.dateFormat(globals.getDataAssunzione(row['id_lavoratore']),globals.EU_DATEFORMAT);
		    row['cessazione'] = globals.dateFormat(globals.getDataCessazione(row['id_lavoratore']),globals.EU_DATEFORMAT);
		    row['qualifica'] = globals.getQualifica(row['id_lavoratore']);
		}
		var currRow = [row['cod_lavoratore'],
		               row['cognome'],
					   row['nome'],
					   row['assunzione'],
					   row['cessazione'],
					   row['qualifica'],
					   null,
					   row['id_lavoratore'],
					   null,
					   null];
		if(haorologio)
			currRow.push(null);		
		if(hagestioneturno)
		{
			currRow.push(null);
			currRow.push(null);
		}
		forms.giorn_controllo_dip_senza_regole_associate._arrCodLavoratori.push(row['cod_lavoratore']);
		dsRNA.addRow(i+1, currRow);
	}
	    
    var dSRNA = dsRNA.createDataSource('dSRNA_' + application.getUUID(),types);
	solutionModel.getForm(frmNameTemp).dataSource = dSRNA;
	solutionModel.getForm(frmNameTemp).getField('fld_cod_lavoratore').dataProviderID = 'cod_lavoratore';
	solutionModel.getForm(frmNameTemp).getField('fld_cognome').dataProviderID = 'cognome';
	solutionModel.getForm(frmNameTemp).getField('fld_nome').dataProviderID = 'nome';
	solutionModel.getForm(frmNameTemp).getField('fld_assunzione').dataProviderID = 'assunzione';
	solutionModel.getForm(frmNameTemp).getField('fld_cessazione').dataProviderID = 'cessazione';
	solutionModel.getForm(frmNameTemp).getField('fld_qualifica').dataProviderID = 'qualifica';
	solutionModel.getForm(frmNameTemp).getField('fld_id_lavoratore').dataProviderID = 'id_lavoratore';
	// non visibili o non sempre selezionabili
	solutionModel.getForm(frmNameTemp).getField('fld_nuova_regola').dataProviderID = 'regola';
	solutionModel.getForm(frmNameTemp).getField('fld_valore').dataProviderID = 'valore';
	solutionModel.getForm(frmNameTemp).getField('fld_valoreagg').dataProviderID = 'valoreagg';
	solutionModel.getForm(frmNameTemp).getField('fld_badge').dataProviderID = 'badge';
	solutionModel.getForm(frmNameTemp).getField('fld_tipoturnista').dataProviderID = 'tipoturnista';
	solutionModel.getForm(frmNameTemp).getField('fld_codiceturnista').dataProviderID = 'codiceturnista';
	
	//gestione eventuali campi e conseguenti dimensioni della form visualizzata
//	var frmTempWidth;
//	var frmWidth;
//	var frmHeight = 152;
//	var frmContHeight = 210;
//	var btnOkX = 950;
//	var btnAnnullaX = 980;
//	var btnY = 175;
//	var delta;

	if(haorologio && hagestioneturno)
	{
//		delta = 0;
//		frmTempWidth = 1010;
		solutionModel.getForm(frmNameTemp).getField('fld_badge').visible = true;
		solutionModel.getForm(frmNameTemp).getField('fld_tipoturnista').visible = true;
		solutionModel.getForm(frmNameTemp).getLabel('btn_tipoturnista').visible = true;
		solutionModel.getForm(frmNameTemp).getLabel('lbl_btn_tipoturnista').visible = true;
				
	}
	else if(haorologio)
	{
//		delta = 180;
//		frmTempWidth = 830;
		solutionModel.getForm(frmNameTemp).getField('fld_badge').visible = true;
		
	}
	else
	{	
//		delta = 230;
//		frmTempWidth = 780;
	}
	
	frmCont.elements['tab_dip_senza_regole'].addTab(frmNameTemp);
    
	return frmCont;
}

/**
 * Costruisce il riepilogo dei dipendenti della ditta con le rispettive regole e la possibilità
 * di modificarne più di una contemporaneamente
 * 
 * @param {Array<Number>} arrDip
 * @param {Number} idDitta
 *
 * @return {RuntimeForm}
 *
 * @properties={typeid:24,uuid:"99C1A9F2-17F7-486F-9B11-7CCDBB04FD85"}
 */
function costruisciRiepilogoRegole(arrDip,idDitta)
{
	var frmName = 'giorn_dip_modifica_decorrenze_tbl';
	var frmNameTemp = frmName + '_temp';
	/** @type {RuntimeForm}*/
	var frmCont;
	
	var haorologio = globals.haOrologio(idDitta);
	var hagestioneturno = globals.haGestioneTurno(idDitta);
    
	frmCont = forms.giorn_dip_modifica_decorrenze;
	//	if(haorologio && hagestioneturno)
//		frmCont = forms.giorn_controllo_dip_senza_regole_associate;
//	else if(haorologio)
//		frmCont = forms.giorn_controllo_dip_senza_regole_associate_no_turnista;
//	else
//		frmCont = forms.giorn_controllo_dip_senza_regole_associate_solo_regole;
		
    frmCont.elements['tab_dip_decorrenze'].removeAllTabs();	

    if(idDitta)
    	frmCont._idditta = idDitta
    else
        frmCont._idditta = forms.giorn_header.idditta;
    
    if (forms[frmNameTemp] != null)
    {
		history.removeForm(frmNameTemp);
        solutionModel.removeForm(frmNameTemp);
    }

    solutionModel.cloneForm(frmNameTemp,solutionModel.getForm(frmName));
    
	var cols = ['id_lavoratore','cod_lavoratore','cognome','nome','assunzione','cessazione','qualifica',
				'regola_old','valore_old','valoreagg_old',
				'regola','valore','valoreagg'];
	if(haorologio)
	{
		cols.push('badge_old');
		cols.push('badge');
	}
	
	if(hagestioneturno)
	{
	    cols.push('tipoturnista');	
		cols.push('codiceturnista');
	}
	var types = [JSColumn.NUMBER, // id_lavoratore
	             JSColumn.TEXT,   // cod_lavoratore
	             JSColumn.TEXT,   // cognome
				 JSColumn.TEXT,   // nome
				 JSColumn.TEXT, // assunzione
				 JSColumn.TEXT, // cessazione
				 JSColumn.TEXT, // qualifica
				 JSColumn.TEXT, // regola_old
				 JSColumn.NUMBER, // valore_old
				 JSColumn.NUMBER, // valoreagg_old
				 JSColumn.TEXT, // regola_new
				 JSColumn.NUMBER, // valore_new
				 JSColumn.NUMBER]; // valoreagg_new
	if(haorologio)
	{
	   types.push(JSColumn.TEXT); // badge_old
	   types.push(JSColumn.TEXT); // badge_new
	}
	
//	if(hagestioneturno)
//	{
//	   types.push(JSColumn.TEXT);
//	   types.push(JSColumn.TEXT);
//	}
	forms.giorn_dip_modifica_decorrenze._arrCodLavoratori = [];
	var dsDM = databaseManager.createEmptyDataSet(0,cols);
	
	for(var i=0; i < arrDip.length; i++)
	{
		var idDip = arrDip[i];
		var currRegola = globals.getRegolaLavoratoreGiorno(idDip,globals.TODAY);
		var currRow = [idDip,
		               globals.getCodLavoratore(idDip),
		               globals.getCognome(idDip),
					   globals.getNome(idDip),
					   globals.dateFormat(globals.getDataAssunzione(idDip),globals.EU_DATEFORMAT),
					   globals.dateFormat(globals.getDataCessazione(idDip),globals.EU_DATEFORMAT),
					   globals.getQualifica(idDip),
					   currRegola.codiceregola + ' - ' + currRegola.descrizioneregola,
					   null,
					   null,
					   null,
					   null,
					   null];
		if(haorologio)
		{
			var nrBadge = globals.getNrBadge(idDip,globals.TODAY);
			currRow.push(nrBadge ? nrBadge.toString() : nrBadge);
			currRow.push(null);		
		}
//		if(hagestioneturno)
//		{
//			currRow.push(null);
//			currRow.push(null);
//		}
		
		dsDM.addRow(i+1, currRow);
	}
	    
    var dSDM = dsDM.createDataSource('dSDM_' + application.getUUID(),types);
	solutionModel.getForm(frmNameTemp).dataSource = dSDM;
	solutionModel.getForm(frmNameTemp).getField('fld_cod_lavoratore').dataProviderID = 'cod_lavoratore';
	solutionModel.getForm(frmNameTemp).getField('fld_cognome').dataProviderID = 'cognome';
	solutionModel.getForm(frmNameTemp).getField('fld_nome').dataProviderID = 'nome';
	solutionModel.getForm(frmNameTemp).getField('fld_assunzione').dataProviderID = 'assunzione';
	solutionModel.getForm(frmNameTemp).getField('fld_cessazione').dataProviderID = 'cessazione';
	solutionModel.getForm(frmNameTemp).getField('fld_qualifica').dataProviderID = 'qualifica';
	solutionModel.getForm(frmNameTemp).getField('fld_id_lavoratore').dataProviderID = 'id_lavoratore';
	// non visibili o non sempre selezionabili
	solutionModel.getForm(frmNameTemp).getField('fld_vecchia_regola').dataProviderID = 'regola_old';
	solutionModel.getForm(frmNameTemp).getField('fld_vecchia_regola').enabled = false;
	solutionModel.getForm(frmNameTemp).getField('fld_badge_old').dataProviderID = 'badge_old';
	solutionModel.getForm(frmNameTemp).getField('fld_badge_old').visible = haorologio;
	solutionModel.getForm(frmNameTemp).getField('fld_badge_old').enabled = false;
	solutionModel.getForm(frmNameTemp).getField('fld_nuova_regola').dataProviderID = 'regola';
	solutionModel.getForm(frmNameTemp).getField('fld_badge_new').dataProviderID = 'badge';
	solutionModel.getForm(frmNameTemp).getField('fld_badge_new').visible = haorologio;
//	solutionModel.getForm(frmNameTemp).getField('fld_tipoturnista').dataProviderID = 'tipoturnista';
//	solutionModel.getForm(frmNameTemp).getField('fld_codiceturnista').dataProviderID = 'codiceturnista';
	
	//gestione eventuali campi e conseguenti dimensioni della form visualizzata
//	var frmTempWidth;
//	var frmWidth;
//	var frmHeight = 152;
//	var frmContHeight = 210;
//	var btnOkX = 950;
//	var btnAnnullaX = 980;
//	var btnY = 175;
//	var delta;

//	if(haorologio && hagestioneturno)
//	{
////		delta = 0;
////		frmTempWidth = 1010;
//		solutionModel.getForm(frmNameTemp).getField('fld_badge').visible = true;
//		solutionModel.getForm(frmNameTemp).getField('fld_tipoturnista').visible = true;
//		solutionModel.getForm(frmNameTemp).getLabel('btn_tipoturnista').visible = true;
//		solutionModel.getForm(frmNameTemp).getLabel('lbl_btn_tipoturnista').visible = true;
//				
//	}
//	else if(haorologio)
//	{
////		delta = 180;
////		frmTempWidth = 830;
//		solutionModel.getForm(frmNameTemp).getField('fld_badge').visible = true;
//		
//	}
//	else
//	{	
////		delta = 230;
////		frmTempWidth = 780;
//	}
	
	frmCont.elements['tab_dip_decorrenze'].addTab(frmNameTemp);
    
	return frmCont;

}

/**
 * @properties={typeid:24,uuid:"C31DC61D-9177-404C-9EC2-934F2FF50E58"}
 */
function apriModificaMultiplaDecorrenze(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _idDitta)
{
	/** @type {Array<Number>}*/
	var arrDip = globals.getLavoratoriDittaDalAl(_idDitta);
	var frm = forms.giorn_dip_modifica_decorrenze;
	globals.costruisciRiepilogoRegole(arrDip,_idDitta);
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Decorrenze lavoratori');
}

/**
 * Costruisce il riepilogo delle segnalazioni di dipendenti con eventi da confermare
 * prima dei controlli preliminari
 * 
 * @param {Array} arrDip
 * 
 * @properties={typeid:24,uuid:"C569DE45-31F0-4F71-AA80-F24CA13F4983"}
 * @SuppressWarnings(unused)
 */
function costruisciRiepilogoConfermaEventi(arrDip)
{
	var frmName = 'giorn_controllo_cp_eventi_tbl';
	var frmNameTemp = 'giorn_controllo_cp_eventi_tbl_temp';
		
	if (forms[frmNameTemp] != null){
		
        history.removeForm(frmNameTemp);
        solutionModel.removeForm(frmNameTemp);
    
	}

	var tempForm = solutionModel.cloneForm(frmNameTemp,solutionModel.getForm(frmName));

	var cols = ['codice','nominativo','radicecontratto','radicequalifica','giorno','evento','descevento','proprieta','ore','confermato','idgiornalieraeventi','idevento','annotazione'];
	var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT];
	
	var dsCE = databaseManager.createEmptyDataSet(0,cols);
	for(var i=0; i < arrDip.length; i++)
	{
		var row = arrDip[i];
		var currRow = [row['codice'],row['nominativo'],row['radicecontratto'],row['radicequalifica'],row['giorno'],
		               row['evento'],row['descevento'],row['proprieta'],row['ore'],row['confermato'],row['idgiornalieraeventi'],
					   row['idevento'],row['annotazione']];
				
		dsCE.addRow(i+1, currRow);
	}
	    
    var dSCE = dsCE.createDataSource('dSCE',types);
	solutionModel.getForm(frmNameTemp).dataSource = dSCE;
	solutionModel.getForm(frmNameTemp).getField('fld_codice').dataProviderID = 'codice';
	solutionModel.getForm(frmNameTemp).getField('fld_nominativo').dataProviderID = 'nominativo';
	solutionModel.getForm(frmNameTemp).getField('fld_contratto').dataProviderID = 'radicecontratto';
	solutionModel.getForm(frmNameTemp).getField('fld_qualifica').dataProviderID = 'radicequalifica';
	solutionModel.getForm(frmNameTemp).getField('fld_giorno').dataProviderID = 'giorno';
	solutionModel.getForm(frmNameTemp).getField('fld_evento').dataProviderID = 'evento';
	solutionModel.getForm(frmNameTemp).getField('fld_descrizione').dataProviderID = 'descevento';
	solutionModel.getForm(frmNameTemp).getField('fld_proprieta').dataProviderID = 'proprieta';
	solutionModel.getForm(frmNameTemp).getField('fld_ore').dataProviderID = 'ore';
	solutionModel.getForm(frmNameTemp).getField('fld_confermato').dataProviderID = 'confermato';
	solutionModel.getForm(frmNameTemp).getField('fld_idgiornalieraeventi').dataProviderID = 'idgiornalieraeventi';
	solutionModel.getForm(frmNameTemp).getField('fld_idevento').dataProviderID = 'idevento';
	solutionModel.getForm(frmNameTemp).getField('fld_annotazione').dataProviderID = 'annotazione';
	
	forms.giorn_controllo_cp.elements.tab_conferma_eventi.addTab(frmNameTemp);
	
}

/**
 * Costruisce il riepilogo delle segnalazioni di dipendenti con eventi informativi statistici
 *  prima dei controlli preliminari
 * 
 * @param {Array} arrDip
 *
 * @properties={typeid:24,uuid:"95135A34-F5C7-4BD6-B49B-667FECAFA6A3"}
 * @SuppressWarnings(unused)
 */
function costruisciRiepilogoInformativiStatistici(arrDip)
{
	var frmName = 'giorn_controllo_cp_infostat_tbl';
	var frmNameTemp = 'giorn_controllo_cp_infostat_tbl_temp';
		
    if (forms[frmNameTemp] != null){
		
        history.removeForm(frmNameTemp);
        solutionModel.removeForm(frmNameTemp);
    
	}

	var tempForm = solutionModel.cloneForm(frmNameTemp,solutionModel.getForm(frmName));
    
	var cols = ['codice','nominativo','eventoriclassificato','prog','um','max','fatto','annotazione','confermato','ideventoriclassificato','iddip','giorno'];
	var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT];
	
	var dsCIS = databaseManager.createEmptyDataSet(0,cols);
	for(var i=0;i < arrDip.length; i++)
	{
		var row = arrDip[i];
		var currRow = [row['codice'],row['nominativo'],row['eventoriclassificato'],row['prog'],row['um'],
		               row['max'],row['fatto'],row['annotazione'],row['confermato'],row['ideventoriclassificato'],
					   row['iddip'],row['giorno']];
				
		dsCIS.addRow(i+1, currRow);
	}
	
    var dSCIS = dsCIS.createDataSource('dSCIS',types);
	
    solutionModel.getForm(frmNameTemp).dataSource = dSCIS;
	solutionModel.getForm(frmNameTemp).getField('fld_codice').dataProviderID = 'codice';
	solutionModel.getForm(frmNameTemp).getField('fld_nominativo').dataProviderID = 'nominativo';
	solutionModel.getForm(frmNameTemp).getField('fld_eventoriclassificato').dataProviderID = 'eventoriclassificato';
	solutionModel.getForm(frmNameTemp).getField('fld_prog').dataProviderID = 'prog';
	solutionModel.getForm(frmNameTemp).getField('fld_um').dataProviderID = 'um';
	solutionModel.getForm(frmNameTemp).getField('fld_max').dataProviderID = 'max';
	solutionModel.getForm(frmNameTemp).getField('fld_fatto').dataProviderID = 'fatto';
	solutionModel.getForm(frmNameTemp).getField('fld_annotazione').dataProviderID = 'annotazione';
	solutionModel.getForm(frmNameTemp).getField('fld_confermato').dataProviderID = 'confermato';
	solutionModel.getForm(frmNameTemp).getField('fld_ideventoriclassificato').dataProviderID = 'ideventoriclassificato';
	solutionModel.getForm(frmNameTemp).getField('fld_iddip').dataProviderID = 'iddip';
	solutionModel.getForm(frmNameTemp).getField('fld_giorno').dataProviderID = 'giorno';
	
	forms.giorn_controllo_cp.elements.tab_conferma_info_stat.addTab(frmNameTemp);
	
}

/**
 * Costruisce il riepilogo delle annotazioni bloccanti per la chiusura da confermare
 *  
 * @param {JSDataSet} dsAnn
 *
 * @properties={typeid:24,uuid:"4417DCF7-98D4-4393-99EA-3B72C13CB91F"}
 * @SuppressWarnings(unused)
 */
function costruisciRiepilogoConfermaAnnotazioni(dsAnn)
{
	var frmName = 'giorn_controllo_annotazioni_ditta_tbl';
	var frmNameTemp = 'giorn_controllo_annotazioni_ditta_tbl_temp';
	
	forms.giorn_controllo_annotazioni_ditta.elements.tab_conferma_annotazioni.removeAllTabs();
	
    if (forms[frmNameTemp] != null){
		
        history.removeForm(frmNameTemp);
        solutionModel.removeForm(frmNameTemp);
    
	}
    
	var tempForm = solutionModel.cloneForm(frmNameTemp,solutionModel.getForm(frmName));
	
    var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER];
	var dSAnn = dsAnn.createDataSource('dSCIS',types);
	
	solutionModel.getForm(frmNameTemp).dataSource = dSAnn;
	solutionModel.getForm(frmNameTemp).getField('fld_codice').dataProviderID = 'cod_dipendente';
	solutionModel.getForm(frmNameTemp).getField('fld_nominativo').dataProviderID = 'nominativo';
	solutionModel.getForm(frmNameTemp).getField('fld_notaditta').dataProviderID = 'info';
	solutionModel.getForm(frmNameTemp).getField('fld_confermato').dataProviderID = 'daconsiderare';
	solutionModel.getForm(frmNameTemp).getField('fld_idinfomensili').dataProviderID = 'idinfomensili';
	
	forms.giorn_controllo_annotazioni_ditta.elements.tab_conferma_annotazioni.addTab(frmNameTemp);
	
	globals.ma_utl_setStatus(globals.Status.EDIT,frmNameTemp);
	
}

/**
 * Costruisce il riepilogo dei turnisti presenti nel mese selezionato
 * 
 * @param {JSDataSet} dsTurnisti
 *
 * @properties={typeid:24,uuid:"18F417E2-07D4-4C20-9138-255DBC958D12"}
 * @SuppressWarnings(unused)
 */
function costruisciRiepilogoTurnisti(dsTurnisti)
{
	var frmName = forms.giorn_controllo_turnisti_tbl.controller.getName();
	var frmNameTemp = frmName + '_temp';
	
	forms.giorn_controllo_turnisti.elements.tabless_turnisti.removeAllTabs();
	
    if (forms[frmNameTemp] != null){
		
        history.removeForm(frmNameTemp);
        solutionModel.removeForm(frmNameTemp);
    
	}
    
	var tempForm = solutionModel.cloneForm(frmNameTemp,solutionModel.getForm(frmName));
	
    var types = [JSColumn.NUMBER,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.TEXT];
	var dSTurnisti = dsTurnisti.createDataSource('dSTurn',types);
	
	tempForm.dataSource = dSTurnisti;
	tempForm.getField('fld_codice').dataProviderID = 'codice';
	tempForm.getField('fld_nominativo').dataProviderID = 'nominativo';
	tempForm.getField('fld_decorrenza').dataProviderID = 'decorrenza';
	tempForm.getField('fld_descrizione').dataProviderID = 'tipoturnista';
	
	forms.giorn_controllo_turnisti.elements.tabless_turnisti.addTab(frmNameTemp);
	
	globals.ma_utl_showFormInDialog(forms.giorn_controllo_turnisti.controller.getName(),'Elenco turnisti');
	
}

/**
 * @properties={typeid:24,uuid:"212A1077-14DB-4409-9B37-92FF0A77E448"}
 */
function cambiaEventoMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _idGiornalieraEvento)
{
	apriCambiaEventoMultiplo(_idGiornalieraEvento);
}

/**
 * @param {Number} [idGiornalieraEvento]
 * 
 * @properties={typeid:24,uuid:"1625FCC0-B223-4341-9DBD-1435CB3F0652"}
 * @AllowToRunInFind
 */
function apriCambiaEventoMultiplo(idGiornalieraEvento)
{
	var periodo = globals.getPeriodo();

	/** @type {Date} */
	var dallaData = globals.getFirstDatePeriodo(periodo);		
	/** @type {Date} */
	var allaData = globals.getLastDatePeriodo(periodo);
	
	var giorniSelezionati = globals.getGiorniSelezionatiEv();
	if(giorniSelezionati && giorniSelezionati.length > 0)
	{
		dallaData.setDate(giorniSelezionati[0]);
		allaData.setDate(giorniSelezionati[giorniSelezionati.length - 1]);
	}

	var idEvento = null;
	var propEvento = null;
	
	if(idGiornalieraEvento)
	{
		/** @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>}*/
		var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_EVENTI);
		if(fs.find())
		{
			fs.idgiornalieraeventi = idGiornalieraEvento;
			if(fs.search())
			{
				idEvento = fs.e2giornalieraeventi_to_e2eventi.idevento;
				propEvento = fs.codiceproprieta;
				
				//se in presenza di un evento relativo ad un certificato invita a passare attraverso le certificazioni
				if(globals.needsCertificate(fs.e2giornalieraeventi_to_e2eventi.ideventoclasse))
				{
					globals.ma_utl_showInfoDialog('Per modificare un evento lungo selezionare la voce <b>Gestione certificati</b> dal menu contestuale');
					return;
				}
			}
		}
	}
	
	globals.showCambiaEvento(forms.giorn_header.idditta, periodo, dallaData, allaData, idEvento, propEvento);
		
}

/**
 * Importa il tracciato della ditta selezionata (non essendoci il percorso 
 * selezionato il tracciato verrà automaticamente recuperato dall'ftp)
 *
 * @param {Number} [_idditta]
 * @param {Number} [_periodo]
 * @param {Number} [_gruppoinst]
 * @param {String} [_gruppolav]
 * 
 *
 * @properties={typeid:24,uuid:"C8D7E189-050A-47CF-A331-DFF2C3BA8552"}
 */
function importaTracciatoDaFtp(_idditta,_periodo,_gruppoinst,_gruppolav) 
{
    var idditta = _idditta != null ? _idditta : forms.giorn_header.idditta;
	var periodo = _periodo != null ? _periodo : globals.getPeriodo();
	var gruppoinst = _gruppoinst != null ? _gruppoinst : globals.getGruppoInstallazione();
	var gruppolav = _gruppolav != null ? _gruppolav : globals.getGruppoLavoratori();
	
	// se sono presenti dei dati ditta/dipendenti non ancora acquisiti dal cliente,
	// prima di proseguire dovranno essere scaricati 
	if(globals.verificaDatiDittaFtp(idditta,gruppoinst))
	{
		globals.ma_utl_showWarningDialog('<html>Sono presenti dei dati inviati dallo studio e non ancora acquisiti per la ditta.<br/>\
            Prima di procedere con l\'importazione della giornaliera definitiva effettuare una ricezione delle tabelle studio.</html>','Verifica presenza di dati da acquisire');
		return;
	}
	
	var params = globals.inizializzaParametriTracciatoMese(idditta,
		                                                   periodo,
														   gruppoinst,
														   gruppolav,
														   [-1],
														   -1,
														   globals._tipoConnessione);
	
    globals.importaDaFtp(params);
}


/**
 * Ritorna il tipo di installazione della ditta per il periodo specificati
 * 
 * @param {Number} _idditta
 * @param {Number} _periodo
 *
 * @properties={typeid:24,uuid:"54963C1D-03F5-46BF-80D3-8FE30DAAC48A"}
 */
function getTipoInstallazione(_idditta,_periodo){
	
	//se la ditta utilizza l'ftp può decidere di scaricare la giornaliera con gli eventuali dati mancanti
	var _strTracciato = "SELECT dbo.F_Ditta_TipoInstallazione(?,?)";
	var _arrTracciato = new Array;
	    _arrTracciato.push(_idditta);
		_arrTracciato.push(_periodo);
	var _dsTracciato = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_strTracciato,_arrTracciato,1);

	return _dsTracciato.getValue(1,1);
	
}

/**
 * Ottiene il valore del campo anomalie 
 * 
 * @param {Number} idlavoratore
 * @param {String} giorno
 *
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"1D472E88-2170-4FCF-8DAC-0B570C49EE9D"}
 */
function getAnomalieGiornata(idlavoratore,giorno)
{
	var sqlAnomalie = 'SELECT anomalie FROM E2Giornaliera WHERE iddip = ? AND Giorno = ? AND TipoDiRecord = \'N\'';
    var arrAnomalie = [idlavoratore,giorno];
    var dsAnomalie = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlAnomalie,arrAnomalie,1);
    
    return dsAnomalie.getValue(1,1);
    
}

/**
 * Lancia l'operazione di ricalcolo dei ratei del dipendente per il mese selezionato
 * 
 * @param {Number} iddip
 * @param {Number} periodo
 *
 * @properties={typeid:24,uuid:"546299F0-B7C5-4B4F-B6C7-9EFA753BD351"}
 */
function ricalcolaRatei(iddip,periodo) {
	
	var params = {
		iddipendenti : [iddip],
		periodo : periodo,
		tipoConnessione : globals._tipoConnessione
	}
	
	var url = globals.WS_MULTI_URL + "/Voci/RicalcolaRatei";
	globals.addJsonWebServiceJob(url,
		                         params,
								 vUpdateOperationStatusFunction);
}

/**
 * Lancia l'operazione di ricalcolo dei codici del dipendente per il mese selezionato
 * 
 * @param {Number} iddip
 * @param {Number} periodo
 *
 * @properties={typeid:24,uuid:"2D2F18A1-1C89-4528-8C60-0EDDB3CBA707"}
 */
function ricalcolaCodici(iddip,periodo) {

	var params = {
		iddipendenti : [iddip],
		periodo : periodo,
		tipoConnessione : globals._tipoConnessione
	}
	
	var url = globals.WS_MULTI_URL + "/Voci/RicalcolaCodici";
	globals.addJsonWebServiceJob(url,
		                         params,
								 vUpdateOperationStatusFunction);
}

/**
 * Apre la form con le opzioni per la stampa delle cartoline
 *
 * @param {JSEvent} event 
 *
 * @properties={typeid:24,uuid:"B59174D7-EC33-4E0A-96AB-509C118FC685"}
 */
function stampaCartolinePresenze(event) {
	
	var formOpt = forms.stampa_cartolina_presenze_opzioni;
	var form = forms.stampa_cartolina_presenze;
	form.selectedElements = forms && forms.giorn_header && forms.giorn_header.idlavoratore ? [forms.giorn_header.idlavoratore] : [];
	var formName = forms.stampa_cartolina_presenze.controller.getName();
	formOpt.vPeriodo = formOpt.vPeriodoAl = new Date(globals.getAnno(),globals.getMese()-1,1);
	var fs = forms.giorn_header.lavoratori_to_ditte;
		
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	globals.ma_utl_showFormInDialog(formName, 'Opzioni di stampa', fs);
	globals.abilitaRaggruppamenti(forms.stampa_filtri_anagrafici.controller.getName(),true);
}

/**
 * Lancia la creazione del file excel con il riepilogo degli scostamenti delle ore lavorate in più od in meno
 * 
 * @param {JSEvent} event
 * @param {Number} vIdDitta
 *
 * @properties={typeid:24,uuid:"00383DEA-B294-4DFD-8E34-BEF0126D4B19"}
 */
function stampaOreSettimane(event,vIdDitta)
{
	var anno = globals.getAnno();
	var mese = globals.getMese();
	var primaSettimanaPeriodo = globals.getWeekNumber(new Date(anno,mese - 1,1));
	var ultimaSettimanaPeriodo = globals.getWeekNumber(new Date(anno,mese - 1,globals.getTotGiorniMese(mese,anno)));
	
	try
	{		
			var parameters;
			var reportName = 'GIORN_OreSettimana.jasper';
			parameters =
			{
				pIdDitta : vIdDitta,
				pPeriodo : anno * 100 + mese,
				pSettimanaDal : primaSettimanaPeriodo,
			    pSettimanaAl : ultimaSettimanaPeriodo,
				pMese : globals.getNomeMese(mese),
				pAnno : anno
			}
						
			var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE),reportName,false,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,parameters);
		
			plugins.file.writeFile('OreSettimanaliPiuMeno_'+ anno + '_' + mese +'.pdf',bytes);
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		// Close this form					
//		globals.svy_mod_closeForm(event);
	}
		
}

/**
 * Apre la finestra con le opzioni per la stampa delle anomalie sulle timbrature
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5628EB04-E14A-4905-A7E1-18B32DD5BCC0"}
 */
function stampaAnomalieTimbrature(event)
{
	var form = forms.stampa_anomalie_timbrature.controller.getName();
	
	var fs = forms.giorn_header.lavoratori_to_ditte;
	
	globals.abilitaRaggruppamenti(forms.stampa_filtri_anagrafici.controller.getName(),false);
	globals.ma_utl_setStatus(globals.Status.EDIT,form);
	globals.ma_utl_showFormInDialog(form, 'Opzioni di stampa', fs);
}

/**
 * Restituisce l'array degli id dei giorni selezionati
 * 
 * @param {String} formName
 * 
 * @return Array
 * 
 * @properties={typeid:24,uuid:"44CC5F0F-FF34-4417-839D-FC1B94479849"}
 */
function getIdGiorniSelezionati(formName)
{
	var fs = forms[formName].foundset;
	var arr = getGiorniSelezionatiEv();
	var arrId = [];
	for(var i=0; i<arr.length; i++)
	{
		/** @type {Number} */
		var index = arr[i] + offsetGg;
		arrId.push(fs.getRecord(index)['idgiornaliera']);
	}
	return arrId;
}

/**
 * @properties={typeid:24,uuid:"A93CCCD8-A23A-4588-8D8C-09691227A017"}
 */
function isAttiva()
{
	var annoCorrente = globals.getAnno();
	var meseCorrente = globals.getMese();
	var annoAttivo = globals.getAnnoAttivo();
	var meseAttivo = globals.getMeseAttivo();
	
	return meseCorrente === meseAttivo && annoCorrente === annoAttivo;
}

/**
 * @properties={typeid:24,uuid:"65026130-C424-4919-8FB8-0BC2DEE7614B"}
 */
function apri_aggiungi_nuova_ditta()
{
	var frm = forms.giorn_aggiungi_nuova_ditta;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Aggiungi nuova ditta');
}

/**
 * @properties={typeid:24,uuid:"9275E409-ADD0-4369-AED9-A9F52E29F9B3"}
 */
function aggiornaIntestazioni()
{
	//gestione pulsante attivazione mese
	if(globals.getPeriodo() == globals.getPeriodoAttivo())
	{
	  forms.intestaVistaMensile.elements.btn_attivamese.enabled = false;
	  forms.intestaMostraTimbr.elements.btn_attivamese.enabled = false;
	}
	else
	{
	  forms.intestaVistaMensile.elements.btn_attivamese.enabled = true;	
	  forms.intestaMostraTimbr.elements.btn_attivamese.enabled = true;
	}
	
	//gestione pulsanti tipo giornaliera
	if(forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.NORMALE)
	{
		forms.intestaVistaMensile.elements.btn_giornnormale.enabled = false;
		forms.intestaVistaMensile.elements.btn_giornbudget.enabled = true;
	}else
	{
		forms.intestaVistaMensile.elements.btn_giornnormale.enabled = true;
		forms.intestaVistaMensile.elements.btn_giornbudget.enabled = false;
	}

	//gestione pulsanti filtri
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag)//forms.giorn_vista_mensile._filtroAttivo)
	{
		forms.intestaVistaMensile.elements.btn_filtroattivo.enabled = false;
		forms.intestaVistaMensile.elements.btn_filtrodisattivato.enabled = true;
		forms.intestaMostraTimbr.elements.btn_filtroattivo.enabled = false;
		forms.intestaMostraTimbr.elements.btn_filtrodisattivato.enabled = true;
		forms.giorn_vista_mensile.elements.lbl_vista_comunicazioni_filtro.text = 'Filtro attivo';
		forms.giorn_mostra_timbr.elements.lbl_timbr_comunicazioni.text = 'Filtro attivo';
	}
	else
	{
		forms.intestaVistaMensile.elements.btn_filtroattivo.enabled = true;
		forms.intestaVistaMensile.elements.btn_filtrodisattivato.enabled = false;
		forms.intestaMostraTimbr.elements.btn_filtroattivo.enabled = true;
		forms.intestaMostraTimbr.elements.btn_filtrodisattivato.enabled = false;
		forms.giorn_vista_mensile.elements.lbl_vista_comunicazioni_filtro.text = 'Nessun filtro attivo';
		forms.giorn_mostra_timbr.elements.lbl_timbr_comunicazioni.text = 'Nessun filtro attivo';
	}
	
}

/**
 * @param {Number} dalGiorno
 * @param {Number} alGiorno
 *
 * @properties={typeid:24,uuid:"729AE1D8-CFF8-46C3-AE63-8E088533EE07"}
 */
function setGiorniSelezionatiDaFascia(dalGiorno,alGiorno)
{
	if (globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]] 
	&& globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel)
	{
    	/** @type {Array} */
		var arrayGiorni = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel;

		for (var i = dalGiorno; i < alGiorno; i++)
		{
			if ( (i - globals.offsetGg) > 0) {
				if (arrayGiorni.lastIndexOf(i - globals.offsetGg) == -1) {
					arrayGiorni.push(i - globals.offsetGg);
//					forms['giorn_list_temp'].foundset.getRecord(i)['checked'] = 1;
					forms['giorn_selezione_multipla_clone'].foundset.getRecord(i)['checked'] = 1;
				}
			}
		}

		if (globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]])
			globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = arrayGiorni;
	}
}

/**
 * @param {Number} selectedIndex
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"EB260193-255A-4C1F-A225-D1E019DCFEE0"}
 */
function aggiornaSelezioneGiorni(event, selectedIndex)
{
	var formName = event.getFormName();
	if (formName !== 'giorn_list_temp' && formName !== 'giorn_timbr_temp')
		return;
	
	//a meno che il record sia presente tra i giorni selezionati con la spunta, la selezione del record
	//pulisce i giorni selezionati in precedenza
	var frm = forms.svy_nav_fr_openTabs;
	if(frm.vSelectedTab != null && frm.vTabNames[frm.vSelectedTab])
	{
		var selection_form = forms['giorn_selezione_multipla_clone'];
		
		frm.vTabNames[frm.vSelectedTab]['giorni_sel'] = [];
        selezionaTuttoIlMese(event, 0, selection_form.controller.getName());
        
        selection_form.foundset.setSelectedIndex(selectedIndex);
        selection_form.foundset['checked'] = 1;
	}
}		
	
/**
 * @properties={typeid:24,uuid:"2DB79AF1-C2E1-42CD-91EA-F5DBB8BC9FA2"}
 */
function aggiornaVisualizzazioneGiorniSelezionati(tabName)
{
	/** @type {Number} */
	var index_sel = globals.ma_utl_getTabProperty(tabName, 'index_sel');
	/** @type {Array<Number>} */
	var giorni_sel = globals.ma_utl_getTabProperty(tabName, 'giorni_sel');
	
	var selection_fs = forms['giorn_selezione_multipla_clone'].foundset;
		selection_fs.setSelectedIndex(index_sel);
	
	if (giorni_sel && giorni_sel.length > 0 && index_sel)
	{
		for(var r = 1 + globals.offsetGg; r < selection_fs.getSize(); r++)
		{
			var record = selection_fs.getRecord(r);
			if(giorni_sel.indexOf(r - globals.offsetGg) > -1)
				record['checked'] = 1;
			else
				record['checked'] = 0;
		}
	}
	else
		globals.selezionaTuttoIlMese(new JSEvent, 0, 'giorn_selezione_multipla_clone');
}

/**
 * Restituisce true se le ore sono da considerare, false altrimenti
 * 
 * @param {Number} evento
 * 
 * @return Object
 * 
 * @properties={typeid:24,uuid:"AE4121D5-EDEA-45F6-9197-7DAF9C1DC4B7"}
 */
function getTipologiaEvento(evento)
{
	var _strOre = 'SELECT * FROM F_Eventi_Dati(?)';
	var _arrOre = [evento];
	var _dsOre = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_strOre,_arrOre,-1);
	
	var _tipo = _dsOre.getValue(1,5);
	var _prioritaPerScalo = _dsOre.getValue(1,2);
	
	return {
		    tipo : _tipo,
			scalo : _prioritaPerScalo
	};
		
}

/**
 * @param {Number} idLav
 * @param {Number} mese
 * @param {Number} anno
 * 
 * @properties={typeid:24,uuid:"BD1B4C29-9466-47AF-AC92-C57ADE2496D0"}
 * @SuppressWarnings(unused)
 */
function esistonoGiorniUtilizzabiliInBudget(idLav,mese,anno)
{
	/** @type {{anno:Number,mese:Number,anno_attivo:Number,mese_attivo:Number,
	 *                     periodo:Number,periodo_attivo:Number,giorni_sel:Array,index_sel:Number,
	 *                     gruppo_inst:Number,gruppo_lav:String,idditta:Number,
	 *                     filtro_anag:Boolean,selected_tab:Number,selected_elements:Array,op_id:String}} */
	 var progParams = {};
	     progParams.anno  = anno;
		 progParams.mese  = mese;
		 progParams.periodo = globals.toPeriodo(anno, mese);
		 progParams.anno_attivo = anno;	
		 progParams.mese_attivo = mese;
		 progParams.periodo_attivo = globals.toPeriodo(anno, mese);
		 progParams.giorni_sel = [];
		 progParams.index_sel = globals.offsetGg + 1;
		 progParams.gruppo_inst = globals.getGruppoInstallazione();
		 progParams.gruppo_lav = globals.getGruppoLavoratori();
		 progParams.idditta = globals.getDitta(idLav);
		 progParams.filtro_anag = false;
		 progParams.selected_tab = 2;
		 progParams.selected_elements = [];
		 progParams.op_id = null;
		 
	if(globals.isMeseDaAttivare(progParams))
		return true;
		 
	var _numGiorniMese = globals.getTotGiorniMese(mese, anno);
	var _dataAssunzione = forms.giorn_header.foundset.assunzione; 
	var _dataCessazione = forms.giorn_header.foundset.cessazione;
	var _primoGiornoLavoratoNelMese;
	var _ultimoGiornoLavoratoNelMese;
	var _ultimoGiornoMese = new Date(anno,mese-1,_numGiorniMese);
	var _primoGiornoMese = new Date(anno,mese-1,1);
	var _primoGiornoVista = new Date(_primoGiornoMese);
	    _primoGiornoVista.setDate(_primoGiornoVista.getDate() - globals.offsetGg);
	
	var _primoGiorno = globals.getNumGiorno(_primoGiornoVista) + '/' + globals.getNumMese(_primoGiornoVista.getMonth() + 1) + '/' + _primoGiornoVista.getFullYear(); 
	var _ultimoGiorno;
	
	if(_dataCessazione != null && _dataCessazione < _ultimoGiornoMese)
	{
	   _ultimoGiorno = _dataCessazione.getDate() + '/' + globals.getNumMese(mese) + '/' + anno.toString();
	   _ultimoGiornoLavoratoNelMese = _dataCessazione;
	   _numGiorniMese = _dataCessazione.getDate();
	}
	else
	{
	   _ultimoGiorno = _numGiorniMese.toString() + '/' + globals.getNumMese(mese) + '/' + anno.toString();	
	   _ultimoGiornoLavoratoNelMese = _ultimoGiornoMese;
	}
		
	if(_primoGiornoMese < _dataAssunzione)
		_primoGiornoLavoratoNelMese = new Date(_dataAssunzione);
	else 
		_primoGiornoLavoratoNelMese = new Date(_primoGiornoMese);

		
	var _gQuery = "SELECT * FROM [dbo].[F_Gio_Lav_Dati](?,?,?) WHERE TipoDiRecord = ?";		

    var _parArrGiorn = 
                      [
	                   idLav
	                   ,utils.dateFormat(utils.parseDate(_primoGiorno,globals.EU_DATEFORMAT),globals.EU_DATEFORMAT)
	                   ,utils.dateFormat(utils.parseDate(_ultimoGiorno,globals.EU_DATEFORMAT),globals.EU_DATEFORMAT)
	                   ,globals.TipoGiornaliera.BUDGET
                      ];
    var _gDataSetDatiDipGiorn = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _gQuery, _parArrGiorn, -1);
        
    var	_bQuery = 'SELECT DISTINCT(Giorno),Anomalie FROM [dbo].[F_Gio_Lav_Dati](?,?,?) WHERE TipoDiRecord = \'N\' AND Anomalie IN (1,2,3,4,5,6,9,10) ORDER BY Giorno' //AND Anomalie IN (1,2,3)';
	var _bArrGiorn = 
		            [
	   	             idLav
	   	             ,utils.parseDate(_primoGiorno,globals.EU_DATEFORMAT)
		             ,utils.parseDate(_ultimoGiorno,globals.EU_DATEFORMAT)
		            ];
    var _bDs = null;
	    _bDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_bQuery,_bArrGiorn,100);
	    
	if(_gDataSetDatiDipGiorn.getMaxRowIndex() == 0 
			&& _bDs.getMaxRowIndex() == 0)
	return false;
		
    return true;
}

/**
 * @properties={typeid:24,uuid:"8DAAB47E-DB26-4BD8-99A2-FAFA422CF671"}
 */
function generaNomiDittaDemo()
{
	/** @type {JSFoundset<db:/ma_anagrafiche/persone>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,'persone');
	fs.loadAllRecords();
	databaseManager.startTransaction();
	for(var i = 1; i <= fs.getSize(); i++)
	{
		var rec = fs.getRecord(i);
		rec.nominativo = 'NOMINATIVO_' + i;
		rec.cognome = 'COGNOME_' + i;
		rec.nome = 'NOME_' + i;
	}
	if(!databaseManager.commitTransaction())
		globals.ma_utl_showWarningDialog('Aggiornamento ditta demo non riuscito','Ditta DEMO');
}

/**
 * @param {Number} [_anno]
 * @param {Number} [_mese]
 * @param {Boolean} [_aggiorna]
 *  
 * @properties={typeid:24,uuid:"24B76229-01D3-4664-B51D-81AEB51C917F"}
 */
function aggiornaPeriodoIntestazione(_anno,_mese,_aggiorna)
{
	var anno = _anno ? _anno : globals.getAnno();
	var mese = _mese ? _mese : globals.getMese();
		
	forms.intestaVistaMensile.vPeriodoStr = 
	forms.intestaMostraTimbr.vPeriodoStr =
	  forms.intestaFlusso.vPeriodoStr =
		globals.getNomeMese(mese) + ' ' + anno;
			
	if(_aggiorna)
	{
		var annoAttivo = globals.getAnnoAttivo();
		var meseAttivo = globals.getMeseAttivo();
		// se esiste almeno un periodo precedentemente attivato (può invece essere il caso in cui entriamo per la prima volta in giornaliera in un mese non ancora attivato!)
		// e differisce dal periodo che si sta visualizzando
		if (annoAttivo && meseAttivo && (anno != annoAttivo || mese != meseAttivo))
			forms.intestaVistaMensile.vPeriodoStr =
				forms.intestaMostraTimbr.vPeriodoStr =
					forms.intestaFlusso.vPeriodoStr =
						globals.getNomeMese(mese) + ' ' + anno + ' (Attivo : ' + globals.getNomeMese(meseAttivo) + ' ' + annoAttivo + ')';
						
		var frmTabs = forms.svy_nav_fr_openTabs;		
		var filtroAttivo = globals.objGiornParams[frmTabs.vTabNames[frmTabs.vSelectedTab]].filtro_anag;
		forms.intestaVistaMensile.elements.btn_filtroattivo.enabled = !filtroAttivo;
		forms.intestaVistaMensile.elements.btn_filtrodisattivato.enabled = filtroAttivo;
	}
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {Object} idLavoratore
 *
 * @properties={typeid:24,uuid:"C51C0FB2-C8C4-49F4-B868-C653197A783D"}
 */
function ApriGC(idLavoratore)
{
	var _filter = new Object();
	
	_filter.filter_name = 'ftr_lavoratore';
	_filter.filter_field_name = 'idlavoratore';
	_filter.filter_operator = '=';
	_filter.filter_value = idLavoratore;
	
	var _progObj = globals.nav.program['GestioneCartolina'];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
	globals.openProgram('GestioneCartolina',null,true);
    
}

/**
 * @param {Number} idDip
 * @param {String} dal
 * @param {String} al
 * @param {String} tipoGiornaliera
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"7565012D-8D28-4E8A-AE81-4CF7D24EEA0B"}
 */
function ottieniDataSetColonne(idDip,dal,al,tipoGiornaliera)
{
	// Recupera il numero delle colonne nella giornaliera dei vari tipi di evento
    var _evQuery = "SELECT * FROM [dbo].[F_Gio_EventiColonne](?,?,?,?)";    	
    var _parArrEv = 
	    [
			 idDip
			,dal
			,al
			,tipoGiornaliera
		];
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _evQuery, _parArrEv, -1);    
}

/**
 * @param {Number} idDip
 * @param {String} dal
 * @param {String} al
 * @param {String} tipoGiornaliera
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"09E85A3F-7F64-43BA-8855-ECBDE3D4D797"}
 */
function ottieniDataSetColonne_old(idDip,dal,al,tipoGiornaliera)
{
	// Recupera il numero delle colonne nella giornaliera dei vari tipi di evento
    var _evQuery = "SELECT * FROM [dbo].[F_Gio_DatiColonne](?,?,?)";    	
    var _parArrEv = 
	    [
			 idDip
			,dal
			,al
		];
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _evQuery, _parArrEv, -1);    
}

/**
 * @param {Number} idDip
 * @param {String} dal
 * @param {String} al
 * @param {String} tipoGiornaliera
 *
 * @properties={typeid:24,uuid:"14403A3D-486F-459B-9745-E587E9E5A25A"}
 */
function ottieniProprietaColonneEventiOrdinari(idDip,dal,al,tipoGiornaliera)
{
	// Recupera il numero relativo al tipo delle proprieta di eventi ordinari nelle colonne della giornaliera
    var _evQuery = "SELECT * FROM [dbo].[F_Gio_ProprietaColonne](?,?,?,?)";    	
    var _parArrEv = 
	    [
			 idDip
			,dal
			,al
			,tipoGiornaliera
		];
	var _dsQuery = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _evQuery, _parArrEv, -1);    	
    
	return _dsQuery.getValue(1,2);
}

/**
 * @param {Number} idDip
 * @param {String} dal
 * @param {String} al
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"9B83E99C-CF74-4751-8963-5D993139F9AF"}
 */
function ottieniDataSetRighe(idDip,dal,al)
{
	var _evQuery = "SELECT DISTINCT GLD.IdEvento,GLD.CodiceProprieta,E.Evento \
	                FROM [dbo].[F_Gio_Lav_Dati](?,?,?) GLD \
	                INNER JOIN E2Eventi E \
					ON GLD.IdEvento = E.idEvento \
					INNER JOIN E2EventiClassi EC \
                    ON E.IdEventoClasse = EC.IdEventoClasse \
					WHERE TipoDiRecord = 'N' AND EC.Tipo != 'M' \
					ORDER BY E.Evento,GLD.CodiceProprieta";
	var _parArrEv = 
	    [
	       idDip,
		   dal,
		   al		   
	    ];
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_evQuery,_parArrEv,-1);    
}

/**
 * Ritorna il numero massimo assoluto di colonne necessarie al disegno delle timbrature per le date fornite.
 * <p>è equivalente al metodo numeroMaxColonneTimbrature con la stessa query trasportata come function del database
 * nel tentativo di ovviare ad un problema di recupero dati in alcuni casi ancora poco chiari </p>
 * 
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"FE0826B5-8D59-4E72-A77A-283BF79F0B11"}
 */
function ottieniNumeroColonneTimb(idDip,dal,al)
{
	var _timbQuery = "SELECT * FROM [dbo].[F_Timb_DatiColonne](?,?,?)";
	/** @type {String}*/
	var _dal = globals.dateFormat(dal,globals.ISO_DATEFORMAT);
	/** @type {String}*/
	var _al = globals.dateFormat(al,globals.ISO_DATEFORMAT);
	var _timbArr = [idDip
	                ,parseInt(_dal,10)
	                ,parseInt(_al,10)];
	var _dsTimb = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_timbQuery,_timbArr,-1); 
	
	return _dsTimb && _dsTimb.getValue(1,1);
}

/**
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 * @param {Boolean } soloCartolina
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"E6B23400-0B64-490D-B25E-30ECBD9BFBED"}
 */
function ottieniDataSetTimbrature(idDip,dal,al,soloCartolina)
{
	/** @type {String} */
    var _tQuery = "SELECT \
    					  Timbr.idTimbrature \
    					, Timbr.idDip \
    					, Timbr.Nr_Badge \
    					, Timbr.Senso \
    					, Timbr.Timbratura \
    					, Timbr.Indirizzo \
    					, Timbr.SensoCambiato \
    					, Timbr.TimbEliminata \
    					, Timbr.idGruppoInst \
    					, Timbr.GGSucc \
    					, Timbr.TipoDiRecord \
    					, Timbr.GiornoNum \
    					, G.IdGiornaliera \
    					, G.Giorno \
    					, G.Anomalie \
    				FROM \
    					dbo.E2Giornaliera G \
    					LEFT OUTER JOIN	dbo.F_Gio_Lav_TimbraturePeriodo(?, ?, ?) Timbr \
							ON Timbr.idDip = G.IdDip AND Timbr.GiornoNum = CAST(CONVERT(varchar, G.Giorno, 112) AS bigint) \
						WHERE \
							G.IdDip = ? AND G.Giorno BETWEEN ? AND ? AND G.TipoDiRecord = ? \
						ORDER BY \
							G.Giorno, Timbr.Timbratura;";
    
    var dalInt = parseInt(utils.dateFormat(dal, globals.ISO_DATEFORMAT));
	var alInt  = parseInt(utils.dateFormat(al, globals.ISO_DATEFORMAT));
    
	var _parArrTimbr = [
	                     idDip,
	                     dalInt,
	                     alInt,
						 idDip,
						 dal,
						 al,
						 globals.TipoGiornaliera.NORMALE
	                   ]
					   
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_tQuery,_parArrTimbr,-1);
}

/**
 * @param {Number} idDip
 * @param {String} dal
 * @param {String} al
 * @param {Array} [arrIdGiorn]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"2EB9EAFF-A998-4F63-BBC2-FA91486740FA"}
 */
function ottieniDataSetAnomalieLavoratore(idDip,dal,al,arrIdGiorn)
{
	/** @type Array */
	var arrGg = null;
	if(arrIdGiorn && arrIdGiorn.length > 0)
	{
		arrGg = [];
		for(var g=0; g<arrIdGiorn.length; g++)
		{
			/** @type {Number}*/
			var idGiorn = arrIdGiorn[g];
			var giorno = globals.getGiornoDaIdGiornaliera(idGiorn);
		    arrGg.push(giorno);
		}
	}
	else
		return null;
	
	/** @type {String} */
    var _tQuery = "SELECT * FROM [dbo].[F_Gio_Lav_TimbraturePeriodo](?,?,?) " + 
	              " WHERE idGiornaliera IN (SELECT G.idGiornaliera FROM [dbo].E2Giornaliera G  WHERE G.IdDip = ? ";
		_tQuery += (arrGg ? " AND G.Giorno IN (" + arrGg.map(function(d){return "'" + (d.getFullYear()*10000 + (d.getMonth() + 1)*100 + d.getDate()) + "'"}).join(',') + "))" : " AND G.Anomalie IN (4,5,6,8,9,10)) ");
		_tQuery +=  " ORDER BY GiornoNum,Timbratura";

	var _parArrTimbr = [
	                     idDip,
						 dal,
						 al,
						 idDip
	                   ];
	var _ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_tQuery,_parArrTimbr,100); 
	return _ds;
}

/**
 * @param {Number} idDip
 * @param {String} dal
 * @param {String} al
 * @param {Array} [arrIdGiorn]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"1314B162-D33E-453B-A170-31BE4781949B"}
 */
function ottieniDataSetSquadratureLavoratore(idDip,dal,al,arrIdGiorn)
{
	/** @type Array */
	var arrGg = null;
	if(arrIdGiorn)
	{
		arrGg = [];
		for(var g=0; g<arrIdGiorn.length; g++)
			arrGg.push(arrIdGiorn[g]);
		
	}
	/** @type {String} */
    var _lQuery = "SELECT * FROM [dbo].[F_Gio_Lav_Dati](?,?,?) " + 
	              " WHERE TipoDiRecord = 'N' " + 
				  " AND Giorno IN (" + arrGg.map(function(d){return "'" + (d.getFullYear()*10000 + (d.getMonth() + 1)*100 + d.getDate()) + "'"}).join(',') + ")" +
				  " ORDER BY Giorno";

	var _parArrList = [
	                     idDip,
						 dal,
						 al						 
	                   ];
	var _ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_lQuery,_parArrList,200); 
	return _ds;
}

/**
 * @param {Number} idDitta
 * @param {String} dal
 * @param {String} al
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"EA7A082A-6981-4C0D-B60C-29EA66DB496A"}
 */
function ottieniDataSetTimbratureMancantiDitta(idDitta,dal,al)
{
	/** @type {String} */
    var _tQuery = "SELECT * FROM [dbo].[F_Gio_Lav_TimbraturePeriodo](?,?,?) " + 
	              " WHERE idGiornaliera IN (SELECT G.idGiornaliera FROM [dbo].E2Giornaliera G  WHERE G.Anomalie IN (4,5,6,8,9,10))" +      
                  " ORDER BY GiornoNum, Timbratura";
    
	var _parArrTimbr = [
	                     idDitta,
						 dal,
						 al
	                   ]
	return databaseManager.getDataSetByQuery('ma_presenze',_tQuery,_parArrTimbr,-1);
}

/**
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"4E0A72AB-1E9A-4871-89ED-07AE24F71AD1"}
 */
function ottieniDataSetFasceOrarie(idDip,dal,al)
{
	/** @type {String} */
	var _foaQuery = "SELECT * FROM [dbo].[F_Gio_Lav_FasceOrarieMese](?,?,?,?)";
	var _parArrFoa = [
	                   idDip,
	                   dal,
					   al,
					   globals.TipoGiornaliera.NORMALE
					 ]
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_foaQuery,_parArrFoa,-1);

}

/**
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"777460DA-71C8-4F3F-9C9C-E4A0A25D8925"}
 */
function ottieniDataSetAnomalie(idDip,dal,al)
{
	/** @type {String} */
	var _anoQuery = "SELECT * FROM [E2Giornaliera] WHERE "
	var _anoWhereEU = "IdDip = ? AND Giorno BETWEEN ? AND ? \
	                   AND Anomalie NOT IN (0,1,2,16,32,64,128,512) AND TipoDiRecord = 'N'";  
	var _parArrAno = [];
	
	_anoQuery += _anoWhereEU;
	_parArrAno.push(idDip,
		            utils.dateFormat(dal,globals.ISO_DATEFORMAT),
					utils.dateFormat(al,globals.ISO_DATEFORMAT));
	
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_anoQuery,_parArrAno,-1);
}

/**
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 * @param {Number} optTipoSquadrature
 * @param {Array} arrEventi
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"3ACB1CC5-FBAD-478D-BA8F-5A4AC1A2457D"}
 */
function ottieniDataSetSquadrature(idDip,dal,al,optTipoSquadrature,arrEventi)
{
	// la query è dinamica a seconda del tipo di squadrature indicato 
	/** @type {String} */
	var _sqlQuery = "";
	var _parArrSql = [idDip,utils.dateFormat(dal,globals.ISO_DATEFORMAT),utils.dateFormat(al,globals.ISO_DATEFORMAT)];
	
	switch(optTipoSquadrature)
	{
		case 1:
		case 3:
			// eventi da definire/selezionati
			_sqlQuery = "SELECT Giorno FROM E2Giornaliera G INNER JOIN E2GiornalieraEventi GE \
                         ON G.IdGiornaliera = GE.IdGiornaliera WHERE IdDip = ? \
                         AND G.TipoDiRecord = 'N' \
                         AND Giorno BETWEEN ? AND ? \
                         AND GE.idEvento IN (" + arrEventi.join(',') + ")";
		break;
		
		case 2: // giorni squadrati
			_sqlQuery = "SELECT Giorno FROM [dbo].[F_Gio_Lav_Filtro_Squadrati](?,?,?)"
		break;
			
		default:
			break;
	}
	
	return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqlQuery,_parArrSql,-1);

}

/**
 * @param {Number} idDitta
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrDipFiltrati]
 * 
 * @return {Array}
 * 
 * @properties={typeid:24,uuid:"22A1045F-67AC-44EC-83DD-D3189BB94903"}
 * @AllowToRunInFind
 */
function ottieniArrayDipConAnomalie(idDitta,dal,al,arrDipFiltrati)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
	var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
	if(fsLav.find())
	{
		if(arrDipFiltrati && arrDipFiltrati.length > 0)
		   fsLav.idlavoratore = arrDipFiltrati;
		
		fsLav.search();
		
		var arrLav = globals.foundsetToArray(fsLav,'idlavoratore');
		
		var _anoDipQuery = 'SELECT DISTINCT idLavoratore,Nominativo FROM F_Gio_FiltroAnomalieDettaglio(?,?,?,?,?,?,?) ';
		if(arrLav.length > 0)
			_anoDipQuery += 'WHERE idLavoratore IN (' + arrLav.map(function(l){return l}).join(',') + ') \
			                 ORDER BY Nominativo';
		
		var _parArrAnoDip = [idDitta,dal,al,1,0,0,0];
	    
	    var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_anoDipQuery,_parArrAnoDip,-1);
	    return ds.getColumnAsArray(1);
	}
	else
	{
		application.output('Errore durante l\esecuzione della query per le anomalie su timbrature',LOGGINGLEVEL.ERROR);
		return null;
	}
}

/**
 * @param {Number} idDitta
 * @param {Date} dal
 * @param {Date} al
 * @param {Number} opzioniSquadrature
 * @param {Array} arrEvFiltro
 * @param {Array} [arrDipFiltrati]
 * 
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"6E36D8DC-D93E-4847-9B0B-B79DFCCE979F"}
 */
function ottieniArrayDipConSquadrature(idDitta,dal,al,opzioniSquadrature,arrEvFiltro,arrDipFiltrati)
{
	// insieme unione tra i dipendenti squadrati rispetto all'orario e quelli con l'evento ? in giornaliera
 	var _sqDittaQuery = 'SELECT L.idLavoratore,P.Nominativo FROM Lavoratori L \
                         INNER JOIN Persone P ON L.CodiceFiscale = P.CodiceFiscale \
                         WHERE idLavoratore IN ';
	var _sqDittaArr;
	
	switch(opzioniSquadrature)
	{
		case 1:
		case 3:	
		    _sqDittaQuery += '(SELECT IdDip AS idLavoratore FROM F_Gio_Filtro(?, ?, ?, 0, 0, 0, 0, 0, ?, 0, 0, 0)'
		    _sqDittaArr = [idDitta,
		                   dateFormat(dal,globals.ISO_DATEFORMAT),
						   dateFormat(al,globals.ISO_DATEFORMAT),
						   arrEvFiltro.join(',')];
			break;
		case 2:
			_sqDittaQuery += '(SELECT IdLavoratore AS idLavoratore FROM F_Gio_FiltroSquadrati(?,?,?)';
			_sqDittaArr = [idDitta,dateFormat(dal,globals.ISO_DATEFORMAT),dateFormat(al,globals.ISO_DATEFORMAT)];
			break;
		default:
			break;
	}
               
	if(arrDipFiltrati && arrDipFiltrati.length > 0)
	   _sqDittaQuery += ' WHERE idLavoratore IN (' + arrDipFiltrati.map(function(d){return d}).join(',') + '))';
	else
		_sqDittaQuery += ')';
	
	_sqDittaQuery += ' ORDER BY P.Nominativo';
	
	var dsSqDitta = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqDittaQuery,_sqDittaArr,-1);
    return dsSqDitta.getColumnAsArray(1);
}

/**
 * Ottieni l'anomalia relativa all'idGiornaliera passato come parametro
 * 
 * @param {Number} idGiornaliera
 *
 * @properties={typeid:24,uuid:"44D54BA5-3094-4A76-BD63-77242B42B626"}
 */
function ottieniAnomalia(idGiornaliera)
{
	 var sqlAnomalie = 'SELECT Anomalie FROM E2Giornaliera WHERE idGiornaliera = ' + idGiornaliera;
     var dsAnomalie = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlAnomalie,null,1);
     return dsAnomalie.getValue(1,1);
}

/**
 * @param {Number} idLav
 * @param {Date} dal
 * @param {Date} al
 *
 * @return {Array<Date>}
 * 
 * @properties={typeid:24,uuid:"A6DEEF5D-AE28-4AEF-A09D-7274A6B43A57"}
 */
function ottieniGiorniSquadratiDipendente(idLav,dal,al)
{
	var sqlSquadrature = 'SELECT * FROM F_Gio_Lav_Filtro_Squadrati(?,?,?)';
	var arrSquadrature = [
	                       idLav,
	                       dal,
						   al
	                      ];
	var dsSquadrature = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlSquadrature,arrSquadrature,-1);
	return dsSquadrature.getColumnAsArray(1);
}

/**
 * @param {Number} idDitta
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {Array}
 *  
 * @properties={typeid:24,uuid:"718E39EB-1198-4760-ADE6-4BE8765668C7"}
 */
function ottieniArrayDipSquadrati(idDitta,dal,al)
{
	var sqlSquadrati = 'SELECT * FROM F_Gio_FiltroSquadrati(?,?,?)';
	var arrSquadrati = [
	                       idDitta,
	                       dal,
						   al
	                      ];
	var dsSquadrati = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlSquadrati,arrSquadrati,-1);
	return dsSquadrati.getColumnAsArray(1);
}

/**
 * Verifica la presenza o meno di anomalie nelle timbrature per il dipendente nel periodo selezionato
 * 
 * @param {Number} idDip
 * @param {Number} anno
 * @param {Number} mese
 *
 * @return Boolean
 * 
 * @properties={typeid:24,uuid:"934A015C-831A-4F67-B4F5-8CB467E26755"}
 */
function haAnomalieTimbrDipendente(idDip,anno,mese)
{
	var dal = new Date(anno,mese-1,1);
	var al = new Date(anno,mese-1,globals.getTotGiorniMese(mese,anno));
	/** @type {String} */
	var _anoDipQuery = "SELECT DISTINCT IdGiornaliera FROM [E2Giornaliera] WHERE IdDip = ? AND Giorno BETWEEN ? AND ? AND Anomalie IN (4,5,6,8,9,10)";
	var _parArrAnoDip = [
	                   idDip,
					   dal,
					   al
					 ];
	
	var dsAnoDip = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_anoDipQuery,_parArrAnoDip,-1);
    if(dsAnoDip.getMaxRowIndex() > 0) return true;
    return false;
}

/**
 * Verifica la presenza o meno di anomalie nelle timbrature per la ditta nel periodo selezionato
 * 
 * @param {Number} idDitta
 * @param {Number} anno
 * @param {Number} mese
 * @param {Number} giorno
 * 
 * @return Boolean
 * 
 * @properties={typeid:24,uuid:"FFADA62F-675C-4C73-BD61-6DFC118F0819"}
 */
function haAnomalieTimbrDitta(idDitta,anno,mese,giorno)
{
	var dal = new Date(anno, mese - 1, 1);
	var al = new Date(anno, mese - 1, giorno);
	/** @type {String} */
	var _anoDittaQuery = 'SELECT DISTINCT IdGiornaliera FROM [E2Giornaliera] G \
	                    INNER JOIN Lavoratori L ON G.idDip = L.idLavoratore \
						WHERE L.idDitta = ? AND Giorno BETWEEN ? AND ? AND Anomalie IN (4,5,6,8,9,10)';
	var _parArrAnoDitta = [
	                   idDitta,
					   dal,
					   al
					 ];
	
	var dsAnoDitta = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_anoDittaQuery,_parArrAnoDitta,-1);
    if(dsAnoDitta.getMaxRowIndex() > 0) return true;
    return false;
}

/**
 * Verifica la presenza o meno di dipendenti squadrati per la ditta nel periodo selezionato
 * 
 * @param {Number} idDitta
 * @param {Number} anno
 * @param {Number} mese
 *
 * @return Boolean
 * 
 * @properties={typeid:24,uuid:"F651E3BD-A405-4A14-824E-C7FD982CF8E5"}
 */
function haSquadratiDitta(idDitta,anno,mese)
{
	var dal = new Date(anno,mese-1,1);
	var al = new Date(anno,mese-1,globals.getTotGiorniMese(mese,anno));
	var _sqDittaQuery = 'SELECT * FROM F_Gio_Filtro_Squadrati(?,?,?)';
	var _sqDittaArr = [idDitta,dal,al];
	var dsSqDitta = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_sqDittaQuery,_sqDittaArr,-1);
	if(dsSqDitta.getMaxRowIndex() > 0) return true;
	return false;
}

/**
 * Aggiorna la visualizzazione delle anomalie timbrature per il dipendente
 * per il periodo selezionato
 * 
 * @param {Number} idLav id del dipendente
 * @param {Number} yy anno selezionato
 * @param {Number} MM mese selezionato
 * @param {Number} gg ultimo giorno del mese utilizzabile per il disegno delle anomalie (ultimo giorno in cui è avvenuto lo scarico delle timbrature)
 * @param {JSDataSet} [dsAnomaliePostConteggio]
 * @param {Boolean} [isEliminazione]
 * 
 * @properties={typeid:24,uuid:"90ADDC47-86C2-489F-8FEF-55B7AB9549AA"}
 */
function aggiornaAnomalieTimbratureDipendente(idLav,yy,MM,gg,dsAnomaliePostConteggio,isEliminazione)
{
	// se viene indicato il dataset delle anomalie è perchè uno dei giorni con anomalie del dipendente è stato riconteggiato 
	if(dsAnomaliePostConteggio)
	{
		// se non presenta più anomalie il dipendente deve essere tolto dal gruppo
		if(dsAnomaliePostConteggio.getMaxRowIndex() == 0)
		{
			globals.ma_utl_showInfoDialog('Il dipendente ' + globals.getNominativo(idLav) + ' non presenta più anomalie sulle timbrature','Anomalie timbrature');

			forms.giorn_timbr_mancanti_ditta.refreshAnomalieDitta(new JSEvent);
//		    var frmOri = forms.giorn_timbr_mancanti_ditta_tab;
//		    var frmContName = frmOri.controller.getName() + '_temp';
//		    var frmPanelNo = forms.giorn_timbr_mancanti_ditta.arrDipAnomalie.length;
//		    var i = 0;
//		    while(i < frmPanelNo && idLav != forms.giorn_timbr_mancanti_ditta.arrDipAnomalie[i])
//		    {
//		    	i++;
//		    }
//			if (i < frmPanelNo) 
//			{
//				for (var j = i; j < frmPanelNo; j++) {
//					var tabDip = 'tab_timbr_mancanti_ditta_tabpanel_' + forms.giorn_timbr_mancanti_ditta.arrDipAnomalie[j];
//					if (idLav == forms.giorn_timbr_mancanti_ditta.arrDipAnomalie[j])
//						forms[frmContName].elements[tabDip].setSize(0, 0);
//					else if(forms[frmContName].elements[tabDip])
//						forms[frmContName].elements[tabDip].setLocation
//						(
//							forms[frmContName].elements[tabDip].getLocationX(),
//							forms[frmContName].elements[tabDip].getLocationY() - forms[frmContName].elements[tabDip].getHeight()
//						);
//				}
//			}
		    
		}
		// altrimenti viene aggiornata la visualizzazione con le anomalie rimaste
		else
		{
			var _tabFormName = forms.giorn_timbr_mancanti_dipendente.controller.getName() + '_' + idLav;
		    forms[_tabFormName]['dsAnomalie'] = dsAnomaliePostConteggio;
			forms[_tabFormName].preparaAnomalieLavoratore(idLav,yy,MM,gg,_tabFormName,true,isEliminazione);
		}
			
	}
	// altrimenti viene solamente aggiornata la visualizzazione
	else
	{
	    var _tabFormName_ = forms.giorn_timbr_mancanti_dipendente.controller.getName() + '_' + idLav;
	    forms[_tabFormName_].preparaAnomalieLavoratore(idLav,yy,MM,gg,_tabFormName_,true,isEliminazione);
	}
}

/**
 * @param {Number} idLav
 * @param {Number} yy
 * @param {Number} MM
 * @param {JSDataSet} [dsSquadrature]
 *
 * @properties={typeid:24,uuid:"4FB3471F-ACC3-4812-859F-ACC851566F94"}
 */
function aggiornaSquadratureGiornalieraDipendente(idLav,yy,MM,dsSquadrature)
{
	
	if( dsSquadrature && dsSquadrature.getMaxRowIndex() == 0)
	{
		globals.ma_utl_showInfoDialog('Il dipendente ' + globals.getNominativo(idLav) + ' non presenta più squadrature in giornaliera','Squadrature giornaliera');
		forms.giorn_list_squadrati_ditta.preparaSquadratureDitta(globals.getDitta(idLav),
			                                                     yy,
															     MM,
																 forms.giorn_list_squadrati_ditta.limitaDal,
																 forms.giorn_list_squadrati_ditta.limitaAl);
	}
	else
	{
	    var _tabFormName = forms.giorn_list_squadrati_dipendente.controller.getName() + '_' + idLav;
 	    forms[_tabFormName].preparaSquadratureLavoratore(idLav,
 	    	                                             yy,
														 MM,
														 _tabFormName);
	}
}

/**
 * @param {Number} idLav
 * @param {Number} yy
 * @param {Number} MM
 * @param {JSDataSet} [dsSquadrature]
 *
 * @properties={typeid:24,uuid:"870E0A86-59A5-41AF-BDE6-7721325EC754"}
 */
function aggiornaEventiGiornalieraDipendente(idLav,yy,MM,dsSquadrature)
{
	
	if( dsSquadrature && dsSquadrature.getMaxRowIndex() == 0)
	{
		globals.ma_utl_showInfoDialog('Il dipendente ' + globals.getNominativo(idLav) + ' non soddisfa più i criteri di filtro','Eventi in giornaliera');
		forms.giorn_list_eventi_sel_ditta.preparaEventiDitta(globals.getDitta(idLav),
			                                                     yy,
															     MM,
																 forms.giorn_list_squadrati_ditta.limitaDal,
																 forms.giorn_list_squadrati_ditta.limitaAl);
	}
	else
	{
	    var _tabFormName = forms.giorn_list_squadrati_dipendente.controller.getName() + '_' + idLav;
 	    forms[_tabFormName].preparaSquadratureLavoratore(idLav,
 	    	                                             yy,
														 MM,
														 _tabFormName);
	}
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} idGiorn
 *
 * @return {Date}
 * 
 * @properties={typeid:24,uuid:"192BC467-7893-4C9F-A766-401D0B598813"}
 */
function getGiornoDaIdGiornaliera(idGiorn)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>} */
    var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
    if(_fs.find())
    {
    	_fs.idgiornaliera = idGiorn;
    	_fs.search();
    }
    return _fs.giorno;
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} idGiorn
 *
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"874EF145-BC27-4F02-A365-C1F6D8D12532"}
 */
function getIdLavoratoreDaIdGiornaliera(idGiorn)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>} */
    var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
    if(_fs.find())
    {
    	_fs.idgiornaliera = idGiorn;
    	_fs.search();
    }
    
    return _fs.iddip;
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} idGiorn
 *
 * @return {Object}
 * 
 * @properties={typeid:24,uuid:"1C97D7F0-E413-4F9C-99FC-E8C943B91839"}
 */
function getFasciaDaIdGiornaliera(idGiorn)
{
	/** @type {JSFoundset <db:/ma_presenze/e2giornaliera>} */
	var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fsGiorn.find())
	{
	   fsGiorn.idgiornaliera = idGiorn;
	   fsGiorn.search();
	}
	if(fsGiorn.idfasciaorariaforzata != null)
		return fsGiorn.idfasciaorariaforzata;
	else
		return fsGiorn.idfasciaorariaassegnata;
}

/**
 * Ottiene l'idgiornaliera per il lavoratore e il giorno richiesti
 * 
 * @param {Number} idLav
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"5C431BB2-96FF-4932-9883-CCB6F521A707"}
 * @AllowToRunInFind
 */
function getIdGiornalieraDaIdLavGiorno(idLav,giorno)
{
	/** @type {JSFoundset <db:/ma_presenze/e2giornaliera>} */
	var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fsGiorn.find())
	{
	   fsGiorn.iddip = idLav;
	   fsGiorn.giorno = giorno;
	   if(fsGiorn.search())
		   return fsGiorn.idgiornaliera;
	}
	
	return null;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Boolean} daEvadere
 * 
 * @properties={typeid:24,uuid:"6C509E79-8483-4D5D-B64A-BA2B37E16BEC"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function refreshElencoTimbrature(event,daEvadere)
{
	var frm = forms.giorn_elenco_richieste_timbr_situazione; 
	if(frm.validaParameters())
	{
	   frm.goToBrowseVisualizzaSituazione(event);
		
	   var frmFtr = forms.giorn_elenco_richieste_timbr;
	   var frmSit = forms.giorn_elenco_richieste_timbr_situazione;
	   var fs = frmFtr.foundset;
	               
       fs.find();
       
       if(daEvadere)
    	   fs.stato = '^';
       else
    	   fs.stato = '!^';

       if(frmSit.vChkPeriodo)
       {
          var dateDal = utils.dateFormat(frmSit.vDal,globals.ISO_DATEFORMAT);
	      var dateAl = utils.dateFormat(frmSit.vAl,globals.ISO_DATEFORMAT);
//          fs.lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giorno = dateDal + '...' + dateAl + '|yyyyMMdd';                                                                                                                                                                                                                          
       }
    	   
       if(frmSit.vChkDip)
       {
    	   fs.idlavoratore = frmSit.vIdDip;
       }
       if(frmSit.vChkSede)
       {
//    	   fs.lavoratori_giustificativitesta_to_lavoratori.iddittasede = frmSit.vIdSede;
       }
       if(frmSit.vChkCentroDiCosto)
       {
//    	   fs.lavoratori_giustificativitesta_to_lavoratori.lavoratori
       }
       
       fs.search();
       
       frmSit.elements.btn_refresh.enabled = false;
       frmSit.elements.btn_browse_visualizza_situazione.enabled = false;
	}
		
}

/**
 * @param {Number} idTimbratura
 *
 * @return Number
 *  
 * @properties={typeid:24,uuid:"CDAE60A3-2576-40A3-8017-25C63D9E7B34"}
 * @AllowToRunInFind
 */
function getIndirizzoTimbratura(idTimbratura)
{
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	
	if(fs.find())
	{
		fs.idtimbrature = idTimbratura;
		if(fs.search())
			return fs.indirizzo;
		else 
			return null;
	}
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Verifica che in seguito al cambio di fascia oraria il totale delle ore
 * del periodo sia conforme a quello iniziale
 * 
 * @param {JSFoundset} fs
 * @param {Number} [block]
 *
 * @properties={typeid:24,uuid:"DF946538-1C17-445E-A7D7-A4EC4D6986B1"}
 */
function verificaProgrammazioneTurniOrePeriodo(fs,block)
{
	var msgError = "";
	var frm = forms.giorn_prog_turni_fasce;
	var selRec = fs.getSelectedRecord();
	var size = fs.getSize();
	// variabili per verifica totale ore periodo teoriche
	var totOrePeriodoTeo = 0;
	// variabili per verifica totale ore periodo effettive del blocco considerato
	var totOrePeriodo = 0;
	
    var blocco = block || selRec['blocco'];
    
    // variabili per verifica turni riposo 
    var numRiposiPrimariTeorico = 0;
    var numRiposiSecondariTeorico = 0;
    var numRiposiPrimari = 0;
    var numRiposiSecondari = 0;
	    
    // calcolo del numero di ore totali teoriche e dei numeri di giorni di riposo (per tipo) definiti dalla regola  
    /** @type {JSFoundset<db:/ma_presenze/e2regolefasce>} */
    var fsRegoleFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.REGOLE_FASCE);
    if(fsRegoleFasce.find())
    {
    	fsRegoleFasce.idregole = selRec['idregole'];
    	if(fsRegoleFasce.search())
    	{
    		for(var r = 1; r <= fsRegoleFasce.getSize(); r++)
    		{
    			totOrePeriodoTeo += fsRegoleFasce.getRecord(r).e2regolefasce_to_e2fo_fasceorarie.totaleorefascia;
    			switch(fsRegoleFasce.getRecord(r).tiporiposo)
				{
					case 1 :
						numRiposiPrimariTeorico++;
						break;
					case 2 : 
						numRiposiSecondariTeorico++;
						break;
					default :
						break;
				}
    		}
    	}
    }
      
    // calcolo del numero di ore totali teoriche e dei numeri di giorni di riposo (per tipo) definiti dal blocco considerato 
    if(fs.find())
    {
    	fs['blocco'] = blocco;
    	var giorniBlocco = fs.search();
    	var totOrePeriodoNew = 0;
    	var arrGiorniConFasceRegoleSquadrate = [];
    	var scala = 1; // valore del rapporto per il calcolo del totale ore e dei riposi nel caso di un numero di righe
    	               // che non corrisponde alla periodicità del blocco
    	
    	for(var i = 1; i <= giorniBlocco; i++)
    	{
    		// verifica numero riposi primari e secondari presenti nel blocco
    		if(fs.getRecord(i)['tiporiposoprog'] == 1 || 
    		   fs.getRecord(i)['tiporiposoprog'] == null && fs.getRecord(i)['tiporiposo'] == 1)
    		   numRiposiPrimari++;
    		if(fs.getRecord(i)['tiporiposoprog'] == 2 || 
    		   fs.getRecord(i)['tiporiposoprog'] == null && fs.getRecord(i)['tiporiposo'] == 2)
     		   numRiposiSecondari++;
    		
    		// verifica numero ore totali del blocco
    		totOrePeriodoNew += fs.getRecord(i)['totaleorefascia'] != null ? parseInt(fs.getRecord(i)['totaleorefascia'],10) : 0;
    	
    		// controllo appartenenza fascia - regola
    		/** @type {JSFoundset<db:/ma_presenze/e2regolefasceammesse>}*/
    		var fsRegFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.REGOLE_FASCE_AMMESSE);
    		if(fsRegFasce.find())
    		{
    			fsRegFasce.idfasciaoraria = fs.getRecord(i)['idfasciaorariaprog'];
    			fsRegFasce.idregole = fs.getRecord(i)['idregole'];
    		
    			if(fsRegFasce.search() == 0)
    			   arrGiorniConFasceRegoleSquadrate.push(globals.dateFormat(fs.getRecord(i)['giorno'],globals.EU_DATEFORMAT));
    		}
    		
    		// aggiornamento valore
    		scala = (fs.getRecord(i)['riga'] - fs.getRecord(1)['riga'] + 1)  / fs.getRecord(i)['periodicita'];
    			
    	}   	
    	
    	// calcolo del totale ore e del numero di riposi riferito alle righe effettivamente visualizzate del blocco 
    	totOrePeriodo = totOrePeriodoTeo * scala;
    	numRiposiPrimariTeorico = numRiposiPrimariTeorico * scala;
    	numRiposiSecondariTeorico = numRiposiSecondariTeorico * scala;
    	
    	// ricarichiamo i record del foundset dopo il find() precedente
    	fs.loadRecords();
    	    	
    	// se il numero delle ore programmate per il blocco non coincide con il valore standard
    	// o il numero dei riposi primari e secondari è in numero maggiore di 1 il blocco risulta squadrato
    	var isError = false;
    	if(arrGiorniConFasceRegoleSquadrate.length > 0)
		{
			var str = arrGiorniConFasceRegoleSquadrate.join(" , ");
			isError = true;
			if(msgError.length == 0)
			   msgError += ("Nei giorni " + str + " la fascia oraria non appartiene alla regola attiva");
		}
    	
		if(numRiposiPrimari > numRiposiPrimariTeorico)
		{
			isError = true;
			msgError += "Non è possibile associare più di " + (numRiposiPrimariTeorico > 1 ? (numRiposiPrimariTeorico + "riposi primari") : "un riposo primario") + " nel blocco";
		}
		
		if(numRiposiSecondari > numRiposiSecondariTeorico)
		{
			isError = true;
			msgError += "Non è possibile associare più di " + (numRiposiSecondariTeorico > 1 ? (numRiposiSecondariTeorico + "riposi secondari") : "un riposo secondario") + " nel blocco";
		}
		
		if(numRiposiPrimari != numRiposiPrimariTeorico)
    	{
    		isError = true;
    		if(msgError.length == 0)
    		   msgError += "Verificare il numero di riposi primari";
    	}
		
//    	if(numRiposiSecondari != numRiposiSecondariTeorico)
//		{
//			isError = true;
//			if(msgError.length == 0)
//    		   msgError += "Verificare il numero di riposi secondari";
//		}
    	
    	if(totOrePeriodo != totOrePeriodoNew)
    	{
    		isError = true;
    		if(msgError.length == 0)
     		   msgError += ("Ore programmate : " + totOrePeriodoNew / 100 + " ; ore teoriche : " + totOrePeriodo / 100);
    	}
    			    	
		if(isError)
		{
    		if(frm.arrBlocchiSquadrati.indexOf(blocco) == -1)
    		   frm.arrBlocchiSquadrati.push(blocco);
    		    		  
    		forms.giorn_prog_turni_fasce.elements.btn_salva.enabled = false;
    		forms.giorn_prog_turni_fasce.elements.btn_annulla.enabled = true;
    		
    		forms.giorn_prog_turni_fasce.setStatusWarning(msgError);
    	}
    	else
    	{
    		var tempArr = [];
    		for (var b = 0; b < frm.arrBlocchiSquadrati.length; b++)
    		{
    			if(frm.arrBlocchiSquadrati[b] != blocco)
    			   tempArr.push(frm.arrBlocchiSquadrati[b]);
    		}
    		frm.arrBlocchiSquadrati = tempArr;
    		    	
    		forms.giorn_prog_turni_fasce.elements.btn_salva.enabled = true;
    		forms.giorn_prog_turni_fasce.elements.btn_annulla.enabled = true;
    		
    		forms.giorn_prog_turni_fasce.setStatusNeutral("");
    	}
		
    	// ciclo per l'aggiornamento delle anomalie sul blocco considerato
    	for(var l = 1; l <= size; l++)
		{
			if(fs.getRecord(l) && fs.getRecord(l)['blocco'] == blocco)
				fs.getRecord(l)['anomalia'] = (isError ? 1 : 0);
		}
    	
    }
        
}

/**
 * Aggiorna la visualizzazione della form evidenziando in rosso eventuali blocchi 
 * squadrati ed inibendo il pulsante per il salvataggio
 * 
 * @properties={typeid:24,uuid:"919D358C-B30E-4B88-A4A1-3D54CF93E871"}
 */
function aggiornaFasceProgrammazioneTurni()
{
	// definizione blocchi esistenti
	var frm = forms['giorn_regolafasciaperiodo_draw_temp_turni'];
	var numBlocchi = frm.elements.length;
	var blocchiSquadrati = forms.giorn_prog_turni_fasce.arrBlocchiSquadrati;
	
	// gestione pulsanti salvataggio / annullamento programmazione fasce orarie
	if(blocchiSquadrati.length > 0)
	{
		forms.giorn_prog_turni_fasce.elements.btn_salva.enabled = false;
		forms.giorn_prog_turni_fasce.elements.btn_annulla.enabled = true;
	}
	else
	{
		forms.giorn_prog_turni_fasce.elements.btn_salva.enabled = true;
		forms.giorn_prog_turni_fasce.elements.btn_annulla.enabled = true;
	}
	
	// colorazione in rosso del blocco squadrato
	for(var i = 1; i < numBlocchi; i++) 
	{
		if(blocchiSquadrati.indexOf(i) != -1)
		   frm.elements['lbl_regolafascia_' + i].bgcolor = 'red';
		else
		   frm.elements['lbl_regolafascia_' + i].bgcolor = '#434343';
		
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"3D9A995D-7BA0-43EF-9ABA-D53EDE1960C1"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function salvaFasceProgrammate(event) 
{
	var _params = {
        processFunction: process_salva_prog_fasce,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: []
    };
	plugins.busy.block(_params);
}

/**
 * @properties={typeid:24,uuid:"A1BDFC0B-9F6C-4BC6-902F-1779AEE1FB0E"}
 * @SuppressWarnings(unused)
 */
function process_salva_prog_fasce()
{
	try
	{
		/** @type {RuntimeForm<giorn_turni>}*/
		var frm = forms['giorn_turni_temp']; 
		var fs = frm.foundset.duplicateFoundSet();
		/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
		var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
		
		var idLavoratore = forms.giorn_prog_turni_fasce.vIdLavoratore || globals.getIdLavoratoreProgTurni();
		
		// ottenimento dei dati relativi ai giorni modificati
		var dsGiorniModificati = databaseManager.createEmptyDataSet(0,['giorno','idfascia','tiporiposo']);
		for(var g = 1; g <= fs.getSize(); g++)
		{		
			var cont = 1;
			if(fs.getRecord(g)['modificato'])
			{
				dsGiorniModificati.addRow(new Array(utils.dateFormat(fs.getRecord(g)['giorno'],globals.ISO_DATEFORMAT),
	                                                fs.getRecord(g)['giorno'],
					                                fs.getRecord(g)['idfasciaorariaprog'] != null ? fs.getRecord(g)['idfasciaorariaprog'] : fs.getRecord(g)['idfasciaoraria'],
	                                                fs.getRecord(g)['tiporiposoprog'] != null ? fs.getRecord(g)['tiporiposoprog'] : fs.getRecord(g)['tiporiposo']));
			   cont++;
			}
		}
		
		var numGiorniModificati = dsGiorniModificati.getMaxRowIndex(); 
		if(numGiorniModificati > 0)
		{
			// eliminazione di eventuali fasce programmate precedentemente inserite per il dipendente nei giorni modificati
			var sqlProgfasce = "DELETE FROM E2GiornalieraProgFasce WHERE idDip = ? AND Giorno IN (" + 
			                   dsGiorniModificati.getColumnAsArray(1).map(function(pf){return '\'' + pf + '\''}).join(',') + ")";
			var success = plugins.rawSQL.executeSQL(globals.Server.MA_PRESENZE,
				                                   globals.Table.GIORNALIERA_PROGFASCE,
												   sqlProgfasce,
												   [idLavoratore]);
			if(!success)
			{
				application.output(plugins.rawSQL.getException().getMessage(), LOGGINGLEVEL.ERROR);
				throw new Error('Errore durante la cancellazione delle fasce esistenti');
			}
			plugins.rawSQL.flushAllClientsCache(globals.Server.MA_PRESENZE,
				                                globals.Table.GIORNALIERA_PROGFASCE);
			// inserimento delle nuove fasce programmate
			databaseManager.startTransaction();
			
			for(var i = 1; i <= numGiorniModificati; i++)
			{
				if(fsFasceProg.newRecord())
				{
					fsFasceProg.iddip = idLavoratore;
					fsFasceProg.giorno = dsGiorniModificati.getValue(i,2);
					fsFasceProg.idfasciaoraria = dsGiorniModificati.getValue(i,3);
					fsFasceProg.tiporiposo = dsGiorniModificati.getValue(i,4);
										
				}
			}
				
			if(!databaseManager.commitTransaction())
				throw new Error('Errore durante l\'inserimento della programmazione fasce');
			else
			{
				forms.giorn_prog_turni_fasce.isEditing = false;
				forms.giorn_prog_turni_fasce.elements.btn_salva.enabled = false;
				forms.giorn_prog_turni_fasce.setStatusSuccess('Salvataggio fasce avvenuto correttamente!');
				
				// TODO verificare variabile forms.giorn_prog_turni_fasce.isFromSituazioneTurni per determinare il tipo di ridisegno
				globals.preparaProgrammazioneTurni(idLavoratore,
												   forms.giorn_prog_turni_fasce.vAnno || globals.getAnno(),
												   forms.giorn_prog_turni_fasce.vMese || globals.getMese(),
												   globals.TipoGiornaliera.NORMALE);
			}    
		}
	}
	catch(ex)
	{
		forms.giorn_prog_turni_fasce.setStatusError(ex.message);
		databaseManager.rollbackTransaction();
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} idFascia
 *
 * @properties={typeid:24,uuid:"A820A88F-528B-4B2E-90B7-09F8ED134230"}
 */
function getTotaleOreFascia(idFascia)
{
	/** @type {JSFoundset <db:/ma_presenze/e2fo_fasceorarie>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE);
	if(fs.find())
	{
		fs.idfasciaoraria = idFascia;
		if(fs.search())
			return fs.totaleorefascia;
	}
	return null;
}

/**
 * @param {Number} idTimbratura
 *
 * @return String
 *  
 * @properties={typeid:24,uuid:"CBD0963A-0A31-4300-BC76-D1EBA91C9B2A"}
 * @AllowToRunInFind
 */
function getTooltipTimbratura(idTimbratura)
{
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	
	if(fs.find())
	{
		fs.idtimbrature = idTimbratura;
		if(fs.search())
			return fs.indirizzo;
		else 
			return null;
	}
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * // TODO generated, please specify type and doc for the params
 * @param {Object} giorno
 *
 * @properties={typeid:24,uuid:"01DC50A0-2FEE-486C-A8CA-FECE1D990861"}
 */
function getTooltipGiorno(giorno)
{
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	
	if(fs.find())
	{
		fs.giorno = giorno;
		if(fs.search())
			return fs.timbrature_servizio;
		else 
			return null;
	}
	return null;
}

/**
 * @param {JSEvent} event
 * @param {Number} giorno
 *
 * @properties={typeid:24,uuid:"476190AB-FB96-4CF7-A9D3-F7F1C6D16BBD"}
 */
function ottieniTimbratureGiorno(event,giorno)
{
	var includiManuali = globals.ma_utl_showYesNoQuestion('Ripristinare eventuali timbrature originali eliminate o modificate manualmente?', 'Ripristina timbrature');
	if (includiManuali)
	{
		var giorniSelezionati = globals.getGiorniSelezionatiTimbr();
			giorniSelezionati = giorniSelezionati.length > 0 && giorniSelezionati || [giorno];
		var url = globals.WS_URL + '/Timbrature/Ripristina'
		var params =
		{
			idditta				:	forms.giorn_header.idditta,
			periodo				:	globals.getPeriodo(),
			giorniselezionati	:	giorniSelezionati,
			iddipendenti		:	[forms.giorn_header.idlavoratore],
			includimanuali		:	includiManuali
		};
		
		var response = globals.getWebServiceResponse(url, params);
		return response['returnValue'];
	}
	return false;
}


/**
 * @param {JSEvent} event
 * @param {Number} idLavoratore
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"476D7D82-570D-4F7A-A915-8489A1231B08"}
 */
function ottieniTimbratureMancantiGiorno(event,idLavoratore,giorno)
{
	var includiManuali = false;
	
	// verifica proseguimento richiesta
	var answer = true;
	if (answer)
	{
		// richiesta tipologie timbrature da recuperare
		includiManuali = true;
		
		var giorniSelezionati = [giorno.getDate()];
		var url = globals.WS_URL + '/Timbrature/Ripristina'
		var params =
		{
			idditta				:	globals.getDitta(idLavoratore),
			periodo				:	giorno.getFullYear() * 100 + giorno.getMonth() + 1,
			giorniselezionati	:	giorniSelezionati,
			iddipendenti		:	[idLavoratore],
			includimanuali		:	includiManuali
		};
		
		var response = globals.getWebServiceResponse(url, params);
		return response['returnValue'];
	}
	
	return false;
}

/**
 * Ottieni la data in cui è avvenuta l'ultima importazione delle timbrature
 *
 * @param {Array<Number>} idditte
 *
 * @return Date
 * 
 * @properties={typeid:24,uuid:"B9CFFBF6-DE4C-43D0-B2FB-6AC3B5EA6A71"}
 * @AllowToRunInFind
 */
function getDataUltimoScarico(idditte)
{
	/** @type {JSFoundset<db:/ma_presenze/e2wk_attivitaeseguiteditta>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.ATTIVITA_DITTA);
	
	if(fs.find())
	{
		fs.idditta = idditte;
		fs.e2wk_attivitaeseguiteditta_to_e2wk_tabattivita.codice = globals.AttivitaDitta.IMPORTAZIONE_TIMBRATURE;
		
		if(fs.search() > 0)
		{
		   fs.sort('ultimaesecuzioneil desc');
		   return fs.ultimaesecuzioneil;
		}
		else
			return null;
	}
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Aggiorna le informazioni aggiuntive del giorno selezionato in giornaliera
 * 
 * @param {Number} idGiornaliera
 *
 * @properties={typeid:24,uuid:"B2812FD4-FF6E-4DB2-A830-19D4AD304E04"}
 */
function aggiornaGiornoTimbrature(idGiornaliera)
{
	var giornalieraFs = forms.giorn_mostra_timbr.foundset;
	
	// aggiornamento timbrature
	if(giornalieraFs.e2giornaliera_to_e2timbratura 
	   && giornalieraFs.e2giornaliera_to_e2timbratura.find())
    {
       giornalieraFs.e2giornaliera_to_e2timbratura.timbeliminata = 0;
       giornalieraFs.e2giornaliera_to_e2timbratura.search();

       forms.giorn_vista_mensile_timbr_tbl.foundset.sort('timbratura asc'); //forziamo il sort per ordinare eventuali timbrature inserite manualmente
    }
    // aggiornamento timbrature causalizzate
//    if(giornalieraFs.e2giornaliera_to_e2timbratureservizio)
//       forms.giorn_mostra_timbr_t_caus_tbl.foundset.loadRecords(giornalieraFs.e2giornaliera_to_e2timbratureservizio);

    // aggiornamento eventuale fascia forzata
//    if(giornalieraFs.idfasciaorariaforzata != null)
//	{	
//	   forms.giorn_mostra_timbr_fascia_forzata._codiceFascia = giornalieraFs.e2giornaliera_to_e2fo_fasceorarie_forzata.codicefascia;
//	   forms.giorn_mostra_timbr_fascia_forzata._descrFascia = giornalieraFs.e2giornaliera_to_e2fo_fasceorarie_forzata.descrizione_fascia;
//	}
//	else
//	{
//		forms.giorn_mostra_timbr_fascia_forzata._codiceFascia = '';
//		forms.giorn_mostra_timbr_fascia_forzata._descrFascia = '';
//	}
    
	forms.giorn_mostra_timbr_fascia_forzata_dtl._idGiornalieraFascia = giornalieraFs.idgiornaliera;

	// aggiornamento badge effettivo del giorno
	if(giornalieraFs.e2giornaliera_to_e2timbratura)
	{
	    if(giornalieraFs.e2giornaliera_to_e2timbratura.nr_badge != null)
	    {
	    	forms.giorn_header._vNrBadge = 
	    	forms.giorn_cart_header._vNrBadge = giornalieraFs.e2giornaliera_to_e2timbratura.nr_badge;
	    }
	    else
	    {
	        forms.giorn_header._vNrBadge = 
	        forms.giorn_cart_header._vNrBadge = globals.getNrBadge(giornalieraFs.e2giornaliera_to_lavoratori.idlavoratore, giornalieraFs.giorno);
	    }
	}
}

/**
 * @param {Number} idGiornaliera
 * @properties={typeid:24,uuid:"8723A1CC-6975-4F6A-8DD2-FF5E4421B73A"}
 * @AllowToRunInFind
 */
function aggiornaEventiETimbratureNelGiorno(idGiornaliera)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>} */
	var giornalieraFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA);
	if(giornalieraFs && giornalieraFs.find())
	{
		giornalieraFs.idgiornaliera = idGiornaliera;
		giornalieraFs.search();
	}
	
	forms.giorn_vista_mensile_eventi_tbl.foundset.loadRecords(giornalieraFs.e2giornaliera_to_e2giornalieraeventi);
	
	if(giornalieraFs.e2giornaliera_to_e2timbratura 
			&& giornalieraFs.e2giornaliera_to_e2timbratura.find())
	{
		giornalieraFs.e2giornaliera_to_e2timbratura.timbeliminata = 0;
		giornalieraFs.e2giornaliera_to_e2timbratura.search();
	
		forms.giorn_vista_mensile_timbr_tbl.foundset.loadRecords(giornalieraFs.e2giornaliera_to_e2timbratura);
		forms.giorn_vista_mensile_timbr_tbl.foundset.sort('timbratura asc'); //forziamo il sort per ordinare eventuali timbrature inserite manualmente
	}
	
	if(giornalieraFs.e2giornaliera_to_e2timbratureservizio &&
			giornalieraFs.e2giornaliera_to_e2timbratureservizio)
		forms.giorn_mostra_timbr_t_caus_tbl.foundset.loadRecords(giornalieraFs.e2giornaliera_to_e2timbratureservizio);
	    
    // aggiornamento badge effettivo del giorno
    if(giornalieraFs.e2giornaliera_to_e2timbratura.nr_badge != null)
	   forms.giorn_header._vNrBadge = 
		   forms.giorn_cart_header._vNrBadge = 
			   giornalieraFs.e2giornaliera_to_e2timbratura.nr_badge;
    else
    {
        forms.giorn_header._vNrBadge = 
        	forms.giorn_cart_header._vNrBadge = globals.getNrBadge(giornalieraFs.e2giornaliera_to_lavoratori.idlavoratore,
        		                                                   giornalieraFs.giorno);
    }   
    
    forms.giorn_mostra_timbr_fascia_forzata_dtl._idGiornalieraFascia = giornalieraFs.idgiornaliera;
	
}

/**
 * Aggiorna gli eventi visualizzati nella tabella a lato per tenere conto delle possibili
 * modifiche avvenute all'esterno di Servoy 
 * (ad esempio la modifica di un evento dovuta all'utilizzo della libreria COM)
 * 
 * @AllowToRunInFind
 * 
 * @param {Number} idLav
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"76B32D86-629B-473D-B0B5-8670BD30CA34"}
 */
function aggiornaEventiGiornaliera(idLav,dal,al)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>} */
	var giornalieraFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA);
	if(giornalieraFs && giornalieraFs.find())
	{
		giornalieraFs.iddip = idLav;
		giornalieraFs.giorno = utils.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' +  utils.dateFormat(al,globals.ISO_DATEFORMAT) + '|yyyyMMdd'
		giornalieraFs.search();
	}
	
	databaseManager.refreshRecordFromDatabase(giornalieraFs.e2giornaliera_to_e2giornalieraeventi,-1);
}

/**
 * Costruisce graficamente le fasce orarie della giornaliera del dipendente
 * 
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Number} _idDip
 * @param {String} _primoGiorno
 * @param {String} _ultimoGiorno
 * @param {Number} offsetFasce
 * @param {Boolean} [daPannello]
 * 
 * @properties={typeid:24,uuid:"2F9B6D43-3FEF-4C28-974B-094ECEBB3382"}
 * @SuppressWarnings(unused)
 */
function preparaRegoleFasce(_anno,_mese,_idDip,_primoGiorno,_ultimoGiorno,offsetFasce,daPannello)
{	
    var height = 15;
    
	var _regQuery = "SELECT Giorno \
						   , CodiceRegola \
						   , TotaleOrePeriodo \
						   , RigaTeorica AS Riga \
						   , DescrizioneRegola FROM [dbo].[F_Lav_RegolaPeriodo](?,?,?) ORDER BY Giorno";
	// nome delle forms (originale e clone) della regola/fascia
	var _regOriFormName = 'giorn_regolafasciaperiodo_draw'		
	var _regFormName = _regOriFormName + '_temp';
	var _arrPars = [_idDip,utils.parseDate(_primoGiorno,globals.EU_DATEFORMAT),utils.parseDate(_ultimoGiorno,globals.EU_DATEFORMAT)]
    var _numGGMese = globals.getTotGiorniMese(_mese,_anno);
	var _numGGConFasce = 0;
	var _offset  = offsetFasce; 

	//recuperiamo i dati sulle regole del mese per costruire il riepilogo visivo nella parte sx della vista
	var _regDataSetRegoleFasce;
	if(daPannello)
	   forms.giorn_vista_mensile_pannello.elements.tab_vista_regolafascia.removeAllTabs();
	else
		forms.giorn_vista_mensile.elements.tab_vista_regolafascia.removeAllTabs();
	
	_regDataSetRegoleFasce = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,_regQuery,_arrPars,500);
		
    _numGGConFasce = _regDataSetRegoleFasce.getMaxRowIndex();
    
    if (forms[_regFormName] != null){
        history.removeForm(_regFormName);
        solutionModel.removeForm(_regFormName);
    }
    var _regTempForm = solutionModel.cloneForm(_regFormName,solutionModel.getForm(_regOriFormName));
        
    if(_numGGConFasce == 0)
    {
    	_regTempForm.getLabel('lbl_bg').height = (_numGGMese + globals.offsetGg) * height;
    	forms.giorn_vista_mensile.elements.tab_vista_regolafascia.addTab(_regFormName,'','Regola fascia periodo','tooltip');
    	return;
    }
    	
	/** @type {Number} */
	var _riga, _rectX, _rectY, _rectPosX, _rectPosY, _offsetPrimoGGRegola;
	
	/** @type {Array<Number>} */ 
	var arrRegole = [];
	
	/** @type {Array<{codiceregola : String, descrizioneregola : String, indexstart : Number, indexend : Number}>} */
	var arrRegoleFasi = [];
	
	var objRegolaFase = null;
	var _currFase = 1;
	var _index = 1;
	for(var rg = 1; rg <= _numGGConFasce; rg++)
	{	
		var _codRegola = _regDataSetRegoleFasce.getValue(rg,2);
		var _descRegola = _regDataSetRegoleFasce.getValue(rg,5);
		var _currRiga = _regDataSetRegoleFasce.getValue(rg,4);
		
		if(!(_codRegola == _regDataSetRegoleFasce.getValue(rg + 1,2) && _currRiga != 1))
		{
			objRegolaFase = {
				codiceregola : _codRegola,
				descrizioneregola : _descRegola,
				indexstart : _index,
				indexend : (rg == _numGGConFasce) ? rg + 1 : rg
			}
			if(arrRegoleFasi.indexOf(objRegolaFase) == -1)
			{
				arrRegoleFasi.push(objRegolaFase);
				_index = objRegolaFase.indexend + 1;
			}
		}
		
	}
	
	solutionModel.getForm(_regFormName).getBodyPart().height = (_numGGConFasce + _offset) * height;
	solutionModel.getForm(_regFormName).getLabel('lbl_bg').height = (_numGGMese + globals.offsetGg) * height;
	
    //larghezza area tab regolefasce
    _rectX = 40;
	_rectPosX = 0;
	_rectPosY = _offset * height;
	
	//contatore iterazioni su diverse fasce
	var _cont = 1;
	var i = 1;
    
	for(var r = 0; r < arrRegoleFasi.length; r++)
	{
		var _rectElems;
		/** @type {JSLabel} */
		var _currLbl;
		
		objRegolaFase = arrRegoleFasi[r];
		_rectElems = r == 0 ? (objRegolaFase.indexend - objRegolaFase.indexstart) : (objRegolaFase.indexend - objRegolaFase.indexstart + 1); 
		
		_rectY = height * _rectElems; 
		_currLbl = solutionModel.getForm(_regFormName).newLabel('lbl_blocco_' + _cont,_rectPosX,_rectPosY,_rectX,_rectY);
		_currLbl.text = objRegolaFase.codiceregola + ' ' + (r + 1);
		_currLbl.background = '#434343';
		_currLbl.foreground = 'white';
	    _currLbl.anchors = SM_ANCHOR.NORTH;
		_currLbl.name = 'lbl_regolafascia_' + _cont.toString();
		_currLbl.toolTipText = objRegolaFase.codiceregola + ' - '+ objRegolaFase.descrizioneregola;
		_currLbl.horizontalAlignment = SM_ALIGNMENT.CENTER;
		_currLbl.verticalAlignment = _rectY == height ? SM_ALIGNMENT.TOP : SM_ALIGNMENT.CENTER;
		_currLbl.borderType = _rectY == height ? solutionModel.createMatteBorder(0,0,0,0,"#000000") : solutionModel.createMatteBorder(0,0,1,0,'#000000');
		_currLbl.visible = true;
		_currLbl.transparent = false;
		_currLbl.onAction = solutionModel.getForm(_regFormName).newMethod("\
		    function selezionaGiorniDaFascia_" + r.toString() + "(event){	\
		       globals.setGiorniSelezionatiDaFascia(" + (objRegolaFase.indexstart - 1) +"," + (objRegolaFase.indexend)+ ");\
		    }\
		");
		
		_rectPosY = _rectPosY + _rectY;
	}
		
	if(daPannello)
		forms.giorn_vista_mensile_pannello.elements.tab_vista_regolafascia.addTab(_regFormName,'','Regola fascia periodo','tooltip',null,'#000000', '#BBCCEE',1);
	else
		forms.giorn_vista_mensile.elements.tab_vista_regolafascia.addTab(_regFormName,'','Regola fascia periodo','tooltip',null,'#000000', '#BBCCEE',1);

} 

/**
 * Verifica se la ditta ha regole che ammettono distribuzione
 * 
 * @param {Number} _idDitta
 *
 * @properties={typeid:24,uuid:"46A3473B-325C-48C1-A7C7-3BB27EB3D12C"}
 */
function verificaProgrammazioneTurniDitta(_idDitta)
{
	var sqlProgTurniDitta = "SELECT	COUNT(*) AS NumRec FROM	E2Regole R \
	                        WHERE R.AmmetteDistribuzione = 1 AND idDitta = ?";
	var dsProgTurniDitta = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlProgTurniDitta,[_idDitta],-1);
    
	return dsProgTurniDitta.getValue(1,1);
}

/**
 * Verifica se il dipendente ha regole che ammettano la distribuzione di orario
 * 
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"FD768E7E-AEE7-4E57-BCD5-767F807E67C1"}
 */
function verificaProgrammazioneTurniDip(idDip,dal,al)
{
	var sqlProgDip = "SELECT * FROM dbo.F_Dec_Lav_PeriodoTipo(?,?,?,3) Deco \
	                 INNER JOIN E2Regole R ON Deco.Valore = R.idRegole \
	                 WHERE R.AmmetteDistribuzione = 1";
	var arrProgDip = [idDip,dal,al];
	var dsProgDip = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlProgDip,arrProgDip,-1);
	
	return dsProgDip.getMaxRowIndex();

}

/**
 * Disegna la griglia con la programmazione turni del dipendente selezionato
 * per il periodo indicato
 * 
 * @param {Number} _idDip
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {String} _tipoGiorn
 * 
 * @properties={typeid:24,uuid:"8871EE76-0573-4A48-9224-E4C630844FD6"}
 *
 * @AllowToRunInFind
 */
function preparaProgrammazioneTurni(_idDip, _anno, _mese, _tipoGiorn)
{
	// verifichiamo se il dipendente ha regole che permettano la distribuzione dell'orario
	if(!globals.verificaProgrammazioneTurniDip(_idDip,
		                               		   globals.getFirstDatePeriodo(_anno * 100 + _mese),
									           globals.getLastDatePeriodo(_anno * 100 + _mese)))
	{
		forms.giorn_prog_turni_fasce.elements.tab_prog_turni_turni.removeAllTabs();
		
		if(history.removeForm('giorn_turni_temp'))
			solutionModel.removeForm('giorn_turni_temp');
			
		forms.giorn_prog_turni_fasce.setStatusWarning('Il dipendente non ha associato regole che permettano la distribuzione di orario');
		forms.giorn_prog_turni.elements.fld_search.readOnly = false;
		return;
	}
	
	forms.giorn_prog_turni_fasce.setStatusNeutral();
	
	// impostiamo i parametri necessari
	var params = globals.inizializzaParametriAttivaMese(globals.getDitta(_idDip),
		                                                _anno * 100 + _mese,
														globals.getGruppoInstallazioneDitta(globals.getDitta(_idDip)),
														'',
														globals._tipoConnessione,
														_idDip
														);
	
	// otteniamo la risposta contenente la stringa per la query
	var objResponse = globals.getFiltroProgrammazioneTurni(params);
	
	// se abbiamo ottenuto una risposta con una stringa per la query non vuota
	if (objResponse 
			&& objResponse['ftrString']
			&& objResponse['ftrString'] != '')
	{
		var dsProgTurni = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, objResponse['ftrString'], [], -1);
		var blocco = 0;
		
		// costruzione tabella programmazione in maniera da poterla esporre
		var arrCurrMese = new Array(dsProgTurni.getMaxRowIndex());

		for(var i = 0; i < dsProgTurni.getMaxRowIndex(); i++)
		{
			arrCurrMese[i] = [];
					
			// idRegole
			arrCurrMese[i][0] = dsProgTurni.getValue(i + 1,1);
			// Giorno mese
			arrCurrMese[i][1] = globals.getNumGiorno(dsProgTurni.getValue(i + 1,2));
		    // Nome giorno
			arrCurrMese[i][2] = globals.getNomeGiorno(dsProgTurni.getValue(i + 1,2));
			// Codice regola
			arrCurrMese[i][3] = dsProgTurni.getValue(i + 1,3);
			// Descrizione regola
			arrCurrMese[i][4] = dsProgTurni.getValue(i + 1,4);
			// Totale ore periodo
			arrCurrMese[i][5] = dsProgTurni.getValue(i + 1,5);
			// Riga 
			arrCurrMese[i][6] = dsProgTurni.getValue(i + 1,6);
			// gestione blocco fasce orarie
			if(i == 0                                                        // prima riga
			   || arrCurrMese[i][6] == 1                                     // cambio riga per superamento valore di periodicità
			   || (i > 0 && arrCurrMese[i][0] != arrCurrMese[i - 1][0]))     // cambio regola 
				blocco++;
			// Periodicità
			arrCurrMese[i][7] = dsProgTurni.getValue(i + 1,7);
			// Tipo di riposo
			arrCurrMese[i][8] = dsProgTurni.getValue(i + 1,8);
			// Codice fascia
			arrCurrMese[i][9] = dsProgTurni.getValue(i + 1,9);
			// Descrizione fascia
			arrCurrMese[i][10] = dsProgTurni.getValue(i + 1,10);
			// IdFasciaOraria
			arrCurrMese[i][12] = dsProgTurni.getValue(i + 1,12);
			// IdFasciaOrariaProgrammata
			arrCurrMese[i][13] = dsProgTurni.getValue(i + 1,13);
			// Totale ore fascia (recuperare il totale delle ore della fascia guardando se ha già una programmata)
			if(arrCurrMese[i][13])			
			   arrCurrMese[i][11] = globals.getTotaleOreFascia(arrCurrMese[i][13]);
			else
			   arrCurrMese[i][11] = globals.getTotaleOreFascia(arrCurrMese[i][12]);
			// Tipo di riposo programmato
			arrCurrMese[i][14] = dsProgTurni.getValue(i + 1,14);
			// idFasciaOrariaAttiva (per riassunto descrizione automatico)
			arrCurrMese[i][15] = dsProgTurni.getValue(i + 1,13) ? dsProgTurni.getValue(i + 1,13) : dsProgTurni.getValue(i + 1,12);
			// Modificato
            arrCurrMese[i][16] = 0;                     
		    // Indice del blocco
            arrCurrMese[i][17] = blocco;
            // Tipo di riposo visualizzato (programmato se c'è altrimenti normale)
			arrCurrMese[i][18] = arrCurrMese[i][14] != null ? arrCurrMese[i][14] : arrCurrMese[i][8];
             // Giorno
			arrCurrMese[i][19] = dsProgTurni.getValue(i + 1,2);
		    // Blocco,riga
			arrCurrMese[i][20] = blocco + '_' +  dsProgTurni.getValue(i + 1,6);
			// Anomalia blocco programmazione turni
			arrCurrMese[i][21] = 0;
			// Giorno formattato
			arrCurrMese[i][22] = globals.dateFormat(dsProgTurni.getValue(i + 1,2),globals.EU_DATEFORMAT);
			// Totale ore fascia formattato
			arrCurrMese[i][23] = (arrCurrMese[i][11] / 100).toFixed(2);
			// Totale ore periodo formattato
			arrCurrMese[i][24] = (arrCurrMese[i][5] / 100).toFixed(0);
		}
		
		var cols = ['IdRegole'
			, 'GiornoMese'
			, 'NomeGiorno'
			, 'CodiceRegola'
			, 'DescrizioneRegola'
			, 'TotaleOrePeriodo'
			, 'Riga'
			, 'Periodicita'
			, 'TipoRiposo'
			, 'CodiceFascia'
			, 'Descrizione'
			, 'TotaleOreFascia'
			, 'idFasciaOraria'
			, 'idFasciaOrariaProg'
			, 'TipoRiposoProg'
			, 'idFasciaOrariaAttiva'
			, 'Modificato'
			, 'Blocco'
			, 'TipoRiposoVisualizzato'
			, 'Giorno'
			, 'BloccoRiga'
			, 'Anomalia'
			, 'GiornoFormattato'
			, 'TotaleOreFasciaFormattato'
			, 'TotaleOrePeriodoFormattato'];

		var types = [JSColumn.NUMBER
			, JSColumn.TEXT
			, JSColumn.TEXT
			, JSColumn.TEXT
			, JSColumn.TEXT
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.TEXT
			, JSColumn.TEXT
			, JSColumn.TEXT
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.NUMBER
			, JSColumn.DATETIME
			, JSColumn.TEXT
			, JSColumn.NUMBER
			, JSColumn.TEXT
			, JSColumn.TEXT
			, JSColumn.TEXT];

		var _tDataSetProgTurniList = databaseManager.createEmptyDataSet(0, cols);
		for (var ar = 0; ar < arrCurrMese.length; ar++)
			_tDataSetProgTurniList.addRow(ar + 1, arrCurrMese[ar].map(function(item) {
					return item; 
				}));

		var _tDataSourceProgTurni = _tDataSetProgTurniList.createDataSource('_tDataSourceProgTurni', types);
		
		// Disegna la programmazione dei turni
		disegnaProgrammazioneTurni(_tDataSourceProgTurni);
    
	}	
	
	return;
}

/**
*
* Disegna la tabella per la programmazione dei turni
* 
* @param {String} _dataSource
* 
* @properties={typeid:24,uuid:"93A42B5C-D0E1-4DFA-BE7C-1FFE28F0C141"}
* @SuppressWarnings(unused)
 */
function disegnaProgrammazioneTurni(_dataSource) 
{
	var _oriFormName = 'giorn_turni';
	var _tempFormName = _oriFormName + '_temp';
		
	if (!forms[_tempFormName])
	{
		// Eliminiamo il tab panel esistente e rimuoviamo eventuali form omonime già esistenti
		forms.giorn_prog_turni_fasce.elements.tab_prog_turni_turni.removeAllTabs();

		if (history.removeForm(_tempFormName))
			solutionModel.removeForm(_tempFormName);

		var tempForm = solutionModel.cloneForm(_tempFormName, solutionModel.getForm(_oriFormName));
		
		// Associamo alle form temporanee i datasources ottenuti in precedenza
		solutionModel.getForm(_tempFormName).dataSource = _dataSource;
		solutionModel.getForm(_tempFormName).getField('id_regole').dataProviderID = 'IdRegole';
		solutionModel.getForm(_tempFormName).getField('descrizione_regola').dataProviderID = 'DescrizioneRegola';
		solutionModel.getForm(_tempFormName).getField('tot_ore_periodo').dataProviderID = 'TotaleOrePeriodo';
		solutionModel.getForm(_tempFormName).getField('riga').dataProviderID = 'Riga';
		solutionModel.getForm(_tempFormName).getField('periodicita').dataProviderID = 'Periodicita';
		solutionModel.getForm(_tempFormName).getField('codice_fascia').dataProviderID = 'CodiceFascia';
		solutionModel.getForm(_tempFormName).getField('descrizione_fascia').dataProviderID = 'Descrizione';
		solutionModel.getForm(_tempFormName).getField('tot_ore_fascia').dataProviderID = 'TotOreFascia';
		solutionModel.getForm(_tempFormName).getField('id_fascia_oraria').dataProviderID = 'IdFasciaOraria';
		solutionModel.getForm(_tempFormName).getField('id_fascia_oraria_prog').dataProviderID = 'IdFasciaOrariaProg';
		solutionModel.getForm(_tempFormName).getField('tipo_riposo_prog').dataProviderID = 'TipoRiposoProg';
		solutionModel.getForm(_tempFormName).getField('blocco').dataProviderID = 'Blocco';
		solutionModel.getForm(_tempFormName).getField('tipo_riposo_visualizzato').dataProviderID = 'TipoRiposoVisualizzato';
		solutionModel.getForm(_tempFormName).getField('giorno').dataProviderID = 'Giorno';
		
		var regolaField = solutionModel.getForm(_tempFormName).getField('codice_regola');
		regolaField.dataProviderID = 'CodiceRegola';
		regolaField.toolTipText = '%%codiceregola%%' + ' - ' + '%%descrizioneregola%%';
		var bloccoPerField = solutionModel.getForm(_tempFormName).getField('blocco_riga');
		bloccoPerField.dataProviderID = 'bloccoriga';
		bloccoPerField.toolTipText = 'Blocco : ' + '%%blocco%%' + ' - Indice : ' + '%%riga%%' + ' di ' + '%%periodicita%%' + '\n Totale ore teoriche del blocco : ' + '%%totaleoreperiodoformattato%%';
		bloccoPerField.displaysTags = true;		
		var giornoField = solutionModel.getForm(_tempFormName).getField('giorno_mese');
		giornoField.dataProviderID = 'giornomese';
		giornoField.toolTipText = 'Giorno ' + '%%giornoformattato%%' + ' - Orario previsto : ' + '%%totaleorefasciaformattato%%' ;
		giornoField.displaysTags = true;
		var nomeGiornoField = solutionModel.getForm(_tempFormName).getField('nome_giorno');
		nomeGiornoField.dataProviderID = 'nomegiorno';
		nomeGiornoField.toolTipText = 'Giorno ' + '%%giornoformattato%%' + ' - Orario previsto : ' + '%%totaleorefasciaformattato%%';
		nomeGiornoField.displaysTags = true;
        var fasciaField = solutionModel.getForm(_tempFormName).getField('fascia_prog');
        fasciaField.dataProviderID = 'IdFasciaOrariaAttiva';
        fasciaField.enabled = true;
        var tipoRiposoField = solutionModel.getForm(_tempFormName).getField('tipo_riposo');
        tipoRiposoField.dataProviderID = 'tiporiposo';
        var modificatoField = solutionModel.getForm(_tempFormName).getField('modificato');
	    modificatoField.dataProviderID = 'modificato';
	    var anomaliaField = solutionModel.getForm(_tempFormName).getField('anomalia');
	    anomaliaField.dataProviderID = 'anomalia';
	    
	    forms.giorn_prog_turni_fasce.elements.tab_prog_turni_turni.addTab(_tempFormName);

	}
}

/**
 * Verifica se la ditta utilizza o meno la gestione delle commesse in modo da poter gestire 
 * la visualizzazione dello specifico tab in vista mensile
 * 
 * @AllowToRunInFind
 * 
 * @param {Number} idDitta
 *
 * @properties={typeid:24,uuid:"70FAA4FC-06C9-4B1E-9D60-C63959AB5838"}
 */
function haCommesse(idDitta)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_commesse>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_COMMESSE);
	if(fs.find())
	{
		fs.idditta = idDitta;
		if(fs.search())
			return true;
	}
	
	return false;
}

/**
 * Valida la timbratura inserita
 * 
 * @param {String} timbratura_hhmm		la timbratura da validare, nel formato HH.mm (es. 15.45)
 * 
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"E1D23A54-2AF5-402B-A159-54449EDE1F66"}
 */
function validaTimbratura(timbratura_hhmm)
{
	// Matches hours in format HH.mm, and captures hours and minutes, with two digits
	var matches = /^([0-2]?[0-9]{1})\.?([0-5]{1}[0-9]{1})$/.exec(timbratura_hhmm);
	if(!matches || matches[1] < 0 || matches[1] > 23 || matches[2] < 0 || matches[2] > 59)
		return false;
	
	return true;
}

/**
 * @param {Number} idLavoratore
 * @param {String} timbraturaInserita
 * @param {Date} giorno
 * @param {Number} senso
 * @param {Number} ggSucc
 * @param {Boolean} [soloCartolina]
 * @param {{ id: Number, eliminata: Boolean }} [timbraturaInConflitto] popolata con l'id della timbratura eventualmente trovata
 * @param {Number} [causale]
 * 
 * @return Number
 * 
 * @properties={typeid:24,uuid:"AB5AC6C9-9247-46EB-B8BE-2B0962EA67AE"}
 */
function validaInserimentoTimbratura(idLavoratore,timbraturaInserita,giorno,senso,ggSucc,soloCartolina, timbraturaInConflitto, causale){
	
	var _timbrH,_timbrM;
	_timbrH = parseInt(utils.stringLeft(timbraturaInserita,2),10);
	_timbrM = parseInt(utils.stringRight(timbraturaInserita,2),10)
	
	var _idDip = idLavoratore;
	var _nrBadge = globals.getNrBadge(idLavoratore,giorno);//_frm._vNrBadge;
	var _gruppoInst = globals.getGruppoInstallazioneLavoratore(_idDip);
		
	// caso campi non compilati
	if(timbraturaInserita == null || timbraturaInserita === '' 
		|| giorno == null || giorno === ''
		|| senso == null || senso === '')
	   return 1;
	// nel caso di flag su giorno successivo, alla timbratura originale vanno sommate 24 ore
	else if(_timbrH <= 23 && _timbrM <= 59)
	{
	   if(ggSucc)
		  _timbrH += 24;

	   var _timbratura = giorno.getFullYear() * 1e8 + (giorno.getMonth() + 1) * 1e6 +
	                     giorno.getDate() * 1e4 + _timbrH * 1e2 + _timbrM;
	   
	   if(_timbratura == null)
		   return 2;
	                     
	   var sqlTimb = "SELECT idtimbrature, TimbEliminata FROM E2Timbratura WHERE iddip = ? AND nr_badge = ? AND idgruppoinst = ? AND timbratura = ?;"
       var arrTimb = [_idDip,_nrBadge,_gruppoInst,_timbratura];
       var dsTimb = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlTimb,arrTimb,-1);
       if(dsTimb.getValue(1,1))
       {
    	   if(timbraturaInConflitto)
    	   timbraturaInConflitto.id = dsTimb.getValue(1,1);
    	   if(dsTimb.getValue(1,2) == 0)
	          //timbratura già presente
    	  return 3;
       else 
	       if(dsTimb.getValue(1,2) == 1)
	    	   //timbratura da orologio eliminata
	    	   if(timbraturaInConflitto)
	    	   timbraturaInConflitto.eliminata = true;
	    	   return 4;
       }
       else 
       {
    	  // caso timbratura causalizzata senza causale
    	  if(causale == 0)
    		 return 5;
    	  
    	  //caso valori timbratura corretti 
          return 0;
		}
	}
	else
		//caso valori timbratura non corretti
	    return 2;
		
}

/**
 * @properties={typeid:24,uuid:"7419B7E1-9C33-4D3A-A2A6-DE778C0F4AFF"}
 */
function selezione_VP()
{	
	if(globals._tipoConnessione == 0 || _to_sec_organization$lgn.sec_organization_to_sec_owner.name == 'M.A.Elaborazioni')
	{
		globals.ma_utl_showInfoDialog('Funzionalità attiva solo in modalità utente','Visualizzazione copertura');
		return;
	}
	
	var recSingolaDitta = globals.getSingolaDitta(globals.Tipologia.STANDARD);
	if(recSingolaDitta)
		ApriVP(recSingolaDitta);
	else
	
	if (globals._filtroSuDitta != null) {

		currDitta = globals._filtroSuDitta;
		
		ApriVP(null);
		
	} else {

		currDitta = -1;

		globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", globals.lkpDITTA,
			                             'ApriVC', 'FiltraLavoratoriDittaStandard', null, null, '', true);
	}
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"13CB04F2-B1FD-4E0C-9EEB-FDCAE0A775ED"}
 */
function ApriVP(_rec)
{
	var _filter = new Object();
	_filter.filter_name = 'ftr_idditta';
	_filter.filter_field_name = 'idditta';
	_filter.filter_operator = '=';
	if(_rec)
		_filter.filter_value = _rec['idditta'];
	else 
	    _filter.filter_value = currDitta;
	  
	var _progName = 'RP_VisualizzaCopertura';     
	var _progObj = globals.nav.program[_progName];
	_progObj.filter = [_filter];  
	_progObj.foundset = null;
	
	/** @type {{idditta:Number, datasource:String, numgiorni:Number, numdip:Number, dal:Date, al:Date}} */
	var _progParams = {};
	_progParams.idditta = _rec ? _rec['idditta'] : currDitta;
	_progParams.datasource = null;
	_progParams.numgiorni = null;
	_progParams.numdip = null;
	_progParams.dal = null;
	_progParams.al = null;
	
    globals.openProgram(_progName,_progParams,true);
    
}

/**
 * Recupera le eventuali richieste non ancora confermate o rifiutate per la ditta richiesta 
 * nel periodo indicato
 *  
 * @param {Number} idditta
 * @param {Number} mese
 * @param {Number} anno
 *
 * @properties={typeid:24,uuid:"8FC249C5-AF5A-441E-B058-6C455C149E27"}
 */
function getRichiesteInSospeso(idditta,mese,anno)
{
	var dal = new Date(anno, mese - 1, 1);
	var al = new Date(anno, mese - 1,globals.getTotGiorniMese(mese,anno))
	var sqlRicSosp = "SELECT DISTINCT LGT.idLavoratoreGiustificativoTesta\
                      FROM Lavoratori_GiustificativiRighe LGR\
                      INNER JOIN Lavoratori_GiustificativiTesta LGT\
                      ON LGT.idLavoratoreGiustificativoTesta = LGR.idLavoratoreGiustificativoTesta\
                      INNER JOIN Lavoratori L\
                      ON L.idLavoratore = LGR.idLavoratore\
                      WHERE LGT.Stato IS NULL\
                      AND LGR.Giorno BETWEEN ? AND ?\
                      AND L.idDitta = ?"
	var arrRicSosp = [utils.dateFormat(dal,globals.ISO_DATEFORMAT)
	                  ,utils.dateFormat(al,globals.ISO_DATEFORMAT)
					  ,idditta];
	var dsRicSosp = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,sqlRicSosp,arrRicSosp,-1);
	return dsRicSosp.getColumnAsArray(1);
}

/**
 * Gestisce il file delle timbrature scartate permettendo la cancellazione di timbrature non associate
 * durante le precedenti acquisizioni 
 * 
 * @properties={typeid:24,uuid:"12AB2496-BEFE-440C-8601-FBAC8766E548"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function apriGestioneFileTimbrature()
{
	// TODO definire modalità unica di accesso al file delle timbrature scartate (verifica caso con + gruppi installazione)
	var codice;
	var grInst;
	var frmTimbr = forms.giorn_manutenzione_timbr;
	
	/** @type {JSFoundset<db:/ma_presenze/e2sediinstallazione>}*/
	var fsSediInstallazione = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.SEDI_INSTALLAZIONE);
	fsSediInstallazione.loadAllRecords();
	var numSediInstallazione = fsSediInstallazione.getSize();
	switch(numSediInstallazione)
	{
		case 0:
			globals.ma_utl_showInfoDialog('La ditta non ha orologi installati','Gestione timbrature non associate');
			return;
			break;
		case 1:
			codice = fsSediInstallazione.cod_ditta;
			grInst = fsSediInstallazione.idgruppoinst;
			break;
		default:
			//TODO selezione gruppo installazione della ditta nel caso di più gruppi !
		    globals.ma_utl_showInfoDialog('La ditta ha più orologi installati, contattare il servizio di assistenza per la gestione della casistica','Gestione timbrature non associate');
	    	return;
		    break;
	}
			
	frmTimbr.vCodDitta = codice;
	frmTimbr.vGrInstDitta = grInst;
	
	// acquisisci lettura file da ws
	var params = globals.inizializzaParametriFileTimbrature(globals.getIdDitta(codice),
		                                                    globals.TODAY.getFullYear() * 100 + globals.TODAY.getMonth() + 1,
															grInst,
															'',
															'')
	var response = getFileTimbratureScartate(params);
															
	if(!response['returnValue'])
	{
		globals.ma_utl_showWarningDialog(response['fileString'],'Gestione file timbrature scartate');
		return;
	}
	
	/** @type {String} */
	var fileString = response['fileString'];
	var arrTxt = fileString.split('\r\n');
	var dsTimbrScartate = databaseManager.createEmptyDataSet();
	dsTimbrScartate.addColumn('selected',1,JSColumn.NUMBER);
	dsTimbrScartate.addColumn('badge',2,JSColumn.TEXT);
	dsTimbrScartate.addColumn('giorno',3,JSColumn.DATETIME);
	dsTimbrScartate.addColumn('orologio',4,JSColumn.TEXT);
	dsTimbrScartate.addColumn('senso',5,JSColumn.TEXT);
	dsTimbrScartate.addColumn('timbratura',6,JSColumn.TEXT);
	dsTimbrScartate.addColumn('riga',7,JSColumn.TEXT);
	
	var sqlPercorsi = "SELECT percorso FROM E2Percorsi WHERE TipoPercorso = 'TracciatoScaricoTimbrature'";
	var dsPercorsi = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlPercorsi,null,-1);
	var codTracciato = dsPercorsi.getValue(1,1);
	
	/** @type {JSRecord<db:/ma_presenze/e2progscaricoorologi>}*/
	var fsTracciato = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TRACCIATI_SCARICO);
	if(fsTracciato.find())
	{
		fsTracciato.codice = codTracciato;
		if(fsTracciato.search())
		{
			// fase di elaborazione dati timbrature
			for(var i = 0; i < arrTxt.length - 1; i++)
			{
				var badge = utils.stringMiddle(arrTxt[i].toString(),fsTracciato.pos_nrbadge,fsTracciato.len_nrbadge);
				var timbr = utils.stringMiddle(arrTxt[i].toString(),fsTracciato.pos_ora,fsTracciato.len_ora) + 
				            "." + utils.stringMiddle(arrTxt[i].toString(),fsTracciato.pos_minuti,fsTracciato.len_minuti);
				var day = new Date((parseInt(utils.stringMiddle(arrTxt[i],fsTracciato.pos_anno,fsTracciato.len_anno),10) + fsTracciato.correttivoanno),
					               (parseInt(utils.stringMiddle(arrTxt[i].toString(),fsTracciato.pos_mese,fsTracciato.len_mese),10) - 1),
								   (parseInt(utils.stringMiddle(arrTxt[i].toString(),fsTracciato.pos_giorno,fsTracciato.len_giorno),10)));		   
									   
				var senso = utils.stringMiddle(arrTxt[i],fsTracciato.pos_senso,fsTracciato.len_senso) == 1 ? 'Uscita' : 'Entrata';
				var orologio = utils.stringMiddle(arrTxt[i].toString(),fsTracciato.pos_indirizzoorologio,fsTracciato.len_indirizzoorologio);
			    var riga = arrTxt[i];
			    
				dsTimbrScartate.addRow([0,badge,day,orologio,senso,timbr,riga]);
			}
		}
	}
	else
	{
		globals.ma_utl_showWarningDialog('Cannot go to find mode','Gestione timbrature non associate');
		return;
	}
	
//	application.output('Il numero delle timbrature gestibili è : ' + dsTimbrScartate.getMaxRowIndex());
	
	if(dsTimbrScartate.getMaxRowIndex() == 0)
	{
		globals.ma_utl_showWarningDialog('Nessuna timbratura precedentemente scartata da eliminare','Gestione timbrature non associate');
		return;
	}
	
	// fase di visualizzazione situazione timbrature non gestite
	var frmTimbrTblOri = forms.giorn_manutenzione_timbr_tbl;
	var frmTimbrTblName = frmTimbrTblOri.controller.getName() + '_temp';
		
	frmTimbr.elements.tab_timbr.removeAllTabs();
	history.removeForm(frmTimbrTblName);
	solutionModel.removeForm(frmTimbrTblName);
	
	// dataset con le timbrature scartate
	var dSTimbrScartate = dsTimbrScartate.createDataSource('dSTimbrScartate');
	
	var frmTimbrTbl = solutionModel.cloneForm(frmTimbrTblName,solutionModel.getForm(frmTimbrTblOri.controller.getName()));
	frmTimbrTbl.dataSource = dSTimbrScartate;
	solutionModel.getForm(frmTimbrTblName).getField('fld_selected').dataProviderID = 'selected';
	solutionModel.getForm(frmTimbrTblName).getField('fld_badge').dataProviderID = 'badge';
	solutionModel.getForm(frmTimbrTblName).getField('fld_orologio').dataProviderID = 'orologio';
	solutionModel.getForm(frmTimbrTblName).getField('fld_giorno').dataProviderID = 'giorno';
	solutionModel.getForm(frmTimbrTblName).getField('fld_senso').dataProviderID = 'senso';
	solutionModel.getForm(frmTimbrTblName).getField('fld_timbratura').dataProviderID = 'timbratura';
	solutionModel.getForm(frmTimbrTblName).getField('fld_riga').dataProviderID = 'riga';
	
	forms.giorn_manutenzione_timbr.vFileString = arrTxt;
	
	if(frmTimbr.elements.tab_timbr.addTab(frmTimbrTblName))
    	globals.ma_utl_showFormInDialog('giorn_manutenzione_timbr','Gestione timbrature non associate');
	else
		globals.ma_utl_showWarningDialog('Pannello non aggiunto al tab');
}

/**
 * Restituisce il file di testo relativo al file PRESEPI2.DAT delle timbrature scartate
 *  
 * @param params
 *
 * @properties={typeid:24,uuid:"BA2DF4AB-22AC-4020-B89E-D82B7F4299A5"}
 */
function getFileTimbratureScartate(params)
{
	var url = globals.WS_URL + "/Timbrature/GetFileTimbrature";
	var response = globals.getWebServiceResponse(url,params);
	
	return response;
}

/**
 * Restituisce true se il file con le timbrature scartate ha un numero di timbrature maggiore della soglia di 250
 * 
 * @param params
 *
 * @properties={typeid:24,uuid:"C527B13D-074B-47C3-9D65-89484797C62A"}
 */
function verificaSuperamentoLimiteFileTimbratureScartate(params)
{
	var response = getFileTimbratureScartate(params);
	
	if(!response['returnValue']) //nessun file di timbrature scartate
		return false;
	
	/** @type {String} */
	var fileString = response['fileString'];
	var arrTxt = fileString.split('\r\n');
	var numTimbrScartate = arrTxt.length;
	
	return (numTimbrScartate > 250);
}

/**
 * @param {Boolean} [daCartolina]
 * 
 * @properties={typeid:24,uuid:"71C08F41-48A1-464D-890F-9E0A39BE08F3"}
 */
function aggiungi_timbratura_dipendente(daCartolina)
{
	var frm = forms.giorn_aggiungi_timbr_dipendente;
	if(daCartolina != null)
		frm.vDaCartolina = daCartolina;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci timbratura');
}

/**
 * @param {Boolean} [daCartolina]
 * 
 * @properties={typeid:24,uuid:"E5F9432C-0678-42C4-A9FA-85CE835A08C1"}
 */
function aggiungi_timbratura_dipendente_immediata(daCartolina)
{
	var frm = forms.giorn_aggiungi_timbr_immediata_dtl;
	if(daCartolina != null)
		frm.vDaCartolina = daCartolina;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci timbratura');
}

/**
 * @properties={typeid:24,uuid:"CBC74855-FA29-40B0-98DA-F33C839D9AA4"}
 */
function selezione_GComm()
{
	var recSingolaDitta = getSingolaDitta(globals.Tipologia.STANDARD); 
	if (recSingolaDitta)
		ApriGComm(recSingolaDitta)
		
	else if (globals._filtroSuDitta) {

		var _form = globals.openProgram('LEAF_GestCommesse');
		lookup(globals._filtroSuDitta, _form);

	} else {
		
		globals.svy_nav_showLookupWindow(new JSEvent, "currDitta", lkpDITTA,
                                         'ApriGComm', 'filtraDittaStandard', null, null, '', true);
	}
}

/**
 * Apri il program per la gestione delle commesse
 *  
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"4628A3C3-16B9-48B9-A4A3-BAE9961CFB9F"}
 */
function ApriGComm(_rec)
{
	if (_rec)
	{
		var _form = globals.openProgram('LEAF_GestCommesse');
		lookup(_rec['idditta'], _form);
   	}
	
}

/**
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"E627E669-7C79-4565-8622-FEDCF71796D5"}
 */
function ottieniDataSetProgTurniCalendario(idDip,dal,al)
{
	var sqlProgTurni = "SELECT Regole.idRegole \
, Regole.Giorno \
, Regole.CodiceRegola \
, Regole.DescrizioneRegola \
, Regole.TotaleOrePeriodo \
, Regole.RigaTeorica AS Riga \
, Regole.Periodicita \
, RF.TipoRiposo \
, ISNULL(FOF.CodiceFascia, FO.CodiceFascia) AS CodiceFascia \
, ISNULL(FOF.Descrizione, FO.Descrizione) AS Descrizione \
, FO.TotaleOreFascia \
, FO.idFasciaOraria \
, GPF.idFasciaOraria AS idFasciaOrariaProg \
, GPF.TipoRiposo AS TipoRiposoProg \
FROM dbo.F_Lav_RegolaPeriodo(?, ?, ?) \
AS Regole \
INNER JOIN E2RegoleFasce RF \
ON Regole.idRegole = RF.idRegole \
AND Regole.RigaTeorica = RF.Riga \
INNER JOIN E2FO_FasceOrarie FO \
ON RF.idFasceOrarie = FO.idFasciaOraria \
LEFT JOIN ( SELECT Giorno , idFasciaOraria , TipoRiposo FROM E2GiornalieraProgFasce \
WHERE idDip = ? \
AND Giorno BETWEEN ? AND ? \
)AS GPF ON Regole.Giorno = GPF.Giorno \
LEFT OUTER JOIN E2FO_FasceOrarie FOF \
ON GPF.idFasciaOraria = FOF.idFasciaOraria \
ORDER BY Regole.Giorno";
	var arrProgTurni = [idDip,utils.dateFormat(dal,globals.ISO_DATEFORMAT),utils.dateFormat(al,globals.ISO_DATEFORMAT),
	                    idDip,utils.dateFormat(dal,globals.ISO_DATEFORMAT),utils.dateFormat(al,globals.ISO_DATEFORMAT)];
	var dsProgTurni = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlProgTurni,arrProgTurni,-1);
	return dsProgTurni;
}

/**
 * @AllowToRunInFind
 * 
 * Ottieni il record relativo alla fascia oraria corrispondente alla fascia oraria teorica che il 
 * lavoratore avrebbe nel giorno richiesto
 * 
 * @param {Number} idLav
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"7C57266F-1B66-4C5F-AB75-62BBDE4FC8E0"}
 */
function getFasciaTeoricaGiorno(idLav,giorno)
{
	var sqlFascia = "SELECT dbo.F_Lav_IDFasciaTeorica(?,?)";
	var arrFascia = [idLav,giorno];
	var dsFascia = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlFascia,arrFascia,-1);
	
	/** @type {JSFoundset <db:/ma_presenze/e2fo_fasceorarie>} */
	var fsFascia = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE);
	if(fsFascia.find())
	{
		fsFascia.idfasciaoraria = dsFascia.getValue(1,1);
		if(fsFascia.search())
			return fsFascia.getSelectedRecord();
	}
	
	return null;
}

/**
 * Ottieni il record relativo alla fascia oraria avente l'identificativo selezionato
 * 
 * @param {Number} idFasciaOraria
 *
 * @return {JSRecord<db:/ma_presenze/e2fo_fasceorarie>}
 *  
 * @properties={typeid:24,uuid:"4167AA45-3424-4D13-A7F2-E7FCD9CAB52E"}
 * @AllowToRunInFind
 */
function getFasciaOraria(idFasciaOraria)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2fo_fasceorarie>}*/
	var fsFascia = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE);
	if(fsFascia.find())
	{
		fsFascia.idfasciaoraria = idFasciaOraria;
		if(fsFascia.search())
			return fsFascia.getSelectedRecord();
	}
	
	return null;
}

/**
 * Ottieni la fascia appartenente alla specifica ditta avente il numero di ore teoriche indicato
 * Data la specifica ditta, ad un dato numero di ore totali corrisponde una unica fascia 
 * 
 * @param {Number} idDitta
 * @param {Number} totOre
 *
 * @return {JSRecord<db:/ma_presenze/e2fo_fasceorarie>}
 * 
 * @properties={typeid:24,uuid:"36862B6B-0749-49D8-AD53-7BFBEE698F32"}
 * @AllowToRunInFind
 */
function getFasciaOrariaDaTotaleOre(idDitta,totOre)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2fo_fasceorarie>}*/
	var fsFascia = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE);
	if(fsFascia.find())
	{
	   fsFascia.idditta = idDitta;
	   fsFascia.totaleorefascia = totOre;
	   
	   if(fsFascia.search())
		  return fsFascia.getSelectedRecord();
	}
	
	return null;
}

/**
 * Ottieni le informazioni sulla fascia programmata per l'utente associata al giorno selezionato 
 * 
 * @param {Number} idLav
 * @param {Date} giorno
 *
 * @return {JSRecord<db:/ma_presenze/e2fo_fasceorarie>}
 * 
 * @properties={typeid:24,uuid:"16586624-B85A-4178-AF6F-70767DE68B86"}
 * @AllowToRunInFind
 */
function getFasciaProgrammataGiorno(idLav,giorno)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsProgFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
	if(fsProgFasce.find())
	{
		fsProgFasce.iddip = idLav;
		fsProgFasce.giorno = giorno;
		
		if(fsProgFasce.search() && fsProgFasce.e2giornalieraprogfasce_to_e2fo_fasceorarie)
			return fsProgFasce.e2giornalieraprogfasce_to_e2fo_fasceorarie.getSelectedRecord();
	}
	
	return null;
}

/**
 * Elimina le fasce programmate precedentemente inserite per l'array di lavoratori nei giorni 
 * che vanno dal giorno dal al giorno al
 *  
 * @param {Array<Number>} arrLavoratori
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"B102B468-CD8F-42AE-9F0F-889FFA4D0727"}
 */
function eliminaFasceProgrammate(arrLavoratori,dal,al)
{
	// eliminazione di eventuali fasce programmate precedentemente inserite per i dipendenti nei giorni modificati
	var sqlProgfasce = "DELETE FROM E2GiornalieraProgFasce WHERE idDip IN (" +
	                    arrLavoratori.map(function(pfLav){return pfLav}).join(',') + ")" +
	                   " AND Giorno BETWEEN ? AND ?";
	
	var success = plugins.rawSQL.executeSQL(globals.Server.MA_PRESENZE,
		                                    globals.Table.GIORNALIERA_PROGFASCE,
											sqlProgfasce,
											[utils.dateFormat(dal,globals.ISO_DATEFORMAT),utils.dateFormat(al,globals.ISO_DATEFORMAT)]);
	
//	var success = plugins.rawSQL.executeSQL(globals.getSwitchedServer(globals.Server.MA_PRESENZE),
//		                                   globals.Server.MA_PRESENZE,
//										   sqlProgfasce,
//										   [utils.dateFormat(dal,globals.ISO_DATEFORMAT),
//										   utils.dateFormat(al,globals.ISO_DATEFORMAT)]);
	if(!success)
	{
		globals.ma_utl_showWarningDialog('Errore durante la cancellazione delle fasce precedentemente inserite','Copia programmazione settimanale del negozio');
		application.output(plugins.rawSQL.getException().getMessage(), LOGGINGLEVEL.ERROR);
		return false;
	}
	
	plugins.rawSQL.flushAllClientsCache(globals.Server.MA_PRESENZE,
		                                globals.Table.GIORNALIERA_PROGFASCE);
 
	return true;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param idEvento
 *
 * @properties={typeid:24,uuid:"A8AB83E9-7071-4F4C-AA49-05F9E22ECFB6"}
 */
function getVlsProprietaEvento(idEvento)
{
	var sqlPropEv = "SELECT \
       E.idEvento \
       , EC.idEventoClasse \
       , EC.GestioneSeparataProprieta \
       , EC.TipoGestioneProprieta \
       , ECP.NumProprieta \
FROM \
       E2Eventi E \
       INNER JOIN E2EventiClassi EC \
             ON EC.IdEventoClasse = E.IdEventoClasse \
       LEFT OUTER JOIN (\
             SELECT \
                    idEventoClasse \
                    , COUNT(CodiceProprieta) AS NumProprieta \
             FROM \
                    E2EventiClassiProprieta ECP \
             GROUP BY \
                    idEventoClasse \
       ) ECP \
             ON EC.IdEventoClasse = ECP.IdEventoClasse \
WHERE E.idEvento = ? \
GROUP BY \
       E.idEvento \
       , EC.idEventoClasse \
       , EC.GestioneSeparataProprieta \
       , EC.TipoGestioneProprieta \
       , ECP.NumProprieta";
	
	var arrPropEv = [idEvento];
	var dsPropEv = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlPropEv,arrPropEv,-1);
	
	if(dsPropEv.getMaxRowIndex())
	{
		// caso gestione separata
		if(dsPropEv.getValue(1,3) == 1)
		{
			if(dsPropEv.getValue(1,4) == 1)
				return 2;
			else
				return 4;
		}
		else 
			return dsPropEv.getValue(1,5);
		
	}
	return null;
		
}

/**
 * Ottiene il dataset di riepilogo delle ore settimanali lavorabili e di quelle lavorate in più od in meno
 *  
 * @param {Number} idDitta
 * @param {Number} periodo
 * @param {Number} settimanaDal
 * @param {Number} settimanaAl
 *
 * @return {JSDataSet}
 *
 * @properties={typeid:24,uuid:"0B5F4B80-E336-4E75-B548-80488BFA8F13"}
 */
function ottieniDataSetOreSettimanali(idDitta,periodo,settimanaDal,settimanaAl)
{
	var sqlOs = 'SELECT * FROM dbo.F_Stampa_OreSettimana(?,?,?,?)';
	var arrOs = [idDitta,periodo,settimanaDal,settimanaAl];
	
	var dsOs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlOs,arrOs,-1);
	
	return dsOs;
}

/**
 * Ottiene il record della tabella e2giornaliera per il lavoratore e il giorno richiesti
 * 
 * @param {Number} idLav
 * @param {Date} giorno
 * @param {String} tipoRecord
 *
 * @return {JSRecord<db:/ma_presenze/e2giornaliera>}
 *
 * @properties={typeid:24,uuid:"8EFDF36A-E7AE-45E0-921B-C86B864ED4E4"}
 * @AllowToRunInFind
 */
function getRecGiornaliera(idLav,giorno,tipoRecord)
{
	/** @type {JSFoundset <db:/ma_presenze/e2giornaliera>} */
	var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fsGiorn.find())
	{
	   fsGiorn.iddip = idLav;
	   fsGiorn.giorno = giorno;
	   fsGiorn.tipodirecord = tipoRecord;
	   if(fsGiorn.search())
		  return fsGiorn.getSelectedRecord();
	}
	
	return null;
}

/**
 * Ottiene i records della tabella e2giornaliera per il lavoratore e il periodo richiesto
 * 
 * @param {Number} idLav
 * @param {Date} dal
 * @param {Date} al
 * @param {String} [tipoRecord]
 * 
 * @return {JSFoundset<db:/ma_presenze/e2giornaliera>}
 * 
 * @properties={typeid:24,uuid:"22242F4D-2DF1-470A-BF93-E887D7F804FC"}
 * @AllowToRunInFind
 */
function getRecsGiornaliera(idLav,dal,al,tipoRecord)
{
	/** @type {JSFoundset <db:/ma_presenze/e2giornaliera>} */
	var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fsGiorn.find())
	{
	   fsGiorn.iddip = idLav;
	   fsGiorn.giorno = globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
	   if(tipoRecord != null)
	   	  fsGiorn.tipodirecord = tipoRecord;
	   if(fsGiorn.search())
		   return fsGiorn;
	}
	
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Ottiene il record della tabella e2giornalieraeventi
 * 
 * @param {Number} idGiornalieraEvento
 * 
 * @return JSRecord<db:/ma_presenze/e2giornalieraeventi>
 * 
 * @properties={typeid:24,uuid:"BB8467B2-511F-4E0A-9D22-11B9AFA22D42"}
 */
function getRecGiornalieraEventi(idGiornalieraEvento)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>} */
	var fsGe = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_EVENTI);
	if(fsGe.find())
	{
		fsGe.idgiornalieraeventi = idGiornalieraEvento;
		if(fsGe.search())
			return fsGe.getSelectedRecord();
	}
	
	return null;
}

/**
 * @param {Number} periodo
 * @param {Number} idDitta
 * @param {Array} dipSel
 * @param {Date} dalGg
 * @param {Date} alGg
 * @param {Number} idEventoOld
 * @param {Number} idEventoNew
 * @param {String} codPropOld
 * @param {String} codPropNew
 * @param {String} tipoGiornaliera
 * @param {Number} tipoConnessione
 * 
 * @properties={typeid:24,uuid:"9B7801A8-30DA-4E67-AAF0-BF27767006CF"}
 */
function cambiaEventoAsync(idDitta,periodo,dipSel,dalGg,alGg,idEventoOld,idEventoNew,codPropOld,codPropNew,tipoGiornaliera,tipoConnessione)
{
	var params = 
	{
		user_id                 : security.getUserName(), 
		client_id               : security.getClientID(),
		periodo                 : periodo,
		idditta                 : idDitta,
		iddipendenti            : dipSel,
		dalgiorno               : utils.dateFormat(dalGg,globals.EU_DATEFORMAT),
		algiorno                : utils.dateFormat(alGg,globals.EU_DATEFORMAT),
		idevento                : idEventoOld,
		ideventomod             : idEventoNew,
		codproprieta            : codPropOld,
		codproprietamod         : codPropNew,
		tipogiornaliera         : tipoGiornaliera,
		tipoconnessione         : tipoConnessione
	}

	var url = globals.WS_MULTI_URL + "/Eventi/CambiaEvento";
	globals.addJsonWebServiceJob(url,
		                         params,
								 null,
								 null,
								 function(retObj)
								 { 
									 forms.giorn_vista_mensile.is_dirty = true;
									 forms.mao_history.operationDone(retObj);
								 });
}

/**
 * @param {Number} periodo
 * @param {Number} idDitta
 * @param {Array} dipSel
 * @param {Date} dalGg
 * @param {Date} alGg
 * @param {Number} idEventoOld
 * @param {Number} idEventoNew
 * @param {String} codPropOld
 * @param {String} codPropNew
 * @param {String} tipoGiornaliera
 * @param {Number} tipoConnessione
 * 
 * @properties={typeid:24,uuid:"89C143AA-5D92-4D9C-BC72-FEBAF494518B"}
 */
function cambiaEventoSync(idDitta,periodo,dipSel,dalGg,alGg,idEventoOld,idEventoNew,codPropOld,codPropNew,tipoGiornaliera,tipoConnessione)
{
	var params = 
	{
		periodo: periodo,
		idditta: idDitta,
		iddipendenti: dipSel,
		dalgiorno: utils.dateFormat(dalGg,globals.EU_DATEFORMAT),
		algiorno: utils.dateFormat(alGg,globals.EU_DATEFORMAT),
		idevento: idEventoOld,
		ideventomod: idEventoNew,
		codproprieta: codPropOld,
		codproprietamod: codPropNew,
		tipogiornaliera: tipoGiornaliera,
		tipoconnessione: tipoConnessione
	}

	var url = globals.WS_URL + "/Eventi/CambiaEventoSync";
	return globals.getWebServiceResponse(url,params);
}

/**
 * @param {Number} idDip
 * @param {Date} dal
 * @param {Date} al
 * @param {String} tipoGiorn
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"3304C0A8-7451-4CE1-A7E4-B8615232E597"}
 */
function ottieniDataSetGiornaliera(idDip,dal,al,tipoGiorn)
{
	// Recupera i dati della giornaliera normale o budget a seconda della vista selezionata
    var _gQuery = "SELECT * FROM [dbo].[F_Gio_Lav_Dati](?,?,?) WHERE TipoDiRecord = ?";		
        
    var _parArrGiorn = 
    	[
	    	 idDip
	    	,dal
			,al
			,tipoGiorn
		];
        	
    return databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _gQuery, _parArrGiorn, -1);	
}

/**
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"3F2F0DF3-7144-46DE-9863-4C163FA9FB00"}
 * @AllowToRunInFind
 */
function getEventiLavoratoreDalAl(idLavoratore,dal,al)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fs.find())
	{
		fs.iddip = idLavoratore;
		fs.giorno = globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '|mask';
	    if(fs.search())
	       return globals.foundsetToArray(fs.e2giornaliera_to_e2giornalieraeventi,'idevento');
	}
	return [];
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"59A55789-14BB-47D4-AAD7-B4F8E37D0C1F"}
 * @AllowToRunInFind
 */
function getEventiClasseLavoratoreDalAl(idLavoratore,dal,al)
{
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fs.find())
	{
		fs.iddip = idLavoratore;
		fs.giorno = globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '|mask';
	    if(fs.search())
	       return globals.foundsetToArray(fs.e2giornaliera_to_e2giornalieraeventi.e2giornalieraeventi_to_e2eventi,'ideventoclasse');
	}
	return [];
}

/**
 * @param {Array<Number>} arrLav
 * @param {Date} dal
 * @param {Date} al
 * @param {Boolean} soloAutorizzate
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"C02E1551-F3C5-475C-8453-006B7CEBE885"}
 */
function ottieniIncongruenzeOreLavorateOreCommesse(arrLav,dal,al,soloAutorizzate)
{
	var strArrLav = arrLav.map(function(lav){return lav}).join(',');
	
	var sqlInc = 'SELECT \
O.IdLavoratore, \
L.Codice, \
P.Nominativo, \
O.Giorno, \
CASE WHEN O.OreLavorate > 0 \
     THEN O.OreLavorate \
	 ELSE 0 \
END AS OreLavorate, \
CASE \
     WHEN K.OreCommessa > 0 \
     THEN K.OreCommessa \
	 ELSE 0 \
END AS OreCommessa, \
O.OreLavorate - OreCommessa AS DifferenzaOre \
FROM \
( \
SELECT \
	G.IdDip AS IdLavoratore, \
    G.Giorno, \
	SUM(CASE \
	        WHEN EC.Tipo = \'S\' \
			THEN 0 \
			ELSE CAST(GE.Ore/100. AS decimal(5,2)) \
		END) AS OreLavorate \
	FROM E2Giornaliera G \
    LEFT OUTER JOIN E2GiornalieraEventi GE \
	ON G.IdGiornaliera = GE.idGiornaliera \
	INNER JOIN E2Eventi E \
                  ON GE.IdEvento = E.idEvento \
                  INNER JOIN E2EventiClassi EC \
                  ON E.IdEventoClasse = EC.IdEventoClasse \
	WHERE EC.Tipo IN (\'O\',\'A\',\'S\') \
	AND G.TipoDiRecord = \'N\' \
	GROUP BY G.Giorno,G.IdDip \
) O \
INNER JOIN Lavoratori L \
ON O.IdLavoratore = L.idLavoratore \
INNER JOIN Persone P \
ON L.CodiceFiscale = P.CodiceFiscale \
INNER JOIN \
(SELECT \
   CG.Giorno, \
   SUM(CGO.Ore) AS OreCommessa, \
   CG.idLavoratore \
   FROM \
   Commesse_Giornaliera CG \
   INNER JOIN \
   Commesse_Giornaliera_Ore CGO \
   ON CG.idCommessaGiornaliera = CGO.idCommessaGiornaliera \
   WHERE CG.idLavoratore IN (' + strArrLav +') \
   AND \
   CGO.Autorizzato IN (' + (soloAutorizzate ? '1' : '0,1') + ') \
   GROUP BY CG.Giorno,CG.idLavoratore) K \
ON K.Giorno = O.Giorno \
AND K.idLavoratore = O.idLavoratore \
WHERE \
K.idLavoratore IN (' + strArrLav + ') \
AND O.Giorno BETWEEN ? AND ? \
AND (O.OreLavorate - K.OreCommessa) != 0';
	
	var arrInc = [globals.dateFormat(dal,globals.ISO_DATEFORMAT),globals.dateFormat(al,globals.ISO_DATEFORMAT)];
	var dsInc = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlInc,arrInc,-1);
	
	return dsInc;
}

/**
 * Genera il tracciato mensa per la ditta nel peridoo richiesto
 * 
 * @param {Number} idDitta
 * @param {Number} periodo
 * @param {Number} idDittaMensa
 * @param {Number} idGruppoInst
 * @param {String} gruppoLav
 *
 * @properties={typeid:24,uuid:"83611B2E-E7D1-48E8-AF0B-CA998CAABF47"}
 */
function generaTracciatoMensa(idDitta,periodo,idDittaMensa,idGruppoInst,gruppoLav)
{
	var params = globals.inizializzaParametriAttivaMese(idDitta
												        ,periodo
														,idGruppoInst
														,gruppoLav
														,globals.TipoConnessione.CLIENTE);
    // TODO richiesta di selezione tipo tracciato (se esiste)
    params.iddittamensa = 3;

	var url = globals.WS_DOTNET_CASE == WS_DOTNET.CORE ? WS_MULTI_URL + "/Tracciati/GeneraTracciatoMensa" : WS_MULTI_URL + "/Giornaliera/GeneraTracciatoMensa";
	addJsonWebServiceJob(url,
		                 params,
						 vUpdateOperationStatusFunction);
}

/**
 * Restituisce un array con gli identificativi dei tracciati mensa disponibili 
 * per la ditta desiderata
 * 
 * @param {Number} idDitta
 *
 * @properties={typeid:24,uuid:"8F8FE7C5-E16C-4649-B133-AAE9F5AE9319"}
 * @AllowToRunInFind
 */
function getDitteMense(idDitta)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_mense>}*/
	var fsDittaMensa = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_MENSE); 
	if(fsDittaMensa.find())
	{
		fsDittaMensa.idditta = idDitta;
		if(fsDittaMensa.search())
			return globals.foundsetToArray(fsDittaMensa,'idDittaMensa');	
	}
	
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce true se la ditta ha associato almeno un tracciato mensa, false altrimenti
 * 
 * @param {Number} idDitta
 *
 * @properties={typeid:24,uuid:"0CE57DA4-61AA-45B5-BBAC-29E17470CA59"}
 */
function usaMensa(idDitta)
{
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_mense>}*/
	var fsDittaMensa = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_MENSE); 
	if(fsDittaMensa.find())
	{
		fsDittaMensa.idditta = idDitta;
		if(fsDittaMensa.search())
			return true;	
	}
	
	return false;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce la stringa con le timbrature della giornata 
 * 
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * 
 * @return {String}
 * 
 * @properties={typeid:24,uuid:"FFAC5240-0DDC-4AA1-A09C-60E5B5383560"}
 */
function getTimbratureGiornoStr(idLavoratore,giorno)
{
	var strTimbr = 'Nessuna timbratura nella giornata';
	
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>}*/
	var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fsGiorn.find())
	{
		fsGiorn.giorno = giorno;
		fsGiorn.iddip = idLavoratore;
		
		var idGiorno = fsGiorn.search();
		if(idGiorno != 0)
		{
			strTimbr = '';
			var fsTimbr = fsGiorn.e2giornaliera_to_e2timbratura;
			fsTimbr.sort('timbratura asc');
			var numTimbrGiorno = fsTimbr.getSize();
			for(var t = 1; t <= numTimbrGiorno; t++)
		    {
		    	var rec = fsTimbr.getRecord(t);
			    strTimbr += (rec.timbeliminata == 1 ? '' : rec.timbratura_senso + ' : ' + rec.timbratura_formattata + '\n');
		    }
		}
	}
	
	return strTimbr;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce la stringa con le timbrature causalizzate della giornata
 * 
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * 
 * @return {String}
 * 
 * @properties={typeid:24,uuid:"8B775D0E-BC05-4F60-9004-0C811862D6DE"}
 */
function getTimbratureServizioGiornoStr(idLavoratore,giorno)
{
	var strTimbr = 'Nessuna timbratura causalizzata nella giornata';
	
	/** @type {JSFoundset<db:/ma_presenze/e2giornaliera>}*/
	var fsGiorn = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fsGiorn.find())
	{
		fsGiorn.giorno = giorno;
		fsGiorn.iddip = idLavoratore;
		
		var idGiorno = fsGiorn.search();
		if(idGiorno != 0)
		{
			strTimbr = '';
			var fsTimbr = fsGiorn.e2giornaliera_to_e2timbratureservizio;
			fsTimbr.sort('timbratura asc');
			var numTimbrGiorno = fsTimbr.getSize();
			for(var t = 1; t <= numTimbrGiorno; t++)
		    {
		    	var rec = fsTimbr.getRecord(t);
			    strTimbr += (rec.timbeliminata == 1 ? '' : rec.timbratura_senso + ' : ' + rec.timbratura_oremin + ' ' + rec.e2timbratureservizio_to_e2timbratureserviziogestione.descrizione + '\n');
		    }
		}
	}
	
	return strTimbr;
}

/**
 * Inizializza con la fascia a zero le eventuali giornate non ancora compilate della tabella e2giornalieraprogfasce
 * (necessario per effettuare la compilazione corretta in giornaleira nel caso di programmazione negozio) 
 * 
 * @param {Array<Number>} arrLav
 * @param {Number} periodo
 * @param {Array<Number>} arrGiorni
 *
 * @properties={typeid:24,uuid:"1A346627-F7CF-4275-9143-4A312DD97CD0"}
 */
function inizializzaGiornProgFasceNonCompilate(arrLav,periodo,arrGiorni)
{
	var anno = parseInt(utils.stringLeft(periodo.toString(),4),10);
	var mese = parseInt(utils.stringRight(periodo.toString(),2),10);
	
	// controllo eventuali giornate non compilate :
	// 1 - se non sono già presenti eventi relativi a certificazioni in giornaliera normale
	// 2 - se non sono già presenti eventi in giornaliera di budget
	// 3 - se non sono riposi 
	// le pre-impostiamo a zero ore
	for(var l = 0; l < arrLav.length; l++)
	{
		/** @type {Number} */
		var g;
		for(g = 0; g < arrGiorni.length; g++)
		{
			var currGiorno = new Date(anno, mese - 1, arrGiorni[g]);
			var currEvGiornNormale = getRecGiornaliera(arrLav[l],currGiorno,globals.TipoGiornaliera.NORMALE);
			var currEvGiornBudget = getRecGiornaliera(arrLav[l],currGiorno,globals.TipoGiornaliera.BUDGET);
			
		    if(scopes.giornaliera.getProgrammazioneFasceGiorno(arrLav[l],currGiorno) != null)
				continue;
		    else  
		    {
		    	if(currEvGiornNormale != null)
			    {
			    	var haEventiNormale = false;
			    	var recsNormale = currEvGiornNormale.e2giornaliera_to_e2giornalieraeventi;
			    	for(var en = 1; en <= recsNormale.getSize(); en++)
			    	{
			    		if(recsNormale.getRecord(en).e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconstorico == 1)
			    			haEventiNormale = true;
			       	}
			    	if(haEventiNormale)
			    		continue;
			    }
			    
			    if(currEvGiornBudget != null)
			    {
			    	var recsBudget = currEvGiornBudget.e2giornaliera_to_e2giornalieraeventi;
			    	if(recsBudget.getSize())
			    	   continue;
			    }
		    
				var assunzione = globals.getDataAssunzione(arrLav[l]);
				var cessazione = globals.getDataCessazione(arrLav[l]);
				if(currGiorno < assunzione || cessazione != null && currGiorno > cessazione)
			    	continue;
								
				/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
				var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
				databaseManager.startTransaction();
				
				fsFasceProg.newRecord();
				fsFasceProg.giorno = currGiorno;
				fsFasceProg.iddip = arrLav[l];
				fsFasceProg.idfasciaorariafittizia = null;
				fsFasceProg.iddittafasciaorariatimbrature = null;
				fsFasceProg.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(arrLav[l]),0).idfasciaoraria;
				fsFasceProg.tiporiposo = 0;
				
				if(!databaseManager.commitTransaction())
				{
					globals.ma_utl_showErrorDialog('Errore durante la preparazione alla compilazione nella precompilazione delle fasce a zero ore \
					                                per il dipendente ' + globals.getNominativo(arrLav[l]) + ' nel giorno \
					                                ' + globals.dateFormat(currGiorno,globals.EU_DATEFORMAT),'Programmazione negozio');
				    databaseManager.rollbackTransaction();
				}
				
			}
		}
	}
}

/**
 * @properties={typeid:24,uuid:"6DBB801F-58D3-4DDD-94EC-D983E0B64A3C"}
 */
function inizializzaParametriFileTimbrature(idditta, periodo, idgruppoinstallazione, gruppolavoratori, timbraturenonscartate)
{
	var codDittaGrInst = scopes.giornaliera.getCodDittaSedeInstallazione(idgruppoinstallazione);	
	var strCodDittaGrInst = codDittaGrInst.toString();
	var nomeCartella = 'Cliente';
	
	for(var i = 6; i > codDittaGrInst.toString().length; --i)
		nomeCartella += '0';
	
	nomeCartella += strCodDittaGrInst;
		
	return {
				user_id                 : security.getUserName(), 
				client_id               : security.getClientID(),
				idditta 				: idditta,
				codiceditta 			: globals.getCodDitta(idditta),
				iddipendenti 			: [],
				periodo 				: periodo,
				idgruppoinstallazione 	: idgruppoinstallazione,
				codgruppogestione 		: gruppolavoratori,
				cartellatimbrature      : nomeCartella,
				timbraturenonscartate   : timbraturenonscartate
		   };
}

/**
 * Filtra i dipendenti che risultano da inviare 
 * 
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"D55F3365-2EA0-4464-B958-3E92A2C406AD"}
 */
function FiltraDipendentiDaInviare(fs)
{
	fs.addFoundSetFilterParam('idlavoratore','IN',_arrDipDaInviare);
	return fs;
}

/**
 * @AllowToRunInFind 
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _iddip
 * @param {Number} _idditta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {Boolean} [_fromSituazioneTurni]
 *
 * @properties={typeid:24,uuid:"DA11DD9F-DF69-4C06-9E39-A29040CD57BA"}
 */
function apriProgrammazioneTurniDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_iddip,_idditta,_anno,_mese,_fromSituazioneTurni)
{
	var periodo = _anno * 100 + _mese;
	if(!verificaProgrammazioneTurniDip(_iddip,globals.getFirstDatePeriodo(periodo),globals.getLastDatePeriodo(periodo)))
	{
		globals.ma_utl_showInfoDialog('Il dipendente non ha associato regole che permettano la distribuzione di orario','Programmazione turni');
		return;
	}
	
	var frm = forms.giorn_prog_turni_fasce;
	var frmName = frm.controller.getName();
	frm.vIdLavoratore = _iddip;
	frm.vAnno = _anno;
	frm.vMese = _mese;
	
	_fromSituazioneTurni ? frm.isFromSituazioneTurni = true : frm.isFromSituazioneTurni  = false;
	
	globals.ma_utl_showFormInDialog(frmName,
		                            globals.getCodLavoratore(_iddip) + ' - ' + globals.getNominativo(_iddip) + ' - Periodo : ' + globals.getNomeMese(_mese) + ' ' + _anno,
									null,
									false);
	
	// inizializziamo i parametri che ci servono per eventuali ricalcoli delle fasce
	globals.setIdLavoratoreProgTurni(_iddip);
	
	// inizializziamo a zero i blocchi squadrati
	frm.arrBlocchiSquadrati = [];
	
	globals.preparaProgrammazioneTurni(_iddip,_anno,_mese,globals.TipoGiornaliera.NORMALE);
	
	// aggiornamento dati foundset temporaneo
	var formName = 'giorn_turni_temp';
    var fs = forms[formName].foundset;
    var maxBlocchi = fs.getRecord(fs.getSize())['blocco'];
    for(var b = 1; b <= maxBlocchi; b++)
        // update visualizzazione
	    globals.verificaProgrammazioneTurniOrePeriodo(fs.duplicateFoundSet(),b);
   
}

/**
 * Restituisce l'elenco delle eventuali annotazioni inserite per la ditta nel periodo
 * 
 * @param {Number} idDitta
 * @param {Number} periodo
 * @param {Number} idGruppoInst
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"8C4A4758-CD49-4A9B-A79B-245690E63B03"}
 */
function elencoAnnotazioniDitta(idDitta,periodo,idGruppoInst)
{
	//TODO
	return new JSDataSet();
}

/**
 * @properties={typeid:24,uuid:"7D0E7D55-0C85-4ED2-B4B3-0F1444951B40"}
 */
function selezione_dipendente_da_eliminare()
{
	if (globals._filtroSuDitta != null)
		currDitta = globals._filtroSuDitta;
	else
		currDitta = globals.svy_nav_showLookupWindow(new JSEvent,'',globals.lkpDITTA,
			                                         '', 'FiltraLavoratoriDittaStandard', null, null, '', true);
	
	if(!currDitta)
		return;
			
    var currDip = globals.svy_nav_showLookupWindow(new JSEvent,'',lkpLAVORATORI_DAELIMINARE,
                                                       '', 'filterLkpLavoratori', null, null, '', true);	
    if(!currDip)
    	return;
    
    var answer = globals.ma_utl_showYesNoQuestion('Procedere con l\'elimiazione del dipendente? Tutti i suoi dati non saranno più disponibili','Eliminazione dipendente');
    
    if(!answer)
    	return;
    
    scopes.giornaliera.eliminazioneDipendente(currDip);	
}

/**
 * @AllowToRunInFind
 * 
 * Disegna la tabella riepilogativa inerente alla visualizzazione della copertura turni
 * 
 * @param {String} dSCop
 * @param {String} frmName
 * @param {String} frmContName
 * @param {Date} dal
 * @param {Number} numDip
 * @param {Number} numGiorni
 * @param {String} [dSRiep]
 * 
 * @properties={typeid:24,uuid:"1AEB19FF-92CA-4A83-A773-513B37B9D339"}
 */
function disegnaVisualizzazioneCoperturaTurni(dSCop, frmName, frmContName, dal, numDip, numGiorni, dSRiep) 
{
	var vcFormName = frmName ? frmName : 'giorn_visualizza_copertura_turni_tbl';
    var vcFormRiepName = 'giorn_visualizza_copertura_turni_riep_tbl';
	/**
	 * se è già presente la form il datasource può essere riutilizzato se il numero di giorni e dipendenti non è variato
	 */
//	if(!forms[frmName]) 
//	{
		forms[frmContName].elements.tab_copertura.removeAllTabs();
		forms[frmContName].elements.tab_riepilogo.removeAllTabs();
		
		//rimuoviamo le forms dalla soluzione
		history.removeForm(vcFormName);
		solutionModel.removeForm(vcFormName);
		history.removeForm(vcFormRiepName);
		solutionModel.removeForm(vcFormRiepName);
		
		// costruiamo la nuova form da zero a partire dai campi fissi (idlavoratore,codice,nominativo,harichieste)
		var vcForm = solutionModel.newForm(frmName, dSCop, 'leaf_style', false, 260 + (50 * numGiorni), 20 * (numDip + 1));
			vcForm.navigator = SM_DEFAULTS.NONE;
			vcForm.view = JSForm.LOCKED_TABLE_VIEW;
			vcForm.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;

		// costruiamo la nuova form da zero a partire dai campi fissi (idlavoratore,codice,nominativo,harichieste)
		var vcFormRiep = solutionModel.newForm(vcFormRiepName, dSRiep, 'leaf_style', false, 260 + (50 * numGiorni), 200);
			vcFormRiep.navigator = SM_DEFAULTS.NONE;
			vcFormRiep.view = JSForm.LOCKED_TABLE_VIEW;
			vcFormRiep.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;
				
		/**
		 * CODICE DIPENDENTE
		 */
		var fldCodice = vcForm.newTextField('codice', 0, 20, 60, 20);
			fldCodice.name = 'fld_codice';
			fldCodice.styleClass = 'table';
			fldCodice.transparent = false;
			fldCodice.format = '#';
			fldCodice.editable =
			fldCodice.enabled  = false;
			
		var lblCodice = vcForm.newLabel('Codice', 0, 0, 60, 20);
			lblCodice.name = 'lbl_codice';
			lblCodice.labelFor = fldCodice.name;
			lblCodice.styleClass = 'table_header';
			lblCodice.transparent = false;
		
		/**
		 * NOMINATIVO
		 */
		var fldNominativo = vcForm.newTextField('nominativo', 20, 20, 200, 20);
			fldNominativo.name = 'fld_nominativo';
			fldNominativo.styleClass = 'table';
			fldNominativo.transparent = false;
			fldNominativo.editable = 
			fldNominativo.enabled  = false;
			
		var lblNominativo = vcForm.newLabel('Nominativo', 20, 0, 200, 20);
			lblNominativo.name = 'lbl_nominativo';
			lblNominativo.styleClass = 'table_header';
			lblNominativo.labelFor = fldNominativo.name;
			lblNominativo.transparent = false;
		
		/**
		 * INTESTAZIONE
		 */
		var fldIntestazione = vcFormRiep.newTextField('Intestazione', 0, 20, 260, 20);
			fldIntestazione.name = 'fld_intestazione';
			fldIntestazione.styleClass = 'table';
			fldIntestazione.transparent = false;
			fldIntestazione.editable = false;
			fldIntestazione.enabled  = true;
				
		// impostazione del giorno di partenza
		var _nuovoGiorno = new Date(dal.getFullYear(), dal.getMonth(), dal.getDate());

		// per ogni giorno richiesto costruiamo il relativo campo
		for (var i = 1; i <= numGiorni; i++) 
		{
			_nuovoGiorno.setDate(dal.getDate() + (i - 1));
			
			// per gestione codici evento con differenziazione normale/budget/richieste in sospeso
			var calcDescTurnoName = 'calc_to_desc_turno_' + globals.dateFormat(_nuovoGiorno,globals.ISO_DATEFORMAT);
			solutionModel.getDataSourceNode(dSCop).removeCalculation(calcDescTurnoName);
			var calcDescTurno = solutionModel.getDataSourceNode(dSCop).getCalculation(calcDescTurnoName);
			if(!calcDescTurno) 
			{
				var code = "function "  + calcDescTurnoName + "()\
				{\
				    var str = giorno_" + i + ";\
					var desc = null;\
					var firstIndex = utils.stringPosition(str,'_',0,1);\
					var prefix = utils.stringLeft(str,firstIndex - 1);\
					\
					desc = prefix;\
					\
					return desc;\
				}\;"
				calcDescTurno = solutionModel.getDataSourceNode(dSCop).newCalculation(code, JSVariable.TEXT);
			}

			// per gestione turnazione singola coppia (giorno,dipendente)
//			var calcFasciaTurnoName = 'calc_to_fascia_turno_' + globals.dateFormat(_nuovoGiorno,globals.ISO_DATEFORMAT);
//			var calcFasciaTurnoEvento = solutionModel.getDataSourceNode(dSCop).getCalculation(calcFasciaTurnoName);
//			if(!calcFasciaTurnoName) 
//			{
//				var code = "function " + calcFasciaTurnoName + "()\
//                            {\
//                               var desc = null;\
//	                           desc = globals.ottieniInfoFasciaGiorno(TODO\
//	                          \
//	                          return desc;\
//                            }";
//
//				calcFasciaTurnoEvento = solutionModel.getDataSourceNode(dSCop).newCalculation(code, JSVariable.TEXT);
//			}
			var fldGiorno = vcForm.newTextField(calcDescTurno.getName(), 260 + 60 * (i - 1), 20, 45, 20);
				fldGiorno.name = 'fld_giorno_' + i;
				fldGiorno.styleClass = 'table';
				fldGiorno.editable = false;
				fldGiorno.enabled = true;
				fldGiorno.transparent = false;
				fldGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
				fldGiorno.onRightClick = solutionModel.getGlobalMethod("globals","ApriPopupVC_Turni");
				fldGiorno.toolTipText = '%%giorno_' + i +'%%';
 				fldGiorno.toolTipText = '%%' + calcDescTurno.getName() + '%%';
				fldGiorno.displaysTags = true;
				fldGiorno.fontType = solutionModel.createFont('Arial', SM_FONTSTYLE.BOLD, 10);
				fldGiorno.onRender = solutionModel.getGlobalMethod('globals', 'onRenderVC_Turni');
						
			var lblGiorno = vcForm.newLabel(globals.getNomeGiorno(_nuovoGiorno) + ' ' + globals.getNumGiorno(_nuovoGiorno), 260 + 60 * (i - 1), 0, 45, 20);
				lblGiorno.name = 'lbl_giorno_' + i;
				lblGiorno.labelFor = fldGiorno.name;
				lblGiorno.styleClass = 'table_header';
				lblGiorno.transparent = false;
				lblGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;

			var fldGiornoRiep = vcFormRiep.newTextField('perc_cop_' + i, 260 + 60 * (i - 1), 20, 45, 20);
				fldGiornoRiep.name = 'fld_perc_cop_' + i;
				fldGiornoRiep.styleClass = 'table_vc';
				fldGiornoRiep.editable = false;
				fldGiornoRiep.enabled = true;
				fldGiornoRiep.transparent = false;
				fldGiornoRiep.horizontalAlignment = SM_ALIGNMENT.CENTER;
				fldGiorno.displaysTags = true;
//				fldGiorno.onRender = solutionModel.getGlobalMethod('globals', frmContName == 'rp_visualizza_copertura' ? 'onRenderVC_RP' : 'onRenderVC');
						
			var lblGiornoRiep = vcFormRiep.newLabel(globals.getNomeGiorno(_nuovoGiorno) + ' ' + globals.getNumGiorno(_nuovoGiorno), 260 + 60 * (i - 1), 0, 45, 20);
				lblGiornoRiep.name = 'lbl_perc_cop_' + i;
				lblGiornoRiep.labelFor = fldGiornoRiep.name;
				lblGiornoRiep.styleClass = 'table_header';
				lblGiornoRiep.transparent = false;
				lblGiornoRiep.horizontalAlignment = SM_ALIGNMENT.CENTER;	
		}
//	}
	
	forms[frmContName].elements.tab_copertura.addTab(vcFormName);
	forms[frmContName].elements.tab_riepilogo.visible = true;
    forms[frmContName].elements.tab_riepilogo.addTab(vcFormRiepName);
}


/**
 * @AllowToRunInFind
 * 
 * Disegna la tabella riepilogativa inerente alla visualizzazione della copertura
 * 
 * @param {String} dSCop
 * @param {Number} idDitta
 * @param {Number} numGiorni
 * @param {Number} numDip
 * @param {Date} dal
 * @param {String} frmContName
 * @param {String} [dSRiep]
 * 
 * @properties={typeid:24,uuid:"117424D1-140D-4669-B103-9BF0F17F666D"}
 * @SuppressWarnings(unused)
 */
function disegnaVisualizzazioneCoperturaAssenze(dSCop, idDitta, numGiorni, numDip, dal, frmContName, dSRiep) 
{
	var currDipNo = -1;
	var currGiorniNo = -1;
	var vcFormName = 'giorn_visualizza_copertura_tbl_' + idDitta;
    var vcFormRiepName = 'giorn_visualizza_copertura_riep_tbl_' + idDitta;
	
    /**
     * se è già presente la form recuperiamo il numero di righe (dipendenti) e colonne (giorni)
     */
	if(forms[vcFormName])
	{
		currGiorniNo = (forms[vcFormName].foundset.alldataproviders.length - globals.offsetVisualizzaCoperturaAssenza)/2;
	    currDipNo = forms[vcFormName].foundset.getSize();
	}
	
	/**
	 * se è già presente la form il datasource può essere riutilizzato se il numero di giorni e dipendenti non è variato
	 */
//	if(currGiorniNo != numGiorni || currDipNo != numDip || !forms[vcFormName]) 
//	{
		forms[frmContName].elements.tab_copertura.removeAllTabs();
		forms[frmContName].elements.tab_riepilogo.removeAllTabs();
		
	    //rimuoviamo le forms dalla soluzione
		history.removeForm(vcFormName);
		solutionModel.removeForm(vcFormName);
		history.removeForm(vcFormRiepName);
		solutionModel.removeForm(vcFormRiepName);
		
		// costruiamo la nuova form da zero a partire dai campi fissi (idlavoratore,codice,nominativo,harichieste)
		var vcForm = solutionModel.newForm(vcFormName, dSCop, 'leaf_style', false, 260 + (50 * numGiorni), 20 * (numDip + 1));
			vcForm.navigator = SM_DEFAULTS.NONE;
			vcForm.view = JSForm.LOCKED_TABLE_VIEW;
			vcForm.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;
		// costruiamo la nuova form da zero a partire dai campi fissi (idlavoratore,codice,nominativo,harichieste)
		var vcFormRiep = solutionModel.newForm(vcFormRiepName, dSRiep, 'leaf_style', false, 260 + (50 * numGiorni), 40);
			vcFormRiep.navigator = SM_DEFAULTS.NONE;
			vcFormRiep.view = JSForm.LOCKED_TABLE_VIEW;
			vcFormRiep.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;
			
		/**
		 * CODICE DIPENDENTE
		 */
		var fldCodice = vcForm.newTextField('codice', 0, 20, 60, 20);
			fldCodice.name = 'fld_codice';
			fldCodice.styleClass = 'table';
			fldCodice.transparent = false;
			fldCodice.format = '#';
			fldCodice.editable = false;
			fldCodice.enabled  = true;
		var lblCodice = vcForm.newLabel('Codice', 0, 0, 60, 20);
			lblCodice.name = 'lbl_codice';
			lblCodice.labelFor = fldCodice.name;
			lblCodice.styleClass = 'table_header';
			lblCodice.transparent = false;
		
		/**
		 * NOMINATIVO
		 */
		var fldNominativo = vcForm.newTextField('nominativo', 20, 20, 200, 20);
			fldNominativo.name = 'fld_nominativo';
			fldNominativo.styleClass = 'table';
			fldNominativo.transparent = false;
			fldNominativo.editable = false;
			fldNominativo.enabled  = true;
		var lblNominativo = vcForm.newLabel('Nominativo', 20, 0, 200, 20);
			lblNominativo.name = 'lbl_nominativo';
			lblNominativo.styleClass = 'table_header';
			lblNominativo.labelFor = fldNominativo.name;
			lblNominativo.transparent = false;
		
		/**
		 * INTESTAZIONE
		 */
		var fldIntestazione = vcFormRiep.newTextField('Intestazione', 0, 20, 260, 20);
			fldIntestazione.name = 'fld_intestazione';
			fldIntestazione.styleClass = 'table';
			fldIntestazione.transparent = false;
			fldIntestazione.editable = false;
			fldIntestazione.enabled  = true;
			
		// impostazione del giorno di partenza
		var _nuovoGiorno = new Date(dal.getFullYear(), dal.getMonth(), dal.getDate());

		// per ogni giorno richiesto costruiamo il relativo campo
		for (var i = 1; i <= numGiorni; i++) 
		{
			_nuovoGiorno = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + (i - 1));
			
			// per gestione codici evento con differenziazione normale/budget/richieste in sospeso
			var calcDescEventoName = 'calc_to_desc_evento_' + globals.dateFormat(_nuovoGiorno,globals.ISO_DATEFORMAT);
			solutionModel.getDataSourceNode(dSCop).removeCalculation(calcDescEventoName);
			var calcDescEvento = solutionModel.getDataSourceNode(dSCop).getCalculation(calcDescEventoName);
			if(!calcDescEvento) 
			{
				var code = "function " + calcDescEventoName + "()\
                            {\
                               var desc = null;\
	                           var suffix = utils.stringRight(giorno_" + i + ",1);\
	                           if(suffix)\
	                           {\
	                               var id = utils.stringLeft(giorno_" + i + ",giorno_" + i + ".length - 1);\
		                           \
		                           switch(suffix)\
		                           {\
			                         case globals.TipoAssenza.TOTALE:\
			                         case globals.TipoAssenza.PARZIALE:\
			                         case globals.TipoAssenza.BUDGET:\
			                         case globals.TipoAssenza.STORICO:\
			                            /** @type {JSFoundset<db:/ma_presenze/e2giornalieraeventi>}*/\
				                        var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_EVENTI);\
				                        if(fs.find())\
				                        {\
				                          fs.idgiornalieraeventi = id;\
				                          if(fs.search())\
	                                         desc = fs.descrizione;\
				                        }\
				                        break;\
			                         case globals.TipoAssenza.RICHIESTA:\
			                            /** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>}*/\
			                            var fsRighe = lavoratori_to_lavoratori_giustificativirighe;\
			                            if(fsRighe.find())\
			                            {\
				                          fsRighe.idlavoratoregiustificativorighe = id;\
				                          if(fsRighe.search())\
				                             desc = fsRighe.descrizione;\
			                            }\
			                            break;\
			                         default:\
				                        break;\
		                          }\
	                          \
	                          }\
	                          return desc;\
                            }";

				calcDescEvento = solutionModel.getDataSourceNode(dSCop).newCalculation(code, JSVariable.TEXT);
			}
			
			var fldGiorno = vcForm.newTextField(calcDescEvento.getName(), 260 + 60 * (i - 1), 20, 45, 20);
				fldGiorno.name = 'fld_giorno_' + i;
				fldGiorno.styleClass = 'table_vc';
				fldGiorno.editable = false;
				fldGiorno.enabled = true;
				fldGiorno.transparent = false;
				fldGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
				fldGiorno.onRightClick = solutionModel.getGlobalMethod('globals','ApriPopupVC');
				fldGiorno.toolTipText = '%%' + calcDescEvento.getName() + '%%';
				fldGiorno.displaysTags = true;
				fldGiorno.fontType = solutionModel.createFont('Arial', SM_FONTSTYLE.BOLD, 10);
				fldGiorno.onRender = solutionModel.getGlobalMethod('globals', frmContName == 'rp_visualizza_copertura' ? 'onRenderVC_RP' : 'onRenderVC');
			
			
			var lblGiorno = vcForm.newLabel(globals.getNomeGiorno(_nuovoGiorno) + ' ' + globals.getNumGiorno(_nuovoGiorno), 260 + 60 * (i - 1), 0, 45, 20);
				lblGiorno.name = 'lbl_giorno_' + i;
				lblGiorno.labelFor = fldGiorno.name;
				lblGiorno.styleClass = 'table_header';
				lblGiorno.transparent = false;
				lblGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
//				if(_nuovoGiorno.getDay() == 0 || _nuovoGiorno.getDay() == 6)
//					lblGiorno.foreground = 'white';

			var fldGiornoRiep = vcFormRiep.newTextField('perc_cop_' + i, 260 + 60 * (i - 1), 20, 45, 20);
				fldGiornoRiep.name = 'fld_perc_cop_' + i;
				fldGiornoRiep.styleClass = 'table_vc';
				fldGiornoRiep.editable = false;
				fldGiornoRiep.enabled = true;
				fldGiornoRiep.transparent = false;
				fldGiornoRiep.horizontalAlignment = SM_ALIGNMENT.CENTER;
				fldGiorno.displaysTags = true;
//				fldGiorno.onRender = solutionModel.getGlobalMethod('globals', frmContName == 'rp_visualizza_copertura' ? 'onRenderVC_RP' : 'onRenderVC');
						
			var lblGiornoRiep = vcFormRiep.newLabel(globals.getNomeGiorno(_nuovoGiorno) + ' ' + globals.getNumGiorno(_nuovoGiorno), 260 + 60 * (i - 1), 0, 45, 20);
				lblGiornoRiep.name = 'lbl_perc_cop_' + i;
				lblGiornoRiep.labelFor = fldGiornoRiep.name;
				lblGiornoRiep.styleClass = 'table_header';
				lblGiornoRiep.transparent = false;
				lblGiornoRiep.horizontalAlignment = SM_ALIGNMENT.CENTER;	
		}
		
//	}
	
	forms[frmContName].elements.tab_copertura.addTab(vcFormName);
    forms[frmContName].elements.tab_riepilogo.addTab(vcFormRiepName);
       
}

/**
 * @param {String} dSCop
 * @param {Number} idDitta
 * @param {Number} numGiorni
 * @param {Number} numDip
 * @param {Date} dal
 * @param {Number} numBlocchi
 * @param {Number} offset
 * 
 * @properties={typeid:24,uuid:"00F077D1-8DD4-4DA2-8881-8431237F9A51"}
 */
function disegnaVisualizzazioneCoperturaCalendario(dSCop, idDitta, numGiorni, numDip, dal, numBlocchi, offset) 
{
	var currDipNo = -1;
	var currGiorniNo = -1;
	var currNumBlocchi = -1;
	var vtFormName = 'giorn_visualizza_copertura_turni_tbl_' + idDitta;
    
    /**
     * se è già presente la form recuperiamo il numero di righe (dipendenti) e colonne (giorni)
     */
	if(forms[vtFormName])
	{
		currGiorniNo = forms[vtFormName].foundset.alldataproviders.length - globals.offsetVisualizzaCoperturaTurni;
	    currDipNo = forms[vtFormName].foundset.getSize();
	}
	
	/**
	 * se è già presente la form il datasource può essere riutilizzato se il numero di giorni e dipendenti non è variato
	 */
	if(currGiorniNo != numGiorni || currDipNo != numDip || !forms[vtFormName] || currNumBlocchi != numBlocchi) 
	{
		forms.giorn_visualizza_copertura.elements.tab_copertura.removeAllTabs();
	    
	    //rimuoviamo la form dalla soluzione
		history.removeForm(vtFormName);
		solutionModel.removeForm(vtFormName);
		
		// costruiamo la nuova form da zero a partire dai campi fissi (idlavoratore,codice,nominativo,harichieste)
		var vcForm = solutionModel.newForm(vtFormName, dSCop, 'leaf_style', false, 260 + (50 * numGiorni), 20 * (numDip + 1));
			vcForm.navigator = SM_DEFAULTS.NONE;
			vcForm.view = JSForm.LOCKED_TABLE_VIEW;
			vcForm.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;

		/**
		 * CODICE DIPENDENTE
		 */
		var fldCodice = vcForm.newTextField('codice', 0, 20, 60, 20);
			fldCodice.name = 'fld_codice';
			fldCodice.styleClass = 'table';
			fldCodice.transparent = false;
			fldCodice.format = '#';
			fldCodice.editable =
			fldCodice.enabled  = false;
			
		var lblCodice = vcForm.newLabel('Codice', 0, 0, 60, 20);
			lblCodice.name = 'lbl_codice';
			lblCodice.labelFor = fldCodice.name;
			lblCodice.styleClass = 'table_header';
			lblCodice.transparent = false;
		
		/**
		 * NOMINATIVO
		 */
		var fldNominativo = vcForm.newTextField('nominativo', 20, 20, 200, 20);
			fldNominativo.name = 'fld_nominativo';
			fldNominativo.styleClass = 'table';
			fldNominativo.transparent = false;
			fldNominativo.editable = 
			fldNominativo.enabled  = false;
			
		var lblNominativo = vcForm.newLabel('Nominativo', 20, 0, 200, 20);
			lblNominativo.name = 'lbl_nominativo';
			lblNominativo.styleClass = 'table_header';
			lblNominativo.labelFor = fldNominativo.name;
			lblNominativo.transparent = false;
		
		// impostazione del giorno di partenza
		var _nuovoGiorno = new Date(dal.getFullYear(), dal.getMonth(), dal.getDate());

		// ascissa iniziale dopo campi fissi
		var xi = 260;
		
		var dx = 60;
		var dxTot = 75;
		var dy = 20;
		
		var currBlocco = 1;
		
		// per ogni giorno richiesto costruiamo il relativo campo
		for (var g = 1; g <= numGiorni; g++) 
		{
			_nuovoGiorno.setDate(dal.getDate() + (g - 1));
			
			//TODO periodicità = 7 in questo caso...
            if(g > offset && currBlocco == 1)
            	currBlocco++;
            else if(g <= offset) 
            	currBlocco = Math.ceil((g + offset)/7);
            else
            	currBlocco = Math.ceil((g + offset)/7) + 1;
				
			var fldGiorno = vcForm.newTextField('giorno_' + g, xi + dx * (g - 1) + dxTot * (currBlocco - 1), dy, dx, dy);
				fldGiorno.name = 'fld_giorno_' + g;
				fldGiorno.styleClass = 'table';
				fldGiorno.editable = false;
				fldGiorno.enabled = true;
				fldGiorno.transparent = false;
				fldGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
//				fldGiorno.onRightClick = solutionModel.getGlobalMethod("globals","ApriPopupVC");
//				fldGiorno.toolTipText = '%%' + calcDescEvento.getName() + '%%';
				fldGiorno.displaysTags = true;
				fldGiorno.fontType = solutionModel.createFont('Arial', SM_FONTSTYLE.BOLD, 10);
//				fldGiorno.onRender = solutionModel.getGlobalMethod('globals', 'onRenderVC');
			
			
			var lblGiorno = vcForm.newLabel(globals.getNomeGiorno(_nuovoGiorno) + ' ' + globals.getNumGiorno(_nuovoGiorno), xi + dx * (g - 1) + dxTot * (currBlocco - 1), 0, dxTot, dy);
				lblGiorno.name = 'lbl_giorno_' + g;
				lblGiorno.labelFor = fldGiorno.name;
				lblGiorno.styleClass = 'table_header';
				lblGiorno.transparent = false;
				lblGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;

		}
				
		for (var r = 1; r <=numBlocchi; r++)
		{
		// campi di verifica ore lavorabili e lavorate
//		var fldLavorabili = vcForm.newTextField('lavorabili',260 + 60 * i,20,60,20);
//		fldLavorabili.name = 'fld_lavorabili';
//		fldLavorabili.styleClass = 'table';
//		fldLavorabili.editable = false;
//		fldLavorabili.enabled = false;
//		fldLavorabili.transparent = false;
//		fldLavorabili.horizontalAlignment = SM_ALIGNMENT.CENTER;
//		var lblLavorabili = vcForm.newLabel('Lavorabili',260 + 60 * i,0,60,20);
//		lblLavorabili.name = 'lbl_lavorabili';
//		lblLavorabili.labelFor = fldLavorabili.name;
//		lblLavorabili.styleClass = 'table_header';
//		lblLavorabili.transparent = false;
//		lblLavorabili.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
		var fldLavorate = vcForm.newTextField('lavorate',xi + (offset * dx) + (r - 1) * dx * 7 + dxTot * (r - 1),dy,dxTot,dy); 
		fldLavorate.name = 'fld_lavorate_' + r;
		fldLavorate.styleClass = 'table';
		fldLavorate.editable = false;
		fldLavorate.enabled = false;
		fldLavorate.transparent = false;
		fldLavorate.horizontalAlignment = SM_ALIGNMENT.CENTER;
		var lblLavorate = vcForm.newLabel('Totale_' + r,xi + (offset * dx) + (r - 1) * dx * 7 + dxTot * (r - 1),0,dxTot,dy);
		lblLavorate.name = 'lbl_lavorate';
		lblLavorate.labelFor = fldLavorate.name;
		lblLavorate.styleClass = 'table_header';
		lblLavorate.transparent = false;
		lblLavorate.horizontalAlignment = SM_ALIGNMENT.CENTER;
		}
	}
		
    forms.giorn_visualizza_copertura.elements.tab_copertura.addTab(vtFormName);
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce gli identificativi delle fasce orarie appartenenti al raggruppamento desiderato
 *
 * @param {Number} [idRaggrFasce]
 * 
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"9BDA5666-A9EC-4C6F-A25A-665591091373"}
 */
function getFasceOrarieDaRaggruppamento(idRaggrFasce)
{
	/** @type Array<Number> */
	var arrFasce = [];
	
	/** @type {JSFoundset<db:/ma_presenze/e2fo_fasceraggruppamenti>}*/
	var fsFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE_RAGGRUPPAMENTI);
	if(fsFasce.find())
	{
		if(idRaggrFasce && idRaggrFasce > 0)
		{	fsFasce.iddittaraggruppamentofascia = idRaggrFasce;
			if(fsFasce.search())
			   arrFasce = globals.foundsetToArray(fsFasce,'idfasciaoraria');
		}
	}
	
	return arrFasce;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce i distinti codici alternativi (tipi turno) delle fasce selezionate
 * 
 * @param {Array<Number>} [arrFasce]
 * @return {Array<String>} 
 * 
 * @properties={typeid:24,uuid:"A5745336-EEB2-4471-B25A-5BE0BBB93AE4"}
 */
function getCodiciTurno(arrFasce)
{
	/** @type Array<Number> */
	var arrCodiciTurno = [];
	
	/** @type Array<String> */
	var arrCodiciTurnoDistinti = [];
	
	/** @type {JSFoundset<db:/ma_presenze/e2fo_fasceorarie>}*/
	var fsFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE);
	if(fsFasce.find())
	{
		if(arrFasce != null && arrFasce.length)
			fsFasce.idfasciaoraria = arrFasce;
		if(fsFasce.search())
		{
		   fsFasce.sort('codalternativo asc');	
		   arrCodiciTurno = globals.foundsetToArray(fsFasce,'codalternativo');	
		}
	}
	
	// recuperiamo solo i codici distinti
	for(var c = 0; c < arrCodiciTurno.length; c++)
	{
		if(arrCodiciTurnoDistinti.indexOf(arrCodiciTurno[c]) == -1 && arrCodiciTurno[c] != null)
			arrCodiciTurnoDistinti.push(arrCodiciTurno[c].toString());
	}
	
	return arrCodiciTurnoDistinti;
}

/**
 * Calcola la somma degli eventi sostitutivi che si avrebbero nel caso le richieste inserite
 * per il periodo indicato venissero approvate
 * 
 * @param {Number} idLav
 * @param {Date} dal
 * @param {Date} al
 * 
 * @properties={typeid:24,uuid:"CA036ECE-3D78-40FC-B894-EA961D81E1FF"}
 * @AllowToRunInFind
 */
function getTotaleOreSostitutiveRichieste(idLav,dal,al)
{
	var sqlSostRic = "SELECT LGT.idLavoratoreGiustificativoTesta FROM Lavoratori_GiustificativiTesta LGT \
	INNER JOIN Lavoratori_GiustificativiRighe LGR \
    ON LGT.idLavoratoreGiustificativoTesta = LGR.idLavoratoreGiustificativoTesta \
    WHERE LGT.idLavoratore = ? \
    AND LGT.Stato IS NULL \
    AND LGR.Giorno BETWEEN ? AND ?";
	var arrSostRic = [idLav,utils.dateFormat(dal,globals.ISO_DATEFORMAT),utils.dateFormat(al,globals.ISO_DATEFORMAT)];
	var dsSostRic = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,sqlSostRic,arrSostRic,-1);
	var totOreSostRichieste = 0;
	
	/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori_giustificativirighe>} */
	var fsRighe = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.RP_RIGHE);
	if(fsRighe.find())
	{
		fsRighe.idlavoratoregiustificativotesta = dsSostRic.getColumnAsArray(1);
		fsRighe.giorno = globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + globals.dateFormat(al,globals.ISO_DATEFORMAT) + "|yyyyMMdd"		
		var righeTotali = fsRighe.search();
		for(var r=1; r <= righeTotali; r++)
		{
			if(fsRighe.getRecord(r))
			{
				if(fsRighe.getRecord(r).giornointero)
				{
					var fascia = globals.getFasciaAssegnataGiorno(idLav,fsRighe.getRecord(r).giorno) 
                                 || globals.getFasciaProgrammataGiorno(idLav,fsRighe.getRecord(r).giorno)
		                         || globals.getFasciaTeoricaGiorno(idLav,fsRighe.getRecord(r).giorno);
		           totOreSostRichieste += (fascia.totaleorefascia / 100);
				}
				else
				   totOreSostRichieste += fsRighe.getRecord(r).ore;
			}
		}
	}
		
	return totOreSostRichieste;
}

/**
 * @param {Function} operazione
 * @param {String} form
 * @param {Array} [arrayGiorni]
 * @param {Array} [arrayDipendenti]
 * @param {Boolean} [conteggio]
 * @param {Function} [filterMethod]
 * @param {Number} [_idDitta]
 * @param {Number} [_periodo]
 * @param {String} [_tipoGiorn]
 * @param {String} [_nome_operazione]
 *
 * @properties={typeid:24,uuid:"59C226D5-7087-4EAF-B719-E28A28E110FD"}
 * @AllowToRunInFind
 */
function showOperazioneMultipla(operazione, form, arrayGiorni, arrayDipendenti, conteggio, 
	                            filterMethod,_idDitta,_periodo,_tipoGiorn,_nome_operazione)
{
	/** @type {Form<giorn_operazionemultipla>} */
	var formObj = forms[form];
	formObj.vOperation = operazione;
	formObj.vOperationArgs = [];
	
	if(_idDitta != null)
	   formObj.vOperationArgs.push(_idDitta);
	if(_periodo != null)
		formObj.vOperationArgs.push(_periodo);
	if(_tipoGiorn != null)
		formObj.vOperationArgs.push(_tipoGiorn);
		
	// Empty the days and employees tabs
	formObj.elements.giorni_tabless.removeAllTabs();
	formObj.elements.dipendenti_tabless.removeAllTabs();
	
	// Genera la form di selezione dei giorni, aggiungendo la checkbox di selezione multipla
	var giorniFormName = forms.giorn_operazionemultipla_mese.controller.getName();
	var giorniCloneName = giorniFormName + '_clone';
	
	var periodo = _periodo != null ? _periodo : globals.getPeriodo();
	/** @type {Date} */
	var firstDay = utils.parseDate(periodo.toString(10), globals.PERIODO_DATEFORMAT);
	var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
	var days = lastDay.getDate();
	
	var daysDs = databaseManager.createEmptyDataSet(0, ['checked', 'day']);
	for(var d = 0; d < days; d++)
	{		
		daysDs.addRow([0, new Date(firstDay.getFullYear(), firstDay.getMonth(), d + 1)]);
	}
	
	// Forse si potrebbe evitare ricostruendo semplicemente il datasource...
	var giorniForm;
	if(forms[giorniCloneName])
	{
		history.removeForm(giorniCloneName);
		solutionModel.removeForm(giorniCloneName);
	}
	
	giorniForm = solutionModel.cloneForm(giorniCloneName, solutionModel.getForm(giorniFormName));		
	giorniForm.dataSource = daysDs.createDataSource('giorniFormDs_' + application.getUUID(), [JSColumn.INTEGER, JSColumn.DATETIME]);
	giorniForm.getField('fld_giorno').dataProviderID = 'day';
	
	var giorniFormMs = globals.ma_utl_addMultipleSelection(giorniForm.name);
	if(arrayGiorni)
	{
		var giorniFs = forms[giorniFormMs.name].foundset;
			giorniFs.loadAllRecords();
			
		if(giorniFs.find())
		{
			giorniFs['_sv_rowid'] = arrayGiorni;
			giorniFs.search();
			
			var giorniFsUpdater = databaseManager.getFoundSetUpdater(giorniFs);
			giorniFsUpdater.setColumn('checked', 1);
			giorniFsUpdater.performUpdate();
			
			giorniFs.loadAllRecords();
		}		
	}
	// Set the tab with the modified form
	formObj.elements.giorni_tabless.addTab(giorniFormMs.name);
	
	var dipendentiFormName;
	if(globals.getTipologiaDitta(_idDitta != null ? _idDitta : forms.giorn_header.idditta) == globals.Tipologia.ESTERNA) 
		dipendentiFormName = forms.giorn_operazionemultipla_dipendenti_esterni.controller.getName();
	else
		dipendentiFormName = forms.giorn_operazionemultipla_dipendenti.controller.getName();
	
	var dipendentiForm = globals.ma_utl_addMultipleSelection(dipendentiFormName);
	
	if(filterMethod)
		filterMethod(forms[dipendentiForm.name].foundset);
	
	if(arrayDipendenti)
	{
		var dipendentiFs = forms[dipendentiForm.name].foundset;
			dipendentiFs.loadAllRecords();
		
		if(dipendentiFs.find())
		{
			dipendentiFs['idlavoratore'] = arrayDipendenti;
			dipendentiFs.search();
			
			var dipendentiFsUpdater =  databaseManager.getFoundSetUpdater(dipendentiFs);
			dipendentiFsUpdater.setColumn('checked', 1);
			dipendentiFsUpdater.performUpdate();
						
			dipendentiFs.loadAllRecords();
			
		}		
	}
	
	// Sort the foundset
	dipendentiFs.sort(function (x,y){
		if(x['nominativo'] > y['nominativo'])
			return 1;
		else
			return -1;
			
	});
	
	// Set the tab with the modified form
	formObj.elements.dipendenti_tabless.addTab(dipendentiForm.name);
	
	//
	formObj.vChkSoloNonConteggiati = 0;
	formObj.elements.chk_non_conteggiati.visible =  
		formObj.elements.lbl_non_conteggiati.visible = 
		formObj.elements.lbl_non_conteggiati.enabled =	conteggio != null ? conteggio : 0;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,formObj.controller.getName());	
	globals.ma_utl_showFormInDialog(formObj.controller.getName(), _nome_operazione ? _nome_operazione : 'Operazione multipla');

}

/**
 * Restituisce un array con gli identificativi degli eventi bloccanti per la chiusura
 * 
 * @return {Array<Number>}
 *
 * @properties={typeid:24,uuid:"9A19A362-2CCA-43B5-9848-AAFC32CA7548"}
 * @AllowToRunInFind
 */
function getEventiDaDefinire()
{
	/**@type {Array<Number>}*/
	var arrEvDaDef = [];
	
	/** @type {JSFoundSet<db:/ma_presenze/e2eventi>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.EVENTI);
	
	if(fs.find())
	{
		fs.bloccantechiusura = 1;
		
		fs.search();
		arrEvDaDef = globals.foundsetToArray(fs,'idevento');
	}
	
	return arrEvDaDef;
}