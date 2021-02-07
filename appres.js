/*!
 * AppRes JavaScript Library v0.0.4
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
        lang: "ja-JP",
        retry: 50,
        time: 25 
    },
    loadScript = function (window, url, callback) {
        var script = window.document.createElement("script");
        script.type = 'text/javascript'; 
        // IE에서는 onreadystatechange를 사용 
        script.onload = function () { 
            if(callback) callback(); 
        }; 
        script.src = url;
        window.document.getElementsByTagName('head')[0].appendChild(script); 
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
            console.log("AppRes: " + element.innerText);
          } else {
            console.log("AppRes: " + element.innerText + " " + "(Not found AppString!!!)");
          }
        }
        return newtext;
    },
    appStringTimer = function (context, element, retry) {
        if(window.AppString) {
            element.innerText = appString(context, element) || element.innerText;
            if(context.onChangedAppRes) {
                context.onChangedAppRes(element, true);
            }
        } else {
            if(retry>=options.retry) {
                if(context.onChangedAppRes) {
                    context.onChangedAppRes(element, false);
                }
            } else {
                setTimeout(function(){
                    appStringTimer(context, element, ++retry);
                }, options.time);    
            }
        }
    },
    setItem = function ( window, k, v ) {
        var deno = 0, i, j;
        while(1){
          try{
            if( !deno ) window.localStorage.setItem( k, v );
            else{
                window.localStorage.setItem( k, '--' + deno );
              j = Math.ceil( v / deno );
              for( i = 0 ; i < deno ; i++ )
              window.localStorage.setItem( k + '::' + i, v.substr( i * j, j ));
            }
            break;
          }catch(e){
            deno++;
          }
        }
    },
    getItem = function ( window, k ) {
        var data = window.localStorage.getItem(k), temp, i, j;
        if( data && data.substr(0,2) == '--' ){
          for( temp = '', i = 0, j = parseInt(data.substr(2)) ; i < j ; i++ )
            temp += window.localStorage.getItem( k + '::' + i );
          data = temp;
        }
        return data;
    },
    removeItem = function ( window, k ) {
        var data = window.localStorage.getItem(k), i, j;
        if( data && data.substr(0,2) == '--' ){
          for( i = 0, j = parseInt(data.substr(2)) ; i < j ; i++ )
            window.localStorage.removeItem( k + '::' + i );
        }
        if(data) window.localStorage.removeItem(k);
    },
    clearItems = function ( window ) {
      removeItem(window, "app-res-url");
      removeItem(window, "app-res-appstring");
    },
    equalItem = function ( window,  k, v ) {
        var data = getItem( window, k );
        return (v==data);
    }
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
            if(_options.retry!=null) options.retry = _options.retry;
            if(_options.time!=null) options.time = _options.time;
        }
        window.customElements.define('app-res', class extends HTMLElement {
            constructor() {
              super();
              const context = window;
              const element = this;
              setTimeout(function(){
                appStringTimer(context, element, 0);
              }, 0);
            }
        });

        var appresurl = options.host + 
          "?pkey=" + options.pkey + 
          "&akey=" + options.akey + 
          "&cmd=" + options.cmd + 
          "&target=" + options.target + 
          "&skey=" + options.skey + 
          "&lang=" + options.lang;

        if(!equalItem(appWindow, "app-res-url", appresurl)) {
          clearItems(appWindow);
        }

        var appres_appstring = getItem(appWindow, "app-res-appstring");
        if(appres_appstring) {
          try {
            var appstring_json = JSON.parse(appres_appstring);
            var key_count  = Object.keys(appstring_json).length;
            if(key_count>0) {
              appWindow.AppString = appstring_json;
              appres_appstring = true;
            } else {
              appres_appstring = false;  
            }
          } catch (e) {
            clearItems(appWindow);
            appres_appstring = null;
          }          
        }

        if(appres_appstring==true) {
          console.log("AppRes: Loaded app string from localstorage");
          if(appWindow.onLoadedAppRes) {
            appWindow.onLoadedAppRes();
          }
        } else {
          loadScript(window, appresurl, 
            function() {
                setItem(appWindow, "app-res-url", appresurl);
                setItem(appWindow, "app-res-appstring", JSON.stringify(window.AppString));
                if(appWindow.onLoadedAppRes) {
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
    if ( typeof define === "function" && define.amd && define.amd.AppRes ) {
        define( "appres", [], function () { return AppRes; } );
    }

    if(window.onInitAppRes) {
        window.onInitAppRes();        
    } else {
        console.log("AppRes: Requires a global function called onInitAppRes(). Visit appres.org for more information.");
    }
    
})( window );

