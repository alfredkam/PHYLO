(function() {
	$.lang = {
		init : function(callBack) {
			var hash = $.helper.get("lang");			
			
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
		},
	}

})();
