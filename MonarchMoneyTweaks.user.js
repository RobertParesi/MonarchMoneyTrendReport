// ==UserScript==
// @name         Monarch Money Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Monarch Tweaks
// @author       Robert
// @match        https://app.monarchmoney.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monarchmoney.com
// ==/UserScript==

let r_Init = false;
let r_Tips = 0;
let r_Toaster = 0;
let SaveLocationPathName = "";

function MM_Init() {

    MM_removeElement("[href~='/settings/referrals']",getCookie('MT_Ads'));
    MM_removeElement("[href~='/advice']",getCookie('MT_Advice'));
    MM_removeElement("[href~='/investments']",getCookie('MT_Investments'));
    MM_removeElement("[href~='/objectives']",getCookie('MT_Goals'));
    MM_removeElement("[href~='/recurring']",getCookie('MT_Recurring'));
    MM_removeElement("[href~='/plan']",getCookie('MT_Budget'));
    r_Tips = getCookie("MT_HideTipDiff");
    r_Toaster = getCookie("MT_HideToaster");
}

function MM_removeElements(InList,InValue) {

    for (const selector of InList) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            if(InValue == 1) {el.style.display = 'none'} else {el.style.display = ''};
        }
    };
}

function MM_removeElement(InList,InValue) {

    const elements = document.querySelectorAll(InList);
    for (const el of elements) {
        if(InValue == 1) {el.style.display = 'none'} else {el.style.display = ''};
    }
}

function MenuReports(OnFocus) {

    if (SaveLocationPathName.substring(0,9) == '/reports/') {
        if(OnFocus == false) {
        }
        if(OnFocus == true) {
        }
        if(OnFocus == 2 && r_Tips == 1) {
            MM_removeElement("div.ReportsTooltipRow__Diff-k9pa1b-3","none");
        }
    }
}

function MenuDisplay(OnFocus) {

    if (SaveLocationPathName.substring(0,17) == '/settings/display') {
        if(OnFocus == false) {

        }
        if(OnFocus == true) {
            MM_CreateCheckbox('Hide Create Rule Tooltip','MT_HideToaster');
            MM_CreateCheckbox('Hide Report Tooltip Difference','MT_HideTipDiff');
            MM_CreateCheckbox('Hide Monarch Ads','MT_Ads');
            MM_CreateCheckbox('Hide Advice','MT_Advice');
            MM_CreateCheckbox('Hide Investments','MT_Investments');
            MM_CreateCheckbox('Hide Goals','MT_Goals');
            MM_CreateCheckbox('Hide Recurring','MT_Recurring');
            MM_CreateCheckbox('Hide Budget','MT_Budget');
        }
    }
}

function MM_CreateCheckbox(inValue,inCookie) {

   let qs = document.querySelector('.FormItemContainer__Root-j5b8rt-0');
   if(qs != null) {
       let e1 = document.createElement('div');
       e1.style = "font-size: 14px; margin: 9px;";
       qs.after(e1);

       let OldValue = getCookie(inCookie);
       let e2 = document.createElement('input');
       e2.type = 'checkbox';
       e2.style = "position: relative;width: 20px;height: 20px;min-width: 20px; margin:9px;";
       if(OldValue == 1) {e2.checked = 'checked'};
       e1.appendChild(e2);
       e2.addEventListener('click', () => {
           MM_FlipCookie(inCookie);
       });
       var text = document.createTextNode(inValue);
       e2.parentNode.insertBefore(text, e2.nextSibling)
   }

}

function MM_FlipCookie(inCookie) {

    let OldValue = getCookie(inCookie);
    if(OldValue == 1) { OldValue = 0 } else {OldValue = 1};
    setCookie(inCookie,OldValue);
    r_Init = false;
}

function setCookie(cname, cvalue) {

    document.cookie = cname + "=" + cvalue + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;" ;
}


function getCookie(cname) {

    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

(function() {
    setInterval(() => {

        if(r_Init == false) {
            MM_Init();
            r_Init = true;
        }

        if(window.location.pathname != SaveLocationPathName) {
            // Lose Focus on a page
            MenuReports(false);
            MenuDisplay(false);

            SaveLocationPathName = window.location.pathname;

            // Gain Focus on a Page
            MenuReports(true);
            MenuDisplay(true);
        }
        MenuReports(2);
        if(r_Toaster == 1) {
            MM_removeElement('div.Toast__Root-sc-1mbc5m5-0',1);
        }
    },50);
}());
