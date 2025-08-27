// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      3.39.01
// @description  Monarch Tweaks
// @author       Robert P
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// ==/UserScript==

const version = '3.39.01';
const css_currency = 'USD';
const css_green = 'color: #2a7e3b;',css_red = 'color: #d13415;';
const graphql = 'https://api.monarchmoney.com/graphql';
let SaveLocationPathName = '',css_reload = false, css_cec = false;
let r_headStyle = null, r_FlexButtonActive = false, MTSpawnProcess=8, debug=0;
let accountGroups = [],accountsHasFixed = false,TrendQueue = [], TrendQueue2 = [];

// flex container
const FlexOptions = ['Trends','Accounts','Tags'];
const MTFields = 13;
let MTFlex = [], MTFlexTitle = [], MTFlexRow = [], MTFlexCard = [];
let MTFlexCR = 0, MTFlexDetails = null, MTP = null, MTFlexSum = [0,0];
let MTFlexDate1 = new Date(), MTFlexDate2 = new Date();

function MM_Init() {

    MM_MenuFix();
    MM_RefreshAll();

    const a = isDarkMode();
    if(a == null) {css_reload = true;return;}
    const panelBackground = 'background-color: ' + ['#FFFFFF;','#222221;'][a];
    const panelText = 'color: ' + ['#777573;','#989691;'][a];
    const standardText = 'color: ' + ['#22201d;','#FFFFFF;'][a];
    const sidepanelBackground = 'background: ' + ['#def7f9;','#222221;'][a];
    const selectBackground = 'background-color: ' + ['#def7f9;','#082c36;'][a];
    const selectForground = 'color: ' + ['#107d98;','#4ccce6;'][a];
    const lineForground = ['#e4e1de','#363532'][a];
    const accentColor = '#ff692d;';
    const bdr = 'border: 1px solid ' + ['#e4e1de;','#62605D;'][a];
    const bdrb = 'border-bottom: 1px solid ' + ['#e4e1de;','#62605D;'][a];
    const bs = 'box-shadow: rgba(8, 40, 100, 0.04) 0px 4px 8px; border-radius:';
    const detailLine = ['#ebe8e5','#2a2a28'][a];

    MTFlexDate1 = getDates('d_StartofMonth');MTFlexDate2 = getDates('d_Today');

    if(getCookie('MT_PlanCompressed',true) == 1) {addStyle('.joBqTh, .jsBiA-d {padding-bottom: 0px; padding-top: 0px; !important;}'); addStyle('.earyfo, .fxLfmT {height: 42px;}'); addStyle('.bmeuLc, .dVgTYt, .exoRCJ, .bgDnMb, .zoivW {font-size: 15px;}');}
    if(getCookie('MT_CompressedTx',true) == 1) {addStyle('.dnAUzj {padding-top: 1px; padding-bottom: 1px;}');addStyle('.dHdtJt,.bmeuLc,.dUcLPZ,.hNpQPw,.iRHwlh {font-size:14px;}');}
    if(getCookie('MT_PendingIsRed',true) == 1) {addStyle('.bmeuLc {color:' + accentColor + '}');}
    addStyle('.MTBub {margin-bottom: 12px;}');
    addStyle('.MTBub1 {cursor: pointer;float: right; margin-left: 12px;font-size: 13px; margin-bottom: 10px; padding: 2px; ' + bdr + bs + ' 4px; width: 150px; text-align: center;font-weight: 500;}');
    addStyle('.MTWait {width: 40%; margin-left: auto; margin-top: 100px;margin-right: auto;justify-content: center; align-items: center;}');
    addStyle('.MTWait2 {font-size: 18px; font-weight: 500; font: "Oracle", sans-serif; ' + panelBackground + ' padding: 20px; ' + bs + ' 8px; text-align: center;}');
    addStyle('.MTWait2 p {' + standardText + 'font-family:  MonarchIcons, sans-serif, "Oracle" !important; font-size: 15px; font-weight: 200;}');
    addStyle('.MTPanelLink, .MTBudget a {background-color: transparent; font-weight: 500; font-size: 14px; cursor: pointer; color: rgb(50, 170, 240);}');
    addStyle('.MTCheckboxClass, .MTFlexCheckbox, .MTFixedCheckbox, .MTDateCheckbox {width: 19px; height: 19px; margin-right: 10px;float: inline-start; color: #FFFFFF; accent-color: ' + accentColor + '}');
    addStyle('.MTSpacerClass {margin: 4px 24px 4px 24px; height: 8px; border-bottom: 1px solid ' + lineForground +';}');
    addStyle('.MTInputClass { padding: 6px 12px; border-radius: 4px; background-color: transparent; ' + bdr + standardText +'}');
    addStyle('.MT' + FlexOptions.join(':hover, .MT') + ':hover {cursor:pointer;}');
    addStyle('.MTFlexButtonExport, .MTFlexButton1, .MTFlexButton2, .MTFlexButton4, .MTSettButton1, .MTSettButton2, .MTHistoryButton, .MTSplitButton, .MTInputButton {font-family: MonarchIcons, "Oracle", sans-serif; font-size: 14px;font-weight: 500; padding: 7.5px 12px;' + panelBackground + standardText + 'margin-left: 12px;' + bdr + bs + ' 4px;cursor: pointer;}');
    addStyle('.MTFlexContainer {display:block; padding: 20px;}');
    addStyle('.MTFlexContainer2 {margin: 0px;  gap: 20px;  display: flex; }');
    addStyle('.MTFlexContainerPanel { display: flex; flex-flow: column; place-content: stretch flex-start; ' + panelBackground + bs + ' 8px;}');
    addStyle('.MTFlexContainerCard {  display: flex; flex: 1 1 0%; justify-content: space-between; padding: 16px 24px; align-items: center;' + panelBackground + bs + ' 8px;}');
    addStyle('.MTFlexGrid {' + panelBackground + 'padding: 20px;border-spacing: 0px;}');
    addStyle('.MTFlexGrid th, td { padding-right: 4px; padding-left: 4px;}');
    addStyle('.MTFlexTitle2 {display: flex; flex-flow: column;}');
    addStyle('.MTFlexGridTitleRow { font-size: 16px; font-weight: 600; height: 56px; position: sticky; top: 0; ' + panelBackground + '}');
    addStyle('.MTFlexGridTitleCell, .MTFlexGridTitleCell2 { ' + bdrb + '}');
    addStyle('.MTFlexGridTitleCell2 { text-align: right;}');
    addStyle('.MTFlexGridTitleInd {display: inline-block; width: 10px;height: 10px; margin-right: 8px;border-radius:100%;}');
    addStyle('.MTFlexGridTitleCell:hover, .MTFlexGridTitleCell2:hover, .MTFlexGridDCell:hover, .MTFlexGridSCell:hover, .MThRefClass2:hover, .MThRefClass:hover, .MTSideDrawerDetail4:hover {cursor:pointer; color: rgb(50, 170, 240);}');
    addStyle('.MTFlexGridRow { font-size: 16px; font-weight: 600; height: 44px; vertical-align: bottom;}');
    addStyle('.MTFlexSpacer, .MTFlexSpacer3 {width: 100%; margin-top: 3px; margin-bottom: 3px; ' + bdrb + '}');
    addStyle('.MTFlexGridItem { font-size: 14px;height: 30px;}');
    addStyle('.MTFlexGridItem:hover { ' + selectBackground + '}');
    addStyle('.MTFlexGridHCell, .MTFlexGridHCell2 { font-size: 15px;}');
    addStyle('.MTFlexGridHCell2 { text-align: right;}');
    addStyle('.MTFlexGridDCell, .MTFlexGridD3Cell, .MThRefClass, .MThRefClass2 {' + standardText +' }');
    addStyle('.MThRefClass2 {font-family: MonarchIcons, "Oracle", sans-serif;}');
    addStyle('.MTFlexGridDCell2 { text-align: right; }');
    addStyle('.MTFlexGridSCell,.MTFlexGridS3Cell, .MTFlexGridSCell2 {  background-color: ' + detailLine + ';height: 34px;' + standardText + ' font-weight: 600; }');
    addStyle('.MTFlexGridSCell2 { text-align: right !important;}');
    addStyle('.MTFlexCardBig, .MTFlexBig {font-size: 20px; ' + standardText + 'font-weight: 500; padding-top: 8px;}');
    addStyle('.MTFlexBig {font-size: 18px !important;}');
    addStyle('.MTFlexSmall, .MTFlexLittle {font-size: 12px;' + panelText + 'font-weight: 600; padding-top: 8px; text-transform: uppercase; line-height: 150%; letter-spacing: 1.2px;}');
    addStyle('.MTFlexLittle {font-size: 10px !important;}');
    addStyle('.MTFlexCellArrow, .MTTrendCellArrow, .MTTrendCellArrow2 {' + panelBackground + standardText + 'width: 27px; height: 24px; font-size: 18px; font-family: MonarchIcons, sans-serif; transition: 0.1s ease-out; cursor: pointer; border-radius: 100%; border-style: none;}');
    addStyle('.MTFlexCellArrow:hover {border: 1px solid ' + sidepanelBackground + '; box-shadow: rgba(8, 40, 100, 0.1) 0px 1px 2px;}');
    addStyle('.MTSideDrawerRoot {position: absolute;  inset: 0px;  display: flex;  -moz-box-pack: end;  justify-content: flex-end;}');
    addStyle('.MTSideDrawerContainer {overflow: hidden; padding: 12px; width: 640px; -moz-box-pack: end; ' + sidepanelBackground + ' position: relative; overflow:auto;}');
    addStyle('.MTSideDrawerMotion {display: flex; flex-direction: column; transform:none;}');
    addStyle('.MTInputDesc {padding-bottom: 20px; padding-top: 10px; display: grid;}');
    addStyle('.MTSideDrawerHeader { ' + standardText + ' padding: 12px; }');
    addStyle('.MTSideDrawerItem { font-size: 14px;  padding-top: 8px;  place-content: stretch space-between;  display: flex;');
    addStyle('.MTSideDrawerItem2 { padding-top: 0px !important;');
    addStyle('.MTSideDrawerDetail { ' + standardText + ' width: 24%; text-align: right; font-size: 13px; }');
    addStyle('.MTSideDrawerDetail2, .MTSideDrawerDetail4 { ' + standardText + ' width: 24%; text-align: right; font-size: 12px; }');
    addStyle('.MTSideDrawerDetail3 { ' + standardText + ' width: 13px; text-align: center; font-size: 13px; font-family: MonarchIcons, sans-serif !important; }');
    addStyle('.MTdropdown a:hover {' + selectBackground + selectForground + ' }');
    addStyle('.MTFlexdown, .MTdropdown {float: right;  position: relative; display: inline-block; font-weight: 200;}');
    addStyle('.MTFlexdown-content div {font-size: 0px; line-height: 2px; background-color: #ff7369;}');
    addStyle('.MTFlexdown-content {' + panelBackground + standardText + ';display:none; margin-top: 12px; padding: 12px; position: absolute; min-width: 270px; overflow: auto;' + bdr + bs + '8px ; right: 0; z-index: 1;}');
    addStyle('.MTFlexdown-content a {' + panelBackground + standardText + ';font-size: 16px; text-align: left; border-radius: 4px; font-weight: 200; padding: 10px 10px; display: block;}');
    addStyle('.show {display: block;}');
    addStyle('.MTBudget {margin-top: 20px;font-size: 14px;');
    addStyle('.MTBudget2 {float: right;}');
    addStyle('.Toast__Root-sc-1mbc5m5-0 {display: ' + getDisplay(getCookie("MT_HideToaster",false),'block;') + '}');
    addStyle('.ReportsTooltipRow__Diff-k9pa1b-3 {display: ' + getDisplay(getCookie("MT_HideTipDiff",false),'block;') + '}');
    addStyle('.AccountNetWorthCharts__Root-sc-14tj3z2-0 {display: ' + getDisplay(getCookie("MT_HideAccountsGraph",false),'block;') + '}');
    addStyle('.tooltip {position: relative; display: inline-block;}');
    addStyle('.tooltip .tooltiptext {  visibility: hidden;  width: 120px;  background-color: black;  color: #fff;  text-align: center; border-radius: 6px;  padding: 5px 0;  position: absolute;  z-index: 1;  bottom: 1.5em; margin-left: -150px;}');
    addStyle('.tooltip .tooltiptext::after {  content: "";  position: absolute; top:100%; left: 50%; margin-left: -5px;  border-width: 5px; border-style: solid; border-color: black transparent transparent transparent;}');
    addStyle('.tooltip:hover .tooltiptext {visibility: visible; opacity: 1;}');
}

function MM_MenuFix() {

    const wbs = ['/advice','/investments','/objectives','/recurring','/plan'];
    const cks = ['MT_Advice','MT_Investments','MT_Goals','MT_Recurring','MT_Budget'];
    const divs = document.querySelectorAll('[class*="NavLink-sc"]');
    for (const div of divs) {
        let j = startsInList(div.pathname,wbs);
        if(j > 0) { j-=1;getCookie(cks[j],true) == 1 ? div.style.display = 'none' : div.style.display = '';}
    }
    debug = getCookie('MT_Debug',true);
}

function MM_RefreshAll() {
    if (getCookie('MT:LastRefresh',false) != getDates('s_FullDate')) {
        if(getCookie('MT_RefreshAll',true) == 1) {refreshAccountsData();}}}

function MM_hideElement(qList,InValue,inStartsWith) {
    const els = document.querySelectorAll(qList);
    for (const el of els) { if(inStartsWith == null || el.innerText.startsWith(inStartsWith)) {InValue == 1 ? el.style.display = 'none' : el.style.display = '';}}
}

function MM_flipSideElement(inCookie) {
    flipCookie(inCookie,1);
    const cv = getCookie(inCookie,true);
    MM_hideElement('div.MTSideDrawerItem2',cv);
    return cv;
}

// [ Flex Queue MF_ Called externally, MT_ used internally]
function MF_SetupDates() {

    let ckd = getCookie(MTFlex.Name + 'LowerDate',false);
    if(MTFlex.TriggerEvent == 2) {
        if(ckd == '') ckd = 'd_StartofMonth';
        if(ckd.startsWith('d_')) {MTFlexDate1 = getDates(ckd);} else {MTFlexDate1 = unformatQueryDate(ckd);}
    }
    ckd = getCookie(MTFlex.Name + 'HigherDate',false);
    if(ckd == '') ckd = 'd_Today';
    if(ckd.startsWith('d_')) {MTFlexDate2 = getDates(ckd);} else {MTFlexDate2 = unformatQueryDate(ckd);}
}

function MF_QueueAddTitle(p) {
    if(p.isHidden == undefined || p.isHidden == null) {p.isHidden = false;}
    MTFlexTitle.push({"Col": p.Column, "Title": p.Title,"isSortable": p.isSortable, "Width": p.Width, "Format": p.Format, "FormatExtended": [], "ShowPercent": p.ShowPercent, "ShowPercentShade": p.ShowPercentShade, "ShowSort": p.ShowSort, "isHidden": p.isHidden, "Indicator": p.Indicator});
    MTFlexTitle.sort((a, b) => (a.Col - b.Col));}

function MF_QueueAddRow(p) {
    MTFlexCR = MTFlexRow.length;
    if(p.PK == undefined || p.PK == null) {p.PK = '';}
    if(p.SK == undefined || p.SK == null) {p.SK = '';}
    MTFlexRow.push({"Num": MTFlexCR, "isHeader": p.isHeader, "SummaryOnly": p.SummaryOnly, "BasedOn": p.BasedOn, "IgnoreShade": p.IgnoreShade, "Section": p.Section, "PK": p.PK, "SK": p.SK, "UID": p.UID,"PKHRef": p.PKHRef, "PKTriggerEvent": p.PKTriggerEvent, "SKHRef": p.SKHRef, "SKTriggerEvent": p.SKTriggerEvent, "Icon": p.Icon });
    for (let j = 1; j < MTFlexTitle.length; j += 1) {if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][MTFields+j] = 0;}}}

function MF_QueueAddCard(p) {
    MTFlexCard.push({"Col": p.Col, "Title": p.Title,"Subtitle": p.Subtitle, "Style": p.Style});}

async function MF_GridInit(inName, inDesc) {

    document.body.style.cursor = "wait";
    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        let div = cec('div','MTWait',topDiv);
        div = cec('div','MTWait2',div,'Please Wait');
        div = cec('p','',div,' Loading ' + inDesc + ' ...');
    }
    MTFlex = [];MTFlexTitle = [];MTFlexRow = []; MTFlexCR = 0;MTFlexCard = [];
    MTSpawnProcess = 0;MTFlex.Name = inName;
    MTFlex.Button1 = getCookie(inName + 'Button1',true);
    MTFlex.Button2 = getCookie(inName + 'Button2',true);
    MTFlex.Button3 = getCookie(inName + 'Button3',false);
    MTFlex.Button4 = getCookie(inName + 'Button4',true);
    MTFlex.RequiredCols = [];
    await buildCategoryGroups();
}

function MF_GridOptions(Num,Options) {

    const buttonName = 'Button' + Num;
    MTFlex[`${buttonName}Options`] = Options;
    if (MTFlex[buttonName] >= MTFlex[`${buttonName}Options`].length) { MTFlex[buttonName] = 0; }
}

function MF_GridDraw(inRedraw) {

    removeAllSections('div.MTWait');
    removeAllSections(['div.MTFlexContainer','table.MTFlexGrid'][inRedraw]);
    if(inRedraw == false) {MT_GridDrawContainer();}
    MT_GridDrawSort();
    MT_GridDrawDetails();
    MT_GridDrawExpand();
    if(inRedraw == false) {MT_GridDrawCards();}
    document.body.style.cursor = "";
}

