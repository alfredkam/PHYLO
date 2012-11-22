(function() {
	$.menu = {
		disableMenu : function() {
				$("#draw").hide();
				$("#menu").hide();
				if(window.location.hash.match(/rna/i) != null) {
				//	$.rna.init();
				} else {
					$.main.init({
						type: "random",
						num: 3,		
					});	
				}
		},
	};
	$(document).ready(function() {
		if(window.DEV.disableMenu) {
			window.setTimeout(function() {
				$.menu.disableMenu();
			},500);
		}
	});
})();

