(function() {
	$(document).ready(function() {
		//hide logout on default
		$("#logout").hide();
                      
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '254079141380941', // App ID
                channelUrl : '//phylo.cs.mcgill.ca/channel.html', // Channel File
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true  // parse XFBML
            });
            //check cookie
            if($.cookie.read("username")) {
                $(".login-btn").unbind("click");
                var name = $.cookie.read("username");
                var mode = $.cookie.read("loginmode");
                var c_logid = $.cookie.read("logid");
                if (mode=="classic") {
                    $("#login-tag").html("You are logged as "+name);
                } else if (mode=="facebook") {
                    // FB login. Must check account and cookie data match and then extract full name.
                    FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        // connected: we must check that account are the same
                        FB.api('/me', function(response) {
                            var fullname = response.name;
                            var fb_logid = response.id;
                            if (c_logid==fb_logid) {
                                $("#login-tag").html("You are logged as "+fullname);
                            } else {
                               //bootbox.alert("Data conflict. Please, login again.");
                               $.cookie.delete("username");
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
                               return;
                            }
                        });
                    } else if (response.status === 'not_authorized') {
                        // not_authorized
                        $("div.login-warning").show().html("Phylo has not been authorized to connect with your Facebook account. Please, confirm.");
                        return;
                    } else {
                        // not_logged_in
                        $("div.login-warning").show().html("You are not logged in Facebook. Please, sign-in to Facebook and re-connect to Phylo.");
                        return;
                    }
                    });
                } else {
                    console.log("Cannot find login mode");
                    return;
                }
                $("#logout").show();
                window.guest = name;
                $("#login-box").hide();
                $(".login-btn").unbind("click");
                $(".showInLogin").show();
            };
        };

		// Classic login onclick event
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
					$("#login-tag").html("You are logged as "+name);
					$.cookie.create("username",name,365);
                    $.cookie.create("loginmode","classic",365);
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
        var fbClick = function() {
            FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        // connected                                                                                                                              
                        FB.api('/me', function(response) {
                                var fullname = response.name;
                                var name = response.username + "_fb_" + response.id;
                                var loginmode = "facebook";
                                var logid = response.id;
                                var email = response.id + "@facebook.com";
                                $.ajax({
                                        type: "POST",
                                        url : "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                                        data : "username="+response.username+"&id="+response.id,
                                      }).done(function(mypasswd) {
                                              var password = mypasswd;
                                              $.protocal.login(name, password, function(re) {
                                                if(re == "succ") {
                                                    console.log("login successful.");
                                                    $("#login-tag").html("You are logged as "+fullname);
                                                    $.cookie.create("username",name,365);
                                                    $.cookie.create("loginmode",loginmode,365);
                                                    $.cookie.create("logid",logid,365);
                                                    $("#logout").show();
                                                    window.guest = name;
                                                    $("#login-box").hide();
                                                    $(".login-btn").unbind("click");
                                                    $(".showInLogin").show();
                                                } else {
                                                    // login not successful -> register users
                                                    if((name == "" || password == "") || email == "") {
                                                        $("div.login-warning").show().html("Email or Username or Password is missing");
                                                        return;
                                                    }
                                                    $.protocal.register(name, password, email, loginmode,logid, function(re) {
                                                        if(re == "succ") {
                                                            console.log("FB registration successful. username:"+name);
                                                            $("#login-tag").html("You are logged as "+fullname);
                                                            $.cookie.create("username",name,365);
                                                            $.cookie.create("loginmode",loginmode,365);
                                                            $.cookie.create("logid",logid,365);
                                                            $("#logout").show();
                                                            window.guest = name;
                                                            $("#login-box").hide();
                                                            $(".login-btn").unbind("click");
                                                            $(".showInLogin").show();
                                                            // Post on FB wall
                                                            var publish = {
                                                            method: 'feed',
                                                            message: 'started to play Phylo.',
                                                            name: 'Phylo',
                                                            caption: 'Play your DNA.',
                                                            description: (
                                                                          'A challenging flash game in which every puzzle completed' +
                                                                          'contributes to mapping diseases within human DNA.'
                                                                          ),
                                                            link: 'http://phylo.cs.mcgill.ca/',
                                                            picture: 'http://phylo.cs.mcgill.ca/images/minilogo.png',
                                                            actions: [
                                                                      { name: 'phylo', link: 'http://phylo.cs.mcgill.ca' }
                                                                      ],
                                                            };
                                                            
                                                            FB.ui(publish);
                                                                        
                                                        } else {
                                                            console.log("FB registration failed.");
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
        // share highscore event
        var shareClick = function() {
            //check cookie
            if($.cookie.read("username")) {
                $(".login-btn").unbind("click");
                var name = $.cookie.read("username");
                var mode = $.cookie.read("loginmode");
                var c_logid = $.cookie.read("logid");
                if (mode=="facebook") {
                    // FB login. Must check account and cookie data match and then extract full name.
                    FB.getLoginStatus(function(response) {
                        if (response.status === 'connected') {
                        // connected: we must check that account are the same
                            FB.api('/me', function(response) {
                                var fullname = response.name;
                                var fb_logid = response.id;
                                if (c_logid==fb_logid) {
                                   // Post on FB wall
                                   var publish = {
                                   method: 'feed',
                                   message: 'has improved a DNA alignment related to . Play Phylo and help genetic research too!',
                                   name: 'Phylo',
                                   caption: 'Play your DNA.',
                                   description: (
                                                 'A challenging flash game in which every puzzle completed' +
                                                 'contributes to mapping diseases within human DNA.'
                                                 ),
                                   link: 'http://phylo.cs.mcgill.ca/',
                                   picture: 'http://phylo.cs.mcgill.ca/images/minilogo.png',
                                   actions: [
                                             { name: 'phylo', link: 'http://phylo.cs.mcgill.ca' }
                                             ],
                                   };
                                   
                                   FB.ui(publish);
                                   
                                } else {
                                    alert("You seem to have been disconnected from your Facebook account. Please, login again.");
                                    $.cookie.delete("username");
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
                                    return;
                                }
                            });
                        } else if (response.status === 'not_authorized') {
                            // not_authorized
                            alert("Phylo has not been authorized to connect with your Facebook account. Please, confirm.");
                            return;
                        } else {
                            // not_logged_in
                            alert("You are not logged in Facebook. Please, sign-in to Facebook and re-connect to Phylo.");
                            return;
                        }
                    });
                } else {
                    console.log("Login mode does not allow to share the highscore achievement.");
                    return;
                }
            } else {
                alert("You seem to have been disconnected. Please, login again.");
                $.cookie.delete("username");
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
                return;
            }
        };
		//login click event
		$(".login-btn").click(function() {
			eClick();
		});
        $(".my-fb-login-button").click(function() {
            fbClick();
        });
        $("#btn-highscore-share").click(function() {
            console.log("Click share event");
            shareClick();
        });
		//logout event
		$("#logout").click(function() {
			window.guest = "Guest";
			$.cookie.delete("username");
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
				$.protocal.register(name, password, email,'classic',0, function(re) {
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
