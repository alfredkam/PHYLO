(function() {
	$(document).ready(function() {
		//hide logout on default
		$("#logout").hide();

		//check if have cookie
		if($.cookie.read("username")) {
			$(".login-btn").unbind("click");	
			var name = $.cookie.read("username");
			$("#login-tag").html("Welcome back "+name);
			$("#logout").show();
			window.guest = name;
			$(".showInLogin").show();
			$("#login-box").hide();
			$.cookie.create("username",name,365);
		}

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
					$.cookie.create("username",name,365);
					$("#login-box").hide();
				} else {
					$("div.login-warning").show().html("Incorrect Username or Password");
				}			
			});
		};
        var fbClick = function() {
            FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        // connected                                                                                                                              
                        FB.api('/me', function(response) {
                                var fullname = response.name;
                                var name = response.username + "_fb_" + response.id;
                                var loginmode = "fb";
                                $.ajax({
                                        type: "POST",
                                        url : "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                                        data : "username="+response.username+"&id="+response.id,
                                      }).done(function(mypasswd) {
                                              var password = mypasswd;
                                              $.protocal.login(name, password, function(re) {
                                                if(re == "succ") {
                                                  //$(".login-btn").unbind("click");
                                                  //alert("Welcome back "+fullname);
                                                  $("#login-tag").html("You are logged as "+fullname);
                                                  $(".showlogin").hide();
                                                  $(".showlogout").show();
                                                  window.guest = name;
                                                  $(".showInLogin").show();
                                                  $.cookie.create("username",name,"fb",365);
                                                } else {
                                                  // login not successful -> register users
                                                  if((name == "" || password == "") || email == "") {
                                                    $("div.login-warning").show().html("Email or Username or Password is missing");
                                                    return;
                                                  }
                                                  $.protocal.register(name, password, email, function(re) {
                                                    if(re == "succ") {
                                                        $(".login-btn").unbind("click");
                                                        $("#login-tag").html("Welcome back "+fullname);
                                                        $("#logout").show();
                                                        window.guest = name;
                                                        $("#login-box").hide();
                                                    } else {
                                                        $("div.login-warning").show().html("This username already exist");
                                                    }
                                                  });
                                                }
                                            });
                                          }).fail(function() {
                                                  $("div.login-warning").show().html("Could not connect to the server. Please try again later.");
                                              });
                            });
                      } else if (response.status === 'not_authorized') {
                        // not_authorized                                                                                                                         
                        $("div.login-warning").show().html("Phylo has not been authorized by Facebook yet. Please, confirm.");
                    } else {
                        // not_logged_in                                                                                                                          
                        $("div.login-warning").show().html("You must login to Facebook before login to Phylo.");
                    }
                });
        };
		//login click event
		$(".login-btn").click(function() {
			eClick();
		});
        $(".my-fb-login-button").click(function() {
            fbClick();
        });
		//logout event
		$("#logout").click(function() {
			window.guest = "Guest";
			$.cookie.delete("username");
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
						$("#login-box").hide();
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