function MT_GridDrawDetails() {

    let el = null, elx = null;
    let Header = null, pct = null;
    let useDesc = '', useStyle = '', useStyle2 = '';
    let useValue = 0, useValue2 = '', workValue = 0;
    let rowNdx = 0, RowI = 0, RecsInc = 0;
    let Subtotals = [], Grouptotals = [], SubtotalsNdx = 0;
    let FontFamily = getCookie('MT_MonoMT',false);
    if(FontFamily && FontFamily != 'System') {FontFamily = 'font-family: ' + FontFamily + ';';}
    if(MTFlex.TableStyle) FontFamily = FontFamily + MTFlex.TableStyle;
    let hide = getChecked(MTFlex.Button3,'');
    MTFlexSum = [0,0];

    MT_GridDrawClear();
    MT_GridDrawTitles();
    for (RowI = 0; RowI < MTFlexRow.length; RowI += 1) {
        MT_GridDrawRow(false);
        if (RowI == MTFlexRow.length -1) {
             MT_GridDrawRow(true);
        } else if (MTFlexRow[RowI].Section != MTFlexRow[RowI+1].Section || MTFlexRow[RowI].PK != MTFlexRow[RowI+1].PK ) {
            if(RecsInc > 0) {MT_GridDrawRow(true);}
            MT_GridDrawClear();
        }
    }

    function MT_GridDrawClear() {RecsInc = 0; for (let j=0; j < MTFlexTitle.length; j += 1) {Grouptotals[j] = null;}}

    function MT_GridDrawTitles() {

        Header = cec('table','MTFlexGrid',MTFlexDetails,'','',FontFamily);
        if(MTFlex.HideDetails == true) return;
        el = cec('tr','MTFlexGridTitleRow',Header);
        for (RowI = 0; RowI < MTFlexTitle.length; RowI += 1) {
            if(MTFlexTitle[RowI].isHidden != true) {
                if(MTFlexTitle[RowI].Format > 0) {useStyle = 'MTFlexGridTitleCell2'; } else {useStyle = 'MTFlexGridTitleCell'; }
                if(MTFlexTitle[RowI].Indicator != null) {
                    elx = cec('td',useStyle,el,'','','','Column',RowI.toString());
                    cec('div','MTFlexGridTitleInd',elx,'','','background-color: ' + MTFlexTitle[RowI].Indicator + ';');
                    cec('div',useStyle,elx,MTFlexTitle[RowI].Title + ' ' + MTFlexTitle[RowI].ShowSort,'','display: inline-block; border-bottom: 0px;','Column',RowI.toString());
                } else {
                    elx = cec('td',useStyle,el,MTFlexTitle[RowI].Title + ' ' + MTFlexTitle[RowI].ShowSort,'','','Column',RowI.toString());
                }
                if(MTFlexTitle[RowI].Width != '') {elx.style = 'width: ' + MTFlexTitle[RowI].Width;}
            }
        }
        if(MTFlex.TriggerEvents) { elx = cec('td','',el);}
    }

    function MT_GridDrawRow(isSubTotal) {

        let useRow = Object.assign({}, MTFlexRow[RowI]);

        if(isSubTotal == false) {
            if (MTFlex.RequiredCols.length > 0) {
                let allow = false;
                for (const cI of MTFlex.RequiredCols) {
                    const value = useRow[cI + MTFields];
                    if (value != null) {
                        const format = MTFlexTitle[cI].Format;
                        if ((format > 0 && value !== 0) || (format <= 0 && value !== '')) {allow = true; break;}
                    }
                }
                if (!allow) return;
            }
            RecsInc +=1;
            useDesc = useRow[MTFields];
            if(useRow.isHeader == true) {
                if(useRow.SummaryOnly == true) { el = cec('tr','MTFlexGridRow',Header,'','','');useDesc = '  ' + useDesc;
                } else { el = cec('tr','MTFlexGridRow',Header,'','','','MTsection',useRow.Section);useDesc = ' ' + useDesc;}
                useStyle = 'MTFlexGridHCell';
                Subtotals[SubtotalsNdx] = RowI;
                SubtotalsNdx+=1;
            } else {
                if(MTFlex.HideDetails == true) css_cec = true;
                MT_DrawLine();
                el = cec('tr','MTFlexGridItem',Header,'','','','MTsection',useRow.Section);
                useStyle = 'MTFlexGridDCell';
                if(useRow.Icon) {useDesc = useRow.Icon + ' ' + useDesc;}
            }
            if(useRow.SKHRef) {
                elx = cec('td',useStyle,el);
                elx = cec('a',useStyle,elx,useDesc,useRow.SKHRef);
            } else {
                cec('td', useRow.isHeader ? 'MThRefClass2' : useStyle, el, useDesc,'','');
            }
        } else {
            if(useRow.isHeader == true || MTFlex.Subtotals != true) {return;}
            for (let j = 0; j < MTFlexTitle.length; j += 1) {useRow[MTFields + j + 1] = Grouptotals[j];}
            for (let j = 0; j < MTFlexTitle.length; j += 1) {
                if(MTFlexTitle[j].FormatExtended.length == 2) { MT_GridDrawRowSub(j,MTFlexTitle[j].FormatExtended[0],MTFlexTitle[j].FormatExtended[1]); }
            }
            useRow.IgnoreShade = true;
            useDesc = useRow.PK;if(MTFlex.PKSlice) {useDesc = useDesc.slice(MTFlex.PKSlice);}
            MT_DrawLine();
            el = cec('tr','MTFlexGridItem',Header,'','','','MTsection',useRow.Section);
            if(useRow.PKHRef) {
                elx = cec('td','MTFlexGridSCell',el);
                elx = cec('a','MTFlexGridDCell',elx,useDesc,useRow.PKHRef);
            } else {
                elx = cec('td',MTFlex.HideDetails == true ? 'MTFlexGridDCell' : 'MTFlexGridS3Cell',el,useDesc);
            }
            MTFlex.HideDetails == true ? useStyle = 'MTFlexGridDCell' : useStyle = 'MTFlexGridSCell';
        }

        useStyle = useStyle + '2';
        for (let j = 1; j < MTFlexTitle.length; j += 1) {
            if(MTFlexTitle[j].isHidden != true) {
                useValue = useRow[j + MTFields];
                let aE = '';
                switch(MTFlexTitle[j].Format) {
                    case -1:
                        useValue2 = getMonthName(useValue,2);break;
                    case 1:
                        useValue2 = getDollarValue(useValue,false);aE = ' fs-exclude';break;
                    case 2:
                        useValue2 = getDollarValue(useValue,true);aE = ' fs-exclude';break;
                    default:
                        useValue2 = useValue;
                }
                if(MTFlexTitle[j].Format < 1) {
                    cec('td', isSubTotal ? useStyle : 'MTFlexGridD3Cell', el, useValue2);
                } else {
                    useStyle2 = '';
                    if((MTFlexTitle[j].ShowPercent) > 0) {
                        switch (MTFlexTitle[j].ShowPercent) {
                            case 1:
                                pct = MT_GridPercent(useRow[j + MTFields - 2],useRow[j + MTFields - 1],MTFlexTitle[j].ShowPercentShade,1,useRow.IgnoreShade);
                                break;
                            case 3:
                                pct = MT_GridPercent(useRow[j + MTFields - 5],useRow[j + MTFields - 1],MTFlexTitle[j].ShowPercentShade,1,useRow.IgnoreShade);
                                break;
                            case 2:
                                rowNdx = useRow.BasedOn -1;
                                rowNdx = Subtotals[rowNdx];
                                if(MTFlexRow[rowNdx] != undefined) {
                                    workValue = MTFlexRow[rowNdx][j + MTFields];
                                    pct = MT_GridPercent(workValue,useValue,MTFlexTitle[j].ShowPercentShade,2,useRow.IgnoreShade);
                                } else {
                                    console.log('undefined',rowNdx,useRow.BasedOn,MTFlexTitle[j].Title);
                                }
                                break;
                        }
                        useValue2 = useValue2 + ' ' + pct[0];
                        useStyle2 = pct[1];
                    }
                    if(useStyle2 == '') { useStyle2 = MT_GridDrawEmbed(useRow.Section,j,useValue,useDesc);}
                    if(useStyle2) {elx = cec('td',useStyle + aE,el,useValue2,'',useStyle2);} else {elx = cec('td',useStyle + aE,el,useValue2);}
                    if(useRow[j + MTFields] != null) { Grouptotals[j-1] += useValue; }
                }
            }
        }

        if(MTFlex.TriggerEvents) {
            elx = cec('td','',el,'','','width: 34px; padding-left: 4px;');
            if ((isSubTotal && useRow.PKTriggerEvent) || (!isSubTotal && useRow.SKTriggerEvent)) {
                elx = cec('button', 'MTFlexCellArrow', elx);
                const triggerEvent = isSubTotal ? useRow.PKTriggerEvent : useRow.SKTriggerEvent;
                cec('span', 'MTFlexCellArrow', elx, '', '', '', 'triggers', triggerEvent + '/');
            }
        }

        if(isSubTotal == true && MTFlex.HideDetails != true) {cec('tr','MTSpacerClassTR',Header,'','','height: 12px;','MTsection',useRow.Section);}
        css_cec = false;

        function MT_DrawLine() {
            let el2 = cec('tr','MTSpacerClassTR',Header,'','',MTFlex.HideDetails != true ? 'height: 4px;' : '','MTsection',useRow.Section);
            el2 = cec('td','',el2,'','','','colspan',MTFlexTitle.length);
            cec('div','MTFlexSpacer',el2,'','',hide);
        }

        function MT_GridDrawRowSub(inColumn,inStart,inEnd) {
            let useValue = 0,useCols = 0;
            for ( let j = inStart; j <= inEnd; j += 1) {
                if(MTFlexTitle[j].isHidden == false && useRow[MTFields + j] != null ) {
                    useCols +=1; useValue = useValue + useRow[MTFields + j];
                }
            }
            if(useCols > 0) {useRow[MTFields + inColumn] = useValue / (useCols);} else {useRow[MTFields + inColumn] = 0;}
        }
    }
}

function MT_GridDrawExpand() {

    const trS = document.querySelectorAll('tr[MTsection]');
    let x = null, xBefore = null, cv = null;
    trS.forEach((tr) => {
        x = Number(tr.getAttribute('MTsection'));
        if(tr.className == 'MTFlexGridRow') {
            cv = getCookie(MTFlex.Name + 'Expand' + (x+1),true);
            if(cv == 1) {tr.firstChild.innerText = ' ' + tr.firstChild.innerText.slice(2);} else {tr.firstChild.innerText = ' ' + tr.firstChild.innerText.slice(2);}
        } else {
            if(x != xBefore) {
                cv = getCookie(MTFlex.Name + 'Expand' + x,true);
                cv == 1 ? tr.style.display = 'none' : tr.style.display = '';
            }
        }
    });
}

function MT_GridDrawSort() {

    let cn = MTFlex.Name + 'Sort' + (MTFlex.SortSeq ? MTFlex.SortSeq[MTFlex.Button2] : '');
    let useSort = getCookie(cn, true);
    useSort = Math.abs(useSort) >= MTFlexTitle.length ? 0 : useSort;
    const useCol = MTFields + Math.abs(useSort);

    MTFlexRow.forEach(row => {row.SK = row[useCol]; });
    MTFlexTitle.forEach((title, i) => {title.ShowSort = (i == useSort) ? '▲' : (i == Math.abs(useSort)) ? '▼' : '';});

    const sortable = MTFlexTitle[useCol - MTFields].isSortable;
    MTFlexRow.sort((a, b) => {
        const sectionDifference = a.Section - b.Section || a.PK.localeCompare(b.PK);
        const sortValue = useSort < 0 ? -1 : 1;
        switch (sortable) {
            case 1:
                return sectionDifference || sortValue * (a.SK.localeCompare(b.SK));
            case 2:
                return sectionDifference || sortValue * (b.SK - a.SK);
            default:
                return sectionDifference;
        }
    });
}

function MT_GridDrawContainer() {

    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        let div2 = document.createElement('div');
        div2.className = 'MTFlexContainer';
        topDiv.prepend(div2);
        let div = cec('div','',div2);
        MTFlexDetails = cec('div','MTFlexContainerPanel',div);
        let cht = cec('div','MTFlexContainerCard',MTFlexDetails);

        div = cec('div','MTFlexTitle',cht);
        div = cec('div','MTFlexTitle2',div);
        div2 = cec('span','MTFlexSmall',div,MTFlex.Title1);
        if(MTFlex.TriggerEvent > 0) { div2 = cec('a','MTFlexBig MThRefClass',div,MTFlex.Title2); } else {div2 = cec('span','MTFlexBig',div,MTFlex.Title2);}
        div2 = cec('span','MTFlexLittle',div,MTFlex.Title3);

        let tbs = cec('span','MTFlexButtonContainer',cht);

        div2 = cec('span','',tbs,'','','height: 38px; display: block; align-content: end;');
        MTFlex.bub = cec('div','MTBub',div2,'','','display: none;');
        MTFlex.bub5 = cec('div','MTBub1',MTFlex.bub);
        MTFlex.bub2 = cec('div','MTBub1',MTFlex.bub);
        MTFlex.bub1 = cec('div','MTBub1',MTFlex.bub);
        div2 = cec('div','MTdropdown',tbs);
        div2 = cec('button','MTFlexButtonExport',div2,'Export ');

        if(MTFlex.Button4Options != null && MTFlex.Button4Options.length > 0) {
            div2 = cec('div','MTdropdown',tbs);
            div2 = cec('button','MTFlexButton4',div2,MTFlex.Button4Options[MTFlex.Button4] + ' ');
            let divContent = cec('div','MTFlexdown-content',div2,'','','','id','MTDropdown4');
            for (let i = 0; i < MTFlex.Button4Options.length; i++) { div2 = cec('a','MTButton4',divContent,MTFlex.Button4Options[i],'','','MTOption',i); }
        }
        if(MTFlex.Button1Options != null && MTFlex.Button1Options.length > 0) {
            div2 = cec('div','MTdropdown',tbs);
            div2 = cec('button','MTFlexButton1',div2,MTFlex.Button1Options[MTFlex.Button1] + ' ');
            let divContent = cec('div','MTFlexdown-content',div2,'','','','id','MTDropdown1');
            for (let i = 0; i < MTFlex.Button1Options.length; i++) { div2 = cec('a','MTButton1',divContent,MTFlex.Button1Options[i],'','','MTOption',i); }
        }
        if(MTFlex.Button2Options != null && MTFlex.Button2Options.length > 0) {
            div2 = cec('div','MTdropdown',tbs);
            div2 = cec('button','MTFlexButton2',div2,MTFlex.Button2Options[MTFlex.Button2] + ' ');
            let divContent = cec('div','MTFlexdown-content',div2,'','','','id','MTDropdown2');
            for (let i = 0; i < MTFlex.Button2Options.length; i++) { div2 = cec('a','MTButton2',divContent,MTFlex.Button2Options[i],'','','MTOption',i); }
        }
        div2 = cec('div','MTdropdown',tbs);
        div2 = cec('label','',div2,'Compress Grid','','margin-top: 10px; font-size: 14px; font-weight:500;display: inline-block;','htmlFor','CompressGrid');
        div2 = cec('input','MTFlexCheckbox',div2,'','','margin-top: 2px;','id','CompressGrid');
        div2.type = 'checkbox';if(MTFlex.Button3 == 'true') {div2.checked = 'true';}
    }
}

function MT_GridDrawCards() {

    if(MTFlexCard.length == 0) {return;}
    let topDiv = document.querySelector('[class*="Scroll__Root-sc"]');
    if(topDiv) {
        MTFlexCard.sort((a, b) => (a.Col - b.Col));
        let div = document.createElement('div');
        div.className = 'MTFlexContainer';
        div.style = 'padding-bottom: 0px;';
        topDiv.prepend(div);
        topDiv = cec('div','MTFlexContainer2',div);
        for (let i = 0; i < MTFlexCard.length; i++) {
            let div2 = cec('div','MTFlexContainerCard',topDiv,'','','flex-flow: column;');
            cec('span','MTFlexCardBig fs-exclude',div2,MTFlexCard[i].Title,'',MTFlexCard[i].Style);
            cec('span','MTFlexSmall',div2,MTFlexCard[i].Subtitle,'','text-align:center');
        }
    }
}
function MT_GridPercent(inA, inB, inHighlight, inPercent, inIgnoreShade) {

    if(isNaN(inA)) {inA = 0;}
    if(isNaN(inB)) {inB = 0;}

    let p = ['', ''];
    if (inA === 0 && inB === 0) return p;

    p[0] = inA > 0 ? (inPercent === 1 ? (inB - inA) / inA : Math.max(inB / inA, 0)) : 1;
    p[0] = Math.round(p[0] * 1000) / 10;

    if (inHighlight && !inIgnoreShade) {
        if (p[0] > 100) p[1] = 'background-color: #f7752d; color: black;';
        else if (p[0] > 50) p[1] = 'background-color: #f89155; color: black;';
        else if (p[0] > 25) p[1] = 'background-color: #fde0cf; color: black;';
        if (p[1]) p[1] += 'border-radius: 6px;';
    }

    p[0] = (p[0] > 1000) ? '(>1,000%)' : (p[0] < -1000) ? '(<1,000%)' : ` (${p[0].toFixed(1)}%)`;
    return p;
}

function MT_GridExport() {

    const CRLF = String.fromCharCode(13,10),c = ',';
    const MTFieldsEnd = MTFields + MTFlexTitle.length;
    let csvContent = '',useValue = '',k = 0,Cols = 0;

    for (const Title of MTFlexTitle) {
        if(Title.isHidden == false) {
            Cols+=1;
            if(MTFlex.HideDetails != true) csvContent = csvContent + '"' + Title.Title + '"' + c;
        }
    }
    if(MTFlex.HideDetails != true) {
        csvContent = csvContent + CRLF;
        for (let i = 0; i < MTFlexRow.length; i += 1) {
            if(i > 0 && MTFlexRow[i].Section != MTFlexRow[i-1].Section) { csvContent = csvContent + c + CRLF; }
            k = 0;
            for (let j = MTFields; j < MTFieldsEnd; j += 1) {
                if(MTFlexTitle[k].isHidden == false) {
                    useValue = '';
                    if(MTFlexRow[i][j] != undefined) {
                        switch(MTFlexTitle[k].Format) {
                            case 1: useValue = Number(MTFlexRow[i][j]).toFixed(2); break;
                            case 2: useValue = Math.round(Number(MTFlexRow[i][j])).toFixed(0); break;
                            default: useValue = MTFlexRow[i][j];
                        }
                    }
                    csvContent = csvContent + useValue + c;
                }
                k+=1;
            }
            csvContent = csvContent + CRLF;
        }
    } else {
        const spans = document.querySelectorAll('td.MThRefClass2,td.MTFlexGridHCell2,td.MTFlexGridS3Cell,td.MTFlexGridDCell2');
        let j=0;
        spans.forEach(span => {
            if(span.className == 'MThRefClass2') { useValue = span.innerText.slice(2);csvContent = csvContent + CRLF;} else {useValue = span.innerText;}
            j=j+1;csvContent = csvContent + '"' + useValue + '"';
            if(j == Cols) { j=0;csvContent = csvContent + CRLF;} else {csvContent = csvContent + c;}
        });
    }
    downloadFile( MTFlex.Title1 +' - ' + MTFlex.Title2,csvContent);
}

function MT_GridDrawEmbed(inSection,inCol,inValue, inDesc) {
    switch (MTFlex.Name) {
        case 'MTTrends':
            if(MTFlex.Option2 < 3) {
                if((inSection == 2) && (inCol == 3 || inCol == 6)) {if(inValue > 0) {return css_green;}}
                if((inSection == 4) && (inCol == 3 || inCol == 6)) {if(inValue < 0) {return css_green;}}
            }
            break;
        case 'MTAccounts':
            if(MTFlex.Button2 == 0) {
                if (inSection == 2 && inCol == 9) {return inValue < 0 ? css_red : inValue > 0 ? css_green : '';}
                if (inSection == 2 && inCol == 11 && inValue < 0) {return css_red;}
                if (inSection == 4 && inCol == 9) {return inValue > 0 ? css_red : inValue < 0 ? css_green : '';}
                if (inSection == 4 && inCol == 11 && inValue < 0) {return css_red;}
            }
            break;
    }
    return '';
}

function MT_GetInput(inputs) {

    let topDiv = MF_SidePanelOpen('','', false, MTFlex.Title1, '','','');
    let div = cec('span','MTSideDrawerHeader',topDiv,'','');
    for (let i = 0; i < inputs.length; i += 1) {
        let div2 = cec('div','MTInputDesc',div);
        cec('div','',div2,inputs[i].NAME,'','font-weight: 600;padding: 6px;');
        let div3 = cec('input','MTInputClass',div2,'','','','type',inputs[i].TYPE);
        div3.value = inputs[i].VALUE;
        if(i == inputs.length-1) {
            div2 = cec('div','MTdropdown',div2);
            div2 = cec('label','',div2,"Always use today's date",'','margin-top: 10px; font-size: 14px; font-weight: 600; display: inline-block;','htmlFor','TodayDate');
            div2 = cec('input','MTDateCheckbox',div2,'','','margin-top: 2px;','id','TodayDate');
            div2.type = 'checkbox';if(getCookie(MTFlex.Name + 'HigherDate',false) == 'd_Today') {div2.checked = true;}
        }

    }
    div = cec('span','MTSideDrawerHeader',topDiv,'','');
    cec('button','MTInputButton',div,'Last Month','','float:left;margin-left: 0px;');
    cec('button','MTInputButton',div,'This Month','','float:left;');
    cec('button','MTInputButton',div,'Apply','','float:right;');
    cec('button','MTInputButton',div,'Cancel','','float:right;' );
}

function MF_SidePanelOpen(inType, inType2, inToggle, inBig, inSmall, inURLText, inURL ) {

    let topDiv = document.getElementById('root');
    if(topDiv) {
        topDiv = topDiv.childNodes[0];
        let div = cec('div','MTHistoryPanel',topDiv);
        let div2 = cec('div','MTSideDrawerRoot',div,'','','','tabindex','0');
        let div3 = cec('div','MTSideDrawerContainer',div2);
        let div4 = cec('div','MTSideDrawerMotion',div3,'','','','grouptype',inType);
        if(inType2) {div4.setAttribute('groupsubtype',inType2);}
        div = cec('span','MTSideDrawerHeader',div4);
        cec('button','MTTrendCellArrow',div,'','','float:right;');
        if(inToggle == true) {cec('button','MTTrendCellArrow2',div,['',''][getCookie(MTFlex.Name + '_SidePanel',true)],'','float:right;margin-right: 16px;');}
        cec('div','MTFlexCardBig',div,inBig);
        div = cec('span','MTSideDrawerHeader',div4);
        cec('div','MTFlexSmall',div, inSmall,'','float:right;');
        cec('a','MTFlexGridDCell',div,inURLText,inURL);
        return div4;
    }
}

function MF_GridUpdateUID(inUID,inCol,inValue,addMissing) {

    for (const Row of MTFlexRow) {if(Row.UID == inUID) {Row[MTFields + inCol] = inValue;return true;}}
    if(addMissing == true) {
        let p = [];
        p.UID = inUID;
        MF_QueueAddRow(p);
        MTFlexRow[MTFlexCR][MTFields + inCol] = inValue;
    }
    return false;
}

function MF_GridRollup(inSection,inRoll,inBasedOn,inName) {

    if(MTFlexRow.length == 0) {return;}
    let Subtotals = [];
    for (let i = 0; i < MTFlexTitle.length; i += 1) {Subtotals[i] = 0;}
    for (let i = 0; i < MTFlexRow.length; i += 1) {
         if(MTFlexRow[i].Section == inRoll) {
             for (let j = 1; j < MTFlexTitle.length; j += 1) { if(MTFlexTitle[j].Format > 0) {Subtotals[j] += MTFlexRow[i][MTFields + j];} }
    }}
    MTP = [];
    MTP.isHeader = true; MTP.IgnoreShade = true;MTP.Section = inSection;MTP.BasedOn = inBasedOn;MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][MTFields] = inName;
    for (let j = 1; j < MTFlexTitle.length; j += 1) {
        if(MTFlexTitle[j].Format > 0) {MTFlexRow[MTFlexCR][MTFields+j] = Subtotals[j];} else {MTFlexRow[MTFlexCR][MTFields+j] = '';}
    }
}

