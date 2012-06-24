(function(){
	$.endGame = {
		init : function(status) {
			var url = "../phpdb/phyloDB2.php";
			var context="";
			var self = this;
			if(status == "win") {			
				$.post(url,{ "mode" : 4, "id" : $.phylo.id, "user" : window.guest, "align" : self.getJsonAlignments(), "score" : $.phylo.score },function(data) {
					var json = {};
					try {
						json = eval("["+data+"]")[0];
					} catch(err) {
						if(DEBUG)
							console.log("error parsing");
						return;	
					};
					var endGameContext = lang[0].body.play.gameselect["end of game"];
					context+= endGameContext["field 5"].replace("***","<label class='end-color'>"+$.phylo.id+"</label>") +
						" <label class='end-color'>"+json.disease_link+"</label>.<br><br>"+endGameContext["field 6"].replace("***","<label class='end-color'>"+json.play_count+"</label>").replace(".",".<br>").replace("***","<label class='end-color'>"+json.fail_count+"</label>") +"<br><br>"+
						endGameContext["field 7"].replace("***","<label class='end-color'>"+json.best_score+"</label>")+"<br>"+
						endGameContext["field 8"].replace("***","<label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>") +"<br><br>"+
						endGameContext["field 9"].replace("***","<label class='end-color'>"+json.highscore_user+"</label>");
					self.render(context);
				});
			} else {
				$.post(url,{ "mode" : 3, "id" : $.phylo.id },function(data) {
					var json = {};
					try {
						json = eval("["+data+"]")[0];
					} catch(err) {
						if(DEBUG)
							console.log("error parsing");
						return;
					}
					var endGameContext = lang[0].body.play.gameselect["end of game"];
						context += endGameContext["field 5"].replace("***","<label class='end-color'>"+$.phylo.id+"</label>") +
							"<label class='end-color'>"+json.disease_link+"</label>.<br><br>"+
							endGameContext["field 6"].replace("***","<label class='end-color'>"+json.play_count+"</label>").replace("***","<label class='end-color'>"+json.fail_count+"</label>")+"<br><br>"+
							endGameContext["field 7"].replace("***","<label class='end-color'>"+json.best_score+"</label>")+"<br><br>"+
							endGameContext["field 8"].replace("***","<label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>")+"<br><br>"+
							endGameContext["field 9"].replace("***","<label class='end-color'>"+json.highscore_user+"</label>")+"<br><br>";
					self.render(context);

				});

			}
		},
		render : function(x) {
			$("#endGame-text").html(x);
		//	$("#endGame").show("slide", {direction: "down"},300);	
			$("#endGame").fadeIn("fast");
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
						str+= this.convertColor(grid[i][j].backgroundColor);
					}
				}
				str+='"';
				if(i<grid.length-2)
					str+=',';
			}
			return '{ "alignments" : '+str+']}';
		},
		convertColor : function(color){
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
		}
			
	}
})();
