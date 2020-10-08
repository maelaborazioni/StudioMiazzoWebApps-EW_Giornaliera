/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7711C6BE-B53A-4DD5-AA36-FA7E958AE712"}
 */
function onShowForm(firstShow, event)
{
	var frmOpt = forms.giorn_operazionemultipla_aggiungievento;
	
	frmOpt._oldProprieta = null;
	frmOpt._idevento = null;
	frmOpt._codevento = '';
	frmOpt._idpropcl = null;
	frmOpt._codprop = '';
	frmOpt._descevento = '';
	frmOpt._descprop = '';
	
	frmOpt.elements.fld_proprieta.enabled = false;
	
	if(globals._arrIdEvSelezionabili == null)
		   globals.FiltraEventiSelezionabili(forms.giorn_header.idlavoratore,
			                                 globals.getAnno() * 100 + globals.getMese(),
			                                 frmOpt._tipoGiornaliera || forms.giorn_vista_mensile._tipoGiornaliera);
	// Automatically put the event form in edit mode
	if(controller.readOnly)
		controller.readOnly = false;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,frmOpt.controller.getName());
	
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"999C607B-70ED-408C-BB6B-36D5C791B3D6"}
 */
function onHide(event)
{
	if(_super.onHide(event))
	{
		// Put the event form back in browse mode
//		globals.svy_nav_dc_setStatus('browse', elements.evento_tabless.getTabFormNameAt(1), true);
		return true;
	}
	
	return false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"841EEEC0-408F-4652-AEEF-4BA088A51BFB"}
 */
function salvaEventoMultiplo(event)
{
	if(!forms[elements.evento_tabless.getTabFormNameAt(1)].isFilled())
	{
		globals.ma_utl_showWarningDialog('Compilare i campi relativi all\'evento', 'i18n:hr.msg.attention');
		return;
	}
	
	var frmOpt = forms.giorn_operazionemultipla_aggiungievento;
	if(frmOpt._ore == null && frmOpt.vCoperturaOrarioTeorico == 0)
	{
		globals.ma_utl_showWarningDialog('Selezionare una opzione tra le ore dell\'evento o la copertura teorica', 'i18n:hr.msg.attention');
		return;
	}
	
	// controllo informativi statistici per i casi con controllo su ore
	/** @type {Array<Number>} */
	var giorniSelezionati = forms[elements.giorni_tabless.getTabFormNameAt(1)].getSelectedElements(false,true);
	/** @type {Array<Number>} */
	var dipendentiSelezionati = forms[elements.dipendenti_tabless.getTabFormNameAt(1)].getSelectedElements(false,true);
	
	for(var dip = 0; dip < dipendentiSelezionati.length; dip++ )
	{
		/** @type {{ ReturnValue: Boolean, Message: String }} */
	    var response = globals.controllaInformativiStatistici(dipendentiSelezionati[dip], 
	    	                                                  globals.getPeriodo(),
															  giorniSelezionati,
															  frmOpt._idevento,
															  frmOpt._ore,
															  frmOpt._codprop);
		
	    //se ci sono blocchi su informativi statistici
		if (response && response.ReturnValue && response.Message && response.Message != '')
		{
			globals.ma_utl_showWarningDialog(globals.getNominativo(dipendentiSelezionati[dip]) + ':' + response.Message, 'Controllo informativi statistici');
	        return;
		}
	}	
	
	vOperationArgs = globals.inizializzaParametriEvento(forms.giorn_header.idditta,
		                                                globals.getPeriodo(),
														[],
														forms.giorn_operazionemultipla_aggiungievento.vPortaInBudget == 1 ? globals.TipoGiornaliera.BUDGET : forms.giorn_vista_mensile._tipoGiornaliera,
														globals._tipoConnessione,
														[],
														frmOpt._idevento,
														frmOpt._oldProprieta,
														frmOpt.vCoperturaOrarioTeorico == 1 ? 0 : frmOpt._ore,
														frmOpt._importo,
														frmOpt._oldIdEvento,
														frmOpt._oldProprieta,
														frmOpt.vCoperturaOrarioTeorico,
														true); // parametro ricalcolaProprieta esclusivo per evento multiplo 
//	vOperationArgs = [forms[elements.evento_tabless.getTabFormNameAt(1)].getParametriEvento()];
	startOperation(event);
}
