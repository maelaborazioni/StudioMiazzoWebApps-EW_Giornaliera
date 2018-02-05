/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"491CCAD7-52AB-469D-A444-8DEC4C5BE208",variableType:-4}
 */
var _arrDipSelezionati = [];

/**
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"3E86A166-1AA9-4A30-93E7-C6143C8E17FB"}
 */
function filtraLavoratori(fs)
{
	fs.addFoundSetFilterParam('idditta','=',forms.giorn_header.idditta);
	return fs;
}