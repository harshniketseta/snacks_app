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
    } else if (self.config.action == "index") {
      self.initIndex();
    } else if (self.config.action == "show") {
      self.initShow();
    }
  });

  SnacksApp.Menus.method("initShow", function () {
    var self = this
      , jForm = $("form")
      ;

    jForm.on("change", function () {
      self.enableOrderButton();
    });

    if (jForm.find("input:checked").length > 0) {
      self.enableOrderButton();
    }
  });

  SnacksApp.Menus.method("enableOrderButton", function () {
    $(".orderItems").prop("disabled", false);
  });

  SnacksApp.Menus.method("initIndex", function () {
    var self = this;

    var jAllPublishButtons = $(".publishMenu")
      , jAllUnpublishButtons = $(".unpublishMenu")
      , jAllAllowOrderingButtons = $(".allowOrdering")
      , jAllCompleteOrderingButtons = $(".completeOrder")
      , jAllDeleteButtons = $(".deleteMenu")
      ;

    jAllPublishButtons.on("success", function (event) {
      var jActions = $(this).closest(".actions");
      event.preventDefault();

      jActions.find(".editMenu").addClass("hidden");
      jActions.find(".publishMenu").addClass("hidden");
      jActions.find(".unpublishMenu").removeClass("hidden");
      jActions.find(".allowOrdering").removeClass("hidden");
      jActions.find(".completeOrder").addClass("hidden");
      jActions.find(".toOrder").addClass("hidden");
      jActions.find(".deleteMenu").addClass("hidden");

      snacks_app.helper().showFlashInfo(["Menu has been published."]);
    });

    jAllUnpublishButtons.on("success", function (event) {
      var jActions = $(this).closest(".actions");

      event.preventDefault();

      jActions.find(".editMenu").removeClass("hidden");
      jActions.find(".publishMenu").removeClass("hidden");
      jActions.find(".unpublishMenu").addClass("hidden");
      jActions.find(".allowOrdering").addClass("hidden");
      jActions.find(".completeOrder").addClass("hidden");
      jActions.find(".toOrder").addClass("hidden");
      jActions.find(".deleteMenu").removeClass("hidden");

      snacks_app.helper().showFlashInfo(["Menu has been unpublished."]);
    });

    jAllAllowOrderingButtons.on("success", function () {
      var jActions = $(this).closest(".actions");

      event.preventDefault();

      jActions.find(".editMenu").addClass("hidden");
      jActions.find(".publishMenu").addClass("hidden");
      jActions.find(".unpublishMenu").removeClass("hidden");
      jActions.find(".allowOrdering").addClass("hidden");
      jActions.find(".completeOrder").removeClass("hidden");
      jActions.find(".toOrder").removeClass("hidden");
      jActions.find(".deleteMenu").addClass("hidden");

      snacks_app.helper().showFlashInfo(["Ordering for the menu has been opened."]);
    });

    jAllCompleteOrderingButtons.on("success", function () {
      var jActions = $(this).closest(".actions");

      event.preventDefault();

      jActions.find(".editMenu").addClass("hidden");
      jActions.find(".publishMenu").addClass("hidden");
      jActions.find(".unpublishMenu").addClass("hidden");
      jActions.find(".allowOrdering").addClass("hidden");
      jActions.find(".completeOrder").addClass("hidden");
      jActions.find(".toOrder").addClass("hidden");
      jActions.find(".deleteMenu").addClass("hidden");

      snacks_app.helper().showFlashInfo(["Orders for the menu has been closed."]);
    });

    jAllDeleteButtons.on("ajax:success", function (event, response) {
      event.preventDefault();
      var jTr = $(this).closest("tr")
        , jTable = jTr.closest("table")
        ;

      if (response.error) {
        snacks_app.helper().showFlashAlert([response.error]);
        return;
      }

      if (jTable.find("tr").length == 2) {
        window.location.reload();
      } else {
        jTr.fadeOut().remove();
      }
    });

    snacks_app.helper().initAjaxButtons(jAllPublishButtons);
    snacks_app.helper().initAjaxButtons(jAllUnpublishButtons);
    snacks_app.helper().initAjaxButtons(jAllAllowOrderingButtons);
    snacks_app.helper().initAjaxButtons(jAllCompleteOrderingButtons);
    snacks_app.helper().initAjaxButtons(jAllDeleteButtons);
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