(function() {
	$.stage = {
		current : -1,
		last : 0,
		round : function() {	
			//for testing
			this.current = this.last;
			if(this.current <=this.last){
				this.current+=1;
				this.set(this.current);
			} else {
				this.end = true;
				return "end game";
			} 
		}, 
		set : function(x) {
			$(".row").addClass("current");
			var x = $.phylo.tree[x];
			if(DEBUG)
				console.log(x);
			$.engine.deActive();
			$.engine.active();
			$.tree.buildAncestor();
		},
		end : false,
	};
})();