function MF_GridRollDifference(inSection,inA,inB,inBasedOn,inName,inOp) {

    let p1 = null, p2 = null;
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inA) {p1 = i;}
        if(MTFlexRow[i].Section == inB) {p2 = i;}
    }
    if(p1 == null || p2 == null) {return;}
    MTP = [];
    MTP.isHeader = true; MTP.IgnoreShade = true; MTP.Section = inSection; MTP.BasedOn = inBasedOn; MTP.SummaryOnly = true; MF_QueueAddRow(MTP);
    MTFlexRow[MTFlexCR][MTFields] = inName;
    for (let j = 1; j < MTFlexTitle.length; j += 1) {
        if(MTFlexTitle[j].Format > 0) {
            if(inOp == 'Add') {
                MTFlexRow[MTFlexCR][MTFields+j] = MTFlexRow[p1][MTFields+j] + MTFlexRow[p2][MTFields+j];
            } else {
                MTFlexRow[MTFlexCR][MTFields+j] = MTFlexRow[p1][MTFields+j] - MTFlexRow[p2][MTFields+j];
            }
            MTFlexRow[MTFlexCR][MTFields+j] = parseFloat(MTFlexRow[MTFlexCR][MTFields+j].toFixed(2));
        } else { MTFlexRow[MTFlexCR][MTFields+j] = ''; }
    }
}

function MF_GridGetValue(inSection,inCol) {

    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inSection) {return MTFlexRow[i][MTFields + inCol];}
    }
    return 0;
}

function MF_GridCalcDifference(inSection,in1,in2,inCols,inOp) {

    let p1 = null, p2 = null, p3 = null;

    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inSection) {p1 = i;}
        if(MTFlexRow[i].Section == in1) {p2 = i;}
        if(MTFlexRow[i].Section == in2) {p3 = i;}
    }
    if(p1 == null || p2 == null || p3 == null) {return;}
    for (let i = 0; i < inCols.length; i += 1) {
        if(inOp == 'Add') {
            MTFlexRow[p1][MTFields + inCols[i]] = MTFlexRow[p2][MTFields + inCols[i]] + MTFlexRow[p3][MTFields + inCols[i]];
        } else { MTFlexRow[p1][MTFields + inCols[i]] = MTFlexRow[p2][MTFields + inCols[i]] - MTFlexRow[p3][MTFields + inCols[i]]; }
        MTFlexRow[p1][MTFields + inCols[i]] = parseFloat(MTFlexRow[p1][MTFields + inCols[i]].toFixed(2));
    }
}
function MF_GridCalcRange(inColumn,inStart,inEnd,inOp) {

    let useValue = 0, useCols = 0;
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        useValue = 0;useCols = 0;
        for ( let j = inStart; j <= inEnd; j += 1) {
            if(MTFlexTitle[j].isHidden == false && MTFlexRow[i][MTFields + j] != null ) {
                useCols +=1;
                if(inOp == 'Sub') { useValue = useValue - MTFlexRow[i][MTFields + j]; } else { useValue = useValue + MTFlexRow[i][MTFields + j]; }
            }
        }
        if(inOp == 'Avg') {
            if(useCols > 0) {MTFlexRow[i][MTFields + inColumn] = useValue / (useCols);} else {MTFlexRow[i][MTFields + inColumn] = 0;}
            MTFlexTitle[inColumn].FormatExtended = [inStart,inEnd];
        } else { MTFlexRow[i][MTFields + inColumn] = useValue;}
    }
}

function MF_GridAddCard (inSec,inStart,inEnd,inOp,inPosMsg,inNegMsg,inPosColor,inNegColor,inAddRowTitle,inAddColTitle) {

    let useValue = 0,useCells = 0,useRow='',useCol='';
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        if(MTFlexRow[i].Section == inSec) {
            for ( let j = inStart; j <= inEnd; j += 1) {
                if(MTFlexTitle[j].isHidden == false && MTFlexRow[i][MTFields + j] != null) {
                    useCells +=1;
                    if(inOp == 'HV') {
                        if(useValue == 0 || MTFlexRow[i][MTFields + j] > useValue) {useValue = MTFlexRow[i][MTFields + j];useCol = MTFlexTitle[j].Title;useRow=MTFlexRow[i][MTFields];}
                    } else {
                        if(useValue == 0 || MTFlexRow[i][MTFields + j] < useValue) {useValue = MTFlexRow[i][MTFields + j];useCol = MTFlexTitle[j].Title;useRow=MTFlexRow[i][MTFields];}
                    }
                }
            }
        }
    }
    if(useCells > 0 && useValue != 0) {
        if((useValue > 0 && inPosMsg != '') || (useValue < 0 && inNegMsg != '')) {
            let useMsg = '',useStyle='';
            if(useValue < 0) {useMsg = inNegMsg;useStyle=inNegColor;useValue = useValue * -1;} else {useMsg = inPosMsg;useStyle=inPosColor;}
            if(MTFlexTitle[inStart].Format == 2) {useValue = getDollarValue(useValue,true);} else {useValue = getDollarValue(useValue,false);}
            MTP = [];MTP.Col = MTFlexCard.length+1;
            if(inAddRowTitle) {useMsg = useMsg + inAddRowTitle + useRow;}
            if(inAddColTitle) {useMsg = useMsg + inAddColTitle + useCol;}
            MTP.Title = useValue;MTP.Subtitle = useMsg;MTP.Style = useStyle;
            MF_QueueAddCard(MTP);
            return 1;
        }
    }
    return 0;
}

// [ Reports Menu ]
function MenuReports(OnFocus) {

    if (SaveLocationPathName.startsWith('/reports/')) {
        if(OnFocus == false) {MTFlex = [];}
        if(OnFocus == true) {MenuReportsCustom();}
    }
}

function MenuReportsSetFilter(inType,inCategory,inGroup,inHidden) {

    let reportsObj = localStorage.getItem('persist:reports');
    let startDate = formatQueryDate(getDates('d_Minus3Years'));
    let endDate = formatQueryDate(getDates('d_Today'));
    if(MTFlex.Name == 'MTTags') {
        startDate = formatQueryDate(MTFlexDate1);
        endDate = formatQueryDate(MTFlexDate2);
    }
    let useCats = '';
    let useHidden = '';
    if(inHidden) {useHidden = ',\\"hideFromReports\\":' + inHidden;}
    if(inGroup) {useCats = getCategoryGroupList(inGroup);} else {useCats = '\\"' + inCategory + '\\"';}
    reportsObj = replaceBetweenWith(reportsObj,'"filters":"{','}','"filters":"{\\"startDate\\":\\"' + startDate + '\\",\\"endDate\\":\\"' + endDate + '\\",\\"categories\\":[' + useCats + ']' + useHidden + '}');
    reportsObj = reportsObj.replace('}}','}');
    reportsObj = replaceBetweenWith(reportsObj,'"groupByTimeframe":',',','"groupByTimeframe":"\\"month\\"",');
    reportsObj = replaceBetweenWith(reportsObj,'"' + inType + '":"{','}",','"' + inType + '":"{\\"viewMode\\":\\"changeOverTime\\",\\"chartType\\":\\"stackedBarChart\\"}",');
    if(inCategory) {reportsObj = replaceBetweenWith(reportsObj,'"groupBy":',',','"groupBy":"\\"category\\"",');
    } else {reportsObj = replaceBetweenWith(reportsObj,'"groupBy":',',','"groupBy":"\\"category_group\\"",');}
    localStorage.setItem('persist:reports',reportsObj,JSON.stringify(reportsObj));
}

function MenuReportsFix() {
    if(MTFlex.Name) {
        const x = inList(MTFlex.Name,FlexOptions);
        if(x > 0) {MenuReportsCustom();MenuReportsCustomUpdate(x+2);}
    }
}

function MenuReportsCustom() {

    let div = document.querySelector('[class*="ReportsHeaderTabs__Root"]');
    if(div) {
        const mItems = div.childNodes.length;
        let useClass = div.childNodes[0].className;
        useClass = useClass.replace(' tab-nav-item-active','');
        for (let i = 0; i < FlexOptions.length; i += 1) {
            if(mItems == 3) {
                cec('a','MT' + FlexOptions[i] + ' ' + useClass,div,FlexOptions[i]);
            } else {
                div.childNodes[i + 3].className = 'MT' + FlexOptions[i] + ' ' + useClass;
            }
        }
    }
}

function MenuReportsCustomUpdate(inValue) {

    let div = document.querySelector('[class*="ReportsHeaderTabs__Root"]');
    for (let i = 0; i < FlexOptions.length + 3; i += 1) {
        let useClass = div.childNodes[i].className;
        if(inValue == i) {
            if(!useClass.includes(' tab-nav-item-active')) {
                useClass = useClass + ' tab-nav-item-active';
            }
        } else {
            useClass = useClass.replace(' tab-nav-item-active','');
        }
        div.childNodes[i].className = useClass;
    }
    if(inValue < 3) {MTFlex = [];}
}

function MenuReportsPanels(inType) {

    let divs = document.querySelectorAll('[class*="FlexContainer__Root-sc"]');
    for (const div of divs) {
        if(div.innerText.startsWith('Clear')) {div.style=inType;break;}
    }
    divs = document.querySelector('[class*="Grid__GridStyled-"]');
    if(divs) {divs.style=inType;}
}

function MenuReportsGo(inName) {

    let topDiv = document.querySelector('div.MTWait');
    if(!topDiv) {
        document.body.style.cursor = "wait";
        removeAllSections('.MTFlexContainer');
        MenuReportsPanels('display:none;');
        switch(inName) {
            case 'MTTrends':
                MenuReportsCustomUpdate(3);
                MenuReportsTrendsGo();
                break;
            case 'MTAccounts':
                MenuReportsCustomUpdate(4);
                MenuReportsAccountsGo();
                break;
            case 'MTTags':
                MenuReportsCustomUpdate(5);
                MenuReportsTagsGo();
                break;
        }
    }
}

async function MenuReportsTagsGo() {

    let snapshotData4 = null,rec = null;
    let TagQueue = [],TagCols = [];
    let useID = '',useAmt = 0, useTitle='',useURL = '';
    let ii = 0;
    let CurrentFilter = '', CurrentFilterObj = [], HiddenFilter = false,hasNotes = false;

    MF_GridInit('MTTags', 'Tags');
    MTFlex.Title1 = 'Net Income Report by Tags';
    MTFlex.TriggerEvent = 2;
    MTFlex.TriggerEvents = false;
    MF_SetupDates();
    MF_GridOptions(1,['By group','By category','By both']);
    if(MTFlex.Button1 == 2) {MTFlex.Subtotals = true;}
    MF_GridOptions(2,['Ignore hidden transactions','Include hidden transactions','Only hidden transactions','Only Notes starting with *']);
    MF_GridOptions(4,getAccountGroupInfo());
    MTFlex.Title2 = getDates('s_FullDate',MTFlexDate1) + ' - ' + getDates('s_FullDate',MTFlexDate2);
    MTFlex.Title3 = '';
    MTP = [];MTP.Column = 0; MTP.Title = ['Group','Category','Group/Category'][MTFlex.Button1]; MTP.isSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(MTP);

    if(MTFlex.Button4Options.length > 1 && MTFlex.Button4 > 0) {
        CurrentFilter = getAccountGroupFilter();
        CurrentFilterObj = getAccountGroupInfo(CurrentFilter);
    }
    if(MTFlex.Button2 == 1) {HiddenFilter = null;}
    else if(MTFlex.Button2 == 2) {HiddenFilter = true;}
    else if(MTFlex.Button2 == 3) {HiddenFilter = null; hasNotes = true;}

    let recIdx = 0, recCnt = 0;
    do {
        recCnt = 0;
        snapshotData4 = await GetTransactions(formatQueryDate(MTFlexDate1),formatQueryDate(MTFlexDate2),recIdx,false,CurrentFilterObj,HiddenFilter,hasNotes);
        for (let j = 0; j < snapshotData4.allTransactions.results.length; j += 1) {
            rec = snapshotData4.allTransactions.results[j];
            recCnt+=1;recIdx+=1;
            if(MTFlex.Button2 == 3) {if(rec.notes.startsWith('*') == false) continue;}
            if(MTFlex.Button1 == 0) {useID = rec.category.group.id; } else {useID = rec.category.id;}
            useAmt = rec.amount;
            if(rec.category.group.type == 'expense') {useAmt = useAmt * -1;}
            if(MTFlex.Button2 == 3) {
                TagsUpdateQueue(useID,useAmt,rec.notes.slice(2),rec.notes.slice(2),'');
            } else {
                ii = rec.tags.length;
                if(ii == 0) { TagsUpdateQueue(useID,useAmt,'','000','');}
                else if (ii > 1) { TagsUpdateQueue(useID,useAmt,'*','001','');}
                else {TagsUpdateQueue(useID,useAmt,rec.tags[0].name,String(rec.tags[0].order+2).padStart(3, '0'),rec.tags[0].color);}
            }
        }
    } while (recCnt > 999);

    if(MTFlex.Button2 == 3) {TagCols.sort((a, b) => a.ORDER.toString().localeCompare(b.ORDER.toString(), undefined, { numeric: true }));
    } else {TagCols.sort((a, b) => a.ORDER - b.ORDER);}

    let totalCol = 0;
    for (const TagCol of TagCols) {
        switch(TagCol.NAME) {
            case '':
                useTitle = 'Untagged';break;
            case '*':
                useTitle = 'Multiple';break;
            default:
                useTitle = TagCol.NAME;
        }
        totalCol+=1;
        MTP = []; MTP.Column = totalCol; MTP.Title = useTitle; MTP.isSortable = 2; MTP.Format = 1;
        if(TagCol.COLOR) {MTP.Indicator = TagCol.COLOR;}
        MF_QueueAddTitle(MTP);
    }
    totalCol+=1;
    MTP = []; MTP.Column = totalCol; MTP.Title = 'Total'; MTP.isSortable = 2; MTP.Format = 1; MF_QueueAddTitle(MTP);

    for (const Tag of TagQueue) {
        ii = TagsIndexQueue(Tag.TagName);
        useID = Tag.ID;
        if(MF_GridUpdateUID(useID,ii+1,Tag.Amt,false) == false) {
            let retGroup = await getCategoryGroup(useID);
            if(retGroup.TYPE == 'transfer') {

            } else {
                MTP = [];
                MTP.isHeader = false;
                MTP.UID = useID;
                if(retGroup.TYPE == 'expense') {
                    if(retGroup.ISFIXED == true) {
                        MTP.BasedOn = 2;
                        MTP.Section = 4;
                    } else {
                        MTP.BasedOn = 3;
                        MTP.Section = 6;
                    }
                    useURL = '#|spending|';
                } else {
                    MTP.BasedOn = 1;
                    MTP.Section = 2;
                    useURL = '#|income|';
                }

                if(MTFlex.Button1 > 0) {
                    if(MTFlex.Button1 == 2) {
                        MTP.PK = retGroup.GROUPNAME;
                        MTP.PKHRef = useURL + '|' + retGroup.GROUP + '|';
                        MTP.PKTriggerEvent = 'category-groups/' + retGroup.GROUP;
                    }
                    MTP.SKHRef = useURL + retGroup.ID + '||';
                    MTP.SKTriggerEvent = 'categories/' + retGroup.ID;
                    useTitle = retGroup.NAME;
                } else {
                    useTitle = retGroup.GROUPNAME;
                    MTP.SKHRef = useURL + '|' + retGroup.GROUP + '|';
                    MTP.PKTriggerEvent = '';
                    MTP.SKTriggerEvent = 'category-groups/' + retGroup.GROUP;
                }
                MTP.SKHRef = MTP.SKHRef + HiddenFilter + '|';

                MTP.Icon = retGroup.ICON;
                MTP.SKExpand = '';
                MF_QueueAddRow(MTP);
                MTFlexRow[MTFlexCR][MTFields] = useTitle;
                MTFlexRow[MTFlexCR][MTFields+ii+1] = Tag.Amt;
            }
        }
    }
    MF_GridRollup(1,2,1,'Income');
    if(accountsHasFixed == false) {
        MF_GridRollup(3,4,2,'Spending');
        MF_GridRollDifference(5,1,3,1,'Savings','Sub');
        MF_GridCalcRange(totalCol,1, totalCol-1,'Add');
    } else {
        MF_GridRollup(3,4,2,'Fixed Spending');
        MF_GridRollup(5,6,3,'Flexible Spending');
        MF_GridRollDifference(7,3,5,1,'Total Spending','Add');
        MF_GridRollDifference(8,1,7,1,'Savings','Sub');
        MF_GridCalcRange(totalCol,1, totalCol-1,'Add');
    }

    MTSpawnProcess = 1;

    function TagsUpdateQueue(inID,inAmt,inTag, inOrder, inColor) {
        for (const Tag of TagQueue) {
             if(Tag.ID == inID && Tag.TagName == inTag) {
                 Tag.Amt += inAmt;
                 return;
             }
         }
        TagQueue.push({"ID": inID, "TagName": inTag ,"Amt": inAmt });
        if(TagsIndexQueue(inTag) === -1) {TagCols.push({"NAME": inTag, "ORDER": inOrder, "COLOR": inColor});}
    }

    function TagsIndexQueue(inTag) {
        for (let k = 0; k < TagCols.length; k += 1) {if(TagCols[k].NAME == inTag) return k;}
        return -1;
    }
}

