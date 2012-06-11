(function() {
	$.stage = {
		current : -1,
		last : 0,
		round : function() {	
			//for testing
			this.current = this.last;
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
			$(".row").addClass("current");
			var x = $.phylo.tree[x];
			$.engine.deActive();
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
