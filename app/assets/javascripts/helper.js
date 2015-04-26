/*
 Helper Singleton wrapper.

 Author: Harshniket
 Review:
 */
var SnacksApp = (function (SnacksApp) {

  SnacksApp.Helper = (function () {
    var instance;

    function createInstance() {
      return _Helper;
    }

    return {
      get: function () {
        if (!instance) {
          instance = createInstance();
        }
        return instance;
      }
    };
  })();

  return SnacksApp;
})(SnacksApp);

/*
 Helper Functions.

 Author: Harshniket
 Review:
 */
var _Helper = {
  /*
   Init All date picker components.
   Author: Harshniket

   Review:
   */
  initDatePickers: function (jScope) {
    var self = this
      , jScope = jScope || $(document)
      ;

    $.each(jScope.find(".datetimepicker"), function () {
      var jElement = $(this)
        , options = jElement.data()
        ;

      jElement.datetimepicker(options);
    });
  },
  /*
   Parses data attributes from a DOM Element for Select2

   Author: Harshniket
   Review:
   */
  parseSelect2DataAttr: function (jElement) {
    var elementData = jElement.data()
      , options = {minimumInputLength: 0}
      ;

    options.placeholder = elementData.placeholder;

    if (jElement.is("input") && elementData.url) {
      options.ajax = {
        results: function (data, page) {
          return {
            results: data.results
          };
        },
        type: "POST",
        dataType: 'json',
        data: function (term, page) {
          var extraParams = _Helper.getParamsForSelect2Ele(this);
          return $.extend({
            q: term, // search term
            page_limit: 10
          }, extraParams);
        }
      };
      options.ajax.url = elementData.url;
    }

    if (elementData.disableSearch) {
      options.minimumResultsForSearch = -1;
    }

    return options;
  },
  /*
   Initializes all select2 Elements in the provided scope.

   Author: Harshniket
   Review:
   */
  initAllSelect2: function (jScope) {
    var self = this
      , jScope = jScope || $(document)
      , _initAllSelect2 = function (index, element) {
        var jElement = $(element)
          , options = _Helper.parseSelect2DataAttr(jElement)
          ;

        self.initSelect2(jElement, options);
      }
      ;

    var select2Inputs = jScope.hasClass("select2Input") ? jScope : jScope.find("input.select2Input");
    $.each(select2Inputs, _initAllSelect2);

    var select2Options = jScope.hasClass("select2Option") ? jScope : jScope.find("select.select2Option");
    $.each(select2Options, _initAllSelect2);

  },
  /*
   Initializes a particular Select2 component.

   Author: Harshniket
   Review:
   */
  initSelect2: function (jEle, options) {
    var self = this
      , currId = jEle.data("valId")
      , currText = jEle.data("valText")
      , preloadData = {id: currId, text: currText}
      , options = options || {}
      ;

    if (jEle.select2) {
      jEle.select2(options);
      currId && currText && jEle.select2("data", preloadData);
    } else {
      throw("Please include the select2 js.")
    }

  },
  /*
   Gets params for a particular Select2 element. Useful for cascading Select2 Elements.

   Author: Harshniket
   Review:
   */
  getParamsForSelect2Ele: function (jEle) {
    var self = this
      , dependentOn = jEle.data("dependentOn")
      , params = {}
      ;
    if (!dependentOn) {
      return params;
    }

    var dependentSelectors = dependentOn.split(",");

    $.each(dependentSelectors, function (i, eleSelector) {
      var selectedElement = $(eleSelector)
        , paramKey = selectedElement.data("paramName")
        , paramValue = selectedElement.val();

      if (paramKey) {
        params[paramKey] = paramValue;
      }
    });

    return params;
  },
  /*
   Initializes number only fields components.

   Author: Harshniket
   Review:
   */
  initNumberOnlyField: function (jScope) {
    var jScope = jScope || $(document);

    jScope.find(".numberOnlyField").on("keypress", function (evt) {
      var charCode = (evt.which) ? evt.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

      return true;
    });
  },
  /*
   Initializes text only fields components.
   * Allows only characters a-z, A-Z, -, _, Backspace, Tab.

   Author: Harshniket
   Review:
   */
  initTextOnlyField: function (jScope) {
    var jScope = jScope || $(document);

    jScope.find(".textOnlyField").on("keypress", function (event) {
      var charCode = (event.which) ? event.which : event.keyCode;
      if (((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123) && charCode != 45 && charCode != 95 && charCode !== 8 && charCode !== 9))
        return false;

      return true;
    });
  },
  /*
   Initializes password fields.
   * Blocks space.

   Author: Vipala
   Review:
   */
  initPasswordOnlyField: function (jScope) {
    var jScope = jScope || $(document);

    jScope.find(".passwordOnlyField").on("keypress", function (event) {
      var charCode = (event.which) ? event.which : event.keyCode
        , character = String.fromCharCode(charCode)
        ;

      if (character != " ")
        return true;

      return false;
    });
  },
  /*
   Initializes decimals number fields in a given scope.
   ** Dependency: http://jquerypriceformat.com/

   Author: Vipala
   Review:
   */
  initPriceOnlyField: function (jScope) {
    var jScope = jScope || $(document);

    $.each(jScope.find(".floatOnlyField"), function (i, ele) {
      var jEle = $(ele)
        , number = jEle.html()
        , floatNumber = Number(number).toLocaleString();
      ;

      jEle.html(floatNumber);
    });

    $.each(jScope.find("input.floatOnlyField"), function (i, ele) {
      var jEle = $(ele)
        , options = jEle.data()
        , jContainer = $("<div>", {class: "floatFieldInputWrap"})
        , jFloatInput = jEle.clone()
        , defaultOptions
        ;

      defaultOptions = {prefix: '', centsLimit: 2};
      options = $.extend({}, defaultOptions, options);

      jEle.removeClass("floatOnlyField");

      jFloatInput.attr("type", "text");
      jFloatInput.removeClass("floatOnlyField");
      jFloatInput.addClass("initializedFloatOnlyField");
      jFloatInput.removeAttr("name");

      jEle.attr("type", "hidden");

      jFloatInput.priceFormat(options);

      jFloatInput.on("keyup", function (event) {
        var jFltInput = $(this)
          , floatField = jFltInput.val()
          , number = Number(floatField.replace(/[^0-9\.]+/g, ""))
          ;

        jEle.val(number);

      });

      jEle.replaceWith(jContainer);
      jContainer.append(jEle);
      jContainer.append(jFloatInput);

    });
  },
  /*
   Initializes percentage fields in a given scope.
   ** Dependency: http://jquerypriceformat.com/

   Author: Harshniket
   Review:
   */
  initPercentageField: function (jScope) {
    var jScope = jScope || $(document);

    var percentageFields = jScope.hasClass("percentageField") && (jScope.is("span") || jScope.is("div")) ?
      jScope : jScope.find("span.percentageField, div.percentageField");

    $.each(percentageFields, function (i, element) {
      var jElement = $(element)
        , options = jElement.data()
        , defaultOptions = {prefix: "", suffix: '%', centsLimit: 2}
        ;

      options = $.extend({}, defaultOptions, options);

      jElement.priceFormat(options);

      jElement.on("change", function () {
        $(this).trigger("focusout.price_format");
      });
    });

    var percentageFieldInputs = jScope.hasClass("percentageField") && jScope.is("input") ?
      jScope : jScope.find("input.percentageField");

    $.each(percentageFieldInputs, function (i, ele) {
      var jEle = $(ele)
        , options = jEle.data()
        , jContainer = $("<div>", {class: "percentageFieldInputWrap"})
        , jPercentageInput = jEle.clone()
        , defaultOptions
        ;

      defaultOptions = {prefix: "", suffix: '%', centsLimit: 2, limit: 4};
      options = $.extend({}, defaultOptions, options);

      jEle.removeClass("percentageField");

      jPercentageInput.attr("type", "text");
      jPercentageInput.removeClass("percentageField");
      jPercentageInput.addClass("initializedPercentageField");
      jPercentageInput.removeAttr("name");

      jEle.attr("type", "hidden");

      jPercentageInput.priceFormat(options);

      jPercentageInput.on("keyup", function (event) {
        var jPerInput = $(this)
          , percent = jPerInput.val()
          , number = Number(percent.replace(/[^0-9\.]+/g, ""))
          ;

        if ([37, 38, 39, 40].indexOf(event.keyCode) != -1) {
          return;
        }

        if (number > 100 || number < 0) {
          number = Math.max(Math.min(number, 100), 0);
          jPerInput.val(number + "%");
        }
        jEle.val(number);
        var cursorPos = (number + "%").length - 1;
        jPerInput.setCursorPosition(cursorPos, cursorPos);

      });

      jEle.replaceWith(jContainer);
      jContainer.append(jEle);
      jContainer.append(jPercentageInput);

    });

  },
  /*
   Initializes Currency Fields.
   ** Dependency: http://jquerypriceformat.com/

   Author: Harshniket Seta
   Review:
   */
  initCurrencyField: function (jScope) {
    var jScope = jScope || $(document);

    var currencyFields = jScope.hasClass("currencyField") && (jScope.is("span") || jScope.is("div")) ?
      jScope : jScope.find("span.currencyField, div.currencyField");

    $.each(currencyFields, function (i, element) {
      var jElement = $(element)
        , number = Number(jElement.html())
        , options = jElement.data()
        , defaultOptions = {prefix: '', centsLimit: 0}
        ;

      options = $.extend({}, defaultOptions, options);

      jElement.priceFormat(options);
      jElement.on("change", function () {
        $(this).trigger("focusout.price_format");
      });
    });

    var currencyFieldInputs = jScope.hasClass("currencyField") && jScope.is("input") ?
      jScope : jScope.find("input.currencyField");

    $.each(currencyFieldInputs, function (i, ele) {
      var jEle = $(ele)
        , options = jEle.data()
        , jContainer = $("<div>", {class: "currencyFieldInputWrap"})
        , jCurrencyInput = jEle.clone()
        , defaultOptions = {prefix: '', centsLimit: 0}
        , valueLimit = 8
        ;

      options = $.extend({}, defaultOptions, options);

      if (!options.limit) {
        options.limit = valueLimit + options.centsLimit;
      }

      jEle.removeClass("currencyField");

      jCurrencyInput.attr("type", "text");
      jCurrencyInput.removeClass("currencyField");
      jCurrencyInput.addClass("initializedCurrencyField");
      jCurrencyInput.removeAttr("name");
      if (jEle.val().length == 0) jEle.val(0);

      jEle.attr("type", "hidden");

      jCurrencyInput.priceFormat(options);

      jCurrencyInput.on("keyup", function (event) {
        var jCurrInput = $(this)
          , currency = jCurrInput.val()
          , number = (options.allowNegative ?
            Number(currency.replace(/[^-0-9\.]+/g, "")) : Number(currency.replace(/[^0-9\.]+/g, "")))
          ;

        jEle.val(number);

      });

      jEle.replaceWith(jContainer);
      jContainer.append(jEle);
      jContainer.append(jCurrencyInput);

      jEle.on("change", function () {
        $(this).trigger("focusout.price_format");
      });
    });
  },
  /*
   Initializes Inputs which report length.
   Author: Harshniket

   Review:
   */
  initLengthReportedInput: function (jScope) {
    var jScope = jScope || $(document)
      , toReportInputFields = jScope.hasClass("lengthReportedInput") ? jScope : jScope.find("input.lengthReportedInput")
      , renderReport = function (jInputField) {
        var inputVal = jInputField.val()
          , inputValLength = inputVal.length
          , inputId = jInputField.attr("id")
          , maxLength = jInputField.attr("maxLength")
          , reportPrefix = jInputField.data("reportPrefix") || ""
          , paddedReportPrefix = (reportPrefix.length > 0 ? reportPrefix + " " : "")
          , reportPostfix = jInputField.data("reportPostfix") || ""
          , paddedReportPostfix = (reportPostfix.length > 0 ? " " + reportPostfix : "")
          , reportField = $("#" + inputId + "Report")
          , diff = (maxLength - inputValLength)
          , remainingInputLength = Math.max(Math.min(diff, 30), 0);
        ;

        $(reportField).html(paddedReportPrefix + remainingInputLength + paddedReportPostfix);
      }
      ;

    $.each(toReportInputFields, function (index, inputField) {
      var jInputField = $(inputField);

      renderReport(jInputField);
      jInputField.on("keyup", function () {
        renderReport($(this));
      })
    });
  },
  /*
   Inits Form.

   Author: Harshniket
   Review:
   */
  initForm: function (jForm) {
    var self = this;

    jForm.validate();
  },
  /*
   Init Number Only Fields components.

   Author: Harshniket
   Review:
   */
  initAlerts: function () {
    $(".close.close-sm").on("click", function () {
      var jEle = $(this)
        , jAlert = jEle.closest(".alert")
        ;

      jAlert.fadeOut();
    });
  },
  /*
   Author: Harshniket
   Initializing Bootstrap Tooltip
   */
  initTooltip: function () {
    $("a[rel~=popover], .has-popover").popover();
    $("a[rel~=tooltip], .has-tooltip").tooltip();
  },
  /*
   Author: Harshniket
   Initializing Bootstrap Modal
   */
  initModal: function () {
    var jModal = $('.modal');

    if (jModal.length > 0) {
      jModal.modal({
        backdrop: 'static',
        show: false
      });
    }
  },
  /*
   Reads location.hash to change tab, if tab not found fires event with said hash.
   Everything in the hash after '_' is considered event data.

   Author: Harshniket
   Review:
   */
  makeTabsPersistent: function () {
    if (location.hash !== '') {
      var tabPage = $('a[href="' + location.hash + '"][role="tab"]');

      if (tabPage.parent().is(":first-child")) {
        location.hash = "";
      }
      if (tabPage.length > 0) {
        tabPage.tab('show');
      } else {
        setTimeout(function () {
          var hash_split = location.hash.split("#")[1].split("_")
            , eventName = hash_split[0]
            , data = hash_split.slice(1, hash_split.length)
            ;

          $(document).trigger(eventName, data);
        }, 100);
      }
    }
    return $('a[data-toggle="tab"]').on('click', function (e) {
      return location.hash = $(e.target).attr('href').substr(1);
    });
  },
  /*
   Shows flash notice through javascript.

   Author: Harshniket
   Review:
   */
  showFlashInfo: function (notices) {

    $(".alert.alert-success").remove();
    var noticeHTML = "<p class='alert alert-success'>" + notices.join("</br>") + "</p>";
    $("#main_container").prepend(noticeHTML);
  },
  /*
   Shows flash alerts through javascript.

   Author: Harshniket
   Review:
   */
  showFlashAlert: function (alerts) {

    $(".alert.alert-danger").remove();

    if (!alerts) return false;

    var alertHTML = "<p class='alert alert-danger'>" + alerts.join("</br>") + "</p>";
    $("#main_container").prepend(alertHTML);
  },
  /*
   Modal show and callbacks helper.

   Author: Harshniket
   Review:
   */
  showModal: function (selector, options, onNegative, onPositive) {
    var jModal = (typeof(selector) === "string" ? $(selector) : selector);

    var existingOptions = jModal.data("bs.modal").options
      , options = $.extend({}, existingOptions, options)
      ;

    jModal.data("bs.modal").options = options;
    jModal.modal('show');

    jModal.find(".btn.negative").on("click", function () {
      onNegative();
    });

    jModal.find(".btn.positive").on("click", function () {
      onPositive();
    });
  },
  /*
   Modal hide.

   Author: Harshniket
   Review:
   */
  hideModal: function (selector, options, onNegative, onPositive) {
    var jModal = (typeof(selector) === "string" ? $(selector) : selector);
    jModal.modal('hide');
  },
  /*
   Slides up alerts.
   Author: Harshniket

   Review:
   */
  slideUpAlerts: function (type) {
    $(".alert.alert-" + type).slideUp("slow")
  },
  /*
   Generates UUID
   Author: Harshniket

   Review:
   */
  uuid: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });

    return uuid;
  },
  /*
   Initializes Renderers.
   Author: Harshniket

   Review:
   */
  initRenderers: function (jScope) {
    var jScope = jScope || $(document);

    var jRendererButtons = jScope.is("[data-render-to]") ? jScope : jScope.find("[data-render-to]");

    jRendererButtons.on("click", function (event) {
      var jBtn = $(this)
        , data = jBtn.data()
        , renderTo = data.renderTo
        , jRenderTo = $(renderTo)
        , url = data.url
        , url = (url ? url.trim() : "")
        , eventName = data.eventName
        , append = data.append
        ;

      event.preventDefault();

      _Helper.doRender(jRenderTo, url, eventName, append);
    });
  },
  /*
   Initializes Ajax Forms.
   Author: Harshniket

   Review:
   */
  initAjaxForm: function (jScope) {
    var jScope = jScope || $(document);

    var jAjaxForms = jScope.is("form[data-do-ajax]") ? jScope : jScope.find("form[data-do-ajax]");

    jAjaxForms.on("submit", function (event) {
      event.preventDefault();

      var jForm = $(this)
        , url = jForm.attr("action")
        , params = jForm.serialize()
        , method = jForm.attr("method")
        , data = jForm.data()
        , onSuccessEventName = data.onSuccessEventName
        , onErrorEventName = data.onErrorEventName
        ;

      if (!_Helper.validateForm(jForm)) {
        jForm.trigger(onErrorEventName, {errors: ["Form invalid."]});
        return false;
      }

      $.ajax({
        url: url,
        method: method,
        data: params,
        success: function (response) {
          jForm.trigger(onSuccessEventName, response);
        },
        error: function (response) {
          jForm.trigger(onErrorEventName, response);
        }
      });

    });
  },
  /*
   Initializes Ajax Buttons.
   Author: Harshniket

   Review:
   */
  initAjaxButtons: function (jScope) {
    var jScope = jScope || $(document);

    var jAjaxButtons = jScope.is("[data-do-ajax]") ? jScope : jScope.find("[data-do-ajax]");

    jAjaxButtons.on('click', function (event) {
      var jAjaxBtn = $(this)
        , url = jAjaxBtn.attr("href")
        , data = jAjaxBtn.data()
        , method = data.method
        ;

      event.preventDefault();
      $.ajax({
        url: url,
        dataType: "json",
        type: method,
        success: function (response) {
          jAjaxBtn.trigger(data.eventName, response);
        },
        error: function () {
        }
      });
    });
  },
  /*
   Initializes tab auto loading.
   Author: Harshniket

   Review:
   */
  initTabAutoload: function (jTabs, once) {
    if (once) {
      jTabs.find("a[data-render-url]").one("show.bs.tab", function (event) {
        var jTabA = $(this);

        _Helper.renderTab(jTabA);
      });
    } else {
      jTabs.find("a[data-render-url]").on("show.bs.tab", function (event) {
        var jTabA = $(this);

        _Helper.renderTab(jTabA);
      });
    }
  },
  /*
   Renders tab.
   Author: Harshniket

   Review:
   */
  renderTab: function (jTab) {
    var renderTo = jTab.attr("href")
      , jRenderTo = $(renderTo)
      , renderUrl = jTab.data("renderUrl")
      , eventName = jTab.data("eventName")
      ;

    _Helper.doRender(jRenderTo, renderUrl, eventName)

  },
  /*
   Renders response to a particular DOM element.
   Author: Harshniket

   Review:
   */
  doRender: function (jRenderTo, renderUrl, eventName, append) {
    var append = append || false;

    if (renderUrl && renderUrl.length > 0) {
      renderUrl += (renderUrl.indexOf("?") < 0 ? window.location.search : "");
      if (append) {
        $.get(renderUrl, function (data) {
          jRenderTo.append(data);
        });
      } else {
        if (typeof _Variable != "undefined") {
          jRenderTo.html("<div class='text-center'>" + _Variables.loading_image() + "</div>");
        }
        jRenderTo.load(renderUrl, function () {
          jRenderTo.trigger(eventName);
        });
      }
    }
  },
  /*
   Formats credit card field.
   * Inserts delimiter after 4 characters in credit card numbers.
   Author: Harshniket

   Review:
   */
  formatCreditCard: function (jCreditCardInput) {
    jCreditCardInput.keyup(function () {
      var origInputVal = $(this).val()
        , origInputValLength = origInputVal.length
        , inputVal = origInputVal.split("-").join("")
        , inputValLength = inputVal.length
        ;
      if (event.which != 8 && (inputValLength == 4 || inputValLength == 8 || inputValLength == 12)) {
        $(this).val(inputVal.match(new RegExp('.{1,4}', 'g')).join("-") + "-");
      }
      if (event.which == 8 && (origInputValLength == 5 || origInputValLength == 10 || origInputValLength == 15)) {
        var origInputValArray = origInputVal.split("")
        if (origInputValArray[origInputVal.length - 1] == "-") {
          var newValue = origInputValArray.splice(0, origInputVal.length - 1);
          $(this).val(newValue.join(""));
        }

      }
    });
  },
  /*
   Validates form and show error messages.
   Author: Harshniket

   Review:
   */
  validateForm: function (jForm) {
    var success = true
      , jErrorMessages = jForm.find(".errorMessage")
      , jFirstField = null
      ;

    jErrorMessages.fadeOut().remove();

    $.each(jForm.find(".fieldWrap.required > .form-control"), function (index, field) {
      var jField = $(field);


      var fieldType = jField.attr("type")
        , isMaskedField = (jField.attr("mask") != undefined)
        , fieldVal = (isMaskedField ? jField.cleanVal() : (jField.val() || ""))
        , minLength = jField.data('minLength')
        , errorMessage = null
        , fieldValLength = fieldVal.length
        , defaultEmptyErrorMessage = "This field is required."
        , defaultMinLengthMessage = minLength ? "Minimum " + minLength + " digits required." : null
        , defaultInvalidFormatMessage = "Data format is invalid."
        ;

      fieldVal = (typeof(fieldVal) === "string" ? fieldVal.trim() : fieldVal);

      if (fieldValLength === 0) {

        success = false;
        errorMessage = jField.data("onEmptyMessage") || defaultEmptyErrorMessage;

      } else if (minLength && fieldValLength < minLength) {

        success = false;
        errorMessage = jField.data("minLengthErrorMessage") || defaultMinLengthMessage;

      } else if (fieldType === "url" && !_Helper.isURLEmail(fieldVal) || (fieldVal.indexOf('..') > -1)) {

        success = false;
        errorMessage = jField.data("onFormatErrorMessage") || defaultInvalidFormatMessage;

      } else if (fieldType === "email" && (!_Helper.isValidEmail(fieldVal) || (fieldVal.indexOf('@-') > -1))) {
        success = false;
        errorMessage = jField.data("onFormatErrorMessage") || defaultInvalidFormatMessage;

      }

      _Helper.showErrorForField(errorMessage, jField);

      if (!success && !jFirstField) {
        jFirstField = jField;
      }
    });

    var customValidator = jForm.data("customValidator")
    if (customValidator && typeof(customValidator) === "function") {
      if (!customValidator()) {
        success = false;
      }
    }

    if (jFirstField) {
      _Helper.scrollToElement(jFirstField.closest(".field").closest(".form_container"));
    }
    return success;
  },
  /*
   Checks if email is valid.
   Author: Harshniket

   Review:
   */
  isValidEmail: function (value) {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))
  },
  /*
   Checks if url is valid.
   Author: Harshniket

   Review:
   */
  isURLEmail: function (value) {
    return (/^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(value))
  },
  /*
   Shows error message for a particular field.
   Author: Harshniket

   Review:
   */
  showErrorForField: function (errorMessage, jField) {
    var fieldWrap = jField.closest(".field,.form-group");

    if (errorMessage) {
      var jErrorMessage = $("<div class='errorMessage'>" + errorMessage + "</div>");
      fieldWrap.append(jErrorMessage);
      jErrorMessage.fadeIn();
    }
  },
  /*
   Initialize masked field.
   Author: Harshniket

   Review:
   */
  initMaskedFields: function (jScope) {
    var jScope = jScope || $(document)
      , maskedFields = jScope.attr("mask") ? jScope : jScope.find("[mask]")
      ;
    $.each(maskedFields, function (index, maskedField) {
      var jMaskedField = $(maskedField)
        , mask = jMaskedField.attr("mask")
        , options = jMaskedField.data()
        ;

      jMaskedField.mask(mask, options);
    });

  },
  /*
   Initialize file upload field.
   Author: Harshniket

   Review:
   */
  scrollToElement: function (jScrollTo, scrollSpeed) {
    if (!jScrollTo || jScrollTo.length === 0) {
      return false;
    }

    var scrollVal = $(jScrollTo).offset().top
      ;

    _Helper.scrollTo(scrollVal, scrollSpeed);
  },
  /*
   Scrolls to a particular value on the window.
   Author: Harshniket

   Review:
   */
  scrollTo: function (scrollVal, easeTime) {
    var easeTime = easeTime || 0;

    $('html, body').animate({
      scrollTop: scrollVal
    }, easeTime);
  },
  /*
   Initializes link scrollers.
   Author: Harshniket

   Review:
   */
  initLinkScrollers: function (jScope) {
    var jScope = jScope || $(document);

    jScope.on('click', '.linkScroller', function (event) {
      var jLink = $(this)
        , scrollSpeed = (jLink.data('speed') || 1000)
        , scrollToId = jLink.data('target')
        , jScrollTo = $(scrollToId)
        ;
      _Helper.scrollToElement(jScrollTo, scrollSpeed);
    });
  },
  addToHistory: function (URL) {
    if (URL) history.pushState(null, null, URL);
  },
  /*
   Initializes file upload field.
   Author: Harshniket

   Review:
   */
  initFileUpload: function (jScope) {
    var jScope = jScope || $(document)
      , fileUploadElements = jScope.find("input[type='file']")
      , validateSelectedFile = function (fileInput) {
        var jFileInput = $(fileInput)
          , maxFileSize = jFileInput.data("maxFileSize")
          , selectedFile = fileInput.files[0] || {size: 0}
          , selectedFileSize = selectedFile.size

        if (selectedFileSize > maxFileSize) {
          jFileInput.val("");
          var errorMessage = jFileInput.data("onFileSizeLimitError");
          if (!errorMessage) {
            var limitInMB = maxFileSize / (1024 * 1024);
            errorMessage = "Please upload a file under " + limitInMB + " MB";
          }
          var jErrorMessage = $("<div class='errorMessage'>" + errorMessage + "</div>");
          var jField = jFileInput.closest(".field")
          jField.find(".errorMessage").fadeOut().remove();
          jField.append(jErrorMessage);
          jErrorMessage.fadeIn();
          return false;
        }
        return true;
      }
      , showSelectedFileName = function (fileInput) {
        var jFileInput = $(fileInput)
          , selectedFile = fileInput.files[0] || {}
          , name = selectedFile.name
          , jUploadContainer = jFileInput.closest(".uploadContainer")
          , jSelectedFileInfo = jUploadContainer.find(".selectFileInfo")
          ;

        if (name) {
          jSelectedFileInfo.find("label").html(name);
          jSelectedFileInfo.show();
        } else {
          jSelectedFileInfo.find("label").html("");
          jSelectedFileInfo.hide();
        }
      }
      ;

    $.each(fileUploadElements, function (index, element) {
      var jElement = $(element);

      jElement.on("change", function (event) {
        if (validateSelectedFile(this)) {
          showSelectedFileName(this);
        }
      });

      jElement.closest(".uploadContainer").find(".removeSelectedFile").on("click", function () {
        var jRemoveSelectedFile = $(this)
          , jUploadContainer = jRemoveSelectedFile.closest(".uploadContainer")
          , jFileInput = jUploadContainer.find("input[type='file']")
          , confirmation = confirm("Are you sure, you want to unselect the file?");
        ;

        if (confirmation) {
          jFileInput.val("").change();
        }
      });
    });
  }
};