/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"B57EEB86-D4C2-443C-AF04-70AD2F7A8BE5",variableType:-4}
 */
var isAllSelected = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7245A6D0-132C-4357-BEA2-71833AE9FA24"}
 */
function selezionaConfermaInfoStat(event) {
	// TODO Auto-generated method stub
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"96D1BDB2-20F6-46C1-9200-56F41C04A5CD"}
 */
function selezionaTuttoConfermaInfoStat(event) {
	// TODO Auto-generated method stub
	var numEventi = databaseManager.getFoundSetCount(forms['giorn_controllo_cp_conferma_infostat_tbl_temp'].foundset);
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
 * Costruisce e ritorna l'array per la parte di infoormativi statistici
 * 
 * @return {Array}
 * 
 * @properties={typeid:24,uuid:"AD5C27C4-9D33-4B4F-B7FB-7066C10A48B7"}
 */
function ottieniArrIS()
{
	var arrDipIS = [];
	var frmName = 'giorn_controllo_cp_infostat_tbl_temp';
	if(solutionModel.getForm(frmName) != null)
	{
		var fs = forms[frmName].foundset;
		var numDipIS = databaseManager.getFoundSetCount(fs);
		for(var i=1; i<=numDipIS; i++)
		{
			fs.setSelectedIndex(i);
			var currDipIS = [fs['iddip'],fs['giorno'],fs['ideventoriclassificato'],fs['prog'],
			                 fs['um'],fs['max'],fs['fatto'],fs['annotazione'],fs['confermato']];
			arrDipIS.push(currDipIS);
		}	
	}
	
	return arrDipIS;
}
