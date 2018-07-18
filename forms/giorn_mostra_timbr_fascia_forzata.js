/**
 * Apre la finestra per la gestione della fascia forzata
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"ACE3C6CD-396D-470C-8B9E-176A8BAC29CD"}
 */
function impostaFasciaForzata(event) {
	
	var _frmFF = forms.giorn_mostra_timbr_fascia_forzata_dtl;
	    _frmFF._codiceFascia = codicefascia === null ? '' : codicefascia;
	    _frmFF._descrFascia = descrizione === null ? '' : descrizione;
        _frmFF._arrGiorni = forms['giorn_selezione_multipla_clone'].getGiorniSelezionati(false);
        
	globals.ma_utl_setStatus(globals.Status.EDIT,_frmFF.controller.getName());
    globals.ma_utl_showFormInDialog(_frmFF.controller.getName(),'Impostazione fascia forzata per i giorni : ' + _frmFF._arrGiorni);

}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EF3BD99D-E29B-431E-8715-57683E85388E"}
 * @AllowToRunInFind
 */
function eliminaFasciaForzata(event) {
	
	databaseManager.startTransaction();
    
	// foundset generale della giornaliera
	/** @type {JSFoundSet<db:/ma_presenze/e2giornaliera>} */
	var giornalieraFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA);
	// foundset di giorn_timbr sul quale effettuare il search
	var fs = forms['giorn_timbr_temp'].foundset;
	if(giornalieraFs && giornalieraFs.find())
	{
		giornalieraFs.idgiornaliera = fs['idgiornaliera'];
		giornalieraFs.search();
	}
    
	var idLav = giornalieraFs.iddip;
	
	if(giornalieraFs.idfasciaorariaforzata != null)
	   giornalieraFs.idfasciaorariaforzata = null;
	else
	{
	   globals.ma_utl_showWarningDialog('Nessuna fascia forzata da eliminare','Gestione fascia forzata');
	   databaseManager.rollbackTransaction();
	   return;
	}      
	if(databaseManager.commitTransaction())
	{
	   forms.giorn_header.preparaGiornaliera();
	   globals.verificaDipendentiFiltrati(idLav);
	}
	else
	   globals.ma_utl_showErrorDialog('Errore durante la modifica della fascia forzata, si prega di riprovare','Errore')
	   
}

/**
 * @AllowToRunInFind
 * 
 * Visualizza le fasce orarie della ditta per consultazione
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D60E6D76-2F65-4C8F-88E8-8956038D38E5"}
 */
function apriVisualizzaFasceOrarieGiorno(event) 
{
	var _fs = forms.orario_fasce_orarie_tab.foundset;
	if(_fs.find())
	{		
		_fs.idditta = forms.giorn_header.idditta;
		_fs.search();
		_fs.sort('codicefascia asc');
		
	}
		
	globals.ma_utl_showFormInDialog(forms.orario_fasce_orarie_tab.controller.getName(), 'Fasce orarie', _fs);
}
