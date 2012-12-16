(function() {
	var str =  navigator.userAgent.toString().toLowerCase();
	if(str.search(/msie (8.0|7.0|6.0|5.0)/) > -1) {
	//	console.log("IE");
		$(".warning-cancel").hide();
		$(".warning-ok").hide();
	
		$(".warning-msg").html("<i class='icon-remove'></i><br><b>Aww Snap!</b><br> We currently do not support IE 8 and below.<br>  Please either upgrade your browser to IE9 or above,  or use an alternate browser like chrome or firefox.<br>If not please <a href='http://phylo.cs.mcgill.ca/archive/flash/eng/'>click here</a> for flash");

		$(".warning-bg").css({
			height: $(document).height(),
			width: $(document).width(),
		});
		$(".warning-bg").fadeIn();
		$(".warning").fadeIn();
		$(".warning-msg a").click(function() {
			window.location = $(this).attr("href");
		});
	}
})();
