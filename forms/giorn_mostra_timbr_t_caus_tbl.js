/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"6D4115E3-719F-4A9D-8D2B-7ED074AE0E6B"}
 */
function ApriPopupCaus(event)
{
	var source = event.getSource();
	var frm = event.getFormName();
	/** @type {JSFoundset <db:/ma_presenze/e2timbratureservizio>}*/
	var fs = forms[frm].foundset;
	var rec = fs.getSelectedRecord();
	var idTimbratura = rec.ide2timbratureservizio;
	
	var popUpMenu = plugins.window.createPopupMenu();
	
	var spostaTimbEff = popUpMenu.addMenuItem('Rendi la timbratura effettiva',rendiTimbrEffettiva);
	spostaTimbEff.methodArguments = [event,rec];
	var eliminaTimbrCaus = popUpMenu.addMenuItem('Elimina la timbratura causalizzate',eliminaTimbraturaCausalizzata);
	eliminaTimbrCaus.methodArguments = [event,idTimbratura];
	var cambiaSensoCaus = popUpMenu.addMenuItem('Cambia il senso della timbratura',cambiaSensoTimbraturaCausalizzata);
	cambiaSensoCaus.methodArguments = [event,idTimbratura];
//	var spostaPrecItem = popUpMenu.addMenuItem('Sposta al giorno precedente',spostaGiornoPrecCausalizzata);
//	spostaPrecItem.methodArguments = [event,idTimbratura];
//	spostaPrecItem.enabled = !rec.competegiornoprima;
//	var spostaSuccItem = popUpMenu.addMenuItem('Sposta al giorno successivo',spostaGiornoSuccCausalizzata);
//	spostaSuccItem.methodArguments = [event,idTimbratura];
//	spostaSuccItem.enabled = rec.competegiornoprima;
	
	if(source != null)
		   popUpMenu.show(source);
}

/**
 *
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idTimbratura
 *
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"CBA31DFE-3E8B-4D06-BDF4-9156C15E6A07"}
 */
