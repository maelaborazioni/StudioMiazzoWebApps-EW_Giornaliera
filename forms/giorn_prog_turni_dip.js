/** 
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"C746CA5A-D6CA-40FC-BE6E-D58DE87C87BC"}
 */
function onRecordSelection(_event, _form) 
{
	// se si è modificato qualcosa nella prgrammazione di un dipendente non è possibile spostarsi
	// su di un altro prima di aver confermato od annullato le modifiche
	if(forms.giorn_prog_turni_fasce.isEditing)
	{
		globals.ma_utl_showInfoDialog('Confermare od annullare la programmazione fasce attuale prima di passare <br/> ad un altro dipendente','Programmazione fasce');
	    return;
	}
	
	// impostazione dati
	_super.onRecordSelection(_event, _form);
	
	if(idlavoratore)
	{
		globals.setIdLavoratoreProgTurni(idlavoratore);
		
		forms.giorn_prog_turni_fasce.elements.btn_salva.enabled = false;
		
		// update visualizzazione
		globals.preparaProgrammazioneTurni(idlavoratore,
			                               globals.getAnno() ? globals.getAnno() : forms.giorn_selezione_prog_turni._anno,
										   globals.getMese() ? globals.getMese() : forms.giorn_selezione_prog_turni._mese,
										   globals.TipoGiornaliera.NORMALE);
	}
}

