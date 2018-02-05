/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D21EB644-CF9C-45B3-A7D0-EE64CD0935E1"}
 */
var vPeriodoStr = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"49F9C4D9-F4AF-4C7D-B568-C6B6A186A85B"}
 */
var vSearch = '';

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"C00A1854-96D2-4748-83B2-59B6697A78E9"}
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	vPeriodoStr = globals.getNomeMese(globals.getMese()) + ' ' + globals.getAnno();
	elements.fld_search.readOnly = false;
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EE580542-BBE6-49E0-8ABA-BED8DADF6CDD"}
 * @AllowToRunInFind
 */
function onActionFilter(event) 
{
	if(vSearch)
	{
		if(foundset.find())
		{
			foundset.lavoratori_to_persone.nominativo = '%' + vSearch + '%';
			foundset.newRecord();
			foundset.lavoratori_to_lavoratori_personeesterne.nominativo = '%' + vSearch + '%';
			foundset.search();
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7B7BDC0D-91CA-4038-883A-4AB8CC370D78"}
 */
function onActionUnfilter(event) 
{
	vSearch = '';
	foundset.loadAllRecords();
}
