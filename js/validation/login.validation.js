(function() {
	$(document).ready(function() {
		//hide logout on default
		$("#logout").hide();
                      
        //check cookie
        if($.cookie.read("username")) {
            $(".login-btn").unbind("click");
            var username = $.cookie.read("username");
            var fullname = $.cookie.read("fullname");
            var provider = $.cookie.read("loginmode");
            var c_logid = $.cookie.read("logid");
            if (provider=="Classic") {
                $("#login-tag").html("You are logged as "+username);
            } else {
                $.get("http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider+"&restart=False",function(data){
                    var userinfo = eval ("(" + data + ")");
                    if (userinfo.identifier) {
                        // complete infos stored in cookie
                        var net_logid = userinfo.identifier;
                        var email = userinfo.email;
                        if (c_logid==net_logid) {
                            $("#login-tag").html("You are logged as "+fullname);
                        } else {
                            //bootbox.alert("Data conflict. Please, login again.");
                            $.cookie.delete("username");
                            $.cookie.delete("fullname");
                            $.cookie.delete("loginmode");
                            $.cookie.delete("logid");
                            $("#logout").hide();
                            window.guest = 'guest';
                            $("#login-box").hide();
                            $(".login-btn").click(function() { eClick(); });
                            $("#login-tag").html("Login");
                            $(".showInLogin").hide();
                            return;
                        }
                    } else {
                        // failed to connect
                        $("div.login-warning").show().html(provider + " connection failed. Please, check that you are already connected to " + provider + ".");
                        return;
                    }
                });
            }
            $("#logout").show();
            window.guest = username;
            $("#login-box").hide();
            $(".login-btn").unbind("click");
            $(".showInLogin").show();
        };

		// Classic login onclick event
		var classicLogin = function() {
			var name = $("#username").val().trim();
			var password = $("#password").val().trim();
			if((name == "" || password == "")) { 
				$("div.login-warning").show().html("Username or Password is missing");
				return;
			} 

			$("div.login-warning").hide();

			$.protocal.login(name, password, function(re) {
				if(re == "succ") {	
					$("#login-tag").html("You are logged as "+name);
					$.cookie.create("username",name,365);
                    $.cookie.create("fullname",name,365);
                    $.cookie.create("loginmode","Classic",365);
                    $.cookie.create("logid",-1,365);
                    $("#logout").show();
                    window.guest = name;
                    $("#login-box").hide();
                    $(".login-btn").unbind("click");
                    $(".showInLogin").show();
				} else {
					$("div.login-warning").show().html("Incorrect Username or Password");
				}			
			});
		};
        // Facebook login onclick event
        var socialLogin = function(provider) {
                      
            start_url = "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider="+provider+"&restart=True";
            win = window.open(
                start_url,
                "hybridauth_social_signin",
                "location=0,status=0,scrollbars=0,width=800,height=500"
            );
            return;
            $.get("http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider,function(data){
            var userinfo = eval ("(" + data + ")");
            if (userinfo.identifier) {
                  // connected
                  var username = provider + "_" + userinfo.identifier;
                  var fullname = userinfo.displayName;
                  var loginmode = provider;
                  var logid = userinfo.identifier;
                  var email = userinfo.email;
                  $.ajax({
                    type: "POST",
                    url : "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                    data : "username="+username+"&id="+logid,
                  }).done(function(mypasswd) {
                    var password = mypasswd;
                    $.protocal.login(username, password, function(re) {
                        if(re == "succ") {
                            console.log("login successful.");
                            $("#login-tag").html("You are logged as "+fullname);
                            $.cookie.create("username",username,365);
                            $.cookie.create("fullname",username,365);
                            $.cookie.create("loginmode",loginmode,365);
                            $.cookie.create("logid",logid,365);
                            $("#logout").show();
                            window.guest = username;
                            $("#login-box").hide();
                            $(".login-btn").unbind("click");
                            $(".showInLogin").show();
                        } else {
                            // login not successful -> register users
                            if((username == "" || password == "") || email == "") {
                                $("div.login-warning").show().html("Missing data. Please, check your " + provider + " account.");
                                    return;
                            }
                            $.protocal.register(username, password, email, loginmode,logid, function(re) {
                                if(re == "succ") {
                                    console.log(provider + " registration successful. username: "+username);
                                    $("#login-tag").html("You are logged as "+fullname);
                                    $.cookie.create("username",username,365);
                                    $.cookie.create("fullname",fullname,365);
                                    $.cookie.create("loginmode",loginmode,365);
                                    $.cookie.create("logid",logid,365);
                                    $("#logout").show();
                                    window.guest = username;
                                    $("#login-box").hide();
                                    $(".login-btn").unbind("click");
                                    $(".showInLogin").show();
                                    // TODO: Post on FB wall
                                } else {
                                    console.log(provider + " registration failed.");
                                    $("div.login-warning").show().html("We are sorry. We cannot register you using your " + provider + " account.");
                                }
                            });
                        }
                    });
                }).fail(function() {
                    $("div.login-warning").show().html("Could not connect to the server. Please try again later.");
                });
            } else {
                // not_authorized
                $("div.login-warning").show().html(provider + " connection failed. Please, check that you are already connected to " + provider + ".");
            }
        });
        };
                      
		//login click event
		$(".login-btn").click(function() {
			classicLogin();
		});
        $(".zocial.facebook").click(function() {
            socialLogin('Facebook');
        });
        $(".zocial.twitter").click(function() {
            socialLogin('Twitter');
        });
        $(".zocial.google").click(function() {
            socialLogin('Google');
        });
        $(".zocial.linkedin").click(function() {
            socialLogin('LinkedIn');
        });
                      
		//logout event
		$("#logout").click(function() {
			window.guest = "Guest";
			$.cookie.delete("username");
            $.cookie.delete("fullname");
            $.cookie.delete("loginmode");
            $.cookie.delete("logid");
            $("#logout").hide();
            window.guest = 'guest';
            $("#login-box").hide();
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
				$.protocal.register(name, password, email,'Classic',0, function(re) {
					if(re == "succ") {
						$(".login-btn").unbind("click");	
						$("#login-tag").html("You are logged as "+name);
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
