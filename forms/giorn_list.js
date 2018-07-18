/**
 * @properties={typeid:35,uuid:"5B3BED54-8946-4BAC-A88A-15C24E6DAD14",variableType:-4}
 */
var numeroEventi = globals.stdColGg;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"73F00CC9-DC3D-4456-BF47-068D81FE5160",variableType:4}
 */
var vGiornataDaCopiare = 0;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"63D2C255-065F-4F42-A5DC-84572EB3B4E3",variableType:-4}
 */
var _arrDipSelezionati = new Array();

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"593B82F3-DC35-4A4B-970E-BFE79853B8DC",variableType:8}
 */
var _idDipSelezionato = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"9AFE3CB6-70F7-4D4C-8B11-DE2A7C53A3EB",variableType:-4}
 */
var _iFirstShow = false;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"21525169-B051-40EC-88AF-8FD7150FA1DA",variableType:4}
 */
var _tipoOperazione = 0;

/**
 * Gestisce la grafica della form
 *
 * @param {JSRenderEvent} event the render event
 *  
 * @private
 *
 * @properties={typeid:24,uuid:"108E838D-00E7-4C09-B214-C59C1CD29F23"}
 */
function onRenderGiorn(event)
{	
   var recInd = event.getRecordIndex();
   var recRen = event.getRenderable();
   var recCol = event.getRecord();
   var anno = globals.getAnno();
   var annoAttivo = globals.getAnnoAttivo();
   var mese = globals.getMese();
   var meseAttivo = globals.getMeseAttivo();
   var active = anno == annoAttivo && mese == meseAttivo;
   
   var offsetSelezione =  forms.giorn_header.assunzione > new Date(anno, mese - 1,1) ?
                          forms.giorn_header.assunzione.getDate() +  globals.offsetGg - 1 : globals.offsetGg;
                          
   var isDisabled =   (!active && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.NORMALE)
   					||(recInd <= offsetSelezione)
   					||(active && recCol['idgiornaliera'] == null && recCol['anomalie'] == 0 && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET);
   
   if(isDisabled)
   {   
	   recRen.bgcolor = '#767676';
	   recRen.fgcolor = '#333333';
//	   recRen.enabled = false;
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
 * Aggiorna la visualizzazione degli eventi nel riepilogo eventi del giorno
 * 
 * @properties={typeid:24,uuid:"99DC2FED-CF38-48E1-9499-D65E0FFFC16D"}
 * @AllowToRunInFind
 */
function aggiornaEventiNelGiornoGiornaliera()
{
	// N.B. nel caso di giornaliera di budget possono non esistere tutti gli idgiornaliera
	// dei giorni del mese pertanto va svuotato il riepilogo eventi del giorno
	
	// caso standard : giornaliera normale o di budget con almeno un evento inserito
    if (foundset['idgiornaliera'] != null) 
	{
	/** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>} */
	var giornalieraFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA);
		if (giornalieraFs && giornalieraFs.find()) {
		giornalieraFs.idgiornaliera = foundset['idgiornaliera'];
		giornalieraFs.search();
	}
	
	forms.giorn_vista_mensile_eventi_tbl.foundset.loadRecords(giornalieraFs.e2giornaliera_to_e2giornalieraeventi);
	
	if(giornalieraFs.e2giornaliera_to_e2timbratura.nr_badge != null)
	   forms.giorn_header._vNrBadge = giornalieraFs.e2giornaliera_to_e2timbratura.nr_badge;
	else
	    forms.giorn_header._vNrBadge = globals.getNrBadge(giornalieraFs.e2giornaliera_to_lavoratori.idlavoratore,
	    	                                      giornalieraFs.giorno);
	
    }
    // caso giornaliera di budget senza eventi
	else
	{
	   var ds = databaseManager.createEmptyDataSet(0,5);
	   forms.giorn_vista_mensile_eventi_tbl.foundset.loadRecords(ds);
	}
}

/**
 * Aggiorna la visualizzazione delle timbrature del giorno
 * 
 * @properties={typeid:24,uuid:"B76AA3F3-D4FC-4737-83D2-98E8DF05C38E"}
 * @AllowToRunInFind
 */
function aggiornaTimbratureNelGiornoGiornaliera()
{
	/** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>} */
	var giornalieraFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, 'e2giornaliera');
	if(giornalieraFs && giornalieraFs.find())
	{
		giornalieraFs.idgiornaliera = foundset['idgiornaliera'];
		giornalieraFs.search();
	}
	
	forms.giorn_vista_mensile_timbr_tbl.foundset.loadRecords(giornalieraFs.e2giornaliera_to_e2timbratura);
	
}

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"CD828596-6FB6-4B7F-B312-2383B7559892"}
 */
function onShowForm(_firstShow, _event) 
{
	plugins.busy.prepare();
	
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
	
	if(!globals.checkForConcurrentOperations(security.getUserName(), forms.giorn_header.idditta, forms.giorn_header.idlavoratore, globals.getPeriodo()))
		return;
	
	updateFromDatabase();
			   
}

/**
 * Aggiorna la visualizzazione di dati che possono essere stati modificati
 * all'esterno di Servoy   
 * 
 * @properties={typeid:24,uuid:"92E39F8F-7E01-40DF-96BE-0B1F204C41FE"}
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
				var days = globals.getGiorniSelezionatiEv();
				if(days && days.length > 0)
				{
					for(var g = 0; g < days.length; g++)
					{						
						if(foundset.getRecord(days[g])[relation[0]])
						{
							databaseManager.refreshRecordFromDatabase(foundset.getRecord(days[g])[relation[0]],0);
						    databaseManager.refreshRecordFromDatabase(forms.giorn_vista_mensile.foundset,0)
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
 * @AllowToRunInFind
 *
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"56A54C8D-CFEC-4894-A124-C07C079DF62B"}
 */
function getSelectedElements()
{
	var _fsCopy = foundset.duplicateFoundSet();
	if(_fsCopy.find())
	{
		_fsCopy['checked'] = 1;
		var selected_no = _fsCopy.search();
		
		// If nothing's checked, get the currently selected element
		if(selected_no === 0)
		  _fsCopy.loadRecords(foundset.getSelectedRecord().getPKs()[0]);
		
	}
	
	return globals.foundsetToArray(_fsCopy, '_sv_rowid');
	
//	var selectedElements = [];
//	for(var r = 1; r <= _fsCopy.getSize(); r++)
//		selectedElements.push(r);
//	
//	return selectedElements;
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
 * @properties={typeid:24,uuid:"150B1FC4-4CEE-47A7-9340-D1F312EC05EF"}
 * @AllowToRunInFind
 */
function aggiungiEventoDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event){
	
	aggiungiEvento(_event);
		
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"05867886-92CD-4B42-AD17-402773661CFF"}
 */
function aggiungiOreCommessaDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event){
	
	aggiungiOreCommessa(_event);
}

/**
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"2469780A-ED61-48AC-B747-BEC0A8F6C338"}
 */
function aggiungiEvento(_event)
{
	var _frm = forms.giorn_modifica_eventi_dtl;
	    _frm._isInModifica = false;
	var _idGiornaliera = forms[_event.getFormName()].foundset['idgiornaliera'];//forms['giorn_list_temp'].foundset['idgiornaliera'];
	    _frm._idGiornaliera= _idGiornaliera;
		
	var _totOre = globals.getTotOreGiornata(_idGiornaliera);
	//var _totOreTeorico = parseFloat(forms['giorn_list_temp'].foundset['orarioprevisto'])*100;
    var _totOreTeorico = globals.ottieniOreTeoricheGiorno(forms[_event.getFormName()].foundset['idlavoratore'],forms[_event.getFormName()].foundset.foundset['giorno']);
	var _giorno = foundset.getSelectedIndex() - globals.offsetGg;
	    
    //inizializza valori nuovo evento
	_frm.inizializzaValoriEvento(-1,-1,'','','','',null,0,-1,'','',null,_giorno);
	//setta il valore delle ore lavorate
	_frm._totOre = _totOre;
	//setta il valore delle ore lavorabili teoriche
	_frm._totOreTeorico = _totOreTeorico;
	//sull'aggiunta di un evento il flag di copertura è sempre impostato ad 1 
	_frm.vCoperturaOrarioTeorico = true;
	//nel caso di aggiunta evento il campo valore è sempre non visibile
	_frm.elements.fld_mod_valore.visible = false;
	_frm.elements.lbl_mod_valore.visible = false;
	_frm._importo = 0;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
	globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Aggiungi il nuovo evento');
	
}

/** 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"622F5FA2-212B-4C75-BF74-5C0BB92E6FC1"}
 */
function aggiungiOreCommessa(_event)
{
	var _frm = forms.giorn_aggiungi_ore_commessa;
	var _idGiornaliera = forms['giorn_list_temp'].foundset.duplicateFoundSet()['idgiornaliera'];
	var _giorno = globals.getGiornoDaIdGiornaliera(_idGiornaliera);
	var dsCommLav = globals.getFasiCommesseLavoratore(forms.giorn_header.idlavoratore,_giorno,_giorno);
	var arrComm = dsCommLav != null ? dsCommLav.getColumnAsArray(1) : [];
	var arrDisplayVls = dsCommLav != null ? dsCommLav.getColumnAsArray(2) : [];
		
	if(arrDisplayVls.length > 0)
	{
		_frm._idLav = forms.giorn_header.idlavoratore;
		_frm._giorno = _giorno;
		_frm._proprieta = 'D';
		
	    application.setValueListItems('vls_commesse_lavoratore',arrDisplayVls,arrComm);
	    
	    globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
	    
	    globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Aggiungi ore commessa');
	}
	else
		globals.ma_utl_showWarningDialog('Nessuna commessa disponibile per il giorno selezionato','Aggiungi ore commessa');
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"92BFB0FD-4C4E-4CCB-AB94-2EA2206C57DB"}
 */
function apriGestioneOreCommesseDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.apriProgrammazioneCommesse(_event,
		                               forms.giorn_header.idditta,
		                               globals.getAnno(),
									   globals.getMese(),
									   globals.getGruppoLavoratori(),
									   globals.getGruppoInstallazione(),
									   forms.giorn_header.idlavoratore);
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
 * @properties={typeid:24,uuid:"A54E41CC-3296-49C0-AA3A-E6BD7218571A"}
 * @AllowToRunInFind
 */
function modificaEventoDaMenu(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	modificaEvento(_event);
} 

/**
 * @AllowToRunInFind
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"ECAFE0CA-D501-4A1B-8438-6003E5E170FB"}
 */