function eliminaTimbraturaCausalizzata(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idTimbratura)
{
	// eliminazione timbratura orologio o timbratura inserita manualmente
	/** @type {JSFoundset<db:/ma_presenze/e2timbratureservizio>} */
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.TIMBRATURE_SERVIZIO);

	if (_fs.find())
	{
		_fs.ide2timbratureservizio = _idTimbratura;
		if (_fs.search() > 0) {
			
			var response = false; 
			
			response = globals.ma_utl_showYesNoQuestion('Eliminare la timbratura causalizzata delle ore ' +
			    	                                  _fs.timbratura_oremin +
													  ' ?', 'Eliminazione timbratura causalizzata');

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
					globals.ma_utl_showWarningDialog('Errore durante l\'eliminazione, si prega di riprovare', 'Eliminazione timbratura causalizzata');
					
				return success;
			}
			return false;
			
		} else
		{
			globals.ma_utl_showWarningDialog('Recupero timbratura da eliminare non riuscito', 'Eliminazione timbratura causalizzata');
	        return false;
		}
	}else
	{
		globals.ma_utl_showWarningDialog('Cannot go to find mode', 'Eliminazione timbratura causalizzata');
        return false;
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
* @param {Number} _idTimbratura
*
* @AllowToRunInFind
*
 * @properties={typeid:24,uuid:"FB35C942-5177-41CD-9910-FDC837E6E4F3"}
 */
function cambiaSensoTimbraturaCausalizzata(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idTimbratura)
{
	databaseManager.setAutoSave(false);
	
	/** @type {JSFoundset<db:/ma_presenze/e2timbratureservizio>}*/
	var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,
		                                  globals.Table.TIMBRATURE_SERVIZIO);
	
    if(_fs.find())
    {
    	_fs.ide2timbratureservizio = _idTimbratura;
    	if(_fs.search() == 0)
    	{
    		globals.ma_utl_showWarningDialog('Selezionare una timbratura valida','Cambia senso timbratura causalizzata');
    		return;
    	}
    }
    else
    {
       	globals.ma_utl_showWarningDialog('Cannot go to find mode','Cambia senso timbratura causalizzata');
        return;
    }
	
    var _sensoCambiato = _fs.senso == 0 ? 1 : 0;
//	_fs.sensocambiato == 0 ? _sensoCambiato = 1 : _sensoCambiato = 0;
		
	var response = true//globals.ma_utl_showYesNoQuestion('Cambiare il senso della timbratura?','Cambia senso timbratura causalizzata');

    if(response)
    {	
       databaseManager.startTransaction();
       _fs.senso = _sensoCambiato;
//	   _fs.sensocambiato = _sensoCambiato;
	   if(!databaseManager.commitTransaction())
	   {
		  globals.ma_utl_showErrorDialog('Cambio senso non riuscito, riprovare eventualmente ripristinando le timbrature','Cambia senso timbratura causalizzata');
	      databaseManager.rollbackTransaction();
	      return;
	   }
	   
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
* @param {JSRecord<db:/ma_presenze/e2timbratureservizio>} _rec
*
* @AllowToRunInFind
*
*
 * @properties={typeid:24,uuid:"EC547024-0DCF-4A75-8800-6123B25C2980"}
 */
function spostaGiornoPrecCausalizzata(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _rec) 
{
	databaseManager.setAutoSave(false);

	var response = globals.ma_utl_showYesNoQuestion('Spostare la timbratura al giorno precedente?', 'Spostamento al giorno precedente');
	if (response) 
	{
		databaseManager.startTransaction();
		_rec.competegiornoprima = 1;
		if(!databaseManager.commitTransaction())
		{
			globals.ma_utl_showErrorDialog('Spostamento timbratura non riuscito, riprovare.','Spostamento al giorno precedente');
			return;
		}
		else
		{
		    forms.giorn_header.preparaGiornaliera();
		    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		}
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
* @param {JSRecord<db:/ma_presenze/e2timbratureservizio>} _rec
*
* @AllowToRunInFind
*
*
 * @properties={typeid:24,uuid:"B9A91A31-8DA1-4F19-A5F6-A9294CE2F039"}
 */
function spostaGiornoSuccCausalizzata(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _rec)
{
	databaseManager.setAutoSave(false);

	var response = globals.ma_utl_showYesNoQuestion('Spostare la timbratura al giorno successivo?', 'Spostamento al giorno successivo');
	if (response) 
	{
		databaseManager.startTransaction();
		_rec.competegiornoprima = 0;
		if(!databaseManager.commitTransaction())
		{
			globals.ma_utl_showErrorDialog('Spostamento timbratura non riuscito, riprovare.','Spostamento al giorno successivo');
			return;
		}
		else
		{
		    forms.giorn_header.preparaGiornaliera();
		    globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
		}
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
* @param {JSRecord<db:/ma_presenze/e2timbratureservizio>} _rec
*
* @AllowToRunInFind
*
*
 * @properties={typeid:24,uuid:"871FAA91-22C8-4C4C-8C7B-9293D17B6FD6"}
 */
function rendiTimbrEffettiva(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _rec)
{
	/** @type {JSFoundset <db:/ma_presenze/e2timbratura>}*/
	var fsTimbr = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE);
	
	// controlla eventuale timbratura già inserita
	switch(globals.validaInserimentoTimbratura(_rec.iddip,_rec.timbratura_oremin,_rec.dataeora,_rec.senso,0))
	{
	case 0:
		//inserimento timbratura
	if(!fsTimbr.newRecord(false))
	{
		globals.ma_utl_showErrorDialog('Impossibile rendere effettiva la timbratura causalizzata','Rendi la timbratura effettiva');
		return;
	}
	else
	{
		fsTimbr.iddip = _rec.iddip;
		fsTimbr.nr_badge = _rec.nr_badge;
		fsTimbr.senso = _rec.senso;
		fsTimbr.indirizzo = 'cz';
		fsTimbr.sensocambiato = _rec.sensocambiato;
		fsTimbr.timbeliminata = _rec.timbeliminata;
		fsTimbr.idgruppoinst = _rec.idgruppoinst;
		fsTimbr.ggsucc = 0;
		fsTimbr.timbratura = _rec.dataeora.getFullYear() * 100000000 + (_rec.dataeora.getMonth() + 1) * 1000000 +
		                     + _rec.dataeora.getDate() *10000 + 
		                     + _rec.dataeora.getHours() * 100 + 
		                     + _rec.dataeora.getMinutes();		 
				
	    if(databaseManager.saveData(fsTimbr))  
	    {
	       if(_event.getFormName() == 'giorn_t_caus_tbl')
	       {
	    	   globals.svy_mod_closeForm(_event);
	    	   var frmCartMan = forms.giorn_timbr_mancanti_ditta;
	           frmCartMan.onActionRefresh(_event);
	       }
	       else
	       {
	    	   forms.giorn_header.preparaGiornaliera();
	    	   globals.verificaDipendentiFiltrati(forms.giorn_header.idlavoratore);
	       }
	    }
	    else
	       globals.ma_utl_showErrorDialog('Impossibile rendere effettiva la timbratura causalizzata','Rendi la timbratura effettiva');
	}
	    break;
	case 1:
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi necessari siano compilati', 'Inserimento timbrature');
		break;
	
	case 2:
		globals.ma_utl_showWarningDialog('Controllare che i valori della timbratura siano corretti', 'Inserimento timbrature');
		break;
		
	case 3:
		globals.ma_utl_showWarningDialog('Esiste già una timbratura con questi valori!', 'Inserimento timbrature');
		break;
		
	case 4:
		globals.ma_utl_showWarningDialog('Esiste già una timbratura eliminata con questi valori! <br/> Utilizzare la funzionalità <b>Ripristina timbrature del giorno</b> per recuperare le timbrature eliminate.', 'Inserimento timbrature');
		break;	
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
* @param {Number} _idLav
* @param {Date} _date
*  
* @AllowToRunInFind
*
*
 * @properties={typeid:24,uuid:"14FECEFF-B756-4AA1-9989-FD74B2164C98"}
 */
function recuperaTimbrOriginali(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _idLav, _date)
{
	/** @type {JSFoundset<db:/ma_presenze/e2timbratureservizio>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.TIMBRATURE_SERVIZIO);
	
	if(fs.find())
	{
		fs.iddip = _idLav;
		fs.annoMeseGiorno = utils.dateFormat(_date,globals.ISO_DATEFORMAT);
		if(fs.search())
		{
			databaseManager.setAutoSave(false);
			
			databaseManager.startTransaction();
			
			for(var i = 0; i < fs.getSize(); i++)
			{
				fs.setSelectedIndex(i);
				if(fs.timbeliminata)
					fs.timbeliminata = 0;
			}
			
			if(!databaseManager.commitTransaction())
			{
				globals.ma_utl_showErrorDialog('Recupero timbrature causalizzate originali non riuscito, verificare.','Recupero timbrature originali');
			    return;
			}
			else
				forms.giorn_header.preparaGiornaliera();
			
		}
			
	}
}