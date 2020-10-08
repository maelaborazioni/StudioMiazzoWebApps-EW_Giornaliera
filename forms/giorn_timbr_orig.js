/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EBCE17CC-0062-427E-923F-E39A0F3F6060",variableType:4}
 */
var _currInd = -1;

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E34DD6B3-3FA4-4CAE-A2A2-76631818DDC6"}
 */
function onRenderTimbr(event) 
{
	var recInd = event.getRecordIndex();
	var recRen = event.getRenderable();
	var recCol = event.getRecord();
	var disabled = false;
   
	// Confronta anno e mese (0 e 1) con quelli attivati (7 e 8)
	if(globals.getAnno() != globals.getAnnoAttivo() || globals.getMese() != globals.getMeseAttivo())
		disabled = true;
	
	if(disabled || recInd <= globals.offsetGg ||
			recCol['idgiornaliera'] == null && recCol['anomalie'] == 0 && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET)
	{
		recRen.bgcolor = '#767676';
		recRen.fgcolor = '#333333';
		recRen.enabled = false;
		
		return;
	}
	
	if(recCol != null)
	{
		switch (recCol['nomegiorno'])
		{
			case 'SA':
				//caso giorno = sabato
				if(!event.isRecordSelected())
		        	recRen.bgcolor = globals.Colors.SATURDAY.background;
		        break;

		    case 'DO':
		    	//caso giorno = domenica, in realtà dovrebbe dipendere dalla fascia oraria
				if(!event.isRecordSelected())
	                recRen.bgcolor = globals.Colors.SUNDAY.background;
		        break;
	   }
		
	   if(recCol['checked'])
		   recRen.font = 'Arial,1,11';	   
	   
	   if(recCol['festivo'])
	   {
			if(!event.isRecordSelected())
				recRen.bgcolor = globals.Colors.HOLYDAYS.background;	// darker than sat/sun
	       
	       recRen.fgcolor = globals.Colors.HOLYDAYS.foreground;	// white
	   }
	   	   
	   switch (recCol['anomalie']) 
	   {
		   case 1:
		   case 2:
		      if(!event.isRecordSelected())
				   recRen.fgcolor = '#0000FF'; // blue
		      recRen.font = 'Arial,2,11';   
		      break;
		   case 4:
		   case 5:
		   case 6:
		   case 8:
		   case 9:
		   case 10:
		   case 13:
		   case 14:	   
			   if(!event.isRecordSelected())
				   recRen.fgcolor = '#FF0000'; // red
				   
			   recRen.font = 'Arial,2,11';
			   break;
			   			
		   default:
			   break;
		}
	   	
	}
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2F1654A1-F74E-4ADB-B29A-56CF6902ABD6"}
 * @AllowToRunInFind
 */
function onRecordSelection(event, _form) 
{
	if(foundset.getSize() == 0)
		return;

	forms.giorn_mostra_timbr.foundset.loadRecords(foundset['idgiornaliera'])
	
	var _anno = globals.getAnno();
	var _mese = globals.getMese();
	var _giorno = parseInt(foundset['giornomese'],10);

	globals.aggiornaGiornoTimbrature(foundset['idgiornaliera']);
    
	calcolaRiepTimbr(_anno, _mese, _giorno);	
}

/**  
 * Calcola la somma delle ore lavorate nella giornata sulla base delle timbrature
 * e ne disegna il riepilogo
 * 
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {number} _giorno
 * 
 * @properties={typeid:24,uuid:"23D541B7-38F2-434F-A35D-E60F1A61D0DA"}
 */
function calcolaRiepTimbr(_anno,_mese,_giorno){
	
	var _trFormName = 'giorn_mostra_timbr_riepilogo_tbl'
	var _trFormNameTemp = 'giorn_mostra_timbr_riepilogo_tbl_temp'
	var _idDip = forms.giorn_header.foundset.idlavoratore ? forms.giorn_header.foundset.idlavoratore 
			                                                : forms.giorn_cart_header.idlavoratore;
	var _gg = 10000 * _anno + 100 * _mese + _giorno; 
    var _ggPrec ;
	if(_giorno != 1)
		_ggPrec = _gg - 1;
	else{
		if(_mese == 1)
		   _ggPrec = 10000 * (_anno - 1) + 100 * 12 + 31;
		else
		   _ggPrec = 10000 * _anno + 100 * (_mese - 1) + globals.getTotGiorniMese(_mese-1,_anno); 
		
	}
	
	var _timbrQuery = " SELECT * FROM E2Timbratura \
						WHERE \
							(idDip = ?)	AND (LEFT(Timbratura, 8) = ?) AND (TimbEliminata = 0) AND (GGSucc = 1) \
						OR \
							(idDip = ?)	AND (LEFT(Timbratura, 8) = ?) AND (TimbEliminata = 0) AND (GGSucc = 0) \
						ORDER BY \
							Timbratura";
							
    var _timbrArr = [_idDip, _ggPrec, _idDip, _gg]
    
	var _trDataSetTimbrGiorno = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE, _timbrQuery, _timbrArr, -1)

	var arrCurrGiorno = new Array()
	var _arInd = -1
	var _trSenso = false
	var _trSensoPrec = false
	var _trSensoCamb = false

	/** @type {Number}*/
	var _trTimbr = -1
	/** @type {String}*/
	var _timbrPrec = ''
	/** @type {String}*/
	var _timbr = ''
	/** @type {String}*/
	var _timbrOreMin = ''
	/** @type {Object} */
	var _objOre 
	/** @type {Number} */
	var _minuti
	/** @type {String} */
	var delta = '0000'
	/** @type {String} */
	var totOrario = '0000'

	
	for (var i = 1; i <= _trDataSetTimbrGiorno.getMaxRowIndex(); i++) {

		_trTimbr = _trDataSetTimbrGiorno.getValue(i, 5)
		_trSenso = _trDataSetTimbrGiorno.getValue(i, 4)
		_trSensoCamb = _trDataSetTimbrGiorno.getValue(i, 7)
		_timbr = utils.stringLeft(utils.stringRight(_trTimbr.toString(), 4), 2) + ':' + utils.stringRight(utils.stringRight(_trTimbr.toString(), 4), 2)
		_objOre = globals.getOreEffettiveDaTimbr(_trTimbr.toString(),0)
		_minuti = globals.getMinDaTimbrFormattata(_trTimbr)
		_timbrOreMin = _objOre.ore + '.' + _minuti
		if (i > 1) {

			if ( (!_trDataSetTimbrGiorno.getValue(i - 1, 4) && !_trDataSetTimbrGiorno.getValue(i - 1, 7)) || (_trDataSetTimbrGiorno.getValue(i - 1, 4) && _trDataSetTimbrGiorno.getValue(i - 1, 7)))
				_trSensoPrec = 0
			else
				_trSensoPrec = 1

		}

		//timbratura in entrata
		if ( (!_trSenso && !_trSensoCamb) || (_trSenso && _trSensoCamb)) {

			arrCurrGiorno.push(new Array(3))
			_arInd = arrCurrGiorno.length - 1
			arrCurrGiorno[_arInd][0] = _timbrOreMin
			_timbrPrec = _timbrOreMin
			arrCurrGiorno[_arInd][1] = '--.--'
			arrCurrGiorno[_arInd][2] = '--.--'

			if (i > 1 && !_trSensoPrec)
				totOrario = '----'
		}
		//timbratura in uscita
		else {
			if (i == 1) {

				arrCurrGiorno.push(new Array(3))
				_arInd = arrCurrGiorno.length - 1
				arrCurrGiorno[_arInd][0] = '--.--'
				arrCurrGiorno[_arInd][1] = _timbrOreMin
				arrCurrGiorno[_arInd][2] = '--.--'
				totOrario = '----'

			} else {
				//la timbratura precedente era una entrata
				if (!_trSensoPrec) {

					arrCurrGiorno[_arInd][1] = _timbrOreMin
					delta = deltaOrario(_timbr, _timbrPrec)
					arrCurrGiorno[_arInd][2] = utils.stringLeft(delta, 2) + ':' + utils.stringRight(delta, 2)
					totOrario = totaleOrario(totOrario, delta)
				}
				//la timbratura precedente era un'altra uscita
				else {
					arrCurrGiorno.push(new Array(3))
					_arInd = arrCurrGiorno.length - 1
					arrCurrGiorno[_arInd][0] = '--.--'
					arrCurrGiorno[_arInd][1] = _timbrOreMin
					arrCurrGiorno[_arInd][2] = ''
					totOrario = '----'
				}
			}
		}

	}

	var _trDataSetTimbrRiep = databaseManager.createEmptyDataSet(0, new Array('Entrata', 'Uscita', 'Totale'))

	//arrCurrGiorno.push(new Array('', '', utils.stringLeft(totOrario,2) + ':' + utils.stringRight(totOrario,2)))
	forms.giorn_mostra_timbr_riepilogo.elements.lbl_mostra_timbr_riep_totale.text = utils.stringLeft(totOrario, 2) + ' Ore - ' + utils.stringRight(totOrario, 2) + ' Minuti'

	for (var tr = 0; tr < arrCurrGiorno.length; tr++) {

		_trDataSetTimbrRiep.addRow(tr + 1, arrCurrGiorno[tr])

	}

	var _trDataSourceTimbrRiep = _trDataSetTimbrRiep.createDataSource('_trDataSetTimbrRiep', [JSColumn.TEXT, JSColumn.TEXT, JSColumn.TEXT])

	if (forms[_trFormNameTemp] == null) 
	{
		forms.giorn_mostra_timbr_riepilogo.elements.tab_timbr_riepilogo_tbl.removeAllTabs();
		history.removeForm(_trFormNameTemp);
		solutionModel.removeForm(_trFormNameTemp);
	
	    var tempForm = solutionModel.cloneForm(_trFormNameTemp, solutionModel.getForm(_trFormName));
        tempForm.dataSource = _trDataSourceTimbrRiep;
		//solutionModel.getForm(_trFormNameTemp).dataSource = _trDataSourceTimbrRiep
	    solutionModel.getForm(_trFormNameTemp).getField('fld_entrata').dataProviderID = 'Entrata'
	    solutionModel.getForm(_trFormNameTemp).getField('fld_uscita').dataProviderID = 'Uscita'
	    solutionModel.getForm(_trFormNameTemp).getField('fld_totale').dataProviderID = 'Totale'

	    forms.giorn_mostra_timbr_riepilogo.elements.tab_timbr_riepilogo_tbl.addTab(_trFormNameTemp, '', 'Riepilogo mese', '', null, '#000000', '#BBCCEE', 1)
	}
}

