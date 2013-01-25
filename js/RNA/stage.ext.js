(function() {
	$.stage.rna = {
		current : -1,
		last : 1,
		round : function() {
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
		set : function() {
			$.engine.deActive();
			$(".boardRow").removeClass("current").removeClass("blocked");
			//temporary 
			$(".boardRow").removeClass("hidden").addClass("current");
			$.engine.active();
		}
	}
})();
