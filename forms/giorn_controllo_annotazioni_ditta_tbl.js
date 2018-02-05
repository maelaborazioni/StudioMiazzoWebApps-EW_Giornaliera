/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"D630192D-AE37-4131-881B-B7C5FE4CB9D1",variableType:-4}
 */
var isAllSelected = false;

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"C5F83F5B-213B-4DE8-B09C-B66C8561844B"}
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
 * @properties={typeid:24,uuid:"DF8051CC-DFB0-47D8-9E96-3028F826667F"}
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
 * @properties={typeid:24,uuid:"A22E333D-2CC3-42E6-B877-83BDCE59B272"}
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
 * @properties={typeid:24,uuid:"B47D257D-9823-4B99-AA36-4E888DB53506"}
 */
function ottieniArrCE()
{
	var arrDipCE = [];
	var fs = forms['giorn_controllo_cp_eventi_tbl_temp'].foundset;
	var numDipCE = databaseManager.getFoundSetCount(fs);
	for(var i=1; i<=numDipCE; i++)
	{
		fs.setSelectedIndex(i);
		var currDipCE = [fs['idgiornalieraeventi'],fs['idevento'],fs['proprieta'],fs['confermato']];
		arrDipCE.push(currDipCE);
	}
	
	return arrDipCE;
}
