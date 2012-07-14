(function() {
	$(document).ready(function() {
		$(".login-btn").click(function() {
			var name = $("#username").val().trim();
			var password = $("#password").val().trim();
			if((name == "" || password == "")) { 
				$("div.login-warning").show().html("Username or Password is missing");
				return;
			} 

			$("div.login-warning").hide();

			$.ajax({
				url : "../phpdb/phyloDB2.php",
				data: "mode=7&user"+name+"&pass"+password, 
				type : "POST",
			}).done(function(re) {
				if(re == "succ") {

				} else {
					//login failed
				}
			}).fail(function() {
				$("div.login-warning").show().html("Could not connect to server, please try again later");
			});
		});	

		$(".register-btn").click(function() {
			if($(".cancel-btn").css("display") == "none") {
				$(".login-warning").hide();
				$(".email-holder").show();
				$(".register-btn").removeClass("register-btn-shift");
				$(".login-btn").hide();
				$(".cancel-btn").show();
			} else {
				
			}	
		});
		$(".cancel-btn").click(function() {
			$(".email-holder").hide();
			$(".register-btn").addClass("register-btn-shift");
			$(".login-btn").show();
			$(this).hide();
		});
	});
})();
