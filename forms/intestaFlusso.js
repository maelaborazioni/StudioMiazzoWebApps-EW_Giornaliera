/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D57BC74B-2C96-4E36-8436-63292FE87B00"}
 */
var vPeriodoStr = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"27D2C24F-141C-4AB5-BA5C-9E098F851307"}
 */
function abilitaMese(event) {
	
    var answer = true;
    var active_filter = forms.giorn_vista_mensile._filtroAttivo;
	if(active_filter)
		answer = globals.ma_utl_showYesNoQuestion("Il filtro sui dipendenti della giornaliera è attivo. <br/> Attivando il mese il filtro verrà rimosso. Proseguire?","Attivazione mese");
	
	if(answer)
	{
	   var params = globals.inizializzaParametriAttivaMese(forms.giorn_header.idditta, 
			                                               globals.getPeriodo(),
														   globals.getGruppoInstallazione(), 
														   globals.getGruppoLavoratori(),
														   globals._tipoConnessione,
														   forms.giorn_header.idlavoratore)
       
	   // la disattivazione di eventuali filtri implica che ci si riposizioni sul primo dipendente
	   // perciò la facciamo esclusivamente in presenza di filtri attivi
	   if(active_filter)	
	   {
		   globals.disattivaFiltri(event);
	       forms.giorn_header.preparaGiornaliera(true,null,false);
	   }
	   globals.attivaMese(params,false,null);
	}
	else
		return;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"626AE886-9913-47D4-8DF0-8D7230518449"}
 */
function vaiAlMesePrecedente(event) {
	globals.giornMesePrec(event,forms.giorn_header.idlavoratore);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"178A0575-5CA1-411A-80CA-E5E353FE5392"}
 */
function vaiAlMeseSuccessivo(event) {
	globals.giornMeseSucc(event,forms.giorn_header.idlavoratore);
}

/**
 * Gestisce la visualizzazione delle label e dei pulsanti a seconda del caso
 * in cui vi sia solo la visualizzazione della cartolina del dipendente o la gestione delle timbrature
 * da parte del gestore
 * 
 * @param {Boolean} _soloCartolina
 *
 * @properties={typeid:24,uuid:"BADD264E-3273-4B53-B83F-F47891AC7BEA"}
 */
function aggiornaIntestazioni(_soloCartolina)
{
	elements.btn_attivamese.visible = 
	elements.lbl_filtro__giornaliera.visible =
	elements.btn_filtroattivo.visible = 
	elements.btn_filtrodisattivato.visible =
	elements.lbl_tipo_giornaliera.visible =
	elements.btn_giornbudget.visible = 
	elements.btn_giornnormale.visible = 
	elements.btn_meseprec.enabled = 
	elements.btn_mesesucc.enabled = 
	elements.btn_selperiodo.enabled = !_soloCartolina;
		
}
