/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C69923FF-BCCA-4418-995F-DD407E4C8310"}
 */
function onRender(event) {

	var _recRen = event.getRenderable()
	var _recInd = event.getRecordIndex()
	
	if(event.isRecordSelected() /*& _iFirstShow*/){
		   _recRen.bgcolor = '#40FF00'
		   _recRen.fgcolor = '#FFFFFF'
		   return	   
	}
	
	if ((_recInd % 2) == 0)
		_recRen.bgcolor = '#ECFFE6'
	else _recRen.bgcolor = '#E3F6DD'
}

/** *
 * @param _event
 * @param _form
 *
 * @properties={typeid:24,uuid:"4D1A504C-D611-4D0D-B259-BFE346BC4781"}
 */
function onRecordSelection(_event, _form) {
	
	/** @type {JSDataSet} */
	var dataset = controller.getFormContext();
	if (dataset.getMaxRowIndex() > 1) {
		// form is in a tabpanel
		//dataset columns: [containername(1),formname(2),tabpanel or beanname(3),tabname(4),tabindex(5)]
		//dataset rows: mainform(1) -> parent(2)  -> current form(3) (when 3 forms deep)
//		var parentFormName = dataset.getValue(1, 2)
	}		
		
	return _super.onRecordSelection(_event, _form)
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E5F846D0-DDFA-4670-8A6E-FE2C40141D99"}
 */
function SelezioneEventoGiorno(event) {
		
	forms['giorn_modifica_eventi_dtl']['_idevento'] = idevento
	forms['giorn_modifica_eventi_dtl']['_evento'] = e2giornalieraeventi_to_e2eventi.evento
	forms['giorn_modifica_eventi_dtl']['_descevento'] = e2giornalieraeventi_to_e2eventi.descriz
	forms['giorn_modifica_eventi_dtl']['_codprop'] = codiceproprieta
	forms['giorn_modifica_eventi_dtl']['_descprop'] = e2giornalieraeventi_to_eventiproprieta.descrizione
	forms['giorn_modifica_eventi_dtl']['_ore'] = ore / 100
	forms['giorn_modifica_eventi_dtl']['_importo'] = valore
}
