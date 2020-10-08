/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F8827702-7BC3-4A2C-97B6-52832D727661",variableType:4}
 */
var sel_index = 1;

/**
 * @properties={typeid:35,uuid:"CDBCD206-4262-4957-805D-6C7610EA68B2",variableType:-4}
 */
var iddipendente = null;

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"D8F45D98-FFB1-4840-9177-47533F21E747"}
 * @AllowToRunInFind
 */
function onRenderTimbrMancanti(event) 
{
	var recInd = event.getRecordIndex();
	var recRen = event.getRenderable();
	var rec = event.getRecord();
	var elementName = recRen.getName();

	if(recInd % 2 != 0)
	{
		recRen.bgcolor = globals.Colors.ODD.background;
		recRen.fgcolor = globals.Colors.ODD.foreground;
	}
	else
	{
		recRen.bgcolor = globals.Colors.EVEN.background;
		recRen.fgcolor = globals.Colors.EVEN.foreground;
	}
	
	if(rec != null)
	{		
		recRen.enabled = true;
		
		// disabilitiamo il pulsante di visualizzazione causalizzate se non ve ne sono
		if(elementName == 'btn_causalizzate')
		{
			/** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>} */
			var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
			if(fs.find())
			{
				fs.idgiornaliera = foundset['idgiornaliera'];
				if(fs.search())
				{
					// aggiornamento timbrature causalizzate
				    if(fs.e2giornaliera_to_e2timbratureservizio.getSize() == 0)
				    	recRen.enabled = false;
				}
			}
		}
		
		var matches = /^(entrata|uscita)_([0-9])$/i.exec(elementName);
		if (matches)
		{
			if(rec[elementName])
			{
				var giorno_succ = rec['timbrature_to_e2timbrature_' + elementName].timbratura_ggsucc;
				if (giorno_succ)
				{
					recRen.toolTipText += ' - giorno successivo';
					recRen.format = '00.00 >|mask';
				}
				
				// le timbrature manuali, forzate e causalizzate vanno in corsivo
				var _indirizzo = globals.getTooltipTimbratura(rec[elementName]);
				switch(_indirizzo)
				{
					case 'mn':
						recRen.toolTipText = 'Timbratura manuale';
						recRen.font = 'Arial,2,11';
						break;
						
					case 'cz':
						recRen.toolTipText = 'Timbratura causalizzata';
						recRen.font = 'Arial,2,11';
						break;
						
					case 'fz':
						recRen.toolTipText = 'Timbratura forzata';
						recRen.font = 'Arial,2,11';
						break;
						
					default:
						recRen.toolTipText = 'Orologio : ' + _indirizzo;
						break;
				}
			}
			else
			{
				// uscita senza entrata -> colora l'entrata, entrata senza uscita -> colora l'uscita
				if((matches[1] == 'entrata' && rec['uscita_' + matches[2]]) || matches[1] == 'uscita' && rec['entrata_' + matches[2]])
				{
					recRen.bgcolor = 'yellow';
				    recRen.fgcolor = 'blue';
				    recRen.font = 'Arial,2,11';
				}
			}
		}
	}
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DA850374-C317-4473-B23C-8B0174206902"}
 * @SuppressWarnings(unused)
 */
function onDataChangeTimbratura(oldValue, newValue, event) 
{
	if(oldValue)
	{
		globals.ma_utl_showWarningDialog('Le timbrature precedentemente inserite non sono modificabili','Inserimento timbrature anomalie');
		foundset[event.getSource().getDataProviderID()] = oldValue;
		return true;
	}
		
	if(globals.ma_utl_isNullOrUndefined(newValue))
		return true;
	
	var timbr_hhmm = newValue.toFixed(2);
	if(!globals.validaTimbratura(timbr_hhmm))
	{
		foundset[event.getSource().getDataProviderID()] = oldValue;
		globals.ma_utl_showWarningDialog('Inserire un orario valido secondo la formattazione hh.mm (ore : 0-23, minuti : 0-60)','Inserimento timbrature anomalie');
		return true;
	}
	
    // recupero informazioni sulla timbratura inserita
	/** @type {JSForm<giorn_timbr_cartolina_mancanti>}*/
	var fs = forms[event.getFormName()].foundset;
	
	var idgiornaliera = fs['idgiornaliera'];
	if(!idgiornaliera)
		return false;
	
	var idlavoratore = globals.getIdLavoratoreDaIdGiornaliera(idgiornaliera)
	var idGruppoInst = globals.getGruppoInstallazioneLavoratore(idlavoratore);
	var giorno_timbr = globals.getGiornoDaIdGiornaliera(fs['idgiornaliera']);
	var senso_timbr  = utils.stringLeft(event.getElementName(), 1) == 'e' ? 0 : 1;
	var badge_timbr  = globals.getNrBadge(idlavoratore,giorno_timbr);
	
	switch(globals.validaInserimentoTimbratura(idlavoratore, timbr_hhmm, giorno_timbr, senso_timbr, 0, false)) 
	{
		// TIMBRATURA CORRETTA
		case 0:
			if(inserisciTimbratura(idlavoratore, giorno_timbr, senso_timbr, timbr_hhmm, badge_timbr, idGruppoInst))
			{
				aggiornaVisualizzazione(idlavoratore, giorno_timbr);
				moveFocusToNextElement(event);
				
				return true;
			}
			break;
		// TIMBRATURA NON COMPILATA CORRETTAMENTE
		case 1:
			globals.ma_utl_showWarningDialog('<html>Controllare che tutti i campi necessari siano compilati</html>', 'Inserimento timbrature anomalie');
			break;
			
		case 2:
			globals.ma_utl_showWarningDialog('<html>Controllare che i valori della timbratura siano corretti</html>', 'Inserimento timbrature anomalie');
			break;
			
		// TIMBRATURA GIÀ PRESENTE
		case 3:
			globals.ma_utl_showWarningDialog('<html>Esiste già una timbratura con questi valori!</html>', 'Inserimento timbrature anomalie');
			break;
	}
	
	return false;
}

/**
 * Inserisci la nuova timbratura 
 * 
 * @param {Number} idLav
 * @param {Date} _giorno
 * @param {Number} sensoTimbr
 * @param {String} HHmm
 * @param {Number} nrBadge
 * @param {Number} idGruppoInst
 *
 * @return Boolean
 * 
 * @properties={typeid:24,uuid:"B8ED3D53-7200-40E7-AC06-52089E69FB01"}
 */
function inserisciTimbratura(idLav, _giorno, sensoTimbr, HHmm, nrBadge, idGruppoInst)
{
	// salvataggio timbratura inserita
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
	var fsTimbr = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);
	databaseManager.setAutoSave(false);
	databaseManager.startTransaction();
	fsTimbr.newRecord();
	fsTimbr.iddip = idLav;
	fsTimbr.ggsucc = false;
	fsTimbr.nr_badge = nrBadge;
	fsTimbr.idgruppoinst = idGruppoInst;
	// l'inserimento da parte del gestore implica la causale manuale dell'orologio
	fsTimbr.indirizzo = 'mn';
	fsTimbr.timbeliminata = 0;
	fsTimbr.sensocambiato = false;
	fsTimbr.senso = sensoTimbr;
	fsTimbr.timbratura = parseInt(utils.stringRight(HHmm, 2), 10) + parseInt(utils.stringLeft(HHmm, 2), 10) * 100 + _giorno.getDate() * 10000 + (_giorno.getMonth() + 1) * 1000000 + _giorno.getFullYear() * 100000000;

	if (!databaseManager.commitTransaction()) {
		globals.ma_utl_showErrorDialog('Inserimento timbratura ' + utils.stringLeft(HHmm,2) + '.' + utils.stringRight(HHmm,2) + ' non riuscito, riprovare.', 'Modifica timbratura');
		databaseManager.rollbackTransaction();
		return false;
	}

	return true;
}