function modificaEvento(_event)
{
	databaseManager.setAutoSave(false);

	var _idGiornalieraEventi = foundset[_event.getElementName()];
	var _frm = forms.giorn_modifica_eventi_dtl;
	    _frm._isInModifica = true;
	var _idGiornaliera = forms[_event.getFormName()].foundset['idgiornaliera'];
	    _frm.idgiornaliera = _idGiornaliera;
	var _totOre = _idGiornaliera ? globals.getTotOreGiornata(_idGiornaliera) : 0;
	var _totOreTeorico = parseFloat(forms[_event.getFormName()].foundset['orarioprevisto'])*100;
	var _giorno = foundset.getSelectedIndex() - globals.offsetGg;
	var _fs = _frm.foundset;
	var _rows = -1;
	
    if(_idGiornalieraEventi != null)
    {	
		//la modifica di un evento è relativa alla cella su cui ci si posiziona in giornaliera
		//pertanto la modifica di un evento è sempre relativa ad un singolo giorno
		//modificando un evento vengono automaticamente aggiornati l'array di giorni selezionati 
		//in precedenza con il singolo giorno relativo alla cella  
		if(globals.getGiorniSelezionatiEv().length > 1)
		{
			globals.apriCambiaEventoMultiplo(_idGiornalieraEventi);
			return;
		}
		
		//effettuiamo il rollback perchè il find sulla selezione delle proprietà
		//a volte blocca il find successivo
		databaseManager.revertEditedRecords(_fs);
		
		//cerchiamo nel foundset il record con il corrispondente idGiornalieraEventi
    	if(_fs.find()){
	 	
	    	_fs.idgiornalieraeventi = _idGiornalieraEventi;
		    _rows = _fs.search();
		
	    }
		else
		{
			globals.ma_utl_showErrorDialog('Cannot go to find mode','Servoy error');
			return;
		}
       
		//se è presente
	    if(_rows > 0)
	    {
	    	 //se in presenza di un evento relativo ad un certificato invita a passare attraverso le certificazioni 
	    	 // OLD mostra la gestione dello storico
			 if(globals.needsCertificate(_fs.e2giornalieraeventi_to_e2eventi.ideventoclasse))
			 {
				 globals.ma_utl_showInfoDialog('Per modificare un evento lungo selezionare la voce <b>Gestione certificati</b> dal menu contestuale');
			  	 return;
//			    globals.showStorico(_fs.e2giornalieraeventi_to_e2eventi.ideventoclasse,
//			    	                foundset.getSelectedIndex() - globals.offsetGg,
//									forms.giorn_header.idlavoratore,
//									forms.giorn_header.idditta);
			 }
			 else
		     {
		    	 var _descrizione = _fs.e2giornalieraeventi_to_eventiproprieta ?
		    	                    _fs.e2giornalieraeventi_to_eventiproprieta.descrizione : '';
		    	 //inizializza i valori dell'evento
		    	 _frm.inizializzaValoriEvento(_fs.idevento
		    		                          ,_fs.e2giornalieraeventi_to_e2eventi.ideventoclasse
											  ,_fs.e2giornalieraeventi_to_e2eventi.evento
											  ,_fs.e2giornalieraeventi_to_e2eventi.descriz
											  ,_fs.codiceproprieta ? _fs.codiceproprieta : ''
											  ,_descrizione
											  ,_fs.ore_effettive
											  ,_fs.valore
											  ,_fs.idevento
											  ,_fs.e2giornalieraeventi_to_e2eventi.evento
											  ,_fs.codiceproprieta ? _fs.codiceproprieta : ''
											  ,_fs.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassiproprieta.ideventoclasseproprieta
											  ,null);
		    	 //setta il valore delle ore lavorate
		    	 _frm._totOre = _totOre;
		    	 //setta il valore delle ore lavorabili teoriche
		    	 _frm._totOreTeorico = _totOreTeorico;
		    	 //nel caso di modifica evento il campo valore è sempre visibile
		    	 _frm.elements.fld_mod_valore.visible = true;
		    	 _frm.elements.lbl_mod_valore.visible = true;
				 
		    	 _frm._idGiornaliera = _idGiornaliera;
		    	 
		    	 globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
		    	 globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Modifica l\'evento selezionato', null, true);
		     }		
		}
	    //idgiornaliera presente ma record non trovato...(strano ma lo consideriamo) mostriamo la gestione dell'aggiunta evento
	    else
	    {		
	    	//inizializza i valori dell'evento
	    	_frm.inizializzaValoriEvento(-1,-1,'','','','',null,0,-1,'','', _giorno);
	    	//setta il valore delle ore lavorate
	        _frm._totOre = _totOre;
	    	//setta il valore delle ore lavorabili teoriche
	    	_frm._totOreTeorico = _totOreTeorico;
	    	
	    	globals.ma_utl_setStatus(globals.Status.EDIT,_frm.controller.getName());
		    globals.ma_utl_showFormInDialog(_frm.controller.getName(),'Aggiungi il nuovo evento', null, true);
		    
	    	 for(var e = 1; e <= numeroEventi; e++)
	    	 {
	    		 if(foundset['evento_' + e])
					 databaseManager.refreshRecordFromDatabase(foundset['giornaliera_to_e2giornalieraeventi_evento_' + e], 0);
	    	 }
		}
	}
	//se non è presente (si è cliccato su una cella vuota...) mostriamo la gestione dell'aggiunta evento
    else
       	aggiungiEvento(_event);
	
}

/**
 * @properties={typeid:24,uuid:"B670F783-58B6-4ED4-BD0E-E9AB3AF9A728"}
 */
function aggiungiEventoMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var dipGiornaliera = globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore');
	
	globals.showOperazioneMultipla
	(
		  globals.salvaEventoMultiplo
		, forms.giorn_operazionemultipla_evento.controller.getName()
		, globals.getGiorniSelezionatiEv()
		, [forms.giorn_header.idlavoratore]
		, false
		, function(fs)
		  { 
			  fs.addFoundSetFilterParam('idlavoratore','IN',dipGiornaliera);
		  }
		,null
		,null
		,null
		,'Aggiunta evento multiplo'
	);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _tipoCert
 * @param {String} _gg
 * 
 * @properties={typeid:24,uuid:"9A182A32-4726-46E6-8E72-36959EAEDAF2"}
 */
function lkpInserisciCertificato(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,_event,_tipoCert,_gg){
	
	//ideventoclasse del tipo dicertificato scelto per l'inserimento
	var _idEvClasse  = null;
	
	var _params = new Object();
	_params.mode = "editcommit";
	
	switch(_tipoCert)
	{		
		case 0:
			//MALATTIA
			_idEvClasse = globals.EventoClasse.MALATTIA;
			break;
		case 1:
			//INFORTUNIO
		    _idEvClasse = globals.EventoClasse.INFORTUNIO;
			break;
		case 2:
            //MATERNITà
		    _idEvClasse = globals.EventoClasse.MATERNITA;
			break;
		case 3:
			//CONGEDO PARENTALE
	    	_idEvClasse = globals.EventoClasse.PARENTALE;
			break;
		case 4:
			//CONGEDO MATRIMONIALE
		    _idEvClasse = globals.EventoClasse.MATRIMONIALE;
			break;
		case 5:
			//CONGEDO PATERNO
			_idEvClasse = globals.EventoClasse.PARENTALE_PATERNO;
			break;
	}
	
	
	if(globals.isSocioCollaboratore(forms.giorn_header.idlavoratore)
	   || _idEvClasse == globals.EventoClasse.PARENTALE_PATERNO
			&& globals.isFemmina(forms.giorn_header.idlavoratore))
	{
		globals.ma_utl_showWarningDialog('Funzione non abilitata per questo lavoratore','Inserimento eventi lunghi');
	    return;
	}
	
	forms.storico_main.showStorico(_idEvClasse, parseInt(_gg, 10), forms.giorn_header.idlavoratore, forms.giorn_header.idditta);
}

/**
 * 
 *
 * @properties={typeid:24,uuid:"748488C9-D1DA-4A54-85E6-01FDBF53A99B"}
 */
function FiltraEventiGiorno(){
	
	/** @type JSFoundset */
	var _fs = new JSFoundset()
	
	_fs = forms.giorn_vista_mensile_eventi_tbl.foundset.duplicateFoundSet()
	//_fs = forms.giorn_vista_mensile_dettagli_tbl.foundset.duplicateFoundSet()
	return _fs
}



/**
 * // TODO generated, please specify type and doc for the params
 * @param {JSFoundset} _fs
 *
 *
 * 
 *
 * @properties={typeid:24,uuid:"AD52CE9B-8ACB-418E-B1FC-63D2B6B0DB54"}
 */
