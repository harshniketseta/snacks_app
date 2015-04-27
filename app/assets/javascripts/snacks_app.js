
var SnacksApp = (function () {
  /*
   Base App Class. Lazy Loads child classes aka subApps.

   Author: Harshniket
   Review:
   */
  var App = function (params) {
    this.params = params || {};

    var subApps = {
      "helper": "Helper",
      "users": "Users",
      "menus": "Menus",
      "items": "Items",
      "orders": "Orders"
    }

    /*
     Lazy Loading of subApps.
     Goes through subApps and maps a function which initializes the subApp if not initialized,
     otherwise returns the already initialized object of the said class.

     Author: Harshniket
     Review:
     */
    for (var key in subApps) {
      if (!subApps.hasOwnProperty(key)) continue;
      var subAppName = subApps[key];
      App.prototype[key] = (function (subAppName) {
        var obj = '';
        return function (params) {
          if (typeof(obj) == "string") {
            if (App[subAppName]) {
              var subApp = App[subAppName];
              if (subApp.get && typeof(subApp.get) == "function") {
                obj = subApp.get(params);
              } else {
                obj = new subApp(params, this);
                if (typeof(obj["init"]) == "function") obj["init"]();
              }
            } else {
              obj = null;
            }
          }
          return obj;
        };
      }(subAppName));
    }
  }

  /*
   Init Function for Base App class.

   Author: Harshniket
   Review:
   */
  App.method("init", function () {
    var self = this;

    self.helper().initAlerts();
    self.helper().initAllSelect2();
    self.helper().initNumberOnlyField();
    self.helper().initPriceOnlyField();
    self.helper().makeTabsPersistent();
    setTimeout(function(){
      self.helper().slideUpAlerts("success");
      self.helper().slideUpAlerts("danger");
    }, 3 * 1000);
  });
  return App;
})();
