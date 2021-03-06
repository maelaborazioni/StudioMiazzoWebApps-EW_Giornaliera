dataSource:"db:/ma_presenze/e2timbratureservizio",
extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
horizontalAlignment:0,
labelFor:"fld_sensocambiato",
location:"448,10",
name:"lbl_senso_cambiato",
size:"80,15",
text:"Senso cambiato",
transparent:true,
typeid:7,
uuid:"11F696FB-38E6-4D19-828A-2BC361C12595",
visible:false
},
{
dataProviderID:"_ggSucc",
displayType:4,
horizontalAlignment:0,
location:"538,30",
name:"fld_ggsucc",
size:"70,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"2C1DB25C-C90E-4F0B-B010-43079BF86516",
visible:false
},
{
anchors:3,
location:"362,70",
name:"btn_annulla",
onActionMethodID:"8FB64F93-F709-480C-B2E8-9AF97765B172",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"32,32",
styleClass:"btn_cancel_40",
transparent:true,
typeid:7,
uuid:"406CEB73-FD6F-4A69-A93E-178CA750DCC3"
},
{
dataProviderID:"indirizzo",
editable:false,
enabled:false,
horizontalAlignment:0,
location:"344,30",
name:"fld_indirizzo",
size:"50,20",
typeid:4,
uuid:"6329A6B2-C9DF-43E5-9E0F-C8E00A8EB416",
valuelistID:"0613EBA7-7442-4C89-B6BA-A97CAEBBED64"
},
{
height:110,
partType:5,
typeid:19,
uuid:"74A4126A-CF74-4DFA-94A7-62B1B5489D01"
},
{
dataProviderID:"senso",
displayType:2,
editable:false,
horizontalAlignment:0,
location:"184,30",
name:"fld_senso",
onActionMethodID:"-1",
onDataChangeMethodID:"EECC33EF-26CA-4137-81BF-39254E0FA7F7",
size:"70,20",
typeid:4,
uuid:"8A22F49B-FF7B-43CF-ABBB-0E74D2673C7B",
valuelistID:"A8BC46C0-060C-4070-93E9-9270E67EA372"
},
{
dataProviderID:"causale",
displayType:2,
editable:false,
location:"5,30",
name:"fld_causalizzazione",
size:"169,20",
typeid:4,
uuid:"8C242E5D-0F9C-4389-AC41-36331927F4DE",
valuelistID:"DDAC753D-B3CA-4F87-94ED-2215F10621E0"
},
{
dataProviderID:"sensocambiato",
displayType:4,
editable:false,
enabled:false,
horizontalAlignment:0,
location:"448,30",
name:"fld_sensocambiato",
size:"75,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"9E86A8D2-FF40-4C65-B885-BF6E2210E725",
visible:false
},
{
labelFor:"fld_causalizzazione",
location:"10,10",
name:"lbl_causalizzazione",
size:"164,15",
text:"Causalizzazione",
transparent:true,
typeid:7,
uuid:"B7A3D825-416D-4BD4-B520-FFBC4707D659"
},
{
horizontalAlignment:0,
labelFor:"fld_indirizzo",
location:"344,10",
name:"lbl_orologio",
size:"50,15",
text:"Orologio",
transparent:true,
typeid:7,
uuid:"C571206D-A548-4660-8D0F-04A79F4DD4FD"
},
{
dataProviderID:"timbratura_oremin",
format:"##.##",
horizontalAlignment:0,
location:"264,30",
name:"fld_timbr",
onActionMethodID:"EA83DF00-9FFF-47F2-8084-5924DAB78955",
onDataChangeMethodID:"C30FEA8F-57F8-48C5-A4F0-0021E0BCFBA9",
size:"70,20",
typeid:4,
uuid:"D3534F9B-97C1-4155-A43A-5471B3718FD3"
},
{
horizontalAlignment:0,
labelFor:"fld_timbr",
location:"264,10",
name:"lbl_timbratura",
size:"70,15",
text:"Timbratura",
transparent:true,
typeid:7,
uuid:"E2C691BD-006B-4423-993D-925B1447E298"
},
{
anchors:3,
enabled:false,
location:"330,70",
name:"btn_conferma",
onActionMethodID:"EA83DF00-9FFF-47F2-8084-5924DAB78955",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"32,32",
styleClass:"btn_confirm_40",
transparent:true,
typeid:7,
uuid:"E348494B-8AE0-4F46-9A3E-AD0A0BAF2A77"
},
{
horizontalAlignment:0,
labelFor:"fld_ggsucc",
location:"538,10",
name:"lbl_ggsucc",
size:"70,15",
text:"Giorno succ.",
transparent:true,
typeid:7,
uuid:"EC4D9B51-E79B-4643-9E55-30AF65350927",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_senso",
location:"184,10",
name:"lbl_senso",
size:"70,15",
text:"Senso",
transparent:true,
typeid:7,
uuid:"F9FBEC53-1CBA-46A1-822B-1B66CE4D645D"
}
],
name:"giorn_modifica_timbr_caus_dtl",
onHideMethodID:"EDA76F7A-78E6-48BB-ABDC-1B4FFDD58919",
size:"400,110",
styleName:"leaf_style",
typeid:3,
uuid:"089E3E8F-FAA0-4157-B719-3BEA6EC56E27",
view:0