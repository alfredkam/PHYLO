(function() {
	$.hashbang = {
		load : function(page) {
			page = page.replace(/#/,"");
			if(page == "" ^ page == "play") {
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
			}
		},			
		get : function() {
			return window.location.hash.replace(/^#!/,"");
		},
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

	$(document).ready(function() {
		$.hashbang.load($.hashbang.get());
	});

	
	$(window).bind('hashchange', function() {
			$.hashbang.load($.hashbang.get());	
			$.tailor.init();
	});
	
	$("a").click(function() {
		if($(this).attr("href") == "javascript:void(0);") {
			var innerSelf = this;
			if($.timer.active == true) {
				$.helper.popUp("Are you sure you want to quite?",function(status) {
					if(status == "ok") {
						window.location.hash = "#!"+$(innerSelf).attr("id");		
						$.timer.stop();
					}
				});			
			} else {
				window.location.hash = "#!"+$(this).attr("id");		
			}
		} else {
			window.location.href = $(this).attr("href");
		}
	});

})();
