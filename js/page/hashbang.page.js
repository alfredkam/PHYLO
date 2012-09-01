(function() {
	//loads the page
	$.hashbang = {
		load : function(page) {
			var self = this;
			page = page.replace(/#/,"");
			if(page == "" ^  page.search(/^play/) >= 0) {
				this.selectTab("play");
				$.lang.init(function() {
					$.page.play();
				});
			} else if(page == "tutorial") {
				this.selectTab(page);
				$.lang.init(function() {
					$.page.tutorial();
				});
			} else if(page == "about") {
				this.selectTab(page);
				$.lang.init(function() {
					$.page.about();
				});
			} else if(page == "credits") {
				this.selectTab(page);
				$.lang.init(function() {
					$.page.credits();
				});
			} else if(page == "ranking") {
				this.selectTab(page);
				$.lang.init(function() {
					$.page.ranking();
				});
			} else if(page == "history") {
				this.selectTab(page);
				$.lang.init(function() {
					$.page.history();
				});
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
	$("a").click(function() {
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

})();
