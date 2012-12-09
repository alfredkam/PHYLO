(function() {
	//loads this script if its tablet
	require( ['jquery'],
	function($) {
		$("#tablet-login-template").css({
			width : $(document).width()
		});

		var content = $("#login-box").html();
		$("#login-box").html("");
		$("#tablet-login-box").html(content+"<br><br><div><a class='m_cancel btn btn-danger'>Cancel</a></div>");

		$("#tablet-login-tag").click(function() {
			if(window.guest == "guest") {
				$("#tablet-login-box-bg").css({
					height: $(document).height(),
					width : $(document).width()
				}).show();
				$("#tablet-login-box").show();
			} else {
				$("#tablet-logout-tag").toggle();
			}
		});
		$("#tablet-logout-tag").click(function() {
			$(this).hide();
		});

		$("#tablet-login-box .m_cancel").click(function() {
			$("#tablet-login-box-bg").hide();
			$("#tablet-login-box").hide();
		});
	});
})();
