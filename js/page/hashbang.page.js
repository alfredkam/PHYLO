(function() {
	//loads the page
	$.hashbang = {
		panelNotReady : function() {
			$("#mid-panel").hide();
			$("#loading-panel").show();
		},
		panelReady : function() {
			$("#mid-panel").fadeIn();
			$("#loading-panel").hide();
		},
		load : function(page) {
			var self = this;
			page = page.replace(/#/,"");
			self.panelNotReady();	
			if(page == "" ^  page.search(/^play/) >= 0) {
				self.selectTab("play");
				$.lang.init(function() {
					$.page.play();
					self.panelReady();
				});
			} else if(page == "tutorial") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.tutorial();
					self.panelReady();
				});
			} else if(page == "about") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.about();
					self.panelReady();
				});
			} else if(page == "credits") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.credits();
					self.panelReady();
				});
			} else if(page == "ranking") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.ranking();
				});
			} else if(page == "history") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.history();
				});
			} else if(page == "expert") {
				window.location = "http://phylo.cs.mcgill.ca/dcanv";
			} else if(page == "rna") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.rna();
					self.panelReady();
				});
			} else if(page == "tablet:settings") {
				self.selectTab(page);
				$.lang.init(function() {
					$.page.settings();
					self.panelReady();
				});
			} else if(page == "back") {
				$("#loading-panel").hide();
			}
		},			
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
		//select tab
		selectTab : function(tag) {
			$("#nav a div").removeClass("onSelect");
			$("#"+tag +" div").addClass("onSelect");

			//edit language href to selected tab
			$(".language-list a").each(function() {
				var href = $(this).attr("href").replace(/#!.*$/,"");
				$(this).attr("href",href+"#!"+tag);
			});
		},
	};

	//when document is ready gets initial hashtag
	/*
	$(document).ready(function() {
		$.hashbang.load($.hashbang.get());
	}); */

	//initiate hashchange listener	
	$(window).bind('hashchange', function() {
			$.hashbang.load($.hashbang.get());	
			$.tailor.init();
	});
	
	//menu hyperlink listener
	$("a.isTab").click(function() {
		if($(this).attr("href") == "javascript:void(0);") {
			var innerSelf = this;
			if($.timer.active == true) {
				$.helper.popUp("Are you sure you want to quite?",function(status) {
					if(status == "ok") {
						window.location.hash = "#!"+$(innerSelf).attr("id");		
						$.timer.stop();
						//force change
						if($(innerSelf).attr("id") == "play") {
							$.hashbang.load($.hashbang.get());	
							$.tailor.init();
						}
					}
				});			
			} else {
				window.location.hash = "#!"+$(this).attr("id");		
				if($(innerSelf).attr("id") == "play") {
					$.hashbang.load($.hashbang.get());	
					$.tailor.init();
				}
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

})();
