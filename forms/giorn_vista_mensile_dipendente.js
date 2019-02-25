
/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 * @override
 *
 * @properties={typeid:24,uuid:"7A2E7109-E373-4B5C-8DA1-2B54B499E527"}
 */
function onShow(firstShow, event) 
{
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].selected_tab = 2;
	
	vSoloDipendente = true;
	
	_super.onShow(firstShow, event)
}
