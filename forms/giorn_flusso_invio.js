/**
 * Lancia l'operazione di predisposizione e consolidamento dei dati per 
 * il successivo invio allo studio
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 * 
 * @properties={typeid:24,uuid:"E4878EC2-2634-4109-8AFD-A94FF1616AD2"}
 */
function preparaChiusuraMese(event)
{
	var params = {
        processFunction: process_chiusura_mese,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: []
    };
	plugins.busy.block(params);
}

/**
 * @properties={typeid:24,uuid:"EBF94F96-9327-438C-B403-8E4F1103E729"}
 */
function process_chiusura_mese()
{
	try
	{
		var params = globals.inizializzaParametriChiusura(forms.giorn_header.idditta,
														  globals.getGruppoLavoratori(),
														  globals.getPeriodo(),
			                                              globals._tipoConnessione
		                                                  );
		
		forms.giorn_controllo_cp._daControlliPreliminari = false;
		forms.giorn_controllo_annotazioni_ditta._daControlliPreliminari = false;
		
		globals.chiusuraMeseCliente(params);	    
	}
	catch(ex)
	{
		var msg = 'Metodo process_chiusura_mese : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Lancia l'operazione di creazione del file di giornaliera e ne fa l'upload
 * nel folder sul sito ftp.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 *
 * @properties={typeid:24,uuid:"739445A2-06EA-4E43-B975-D1165771A0A3"}
 */
function inviaGiornalieraPannello(event) 
{
   var _idditta = forms.giorn_header.idditta;
   var _anno = globals.getAnno();
   var _mese = globals.getMese();
   var _periodo = globals.getPeriodo();
   var _gruppoinst = globals.getGruppoInstallazione();
   var _gruppolav = globals.getGruppoLavoratori();
   var _params = globals.inizializzaParametriInvioGiornaliera(_idditta,[],_periodo,_gruppoinst,_gruppolav,globals._tipoConnessione);
   var _paramsFtp = globals.inizializzaParametriRiceviTabelle(_idditta,_gruppoinst,_gruppolav,globals.TipoConnessione.CLIENTE);
   
   if(forms.giorn_vista_mensile._filtroAttivo)
   {
	   globals.ma_utl_showWarningDialog('<html>Disattivare i filtri su dipendenti prima di poter procedere con l\'invio.</html>',
		                                'Invio giornaliera allo studio');
	   return;
   }
   
   /** @type {Array} */
   var _arrDipSenzaRegole = _params.codgruppogestione != "" ? globals.getElencoDipendentiSenzaRegoleAssociateWS(_params) : globals.getElencoDipendentiSenzaRegoleAssociate(_params);
   if(_arrDipSenzaRegole && _arrDipSenzaRegole.length > 0)
   {
      globals.ma_utl_showWarningDialog('<html>Ci sono nuovi dipendenti senza regola associata non presenti in fase di apertura della giornaliera.<br/> \
                                 Chiudere e riaprire la giornaliera per sistemare le regole e poter proseguire.<html>',
								 'Invio giornaliera allo studio');
      return;
   }
   
   //controllo su acquisizioni mesi precedenti - controllaAcquisizioneCM ritorna un numero a seconda della situazione
   var _response;
   var _retvalue;
   var _noconnection;
   
	if (globals.getTipologiaDitta(_idditta) == globals.Tipologia.GESTITA_UTENTE) 
	{
		_response = true;
		_retvalue = 1;
		_noconnection = false;
    }
    else 
    {
    	var response = scopes.giornaliera.controllaAcquisizioneCM(_params);
    	if(response)
    	{
    		_response = response && response.StatusCode == globals.HTTPStatusCode.OK;
    		_retvalue = response.ReturnValue;
    		_noconnection = false;
    	}
    	else 
    		_noconnection = true;
    	
    }    

	if (_noconnection == false ) {
		// risposta ottenuta
		if (_response == true) {
			// acquisizioni precedenti ok, proseguire con i controlli chiusura
			if (_retvalue == 1)
			{
				var _frmCtrChiusura = forms.giorn_controllo_chiusura_cliente;
					
				var _objCatBloccanti = globals.ottieniCategorieBloccanti(forms.giorn_header.idditta,globals.getPeriodo(),_frmCtrChiusura);
					
				// se esistono categorie bloccanti (N.B. nel caso di invio non consideriamo eventuali messaggi di ritorno
				// ad esempio segnalazioni di timbrature errate etc
				if(_objCatBloccanti.bloccante)
				    globals.ma_utl_showWarningDialog(globals.getHtmlString('Controllare e sistemare gli eventi bloccanti per l\'invio prima di proseguire'),'Controllo categorie bloccanti per invio giornaliera');
				else
				{
					// se non ci sono eventi bloccanti controlliamo comunque non vi siano dipendenti da chiudere
					var _objDipDaChiudere = globals.ottieniArrayDipDaChiudere(_params);
					if(_objDipDaChiudere.arrMancanti.length > 0) 
						globals.ma_utl_showWarningDialog(globals.getHtmlString('Effettuare la predisposizione per l\'invio prima di proseguire'),'Controllo dipendenti da chiudere per invio giornaliera');
					else
					{
						var ctrlRes;
						var _result;
						
						if(globals.getTipologiaDitta(_idditta) == globals.Tipologia.GESTITA_UTENTE)
							_result = 0;
						else 
						{
							// controllo presenza di eventuali giornaliere ancora da importare da parte dello studio
							var ctrlUrl = globals.WS_LU + "/Ftp32/VerifyCalendarData";
							_params["sede"] = true;
							ctrlRes = globals.getWebServiceResponse(ctrlUrl,_params);
							_result = ctrlRes.ReturnValue;
						}
						
						if(_result == 0)
						{
							// controllo presenza di eventuali dati inviati dallo studio e non ancora acquisiti (compresi certificati telematici non ancora importati)
							if(!globals.verificaDatiSuFtp(_paramsFtp))
							{
								// array contenente gli id dei lavoratori relativi ai parametri di ingresso (senza ulteriori filtri)
								var _arrDipIngresso = globals.getLavoratoriGruppo(_params,_idditta);
								// nel caso di primo invio, i dipendenti da inviare sono TUTTI, pertanto non verrà richiesta
								// la selezione manuale; in caso contrario verranno visualizzati i dipendenti con la preselezione automatica dei dipendenti che risultano da inviare
								/** @type {Array<Number>}*/
								var _arrDipSelezionati = scopes.giornaliera.isPrimoInvioGiornaliera(_arrDipIngresso,_periodo) ? 
										                 _arrDipIngresso : globals.ma_utl_showLkpWindow({
																										    event							: new JSEvent
																											, lookup						: 'AG_Lkp_Lavoratori'
																											, methodToAddFoundsetFilter		: 'FiltraLavoratoriGiornaliera'
																											, allowInBrowse					: true
																											, multiSelect					: true
																											, selectedElements				: globals._arrDipDaInviare
																										});
								
								
								if (_arrDipSelezionati && _arrDipSelezionati.length > 0) 
								{
// TODO caso COMMESSE				// verifichiamo la corrispondenza tra ore in giornaliera ed ore di commessa, nel caso necessitassimo di autorizzare le ore su commessa
									if(globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA))
									{
										// primo passo : verifica autorizzazioni sulle ore di commessa
										var dsOreCommDaAuth = globals.ottieniDatasetOreCommesseDaAutorizzare(_arrDipSelezionati,
																                                      new Date(_anno,_mese - 1,1),
																									  new Date(_anno,_mese - 1, globals.getTotGiorniMese(_mese,_anno)))
										if(dsOreCommDaAuth.getMaxRowIndex() > 0)
									    {
											var answerAuth = globals.ma_utl_showWarningDialog('Ci sono ancora delle ore su commessa inserite ma non autorizzate.<br/>\
											                                  				   Procedere comunque?','Ore su commessa da autorizzare');		
											if(!answerAuth)
												return;
									    }
									}
									
									if(globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE_COMMESSE))
									{
										// secondo passo : se le autorizzazioni sono a posto, visualizza le eventuali incongruenze
										// variabile booleana : true se non vi sono incongruenze tra ore di commesse ed ore lavorabili
										var isMatched = true;
										var dsOre = globals.ottieniDatasetIncongruenzeGiornalieraCommesse(_arrDipSelezionati,
											                                                        	  new Date(_anno,_mese - 1,1),
																									      new Date(_anno,_mese - 1, globals.getTotGiorniMese(_mese,_anno)));
										dsOre.getMaxRowIndex() > 0 ? isMatched = false : isMatched = true;
										// se vi sono incongruenze, viene chiesto se si vuole procedere comunque; in caso negativo viene chiesto se si vuole scaricare il report oppure     
										if(!isMatched)
										{
											var answerSend = globals.ma_utl_showYesNoQuestion('Sono state rilevate delle incongruenze tra le ore in giornaliera e le ore inserite su commesse. <br/>\
											                                               Tale situazione non è bloccante per l\'invio tuttavia è consigliato controllare. <br/> \
											                                               Procedere comunque?','Rilevazione incongruenze giornaliera commesse');
											if(!answerSend)
											{
												var answerRep = globals.ma_utl_showYesNoQuestion('Volete scaricare il report con le incongruenze?','Rilevazione incongruenze giornaliera commesse');
												if(answerRep)
											   	scopes.giorn_reports.stampaReportIncongruenzeGiornalieraCommesse(_idditta,
											   		                                                             _arrDipSelezionati,
																												 new Date(_anno,_mese - 1,1),
																												 new Date(_anno,_mese - 1,globals.getTotGiorniMese(_mese,_anno)));
												return;
											}
											
										}
									}
																		
									_params.iddipendenti = _arrDipSelezionati;
									
									var params = {
								        processFunction: process_invia_giornaliera_pannello,
								        message: '', 
								        opacity: 0.5,
								        paneColor: '#434343',
								        textColor: '#EC1C24',
								        showCancelButton: false,
								        cancelButtonText: '',
								        dialogName : 'This is the dialog',
								        fontType: 'Arial,4,25',
								        processArgs: [_params]
								   };
								   plugins.busy.block(params);
									                 
											
								} else {
									globals.ma_utl_showWarningDialog('Non è stato selezionato alcun dipendente', 'Selezione dipendenti per invio giornaliera');
									return;
								}
							}
							else
							{
								var msgCert = '<html>Sono presenti nuovi dati inviati dallo studio e non ancora acquisiti per la ditta.<br/>' +
                                              'Procedere con l\'acquisizione prima di proseguire.</html>';
								globals.ma_utl_showWarningDialog(msgCert,'Verifica presenza di dati da acquisire');
								return;
							}
						}
						else
						{
							globals.ma_utl_showWarningDialog(ctrlRes['returnMessage'],'Invio giornaliera');
							return;
						}
					}
				}			    
			}
			// acquisizioni precedenti non ok, verificare se necessario chiedere scarico timbrature
			else {
				
				if (response['message'] == '') {
					globals.ma_utl_showWarningDialog('Completare le importazioni dei periodi precedenti prima di proseguire', 'Contollo acquisizione giornaliere');
					return;
				}
				else
				{
				//se c'è il blocco viene mostrato il messaggio con la domanda circa l'acquisizione delle timbrature del periodo
				//solo nel caso con timbrature
				if(globals.haOrologio(_idditta))
				{
				    var importaTimbrResponse = globals.ma_utl_showYesNoQuestion(globals.getHtmlString(response['message']), 'Controllo acquisizioni per invio giornaliera');
				    if (importaTimbrResponse)
					    globals.scaricaTimbratureDaFtp(_params);
				    else
					    return;
				}else
				 globals.ma_utl_showWarningDialog('Non sono state scaricare le giornaliere dei periodi precedenti', 'Controllo acquisizioni per invio giornaliera');
			  }
			}
		} else
			globals.ma_utl_showWarningDialog('Non sono state scaricare le giornaliere dei periodi precedenti', 'Controllo acquisizioni per invio giornaliera');

	} else
		globals.ma_utl_showErrorDialog('Errore nel contattare il server, riprovare', 'Chiusura mese cliente');
		
}

/**
 * @param _params
 *
 * @properties={typeid:24,uuid:"25A5EE5D-DF3E-43F3-BD8C-64550CFBB2E4"}
 */
function process_invia_giornaliera_pannello(_params)
{	
	try
	{
		if(scopes.giornaliera.esisteGiornalieraInviata(_params.idditta,_params.periodo,_params.gruppoinst,_params.gruppolav))
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('La giornaliera risulta già inviata e non ancora acquisita dallo Studio. <br/>Contattare il servizio di assistenza per ulteriori informazioni.','Invia giornaliera');	
			return;
		}
		globals.inviaGiornalieraSuFtp(_params);
	}
	catch(ex)
	{
		var msg = 'Metodo process_invia_giornaliera_pannello : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1CE2C622-394D-45B2-9BCF-B00CCBB97FD6"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
}