async function MenuReportsAccountsGo() {

    await MF_GridInit('MTAccounts', 'Accounts');
    MTFlex.Title1 = 'Accounts Report';
    MTFlex.SortSeq = ['1','2','3','4','5','6'];
    if(MTFlex.Button2 == 0) { MTFlex.TriggerEvent = 2;} else { MTFlex.TriggerEvent = 3; }
    MTFlex.TriggerEvents = false;
    MF_SetupDates();
    MF_GridOptions(1,['Hide subtotals','Subtotal on Type','Subtotal on Group']);
    MF_GridOptions(2,['Standard Report','Personal Statement','Last 6 months with average','Last 12 months with average','This year with average','Last 3 years by Quarter']);
    MF_GridOptions(4,getAccountGroupInfo());
    MTP = [];
    if(MTFlex.Button1 > 0) MTFlex.Subtotals = true;
    if(MTFlex.Button1 == 1 || MTFlex.Button2 == 1) MTFlex.PKSlice = 2;
    if(MTFlex.Button2 == 1) {MTFlex.Subtotals = true;MTFlex.TableStyle = 'max-width: 640px;';}
    MTP.Column = 0; MTP.Title = 'Description';MTP.isSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(MTP);
    let skipHidden = getCookie('MT_AccountsHidden',true);
    let skipHidden2 = getCookie('MT_AccountsHidden2',true);
    let AccountGroupFilter = getAccountGroupFilter();
    let snapshotData5 = null;
    if(MTFlex.Button2 > 1) {await MenuReportsAccountsGoExt();} else {await MenuReportsAccountsGoStd();}
    MTSpawnProcess = 1;

    async function MenuReportsAccountsGoExt(){

        let snapshotData = null, snapshotData3 = null;
        let CurMonth = getDates('n_CurMonth',MTFlexDate2),CurYear = 0;
        let NumMonths = (MTFlex.Button2 == 2) ? 6 : 12;
        let useDate = getDates('d_Minus1Year',MTFlexDate2);
        let isToday = getDates('isToday',MTFlexDate2);
        MTFlex.Title2 = 'Last ' + NumMonths + ' Months as of ' + getDates('s_FullDate',MTFlexDate2);
        const useEOM = getCookie('MT_AccountsEOM',true);
        if(useEOM == true) { MTFlex.Title3 = '(Based on end of each month)';} else {MTFlex.Title3 = '(Based on beginning of each month)';}

        MTP.Column = 1; MTP.Title = 'Type'; MF_QueueAddTitle(MTP);
        MTP.Column = 2; MTP.Title = 'Group';MTP.Format = 0;MF_QueueAddTitle(MTP);

        if (MTFlex.Button2 == 5) {
            MTFlex.Title2 = 'Last 3 years as of ' + getDates('s_FullDate',MTFlexDate2);
            useDate = getDates('d_ThisQTRs',MTFlexDate2);
            CurMonth = useDate.getMonth();CurYear = useDate.getFullYear() - 3;
            CurMonth+=3; if(CurMonth == 12) {CurMonth = 0;CurYear+=1;}
            useDate.setFullYear(CurYear,CurMonth,1);
            for (let i = 0; i < 12; i += 1) {
                MTP.Column = i+3; MTP.Title = getMonthName(CurMonth,true) + "'" + CurYear % 100;MTP.isSortable = 2;MTP.Format = 2;MF_QueueAddTitle(MTP);
                CurMonth+=3; if(CurMonth == 12) {CurMonth = 0;CurYear+=1;}
            }
            CurMonth = useDate.getMonth();CurYear = useDate.getFullYear();
        } else {
            if(MTFlex.Button2 == 4) { NumMonths = CurMonth;MTFlex.Title2 = 'This year as of ' + getDates('s_FullDate',MTFlexDate2); }
            for (let i = 0; i < 12; i += 1) {
                if(i < (12-NumMonths)) {MTP.isHidden = true;} else {MTP.isHidden = false;}
                MTP.Column = i+3; MTP.Title = getMonthName(CurMonth,true);MTP.isSortable = 2;MTP.Format = 2;MF_QueueAddTitle(MTP);
                CurMonth+=1; if(CurMonth == 12) {CurMonth = 0;}
            }
        }
        MTFlex.RequiredCols = [3,4,5,6,7,8,9,10,11,12,13,14,15];
        MTP.isHidden = false;
        MTP.Column = 15; MTP.Title = getDates('s_ShortDate',MTFlexDate2);MF_QueueAddTitle(MTP);
        MTP.Column = 16; MTP.Title = 'Average';MF_QueueAddTitle(MTP);
        snapshotData = await getAccountsData();
        if(isToday == false) {snapshotData5 = await getDisplayBalanceAtDateData(formatQueryDate(MTFlexDate2));}
        for (let i = 0; i < snapshotData.accounts.length; i += 1) {
            if(AccountGroupFilter == '' || AccountGroupFilter == getCookie('MTAccounts:' + snapshotData.accounts[i].id,false)) {
                if(snapshotData.accounts[i].hideFromList == false || skipHidden == 0) {
                    if(snapshotData.accounts[i].includeInNetWorth == true || skipHidden2 == 0) {
                        MTP = [];
                        MTP.isHeader = false;
                        MTP.UID = snapshotData.accounts[i].id;
                        let accountName = getAccountPrimaryKey(snapshotData.accounts[i].isAsset,snapshotData.accounts[i].type.display,snapshotData.accounts[i].subtype.display);
                        MF_QueueAddRow(MTP);
                        MTFlexRow[MTFlexCR][MTFields] = snapshotData.accounts[i].displayName;
                        MTFlexRow[MTFlexCR][MTFields+1] = snapshotData.accounts[i].subtype.display;
                        MTFlexRow[MTFlexCR][MTFields+2] = accountName;
                        if(isToday == true) {
                             MTFlexRow[MTFlexCR][MTFields+15] = Number(snapshotData.accounts[i].displayBalance);
                        } else {
                            MTFlexRow[MTFlexCR][MTFields+15] = getAccountPrevBalance(MTP.UID);
                        }
                    }
                }
            }
        }
        if(debug == 1) console.log('MenuReportsAccountsGoExt',snapshotData,MTFlexRow,MTFlex);
        let workDate = null;
        for (let i = 0; i < 12; i += 1) {
            let used = false;
            if(useEOM == true) {workDate = getDates('d_EndofMonth',useDate);} else {workDate = useDate;}
            snapshotData3 = await getDisplayBalanceAtDateData(formatQueryDate(workDate));
            for (let j = 0; j < snapshotData3.accounts.length; j += 1) {
                MF_GridUpdateUID(snapshotData3.accounts[j].id,i+3,snapshotData3.accounts[j].displayBalance,false);
                if(snapshotData3.accounts[j].displayBalance != null) {used = true;}
            }
            if(MTFlex.Button2 == 5) {
                if(used == false) {MTFlexTitle[i+3].isHidden = true;}
                CurMonth+=3;
                if(CurMonth > 11) {CurMonth=0;CurYear+=1;}
                useDate.setFullYear(CurYear,CurMonth,1);
            } else {
                CurMonth+=1;
                if(CurMonth == 12) {
                    CurMonth=0;
                    useDate.setFullYear(useDate.getFullYear() + 1);
                }
                useDate.setMonth(CurMonth);
            }
        }
        if(MTFlex.Button2 == 4 && CurMonth == 0) {MTFlexTitle[3].isHidden = false;}
        MF_GridRollup(1,2,1,'Assets');
        MF_GridRollup(3,4,2,'Liabilities');
        MF_GridRollDifference(5,1,3,1,'Net Worth/Totals','Add');
        MF_GridCalcDifference(5,1,3,[3,4,5,6,7,8,9,10,11,12,13,14,15],'Sub');
        MF_GridCalcRange(16,3,14,'Avg');
        MF_GridAddCard(1,3,14,'HV','Highest Assets\nwere','',css_green,'','',' in ');
        MF_GridAddCard(3,3,14,'HV','Highest Liabilities\nwere','',css_red,'','', ' in ');
        MF_GridAddCard(2,3,14,'HV','Highest Asset','',css_green,'',' was with ', ' in ');
        MF_GridAddCard(4,3,14,'HV','Highest Liability','',css_red,'',' was with ', ' in ');
        MF_GridAddCard(3,16,16,'HV','Average Liabilities','',css_red,'','', '');
    }

    async function MenuReportsAccountsGoStd(){

        let snapshotData = null, snapshotData2 = null, snapshotData3 = null,snapshotData4 = null;
        let cards = 0,acard=[0,0,0,0,0];
        let isToday = getDates('isToday',MTFlexDate2);
        let NetWorthLit = 'Net Worth/Totals';
        if(MTFlex.Button2 == 1) {
            MTP.isHidden = true;
            MTFlex.HideDetails = true;
            NetWorthLit = 'Net Worth';
            MF_GridOptions(1,[]);
            MTFlex.Title1 = 'Personal Net Worth Statement';
            MTFlex.Title2 = 'As of ' + getDates('s_FullDate',MTFlexDate2);

        } else {
            MTFlex.Title2 = getDates('s_FullDate',MTFlexDate1) + ' - ' + getDates('s_FullDate',MTFlexDate2);
            MTFlex.RequiredCols = [4,8,10,11];
        }

        MTP.Column = 1; MTP.Title = 'Type'; MF_QueueAddTitle(MTP);
        MTP.Column = 2; MTP.Title = 'Group';MTP.Format = 0;MF_QueueAddTitle(MTP);
        if(getCookie('MT_AccountsHideUpdated',true) == 1) {MTP.isHidden = true;}
        MTP.Column = 3; MTP.Title = 'Updated';MTP.Format = -1;MF_QueueAddTitle(MTP);
        if(MTFlex.Button2 != 1) MTP.isHidden = false;
        MTP.Column = 4; MTP.Title = 'Beg Balance'; MTP.isSortable = 2; MTP.Format = [1,2][getCookie('MT_AccountsNoDecimals',true)];MF_QueueAddTitle(MTP);
        MTP.Column = 5; MTP.Title = 'Income'; MF_QueueAddTitle(MTP);
        MTP.Column = 6; MTP.Title = 'Expenses'; MF_QueueAddTitle(MTP);
        MTP.Column = 7; MTP.Title = 'Transfers'; MF_QueueAddTitle(MTP);
        MTP.Column = 8; MTP.Title = 'Balance';MTP.isHidden = false;MF_QueueAddTitle(MTP);
        if(MTFlex.Button2 != 1) {
            if(getCookie('MT_AccountsHidePer2',true) == 0) {MTP.ShowPercent = 3;}
            if(getCookie('MT_AccountsHidePer1',true) == 1) {MTP.isHidden = true;} else {MTP.isHidden = false;}
            MTP.Column = 9; MTP.Title = 'Net Change'; MF_QueueAddTitle(MTP);
            if(getCookie('MT_AccountsHidePending',true) == 1) {MTP.isHidden = true;} else {MTP.isHidden = false;}
            MTP.Column = 10; MTP.Title = 'Pending'; MTP.ShowPercent = 0; MF_QueueAddTitle(MTP);
            MTP.Column = 11; MTP.Title = 'Proj Balance'; MTP.ShowPercent = 0; MF_QueueAddTitle(MTP);
        }

        let useBalance = 0, pastBalance = 0, useAmount = 0;
        let skipTxs = getCookie('MT_AccountsBalance',true);

        snapshotData = await getAccountsData();
        snapshotData2 = await GetTransactions(formatQueryDate(MTFlexDate1),formatQueryDate(MTFlexDate2),0,false,null,false);
        snapshotData3 = await getDisplayBalanceAtDateData(formatQueryDate(MTFlexDate1));
        snapshotData4 = await GetTransactions(formatQueryDate(getDates('d_StartofLastMonth')),formatQueryDate(MTFlexDate2),0,true,null,false);
        if(isToday == false) {snapshotData5 = await getDisplayBalanceAtDateData(formatQueryDate(MTFlexDate2));}

        for (let i = 0; i < 5; i += 1) { if(getCookie('MT_AccountsCard' + i.toString(),true) == 1) {cards+=1;}}
        if(debug == 1) console.log('MenuReportsAccountsGoStd',snapshotData,snapshotData2,AccountGroupFilter);
        for (let i = 0; i < snapshotData.accounts.length; i += 1) {
            if(AccountGroupFilter == '' || AccountGroupFilter == getCookie('MTAccounts:' + snapshotData.accounts[i].id,false)) {
                if(snapshotData.accounts[i].hideFromList == false || skipHidden == 0) {
                    if(snapshotData.accounts[i].includeInNetWorth == true || skipHidden2 == 0) {
                        MTP = [];
                        MTP.isHeader = false;
                        MTP.UID = snapshotData.accounts[i].id;
                        if(isToday == true) {
                            useBalance = Number(snapshotData.accounts[i].displayBalance);
                        } else {
                            useBalance = getAccountPrevBalance(MTP.UID);
                        }
                        if(useBalance == null) {useBalance = 0;}
                        pastBalance = getAccountBalance(MTP.UID);
                        if(pastBalance == null) {pastBalance = 0;}
                        if(useBalance !=0 || getAccountUsed(MTP.UID) == true || pastBalance != 0) {
                            let accountName = getAccountPrimaryKey(snapshotData.accounts[i].isAsset,snapshotData.accounts[i].type.display,snapshotData.accounts[i].subtype.display);
                            MF_QueueAddRow(MTP);
                            MTFlexRow[MTFlexCR][MTFields] = snapshotData.accounts[i].displayName;
                            MTFlexRow[MTFlexCR][MTFields+1] = snapshotData.accounts[i].subtype.display;
                            MTFlexRow[MTFlexCR][MTFields+2] = accountName;
                            MTFlexRow[MTFlexCR][MTFields+3] = snapshotData.accounts[i].displayLastUpdatedAt.substring(0, 10);
                            MTFlexRow[MTFlexCR][MTFields+8] = useBalance;
                            if(snapshotData.accounts[i].hideTransactionsFromReports == false) {
                                for (let j = 0; j < snapshotData2.allTransactions.results.length; j += 1) {
                                    if(snapshotData2.allTransactions.results[j].hideFromReports == false) {
                                        if(snapshotData2.allTransactions.results[j].account.id == snapshotData.accounts[i].id) {
                                            switch (snapshotData2.allTransactions.results[j].category.group.type) {
                                                case 'income':
                                                    MTFlexRow[MTFlexCR][MTFields+5] += snapshotData2.allTransactions.results[j].amount;
                                                    break;
                                                case 'expense':
                                                    useAmount = snapshotData2.allTransactions.results[j].amount * -1;
                                                    MTFlexRow[MTFlexCR][MTFields+6] += useAmount;
                                                    MTFlexRow[MTFlexCR][MTFields+6] = parseFloat(MTFlexRow[MTFlexCR][MTFields+6].toFixed(2));
                                                    break;
                                                case 'transfer':
                                                    MTFlexRow[MTFlexCR][MTFields+7] += snapshotData2.allTransactions.results[j].amount;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                            MTFlexRow[MTFlexCR][MTFields+10] = getAccountPendingBalance(snapshotData.accounts[i].id);
                            if(skipTxs == 1 && (snapshotData.accounts[i].subtype.name == 'checking' || snapshotData.accounts[i].subtype.name == 'credit_card')) {
                                if(snapshotData.accounts[i].isAsset == true){
                                    MTFlexRow[MTFlexCR][MTFields+4] = useBalance - MTFlexRow[MTFlexCR][MTFields+5] + MTFlexRow[MTFlexCR][MTFields+6] - MTFlexRow[MTFlexCR][MTFields+7];
                                } else {
                                    MTFlexRow[MTFlexCR][MTFields+4] = useBalance - MTFlexRow[MTFlexCR][MTFields+5] - MTFlexRow[MTFlexCR][MTFields+6] + MTFlexRow[MTFlexCR][MTFields+7];
                                }
                            } else { MTFlexRow[MTFlexCR][MTFields+4] = pastBalance; }
                            MTFlexRow[MTFlexCR][MTFields+4] = parseFloat(MTFlexRow[MTFlexCR][MTFields+4].toFixed(2));
                            MTFlexRow[MTFlexCR][MTFields+9] = useBalance - MTFlexRow[MTFlexCR][MTFields+4];
                            MTFlexRow[MTFlexCR][MTFields+9] = parseFloat(MTFlexRow[MTFlexCR][MTFields+9].toFixed(2));
                            MTFlexRow[MTFlexCR][MTFields+10] = parseFloat(MTFlexRow[MTFlexCR][MTFields+10].toFixed(2));
                            MTFlexRow[MTFlexCR][MTFields+11] = MTFlexRow[MTFlexCR][MTFields+8] + MTFlexRow[MTFlexCR][MTFields+10];
                            if(snapshotData.accounts[i].subtype.name == 'checking') {acard[0] = acard[0] + MTFlexRow[MTFlexCR][MTFields+8];}
                            if(snapshotData.accounts[i].subtype.name == 'savings') {acard[1] = acard[1] + MTFlexRow[MTFlexCR][MTFields+8];}
                            if(snapshotData.accounts[i].subtype.name == 'credit_card') {acard[2] = acard[2] + MTFlexRow[MTFlexCR][MTFields+8];}
                            if(snapshotData.accounts[i].type.display == 'Investments') {acard[3] = acard[3] + MTFlexRow[MTFlexCR][MTFields+8];}
                            if(snapshotData.accounts[i].subtype.display == '401k') {acard[4] = acard[4] + MTFlexRow[MTFlexCR][MTFields+8];}
                            if((snapshotData.accounts[i].subtype.name == 'credit_card') && cards < 5) {
                                MTP = [];MTP.Col = cards;
                                MTP.Title = getDollarValue(MTFlexRow[MTFlexCR][MTFields+8],MTFlexTitle[3].Format == 2 ? true : false);
                                MTP.Subtitle = snapshotData.accounts[i].displayName;
                                MTP.Style = css_red;
                                MF_QueueAddCard(MTP);
                                cards+=1;
                            }
                        }
                    }
                }
            }
        }

        cards=0;
        for (let i = 0; i < 5; i += 1) {
            if(getCookie('MT_AccountsCard' + i.toString(),true) == 1) {
                MTP = [];MTP.Col = cards;MTP.Title = getDollarValue(acard[i],MTFlexTitle[3].Format == 2 ? true : false);MTP.Subtitle = 'Total ' + ['Checking', 'Savings', 'Credit Cards', 'Investments','401k'][i];
                MTP.Style = [css_green,css_green,css_red,css_green,css_green][i];MF_QueueAddCard(MTP);
            }
        }

        MF_GridRollup(1,2,1,'Assets');
        MF_GridRollup(3,4,2,'Liabilities');
        MF_GridRollDifference(5,1,3,1,NetWorthLit,'Add');
        MF_GridCalcDifference(5,1,3,[4,8,9,11],'Sub');

        function getAccountUsed(inId) {
            for (let k = 0; k < snapshotData2.allTransactions.results.length; k++) {
                if(snapshotData2.allTransactions.results[k].account.id == inId) { return true; }
            }
            return false;
        }

        function getAccountBalance(inId) {
            for (let k = 0; k < snapshotData3.accounts.length; k++) {
                if(snapshotData3.accounts[k].id == inId ) { return snapshotData3.accounts[k].displayBalance; }
            }
            return 0;
        }
        function getAccountPendingBalance(inId) {
            let amt = 0;
            for (let j = 0; j < snapshotData4.allTransactions.results.length; j += 1) {
                if(snapshotData4.allTransactions.results[j].account.id == inId) {
                    amt = amt + snapshotData4.allTransactions.results[j].amount;
                }
            }
            amt = amt * -1;return amt;
        }

    }

    function getAccountPrevBalance(inId) {
        for (let k = 0; k < snapshotData5.accounts.length; k++) {
            if(snapshotData5.accounts[k].id == inId ) { return snapshotData5.accounts[k].displayBalance; }
        }
        return 0;
    }

    function getAccountPrimaryKey(inAsset,inDisplay,inSubDisplay) {
        if(inAsset == true) {
            MTP.BasedOn = 1;MTP.Section = 2;
        } else {
            MTP.BasedOn = 2; MTP.Section = 4;
        }
        MTP.SKHRef = '/accounts/details/' + MTP.UID;
        let accountName = getCookie('MTAccounts:' + MTP.UID,false);
        if(MTFlex.Button2 == 1) {
            MTP.PK = inDisplay;
            if(inList(inDisplay,['Credit Cards','Other Liabilities','Other Assets']) == 0) {
                MTP.PK = inDisplay + ' - ' + inSubDisplay;
            }
            MTP.PK = (MTP.PK.startsWith('Other ')) ? '02' + MTP.PK : '01' + MTP.PK;
        } else {
            switch(Number(MTFlex.Button1)) {
                case 1:
                    MTP.PK = inDisplay;
                    MTP.PK = (MTP.PK.startsWith('Other ')) ? '02' + MTP.PK : '01' + MTP.PK;
                    break;
                case 2:MTP.PK = accountName;break;
                default:MTP.PK = MTP.BasedOn.toString();
            }
        }
        return accountName;
    }
}

function getAccountGroupInfo(inName) {
    let items = [],value = '',key='',keyid='';
    for (let i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if(key.startsWith('MTAccounts:')) {
            value = localStorage.getItem(key);
            if(value != '') {
                if(inName) {
                    if(inName == value) {
                        keyid = localStorage.key(i).slice(11);items.push(keyid);
                    }
                } else {
                    if(!items.includes(value)) {items.push(value);}
                }
            }
        }
    }
    if(inName == undefined && items.length > 0) {
        items.sort();
        items.unshift('All Groups');
    }
    return items;
}

function getAccountGroupFilter() {
    if(MTFlex.Button4Options.length > 1 && MTFlex.Button4 > 0) {
        const p = getAccountGroupInfo();
        if(p.length >= MTFlex.Button4) {return p[MTFlex.Button4];}
    }
    return '';
}

async function MenuAccountsSummary() {

    const topDiv = document.querySelector('div.MTAccountSummary');
    if(topDiv) return;

    let aSummary = [];

    const elements = document.querySelectorAll('[class*="AccountSummaryCardGroup__CardSection"]');
    if(elements.length > 1) {
        let snapshotData = await getAccountsData();
        for (let i = 0; i < snapshotData.accounts.length; i += 1) {
            if(snapshotData.accounts[i].hideFromList == false) {
                let AccountGroupFilter = getCookie('MTAccounts:' + snapshotData.accounts[i].id,false);
                MenuAccountSummaryUpdate(AccountGroupFilter, snapshotData.accounts[i].isAsset, snapshotData.accounts[i].displayBalance,snapshotData.accounts[i].displayName);
            }
        }
        aSummary.sort();
        MenuAccountSummaryShow(elements[0],true);
        MenuAccountSummaryShow(elements[1],false);
    } else { MTSpawnProcess = 4; }

    function MenuAccountSummaryShow(inParent,isAsset) {

        let cn = inParent.childNodes[0];
        let cnClass = cn.className;
        let div = document.createElement('div');
        div.className = 'MTAccountSummary';
        div = inParent.insertBefore(div, cn.nextSibling);
        let divChild = null;
        for (let j = 0; j < aSummary.length; j += 1) {
            if((isAsset && aSummary[j].Asset != 0) || (!isAsset && aSummary[j].Liability !=0)) {
                divChild = cec('div',cnClass,div,'','','margin-bottom: 5px;');
                let elx = cec('span','tooltip',divChild,aSummary[j].AccountGroup);
                let tt = cec('div','tooltip',elx);
                if(isAsset == true) {
                    cec('span','tooltiptext',tt,aSummary[j].ToolTipAsset,'','width:260px;text-align: left;padding-left:10px;');
                } else {
                    cec('span','tooltiptext',tt,aSummary[j].ToolTipLiability,'','width:260px;text-align: left;padding-left:10px;');
                }

                elx = cec('span','fs-exclude',divChild,isAsset == true ? getDollarValue(aSummary[j].Asset) : getDollarValue(aSummary[j].Liability),'','color: rgb(119, 117, 115)');

            }
        }
        if(divChild) {cec('div','',div,'','','margin-bottom: 18px;');}
    }

    function MenuAccountSummaryUpdate(inGroup,inA,inBal,inDesc) {
        let ttLit = inDesc + ': \xa0\xa0\xa0' + getDollarValue(inBal,2);
        let tta='',ttl='';
        if(inA == true) {tta = ttLit;} else {ttl = ttLit;}

        for (let j = 0; j < aSummary.length; j += 1) {
            if(aSummary[j].AccountGroup == inGroup) {
                if(inA == true) {
                    aSummary[j].Asset += Number(inBal);
                    aSummary[j].ToolTipAsset += '\n' + ttLit;
                    if(aSummary[j].ToolTipAsset.startsWith('\n')) {aSummary[j].ToolTipAsset = aSummary[j].ToolTipAsset.slice(1);}
                } else {
                    aSummary[j].Liability += Number(inBal);
                    aSummary[j].ToolTipLiability += '\n' + ttLit;
                    if(aSummary[j].ToolTipLiability.startsWith('\n')) {aSummary[j].ToolTipLiability=aSummary[j].ToolTipLiability.slice(1);}
                }
                return;
            }
        }
        aSummary.push({"AccountGroup": inGroup, "ToolTipAsset": tta ,"ToolTipLiability":ttl,"Asset": inA == true ? Number(inBal) : 0, "Liability": inA == true ? 0 : Number(inBal) });
    }
}


async function MenuReportsTrendsGo() {

    TrendQueue = [];
    await MF_GridInit('MTTrends', 'Trends');
    let TrendFullPeriod = getCookie('MT_TrendFullPeriod',true);
    let lowerDate = new Date(MTFlexDate1);
    let higherDate = new Date(MTFlexDate2);
    let CurrentFilter = '', CurrentFilterObj = [];
    lowerDate.setDate(1);
    lowerDate.setMonth(0);
    let month = lowerDate.getMonth();
    let day = lowerDate.getDate();
    let year = lowerDate.getFullYear();
    let month2 = higherDate.getMonth();
    let day2 = higherDate.getDate();
    let year2 = higherDate.getFullYear();

    MTFlex.TriggerEvent = 1;
    MTFlex.TriggerEvents = true;
    MF_GridOptions(1,['By group','By category','By both']);
    MF_GridOptions(2,['Compare last month','Compare same month','Compare same quarter','This year by month','Last year by month','Last 12 months by month', 'Two years ago by month', 'Three years ago by month', 'All years by year','All years by YTD']);
    MF_GridOptions(4,getAccountGroupInfo());
    MTFlex.SortSeq = ['1','1','1','2','2','2','2','2','2','2'];
    if(MTFlex.Button1 == 2) {MTFlex.Subtotals = true;}
    if(MTFlex.Button4Options.length > 1 && MTFlex.Button4 > 0) {
        CurrentFilter = getAccountGroupFilter();
        CurrentFilterObj = getAccountGroupInfo(CurrentFilter);
    }

    MTFlex.Title1 = 'Net Income Trend Report';

    MTP = [];
    MTP.Column = 0; MTP.Title = ['Group','Category','Group/Category'][MTFlex.Button1]; MTP.isSortable = 1; MTP.Format = 0;
    MF_QueueAddTitle(MTP);

    if(MTFlex.Button2 > 2) {
        MTP.isSortable = 2;MTP.Format = 2;
        MTP.Column = 13; MTP.Title = 'Total';
        MF_QueueAddTitle(MTP);
        MTP.Column = 14; MTP.Title = 'Avg';
        MF_QueueAddTitle(MTP);
        let newCol = 1;
        if(MTFlex.Button2 == 3) {
            if(getCookie('MT_TrendIgnoreCurrent',true) == 1) { MTFlex.Title3 = '* Average ignores Current Month'; }
            for (let i = 0; i < 12; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                if(i > month2) {MTP.isHidden = true;}
                MF_QueueAddTitle(MTP);
            }
        } else if (MTFlex.Button2 == 4 || MTFlex.Button2 == 6 || MTFlex.Button2 == 7) {
            year-=1;
            if(MTFlex.Button2 == 6) {year-=1;}
            if(MTFlex.Button2 == 7) {year-=2;}
            lowerDate.setFullYear(year);
            higherDate.setFullYear(year,11,31);
            for (let i = 0; i < 12; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
        } else if (MTFlex.Button2 > 7) {
            lowerDate.setFullYear(year - 12);
            for (let i = year - 11; i <= year; i += 1) {
                MTP.Column = newCol; MTP.Title = i.toString();
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
        } else if (MTFlex.Button2 == 5) {
            if(getCookie('MT_TrendIgnoreCurrent',true) == 1) { MTFlex.Title3 = '* Average ignores Current Month'; }
            for (let i = month2 + 1; i < 12; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
            for (let i = 0; i <= month2; i += 1) {
                MTP.Column = newCol; MTP.Title = getMonthName(i,true);
                newCol+=1;
                MF_QueueAddTitle(MTP);
            }
            if(month2 < 11) {
                month2+=1;
                lowerDate.setMonth(month2);
                year2-=1;
                lowerDate.setFullYear(year2);
            }
        }

        MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
        if(MTFlex.Button2 == 8) {
            await BuildTrendData('oy',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);
        } else if (MTFlex.Button2 == 9) {
            for (let i = year - 11; i <= year; i += 1) {
                lowerDate.setFullYear(i,0,1);
                higherDate.setFullYear(i,month2,day2);
                await BuildTrendData('oy',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);
            }
        } else {
            await BuildTrendData('ot',MTFlex.Button1,'month',lowerDate,higherDate,'',CurrentFilterObj);
        }
        MTFlex.Title3 = MTFlex.Button2Options[MTFlex.Button2];
        await WriteByMonthData();
    } else {
        let useFormat = 1;
        if(getCookie('MT_NoDecimals',true) == 1) {useFormat = 2;}
        MTFlex.Title2 = getDates('s_FullDate',lowerDate) + ' - ' + getDates('s_FullDate',higherDate);
        if(TrendFullPeriod == 1) { MTFlex.Title3 = '* Comparing to End of Month'; }

        // this year
        MTP = [];
        MTP.Column = 5; MTP.Title = 'YTD ' + year; MTP.isSortable = 2; MTP.Width = '12%'; MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('cp',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);

        // last year
        year-=1;
        lowerDate.setFullYear(year);
        higherDate.setFullYear(year);
        MTP = [];
        MTP.Column = 4; MTP.Title = 'YTD ' + year; MTP.isSortable = 2; MTP.Format = useFormat; MTP.Width = '12%'; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        MTP.Column = 6; MTP.Title = 'Difference'; MTP.Format = useFormat; MTP.Width = '12%';MTP.ShowPercentShade = true;
        if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = 1;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('lp',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);

        // This Period
        let useTitle = '';
        year+=1;
        month = month2;
        lowerDate.setFullYear(year,month,1);
        higherDate.setFullYear(year2,month2,day2);

        if(MTFlex.Button2 == 2) {
            const QtrDate = getDates('i_ThisQTRs',MTFlexDate1);
            month = parseInt(QtrDate.substring(0,2)) - 1;
            lowerDate.setMonth(month);
            if(month != month2) {useTitle = getMonthName(month,true) + ' - ';}
        }
        if(MTFlex.Button2 == 1) {
            if(TrendFullPeriod == 1) {
                day2 = daysInMonth(month2,year2);
                higherDate.setDate(day2);
            }
        }

        useTitle = useTitle + getMonthName(month2,true) + ' ' + year;
        MTP = [];
        MTP.Column = 2; MTP.Title = useTitle; MTP.isSortable = 2; MTP.Width = '12%'; MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('cm',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);

        // Last Period
        let forceEOM = false;
        if(daysInMonth(month,year) == day2) { forceEOM = true; }

        useTitle = '';
        if(MTFlex.Button2 == 0) {
            month-=1;
            if(month < 0) { month = 11; year = year - 1;}
            month2 = month;year2 = year;
            lowerDate.setFullYear(year,month,1);
            higherDate.setFullYear(year2,month2,1);

            let x = daysInMonth(month,year);
            if(day2 > x) { day2 = x; }
            if(forceEOM == true) {day2 = x;}
            higherDate.setDate(day2);
            MTFlex.TitleShort = 'Last Month';
            useTitle = getMonthName(month2,true) + ' ' + year;
        }
        if(MTFlex.Button2 == 1) {
            year-=1;
            lowerDate.setFullYear(year,month,1);
            higherDate.setFullYear(year,month,1);
            higherDate.setDate(day2);
            MTFlex.TitleShort = 'Last ' + getMonthName(month);
            useTitle = getMonthName(month,true) + ' ' + year;
        }
        if(MTFlex.Button2 == 2) {
            year-=1;
            lowerDate.setFullYear(year);
            higherDate.setFullYear(year);
            if(month == month2) {
                useTitle = getMonthName(month2,true) + ' ' + year;
            } else {
                useTitle = getMonthName(month,true) + ' - ' + getMonthName(month2,true) + ' ' + year;
            }
            MTFlex.TitleShort = useTitle;
        }
        if(TrendFullPeriod == 1) {
            day2 = daysInMonth(month2,year);
            higherDate.setDate(day2);
            useTitle = useTitle + ' *';
        }
        MTP = [];
        MTP.Column = 1; MTP.Title = useTitle; MTP.isSortable = 2; MTP.Format = useFormat; MTP.Width = '12%'; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHidePer1',true) != true) {MTP.ShowPercent = 2;}
        MF_QueueAddTitle(MTP);
        MTP = [];
        MTP.Column = 3; MTP.Title = 'Difference'; MTP.isSortable = 2; MTP.Format = useFormat; MTP.Width = '12%'; MTP.ShowPercentShade = true;
        if(getCookie('MT_TrendHidePer2',true) != true) {MTP.ShowPercent = 1;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('lm',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);
        // future month
        lowerDate = getDates('d_StartofNextMonthLY',MTFlexDate2);
        higherDate = getDates('d_EndofNextMonthLY',MTFlexDate2);
        MTP = [];
        MTP.Column = 7; MTP.Title = getDates('s_MidDate',lowerDate); MTP.Width = '11%';MTP.isSortable = 2;MTP.Format = useFormat; MTP.ShowPercentShade = false;
        if(getCookie('MT_TrendHideNextMonth',true) == true) {MTP.isHidden = true;}
        MF_QueueAddTitle(MTP);
        await BuildTrendData('fu',MTFlex.Button1,'year',lowerDate,higherDate,'',CurrentFilterObj);
        await WriteCompareData();
    }
    MTSpawnProcess = 1;
}

async function WriteByMonthData() {

    let useDesc = '',lowestMonth = 13,useURL = '';
    for (let i = 0; i < MTFlexRow.length; i += 1) {
        let retGroup = await getCategoryGroup(MTFlexRow[i].UID);
        if(retGroup.TYPE == 'transfer') {
            MTFlexRow[i].UID = '';
        } else {
            if(retGroup.TYPE == 'expense') {
                if(retGroup.ISFIXED == true) {
                    MTFlexRow[i].BasedOn = 2;
                    MTFlexRow[i].Section = 4;
                } else {
                    MTFlexRow[i].BasedOn = 3;
                    MTFlexRow[i].Section = 6;
                }
                for (let j = 1; j < MTFlexTitle.length; j += 1) {
                    if(MTFlexRow[i][MTFields + j] != 0) {
                        if(j < lowestMonth) {lowestMonth = j;}
                        MTFlexRow[i][MTFields + j] = MTFlexRow[i][MTFields + j] * -1;
                    }
                }
                 useURL = '#|spending|';
            } else {
                MTFlexRow[i].BasedOn = 1;
                MTFlexRow[i].Section = 2;
                useURL = '#|income|';
            }
            if(MTFlex.Button1 > 0) {
                if(MTFlex.Button1 == 2) {
                    MTFlexRow[i].PK = retGroup.GROUPNAME;
                    MTFlexRow[i].PKHRef = useURL + '|' + retGroup.GROUP + '|';
                    MTFlexRow[i].PKTriggerEvent = 'category-groups/' + retGroup.GROUP;
                }
                MTFlexRow[i].SKHRef = useURL + retGroup.ID + '|';
                MTFlexRow[i].SKTriggerEvent = 'categories/' + retGroup.ID;
                useDesc = retGroup.NAME;
            } else {
                useDesc = retGroup.GROUPNAME;
                MTFlexRow[i].SKHRef = useURL + '|' + retGroup.GROUP + '|';
                MTFlexRow[i].PKTriggerEvent = '';
                MTFlexRow[i].SKTriggerEvent = 'category-groups/' + retGroup.GROUP;
            }
        }
        MTFlexRow[i].Icon = retGroup.ICON;
        MTFlexRow[i].SKExpand = '';
        MTFlexRow[i][MTFields] = useDesc;
    }
    MTFlexRow = MTFlexRow.filter(item => item.UID !== '');
    if(MTFlex.Button2 > 7) {
        for(let i = 1; i <= 12; i++){ if(i < lowestMonth) {MTFlexTitle[i].isHidden = true;}}
        MTFlex.Title2 = MTFlex.Title2.substring(0, 7) + MTFlexTitle[lowestMonth].Title + MTFlex.Title2.substring(11);
    }
    MF_GridRollup(1,2,1,'Income');
    if(accountsHasFixed == true) {
        MF_GridRollup(3,4,2,'Fixed Spending');
        MF_GridRollup(5,6,3,'Flexible Spending');
        MF_GridRollDifference(7,3,5,1,'Total Spending','Add');
        MF_GridRollDifference(8,1,7,1,'Savings','Sub');
    } else {
        MF_GridRollup(5,6,3,'Spending');
        MF_GridRollDifference(8,1,5,1,'Savings','Sub');
    }

    MF_GridCalcRange(13,1,12,'Add');

    lowestMonth = 12;
    if(getCookie('MT_TrendIgnoreCurrent',true) == 1) {if(MTFlex.Button2 == 3 || MTFlex.Button2 == 5) {lowestMonth = 11;}}
    if(MTFlex.Button2 == 8) {lowestMonth = 11;}
    MF_GridCalcRange(14,1,lowestMonth,'Avg');

    MF_GridAddCard(1,13,13,'HV','Total Income','',css_green,'','', '');
    MF_GridAddCard(7,13,13,'HV','Total Expenses','',css_red,'','', '');
    MF_GridAddCard(2,1,12,'HV','Highest Income','',css_green,'',' was with ', ' in ');
    if(accountsHasFixed == true) {
        MF_GridAddCard(4,1,12,'HV','Highest Fixed Expense','',css_red,'',' was with ', ' in ');
        MF_GridAddCard(6,1,12,'HV','Highest Non-Fixed Expense','',css_red,'',' was with ', ' in ');
    } else {
        MF_GridAddCard(6,1,12,'HV','Highest Expense','',css_red,'',' was with ', ' in ');
        MF_GridAddCard(8,13,13,'HV','Total Savings','Total Overspent',css_green,css_red,'', '');
    }
}

async function WriteCompareData() {

    let useDesc = '',Numcards=0, useURL = '';
    let useFormat = false;
    if(getCookie('MT_NoDecimals',true) == 1) {useFormat = true;}

    for (let i = 0; i < TrendQueue.length; i += 1) {
        MTP = [];
        let retGroup = await getCategoryGroup(TrendQueue[i].ID);
        if(retGroup.TYPE == 'expense' || retGroup.TYPE == 'income') {
             if(retGroup.TYPE == 'expense') {
                 TrendQueue[i].N_CURRENT = TrendQueue[i].N_CURRENT * -1;
                 TrendQueue[i].N_LAST = TrendQueue[i].N_LAST * -1;
                 TrendQueue[i].N_CURRENTM = TrendQueue[i].N_CURRENTM * -1;
                 TrendQueue[i].N_LASTM = TrendQueue[i].N_LASTM * -1;
                 TrendQueue[i].N_FUTURE = TrendQueue[i].N_FUTURE * -1;
                 if(retGroup.ISFIXED == true) {
                     MTP.BasedOn = 2;
                     MTP.Section = 4;
                 } else {
                     MTP.BasedOn = 3;
                     MTP.Section = 6;
                 }
                 useURL = '#|spending|';
             }
             if(retGroup.TYPE == 'income') {
                 MTP.BasedOn = 1;
                 MTP.Section = 2;
                 MTP.IgnoreShade = true;
                 useURL = '#|income|';
             }
             MTP.isHeader = false;
             if(MTFlex.Button1 > 0) {
                 if(MTFlex.Button1 == 2) {
                     MTP.PK = retGroup.GROUPNAME;
                     MTP.PKHRef = useURL + '|' + retGroup.GROUP + '|';
                     MTP.PKTriggerEvent = 'category-groups/' + retGroup.GROUP + '/';
                 }
                 MTP.SKHRef = useURL + retGroup.ID + '|';
                 MTP.SKTriggerEvent = 'categories/' + retGroup.ID + '/';
                 useDesc = retGroup.NAME;
             } else {
                 useDesc = retGroup.GROUPNAME;
                 MTP.SKHRef = useURL + '|' + retGroup.GROUP + '|';
                 MTP.PKTriggerEvent = '';
                 MTP.SKTriggerEvent = 'category-groups/' + retGroup.GROUP + '/';
             }
            MTP.Icon = retGroup.ICON;
            MTP.SKExpand = '';
            MF_QueueAddRow(MTP);
            MTFlexRow[MTFlexCR][MTFields] = useDesc;
            MTFlexRow[MTFlexCR][MTFields+1] = TrendQueue[i].N_LASTM;
            MTFlexRow[MTFlexCR][MTFields+2] = TrendQueue[i].N_CURRENTM;
            MTFlexRow[MTFlexCR][MTFields+3] = TrendQueue[i].N_CURRENTM - TrendQueue[i].N_LASTM;
            MTFlexRow[MTFlexCR][MTFields+4] = TrendQueue[i].N_LAST;
            MTFlexRow[MTFlexCR][MTFields+5] = TrendQueue[i].N_CURRENT;
            MTFlexRow[MTFlexCR][MTFields+6] = TrendQueue[i].N_CURRENT - TrendQueue[i].N_LAST;
            MTFlexRow[MTFlexCR][MTFields+7] = TrendQueue[i].N_FUTURE;
         }
    }
    MF_GridRollup(1,2,1,'Income');
    if(accountsHasFixed == true) {
        MF_GridRollup(3,4,2,'Fixed Spending');
        MF_GridRollup(5,6,3,'Flexible Spending');
        MF_GridRollDifference(7,3,5,1,'Total Spending','Add');
        MF_GridRollDifference(8,1,7,1,'Savings','Sub');
    } else {
        MF_GridRollup(5,6,3,'Spending');
        MF_GridRollDifference(8,1,7,1,'Savings','Sub');
    }

    if(getCookie('MT_TrendCard1',true) == true) {
        let a_Income = MF_GridGetValue(1,5);
        if(a_Income > 0) {
            let a_Fixed = MF_GridGetValue(3,5);
            let a_Flexible = MF_GridGetValue(5,5);
            let a_Savings = a_Income - a_Fixed - a_Flexible;
            a_Fixed = (a_Fixed / a_Income) * 100;a_Fixed = Math.round(a_Fixed);
            a_Flexible = (a_Flexible / a_Income) * 100;a_Flexible = Math.round(a_Flexible);
            a_Savings = (a_Savings / a_Income) * 100;a_Savings = Math.round(a_Savings);
            Numcards+=1;
            MTP = [];MTP.Col = Numcards;
            MTP.Title = a_Fixed + '% / ' + a_Flexible + '% / ' + a_Savings + '%';
            MTP.Subtitle = 'Fixed/Flexible/Savings';
            MF_QueueAddCard(MTP);
        }
    }

    Numcards = Numcards + MF_GridAddCard(1,6,6,'HV','More Total Income YTD','Less Total Income YTD',css_green,css_red,'','');
    if(accountsHasFixed == true) {
        Numcards = Numcards + MF_GridAddCard(3,6,6,'HV','More Fixed Expenses YTD','Less Fixed Expenses YTD',css_red,css_green,'','');
        Numcards = Numcards + MF_GridAddCard(5,6,6,'HV','More Flexible Expenses YTD','Less Flexible Expenses YTD',css_red,css_green,'','');
    } else {
        Numcards = Numcards + MF_GridAddCard(5,6,6,'HV','More Expenses YTD','Less Expenses YTD',css_red,css_green,'','');
    }
    Numcards = Numcards + MF_GridAddCard(8,5,5,'HV','Total Savings','Total Overspent',css_green,css_red,'', '');
}

async function BuildTrendData (inCol,inGrouping,inPeriod,lowerDate,higherDate,inID,inAccounts) {

    if(debug == 1) console.log('BuildTrendData',inCol,inGrouping,inPeriod,lowerDate,higherDate,inAccounts);

    const firstDate = formatQueryDate(lowerDate);
    const lastDate = formatQueryDate(higherDate);
    let useID = '', useType = '';
    let snapshotData = null;
    let retGroups = [];
    let s_ndx = 0;
    if(MTFlex.Button2 > 7) {s_ndx = getDates('n_CurYear', MTFlexDate2) - 12;} else {s_ndx = getDates('n_CurMonth',lowerDate) + 1;}

    if(inID) { useType = getCategoryGroup(inID).TYPE; }
    inGrouping = Number(inGrouping);

    if(inGrouping == 0) {snapshotData = await getMonthlySnapshotData(firstDate,lastDate,inPeriod,inAccounts);} else {
        snapshotData = await getMonthlySnapshotData2(firstDate,lastDate,inPeriod,inAccounts);}

    for (let i = 0; i < snapshotData.aggregates.length; i += 1) {
        switch(inGrouping) {
            case 0: useID = snapshotData.aggregates[i].groupBy.categoryGroup.id;break;
            case 1: useID = snapshotData.aggregates[i].groupBy.category.id;break;
            case 2: useID = snapshotData.aggregates[i].groupBy.category.id;break;
            case 3: useID = snapshotData.aggregates[i].groupBy.category.id;
                retGroups = getCategoryGroup(useID);
                useID = retGroups.GROUP;useType = retGroups.TYPE;break;
        }
        if(inID == '' || inID == useID) {
            let useAmount = Number(snapshotData.aggregates[i].summary.sum);
            if(inID) {
                let useDate = snapshotData.aggregates[i].groupBy.month;
                let yy = useDate.substring(0,4);
                let mm = useDate.substring(5,7);
                if(useType == 'expense') { useAmount = useAmount * -1;}
                TrendQueue2.push({"YEAR": yy, "MONTH": mm,"AMOUNT": useAmount, "DESC": retGroups.NAME, "ID": retGroups.ID});
            } else if (inCol == 'oy') {
                let useDate = snapshotData.aggregates[i].groupBy.year;
                let ndx = Number(useDate.substring(0,4));
                ndx = ndx - s_ndx;
                MF_GridUpdateUID(useID,ndx,useAmount,true);}
            else if (inCol == 'ot') {
                let useDate = snapshotData.aggregates[i].groupBy.month;
                let ndx = Number(useDate.substring(5,7));
                if(MTFlex.Button2 == 5 && s_ndx != 1) {
                    if(ndx >= s_ndx) {
                        ndx = ndx - s_ndx;
                        ndx+=1;
                    } else {
                        ndx = (12 - s_ndx + 1) + ndx;
                    }
                }
                MF_GridUpdateUID(useID,ndx,useAmount,true);
            } else { Trend_UpdateQueue(useID,useAmount,inCol); }
        }
    }
    if(inCol == 'hs') {MTSpawnProcess = 2;}
}

function Trend_UpdateQueue(useID,useAmount,inCol) {

    for (let i = 0; i < TrendQueue.length; i++) {
        if(TrendQueue[i].ID == useID) {
            switch(inCol) {
                case 'cp':TrendQueue[i].N_CURRENT = useAmount;break;
                case 'lp':TrendQueue[i].N_LAST = useAmount;break;
                case 'cm':TrendQueue[i].N_CURRENTM = useAmount;break;
                case 'lm':TrendQueue[i].N_LASTM = useAmount;break;
                case 'fu':TrendQueue[i].N_FUTURE = useAmount;break;
            }
            return;
        }
    }
    switch(inCol) {
        case 'cp':TrendQueue.push({"ID": useID,"N_CURRENT": useAmount,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": 0});break;
        case 'lp':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": useAmount, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": 0});break;
        case 'cm':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": useAmount, "N_LASTM": 0, "N_FUTURE": 0});break;
        case 'lm':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": useAmount, "N_FUTURE": 0});break;
        case 'fu':TrendQueue.push({"ID": useID,"N_CURRENT": 0,"N_LAST": 0, "N_CURRENTM": 0, "N_LASTM": 0, "N_FUTURE": useAmount});break;
    }
}

function MenuTrendsHistory(inType,inID) {

    let lowerDate = new Date("2023-01-01"),higherDate = new Date();
    let retGroups = getCategoryGroup(inID),inGroup = 1,useURL = '',useURLText = '';
    let CurrentFilter = '', CurrentFilterObj = [];
    let ExpandItems = false;

    if(MTFlex.Button4Options != null) {
        if(MTFlex.Button4Options.length > 1 && MTFlex.Button4 > 0) {
            CurrentFilter = getAccountGroupFilter();
            CurrentFilterObj = getAccountGroupInfo(CurrentFilter);
        }
    }
    if(CurrentFilter) {CurrentFilter = 'Monthly Summary - ' + CurrentFilter;} else {CurrentFilter = 'Monthly Summary';}
    if(inType == 'category-groups') {ExpandItems = true;}
    if(retGroups.TYPE == 'expense') {useURL = '#|spending|';} else {useURL = '#|income|';}
    if(inType == 'category-groups') {
        useURLText = retGroups.ICON + ' ' + retGroups.GROUPNAME;
        useURL = useURL + '|' + retGroups.GROUP;
        inGroup = 3;
    } else {
        useURLText = retGroups.ICON + ' ' + retGroups.GROUPNAME + ' / ' + retGroups.NAME;
        useURL = useURL + retGroups.ID + '|';
    }

    MF_SidePanelOpen(inType,retGroups.TYPE,ExpandItems,CurrentFilter, retGroups.TYPE,useURLText,useURL);
    TrendQueue2 = [];
    BuildTrendData('hs',inGroup,'month',lowerDate,higherDate,inID,CurrentFilterObj);

}

function MenuTrendsHistoryDraw() {

    let sumQue = [], detailQue = [];
    const os = 'text-align:left; font-weight: 600;';
    const os2 = 'font-weight: 600;';
    const os3 = 'text-align:left; font-weight: 200; font-size: 12px;';
    const os4 = 'display: ' + getDisplay(getCookie(MTFlex.Name + '_SidePanel',true),'');
    const startYear = getDates('n_CurYear') - 2;
    const curYear = getDates('n_CurYear');
    const curMonth = getDates('n_CurMonth');

    let curYears = 1,skiprow = false,inGroup = 1,useArrow = 0,c_r = 'red', c_g = 'green';
    let topDiv = document.querySelector('div.MTSideDrawerMotion');
    let T = ['Total',0,0,0,0];
    let curSubTotal = 0;
    let div=null,div2 = null,div3=null;
    let FontFamily = getCookie('MT_MonoMT',false);
    if(FontFamily && FontFamily != 'System') {FontFamily = 'font-family: ' + FontFamily + ';';}

    if(topDiv) {
        if(topDiv.getAttribute("grouptype") == 'category-groups') { inGroup = 2;}
        if(topDiv.getAttribute("cattype") == 'income') { c_g = 'red'; c_r = 'green'; }
        div = cec('div','MTSideDrawerHeader',topDiv,'','',FontFamily);

        for (let i = 0; i < 12; i++) {
            sumQue.push({"MONTH": i,"YR1": MTHistoryDraw(i+1,startYear),"YR2": MTHistoryDraw(i+1,startYear + 1),"YR3": MTHistoryDraw(i+1,startYear + 2)});
        }

        if(startYear < getCookie('MT_LowCalendarYear',false)) {skiprow = true;}

        div2 = cec('div','MTSideDrawerItem',div,'','',os2);
        div3 = cec('span','MTSideDrawerDetail',div2,'Month','',os);
        for (let j = startYear; j <= curYear; j++) {
            if(skiprow == false || j > startYear) { div3 = cec('span','MTSideDrawerDetail',div2,j);}
        }

        div3 = cec('span','MTSideDrawerDetail3',div2);
        div3 = cec('span','MTSideDrawerDetail',div2,'Average');
        div2 = cec('div','MTSideDrawerItem',div,'','',os2);
        div3 = cec('span','MTFlexSpacer',div2);

        for (let i = 0; i < 12; i++) {
            if(i > 0 && i == curMonth) {
                MTHistoryTotals('Sub Total','height:26px;');
                curSubTotal = T[3];
            }
            if(sumQue[i].YR2 == sumQue[i].YR3){
                useArrow = 2;}
            else {
                if(i >= curMonth) {
                    if(sumQue[i].YR2 > 0 && sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 2;}
                } else {
                    if(sumQue[i].YR3 > sumQue[i].YR2) {useArrow = 0;} else {useArrow = 1;}
                }
            }
            div2 = cec('div','MTSideDrawerItem',div);
            if(sumQue[i].YR1 != 0) {curYears = 3;}
            if(curYears < 3) {
                if(sumQue[i].YR2 != 0) {curYears = 2;}
            }
            div3 = cec('span','MTSideDrawerDetail',div2,getMonthName(i,true),'',os);
            if(skiprow == false) {div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(sumQue[i].YR1));}
            div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(sumQue[i].YR2));
            div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(sumQue[i].YR3));
            div3 = cec('span','MTSideDrawerDetail3',div2,['','',' '][useArrow],'','color: ' + [c_r,c_g,''][useArrow]);

            if(i < curMonth) {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue((sumQue[i].YR1 + sumQue[i].YR2 + sumQue[i].YR3) / curYears));
            } else {
                div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue((sumQue[i].YR1 + sumQue[i].YR2)/(curYears-1)));
            }
            T[1] = T[1] + sumQue[i].YR1;T[2] = T[2] + sumQue[i].YR2;T[3] = T[3] + sumQue[i].YR3;
            if(inGroup == 2) { MTHistoryDrawDetail(i+1,div); }
        }
        MTHistoryTotals('Total','');
        MTHistoryTotals('Average','');
        MTHistoryTotals('Highest','');
        MTHistoryTotals('Lowest','');
        div = cec('div','MTSideDrawerHeader',topDiv);
        div2 = cec('div','MTPanelLink',div,'Download CSV','','padding: 0px; display:block; text-align:center;');
    }

    function MTHistoryTotals(inTitle,inStyle) {
        let maxCol = 4;
        switch (inTitle) {
            case 'Lowest':
                T[1]=0;T[2]=0;T[3];
                 for (let i = 0; i < 12; i++) {
                     if(sumQue[i].YR1 < T[1] || i == 0) T[1] = sumQue[i].YR1;
                     if(sumQue[i].YR2 < T[2] || i == 0) T[2] = sumQue[i].YR2;
                     if((sumQue[i].YR3 < T[3] || i == 0) && i < curMonth) T[3] = sumQue[i].YR3;
                 }
                maxCol = 3; break;
            case 'Highest':
                T[1]=0;T[2]=0;T[3];
                 for (let i = 0; i < 12; i++) {
                     if(sumQue[i].YR1 > T[1] || i == 0) T[1] = sumQue[i].YR1;
                     if(sumQue[i].YR2 > T[2] || i == 0) T[2] = sumQue[i].YR2;
                     if((sumQue[i].YR3 > T[3] || i == 0) && i < curMonth) T[3] = sumQue[i].YR3;
                 }
                maxCol = 3; break;
            case 'Average':
                T[1] = T[1] / 12;
                T[2] = T[2] / 12;
                T[3] = curSubTotal / curMonth;
                maxCol = 3; break;
        }
        const tot = T[1]+T[2]+T[3];
        if(tot != 0) { T[4] = tot / curYears; }

        if(inTitle.includes('Total')) {
            div2 = cec('div','MTSideDrawerItem',div,'','',os2);
            div3 = cec('span','MTFlexSpacer',div2);
        }
        div2 = cec('div','MTSideDrawerItem',div,'','',os2);
        div3 = cec('span','MTSideDrawerDetail',div2,inTitle,'',os+inStyle);
        for (let i = 1; i < 5; i++) {
            if(skiprow == false || i > 1) {
                if(i > maxCol) { div3 = cec('span','MTSideDrawerDetail',div2,''); } else {
                    div3 = cec('span','MTSideDrawerDetail',div2,getDollarValue(T[i]));}
                if(i == 3) { div3 = cec('span','MTSideDrawerDetail3',div2,' '); }
            }
        }
    }

    function MTHistoryDraw(inMonth,inYear) {

        let ms = '0' + inMonth.toString();ms = ms.slice(-2);
        let ys = inYear.toString();
        let amt = 0.00;

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms && TrendQueue2[i].YEAR == ys) {
                amt = amt + TrendQueue2[i].AMOUNT;
            }
        }
        return amt;
    }

    function MTHistoryDrawDetail(inMonth,inDiv) {

        let ms = '0' + inMonth.toString();ms = ms.slice(-2);
        detailQue = [];

        for (let i = 0; i < TrendQueue2.length; i++) {
            if(TrendQueue2[i].MONTH == ms ) {
                let result = MTHistoryFind(TrendQueue2[i].DESC);
                detailQue[result].ID = TrendQueue2[i].ID;
                if(TrendQueue2[i].YEAR == startYear) { detailQue[result].YR1 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+1) { detailQue[result].YR2 = TrendQueue2[i].AMOUNT;}
                if(TrendQueue2[i].YEAR == startYear+2) { detailQue[result].YR3 = TrendQueue2[i].AMOUNT;}
            }
        }

        detailQue.sort((a, b) => b.YR3 - a.YR3 || b.YR2 - a.YR2);
        let useURL = '#|';
        if(topDiv.getAttribute("cattype") == 'expense') {useURL = useURL + 'spending|';} else {useURL = useURL + 'income|';}

        for (let i = 0; i < detailQue.length; i++) {
            let div2 = cec('div','MTSideDrawerItem2 MTSideDrawerItem',inDiv,'','',os4);
            let div3 = cec('a','MTSideDrawerDetail4',div2,' ' + detailQue[i].DESC,useURL + detailQue[i].ID+'|',os3);
            if(skiprow == false) {div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR1));}
            div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR2));
            div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue(detailQue[i].YR3));
            div3 = cec('span','MTSideDrawerDetail3',div2);
            if(i < curMonth) {
                div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue((detailQue[i].YR1 + detailQue[i].YR2 + detailQue[i].YR3) / curYears));
            } else {
                div3 = cec('span','MTSideDrawerDetail2',div2,getDollarValue((detailQue[i].YR1 + detailQue[i].YR2)/(curYears-1)));
            }
        }
        cec('div','MTSideDrawerItem2 MTSideDrawerItem',inDiv,'','',os4);
    }

    function MTHistoryFind(inDesc) {
        for (let i = 0; i < detailQue.length; i++) { if(detailQue[i].DESC == inDesc) {return(i);} }
        detailQue.push({"DESC": inDesc,"YR1": 0,"YR2": 0,"YR3": 0, "ID": ''});
        return detailQue.length-1;
    }
}

