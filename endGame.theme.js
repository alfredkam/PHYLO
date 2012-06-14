(function(){
	$.endGame = {
		init : function(status) {
			if(status == "win") {
				
			} else {

			}
		},
		render : function(x) {
			$("#endGame-text").html(x);
		//	$("#endGame").show("slide", {direction: "down"},300);	
			$("#endGame").fadeIn("fast");
		}
	}
})();
