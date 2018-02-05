/**
 * @param {Object}
 * 
 * @properties={typeid:35,uuid:"EC17843E-AC24-457C-8849-C8CCD74EAA6D",variableType:-4}
 */
var vParams = null;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"96B3D18D-006E-45D5-9982-3750F2BB1986",variableType:-4}
 */
var _daControlliPreliminari = false;


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B5DFE6AF-FDCE-4C06-8EF2-E2F2D8349EC3"}
 */
function annullaConfermaAnnotazioni(event) {
	
   globals.svy_nav_dc_setStatus('browse','giorn_controllo_annotazioni_ditta',true);	
   globals.svy_mod_closeForm(event);
   
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2B84C9A4-2C3D-4384-B6C7-216C18E0140C"}
 */
function confermaAnnotazioni(event) {
	
	var arrIdInfoMensiliSi = [];
			
    var fs = forms['giorn_controllo_annotazioni_ditta_tbl_temp'].foundset;
    var size = fs.getSize();
	for (var i=1; i <= size; i++)
	{
		fs.setSelectedIndex(i);
		if(fs['daconsiderare'] == 1)
			arrIdInfoMensiliSi.push(fs['idinfomensili']);
	}
	
	var sqlIdIndoMensiliSi = 'UPDATE E2GiornalieraInfoMensili SET DaConsiderare = 1 WHERE idInfoMensili IN (' + arrIdInfoMensiliSi.map(function() {return '?'}).join(',') + ')';
	
	globals.svy_nav_dc_setStatus('browse','giorn_controllo_annotazioni_ditta',true);
	globals.svy_mod_closeForm(event);
		
	// non c'è bisogno di esplicitare il nome del catalog perchè l'operazione è unicamente lato sede
	var done = plugins.rawSQL.executeSQL(globals.Server.MA_PRESENZE,'dbo.e2giornalierainfomensili',sqlIdIndoMensiliSi,arrIdInfoMensiliSi);	
	
	if (done)
	{
	    //flush is required when changes are made in db
	    plugins.rawSQL.flushAllClientsCache(globals.Server.MA_PRESENZE,'e2giornalierainfomensili');
	    
	    // se non arriva dai controlli preliminari e sono stati selezionati tutti i dipendenti proposti
	    if(!_daControlliPreliminari)
	    {
	       //si può procedere con la chiusura
		   var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta,
			                                                   globals.getPeriodo(),
															   globals.getGruppoInstallazione(),
															   globals.getGruppoLavoratori(),
															   globals._tipoConnessione); 
	       globals.chiudiMeseSelezionato(params);
	    }
	    //altrimenti la tabella è stata aggiornata, non si può proseguire con la chiusura 
	    //ma non saranno ripresentate nella successiva fase di chiusura
	    else 
	    	return; 
	}
	else
	{
		globals.ma_utl_showErrorDialog('Conferma annotazioni non riuscito a causa di : ' + plugins.rawSQL.getException().getMessage() + ', si prega di riprovare','Conferma annotazioni');
	    application.output(plugins.rawSQL.getException().getMessage());
	}
	
}
