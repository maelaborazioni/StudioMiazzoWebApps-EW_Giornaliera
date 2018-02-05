/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"C28DF352-B661-456F-B83A-81B5A49A2E31"}
 */
function preparaChiusuraMese(event) {

	var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta,
		                                                globals.getPeriodo(),
		                                                globals.getGruppoInstallazione(),
		                                                globals.getGruppoLavoratori(),
														globals._tipoConnessione
	                                                   );
	
	forms.giorn_controllo_cp._daControlliPreliminari = false;
	forms.giorn_controllo_annotazioni_ditta._daControlliPreliminari = false;
	
	globals.chiusuraMeseCliente(params);
    
}