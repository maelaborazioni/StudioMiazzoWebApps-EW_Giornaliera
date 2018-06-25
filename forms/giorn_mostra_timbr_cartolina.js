/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"922A5010-7D8E-470D-8BC7-07C854EB226C"}
 */
function onShow(firstShow, event)
{
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab = 1;
	show_causalized = show_clockings = 1;
	show_events = 0;
}

