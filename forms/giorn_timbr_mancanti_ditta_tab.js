/**
 * @properties={typeid:24,uuid:"1AB5F461-ED14-4FCA-BC02-13799739F071"}
 */
function getButtonObject()
{
	var btnObj = _super.getButtonObject();

	btnObj.btn_new = { enabled: false };
	btnObj.btn_edit = { enabled: false };
	btnObj.btn_delete = { enabled: false };
	btnObj.btn_duplicate = { enabled: false };
	return btnObj;
}


