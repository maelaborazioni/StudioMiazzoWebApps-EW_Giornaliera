/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A29A5181-A6EF-4FD0-91C9-2467E5721724"}
 */
function confermaDittaPeriodoProgTurni(event)
{
	var params = {
        processFunction: process_ditta_prog_turni,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"AE355044-C7EB-4AE8-A785-2CBECD0115AC"}
 */
function process_ditta_prog_turni(event)
{
	try
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
		
		var _iddittalegata = null;
		if(globals.getTipologiaDitta(_idditta) != globals.Tipologia.STANDARD)
		   _iddittalegata =	globals.getDittaRiferimento(_idditta);
		if(!globals.verificaProgrammazioneTurniDitta(_iddittalegata != null ? _iddittalegata : _idditta))
		{
			globals.ma_utl_showInfoDialog('La ditta non ha regole che ammettano la distribuzione dell\'orario','Programmazione turni');
			plugins.busy.unblock();
			return;
		}
		globals.apriProgrammazioneTurni(event,_idditta,_anno,_mese);
	}
	catch(ex)
	{
		var msg = 'Metodo process_ditta_prog_turni : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}
