/**
 * @properties={type:8,typeid:36,uuid:"D03E0F74-F572-40E6-960A-E0ECAD31175A"}
 */
function timb_non_eliminata()
{
	return 0;
}

/**
 * @properties={type:93,typeid:36,uuid:"BFF76A2A-41D4-4997-8406-F77816AEFA28"}
 */
function giorno_succ_caus()
{
	return new Date(giorno.getFullYear(), giorno.getMonth(), giorno.getDate()+1)
}

/**
 * @properties={type:8,typeid:36,uuid:"A372EF34-E4AB-4411-9BF7-83FD1913984C"}
 * 
 * @return {Number}
 */
function giorno_fine()
{
	return (((giorno.getFullYear() * 10000) + ((giorno.getMonth() + 1) * 100) + giorno.getDate()) * 10000) + 9999
}

/**
 * @properties={type:8,typeid:36,uuid:"7D739399-19FC-4392-B4A1-20D85DDEE1AA"}
 * 
 * @return {Number}
 */
function giorno_inizio()
{	
	return ((giorno.getFullYear() * 10000) + ((giorno.getMonth() + 1) * 100) + giorno.getDate()) * 10000
}
