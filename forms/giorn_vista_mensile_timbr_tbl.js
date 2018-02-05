/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"95F8EFC1-A87B-4F0E-ADA7-876B96936442"}
 */
function onRender(event) {

	var _rec = event.getRecord()
	var _recRen = event.getRenderable()

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
