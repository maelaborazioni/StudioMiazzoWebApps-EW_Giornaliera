/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"62DAD8A7-F9A6-4E02-B72B-37D08DAF033B",variableType:-4}
 */
var checkStart = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C81678D7-CBD3-4338-ABA2-38CE6302C1B6"}
 */
function checkAll(event) {
	
	checkStart = !checkStart;
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset);
	fsUpdater.setColumn('checked', checkStart);
	fsUpdater.performUpdate();
	
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
 * @properties={typeid:24,uuid:"1873FBFD-8ACD-4AB7-9A16-0CCB803270D8"}
 */
function onSort(dataProviderID, asc, event)
{
	controller.sort(dataProviderID + (asc ? ' asc' : ' desc'), false)
}
