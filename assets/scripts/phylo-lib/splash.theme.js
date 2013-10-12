(function() {
	// var startSound = new Audio("assets/sounds/startSound.wav"); // buffers automatically when created

	// var countdownSound = new Audio("assets/sounds/countdownComplete.wav"); // buffers automatically when created
	var startSound = document.getElementById("startSound");
	var countdownSound = document.getElementById("countdownSound");
	$.splash = {
		//does the splash screen count down to start the game
		countDown: function(fn) {
			var i = 3;
			$("#countDown-text").html(3);
			$.splash.count = function() {
				if (i == 0) {
					startSound.play();
					$("#game-audio")[0].play();
					$("#countDown").fadeOut("fast");
					fn();
				} else {
					$("#countDown-text").html(i);
					document.getElementById("countdownSound").play();
					console.log("counting down")
					i -= 1;

					setTimeout($.splash.count, 1000);
				}
			}
			setTimeout($.splash.count, 1000);
		},
	}

})();