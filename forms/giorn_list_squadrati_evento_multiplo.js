/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9EEC577B-7087-4BCC-8514-3D87736104ED"}
 */
function onActionConfermaEventoMultiplo(event)
{
	// TODO Aggiunge l'evento con la proprietà e le ore indicate per i dipendenti della selezione corrente 
	// nei giorni selezionati per ciascuno di essi
		
	//recupero informazioni nuovo evento da aggiungere
	var frmNuovoEv = forms.giorn_operazionemultipla_aggiungievento;
	
	if(frmNuovoEv._idevento && (frmNuovoEv._ore || frmNuovoEv.vCoperturaOrarioTeorico))
	{
		// recupero informazioni sui giorni e dipendenti
		var frmOpt = forms.giorn_list_squadrati_ditta;
		var periodo = frmOpt.annoRif * 100 + frmOpt.meseRif;
		
		// creazione oggetto per raccolta dati 
		var objDipsParams = {
			                 lavoratori_giorni : [],
							 idevento : frmNuovoEv._idevento,
							 ore : frmNuovoEv._ore != null ? frmNuovoEv._ore : 0,
							 proprieta : frmNuovoEv._oldProprieta,
							 importo : frmNuovoEv._importo,
							 copertura_teorico : frmNuovoEv.vCoperturaOrarioTeorico
				            };
		
		for(var l = 0; l < frmOpt.arrDipSquadrati.length; l++)
		{
			var arrGiorniSel = [];
			var frmDipSquadrato = forms['giorn_list_squadrati_dipendente_' + frmOpt.arrDipSquadrati[l]];
			/** @type{RuntimeTabPanel}*/
			var tab = frmDipSquadrato.elements['tab_squadrati_dip'];
			var frmSquadratureDip = forms[tab.getTabFormNameAt(1)];
			for(var sq = 1; sq <= frmSquadratureDip.foundset.getSize(); sq++)
			{
				if(frmSquadratureDip.foundset.getRecord(sq)['checked'])
					arrGiorniSel.push(globals.getGiornoDaIdGiornaliera(frmSquadratureDip.foundset.getRecord(sq)['idgiornaliera']).getDate());
			}
			
			if(arrGiorniSel.length > 0)
			   objDipsParams.lavoratori_giorni.push({
				                                     idlavoratore : frmOpt.arrDipSquadrati[l],
								                     giorni_selezionati : arrGiorniSel
							                        });
			
		}
		
		var retVal;
		for(var lg = 0; lg < objDipsParams.lavoratori_giorni.length; lg++)
		{
			retVal = false;
			var objDipParams = objDipsParams.lavoratori_giorni[lg];
			var evParams = globals.inizializzaParametriEvento(globals.getDitta(objDipParams.idlavoratore)
				                                              ,periodo
															  ,objDipParams.giorni_selezionati
															  ,globals.TipoGiornaliera.NORMALE
															  ,globals.TipoConnessione.CLIENTE
															  ,[objDipParams.idlavoratore]
															  ,objDipsParams.idevento
															  ,objDipsParams.proprieta
															  ,objDipsParams.ore
															  ,objDipsParams.importo
															  ,objDipsParams.idevento
															  ,objDipsParams.proprieta
															  ,objDipsParams.copertura_teorico);
			retVal = globals.salvaEvento(evParams);
			if(retVal)
			{
				globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
				globals.aggiornaSquadratureGiornalieraDipendente(objDipParams.idlavoratore,
					                                             globals.getAnnoDaPeriodo(periodo),
																 globals.getMeseDaPeriodo(periodo));
			}
			else
				globals.ma_utl_showWarningDialog('Errore durante il salvataggio dell\'evento','Si è verificato un errore durante l\'inserimento');
		}
				
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
	else
		globals.ma_utl_showWarningDialog('Compilare in maniera corretta i campi per l\'evento multiplo','Aggiungi evento multiplo');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"11DBB720-3176-4773-9F6E-473F0535D64C"}
 */
function onActionCancellaEventoMultiplo(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"45F5E09D-D51B-4C49-A23C-0F8A87C2447D"}
 */
function onHide(event) {
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	_super.onHide(event);
}