/**
 * 
 * @param {Number} idLav
 * @param {Date} _giorno
 *
 * @properties={typeid:24,uuid:"D14A841A-D651-4EDC-B76E-8C7F268FD96C"}
 */
function aggiornaVisualizzazione(idLav, _giorno)
{
	var data = new Date(_giorno);

	// analizza pre conteggio
	forms.giorn_timbr.analizzaPreConteggio(data.getDate(), idLav, data.getFullYear() * 100 + data.getMonth() + 1);

	//aggiorna la visualizzazione
	globals.aggiornaAnomalieTimbratureDipendente(idLav, data.getFullYear(), data.getMonth() + 1, forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate());
}

/**
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"CD1535A9-DA1C-465B-A0B2-14CD7A41BC0A"}
 * @AllowToRunInFind
 * @SuppressWarnings(wrongparameters)
 */
function apriPopupMostraTimbr(_event)
{
	var _enableGgSucc = true;
    var _enableGgPrec = true;
    
	var _idLavoratore = globals.getIdLavoratoreDaIdGiornaliera(forms[_event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);
	var _idDitta = globals.getDitta(_idLavoratore);
	var _giorno = globals.getGiornoDaIdGiornaliera(forms[_event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);
	var _giorni = [];
	for(var g = 1; g <= foundset.getSize(); g++)
	{
		_giorni.push(globals.getGiornoDaIdGiornaliera(forms[_event.getFormName()].foundset.getRecord(g)['idgiornaliera']));
	}
	
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>} */
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE);

	// nel caso di timbratura con senso di entrata va disabilitata l'opzione di spostamento al giorno prec
	// nel caso di timbratura con senso di uscita va disabilitata l'opzione di spostamento al giorno succ
	if (_fs.find()) 
	{
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
	
	var manuale = globals.getTooltipTimbratura(foundset[_event.getElementName()]) == 'mn';
	
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	var _teorico = _popUpMenu.addMenuItem('Completa con orario teorico',completaConOrarioTeorico);
	    _teorico.methodArguments = [_event, _idLavoratore, _giorno, _event.getElementName()];
	    _teorico.enabled = forms[_event.getFormName()].foundset[_event.getElementName()] ? false : true;
	
	_popUpMenu.addSeparator();
	
	var _addTimbr = _popUpMenu.addMenuItem('Aggiungi una timbratura ',aggiungiTimbraturaDaMenuAnomalie);
		_addTimbr.methodArguments = [_event,_idLavoratore,_giorno];
	var _modTimbr = _popUpMenu.addMenuItem('Modifica la timbratura selezionata ',modificaTimbraturaDaMenuAnomalie);
	    _modTimbr.methodArguments = [_event,_idLavoratore,_giorno];
	    _modTimbr.enabled = manuale;
	var _delTimbr = _popUpMenu.addMenuItem('Elimina la timbratura selezionata ',eliminaTimbraturaDaMenuAnomalie);
	    _delTimbr.methodArguments = [_event,_idLavoratore,_giorno];
	var _sensoTimbr = _popUpMenu.addMenuItem('Cambia il senso della timbratura',cambiaSensoDaMenuAnomalie);
	    _sensoTimbr.methodArguments = [_event,_idLavoratore];
	var _ggSuccTimbr = _popUpMenu.addMenuItem('Sposta al giorno successivo',spostaGgSuccDaMenuAnomalie);
	    _ggSuccTimbr.enabled = _enableGgSucc;
	    _ggSuccTimbr.methodArguments = [_event,_idLavoratore,_giorno];
	var _ggPrecTimbr = _popUpMenu.addMenuItem('Sposta al giorno precedente',spostaGgPrecDaMenuAnomalie);
	    _ggPrecTimbr.enabled = _enableGgPrec;
	    _ggPrecTimbr.methodArguments = [_event,_idLavoratore,_giorno];	 
	var _conteggia = _popUpMenu.addMenuItem('Conteggia il giorno selezionato ', conteggiaGiorno);
	    _conteggia.methodArguments = [_event,_idLavoratore,_giorno];   
	var _conteggiaGiorniDip = _popUpMenu.addMenuItem('Conteggia i giorni del dipendente selezionato ', conteggiaGiorniDipendente);
	    _conteggiaGiorniDip.methodArguments = [_event,_idLavoratore,_giorno.getFullYear(),_giorno.getMonth()+1];    
	var _conteggiaTuttiIGiorni = _popUpMenu.addMenuItem('Conteggia tutti i giorni dei dipendenti nella visualizzazione corrente', conteggiaTuttiIGiorniVisualizzati);
	 	_conteggiaTuttiIGiorni.methodArguments = [_event,_idDitta,_giorno.getFullYear(),_giorno.getMonth()+1];
	    
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
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"694A1B7C-3D6C-4A39-8AB9-ED0AA7E2FEC4"}
*/
function aggiungiTimbraturaDaMenuAnomalie(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav,_giorno)
{
    aggiungiTimbraturaAnomalia(_event,_idLav,_giorno);
}

/**
 * @param {JSEvent} _event
 * @param {Number} _idLav
 * @param {Date} _giorno
 *
 * @properties={typeid:24,uuid:"EB45C7D4-7BF6-4B0A-8729-4D8834D79F72"}
 */
function aggiungiTimbraturaAnomalia(_event,_idLav,_giorno)
{
    databaseManager.setAutoSave(false);
	
    var _nrBadge = globals.getNrBadge(_idLav,_giorno);
    var _frm = forms.giorn_modifica_timbr_anomalie_dtl;
    _frm._idLav = _idLav;
    _frm._contFormName = _event.getFormName();
    if (_nrBadge != null)
    {
		var _fs = _frm.foundset;
		
		if(_fs.newRecord(false) == -1)
		{
			globals.ma_utl_showErrorDialog('Errore durante l\'aggiunta della nuova timbratura','Aggiungi una timbratura alla giornata (gestione anomalie)');
			databaseManager.rollbackTransaction();
			return;
		}
		
		_frm._gg = _giorno.getDate();
		_frm._MM = _giorno.getMonth() + 1;
		_frm._yy = _giorno.getFullYear();
		_frm._ggSucc = false;
		_frm.elements.fld_senso.enabled = true;
		_frm.elements.fld_ggsucc.enabled = true;
			
		_fs.iddip = _idLav;
		_fs.nr_badge = _nrBadge;
		_fs.senso = utils.stringLeft(_event.getElementName(),1) == 'e' ? 0 : 1;
		_fs.indirizzo = 'mn';
		_fs.idgruppoinst = globals.getGruppoInstallazioneLavoratore(_idLav);		
	    				
		globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
		globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Aggiungi una timbratura alla giornata (gestione anomalie)');
	}
	else 		
		globals.ma_utl_showWarningDialog('Il dipendente non ha un numero di badge valido', 'Aggiungi una timbratura alla giornata (gestione anomalie)');
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"EE9CD67B-A1F5-408B-A011-4C6283A73ECA"}
* @AllowToRunInFind
*/
function modificaTimbraturaDaMenuAnomalie(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav,_giorno)
{
   modificaTimbraturaAnomalia(_event,_idLav,_giorno);
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSEvent} _event
 * @param {Number} _idLav
 * @param {Date} _giorno
 *
 * @properties={typeid:24,uuid:"9F88C42C-8886-4B28-8413-0B014D05A903"}
 */
function modificaTimbraturaAnomalia(_event,_idLav,_giorno)
{
	databaseManager.setAutoSave(false);

	var _nrBadge = globals.getNrBadge(_idLav,_giorno); 
	if (_nrBadge != null) 
	{
		var _frm = forms.giorn_modifica_timbr_anomalie_dtl;
//		var _fs = _frm.foundset;
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

			if (_rows > 0)
			{
				_fs.timbeliminata = 1;
				_frm._idLav = _idLav;
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
				if (!eliminaTimbratura(_fs.idtimbrature, true))
					return;

			} else {
				globals.ma_utl_showErrorDialog('Recupero della timbratura da modificare non riuscita', 'Modifica timbratura');
				return;
			}

		} else {
			aggiungiTimbraturaAnomalia(_event,_idLav,_giorno);
			return;
		}

		databaseManager.startTransaction();

		_fs.newRecord();

		_fs.timbratura = _timbrOri;
		_fs.senso = _sensoOri != null ? _sensoOri : 0;
		_fs.indirizzo = _orologioOri;
		_frm._ggSucc = _fs.ggsucc = _ggSuccOri;
		_frm.elements.fld_senso.enabled = false;
		_frm.elements.fld_ggsucc.enabled = false;
		_frm._competenzaGGPrec = _competenzaGGPrec;
		_fs.iddip = _idLav;
		_fs.nr_badge = _nrBadge;
		_fs.idgruppoinst = globals.getGruppoInstallazioneLavoratore(_idLav);

		_frm.foundset.loadRecords(_fs);
		globals.ma_utl_setStatus(globals.Status.EDIT, _frm.controller.getName());
		globals.ma_utl_showFormInDialog(_frm.controller.getName(), 'Modifica la timbratura selezionata');

	} else
		globals.ma_utl_showWarningDialog('Il dipendente non ha un numero di badge valido', 'Modifica timbrature');
	
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"D1C48496-B929-40BC-8A4C-81E520267F73"}
*/
function eliminaTimbraturaDaMenuAnomalie(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav,_giorno)
{
	sel_index = foundset.getSelectedIndex();
	
	var autosave = databaseManager.getAutoSave();
	databaseManager.setAutoSave(false);

	//recupero l'id della timbratura selezionata
	/** @type {String}*/
	var _idTimbrature = foundset[_event.getElementName()];
	if (_idTimbrature) 
	{
		if(eliminaTimbratura(parseInt(_idTimbrature), true))
		{
			// analizza pre conteggio
			forms.giorn_timbr.analizzaPreConteggio(_giorno.getDate(),_idLav,_giorno.getFullYear() * 100 + _giorno.getMonth() + 1);

			// aggiorna la visualizzazione
			globals.aggiornaAnomalieTimbratureDipendente(_idLav,_giorno.getFullYear(),_giorno.getMonth()+1,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate(),null,true);
			
			// Sposta al prossimo elemento per evitare che il nuovo valore venga sovrascritto 
		    moveFocusToNextElement(_event);
		}
	} 
	else
		globals.ma_utl_showWarningDialog('Nessuna timbratura da eliminare', 'Eliminazione timbrature');
	
	databaseManager.setAutoSave(autosave);
}
/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* 
* @properties={typeid:24,uuid:"F60D4F27-A1DF-4006-A502-267CABEE8B61"}
* @AllowToRunInFind
* @SuppressWarnings(unused)
*/
function cambiaSensoDaMenuAnomalie(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav)
{
	sel_index = foundset.getSelectedIndex();
	
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
			var response = true;//globals.ma_utl_showYesNoQuestion('Cambiare il senso della timbratura?','Cambio senso della timbratura');

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
					var anomaliaPre =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(data, globals.ISO_DATEFORMAT));
					
					// analizza pre conteggio
					forms.giorn_timbr.analizzaPreConteggio(_gg,_idLav,_yy * 100 + _MM);

					// situazione anomalia partenza
					var anomaliaPost =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(data, globals.ISO_DATEFORMAT));
				    
				    //se il giorno della timbratura modificata risulta già conteggiato
