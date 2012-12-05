(function() {
	$.stage = {
		//the current stage
		current : -1,
		//end stage
		last : 0,
		//initiates the next stage
		round : function() {	
			//for testing
			if(this.current < this.last){
				this.current+=1;
				this.set(this.current);
			} else if(this.current === this.last) {
				this.end = true;
				$.timer.stop();
				$.endGame.complete();
				return "end game";
			} 
		}, 
		//sets up the next stage
		set : function(x) {	
			if(x == 0)
				$.timer.start();
			$.engine.deActive();
			$(".boardRow").removeClass("current").removeClass("blocked");
			var show = function(n) {
				var tree = $.phylo.tree[n];
				if(tree.child == 0) {
					$("#row"+tree.node1).hide().show("slide",{direction: "right"}, 500);
					$("#row"+tree.node2).hide().show("slide",{direction: "right"}, 500);
				} else if(tree.child == 1) {
					$("#row"+tree.node1).hide().show("slide",{direction: "right"}, 500);
				}
			};
			var addClass = function(n) {
				var tree = $.phylo.tree[n];
				if(tree.child == 0) {
					$("#row"+tree.node1).removeClass("hidden").addClass("current");
					$("#row"+tree.node2).removeClass("hidden").addClass("current");
				} else if(tree.child == 1) {
					$("#row"+tree.node1).removeClass("hidden").addClass("current");
					addClass(tree.node2);
				} else if(tree.child == 2){
					addClass(tree.node1);
					addClass(tree.node2);
				}
			}
			this.splash(x);
			show(x);
			addClass(x);
			if(x == 0) {
				$("#bg").show("slide",{direction : "left"},400);
			}
			$(".boardRow").each(function() {
				if($(this).hasClass("hidden") == false && $(this).hasClass("current") == false) {
					$(this).addClass("blocked");
				}
			});
			var x = $.phylo.tree[x];
			$.engine.active();
			$.tree.buildAncestor();
			var tmp = [];
			$.phylo.bestTrack = [];
			for(var i=0;i<8;i++) {
				var t = [];
				for(var j=0;j<25;j++) 
					t.push(0);
				tmp.push(t);
				$.phylo.bestTrack.push(t);
			}
					
			$.helper.copy(tmp, $.sequence.track);
			//var tmp = $.sequence.track.slice(0);
			$.helper.copy($.sequence.track, $.phylo.origin);
			//$.sequence.track = $.phylo.origin.slice(0);
			//set par score
			var par = $.fitch.score();
			$.helper.copy($.sequence.track, tmp);
			//$.sequence.track = tmp.slice(0);
			$.sequence.par = par;
			$.board.par(par);
			var score = $.fitch.score();
			$.phylo.bestScore = score;
			$.board.score(score);
			//
			$.helper.copy($.phylo.bestTrack, $.sequence.track);
			//$.phylo.bestTrack = $.sequence.track.slice(0);
			$.board.bestScore(score);
			if(score >= par) {
				$.board.approve();
			} else {
				$.board.unapprove();
			}
			$.board.stats();
		},
		//to tell if the game ended yet
		end : false,
		//the next stage splash notification
		splash: function(x) {
			$("#splash").html("Stage "+(x+1)).show();
			window.setTimeout(function(){
				$("#splash").fadeOut("fast");
			},800);
			
		}
	};
})();
