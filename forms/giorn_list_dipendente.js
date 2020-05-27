/**
 * Mostra il menu contestuale in giornaliera
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"1D0A6E79-E4C6-40A7-87BE-201574768832"}
 */
function apriPopupVistaMensileDipendente(_event)
{	
	var _source = _event.getSource();
	var _popUpMenu = plugins.window.createPopupMenu();
	var _disabled = false; // TODO globals.isGiornoConteggiato(foundset.iddip,foundset.giorno);
	
	if (globals.ma_utl_hasKey(globals.Key.EVENTI_DIPENDENTE)) 
	{
		_event.data = { 
			iddipendente : foundset.getSelectedRecord()['idlavoratore'],//forms.giorn_cart_header.idlavoratore,
			giorno : foundset.getSelectedRecord()['giorno'],
			periodo : foundset.getSelectedRecord()['giorno'].getFullYear() * 100 + foundset.getSelectedRecord()['giorno'].getMonth() + 1,
			giorniselezionati : [forms['giorn_list_dipendente_temp'].foundset.getSelectedIndex() - globals.offsetGg],
			idgiornaliera : foundset.getSelectedRecord()['idgiornaliera'],
			tipogiornaliera : globals.TipoGiornaliera.NORMALE
		}
		
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

		_popUpMenu.addSeparator();

		// abilitazione opzioni per commesse
		if (globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE)) {
			var _popUpCommesse = _popUpMenu.addMenu('Gestione commesse');
			var _item13 = _popUpCommesse.addMenuItem('Vai alla gestione delle ore in commessa', apriGestioneOreCommesseDaMenu);
			_item13.methodArguments = [_event];
			//		var _item14 = _popUpCommesse.addMenuItem('Aggiungi ore commessa',aggiungiOreCommessa);
			//		_item14.methodArguments = [_event];
			//		var _item14_1 = _popUpCommesse.addMenuItem('Importa tracciato ore su commessa',globals.importaTracciatoOreCommessa);
			//		_item14_1.methodArguments = [_event];

			if (globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA)) {
				var _menu15 = _popUpCommesse.addMenu('Gestione autorizzazione ore')
				var _item15_1 = _menu15.addMenuItem('Dipendente selezionato', globals.gestioneAutorizzazioneCommesse);
				_item15_1.methodArguments = [_event,
				new Date(globals.getAnno(), globals.getMese() - 1, 1),
				new Date(globals.getAnno(), globals.getMese() - 1, globals.getTotGiorniMese(globals.getMese(), globals.getAnno())),
				forms.giorn_header.idlavoratore];
				var _item15_2 = _menu15.addMenuItem('Tutti i dipendenti', globals.gestioneAutorizzazioneCommesse);
				_item15_2.methodArguments = [_event,
				new Date(globals.getAnno(), globals.getMese() - 1, 1),
				new Date(globals.getAnno(), globals.getMese() - 1, globals.getTotGiorniMese(globals.getMese(), globals.getAnno())),
				globals.foundsetToArray(forms.giorn_cart_header.foundset, 'idlavoratore')];

			}

			var _item16 = _popUpCommesse.addMenuItem('Stampa report incongruenze commesse', stampaReportIncongruenzeCommesseDaGiornaliera);
			_item16.methodArguments = [_event,
			forms.giorn_header.idditta,
			globals.foundsetToArray(forms.giorn_cart_header.foundset, 'idlavoratore'),
			new Date(globals.getAnno(), globals.getMese() - 1, 1),
			new Date(globals.getAnno(), globals.getMese() - 1, globals.getTotGiorniMese(globals.getMese(), globals.getAnno()))];
			_popUpCommesse.addSeparator();
		}
	}
		
	if(_source != null)
		_popUpMenu.show(_source)
}