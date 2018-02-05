/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"FB55EEFA-A636-45FF-ABEE-D4FC9D63B6FB",variableType:-4}
 */
var checkStart = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CD002081-B837-4CFE-A885-2B272BBCE565"}
 */
function checkAll(event) 
{
	checkStart = !checkStart;
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset);
		fsUpdater.setColumn('checked', checkStart);
		fsUpdater.performUpdate();
		onSort('nominativo',true,event);	
}

/**
 * Perform sort.
 *
 * @param {String} dataProviderID element data provider
 * @param {Boolean} asc sort ascending [true] or descending [false]
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0CBAD102-532E-49F5-A62F-7670AC2B8E64"}
 */
function onSort(dataProviderID, asc, event) {
	// TODO Auto-generated method stub
	controller.sort(dataProviderID + (asc ? ' asc' : ' desc'), false)
}
