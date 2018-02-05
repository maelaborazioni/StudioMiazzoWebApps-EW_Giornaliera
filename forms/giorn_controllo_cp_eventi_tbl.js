/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"C362032A-46F7-450E-86FE-D0C6281FB1F4",variableType:-4}
 */
var isAllSelected = false;

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"DEF3D395-5BDD-4C8C-BE0B-9B82BCD156E0"}
 */
function onRecordSelection(_event, _form) {
	
	_super.onRecordSelection(_event, _form);
	
	return;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2BEA5E2D-1ABE-4E15-BEFA-3D6831D169AC"}
 */
function selezionaConfermaEvento(event) {
	// TODO Auto-generated method stub
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"889DF983-75BB-4AAA-9118-C66ECD5B4315"}
 */
function selezionaTuttoConfermaEventi(event) {
	// TODO Auto-generated method stub
	var numEventi = databaseManager.getFoundSetCount(forms['giorn_controllo_cp_conferma_eventi_tbl_temp'].foundset);
	for (var i=1; i<= numEventi; i++)
	{
		if(!isAllSelected)
		{
			foundset.setSelectedIndex(i)['confermato'] = 1;
			isAllSelected = true;
		}
		else
		{
			foundset.setSelectedIndex(i)['confermato'] = 0;
			isAllSelected = false;
		}
		
	}
}

/**
 * Costruisce e ritorna l'array per la parte di conferma eventi
 * 
 * @return {Array}
 * 
 * @properties={typeid:24,uuid:"3C6684BD-F0E4-463B-A899-A39C690018F5"}
 */
function ottieniArrCE()
{
	var arrDipCE = [];
	var frmName = 'giorn_controllo_cp_eventi_tbl_temp';
	if (solutionModel.getForm(frmName) != null) 
	{
		var fs = forms[frmName].foundset;
		var numDipCE = databaseManager.getFoundSetCount(fs);
		for (var i = 1; i <= numDipCE; i++) {
			fs.setSelectedIndex(i);
			var currDipCE = [fs['idgiornalieraeventi'], fs['idevento'], fs['proprieta'], fs['confermato']];
			arrDipCE.push(currDipCE);
		}
	}
	return arrDipCE;
}
