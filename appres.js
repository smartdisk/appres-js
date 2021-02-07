/*!
 * AppRes JavaScript Library v0.0.1
 * http://appres.org/
 *
 * Copyright 2021 AppRes Foundation and other contributors
 * Released under the MIT license
 * http://appres.org/license
 *
 * Date: 2021.02.07 KST
 */


(function( window ) {
    var 
    options = {
        host: "https://appres.org/functions/api",
        pkey: "GXYqIgrafjTRatwTB96d",
        akey: "39f031e6-94a0-4e14-b600-82779ec899d7",
        cmd: "string",
        target: "js",
        skey: "default",
        lang: "ja-JP"    
    },
    loadScript = function (window, url) {
        var script = window.document.createElement("script");
        script.src = url;
        window.document.head.appendChild(script);
    },
    appString = function (window, element) {
        let newtext = null;
        if(window.AppString) {
          if(element.hasAttribute('key')) {
            newtext = window.AppString[element.getAttribute('key')];
          } else {
            newtext = window.AppString[element.innerText];
          }  
        }
        if(!newtext) {
          if(window.AppString) {
            console.log("AppRes:" + element.innerText);
          } else {
            console.log("AppRes:" + element.innerText + " " + "(Not found AppString!!!)");
          }
        }
        return newtext;
    };
    var appWindow = window;
    var AppRes = function( window, _options ) {
        appWindow = window;
        if(_options) {
            if(_options.host) options.host = _options.host;
            if(_options.pkey) options.pkey = _options.pkey;
            if(_options.akey) options.akey = _options.akey;
            if(_options.cmd) options.cmd = _options.cmd;
            if(_options.target) options.target = _options.target;
            if(_options.skey) options.skey = _options.skey;
            if(_options.lang) options.lang = _options.lang;
        }
        window.customElements.define('app-res', class extends HTMLElement {
            constructor() {
              super();
              const context = window;
              const element = this;
              setTimeout(function(){
                element.innerText = appString(context, element) || element.innerText;
              }, 0);
            }
        });      
        loadScript(window, options.host + 
            "?pkey=" + options.pkey + 
            "&akey=" + options.akey + 
            "&cmd=" + options.cmd + 
            "&target=" + options.target + 
            "&skey=" + options.skey + 
            "&lang=" + options.lang);
    };

    AppRes.prototype.appString = function (text) {
        return appString(appWindow, text);
    };

    if(window.onReadAppResOptions) {
        var options = window.onReadAppResOptions();
        if(options) {
            window.AppRes = new AppRes(window, options);
        }
    } else {
        console.log("AppRes requires a global function called onReadAppResOptions(). Visit appres.org for more information.");
    }
    
    if ( typeof define === "function" && define.amd && define.amd.AppRes ) {
        define( "appres", [], function () { return AppRes; } );
    }
        
})( window );

