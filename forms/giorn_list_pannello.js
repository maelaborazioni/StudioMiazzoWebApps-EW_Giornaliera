/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"29BB2EEE-B420-4FD9-AF61-FDD4EB7EB53B"}
 */
function onFieldSelectionPannello(event) 
{
	globals.aggiornaSelezioneGiorni(event, foundset.getSelectedIndex());	
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9B602A51-3F17-478C-A9DA-EE65F997EB15"}
 */
function onRenderGiornPannello(event)
{
   var recInd = event.getRecordIndex();
   var recRen = event.getRenderable();
   var recCol = event.getRecord();
      
//   if(isDisabled)
//   {   
//	   recRen.bgcolor = '#767676';
//	   recRen.fgcolor = '#333333';
//	   recRen.enabled = false;
//	   return;
//   }
//   else
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
	   
	   if(event.isRecordSelected()/* || selection_form.foundset.getRecord(recInd)['checked'] == 1*/)
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
	   
	   if(recCol['squadrato'] && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.NORMALE)
	   {
		   recRen.fgcolor = '#FF0000';	// red
		   recRen.font = 'Arial,2,11';
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
 * @properties={typeid:24,uuid:"83E16856-21DD-4ED3-BA8C-04AFDE5A7426"}
 */
function onRecordSelection(event, _form) 
{
	if(foundset.getSize() > 0)
	{
		var idGiornalieraGiorno = foundset['idgiornaliera'];
		if(idGiornalieraGiorno)
		   forms.giorn_vista_mensile.aggiornaRiepiloghiGiorno(idGiornalieraGiorno,true);
	}
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6E4E1740-A516-42BA-A83E-0A3BB4EF26CC"}
 */
function onRightClickGiornPannello(event)
{
	globals.ma_utl_showWarningDialog('Giornaliera in modalità di sola visualizzazione','Visualizzazione situazione mensile');
}

/**
 * Mostra il menu contestuale in giornaliera
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"FDE59C69-ED29-41EA-A453-2198E46A51C2"}
 */
function apriPopupVistaMensilePannello(_event)
{	
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	
	// Copincolla giornata
	var copiaGiornataMenu = _popUpMenu.addMenuItem('Copia giornata', copiaGiornata);
		copiaGiornataMenu.methodArguments = [foundset.getSelectedIndex() - globals.offsetGg];
	var incollaGiornataMenu = _popUpMenu.addMenuItem('Incolla giornata', incollaGiornata);
		incollaGiornataMenu.methodArguments = [vGiornataDaCopiare];
		incollaGiornataMenu.enabled = vGiornataDaCopiare !== 0;
	
	_popUpMenu.addSeparator();
	
	var _popUpMenuEventi = _popUpMenu.addMenu('Gestione eventi ');
	var _addEvento = _popUpMenuEventi.addMenuItem('Aggiungi un evento ', aggiungiEventoDaMenu);
	_addEvento.methodArguments = [_event];
	var _editEvento = _popUpMenuEventi.addMenuItem('Modifica l\'evento selezionato ', modificaEventoDaMenu);
	_editEvento.methodArguments = [_event];
	var _delEvento = _popUpMenuEventi.addMenuItem('Elimina l\'evento ', eliminazioneEvento);
	_delEvento.methodArguments = [_event];
        	
    var nonHaOrologio = globals.haOrologio(globals.getDitta(forms[_event.getFormName()].foundset.getSelectedRecord()['idlavoratore'])) === 0;	// 0 - no timbrature
    
    if(nonHaOrologio)
	{
		var _popUpMenuCompila = _popUpMenu.addMenu('Compilazione giorni ')
    	    _popUpMenuCompila.setEnabled(nonHaOrologio);
	    var _item2 = _popUpMenuCompila.addMenuItem('Compila il singolo dipendente ', globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? 
	    		                                                                     compilaDaCommesseSingolo : compilaDalAlSingolo);
            _item2.methodArguments = [_event];
	}
	else
    {
        var _popUpMenuConteggia = _popUpMenu.addMenu('Conteggio timbrature ')
    	var _item3 = _popUpMenuConteggia.addMenuItem('Conteggia il singolo dipendente ', conteggiaTimbratureSingolo)
	        _item3.methodArguments = [_event]
	}
    
	_popUpMenu.addSeparator();
	
//	var _popUpMenuStorico = _popUpMenu.addMenu('Gestione certificati ')
//	var _item4 = _popUpMenuStorico.addMenuItem('Inserisci malattia ', lkpInserisciCertificato)
//	    _item4.methodArguments = [_event,0,_giornoMese]
//	var _item5 = _popUpMenuStorico.addMenuItem('Inserisci infortunio ', lkpInserisciCertificato)
//        _item5.methodArguments = [_event,1,_giornoMese]
//	var _item6 = _popUpMenuStorico.addMenuItem('Inserisci maternità ', lkpInserisciCertificato)
//        _item6.methodArguments = [_event,2,_giornoMese]
//	var _item7 = _popUpMenuStorico.addMenuItem('Inserisci congedo parentale ', lkpInserisciCertificato)
//	    _item7.methodArguments = [_event,3,_giornoMese]    
//	var _item7_p = _popUpMenuStorico.addMenuItem('Inserisci congedo paterno ', lkpInserisciCertificato)
//        _item7_p.methodArguments = [_event,5,_giornoMese]
//	var _item8 = _popUpMenuStorico.addMenuItem('Inserisci congedo matrimoniale ', lkpInserisciCertificato)
//        _item8.methodArguments = [_event,4,_giornoMese]
//        
//	_popUpMenu.addSeparator();
	    		
	if(_source != null)
		_popUpMenu.show(_source)
}
