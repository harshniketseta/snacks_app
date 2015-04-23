//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require bootstrap
//= require bootstrap-sprockets
//= require_self
//= require snacks_app
//= require helper


/* Adds methods to a Javascript Prototype Object (pseudo-Class) */
Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
};

(function ($) {
  $.fn.serializeObject = function (options) {

    options = jQuery.extend({}, options);

    var self = this,
      json = {},
      push_counters = {},
      patterns = {
        "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
        "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
        "push": /^$/,
        "fixed": /^\d+$/,
        "named": /^[a-zA-Z0-9_]+$/
      };


    this.build = function (base, key, value) {
      base[key] = value;
      return base;
    };

    this.push_counter = function (key) {
      if (push_counters[key] === undefined) {
        push_counters[key] = 0;
      }
      return push_counters[key]++;
    };

    jQuery.each(jQuery(this).serializeArray(), function () {

      // skip invalid keys
      if (!patterns.validate.test(this.name)) {
        return;
      }

      var k,
        keys = this.name.match(patterns.key),
        merge = this.value,
        reverse_key = this.name;

      while ((k = keys.pop()) !== undefined) {

        // adjust reverse_key
        reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

        // push
        if (k.match(patterns.push)) {
          merge = self.build([], self.push_counter(reverse_key), merge);
        }

        // fixed
        else if (k.match(patterns.fixed)) {
          merge = self.build([], k, merge);
        }

        // named
        else if (k.match(patterns.named)) {
          merge = self.build({}, k, merge);
        }
      }

      json = jQuery.extend(true, json, merge);
    });


    return json;
  };

  $.fn.insertAt = function (i, jEle) {
    if (i === 0) {
      jQuery(this).prepend(jEle);
      return;
    }

    jQuery(this).children("*:nth-child(" + i + ")").after(jEle);
  };

  //SET CURSOR POSITION
  $.fn.setCursorPosition = function (pos) {
    this.each(function (index, elem) {
      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    });
    return this;
  };

  $.fn.copyCSS = function (source) {
    var styles = $(source).getStyleObject();
    this.css(styles);
  };

  $.fn.getStyleObject = function () {
    var dom = this.get(0);
    var style;
    var returns = {};
    if (window.getComputedStyle) {
      var camelize = function (a, b) {
        return b.toUpperCase();
      };
      style = window.getComputedStyle(dom, null);
      for (var i = 0, l = style.length; i < l; i++) {
        var prop = style[i];
        var camel = prop.replace(/\-([a-z])/g, camelize);
        var val = style.getPropertyValue(prop);
        returns[camel] = val;
      }
      return returns;
    }

    if (style = dom.currentStyle) {
      for (var prop in style) {
        returns[prop] = style[prop];
      }
      return returns;
    }
    return this.css();
  };
})(jQuery);