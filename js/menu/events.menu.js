(function(){
	//event listners for the menu	
	$(document).ready(function() {
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
			$("#login").removeClass("login-OnSelect");
		});
	
		$("#options-button").click(function(event) {
			event.stopPropagation();
			$(this).addClass("dropDown-OnSelect");
			$(".dropDownTriangle").show();
			$("#option-list").show();

			$("#login-box").hide();
			$("#login").removeClass("login-OnSelect");
		});
		
		$("#language").mouseover(function(event) {
			event.stopPropagation();
			$("#language-list").show();
			$(this).addClass("dropDown-OptionOnSelect");
		});

		$("#language").click(function(event) {
			event.stopPropagation();
			$("#language-list").show();
			$(this).addClass("dropDown-OptionOnSelect");
		});
		
		$("#login").click(function(event) {
			event.stopPropagation();
			if($(this).html().search(/Welcome/) > -1) {
	
			} else {
				$("#login-box").show();
				$("#login-box").css("display","inline-block");
				$(this).addClass("login-OnSelect");
				$("#option-list").hide();
				$("#options-button .dropDownTriangle").hide();
				$("#options-button").removeClass("dropDown-OnSelect");
				
				$("#language-list").hide();
				$("#language").removeClass("dropDown-OptionOnSelect");
				$(".dropDownTriangle").hide();
			}

		});
		$("#login-box").click(function(event){
				event.stopPropagation();
		});
		
		$("#logout").mouseover(function() {
			$("#language-list").hide();
			$("#language").removeClass("dropDown-OptionOnSelect");
			$(".dropDownTriangle").hide();
		});
		$("#customize").mouseover(function() {
			$("#language-list").hide();
			$("#language").removeClass("dropDown-OptionOnSelect");
			$(".dropDownTriangle").hide();
		});
		

	});
})();
