(function() {
	$(document).ready(function() {
		//hide logout on default
		$("#logout").hide();

        // init page: check cookie and register user if login using social account for the first time 
        if($.cookie.read("username")) {
            $(".login-btn").unbind("click");
            var username = $.cookie.read("username");
            var fullname = $.cookie.read("fullname");
            var provider = $.cookie.read("loginmode");
            var c_logid = $.cookie.read("logid");
            if (provider=="Classic") {
                $("#login-tag").html(username);
            } else {
                $.get("http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider + "&restart=0",function(data){
                    var userinfo = eval ("(" + data + ")");
                    if (userinfo.identifier) {
                        // complete infos stored in cookie
                        var net_logid = userinfo.identifier;
                        var email = userinfo.email;
                        if (c_logid==net_logid) {
                            // check is user exists
                            $.ajax({
                                   type: "POST",
                                   url : "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                                   data : "username="+username+"&id="+c_logid,
                             }).done(function(mypasswd) {
                                var password = mypasswd;
                                // a bit heavy. a simple table entry check would be enough.
                                $.protocal.login(username, password, function(re) {
                                    if(re != "succ") {
                                        // login not successful -> register users
                                        if((username == "" || password == "") || email == "") {
                                            $("div.login-warning").show().html("Missing data. Please, check your " + provider + " account.");
                                            return;
                                        }
                                        $.protocal.register(username,password,email,provider,c_logid, function(re2) {
                                            if(re2 == "succ") {
                                                console.log(provider + " registration successful. username: "+username);
                                                // Update status
                                                var message = fullname.replace("+"," ") + " started to play Phylo.\nPhylo is a puzzle game in which every puzzle completed contributes to mapping diseases within human DNA. Have fun and help genetic research!";
                                                var caption = "DNA puzzles";
                                                var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
                                                bootbox.confirm("You are now registered. Please, help us to share the word and announce to your friend you novel contribution to science!\nPhylo will not store any personal data beside your username and email. You will have the opportunity to post your achievements if you request it.","Skip","Post", function(result) {
                                                    if (result) {
                                                        $.ajax({
                                                            type: "POST",
                                                            url : "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
                                                            data : data,
                                                        }).done(function(re) {
                                                            //bootbox.alert("Thank you for sharing the word. You can now start to play!");
                                                        }).fail(function() {
                                                            bootbox.alert("We are sorry. We have not been able to update your status. However, you can still start to play!");
                                                        });
                                                    }
                                                });
                                            } else {
                                                console.log(provider + " registration failed.");
                                                $("div.login-warning").show().html("We are sorry. We cannot register you using your " + provider + " account.");
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
                                        });
                                    }
                                });
                            }).fail(function() {
                                $("div.login-warning").show().html("Could not connect to the server. Please try again later.");
                            });
                            // display login
                            $("#login-tag").html(fullname.replace("+"," "));
                            window.guest=username;
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
            // show buttons. NB: hide expert button if necessary
            $.ajax({
                type: "POST",
                url : "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
                data : "mode=8&user="+username,
            }).done(function(re) {
                if (re!='succ') {
                    $(".showExpertOptions").hide();
                }
            }).fail(function() {
                console.log("Expert validation failed. Could not connect to the server.");
            });
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
					$("#login-tag").html(name);
					$.cookie.create("username",name,365);
                    $.cookie.create("fullname",name,365);
                    $.cookie.create("loginmode","Classic",365);
                    $.cookie.create("logid",-1,365);
                    $("#logout").show();
                    window.guest = name;
                    $("#login-box").hide();
                    $(".login-btn").unbind("click");
                    $(".showInLogin").show();
                    // show buttons. NB: hide expert button if necessary
                    $.ajax({
                        type: "POST",
                        url : "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
                        data : "mode=8&user="+username,
                    }).done(function(re) {
                        if (re!='succ') {
                            $(".showExpertOptions").hide();
                        }
                    }).fail(function() {
                        console.log("Expert validation failed. Could not connect to the server.");
                    });
				} else {
					$("div.login-warning").show().html("Incorrect Username or Password");
				}			
			});
		};
        // Social login onclick event
        var socialLogin = function(provider) {
            start_url = "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider="+provider+"&restart=1";
            win = window.open(
                start_url,
                "hybridauth_social_signin",
                "location=0,status=0,scrollbars=0,width=800,height=500"
            );
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
						$("#login-tag").html(name);
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
