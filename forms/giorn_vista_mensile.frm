dataSource:"db:/ma_presenze/e2giornaliera",
extendsID:"C057B682-DE34-4DAA-A8F3-E9FFE64B81CE",
items:[
{
dataProviderID:"show_causalized",
displayType:4,
formIndex:65,
horizontalAlignment:0,
location:"650,140",
name:"chk_causalizzate",
onActionMethodID:"1CB74653-3B3A-43D6-8B8F-7A0D8F7407E1",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"04F514FD-B3BA-4A7B-A88A-A1D76F3308C8"
},
{
anchors:11,
horizontalAlignment:0,
location:"650,0",
mediaOptions:6,
name:"lbl_riep_timbr_header",
size:"150,20",
styleClass:"title_bar",
typeid:7,
uuid:"182140EB-CA89-4959-964D-F7A20689A817",
verticalAlignment:0
},
{
anchors:3,
formIndex:3,
horizontalAlignment:0,
imageMediaID:"47AFD373-A4C5-44AE-B6FC-82B83C44F5A2",
location:"775,0",
mediaOptions:10,
mnemonic:"",
name:"btn_fasce_orarie",
onActionMethodID:"-1",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
toolTipText:"Visualizza fasce orarie",
transparent:true,
typeid:7,
uuid:"1E2A3D86-26B1-4380-8732-43DE748FF1FA",
visible:false
},
{
extendsID:"2F836145-777D-41EE-8F23-EA888695FD28",
height:585,
typeid:19,
uuid:"2B8B7FEC-1B03-4A11-AD60-B004C2CDD510"
},
{
anchors:15,
items:[
{
containsFormID:"F18751B7-1117-40D2-A2C7-6EA84BA88DF7",
location:"649,498",
text:"giorn_vista_mensile_riepilogo",
typeid:15,
uuid:"45ADD6C0-3200-4D25-AD10-52EAD4F06670"
}
],
location:"650,468",
name:"tab_vista_riepilogo",
printable:false,
size:"150,97",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"2F2F6E97-2A59-47F2-9BFC-88E72DE462D6"
},
{
anchors:11,
formIndex:5,
items:[
{
containsFormID:"5C7EF701-F15D-444B-9595-FA42B4B6106A",
location:"650,291",
relationName:"e2giornaliera_to_e2giornalieraeventi",
text:"giorn_vista_mensile_eventi_tbl",
typeid:15,
uuid:"8B985070-1C7B-468A-AC3E-1C396F615728"
}
],
location:"650,261",
name:"tab_gestione_eventi_giorno",
printable:false,
size:"150,100",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"30D6CD9D-2B4C-4A68-A5C9-1DA44D8267F2"
},
{
dataProviderID:"show_events",
displayType:4,
formIndex:65,
horizontalAlignment:0,
location:"650,242",
name:"chk_eventi",
onDataChangeMethodID:"C9AB11BE-5629-4AE2-B5A8-893D0E6C8D8F",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"4192C8D6-9DEE-4439-97C6-CE280519AF2A"
},
{
anchors:11,
foreground:"#f8fcf8",
formIndex:1,
horizontalAlignment:0,
location:"649,448",
mediaOptions:6,
name:"lbl_riep_mensile",
size:"150,20",
styleClass:"title_text",
text:"Riepilogo mensile eventi",
transparent:true,
typeid:7,
uuid:"49985A19-E238-499F-AF3C-BA1BA392E8FF",
verticalAlignment:0
},
{
background:"#434343",
borderType:"SpecialMatteBorder,0.0,0.0,0.0,0.0,#434343,#434343,#434343,#434343,0.0,",
formIndex:1,
location:"0,40",
name:"tab_vista_regolafascia",
printable:false,
size:"40,525",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"4DE94EFB-0460-426F-A473-A69B818B7A0B"
},
{
anchors:11,
foreground:"#f8fcf8",
formIndex:1,
horizontalAlignment:0,
location:"670,242",
mediaOptions:6,
name:"lbl_gest_eventi",
size:"129,20",
styleClass:"title_text",
text:"Riepilogo eventi giorno",
transparent:true,
typeid:7,
uuid:"4E2495F8-9609-4528-8F9A-BD421D3BDB47",
verticalAlignment:0
},
{
anchors:11,
formIndex:62,
location:"650,140",
name:"lbl_t_caus_header",
size:"149,20",
styleClass:"title_bar",
typeid:7,
uuid:"64C1B516-D4CE-4C22-96E7-7E6ECC23EADA"
},
{
dataProviderID:"show_clockings",
displayType:4,
formIndex:65,
horizontalAlignment:0,
location:"650,0",
name:"chk_timbrature",
onDataChangeMethodID:"5733A77A-5DDB-4960-88B7-C79145F2798C",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"68AA0FB6-3B47-485A-8E51-BAB63381E14E"
},
{
anchors:11,
formIndex:1,
horizontalAlignment:0,
location:"668,0",
mediaOptions:6,
name:"lbl_riep_timbr",
size:"129,20",
styleClass:"title_text",
text:"Riepilogo timbrature giorno",
transparent:true,
typeid:7,
uuid:"6B4A74C4-E07F-4CF0-9534-BBDB8FC50CF0",
verticalAlignment:0
},
{
formIndex:57,
horizontalAlignment:0,
location:"58,20",
name:"lbl_vista_mensile_giorno",
size:"60,20",
styleClass:"giorn_lbl_light",
text:"Giorno",
typeid:7,
uuid:"7104EC1C-AC6F-4A4F-A55E-0F737A51605D"
},
{
anchors:11,
formIndex:68,
items:[
{
containsFormID:"370F15BB-7B44-4BDF-B2D8-CAC05C6D6BAC",
location:"650,400",
relationName:"e2giornaliera_to_commesse_giornaliera",
text:"giorn_vista_mensile_commesse",
typeid:15,
uuid:"343A1D91-6144-4D91-AECE-8BBBE139E302"
}
],
location:"650,382",
name:"tab_vista_commesse",
printable:false,
size:"150,65",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"71ECBE5D-A707-4BEC-8893-A0B188D667A6"
},
{
formIndex:56,
horizontalAlignment:0,
location:"118,20",
size:"521,20",
styleClass:"giorn_lbl_light",
text:"Eventi",
typeid:7,
uuid:"80C9D5CC-0AE3-46A0-B066-DEC93BB526E6"
},
{
anchors:12,
formIndex:1,
horizontalAlignment:0,
location:"321,567",
name:"lbl_vista_comunicazioni_tipo_giorn",
size:"321,18",
styleClass:"giorn_lbl_dark",
text:"Giornaliera Normale",
typeid:7,
uuid:"A42FEF20-8D9E-4E47-9068-A8409898820F",
verticalAlignment:0
},
{
anchors:13,
extendsID:"DBA3D2F8-6F9F-4A23-8EE8-8A2D52F72267",
location:"40,40",
size:"18,525",
typeid:16,
uuid:"A7279676-3651-4D83-ADC5-0D487160D140"
},
{
height:601,
partType:5,
typeid:19,
uuid:"AA97C851-D12F-4993-AE0C-F1A5C540DD48"
},
{
anchors:13,
background:"#c0c0c0",
borderType:"SpecialMatteBorder,0.0,1.0,0.0,1.0,#434343,#434343,#000000,#434343,0.0,",
formIndex:2,
location:"640,0",
name:"tabs_350",
printable:false,
size:"10,584",
tabOrientation:-1,
typeid:16,
uuid:"B57F6EC2-5E8D-499E-AD14-C30B6948D0E5"
},
{
formIndex:55,
horizontalAlignment:0,
imageMediaID:"04601A5A-9A8C-4A17-8D3F-E768247B8BBB",
location:"40,20",
mediaOptions:10,
name:"lbl_vista_mensile_sel",
onActionMethodID:"AA491A73-728A-4285-95D8-C5CBD9EC54EA",
rolloverCursor:12,
showClick:false,
size:"18,20",
styleClass:"giorn_lbl_light",
toolTipText:"Tutti/Nessuno",
typeid:7,
uuid:"BDE98D85-7E8E-441F-91C5-DE18A7F482CB",
verticalAlignment:0
},
{
anchors:11,
horizontalAlignment:0,
location:"650,242",
mediaOptions:6,
name:"lbl_gest_eventi_header",
size:"150,20",
styleClass:"title_bar",
typeid:7,
uuid:"C38A32F1-01FF-4865-B80E-F5F027DECDBE",
verticalAlignment:0
},
{
anchors:11,
formIndex:66,
location:"650,362",
mnemonic:"",
name:"lbl_riep_commesse_header",
size:"149,20",
styleClass:"title_bar",
typeid:7,
uuid:"C48EE5CC-E2D4-48F0-96A1-EDECBE3D67CD"
},
{
anchors:11,
foreground:"#f8fcf8",
formIndex:63,
horizontalAlignment:0,
location:"668,140",
mediaOptions:6,
name:"lbl_t_caus",
size:"129,20",
styleClass:"title_text",
text:"Timbrature causalizzate",
transparent:true,
typeid:7,
uuid:"C5C371F4-AD2E-4711-BFF6-6D1AA2C498B9"
},
{
anchors:11,
formIndex:67,
horizontalAlignment:0,
location:"650,362",
name:"lbl_riep_commesse",
size:"150,20",
styleClass:"title_text",
text:"Riepilogo commesse",
transparent:true,
typeid:7,
uuid:"D3D81FBC-329E-4728-B50D-AC586E5C1D84"
},
{
anchors:14,
borderType:"SpecialMatteBorder,1.0,0.0,0.0,0.0,#434343,#000000,#000000,#000000,0.0,",
dataProviderID:"_totPeriodo",
formIndex:61,
horizontalAlignment:0,
location:"650,567",
name:"lbl_totaleriepilogo",
size:"150,18",
styleClass:"giorn_lbl_dark",
typeid:7,
uuid:"D4AF098A-CDB9-4D88-83B5-FEEC5D759BE6",
verticalAlignment:0
},
{
items:[
{
containsFormID:"1259F8AA-E0B4-4509-BB80-BBAF75B49607",
location:"0,0",
text:"intestaVistaMensile",
typeid:15,
uuid:"6003879F-C2E2-42AC-9E5C-31EDFA44BFAE"
}
],
location:"0,0",
name:"tab_vista_intestazione",
size:"640,20",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"D53AE4DA-722E-4CB7-A43C-B89659C23F42"
},
{
anchors:3,
formIndex:4,
horizontalAlignment:0,
imageMediaID:"F2FDF8A8-109C-4304-92B2-518425ED181C",
location:"837,0",
mediaOptions:10,
name:"btn_conteggia_giorno",
onActionMethodID:"A34C5121-13B7-4147-BBE4-EB1376F4AA79",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
toolTipText:"Conteggia il giorno selezionato",
transparent:true,
typeid:7,
uuid:"D84BBE16-264D-4432-85FC-45E9CD85FCD7",
visible:false
},
{
anchors:12,
horizontalAlignment:0,
location:"0,567",
name:"lbl_vista_comunicazioni_filtro",
size:"321,18",
styleClass:"giorn_lbl_dark",
text:"Nessun filtro applicato",
typeid:7,
uuid:"DA41840F-B711-452B-89C6-C8023DC13A71",
verticalAlignment:0
},
{
anchors:11,
horizontalAlignment:0,
location:"650,448",
mediaOptions:6,
name:"lbl_riep_mensile_header",
size:"150,20",
styleClass:"title_bar",
typeid:7,
uuid:"E8FC6633-6505-4485-BF34-B2DA95632348",
verticalAlignment:0
},
{
anchors:13,
extendsID:"6ECB5048-8578-4CCE-B98C-CEA1AB2FFF34",
items:[
{
containsFormID:"D49B8CE2-F4AE-402F-92A6-E6C8D9F3BCF8",
location:"58,70",
text:"giorn_list",
typeid:15,
uuid:"9D55B8A7-37C7-4483-B7B5-54358294A74A"
},
{
containsFormID:"D49B8CE2-F4AE-402F-92A6-E6C8D9F3BCF8",
location:"138,70",
text:"giorn_budget",
typeid:15,
uuid:"A4F42E2C-89AF-4597-858A-1B57ADB211EE"
}
],
location:"58,40",
size:"582,525",
typeid:16,
uuid:"E99042F1-7ED4-450A-9C61-B23076643F76"
},
{
anchors:11,
formIndex:2,
items:[
{
containsFormID:"6059B537-4065-47C7-BCAE-211C0F7A0FD1",
location:"649,50",
relationName:"e2giornaliera_to_e2timbratura",
text:"giorn_vista_mensile_timbr_tbl",
typeid:15,
uuid:"A5D42629-D1E1-41F2-9F55-014C29FCC30F"
}
],
location:"650,20",
name:"tab_vista_dettagli_timbr",
printable:false,
size:"150,120",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"EC996B82-5304-4058-B7B4-C4CFA12ACADA"
},
{
anchors:11,
formIndex:64,
items:[
{
containsFormID:"0B8B7E86-5691-4AC6-944C-B9CBC8C30A16",
location:"650,190",
relationName:"e2giornaliera_to_e2timbratureservizio",
text:"giorn_mostra_timbr_t_caus_tbl",
typeid:15,
uuid:"FA61D461-9F7C-4C65-BBE2-B0BD4A79C81C"
}
],
location:"650,160",
name:"tab_vista_t_caus",
printable:false,
size:"150,82",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"F7C266F3-0EC4-4D8E-8BE4-37090D818BBF"
},
{
formIndex:6,
horizontalAlignment:0,
location:"0,20",
name:"lbl_vista_mensile_regola",
size:"40,20",
styleClass:"giorn_lbl_light",
text:"Reg.",
typeid:7,
uuid:"FC257505-08C0-4906-988B-13788C17B8B4"
}
],
name:"giorn_vista_mensile",
onLoadMethodID:"A8D8EAF0-1AB8-4248-8AB0-3D153A09C5FA",
onRecordSelectionMethodID:"16BD9642-A11B-44C2-8838-4E694E689436",
onShowMethodID:"65BA3DCC-0B40-42ED-8EAF-813222FA2AE4",
scrollbars:36,
size:"800,601",
styleName:"leaf_style",
typeid:3,
uuid:"68A68543-30A3-4D7D-9CDD-F904D38F91EF"