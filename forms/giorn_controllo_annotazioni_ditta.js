/**
 * @param {Object}
 * 
 * @properties={typeid:35,uuid:"EC17843E-AC24-457C-8849-C8CCD74EAA6D",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"96B3D18D-006E-45D5-9982-3750F2BB1986",variableType:-4}
 */
var _daControlliPreliminari = false;


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B5DFE6AF-FDCE-4C06-8EF2-E2F2D8349EC3"}
 */
function annullaConfermaAnnotazioni(event) {
	
   globals.svy_nav_dc_setStatus('browse','giorn_controllo_annotazioni_ditta',true);	
   globals.svy_mod_closeForm(event);
   
}