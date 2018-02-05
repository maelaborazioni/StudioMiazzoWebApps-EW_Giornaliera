/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5C0414E9-3624-4585-A5CA-A8C2324022D7"}
 */
function checkAll(event) 
{
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset);
		fsUpdater.setColumn('checked', 1);
		fsUpdater.performUpdate();
}
