
(function(){
	$.endGame = {
		//dusplays message of completing the game
		complete : function() {
			$.protocal.sendEndGameScore("completed", function(data) {
				console.log(data);
				this.events();
				this.score();
				var msg = "You have solved the puzzle";
				$("#endGame-text").html(msg);
				$("#endGame-learnMore-content").html("This disease is related to diseases etc, you are helping...etc");
				$("#endGame").fadeIn();
			});

		},
		//displays message of bailing out
		bail : function() {
			$.protocal.sendEndGameScore("bail", function(data) {
				this.events();
				this.score();
				var msg = "Sucks you couldnt sove it.";
				$("#endGame-text").html(msg);
				$("#endGame-learnMore-content").html("This disease is related to diseases etc, you are helping...etc");
				$("#endGame").fadeIn();
			});

		},
		//scores the game
		score : function() {
			//gets current score		
			var setDefault = "<i class='icon-star-empty'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>";	
			$("#endGame-score-result").html(setDefault);
			
			var currentScore = $.phylo.currentScore;
			var par = $.sequence.par;
		},
		//events for the end game messages
		//new game or replay game
		events : function() {
			$("#endGame-new button").unbind().click(function() {
				$.main.clear();
				$("#endGame").fadeOut();
				$("#tree").html("");
				$("#gameBoard").html("<img src='img/loading.gif'/>");
				$.protocal.request();
				$("#countDown-text").html("<img src='img/loading.gif'/>");
				$("#countDown").fadeIn();
			});
				
			$("#endGame-replay button").unbind().click(function(){
				$.main.clear();
				$("#endGame").fadeOut();
				$("#tree").html("");
				$("#gameBoard").html("<img src='img/loading.gif'/>");
				$.protocal.replay();
				$("#countDown-text").html("<img src='img/loading.gif'/>");
				$("#countDown").fadeIn();
			});	
		},
		//a pop up message to check if really want to bail out from the game
		runAway : function() {
			$("#runaway").unbind().click(function() {
				$.helper.popUp("You sure you want to bail out from this puzzle?", function(status) {
					if(status == "ok")
						$.endGame.bail();
				});
			});	
		}
	}
})();
