(function() {
	var sound = new Audio("/assets/sounds/level_complete_2.wav"); // buffers automatically when created
	$.splash = {
		//does the splash screen count down to start the game
		countDown : function(fn) {
			var i=3;
			$("#countDown-text").html(3);
			$.splash.count = function() {
				if(i==0) {
					$("#countDown").fadeOut("fast");
					fn();
				} else {
					$("#countDown-text").html(i);
					sound.play();
					console.log("counting down")
					i-=1;

					setTimeout($.splash.count,1000);
				}
			}
			setTimeout($.splash.count,1000);
		},
	}

})();