function FiltraMaternita(_fs){
	
	var _anno = globals.getAnno();
	var _mese = globals.getMese();
	var _giorno = parseInt(foundset.getSelectedRecord()['giornomese'],10);
	
	var _dataSel = new Date(_anno,_mese - 1,_giorno);
	
	_fs = forms.giorn_header.lavoratori_to_storico_certificati.duplicateFoundSet();
	
	_fs.addFoundSetFilterParam('ideventoclasse','=',91);
    _fs.addFoundSetFilterParam('tipocertificato','in',['DA','DP','DE','CI','AP','PP','MP','PI']);
	
	_fs.addFoundSetFilterParam('dal','<=',_dataSel.getTime());
    _fs.addFoundSetFilterParam('al','>=',_dataSel.getTime());
	
	_fs.loadAllRecords();
	
	return _fs;
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"ED7C9121-F41D-48FC-8937-9C6FF1E6D502"}
 */
function FiltraCongedoParentale(_fs){
	
	var _anno = globals.getAnno();
	var _mese = globals.getMese();
	var _giorno = parseInt(foundset.getSelectedRecord()['giornomese'],10);
	
	var _dataSel = new Date(_anno,_mese - 1,_giorno);
	
	_fs = forms.giorn_header.lavoratori_to_storico_certificati.duplicateFoundSet();
	
	_fs.addFoundSetFilterParam('ideventoclasse','=',globals.EventoClasse.PARENTALE);
    _fs.addFoundSetFilterParam('tipocertificato','in',['DF','CP','PA']);
	
	_fs.addFoundSetFilterParam('dal','<=',_dataSel.getTime());
    _fs.addFoundSetFilterParam('al','>=',_dataSel.getTime());
	
	_fs.loadAllRecords();
	
	return _fs;
}

/**
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"3353CA99-1F5A-4032-A4F7-8E7EDD4BD8B6"}
 */
function FiltraCongedoParentalePaterno(_fs){
	
	var _anno = globals.getAnno();
	var _mese = globals.getMese();
	var _giorno = parseInt(foundset.getSelectedRecord()['giornomese'],10);
	
	var _dataSel = new Date(_anno,_mese - 1,_giorno);
	
	_fs = forms.giorn_header.lavoratori_to_storico_certificati.duplicateFoundSet();
	
	_fs.addFoundSetFilterParam('ideventoclasse','=',globals.EventoClasse.PARENTALE_PATERNO);
    _fs.addFoundSetFilterParam('tipocertificato','in',['DC','PC','GO','GS']);
	
	_fs.addFoundSetFilterParam('dal','<=',_dataSel.getTime());
    _fs.addFoundSetFilterParam('al','>=',_dataSel.getTime());
	
	_fs.loadAllRecords();
	
	return _fs;
}

/**
 * Mostra il menu contestuale in giornaliera
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"3E2D4086-6C59-4A80-91BC-6941A8EDEEF9"}
 */
