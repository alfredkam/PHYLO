//Filename: boilerplate.js

define([
    //LIBRARIES
    "jquery",
    "marionette",
    //TEMPLATES
    "text!tpl/app/Header.mustache",
    "scripts/views/validation/cookie.validation.amd",
    //tablet tpl
    "text!tpl/tablet/TabletHeader.mustache",
    //NO EXPORTS
   //"scripts/phylo-lib/protocal.core",
   
], function($, Marionette, tpl, cookie, tabletTpl) {
    var HeaderView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.lang = options.lang;
            this.user = options.user;
            this.model.set({
                lang: this.lang,
                user : this.user.toJSON().name.replace("+"," ")
            });
            if(this.options.format == "tablet") {
                this.template = tabletTpl;
            }
        },
        template: tpl,
        ui: {
            loginBox: "#login-box",
            optionsBtn : "#options-button",
            languageList : "#language-list"
        },
        events: {
            "click div.tabletLogoutBtn" : "logoutFn",
            "click div#login": "login",
            // "click #options-button" : "optionsEvent",
            "click #language" : "languageEvent",
            "click #customize" : "customizeShow",
            "click .zocial.facebook": function() {
                this.socialLogin('Facebook');
            },
            "click .zocial.twitter": function() {
                this.socialLogin('Twitter');
            },
            "click .zocial.google": function() {
                this.socialLogin('Google');
            },
            "click .zocial.linkedin": function() {
                this.socialLogin('LinkedIn');
            },
            "click .m_logout": "logoutFn",
            "click div#login-box.logoutBtn" : "logoutFn",
            "click .register-btn": "register",
            "click .cancel-btn": function() {
                $(".email-holder").hide();
                $(".register-btn").addClass("register-btn-shift");
                $(".login-btn").parent().show();
                $(".cancel-btn").hide();
            },
            "click .login-btn" : "classicLogin"
        },
        logoutFn : function(){
            // this.user.set("name", "");
            cookie.delete("username");
            cookie.delete("fullname");
            cookie.delete("loginmode");
            cookie.delete("logid");
            // $("#logout").hide();
            window.guest = "guest";
            window.username = "guest";
            this.user.set("name", "");
            // $("#login-box").hide();
            // $(".login-btn").click(function() {
            //     this.classicLogin();
            // });
            // $(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
            // $(".showInLogin").hide();
            window.showInLogin = false;
        },
        customizeShow : function(event) {
            $(".customize").show();
            $(".customize-bg").css({
                width: $(document).width(),
                height: $(document).height()
            });
        },
        
        login: function(e) {
            if($("#logout").css("display")==="block"){

                return false;
            }
            e.stopPropagation();
            this.ui.loginBox.show();
            this.ui.loginBox.parent().addClass("login-onSelect");
        },
        languageEvent : function(e) {
            e.stopPropagation();
            this.ui.languageList.show();
            $(e.target).addClass("dropDown-OptionOnSelect");
        },
        optionsEvent : function(e){
            var self = this;
            e.stopPropagation();
            this.ui.optionsBtn.addClass("dropDown-OnSelect");
            $(".dropDownTriangle").show();
            $("#option-list").show();
            self.ui.loginBox.hide();
            self.ui.loginBox.parent().removeClass("login-onSelect");
        },
        register: function() {
            var self = this;
            if ($(".cancel-btn").css("display") == "none") {
                $(".login-warning").hide();
                $(".email-holder").show();
                $(".register-btn").removeClass("register-btn-shift");
                $(".login-btn").parent().hide();
                $(".cancel-btn").show();
            } else {
                var name = $("#username").val().trim();
                var password = $("#password").val().trim();
                var email = $("#email").val().trim();
                if ((name == "" || password == "") || email == "") {
                    $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 20"]);
                    return;
                }
                $.protocal.register(name, name, password, email, 'Classic', 0, function(re) {
                    if (re == "succ") {
                        $(".login-btn").unbind("click");
                        $(".m_login").html(decodeURI(name));
                        $("#logout").show();
                        window.guest = name;
                        window.username = name;
                        self.user.set("name", name);
                        $("#login-box").hide();
                    } else {
                        $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 22"]);
                    }
                });
            }
        },
        onShow: function() {
            var self = this;
            $("html").click(function(){
               $("#login-box").hide();
                $("#login-box").parent().removeClass("login-onSelect");
            });
            $("#logout").hide();
            // init page: check cookie and register user if login using social account for the first time 
            if (cookie.read("username")) {
                console.log("user found");
                $(".login-btn").unbind("click");
                var username = cookie.read("username");
                var fullname = cookie.read("fullname");
                var provider = cookie.read("loginmode");
                var logid = cookie.read("logid");
                if (provider == "Classic") {
                    $(".m_login").html(decodeURI(username));
                    window.guest = username;
                    window.username = username;
                    self.user.set("name", username);
                } else {
                    $(".m_login").html(decodeURI(name));
                    window.guest = fullname;
                    window.username = username;
                    self.user.set("name", username);
                }
                // update login box
                $("#logout").show();
                $("#login-box").hide();
                $(".login-btn").unbind("click");
                // show buttons. NB: hide expert button if necessary
                $.ajax({
                    type: "POST",
                    url: "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
                    data: "mode=8&user=" + username
                }).done(function(re) {
                    $(".showInLogin").show();
                    window.showInLogin = true;
                    if (re != 'succ') {
                        $(".showExpertOptions").hide();
                        window.showExpertOptions = false;
                    }
                }).fail(function() {
                    $(".showInLogin").show();
                    window.showInLogin = true;
                    console.log("Expert validation failed. Could not connect to the server.");
                });
            }
        },
        socialLogin: function(provider) {
            var self = this;
            $.get("http://phylo.cs.mcgill.ca/phpdb/social/login.php?provider=" + provider,function(usrdata) {
                var userinfo = eval("(" + usrdata + ")");
                if (userinfo.identifier) { // user info retrieved
                    // store user info
                    var social_logid = userinfo.identifier;
                    var social_email = userinfo.email;
                    var social_username = provider + "_" + userinfo.identifier;
                    var social_fullname = userinfo.displayName;
                    var social_email = userinfo.email;
                    // check is user is registered
                    $.ajax({
                        type: "POST",
                        url: "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                        data: "username=" + username + "&id=" + social_logid
                    }).done(function(mypasswd) { // password generated
                        var social_password = mypasswd;
                        $.protocal.login(username, social_password, function(re) {
                            if (re != "succ") { // login not successful -> try to register user
                                $.protocal.register(social_username, social_fullname, social_password, social_email, provider, social_logid, function(registerout) {
                                    if (registerout == "succ") { // registration successfull
                                        // Prepare optional message to post on user feed
                                        var message = social_fullname.replace("+", " ") + " " + window.lang.body.social["field 1"] + " " + window.lang.body.social["field 20"];
                                        var caption = window.lang.body.social["field 31"];
                                        if (provider != 'Twitter') {
                                            var data = "provider=" + provider + "&id=" + social_logid + "&caption=" + caption + "&description=" + message;
                                        } else { // Twitter message is shorter
                                            var data = "provider=" + provider + "&id=" + social_logid + "&description=" + message;
                                        }
                                        var options = {
                                            message: window.lang.body.social["field 2"],
                                            cancel: window.lang.body.social["field 26"],
                                            confirm: window.lang.body.social["field 25"],
                                            callback: function(result) {
                                                if (result) {
                                                    console.log("post on " + provider + " : " + data);
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "http://phylo.cs.mcgill.ca/phpdbsocial/feed.php",
                                                        data: data
                                                    }).done(function(re) {
                                                    }).fail(function() {
                                                        bootbox.alert(window.lang.body.social["field 4"]);
                                                    });
                                                }
                                            }
                                        };
                                        // Post welcome message
                                        bootbox(options);
                                    } else { // registration failed
                                        console.log(provider + " registration failed.");
                                        $("div.login-warning").show().html(window.lang.body.social["field 5"].replace("***", provider));
                                        cookie.delete("username");
                                        cookie.delete("fullname");
                                        cookie.delete("loginmode");
                                        cookie.delete("logid");
                                        $("#logout").hide();
                                        window.guest = "guest";
                                        window.username ="guest";
                                        self.user.set("name", "");
                                        $("#login-box").hide();
                                        $(".login-btn").click(function() {
                                            this.classicLogin();
                                        });
                                        $(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
                                        $(".showInLogin").hide();
                                        window.showInLogin = false;
                                        return;
                                    }
                                });
                            } // If you reach this line, login is successful or login failed but registration worked
                            console.log(provider + " login successful. username: " + username);
                            // create cookies
                            cookie.create("username", social_username, 365);
                            cookie.create("fullname", social_fullname, 365);
                            cookie.create("loginmode", provider, 365);
                            cookie.create("logid", social_logid, 365);
                            window.guest = social_fullname;
                            window.username = social_username;
                            self.user.set("name", social_username);
                            // update screen
                            $(".m_login").html(decodeURI(name));
                            $("#logout").show();
                            $("#login-box").hide();
                            $(".login-btn").unbind("click");
                            // show buttons. NB: hide expert button if necessary
                            $.ajax({
                                type: "POST",
                                url: "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
                                data: "mode=8&user=" + social_username
                            }).done(function(re) {
                                $(".showInLogin").show();
                                window.showInLogin = true;
                                if (re != 'succ') {
                                    $(".showExpertOptions").hide();
                                    window.showExpertOptions = false;
                                }
                            }).fail(function() {
                                $(".showInLogin").show();
                                window.showInLogin = true;
                                console.log("Expert validation failed. Could not connect to the server.");
                            });
                        });
                    }).fail(function() { // password generation failed
                        $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 21"]);
                        cookie.delete("username");
                        cookie.delete("fullname");
                        cookie.delete("loginmode");
                        cookie.delete("logid");
                        $("#logout").hide();
                        window.guest = "guest";
                        window.username = "guest";
                        self.user.set("name", "");
                        $("#login-box").hide();
                        $(".login-btn").click(function() {
                            this.classicLogin();
                        });
                        $(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
                        $(".showInLogin").hide();
                        window.showInLogin = false;
                        return;
                    });
                } else { // user info NOT retrieved
                    cookie.delete("username");
                    cookie.delete("fullname");
                    cookie.delete("loginmode");
                    cookie.delete("logid");
                    $("#logout").hide();
                    window.guest = "guest";
                    window.username = "guest";
                    self.user.set("name", "");
                    $("#login-box").hide();
                    $(".login-btn").click(function() {
                        this.classicLogin();
                    });
                    $(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
                    $(".showInLogin").hide();
                    window.showInLogin = false;
                    return;
                }
            });
        },
        classicLogin : function() {
            var username = $("#username").val().trim();
            var password = $("#password").val().trim();
            var self = this;
            if ((username == "" || password == "")) {
                $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 20"]);
                return;
            }

            $("div.login-warning").hide();

            $.protocal.login(username, password, function(re) {
                if (re == "succ") {
                    $(".m_login").html(decodeURI(name));
                    cookie.create("username", username, 365);
                    cookie.create("fullname", username, 365);
                    cookie.create("loginmode", "Classic", 365);
                    cookie.create("logid", -1, 365);
                    $("#logout").show();
                    window.guest = username;
                    window.username = username;
                    self.user.set("name", username);
                    $("#login-box").hide();
                    $(".login-btn").unbind("click");
                    // show buttons. NB: hide expert button if necessary
                    $.ajax({
                        type: "POST",
                        url: "http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php",
                        data: "mode=8&user=" + username
                    }).done(function(re) {
                        $(".showInLogin").show();
                        window.showInLogin = true;
                        if (re != 'succ') {
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
        }
    });

    return HeaderView;

});