//				    if(anomaliaPre == 0 && anomaliaPre != anomaliaPost)
//				    {
//				    	var _respRiconteggia = globals.ma_utl_showYesNoQuestion('Riconteggiare la giornata modificata?','Modifica timbrature');
//						if(_respRiconteggia)
//						   globals.conteggiaTimbrature([_idLav],[_gg]);
//						else
//						   forms.giorn_header.preparaGiornaliera();
//				    }
//				    else	    
//					     forms.giorn_header.preparaGiornaliera();  
				 					
			   }
			   
			   // aggiorna la visualizzazione
			   globals.aggiornaAnomalieTimbratureDipendente(_idLav,_yy,_MM,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate(),null,false);
			   
			   // Sposta al prossimo elemento per evitare che il nuovo valore venga sovrascritto
			   moveFocusToNextElement(_event);
            }
               
	}
	else
	   globals.ma_utl_showWarningDialog('Nessuna timbratura con senso invertibile', 'Cambia senso timbratura');
}
/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"54C407EB-682F-4F1C-B9D2-B4510DCC7ED2"}
* @AllowToRunInFind
* @SuppressWarnings(unused)
*/
function spostaGgSuccDaMenuAnomalie(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _idLav,_giorno)
{
	sel_index = foundset.getSelectedIndex();
	
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
    		globals.ma_utl_showWarningDialog('Selezionare una timbratura valida','Spostamento al giorno successivo');
    		return;
    	}
    }
    else
    {
       	globals.ma_utl_showWarningDialog('Cannot go to find mode','Spostamento al giorno successivo');
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
			var anomaliaPre =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
            
			if(!databaseManager.commitTransaction())
			{
			  globals.ma_utl_showErrorDialog('Spostamento non riuscito, riprovare eventualmente ripristinando le timbrature','Spostamento al giorno successivo');
			  databaseManager.rollbackTransaction();
			}
			else
			{
				// analizza pre conteggio per entrambi i giorni interessati
				forms.giorn_timbr.analizzaPreConteggio(_ggFin,_idLav,_yyFin * 100 + _MMFin);
				forms.giorn_timbr.analizzaPreConteggio(_ggOri,_idLav,_yyOri * 100 + _MMOri);

				// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
				// la compilazione di base che ve a creare il record nella tabella e2giornaliera
				if(globals.getIdGiornalieraDaIdLavGiorno(_idLav,_dataFinale) == null)
				   globals.compilaDalAlSingolo(_idLav,[_ggFin]);
				
				// situazione anomalia finale
				var anomaliaPost =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
			    				 
				// aggiorna la visualizzazione
			    globals.aggiornaAnomalieTimbratureDipendente(_idLav,_yyFin,_MMFin,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate(),null,true);
			    
			    // Il ridisegno annulla la selezione, quindi è necessario ripristinarla
				if(foundset)
					foundset.setSelectedIndex(sel_index);
				// Sposta al prossimo elemento per evitare che il nuovo valore venga sovrascritto 
			    moveFocusToNextElement(_event);
			}
        }
		
	}
	//se non è presente si è cliccato su una cella vuota, gestiamo l'aggiunta di una nuova timbratura
	else
		//gestione nuova timbratura
		aggiungiTimbraturaAnomalia(_event,_idLav,_giorno);
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _idLav
* @param {Date} _giorno
* 
* @properties={typeid:24,uuid:"27BFF784-ACC9-4B03-88E0-05FDCBA06F62"}
* @AllowToRunInFind
* @SuppressWarnings(unused)
*/
function spostaGgPrecDaMenuAnomalie(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLav,_giorno)
{
	sel_index = foundset.getSelectedIndex();
	
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
    		globals.ma_utl_showWarningDialog('Selezionare una timbratura valida','Spostamento al giorno precedente');
    		return;
    	}
    }
    else
    {
       	globals.ma_utl_showWarningDialog('Cannot go to find mode','Spostamento al giorno precedente');
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
			var anomaliaPre =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));
            
			if(!databaseManager.commitTransaction())
			{
			  globals.ma_utl_showErrorDialog('Spostamento non riuscito, riprovare eventualmente ripristinando le timbrature','Spostamento al giorno precedente');
			  databaseManager.rollbackTransaction();
			}
			else
			{
				// analizza pre conteggio per entrambi i giorni interessati
				forms.giorn_timbr.analizzaPreConteggio(_ggFin,_idLav,_yyFin * 100 + _MMFin);
				forms.giorn_timbr.analizzaPreConteggio(_ggOri,_idLav,_yyOri * 100 + _MMOri);

				// se la timbratura è stata inserita per una giornata non ancora compilata viene eseguita 
				// la compilazione di base che ve a creare il record nella tabella e2giornaliera
				if(globals.getIdGiornalieraDaIdLavGiorno(_idLav,_dataFinale) == null)
				   globals.compilaDalAlSingolo(_idLav,[_ggFin]);
				
				// situazione anomalia finale
				var anomaliaPost =  globals.getAnomalieGiornata(_idLav, utils.dateFormat(_dataFinale, globals.ISO_DATEFORMAT));

				// aggiorna la visualizzazione
			    globals.aggiornaAnomalieTimbratureDipendente(_idLav,_yyFin,_MMFin,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate(),null,true);
			    
			    // Il ridisegno annulla la selezione, quindi è necessario ripristinarla
				if(foundset)
					foundset.setSelectedIndex(sel_index);
				// Sposta al prossimo elemento per evitare che il nuovo valore venga sovrascritto
			    moveFocusToNextElement(_event);
			}
        }
		
	}
	//se non è presente si è cliccato su una cella vuota, gestiamo l'aggiunta di una nuova timbratura
	else
		//gestione nuova timbratura
		aggiungiTimbraturaAnomalia(_event,_idLav,_giorno);

}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idLavoratore
 * @param {Date} _giorno
 * 
 * @properties={typeid:24,uuid:"A8D26FD5-7DBD-4C51-B6CF-EB374F3EF96C"}
 */
