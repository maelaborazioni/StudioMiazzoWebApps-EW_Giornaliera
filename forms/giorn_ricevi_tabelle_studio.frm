dataSource:"db:/ma_anagrafiche/lavoratori",
extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
\"'_idgruppoinst'\",\
\"'LEAF_Lkp_GruppoInst'\",\
\"'AggiornaSediInstallazione'\",\
\"'FiltraSediInstallazione'\",\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
enabled:false,
formIndex:3,
horizontalAlignment:0,
location:"55,65",
mediaOptions:2,
name:"btn_selgruppoinst",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
tabSeq:-2,
transparent:true,
typeid:7,
uuid:"0AD707E6-FBB5-431F-BD3F-168A3D7E3906",
verticalAlignment:0
},
{
formIndex:12,
labelFor:"fld_cod_gr_inst",
location:"9,45",
mediaOptions:14,
size:"170,20",
text:"Gruppo di installazione",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_tab_dati.label_1073742125.toolTipText",
transparent:true,
typeid:7,
uuid:"10CF201C-B580-4B5B-80AD-EC29D49978BE"
},
{
dataProviderID:"_idgruppoinst",
editable:false,
enabled:false,
formIndex:9,
location:"9,65",
name:"fld_cod_gr_inst",
onActionMethodID:"9DC30318-B604-460A-B4B6-9FFB3E7A84FA",
onDataChangeMethodID:"225CB470-9D29-416F-B8B3-8CAEA60F3885",
size:"45,20",
tabSeq:4,
typeid:4,
uuid:"15607FC2-CE6F-4AD6-A168-5C4895E06A75"
},
{
dataProviderID:"_codditta",
formIndex:5,
location:"10,25",
name:"fld_cod_ditta",
onActionMethodID:"9DC30318-B604-460A-B4B6-9FFB3E7A84FA",
onDataChangeMethodID:"061CC9B8-D1C7-45E2-87D1-EF3F4629AD92",
onFocusGainedMethodID:"-1",
selectOnEnter:true,
size:"45,20",
tabSeq:1,
text:"Cod Ditta",
typeid:4,
uuid:"3ECC9232-0B71-4E59-97CE-38BFE3516C93"
},
{
dataProviderID:"_ragionesociale",
editable:false,
formIndex:6,
location:"76,25",
name:"fld_ragionesociale",
size:"320,20",
tabSeq:-2,
text:"Ragionesociale",
typeid:4,
uuid:"4773E9D5-98F0-4B05-B112-8EE1BF292303"
},
{
anchors:6,
location:"375,100",
mediaOptions:2,
mnemonic:"",
name:"btn_annullaselgiorn",
onActionMethodID:"D6C1C65E-0626-4702-B4D8-C20736DB432A",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_cancel_40",
tabSeq:-2,
toolTipText:"Chiudi",
transparent:true,
typeid:7,
uuid:"6ADBE5A8-5300-49BA-BE4B-53125F67FA50"
},
{
formIndex:15,
labelFor:"fld_cod_ditta",
location:"10,5",
mediaOptions:14,
size:"45,20",
text:"Codice",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_tab_dati.label_1073742125.toolTipText",
transparent:true,
typeid:7,
uuid:"8518EC44-CBB2-4BF8-9AF4-E12FE8C41006"
},
{
dataProviderID:"_descgruppoinst",
editable:false,
enabled:false,
formIndex:8,
location:"75,65",
name:"fld_gruppo_inst",
size:"320,20",
tabSeq:-2,
typeid:4,
uuid:"8AD39F0B-C591-4FAF-B3CA-539DB714BF6F"
},
{
height:140,
partType:5,
typeid:19,
uuid:"8AD6F9F9-110B-443B-8DD3-C91710A4E6DA"
},
{
dataProviderID:"globals.riceviTabelleMsg",
displayType:1,
editable:false,
enabled:false,
formIndex:16,
location:"5,90",
size:"338,45",
transparent:true,
typeid:4,
uuid:"AAE749A4-38EB-4F2F-9532-3F31A62B8620"
},
{
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
\"'_idditta'\",\
\"'LEAF_Lkp_Ditte'\",\
\"'AggiornaSelezioneDitta'\",\
\"'FiltraDitteRicezione'\",\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
formIndex:7,
horizontalAlignment:0,
location:"56,25",
mediaOptions:2,
name:"btn_selditta",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
tabSeq:-2,
transparent:true,
typeid:7,
uuid:"C53A2A1E-C9AB-4E6C-B583-55067AA2DFE2",
verticalAlignment:0
},
{
formIndex:14,
labelFor:"fld_ragionesociale",
location:"76,5",
mediaOptions:14,
size:"100,20",
text:"Ragione sociale",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_tab_dati.label_1073742125.toolTipText",
transparent:true,
typeid:7,
uuid:"EAA4CA21-5B6E-4CB4-902E-0803DCF0284B"
},
{
anchors:6,
location:"345,100",
mediaOptions:2,
name:"btn_confermaselgiorn",
onActionMethodID:"9DC30318-B604-460A-B4B6-9FFB3E7A84FA",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_confirm_40",
tabSeq:-2,
toolTipText:"Ricevi gli aggiornamenti dallo studio",
transparent:true,
typeid:7,
uuid:"FBB42824-669A-4455-A6CF-82611E44DD5F"
}
],
name:"giorn_ricevi_tabelle_studio",
namedFoundSet:"separate",
navigatorID:"-1",
scrollbars:36,
showInMenu:true,
size:"410,140",
styleName:"leaf_style",
typeid:3,
uuid:"F8253C0D-1697-4E64-8EE4-1F56FAA65EAB"