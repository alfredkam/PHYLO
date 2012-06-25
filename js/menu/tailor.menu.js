(function() {
	$.tailor = {
		run : function(callback) {
			$.lang.init(function() {
				var wait = function() {

					if(window.lang == undefined) {
						window.setTimeout(function() { wait(); },100);	
					} else 
						callback();
				};
				wait();
			});
		},
		header:  function() {
			var l = window.lang;
			$("#play div").html(l.header["field 1"]);
			$("#tutorial div").html(l.header["field 2"]);
			$("#about div").html(l.header["field 3"]);
			$("#credits div").html(l.header["field 4"]);
			$("#login-tag").html(l.body.play.gameselect.login["field 2"]);
		},
		init : function() {
			var self = this;
			$.lang.init(function() {
				self.header();					
			});
		},
	};

	$(document).ready(function() {
		$.tailor.init();		
	});
})();