/**
 *
 * @param {String} _delta
 * @param {String} _totOrPrec
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"FB99F45A-09C3-4ACE-AC97-C61054680664"}
 */
function totaleOrario(_totOrPrec, _delta) {

	if(_totOrPrec == '----')
		
		return '----'
	
	else{	
		
		var tH = parseInt(utils.stringLeft(_delta, 2), 10)
		var tM = parseInt(utils.stringRight(_delta, 2), 10)
		var tpH = parseInt(utils.stringLeft(_totOrPrec, 2), 10)
		var tpM = parseInt(utils.stringRight(_totOrPrec, 2), 10)
		var deltaH = -1
		var deltaM = -1
		var dH = ''
		var dM = ''

		if ( (tM + tpM) > 60) {

			tH = tH + 1
			tM = tM - 60
		}

		deltaH = (tH + tpH)
		deltaM = (tM + tpM)

		if (deltaH < 10)
			dH = '0' + deltaH.toString()
		else
			dH = deltaH.toString()

		if (deltaM < 10)
			dM = '0' + deltaM.toString()
		else
			dM = deltaM.toString()

		return dH + dM
	}
}

/**
 * Calcola il delta dell'orario
 *
 * @param {String} _timbr
 * @param {String} _timbrPrec
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"CAD0B192-9D5B-4EB6-AC38-B49DF90DB995"}
 */
function deltaOrario(_timbr, _timbrPrec) {

	var tH,tM,tpH,tpM
	var deltaH = -1
	var deltaM = -1
	var dH = ''
	var dM = ''

	if (_timbr == '--.--' || _timbrPrec == '--.--')
	    return '----'
	
	tH = parseInt(utils.stringLeft(_timbr, 2), 10)
	tM = parseInt(utils.stringRight(_timbr, 2), 10)
	tpH = parseInt(utils.stringLeft(_timbrPrec, 2), 10)
	tpM = parseInt(utils.stringRight(_timbrPrec, 2), 10)
	
	
	if ( (tM - tpM) < 0) {

		tM = tM + 60
		tH = tH - 1
	}

	deltaH = (tH - tpH)
	deltaM = (tM - tpM)

	if (deltaH < 10)
		dH = '0' + deltaH.toString()
	else
		dH = deltaH.toString()

	if (deltaM < 10)
		dM = '0' + deltaM.toString()
	else
		dM = deltaM.toString()

	return dH + dM
	//return 'Ore : ' + deltaH.toString() + ' - Minuti : ' + deltaM.toString()
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"336F98B2-BB60-4B96-ABF2-BD60156DA4EE"}
 */
