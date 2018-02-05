/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"262DFEDE-E1A0-4B4B-A942-092CBF000875",variableType:4}
 */
var _senso = 0;

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"225D59A5-31A2-4BEA-A8E4-369E57F80A5E"}
 */
function onDataChangeTimbratura(oldValue, newValue, event) {
	
	var frmTab = forms.giorn_aggiungi_timbr_tab;
	var idLav = forms.giorn_header.idlavoratore ? forms.giorn_header.idlavoratore : forms.giorn_cart_header.idlavoratore;
	switch(globals.validaInserimentoTimbratura(idLav,newValue,frmTab.vGiornoTimbr,foundset['senso'],foundset['ggSucc'],frmTab.vSoloCartolina))
	{
		case 0 :
		   frmTab.elements.btn_add_timbr.enabled =
		   frmTab.elements.btn_conferma_inserimento.enabled = true;
		   return true;
		   break;
		   
//		case 1:
//			globals.ma_utl_showWarningDialog('<html>Controllare che tutti i campi necessari siano compilati</html>', 'Inserimento timbrature');
//			break;
//		case 2:
//			globals.ma_utl_showWarningDialog('<html>Controllare che i valori della timbratura siano corretti</html>', 'Inserimento timbrature');
//			break;
//		case 3:
//			globals.ma_utl_showWarningDialog('<html>Esiste già una timbratura con questi valori!</html>', 'Inserimento timbrature');
//			break;
		default:
		frmTab.elements.btn_add_timbr.enabled =
		frmTab.elements.btn_conferma_inserimento.enabled = false;
		return false;
			break;
		
	}
		
}
