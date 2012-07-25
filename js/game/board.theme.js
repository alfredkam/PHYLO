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
		},
		bestScore : function(x) {
			$("#bestScore").html("Best: "+ x);
			
			if($.stage.current == $.stage.last) {
				$.protocal.sendHighScore();
			}
		},
		par : function(x) {
			$("#parScore").html("Par: "+ x);
		},
		stats : function() {
			$("#statsPanel").html("Stats - Stage: "+($.stage.current+1)+"/"+($.stage.last+1));	
		},
		startListener: function() {
			$("#volumeOff").hide();
			$("#volumeOn").click(function() {
				$("#volumeOn").hide();
				$("#volumeOff").show();
			});
			$("#volumeOff").click(function() {
				$("#volumeOff").hide();
				$("#volumeOn").show()
			});
			$("#cycle").click(function(){
				$.helper.copy($.sequence.track, $.phylo.bestTrack);
				//$.sequence.track = $.phylo.bestTrack.slice(0);
				$.board.score($.phylo.bestScore);
				$.physics.snapRandom();
				if($.phylo.bestScore >= $.sequence.par)
					$.board.approve();
				
			});
			$("#star").click(function(){
				if($(this).hasClass("pass")) {
					$.stage.round();
				}
			});
	//		$.timer.start();
		},
		approve : function() {
			this._upapproved = false;
			var self = this;
			var unapprove_test = function() {
				if(self._unapproved == true) {
					$("#star").removeClass("pass");
					$("#star").css({
						opacity : 0.4
					});
					return true;
				} 	
				return false;
			};
			$("#star").addClass("pass");
			$("#star").animate({
				opacity: 1
			},300, function(){
				$("#star").animate({
					opacity: 0.2
				},300,function() {
					$("#star").animate({
						opacity: 1
					},500,function() {
						$("#star").animate({
							opacity: 0.2
						},300,function() {
							$("#star").animate({
								opacity: 1
							},500,function(){
							});	
						});	
					});
				});
			});
		},
		unapprove : function() {
			this._unapproved = true;
			$("#star").removeClass("pass");
			$("#star").css({
				opacity : 0.4
			});
		},
		getJsonAlignments : function() {
			var grid = $.phylo.domCache;	
			var str = "[";
			for(var i=0;i<grid.length;i++) {
				str+='"';
				for(var j=0;j<grid[0].length;j++) {
					if(grid[i][j] == "x") {
						str+="-";
					} else {
						try{
						str+= this.convertColor(grid[i][j].backgroundColor);
						} catch(err) {};
					}
				}
				str+='"';
				if(i<grid.length-2)
					str+=',';
			}
			return '{ "alignments" : '+str+']}';
		},
		convertColor : function(color) {
			if(color == "#71B2E2")
				return "A";
			if(color == "#9932CC")
				return "G";
			if(color == "#008000")
				return "C";
			if(color == "#FFA500")
				return "T";
			if(color == "rgb(153, 50, 204)")
				return "G";
			if(color == "rgb(0, 128, 0)")
				return "C";
			if(color == "rgb(113, 178, 226)")
				return "A";
			if(color == "rgb(255, 165, 0)")
				return "T";
			return null;
		},
	};	
})();
