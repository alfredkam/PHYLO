(function(){
    var submitterURl = "http://phylo.cs.mcgill.ca/profile/index.php?user=";
	$.endGame = {
		//displays message of completing the game
		complete : function() {
			var self = this;
			$.multiSelect.deactive();
			$.protocal.sendEndGameScore("completed", function(data) {
				self.events();
				self.score("completed",data.best_score);
                self.submitterLocation = submitterURl+(data.submitter?data.submitter:"jerome");
                self.submitter = data.submitter;
                var puzzlesLeft = ((20 - data.puzzles_completed) > 0 ? 20-data.puzzles_completed : 0);          //
                var endMsg = window.lang.body.play.gameselect["end of game"];
				//var msg = "<b>Congratulations!</b> You have solved the puzzle";
				var msg = endMsg["headerMessage"];
				$("#endGame-text").html(msg);
				$("#endGame-learnMore-content").html(self.learnMore(data));
                if(window.guest != "guest" && window.guest != "") {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br>"+
                            endMsg["completeXMessage"].replace("***",puzzlesLeft) +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                } else {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                }
				$("#endGame").fadeIn();
			});

		},
		//displays message of bailing out
		bail : function() {
			var self = this;
			$.multiSelect.deactive();
			$.protocal.sendEndGameScore("bail", function(data) {
				self.events();
                // console.log(data);
				self.score("bail",data.best_score);
                self.submitter = data.submitter;
                // data.puzzles_completed = 21;
                // window.guest = "test";
                self.submitterLocation = submitterURl+(data.submitter?data.submitter:"jerome");
				//var msg = "Too bad! You did not succeed to solve this puzzle!";
                var puzzlesLeft = ((20 - data.puzzles_completed) > 0 ? 20-data.puzzles_completed : 0);          //
                var endMsg = window.lang.body.play.gameselect["end of game"];
				var msg = endMsg["headerMessage"];
				$("#endGame-text").html(msg);
				//$("#endGame-learnMore-content").html("This disease is related to diseases etc, you are helping...etc");
				$("#endGame-learnMore-content").html(self.learnMore(data));
                if(window.guest != "guest" && window.guest != "") {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br>"+
                            endMsg["completeXMessage"].replace("***",puzzlesLeft) +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                } else {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                }
				$("#endGame").fadeIn();
			});

        },
        split: function(string) {
            var pair = string.split(":");
            return "<tr><td>" + $.trim(pair[0]) + "&nbsp;&nbsp;&nbsp;:</td><td>&nbsp;&nbsp;&nbsp;" + $.trim(pair[1]) + "</td></tr>";
        },
        learnMore: function(json) {
            var context = "<table>";
            var self = this;
            // try {
            var endGameContext = window.lang.body.play.gameselect["end of game"];
            //     if (endGameContext.levelId) {

                    context+=self.split(endGameContext["levelId"].replace("***","<b>"+$.phylo.id+"</b>"));
                    context+=self.split(endGameContext["userScore"].replace("***","<b>"+$.phylo.currentScore+"</b>"));
                    context+=self.split(endGameContext["avgScore"].replace("***","<b>"+Math.round(json.running_score / json.play_count)+"</b>"));
                    context+=self.split(endGameContext["highscore"].replace("***","<b>"+json.best_score+"</b>"));
                    context+=self.split(endGameContext["highscoreHolder"].replace("***","<b>"+json.highscore_user+"</b>"));
                    context+=self.split(endGameContext["dnaAssociation"].replace("***","<b>"+(json.disease_link || window.lang.body.footer.unclassified)+"</b>"));
                    context+=self.split(endGameContext["completions"].replace("***","<b>"+json.play_count+"</b>"));
                    context+="<tr><td>"+endGameContext["submitter"]+"&nbsp;&nbsp;&nbsp;:</td><td>&nbsp;&nbsp;&nbsp;<a href='"+self.submitterLocation+"'>"+(self.submitter?self.submitter:"jerome")+"</a></td></tr>";
                    context+="</table>";
            //     } else {
            //         context = endGameContext["field 5"].replace("***", "<label class='end-color'>" + $.phylo.id + "</label>") +
            //             " <label class='end-color'>" + json.disease_link + "</label>.  " + endGameContext["field 6"].replace("***", "<label class='end-color'>" + json.play_count + "</label>").replace(".", ".<br>").replace("***", "<label class='end-color'>" + json.fail_count + "</label>") +
            //             endGameContext["field 7"].replace("***", "<label class='end-color'>" + json.best_score + "</label>") + " " +
            //             endGameContext["field 8"].replace("***", "<label class='end-color'>" + Math.round(json.running_score / json.play_count) + "</label>") + " <br>" +
            //             endGameContext["field 9"].replace("***", "<label class='end-color'>" + json.highscore_user + "</label>");
            //     }
            // } catch (err) {
            //     console.log("@endgame",err);
            //     context = "This disease is related to disease etc, you are helping...etc";
            // }
            return context;
        },
        //scores the game
        score: function(status, highscore) {
            //remove background music... make it stop!
            $("#musicPlayerSpot").html("");
            //gets current score		
            var setDefault = "<i class='icon-star-empty'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>";
            $("#endGame-score-result").html(setDefault);
            $("#endGame-share").show();
            if (status == "bail")
                return;
            var currentScore = $.phylo.currentScore;
            var par = $.sequence.par;
            if (par < currentScore && currentScore < highscore) {
                setDefault = "<i class='icon-star-1'></i><i class='icon-star-1'></i><i class='icon-star-empty'></i>";
            } else if (highscore <= currentScore) {
                setDefault = "<i class='icon-star-1'></i><i class='icon-star-1'></i><i class='icon-star-1'></i>";
            } else { //exactly par score
                setDefault = "<i class='icon-star-1'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>";
            }
            $("#endGame-score-result").html(setDefault);
        },
        // share highscore on social network
        share: function() {
            if ($.cookie.read("username")) {
                var username = $.cookie.read("username");
                var fullname = $.cookie.read("fullname");
                var provider = $.cookie.read("loginmode");
                var c_logid = $.cookie.read("logid");
                console.log(provider);
                if ((provider == "Facebook") || (provider == "Twitter") || (provider == "LinkedIn") || (provider == "Google")) {

                    $.protocal.sendEndGameScore("info", function(data) {

                        var puzzle_disease = data.disease_link;
                        var puzzle_highscore = data.best_score;

                        if (provider == "Facebook") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 7"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 8"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 9"] + ".\n" + window.lang.body.social["field 20"];
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 10"] + ".";
                                }
                            }
                            var caption = window.lang.body.social["field 31"];
                            var data = "provider=" + provider + "&id=" + c_logid + "&caption=" + caption + "&description=" + message;
                        } else if (provider == "Twitter") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 11"].replace("***", puzzle_disease) + " " + window.lang.body.social["field 20"] + "#Phylo #DNA #puzzles";
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 12"].replace("***", puzzle_disease) + " " + window.lang.body.social["field 20"] + "#Phylo #DNA #puzzles";
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 13"] + ".\"" + window.lang.body.social["field 20"] + "#Phylo #DNA #puzzles";
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 14"] + ".\"" + window.lang.body.social["field 20"] + "#Phylo #DNA #puzzles";
                                }
                            }
                            var data = "provider=" + provider + "&id=" + c_logid + "&description=" + message;
                        } else if (provider == "LinkedIn") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 15"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 16"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 17"] + ".\n" + window.lang.body.social["field 20"];
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 18"] + ".\n" + window.lang.body.social["field 20"];
                                }
                            } //var caption = window.lang.body.social["field 26"];
                            //var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
                            var data = "provider=" + provider + "&id=" + c_logid + "&description=" + message;
                        } else if (provider == "Google") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 15"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 16"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 17"] + ".\n" + window.lang.body.social["field 20"];
                                } else {
                                    var message = fullname.replace("+", " ") + " " + window.lang.body.social["field 18"] + ".\n" + window.lang.body.social["field 20"];
                                }
                            }
                            //var caption = window.lang.body.social["field 26"];
                            //var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
                            var data = "provider=" + provider + "&id=" + c_logid + "&description=" + message;
                        }
                        var options = {
                            message: window.lang.body.social["field 22"] + "<br/>via "+provider +"<br/>\n" + message,
                            buttons: {
                                confirm: {
                                    label: window.lang.body.social["field 25"],
                                    class : "btn-success",
                                    callback: function() {
                                        $.ajax({
                                            type: "POST",
                                            url: "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
                                            data: data,
                                        }).done(function(re) {
                                            //bootbox.alert("Your achievement has been posted!");
                                        }).fail(function() {
                                            bootbox.alert(window.lang.body.social["field 23"]);
                                        });
                                    }
                                },
                                cancel : {
                                    label: window.lang.body.social["field 27"],
                                }
                            }
                        };
                        bootbox.dialog(options);
                    });
                } 
                else if (provider === "Classic") {
                    var options = {
                        message: window.lang.body.social["field 44"],
                        buttons: {
                            ok: {
                                
                            },
                        }
                    };
                    bootbox.dialog(options);
                } else {
                    if (DEBUG)
                        console.log(window.lang.body.social["field 28"].replace("***", provider));
                    return;
                }
            } else {
                bootbox.alert(window.lang.body.social["field 29"]);
                // delete cookie (just to be safe)
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
                $("#login-tag").html(window.lang.body.play.gameselect.login["field 2"]);
                $(".showInLogin").hide();
                return;
            }
        },
		//events for the end game messages
		//new game or replay game
        events: function() {
            var self = this;
            langFiles = window.lang.body.play.gameselect["end of game"];
            // $("#endGame-learnMore-content").hide();

                    $("#endGame-new button").html(langFiles["field 11"]).unbind().click(function() {
                        //window.location.reload(true);
                        $("#game").hide();
                        $("#endGame").fadeOut();
                        interactiveMenu.restart();
                        $("#draw").show();
                        $("#menu").fadeIn();
                        //window.location.hash = "#!play";
                    });

                    $("#endGame-replay button").html(langFiles["field 12"]).unbind().click(function() {
                        $.main.clear();
                        $("#endGame").fadeOut();
                        $("#tree").html("");
                        $("#gameBoard").html("<img src='assets/img/loading.gif'/>");
                        $.protocal.replay();
                        $("#countDown-text").html("<img src='assets/img/loading.gif'/>");
                        $("#countDown").fadeIn();
                    });

                    // $("#endGame-submitter button").html(langFiles["submitter"]).unbind().click(function(){
                    //     window.location = self.submitterLocation;
                    // });

                    $("#endGame-share button").html(langFiles["field 13"]).unbind().click(function() {
                        if (DEBUG)
                            console.log("Click share event");
                        $.endGame.share('test');
                    });
        },
        //a pop up message to check if really want to bail out from the game
        runAway: function() {
            $("#runaway").unbind().click(function() {
                // $.helper.popUp(window.lang.body.misc["field 19"], function(status) {
                //  if(status == "ok") {
                //      $.endGame.bail();
                //      $.timer.active = false;
                //  }
                // });
                options = {
                    message: window.lang.body.misc["field 19"],
                    buttons: {
                        confirm: {
                            label: window.lang.body.misc["field 18"],
                            callback: function() {
                                $.timer.active = false;
                                $.endGame.bail();
                            }
                        },
                        cancel: {
                            label: window.lang.body.misc["field 16"],
                        }
                    }
                };
                bootbox.dialog(options);

            });
        }

    };
})();