function conteggiaGiorno(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLavoratore,_giorno)
{	
	var _params = {
        processFunction: process_conteggia_singolo_dip_anomalie,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [_idLavoratore,_giorno]
    };
	plugins.busy.block(_params);

}

/**
 * @param {Number} idLavoratore
 * @param {Date} gg
 *
 * @properties={typeid:24,uuid:"444E533B-0D28-4CE8-AC00-B03BFB9590D2"}
 */
function process_conteggia_singolo_dip_anomalie(idLavoratore,gg)
{
	try
	{
        // il conteggio avviene direttamente senza conferma
		var response = conteggiaGiornoAnomalie(idLavoratore,gg);
		if(!response || response.StatusCode != globals.HTTPStatusCode.OK || !response.ReturnValue)
			throw new Error('Si è verificato un errore durante il conteggio, riprovare', 'Conteggio timbrature');
		else
		{
			var _yy = gg.getFullYear();
			var _MM = gg.getMonth() + 1;
			
			//ricalcolo della situazione anomalie dopo l'ultima operazione effettuata
			var dsAnomalie = globals.ottieniDataSetAnomalie(idLavoratore,
	                                                        new Date(_yy,_MM-1,1),
	                                                        forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl : globals.TODAY);
			
			// aggiorna la visualizzazione verificando la nuova situazione del dipendente 
			globals.aggiornaAnomalieTimbratureDipendente(idLavoratore,_yy,_MM,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate(),dsAnomalie);
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_conteggia_singolo_dip_anomalie : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idLavoratore
 * @param {Number} _anno
 * @param {Number} _mese
 * 
 * @properties={typeid:24,uuid:"666385E2-A0E8-43A0-BE74-CE214018833A"}
 */
function conteggiaGiorniDipendente(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idLavoratore,_anno,_mese)
{	
	var msg = "Procedere con il conteggio?";
	var answer = globals.ma_utl_showYesNoQuestion(msg ,'Conteggia timbrature');
	if (answer) 
	{	
		var _params = {
	        processFunction: process_conteggia_dip_anomalie,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : '',
	        fontType: 'Arial,4,25',
	        processArgs: [_idLavoratore]
	    };
		plugins.busy.block(_params);
	}
}

/**
 * @param {Number} _idLavoratore
 *
 * @properties={typeid:24,uuid:"8AB4291C-D75B-4E3C-9C46-5C916448F42E"}
 */
function process_conteggia_dip_anomalie(_idLavoratore)
{
	try
	{
		var fsLav = foundset;
		/** @type {Array<Date>}*/
		for(var g = 1; g <= fsLav.getSize(); g++)
		{
			var gg = utils.parseDate(fsLav.getRecord(g)['giornomese'], globals.EU_DATEFORMAT);
			
			var response = conteggiaGiornoAnomalie(_idLavoratore, gg);
			if(!response || response.StatusCode != globals.HTTPStatusCode.OK || !response.ReturnValue)
			throw new Error('Si è verificato un errore durante il conteggio del dipendente ' + 
				           	globals.getNominativo(_idLavoratore) + ' , riprovare', 'Conteggio timbrature');
		}		
		// aggiorniamo la situazione generale delle anomalie sulle timbrature
		forms.giorn_timbr_mancanti_ditta.preparaAnomalieDitta
		(
			  forms.giorn_timbr_mancanti_ditta.idditta
			, forms.giorn_timbr_mancanti_ditta.annoRif
			, forms.giorn_timbr_mancanti_ditta.meseRif
			, forms.giorn_timbr_mancanti_ditta.limitaAl
		);
	}
	catch(ex)
	{
		var msg = 'Metodo process_acquisizione : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
	
}

/**
 * Lancia il conteggio per tutti i giorni visualizzati nelle forms dei dipendenti
 * con anomalie correntemente visualizzati
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idDitta
 * @param {Number} _anno
 * @param {Number} _mese
 * 
 * @properties={typeid:24,uuid:"79B3F0D1-9C86-46B1-B268-D72DCF6383ED"}
 */
function conteggiaTuttiIGiorniVisualizzati(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idDitta,_anno,_mese)
{	
	var _params = {
        processFunction: process_conteggia_tutti_giorni_anomalie,
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
 * @properties={typeid:24,uuid:"BD783B7A-1B0A-4E06-A0E3-A6EE425F1E23"}
 */
function process_conteggia_tutti_giorni_anomalie()
{
	try
	{
		var frm = forms.giorn_timbr_mancanti_ditta;
		for (var i = (frm.currPage - 1) * frm.dipPerPage; i < Math.min(frm.arrDipAnomalie.length - (frm.currPage - 1) * frm.dipPerPage,frm.dipPerPage); i++)
		{
			var _idLavoratore = frm.arrDipAnomalie[i];

			/** @type {Form<giorn_timbr_mancanti_dipendente>} */
			var frmLav = forms[forms.giorn_timbr_mancanti_dipendente.controller.getName() + '_' + _idLavoratore];
			var fsLav = forms[frmLav.elements.tab_timbr_mancanti_dip.getTabFormNameAt(1)].foundset;
			
			/** @type {Array<Date>}*/
			for(var g = 1; g <= fsLav.getSize(); g++)
			{
				var gg = utils.parseDate(fsLav.getRecord(g)['giornomese'], globals.EU_DATEFORMAT);
				
				var response = conteggiaGiornoAnomalie(_idLavoratore, gg);
				if(!response || response.StatusCode != globals.HTTPStatusCode.OK || !response.ReturnValue)
					throw new Error('Si è verificato un errore durante il conteggio del dipendente ' + 
					              	globals.getNominativo(_idLavoratore) + ' , riprovare', 'Conteggio timbrature');
			}
		}
		// aggiorniamo la situazione generale delle anomalie sulle timbrature
		forms.giorn_timbr_mancanti_ditta.preparaAnomalieDitta
		(
			  forms.giorn_timbr_mancanti_ditta.idditta
			, forms.giorn_timbr_mancanti_ditta.annoRif
			, forms.giorn_timbr_mancanti_ditta.meseRif
			, forms.giorn_timbr_mancanti_ditta.limitaAl
		);
	}
	catch(ex)
	{
		var msg = 'Metodo process_conteggia_tutti_giorni_anomalie : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}	
}

/**
 * Conteggia le timbrature del lavoratore selezionato nel giorno selezionato
 * 
 * @param {Number} _idLavoratore
 * @param {Date} _giorno
 * 
 * @return {{ReturnValue: Object, StatusCode: Number, Message: String}}
 * 
 * @properties={typeid:24,uuid:"A1C6EB10-4CFA-4201-90A0-E53F313CAA90"}
 */
function conteggiaGiornoAnomalie(_idLavoratore,_giorno)
{	
	var _idDitta = globals.getDitta(_idLavoratore);
	var _yy = _giorno.getFullYear();
	var _MM = _giorno.getMonth() + 1;
	var _periodo = _yy * 100 + _MM;

	var params = globals.inizializzaParametriConteggio(_idDitta,
													   _periodo,
													   globals.TipoConnessione.CLIENTE,
													   [_giorno.getDate()],
													   [_idLavoratore],
													    true
	);

	//teniamo traccia dei dipendenti che sono stati modificati e che risulteranno da chiudere
	if(!scopes.giornaliera.cancellaChiusuraDipPerOperazione([_idLavoratore],_idDitta,_periodo))
		return null;

	//lanciamo il calcolo per la compilazione
	var url = globals.WS_STAMPING + "/Stamping32/Count";
	// nel caso di dipendente singolo il conteggio è sincrono
	var response = globals.getWebServiceResponse(url + 'Single', params);
	return response;
}

/**
 * @param {JSEvent} event
 *
 *
 * @properties={typeid:24,uuid:"2A0E78AA-75B1-4CAE-9C44-506EE944AB0C"}
 */
function onFieldSelectionAnomalie(event) {
	
	var _recordIndex = foundset.getSelectedIndex();
	var _timeStamp = event.getTimestamp();
	var _idLavoratore = globals.getIdLavoratoreDaIdGiornaliera(forms[event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);
	var _giorno = globals.getGiornoDaIdGiornaliera(forms[event.getFormName()].foundset.getSelectedRecord()['idgiornaliera']);	
	var _lastClickTimeStamp = forms.giorn_mostra_timbr.last_click_timestamp;
	var _lastSelectedRecordIndex = forms.giorn_mostra_timbr.last_selected_recordindex;
	
	if(_recordIndex == _lastSelectedRecordIndex)
	{
		if(_timeStamp - _lastClickTimeStamp < globals.intervalForDblClk)
			modificaTimbraturaAnomalia(event,_idLavoratore,_giorno);
		
		_lastClickTimeStamp = _timeStamp;
	}
	else
	{
		_lastSelectedRecordIndex = _recordIndex;
		_lastClickTimeStamp = _timeStamp;
	}

}


/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idLavoratore
 * @param {Date} _giorno
 *  
 * @properties={typeid:24,uuid:"D4116BC5-2531-4893-B39A-C0BF2D8B8EC8"}
 * @SuppressWarnings(unused)
 */
function completaConOrarioTeorico(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_idLavoratore,_giorno)
{
	sel_index = foundset.getSelectedIndex();
	
	var hhmm = null;
	var inizioOrario = forms[_event.getFormName()].foundset.getSelectedRecord()["inizioorario"];
	var inizioPausa = forms[_event.getFormName()].foundset.getSelectedRecord()["iniziopausa"];
	var finePausa = forms[_event.getFormName()].foundset.getSelectedRecord()["finepausa"];
	var fineOrario = forms[_event.getFormName()].foundset.getSelectedRecord()["fineorario"];
	var casoTimbratura = _event.getElementName();
	switch (casoTimbratura)
	{
		case "entrata_1":
			//verifichiamo che non sia in una fascia di tipo riposo
		    if(inizioOrario != 0)
		       hhmm = inizioOrario;
			break;
		case "uscita_1":
			//nel caso di fascia con pausa l'uscita corrisponde all'inizio della pausa
		    if(inizioPausa)
		       hhmm = inizioPausa;
			//altrimenti nel caso di turno corrisponde all'uscita
		    else
		    	if(fineOrario < inizioOrario)
			       hhmm = fineOrario + 2400;	
		    	else 
		    	   hhmm = fineOrario;
			break;
		case "entrata_2":
		    //nel caso di fascia con pausa l'uscita corrisponde alla fine della pausa, altri casi non sono possibili
			if(finePausa)
		       hhmm = finePausa;
		    break;
		case "uscita_2":
		    //nel caso di fascia con pausa l'uscita corrisponde alla fine dell'orario, altri casi non sono possibili
		    if(fineOrario)
		       hhmm = fineOrario;
		    break;
		default:
			break;
	}
	
	if(!hhmm)
	{
		globals.ma_utl_showInfoDialog('Impossibile inserire la timbratura teorica desiderata per il dipendente nel giorno selezionato','Inserimento orario teorico');
		return false;
	}
		
	var hh = Math.floor(hhmm / 100);
	var mm = Math.round(hhmm % 100);
	var idGruppoInst = globals.getGruppoInstallazioneLavoratore(_idLavoratore);
	var tSenso = utils.stringLeft(casoTimbratura,1) == 'e' ? 0 : 1;
	var tNrBadge = globals.getNrBadge(_idLavoratore,_giorno);
	
	//verifica anomalia pre inserimento
	var anomaliaIniziale = globals.getAnomalieGiornata(_idLavoratore,utils.dateFormat(_giorno,globals.ISO_DATEFORMAT));
	
	// salvataggio timbratura inserita
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>}*/
	var fsTimbr = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	databaseManager.setAutoSave(false);
	databaseManager.startTransaction();
	fsTimbr.newRecord();
	fsTimbr.iddip = _idLavoratore;
	fsTimbr.ggsucc = false;
	fsTimbr.nr_badge = tNrBadge;
	fsTimbr.idgruppoinst = idGruppoInst;
	// differenziare il caso di inserimento da parte del gestore e quello da parte del dipendente
	fsTimbr.indirizzo = 'mn';
	fsTimbr.timbeliminata = 0;
	fsTimbr.sensocambiato = false;
	fsTimbr.senso = tSenso;
	fsTimbr.timbratura = mm + hh * 100 + _giorno.getDate() * 10000 + (_giorno.getMonth()+1) * 1000000 + _giorno.getFullYear() * 100000000;
	
	if (!databaseManager.commitTransaction()) {
		globals.ma_utl_showErrorDialog('Inserimento timbratura non riuscito, riprovare. </br> Ripristinare le timbrature per verificare la presenza di eventuali doppioni.', 'Modifica timbratura');
		databaseManager.rollbackTransaction();
		return true;
	}
	
	forms[_event.getFormName()].foundset.getSelectedRecord()[_event.getElementName()] = fsTimbr.idtimbrature;
	
	var data = new Date(_giorno);

	// situazione anomalia partenza
	var anomaliaPre =  globals.getAnomalieGiornata(_idLavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT));
		
	// analizza pre conteggio
	forms.giorn_timbr.analizzaPreConteggio(data.getDate(),_idLavoratore, data.getFullYear()*100 + data.getMonth() + 1);

	// situazione anomalia finale
	var anomaliaPost = globals.getAnomalieGiornata(_idLavoratore, utils.dateFormat(data, globals.ISO_DATEFORMAT));
	
	//aggiorna la visualizzazione 
	globals.aggiornaAnomalieTimbratureDipendente(_idLavoratore,data.getFullYear(),data.getMonth()+1,forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate());
	
	foundset.setSelectedIndex(sel_index);
	moveFocusToNextElement(_event);
	
	return true;       
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C2BB89C0-B06B-4CD3-BD52-D3344B362A42"}
 */
function moveFocusToNextElement(event)
{
	if(!event)
		return;
	
	var elementName = event.getElementName();
	
	var matches = elementName.match(/^(entrata|uscita)_([0-9]+)$/i);
	if (matches && matches.length > 1)
	{
		switch(matches[1])
		{
			case 'entrata': 
				elements['uscita_' + matches[2]].requestFocus();
				break;
				
			case 'uscita':
				var nextElementName = 'entrata_' + (parseInt(matches[2]) + 1);
				if (elements[nextElementName])
					elements[nextElementName].requestFocus();
				else
					controller.focusFirstField();
				
				break;
				
			default:
				controller.focusFirstField();
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} _event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FE8FF72D-E08D-4559-AB74-90ED58BD4C19"}
 */
function onActionRipristino(_event) 
{
	sel_index = foundset.getSelectedIndex();
	
	/** @type {Date} */
	var _giorno = globals.dateFormat(foundset.giorno, globals.EU_DATEFORMAT);
	
	if(globals.ottieniTimbratureMancantiGiorno(_event, iddipendente, _giorno))
	{
		globals.aggiornaAnomalieTimbratureDipendente(iddipendente,_giorno.getFullYear(),_giorno.getMonth() + 1, forms.giorn_timbr_mancanti_ditta.limitaAl ? forms.giorn_timbr_mancanti_ditta.limitaAl.getDate() : globals.TODAY.getDate());
	
		// Il ridisegno annulla la selezione, quindi è necessario ripristinarla
		foundset.setSelectedIndex(sel_index);
		
		var timbrature = elements.allnames.filter(function(elem){ return /^(?:entrata|uscita)_[0-9]+$/i.test(elem); });
		for(var t = 0; t < timbrature.length; t++)
			databaseManager.refreshRecordFromDatabase(foundset['timbrature_to_e2timbrature_' + timbrature[t]], 0);
		
		foundset.setSelectedIndex(sel_index);
		moveFocusToNextElement(_event);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7F7073EF-D497-434A-A96D-17C0429AD3E5"}
 */
function onActionTeorico(event) 
{
	var answer = globals.ma_utl_showYesNoQuestion("Completare con l'orario teorico di riferimento?",'Orario teorico');
	if(!answer)
		return;
	
	var strTimbrOri = formattaTimbraturePerInserimentoTeoriche(foundset.getSelectedRecord());
	var arrTimbrOri = strTimbrOri.split('.');
	var idGiorn = foundset.getSelectedRecord()['idgiornaliera']; 
	var fascia = globals.getFasciaDaIdGiornaliera(idGiorn);
	var idLav = globals.getIdLavoratoreDaIdGiornaliera(idGiorn)
	var idgrInst = globals.getGruppoInstallazioneLavoratore(idLav);
	var gg = globals.getGiornoDaIdGiornaliera(idGiorn);
	var nrBadge = globals.getNrBadge(idLav,gg);
	var sqlTeoriche = "SELECT dbo.F_Gio_Lav_InserisciTimbratureTeoriche(?,?)";
	var arrTeoriche = [strTimbrOri,fascia];
	var dsTeoriche = databaseManager.getDataSetByQuery('cliente_000165',sqlTeoriche,arrTeoriche,-1);
	/** @type {String}*/
	var strTimbrTeoriche = dsTeoriche.getValue(1,1);
	application.output(strTimbrTeoriche);
	var arrTimbTeoriche = strTimbrTeoriche.split('.');
	
	for(var t = 0; t < arrTimbTeoriche.length; t++)
	{
		if(arrTimbrOri.indexOf(arrTimbTeoriche[t]) == -1 
				&& arrTimbTeoriche[t] != '    ')
			// inserisci la nuova timbratura derivante dal teorico 
			inserisciTimbratura(idLav,gg,t % 2 == 0 ? 0 : 1,arrTimbTeoriche[t],nrBadge,idgrInst);
		
	}
	
	aggiornaVisualizzazione(idLav, gg);
}

/**
 * Formatta le timbrature esistenti nel giorno per renderle utilizzabili con la funzione
 * di inserimento teoriche
 * 
 * @param {JSRecord} rec
 *
 * @return String
 * 
 * @properties={typeid:24,uuid:"4A41F085-CC24-4059-B225-79DCF629CBB6"}
 */
function formattaTimbraturePerInserimentoTeoriche(rec)
{
	var strTimbr = "";
	var colTot = rec.foundset.alldataproviders.length - 13;
	var colCoppie = colTot / 2;
	
	for(var i = 1; i <= colCoppie; i++)
	{
		var idTimbrEntrata = rec['entrata_' + i];
		var idTimbrUscita = rec['uscita_' + i];
		if(!idTimbrEntrata && !idTimbrUscita)
		{
			if(i == colCoppie)
			   return utils.stringLeft(strTimbr,strTimbr.length - 1);	
			return strTimbr;
		}
		
		if(idTimbrEntrata)
		   strTimbr += getTimbraturaFormattataPerTeorico(idTimbrEntrata);
		else
		   strTimbr += '    ';
		
		strTimbr += '.';   
		   
	    if(idTimbrUscita)
		   strTimbr += getTimbraturaFormattataPerTeorico(idTimbrUscita);
		else
		   strTimbr += '    ';	
		
		if(i < colTot)
			strTimbr += '.';	
	}
	
	return strTimbr;
}

/**
 * @AllowToRunInFind
 * 
 * Formatta la singola timbratura per la creazione della stringa generale da passare alla funzione
 * di recupero timbrature teoriche
 * 
 * @param {Number} idTimbratura
 *
 * @properties={typeid:24,uuid:"97A815EF-8EE8-4DAB-A7A0-4DA6AA279CAC"}
 */
function getTimbraturaFormattataPerTeorico(idTimbratura)
{
	/** @type {JSFoundSet<db:/ma_presenze/e2timbratura>} */
	var fsTimbr = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	if(fsTimbr.find())
	{
		fsTimbr.idtimbrature = idTimbratura;
		if(fsTimbr.search())
			return utils.stringMiddle(fsTimbr.timbratura.toString(),9,2) + utils.stringMiddle(fsTimbr.timbratura.toString(),11,2);
	}
	return null;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"605E9BC3-44DA-48FB-ABDD-27C444012674"}
 * @AllowToRunInFind
 */
function onActionVisualizzaCausalizzate(event)
{
	var frm = forms.giorn_mostra_timbr_t_caus;
    
	/** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA);
	if(fs.find())
	{
		/** @type {Number}*/
		var idGiorn = foundset['idgiornaliera'];
		fs.idgiornaliera = idGiorn;
		if(fs.search())
		{
			// aggiornamento timbrature causalizzate
		    if(fs.e2giornaliera_to_e2timbratureservizio.getSize())
		    {
               forms.giorn_t_caus_tbl.foundset.loadRecords(fs.e2giornaliera_to_e2timbratureservizio);
		       globals.ma_utl_showFormInDialog(frm.controller.getName()
		    	                               ,'Causalizzate del giorno ' + foundset['giornomese'] + ' Dip. ' + globals.getNominativo(globals.getIdLavoratoreDaIdGiornaliera(idGiorn))
		    	                               ,null
											   ,false
											   ,550
											   ,120);
		    }
			else
		       globals.ma_utl_showInfoDialog('Nessuna timbratura causalizzata nella giornata','Mostra timbrature causalizzate');
		}
		else
		    globals.ma_utl_showErrorDialog('Recupero identificativo giornata non riuscito','Mostra timbrature causalizzate');
	}
	else
		globals.ma_utl_showErrorDialog('Cannot go to find mode','Mostra timbrature causalizzate');		
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"182BE1B3-09D1-4DD1-B1E0-04345885C327"}
 */
function onShow(firstShow, event) 
{
	controller.readOnly = false;
}
