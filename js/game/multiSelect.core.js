(function() {
	$.multiSelect = {
		//statsthe multi select listener
		active : function() {
			var self= this;
			$("#movingParts").append("<div id='chosenArea'></div>");
			$("#game").unbind().dblclick(function(e) {
				e = $.events.getMultiSelectFingerPos(e);
				self.startTheEvents(e);								
			});	
		},
		//start the select capture
		startTheEvents : function(e) {
			var self = this;
			$("#selectBox").css({
				top: e.pageY,
				left: e.pageX,
				height: 0,
				width : 0
			});
			var origin = {
				Y : e.pageY,
				X: e.pageX
			}
			$("#selectBox").show();
			$("#game").mousemove(function(e) {
				e = $.events.getMultiSelectFingerPos(e);
				if(e.pageY-origin.Y > 0 && e.pageX - origin.X > 0 ) {
					$("#selectBox").css({
						height : e.pageY-origin.Y,
						width: e.pageX - origin.X
					});	
				} else if(e.pageY-origin.Y < 0 && e.pageX - origin.X < 0 ) {
					$("#selectBox").css({
						top : e.pageY,
						left: e.pageX,
						height: origin.Y-e.pageY,
						width: origin.X -e.pageX,
					});
				} else if(e.pageY-origin.Y < 0 && e.pageX - origin.X > 0) {
					$("#selectBox").css({
						top:e.pageY,
						height: origin.Y - e.pageY,
						width: e.pageX - origin.X
					});
				} else if(e.pageY-origin.Y > 0 && e.pageX - origin.X < 0) {
					$("#selectBox").css({
						left:e.pageX,
						height : e.pageY - origin.Y,
						width: origin.X - e.pageX,
					});
				} 
			});
			$("#game").click(function() {
				$(this).unbind("mousemove");
				$(this).unbind("click");
				//snaps the capture	
				self.capture();
				$("#selectBox").hide();
			});
		},
		//captures the select grids
		capture : function() {
			var box = {
				X: parseInt($("#selectBox").css("left").replace(/px/,"")) - parseInt($("#tree").css("width").replace(/px/,""))-5,
				Y: parseInt($("#selectBox").css("top").replace(/px/,"")) - 20,
				H: parseInt($("#selectBox").css("height").replace(/px/,"")),
				W: parseInt($("#selectBox").css("width").replace(/px/,"")),
			};	
			var select = {
				X: 1000,
				Y: 1000,
				H: -1,
				W: -1,
			}
			var list = [];
			$(".current > .sequence").each(function() {
				var self = this;
				//gets cordinates
				var row = parseInt($(this).parent().attr("id").replace(/row/,""));
				var curr = {
					X: parseInt($(this).css("left").replace(/px/,"")),
					Y: 34*row,
					H: parseInt($(this).css("height").replace(/px/,"")),
					W: parseInt($(this).css("width").replace(/px/,""))
				};
				//gets if in the box
				if(box.Y <= curr.Y && curr.Y+curr.H <= box.Y+box.H 
				     && box.X <= curr.X && curr.X+curr.W <= box.X+box.W) {
					list.push(self);
					if(curr.X < select.X) {
						select.X = curr.X;
					}	
					if(curr.Y < select.Y) {
						select.Y = curr.Y
					}
					if(curr.Y+curr.H > select.H) {
						select.H = curr.Y+curr.H;
					}
					if(curr.X+curr.W > select.W) {
						select.W = curr.X+curr.W;
					}
				}
			});	
			select.H -= select.Y;
			select.W -= select.X;
			if(list.length == 0) {
				$("#chosenArea").hide();
				return;
			}
			$("#chosenArea").css({
				top : select.Y,
				left : select.X,
				width : select.W,
				height : select.H,
			});
			$("#chosenArea").show();

			var tellMeHowToMove = {
				clear : function(x,y) {
					this.storage = [];	
					this.offsetX = y;
					this.pageX = x;
				},
				calculation : function(x) {	
					if(this.storage[x] == null) {
						var left = parseInt($(x).css("left").replace(/px/,""));
						var diff = this.pageX-this.offsetX-left+select.W;
						this.storage[x] = Math.abs(diff);
					} else {
						return this.storage[x];
					}	
				},
				storage : []	
			};


			//moving the red box
			$.events.touch("#chosenArea", {
				start: function(e) {
					var offsetX = e.pageX - select.X;
					tellMeHowToMove.clear(e.pageX,offsetX);
					$.events.touch(document,{
						move: function(e) {
							$("#chosenArea").css({
								left: e.pageX-offsetX,	
							});
							for(var i = 0;i<list.length;i++) {
								//console.log(select.W-tellMeHowToMove.calculation(list[i]));
								$.physics.move(list[i], {
									pageX : e.pageX, //-tellMeHowToMove.calculation(list[i]),
									pageY : e.pageY
								});
							}
							
						},
						end : function(e) {
							$.events.untouch(document,"move");		
							list = [];
						},
					}); 
				}
			});
		}
	};	
})();