function selezionaGiornoTimb(event) {
	
	/** @type {Array} */
	var _arrSelOrd;
	/** @type {Array}*/
	var _oldArrSel = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel;
	/** @type {Array}*/
	var _newArrSel = [];
	/** @type {Number}*/
	var _oldArrSize = _oldArrSel.length;
	
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = foundset.getSelectedIndex();
	
	if(foundset['checked'] == 1)
	{
		if(_oldArrSel.lastIndexOf(foundset.getSelectedIndex() - globals.offsetGg) == -1)
		{
		   _oldArrSel.push(foundset.getSelectedIndex() - globals.offsetGg);
		   _arrSelOrd = globals.mergeSort(_oldArrSel);
		   globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = _arrSelOrd;
		}
		
	} else {
		
		for (var i=0; i<_oldArrSize; i++){			
			if(_oldArrSel[i] != (foundset.getSelectedIndex() - globals.offsetGg)){				
                _newArrSel.push(_oldArrSel[i]);					
		    }		
		}
		_arrSelOrd = globals.mergeSort(_newArrSel);
		globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = _arrSelOrd;	
	}
		
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *  
 * @AllowToRunInFind
 * @properties={typeid:24,uuid:"B5E6162F-B171-49E2-8540-C724372DA440"}
 */
function lkpModificaTimbrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event){
	
   var _fsTimbr = forms['giorn_timbr_temp'].foundset 	
   var _fs = forms['giorn_modifica_timbr'].foundset
   var _fsRel = forms['giorn_modifica_timbr_tbl'].foundset
   
   var _anno = globals.getAnno()
   var _mese = globals.getMese()
   var _giorno = parseInt(_fsTimbr.getSelectedRecord()['giornomese'],10)	
   var _iddip = forms.giorn_header.idlavoratore
   var _giornoInizio = ((_anno * 100000000) + (_mese) * 1000000 + _giorno * 10000)
   var _giornoFine = ((_anno * 100000000) + (_mese) * 1000000 + (_giorno + 1) * 10000) - 1
   
   _fsRel.clear()
   _fs.clear()
   
   _fs.removeFoundSetFilterParam('ftr_timbrIdDip')
   _fs.removeFoundSetFilterParam('ftr_timbrGiornoFine')
   _fs.removeFoundSetFilterParam('ftr_timbrGiornoInizio')
   
   _fs.addFoundSetFilterParam('iddip','=',_iddip,'ftr_timbrIdDip')
   _fs.addFoundSetFilterParam('timbratura','<=',_giornoFine,'ftr_timbrGiornoFine')
   _fs.addFoundSetFilterParam('timbratura','>=',_giornoInizio,'ftr_timbrGiornoInizio')
      
   _fs.loadAllRecords()
   _fsRel.loadAllRecords()
   
   //globals.svy_nav_showLookupWindow(_event,"",'LEAF_Show_ModificaTimbr',"AggiornaTimbratureGiorno","FiltraTimbratureGiorno",_params,null,"",true)
   var winLkpModTimbr = application.createWindow('win_modifica_timbr',JSWindow.MODAL_DIALOG)
   winLkpModTimbr.title = 'Gestione timbrature del giorno ' + globals.getNomeInteroGiorno(new Date(_anno,_mese-1,_giorno))+ ' ' + _fsTimbr.getSelectedRecord()['giornomese'] + ' ' + globals.getNomeMese(_mese) + ' ' + _anno
   winLkpModTimbr.setInitialBounds(JSWindow.DEFAULT,JSWindow.DEFAULT,505,205)	   
   winLkpModTimbr.show(forms['giorn_modifica_timbr'])

}

/**
 * // TODO generated, please specify type and doc for the params 
 * @param {JSFoundset} _fs
 *
 * 
 * @properties={typeid:24,uuid:"782284AF-FEDE-4EB9-9EFE-55CAF54935FE"}
 */
function FiltraTimbratureGiorno(_fs){
	
//	/** @type {Date} */
//	var day = forms['giorn_mostra_timbr_gestione'].foundset['giorno']
//	/** @type {Number} */
//	var day_from
//	/** @type {Number} */
//	var day_to
//	
//	day_from = day.getFullYear()*100000000 + (day.getMonth()+1)*1000000 + day.getDate()*10000 
//	day_to = day.getFullYear()*100000000 + (day.getMonth()+1)*1000000 + (day.getDate()+1)*10000
//	
//	_fs.addFoundSetFilterParam('iddip','=',forms['giorn_header']['iddip'])
//	_fs.addFoundSetFilterParam('timbratura','>=',day_from)
//	_fs.addFoundSetFilterParam('timbratura','<=',day_to)
   _fs = forms.giorn_vista_mensile_timbr_tbl.foundset.duplicateFoundSet()
   return _fs	
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"9551BF5F-7C5D-4650-90F4-792B33B9C5E3"}
 */
function AggiornaTimbratureGiorno(_rec){
	
	forms['giorn_mostra_timbr'].preparaTimbratura(forms['giorn_mostra_timbr_gestione_2'].foundset['giorno'].getFullYear(),forms['giorn_mostra_timbr_gestione_2'].foundset['giorno'].getMonth()+1)	
	
}

/**
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"98A1AA76-10CC-4591-87F6-E04D341EDB77"}
 * @AllowToRunInFind
 */
function apriPopupMostraTimbr(_event)
{
    var _enableGgSucc = true;
    var _enableGgPrec = true;
    
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>} */
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);

	// nel caso di timbratura con senso di entrata va disabilitata l'opzione di spostamento al giorno prec
	// nel caso di timbratura con senso di uscita va disabilitata l'opzione di spostamento al giorno succ
	if (_fs.find()) {
		_fs.idtimbrature = forms[_event.getFormName()].foundset[_event.getElementName()];
		if (_fs.search() > 0) {
			
			var _timbHhmm = utils.stringRight(_fs.timbratura.toString(),4);
			var _timbHh = utils.stringLeft(_timbHhmm,2);
			var _timbMm = utils.stringRight(_timbHhmm,2);
			
			var timbHhmm = parseInt(_timbHh,10) * 100 + parseInt(_timbMm,10);
			
			// caso entrata
			if(_fs.senso == 0 && _fs.sensocambiato == 0 ||
					_fs.senso == 1 && _fs.sensocambiato == 1)
				_enableGgPrec = false;	
			// caso uscita
			else
			{
				if(timbHhmm >= 2400)
				{
					_enableGgSucc = true;
					_enableGgPrec= false;
				}
				else
				{
					_enableGgSucc = false;
					_enableGgPrec= true;
				}
		
			}
		}
	}
	
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	
	var _popUpMenuTimbr = _popUpMenu.addMenu('Gestione timbrature ');
