(function(){
	$.events = {
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
										$("#red"+id).show("fast");
										$.physics.move(self,e);
									},
									end : function(e) {
										$("#red"+id).hide("fast");
										$.events.untouch(document, "move");
										$.events.untouch(document, "end");
										$.physics.snap();
										$.fitch.algo();
									}
								});
							}
						});
					} 
				});
			});
		},
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
		touch : function(element, fn) {
			var touchStart = 'ontouchstart' in document.documentElement;
			var touchMove = 'ontouchmove' in document.documentElement;
			var touchEnd = 'ontouchend' in document.documentElement;
			var mouseDown = 'onmousedown' in document.documentElement;
			var mouseMove= 'onmousemove' in document.documentElement;
			var mouseUp = 'onmouseup' in document.documentElement;
			if(fn.start != undefined) {
				if(mouseDown)
					$(element).mousedown(function(e) {
						fn.start(e);			
					});
				if(touchStart)  {
					$(element).touchstart(function(e) {
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.start(e);
					});
				}
			}
			if(fn.move !=undefined) {
				if(mouseMove)
					$(element).mousemove(function(e) {
						fn.move(e);
					});
				if(touchMove)
					$(element).touchmove(function(e) {
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.move(e);
					});
			}			
			if(fn.end !=undefined) {
				if(mouseUp)
					$(element).mouseup(function(e) {
						fn.end(e);
					});
				if(touchEnd)
					$(element).touchend(function(e) {	
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.end(e);	
					});
			}
		},
	}
})();
