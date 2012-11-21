(function() {
	define([
		'jquery',
		'underscore',
		'backbone',
	], function($, _, Backbone) {
		var navBar = Backbone.View.extend({
			init : function() {
				//menu hyperlink listener
				$("a.isTab").click(function() {
					if($(this).attr("href") == "javascript:void(0);") {
						var innerSelf = this;
						if($.timer.active == true) {
							$.helper.popUp("Are you sure you want to quite?",function(status) {
								if(status == "ok") {
									window.location.hash = "#!/"+window.langOpt+"/"+$(innerSelf).attr("id");		
									$.timer.stop();
									//force change
									if($(innerSelf).attr("id") == "play") {
										$.hashbang.load($.hashbang.get());	
										$.tailor.init();
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
				$("a.tablet-back-btn").click(function() {
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
							}
						});			
					} else {
						$(this).hide();
						$("#mid-panel").hide();
						$("#tabletPanel").show("slide",{direction:"left"},500);
					}
				});
				$("a.tablet-tab").click(function() {
						var innerSelf = this;
						if($(innerSelf).attr("name") == "play") {
							$.hashbang.load($.hashbang.get());	
							$.tailor.init();
						}
						if(window.location.hash.match("#!"+$(this).attr("name")) != null) {
							$.hashbang.load($(this).attr("name"));
						} else {
							window.location.hash = "#!"+$(this).attr("name");		
						}
						$("#tabletPanel").hide("slide",{direction : "left"}, 500);
						if($("#mid-panel").hasClass("forceDisplayNone")) {
							$("#mid-panel").removeClass("forceDisplayNone");	
						}
						window.setTimeout(function() {
						$(".tablet-back-btn").fadeIn();
						},400);
				});
				$("a.tablet-login").click(function() {
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
						$(".tablet-login-cancel").unbind().click(function() {
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
