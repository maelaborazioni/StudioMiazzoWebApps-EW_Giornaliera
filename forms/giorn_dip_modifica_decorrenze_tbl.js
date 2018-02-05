/**
 * TODO generated, please specify type and doc for the params
 * @param _event
 *
 * @properties={typeid:24,uuid:"DBE0F4D0-63C1-496E-9C7D-8022FDD95094"}
 */
function apriSelezioneNuovaRegola(_event)
{
	forms.giorn_controllo_dip_senza_regole_associate_aggiungi.vIdDitta = forms.giorn_header.idditta;
	forms.giorn_controllo_dip_senza_regole_associate_aggiungi.currFrmName = controller.getName();
	_super.apriSelezioneNuovaRegola(_event);
}