function apriPopupVistaMensile(_event)
{	
	var _rec = forms[_event.getFormName()].foundset.getSelectedRecord();
	var _giornoMese = _rec['giornomese'];
	var _isBudget = forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET ? true : false;
	var _isGgConteggiato = globals.isGiornoConteggiato(_rec['idlavoratore'],_rec['giorno']);
	var _disabled = _isBudget && _isGgConteggiato;
	
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	
	// Copincolla giornata
	var copiaGiornataMenu = _popUpMenu.addMenuItem('Copia giornata', copiaGiornata);
		copiaGiornataMenu.methodArguments = [foundset.getSelectedIndex() - globals.offsetGg];
		copiaGiornataMenu.enabled = !_disabled;
	var incollaGiornataMenu = _popUpMenu.addMenuItem('Incolla giornata', incollaGiornata);
		incollaGiornataMenu.methodArguments = [vGiornataDaCopiare];
		incollaGiornataMenu.enabled = (vGiornataDaCopiare !== 0 && !_disabled);
	    
	_popUpMenu.addSeparator();
	
	var _popUpMenuEventi = _popUpMenu.addMenu('Gestione eventi ');
	var _addEvento = _popUpMenuEventi.addMenuItem('Aggiungi un evento ', aggiungiEventoDaMenu);
	_addEvento.methodArguments = [_event];
	_addEvento.enabled = !_disabled;
	var _editEvento = _popUpMenuEventi.addMenuItem('Modifica l\'evento selezionato ', modificaEventoDaMenu);
	_editEvento.methodArguments = [_event];
	_editEvento.enabled = !_disabled;
	var _delEvento = _popUpMenuEventi.addMenuItem('Elimina l\'evento ', eliminazioneEvento);
	_delEvento.methodArguments = [_event];
    _delEvento.enabled = !_disabled;
    //gestione eventi sospensivi
//		var _sospEvento = _popUpMenuEventi.addMenuItem('Gestisci evento sospensivo', lkpInserisciEventoSospensivo);
//		var _giorniSel = globals.getGiorniSelezionatiEv();
//		    _giorniSel.sort();
//		_sospEvento.methodArguments = [_event,_giorniSel[0]];

    _popUpMenuEventi.addSeparator();
		
    var _addEventoMultiplo = _popUpMenuEventi.addMenuItem('Aggiungi un evento multiplo ', aggiungiEventoMultiplo);
		_addEventoMultiplo.methodArguments = [_event];
		_addEventoMultiplo.enabled = !_isBudget;
	var _cambiaEvento = _popUpMenuEventi.addMenuItem('Cambia un evento ', globals.cambiaEventoMultiplo);
		_cambiaEvento.methodArguments = [_event,foundset[_event.getElementName()]];
		_cambiaEvento.enabled = !_isBudget;
    var nonHaOrologio = globals.haOrologio(forms.giorn_header.idditta) === 0;	// 0 - no timbrature
    
    if(nonHaOrologio)
	{
		var _popUpMenuCompila = _popUpMenu.addMenu('Compilazione giorni ')
    	    _popUpMenuCompila.setEnabled(nonHaOrologio);
	    var _item2 = _popUpMenuCompila.addMenuItem('Compila il singolo dipendente ', globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? 
	    		                                                                     compilaDaCommesseSingolo : compilaDalAlSingolo);
            _item2.methodArguments = [_event];
        var _item2_1 = _popUpMenuCompila.addMenuItem('Scegli i dipendenti da compilare ', globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ?
        		                                                                          compilaDaCommesseMultiplo : compilaDalAlMultiplo);    
	        _item2_1.methodArguments = [_event];
	}
	else
    {
        var _popUpMenuConteggia = _popUpMenu.addMenu('Conteggio timbrature ')
    	var _item3 = _popUpMenuConteggia.addMenuItem('Conteggia il singolo dipendente ', conteggiaTimbratureSingolo)
	        _item3.methodArguments = [_event]
	    var _item3_1 = _popUpMenuConteggia.addMenuItem('Scegli i dipendenti da conteggiare ', conteggiaTimbratureMultiplo)
	        _item3_1.methodArguments = [_event]  
    }
    
	var _item3_2 = _popUpMenu.addMenuItem('Rendi i giorni riconteggiabili', rendiGiorniRiconteggiabili);
	    _item3_2.methodArguments = [_event, foundset.getSelectedIndex() - globals.offsetGg];    
	
	_popUpMenu.addSeparator();
	
	var _popUpMenuStorico = _popUpMenu.addMenu('Gestione certificati ')
	var _item4 = _popUpMenuStorico.addMenuItem('Inserisci malattia ', lkpInserisciCertificato)
	    _item4.methodArguments = [_event,0,_giornoMese]
	    _item4.enabled = !_isBudget;
	var _item5 = _popUpMenuStorico.addMenuItem('Inserisci infortunio ', lkpInserisciCertificato)
        _item5.methodArguments = [_event,1,_giornoMese]
	    _item5.enabled = !_isBudget;
	var _item6 = _popUpMenuStorico.addMenuItem('Inserisci maternità ', lkpInserisciCertificato)
        _item6.methodArguments = [_event,2,_giornoMese]
	    _item6.enabled = !_isBudget
	var _item7 = _popUpMenuStorico.addMenuItem('Inserisci congedo parentale ', lkpInserisciCertificato)
	    _item7.methodArguments = [_event,3,_giornoMese]
	    _item7.enabled = !_isBudget
	var _item7_p = _popUpMenuStorico.addMenuItem('Inserisci congedo paterno ', lkpInserisciCertificato)
        _item7_p.methodArguments = [_event,5,_giornoMese]
	    _item7_p.enabled = !_isBudget
	var _item8 = _popUpMenuStorico.addMenuItem('Inserisci congedo matrimoniale ', lkpInserisciCertificato)
        _item8.methodArguments = [_event,4,_giornoMese]
	    _item8.enabled = !_isBudget
        
	_popUpMenu.addSeparator();
	
	var _item9 = _popUpMenu.addMenuItem('Controlli preliminari dipendente ', controlliPreliminari)
        _item9.methodArguments = [_event];
	    _item9.enabled = (!_isBudget && globals.getTipologiaDitta(forms.giorn_header.idditta) != globals.Tipologia.ESTERNA)
		
	_popUpMenu.addSeparator();
	
	var _popUpMenuStampe = _popUpMenu.addMenu('Stampa... ');
	var _item10 = _popUpMenuStampe.addMenuItem('Stampa giornaliera ', stampaGiornalieraMensile);
        _item10.methodArguments = [_event];
    if(!nonHaOrologio)
    {
       	var _item10_1 = _popUpMenuStampe.addMenuItem('Stampa cartoline ',stampaCartolinaMensile);
    	_item10_1.methodArguments = [_event];
    	if(globals.getCausaliTimbratureDitta(forms.giorn_header.idditta).length)
		{
			var _item10_2 = _popUpMenuStampe.addMenuItem('Stampa riepilogo causalizzate ',stampaReportRiepilogoCausalizzate);
	    	   _item10_2.methodArguments = [_event,forms.giorn_header.idditta];
			var _item10_3 = _popUpMenuStampe.addMenuItem('Stampa confronto effettive/causalizzate ',stampaReportCausalizzate);
    	        _item10_3.methodArguments = [_event,forms.giorn_header.idditta];
    	   
		}
    }
    
    _popUpMenu.addSeparator();
	
	if(!nonHaOrologio)
	{
	   var _item11 = _popUpMenu.addMenuItem('Compila presunta ', compilaPresunta);
	       _item11.methodArguments = [_event];
	   
	}
	
	// abilitazione programmazione turni
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
	
	// abilitazione opzioni per commesse
	if(globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE))
	{
		var _popUpCommesse = _popUpMenu.addMenu('Gestione commesse');
		var _item13 = _popUpCommesse.addMenuItem('Vai alla gestione delle ore in commessa',apriGestioneOreCommesseDaMenu);
		_item13.methodArguments = [_event];		
//		var _item14 = _popUpCommesse.addMenuItem('Aggiungi ore commessa',aggiungiOreCommessa);
//		_item14.methodArguments = [_event];
//		var _item14_1 = _popUpCommesse.addMenuItem('Importa tracciato ore su commessa',globals.importaTracciatoOreCommessa);
//		_item14_1.methodArguments = [_event];
		
		if(globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA))
	    {
	    	var _menu15 = _popUpCommesse.addMenu('Gestione autorizzazione ore')
	    	var _item15_1 = _menu15.addMenuItem('Dipendente selezionato',globals.gestioneAutorizzazioneCommesse);
	    	_item15_1.methodArguments = [_event,
	    	                           new Date(globals.getAnno(),globals.getMese() - 1,1),
	    	                           new Date(globals.getAnno(),globals.getMese() - 1,globals.getTotGiorniMese(globals.getMese(),globals.getAnno())),
	    	                           forms.giorn_header.idlavoratore
									   ];
	    	var _item15_2 = _menu15.addMenuItem('Tutti i dipendenti',globals.gestioneAutorizzazioneCommesse);
	    	_item15_2.methodArguments = [_event,
							            new Date(globals.getAnno(),globals.getMese() - 1,1),
							            new Date(globals.getAnno(),globals.getMese() - 1,globals.getTotGiorniMese(globals.getMese(),globals.getAnno())),
							            globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore')
										];
			   
	    }
		
		var _item16 = _popUpCommesse.addMenuItem('Stampa report incongruenze commesse',stampaReportIncongruenzeCommesseDaGiornaliera);
		_item16.methodArguments = [_event,
		                           forms.giorn_header.idditta,
								   globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore'),
		                           new Date(globals.getAnno(),globals.getMese() - 1,1),
								   new Date(globals.getAnno(),globals.getMese() - 1,globals.getTotGiorniMese(globals.getMese(),globals.getAnno()))]; 
	    _popUpCommesse.addSeparator();
	    
//	    var _item17 = _popUpCommesse.addMenuItem('Invia riepilogo ore su commessa ai dipendenti',inviaReportLavoratoreCommesse);
//	    _item17.methodArguments = [_event,forms.giorn_header.idditta,globals.foundsetToArray(forms.giorn_header.foundset,'idlavoratore')];
	
	}
	
	/** @type {RuntimeForm<giorn_selezione_multipla>}*/
	var sel_form = forms.giorn_vista_mensile.getSelectionForm();
	
	if(sel_form
	   && sel_form.getGiorniSelezionati(true).indexOf(foundset.getSelectedIndex()) == -1)
		globals.aggiornaSelezioneGiorni(_event, foundset.getSelectedIndex());
		
	if(_source != null)
		_popUpMenu.show(_source)
}

