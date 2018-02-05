/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"841083F4-D776-4D31-A0BE-5C4F74100CC8",variableType:8}
 */
var vIdLavoratore;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0C7833A6-7337-4766-B1D2-D384EAB61AD3",variableType:8}
 */
var vPeriodo;

/**
 * @properties={typeid:35,uuid:"7C5E4782-C7E4-4DA1-B6A4-44597F775429",variableType:-4}
 */
var last_move_timestamp = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"493AAC5B-0E99-4360-909A-A725D60C2FAD",variableType:93}
 */
var last_click_timestamp = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3EEB6826-10CA-43FF-966F-F86DD7C66E18",variableType:4}
 */
var last_selected_recordindex = 0;

/**
 * @properties={typeid:35,uuid:"CE8AAAA3-EAA7-479D-B51D-D4CA95FCC34F",variableType:-4}
 */
var is_dirty = true;

/**
 * @properties={typeid:35,uuid:"D63E0A84-7C88-4B9B-856D-8C745119186D",variableType:-4}
 */
var cache = { };

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7B6ED145-8061-4653-8B01-853589FD08A0",variableType:-4}
 */
var update_selection = false;

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DE5BB8D4-72AD-4AB3-8E50-72B2A7335C6B"}
 */
function onLoad(event)
{
	_super.onLoad(event);
	addMultipleSelection();
}

/**
 * @properties={typeid:24,uuid:"59A145D3-1EA9-423F-B62F-770BE1F927EF"}
 */
function addMultipleSelection()
{
	var selectionForm = forms.giorn_selezione_multipla.getInstance();
	if(selectionForm == null)
	{
		globals.ma_utl_showWarningDialog('Errore durante il disegno della giornaliera, riprovare ed eventualmente contattare il servizio di assistenza');
		return;
	}
	elements.tab_selection.addTab(selectionForm.name);
}

/**
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"4D61016F-9796-4E26-B789-BBCDBB407F23"}
 */
function onShowForm(firstShow, event)
{
	_super.onShowForm(firstShow, event);
		
	var tabs = forms.svy_nav_fr_openTabs;
	/** @type {String} */
	var tab_name = tabs.vTabNames[tabs.vSelectedTab];
	/** @type {RuntimeForm<giorn_selezione_multipla>}*/
	var sel_form = getSelectionForm();
	if(!tabs.hasListener(tab_name, controller.getName()))
	{
		tabs.registerSaveTabPropertiesListener
		(
			tab_name,
			function(tabName)
			{
				var giorni_sel = sel_form && sel_form.getGiorniSelezionati() ? sel_form.getGiorniSelezionati() : [];
				var index_sel = (getMainForm() && getMainForm().foundset) ? getMainForm().foundset.getSelectedIndex() : 1; //TODO da errore?!?
				
				globals.ma_utl_setTabProperty(tabName, 'giorni_sel', giorni_sel);
				globals.ma_utl_setTabProperty(tabName, 'index_sel', index_sel);
				
				update_selection = true;
			},
			controller.getName()
		);
	}
	
	controller.readOnly = false;
	
	if(sel_form)
	{
		sel_form.controller.readOnly = false;
		sel_form.setVisibleForm(controller.getName());
	}
	
	if(update_selection)
	{
		update_selection = false;
		globals.aggiornaVisualizzazioneGiorniSelezionati(tab_name);
	}
}

/**
 * @properties={typeid:24,uuid:"DABB7A72-F4B1-45D4-90AC-E0DE53CE69E6"}
 */
function clearSelection()
{
	/** @type {RuntimeForm<giorn_selezione_multipla>}*/
	var frm = getSelectionForm();
	frm.clear();
}

/**
 * @return {RuntimeForm}
 * 
 * @properties={typeid:24,uuid:"AD1DF619-743E-4263-9BBE-EFD183625BE7"}
 */
function getSelectionForm()
{
	return forms[elements.tab_selection.getTabFormNameAt(1)];
}

/**
 * @return {RuntimeForm}
 * 
 * @properties={typeid:24,uuid:"99F7FE10-68FC-4F7A-A938-A5B8912FB515"}
 */
