/*!
 * AppRes JavaScript Library v0.0.4
 * https://appres.org/
 *
 * Copyright 2021 APPRES.ORG and other contributors
 * Released under the MIT license
 * https://appres.org/license
 *
 * Date: 2021.02.07 KST
 */


(function (window) {
  var
    options = {
      host: "https://appres.org/functions/api",
      pkey: "GXYqIgrafjTRatwTB96d",
      akey: "39f031e6-94a0-4e14-b600-82779ec899d7",
      cmd: "string",
      target: "js",
      skey: "default",
      lang: "ja-JP",
      only: false,
      retry: 50,
      time: 25,
      cache: true,
      visibility: "hidden"
    },
    loadScript = function (window, url, callback) {
      var script = window.document.createElement("script");
      script.type = 'text/javascript';
      // IE에서는 onreadystatechange를 사용 
      script.onload = function () {
        if (callback) callback();
      };
      script.src = url;
      window.document.getElementsByTagName('head')[0].appendChild(script);
    },
    elementText = function (element, text) {
      if (text) {
        if (element.textContent) {
          element.textContent = text;
          return element.textContent;
        }
        if (element.innerText) {
          element.innerText = text;
          return element.innerText;
        }
      } else {
        if (element.textContent) return element.textContent;
        if (element.innerText) return element.innerText;
      }
      return null;
    },
    appString = function (window, element) {
      var newtext = null;
      var text = elementText(element);
      if (window.APPRES_STRINGS) {
        if (element.hasAttribute('key')) {
          newtext = window.APPRES_STRINGS[element.getAttribute('key')];
        } else {
          if (text != null) newtext = window.APPRES_STRINGS[text];
        }
      }
      if (newtext) {
        if (typeof newtext === "object") {
          var _newtext = newtext[options.lang];
          if (_newtext == "") {
            _newtext = newtext["default"];
          }
          newtext = _newtext;
        }
      } else {
        if (window.APPRES_STRINGS) {
          console.log("AppRes: " + text);
        } else {
          console.log("AppRes: " + text + " " + "(Not found APPRES_STRINGS!!!)");
        }
      }
      return newtext;
    },
    appStringAsync = function (window, element, retry, callback) {
      if (window.APPRES_STRINGS) {
        elementText(element, appString(window, element) || elementText(element));
        if (window.onChangedAppRes) {
          window.onChangedAppRes(element, true);
        }
        if (callback) {
          callback(true);
        }
      } else {
        if (retry >= options.retry) {
          if (window.onChangedAppRes) {
            window.onChangedAppRes(element, false);
          }
          if (callback) {
            callback(false);
          }
        } else {
          setTimeout(function () {
            appStringAsync(window, element, ++retry, callback);
          }, options.time);
        }
      }
    },
    setItem = function (window, k, v) {
      var deno = 0, i, j;
      while (1) {
        try {
          if (!deno) window.localStorage.setItem(k, v);
          else {
            window.localStorage.setItem(k, '--' + deno);
            j = Math.ceil(v / deno);
            for (i = 0; i < deno; i++)
              window.localStorage.setItem(k + '::' + i, v.substr(i * j, j));
          }
          break;
        } catch (e) {
          deno++;
        }
      }
    },
    getItem = function (window, k) {
      var data = window.localStorage.getItem(k), temp, i, j;
      if (data && data.substr(0, 2) == '--') {
        for (temp = '', i = 0, j = parseInt(data.substr(2)); i < j; i++)
          temp += window.localStorage.getItem(k + '::' + i);
        data = temp;
      }
      return data;
    },
    removeItem = function (window, k) {
      var data = window.localStorage.getItem(k), i, j;
      if (data && data.substr(0, 2) == '--') {
        for (i = 0, j = parseInt(data.substr(2)); i < j; i++)
          window.localStorage.removeItem(k + '::' + i);
      }
      if (data) window.localStorage.removeItem(k);
    },
    clearItems = function (window) {
      removeItem(window, "appres.ver");
      removeItem(window, "appres.url");
      removeItem(window, "appres.strings");
    },
    equalItem = function (window, k, v) {
      var data = getItem(window, k);
      return (v == data);
    },
    getVer = function (window) {
      return getItem(window, "appres.ver");
    },
    elementSelectAll = function (window, selector) {
      return window.document.querySelectorAll(selector);
    },
    translateAll = function (window) {
      var elements = elementSelectAll(window, ".appres");
      elements.forEach(function (element) {
        appStringAsync(window, element, 0, function (success) {
          if (options.visibility == "hidden") {
            element.setAttribute('style', 'visibility:visible');
          }
        });
      })
    },
    hideTemporarily = function (window) {
      var elements = elementSelectAll(window, ".appres");
      elements.forEach(function (element) {
        element.setAttribute('style', 'visibility:hidden');
      });
    },
    showTemporarily = function (window) {
      var elements = elementSelectAll(window, ".appres");
      elements.forEach(function (element) {
        element.setAttribute('style', 'visibility:visible');
      });
    }

  var appWindow = window;
  var AppRes = function (window, _options) {
    appWindow = window;
    if (_options) {
      if (_options.host) options.host = _options.host;
      if (_options.pkey) options.pkey = _options.pkey;
      if (_options.akey) options.akey = _options.akey;
      if (_options.cmd) options.cmd = _options.cmd;
      if (_options.target) options.target = _options.target;
      if (_options.skey) options.skey = _options.skey;
      if (_options.lang) options.lang = _options.lang;
      if (_options.only) options.only = _options.only;
      if (_options.retry != null) options.retry = _options.retry;
      if (_options.time != null) options.time = _options.time;
      if (_options.cache != null) options.cache = _options.cache;
      if (_options.visibility != null) options.visibility = _options.visibility;
    }

    if (options.visibility == "hidden") {
      hideTemporarily(appWindow);
    }

    var ver = getVer(appWindow) || 0;
    var appres_url = options.host +
      "?pkey=" + options.pkey +
      "&akey=" + options.akey +
      "&cmd=" + options.cmd +
      "&target=" + options.target +
      "&skey=" + options.skey;
    if (options.only == true) {
      appres_url += "&lang=" + options.lang;
    }
    appres_url += "&ver=" + ver;

    if (ver == 0 || options.cache == false || (options.cache && !equalItem(appWindow, "appres.url", appres_url))) {
      clearItems(appWindow);
    }

    var appres_strings = null;
    if (options.cache) {
      appres_strings = getItem(appWindow, "appres.strings");
      if (appres_strings) {
        try {
          var appres_strings_json = JSON.parse(appres_strings);
          var key_count = Object.keys(appres_strings_json).length;
          if (key_count > 0) {
            appWindow.APPRES_STRINGS = appres_strings_json;
            appres_strings = true;
          } else {
            appres_strings = false;
          }
        } catch (e) {
          clearItems(appWindow);
          appres_strings = null;
        }
      }
    }

    if (options.cache && appres_strings == true) {
      console.log("AppRes: Loaded app string from cached");
      translateAll(appWindow);
      if (appWindow.onLoadedAppRes) {
        appWindow.onLoadedAppRes();
      }
    } else {
      loadScript(appWindow, appres_url,
        function () {
          console.log("AppRes: Loaded app string from appres url");
          if (options.cache) {
            setItem(appWindow, "appres.url", appres_url);
            setItem(appWindow, "appres.strings", JSON.stringify(window.APPRES_STRINGS));
          }
          translateAll(appWindow);
          if (appWindow.onLoadedAppRes) {
            appWindow.onLoadedAppRes();
          }
        }
      );
    }
  };

  AppRes.prototype.appString = function (text) {
    return appString(appWindow, text);
  };

  window.AppRes = AppRes;
  if (typeof define === "function" && define.amd && define.amd.AppRes) {
    define("appres", [], function () { return AppRes; });
  }


  if (document.addEventListener) { 
    // Mozilla, Opera, Webkit 
    document.addEventListener("DOMContentLoaded", function () { 
      document.removeEventListener("DOMContentLoaded", arguments.callee, false); 
        if(window.onAppResReady) {
          setTimeout(function() {
            window.onAppResReady();
          }, 0);
        } else {
          console.log("AppRes: Required onAppResReady() function !!!");
        }
      }, false); 
  } 
  else 
  if (document.attachEvent) { 
    // Internet Explorer 
    document.attachEvent("onreadystatechange", function () { 
      if (document.readyState === "complete") { 
        document.detachEvent("onreadystatechange", arguments.callee); 
        if(window.onAppResReady) {
          setTimeout(function() {
            window.onAppResReady();
          }, 0);
        } else {
          console.log("AppRes: Required onAppResReady() function !!!");
        }
      } 
    }); 
  }
  
})(window);


