//Google Analytics configuration for track events
var version = chrome.app.getDetails().version;

//Track install and update
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        GoogleAnalytics.trackEvent('app', 'app-install-v' + version);
    }else if(details.reason == "update"){
        GoogleAnalytics.trackEvent('app', 'app-update-v' + version);
    }
});

//Track actually daily users
chrome.windows.onCreated.addListener(function(){
    GoogleAnalytics.trackEvent('app', 'browser-opened-v'+version);
});

//Domain tracking of uninstalls with versions
chrome.runtime.setUninstallURL('https://goo.gl/REu6PB');
