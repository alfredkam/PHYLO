(function() {
	$("#tabletPanel a").click(function() {
		$("#tabletPanel").hide("slide",{direction : "left"}, 500);

		if($("#mid-panel").hasClass("forceDisplayNone")) {
			$("#mid-panel").hide();
			$("#mid-panel").removeClass("forceDisplayNone");	
			
		}
		window.setTimeout(function() {
		$(".tablet-back-btn").fadeIn();
	//		$("#mid-panel").fadeIn();
		},500);
	});

	$(".tablet-back-btn").click(function() {
		$(this).hide();
		$("#mid-panel").hide();
		$("#tabletPanel").show("slide",{direction:"left"},500);
	});
})();
