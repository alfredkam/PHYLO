(function() {
	$.lang = {

		//initialize and get the languages file, then executes call back function

		init : function(callBack) {
            return callBack();

            ///  **** NOTE ****
            //
            //depreciated this entire script, handled through marionette/backbone model
            //
            //
            //


			//checks if language file is already loaded.
			//if not loaded, load it into the dom
            
            //moved hash to be outside so it can be used in all cases
   //          var hash;
   //          try {
   //              hash = $.helper.get("lang").toString().toUpperCase().replace(/!.*/,"");
   //              console.log("Language hash set " + hash);
   //          } catch(err) {
   //              // BEGIN FIXME (Quick hack to detect language)
   //              var userLang = navigator.language || navigator.userLanguage;
   //              var language = userLang.substring(0,2).toUpperCase();
   //              console.log("Browser language detected: " + language);
   //              switch (language) {
   //                  case "EN":
   //                  case "FR":
   //                  case "SP":
   //                  case "DE":
   //                  case "PT":
   //                  case "RO":
   //                  case "RU":
   //                  case "KO":
   //                  case "HE":
   //                      hash= language;
   //                      break;
   //                  case "ZH":
   //                      var languageExtension = headers['Accept-Language'].substring(0,5).toUpperCase();
   //                      console.log("Browser extended language: " + languageExtension);
   //                      if (languageExtension == "ZH-HK") {
   //                          hash = "ZH-HK";
   //                      } else {
   //                          hash = "ZH-CN";
   //                      };
   //                      break;
   //                  default:
   //                      hash = "EN";
   //                      break;
   //              }
   //              // END FIXME
   //              console.log("Language not specified. Set to default value: " + hash);
   //          }
 
			// if($("#langFile").length == 0) {
			// 	var script = document.createElement("script");
			// 	script.id = "langFile";
			// 	script.src = "../lang/"+hash+".js";
			// 	script.type = "text/javascript";
			// 	document.getElementsByTagName("head")[0].appendChild(script);
	
			// 	script.onload = function() {
			// 		var available = function() {
			// 			if(window[hash+"script"] != undefined) {
			// 				window.langOpt = hash;
			// 				window.lang = window[hash+"script"].lang[0];
			// 				callBack();
			// 			} else {
			// 				window.setTimeout(function(){
			// 					available();
			// 				},50);
			// 			}
			// 		};
			// 		available();
			// 	};
			// 	script.onerror = function() {
			// 		console.log(">> Cannot connect to get language files");
			// 		console.log(">> Loading local lang files");
			// 		var _script = document.createElement("script");
			// 		_script.src = "lang/EN.js";
			// 		_script.type = "text/javascript";
			// 		document.getElementsByTagName("head")[0].appendChild(_script);
			// 		window.langOpt = "EN";
					
			// 		_script.onload = function() {
			// 			window.lang = window["ENscript"].lang[0];
			// 			callBack();
			// 		};
			// 	};
			// } else {
			// 	//does the callback
			// 	var wait = function() {
			// 		if(window.lang == undefined) 
			// 			setTimeout(function(){ wait(); },100);
			// 		else 
			// 			callBack();
			// 	}
			// 	wait();
			// }
		},
	}

})();
