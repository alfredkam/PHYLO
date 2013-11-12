(function() {
	$(document).ready(function() {
		//hide logout on default
		$(".showlogout").hide();
		$('.dropdown-menu').find('form').click(function (e) {
			e.stopPropagation();
		    });

        //check if have cookie
        if($.cookie.read("username")) {
            $(".login-btn").unbind("click");
	    var username = $.cookie.read("username");
	    var provider = $.cookie.read("loginmode");
            var c_logid = $.cookie.read("logid");
	    if (provider=="Classic") {
		$("#login-tag").html(username);
	    } else {
		// Must check account and cookie data match and then extract full name.
                $.get("http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider + "&restart=0",function(data){
			var status ='connected';
			if (status === 'connected') {
			    // connected: we must check that account are the same
			    var userinfo = eval("(" + data + ")");
			    var fullname = userinfo.displayName;
			    var net_logid = userinfo.identifier;
			    var email = userinfo.email;
			    if (c_logid==net_logid) {
				$("#login-tag").html(fullname);
			    } else {
				$.cookie.delete("username");
				$.cookie.delete("loginmode");
				$.cookie.delete("logid");
				return;
			    }
			} else if (status === 'not_authorized') {
			    // not_authorized
			    bootbox.alert("Phylo has not been authorized to connect with your " + provider + " account. Please, confirm.");
			    return;
			} else {
			    // not_logged_in
			    bootbox.alert("You are not logged in " + provider + ". Please, sign-in to Facebook and re-connect to Phylo.");
			    return;
			}
		    });
	    }
	    
	    $(".showlogin").hide();
	    $(".showlogout").show();
	    window.guest = username;
	    $(".showInLogin").show();
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
				$("#login-tag").html("You are logged as "+name);
				$(".showlogin").hide();
				$(".showlogout").show();
				window.guest = name;
				$(".showInLogin").show();
				$.cookie.create("username",name,365);
				$.cookie.create("loginmode","Classic",365);
				$.cookie.create("logid",-1,365);
			    } else {
				bootbox.alert("Incorrect Username or Password.");
			    }			
			});
		};

		var socialLogin = function(provider) {

		    $.get("http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider + "&restart=1",function(data){
			    start_url = "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider="+provider+"&restart=1";
			    win = window.open(
				    start_url,
				    "hybridauth_social_signin",
				    "location=0,status=0,scrollbars=0,width=800,height=500"
				  );

		    var status ='connected';
		    if (status === 'connected') {
			// connected
			var userinfo = eval ("(" + data + ")");
			var fullname = userinfo.displayName;
			var username = provider + "_" + userinfo.identifier;
			var loginmode = provider;
			var logid = userinfo.identifier;
			$.ajax({
			   type: "POST",
			   url : "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
			   data : "username="+username+"&id="+logid,
			}).done(function(re) {
                        var password = re;
                        $.protocal.login(username, password, function(re) {
                            if(re == "succ") {
                                //$(".login-btn").unbind("click");
                                bootbox.alert("Welcome back "+fullname);
                                $("#login-tag").html("You are logged as "+fullname);
                                $(".showlogin").hide();
                                $(".showlogout").show();
                                window.guest = username;
                                $(".showInLogin").show();
                                $.cookie.create("username",username,365);
                                $.cookie.create("loginmode","fb",365);
                                $.cookie.create("logid",logid,365);
                            } else {
                                bootbox.alert("Login failed.");
                            }
                        });
                    }).fail(function() {
                        bootbox.alert("Could not connect to the server. Please try again later.");
                    });
                } else if (status === 'not_authorized') {
				// not_authorized
                                bootbox.alert("Phylo has not been authenticated by " + provider + ". Please, confirm.");
			    } else {
				// not_logged_in
                                bootbox.alert("You must login to " + provider + " before login to Phylo.");
			    }
			});
		};
		
		//login click event
	$(".login-btn").click(function() {
      		classicLogin();
	});       

        $(".zocial.facebook").click(function() {
            socialLogin("Facebook");
        });
                      
        $(".zocial.twitter").click(function() {
            socialLogin("Google");
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
