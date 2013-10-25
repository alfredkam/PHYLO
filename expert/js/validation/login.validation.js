(function() {
	$(document).ready(function() {
		//hide logout on default
		$(".showlogout").hide();
		$('.dropdown-menu').find('form').click(function (e) {
			e.stopPropagation();
		    });

                      
        // init page: check cookie and register user if login using social account for the first time
        if($.cookie.read("username")) {
            $(".login-btn").unbind("click");
                var username = $.cookie.read("username");
                var fullname = $.cookie.read("fullname");
                var provider = $.cookie.read("loginmode");
                var c_logid = $.cookie.read("logid");
                if (provider=="Classic") {
                    $("#login-tag").html(username);
                    $(".showlogin").hide();
                    $(".showlogout").show();
                    window.guest = username;
                    $(".showInLogin").show();
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
                                            console.log("Cannot not login expert version using " + provider + "account.");
                                            window.guest = "Guest";
                                            $.cookie.delete("username");
                                            $.cookie.delete("fullname");
                                            $.cookie.delete("loginmode");
                                            $.cookie.delete("logid");
                                            $(".showlogout").hide();
                                            $(".showlogin").show();
                                            $(".login-btn").click(function() { eClick(); });
                                            window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
                                            return;
                                        }
                                    });
                                }).fail(function() {
                                    console.log("Could not connect to the server. Please try again later.");
                                    window.guest = "Guest";
                                    $.cookie.delete("username");
                                    $.cookie.delete("fullname");
                                    $.cookie.delete("loginmode");
                                    $.cookie.delete("logid");
                                    $(".showlogout").hide();
                                    $(".showlogin").show();
                                    $(".login-btn").click(function() { eClick(); });
                                    window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
                                    return;
                                });
                            // scoial login successful -> display info
                            $("#login-tag").html(fullname.replace("+"," "));
                            $(".showlogin").hide();
                            $(".showlogout").show();
                            window.guest = username;
                            $(".showInLogin").show();
                        } else {
                            bootbox.alert("You do not seem connected to the correct " + provider + "account. Please, login again.");
                            window.guest = "Guest";
                            $.cookie.delete("username");
                            $.cookie.delete("fullname");
                            $.cookie.delete("loginmode");
                            $.cookie.delete("logid");
                            $(".showlogout").hide();
                            $(".showlogin").show();
                            $(".login-btn").click(function() { eClick(); });
                            window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
                            return;
                        }
                    } else {
                        // failed to connect
                        console.log(provider + " connection failed. Please, check that you are already connected to " + provider + ".");
                        window.guest = "Guest";
                        $.cookie.delete("username");
                        $.cookie.delete("fullname");
                        $.cookie.delete("loginmode");
                        $.cookie.delete("logid");
                        $(".showlogout").hide();
                        $(".showlogin").show();
                        $(".login-btn").click(function() { eClick(); });
                        window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
                        return;
                    }
                });
            }
            // Validate expert version access
	   
            $.ajax({
                type: "POST",
                url : "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
                data : "mode=8&user="+username,
            }).done(function(re) {
                if (re!='succ') {
		    window.guest = "Guest";
		    $.cookie.delete("username");
		    $.cookie.delete("fullname");
		    $.cookie.delete("loginmode");
		    $.cookie.delete("logid");
		    $(".showlogout").hide();
		    $(".showlogin").show();
		    $(".login-btn").click(function() { eClick(); }); 
		    bootbox.alert("You must complete 20 puzzles of the classic edition before accessing the Expert version.",function() {
			    window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
			});
                }
            }).fail(function() {
                $(".showInLogin").show();
                console.log("Expert validation failed. Could not connect to the server.");
		$.cookie.delete("username");
		$.cookie.delete("fullname");
		$.cookie.delete("loginmode");
		$.cookie.delete("logid");
		$(".showlogout").hide();
		$(".showlogin").show();
		$(".login-btn").click(function() { eClick(); });
                window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
            });
	      
        };
                      
                      
		//login onclick event
		var classicLogin = function() {

		    var name = $("#username").val().trim();
		    var password = $("#password").val().trim();
		    var loginmode = "Classic";

		    if((name == "" || password == "")) {
			bootbox.alert("Username or Password is missing");
			return;
		    }
		    
		    $.protocal.login(name, password, function(re) {
			    if(re == "succ") {
				//$(".login-btn").unbind("click");
				bootbox.alert("Welcome back "+name);
				$("#login-tag").html(name);
				$(".showlogin").hide();
				$(".showlogout").show();
				window.guest = name;
				$(".showInLogin").show();
				$.cookie.create("username",name,365);
                                $.cookie.create("fullname",name,365);
				$.cookie.create("loginmode","Classic",365);
				$.cookie.create("logid",-1,365);
			    } else {
				bootbox.alert("Incorrect Username or Password.");
			    }			
			});
		};

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
            socialLogin("Facebook");
        });
                      
        $(".zocial.twitter").click(function() {
            socialLogin("Twitter");
        });

        $(".zocial.google").click(function() {
            socialLogin("Google");
        });

        $(".zocial.linkedin").click(function() {
            socialLogin("LinkedIn");
        });

		//logout event
		$(".logout").click(function(e) {
		  e.preventDefault();
		  bootbox.confirm("Do you want to logout?","No","Logout", function(result) {
		    if (result) {  			
		      window.guest = "Guest";
		      $.cookie.delete("username");
              $.cookie.delete("fullname");
              $.cookie.delete("loginmode");
              $.cookie.delete("logid");
		      $(".showlogout").hide();
		      $(".showlogin").show();
		      $(".login-btn").click(function() { 
                eClick();
		      });
		      window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
		      //$("#login-tag").html("Login");                                                                                
		      //$(".showInLogin").hide();                                                                                      
		    }
		  });
		});

		//cancel event
		$(".cancel-btn").click(function() {
			$(".email-holder").hide();
			$(".register-btn").addClass("register-btn-shift");
			$(".login-btn").show();
			$(this).hide();
		});
	});
})();
