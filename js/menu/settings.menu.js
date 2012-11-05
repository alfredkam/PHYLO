(function() {
	$.menu = {
		disableMenu : function() {
				$("#draw").hide();
				$("#menu").hide();
				$.main.init({
					type: "random",
					num: 3,		
				});	
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

