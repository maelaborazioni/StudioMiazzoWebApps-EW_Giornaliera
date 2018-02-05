
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"02A99FF7-D24F-45DE-BB91-E03F467049E8"}
 */
function confermaSelezioneSquadratiDitta(event)
{
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		return;
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	globals.svy_mod_closeForm(event);
	
	apriProgramSquadrature();
}

/**
 * @properties={typeid:24,uuid:"EA8581B1-753E-42AF-AFF6-FBFD6810F606"}
 */
function apriProgramSquadrature()
{
	var _progName = 'SquadratureGiornalieraDitta';
	var _progObj = globals.nav.program[_progName];
	_progObj.empty_foundset = true;
	_progObj.filter = null;  
    _progObj.foundset = null;	

	var _parObj = {
		anno : _anno,
	    mese : _mese
	};
	
	var _ggUltimo = ((globals.TODAY.getMonth() + 1) == _mese) ? globals.TODAY.getDate() : globals.getTotGiorniMese(_mese,_anno); 
	if(globals.haSquadratiDitta(_idditta,_anno,_mese))
	{
	   globals.openProgram(_progName,_parObj,true);
	   
	   // settaggio parametri iniziali per squadrature
	   var frmSq = forms.giorn_list_squadrati_ditta;
	   frmSq.foundset.loadRecords(_idditta);
	   frmSq.annoRif = _anno;
       frmSq.meseRif = _mese;
       frmSq.limitaDal = new Date(_anno,_mese - 1,1);
       frmSq.ggRif = _ggUltimo;
       frmSq.limitaAl = new Date(_anno,_mese - 1,_ggUltimo);       
	}
	else
	   globals.ma_utl_showInfoDialog('Nessun dipendente squadrato per il periodo selezionato','Squadrati rispetto all\'orario di riferimento');
}