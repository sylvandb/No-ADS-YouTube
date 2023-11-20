// ==UserScript==
// @name         No ADS - YouTube
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  - Skips all youtube ads - | - undetectable - | - skips ads instantly -
// @author       GSRHaX
// @author       sylvandb
// @homepage     https://github.com/sylvandb/No-ADS-YouTube
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://i.ibb.co/X5f50Cg/Screen-Shot-2021-07-19-at-9-31-54-PM.png
// @grant        none
// ==/UserScript==
// heavily modified from original from https://github.com/di4b0lical/No-ADS-YouTube

let removeLogo = true; // take out the youtube logo
let pbRate = 2.2; // I like it fast
let adpbRate = 16;
let prevVid = undefined;


setInterval(()=>{
    let vid = document.getElementsByClassName("video-stream html5-main-video")[0];
    if (vid !== undefined) {
       if (removeLogo) {
            let logo = document.getElementsByClassName("ytd-topbar-logo-renderer");
            if (logo !== undefined && logo[0] !== undefined) {
                logo[0].remove();
            }
        }
        let closeAble = document.getElementsByClassName("ytp-ad-overlay-close-button");
        for(let i=0;i<closeAble.length;i++){closeAble[i].click()};
        if(document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0]!==undefined){
            let sideAd=document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0];
            sideAd.style.display="none";
        }
        if(document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0]!==undefined){
            let sideAd_ = document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0];sideAd_.style.display="none";
        }
        if(document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0]!==undefined){
            let skipBtn=document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0];skipBtn.click();
        }
        if(document.getElementsByClassName("ytp-ad-message-container")[0]!==undefined){
            let incomingAd=document.getElementsByClassName("ytp-ad-message-container")[0];incomingAd.style.display="none";
        }
        if(document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0]!==undefined){
            document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0].remove();
        }
        if(document.getElementById("masthead-ad")!==null){
            let headerAd=document.getElementById("masthead-ad");headerAd.remove();
        }
        if(document.getElementsByTagName("ytd-ad-slot-renderer")[0]!==undefined){
            let rightSideAd=document.getElementsByTagName("ytd-ad-slot-renderer")[0];rightSideAd.remove();
        }
        if(document.getElementsByTagName("ytd-reel-shelf-renderer")[0]!==undefined){
            let rightSideShorts=document.getElementsByTagName("ytd-reel-shelf-renderer")[0];rightSideShorts.remove();
        }
        let ad = document.getElementsByClassName("video-ads ytp-ad-module")[0];
        if (ad == undefined) {
            //vid.playbackRate=1.3;
            // do not repeatedly set the rate -- allows user to manually adjust as desired
            if (vid !== prevVid || vid.playbackRate == adpbRate) {
                vid.playbackRate = pbRate;
            }
        } else {
//            vid.playbackRate=1.4;
            if(ad.children.length>0) {
                //vid.playbackRate=1.5;
                if (true || document.querySelector(".ytp-ad-text[class*='ytp-ad-preview-text']") !== undefined) {
                    if (vid.playbackRate != adpbRate) {
                        // try to preserve existing pbRate
                        if (vid.playbackRate !== undefined) {
                            pbRate = vid.playbackRate;
                        }
                        vid.playbackRate = adpbRate;
                        vid.muted = true;
                        // need to reset back to normal speed after the ad
                        // what is the ad length???  adLength = ???
                        setTimeout(()=>{
                            vid.playbackRate = pbRate;
                            // reset it harder
                            setTimeout(()=>{
                                vid.playbackRate = pbRate;
                            }, 250);
                        // just give it a delay instead of: }, (1000 * adLength + 250.0) / adpbRate);
                        }, 1000);
                    }
                }
            }
        }
    }
    prevVid = vid;
}, 100);
