/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"451CDBB5-27AA-4BC3-8BFE-9E9287E9E55B"}
 */
var _noteMese = ''
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AE70BFE9-6AE4-471C-AC6A-FFDDFA9C4B5B"}
 */
var _noteAuto = ''
	
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"22A5CF99-FEC0-431D-B044-8ED738306A5C",variableType:4}
 */
var _noteIdGiorn = -1; 
	
/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"CA182510-1ACD-45D7-9D97-2AABD1B1DD73",variableType:-4}
 */
var _noteIns = false;

/**
 * Conferma le modifiche e chiude la finestra
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 *
 * @properties={typeid:24,uuid:"5AE80355-40A7-46A9-8C6C-5EA31536232A"}
 * @AllowToRunInFind
 */
function confermaNote(event) 
{	
	var done = false;
	var sql = '';
	
	foundset.find();
	foundset.idgiornaliera = _noteIdGiorn;
	foundset.origine = 1;

	// nota già esistente, situazione di update del record
	if(foundset.search())
	{
		sql = "UPDATE E2GiornalieraInfoMensili SET Info = '" + utils.stringReplace(_noteMese,"'","''") + 
		      "' WHERE idGiornaliera = " + _noteIdGiorn + " AND Origine = 1";
		                
	}
	// nuova nota, inserimento del nuovo record
	else
	{
	    sql = "INSERT INTO E2GiornalieraInfoMensili(idGiornaliera,AnnoMm,Origine,Info,DaConsiderare)" +
		      " VALUES(" + _noteIdGiorn + "," + globals.getPeriodo() + "," + 1 + ",'" + utils.stringReplace(_noteMese,"'","''") + "'," + 1 + ")"; 
		
	}

	done = plugins.rawSQL.executeSQL(globals.customer_dbserver_name,'dbo.e2giornalierainfomensili',sql,null);	
	
	if (done)
	{
		if(_noteIns)
		{
			/** @type {JSFoundSet<db:/ma_presenze/e2giornalierainfomensili>}*/
		    var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,'e2giornalierainfomensili');
		    if(fs.find())
		    {
		    	fs.idgiornaliera = _noteIdGiorn;
		    	if(fs.search())
		    		databaseManager.refreshRecordFromDatabase(fs,-1);
		    }
		}	    	     
	}
	else
	{
		globals.ma_utl_showErrorDialog('Inserimento note non riuscito a causa di : ' + plugins.rawSQL.getException().getMessage() + ', si prega di riprovare','Conferma annotazioni');
	    application.output(plugins.rawSQL.getException().getMessage());
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Annulla eventuali modifiche e chiude la finestra
 * 
 * @param {JSEvent} event
 *
 * 
 *
 * @properties={typeid:24,uuid:"044ACA86-A189-4EC3-A5BE-B88F21450563"}
 */
function annullaNote(event){
	
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
}
/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D042CABE-D966-4C4C-8A6D-9439EFD15C14"}
 */
function onHide(event) {

	annullaNote(event);
	return true;

}
