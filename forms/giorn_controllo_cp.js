/**
 * @param {Object}
 * 
 * @properties={typeid:35,uuid:"14476E09-8709-4B64-9586-A6A64A4BB656",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"9744D1DD-8A25-4E2E-BBAE-243FCE7BAA83",variableType:-4}
 */
var _daControlliPreliminari = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E6C609E3-A548-48C7-86AB-082E42D3A18A"}
 */
function annullaConfermaEventi(event) {
	
   globals.svy_nav_dc_setStatus('browse','giorn_controllo_cp',true);	
   globals.svy_mod_closeForm(event);
   
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"98C3AD9D-99E7-4FF5-BE69-807C187FBCCB"}
 */
function confermaEventiChiusura(event) {
	
	var frmCE = forms['giorn_controllo_cp_eventi_tbl'];
	var sizeCE = databaseManager.getFoundSetCount(frmCE.foundset);
	var arrCE = frmCE.ottieniArrCE();
	
	var frmIS = forms['giorn_controllo_cp_infostat_tbl'];
	var sizeIS = databaseManager.getFoundSetCount(frmIS.foundset);
	var arrIS = frmIS.ottieniArrIS();
	
	var bloccaChiusura = ((sizeCE == arrCE.length) && (sizeIS == arrIS.length)) ? false : true;
	
	var params = {
		
		          idditta : forms.giorn_header.idditta,
		          periodo : globals.getPeriodo(),
		          idgruppoinstallazione	: globals.getGruppoInstallazione(),
		          codgruppogestione  	: globals.getGruppoLavoratori(),
		          iddipendenti			: [], 
		          ArrayDipCE : arrCE,
				  ArrayDipIS : arrIS,
				  daControlliPreliminari : _daControlliPreliminari,
				  tipoConnessione : globals._tipoConnessione
				  
	             }
	
	globals.svy_nav_dc_setStatus('browse','giorn_controllo_cp',true);
	globals.svy_mod_closeForm(event);
	
	globals.confermaEventi(params,bloccaChiusura);
	
}
