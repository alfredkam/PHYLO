(function() {
	$.lang = {
		init : function(callBack) {
			var hash;
			try {
				hash = $.helper.get("lang").toString().toUpperCase();			
			} catch(err) {
				hash = "en";
			}	
			
			var script = document.createElement("script");
			script.src = "../lang/"+hash+".js";
			script.type = "text/javascript";
			
			document.getElementsByTagName("head")[0].appendChild(script);
			
			script.onload = function() {
				var avaliable = function() {
					if(window[hash+"script"] != undefined) {
						window.langOpt = hash;
						window.lang = window[hash+"script"].lang;
						callBack();
					} else {
						window.setTimeout(function(){
							avaliable();
						},50);
					}
				};
				avaliable();
			};
			script.onerror = function() {
				console.log(">> Cannot connect to get language files");
				console.log(">> Loading local lang files");
				var _script = document.createElement("script");
				_script.src = "lang/EN.js";
				_script.type = "text/javascript";
				document.getElementsByTagName("head")[0].appendChild(_script);
				
				_script.onload = function() {
					window.lang = window["ENscript"].lang;
					callBack();
				};
			};
		},
	}

})();
