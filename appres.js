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
        time: 25,
        cache: true,
        visibility: "hidden"
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
        if(window.AppStrings) {
          if(element.hasAttribute('key')) {
            newtext = window.AppStrings[element.getAttribute('key')];
          } else {
            newtext = window.AppStrings[element.innerText];
          }  
        }
        if(!newtext) {
          if(window.AppStrings) {
            console.log("AppRes: " + element.innerText);
          } else {
            console.log("AppRes: " + element.innerText + " " + "(Not found AppStrings!!!)");
          }
        }
        return newtext;
    },
    appStringTimer = function (context, element, retry) {
        if(window.AppStrings) {
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
      removeItem(window, "appres.url");
      removeItem(window, "appres.strings");
    },
    equalItem = function ( window, k, v ) {
        var data = getItem( window, k );
        return (v==data);
    },
    translateAll = function ( window ) {
      window.$(".appres").each(function (index, element) {
        console.log(index + ":" + element.text());
        if(options.visibility=="hidden") {
          element.attr('style', 'visibility:visible');
        }  
      });
    },
    hideTemporarily = function ( window ) {
      window.$(".appres").attr('style', 'visibility:hidden');
    },
    showTemporarily = function ( window ) {
      window.$(".appres").attr('style', 'visibility:visible');
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
            if(_options.cache!=null) options.cache = _options.cache;
            if(_options.visibility!=null) options.visibility = _options.visibility;
        }
        
        if(options.visibility=="hidden") {
          hideTemporarily(appWindow);
        }

        var appres_url = options.host + 
          "?pkey=" + options.pkey + 
          "&akey=" + options.akey + 
          "&cmd=" + options.cmd + 
          "&target=" + options.target + 
          "&skey=" + options.skey + 
          "&lang=" + options.lang;

        if(options.cache && !equalItem(appWindow, "appres.url", appres_url)) {
          clearItems(appWindow);
        }

        var appres_strings = null;
        if(options.cache) {
          appres_strings = getItem(appWindow, "appres.strings");
          if(appres_strings) {
            try {
              var appres_strings_json = JSON.parse(appres_strings);
              var key_count  = Object.keys(appres_strings_json).length;
              if(key_count>0) {
                appWindow.AppStrings = appres_strings_json;
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

        if(options.cache && appres_strings==true) {
          console.log("AppRes: Loaded app string from cached");
          translateAll(appWindow);
          if(appWindow.onLoadedAppRes) {
            appWindow.onLoadedAppRes();
          }
        } else {
          loadScript(window, appres_url, 
            function() {
              if(options.cache) {
                setItem(appWindow, "appres.url", appres_url);
                setItem(appWindow, "appres.strings", JSON.stringify(window.AppStrings));  
              }
              translateAll(appWindow);
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
})( window );

