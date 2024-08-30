// ==UserScript==
// @name         No ADS - YouTube
// @namespace    http://tampermonkey.net/
// @version      2.3.4
// @description  - Skips all youtube ads - | - undetectable? - | - skips ads instantly? - origauthor: GSRHaX
// @author       sylvandb
// @homepage     https://github.com/sylvandb/No-ADS-YouTube
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://i.ibb.co/X5f50Cg/Screen-Shot-2021-07-19-at-9-31-54-PM.png
// @grant        none
// ==/UserScript==
// heavily modified from original found https://github.com/di4b0lical/No-ADS-YouTube

let INTERVAL = 100; // ms interval between check/adjust video playback
let passTicks = 0; // delay before acting to avoid yt detection? maybe seems to help? seems to be just clicking instead?
let currTicks = 0;
let removeLogo = true; // take out the youtube logo
let adPlaying = false;
let adMute = true; // mute ads
let adCloseClick = false; // click close buttons - maybe there are fake buttons?
let adSkipbClick = false; // click skip buttons - maybe there are fake buttons?
let clickMinMS = 4000; // delay before clicking skipBtn to avoid yt detection?
let clickVaryMS = 500; // vary the skip delay
let adpbRate = 4; // too fast may trigger yt detection? 16, 6 too much, 4 seems okay
let adMinLen = 5; // assume ads are MinLen seconds or longer
let pbRateMax = 3; // detect user set rates, assumed to be less than Max
let pbRate = 2.2; // I like it fast, and this default is used if not able to restore the original
let prevVid = undefined;


function RandomInt(range) {
  return Math.floor(Math.random() * range);
}

/* immediate click seems to trigger detection - maybe a fake button? or just too fast? */
function RandomizeClick(element) {
    if (clickMinMS) {
        setTimeout(()=>{
            element.click();
        }, clickMinMS + RandomInt(clickVaryMS));
    } else {
        element.click();
    }
}


setInterval(() => {
    currTicks++;

    let vid = document.getElementsByClassName("video-stream html5-main-video")[0];
    if (vid !== undefined && ((prevVid === vid && currTicks > passTicks) || vid.playbackrate > pbRateMax)) {

        /* elements to click */
        /* overlay ads w/close button */
        if (adCloseClick) {
            let closeAble = document.getElementsByClassName("ytp-ad-overlay-close-button");
            if (closeAble.length) {
                for (let i = 0; i < closeAble.length; i++) {
                    RandomizeClick(closeAble[i]);
                }
            }
        }
        /* skip video ads w/skip button, fast-foward handled later */
        if (adSkipbClick) {
            let skipBtn = document.getElementsByClassName("ytp-ad-text ytp-ad-skip-button-text")[0];
            if (skipBtn === undefined) {
                skipBtn = document.getElementsByClassName("ytp-skip-ad-button ytp-skip-ad-button--new--pos")[0];
            }
            if (skipBtn === undefined) {
                skipBtn = document.getElementsByClassName("ytp-skip-ad-button")[0];
            }
            if (skipBtn === undefined) {
                skipBtn = document.getElementById("skip-button:l8");
            }
            if (skipBtn !== undefined && skipBtn) {
                RandomizeClick(skipBtn);
            }
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
            if (vid.playbackRate > pbRateMax) {
                vid.playbackRate = pbRate;
            }
        } else {
//            vid.playbackRate=1.4;
            if (ad.children.length > 0) {
                //vid.playbabckRate=1.5;
                if (true || document.querySelector(".ytp-ad-text[class*='ytp-ad-preview-text']") !== undefined) {
                    if (vid.playbackRate < pbRateMax) {
                        if (vid.playbackRate != 1.0) {
                            // try to preserve existing user pbRate
                            pbRate = vid.playbackRate;
                        }
                        if (adMute) {
                            vid.muted = true;
                        }
                        if (adpbRate) {
                            vid.playbackRate = adpbRate;
                            // need to reset back to normal speed after the ad
                            // what is the ad length???  adLength = ???
                            // just give it a delay, e.g. 1000, instead of: (1000 * adLength + 250.0) / adpbRate
                            let adDelay = (1000 * adMinLen + 250) / adpbRate;
                            setTimeout(()=>{
                                vid.playbackRate = pbRate;
                                // reset it harder
                                setTimeout(()=>{
                                    vid.playbackRate = pbRate;
                                }, 250);
                            }, adDelay);
                        }
                    }
                }
            }
        }
    }
    if (prevVid !== vid) {
        prevVid = vid;
        currTicks = 0;
    }
}, INTERVAL);