//	var _gestTimbr = _popUpMenuTimbr.addMenuItem('Apri gestione timbrature ',gestisciTimbrature);
//	    _gestTimbr.methodArguments = [_event];
	var _addTimbr = _popUpMenuTimbr.addMenuItem('Aggiungi una timbratura ',aggiungiTimbraturaDaMenu);
		_addTimbr.methodArguments = [_event];
	var _addTimbrMulti = _popUpMenuTimbr.addMenuItem('Aggiungi timbrature multiple ',aggiungiTimbratureMultiDaMenu);
		_addTimbrMulti.methodArguments = [_event];	
	var _modTimbr = _popUpMenuTimbr.addMenuItem('Modifica la timbratura selezionata ',modificaTimbraturaDaMenu);
	    _modTimbr.methodArguments = [_event];
	var _delTimbr = _popUpMenuTimbr.addMenuItem('Elimina la timbratura selezionata ',eliminazioneTimbratura);
	    _delTimbr.methodArguments = [_event];
	var _sensoTimbr = _popUpMenuTimbr.addMenuItem('Cambia il senso della timbratura',cambiaSenso);
	    _sensoTimbr.methodArguments = [_event];
	var _ggSuccTimbr = _popUpMenuTimbr.addMenuItem('Sposta al giorno successivo',spostaGgSucc);
	    _ggSuccTimbr.enabled = _enableGgSucc;
	    _ggSuccTimbr.methodArguments = [_event];
	var _ggPrecTimbr = _popUpMenuTimbr.addMenuItem('Sposta al giorno precedente',spostaGgPrec);
	    _ggPrecTimbr.enabled = _enableGgPrec;
	    _ggPrecTimbr.methodArguments = [_event];	    
	
    _popUpMenu.addSeparator();
	
	var _popUpMenuConteggia = _popUpMenu.addMenu('Conteggio timbrature ');
	var _item3 = _popUpMenuConteggia.addMenuItem('Conteggia il singolo dipendente ', conteggiaTimbratureSingolo);
	    _item3.methodArguments = [_event];
	var _item3_1 = _popUpMenuConteggia.addMenuItem('Scegli i dipendenti da conteggiare ', conteggiaTimbratureMultiplo);
	    _item3_1.methodArguments = [_event];    
 	
	_popUpMenu.addSeparator();
	
	/** @type {String} */
	var giorno = forms[_event.getFormName()].foundset.getSelectedRecord()['giornomese'];
		giorno = giorno.replace(/^0/, '');
		
	var _item4 = _popUpMenu.addMenuItem('Ripristina timbrature del giorno',ripristinaTimbratureGiorno);
	    _item4.methodArguments = [_event, parseInt(giorno)];
	var _item5 = _popUpMenu.addMenuItem('Rendi i giorni riconteggiabili', rendiGiorniRiconteggiabili);
		_item5.methodArguments = [_event, parseInt(giorno)];
	
	_popUpMenu.addSeparator();
	
	var _item6 = _popUpMenu.addMenuItem('Imposta fasce forzate multiple',impostaFasceForzateMultiple);
	    _item6.methodArguments = [_event];
	
	_popUpMenu.addSeparator();
	    
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
 *
 * @properties={typeid:24,uuid:"6B220D7B-79EC-439D-85B2-83747FD0A323"}
 */
function autorizzaTimbratureDipendenti(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"7BC2727B-E5FA-4101-B331-6AB5280D7206"}
 */
function gestisciTimbrature(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    globals.ma_utl_showFormInDialog('giorn_modifica_timbr_tab','Gestisci timbrature');
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Boolean} [_soloCartolina]
* 
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"A3865F50-B5BB-4387-B674-D6A24291A393"}
 */
function aggiungiTimbraturaDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_soloCartolina)
{
	aggiungiTimbratura(_event,_soloCartolina);
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Boolean} [_soloCartolina]
* 
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"D50B7438-30AF-4317-977E-3D03867CAA5D"}
 */
function aggiungiTimbratureMultiDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_soloCartolina)
{
	var frm = forms.giorn_aggiungi_timbr_tab;
	_soloCartolina ? frm.vSoloCartolina = true : frm.vSoloCartolina = false;
	frm.vSelectedGiorno = foundset.getSelectedIndex() - globals.offsetGg;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Timbrature multiple');
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSEvent} _event
 * @param {Boolean} [_soloCartolina]
 * 
 * @properties={typeid:24,uuid:"EF7F48F4-7689-4D92-AB74-196C46BC0153"}
 */
function aggiungiTimbratura(_event,_soloCartolina)
{
    databaseManager.setAutoSave(false);
	
    var _idLav = _soloCartolina ? forms.giorn_cart_header.idlavoratore : forms.giorn_header.idlavoratore;
    var _nrBadge = _soloCartolina ? forms.giorn_cart_header._vNrBadge : forms.giorn_header._vNrBadge;
    var _frm = forms.giorn_modifica_timbr_dtl;
    _soloCartolina ? _frm._solocartolina = true : _frm._solocartolina = false;
    
	if (_nrBadge != null)
	{
		/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
		var _fs = _frm.foundset;
		
		databaseManager.startTransaction();

		if(_fs.newRecord(false) == -1)
		{
			globals.ma_utl_showErrorDialog('Errore durante l\'aggiunta della nuova timbratura','Aggiungi una timbratura alla giornata');
			databaseManager.rollbackTransaction();
			return;
		}

		_frm._gg = foundset.getSelectedIndex() - globals.offsetGg;
		_frm._MM = globals.getMese();
		_frm._yy = globals.getAnno();
		_frm._ggSucc = false;
		_frm.elements.fld_senso.enabled = true;
		_frm.elements.fld_ggsucc.enabled = true;

		_fs.iddip = _idLav;
		_fs.nr_badge = _nrBadge;
		_fs.idgruppoinst = globals.getGruppoInstallazione();

		if (_soloCartolina)
			_frm._senso = utils.stringLeft(_event.getElementName(), 1) == 'e' ? 0 : 1;
			globals.ma_utl_setStatus(globals.Status.EDIT, _frm.controller.getName());
			globals.ma_utl_showFormInDialog(_frm.controller.getName(), 'Aggiungi una timbratura alla giornata');
		
	}
	else 		
		globals.ma_utl_showWarningDialog('Il dipendente non ha un numero di badge valido', 'Modifica timbrature');
	
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"DFB23F8B-AB34-4F2E-897A-B0529CB09ABF"}
 */
function modificaTimbraturaDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	modificaTimbratura(_event);
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"6AA33F2B-06F5-4E0F-B426-28C2D8C165C0"}
 */
function modificaTimbratura(_event) {

	databaseManager.setAutoSave(false);

	if (forms.giorn_header._vNrBadge != null)
	{
		var _frm = forms.giorn_modifica_timbr_dtl;
		/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
		var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
			                                  globals.Table.TIMBRATURE);
		var _timbrOri = null;
		var _sensoOri = null;
		var _ggSuccOri = null;
		var _orologioOri = null;
        var _competenzaGGPrec = false;
		
		//recupero l'id della timbratura selezionata
		var _idTimbrature = foundset[_event.getElementName()];
		var _rows = -1;
		if (_idTimbrature != null) 
		{
			if (_fs.find()) 
			{
				_fs.idtimbrature = _idTimbrature;
				_rows = _fs.search();
			} 
			else
			{
				globals.ma_utl_showErrorDialog('Cannot go to find mode', 'Servoy error');
				globals.svy_mod_closeForm(_event);
				return;
			}

			// la timbratura trovata va eliminata (viene posto a 1 il flag di eliminazione)
			// si costruiscono i dati per l'inserimento della nuova timbratura
			if (_rows > 0) 
			{
				_fs.timbeliminata = 1;
				_frm._isModifica = true;
				_frm._idTimbratura = _fs.idtimbrature;
				_frm._gg = globals.getGiornoDaTimbr(_fs.timbratura.toString());
				_frm._MM = globals.getMeseDaTimbr(_fs.timbratura.toString());
				_frm._yy = globals.getAnnoDaTimbr(_fs.timbratura.toString());
				_timbrOri = _fs.timbratura;
				_sensoOri = _fs.senso;
				_ggSuccOri = _fs.ggsucc;
				_orologioOri = _fs.indirizzo;
                globals.getOreDaTimbr(_timbrOri)*100 + globals.getMinDaTimbr(_timbrOri) > 2400 ?
                		_competenzaGGPrec = true : _competenzaGGPrec = false;
				
			} else {
				globals.ma_utl_showErrorDialog('Recupero della timbratura da modificare non riuscita', 'Modifica timbratura');
				return;
			}

		}
		// se non si riesce a recuperare l'id significa che si sta cercando di inserire una nuova timbratura 
		else 
		{
			aggiungiTimbratura(_event);
			return;
		}
		
		// inizio della transazione (verrà completata od annullata in base alla conferma od annullamento dalla finestra che 
		// verrà aperta)
		databaseManager.startTransaction();

		var _frmFs = _frm.foundset;
		
		_frmFs.newRecord();

		_frmFs.timbratura = _timbrOri;
		_frmFs.senso = _sensoOri != null ? _sensoOri : 0;
		_frmFs.indirizzo = _orologioOri;
		_frm._ggSucc = _frmFs.ggsucc = _ggSuccOri;
		_frm.elements.fld_senso.enabled = false;
		_frm.elements.fld_ggsucc.enabled = false;
		_frm._competenzaGGPrec = _competenzaGGPrec;
		_frmFs.iddip = forms.giorn_header.idlavoratore;
		_frmFs.nr_badge = forms.giorn_header._vNrBadge;
		_frmFs.idgruppoinst = globals.getGruppoInstallazioneLavoratore(forms.giorn_header.idlavoratore);
		
		globals.ma_utl_setStatus(globals.Status.EDIT, _frm.controller.getName());
		globals.ma_utl_showFormInDialog(_frm.controller.getName(), 'Modifica la timbratura selezionata');

	} else
		globals.ma_utl_showWarningDialog('Il dipendente non ha un numero di badge valido', 'Modifica timbrature');

}

/**
* Elimina la timbratura selezionata
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"C3D2F97B-8472-4C5E-B2D5-F84C7114A50C"}
 * @AllowToRunInFind
 */
function eliminazioneTimbratura(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event) {
	
	databaseManager.setAutoSave(false);

	//recupero l'id della timbratura selezionata
	var _idTimbrature = foundset[_event.getElementName()];

	if (_idTimbrature) {

		if(eliminaTimbratura(_idTimbrature))
		{
			var anno = globals.getAnno();
			var mese = globals.getAnno();
			var _giorno = forms['giorn_timbr_temp'].foundset.getSelectedIndex() - globals.offsetGg;
			var data = new Date(anno,mese-1,_giorno);
			
			// analizza pre conteggio
			forms.giorn_timbr.analizzaPreConteggio(_giorno);
			
			if(globals.getAnomalieGiornata(forms.giorn_header.idlavoratore,utils.dateFormat(data,globals.ISO_DATEFORMAT)) == 0)
		    {
		       	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
				if(_respRiconteggia)
				   globals.conteggiaTimbrature([forms.giorn_header.idlavoratore],[_giorno]);
				else
				   forms.giorn_header.preparaGiornaliera();
		    }
		    else
				forms.giorn_header.preparaGiornaliera();
			
			globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		}
		
	} else
		globals.ma_utl_showWarningDialog('Nessuna timbratura da eliminare', 'Eliminazione timbrature');
}


/**
 * @AllowToRunInFind
 * 
 * @param {Number} idTimbratura
 * @param {Boolean} [bSilenzioso]
 * 
 * @return {Boolean}
 * 
 * @properties={typeid:24,uuid:"E41E4B29-C2D6-4B53-BCB1-D29D68081912"}
 */
function eliminaTimbratura(idTimbratura,bSilenzioso)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>} */
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);

	if (_fs.find())
	{
		_fs.idtimbrature = idTimbratura;
		if (_fs.search() > 0) {
			
			var response = false; 
			
			if(bSilenzioso)
				response = true;
			else
			    response = globals.ma_utl_showYesNoQuestion('Eliminare la timbratura delle ore ' +
			    	                                  _fs.timbratura_oremin + ' per il giorno '+ 
													  globals.getNumGiorno(_fs.giorno) + ' ' +
													  globals.getNomeMese(_fs.giorno.getMonth() + 1) + ' ' +
													  _fs.giorno.getFullYear() +
													  ' ?', 'Eliminazione timbratura');

			if (response) 
			{
				var success;
				
				if(_fs.indirizzo == 'mn')
					success = _fs.deleteRecord();
				else
				{
					databaseManager.startTransaction();
				    _fs.timbeliminata = 1;
                    success =  databaseManager.commitTransaction(); 
				    if (!success)
				      databaseManager.rollbackTransaction(true);
				}
				
				if(!success)
					globals.ma_utl_showWarningDialog('Errore durante l\'eliminazione, si prega di riprovare', 'Eliminazione timbratura');
					
				return success;
			}
			return false;
			
		} else
		{
			globals.ma_utl_showWarningDialog('Recupero timbratura da eliminare non riuscito', 'Eliminazione timbrature');
	        return false;
		}
	}else
	{
		globals.ma_utl_showWarningDialog('Cannot go to find mode', 'Eliminazione timbrature');
        return false;
	}
}

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"D2B70F01-15C9-47AE-B489-DFFF6518EA8D"}
 */
