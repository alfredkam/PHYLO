(function() {
	$.hashbang = {
		load : function(page) {

		},			
		get : function() {
			return window.location.hash.replace(/^#!/,"");
		}
	};

	
	$(window).bind('hashchange', function() {
			$.hashbang.load($.hashbang.get());	
	});
	
	$("a").click(function() {
		if($(this).attr("href") == "javascript:void(0);") {
			window.location.hash = "#!"+$(this).attr("id");		
		}
	});

})();
