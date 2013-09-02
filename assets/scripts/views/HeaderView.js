//Filename: boilerplate.js

define([
    //LIBRARIES
    "jquery",
    "marionette",
    //TEMPLATES
    "text!tpl/app/Header.mustache",
    "scripts/views/validation/cookie.validation.amd"
    //NO EXPORTS
], function($, Marionette, tpl, cookie) {
    var HeaderView = Marionette.ItemView.extend({
        initialize: function(options) {
            this.lang = options.lang;
            this.model.set({
                lang: this.lang
            });
        },
        template: tpl,
        ui: {
            loginBox: "#login-box",
            optionsBtn : "#options-button",
            languageList : "#language-list"
        },
        events: {
            "click div#login": "login",
            // "click #options-button" : "optionsEvent",
            "click #language" : "languageEvent",
            "click #customize" : "customizeShow",
            "click .customize-cancel" : "customizeCancel",
            "click .customize-save" : "customizeSave",
            "click .customize-tab a" : "customizeTab",
            "click .customize-theme-cell" : "customizeThemeCell",
            "click .customize-theme-reset" : "customizeThemeReset",
            "click .zocial.facebook": function() {
                this.socialLogin('Facebook');
            },
            "click .zocial.twitter": function() {
                this.socialLogin('Twitter');
            },
            "click .zocial.Google": function() {
                this.socialLogin('Google');
            },
            "click .zocial.LinkedIn": function() {
                this.socialLogin('LinkedIn');
            },
            "click .m_logout": function() {
                window.guest = "Guest";
                cookie.delete("username");
                cookie.delete("fullname");
                cookie.delete("loginmode");
                cookie.delete("logid");
                $("#logout").hide();
                window.guest = 'guest';
                $("#login-box").hide();
                $(".login-btn").click(function() {
                    this.classicLogin();
                });
                $(".m_login").html(window.lang.body.play.gameselect.login["field 2"]);
                $(".showInLogin").hide();
                window.showInLogin = false;
            },
            "click .register-btn": "register",
            "click .cancel-btn": function() {
                $(".email-holder").hide();
                $(".register-btn").addClass("register-btn-shift");
                $(".login-btn").parent().show();
                $(".cancel-btn").hide();
            },
            "click .login-btn" : "classicLogin"
        },
        customizeShow : function(event) {
            $(".customize").show();
            $(".customize-bg").css({
                width: $(document).width(),
                height: $(document).height()
            });
        },
        customizeCancel : function() {
            $(".customize").hide();
            $(".colorCell").css({
                backgroundColor: $.cookie.read("bgCell")
            });
            $(".colorA").css({
                backgroundColor: $.cookie.read("nuc-A")
            });
            $(".colorG").css({
                backgroundColor: $.cookie.read("nuc-G")
            });
            $(".colorC").css({
                backgroundColor: $.cookie.read("nuc-C")
            });
            $(".colorT").css({
                backgroundColor: $.cookie.read("nuc-T")
            });
        },
        customizeSave : function() {
            var bg = $(".colorCell").css("background-color");
            var A = $(".colorA").css("background-color");
            var G = $(".colorG").css("background-color");
            var C = $(".colorC").css("background-color");
            var T = $(".colorT").css("background-color");
            
            $.cookie.create("bgCell",bg,365);
            $.cookie.create("nuc-A",A,365);
            $.cookie.create("nuc-G",G,365);
            $.cookie.create("nuc-C",C,365);
            $.cookie.create("nuc-T",T,365);

            $(".nuc-A").css({backgroundColor: A});
            $(".nuc-G").css({backgroundColor: G});
            $(".nuc-C").css({backgroundColor: C});
            $(".nuc-T").css({backgroundColor: T});      
            $(".bgCell").css({backgroundColor: bg});
            $(".customize").hide();
        },
        customizeTab : function(e) {
            e.target.each(function(){
                $(this).removeClass("customize-tab-onselect");
            })
            e.target.addClass("customize-tab-onselect");
            if(e.target.hasClass("tag-theme")) {
                $(".customize-theme").show();
                $(".customize-music").hide();
            } else {
                $(".customize-theme").hide();
                $(".customize-music").show();
            }
        },
        customizeThemeCell : function(e){
            e.target.each(function(){
                $(this).removeClass("customize-theme-onpick");
            });
            e.target.addClass("customize-theme-onpick");
        },
        customizeThemeReset : function(){
            $(".colorCell").css({ backgroundColor:"white"});
            $(".colorA").css({backgroundColor:"#71B2E2"});
            $(".colorG").css({backgroundColor:"#9932CC"});
            $(".colorC").css({backgroundColor:"#008000"});
            $(".colorT").css({backgroundColor:"#FFA500"});
        },
        login: function(e) {
            e.stopPropagation();
            this.ui.loginBox.show();
            this.ui.loginBox.parent().addClass("login-onSelect");
        },
        languageEvent : function(e) {
            e.stopPropagation();
            this.ui.languageList.show();
            e.target.addClass("dropDown-OptionOnSelect");
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
                        $("#login-box").hide();
                    } else {
                        $("div.login-warning").show().html(window.lang.body.play.gameselect.login["field 22"]);
                    }
                });
            }
        },
        customizeFnDump : function(){
            $.customize = {
                "default" : function() {
                    if($.cookie.read("bgCell")) {
                        $(".colorBG").css({backgroundColor : $.cookie.read("bgCell")});
                        $(".bgCell").css({backgroundColor : $.cookie.read("bgCell")});
                    } else {
                        $.cookie.create("bgCell","white",365);
                    }   

                    if($.cookie.read("nuc-A")) {
                        $(".nuc-A").css({backgroundColor : $.cookie.read("nuc-A") });
                        $(".colorA").css({backgroundColor : $.cookie.read("nuc-A") });
                    } else {
                        $.cookie.create("nuc-A","#71B2E2",365);
                    }
                    if($.cookie.read("nuc-G")) {
                        $(".nuc-G").css({backgroundColor : $.cookie.read("nuc-G")});
                        $(".colorG").css({backgroundColor : $.cookie.read("nuc-G")});
                    } else {
                        $.cookie.create("nuc-G","#9932CC",365);
                    }
                    if($.cookie.read("nuc-C")) {
                        $(".nuc-C").css({backgroundColor : $.cookie.read("nuc-C")});
                        $(".colorC").css({backgroundColor : $.cookie.read("nuc-C")});
                    } else {
                        $.cookie.create("nuc-C","#008000",365); 
                    }
                    if($.cookie.read("nuc-T")) {
                        $(".nuc-T").css({backgroundColor : $.cookie.read("nuc-T")});
                        $(".colorT").css({backgroundColor : $.cookie.read("nuc-T")});
                    } else {
                        $.cookie.create("nuc-T","#FFA500",365);
                    }
                }
            };
        },
        colorPadDump : function(){
        //color pad code from http://www.html5canvastutorials.com/labs/html5-canvas-color-picker/  ### modified to suit the requirements for this page
            function getMousePos(canvas, evt){
                // get canvas position
                var obj = canvas;
                var top = 0;
                var left = 0;
                while (obj.tagName != 'BODY') {
                    top += obj.offsetTop;
                    left += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
                
                // return relative mouse position
                var mouseX = evt.clientX - left + window.pageXOffset;
                var mouseY = evt.clientY - top + window.pageYOffset;
                return {
                    x: mouseX,
                    y: mouseY
                };
            }
            
            function drawColorSquare(canvas, color, imageObj){
                var colorSquareSize = 100;
                var padding = 0;
                var context = canvas.getContext("2d");
                context.beginPath();
                context.fillStyle = color;
                var squareX = (canvas.width - colorSquareSize + imageObj.width) / 2;
                var squareY = (canvas.height - colorSquareSize) / 2;
                context.fillRect(squareX, squareY, colorSquareSize, colorSquareSize);
                context.strokeRect(squareX, squareY, colorSquareSize, colorSquareSize);
            }
            
            function init(imageObj){
                var padding = 0;
                var canvas = document.getElementById("colorpad");
                var context = canvas.getContext("2d");
                var mouseDown = false;
                
                context.strokeStyle = "#444";
                context.lineWidth = 2;
                
              /*  canvas.addEventListener("mousedown", function(){
                    mouseDown = true;
                }, false);
                
                canvas.addEventListener("mouseup", function(){
                    mouseDown = false;
                }, false);

                
                canvas.addEventListener("mousemove", function(evt){
                    */
                    canvas.addEventListener("mousedown",function(evt) {
                        var mousePos = getMousePos(canvas, evt);
                        var color = undefined;

                    //if (mouseDown &&
                    /*
                     if(
                        mousePos !== null &&
                        mousePos.x > padding &&
                        mousePos.x < padding + imageObj.width &&
                        mousePos.y > padding &&
                        mousePos.y < padding + imageObj.height) {
                        /*
                         * color picker image is 256x256 and is offset by 10px
                         * from top and bottom
                         */
                         var imageData = context.getImageData(padding, padding, imageObj.width, imageObj.width);
                         var data = imageData.data;
                         var x = mousePos.x - padding;
                         var y = mousePos.y - padding;
                         var red = data[((imageObj.width * y) + x) * 4];
                         var green = data[((imageObj.width * y) + x) * 4 + 1];
                         var blue = data[((imageObj.width * y) + x) * 4 + 2];
                         color = "rgb(" + red + "," + green + "," + blue + ")";
                 //   }
                 console.log(color);

                 if (color) {
                       // drawColorSquare(canvas, color, imageObj);
                       $(".customize-theme-onpick").css({
                        backgroundColor : color
                    });
                   }
               }, false);

                context.drawImage(imageObj, padding, padding);
                //drawColorSquare(canvas, "white", imageObj);
            }
            
            var imageObj = new Image();
            imageObj.onload = function(){
                init(this);
            };
            imageObj.src = "assets/img/color_picker.png";
        },
        onShow: function() {
            this.customizeFnDump();
            this.colorPadDump(); 
            var self = this;
            $("html").click(function(){
                self.ui.loginBox.hide();
                self.ui.loginBox.parent().removeClass("login-onSelect");
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
                                                    bootbox.confirm(window.lang.body.social["field 2"], window.lang.body.social["field 26"], window.lang.body.social["field 25"], function(result) {
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
                                                    });
                                                } else {
                                                    console.log(provider + " registration failed.");
                                                    $("div.login-warning").show().html(window.lang.body.social["field 5"].replace("***", provider));
                                                    cookie.delete("username");
                                                    cookie.delete("fullname");
                                                    cookie.delete("loginmode");
                                                    cookie.delete("logid");
                                                    $("#logout").hide();
                                                    window.guest = 'guest';
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
                            } else {
                                //bootbox.alert("Data conflict. Please, login again.");
                                cookie.delete("username");
                                cookie.delete("fullname");
                                cookie.delete("loginmode");
                                cookie.delete("logid");
                                $("#logout").hide();
                                window.guest = 'guest';
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