function MenuTrendsHistoryExport() {

    const CRLF = String.fromCharCode(13,10),c = ',';
    let csvContent = '',j = 0,Cols = 0;
    const spans = document.querySelectorAll('span.MTSideDrawerDetail' + [',span.MTSideDrawerDetail2,a.MTSideDrawerDetail4',''][getCookie(MTFlex.Name + '_SidePanel',true)]);
    spans.forEach(span => {
        j=j+1;
        if(Cols == 0) { if(span.innerText.startsWith('Average')) { Cols = j;}}
        csvContent = csvContent + getCleanValue(span.innerText,2);
        if(j == Cols) { j=0;csvContent = csvContent + CRLF;} else {csvContent = csvContent + c;}
    });
    downloadFile('Monarch Trends History ' + getDates('s_FullDate'),csvContent);
}
// [ Credit Score ]
function MenuCreditScore() {

    let el = document.querySelector('div.MTCreditScore');
    if(el) return;

    el = document.querySelector('[class*="Pill__Root-sc"]');
    if(!el) { MTSpawnProcess = 3;return;}
    const cs = el.nextElementSibling.innerText;
    if(cs) {
        let ocs = getCookie('MT_CreditScore',false);

        if(cs != ocs) {
            setCookie('MT_CreditScore',cs);
            setCookie('MT_CreditScoreOld',ocs);
            setCookie('MT_CreditScoreDate',getDates('s_ShortDate'));
        }
        ocs = getCookie('MT_CreditScoreOld',false);
        if(ocs != '' && ocs != cs) {
            let lit = cs > ocs ? 'Up' : 'Down';
            el = el.parentNode.parentNode.parentNode;
            cec('div','MTCreditScore',el,lit + ' from ' + getCookie('MT_CreditScoreOld',false) + ' on ' + getCookie('MT_CreditScoreDate',false),'','font-size: 13px;text-align: right; width: 100%;');
        }
    }
}

