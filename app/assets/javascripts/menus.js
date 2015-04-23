// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

//= require moment
//= require bootstrap-datetimepicker

var SnacksApp = (function (SnacksApp) {

  SnacksApp.Menus = function (config) {
    var self = this;

    self.config = config;
  };

  SnacksApp.Menus.method("init", function () {
    var self = this;

    if (self.config.action === "new") {
      self.initForm();
    }
  });

  SnacksApp.Menus.method("initForm", function () {
    var self = this;

    snacks_app.helper().initDatePickers();

    $("form input[type=submit]").on("click", function (event) {
      var jSubmitButton = $(this)
        , jForm = jSubmitButton.closest("form")
        ;

      event.preventDefault();

      if (snacks_app.helper().validateForm(jForm)) {
        jForm.submit();
      }
    });
  });

  return SnacksApp;
})(SnacksApp);