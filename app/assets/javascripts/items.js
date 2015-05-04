// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

//= require nestedSortable/jquery.mjs.nestedSortable
//= require mustache


var SnacksApp = (function (SnacksApp) {

  SnacksApp.Items = function (config) {
    var self = this;

    self.config = config;
  };

  SnacksApp.Items.method("init", function () {
    var self = this;

    if (self.config.action === "index") {
      self.initItems();
    }
  });

  SnacksApp.Items.method("initItems", function () {
    var self = this;

    $(".addItem").on("click", function (event) {
      var jAddItemButton = $(this)
        , jSortable = $('.sortable')
        , liCount = jSortable.find("li").length + 1
        ;

      event.preventDefault();

      $.get(jAddItemButton.attr("href"), function (response) {
        var newHTML = Mustache.render(response, {item_count: liCount, item_name: "Item " + liCount, item_price: "-"})
          , jNewHTML = $(newHTML)
          ;

        $('.sortable').append(jNewHTML);
        self.enableRemove(jNewHTML);
      });
    });

    $(".saveItems").on("click", function () {
      var jSaveItemForm = $(this)
        , jItemForm = $("#itemsForm")
        , data = jItemForm.serialize() + "&" + $('ol.sortable').nestedSortable('serialize')
        , order = $('.sortable').nestedSortable("serialize")
        , url = jItemForm.attr("action")
        , method = jItemForm.attr("method")
        ;

      $.ajax({
        url: url,
        method: method,
        data: data,
        success: function (response) {
          if (response.success) {
            window.location = response.redirect_to;
          }
        },
        error: function () {

        }
      });
    });

    $('.sortable').nestedSortable({
      handle: 'div',
      items: 'li',
      toleranceElement: '> div',
      maxLevels: 2,
      tabSize: 5,
      change: function () {
        $('.sortable').trigger("change");
      }
    });

    $('.sortable').on("change", self.enableSave);
    $("form").on("change", self.enableSave);
    self.enableRemove();
  });

  SnacksApp.Items.method("enableRemove", function (event) {
    var self = this
      , jScope = jScope || $('.sortable li')
      ;

    jScope.find(".removeItemLink").on("click", function (event) {
      var jRemoveLink = $(this)
        , jLi = jRemoveLink.closest("li")
        ;

      $('.sortable').trigger("change");
      jLi.remove();
    });
  });

  SnacksApp.Items.method("enableSave", function (event) {
    var self = this;

    $(".saveItems").prop("disabled", false);
  });

  return SnacksApp;
})(SnacksApp);