(function() {
	$.stage = {
		current : -1,
		last : 0,
		round : function() {	
			//for testing
			console.log(this.current + " <> "+this.last);
			if(this.current <this.last){
				this.current+=1;
				this.set(this.current);
			} else if(this.current === this.last) {
				this.set(this.current);
			} else {
				this.end = true;
				return "end game";
			} 
		}, 
		set : function(x) {	

			//$(".row").addClass("current");
			$.engine.deActive();
			$(".row").removeClass("current").removeClass("blocked");
			var show = function(n) {
				var tree = $.phylo.tree[n];
				if(tree.child == 0) {
					$("#row"+tree.node1).show('slide',{direction: 'right'}, 500);
					$("#row"+tree.node2).show('slide',{direction: 'right'}, 500);
				} else if(tree.child == 1) {
					$("#row"+tree.node1).show('slide',{direction: 'right'}, 500);
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
			show(x);
			addClass(x);
			window.setTimeout(function() {
				$("#bg").css({visibility: "visible"});
			},200);
			$(".row").each(function() {
				if($(this).hasClass("hidden") == false && $(this).hasClass("current") == false) {
					$(this).addClass("blocked");
				}
			});
			var x = $.phylo.tree[x];
			$.engine.active();
			$.tree.buildAncestor();
			//set par score
			var tmp = $.sequence.track.slice(0);
			$.sequence.track = $.phylo.origin.slice(0);
			var par = $.fitch.score();
			$.sequence.track = tmp.slice(0);
			$.sequence.par = par;
			$.board.par(par);	
			$.board.score($.fitch.score());
		},
		end : false,
	};
})();