// [ Budgets ]
async function MenuPlanRefresh() {

    if(getCookie('MT_PlanLTB',true) == 0) return;

    let budgetI = [0,0,0,0],budgetE = [0,0,0,0]; // 0=remaining,1=budget,2=spent,3=use
    let div=null;
    const elements = document.querySelectorAll('[class*="PlanSummaryWidgetRow"]');
    for (const li of elements) {
        const ca = li.innerText.split('\n');
        if(ca.length > 0) {
            if(ca[0] == 'Income') {
                budgetI[1] = getCleanValue(ca[1]);budgetI[2]=getCleanValue(ca[2]);
                if(ca[3].length > 1) {budgetI[0] = getCleanValue(ca[3]);} else {budgetI[0] = getCleanValue(ca[4]);}
            }
            if(ca[0] == 'Expenses') {
                budgetE[1] = getCleanValue(ca[1]);budgetE[2]=getCleanValue(ca[2]);
                if(ca[3].length > 1) {budgetE[0] = getCleanValue(ca[3]);} else {budgetE[0] = getCleanValue(ca[4]);}
                div = li;
            }
        }
    }
    if(div == null) {MTSpawnProcess = 3;return;}

    let li = document.querySelector('div.MTBudget');
    if(li) return;
    div = cec('div','MTBudget',div);

    let bCK = 0,bCC = 0,bSV=0,LeftToSpend=0,BudgetRemain = 0,BRLit = 'Budget Remaining',LTSLit = 'Left to Spend';
    let noBudget=true;
    let snapshotData = await getAccountsData();
    let snapshotData4 = await GetTransactions(formatQueryDate(getDates('d_StartofLastMonth')),formatQueryDate(getDates('d_Today')),0,true,null,false);

    for (let i = 0; i < snapshotData.accounts.length; i += 1) {
        if(snapshotData.accounts[i].hideTransactionsFromReports == false) {
            if(snapshotData.accounts[i].isAsset == true && snapshotData.accounts[i].subtype.name == 'checking') {
                bCK+=Number(snapshotData.accounts[i].displayBalance);
            } else if (snapshotData.accounts[i].isAsset == true && snapshotData.accounts[i].subtype.name == 'savings') {
                bSV+=Number(snapshotData.accounts[i].displayBalance);
            } else if (snapshotData.accounts[i].isAsset == false && snapshotData.accounts[i].subtype.name == 'credit_card') {
                bCC+=Number(snapshotData.accounts[i].displayBalance);
            }
        }
    }
    const [bPD,bPDtx] = getPendingBalance();
    LeftToSpend = (bCK-bCC-bPD);
    if(getCookie('MT_PlanLTBIR',true) == 0) {budgetI[3] = budgetI[0];budgetE[3]=budgetE[0];} else {
        budgetI[3] = budgetI[1]-budgetI[2];budgetE[3]=budgetE[1]-budgetE[2];}

    if(getCookie('MT_PlanLTBII',true) == 0) {noBudget = false; if(budgetI[3] > 0) { BudgetRemain = budgetI[3];LeftToSpend = LeftToSpend + budgetI[3];}}
    if(getCookie('MT_PlanLTBIE',true) == 0) {noBudget = false; if(budgetE[3] >= 0) { BudgetRemain = BudgetRemain - budgetE[3];LeftToSpend = LeftToSpend - budgetE[3];} else {LTSLit=LTSLit + ' (Over Budget!)';}}
    let LeftToSpendStyle = css_green;if(LeftToSpend < 0) {LeftToSpendStyle = css_red;}

    writePlan('Total in Checking',getDollarValue(bCK,true),'','');
    writePlan('Total in Credit Cards',getDollarValue(bCC,true),'','');
    writePlan('Total Pending (' + bPDtx + ')',getDollarValue(bPD,true),'/transactions?isPending=true','');
    writePlan('Total Available',getDollarValue(bCK-bCC-bPD,true),'','font-weight: 500;');
    if(noBudget == false) {
        writePlan(BRLit,getDollarValue(BudgetRemain,true),'','font-weight: 500;','', true);
        writePlan(LTSLit,getDollarValue(LeftToSpend,true),'','font-weight: 500;',LeftToSpendStyle, true);
    }
    if(bSV > 0) {writePlan('Total in Savings',getDollarValue(bSV,true),'','','', true);}

    function writePlan(inDesc,inValue,inHref,inStyle,inStyle2,isSpace) {
        let div2 = cec('div','',div,'','',isSpace == true ? 'margin-top: 10px;' : '');
        cec(inHref != '' ? 'a' : 'span','MTBudget1',div2,inDesc,inHref,inStyle);
        cec('span','MTBudget2 fs-exclude',div2,inValue,'',inStyle + inStyle2);
    }

    function getPendingBalance() {
        let amt = 0,cnt = 0;
        for (let j = 0; j < snapshotData4.allTransactions.results.length; j += 1) {
            if(snapshotData4.allTransactions.results[j].amount != 1) {
                amt = amt + snapshotData4.allTransactions.results[j].amount;cnt+=1;}
        }
        amt = amt * -1;return [amt,cnt];
    }
}
// [ Budget Plan Reorder ]
function MenuPlanBudgetReorder() {
    const budgetGrid = document.querySelector('[class*="Plan__SectionsContainer"]');
    const separator = document.querySelector('[class*="PlanSectionFooter__Separator"]');

    if(budgetGrid && separator && !budgetGrid.dataset.mtInit === true) {
        const defaultOrder = [0, 1, 2];
        let order = getCookie("MT_BudgetOrder");
        if(!order) {
            setCookie("MT_BudgetOrder", JSON.stringify(defaultOrder));
            order = defaultOrder;
        } else {
            order = JSON.parse(order);
        }

        budgetGrid.style.cssText += "display:flex;flex-direction:column;";
        const budgetSections = budgetGrid.children;
        if(budgetSections.length > 1) {
            Array.from(budgetSections).forEach((el, idx) => {
                el.id = `budget-section-${idx}`;
                el.style.cssText += `order:${order.at(idx) ?? 0}`;
            });
            budgetGrid.dataset.mtInit = true;
        }

        const budgetTotal = separator.nextElementSibling;
        separator.style.cssText += "order:100;";
        budgetTotal.style.cssText += "order:101;";
        budgetGrid.appendChild(separator);
        budgetGrid.appendChild(budgetTotal);
    }
}

// [ Edit Account ]
function MTUpdateAccountPartner() {
    const li = document.querySelector('[class*="EditAccountForm__FormContainer"]');
    if(li) {
        let li2 = li.childNodes[4];
        let div = document.createElement('div');
        div = li.insertBefore(div, li2);
        cec('div','',div,'Account Group (Reports / [Trends, Accounts, Tags] and Accounts / Summary)','','font-size: 14px;font-weight: 500;');
        div = cec('input','MTInputClass',div,'','','margin-bottom: 12px;width: 100%;');
        const p = SaveLocationPathName.split('/');
        if(p.length > 2) {div.value = getCookie('MTAccounts:' + p[3],false);}
    }
}
// [ Calendar ]
function MM_FixCalendarYears() {

    const elements = document.querySelectorAll('select[name]');
    if(elements) {
        for (const li of elements) {
            if(li.getAttribute('hacked') != 'true') {
                if(li.name == 'year') {
                    MM_FixCalendarDropdown(li);
                    li.setAttribute('hacked','true');
                }
            }
        }
    }
}

