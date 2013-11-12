function initHTMLElements(){
    var settings = new Settings();
    
    var applyWithDefault = function(key, def, cls){
        var val = settings.get(key);
        if (val == null){
            $("#" + def).addClass(cls);
            settings.set(key, def);
            return def;
        }else{
            $("#" + val).addClass(cls);
            return val;
        }
    }

    $("#stats-submit").click(function(event){
        $.ajax("submit.php", {
	       "type": "POST",
	       "success": function(data, textStatus, jqXHR){
		   var infos = $.parseJSON(data);
		   var puzzle_disease = infos.disease_link;
		   var puzzle_disease_category = infos.disease_category;
		   var puzzle_playcount = infos.play_count;
		   var puzzle_score = infos.score;
		   var puzzle_highscore = infos.game_highscore;
		   var puzzle_id = infos.bio_id;

		   var summarytext = "Thank you! Your alignment has been submitted. You played the block " + puzzle_id + ".<br/>\n";
		   
		   if (puzzle_score == puzzle_highscore) {
		       var newhighscoretext = "You received the new highscore!<br/>\n";
		   } else {
		       var newhighscoretext = "";
		   }

		   if (puzzle_disease) {
		       if (puzzle_disease_category) {
			   var diseaseinfo = "This blocks was associated with a " + puzzle_disease_category + " disease \"" + puzzle_disease + "\".<br/>\n";
		       } else {
                           var diseaseinfo = "This blocks was associated with the \"" + puzzle_disease + "\" disease.<br/>\n";
		       }
		   } else {
                       if (puzzle_disease_category) {
			   var diseaseinfo = "This blocks was associated with a " + puzzle_disease_category + " disease.<br/>\n";
		       } else {
			   var diseaseinfo = "";
		       }
		   }

		   var statinfo = "This blocks has been played " + puzzle_playcount + " times, and the highest score is " + puzzle_highscore + ".<br/>\nYour score is " + puzzle_score + ".<br/>\n";

		   var feedbacktext = summarytext.concat(newhighscoretext,diseaseinfo,statinfo);

		   bootbox.dialog(feedbacktext, [{
			        "label" : "Share!",
				"class" : "btn-success",
				"icon"  : "icon-share icon-white",
				"callback": function() {
				    if($.cookie.read("username")) {
					var username = $.cookie.read("username");
					var fullname = $.cookie.read("fullname");
					var provider = $.cookie.read("loginmode");
					var c_logid = $.cookie.read("logid");
				     
					if (provider=="Facebook") {
					    if (puzzle_score == puzzle_highscore) {
						var statusmsg = fullname.replace("+"," ") + " received a new highscore at Phylo";
					    } else {
						var statusmsg = fullname.replace("+"," ") + " played Phylo";
					    }
					    if (puzzle_disease) {
						var bodymsg = " and helped to improve a DNA alignement related to a disease named \"" + puzzle_disease + "\".\nPlay Phylo and help genetic research!";
					    } else if (puzzle_disease_category)  {
                                                var bodymsg = " and helped to improve a DNA alignement related to " + puzzle_disease_category + " diseases.\nPlay Phylo and help genetic research!";
					    } else {
						var bodymsg = ".\nPlay Phylo and help genetic research!";
					    }
					    var message = statusmsg + bodymsg;
					    var caption = "DNA puzzles";
					    var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
					    bootbox.confirm("Phylo will update your status:<br/>\n" + message,"Cancel","Post", function(result) {
						    if (result) {
							console.log("post on " + provider + " : " + message);
							$.ajax({
							    type: "POST",
							    url : "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
						     	    data : data,
							}).done(function(re) {
							    bootbox.alert("Your achievement has been posted!");
							}).fail(function() {
							    bootbox.alert("We are sorry. We have not been able to post your achievement.");
							});
						    }
						});
					} else if (provider=="Twitter") {
					    var message = "Improved a DNA alignments related to \"" + puzzle_disease + "\".";
					    var data = "provider="+provider+"&id="+c_logid+"&description="+message;
					    bootbox.confirm("Phylo will update your status: " + message,"Cancel","Tweet", function(result) {
						    if (result) {
							console.log("post on " + provider + " : " + message);
							$.ajax({
							    type: "POST",
							    url : "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
							    data : data,
							}).done(function(re) {
							    bootbox.alert("Your achievement has been posted!");
							}).fail(function() {
							    bootbox.alert("We are sorry. We have not been able to post your achievement.");
							});
						    }
						});
					} else if (provider=="LinkedIn") {
					    var message = fullname.replace("+"," ") + " used Phylo and improved a DNA alignments related to \"" + puzzle_disease + "\".";
					    var data = "provider="+provider+"&id="+c_logid+"&description="+message;
					    bootbox.confirm("Phylo will update your status: " + message,"Cancel","Post", function(result) {
						    if (result) {
							console.log("post on " + provider + " : " + data);
							$.ajax({
							    type: "POST",
							    url : "http://phylo.cs.mcgill.ca/phpdb/hybridauth/signin/feed.php",
							    data : data,
						        }).done(function(re) {
							    bootbox.alert("Your achievement has been posted!");
							}).fail(function() {
							    bootbox.alert("We are sorry. We have not been able to post your achievement.");
							});  
						    }
						});
					}
				    }
				}
			},
			{
			    "label" : "Continue",
			    "icon"  : "icon-play"
			},
			{
			    "label" : "Back to Menu",
			    "class" : "btn-primary",
			    "icon"  : "icon-book icon-white",
			     "callback": function() {
			     window.location = "http://phylo.cs.mcgill.ca/expert/playmenu.php";
			}
		}]);
            },
            "error": function(jqXHR, textStatus, errorThrown){
                bootbox.alert(textStatus);
            },
            "data": getCurrentState()
        })
    });
    
    $("#stage-redirect").bind("keydown", function(event) {
        var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
        if (keycode == 13) { // keycode for enter key
            var query = document.location.search.replace("?", "");
            var newQuery = "";
            if(query){
                var arr = query.split("&");
                for (var i in arr){
                    if(arr[i].indexOf("id") == -1){
                        newQuery += arr[i] + "&";
                    }
                }
            }
            var newLocation = "?" + newQuery + "id=" + $(this).val();
            document.location.search = newLocation;
            
            event.preventDefault();
            return false;
        } else  {
            return true;
        }
    }); // end of function
    
    $("#options-language-english").click(function(){
        $("#options-language-french").removeClass("active");
        $("#options-language-english").addClass("active");
        settings.set("options-language", this.id);
    })
    
    $("#options-language-french").click(function(){
        $("#options-language-english").removeClass("active");
        $("#options-language-french").addClass("active");
        settings.set("options-language", this.id);
    });
    
    applyWithDefault("options-language", "options-language-english", "active");
    
    var sizeHandler = function(size){
        return function(){
            var settings = new Settings();
            $("#options-size-xlarge").removeClass("active");
            $("#options-size-large").removeClass("active");
            $("#options-size-medium").removeClass("active");
            $("#options-size-small").removeClass("active");
            $(this).addClass("active");
            settings.set("options-size", this.id);
            resizeBoxes(size);
        };
    }
    
    $("#options-size-small").click(sizeHandler(20));
    
    $("#options-size-medium").click(sizeHandler(25));

    $("#options-size-large").click(sizeHandler(30));
    
    $("#options-size-xlarge").click(sizeHandler(40));
    
    var res = applyWithDefault("options-size", "options-size-small", "active");
    $("#" + res).click();
    
    
    $("#options-misc-subscore").click(function(){
        var elem = $(this);
        if (elem.hasClass("active")){
            args['ui_showscore'] = false;
            elem.removeClass("active");
            settings.set("options-misc-subscore", false);
        }else{
            args['ui_showscore'] = true;
            elem.addClass("active");
            settings.set("options-misc-subscore", true);
        }
        drawTree(tctx);
    });
    
    res = settings.get("options-misc-subscore");
    if (res == null){
        settings.set("options-misc-subscore", false);
    }else if (res){
        $("#options-misc-subscore").addClass("active");
    }
    args['ui_showscore'] = !!(settings.get("options-misc-subscore"));
    
    $(".collapse").collapse();
}