/**
 *
 * @properties={typeid:24,uuid:"514CD9F8-D056-4A2B-A74B-B5490BC06235"}
 */
function apriLkpOperazioniDip(_event)
{
	globals.svy_nav_showLookupWindow('giorn_list_temp',"_arrDipSelezionati",'LEAF_Giornaliera','','FiltraLavoratoriGiornaliera',null,null,'',true,650,660,true,'','dd/MM/yyyy')
}


/**
 * Lancia l'operazione di compilazione della giornaliera a partire dall'orario teorico 
 * 
 * @AllowToRunInFind
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"C8D46D5C-AABD-4D0F-A7CF-5DE7C8CAE84E"}
*/
function compilaDalAlSingolo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.ma_utl_hasKey(globals.Key.COMMESSE_COMPILA_GIORNALIERA) ?
	globals.compilaDalAlCommesseSingolo(forms.giorn_header.idlavoratore,globals.getGiorniSelezionatiEv(),true) :
	globals.compilaDalAlSingolo(forms.giorn_header.idlavoratore,globals.getGiorniSelezionatiEv(),true);
}

/**
 * Lancia l'operazione di compilazione della giornaliera a partire dalle ore di lavoro inserite 
 * sulle commesse 
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 *
 * @properties={typeid:24,uuid:"11C4CC62-421A-4163-9FE6-4878B361F849"}
 */
function compilaDaCommesseSingolo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	// compila la giornaliera a partire dalle ore inserite su commesse
	globals.compilaDalAlCommesseSingolo(forms.giorn_header.idlavoratore,globals.getGiorniSelezionatiEv(),true);
}

/**
 * Lancia l'operazione di compilazione della giornaliera a partire dall'orario teorico
 * per i dipendenti ed i giorni selezionati 
 * 
 * @AllowToRunInFind
 * 
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"171469AF-4743-43E2-B1B9-19F812C3AFFF"}
 */
function compilaDalAlMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.ma_utl_hasKey(globals.Key.COMMESSE_COMPILA_GIORNALIERA) ?
	globals.compilaDalAlCommesseMultiplo(_event) :		
	globals.compilaDalAlMultiplo(_event);
}

/**
 * Lancia l'operazione di compilazione della giornaliera a partire dalle ore di lavoro inserite
 * sulle commesse per i dipendenti ed i giorni selezionati
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 *
 * @properties={typeid:24,uuid:"D8EA3EAB-0A6B-4AB7-B8FF-1122841AF741"}
 */
function compilaDaCommesseMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.compilaDalAlCommesseMultiplo(_event);
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
 * @properties={typeid:24,uuid:"1848EDED-1F04-4732-99A0-54D6D4C78D55"}
 */
function compilaPresunta(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
//   var response = globals._showYesNoQuestion('Volete eliminare eventuali eventi già presenti nel periodo indicato ?','Compilazione giornaliera presunta');	
   globals.compilaDalAlMultiplo(_event);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"D2402D6A-77FA-4BE6-8D34-24BF0AA3EF57"}
 */
function conteggiaTimbratureSingolo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.conteggiaTimbratureSingolo([forms.giorn_header.idlavoratore]
	                                   ,globals.getGiorniSelezionatiEv()
									   ,null
									   ,null
									   ,null
									   ,null
									   ,true);
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
 * @properties={typeid:24,uuid:"1EA57313-0CE9-4AF9-A4D6-341BBD09C3A4"}
 */
