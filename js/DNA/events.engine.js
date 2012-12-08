(function(){
	$.events = {
		//cell moving listener
		move : function() {
			$(".current").each(function() {
				var id = parseInt(this.id.replace(/row/,""));
				$(this).children().each(function() {
					if($(this).hasClass("sequence")) {
						var self = this;
						$.events.touch(self,{
							start: function(e) {
								$.events.touch(document, {
									move: function(e) {
										$("#chosenArea").hide();
										$("#red"+id).show("fast");
										$.physics.move(self,e);
									},
									end : function(e) {
										$("#red"+id).hide("fast");
										$.events.untouch(document, "move");
										$.events.untouch(document, "end");
										$.physics.snap();
										var score = $.fitch.score();
										if($.phylo.bestScore < score) {
											$.phylo.bestScore = score;
											$.helper.copy($.phylo.bestTrack, $.sequence.track);
											$.board.bestScore(score);
										}
										$.board.score(score);
										$.phylo.currentScore=score;
										$.board.stats();
										if(score >= $.sequence.par){
											$.board.approve();
										} else {
											$.board.unapprove();
										}
											
									}
								});
							}
						});
					} 
				});
			});
		},
		//listener for un touch
		untouch : function(element,type) {
			var touchStart = 'ontouchstart' in document.documentElement;
			var touchMove = 'ontouchmove' in document.documentElement;
			var touchEnd = 'ontouchend' in document.documentElement;
			var mouseDown = 'onmousedown' in document.documentElement;
			var mouseMove= 'onmousemove' in document.documentElement;
			var mouseUp = 'onmouseup' in document.documentElement;
			if(type == "start") {
				if(mouseDown)
					$(element).unbind("mousedown");
				if(touchStart)
					$(element).unbind("touchstart");
			}
			if(type == "move") {
				if(mouseMove)
					$(element).unbind("mousemove");
				if(touchMove)
					$(element).unbind("touchmove");
			}
			if(type == "end") {
				if(mouseUp)
					$(element).unbind("mouseup");
				if(touchEnd)
					$(element).unbind("touchend");
			}
		},
		//listener for touch
		touch : function(element, fn) {
			var touchStart = 'ontouchstart' in document.documentElement;
			var touchMove = 'ontouchmove' in document.documentElement;
			var touchEnd = 'ontouchend' in document.documentElement;
			var mouseDown = 'onmousedown' in document.documentElement;
			var mouseMove= 'onmousemove' in document.documentElement;
			var mouseUp = 'onmouseup' in document.documentElement;
			var self = this;
			if(fn.start != undefined) {
				if(mouseDown)
					$(element).mousedown(function(e) {
						fn.start(self.getFingerPos(e));			
					});
				if(touchStart)  {
					$(element).bind("touchstart",function(e) {
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.start(self.getFingerPos(e));
					});
				}
			}
			if(fn.move !=undefined) {
				if(mouseMove)
					$(element).mousemove(function(e) {
						fn.move(self.getFingerPos(e));
					});
				if(touchMove)
					$(element).bind("touchmove",function(e) {
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.move(self.getFingerPos(e));
					});
			}			
			if(fn.end !=undefined) {
				if(mouseUp)
					$(element).mouseup(function(e) {
						fn.end(self.getFingerPos(e));
					});
				if(touchEnd)
					$(element).bind("touchend",function(e) {	
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.end(self.getFingerPos(e));	
					});
			}
		},
		//calculates the finger position
		getFingerPos : function(e) {
			var canvas = document.getElementById("game");
			var x = e.pageX - canvas.offsetLeft-185;
			var y = e.pageY - canvas.offsetTop;
			return { pageX : x , pageY: y}		
		},
		//calculates the finger position for selecting multi grids
		getMultiSelectFingerPos : function(e)  {
			var canvas = document.getElementById("game");
			var x = e.pageX - canvas.offsetLeft-5;
			var y = e.pageY - canvas.offsetTop-65;
			return { pageX : x , pageY: y}		
		}
	}
})();
