(function() {
	var doc = document, win = window;
	$.board = {
		build : function() {
			var str = "";
			for(var i=0;i<10;i++) {
				str+="<div class='bgRow'>";
				for(var j=0;j<25;j++) {
					str+="<div class='bgCell' style='left:"+$.sequence.calcPos(j)+"px'></div>";	
				}
				str+="</div>";
			}				
			
			$("#gameBoard").html("<div id='bg'>"+str+"</div>");
			
		},	
		score : function(x) {
			$("#userScore").html("Score: "+ x);
			if(x > 0) {
				$("#userDraw").css({
					width: x,
					backgroundColor: "#FFFFFF",
					left: 100,
				});
			} else {
				$("#userDraw").css({
					width: Math.abs(x),
					left : x+100,
					backgroundColor: "#EF4136",
				});
			}
		},
		par : function(x) {
			$("#parScore").html("Par: "+ x);
			$("#parDraw").css({
				left:100+x,
			});
		}
	};	
})();