function MM_FixCalendarDropdown(calItems) {

    let ii = parseInt(getCookie("MT_LowCalendarYear",false));
    if(ii < 2000) {ii = 2000;}
    ii -= 2000;
    for (let i = 0; i < ii; i++) { calItems.removeChild(calItems.firstChild); }
}

// [ Splits ]
function MM_SplitTransaction() {

    let li = document.querySelector('[class*="TransactionSplitOriginalTransactionContainer__OriginalAmountColumn"]');
    if(li) {
        let AmtA = getCleanValue(li.innerText,2);
        li = document.querySelector('[class*="TransactionSplitModal__TabsContainer-sc"]');
        let div = cec('button','MTSplitButton',li,'Split 50%','','margin-left: 0px;');
        let AmtB = AmtA / 2;
        AmtB = parseFloat(AmtB).toFixed(2);
        AmtA = AmtA - AmtB;
        AmtA = parseFloat(AmtA).toFixed(2);
        div.addEventListener('click', () => { inputTwoFields('input.CurrencyInput__Input-ay6xtd-0',AmtA,AmtB); });
    }
}
// [ Fix Merchant Popper ]
function MM_SearchMerchants(inDiv) {

    let merEntry = inDiv.childNodes[0].childNodes[0];
    if(merEntry) {
        let merText = inDiv.childNodes[0].childNodes[1].childNodes[1].innerText;
        if(merText) {
            const ii = merText.indexOf('*');
            if(ii < 16) {merText = getStringPart(merText,'*','right');}
            merText = merText.trim();
            let merObjs = ['aplpay', 'gglpay','the ', 'paypal','www.'];
            for (let i = 0; i < merObjs.length; ++i) {
                if(merText.toLowerCase().startsWith(merObjs[i].toLowerCase())) {
                    let j = merObjs[i].length;
                    merText = merText.slice(j);
                    merText = merText.trim();
                }
            }
            merObjs = ['.','-','+',',','='];
            for (let i = 0; i < merObjs.length; ++i) {
                if(merText[0] == merObjs[i]) {merText = merText.slice(1);}
                merText = getStringPart(merText,merObjs[i],'left');
            }

            merText = getStringPart(merText,' ','left');
            merText = merText.substring(0, 9).toLowerCase();
            merText = merText[0].toUpperCase() + merText.slice(1);
            merEntry.focus({ focusVisible: true });
            merEntry.value = '';
            document.execCommand('insertText', false, merText );
        }
    }
}

// Menu Page Functions
function MenuHistory(OnFocus) {

    if (SaveLocationPathName.startsWith('/categor')) {
        if(OnFocus == true) {
            if(getCookie('MT_Budget',true) == 1) { MM_hideElement('[class*="CategoryDetails__PlanSummaryCard"]',1);}
        }
        let div = findButton('Filters');
        if(div) {
            cec('button','MTHistoryButton',div.parentNode,' Monthly Summary');
            buildCategoryGroups();
        }
    }
}

function MenuCategories(OnFocus) {
    if(SaveLocationPathName.startsWith('/categories')) {
       if(OnFocus == false) {removeAllSections('.MTHistoryButton');}
    }
}

function MenuPlan(OnFocus) {

    if (SaveLocationPathName.startsWith('/plan') || SaveLocationPathName.startsWith('/dashboard')) {
        if(OnFocus == true) {MTSpawnProcess = 3;}
    }
}

function MenuLogin(OnFocus) {

    if (SaveLocationPathName.startsWith('/login')) {if(OnFocus == false) { MM_MenuFix(); } }
}

function MenuAccounts(OnFocus) {

    if(OnFocus == true) {
        if (SaveLocationPathName.startsWith('/accounts/details') && SaveLocationPathName.endsWith('/edit') ) { MTUpdateAccountPartner(); }
        if (SaveLocationPathName == '/accounts' ) { MTSpawnProcess = 4; }
    }
}

function MenuSettings(OnFocus) {

    if(SaveLocationPathName.startsWith('/settings/categories')) {
        if(OnFocus == false) {accountGroups=[];}
        if(OnFocus == true) {
            let divs = document.querySelectorAll('[class*="ManageCategoryGroupCard__Header-"]');
            if(divs.length == 0) {SaveLocationPathName = '';return;}
            let div = null,grp=null,isExp=null;
            for (let i = 0; i < divs.length; ++i) {
                grp = divs[i].getAttribute('data-rbd-drag-handle-draggable-id');
                isExp = divs[i].parentNode.parentNode.parentNode;
                if(isExp && isExp.innerText.startsWith('Expenses')) {
                    div = cec ('div','',divs[i],'','','flex:1;');
                    div = cec('label','',div,'Fixed Expense (MM Tweaks)','','font-size: 13px;float:right;','htmlFor','MTFixed');
                    div = cec('input','MTFixedCheckbox',div,'','','margin-top: 2px;','id','MTFixed');
                    div.setAttribute('grp',grp);
                    div.type = 'checkbox';
                    if(getCookie('MTGroupFixed:' + grp,true) == true) {div.checked = 'true';}
                }
            }
        }
    }

    let dropDowns = 0;
    if (SaveLocationPathName.startsWith('/settings/display')) {
        if(OnFocus == false) { }
        if(OnFocus == true) {
            MenuDisplay_Input('Monarch Money Tweaks - ' + version,'','header');
            MenuDisplay_Input('Lowest Calendar/Data year','','spacer');
            MenuDisplay_Input('','MT_LowCalendarYear','number');
            MenuDisplay_Input('Menu','','spacer');
            MenuDisplay_Input('Hide Budget','MT_Budget','checkbox');
            MenuDisplay_Input('Hide Recurring','MT_Recurring','checkbox');
            MenuDisplay_Input('Hide Goals','MT_Goals','checkbox');
            MenuDisplay_Input('Hide Investments','MT_Investments','checkbox');
            MenuDisplay_Input('Hide Advice','MT_Advice','checkbox');
            MenuDisplay_Input('Accounts','','spacer');
            MenuDisplay_Input('"Refresh All" accounts the first time logging in for the day','MT_RefreshAll','checkbox');
            MenuDisplay_Input('Hide Accounts Net Worth Graph panel','MT_HideAccountsGraph','checkbox');
            MenuDisplay_Input('Transactions','','spacer');
            MenuDisplay_Input('Transactions panel has smaller font & compressed grid','MT_CompressedTx','checkbox');
            MenuDisplay_Input('Highlight Pending Transactions (Preferences / "Allow Pending Edits" must be off)','MT_PendingIsRed','checkbox');
            MenuDisplay_Input('Hide Create Rule pop-up','MT_HideToaster','checkbox');
            MenuDisplay_Input('Assist and populate when Searching Merchants','MT_MerAssist','checkbox');
            MenuDisplay_Input('Reports','','spacer');
            MenuDisplay_Input('Hide the Difference Amount in Income & Spending chart tooltips','MT_HideTipDiff','checkbox');
            MenuDisplay_Input('Monarch Money Tweaks report font','MT_MonoMT','dropdown','',['System','Monospace','Courier','Courier New','Arial','Trebuchet MS','Verdana']);
            MenuDisplay_Input('Reports / Trends','','spacer');
            MenuDisplay_Input('Always compare to End of Month','MT_TrendFullPeriod','checkbox');
            MenuDisplay_Input('By Month "Avg" ignores Current Month','MT_TrendIgnoreCurrent','checkbox');
            MenuDisplay_Input('Hide percentages not in Difference columns','MT_TrendHidePer1','checkbox');
            MenuDisplay_Input('Hide percentages in Difference columns','MT_TrendHidePer2','checkbox');
            MenuDisplay_Input('Show Fixed/Flexible/Savings percentage card','MT_TrendCard1','checkbox');
            MenuDisplay_Input('Hide next month (Based on last year)','MT_TrendHideNextMonth','checkbox');
            MenuDisplay_Input('Always hide decimals','MT_NoDecimals','checkbox');
            MenuDisplay_Input('Reports / Accounts','','spacer');
            MenuDisplay_Input('Use calculated balance (Income, Expenses & Transfers) for Checking & Credit Cards','MT_AccountsBalance','checkbox');
            MenuDisplay_Input('Hide accounts marked as "Hide this account in list"','MT_AccountsHidden','checkbox');
            MenuDisplay_Input('Hide accounts marked as "Hide balance from net worth"','MT_AccountsHidden2','checkbox');
            MenuDisplay_Input('Hide Last Updated','MT_AccountsHideUpdated','checkbox');
            MenuDisplay_Input('Hide Net Change','MT_AccountsHidePer1','checkbox');
            MenuDisplay_Input('Hide percentage of Net Change','MT_AccountsHidePer2','checkbox');
            MenuDisplay_Input('Hide Pending & Projected Balance information','MT_AccountsHidePending','checkbox');
            MenuDisplay_Input('Show total Checking card','MT_AccountsCard0','checkbox');
            MenuDisplay_Input('Show total Savings card','MT_AccountsCard1','checkbox');
            MenuDisplay_Input('Show total Credit Card Liability card','MT_AccountsCard2','checkbox');
            MenuDisplay_Input('Show total Investments card','MT_AccountsCard3','checkbox');
            MenuDisplay_Input('Show total 401k card','MT_AccountsCard4','checkbox');
            MenuDisplay_Input('Month balances are "Based on end of each month" instead of "Based on beginning of each month"','MT_AccountsEOM','checkbox');
            MenuDisplay_Input('Always hide decimals','MT_AccountsNoDecimals','checkbox');
            MenuDisplay_Input('Budget','','spacer');
            MenuDisplay_Input('Budget panel has smaller font & compressed grid','MT_PlanCompressed','checkbox');
            MenuDisplay_Input('Show "Left to Spend" from Checking after paying off Credit Cards in Budget Summary','MT_PlanLTB','checkbox');
            MenuDisplay_Input('Ignore Budget Income remaining in "Left to Spend"','MT_PlanLTBII','checkbox','margin-left: 22px;');
            MenuDisplay_Input('Ignore Budget Expenses remaining in "Left to Spend"','MT_PlanLTBIE','checkbox','margin-left: 22px;');
            MenuDisplay_Input('Ignore Rollover budgets, always use actual Budget minus actual Spent for “Left to Spend”','MT_PlanLTBIR','checkbox','margin-left: 22px;');
            MenuDisplay_Input('Reorder Budget Categories','MT_BudgetOrder','dropdown','',['Income, Expenses, Contributions|[0,1,2]','Expenses, Income, Contributions|[1,0,2]','Expenses, Contributions, Income|[2,0,1]']);
            MenuDisplay_Input('System','','spacer');
            MenuDisplay_Input('Debug data to console log (Only turn on if asked)','MT_Debug','checkbox');
        }
    }
    function MenuDisplay_Input(inValue,inCookie,inType,inStyle,optValue) {

        let qs = document.querySelector('.SettingsCard__Placeholder-sc-189f681-2');
        if(qs != null) {
            qs = qs.firstChild.lastChild;
            let e1 = document.createElement('div'),e2=null,e3=null;
            if(inType == 'spacer') {
                e1.className = 'MTSpacerClass';
                qs.after(e1);
                qs = document.querySelector('.SettingsCard__Placeholder-sc-189f681-2');
                qs = qs.firstChild.lastChild;
                e1 = document.createElement('div');
                e1.style = 'font-size: 17px; font-weight: 500;margin-left:24px;';
                e1.innerText = inValue;
                qs.after(e1);
                return;
            }
            switch(inType) {
                case 'header':
                    e1.innerText = inValue;
                    e1.style = 'font-size: 18px; font-weight: 500; margin-left:24px;padding-bottom:12px;';
                    break;
                case 'dropdown':
                    e1.style = 'margin: 11px 25px; display:flex;column-gap: 10px;';
                    dropDowns+=1;
                    break;
                default:
                    e1.style = 'margin: 11px 25px;';
            }
            qs.after(e1);
            let OldValue = getCookie(inCookie,false);
            if(inType == 'checkbox') {
                e2 = cec('input','MTCheckboxClass',e1,'','',inStyle,'type',inType);
                e2.id = inCookie;
                if(OldValue == 1) {e2.checked = 'checked';}
                e2.addEventListener('change', () => { flipCookie(inCookie,1); MM_MenuFix();});
                e3 = document.createElement("label");
                e3.innerText = inValue;
                e3.htmlFor = inCookie;
                e2.parentNode.insertBefore(e3, e2.nextSibling);
            }
            if(inType == 'number') {
                cec('div','',e1,inValue,'','font-size: 14px; font-weight: 500;');
                e2 = cec('input','MTInputClass',e1,'','','','type',inType);
                e2.min = 2000;
                e2.max = getDates('n_CurYear');
                e2.value = OldValue;
                e2.addEventListener('change', () => { setCookie(inCookie,e2.value);});
            }
            if(inType == 'dropdown') {
                let mtObj = [],fnd=false;
                for (let i = 0; i < optValue.length; i++) {
                    mtObj = optValue[i].split('|');if(mtObj[1] == null) mtObj[1] = mtObj[0];
                    if(OldValue == mtObj[1]) {OldValue = mtObj[0];fnd=true;break;}
                }
                if(fnd==false) {
                    mtObj = optValue[0].split('|');if(mtObj[1] == null) mtObj[1] = mtObj[0];
                    setCookie(inCookie,mtObj[1]);OldValue = mtObj[0];
                }
                cec('div','',e1,inValue + ':','','margin-top: 10px;');
                e2 = cec('div','MTdropdown',e1,'','','width: 270px;');
                e2 = cec('button','MTSettButton' + dropDowns,e2,OldValue + ' ','','width: 270px; margin-left: 0px !important;');
                e3 = cec('div','MTFlexdown-content',e2,'','','','id','MTDropdown'+dropDowns);
                for (let i = 0; i < optValue.length; i++) {
                    mtObj = optValue[i].split('|');if(mtObj[1] == null) mtObj[1] = mtObj[0];
                    e2 = cec('a','MTSetupButton',e3,mtObj[0],'','','MTSetupOption',inCookie);
                    e2.setAttribute('MTSetupValue',mtObj[1]);
                }
            }
        }
    }
}
// Function calls which need waits and retries ...
function MenuCheckSpawnProcess() {

    if(MTSpawnProcess > 0) {
        const sp = MTSpawnProcess;MTSpawnProcess = 0;
        switch(sp) {
            case 5:
                MM_Init();
                MenuReportsFix();
                break;
            case 1:
                MF_GridDraw(0);
                break;
            case 2:
                MenuTrendsHistoryDraw();
                break;
            case 3:
                MenuPlanRefresh();
                MenuPlanBudgetReorder();
                MenuCreditScore();
                break;
            case 4:
                MenuAccountsSummary();
                break;
            case 6:
                if(getCookie('MT_MerAssist',true)) {onClickContainer();}
                break;
            case 7:
                MM_SplitTransaction();
                break;
            case 8:
                break;
        }
    }
}
// Generic on-click event handler ...
window.onclick = function(event) {

    let cn = event.target.className;
    if(typeof cn === 'string') {
        if(debug == 1) console.log(cn,event.target);
        cn = getStringPart(cn,' ','left');
        switch (cn) {
            case '':
                MTSpawnProcess=6;return;
            case 'Menu__MenuItem-nvthxu-1':
            case 'Flex-sc-165659u-0':
                if(event.target.innerText == 'Last') {onClickLastNumber();}
                if(startsInList(event.target.innerText,['\uf183','\uf13e','Light','Dark', 'System preference'])) {MTSpawnProcess = 5;return;}
                break;
            case 'Text-qcxgyd-0':
                if(event.target.innerText == 'Split') { MTSpawnProcess = 7;}
                break;
            case 'DateInput_input':
                MM_FixCalendarYears();return;
            case 'Tab__Root-ilk1fo-0':
            case 'Flex-sc-165659u-0':
                if(event.target.innerText == 'Summary') { MTSpawnProcess = 3;}return;
            case 'PlanHeader__Tab-sc-19mk9dy-1':
                if(event.target.innerText == 'Budget') { MTSpawnProcess = 3;} return;
            case 'MTTrends':
            case 'MTAccounts':
            case 'MTTags':
                MTFlexDate1 = getDates('d_Today');MTFlexDate2 = getDates('d_Today');
                MenuReportsGo(cn);return;
            case 'MTSideDrawerRoot':
            case 'MTTrendCellArrow':
            case 'MTInputButton':
                if(onClickCloseDrawer() == true) {MenuReportsGo(MTFlex.Name);}
                return;
            case 'MTTrendCellArrow2':
                event.target.innerText = ['',''][MM_flipSideElement(MTFlex.Name + '_SidePanel')];
                return;
            case 'MTPanelLink':
                MenuTrendsHistoryExport();
                return;
            case 'MTFlexBig':
                onClickMTFlexBig();return;
            case 'MThRefClass2':
                onClickMTFlexExpand();return;
            case 'MTFlexButton1':
            case 'MTFlexButton2':
            case 'MTFlexButton4':
            case 'MTSettButton1':
            case 'MTSettButton2':
            case 'MTSettButton3':
            case 'MTSettButton4':
                onClickMTDropdown(cn.slice(12));return;
            case 'MTFlexCellArrow':
                if(MTFlex.Name == 'MTTrends') {onClickMTFlexArrow(event.target.getAttribute("triggers"));}
                return;
            case 'MTButton1':
            case 'MTButton2':
            case 'MTButton4':
                setCookie(MTFlex.Name + cn.slice(2),event.target.getAttribute('mtoption'));
                MenuReportsGo(MTFlex.Name);return;
            case 'MTFlexGridTitleCell':
            case 'MTFlexGridTitleCell2':
                onClickGridSort();return;
            case 'MTFlexCheckbox':
                MTFlex.Button3 = event.target.checked;
                setCookie(MTFlex.Name + 'Button3',MTFlex.Button3);
                if(MTFlex.Button3 == true) {MM_hideElement('div.MTFlexSpacer',1);} else {MM_hideElement('div.MTFlexSpacer',0);}
                return;
            case 'MTFixedCheckbox':
                cn = event.target.getAttribute('grp');
                flipCookie('MTGroupFixed:' + cn,1);
                return;
            case 'MTFlexButtonExport':
                MT_GridExport(); break;
            case 'MTSetupButton':
                onClickSetupDropdown(event.target); break;
            case 'MTBub1':
                switch (startsInList(event.target.textContent,['SUM','AVG','CNT'])) {
                    case 1: navigator.clipboard.writeText(MTFlexSum[1]);return;
                    case 2: navigator.clipboard.writeText(getCleanValue('$' + MTFlexSum[1]/MTFlexSum[0],2));return;
                    case 3: navigator.clipboard.writeText(MTFlexSum[0]);return;
                }
                break;
            case 'MTHistoryButton':
                onClickMTFlexArrow(SaveLocationPathName.slice(1)); return;
            case 'MTFlexGridDCell2':
                onClickSumCells(); return;
            case 'MTFlexGridDCell':
            case 'MTSideDrawerDetail4':
                if(event.target.hash) {
                    if(event.target.hash.startsWith('#') == true) {
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.preventDefault();
                        const p = event.target.hash.split('|');
                        MenuReportsSetFilter(p[1],p[2],p[3],p[4]);
                        window.location.replace('/reports/' + p[1]);
                    }
                }
                return;
        }
        if(event.target.className.includes('AbstractButton')) {
            if(event.target.className.includes('EditAccountForm__StyledSubmitButton')) {
                const li = document.querySelector('input.MTInputClass');
                if(li) {
                    let inputValue = li.value;
                    let p = SaveLocationPathName.split('/');
                    if(p) {setCookie('MTAccounts:' + p[3],inputValue.trim());}
                }
            }
        }
        if(cn.startsWith('TabNavLink')) {
            if(event.target.pathname == window.location.pathname) {
                removeAllSections('.MTFlexContainer');
                MenuReportsPanels('');
                MenuReportsCustomUpdate(inList(window.location.pathname,['/reports/spending','/reports/income']));
                return;
            }
        }
    }
    onClickMTDropdownRelease();
};

function onClickMTFlexExpand() {

    let x = event.target.parentNode.getAttribute('MTSection');
    if(x) {
        x = Number(x) + 1;
        flipCookie(MTFlex.Name + 'Expand' + x,1);
        MT_GridDrawExpand();
    }
}

function onClickCloseDrawer() {

    let divs = null,returnV=false;
    switch(event.target.innerText) {
        case 'Apply':
            if(MTFlex.TriggerEvent == 2) {
                let lv = null,hv=null;
                divs = document.querySelectorAll('input.MTInputClass');
                for (let i = 0; i < divs.length; ++i) {
                    if(i == 0) lv = divs[i].value;
                    if(i == 1) hv = divs[i].value;
                }
                if(lv > hv) {divs[0].style = css_red;return;}
            }

            divs = document.querySelectorAll('input.MTInputClass');
            for (let i = 0; i < divs.length; ++i) {
                let value = divs[i].value;
                if(MTFlex.TriggerEvent == 3) {
                    MTFlexDate2 = unformatQueryDate(value);setCookie(MTFlex.Name + 'HigherDate',formatQueryDate(MTFlexDate2));
                } else {
                    if(i == 0) {MTFlexDate1 = unformatQueryDate(value);setCookie(MTFlex.Name + 'LowerDate',formatQueryDate(MTFlexDate1));}
                    if(i == 1) {MTFlexDate2 = unformatQueryDate(value);setCookie(MTFlex.Name + 'HigherDate',formatQueryDate(MTFlexDate2));}
                }
            }
            divs = document.querySelector('input.MTDateCheckbox');
            if(divs) {if(divs.checked == true) {setCookie(MTFlex.Name + 'HigherDate','d_Today');}}
            returnV = true;
            break;
        case 'Last Month':
            if(MTFlex.TriggerEvent == 2) {setCookie(MTFlex.Name + 'LowerDate','d_StartofLastMonth');}
            setCookie(MTFlex.Name + 'HigherDate','d_EndofLastMonth');
            returnV = true;
            break;
        case 'This Month':
            if(MTFlex.TriggerEvent == 2) {setCookie(MTFlex.Name + 'LowerDate','d_StartofMonth');}
            setCookie(MTFlex.Name + 'HigherDate','d_Today');
            returnV = true;
            break;
    }
    removeAllSections('div.MTHistoryPanel');
    return returnV;
}

