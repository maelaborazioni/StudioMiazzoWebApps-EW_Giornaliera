
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"1F3F8178-6321-4385-9270-B35DDCC0C9BB"}
 */
function apriSelezioneNuovaRegola(event) {
	
	var frm = forms.giorn_controllo_dip_senza_regole_associate_aggiungi;
	frm._idRegola = null;
	frm.vIdRegola = null;
	frm._codRegola = null;
	frm._descRegola = null;
	frm._riga = null;
	frm._descRiga = null;
	frm._valoreAgg = null;
	frm.vIdDitta = globals.getDitta(foundset['id_lavoratore']);
	
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
    globals.ma_utl_showFormInDialog(frm.controller.getName(),'Seleziona la nuova regola');
    
}

/**
 * @param {JSRecord} rec
 *
 * @properties={typeid:24,uuid:"DC32B344-3ABA-4AC9-84A8-2BC1DF67DFC1"}
 */
function AggiornaTurno(rec)
{
	if(validaTurnista())
	{
		var frm = forms['giorn_controllo_dip_senza_regole_associate_tbl_temp'];
		var fs = frm.foundset;
		
		var recTurnista = fs.getSelectedRecord();
		recTurnista['codiceturnista'] = rec['codice']; 
		recTurnista['tipoturnista'] = rec['codice'] + ' - ' + rec['descrizione']; 
	}
}

/**
 * @properties={typeid:24,uuid:"835985F6-496E-4AD8-9234-7EDC754D9DD5"}
 */
function validaTurnista()
{
	return true;
}