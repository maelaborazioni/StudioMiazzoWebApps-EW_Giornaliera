/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DB32DBA0-C4BE-483B-9319-263061AA61BB"}
 */
function onRender(event) {

	var _rec = event.getRecord();
	var _recRen = event.getRenderable();

	if (_rec) {
		if (event.isRecordSelected() /*& _iFirstShow*/) {
			_recRen.bgcolor = '#40FF00'
			_recRen.fgcolor = '#FFFFFF'
			return
		}

		if (_rec['senso'] == 0)
			_recRen.bgcolor = '#ECFFE6'
		else _recRen.bgcolor = '#E3F6DD'
	}
}

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
 * @properties={typeid:24,uuid:"D6E317B4-F5C6-4741-BDEC-EE8311982486"}
 */
function trasformaTimbr(oldValue, newValue, event) {
	
	var _timbrGiorno = foundset.timbratura_giorno 
	var _timbrH,_timbrM
	try{
		_timbrH = utils.stringLeft(newValue.toString(),2)
		_timbrM = utils.stringRight(newValue.toString(),2)
		
		foundset.timbratura = parseInt(_timbrGiorno,10)*10000 + parseInt(_timbrH,10)*100 + parseInt(_timbrM,10)
		
	}catch (e){
		application.output(e)
		newValue = oldValue
	}
	
	return true
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"75E30AFF-3ECB-4F40-9865-280FBA89F599"}
 */
function onShowForm(_firstShow, _event) {
	return  //_super.onShowForm(_firstShow, _event)
}
