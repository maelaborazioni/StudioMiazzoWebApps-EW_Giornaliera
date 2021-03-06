/**
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"BE010BE4-219A-4AAA-A497-B55D54430358"}
 * @AllowToRunInFind
 */
function apriPopupCartolinaDipendente(_event)
{
	var _idTimbratura = forms[_event.getFormName()].foundset.getSelectedRecord()[_event.getElementName()];
	
//	var _enableGgSucc = false;
//  var _enableGgPrec = false;
//        
//	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>} */
//	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);
//
//	// nel caso di timbratura con senso di entrata va disabilitata l'opzione di spostamento al giorno prec
//	// nel caso di timbratura con senso di uscita va disabilitata l'opzione di spostamento al giorno succ
//	if (_fs.find()) {
//		_fs.idtimbrature = forms[_event.getFormName()].foundset[_event.getElementName()];
//		if (_fs.search() > 0) {
//			
//			var _timbHhmm = utils.stringRight(_fs.timbratura.toString(),4);
//			var _timbHh = utils.stringLeft(_timbHhmm,2);
//			var _timbMm = utils.stringRight(_timbHhmm,2);
//			
//			var timbHhmm = parseInt(_timbHh,10) * 100 + parseInt(_timbMm,10);
//			
//			// caso entrata
//			if(_fs.senso == 0 && _fs.sensocambiato == 0 ||
//					_fs.senso == 1 && _fs.sensocambiato == 1)
//			    _enableGgPrec = false;
//			// caso uscita
//			else
//			{
//				if(timbHhmm >= 2400)
//				{
//					_enableGgSucc = true;
//					_enableGgPrec= false;
//				}
//				else
//				{
//					_enableGgSucc = false;
//					_enableGgPrec= true;
//				}
//		
//			}
//		}
//	}
	
	var _giorno = forms[_event.getFormName()].foundset.getSelectedRecord()['giorno'];
	//var _senso = utils.stringLeft(_event.getElementName(),1) == 'u' ? 1 : 0;
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	
	var _popUpMenuTimbr = _popUpMenu.addMenu('Gestione timbrature ');
	
	var indirizzoTimbratura = _idTimbratura ? scopes.giornaliera.getOrologioTimbratura(_idTimbratura) : null;
	var modifiable = globals.isGiornoConTimbratureMancanti(forms[_event.getFormName()].foundset.getSelectedRecord()['idlavoratore'],_giorno); 
	var conteggiato = globals.isGiornoConteggiato(forms[_event.getFormName()].foundset.getSelectedRecord()['idlavoratore'],_giorno);
	var sensoModifiable = (modifiable == 4 || modifiable == 5 || modifiable == 6) ? 0 : 1;
	
	var _addTimbrMulti = _popUpMenuTimbr.addMenuItem('Aggiungi timbrature ',aggiungiTimbratureMultiDaMenu);
		_addTimbrMulti.methodArguments = [_event, true, _giorno, sensoModifiable];
        _addTimbrMulti.enabled = modifiable;
    
    modifiable = modifiable && indirizzoTimbratura != null;
    
    if(globals.ma_utl_hasKey(globals.Key.TIMBR_DIPENDENTE_CAMBIO_SENSO))
	{
		var _sensoTimbr = _popUpMenuTimbr.addMenuItem('Cambia il senso della timbratura',cambiaSenso);
		    _sensoTimbr.methodArguments = [_event, true];
		    _sensoTimbr.enabled = modifiable;
	}    
    
	var deletable = !conteggiato && indirizzoTimbratura != null && indirizzoTimbratura == globals.TipiTimbratura.WEB;
	
	if(globals.ma_utl_hasKey(globals.Key.TIMBR_DIPENDENTE_ELIMINA))
	{
		var _delTimbr = _popUpMenuTimbr.addMenuItem('Elimina la timbratura ',eliminazioneTimbratura);
		    _delTimbr.methodArguments = [_event,true];
		    _delTimbr.enabled = deletable;
	}   
    	
//	var _ggSuccTimbr = _popUpMenuTimbr.addMenuItem('Sposta al giorno successivo',spostaGgSucc);
//	    _ggSuccTimbr.enabled = _enableGgSucc;
//	    _ggSuccTimbr.methodArguments = [_event];
//	var _ggPrecTimbr = _popUpMenuTimbr.addMenuItem('Sposta al giorno precedente',spostaGgPrec);
//	    _ggPrecTimbr.enabled = _enableGgPrec;
//	    _ggPrecTimbr.methodArguments = [_event];
	
	_popUpMenuTimbr.addSeparator();
	
    // TODO verificare se vale la pena di riabilitarlo		                      
	//	var _teoricoTimbr = _popUpMenuTimbr.addMenuItem('Completa con teorico ',completaConOrarioTeorico);
	//    _teoricoTimbr.methodArguments = [_event,true,_idLavoratore,_giorno];
		
    _popUpMenu.addSeparator();
    
    // TODO verificare se vale la pena di riabilitarlo
	//    var _popUpMenuEv = _popUpMenu.addMenu('Gestione assenze ');
	//         if(_squadrato)
	//        	 _popUpMenuEv.setEnabled(true);
	//         else
	//             _popUpMenuEv.setEnabled(false);
	//    var _gestEv = _popUpMenuEv.addMenuItem('Vai alla gestione assenze ',vaiAllaGestioneAssenze);     
	//        _gestEv.methodArguments = [_event];
	//        _gestEv.enabled = globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI);
	
    // la parte di operazioni sulle stampe è visibile solamente a chi può poi accedere allo storico operazioni
    // per poter scaricare il file generato    
//    if(globals.ma_utl_hasKey(globals.Key.STORICO_OPERAZIONI))
//    {
//	    var _popUpMenuStampe = _popUpMenuTimbr.addMenu('Stampe');
//	    var _popUpMenuStampeCart = _popUpMenuStampe.addMenuItem('Cartolina mensile',stampaCartolinaMensileDipendente);
//	    _popUpMenuStampeCart.methodArguments = [_event,globals.getAnno(),globals.getMese()];
//	    var _popUpMenuStampeAnomalie = _popUpMenuStampe.addMenuItem('Anomalie timbrature',stampaAnomalieTimbratureDipendente);
//	    var periodo = globals.getPeriodo();
//	    _popUpMenuStampeAnomalie.methodArguments = [_event,globals.getFirstDatePeriodo(periodo),globals.getLastDatePeriodo(periodo)];
//    }
	
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
 * @properties={typeid:24,uuid:"1A035C59-8280-4172-87AC-E1510F9DB5AD"}
 */
function vaiAllaGestioneAssenze(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
//	globals.selezione_GR();
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"BA1445E0-BB52-467F-9767-814E5079720F"}
 */
function onRenderTimbrCartolina(event) 
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
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 * @param _anno
 * @param _mese
 * 
 * @properties={typeid:24,uuid:"D3F30E6E-E0C9-4095-8E4F-DA04FC1E1691"}
 */
function stampaCartolinaMensileDipendente(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _anno, _mese)
{
	var idlavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	var params = new Object();
	
	params['idditta'] = globals.getDitta(idlavoratore);
	if(!params['idditta'])
	{
		globals.ma_utl_showWarningDialog('i18n:ma.msg.employee_not_found');
		return;
	}
		
	params['user_id'] = security.getUserName(); 
	params['client_id'] = security.getClientID();
	params['iddipendenti'] = [idlavoratore];
	params['periodo'] = _anno * 100 + _mese;
	params['daticontrattuali'] = 1;
	params['eventigiornaliera'] = 0;
	params['solocartolinecontimbr'] = 0;
	params['timbrmanuali'] = 1;
	params['timbrcausalizzate'] = 0;
	params['soloeventi'] = 0;
	params['totalieventi'] = 0;
	params['solotimbrmanuali'] = 0;
	params['spediscimail'] = 0;
	params['periodoal'] = params['periodo'];
	params['groupcontratto'] = 0;
	params['groupqualifica'] = 0;
	params['groupposizioneInps'] = 0;
	params['groupsedelavoro'] = 0;
	params['groupraggruppamento'] = 0;
	params['grouptiporaggruppamento'] = 0;
	
	var url = globals.WS_REPORT_URL + (globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ?  "/Report" : "/Stampe") + "/StampaCartolinaPresenze";
	globals.addJsonWebServiceJob(url, params);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 * @param _dal
 * @param _al
 *
 * @properties={typeid:24,uuid:"CCE761E8-A3E4-4A49-AE23-86521F1311A8"}
 */
function stampaAnomalieTimbratureDipendente(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _dal, _al)
{
	var idlavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	var iddipendenti = [idlavoratore];
	
	var params = new Object;
	
    params['idditta'] = globals.getDitta(idlavoratore);    
    if(!params['idditta'])
    {
    	globals.ma_utl_showWarningDialog('i18n:ma.msg.employee_not_found');
    	return;
    }
    
    params['user_id'] = security.getUserName(); 
	params['client_id'] = security.getClientID();
    params['iddipendenti'] = iddipendenti;
    params['dalladata'] = utils.dateFormat(_dal,globals.EU_DATEFORMAT);
    params['alladata'] = utils.dateFormat(_al,globals.EU_DATEFORMAT);
    params['dividiperdip'] = 0;
    params['indirizzomail'] = "";
    params['spediscimail'] = 0;
    params['tipoconnessione'] = 1;
    params['periodo'] = _dal.getFullYear()*100 + _al.getMonth() + 1;
    params['groupcontratto'] = 0;
	params['groupqualifica'] = 0;
	params['groupposizioneinps'] = 0;
	params['groupsedelavoro'] = 0;
	params['groupraggruppamento'] = 0;
	params['grouptiporaggruppamento'] = 0;
	
    var url = globals.WS_REPORT_URL + (globals.WS_DOTNET_CASE == globals.WS_DOTNET.CORE ?  "/Report" : "Stampe") + "/StampaAnomalieTimbrature";
    globals.addJsonWebServiceJob(url,params);	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"795715D1-4861-4728-B35D-BE1B8B9E5C28"}
 */
function onFieldSelection(event) 
{
	var _recordIndex = foundset.getSelectedIndex();
	var _timeStamp = event.getTimestamp();
	var _lastClickTimeStamp = forms.giorn_mostra_timbr.last_click_timestamp;
	var _lastSelectedRecordIndex = forms.giorn_mostra_timbr.last_selected_recordindex;
	
	if(_recordIndex == _lastSelectedRecordIndex)
	{
		if(_timeStamp - _lastClickTimeStamp < globals.intervalForDblClk)
			modificaTimbraturaDipendente(event);
		
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
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"68532566-F3A3-484F-AD60-16B22794DA8C"}
 */
function modificaTimbraturaDipendenteDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	modificaTimbraturaDipendente(_event);
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"8A732A09-2446-4589-9E17-1CB41C1F2BAB"}
 */
function modificaTimbraturaDipendente(_event)
{
	var autosave = false;//databaseManager.getAutoSave();
	try
	{
		if (forms.giorn_header._vNrBadge != null)
		{
			var _frm = forms.giorn_modifica_timbr_dtl;
			/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
			var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);
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
				//aggiungiTimbratura(_event,null,true);
				globals.aggiungi_timbratura_dipendente(true,
					                                   foundset.getSelectedRecord()['giorno'],
													   utils.stringLeft(_event.getElementName(),1) == 'u' ? 1 : 0);
				return;
			}
	
			var _frmFs = _frm.foundset;
			
			_frmFs.newRecord();
	
			_frmFs.timbratura = _timbrOri;
			_frmFs.senso = _sensoOri != null ? _sensoOri : 0;
			_frmFs.indirizzo = _orologioOri;
			_frm._ggSucc = _frmFs.ggsucc = _ggSuccOri;
			_frm.elements.fld_senso.enabled = false;
			_frm.elements.fld_ggsucc.enabled = false;
			_frm._competenzaGGPrec = _competenzaGGPrec;
			_frmFs.iddip = forms.giorn_cart_header.idlavoratore;
			_frmFs.nr_badge = forms.giorn_header._vNrBadge;
			_frmFs.idgruppoinst = globals.getGruppoInstallazioneLavoratore(forms.giorn_cart_header.idlavoratore);
			_frm._solocartolina = true;
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
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @private
 *
 * @properties={typeid:24,uuid:"19BE79FB-3FA0-4007-9A28-B45C9C957F8E"}
 */
function onRecordSelection(event, _form) 
{
	var currIdGiornaliera = -1;
	
	if (foundset && foundset.getSize() > 0 && foundset['idgiornaliera']) 
		currIdGiornaliera = foundset['idgiornaliera'];
		
	forms.giorn_mostra_timbr_cartolina.foundset.loadRecords(currIdGiornaliera);
	forms.giorn_mostra_timbr_cartolina.aggiornaRiepiloghiGiorno(currIdGiornaliera);
	forms.giorn_mostra_timbr_cartolina.aggiornaBadgeEffettivo();				
}
