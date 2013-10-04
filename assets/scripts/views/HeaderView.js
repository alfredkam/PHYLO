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
   // "scripts/phylo-lib/protocal.core"
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
            // console.log("clicked?");
            window.guest = "Guest";
            // this.user.set("name", "");
            cookie.delete("username");
            cookie.delete("fullname");
            cookie.delete("loginmode");
            cookie.delete("logid");
            // $("#logout").hide();
            window.guest = 'guest';
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
                        $(".m_login").html(name);
                        $("#logout").show();
                        window.guest = name;
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
                var c_logid = cookie.read("logid");
                if (provider == "Classic") {
                    $(".m_login").html(username);
                } else {

                    $.get("http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider + "&restart=0", function(data) {
                        var userinfo = eval("(" + data + ")");
                        if (userinfo.identifier) {
                            // complete infos stored in cookie
                            var net_logid = userinfo.identifier;
                            var email = userinfo.email;
                            if (c_logid == net_logid) {
                                // check is user exists
                                $.ajax({
                                    type: "POST",
                                    url: "http://phylo.cs.mcgill.ca/phpdb/passwdmanager.php",
                                    data: "username=" + username + "&id=" + c_logid
                                }).done(function(mypasswd) {
                                    var password = mypasswd;
                                    // a bit heavy. a simple table entry check would be enough.
                                    $.protocal.login(username, password, function(re) {
                                        if (re != "succ") {
                                            // login not successful -> register users
                                            if ((username == "" || password == "") || email == "") {
                                                $("div.login-warning").show().html(window.lang.body.social["field 3"].replace("***", provider));
                                                return;
                                            }
                                            $.protocal.register(username, fullname, password, email, provider, c_logid, function(re2) {
                                                if (re2 == "succ") {
                                                    console.log(provider + " registration successful. username: " + username);
                                                    // Update status
                                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 1"] + " " + window.lang.body.social["field 20"];
                                                    var caption = window.lang.body.social["field 31"];
                                                    if ((provider == 'Facebook') || (provider == 'LinkedIn')) {
                                                        var data = "provider=" + provider + "&id=" + c_logid + "&caption=" + caption + "&description=" + message;
                                                    } else {
                                                        var data = "provider=" + provider + "&id=" + c_logid + "&description=" + message;
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
                                                                    url: "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
                                                                    data: data
                                                                }).done(function(re) {
                                                                    //bootbox.alert("Thank you for sharing the word. You can now start to play!");
                                                                }).fail(function() {
                                                                    bootbox.alert(window.lang.body.social["field 4"]);
                                                                });
                                                            }
                                                        }

                                                    };
                                                    // bootbox.confirm(window.lang.body.social["field 2"], window.lang.body.social["field 26"], window.lang.body.social["field 25"], function(result) {
                                                    //     if (result) {
                                                    //         console.log("post on " + provider + " : " + data);
                                                    //         $.ajax({
                                                    //             type: "POST",
                                                    //             url: "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
                                                    //             data: data
                                                    //         }).done(function(re) {
                                                    //             //bootbox.alert("Thank you for sharing the word. You can now start to play!");
                                                    //         }).fail(function() {
                                                    //             bootbox.alert(window.lang.body.social["field 4"]);
                                                    //         });
                                                    //     }
                                                    // });
                                                    bootbox(options);
                                                } else {
                                                    console.log(provider + " registration failed.");
                                                    $("div.login-warning").show().html(window.lang.body.social["field 5"].replace("***", provider));
                                                    cookie.delete("username");
                                                    cookie.delete("fullname");
                                                    cookie.delete("loginmode");
                                                    cookie.delete("logid");
                                                    $("#logout").hide();
                                                    window.guest = 'guest';
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
                                        }
                                    });
                                }).fail(function() {
                                    $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 21"]);
                                    cookie.delete("username");
                                    cookie.delete("fullname");
                                    cookie.delete("loginmode");
                                    cookie.delete("logid");
                                    $("#logout").hide();
                                    window.guest = 'guest';
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
                                // display login
                                $(".m_login").html(fullname.replace("+", " "));
                                window.guest = fullname;
                                self.user.set("name", fullname);
                            } else {
                                //bootbox.alert("Data conflict. Please, login again.");
                                cookie.delete("username");
                                cookie.delete("fullname");
                                cookie.delete("loginmode");
                                cookie.delete("logid");
                                $("#logout").hide();
                                window.guest = 'guest';
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
                        } else {
                            // failed to connect
                            $("div.login-warning").show().html(window.lang.body.social["field 6"].replace("***", provider));
                            cookie.delete("username");
                            cookie.delete("fullname");
                            cookie.delete("loginmode");
                            cookie.delete("logid");
                            $("#logout").hide();
                            window.guest = 'guest';
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
                }
                $("#logout").show();
                window.guest = fullname;
                $("#login-box").hide();
                $(".login-btn").unbind("click");
                // show buttons. NB: hide expert button if necessary
                self.user.set("name", fullname);
                $.ajax({
                    type: "POST",
                    url: "/phpdb/phyloExpertDB.php",
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
            start_url = "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/login.php?provider=" + provider + "&restart=1";
            win = window.open(
                start_url,
                "hybridauth_social_signin",
                "location=0,status=0,scrollbars=0,width=800,height=500"
            );
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
                    $(".m_login").html(username);
                    cookie.create("username", username, 365);
                    cookie.create("fullname", username, 365);
                    cookie.create("loginmode", "Classic", 365);
                    cookie.create("logid", -1, 365);
                    $("#logout").show();
                    window.guest = username;
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