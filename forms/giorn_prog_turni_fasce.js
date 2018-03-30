/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"4FD6761D-A10C-41F5-AE4E-28B1C90AB3CB",variableType:-4}
 */
var arrBlocchiSquadrati = [];

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"D76CF44F-2066-46ED-A6E3-D33B300471F2",variableType:-4}
 */
var isEditing = false;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"A852B92E-F000-47B7-BAE7-DEB486003B44",variableType:-4}
 */
var isFromSituazioneTurni = false;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"6A030FD4-3321-4699-9823-DED1D37324BE",variableType:8}
 */
var vIdLavoratore = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"F0283522-0F47-4476-AF28-28776A3B89F4",variableType:8}
 */
var vMese = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"22E8D818-95E8-4A34-83E4-1E3A5D6A0983",variableType:8}
 */
var vAnno = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AC413CBC-F2D8-4890-845D-DD56469F1620"}
 */
function annullaFasceProg(event) 
{
	arrBlocchiSquadrati = [];
	isEditing = false;
	elements.btn_salva.enabled = false;
	elements.btn_annulla.enabled = false;
	
	globals.preparaProgrammazioneTurni(vIdLavoratore || globals.getIdLavoratoreProgTurni(),
		                               vAnno || globals.getAnno(),
									   vMese || globals.getMese(),
									   globals.TipoGiornaliera.NORMALE);
	// aggiornamento dati foundset temporaneo
	var formName = 'giorn_turni_temp';
    var fs = forms[formName].foundset;
    var maxBlocchi = fs.getRecord(fs.getSize())['blocco'];
    for(var b = 1; b <= maxBlocchi; b++)
        // update visualizzazione
	    globals.verificaProgrammazioneTurniOrePeriodo(fs.duplicateFoundSet(),b);
	
}


/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B7367F77-53AE-4F31-80EC-54E7983B7087"}
 * @AllowToRunInFind
 */
function onShow(firstShow, event)
{
	_super.onShowForm(firstShow,event);
	
	if(firstShow)
		elements.btn_salva.enabled = false;
	
	elements.tab_prog_turni_turni.readOnly = false;
			
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2A351BCA-49D0-4308-A28F-8DF3157C68A7"}
 */
function onHide(event) 
{
	_super.onHide(event);
	// eventuale ridisegno della giornaliera correntemente visualizzata 
	var selTabName = forms.svy_nav_fr_openTabs.vTabObjects[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]];
    if(selTabName && utils.stringLeft(selTabName.program,16) == 'LEAF_Giornaliera')
       forms.giorn_header.preparaGiornaliera();
        
    return true;
}
