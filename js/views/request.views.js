(function() {
	define([
		'jquery',
		'underscore',
		'backbone'
	],function($,_, Backbone) {
		var Request = Backbone.View.extend({
			change : function(context,lang) {
				require(['lang/'+lang] , function() {
					window.langOpt = lang;
					window.lang = window[lang+"script"].lang[0];
					$("#mid-panel").html(context);
				});
			},
			loadFailCounter : 0,
			complete : function() {
				$("#mid-panel").fadeIn();
				$("#loading-panel").hide();
			},
			loading : function() {
				$("#mid-panel").hide();
				$("#loading-panel").show();
			},
			get : function(url,lang) {
				var self = this;
				self.loading();
				$.ajax({
					type : "GET",
					statusCode : {
						412 : function() {
							console.log(">> Warning : Status Code 412; Retrying URL : "+url);
							self.loadFailCounter+=1;
							if(self.loadFailCounter == 5) {
								//window.location.reload(true);	
								$(".warning-cancel").hide();
								$(".warning-ok").hide();
								$(".warning-msg").html("<i class='icon-remove'></i><br><b>Aww Snap!</b><br>  Something went wrong.  Please reload the page to continue!");
								$(".warning-bg").css({
									height: $(document).height(),
									width: $(document).width(),
								});
								$(".warning-bg").fadeIn();
								$(".warning").fadeIn();
							} else {
								self.protocal(url);
							}
						},
					},	
					url : url,
				}).done(function(re) {
					self.change(re,lang);	
					self.complete();
				});
			}, 
		});

		return Request;
	});

	$.hashbang = {
		checkIfAutoStart : function() {
			var page = $.hashbang.get(); 
			if(page.search(/autoStart/) >= 0) { 
				var id = parseInt($.hashbang.httpHashGet("autoStart"));
				if(isNaN(id))
					return;
				$("#draw").hide();
				$("#menu").hide();
				$.main.init({
					type: "disease",
					num: id,		
				});
			} 
		},
		//treat hash like HTTP GET
		httpHashGet : function(pid) {
			var $_GET = {};
			var hash = window.location.hash.replace(/#!play&/,"");
			hash.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			    function decode(s) {
				return decodeURIComponent(s.split("+").join(" "));
				}

			    $_GET[decode(arguments[1])] = decode(arguments[2]);
			});
			return $_GET[pid];
			//return 1111;	
		},
		//gets the current hashtag
		get : function() {
			return window.location.hash.replace(/^#!/,"");
		},
	};
})();
