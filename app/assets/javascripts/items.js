// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

//= require nestedSortable/jquery.mjs.nestedSortable


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

    snacks_app.helper().initRenderers();

    $('.sortable').nestedSortable({
      handle: 'div',
      items: 'li',
      toleranceElement: '> div'
    });
  });

  return SnacksApp;
})(SnacksApp);