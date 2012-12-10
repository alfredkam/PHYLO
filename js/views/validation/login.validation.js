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
			$(".m_login").html(username);
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
						    $("div.login-warning").show().html(window.lang.body.social["field 3"].replace("***",provider));
						    return;
						}
						$.protocal.register(username,fullname,password,email,provider,c_logid, function(re2) {
						    if(re2 == "succ") {
							console.log(provider + " registration successful. username: "+username);
							// Update status
							var message = fullname.replace("+"," ") + " " + window.lang.body.social["field 1"]+ " " + window.lang.body.social["field 20"];
							var caption = window.lang.body.social["field 31"];
							if ((provider=='Facebook')||(provider=='LinkedIn')) {
							    var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
							} else {
							    var data = "provider="+provider+"&id="+c_logid+"&description="+message;
							}
							bootbox.confirm(window.lang.body.social["field 2"],window.lang.body.social["field 26"],window.lang.body.social["field 25"], function(result) {
							    if (result) {
								console.log("post on " + provider + " : " + data);
								$.ajax({
								    type: "POST",
								    url : "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
								    data : data,
								}).done(function(re) {
								    //bootbox.alert("Thank you for sharing the word. You can now start to play!");
								}).fail(function() {
								    bootbox.alert(window.lang.body.social["field 4"]);
								});
							    }
							});
						    } else {
							console.log(provider + " registration failed.");
							$("div.login-warning").show().html(window.lang.body.social["field 5"].replace("***",provider));
							$.cookie.delete("username");
							$.cookie.delete("fullname");
							$.cookie.delete("loginmode");
							$.cookie.delete("logid");
							$("#logout").hide();
							window.guest = 'guest';
							$("#login-box").hide();
							$(".login-btn").click(function() { classicLogin(); });
							$(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
							$(".showInLogin").hide();
							window.showInLogin = false;
							return;
						    }
						});
					    }
					});
				    }).fail(function() {
					$("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 21"]);
					$.cookie.delete("username");
					$.cookie.delete("fullname");
					$.cookie.delete("loginmode");
					$.cookie.delete("logid");
					$("#logout").hide();
					window.guest = 'guest';
					$("#login-box").hide();
					$(".login-btn").click(function() { classicLogin(); });
					$(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
					$(".showInLogin").hide();
					window.showInLogin = false;
					return;
				    });
				    // display login
				    $(".m_login").html(fullname.replace("+"," "));
				    window.guest=fullname;
				} else {
				    //bootbox.alert("Data conflict. Please, login again.");
				    $.cookie.delete("username");
				    $.cookie.delete("fullname");
				    $.cookie.delete("loginmode");
				    $.cookie.delete("logid");
				    $("#logout").hide();
				    window.guest = 'guest';
				    $("#login-box").hide();
				    $(".login-btn").click(function() { classicLogin(); });
				    $(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
				    $(".showInLogin").hide();
				    window.showInLogin = false;
				    return;
				}
			    } else {
				// failed to connect
				$("div.login-warning").show().html(window.lang.body.social["field 6"].replace("***",provider));
				$.cookie.delete("username");
				$.cookie.delete("fullname");
				$.cookie.delete("loginmode");
				$.cookie.delete("logid");
				$("#logout").hide();
				window.guest = 'guest';
				$("#login-box").hide();
				$(".login-btn").click(function() { classicLogin(); });
				$(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
				$(".showInLogin").hide();
				window.showInLogin = false;
				return;
			    }
			});
		    }
		    $("#logout").show();
		    window.guest = fullname;
		    $("#login-box").hide();
		    $(".login-btn").unbind("click");
		    // show buttons. NB: hide expert button if necessary
		    $.ajax({
			type: "POST",
			url : "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
			data : "mode=8&user="+username,
		    }).done(function(re) {
			$(".showInLogin").show();
			window.showInLogin = true;
			if (re!='succ') {
			    $(".showExpertOptions").hide();
					window.showExpertOptions = false;
			}
		    }).fail(function() {
			$(".showInLogin").show();
			window.showInLogin = true;
			console.log("Expert validation failed. Could not connect to the server.");
		    });
		};

			// Classic login onclick event
			var classicLogin = function() {
				var username = $("#username").val().trim();
				var password = $("#password").val().trim();
				if((username == "" || password == "")) {
					$("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 20"]);
					return;
				} 

				$("div.login-warning").hide();

				$.protocal.login(username, password, function(re) {
					if(re == "succ") {	
						$(".m_login").html(username);
						$.cookie.create("username",username,365);
			    $.cookie.create("fullname",username,365);
			    $.cookie.create("loginmode","Classic",365);
			    $.cookie.create("logid",-1,365);
			    $("#logout").show();
			    window.guest = username;
			    $("#login-box").hide();
			    $(".login-btn").unbind("click");
			    // show buttons. NB: hide expert button if necessary
			    $.ajax({
				type: "POST",
				url : "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
				data : "mode=8&user="+username,
			    }).done(function(re) {
				$(".showInLogin").show();
				window.showInLogin = true;
				if (re!='succ') {
				    $(".showExpertOptions").hide();
				    window.showExpertOptions = false;
				}
			    }).fail(function() {
				$(".showInLogin").show();
				window.showInLogin = true;
				console.log("Expert validation failed. Could not connect to the server.");
			    });
					} else {
						$("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 16"]);
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
			$(".m_logout").click(function() {
				window.guest = "Guest";
				$.cookie.delete("username");
		    $.cookie.delete("fullname");
		    $.cookie.delete("loginmode");
		    $.cookie.delete("logid");
		    $("#logout").hide();
		    window.guest = 'guest';
		    $("#login-box").hide();
				$(".login-btn").click(function() {
					classicLogin();
				});
				$(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
				$(".showInLogin").hide();
			window.showInLogin = false;
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
						$("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 20"]);
						return;
					} 
					$.protocal.register(name, name, password, email,'Classic',0, function(re) {
						if(re == "succ") {
							$(".login-btn").unbind("click");	
							$(".m_login").html(name);
							$("#logout").show();
							window.guest = name;
							$("#login-box").hide();
						} else {
							$("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 22"]);
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