function onShowForm(_firstShow, _event) 
{
	//abilita la selezione dei giorni
	controller.readOnly = false;
	
	if(!globals.isAttiva())
	{		
		var fields = elements.allnames;    	
	    for(var f = 0; f < fields.length; f++)
	    {
	    	elements[f].enabled = false;
	    }
	}
	
	if(!globals.checkForConcurrentOperations(security.getUserName(),
		                                     forms.giorn_header.idditta ? forms.giorn_header.idditta : forms.giorn_cart_header.idditta,
		                                     forms.giorn_header.idditta ? forms.giorn_header.idlavoratore : forms.giorn_cart_header.idlavoratore,
		                                     globals.getPeriodo()))
		return;
	
	updateFromDatabase();
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
 * @properties={typeid:24,uuid:"E9498D3E-E8A8-4021-ACB4-AF679980D304"}
 */
function onDataChangeCheck(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	forms['giorn_timbr_temp'].foundset['checked'] = newValue;
	return true
}

/**
*
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {String} _giorno il giorno selezionato
* 
* @properties={typeid:24,uuid:"C2BB2BB3-6AA3-4BED-9300-472D2914B9B7"}
*/
function rendiGiorniRiconteggiabili(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _giorno)
{
	var giorniSelezionati = globals.getGiorniSelezionatiTimbr();
	    giorniSelezionati = giorniSelezionati.length > 0 && giorniSelezionati || [_giorno];
	
	var _numGG = globals.getTotGiorniMese(globals.getMese(),globals.getAnno());
	var msg = _numGG == giorniSelezionati.length ? 'Rendere riconteggiabili tutti i giorni del mese?' : 'Rendere riconteggiabili i giorni : <br/>' + giorniSelezionati + '?';    
	    
	var answer = globals.ma_utl_showYesNoQuestion(msg, 'Rendi i giorni riconteggiabili');
	if (answer)
	{
		var url = globals.WS_STAMPING + '/Stamping32/Recount'
		var params =
		{
			idditta				:	forms.giorn_header.idditta,
			periodo				:	globals.getPeriodo(),
			giorniselezionati	:	giorniSelezionati,
			iddipendenti		:	[forms.giorn_header.idlavoratore],
			tipoconnessione     :   globals._tipoConnessione
		};
		
		var response = globals.getWebServiceResponse(url, params);
		if (response && response.ReturnValue === true)
			forms.giorn_header.preparaGiornaliera();
		else
			globals.ma_utl_showWarningDialog('Non tutti i giorni potrebbero essere stati resi riconteggiabili, controllare e riprovare','Rendi i giorni riconteggiabili');
	}
	
}

/**
 * 
 * @param {Number} giorno
 * @param {Number} [idLav]
 * @param {Number} [periodo]
 * 
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"9D5A36C7-FDCA-4F56-A77A-B7A9BBC7C74B"}
 */
function analizzaPreConteggio(giorno,idLav,periodo)
{
    var  url = globals.WS_CALENDAR + "/Calendar32/PreCountingAnalisys";
    
    var params = {
    	iddipendenti : idLav ? [idLav] : [forms.giorn_header.idlavoratore],
		giorniselezionati : [giorno],
		periodo : periodo ? periodo : globals.getAnno() * 100 + globals.getMese(),
		tipoconnessione : globals._tipoConnessione
    };
    
    if(idLav) params.idditta = globals.getDitta(idLav);
    
    var _responseObj = globals.getWebServiceResponse(url,params);
	
	if(_responseObj != null){
					   					
		if(_responseObj.ReturnValue == true)
			return true;
		else
			return false;
			
	}else				
		globals.ma_utl_showErrorDialog('Il server non risponde, si prega di riprovare','Errore di comunicazione');
		
	return false;
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _giorno
 *
 * @properties={typeid:24,uuid:"57659A80-B128-4A8E-BFE8-6DF95793C00A"}
 */
function ripristinaTimbratureGiorno(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _giorno)
{
	if (globals.ottieniTimbratureGiorno(_event,_giorno))
	{
		forms.giorn_header.preparaGiornaliera();
		globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
	}	
}

/**
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
*
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"F6E4DBC7-919A-4A21-9AB2-0CC5DE49773A"}
 */
function cambiaSenso(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	databaseManager.setAutoSave(false);
	
	//recupero l'id della timbratura selezionata 
	var _idTimbrature = forms[_event.getFormName()].foundset[_event.getElementName()];
	
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
		                                  globals.Table.TIMBRATURE);
	
    if(_fs.find())
    {
    	_fs.idtimbrature = _idTimbrature;
    	if(_fs.search() == 0)
    	{
    		globals.ma_utl_showWarningDialog('Selezionare una timbratura valida','Cambia senso timbratura');
    		return;
    	}
    }
    else
    {
       	globals.ma_utl_showWarningDialog('Cannot go to find mode','Cambia senso timbratura');
        return;
    }
	var _sensoCambiato = 0;
	_fs.sensocambiato == 0 ? _sensoCambiato = 1 : _sensoCambiato = 0;
	if(_idTimbrature != null)
	{
			var response = globals.ma_utl_showYesNoQuestion('Cambiare il senso della timbratura?','Cambio senso della timbratura');

            if(response)
            {	
               databaseManager.startTransaction();
			   _fs.sensocambiato = _sensoCambiato;
			   if(!databaseManager.commitTransaction())
			   {
				  globals.ma_utl_showErrorDialog('Cambio senso non riuscito, riprovare eventualmente ripristinando le timbrature','Cambio senso della timbratura');
			      databaseManager.rollbackTransaction();
			   }
			   else
			   {
				   var _yy = globals.getAnnoDaTimbr(_fs.timbratura.toString());
				   var _MM = globals.getMeseDaTimbr(_fs.timbratura.toString());
				   var _gg = globals.getGiornoDaTimbr(_fs.timbratura.toString());
				   
				    var data = new Date(_yy,_MM-1,_gg);
				    
				    // situazione anomalia partenza
					var anomaliaPre =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT));
					
					// analizza pre conteggio
					forms.giorn_timbr.analizzaPreConteggio(_gg);

					// situazione anomalia partenza
					var anomaliaPost =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT));
				    
				    //se il giorno della timbratura modificata risulta già conteggiato
				    if(anomaliaPre == 0 && anomaliaPre != anomaliaPost)
				    {
				    	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
						if(_respRiconteggia)
						   globals.conteggiaTimbrature([forms.giorn_header.idlavoratore],[_gg]);
						else
						   forms.giorn_header.preparaGiornaliera();
				    }
				    else	    
					     forms.giorn_header.preparaGiornaliera();  
				    
				    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
				  
			   }
            }
		
	}
	//se non è presente si è cliccato su una cella vuota, gestiamo l'aggiunta di una nuova timbratura
	else
		//gestione nuova timbratura
		aggiungiTimbratura(_event);
		
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
*
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"129ED049-544A-45C8-98E2-D900661FBCED"}
 */
