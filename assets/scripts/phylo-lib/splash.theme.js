(function() {

	$.splash = {
		//does the splash screen count down to start the game
		countDown: function(fn) {
			var i = 3;
			$("#countDown-text").html(3);
			$.splash.count = function() {
				if ($.cookie.read("music-level")) {
					try {
						var volume = $.cookie.read("countdownVol");
						document.getElementById("startSound").volume = volume;
						document.getElementById("countdownSound").volume = volume;

					} catch (err) {}
				}

				if (i == 0) {
					document.getElementById("startSound").play();
					document.getElementById("game-audio").play();
					$("#countDown").fadeOut("fast");
					console.log($.cookie.read("hasPlayed"));
					if($.cookie.read("hasPlayed")===""){
						$("#moveListener").trigger("showTut");
					}
					fn();
				} else {
					$("#countDown-text").html(i);
					document.getElementById("countdownSound").play();
					if(DEBUG){
						console.log("counting down")
					}
					i -= 1;

					setTimeout($.splash.count, 1000);
				}
			}
			setTimeout($.splash.count, 1000);
		},
	}

})();