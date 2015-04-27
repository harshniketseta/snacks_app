// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

var SnacksApp = (function (SnacksApp) {

  SnacksApp.Users = function (config) {
    var self = this;

    self.config = config;
  };

  SnacksApp.Users.method("init", function () {
    var self = this;

    if (self.config.action === "index") {
      self.initIndexPage();
    }
  });

  SnacksApp.Users.method("initIndexPage", function () {
    var self = this
      , jMakeAdminButtons = $(".makeAdmin")
      ;

    jMakeAdminButtons.on("success", function (event, response) {
      var jActions = $(this).closest(".actions");
      event.preventDefault();

      if (response.success) {
        jActions.find(".makeAdmin").addClass("hidden");
      } else {
        snacks_app.helper().showFlashAlert(response.errors);
      }

    });

    snacks_app.helper().initAjaxButtons(jMakeAdminButtons);
  });

  return SnacksApp;
})(SnacksApp);
