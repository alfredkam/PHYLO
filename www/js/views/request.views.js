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
			post : function(url, callBack, dummy) {
				var self = this;
				self.loading();
				$.ajax({
					type : "POST",
					url : url,
				}).done(function(re) {
					callBack(re);
				}).fail(function(re) {
					if(dummy != undefined) {
						console.log(">> Cannot connect to database, requesting dummy data @"+dummy);
						$.ajax({
							type : "GET",	
							url : dummy,
						}).done(function(data) {
							callBack(data);
						});
					} 
				});
			},
			getJsonLang : function(lang, callBack) {
				if(lang == undefined) {
					console.log("Warning >> Lang undefined - default to EN");
					lang = "EN";
				}
				require(['lang/'+lang],function() {
					window.langOpt = lang;
					var json = window[lang+"script"].lang[0];
					callBack(json);
				});
			},
			getTemplate : function(url,lang) {
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
					//check if its a function
					var getType = {};
					if(lang && getType.toString.call(lang) == '[object Function]') {
						lang(re);
				    	} else{
						self.change(re,lang);	
					    	self.complete();
					}
				});
			}, 
		});

		return Request;
	});
})();
