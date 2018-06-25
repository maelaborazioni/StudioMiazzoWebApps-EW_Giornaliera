/**
 * @properties={typeid:35,uuid:"C58A7ADC-EA63-4245-8BB8-B07F38712EEB",variableType:-4}
 */
var numeroTimbrature = globals.stdColTimbr;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"40527F75-5706-4AEA-9D8E-1F0A9C48A974",variableType:4}
 */
var _currInd = -1;

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"A4441D8D-2427-4F7F-AEB1-2F8D02F6A0B3"}
 */
function onRenderTimbr(event) 
{
	var recInd = event.getRecordIndex();
    var recRen = event.getRenderable();
    var recCol = event.getRecord();
    var anno = globals.getAnno();
    var annoAttivo = globals.getAnnoAttivo();
    var mese = globals.getMese();
    var meseAttivo = globals.getMeseAttivo();
    var active = anno == annoAttivo && mese == meseAttivo;
    
    var offsetSelezione = forms.giorn_header.assunzione > new Date(anno, mese - 1,1) ?
                          forms.giorn_header.assunzione.getDate() +  globals.offsetGg - 1 : globals.offsetGg;
   
    var isDisabled =   (!active && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.NORMALE)
   					 ||(recInd <= offsetSelezione)
                     ||(active && recCol['idgiornaliera'] == null && recCol['anomalie'] == 0 && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET);
   
    if(isDisabled)
    {   
	    recRen.bgcolor = '#767676';
	    recRen.fgcolor = '#333333';
//	    recRen.enabled = false;
	    return;
    }
    else
	    recRen.enabled = true;
   
	recRen.font = 'Arial,0,11';
   
	if(recCol)
	{
		if(recInd % 2 == 0)
	    {
		    recRen.bgcolor = globals.Colors.EVEN.background;
		    recRen.fgcolor = globals.Colors.EVEN.foreground;
	    }
	    else
	    {
	    	recRen.bgcolor = globals.Colors.ODD.background;
		    recRen.fgcolor = globals.Colors.ODD.foreground;
	    }
	   
	    if(event.isRecordSelected() /*|| selection_form.foundset.getRecord(recInd)['checked'] == 1*/)
	    {
		    recRen.bgcolor = '#abcdef';
		    recRen.fgcolor = globals.Colors.SELECTED.foreground;
	    }
	    else
	    if(recCol['festivo'])
	    {
		    recRen.bgcolor = globals.Colors.HOLYDAYS.background;	// darker than sat/sun
		    recRen.fgcolor = globals.Colors.HOLYDAYS.foreground;	// white
	    }
	    else
	    {
		    switch(recCol['nomegiorno'])
		    {
			    case 'SA':
			    	//caso giorno = sabato
			    	recRen.bgcolor = globals.Colors.SATURDAY.background;
			    	recRen.fgcolor = globals.Colors.SATURDAY.foreground;
			    	
			    	break;
				   
			   case 'SU':
			   case 'DO':
			   		//caso giorno = domenica
			   		recRen.bgcolor = globals.Colors.SUNDAY.background;
			   		recRen.fgcolor = globals.Colors.SUNDAY.foreground;
			   		
			   		break;
			}
	    }
	    
    	switch (recCol['anomalie'])
		{
			case 1:
			case 2:
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
				recRen.fgcolor = '#FF0000'; // red
				recRen.font = 'Arial,2,11';
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
 * @protected
 *
 * @properties={typeid:24,uuid:"3F700C1F-6BB0-4738-B287-A782BB7325DF"}
 * @AllowToRunInFind
 */
function onRecordSelection(event, _form)
{
	var currIdGiornaliera = -1;
	
	if (foundset && foundset.getSize() > 0 && foundset['idgiornaliera']) 
		currIdGiornaliera = foundset['idgiornaliera'];
		
	forms.giorn_mostra_timbr.foundset.loadRecords(currIdGiornaliera);
	forms.giorn_mostra_timbr.aggiornaRiepiloghiGiorno(currIdGiornaliera);
	forms.giorn_mostra_timbr.aggiornaBadgeEffettivo();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9F7CDBD2-EFD7-40E8-839D-6B3139E9098B"}
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
 * @properties={typeid:24,uuid:"8D2677D2-03AE-4C2C-8C48-8F96D4BB2CD2"}
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
 * @properties={typeid:24,uuid:"2541AE54-B310-4F50-949D-C0E6017BD69B"}
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
 * @properties={typeid:24,uuid:"223196B0-D012-4693-AC9D-96996471897E"}
 */
function AggiornaTimbratureGiorno(_rec){
	
	forms['giorn_mostra_timbr'].preparaTimbratura(forms['giorn_mostra_timbr_gestione_2'].foundset['giorno'].getFullYear(),forms['giorn_mostra_timbr_gestione_2'].foundset['giorno'].getMonth()+1)	
	
}

/**
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"D2CF3CF7-A435-4BA4-ADDB-9889855C44D1"}
 * @AllowToRunInFind
 */
function apriPopupMostraTimbr(_event)
{
    var _enableGgSucc = false;
    var _enableGgPrec = false;
    
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>} */
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
			{
			    _enableGgPrec = false;
				//if(timbHhmm < 2400)
				//{
				//   _enableGgPrec = true;
				//   _enableGgSucc = true;
				//}
			}
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

	var _addTimbr = _popUpMenuTimbr.addMenuItem('Aggiungi una timbratura ',aggiungiTimbraturaDaMenu);
		_addTimbr.methodArguments = [_event];
	var _addTimbrCaus = _popUpMenuTimbr.addMenuItem('Aggiungi una timbratura causalizzata ',aggiungiTimbraturaDaMenu);
		_addTimbrCaus.methodArguments = [_event,true];
		globals.getCausaliTimbratureDitta(forms.giorn_header.idditta).length > 0 ? _addTimbrCaus.enabled = true : _addTimbrCaus.enabled = false;
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
	var _ggSpostaInCaus = _popUpMenuTimbr.addMenuItem('Sposta nelle timbrature causalizzate',rendiTimbrCausalizzata);
	    _ggSpostaInCaus.methodArguments = [_event];
	var _ggRicCaus = _popUpMenuTimbr.addMenuItem('Ricalcola causalizzate del giorno',ricalcolaCausalizzateGiorno);
	    _ggRicCaus.methodArguments = [_event];
    var _ggRicForz = _popUpMenuTimbr.addMenuItem('Ricalcola forzate del giorno',ricalcolaForzateGiorno);
        _ggRicForz.methodArguments = [_event];
	    
	_popUpMenu.addSeparator();
	
	var _popUpMenuConteggia = _popUpMenu.addMenu('Conteggio timbrature ');
	var _item3 = _popUpMenuConteggia.addMenuItem('Conteggia il singolo dipendente ', conteggiaTimbratureSingolo);
	    _item3.methodArguments = [_event];
	var _item3_1 = _popUpMenuConteggia.addMenuItem('Scegli i dipendenti da conteggiare ', conteggiaTimbratureMultiplo);
	    _item3_1.methodArguments = [_event];    
 	
	_popUpMenu.addSeparator();
	
	var idDittaProgTurni = (globals.getTipologiaDitta(forms.giorn_header.idditta) != globals.Tipologia.STANDARD
			                && globals.getTipoDittaEsterna(forms.giorn_header.idditta) == 0) ? 
			                		globals.getDittaRiferimento(forms.giorn_header.idditta) : forms.giorn_header.idditta
	if(globals.ma_utl_hasKey(globals.Key.PROG_TURNI) 
	   && globals.verificaProgrammazioneTurniDitta(idDittaProgTurni))
	{
		var _item12 = _popUpMenu.addMenuItem('Programmazione turni ', globals.apriProgrammazioneTurniDaMenu);
		    _item12.methodArguments = [_event,forms.giorn_header.idlavoratore,forms.giorn_header.idditta,globals.getAnno(),globals.getMese()];
	}
	
	_popUpMenu.addSeparator();
	
	var _popUpMenuStampe = _popUpMenu.addMenu('Stampa... ');
	var _item4 = _popUpMenuStampe.addMenuItem('Stampa cartoline ',stampaCartolinaMensile);
	_item4.methodArguments = [_event];
	if(globals.getCausaliTimbratureDitta(forms.giorn_header.idditta).length)
	{
		var _item4_2 = _popUpMenuStampe.addMenuItem('Stampa riepilogo causalizzate ',stampaReportRiepilogoCausalizzate);
 	        _item4_2.methodArguments = [_event,forms.giorn_header.idditta];
		var _item4_3 = _popUpMenuStampe.addMenuItem('Stampa confronto effettive/causalizzate ',stampaReportCausalizzate);
	        _item4_3.methodArguments = [_event,forms.giorn_header.idditta];
	}
	
	_popUpMenu.addSeparator();
	
	/** @type {String} */
	var giorno = forms[_event.getFormName()].foundset.getSelectedRecord()['giornomese'];
		giorno = giorno.replace(/^0/, '');
		
	var _item6 = _popUpMenu.addMenuItem('Ripristina timbrature del giorno',ripristinaTimbratureGiorno);
	    _item6.methodArguments = [_event, foundset['giorno'], foundset['idlavoratore']];
	var _item7 = _popUpMenu.addMenuItem('Rendi i giorni riconteggiabili', rendiGiorniRiconteggiabili);
		_item7.methodArguments = [_event, parseInt(giorno)];
	
	_popUpMenu.addSeparator();
	
	/** @type {RuntimeForm<giorn_selezione_multipla>}*/
	var sel_form = forms.giorn_mostra_timbr.getSelectionForm();
	
	if(sel_form
		&& sel_form.getGiorniSelezionati(true).indexOf(foundset.getSelectedIndex()) == -1)
		globals.aggiornaSelezioneGiorni(_event, foundset.getSelectedIndex());
	
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
 * @properties={typeid:24,uuid:"25256843-2A7D-436D-AE59-2263E4816C7B"}
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
* @param {Boolean} [_causalizzata]
* @param {Boolean} [_soloCartolina]
* 
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"B5DA0C59-F1BB-4489-9AB4-31421C40F4A3"}
 */
function aggiungiTimbraturaDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_causalizzata,_soloCartolina)
{
	aggiungiTimbratura(_event,_causalizzata,_soloCartolina);
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
 * @properties={typeid:24,uuid:"F43A7D55-065E-4BA0-A1A7-13B54393EB88"}
 */
function aggiungiTimbratureMultiDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_soloCartolina)
{
	if(_soloCartolina)
	{
		// caso web
		if(globals.ma_utl_hasKey(globals.Key.TIMBR_DIPENDENTE_WEB))
		   globals.aggiungi_timbratura_dipendente_immediata(true);
		// caso standard
		else if(globals.ma_utl_hasKey(globals.Key.TIMBR_DIPENDENTE))
		   globals.aggiungi_timbratura_dipendente(true);
		else
			globals.ma_utl_showWarningDialog('L\'utente non dispone dell\'autorizzazione ad inserire le timbrature','Timbrature dipendente');
	}
	else
	{	
		var frm = forms.giorn_aggiungi_timbr_tab;
		_soloCartolina ? frm.vSoloCartolina = true : frm.vSoloCartolina = false;
		frm.vSelectedGiorno = foundset.getSelectedIndex() - globals.offsetGg;
		globals.ma_utl_showFormInDialog(frm.controller.getName(),'Timbrature multiple');
	}
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSEvent} _event
 * @param {Boolean} [_causalizzata]
 * @param {Boolean} [_soloCartolina]
 * 
 * @properties={typeid:24,uuid:"41AE836B-F51F-4A9D-A51E-C1EC36F1C426"}
 */
function aggiungiTimbratura(_event,_causalizzata,_soloCartolina)
{
    databaseManager.setAutoSave(false);
	
    var _idLav = _soloCartolina ? forms.giorn_cart_header.idlavoratore : forms.giorn_header.idlavoratore;
    var _nrBadge = _soloCartolina ? forms.giorn_cart_header._vNrBadge : forms.giorn_header._vNrBadge;
    var _frm = _causalizzata ? forms.giorn_modifica_timbr_caus_dtl : forms.giorn_modifica_timbr_dtl;
    _soloCartolina ? _frm._solocartolina = true : _frm._solocartolina = false;
    
	if (_nrBadge != null)
	{
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
 * @properties={typeid:24,uuid:"CEFFCC6B-9EDE-4CE9-9773-A73FF9E5985F"}
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
 * @properties={typeid:24,uuid:"D7C0C746-2D66-4DD9-8DFA-37B3F608B7F5"}
 */
function modificaTimbratura(_event)
{
	var autosave = databaseManager.getAutoSave();
	try
	{
		if (forms.giorn_header._vNrBadge != null)
		{
			var _frm = forms.giorn_modifica_timbr_dtl;
			/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
			var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);
			var _timbrOri = null;
			var _sensoOri = null;
			var _sensoCamb = null;
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
				
				// salva i dati in sospeso (la selezione in griglia)
				databaseManager.saveData();
				// inizio della transazione (verrà gestita dalla dialog)
				databaseManager.startTransaction();
	
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
					_sensoCamb = _fs.sensocambiato;
					_ggSuccOri = _fs.ggsucc;
					_orologioOri = _fs.indirizzo;
	                globals.getOreDaTimbr(_timbrOri) * 100 + globals.getMinDaTimbr(_timbrOri) > 2400 ? _competenzaGGPrec = true : _competenzaGGPrec = false;
				} 
				else 
				{
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
	
			var _frmFs = _frm.foundset;
			
			_frmFs.newRecord();
	
			_frmFs.timbratura = _timbrOri;
			_frmFs.senso = _sensoOri != null ? (_sensoCamb == 1 ? !_sensoOri : _sensoOri) : 0;
			_frmFs.sensocambiato = _sensoCamb != null ? _sensoCamb : 0;
			_frmFs.indirizzo = _orologioOri;
			_frm._ggSucc = _frmFs.ggsucc = _ggSuccOri;
			_frm.elements.fld_senso.enabled = false;
			_frm.elements.fld_ggsucc.enabled = false;
			_frm._competenzaGGPrec = _competenzaGGPrec;
			_frmFs.iddip = forms.giorn_header.idlavoratore;
			_frmFs.nr_badge = forms.giorn_header._vNrBadge;
			_frmFs.idgruppoinst = globals.getGruppoInstallazioneLavoratore(forms.giorn_header.idlavoratore);
			
			globals.ma_utl_setStatus(globals.Status.EDIT, _frm.controller.getName());
			globals.ma_utl_showFormInDialog(_frm.controller.getName(), 'Modifica la timbratura selezionata', null, true);
		} 
		else
			globals.ma_utl_showWarningDialog('Il dipendente non ha un numero di badge valido', 'Modifica timbrature');
	}
	catch(ex)
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
	}
	finally
	{
		databaseManager.setAutoSave(autosave);
	}
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
* @param {Boolean} [_soloCartolina]
 *
 * @properties={typeid:24,uuid:"506B6FA2-AF69-4A62-893A-A2E53000FD62"}
 * @AllowToRunInFind
 * @SuppressWarnings(unused)
 */
function eliminazioneTimbratura(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _soloCartolina) {
	
	databaseManager.setAutoSave(false);

	//recupero l'id della timbratura selezionata
	var _idTimbrature = foundset[_event.getElementName()];

	if (_idTimbrature) {

		if(eliminaTimbratura(_idTimbrature,_soloCartolina))
		{
			var anno = globals.getAnno();
			var mese = globals.getAnno();
			var frm = _soloCartolina != null && _soloCartolina ? forms['giorn_timbr_cartolina_temp'] : forms['giorn_timbr_temp']; 
			var _giorno = frm.foundset.getSelectedIndex() - globals.offsetGg;
			var data = new Date(anno,mese-1,_giorno);
			
			// situazione anomalia partenza
			var anomaliaPre =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT));
			
			// analizza pre conteggio
			forms.giorn_timbr.analizzaPreConteggio(_giorno);

			// situazione anomalia finale
			var anomaliaPost =  globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT));

			var indexToUpdate = foundset.getSelectedIndex();
			//se il giorno della timbratura modificata risulta già conteggiato
			if (anomaliaPre == 0 && anomaliaPre != anomaliaPost) 
			{
				var _respRiConteggia = _soloCartolina != null ? !_soloCartolina : true;
		       	if(_respRiConteggia && globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature'))
				   globals.conteggiaTimbratureSingolo([forms.giorn_header.idlavoratore],[_giorno]);
				else
				   forms.giorn_header.preparaGiornaliera(false, indexToUpdate, _soloCartolina);
		    }
		    else
				forms.giorn_header.preparaGiornaliera(false, indexToUpdate, _soloCartolina);
			
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
 * @properties={typeid:24,uuid:"BBC5C50B-98B7-4F45-868F-44AFFF756E08"}
 */
function eliminaTimbratura(idTimbratura,bSilenzioso)
{
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>} */
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);

	if (_fs.find())
	{
		_fs.idtimbrature = idTimbratura;
		if (_fs.search() > 0) {
			
			var response = false; 
			
			if(bSilenzioso)
				response = true;
			else
			    response = globals.ma_utl_showYesNoQuestion('Eliminare la timbratura delle ore <strong>[' +
			    	                                  _fs.timbratura_oremin + ']</strong> per il giorno <strong>['+ 
													  globals.getNumGiorno(_fs.giorno) + ' ' +
													  globals.getNomeMese(_fs.giorno.getMonth() + 1) + ']</strong> ' +
													  _fs.giorno.getFullYear() +
													  ' ?', 'Eliminazione timbratura');

			if (response) 
			{
				var success;
				
				if(_fs.indirizzo == 'mn' || _fs.indirizzo == 'wb')
					success = _fs.deleteRecord();
				else
				{
					databaseManager.startTransaction();
				    _fs.timbeliminata = 1;
                    success =  databaseManager.commitTransaction(); 
				}
				
				if(!success)
				{
    				databaseManager.rollbackTransaction();
					globals.ma_utl_showWarningDialog('Errore durante l\'eliminazione, si prega di riprovare', 'Eliminazione timbratura');
				    application.output(_fs.getSelectedRecord(),LOGGINGLEVEL.ERROR);
				}	
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
 * @properties={typeid:24,uuid:"1680089B-AAFA-4B99-B2D0-16B91C3772A6"}
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
 * @properties={typeid:24,uuid:"59B9A14C-E7E3-4D74-9E3E-B6E2B0BC1B6D"}
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
* @properties={typeid:24,uuid:"2C522CF6-195F-4BE5-BB5B-4B9A9FC25099"}
*/
function rendiGiorniRiconteggiabili(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _giorno)
{
	var giorniSelezionati = globals.getGiorniSelezionatiTimbr();
	    giorniSelezionati = giorniSelezionati.length > 0 && giorniSelezionati || [_giorno];
	
		var arrLav = globals.ma_utl_showLkpWindow({
		    event							: new JSEvent
			, lookup						: (globals.getTipologiaDitta(forms.giorn_header.idditta) != globals.Tipologia.STANDARD 
											   && globals.getTipoDittaEsterna(forms.giorn_header.idditta) == 0) ? 'AG_Lkp_LavoratoriEsterni' : 'AG_Lkp_Lavoratori'
			, methodToAddFoundsetFilter		: 'FiltraLavoratoriGiornaliera'
			, allowInBrowse					: true
			, multiSelect					: true
			, selectedElements				: [forms.giorn_header.idlavoratore]
		});

		var answer = globals.ma_utl_showYesNoQuestion('Rendere riconteggiabili i giorni selezionati per i dipendenti scelti?', 'Rendi i giorni riconteggiabili');
		if (answer)
		{
			var response = globals.rendiGiorniRiconteggiabili(arrLav 
							                                   ,giorniSelezionati
															   ,forms.giorn_header.idditta
															   ,globals.getPeriodo()
															   ,globals._tipoConnessione);
			if (response && response['returnValue'] === true)
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
 * @properties={typeid:24,uuid:"D18746A7-6E47-4243-8841-E4ACF0772EEE"}
 */
function analizzaPreConteggio(giorno,idLav,periodo)
{
    var  url = globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ? globals.WS_URL + "/Giornaliera/AnalizzaPreConteggio" : globals.WS_URL + '/Eventi/AnalizzaPreConteggio';
    
    var params = {
    	idditta : globals.getDitta(idLav ? idLav : forms.giorn_header.idlavoratore),
    	iddipendenti : idLav ? [idLav] : [forms.giorn_header.idlavoratore],
		giorniselezionati : [giorno],
		periodo : periodo ? periodo : globals.getAnno() * 100 + globals.getMese(),
		tipoconnessione : globals._tipoConnessione
    };
    
    if(idLav) params.idditta = globals.getDitta(idLav);
    
    var _responseObj = globals.getWebServiceResponse(url,params);
	
	if(_responseObj != null)
	{
		if(_responseObj['returnValue'] == true)
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
 * @param {Date} _giorno
 * @param {Number} idlavoratore
 *
 * @properties={typeid:24,uuid:"A8F21472-7369-4BF8-A934-AFF4BD1B80B1"}
 */
function ripristinaTimbratureGiorno(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _giorno, idlavoratore)
{
	if (globals.ottieniTimbratureGiorno(_event,_giorno.getDate()))
	{
		forms.giorn_mostra_timbr.is_dirty = true;
		forms.giorn_mostra_timbr.preparaTimbratura(_giorno.getFullYear(), _giorno.getMonth() + 1, idlavoratore);
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
 * @properties={typeid:24,uuid:"BA4BA62F-9554-434C-9496-A8038A1CCC8D"}
 */
function cambiaSenso(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	databaseManager.setAutoSave(false);
	
	//recupero l'id della timbratura selezionata 
	var _idTimbrature = forms[_event.getFormName()].foundset[_event.getElementName()];
	
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
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
 * @properties={typeid:24,uuid:"711F03F7-395F-4C25-A385-3DB51AE22E9B"}
 */
function spostaGgSucc(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    databaseManager.setAutoSave(false);
	
    var _idLav = forms.giorn_header.idlavoratore;
    
	//recupero l'id della timbratura selezionata 
	var _idTimbrature = foundset[_event.getElementName()];
	
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
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
	var _dataOri = new Date(_yyOri, _MMOri - 1, _ggOri);
	
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
        	var anomaliaPre =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
            
        	if(!databaseManager.commitTransaction())
        	{
        	  globals.ma_utl_showErrorDialog('Spostamento non riuscito, riprovare eventualmente ripristinando le timbrature','Spostamento al giorno successivo');
        	  databaseManager.rollbackTransaction();
        	}
        	else
        	{
        		// analizza pre conteggio
        		forms.giorn_timbr.analizzaPreConteggio(_ggFin,_idLav,_yyFin * 100 + _MMFin);
        		forms.giorn_timbr.analizzaPreConteggio(_ggOri,_idLav,_yyOri * 100 + _MMOri);

        		// se la timbratura è stata spostata su una giornata non ancora compilata viene eseguita 
        		// la compilazione di base che ve a creare il record nella tabella e2giornaliera
        		if(globals.getIdGiornalieraDaIdLavGiorno(_idLav,_dataFinale) == null)
        		   globals.compilaDalAlSingolo(_idLav,[_ggFin]);
        		
        		// situazione anomalia partenza
        		var anomaliaPost =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
        	    
        		//se il giorno della timbratura modificata risulta già conteggiato
        	    if(anomaliaPre == 0 && anomaliaPre != anomaliaPost)
        	    {
        	    	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
        			if(_respRiconteggia)
        				globals.conteggiaTimbratureSingoloDiretto([_idLav],[_ggOri]);
        		}
        	    	    
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
 * @properties={typeid:24,uuid:"B1F279A1-588A-47B4-ADFB-958B760511AB"}
 */
function spostaGgPrec(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
    databaseManager.setAutoSave(false);
	
    var _idLav = forms.giorn_header.idlavoratore;
    
	//recupero l'id della timbratura selezionata 
	var _idTimbrature = foundset[_event.getElementName()];
	
	/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
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
        		forms.giorn_timbr.analizzaPreConteggio(_ggFin,_idLav,_yyFin * 100 + _MMFin);
        		forms.giorn_timbr.analizzaPreConteggio(_ggOri,_idLav,_yyOri * 100 + _MMOri);

        		// se la timbratura è stata spostata su di una giornata non ancora compilata viene eseguita 
        		// la compilazione di base che ve a creare il record nella tabella e2giornaliera
        		if(globals.getIdGiornalieraDaIdLavGiorno(_idLav,_dataFinale) == null)
        		   globals.compilaDalAlSingolo(_idLav,[_ggFin]);
        		
        		// situazione anomalia finale
        		var anomaliaPost =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
        		
        	    //se il giorno della timbratura modificata risulta già conteggiato
        	    if(anomaliaPre == 0 && anomaliaPre != anomaliaPost)
        	    {
        	    	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
        			if(_respRiconteggia)
        				globals.conteggiaTimbratureSingoloDiretto([_idLav],[_ggFin]);
        	    }	
        		
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
 * @properties={typeid:24,uuid:"922C73A9-38B1-4F3B-A66D-77A5F4584875"}
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
				/** @type {Array<Number>} */
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
 * @properties={typeid:24,uuid:"ECC22BA2-F64D-437F-953D-E0D988E6452D"}
 */
function conteggiaTimbratureSingolo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.conteggiaTimbratureSingolo([forms.giorn_header.idlavoratore]
	                                   ,globals.getGiorniSelezionatiTimbr()
									   ,null
									   ,null
									   ,null
									   ,null
									   ,true);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"1625A8BE-B17C-464F-BFE1-CCD17EB3932E"}
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
 * @properties={typeid:24,uuid:"32E68D4D-3636-4A3E-A2FB-318425B6E7E1"}
 */
function conteggiaTimbratureMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.conteggiaTimbratureMultiplo(_event,true);	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"30B30DE0-67B4-4783-B0E7-64EA4461E8F8"}
 */
function onFieldSelection(event) 
{
	var _recordIndex = foundset.getSelectedIndex();
	var _timeStamp = event.getTimestamp();
	var _lastClickTimeStamp = forms.giorn_mostra_timbr.last_click_timestamp;
	var _lastSelectedRecordIndex = forms.giorn_mostra_timbr.last_selected_recordindex;
	
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]])
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
		
		globals.aggiornaSelezioneGiorni(event, foundset.getSelectedIndex());
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6D05101B-9762-40BF-8950-987E9A07F85A"}
 */
function onOtherSelection(event) 
{
	var _recordIndex = foundset.getSelectedIndex();
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = _recordIndex;
	globals.aggiornaSelezioneGiorni(event,_recordIndex);
}

/**
 * Elimina la timbratura effettiva e ne crea una nuova corrispondente come causalizzata
 *  
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"C2448E06-B2F0-4932-8E0F-0D64BD442C8A"}
 * @AllowToRunInFind
 */
function rendiTimbrCausalizzata(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event) 
{
	databaseManager.setAutoSave(false);

	//recupero l'id della timbratura selezionata
	var _idTimbrature = foundset[_event.getElementName()];

	if (_idTimbrature) {
		/** @type {JSFoundset<db:/ma_presenze/e2timbratura>}*/
		var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
			globals.Table.TIMBRATURE);

		if (_fs.find()) {
			_fs.idtimbrature = _idTimbrature;
			if (_fs.search() == 0) {
				globals.ma_utl_showWarningDialog('Selezionare una timbratura valida', 'Rendi causalizzata la timbratura');
				return;
			}
		}

		var causale = globals.svy_nav_showLookupWindow(_event, 'causale', 'LEAF_Lkp_CausaliTimbrature', null, 'filterCausaliTimbratura', null, null, 'causale', true);

		var anno = globals.getAnno();
		var mese = globals.getAnno();
		var _giorno = forms['giorn_timbr_temp'].foundset.getSelectedIndex() - globals.offsetGg;
		var data = new Date(anno, mese - 1, _giorno);

		// inserimento timbratura corrispondente in timbrature causalizzate (indirizzo 'mn' e senso invertito)
		databaseManager.setAutoSave(false);
		databaseManager.startTransaction();
		// eliminazione timbratura effettiva
		_fs.timbeliminata = 1;
		/** @type {JSFoundset<db:/ma_presenze/e2timbratureservizio>} */
		var fsCaus = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE_SERVIZIO);
		var recCaus = fsCaus.getRecord(fsCaus.newRecord(false));
		if (recCaus) {
			recCaus.iddip = _fs.iddip;
			recCaus.indirizzo = 'mn';
			recCaus.senso = _fs.senso;
			recCaus.nr_badge = _fs.nr_badge;
			recCaus.dataeora = _fs.timbratura_datetime;
			recCaus.causale = causale;
			recCaus.sensocambiato = 0;
			recCaus.timbeliminata = 0;
			recCaus.competegiornoprima = 0;
			recCaus.idgruppoinst = _fs.idgruppoinst;

			if (!databaseManager.commitTransaction()) 
			{
				databaseManager.rollbackTransaction();
				globals.ma_utl_showErrorDialog('Timbratura causalizzata non inserita correttamente,riprovare.', 'Rendi causalizzata la timbratura');
				return;
			}
		} else {
			databaseManager.rollbackTransaction();
			globals.ma_utl_showErrorDialog('Non è stato possibile creare il nuovo record di causalizzata,riprovare.', 'Rendi causalizzata la timbratura');
			return;
		}

		// analizza pre conteggio
		forms.giorn_timbr.analizzaPreConteggio(_giorno);

		var indexToUpdate = foundset.getSelectedIndex();
		if (globals.getAnomalieGiornata(forms.giorn_header.idlavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT)) == 0) {
			var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?', 'Modifica timbrature');
			if (_respRiconteggia)
				globals.conteggiaTimbrature([forms.giorn_header.idlavoratore], [_giorno]);
			else
				forms.giorn_header.preparaGiornaliera(false, indexToUpdate);
		} else
			forms.giorn_header.preparaGiornaliera(false, indexToUpdate);
		
		globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);

	} else
		globals.ma_utl_showWarningDialog('Nessuna timbratura da eliminare', 'Eliminazione timbrature');
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
*
 * @properties={typeid:24,uuid:"2E588F3F-EC97-4BC9-B60A-913BF95178CE"}
 */
function ricalcolaCausalizzateGiorno(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var _giorno = forms['giorn_timbr_temp'].foundset.getSelectedIndex() - globals.offsetGg;
	
	var url = globals.WS_URL + '/Timbrature/RicalcolaCausalizzate'
	var params =
	{
		idditta				:	forms.giorn_header.idditta,
		periodo				:	globals.getPeriodo(),
		giorniselezionati	:	[_giorno],
		iddipendenti		:	[forms.giorn_header.idlavoratore]
	};
	
	var response = globals.getWebServiceResponse(url, params);
	if (response && response['returnValue'] === true)
	{
		forms.giorn_header.preparaGiornaliera();
		globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
	}
	else
		globals.ma_utl_showWarningDialog('Errore durante il ricalcolo delle causalizzate per il giorno, riprovare','Ricalcola le causalizzate del giorno');
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
*
 * @properties={typeid:24,uuid:"3DCE0C45-B956-4C64-8894-C6FC92A4A704"}
 */
function ricalcolaForzateGiorno(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var _giorno = forms['giorn_timbr_temp'].foundset.getSelectedIndex() - globals.offsetGg;
	
	var url = globals.WS_URL + '/Timbrature/RicalcolaForzate'
	var params =
	{
		idditta				:	forms.giorn_header.idditta,
		periodo				:	globals.getPeriodo(),
		giorniselezionati	:	[_giorno],
		iddipendenti		:	[forms.giorn_header.idlavoratore]
	};
	
	var response = globals.getWebServiceResponse(url, params);
	if (response && response['returnValue'] === true)
	{
		forms.giorn_header.preparaGiornaliera();
		globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
	}
	else
		globals.ma_utl_showWarningDialog('Errore durante il ricalcolo delle causalizzate per il giorno, riprovare','Ricalcola le causalizzate del giorno');
}

/**
 * Filtra le causali di timbratura della ditta
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"CDC1FCC8-61E5-44FE-B51C-9468E1F458BA"}
 */
function filterCausaliTimbratura(_fs)
{
	_fs.addFoundSetFilterParam('idditta','=',forms.giorn_header.idditta);
    return _fs;
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 *
 * @properties={typeid:24,uuid:"F5E54AD8-21C4-41E2-9A49-30B66870CB55"}
 */
function stampaCartolinaMensile(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.stampaCartolinePresenze(_event);
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 * @param vIdDitta
 *
 * @properties={typeid:24,uuid:"6F3BD0C6-10D8-41E9-87CE-F291B4D703EA"}
 */
function stampaReportCausalizzate(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,vIdDitta)
{
	var frm = forms.stampa_timbr_causalizzate;
	frm.vIdDitta = vIdDitta;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Stampa report causalizzate');	
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} vIdDitta
 *
 * @properties={typeid:24,uuid:"A565E64E-7311-429E-803E-E97246587598"}
 */
function stampaReportRiepilogoCausalizzate(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,vIdDitta)
{
	var frm = forms.stampa_timbr_riepilogo_causalizzate;
	frm.vIdDitta = vIdDitta;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Stampa report riepilogo causalizzate');	
}