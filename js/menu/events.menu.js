(function(){
	
	$(".dropDownTriangle").hide();
	$("#option-list").hide();
	$("#language-list").hide();

	$("html").click(function() {
		$("#option-list").hide();
		$("#options-button .dropDownTriangle").hide();
		$("#options-button").removeClass("dropDown-OnSelect");
		
		$("#language-list").hide();
		$("#language").removeClass("dropDown-OnSelect");
		$(".dropDownTriangle").hide();
	});
	
	$("#options-button").click(function(event) {
		event.stopPropagation();
		$(this).addClass("dropDown-OnSelect");
		$(".dropDownTriangle").show();
		$("#option-list").show();
	});
	
	$("#language").mouseover(function() {
		$("#language-list").show();
		$(this).addClass("dropDown-OnSelect");
	});

})();