function conteggiaTimbratureMultiplo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{	
	globals.conteggiaTimbratureMultiplo(_event);	
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
 * @properties={typeid:24,uuid:"ADA65CBD-BD0E-4879-BC58-BF46A1FE14BD"}
 */
function controlliPreliminari(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	var params = {
        processFunction: process_controlli_preliminari_dip,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [forms.giorn_header.idlavoratore]
    };
	plugins.busy.block(params);
}

/**
 * @param {Number} idLavoratore
 *
 * @properties={typeid:24,uuid:"5D518D5B-7757-4312-99ED-28738CCBD6C2"}
 */
function process_controlli_preliminari_dip(idLavoratore)
{
	try
	{
		globals.controlliPreliminari([idLavoratore], true);
	}
	catch(ex)
	{
		var msg = 'Metodo process_controlli_preliminari : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * This function is used as a method to filter the program 'LEAF_Giornaliera'
 * in the lookup window 
 * 
 * @param {JSFoundset} _fs
 *
 *
 * @properties={typeid:24,uuid:"AADD0B25-7286-4911-810E-79CF19213F5F"}
 */
function FiltraLavoratoriGiornaliera(_fs)
{	
	/** @type Array */
	var _filters = globals.nav.program['LEAF_Giornaliera'].filter;
	for (var j=0;j<_filters.length;j++)
	{
		_fs.addFoundSetFilterParam(_filters[j].filter_field_name,_filters[j].filter_operator,_filters[j].filter_value,_filters[j].filter_name);
	}
	
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].filtro_anag)
		_fs.addFoundSetFilterParam('iddip','IN',forms.giorn_header._arrDsAnag);
	
	return _fs;
}

/**
 * @param {JSRecord <db:/ma_presenze/e2giornalieraeventi>} recGiornEventi  
 * @param {Number} [idLav]
 * @param {Date} [giorno]
 * @param {String} [tipoGiornaliera]
 * 
 * @return Boolean
 *
 * @properties={typeid:24,uuid:"DBFFB390-BB6D-4DDD-8D7B-A9FE6A4D2B5A"}
 * @AllowToRunInFind
 */
function eliminaEvento(recGiornEventi,idLav,giorno,tipoGiornaliera) 
{
	var _index = foundset.getSelectedIndex() - globals.offsetGg;
	/** @type {Array<Number>} */
	var _arrGiorni = globals.getGiorniSelezionatiEv();

	if(!giorno)
	{
		if (_arrGiorni.length == 0)
		    _arrGiorni = [_index];
	    else if (_arrGiorni.indexOf(_index) == -1)
		    _arrGiorni.push(_index);
	}
	else
		_arrGiorni = [giorno.getDate()];
		
	/** @type {Number} */
	var _periodo = giorno ? giorno.getFullYear() * 100 + giorno.getMonth() + 1 : globals.getPeriodo();
		
	if (recGiornEventi) {
		var params = globals.inizializzaParametriEvento(
			idLav ? globals.getDitta(idLav) : forms.giorn_header.idditta,
			_periodo,
			0,
			_arrGiorni, 
			tipoGiornaliera ? tipoGiornaliera : forms.giorn_vista_mensile._tipoGiornaliera, 
			globals._tipoConnessione,
			idLav ? [idLav] : [forms.giorn_header.idlavoratore],
			recGiornEventi.idevento,
            recGiornEventi.codiceproprieta,
            recGiornEventi.ore,
            recGiornEventi.valore,
            recGiornEventi.idevento,
            recGiornEventi.codiceproprieta,
			0
		);

		scopes.giornaliera.cancellaChiusuraDipPerOperazione(idLav ? [idLav] : [forms.giorn_header.idlavoratore],
				                                 			idLav ? globals.getDitta(idLav) : forms.giorn_header.idditta);

		var _retObj = globals.eliminaEvento(params);
		return _retObj.returnValue;

	} else
		return false;

}


/**
* Elimina l'evento selezionato
* 
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* 
 * @properties={typeid:24,uuid:"EF4F4438-2DAF-474F-84C1-CF17A0CE5AB7"}
 * @AllowToRunInFind
 */
function eliminazioneEvento(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event) 
{
	try {
		databaseManager.setAutoSave(false);

		//recupero l'id dell'evento in giornaliera selezionato
		var _idGiornalieraEventi = foundset[_event.getElementName()];
		var _arrGiorni = globals.getGiorniSelezionatiEv();
		var msg;

		if (_idGiornalieraEventi) {
			/** @type {JSFoundSet<db:/ma_presenze/e2giornalieraeventi>} */
			var _fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_EVENTI);
			if (_fs.find()) {
				_fs.idgiornalieraeventi = _idGiornalieraEventi;
				if (_fs.search()) {
					var _rec = _fs.getSelectedRecord();
					var _ideventoclasse = _rec.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.ideventoclasse;
					if (_arrGiorni.length > 1)
						msg = "Procedere con l'eliminazione dell\'evento " + _rec.descrizione.substring(0, _rec.descrizione.indexOf(' ')) + " per i giorni selezionati ?";
					else
						msg = "Procedere con l'eliminazione dell\'evento " + _rec.descrizione + " del giorno " + utils.dateFormat(_rec.e2giornalieraeventi_to_e2giornaliera.giorno, globals.EU_DATEFORMAT) + " ?";

					var answer = globals.ma_utl_showYesNoQuestion(msg, "Elimina evento");
					if (answer) {
						// se è un evento derivante dalla gestione eventi lunghi, viene gestito con lo storico
						if (globals.needsCertificate(_ideventoclasse)) {
							globals.showStorico(_ideventoclasse,
								foundset.getSelectedIndex() - globals.offsetGg,
								globals.getIdLavoratoreDaIdGiornaliera(_rec.idgiornaliera),
								globals.getDitta(globals.getIdLavoratoreDaIdGiornaliera(_rec.idgiornaliera)));
							return;
						} else {
							if (eliminaEvento(_rec
								              , globals.getIdLavoratoreDaIdGiornaliera(_rec.idgiornaliera)
											  , _arrGiorni.length > 1 ? null : _rec.e2giornalieraeventi_to_e2giornaliera.giorno
											  , _rec.e2giornalieraeventi_to_e2giornaliera.tipodirecord)) {
								if (forms.svy_nav_fr_openTabs.vOpenTabs[forms.svy_nav_fr_openTabs.vSelectedTab] == 'LEAF_VisualizzaCopertura')
									forms.giorn_vista_mensile_pannello.preparaGiornaliera(globals.getIdLavoratoreDaIdGiornaliera(_rec.idgiornaliera)
										, _rec.e2giornalieraeventi_to_e2giornaliera.giorno.getFullYear()
										, _rec.e2giornalieraeventi_to_e2giornaliera.giorno.getMonth() + 1
										, _rec.e2giornalieraeventi_to_e2giornaliera.tipodirecord
										, null
										, true
										, true);
								else
								{
									forms.giorn_header.preparaGiornaliera(false);
									globals.verificaDipendentiFiltrati(globals.getIdLavoratoreDaIdGiornaliera(_rec.idgiornaliera));
								}
							} else
								throw new Error("Eliminazione evento non riuscita");

							// in presenza di un evento sospensivo passa dalla gestione eventi anche per l'eliminazione
							//	    	else if(_fs.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconperiodi)
							//	    	{
							//	    		forms.giorn_eventi_sospensivi.showRiepilogoSospensivi(_fs.idevento,forms.giorn_header.idlavoratore,_arrGiorni[0]);
							//	    	    return;
							//	    	}

						}
					}
				} else
					throw new Error("Evento non riconosciuto");
			} else
				throw new Error("Cannot go to find mode");
		} else
			throw new Error("Nessun evento da eliminare");
	} catch (ex) {
		globals.ma_utl_showWarningDialog(ex.message, "Eliminazione evento");
	} finally {

	}
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"909E7611-AAC8-4DFB-8C7C-021FAA71EA05"}
 */
function ELInGiornataDaCopiare()
{
	var fs = forms.giorn_vista_mensile_eventi_tbl.foundset.duplicateFoundSet();
	if(fs.find())
	{
		fs.idgiornaliera = foundset['idgiornaliera'];
		fs.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconstorico = 1;
		if(fs.search() > 0)
			return true;
	}
	
	return false;
}

/**
 * @properties={typeid:24,uuid:"AA3490FB-332D-48EC-8054-7212232FFE9A"}
 */
function copiaGiornata(itemInd, parItem, isSel, parMenTxt, menuTxt, giornata)
{
	if(globals.getGiorniSelezionatiEv().length > 1)
	   globals.ma_utl_showWarningDialog('Attenzione! Sono stati selezionati più giornate per le operazioni di copia.<br/>\
	                                     La copia riguarderà solo la giornata evidenziata : ' + giornata,'Copia/incolla giornata');	
		
	// se nella giornata selezionata esistono degli eventi lunghi, non è possibile copiarla
	if(!ELInGiornataDaCopiare())
	   vGiornataDaCopiare = giornata;
	else 
	{
	   vGiornataDaCopiare = 0;
       globals.ma_utl_showInfoDialog(globals.getHtmlString('La giornata non può essere copiata poichè sono presenti eventi lunghi!'),'Copia giornata');
	}
}

/**
 * @properties={typeid:24,uuid:"34441854-E2E5-4766-B815-AF6311129B04"}
 * 
 */
