(function() {

	$("#customize").click(function(event) {
		event.stopPropagation();
		
		$(".customize").show();
		$(".customize-bg").css({
			width: document.width,
			height: document.height
		});
	});

	$(".customize-cancel").click(function() {
		$(".customize").hide();
	});

})();
