/**
 * @type {JSForm}
 * 
 * @private
 * 
 * @properties={typeid:35,uuid:"37B3970D-4FDD-4AE3-ADC6-93C7AEFB5D6D",variableType:-4}
 */
var instance = null;

/**
 * @properties={typeid:35,uuid:"AAD93C44-F70D-40EB-9748-0E455860DE2B",variableType:-4}
 */
var visibleForm = null;

/**
 * @return {JSForm}
 * 
 * @properties={typeid:24,uuid:"69862C4B-5F21-4EE9-8C04-6A18CAAE72B0"}
 */
function getInstance()
{
	if(!instance)
	{
		var datasourceName = 'giorn_selezione_multipla_ds';
		var frmName = controller.getName() + '_clone';
		
		if(solutionModel.getForm(frmName) != null)
		{
			if(!history.removeForm(frmName))
			{
				application.output('Cannot remove form ' + frmName + ' from history');
			    return null;
			}
			if(!solutionModel.removeForm(frmName))
			{
				application.output('Cannot remove form ' + frmName + ' from solutionModel');
			    return null;
			}
		}
		
		if(!databaseManager.dataSourceExists(datasourceName))
		{
			var dataset = databaseManager.createEmptyDataSet(0, ['__index__', 'giorno', 'checked']);
			for(var d = 1; d <= 31 + globals.offsetGg; d++)
				dataset.addRow([d, d - globals.offsetGg, 0]);
		}
				
		instance = solutionModel.cloneForm(frmName, solutionModel.getForm(controller.getName()));
		instance.dataSource = dataset.createDataSource(datasourceName, [JSColumn.INTEGER, JSColumn.INTEGER, JSColumn.INTEGER]);
		instance.getField('chk_checked').dataProviderID = 'checked';
	}
	
	return instance;
}

/**
 * @param {String} formName
 *
 * @properties={typeid:24,uuid:"252E55E8-AF43-40F9-BFC8-47AA0B4A082B"}
 */
function setVisibleForm(formName)
{
	visibleForm = formName;
}

/**
 * Gestisce la grafica della form
 *
 * @param {JSRenderEvent} event the render event
 *  
 * @private
 *
 * @properties={typeid:24,uuid:"23CDEAAC-861A-44F2-9005-94EFDE2BE1C4"}
 */
function onRenderChecked(event)
{
   var recInd = event.getRecordIndex();
   var recRen = event.getRenderable();
   var recCol = forms[visibleForm] != null ? forms[visibleForm].getMainForm().foundset.getRecord(recInd) : null;
   
   if(!recCol)
	   return;
   
   var mese = globals.getMese();
   var anno = globals.getAnno();
   var meseAttivo = globals.getMeseAttivo();
   var annoAttivo = globals.getAnnoAttivo();
   var offset = globals.offsetGg;
   
   var isDisabled = true;
                 
   if(mese != null && anno != null && meseAttivo != null && annoAttivo != null)
   {
	   var active = anno == annoAttivo && mese == meseAttivo;
	   var offsetSelezione = forms.giorn_header.assunzione > new Date(globals.getAnno(),globals.getMese() - 1,1) ?
	                         forms.giorn_header.assunzione.getDate() +  offset - 1 : offset;
       isDisabled =   (!active && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.NORMALE)
   					    ||(recInd <= offsetSelezione)
   					    ||(active && recCol['idgiornaliera'] == null && recCol['anomalie'] == 0 && forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET);
   }
   
   if(isDisabled)
   {   
	   recRen.bgcolor = '#767676';
	   recRen.fgcolor = '#333333';
	   recRen.enabled = false;
	   return;
   }
   else
	   recRen.enabled = true;
   
   var lastDay = new Date(anno, mese, 0).getDate();
   if(recInd > lastDay + offsetSelezione)
   {
	   recRen.visible = false;
	   recRen.transparent = true;
	   
	   return;
   }
   
   if(recCol)
   {
	   if(recInd % 2 == 0)
	   {
		   recRen.bgcolor = globals.Colors.EVEN.background;
		   recRen.fgcolor = globals.Colors.EVEN.foreground;
	   }
	   else
	   {
		   recRen.bgcolor = globals.Colors.ODD.background;
		   recRen.fgcolor = globals.Colors.ODD.foreground;
	   }
	   
	   if(event.isRecordSelected())
	   {
		   recRen.bgcolor = '#abcdef';
		   recRen.fgcolor = globals.Colors.SELECTED.foreground;
	   }
	   else
	   if(recCol['festivo'])
	   {
		   recRen.bgcolor = globals.Colors.HOLYDAYS.background;	// darker than sat/sun
		   recRen.fgcolor = globals.Colors.HOLYDAYS.foreground;	// white
	   }
	   else
	   {
		   switch(recCol['nomegiorno'])
		   {
			   case 'SA':
				   //caso giorno = sabato
				   recRen.bgcolor = globals.Colors.SATURDAY.background;
				   recRen.fgcolor = globals.Colors.SATURDAY.foreground;
				   
				   break;
				   
			   case 'SU':
			   case 'DO':
				   //caso giorno = domenica, in realtà dovrebbe dipendere dalla fascia oraria
				   recRen.bgcolor = globals.Colors.SUNDAY.background;
				   recRen.fgcolor = globals.Colors.SUNDAY.foreground;
				   
				   break;
		   }
	   }
   }
}

