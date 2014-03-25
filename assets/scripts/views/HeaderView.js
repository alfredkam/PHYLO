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
    // "scripts/phylo-lib/protocal.core",

], function($, Marionette, tpl, cookie, tabletTpl) {
    var baseUrl = "/phpdb/openPhyloClassicDB.php";
    var HeaderView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.lang = options.lang;
            this.user = options.user;
            this.model.set({
                lang: this.lang,
                user : this.user.toJSON().name.replace("+"," "),
                isCSB :window.csb.isIframe()
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
        login : function(username, password, fn) {
            var url = baseUrl;
            var mode = 7;
            var data = "mode="+mode+"&user="+username+"&pass="+password;
            $.ajax({
                type: "POST",
                url : url,
                data : data
            }).done(function(re) {
                fn(re);
            }).fail(function() {
                $("div.login-warning").show().html("Could not connect to server, please try again later");
            });
        },
        registerUser : function(username, displayname, password, email, network, network_id, fn) {
            var url = baseUrl;
            var mode = 6;
            var data = "mode="+mode+"&user="+username+"&displayname="+displayname+"&pass="+password+"&email="+email+"&network="+network+"&network_id="+network_id;
            $.ajax({
                type: "POST",
                url : url,
                data : data
            }).done(function(re) {
                fn(re);
            }).fail(function() {
                $("div.login-warning").show().html("Could not connect to server, please try again later");
            });
        },
        events: {
            "click div.tabletLogoutBtn" : "logoutFn",
            "click div#login": "loginBtn",
            // "click #options-button" : "optionsEvent",
            "click #language" : "languageEvent",
            "click #customize" : "customizeShow",
            "click #musicOptions" : "musicShow",
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
        createLoginData: function (myusername,myfullname,myloginmode,mylogid) {
            var self = this;
            //cookie.create("username", myusername, 365);
            //cookie.create("fullname", myfullname, 365);
            //cookie.create("loginmode", myloginmode, 365);
            //cookie.create("logid", mylogid, 365);
            $("#logout").show();
            window.guest = myfullname;
            window.username = myusername;
            self.user.set("name",decodeURI(myfullname));
            $("#login-box").hide();
            $(".login-btn").unbind("click");
            cookie.create("hasPlayed",true,365);

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
        },
        deleteLoginData: function () {
            var self = this;
            //$("div.login-warning").show().html(window.lang.body.social["field 5"].replace("***", provider));
            cookie.delete("username");
            cookie.delete("fullname");
            cookie.delete("loginmode");
            cookie.delete("logid");
            cookie.delete("hasPlayed");
            $("#logout").hide();
            window.guest = "guest";
            window.username ="guest";
            self.user.set("name", "");
            $("#login-box").hide();
            $(".login-btn").click(function() {
                this.classicLogin();
            });
            //$(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
            $(".showInLogin").hide();
            window.showInLogin = false;
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
            $(".customize").hide();
                        $(".colorOptions").show();
            $(".customize-bg").css({
                width: $(document).width(),
                height: $(document).height()
            });
        },
        musicShow : function(e){
            $(".customize").hide();
            $(".musicOptions").show();
            $(".customize-bg").css({
                width: $(document).width(),
                height: $(document).height()
            });
        },
        loginBtn: function(e) {
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
                if ((name === "" || password === "") || email === "") {
                    $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 20"]);
                    return;
                }
                self.registerUser(name, name, password, email, 'Classic', 0, function(re) {
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
                // console.log("user found");
                $(".login-btn").unbind("click");
                // collect cookies data
                var username = cookie.read("username");
                var fullname = cookie.read("fullname");
                var provider = cookie.read("loginmode");
                var logid = cookie.read("logid");
                if (provider == "Classic") {
                    self.createLoginData(username,fullname,provider,logid);
                } else { // check if social user is connected, then if registered. Register if connected but not in our database.
                    console.log("Check " + provider + " connection for user " + logid);
                    $.ajax({
                        type: "GET",
                        url: "http://phylo.cs.mcgill.ca/phpdb/social/isconnected.php",
                        data: "provider=" + provider + "&logid=" + logid
                    }).done(function(connectBoolean) { // check connection
                        if (connectBoolean == "succ") { // user connected
                            $.ajax({
                                type: "POST",
                                url: "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                                data: "username=" + username + "&id=" + logid
                            }).done(function(mypasswd) { // password generated
                                console.log(provider + ": password generated.");
                                var password = mypasswd;
                                self.login(username, password, function(re) {
                                    if (re == "succ") {
                                        console.log(provider + " login successful.");
                                        self.createLoginData(username,fullname,provider,logid);
                                        return;
                                    } else { // login not successful -> try to register user
                                        console.log(provider + ": User not found. Registering...");
                                        self.registerUser(username,fullname,password,email,provider,logid,function(registerout) {
                                            if (registerout == "succ") { // registration successfull
                                                console.log(provider + ": Registering successful.");
                                                // Prepare optional message to post on user feed
                                                var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 1"] + " " + window.lang.body.social["field 20"];
                                                var caption = window.lang.body.social["field 31"];
                                                if (provider != 'Twitter') {
                                                    var data = "provider=" + provider + "&id=" + logid + "&caption=" + caption + "&description=" + message;
                                                } else { // Twitter message is shorter
                                                    var data = "provider=" + provider + "&id=" + logid + "&description=" + message;
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
                                                                url: "http://phylo.cs.mcgill.ca/phpdb/social/feed.php",
                                                                data: data
                                                            }).done(function(re) {
                                                            }).fail(function() {
                                                                bootbox.alert(window.lang.body.social["field 4"]);
                                                            });
                                                        }
                                                    }
                                                };
                                                console.log(provider + ": Registration successful.");
                                                self.createLoginData(username,fullname,provider,logid);
                                                // Post welcome message
                                                bootbox(options);
                                            } else { // registration failed
                                                console.log(provider + " registration failed.");
                                                self.deleteLoginData();
                                                return;
                                            }
                                        });
                                    }
                                });
                            }).fail(function() { // password generation failed
                                console.log(provider + " login data generation failed.");
                                self.deleteLoginData();
                                return;
                            });
                        } else { // user is not connected -- logout
                            console.log(provider + " user is not connected.");
                            self.deleteLoginData();
                            return;
                        }
                    }).fail(function() {
                        console.log(provider + " connection test failed.");
                        self.deleteLoginData();
                        return;
                    });
                }
            }


        },
        socialLogin: function(provider) {
            console.log("Try social login with " + provider);
            // cookies will be created by php script iff user grants access
            var loginURL = "http://phylo.cs.mcgill.ca/phpdb/social/login.php?provider=" + provider + "&returnto=" + document.URL;
            window.location.href= loginURL;
        },
        classicLogin : function() {
            var username = $("#username").val().trim();
            var password = $("#password").val().trim();
            var self = this;
            if ((username === "" || password === "")) {
                $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 20"]);
                return;
            }


            self.login(username, password, function(re) {
                if (re == "succ") {
                    $("div.login-warning").hide();

                    console.log("Login using classic mode.");
                    cookie.create("username", username, 365);
                    cookie.create("fullname", username, 365);
                    cookie.create("loginmode", "Classic", 365);
                    cookie.create("logid", -1, 365);
                    self.createLoginData(username,username,"Classic",-1);

                } else {
                    $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 16"]);
                    console.log("Classic login test failed.");
                    self.deleteLoginData();
                    $("div#login-box").show();
                }
            });
        }
    });

    return HeaderView;

});