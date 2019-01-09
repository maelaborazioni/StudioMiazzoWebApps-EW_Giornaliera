/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8B74BDC9-CAF1-49AD-9A7F-AD7631A42FCF",variableType:4}
 */
var _idEvSelezionato = -1;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"27ACEDF9-66BF-44B9-8044-7AAD96C8A91D"}
 */
var _destFormName = '';

/**
 * @type {Array}
 * 
 * @properties={typeid:35,uuid:"E3EEEA6A-FD14-4F03-A8FB-5AD0C629BFD2",variableType:-4}
 */
var arrIdEventi = [];

/**
 * @properties={typeid:35,uuid:"1D632C95-4141-401E-BBF7-AEDD50A73632",variableType:-4}
 */
var bRichiestaPermessi = false; 

/**
 * @param {Boolean} [richiestaPermessi] 
 * 
 * @properties={typeid:24,uuid:"BFEDA284-1130-4E80-91CD-24C796F19AA4"}
 * @AllowToRunInFind
 */
function refreshTree(richiestaPermessi)
{
	arrIdEventi = [];
	
	if(richiestaPermessi)
		for(var e = 0; e < globals._arrIdEvSelezionabiliRP.length; e++)
		{
			if(globals._arrIdEvSelezionabili.indexOf(globals._arrIdEvSelezionabiliRP[e]) != -1)
				arrIdEventi.push(globals._arrIdEvSelezionabiliRP[e]);
		}
	else
		arrIdEventi = globals._arrIdEvSelezionabili;
	
	if(arrIdEventi.length == 0)
	{
		globals.ma_utl_showWarningDialog('Nessun evento selezionabile!');
		return;
	}
	
	// recupero di tutti gli eventi selezionabili 
	var sqlEv = "SELECT Ev.idEvento,Ev.Evento,'  ' + Ev.Evento + '  ' + Ev.descriz AS Evento_Descrizione,Ev.IdEventoClasse,Ev.IdGruppoEvento,Ev.Note,Ev.OrdineDiEsposizione, " + 
	            "Ev.IdEventoPadre FROM E2Eventi Ev INNER JOIN E2EventiClassi EvCl ON Ev.IdeventoClasse = EvCl.IdEventoClasse " + 
				"WHERE Ev.idEvento IN (" + arrIdEventi.join(',') + ") " + 
				// TODO aggiungere la gestione degli eventi con periodi?
				//"AND EvCl.GestitoConPeriodi = 0 " +
				"AND EvCl.GestitoConStorico = 0";
	if(richiestaPermessi || forms.giorn_vista_mensile._tipoGiornaliera == globals.TipoGiornaliera.BUDGET)
		sqlEv += " AND Ev.UsaInBudget = 1";
	
	var evDs = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sqlEv,null,-1);
	var evDS = evDs.createDataSource('evDS',[JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER]);
	
	// recupero delle classi padre degli eventi ottenuti in precedenza 
	var arrEvPadre = evDs.getColumnAsArray(8);
	/** @type {JSFoundSet<db:/ma_presenze/e2_eventipadre>} */    
    var categEvFs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2_eventipadre');
	if(categEvFs.find())
	{
		categEvFs.idevento = arrEvPadre;
		categEvFs.search();
	}
    categEvFs.sort('ordinediesposizione');    
    	
	if(solutionModel.getDataSourceNode(evDS).getCalculation('media_calc') === null)
	{
		solutionModel.getDataSourceNode(evDS).newCalculation('function media_calc(){'+ 
                                            'switch(ideventopadre){' + 
											    'case 612,670,607,854,618 : return \'media:///program_orange.png\';break;' +
			                                    'case 564,565,566,567,568,569,570 : return \'media:///program_orange.png\'; break;' + 
								                'case 571 : return \'media:///program_orange.png\'; break;' +
								                'default : return \'media:///program_orange.png\';' +
											'}' + 
										 '}',JSVariable.TEXT);
	}	
	var rel = solutionModel.getRelation('e2eventipadre_to_evDs'); 
	if(rel == null)
	{
		rel = solutionModel.newRelation('e2eventipadre_to_evDs',categEvFs.getDataSource(),evDS,JSRelation.INNER_JOIN);
	    rel.newRelationItem('idevento','=','ideventopadre');
	}
	if(categEvFs.getSize() === 0)
	   elements.eventi_tree.enabled = false;
	else
	{
	    var binding_1 = elements.eventi_tree.createBinding(categEvFs.getDataSource());
	        binding_1.setImageURLDataprovider('calc_media_folder');
	        binding_1.setNRelationName(rel.name);
	        binding_1.setTextDataprovider('descriz');
            binding_1.setMethodToCallOnClick(espandiSelezione,'e2eventipadre_to_evDs.ideventopadre');

        var binding_2 = elements.eventi_tree.createBinding(evDS);
            binding_2.setImageURLDataprovider('media_calc');
            binding_2.setTextDataprovider('evento_descrizione');
            binding_2.setToolTipTextDataprovider('note');
            binding_2.setMethodToCallOnClick(aggiornaIdEventoSelezionato,'idevento');             
            binding_2.setMethodToCallOnDoubleClick(forms.giorn_modifica_eventi_dtl.aggiornaSelezioneEventoDaAlbero,'idevento');
	}
	
	elements.eventi_tree.removeAllRoots();
	elements.eventi_tree.addRoots(categEvFs);

}
	
/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"3E153E29-3B6A-46B5-AEE3-DB4436A666B6"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
    refreshTree(bRichiestaPermessi);
}

/**
 * @properties={typeid:24,uuid:"8CA52C72-E621-4FFB-9BFF-DA68716AFE69"}
 */
function aggiornaIdEventoSelezionato(returnDataProvider, tableName, mouseX, mouseY)
{
	_idEvSelezionato = returnDataProvider;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"DC1FFC23-4838-45EC-BEDA-1AD4AAF9502B"}
 */
function confermaSelezioneEvento(event) {
	
	globals.svy_mod_closeForm(event);
	//Conferma la selezione dell'evento selezionato ed aggiorna 
	forms[_destFormName].confermaSelezioneEventoDaAlbero(_idEvSelezionato);
}

/**
 * Espande il nodo radice selezionato
 * 
 * @param {Number} menu_item_id
 *
 * @properties={typeid:24,uuid:"B062488E-E7AB-415D-A9DB-05C19B5637E0"}
 */
function espandiSelezione(menu_item_id)
{
	if(elements.eventi_tree.isNodeExpanded([menu_item_id]))
		elements.eventi_tree.setExpandNode([menu_item_id],false);
	else
	    elements.eventi_tree.setExpandNode([menu_item_id],true);
}

/**
 * Espande il nodo radice selezionato
 * 
 * @param {Number} menu_item_id
 *
 * @properties={typeid:24,uuid:"D277BBB9-C3F2-4C16-9E6B-2DF37069A42B"}
 */
function comprimiSelezione(menu_item_id)
{
	elements.eventi_tree.setExpandNode([menu_item_id],false);
}