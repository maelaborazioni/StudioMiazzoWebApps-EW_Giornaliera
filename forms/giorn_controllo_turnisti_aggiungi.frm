extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
dataProviderID:"_descTipoTurnista",
editable:false,
location:"160,33",
name:"fld_desc_turnista",
size:"320,20",
typeid:4,
uuid:"120D36EE-6686-4354-B363-F7839B773338"
},
{
height:100,
partType:5,
typeid:19,
uuid:"386A54BD-8438-4149-8A7A-9C61EFD30BCE"
},
{
labelFor:"fld_decorrenza",
location:"10,13",
mediaOptions:14,
name:"lbl_decorrenza",
size:"70,20",
text:"A partire dal",
transparent:true,
typeid:7,
uuid:"61684045-4A5F-4FD1-9154-12D35B208183"
},
{
anchors:12,
horizontalAlignment:0,
location:"450,65",
mediaOptions:6,
name:"btn_annulla",
onActionMethodID:"EEBCA54A-71AE-44E5-A33D-695B625216C2",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_cancel_40",
toolTipText:"Annulla inserimento",
transparent:true,
typeid:7,
uuid:"7AA18DD1-DB1B-4D71-91C6-BC9BE50A0EF7"
},
{
formIndex:1,
horizontalAlignment:0,
labelFor:"fld_decorrenza",
location:"70,33",
mediaOptions:2,
name:"btn_decorrenza",
onActionMethodID:"763FDDFF-2CFE-46E2-A447-E7F60173BC57",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_calendar",
transparent:true,
typeid:7,
uuid:"8936E00D-6271-40C6-847B-A6F704418220",
verticalAlignment:0
},
{
dataProviderID:"_codTipoTurnista",
horizontalAlignment:0,
location:"100,33",
name:"fld_cod_turnista",
onDataChangeMethodID:"-1",
size:"40,20",
typeid:4,
uuid:"8D96F89D-ADA2-4F5C-8B37-0838F631B93D"
},
{
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'AG_Lkp_TipiTurno'\",\
\"'AggiornaTipoTurnista'\",\
null,\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
horizontalAlignment:0,
labelFor:"",
location:"140,33",
mediaOptions:2,
name:"btn_tipo_turnista",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"A3BA1DE2-D36F-4A9F-B716-5E30673CF807",
verticalAlignment:0
},
{
anchors:12,
horizontalAlignment:0,
location:"420,65",
mediaOptions:6,
name:"btn_conferma",
onActionMethodID:"6D9CC9E6-9FB7-4AE5-9250-1F81A57FA02E",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_confirm_40",
toolTipText:"Conferma nuovi turni",
transparent:true,
typeid:7,
uuid:"A5D74B63-405F-4CE5-9BCA-1F098F4DD821"
},
{
dataProviderID:"_decorrenza",
format:"dd/MM/yyyy|mask",
location:"10,33",
name:"fld_decorrenza",
size:"80,20",
text:"Decorrenza",
typeid:4,
uuid:"CCD158F6-552E-4D34-B7E8-C1544E8305A8"
},
{
location:"100,13",
name:"lbl_tipo_turnista",
size:"190,20",
text:"Tipo di turnista",
transparent:true,
typeid:7,
uuid:"EC5BC30E-F230-4562-9ECD-9DBDB11F30B9"
}
],
name:"giorn_controllo_turnisti_aggiungi",
size:"490,100",
styleName:"leaf_style",
typeid:3,
uuid:"1D025BE8-125A-4F2D-9F9B-E086CBD42D6E"