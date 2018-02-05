
var popup = {
  //
  cpu: function(cpu_update){
    chrome.system.cpu.getInfo(function(info) {
      var cpu = system.monitor.cpu(info);
      var temp = info.temperatures;
      for (var i = 0; i < cpu.length; i++) {
        cpu_update[i].series[0].points[0].update(cpu[i]);
      }
      chrome.storage.sync.get(function(items) {
        if(items.os === 'cros'){
            popup.cpuTemp(temp);
         }
     });
    });
  },

  ramMax: function(){
    chrome.system.memory.getInfo(function (info){
      var ramSize = parseInt(info.capacity/1000000000);
      $('#ram_size').html('Capacity: ('+ramSize+'GB)');
    });
  },

  cpuName: function(){
    chrome.system.cpu.getInfo(function(info) {
      $('#cpuName').html(info.modelName);
    });
  },



  //
  ramOptions: {
      chart: {
          type: 'solidgauge',
          backgroundColor:'transparent'
      },

      title: null,

      pane: {
          center: ['35%', '85%'],
          size: '100%',
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: 'transparent',
              borderColor: "#434857",
              borderWidth: 1,
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
          }
      },

      tooltip: {
          enabled: false
      },

      // the value axis
      yAxis: {
          stops: [
              [0.1, '#2ecc71'], // green
              [0.5, '#f1c40f'], // yellow
              [0.9, '#e74c3c'] // red
          ],
          lineWidth: 0,
          minorTickInterval: null,
          tickAmount: 0,
          tickWidth: 0,
          showFirstLabel:false,
          showLastLabel:false
      },

      plotOptions: {
          solidgauge: {
              dataLabels: {
                  y: 5,
                  borderWidth: 0,
                  useHTML: true
              }
          }
      }
  },

  //
  cpuOptions: {
        chart: {
            type: 'solidgauge',
            backgroundColor:'transparent'
        },

        title: null,
        pane: {
            center: ['60%', '80%'],
            size: '80%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: 'transparent',
                borderColor: "#434857",
                borderWidth: 1,
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#2ecc71'], // green
                [0.5, '#f1c40f'], // yellow
                [0.9, '#e74c3c'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 0,
            tickWidth: 0,
            showFirstLabel:false,
            showLastLabel:false
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    },

  //


  //
  cpuGaugeDesign: function(id) {
    return Highcharts.chart(id, Highcharts.merge(popup.cpuOptions, {
        yAxis: {
            min: 0,
            max: 100
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'CPU',
            data: [0],
            dataLabels: {
                x: 0,
                y: 8,
                format: '<div style="text-align:center; margin-top: 50px;"><strong class="axn" style="font-size: 10px;">{y}</strong><br/>' +
                '<strong class="axn" style="font-size: 10px;">%</strong></div>'
            }
        }]
    }));
  },

  //
  cpuTemp: function(temp){
        for (var i = 0; i < temp.length; i++) {
            $("#temps-"+i).html(temp[i]+"&deg;C");
        }
  },

  //
  createElement: function(){
    chrome.system.cpu.getInfo(function(info) {
      var cpu = system.monitor.cpu(info);
      var temps = info.temperatures;
      for (var i = 0; i < cpu.length; i++) {
        popup.createTemplate(i+1);
      }
      chrome.storage.sync.get(function(items) {
          if(items.os === 'cros'){
            for (var j = 0; j < temps.length; j++) {
                popup.createTemp(j);
            }
           }
       });
    });
  },

  //
  createTemp: function(tempsNum){
      var iconHolder = document.createElement("SPAN");
      iconHolder.setAttribute('class', 'mdl-chip__contact mdl-color--teal mdl-color-text--white');
      var icon = document.createElement("I");
      icon.setAttribute('class', 'material-icons icon-middle-align');
      icon.textContent = "ac_unit";
      var temp = document.createElement("SPAN");
      temp.setAttribute('class', 'mdl-chip__text');
      temp.setAttribute('id', 'temps-'+tempsNum);
      var holder = document.createElement("SPAN");
      holder.setAttribute('class', 'mdl-chip mdl-chip--contact mr-10');
      var parent = $("#cpu_temps");

      iconHolder.appendChild(icon);
      holder.appendChild(iconHolder);
      holder.appendChild(temp);
      parent.append(holder);
  },

  //
  createTemplate: function(coreNumber){
      var coreDiv = document.createElement("DIV");
      coreDiv.setAttribute('id', 'core'+coreNumber);
      coreDiv.style.width = '150px';
      coreDiv.style.height = '180px';
      coreDiv.style.float = 'left';
      coreDiv.style.marginTop = '-75px';

      var small = document.createElement("DIV");
      small.setAttribute('class', 'azy aim');

      var slice = document.createElement("DIV");
      slice.setAttribute('class', 'en agg amz');

      small.appendChild(coreDiv);
      slice.appendChild(small);

      var parent = $("#cpu_cores");

      parent.append(coreDiv);
  },



  monitor: function(){
    $("input[name=monitor]").on('change', function(){
      chrome.storage.sync.set({'monitor': this.value});
      chrome.runtime.sendMessage({monitor: this.value}, function(response){});
    });
  },

  //
  offloadSystem: function(){
    $('#clean').on('click', function(){
      chrome.windows.getCurrent({}, function(window){
        chrome.windows.getAll({populate:true}, function(windows){
          for(var i = 0; i < windows.length; i++){
            for(var j = 0; j < windows[i].tabs.length; j++){
              if(window.id === windows[i].id){
                if(!windows[i].tabs[j].active && !windows[i].tabs[j].audible){
                  chrome.tabs.discard(windows[i].tabs[j].id);
                }
              }else{
                chrome.tabs.discard(windows[i].tabs[j].id);
              }
            }
          }
        });
      });
    });
  },

  //
  init: function () {
      var ids = [];
      chrome.system.cpu.getInfo(function(info) {
        var cpu = system.monitor.cpu(info);
        for (var i = 0; i < cpu.length; i++) {
            ids[i] = popup.cpuGaugeDesign('core'+(i+1));
        }
      });
      return ids;
  },

   //
   initNotifier: function (items) {


          $("#cpu-monitor").addClass('is-checked');
          chrome.browserAction.setTitle({title: "Show CPU usage percentage"});

      $("input[name=monitor][value='"+items.monitor+"']").prop("checked",true);
      $("input[name=monitor][value='"+items.monitor+"']").attr("checked");
   }
};

var ram_update, ids;

window.onload = function() {
    chrome.storage.sync.get(function(items) {
        if(items.monitor === undefined){
            chrome.storage.sync.set({'monitor': "cpu"});
        }
        popup.initNotifier(items);
    });

    popup.createElement();
    popup.offloadSystem();
    popup.monitor();
    ids = popup.init();
    popup.cpuName();
    setInterval(function () {
        popup.cpu(ids);
    },2000);
    setInterval(function () {
        blockedbit();
    },2000);
};

function blockedbit()
{
  chrome.runtime.sendMessage({
      greeting: "hello"
    },
    function(response) {
      $('#bitblockedsites').html(response.msg);
    });
}
