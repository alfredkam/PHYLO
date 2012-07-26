(function(){
	$.endGame = {
		complete : function() {
			this.events();
			var msg = "You have solved the puzzle";
			$("#endGame-text").html(msg);
			$("#endGame-learnMore-content").html("This disease is related to diseases etc, you are helping...etc");
			$("#endGame").fadeIn();

		},
		bail : function() {
			this.events();
			var msg = "Sucks you couldnt sove it.";
			$("#endGame-text").html(msg);
			$("#endGame-learnMore-content").html("This disease is related to diseases etc, you are helping...etc");
			$("#endGame").fadeIn();

		},
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
