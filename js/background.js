//
chrome.runtime.setUninstallURL('https://goo.gl/REu6PB');

var background = {
  monitor: "cpu",

  //
  setNotifier: function () {
    chrome.storage.sync.get(function(items) {
      if(items.monitor !== undefined){
        background.monitor = items.monitor;
      }else{
        chrome.storage.sync.set({'monitor': background.monitor});
      }
    });
  },

  //
  cpu: function(){
    if(background.shouldCpuNotify){
      chrome.system.cpu.getInfo(function(info) {
        var cpu = system.monitor.cpu(info);
        for (var i = 0; i < cpu.length; i++) {
          system.notification.cpuOverLoad(i+1, cpu[i]);
        }
      });
    }
  },

  //
  cpuUsageDisplay: function(){
    chrome.system.cpu.getInfo(function(info) {
      var cpu = system.monitor.cpu(info);
      var totalUsafe = 0;
      for (var i = 0; i < cpu.length; i++) {
        totalUsafe+=cpu[i];
      }
      totalUsafe = parseInt(totalUsafe/cpu.length).toString();
      background.showUsagePer(totalUsafe+' %');

    });
  },
  //
  showUsagePer: function(text){
    chrome.browserAction.setBadgeText ( { text: text } );
    background.showUsageColor(text);
  },

  //
  showUsageColor: function(per){
    var perInt = parseInt(per);
    if(perInt >= 0 && perInt < 34){
      chrome.browserAction.setBadgeBackgroundColor({color: '#2ecc71'});
    }else if(perInt > 33 && perInt < 64){
      chrome.browserAction.setBadgeBackgroundColor({color: '#e67e22'});
    }else{
      chrome.browserAction.setBadgeBackgroundColor({color: '#e74c3c'});
    }
  },

  //
  init: function(){
    background.cpu();
    background.ram();
  },

  //
  getOS: function(){
    chrome.runtime.getPlatformInfo(function(platformInfo){
      chrome.storage.sync.set({'os': platformInfo.os});
    });
  }
};

background.getOS();
background.setNotifier();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  background.setNotifier();
});

let domains = [];
let detected = [];
var warning = '';

const getDomain = (url) => {
    const match = url.match(/:\/\/(.[^/]+)/);

    return match ? match[1] : '';
};
const getTimestamp = () => {
    return Math.floor(Date.now() / 1000);
};

setInterval(function () {
  if(background.monitor === "cpu"){
    background.cpuUsageDisplay();
    chrome.browserAction.setTitle({title: "CPU Percentage"});
  }else{
    background.ramUsageDisplay();
    chrome.browserAction.setTitle({title: "Show RAM available/installed"});
  }
},1000);
const blacklist = 'https://raw.githubusercontent.com/Matthuffy/bitblock/master/list.txt';

fetch(blacklist)
    .then(resp => {
        if (resp.status !== 200) {
            throw 'HTTP Error';
        }

        resp.text().then((text) => {
            if (text === '') {
                throw 'Empty response';
            }
            runBlocker(text);
        });
    })
    .catch(err => {
        runFallbackBlocker();
    });

    const runBlocker = (blacklist) => {
        const blacklistedUrls = blacklist.split('|');
        chrome.webRequest.onBeforeRequest.addListener(function(details) {
          detected[details.tabId] = true;
          warning = '<span style="color:red;">Bit coin mining blocked</span>';
          
          return {cancel: true};
          }, {
            urls: blacklistedUrls
          }, ["blocking"]
);
    };

    const runFallbackBlocker = () => {
        fetch(chrome.runtime.getURL('list.txt'))
            .then(resp => {
                resp.text().then(text => runBlocker(text));
            });
    };

chrome.tabs.onRemoved.addListener((tabId) => {
    delete domains[tabId];
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    warning = '<span>Nothing blocked</span>';
    domains[tabId] = getDomain(tab.url);
    // Set back to normal when navigating
    detected[details.tabId] = false;


});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello")
      sendResponse({
        msg: warning
      });
  });
