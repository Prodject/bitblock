//
var system = {
  //variables
  prevCPUTime:0,
  cpuHits: 0,
  ramHits: 0,
  notificationOpt: {
    type: "basic",
    title: "",
    message: "",
    iconUrl: "/images/icon-v2-128.png"
  },

  //
  notification:{

    //
    ramOverLoad: function(usage){
      system.notificationOpt.title = "Higher RAM usage";
      system.notificationOpt.message = "Your RAM has reached "+usage+"% of its usage, Please check your system!";
      if(usage > 90){
        system.ramHits++;
        if(system.ramHits >= 30){
          chrome.notifications.create('ram-overload', system.notificationOpt, function(){});
          system.ramHits = 0;
        }
      }else{
        system.ramHits = 0;
      }
    },
    //
    cpuOverLoad: function(core, usage){
      system.notificationOpt.title = "Higher usage on core #"+core;
      system.notificationOpt.message = "Your core #"+core+" has reached "+usage+"% of its usage, Please check your system!";
      if(usage > 10){
        system.cpuHits++;
        if(system.cpuHits >= 30){
          chrome.notifications.create('core-'+core+'-overload', system.notificationOpt, function(){});
          system.cpuHits = 0;
        }
      }else{
        system.cpuHits = 0;
      }
    }
  },

  monitor:{

    //
    setPrevCPUTime: function (prevCPUTime) {
      system.prevCPUTime = prevCPUTime;
    },

    //
    getPrevCPUTime: function () {
      return system.prevCPUTime;
    },

    //
    cpu: function (info) {
        var usedInPercentage;
        var test = [];

        for (var i = 0; i < info.processors.length; i++) {
            var usage = info.processors[i].usage;

            if (system.monitor.getPrevCPUTime()) {
                var oldUsage = system.monitor.getPrevCPUTime().processors[i].usage;
                usedInPercentage = Math.floor((usage.kernel + usage.user - oldUsage.kernel - oldUsage.user) / (usage.total - oldUsage.total) * 100);
            } else {
                usedInPercentage = Math.floor((usage.kernel + usage.user) / usage.total * 100);
            }
            test.push(usedInPercentage);
            if(usedInPercentage > 70)
            {
              //alert(totalUsafe);
              $('#bitblocked').html('<span style="color:red;">Warning! High CPU @ '+usedInPercentage+'%</span>');
            }
            else {
              $('#bitblocked').html('All appears to be safe @ '+usedInPercentage+'%');
            }
        }

        system.monitor.setPrevCPUTime(info);
        return test;
    },

    //
    ram: function (info) {
      var capacity, used, usedInPercentage;

      capacity = Math.round(info.capacity / 1000000);
      used = Math.round(info.availableCapacity / 1000000);
      leftInPercentage = Math.round((used / capacity) * 100);
      usedInPercentage = 100 - leftInPercentage;

      return {
        'used':usedInPercentage,
        'left':leftInPercentage
      };
    },

    //
    storage: function (info) {
      for(var i = 0; i < info.length; i++){
        if(info[i].capacity > 0){
          console.log(info[i].capacity / 1000000000);
        }
      }
    }
  }
};
