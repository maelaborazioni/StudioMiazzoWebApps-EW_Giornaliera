/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"AA517571-3A20-4C51-A5F9-7691E22BFE13",variableType:4}
 */
var checkStart = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"79794410-8859-4A58-8333-37BBF02B6E48"}
 */
function selectAll(event)
{
	if(checkStart)
		checkStart = 0;
	else
		checkStart = 1;
	
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset);
	    fsUpdater.setColumn('selected',checkStart);
	    fsUpdater.performUpdate();
}