function incollaGiornata(itemInd, parItem, isSel, parMenTxt, menuTxt, giornata)
{
	if(giornata === 0)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un giorno da copiare', 'i18n:ma.msg.attention');
	    return;
	}
	else
	{
		var ggSel = globals.getGiorniSelezionatiEv();
				
		var params = globals.inizializzaParametriCompilaConteggio(
		                     forms.giorn_header.idditta,
		                     globals.getPeriodo(),
		                     forms.giorn_vista_mensile._tipoGiornaliera,
		                     globals._tipoConnessione,
		                     ggSel,
		                     [forms.giorn_header.idlavoratore],
							 false
					 );
		
			params.giornata = giornata;
		
			var form = forms.giorn_incolla_giornata;
			form.params = params;
			ggSel.length === 1 ? form.elements.lbl_info.text = globals.formatForHtml("Vuoi davvero sovrascrivere la giornata?") // + _fs.descrizione + ' - ' + utils.dateFormat(_fs.e2giornalieraeventi_to_e2giornaliera.giorno, globals.EU_DATEFORMAT) + ' ?'
                          	   : form.elements.lbl_info.text = globals.formatForHtml("Vuoi davvero sovrascrivere per i giorni :<br/> " + ggSel + "?");  // + _fs.descrizione + ' - ' + utils.dateFormat(_fs.e2giornalieraeventi_to_e2giornaliera.giorno, globals.EU_DATEFORMAT) + ' ?' 	
	    	
            globals.ma_utl_showFormInDialog(form.controller.getName(),'Conferma copia/incolla');
			
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
 * @properties={typeid:24,uuid:"D95D20DF-2C39-42BB-BDC3-A33EDC67D1DE"}
 */
function stampaGiornalieraMensile(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	forms.giorn_flusso_centrale_comune.stampaGiornaliera();
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"B2ABD0D3-CD15-4F44-8A13-14C806DB52D9"}
 */
function stampaCartolinaMensile(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.stampaCartolinePresenze(_event);
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _vIdDitta 
 *
 * @properties={typeid:24,uuid:"1FC37842-9766-47AD-B216-A4976E8D2EA4"}
 */
function stampaOreSettimane(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _vIdDitta)
{
	globals.stampaOreSettimane(_event,_vIdDitta);
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
 * @properties={typeid:24,uuid:"578AC265-D452-4DDB-B8D6-8C442BB7395E"}
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
 * @properties={typeid:24,uuid:"E2A7E5F1-99BC-45D9-AAC9-6A728A4436D0"}
 */
function stampaReportRiepilogoCausalizzate(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,vIdDitta)
{
	var frm = forms.stampa_timbr_riepilogo_causalizzate;
	frm.vIdDitta = vIdDitta;
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Stampa report riepilogo causalizzate');	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Number} _idDitta
 * @param {Array<Number>} _arrLavoratori
 * @param {Date} _dal
 * @param {Date} _al
 *
 * @properties={typeid:24,uuid:"330C9FBA-3930-4637-A179-9D47B5C3FF9C"}
 */
function stampaReportIncongruenzeCommesseDaGiornaliera(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event,_idDitta,_arrLavoratori,_dal,_al)
{
	scopes.giorn_reports.stampaReportIncongruenzeGiornalieraCommesse(_idDitta,_arrLavoratori,_dal,_al);
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
 * @properties={typeid:24,uuid:"600AF2F3-43FD-4D32-92DD-BB9E2A6278DA"}
 */
function provaAlberoEventi(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event)
{
	globals.ma_utl_showFormInDialog('giorn_lkp_eventi','Prova albero eventi');
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C355A8A7-D6EF-4B0E-8F3B-3097E9BC78B3"}
 */
function onFieldSelection(event) 
{
	var _recordIndex = foundset.getSelectedIndex();
	var _timeStamp = event.getTimestamp();
	var _lastClickTimeStamp = forms.giorn_vista_mensile.last_click_timestamp;
	var _lastSelectedRecordIndex = forms.giorn_vista_mensile.last_selected_recordindex;
	
	if(globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]]
	   && globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel)
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = _recordIndex;
	
	globals.aggiornaSelezioneGiorni(event, foundset.getSelectedIndex());
	
	if(_recordIndex == _lastSelectedRecordIndex)
	{
		if(_timeStamp - _lastClickTimeStamp < globals.intervalForDblClk)
			modificaEvento(event);
		
		forms.giorn_vista_mensile.last_click_timestamp = _timeStamp;
	}
	else
	{
		forms.giorn_vista_mensile.last_selected_recordindex = _recordIndex;
		forms.giorn_vista_mensile.last_click_timestamp = _timeStamp;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5F805238-267E-4A4E-B92C-F2D6FA6A1D63"}
 */
function onActionGiorno(event) {

	var _recordIndex = foundset.getSelectedIndex();
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = _recordIndex;
	globals.aggiornaSelezioneGiorni(event,_recordIndex);
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"72A2D477-1D77-406C-B205-3BE89286F8F6"}
 */
function onActionMese(event) {

	var _recordIndex = foundset.getSelectedIndex();
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = _recordIndex;
	globals.aggiornaSelezioneGiorni(event,_recordIndex);
	
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
* @properties={typeid:24,uuid:"A86EBA88-8ABD-46D6-80D6-53E02450462F"}
*/
function rendiGiorniRiconteggiabili(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt, _event, _giorno)
{
	var giorniSelezionati = globals.getGiorniSelezionatiEv();
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

	if(arrLav.length == 0)
	{
		globals.ma_utl_showWarningDialog('Selezionare almeno un dipendente','Rendi i giorni riconteggiabili');
		return;
	}
	
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
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param _form
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"E8A66A56-0272-48D6-8FA6-026A4AADEB56"}
 */
function onRecordSelection(event, _form)
{
	if(foundset && foundset.getSize() > 0)
	{
		var idGiornalieraGiorno = foundset['idgiornaliera'] ? foundset['idgiornaliera'] : globals.getIdGiornalieraDaIdLavGiorno(forms.giorn_header.idlavoratore,foundset['giorno']);
		if(idGiornalieraGiorno)
		{
			var selection_form = forms.giorn_vista_mensile.getSelectionForm();
			if(selection_form)
			   selection_form.foundset.setSelectedIndex(foundset.getSelectedIndex());
				
			forms.giorn_vista_mensile.aggiornaRiepiloghiGiorno(idGiornalieraGiorno);
		}
	}
}

/**
 * @properties={typeid:24,uuid:"9741CBB1-107B-4D14-9886-EF473747A833"}
 */
function onStopRecordSelectionCallback()
{
	plugins.scheduler.removeJob('check_stop_selection');
	
	if(forms.giorn_vista_mensile.last_selected_recordindex == foundset.getSelectedIndex())
		forms.giorn_vista_mensile.aggiornaRiepiloghiGiorno(foundset['idgiornaliera']);
	
	application.output(forms.giorn_vista_mensile.last_selected_recordindex == foundset.getSelectedIndex());
}
