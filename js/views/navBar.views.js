(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
		'mustache',
		'views/request.views',
	], function($, _, Backbone, Mustache, Request) {
		var request = new Request;
		var navBar = Backbone.View.extend({
			init : function() {
				this.desktopNavBar = $("#nav").html();
				this.tabletUX = $("#tablet-grid").html();
				this.set,("EN","play");
			},
			lang : "null",
			set : function(lang,tag) {
				var self = this;
				if(this.lang == lang) 
					return;
				this.lang = lang;

				request.getJsonLang(lang, function(json) {
					$("#nav").html(Mustache.render(self.desktopNavBar,json)).show();;
					$("#tablet-grid").html(Mustache.render(self.tabletUX,json));
					self.addTriggers();
					$("#"+tag +" div").addClass("onSelect");
					if(window.showInLogin != undefined && window.showInLogin == true)
						$(".showInLogin").show();
					if(window.showExpertOptions != undefined && window.showExpertOptions == true)
						$(".showExpertOptions").show();
					var l = json;
					$("input#username").attr("placeholder",l.body.play.gameselect.login["field 7"]);
					$("input#password").attr("placeholder",l.body.play.gameselect.login["field 8"]);
					$("button.login-btn").html(l.body.play.gameselect.login["field 2"]);
				});
			},
			addTriggers : function() {
				var self = this;
				//menu hyperlink listener
				$("a.isTab").unbind().click(function() {
					if($(this).attr("href") == "javascript:void(0);") {
						var innerSelf = this;
						if($.timer.active == true) {
							$.helper.popUp("Are you sure you want to quite?",function(status) {
								if(status == "ok") {
									window.location.hash = "#!/"+window.langOpt+"/"+$(innerSelf).attr("id");		
									$.timer.stop();
									//force change
									if($(innerSelf).attr("id") == "play") {
										request.getTemplate("templates/play.html", self.lang);
									}
								}
							});			
						} else {
							window.location.hash = "#!/"+window.langOpt+"/"+$(this).attr("id");		
						}
					} else {
						window.location.href = $(this).attr("href");
					}
				});
				//tablet
				$("a.tablet-back-btn").unbind().click(function() {
					var innerSelf = this;
					if($.timer.active == true) {
						$.helper.popUp("Are you sure you want to quite?",function(status) {
							if(status == "ok") {
							//	window.location.hash = "#!"+$(innerSelf).attr("name");		
								$.timer.stop();
								$(this).hide();
								$(innerSelf).hide();
								$("#mid-panel").hide();
								$("#tabletPanel").show("slide",{direction:"left"},500);
								window.location.hash = "#!/"+window.langOpt;	
							}
						});			
					} else {
						$(this).hide();
						$("#mid-panel").hide();
						$("#tabletPanel").show("slide",{direction:"left"},500);
						window.location.hash = "#!/"+window.langOpt;	
					}
				});
				$("a.tablet-tab").unbind().click(function() {
						var innerSelf = this;
						if($(innerSelf).attr("name") == "play") {
							request.getTemplate("templates/play.html", self.lang);
						}

						window.location.hash = "#!/"+window.langOpt + "/"+$(this).attr("name");		

						$("#tabletPanel").hide("slide",{direction : "left"}, 500);
						if($("#mid-panel").hasClass("forceDisplayNone")) {
							$("#mid-panel").removeClass("forceDisplayNone");	
						}
						window.setTimeout(function() {
							$(".tablet-back-btn").fadeIn();
						},400);
				});
				$("a.tablet-login").unbind().click(function() {
					if($(".tablet-login-wrapper").html().trim() == "") {
						hitTest();
						$(".tablet-login-wrapper").html($("#login-box").html());
						$("#login-box").html("");
						$(".tablet-login-wrapper").append(
						"<div class='tablet-login-cancel'>"+
							"<a class='btn btn-danger' href='javascript:void(0);'>Cancel</a>"+
						"</div>");
						$(".tablet-login-bg").fadeIn();
						$(".tablet-login-wrapper").fadeIn();
						$(".tablet-login-bg").css({
							height : $(document).height(),
							width : $(document).width()
						});
						$(".tablet-login-cancel").unbind().unbind().click(function() {
							$(".tablet-login-wrapper").hide();
							$(".tablet-login-bg").hide();
						});	
					} else {
						$(".tablet-login-bg").fadeIn();
						$(".tablet-login-wrapper").fadeIn();
					}	
				});
			},
		});
		return navBar;
	});
})();
