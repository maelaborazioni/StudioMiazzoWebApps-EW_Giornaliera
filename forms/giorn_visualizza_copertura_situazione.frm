extendsID:"3C076162-6D45-4034-9F27-2ADA00E4841B",
items:[
{
dataProviderID:"vChkCentroDiCosto",
displayType:4,
enabled:false,
formIndex:13,
horizontalAlignment:0,
location:"411,34",
name:"chk_centro_di_costo",
onDataChangeMethodID:"06361886-EFEB-4D7C-99C4-90C727186E79",
size:"20,20",
styleClass:"check",
toolTipText:"Funzionalità in fase di implementazione",
transparent:true,
typeid:4,
uuid:"181B54C8-8EB2-43BF-B545-41FAA73C10B9"
},
{
dataProviderID:"vAl",
editable:false,
format:"dd/MM/yyyy|mask",
location:"241,10",
name:"fld_al",
size:"80,20",
typeid:4,
uuid:"1C0925C7-97FA-4CF9-A497-46E2D0105011"
},
{
formIndex:4,
labelFor:"",
location:"613,65",
name:"lbl_dettaglio_eventi",
size:"87,20",
text:"Dettaglio eventi",
transparent:true,
typeid:7,
uuid:"281D07E4-E823-49D2-ABF9-DB0AEFBD585C",
visible:false
},
{
dataProviderID:"vTipoVisualizzazione",
displayType:2,
editable:false,
formIndex:15,
location:"422,192",
name:"fld_tipo_visualizzazione",
onDataChangeMethodID:"8EA19C6B-B1EB-42EB-9D5B-926D4253F57E",
size:"120,20",
typeid:4,
uuid:"28C7563D-1666-4B4F-AC36-11662C8E71E6",
valuelistID:"8FEF9982-8197-438A-B5FA-A40C826C9C33",
visible:false
},
{
anchors:9,
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'AG_Lkp_ClassificazioniDettaglio'\",\
null,\
\"'FiltraCdc'\",\
null,\
null,\
null,\
\"true\",\
null,\
null,\
\"true\",\
\"'AggiornaCdcMulti'\"\
]\
}\
}",
enabled:false,
formIndex:5,
location:"591,34",
mnemonic:"",
name:"btn_lkp_centro_di_costo",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
styleClass:"btn_lookup",
toolTipText:"Annulla ricerca",
transparent:true,
typeid:7,
uuid:"2FEF9978-511D-4B33-8ACF-2A1E7E9324A1"
},
{
dataProviderID:"vChkSedeDiLavoro",
displayType:4,
enabled:false,
formIndex:12,
horizontalAlignment:0,
location:"120,34",
name:"chk_sede",
onDataChangeMethodID:"04F3569E-1B1F-4089-B708-5952AAA9E919",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"33D151DB-38BA-462B-91DB-A532CD10E5E4",
visible:false
},
{
dataProviderID:"vCentroDiCosto",
editable:false,
enabled:false,
formIndex:10,
location:"431,34",
name:"fld_centro_di_costo",
size:"160,20",
typeid:4,
uuid:"3AA267CD-339F-4E22-AD56-06FDF68F0B0D"
},
{
dataProviderID:"vTipoRichieste",
displayType:2,
editable:false,
enabled:false,
formIndex:19,
location:"941,148",
name:"fld_tipo_richiesta",
onDataChangeMethodID:"-1",
size:"180,20",
typeid:4,
uuid:"3CBC436E-EFA3-4551-B741-C1B4A1AF4900",
valuelistID:"53981975-FD5B-4381-8F7B-ADB5D7342B20",
visible:false
},
{
dataProviderID:"vChkDettaglioEvento",
displayType:4,
enabled:false,
formIndex:3,
location:"643,84",
name:"chk_dettaglio_evento",
onDataChangeMethodID:"-1",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"40A6C237-C61B-4203-B1FE-64C80B0828EB",
visible:false
},
{
dataProviderID:"vDip",
editable:false,
enabled:false,
formIndex:10,
location:"409,286",
name:"fld_dipendente",
onDataChangeMethodID:"-1",
size:"160,20",
typeid:4,
uuid:"4A1A2086-8DB9-4491-97D3-C10CC15B94B6",
visible:false
},
{
formIndex:17,
labelFor:"fld_ditta",
location:"621,10",
name:"lbl_ditta",
size:"86,20",
text:"Singola ditta",
transparent:true,
typeid:7,
uuid:"4B27EB0C-C0D2-4000-991C-C0907B375813",
visible:false
},
{
anchors:9,
formIndex:4,
location:"835,149",
name:"lbl_solo_dip_con_richieste",
size:"84,20",
text:"Tipo richieste",
transparent:true,
typeid:7,
uuid:"5A1F83E8-EBAE-498F-814E-547C8D0E2CB2",
visible:false
},
{
dataProviderID:"vIdDitta",
displayType:2,
editable:false,
enabled:false,
formIndex:16,
location:"726,10",
name:"fld_ditta",
onDataChangeMethodID:"900427CF-FBE0-4248-805C-94036E44D7DE",
size:"179,20",
typeid:4,
uuid:"656E4A89-3C01-4E08-872F-D2D8EAC3C0E3",
valuelistID:"802FAB6B-5616-44D4-9CF8-5D9ACDC64623",
visible:false
},
{
anchors:9,
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'AG_Lkp_Ditta'\",\
\"'AggiornaSingolaDitta'\",\
null,\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
enabled:false,
formIndex:5,
location:"910,90",
mnemonic:"",
name:"btn_lkp_ditta",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
styleClass:"btn_lookup",
toolTipText:"Annulla ricerca",
transparent:true,
typeid:7,
uuid:"72B89610-48A1-43CC-9656-FCE980EB234F",
visible:false
},
{
anchors:9,
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'AG_Lkp_Lavoratori'\",\
\"'AggiornaDipendente'\",\
\"'FiltraDipendente'\",\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
enabled:false,
formIndex:5,
location:"569,286",
mnemonic:"",
name:"btn_lkp_dipendente",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
styleClass:"btn_lookup",
toolTipText:"Annulla ricerca",
transparent:true,
typeid:7,
uuid:"7746FFF9-2F1F-4F7B-B069-1A840F0A734E",
visible:false
},
{
formIndex:11,
location:"309,286",
name:"lbl_dipendente",
size:"80,20",
text:"Singolo dip.",
transparent:true,
typeid:7,
uuid:"7A84BA87-A4CC-48BA-8671-451C854019A7",
visible:false
},
{
formIndex:5,
location:"5,15",
name:"btn_edit_visualizza_situazione",
onActionMethodID:"6BFC08A6-9F97-4D58-94D2-CD508FDEB2A9",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"30,30",
styleClass:"btn_edit",
toolTipText:"Abilita la selezione per la visualizzazione",
transparent:true,
typeid:7,
uuid:"7DBC6B57-F612-4EBB-9D0D-096920722840"
},
{
dataProviderID:"vChkGruppo",
displayType:4,
enabled:false,
formIndex:13,
horizontalAlignment:0,
location:"411,10",
name:"chk_gruppo",
onDataChangeMethodID:"9EDF21B5-D712-42F1-A430-6101378C942D",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"84EFAF1B-A897-4965-8C27-B93CB1AEBACD",
visible:false
},
{
anchors:9,
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'RFP_Gruppi_Utenti'\",\
null,\
\"'FiltraGruppiUtenti'\",\
null,\
null,\
null,\
\"true\",\
null,\
null,\
\"true\",\
\"'AggiornaGruppiUtentiMulti'\"\
]\
}\
}",
enabled:false,
formIndex:5,
location:"591,10",
mnemonic:"",
name:"btn_lkp_gruppo",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
styleClass:"btn_lookup",
toolTipText:"Annulla ricerca",
transparent:true,
typeid:7,
uuid:"85932DCF-8494-49F2-9820-736E6706C8D4",
visible:false
},
{
enabled:false,
formIndex:1,
labelFor:"fld_dal",
location:"201,10",
name:"btn_calendar_dal",
onActionMethodID:"763FDDFF-2CFE-46E2-A447-E7F60173BC57",
showClick:false,
size:"20,20",
styleClass:"btn_calendar",
transparent:true,
typeid:7,
uuid:"883DB523-135B-40D2-877E-9CD128171283"
},
{
formIndex:6,
location:"332,10",
name:"lbl_gruppo",
size:"62,20",
text:"Gruppo",
transparent:true,
typeid:7,
uuid:"88BA49DB-D6CF-4388-A1E8-FBD4D2083547",
visible:false
},
{
anchors:3,
enabled:false,
formIndex:1,
labelFor:"",
location:"1096,15",
name:"btn_refresh",
onActionMethodID:"653BD3E4-A435-4C0E-B264-650ED1FF87D2",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_refresh",
toolTipText:"Visualizza copertura",
transparent:true,
typeid:7,
uuid:"8CE10F9A-0BAD-49EF-A3DF-3CCD7D4F85A4"
},
{
anchors:9,
dataProviderID:"vChkGruppoFasce",
displayType:4,
enabled:false,
formIndex:3,
location:"706,34",
name:"chk_gruppo_fascia",
onDataChangeMethodID:"BB94D04D-5D23-4ED6-9411-531DCAA8BC69",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"9467B48E-AFE7-4046-A2DE-94FC17E57035",
visible:false
},
{
anchors:3,
enabled:false,
formIndex:2,
location:"1126,15",
name:"btn_annulla",
onActionMethodID:"3C14A031-6EDC-4D7D-8F90-3EF92DCE5376",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"30,30",
styleClass:"btn_cancel_40",
transparent:true,
typeid:7,
uuid:"94B3D789-572E-47C9-9CB0-E9F18F10E3FA"
},
{
dataProviderID:"vSede",
editable:false,
enabled:false,
formIndex:10,
location:"140,34",
name:"fld_sede",
onDataChangeMethodID:"-1",
size:"160,20",
typeid:4,
uuid:"976B3D1B-53F1-4E47-A79E-852C4694A5E9",
visible:false
},
{
height:480,
partType:5,
typeid:19,
uuid:"9804867B-CE35-4145-A932-D9E26ED1E635"
},
{
anchors:9,
dataProviderID:"vSoloDipConRichieste",
displayType:4,
enabled:false,
formIndex:3,
location:"920,149",
name:"chk_tipologia_richiesta",
onDataChangeMethodID:"1BC6E34B-F6E5-4E2B-810F-5472170BB605",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"9DD5F096-1601-40F5-ABEE-B42FE1D507E2",
visible:false
},
{
formIndex:11,
location:"330,34",
name:"lbl_centro_di_costo",
size:"80,20",
text:"Centro di costo",
transparent:true,
typeid:7,
uuid:"AC545634-07AB-4830-8AD1-0EC55366C0E0"
},
{
extendsID:"AAAC08F8-0270-4E48-995F-E7066E036521",
height:60,
typeid:19,
uuid:"B3B14C82-E4A9-4490-B1A5-701DD02BD3BB"
},
{
formIndex:11,
location:"40,34",
name:"lbl_sede",
size:"80,20",
text:"Sede di lavoro",
transparent:true,
typeid:7,
uuid:"C23A5356-1C88-44F4-BDC6-5AC9FF23D8D9",
visible:false
},
{
dataProviderID:"vChkDip",
displayType:4,
enabled:false,
formIndex:12,
horizontalAlignment:0,
location:"389,286",
name:"chk_dipendente",
onDataChangeMethodID:"6E637AB7-3111-4A61-8019-5888DCC6639A",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"C2C5A6D2-923B-4263-8B9E-10048729CECC",
visible:false
},
{
dataProviderID:"vChkSingolaDitta",
displayType:4,
enabled:false,
formIndex:13,
horizontalAlignment:0,
location:"706,10",
name:"chk_solo_ditta",
onDataChangeMethodID:"900427CF-FBE0-4248-805C-94036E44D7DE",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"C37D06CD-F860-43B7-9CEA-A1BDBDDB27CF",
visible:false
},
{
enabled:false,
formIndex:14,
labelFor:"",
location:"301,192",
name:"lbl_tipo_visualizzazione",
size:"120,20",
text:"Tipo visualizzazione",
transparent:true,
typeid:7,
uuid:"C7106198-5872-4BFF-8B31-79BE73AEF94A",
visible:false
},
{
location:"40,10",
name:"lbl_situazione_dal",
size:"101,20",
text:"Situazione dal",
transparent:true,
typeid:7,
uuid:"CBB6391D-6F22-47B2-B655-F65705BE7A2F"
},
{
dataProviderID:"vGroup",
editable:false,
enabled:false,
formIndex:7,
location:"431,10",
name:"fld_gruppo",
size:"160,20",
typeid:4,
uuid:"D0D470A4-ED46-4E74-AFC7-BC28AB30DEC5",
visible:false
},
{
anchors:9,
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'AG_Lkp_Sede'\",\
null,\
\"'FiltraSede'\",\
null,\
null,\
null,\
\"true\",\
null,\
null,\
\"true\",\
\"'AggiornaSedeMulti'\"\
]\
}\
}",
enabled:false,
formIndex:5,
location:"300,34",
mnemonic:"",
name:"btn_lkp_sede",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
styleClass:"btn_lookup",
toolTipText:"Annulla ricerca",
transparent:true,
typeid:7,
uuid:"DD9A3C34-4D13-4908-BDD2-AAE4ACE73715",
visible:false
},
{
enabled:false,
formIndex:1,
labelFor:"fld_al",
location:"301,10",
name:"btn_calendar_al",
onActionMethodID:"763FDDFF-2CFE-46E2-A447-E7F60173BC57",
showClick:false,
size:"20,20",
styleClass:"btn_calendar",
transparent:true,
typeid:7,
uuid:"DDC5D0D2-CFD8-498B-81B1-19BC4498BD38"
},
{
location:"226,10",
name:"lbl_situazione_al",
size:"10,20",
text:"al",
transparent:true,
typeid:7,
uuid:"DE8CCBA0-3E47-41A1-A72B-E36A8B9BBEE0"
},
{
dataProviderID:"vDitta",
editable:false,
formIndex:16,
location:"731,90",
name:"fld_ditta_ori",
onDataChangeMethodID:"900427CF-FBE0-4248-805C-94036E44D7DE",
size:"179,20",
typeid:4,
uuid:"E01A7FBC-C070-46BD-AB23-195C4D676451",
valuelistID:"802FAB6B-5616-44D4-9CF8-5D9ACDC64623",
visible:false
},
{
dataProviderID:"vDal",
editable:false,
format:"dd/MM/yyyy|mask",
location:"141,10",
name:"fld_dal",
size:"80,20",
typeid:4,
uuid:"EE619CE7-870C-4BB9-87B5-2FC8CD6A8C5E"
},
{
anchors:9,
formIndex:4,
location:"621,34",
name:"lbl_gruppo_fascia",
size:"84,20",
text:"Fasce orarie",
transparent:true,
typeid:7,
uuid:"F8207CEA-F05E-40D0-AD6B-6864804AAB85",
visible:false
},
{
dataProviderID:"vIdGruppoFasce",
displayType:2,
editable:false,
enabled:false,
formIndex:19,
location:"726,34",
name:"fld_gruppo_fascia",
size:"180,20",
typeid:4,
uuid:"FC1A6A53-0A72-46CD-BCD1-A1D8F55E81CE",
valuelistID:"ED215050-6A7E-45CC-AED6-8FE67E4489FA",
visible:false
}
],
name:"giorn_visualizza_copertura_situazione",
size:"1161,480",
styleName:"leaf_style",
typeid:3,
uuid:"239C7809-5B1B-458D-9B9B-D8B7BE1DBEB5"