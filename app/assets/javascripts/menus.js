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

    if(self.config.action == "index"){
      self.initIndex();
    }
  });

  SnacksApp.Menus.method("initIndex", function () {
    var self = this;

    var jPublishButton = $(".publishMenu")
      , jUnpublishButton = $(".unpublishMenu")
      , jDeleteButton = $(".deleteMenu")
      ;

    jPublishButton.on("success", function(event){
      event.preventDefault();
      jPublishButton.addClass("hidden");
      jUnpublishButton.removeClass("hidden");
    });

    jUnpublishButton.on("success", function(event){
      event.preventDefault();
      jPublishButton.removeClass("hidden");
      jUnpublishButton.addClass("hidden");
    });

    jDeleteButton.on("ajax:success", function(event, response){
      event.preventDefault();
      var jTr = $(this).closest("tr")
        , jTable = jTr.closest("table")
        ;

      if(response.error){
        snacks_app.helper().showFlashAlert([response.error]);
        return;
      }

      if(jTable.find("tr").length == 2){
        window.location.reload();
      } else {
        jTr.fadeOut().remove();
      }
    });

    snacks_app.helper().initAjaxButtons(jPublishButton);
    snacks_app.helper().initAjaxButtons(jUnpublishButton);
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