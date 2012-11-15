(function() {
	var str =  navigator.userAgent.toString().toLowerCase();
	if(str.search(/msie (8.0|7.0|6.0|5.0)/) > -1) {
	//	console.log("IE");
		$(".warning-cancel").hide();
		$(".warning-ok").hide();
	
		$(".warning-msg").html("Oops! Currently we do not support IE 8 and below.<br>  Please either upgrade your browser or use an alternate.<br>If not please click here for flash");
		

		$(".warning-bg").css({
			height: $(document).height(),
			width: $(document).width(),
		});
		$(".warning-bg").fadeIn();
		$(".warning").fadeIn();
	}
})();
