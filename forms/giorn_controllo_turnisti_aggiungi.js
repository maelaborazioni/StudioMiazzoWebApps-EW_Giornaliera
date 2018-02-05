/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"E18381B2-68BE-49BD-8BE6-1807A1A6D218",variableType:93}
 */
var _decorrenza = null;

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"887ADE60-9FE3-4F5D-8A1D-13831C0BF5F3",variableType:-4}
 */
var _arrTurnisti = [];

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"28C38959-5713-4031-AA6B-3D98DD68895B",variableType:4}
 */
var _idTipoTurnista = -1;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"31F4403F-B585-4215-9F05-877899E1662F",variableType:8}
 */
var _codTipoTurnista = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"5D6CB66B-E93C-4F21-8CC0-AC4CF2D4D068"}
 */
var _descTipoTurnista = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6D9CC9E6-9FB7-4AE5-9250-1F81A57FA02E"}
 */
function confermaNuovaDecorrenzaTurnisti(event) {
	// TODO crea la nuova decorrenza turnista per i dipendenti selezionati e 
	//      aggiorna la situazione in giornaliera
}

/**
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"37BFCA64-CCEF-45A9-BB72-5AA6204BA1CB"}
 */
function AggiornaTipoTurnista(rec)
{
	_idTipoTurnista = rec['iddittaturno'];
	_codTipoTurnista = rec['codice'];
	_descTipoTurnista = rec['descrizione'];
}