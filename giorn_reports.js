/**
 * Genera il file .pdf con le incongruenze tra le ore in giornaliera e quelle sulle commesse
 * 
 * @param {Number} idDitta
 * @param {Array<Number>} arrDipendenti
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"FD7A6681-0CCC-41F8-AC98-BF126F61A34D"}
 */
function stampaReportIncongruenzeGiornalieraCommesse(idDitta,arrDipendenti,dal,al)
{
	try
	{		
		    var arrAutorizzate;
		    var soloAutorizzate;
		    if(globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA))
		    {
		    	globals.ma_utl_showWarningDialog('Nel calcolo delle ore su commessa si tiene conto solamente di quelle autorizzate','Stampa incongruenze ore giornaliera / ore commesse');
		    	arrAutorizzate = [1];
		    	soloAutorizzate = true;
		    }
		    else
		    {
		    	arrAutorizzate = [0,1];
		        soloAutorizzate = false;
		    }
		    
		    var dsIncOreComm = globals.ottieniIncongruenzeOreLavorateOreCommesse(arrDipendenti,dal,al,soloAutorizzate);
		    if(dsIncOreComm.getMaxRowIndex())
		    {
				var parameters;
				var reportName = 'COMM_IncongruenzeOreCommesse.jasper';
				parameters =
				   {
					   pintestazione	:	globals.getCodDitta(idDitta) + ' - ' + globals.getRagioneSociale(idDitta),
					   parrlavoratori   :   arrDipendenti,
					   pdal   			:	dal,
					   pal              :   al,
					   parrautorizzate  :   arrAutorizzate
				   }
							
				var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE),reportName,false,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,parameters);
			
				plugins.file.writeFile('IncongruenzeGiornalieraCommesseDal_'+ utils.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al_'
    				                    + utils.dateFormat(al,globals.ISO_DATEFORMAT)+'.pdf',bytes);
 		    }
		    else
		    	globals.ma_utl_showWarningDialog('Nessuna incongruenza per il periodo selezionato','Incongruenze tra ore lavorate ed ore su commessa');
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		// Close this form					
//		globals.svy_mod_closeForm(event);
	}
}