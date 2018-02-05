/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"424269AF-C4E0-400C-A33C-A156B12788C7"}
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

/** 
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"987B850E-6252-4E08-B760-9F54417220D5"}
 */
function onShowForm(_firstShow, _event) {
	
 return _super.onShowForm(_firstShow, _event)

}
