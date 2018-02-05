/**
 * @properties={typeid:35,uuid:"30DB071B-9A02-4673-A01C-6718E86139DB",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"A0EFB61A-850D-445A-9BB3-97A02BF21221",variableType:-4}
 */
var vOpenProg = false;

/**
 * @properties={typeid:35,uuid:"96734E15-8C40-4E01-8522-4B3A190CFAB8",variableType:-4}
 */
var vProgParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"5C1A0E69-7F0F-47F0-89B1-2648B8F4D385",variableType:-4}
 */
var vPrimoIngresso = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9252C485-FFB5-4A86-8E88-DF1FC997C577"}
 */
function annullaControlloTurnisti(event) {
	
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"042F2B93-FA2A-497F-9D74-33DE8525540F"}
 */
function confermaControlloTurnisti(event) 
{   
	var params = {
    	processFunction: process_controllo_turnisti,
		message: '',
		opacity: 0.2,
		paneColor: '#434343',
		textColor: '#EC1C24',
		showCancelButton: false,
		cancelButtonText: '',
		dialogName: '',
		fontType: 'Arial,4,25',
		processArgs: [event]
    }
    
    plugins.busy.block(params);
}

/**
 * Lancia l'operazione di controllo per le procedure di attivazione del mese
 * in seguito alla visualizzazione dei turnisti
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"149996CC-3E51-4C17-805D-57B1D86DA2FB"}
 */
function process_controllo_turnisti(event)
{
	try
	{
		//primo ingresso in un mese senza turnisti : lancia operazione lunga
		if (vPrimoIngresso) {
			globals.svy_mod_closeForm(event);
			plugins.busy.unblock();
			globals.openProgram('LEAF_Giornaliera', vProgParams, true);
			globals.attivazioneMese(vParams);
		}
		//attiva il mese e calcola la giornaliera in modalità sincrona
		else 
		{
			globals.attivazioneMeseSync(vParams);
	
			if (vOpenProg) 
				globals.openProgram('LEAF_Giornaliera', vProgParams, true);
			else 
			{
				var currIdDip = forms.giorn_header.idlavoratore != null ? forms.giorn_header.idlavoratore : 1;
				globals.ricalcolaGiornaliera(globals.toDate(vParams['periodo'])
					                         , forms.giorn_header.idditta
											 , globals.getGruppoInstallazione()
											 , globals.getGruppoLavoratori()
											 , currIdDip);
			}
		}
	}
	catch(ex)
	{
		var msg = 'Metodo process_controllo_turnisti : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		globals.svy_mod_closeForm(event);
		plugins.busy.unblock();
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1DBF4291-2E01-450E-A24F-319900187D18"}
 */
function aggiungiTurnista(event) {
	
	/** @type {Array} */
	var iddipendenti = globals.ma_utl_showLkpWindow
	                  (
							{
								  lookup: 'AG_Lkp_Lavoratori'
								, returnForm: controller.getName()
						    	, methodToAddFoundsetFilter: 'FiltraLavoratoriTurnisti'
								, multiSelect: true
							}
					  );
							
	var frm = forms.giorn_controllo_turnisti_aggiungi;
    frm._arrTurnisti = iddipendenti;
	
    globals.ma_utl_showFormInDialog(frm.controller.getName(),'Nuova decorrenza turnisti');
    
}

/**
 * @param {JSFoundset} _fs
 *
 * @return JSFoundet
 * 
 * @properties={typeid:24,uuid:"06AE8781-CF2F-45CA-A92C-B00C2F3DAE68"}
 */
function FiltraLavoratoriTurnisti(_fs) 
{
	var filters = forms.giorn_header.foundset.getFoundSetFilterParams();	
	for (var i = 0; i < filters.length; i++)
		_fs.addFoundSetFilterParam(filters[i][1], filters[i][2], filters[i][3], filters[i][4]);
		
	return _fs;
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"9F0AA916-7E6A-46D0-9401-1B3FC225E6C5"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	plugins.busy.prepare();
}
