(function(){
	
	$(document).ready(function() {
		$(".dropDownTriangle").hide();
		$("#option-list").hide();
		$("#language-list").hide();
		$("#login-box").hide();

		window.setTimeout(function() {
			$("#dropDown-logoTriangle").hide();
			$("#dropDown-logo").hide();
		},100);

	$("html").click(function() {
		$("#option-list").hide();
		$("#options-button .dropDownTriangle").hide();
		$("#options-button").removeClass("dropDown-OnSelect");
		
		$("#language-list").hide();
		$("#language").removeClass("dropDown-OptionOnSelect");
		$(".dropDownTriangle").hide();

		$("#dropDown-logoTriangle").hide();
		$("#dropDown-logo").hide();
		$("#logo").removeClass("logo-OnSelect");

		$("#login-box").hide();
		$(this).removeClass("login-OnSelect");
	});
	
	$("#options-button").click(function(event) {
		event.stopPropagation();
		$(this).addClass("dropDown-OnSelect");
		$(".dropDownTriangle").show();
		$("#option-list").show();
	});
	
	$("#language").mouseover(function() {
		$("#language-list").show();
		$(this).addClass("dropDown-OptionOnSelect");
	});

	$("#logo").mouseover(function(event) {
		event.stopPropagation();
		$("#dropDown-logoTriangle").show();
		$("#dropDown-logo").show();
		$(this).addClass("logo-OnSelect");
	});

	$("#login").click(function() {
		$("#login-box").show();
		$("#login-box").css("display","inline-block");
		$(this).addClass("login-OnSelect");

	});
	

	});
})();
