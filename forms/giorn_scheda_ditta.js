/**
 * @type {number}
 *
 * @properties={typeid:35,uuid:"55A68D43-4214-4CEE-AF08-B4C8135DC3DA",variableType:-4}
 */
var _idditta

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"915092AF-D768-4324-9763-D8A8872E0CC4",variableType:8}
 */
var _anno

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"AE89C55C-3797-4189-96A2-A22FD0585937",variableType:8}
 */
var _mese

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3ADEDC53-F315-43CB-BF52-D91797B50FCA",variableType:8}
 */
var _gruppoinst

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3DDB781F-3F0C-4B1A-863F-CEF7F1393F76"}
 */
var _gruppolav

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EF615CCC-551A-4011-9B55-7036D2AA6F71"}
 */
function passaAllaGiornaliera(event) 
{	
	application.getWindow('win_scheda_interna_ditta').hide();
	
	// Apri il program della giornaliera che sarà disabilitata 
	//TODO gestione filtro dipendenti selezionati in entrata giornaliera
	globals.apriGiornaliera(event, _idditta, _anno, _mese, _anno, _mese, _gruppoinst,_gruppolav);	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8FC1E3BA-8F19-47A8-A5B1-2F842B6CF558"}
 */
function modificaScheda(event) {
	
   databaseManager.setAutoSave(false)
   globals.svy_nav_dc_setStatus('edit','giorn_scheda_ditta',true,'LEAF_Giornaliera')
   if(foundset.getSize() == 0){
	   
	   foundset.newRecord()
	   foundset.idditta = forms.giorn_selezione._idditta
	   foundset.ultimamodifica = null
	   foundset.ultimamodificada = ''
		   
   }
   
   abilitaPulsanti(true)
   databaseManager.startTransaction()
   
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {Object} abilita
 *
 * @properties={typeid:24,uuid:"9D7B6F85-2726-48B5-AF91-D39AFE029831"}
 */
function abilitaPulsanti(abilita){
	
	var _frmScheda = forms.giorn_scheda_ditta
	_frmScheda.elements.btn_entra_in_giornaliera.visible = !abilita
	_frmScheda.elements.btn_stampa_anagrafica_dip.visible = !abilita
	_frmScheda.elements.btn_modifica_scheda_ditta.visible = !abilita
	_frmScheda.elements.btn_modifica_scheda_ditta.enabled = !abilita
	_frmScheda.elements.btn_conferma_modifica_scheda.visible = abilita
	_frmScheda.elements.btn_conferma_modifica_scheda.enabled = abilita
	_frmScheda.elements.btn_annulla_modifica_scheda.visible = abilita
	_frmScheda.elements.btn_annulla_modifica_scheda.enabled = abilita
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"06FDFE6B-0F3D-49C7-A18D-DBE84E0E3EA3"}
 */
function confermaModifica(event) {
	
	foundset.ultimamodifica = new Date()
	foundset.ultimamodificada = 'UtenteServoy - ' + _to_sec_user$user_id.user_name
		
	if(!databaseManager.commitTransaction()){
		
		globals.svy_mod_dialogs_global_showErrorDialog('Errore durante la modifica della scheda','Modifica non riuscita, si prega di riprovare','OK')
        databaseManager.revertEditedRecords(foundset)	
		
	}
			
	globals.svy_nav_dc_setStatus('browse','giorn_scheda_ditta',true,'LEAF_Giornaliera')
	abilitaPulsanti(false)
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"90D1E7A8-B675-48B5-901A-937D7AAE4D8D"}
 */
function annullaModifica(event) {
	
   databaseManager.revertEditedRecords()
   globals.svy_nav_dc_setStatus('browse','giorn_scheda_ditta',true,'LEAF_Giornaliera')
   abilitaPulsanti(false)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"000D3B7A-1F51-4DEB-9B37-DBC291A5F1CE"}
 */
function stampaSchedaInternaDitta(event) {
	// TODO Verificare stampa scheda interna
//	globals.stampa_scheda_interna_ditta(_idditta)
}


