/**
 * // TODO generated, please specify type and doc for the params
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"765D7D21-D405-46DF-BF0F-0805E3F523F3"}
 */
function FiltraTimbrature(_fs){
	
	/** @type {Date} */
	var day = foundset.giorno
	/** @type {Number} */
	var day_from
	/** @type {Number} */
	var day_to
	
	day_from = day.getFullYear()*100000000 + (day.getMonth()+1)*1000000 + day.getDate()*10000 
	day_to = day.getFullYear()*100000000 + (day.getMonth()+1)*1000000 + (day.getDate()+1)*10000
	
	_fs.addFoundSetFilterParam('iddip','=',forms['giorn_header']['iddip'])
	_fs.addFoundSetFilterParam('timbratura','>=',day_from)
	_fs.addFoundSetFilterParam('timbratura','<=',day_to)
   
    return _fs	
}

/**
 * @AllowToRunInFind
 * 
 * @param {JSRecord} _rec
 * 
 * @properties={typeid:24,uuid:"CC7AAF92-CEF1-4FBA-BB51-9FA0951E33B7"}
 */
function AggiornaTimbrature(_rec){
	
	forms.giorn_mostra_timbr.preparaTimbratura(foundset.giorno.getFullYear(),foundset.giorno.getMonth()+1)	
	
  	
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"234920FE-E9F7-4785-BC59-2C0A0434D16F"}
 */
function onShowForm(_firstShow, _event) {
	return 
}
