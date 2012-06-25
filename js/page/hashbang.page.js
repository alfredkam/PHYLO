(function() {
	$.hashbang = {
		load : function(page) {
			if(page == "" ^ page == "play") {
				this.selectTab("play");
				$.page.play();
			} else if(page == "tutorial") {
				this.selectTab(page);
			} else if(page == "about") {
				this.selectTab(page);
			} else if(page == "credits") {
				this.selectTab(page);
			}
		},			
		get : function() {
			return window.location.hash.replace(/^#!/,"");
		},
		selectTab : function(id) {
			$("#nav a div").removeClass("onSelect");
			$("#"+id +" div").addClass("onSelect");
		},
	};

	$.hashbang.load($.hashbang.get());

	
	$(window).bind('hashchange', function() {
			$.hashbang.load($.hashbang.get());	
	});
	
	$("a").click(function() {
		if($(this).attr("href") == "javascript:void(0);") {
			window.location.hash = "#!"+$(this).attr("id");		
		}
	});

})();