function spostaGgSucc(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    databaseManager.setAutoSave(false);
	
	//recupero l'id della timbratura selezionata 
	var _idTimbrature = foundset[_event.getElementName()];
	
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
		                                  globals.Table.TIMBRATURE);
	
	if(_fs.find())
    {
    	_fs.idtimbrature = _idTimbrature;
    	if(_fs.search() == 0)
    	{
    		globals.ma_utl_showWarningDialog('Selezionare una timbratura valida','Sposta al giorno successivo');
    		return;
    	}
    }
    else
    {
       	globals.ma_utl_showWarningDialog('Cannot go to find mode','Sposta al giorno successivo');
        return;
    }
	
    var _timbStr = utils.stringRight(_fs.timbratura.toString(),4);
    if(utils.stringLeft(_timbStr,2) == '00')
		_timbStr = utils.stringRight(_timbStr,2);
	else if(utils.stringLeft(_timbStr,1) == '0')
		_timbStr = utils.stringRight(_timbStr,3);
    var _timbrHhmm = parseInt(_timbStr);
    var _yyOri = globals.getAnnoDaTimbr(_fs.timbratura.toString());
	var _MMOri = globals.getMeseDaTimbr(_fs.timbratura.toString());
	var _ggOri = globals.getGiornoDaTimbr(_fs.timbratura.toString());
	var _dataOri = new Date(_yyOri,_MMOri-1,_ggOri);
	if(_idTimbrature != null)
	{
		var response = globals.ma_utl_showYesNoQuestion('Spostare la timbratura al giorno successivo?','Spostamento al giorno successivo');
        if(response)
        {	
            databaseManager.startTransaction();
			var _timbrFinale
			var _dataFinale =  _dataOri;
			    _dataFinale.setDate(_dataOri.getDate() + 1);
			var _ggFin = _dataFinale.getDate();
			var _MMFin = _dataFinale.getMonth() + 1;
			var _yyFin = _dataFinale.getFullYear();
				
            if(_timbrHhmm >= 2400)
               _timbrFinale = _yyFin * 100000000 + _MMFin * 1000000 + _ggFin * 10000 + (_timbrHhmm - 2400);
            else
               _timbrFinale = _yyFin * 100000000 + _MMFin * 1000000 + _ggFin * 10000 + (_timbrHhmm);
            
            _fs.timbratura = _timbrFinale.toString();
				               
            // situazione anomalia partenza
			var anomaliaPre =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
            
			if(!databaseManager.commitTransaction())
			{
			  globals.ma_utl_showErrorDialog('Spostamento non riuscito, riprovare eventualmente ripristinando le timbrature','Spostamento al giorno successivo');
			  databaseManager.rollbackTransaction();
			}
			else
			{
				// analizza pre conteggio
				forms.giorn_timbr.analizzaPreConteggio(_ggFin,forms.giorn_header.idlavoratore,_yyFin * 100 + _MMFin);
				forms.giorn_timbr.analizzaPreConteggio(_ggOri,forms.giorn_header.idlavoratore,_yyOri * 100 + _MMOri);

				// situazione anomalia partenza
				var anomaliaPost =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
			    
				//se il giorno della timbratura modificata risulta già conteggiato
			    if(anomaliaPre == 0 && anomaliaPre != anomaliaPost)
			    {
			    	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
					if(_respRiconteggia)
						globals.conteggiaTimbrature([forms.giorn_header.idlavoratore],[_ggOri]);
					else
					{
						forms.giorn_header.preparaGiornaliera();
						globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
					}
				}else	    
				{
					forms.giorn_header.preparaGiornaliera(); 
					globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
				}
			    
				  
			}
        }
		
	}
	//se non è presente si è cliccato su una cella vuota, gestiamo l'aggiunta di una nuova timbratura
	else
		//gestione nuova timbratura
		aggiungiTimbratura(_event);
		
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
*
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"500C8636-1730-4FEE-B525-7DB2753700FC"}
 */
