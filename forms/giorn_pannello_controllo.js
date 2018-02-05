/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A8923C7C-21FD-4D18-809A-DD9A21A8CE0A",variableType:8}
 */
var _anno;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"FB293375-1D72-44DD-A952-56928FCB5801"}
 */
var _codice = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"87CDC6C2-4651-4AC8-B829-EB45E10032C5"}
 */
var _condizione = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F57A2078-9C5B-45B7-8762-814D35C50DE9",variableType:8}
 */
var _mese;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B1F5B2A7-E3B2-4418-92EE-619620E06DC7",variableType:4}
 */
var _soloinstallate = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5AE27AE3-2758-4069-9DCF-EAA6A1ACDCB4"}
 */
function ricalcolaPannelloDiControllo(event) {
	
   var _annoFin
   var _meseFin
   
   if(_mese > 1){
	   _meseFin = _mese - 1
	   _annoFin = _anno
   }else{
	   _meseFin = 1
	   _annoFin = _anno - 1
   }
   
//   if(elements.btn_attiva_filtra_periodo.enabled)
//   {
//	   elements.btn_attiva_filtra_periodo.enabled = false;
//	   elements.btn_disattiva_filtra_periodo.enabled = true;
//   }
//   else
//   {
//	   elements.btn_attiva_filtra_periodo.enabled = true;
//	   elements.btn_disattiva_filtra_periodo.enabled = false;
//   }
   
   globals.costruisciPannelloDiControllo(_anno * 100 + _mese,0,201111,_annoFin * 100 + _meseFin)
	
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"39A7961A-DCA1-4209-8219-F6F3839F91D2"}
 */
function onShow(firstShow, event) {
	
    elements.cmb_mese.readOnly = false;
	elements.cmb_anno.readOnly = false;
	elements.chk_solo_installate.readOnly = false;
	elements.fld_codice.readOnly = false;

}
