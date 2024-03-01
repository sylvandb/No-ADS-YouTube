// ==UserScript==
// @name         No ADS - YouTube
// @namespace    http://tampermonkey.net/
// @version      2.1.6
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


setInterval(() => {
    let vid = document.getElementsByClassName("video-stream html5-main-video")[0];
    if (vid !== undefined) {
        /* elements to click */
        /* overlay ads w/close button */
        let closeAble = document.getElementsByClassName("ytp-ad-overlay-close-button");
        for (let i = 0; i < closeAble.length; i++) { closeAble[i].click() };
        /* skip video ads w/skip button, fast-foward handled later */
        let skipBtn = document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0];
        if (skipBtn === undefined) {
            skipBtn = document.getElementsByClassName("ytp-skip-ad-button ytp-skip-ad-button--new--pos")[0];
        }
        if (skipBtn === undefined) {
            skipBtn = document.getElementById("skip-button:l8");
        }
        if (skipBtn !== undefined && skipBtn) {
            skipBtn.click();
        }
        /* elements to assign display = none */
        if (document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0] !== undefined) {
            let sideAd = document.getElementsByClassName("style-scope ytd-watch-next-secondary-results-renderer sparkles-light-cta GoogleActiveViewElement")[0];
            sideAd.style.display="none";
        }
        if (document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0] !== undefined) {
            let sideAd_ = document.getElementsByClassName("style-scope ytd-item-section-renderer sparkles-light-cta")[0];
            sideAd_.style.display="none";
        }
        /* incoming ad */
        if (document.getElementsByClassName("ytp-ad-message-container")[0] !== undefined) {
            let incomingAd = document.getElementsByClassName("ytp-ad-message-container")[0];
            incomingAd.style.display="none";
        }
        /* classes to remove */
        /* logo incl funky ones */
        if (removeLogo) {
            let logo = document.getElementsByClassName("ytd-topbar-logo-renderer");
            if (logo !== undefined && logo[0] !== undefined) {
                logo[0].remove();
            }
         }
        /* side ad */
        if (document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0] !== undefined) {
            document.getElementsByClassName("style-scope ytd-companion-slot-renderer")[0].remove();
        }
        /* element Ids to remove */
        /* clarify-box aka Context is a horribly misplaced attempt to discredit videos google considers a controversial topic */
        if (document.getElementById("clarify-box") !== null) {
            document.getElementById("clarify-box").remove();
        }
        /* header ad */
        if (document.getElementById("masthead-ad") !== null) {
            document.getElementById("masthead-ad").remove();
        }
        /* right side ad -- maybe hide? */
        if (document.getElementById("engagement-panel-ads") !== null) {
            document.getElementById("engagement-panel-ads").remove();
        }
        if (document.getElementById("panels") !== null) {
            document.getElementById("panels").remove();
        }
        /* element tags to remove
        /* right side ad */
        if (document.getElementsByTagName("ytd-ad-slot-renderer")[0] !== undefined) {
            document.getElementsByTagName("ytd-ad-slot-renderer")[0].remove();
        }
        /* right side shorts */
        if (document.getElementsByTagName("ytd-reel-shelf-renderer")[0] !== undefined) {
            document.getElementsByTagName("ytd-reel-shelf-renderer")[0].remove();
        }

        /* fast-forward video ads w/no skip button, skip button handled already */
        let ad = document.getElementsByClassName("video-ads ytp-ad-module")[0];
/* breaks (mutes and speeds) shorts
        if (ad == undefined) {
            ad = document.getElementsByClassName("ytp-ad-persistent-progress-bar-container")[0];
        }
*/
        if (ad == undefined) {
            ad = document.getElementsByClassName("ytp-ad-persistent-progress-bar")[0];
        }
        if (ad == undefined) {
            //vid.playbackRate=1.3;
            // do not repeatedly set the rate -- allows user to manually adjust as desired
            if (vid !== prevVid || vid.playbackRate == adpbRate) {
                vid.playbackRate = pbRate;
            }
        } else {
//            vid.playbackRate=1.4;
            if (ad.children.length > 0) {
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