function spostaGgPrec(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    databaseManager.setAutoSave(false);
	
	//recupero l'id della timbratura selezionata 
	var _idTimbrature = foundset[_event.getElementName()];
	
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
		                                  globals.Table.TIMBRATURE);
	
	if(_fs.find())
    {
    	_fs.idtimbrature = _idTimbrature;
    	if(_fs.search() == 0)
    	{
    		globals.ma_utl_showWarningDialog('ID timbratura non recuperato','Spostamento al giorno precedente');
    		return;
    	}
    }
    else{
       	globals.ma_utl_showWarningDialog('Cannot go to find mode','Spostamento al giorno precedente');
        return;
    }
	var _timbStr = utils.stringRight(_fs.timbratura.toString(),4)
	    
	if(utils.stringLeft(_timbStr,2) == '00')
		_timbStr = utils.stringRight(_timbStr,2);
	else if(utils.stringLeft(_timbStr,1) == '0')
		_timbStr = utils.stringRight(_timbStr,3);
	var _timbrHhmm = parseInt(_timbStr);
    var _yyOri = globals.getAnnoDaTimbr(_fs.timbratura.toString());
	var _MMOri = globals.getMeseDaTimbr(_fs.timbratura.toString());
	var _ggOri = globals.getGiornoDaTimbr(_fs.timbratura.toString());
	var _dataOri = new Date(_yyOri,_MMOri-1,_ggOri);
	if(_idTimbrature != null)
	{
		var response = globals.ma_utl_showYesNoQuestion('Spostare la timbratura al giorno precedente?','Spostamento al giorno precedente');
        if(response)
        {	
            databaseManager.startTransaction();
			var _timbrFinale
			var _dataFinale =  _dataOri;
		        _dataFinale.setDate(_dataOri.getDate() - 1);
		    var _ggFin = _dataFinale.getDate();
			var _MMFin = _dataFinale.getMonth() + 1;
			var _yyFin = _dataFinale.getFullYear();
				
			if(_timbrHhmm > 2400)
			{
			   globals.ma_utl_showWarningDialog('Impossibile spostare la timbratura al giorno precedente','Spostamento al giorno precedente');	
			   return;
			}
			else
               _timbrFinale = _yyFin * 100000000 + _MMFin * 1000000 + _ggFin * 10000 + (_timbrHhmm + 2400);
            
			_fs.timbratura = _timbrFinale;
			
			// situazione anomalia partenza
			var anomaliaPre =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
			
			if(!databaseManager.commitTransaction())
			{
			  globals.ma_utl_showErrorDialog('Spostamento non riuscito, riprovare eventualmente ripristinando le timbrature','Spostamento al giorno successivo');
			  databaseManager.rollbackTransaction();
			}
			else
			{			    
				// analizza pre conteggio
				forms.giorn_timbr.analizzaPreConteggio(_ggFin,forms.giorn_header.idlavoratore,_yyFin * 100 + _MMFin);
				forms.giorn_timbr.analizzaPreConteggio(_ggOri,forms.giorn_header.idlavoratore,_yyOri * 100 + _MMOri);

				// situazione anomalia finale
				var anomaliaPost =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
				
			    //se il giorno della timbratura modificata risulta già conteggiato
			    if(anomaliaPre == 0 && anomaliaPre != anomaliaPost)
			    {
			    	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
					if(_respRiconteggia)
						globals.conteggiaTimbrature([forms.giorn_header.idlavoratore],[_ggFin]);
					else	
					{
					    forms.giorn_header.preparaGiornaliera();
					    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
					}
				}
			    else
			    {
					forms.giorn_header.preparaGiornaliera();
			        globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
			    }  
			}
        }		
	}
	//se non è presente si è cliccato su una cella vuota, gestiamo l'aggiunta di una nuova timbratura
	else
	{
		//gestione nuova timbratura
		aggiungiTimbratura(_event);
	}
	
}

/**
 * @properties={typeid:24,uuid:"0F3817DC-B489-4377-A0F3-A39E30BCFB53"}
 */
function updateFromDatabase()
{
	var _jsForm = solutionModel.getForm(controller.getName());
	var fields = _jsForm.getFields();
	for(var i = 0; fields && i < fields.length; i++)
	{
		if(fields[i].dataProviderID)
		{
			var relation = fields[i].dataProviderID.split('.');
			if(relation.length > 1)
			{
				// Refresh the selected days or the whole foundset, accordingly
				/** @type {Array} */
				var days = globals.getGiorniSelezionatiTimbr();
				if(days && days.length > 0)
				{
					for(var g = 0; g < days.length; g++)
					{						
						if(foundset.getRecord(days[g])[relation[0]])
						{
							databaseManager.refreshRecordFromDatabase(foundset.getRecord(days[g])[relation[0]],0);
						    databaseManager.refreshRecordFromDatabase(forms.giorn_mostra_timbr.foundset,0)
						}
					}
				}
				else
				{	
					for(var r = 1; r <= foundset.getSize(); r++)
					{						
						if(foundset.getRecord(r)[relation[0]])
						{
							databaseManager.refreshRecordFromDatabase(foundset.getRecord(r)[relation[0]],0);
						}
					}
				}
			}	// relation if
		}	// data provider if
	}	// fields for loop
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"40A4D496-388E-4D70-82CB-D8B661A9C172"}
 */
function conteggiaTimbratureSingolo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.conteggiaTimbratureSingolo([forms.giorn_header.idlavoratore],globals.getGiorniSelezionatiTimbr());
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"97EA431A-8782-4D1F-81BF-F7F354FDBD7E"}
 */
function impostaFasceForzateMultiple(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var _arrGiorni = globals.getGiorniSelezionatiTimbr(); 
	
	if(!_arrGiorni || _arrGiorni.length == 0)
		globals.ma_utl_showWarningDialog('Selezionare almeno un giorno','Imposta fasce forzate multiple');
	else
	{
		var _frmFF = forms.giorn_mostra_timbr_fascia_forzata_dtl;
	    _frmFF._codiceFascia = '';
	    _frmFF._descrFascia = '';
        _frmFF._arrGiorni = _arrGiorni;
	    
        globals.ma_utl_setStatus(globals.Status.EDIT,_frmFF.controller.getName());
        globals.ma_utl_showFormInDialog(_frmFF.controller.getName(),'Impostazione fascia forzata per i giorni ' + _arrGiorni);
	}
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
 * 
 * @properties={typeid:24,uuid:"19296679-39B7-46BC-B20B-0505B70D9708"}
 */
function conteggiaTimbratureMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.conteggiaTimbratureMultiplo(_event,true);	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EF3B64B3-7966-418C-95DC-1A8BCD4FBC6E"}
 */
function onFieldSelection(event) {
	
	var _recordIndex = foundset.getSelectedIndex();
	var _timeStamp = event.getTimestamp();
	
	var _lastClickTimeStamp = forms.giorn_mostra_timbr.last_click_timestamp;
	var _lastSelectedRecordIndex = forms.giorn_mostra_timbr.last_selected_recordindex;
	
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = _recordIndex;
	
	if(_recordIndex == _lastSelectedRecordIndex)
	{
		if(_timeStamp - _lastClickTimeStamp < globals.intervalForDblClk)
			modificaTimbratura(event);
		
		forms.giorn_mostra_timbr.last_click_timestamp = _timeStamp;
	}
	else
	{
		forms.giorn_mostra_timbr.last_selected_recordindex = _recordIndex;
		forms.giorn_mostra_timbr.last_click_timestamp = _timeStamp;
	}
	
	globals.aggiornaSelezioneGiorni(event,_recordIndex);	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E721F2C2-1E3F-465E-90B6-DC9D1D5184C0"}
 */
function onOtherSelection(event) {
	
	var _recordIndex = foundset.getSelectedIndex();
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = _recordIndex;
	globals.aggiornaSelezioneGiorni(event,_recordIndex);
		
}