/**
 * @param {Boolean} [withOffset]
 * 
 * @properties={typeid:24,uuid:"89C4EA7E-8FBA-40F6-A63D-6BE1A68F5063"}
 */
function getGiorniSelezionati(withOffset)
{
	var giorni_sel = [];
	
	for(var g = 1; g <= foundset.getSize(); g++)
	{
		var row = foundset.getRecord(g);
		if (row['checked'] == 1)
		{
			if(withOffset)
				giorni_sel.push(row['__index__']);
			else
				giorni_sel.push(row['giorno']);
		}
	}
	
	return giorni_sel;
}

/**
 * @properties={typeid:24,uuid:"6915A135-183E-4924-9EBB-8B2055714ACD"}
 */
function clear()
{
	var fsUpdater = databaseManager.getFoundSetUpdater(foundset);
		fsUpdater.setColumn('checked', 0);
	
	return fsUpdater.performUpdate();
}

/**
 * Rende selezionato il giorno e lo salva nell'array di parametri 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"89FFC1E3-0627-4A85-B4D1-D0AC0E4B3793"}
 */
function selezionaGiorno(event)
{	
	/** @type {Array} */
	var _arrSelOrd;
	/** @type {Array}*/
	var _oldArrSel = globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel;
	/** @type {Array}*/
	var _newArrSel = [];
	/** @type {Number}*/
	var _oldArrSize = _oldArrSel.length;
	
	globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].index_sel = foundset.getSelectedIndex();
	
	if(foundset['checked'] == 1)
	{
		if(_oldArrSel.lastIndexOf(foundset.getSelectedIndex() - globals.offsetGg) == -1)
		{
			_oldArrSel.push(foundset.getSelectedIndex() - globals.offsetGg);
		    _arrSelOrd = globals.mergeSort(_oldArrSel);
		    globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = _arrSelOrd;
		}		
	} 
	else 
	{		
		for (var i=0; i<_oldArrSize; i++)
		{			
			if(_oldArrSel[i] != (foundset.getSelectedIndex() - globals.offsetGg))				
                _newArrSel.push(_oldArrSel[i]);					
		}
		
		_arrSelOrd = globals.mergeSort(_newArrSel);
		globals.objGiornParams[forms.svy_nav_fr_openTabs.vTabNames[forms.svy_nav_fr_openTabs.vSelectedTab]].giorni_sel = _arrSelOrd;	
	}
}
