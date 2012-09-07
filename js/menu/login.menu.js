(function() {
	$(document).ready(function() {
		//hide logout on default
		$("#logout").hide();
		//login onclick event
		var eClick = function() {
			var name = $("#username").val().trim();
			var password = $("#password").val().trim();
			if((name == "" || password == "")) { 
				$("div.login-warning").show().html("Username or Password is missing");
				return;
			} 

			$("div.login-warning").hide();

			$.protocal.login(name, password, function(re) {
				if(re == "succ") {
					$(".login-btn").unbind("click");	
					$("#login-tag").html("Welcome back "+name);
					$("#logout").show();
					window.guest = name;
					$(".showInLogin").show();
				} else {
					$("div.login-warning").show().html("Incorrect Username or Password");
				}			
			});
		};
		//login click event
		$(".login-btn").click(function() {
			eClick();
		});	
		//logout event
		$("#logout").click(function() {
			window.guest = "Guest";
			$("#logout").hide();
			$(".login-btn").click(function() { 
				eClick();
			});
			$("#login-tag").html("Login");
			$(".showInLogin").hide();
		});

		//register event
		$(".register-btn").click(function() {
			if($(".cancel-btn").css("display") == "none") {
				$(".login-warning").hide();
				$(".email-holder").show();
				$(".register-btn").removeClass("register-btn-shift");
				$(".login-btn").hide();
				$(".cancel-btn").show();
			} else {
				var name = $("#username").val().trim();
				var password = $("#password").val().trim();
				var email = $("#email").val().trim();
				if((name == "" || password == "") || email == "") { 
					$("div.login-warning").show().html("Email or Username or Password is missing");
					return;
				} 
				$.protocal.register(name, password, email, function(re) {
					if(re == "succ") {
						$(".login-btn").unbind("click");	
						$("#login-tag").html("Welcome back "+name);
						$("#logout").show();
						window.guest = name;
					} else {
						$("div.login-warning").show().html("This username already exist");
					}
				});
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