function getMainForm()
{
	return forms[elements.tab_main.getTabFormNameAt(1)];
}

/**
 * @AllowToRunInFind
 * 
 * @param {Number} 		idlavoratore
 * @param {Date}   		primogiorno
 * @param {Date}   		ultimogiorno
 * @param {JSFoundset}  [fs]
 * 
 * @return {JSFoundset}
 *
 * @properties={typeid:24,uuid:"E3BBDC3E-228C-4230-BE42-FFEADDA1AADA"}
 */
function filterMainFoundset(idlavoratore, primogiorno, ultimogiorno, fs)
{
	fs = fs || getMainForm().foundset;
	if (fs && fs.find())
	{
		fs['idlavoratore'] = idlavoratore;
		fs['giorno'] = '#' + utils.dateFormat(primogiorno, globals.ISO_DATEFORMAT) + '...' + utils.dateFormat(ultimogiorno, globals.ISO_DATEFORMAT) + '|' + globals.ISO_DATEFORMAT;
		fs.search();
	}
	
	return fs;
}

/**
 * Check whether data already exist for the provided parameters in the specified datasource
 * 
 * @param datasource
 * @param idlavoratore
 * @param periodo
 * 
 * @properties={typeid:24,uuid:"0A507182-AB1C-4A29-AFC7-CF0B3A88BF2A"}
 * @AllowToRunInFind
 */
function isCached(datasource, idlavoratore, periodo)
{
	if(!(datasource && idlavoratore && periodo))
		throw new Error('All arguments have to be non null');
	
	return cache[datasource + '_' + idlavoratore + '_' + periodo] || false;
}

/**
 * @param datasource
 * @param idlavoratore
 * @param periodo
 *
 * @properties={typeid:24,uuid:"0D313149-96E5-4E47-811C-AFF43BF393FA"}
 */
function setCached(datasource, idlavoratore, periodo)
{
	if(!(datasource && idlavoratore && periodo))
	{
		var args = '[' + ['datasource=' + datasource, 'idlavoratore=' + idlavoratore, 'periodo=' + periodo].join(', ') + ']';
		throw new Error('All arguments have to be non null: ' + args);
	}
	
	cache[datasource + '_' + idlavoratore + '_' + periodo] = true;
}

/**
 * @param datasource
 * @param idlavoratore
 * @param periodo
 *
 * @properties={typeid:24,uuid:"C1FBDD30-5419-49D7-A48B-CCCBE9013D17"}
 */
function unsetCached(datasource, idlavoratore, periodo)
{
	if(!(idlavoratore && periodo))
		throw new Error('All arguments have to be non null');
	if(datasource)
	   cache[datasource + '_' + idlavoratore + '_' + periodo] = false;
}

/**
 * @properties={typeid:24,uuid:"F7D2F53E-A361-4118-A294-7E3475BF233B"}
 */
function markAsDirty(lavoratori, periodo)
{
	is_dirty = true;
	
	lavoratori = lavoratori || [vIdLavoratore];
	for(var l = lavoratori.length - 1; l >= 0; l--)
		unsetCached(getMainForm().controller.getDataSource(), lavoratori[l], periodo || vPeriodo);
}

/**
 * @properties={typeid:24,uuid:"EA033DDB-18CD-48E6-B192-F97FE8D33676"}
 */ 
function isDirty()
{
	return is_dirty;
}

/**
 * @properties={typeid:24,uuid:"616FCC64-9130-4EA3-A9C7-82E3E088CF10"}
 */
function aggiornaSelezione(selectedIndex)
{
	var selFrm = getSelectionForm();
	
	if(selFrm && selectedIndex)
	{
		selFrm.foundset.setSelectedIndex(selectedIndex);
		selFrm.foundset['checked'] = 1;
		getMainForm().foundset.setSelectedIndex(selectedIndex);
	}
}

/**
 *
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"8A14F158-E511-4FF0-978C-43E0FC10A0A8"}
 */
function onUnload(_event) 
{
	return _super.onUnload(_event);
}