function onClickContainer() {

    const divsWithLtrDir = document.querySelectorAll('div[dir="ltr"]');
    let cn = '',it = '';
    if(divsWithLtrDir.length > 0) {
        for (let i = 0; i < divsWithLtrDir.length; ++i) {
            cn = divsWithLtrDir[i].className;
            it = divsWithLtrDir[i].innerText;
            if(cn != 'osano-cm-window' && it.startsWith('Original')) {MM_SearchMerchants(divsWithLtrDir[i]);return;}
        }
    }
}

function onClickSetupDropdown(et) {
    let cn = et.getAttribute('mtsetupoption');
    let cvalue = et.getAttribute('mtsetupvalue');
    setCookie(cn,cvalue);
    const pDiv = et.parentNode.parentNode;
    pDiv.childNodes[0].textContent = et.innerText + ' ';
}

function onClickLastNumber() {

    const id = document.querySelector('input.NumericInput__Input-sc-1km21mm-0');
    if(id) {id.type = 'Number';id.min = 0; id.max = 365;}
}
function onClickSumCells() {
    let x = Number(getCleanValue(event.target.textContent,2));
    if(event.target.id != 'selected') {
        event.target.style = 'border: 2px solid green;';event.target.id = 'selected';
        MTFlexSum[0] +=1; MTFlexSum[1] += x;
    } else {
        event.target.style = '';event.target.id = '';
        MTFlexSum[0] -=1; MTFlexSum[1] -= x;
    }
    if(MTFlexSum[0] < 2) {MTFlex.bub.setAttribute('style','display:none;');} else {
        MTFlex.bub.setAttribute('style','display:block;');
        MTFlex.bub1.textContent = 'SUM: ' + getDollarValue(MTFlexSum[1],false);
        MTFlex.bub2.textContent = 'AVG: ' + getDollarValue(MTFlexSum[1]/MTFlexSum[0],false);
        MTFlex.bub5.textContent = 'CNT: ' + MTFlexSum[0];
    }
}

function onClickMTDropdown(cActive) {
    if(cActive == r_FlexButtonActive) { onClickMTDropdownRelease(); } else {
        onClickMTDropdownRelease();
        if(document.getElementById("MTDropdown"+cActive).classList.toggle("show") == true) { r_FlexButtonActive = cActive;} else { r_FlexButtonActive = 0;}
    }
}

function onClickMTDropdownRelease() {
    if(r_FlexButtonActive > 0) {
        let li = document.getElementById("MTDropdown" + r_FlexButtonActive);
        if(li) {li.className = 'MTFlexdown-content';}
        r_FlexButtonActive = 0;
    }
}

function onClickMTFlexBig() {
    let inputs = [];
    if(MTFlex.TriggerEvent == 2) {
        inputs.push({'NAME': 'Lower Date', 'TYPE': 'date', 'VALUE': formatQueryDate(MTFlexDate1)});
        inputs.push({'NAME': 'Higher Date', 'TYPE': 'date', 'VALUE': formatQueryDate(MTFlexDate2)});
        MT_GetInput(inputs);
    } else if (MTFlex.TriggerEvent == 3) {
        inputs.push({'NAME': 'As of Date', 'TYPE': 'date', 'VALUE': formatQueryDate(MTFlexDate2)});
        MT_GetInput(inputs);
    } else {
        if(getDates('isToday',MTFlexDate2)) { MTFlexDate1 = getDates('d_StartofLastMonth'); MTFlexDate2 = getDates('d_EndofLastMonth');
        } else { MTFlexDate1 = getDates('d_StartofMonth'); MTFlexDate2 = getDates('d_Today');}
        MenuReportsGo(MTFlex.Name);
    }
}

function onClickMTFlexArrow(inP) {

    if(inP != null) {
        let p = inP.split('/');
        if(p) { MenuTrendsHistory(p[0],p[1]); }
    }
}

function onClickGridSort() {

    let Column = event.target.getAttribute("column");
    if(Column != '') {
        let elSelected = Number(Column);
        let cn = MTFlex.Name + 'Sort';
        if(MTFlex.SortSeq != null) {cn = cn + MTFlex.SortSeq[MTFlex.Button2];}
        let elCurrent = getCookie(cn,true);
        if(Math.abs(elCurrent) == Math.abs(elSelected)) { elSelected = elCurrent * -1; }
        setCookie(cn,elSelected);
        MF_GridDraw(1);
    }
}

// Monarch Money needed
function isDarkMode() {
    const rObj = document.querySelector('[class*=Page__Root]');
    if(rObj == null) {return null;}
    const cssObj = window.getComputedStyle(rObj, null);
    if(cssObj == null) {return null;}
    const bgColor = cssObj.getPropertyValue('background-color');
    if(bgColor == null || bgColor == '') {return null;}
    if (bgColor === 'rgb(25, 25, 24)') { return 1; } else { return 0; }
}
function addStyle(aCss) {
    if(r_headStyle == null) { r_headStyle = document.getElementsByTagName('head')[0]; }
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    r_headStyle.appendChild(style);
}

// Create Element Child (element,className,parentNode,innerText,href,style,[extra])
function cec(e, c, p, it, hr, st, a1, a2,isAfter) {
    if(css_cec == true) return;
    const div = document.createElement(e);
    if (c) div.className = c;
    if (it) div.innerText = it;
    if (hr) div.href = hr;
    if (st) div.style = st;
    if (a1) div.setAttribute(a1, a2);
    if(isAfter == true) { return p.after(div); } else { return p.appendChild(div);}
}
// Generic Functions
function removeAllSections(inDiv) {
    const divs = document.querySelectorAll(inDiv);
    for (let i = 0; i < divs.length; ++i) { divs[i].remove(); }
}

function inputTwoFields(InSelector,InValue1,InValue2) {

    let x = document.querySelectorAll(InSelector);
    if(x[0]) {
        x[0].focus();
        x[0].value = '';
        document.execCommand('insertText', false, InValue1);
        if(x[1]) {
            x[1].focus();
            x[1].value = '';
            document.execCommand('insertText', false, InValue2);
        }
    }
}

function getMonthName(inValue,inType) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if(inType == 2) {
        if(inValue) {
            const [year, month, day] = inValue.split('-');
            return months[Number(month)-1].substring(0,3) + ' ' + day + ', ' + year;} else {return '';}
    } else if (inType == true) {return months[inValue].substring(0,3); } else { return months[inValue];}
}

function getDates(InValue,InDate) {

    let d = null;
    if(InDate) { d = new Date(InDate);} else { d = new Date(); }
    let month = d.getMonth(), day = d.getDate(), year = d.getFullYear();
    if(InValue == 'isToday') {
        let todaysDate = new Date();
        if(InDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {return true;} else {return false;}
    }

    switch (InValue) {
        case 'n_CurYear':return(year);
        case 'n_CurMonth':return(month);
        case 'n_CurDay':return(day);
        case 'd_Today':return d;
        case 'd_Yesterday':d.setDate(d.getDate() - 1);return d;
        case 'd_MinusWeek':d.setDate(d.getDate() - 7);return d;
        case 'd_Minus2Weeks':d.setDate(d.getDate() - 14);return d;
        case 'd_Minus3Months':d.setDate(1);d.setMonth(d.getMonth() - 2);return d;
        case 'd_Minus6Months':d.setDate(1);d.setMonth(d.getMonth() - 5);return d;
        case 'd_Minus1Year':d.setDate(1);d.setFullYear(d.getFullYear() - 1);return d;
        case 'd_Minus2Years':d.setDate(1);d.setFullYear(d.getFullYear() - 2);return d;
        case 'd_Minus3Years':d.setDate(1);d.setFullYear(d.getFullYear() - 3);return d;
        case 'd_Minus4Years':d.setDate(1);d.setFullYear(d.getFullYear() - 4);return d;
        case 'd_Minus5Years':d.setDate(1);d.setFullYear(d.getFullYear() - 5);return d;
        case 'd_StartofMonth':d.setDate(1);return d;
        case 'd_EndofMonth':day = daysInMonth(month,year); d.setDate(day);return d;
        case 'd_StartofNextMonthLY':month+=1;d.setMonth(month);d.setDate(1);d.setYear(year-1);return d;
        case 'd_EndofNextMonthLY':month+=1;day = daysInMonth(month,year); d.setMonth(month);d.setDate(day);d.setYear(year-1);return d;
        case 'd_StartOfYear':d.setDate(1);d.setMonth(0);return d;
        case 's_FullDate':return(getMonthName(month,true) + ' ' + day + ', ' + year );
        case 's_ShortDate':return(getMonthName(month,true) + ' ' + day);
        case 's_MidDate':return(getMonthName(month,true) + ' ' + year);
        case 'd_ThisQTRs':
            if(month < 3) {month = 0;}
            if(month == 4 || month == 5) {month = 3;}
            if(month == 7 || month == 8) {month = 6;}
            if(month == 10 || month == 11) {month = 9;}
            d.setFullYear(year,month,1);
            return d;
        case 'd_StartofLastMonth':
            month-=1;
            if(month < 0) {month = 11;year-=1;}
            day = 1;
            d.setFullYear(year, month, day);return d;
        case 'd_EndofLastMonth':
            month-=1;
            if(month < 0) {month = 11;year-=1;}
            day = daysInMonth(month,year);
            d.setFullYear(year, month, day);return d;
        case 'i_Last12s':year-=1;break;
        case 'i_Last12e':if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year);}break;
        case 'i_LastYearYTDs':month = 0;day = 1;year-=1;break;
        case 'i_LastYearYTDe':
            year-=1;if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year); }break;
        case 'i_ThisQTRs':
            if(month < 3) {month = 0;}
            if(month == 4 || month == 5) {month = 3;}
            if(month == 7 || month == 8) {month = 6;}
            if(month == 10 || month == 11) {month = 9;}
            day = 1;
            break;
        case 'i_ThisQTRe':
            if(month < 2) {month = 2;}
            if(month == 3 || month == 4) {month = 5;}
            if(month == 6 || month == 7) {month = 8;}
            if(month == 9 || month == 10) {month = 11;}
            if(getCookie('MT_CalendarEOM',true) == 1) {day = daysInMonth(month,year); }
            break;
        default:
            alert('Invalid Date in getDates. (' + InValue + ')');
            return;
    }
    month+=1;
    const FullDate = [("0" + month).slice(-2),("0" + day).slice(-2),year].join('/');
    return(FullDate);
}

function unformatQueryDate(date) {

    let year = Number(date.slice(0,4));
    let month = Number(date.slice(5,7)) -1;
    let day = Number(date.slice(8,10));
    const x = new Date(year,month,day);
    return x;
}

function formatQueryDate(date) {

    var d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {month = '0' + month;}
    if (day.length < 2) {day = '0' + day;}
    return [year, month, day].join('-');
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function findButton(inName) {
    if(inName) {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.innerText.includes(inName)) {return button;}
        }
    }
    return null;
}

function startsInList(v,p) {return inList(v,p,true);}
function inList(v,p,sW) {
    for (let i = 0; i < p.length; ++i) {
        if(sW == true) {
            if(v.startsWith(p[i]) == true) {return i+1;}
        } else {
            if(v == p[i]) {return i+1;}
        }
    }
    return 0;
}

function getStringPart(inValue, inChr, inDirection) {
    const idx = inValue.indexOf(inChr);
    if (idx === -1) {return inValue;}
    if (inDirection === 'right') { return inValue.slice(idx + 1); } else {return inValue.slice(0, idx);}
}

function replaceBetweenWith(InValue,InStart,InEnd,InReplaceWith) {

    let result = InValue;
    if(InValue != null) {
        let a = InValue.indexOf(InStart);
        if(a > 0) {
            let b = InValue.indexOf(InEnd,a+1);
            if(b > a) {
                b = b + InEnd.length;
                result = InValue.substring(0, a) + InReplaceWith + InValue.substring(b);
            }
        }
    }
    return result;
}

function getCleanValue(inValue,inDec) {

    if(inValue.startsWith('$') || inValue.startsWith('-') || inValue.startsWith('+')) {
        inValue = inValue.split(" ")[0];
        inValue = replaceBetweenWith(inValue,'(',')','');
        const AmtStr = inValue.replace(/[$,]+/g,"");
        let Amt = Number(AmtStr);
        if(inDec > 0) {Amt = Amt.toFixed(inDec);}
        return Amt;
    }
    else { return inValue; }
}

function getDollarValue(InValue,ignoreCents) {

    if(InValue == null) {return '';}
    if(InValue === -0 || isNaN(InValue)) {InValue = 0;}
    if(ignoreCents == true) { InValue = Math.round(InValue);}
    let useValue = InValue.toLocaleString("en-US", {style:"currency", currency:css_currency});
    if(ignoreCents == true) { useValue = useValue.substring(0, useValue.length-3);}
    return useValue;
}

function downloadFile(inTitle,inData) {
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + inData);
    const link = cec('a','',document.body,'',encodedUri,'','download',inTitle + '.csv');
    link.click();
    document.body.removeChild(link);
}

function setCookie(cName, cValue) { localStorage.setItem(cName,cValue); }

function getCookie(cname,isNum) {
    let value = localStorage.getItem(cname);
    if(value !== null) return value;
    if(isNum == true) {return 0;} else {return '';}
}

function flipCookie(inCookie,spin) {
    let OldValue = parseInt(getCookie(inCookie,true)) + 1;
    if(spin == null) {spin = 1;}
    if(OldValue > spin) { setCookie(inCookie,0); } else {setCookie(inCookie,OldValue); }
}
function getDisplay(InA,InB) {
    if(InA == 1) {return 'none;';} else {return InB;}
}
function getChecked(InA,InB) {
    if(InA == 'true') {return 'display: none;';} else {return InB;}
}

// Main Execution Loop
(function() {
    MM_Init();
    setInterval(() => {
        if(css_reload == true) {css_reload = false;MM_Init();}
        if(window.location.pathname != SaveLocationPathName) {
            if(SaveLocationPathName) {MM_MenuRun(false);}
            SaveLocationPathName = window.location.pathname;
            MM_MenuRun(true);
            MM_MenuFix();
        }
        MenuCheckSpawnProcess();
    },400);
}());
// Run when leaving & entering a page
function MM_MenuRun(onFocus) {
    MenuLogin(onFocus);
    MenuReports(onFocus);
    MenuPlan(onFocus);
    MenuAccounts(onFocus);
    MenuHistory(onFocus);
    MenuSettings(onFocus);
    MenuCategories(onFocus);
}
// Query functions
function getGraphqlToken() {
  return JSON.parse(JSON.parse(localStorage.getItem('persist:root')).user).token;
}

function callGraphQL(data) {
  return {
    mode: 'cors',
    method: 'POST',
    headers: {
      accept: '*/*',
      authorization: `Token ${getGraphqlToken()}`,
      'content-type': 'application/json',
      origin: 'https://app.monarchmoney.com',
    },
    body: JSON.stringify(data),
  };
}

async function getMonthlySnapshotData2(startDate, endDate, groupingType, inAccounts) {
    if(inAccounts == undefined) inAccounts = [];
    const filters = {startDate: startDate, endDate: endDate, ...(inAccounts.length > 0 && { accounts: inAccounts })};
    const options = callGraphQL({operationName: 'GetAggregatesGraph', variables: {filters: filters },
          query: "query GetAggregatesGraph($filters: TransactionFilterInput) {\n aggregates(\n filters: $filters \n groupBy: [\"category\", \"" + groupingType + "\"]\n  fillEmptyValues: false\n ) {\n groupBy {\n category {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
     });
    return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function getMonthlySnapshotData(startDate, endDate, groupingType, inAccounts) {
    if(inAccounts == undefined) inAccounts = [];
    const filters = {startDate: startDate, endDate: endDate, ...(inAccounts.length > 0 && { accounts: inAccounts })};
    const options = callGraphQL({ operationName: 'GetAggregatesGraphCategoryGroup',variables: {filters: filters },
          query: "query GetAggregatesGraphCategoryGroup($filters: TransactionFilterInput) {\n aggregates(\n filters: $filters \n groupBy: [\"categoryGroup\", \"" + groupingType + "\"]\n fillEmptyValues: false\n ) {\n groupBy {\n categoryGroup {\n id\n }\n " + groupingType + "\n }\n summary {\n sum\n }\n }\n }\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function GetTransactions(startDate,endDate, offset, isPending, inAccounts, inHideReports, inNotes) {
    const limit = 5000;
    if(inAccounts == undefined || inAccounts == null) inAccounts = [];
    const filters = {startDate: startDate, endDate: endDate, hideFromReports: inHideReports, isPending: isPending, ...(inAccounts.length > 0 && { accounts: inAccounts }), ...(inNotes == true && {hasNotes: true})};
    const options = callGraphQL({operationName: 'GetTransactions', variables: {offset: offset, limit: limit, filters: filters},
          query: "query GetTransactions($offset: Int, $limit: Int, $filters: TransactionFilterInput) {\n allTransactions(filters: $filters) {\n totalCount\n results(offset: $offset, limit: $limit ) {\n id\n amount\n pending\n date\n hideFromReports \n notes \n tags {\n id\n name\n color\n order\n } \n account {\n id }  \n category {\n id\n name \n group {\n id\n name\n type }}}}}\n"
    });
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => { return data.data; }).catch((error) => { console.error(version,error);});
}

async function getDisplayBalanceAtDateData(date) {
    const options = callGraphQL({ operationName: 'Common_GetDisplayBalanceAtDate',variables: {date: date, },
          query: "query Common_GetDisplayBalanceAtDate($date: Date!) {\n accounts {\n id\n displayBalance(date: $date)\n type {\n name\n}\n }\n }\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function getAccountsData() {
    const options = callGraphQL({ operationName: 'GetAccounts',variables: { },
          query: "query GetAccounts {\n accounts {\n id\n displayName\n deactivatedAt\n isHidden\n isAsset\n isManual\n mask\n displayLastUpdatedAt\n currentBalance\n displayBalance\n hideFromList\n hideTransactionsFromReports\n includeInNetWorth\n order\n icon\n logoUrl\n deactivatedAt \n type {\n  name\n  display\n  group\n  }\n subtype {\n name\n display\n }\n }}\n"
      });
  return fetch(graphql, options)
    .then((response) => response.json())
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function refreshAccountsData() {
 const options = callGraphQL({operationName:"Common_ForceRefreshAccountsMutation",variables: { },
         query: "mutation Common_ForceRefreshAccountsMutation {\n  forceRefreshAllAccounts {\n    success\n    errors {\n      ...PayloadErrorFields\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PayloadErrorFields on PayloadError {\n  fieldErrors {\n    field\n    messages\n    __typename\n  }\n  message\n  code\n  __typename\n}" });
    return fetch(graphql, options)
    .then((response) => setCookie('MT:LastRefresh', getDates('s_FullDate')))
    .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function getCategoryData() {
    const options = callGraphQL({ operationName: 'GetCategorySelectOptions', variables: {},
          query: "query GetCategorySelectOptions {categories {\n id\n name\n order\n icon\n group {\n id\n name \n type}}}"
    });
    return fetch(graphql, options)
        .then((response) => response.json())
        .then((data) => { return data.data; }).catch((error) => { console.error(version,error); });
}

async function buildCategoryGroups() {

    if(accountGroups.length == 0) {
        const categoryData = await getCategoryData();
        let isFixed = '';
        for (let i = 0; i < categoryData.categories.length; i += 1) {
            isFixed = getCookie('MTGroupFixed:' + categoryData.categories[i].group.id,true);
            if(isFixed == true) {accountsHasFixed = true;}
            accountGroups.push({"GROUP": categoryData.categories[i].group.id, "GROUPNAME": categoryData.categories[i].group.name, "ID": categoryData.categories[i].id, "NAME": categoryData.categories[i].name, "ICON": categoryData.categories[i].icon, "TYPE": categoryData.categories[i].group.type, "ORDER": categoryData.categories[i].order, "ISFIXED": isFixed});
        }
    }
}
function getCategoryGroupList(InId) {
    let cl = '';
    buildCategoryGroups();
    for (let i = 0; i < accountGroups.length; i++) {
        if(accountGroups[i].GROUP == InId) {
            if(cl) {cl=cl+',';}
            cl = cl + '\\"' + accountGroups[i].ID + '\\"';}
    }
    return cl;
}

function getCategoryGroup(InId) {
    for (let i = 0; i < accountGroups.length; i++) {if(accountGroups[i].ID == InId || accountGroups[i].GROUP == InId) {return accountGroups[i];}}
    return [null];
}
