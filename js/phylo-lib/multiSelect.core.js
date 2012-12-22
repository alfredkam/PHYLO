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
		//deactive it 
		deactive : function() {
			$("#game").unbind();	
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
					//bottom right
					$("#selectBox").css({
						height : e.pageY-origin.Y,
						width: e.pageX - origin.X
					});	
				} else if(e.pageY-origin.Y < 0 && e.pageX - origin.X < 0 ) {
					//top left
					$("#selectBox").css({
						top : e.pageY-10,
						left: e.pageX,
						height: origin.Y-e.pageY,
						width: origin.X -e.pageX,
					});
				} else if(e.pageY-origin.Y < 0 && e.pageX - origin.X > 0) {
					//top right
					$("#selectBox").css({
						top:e.pageY,
						height: origin.Y - e.pageY,
						width: e.pageX - origin.X
					});
				} else if(e.pageY-origin.Y > 0 && e.pageX - origin.X < 0) {
					//bottom left
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
				Y: parseInt($("#selectBox").css("top").replace(/px/,"")) - 110,
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
			var list2 = [];
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
				if(
					(	//when red box inside the cell
						curr.Y <= box.Y && box.Y+box.H <= curr.Y+curr.H 
				     		&& curr.X <= box.X && box.X+box.W <= curr.X+curr.W
					)	||
					(	//capturing it when redbox area greater then selected cells
						box.Y <= curr.Y && curr.Y <= box.Y+box.H 
				     		&& box.X <= curr.X && curr.X <= box.X+box.W
					)	||
					(	//top left corner
						curr.Y <= box.Y && box.Y <= curr.Y+curr.H 
						&& curr.X <= box.X && box.X <= curr.X+curr.W
					)	||
					(	//top right corner
						curr.Y <= box.Y && box.Y <= curr.Y+curr.H 
						&& curr.X <= box.X+box.W && box.X+box.W <= curr.X+curr.W
					)	||
					(	//top middle
						curr.Y <= box.Y && box.Y <= curr.Y+curr.H 
						&& box.X <= curr.X && curr.X <= box.X+box.W
					)	||
					(	//bottom left
						box.Y <= curr.Y && curr.Y <= box.Y+box.H
						&& curr.X <= box.X && box.X <= curr.X+curr.W
					)
				) {
					list.push(self);
					list2.push($(self).attr("id"));
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

			//moving the red box
			$.events.touch("#chosenArea", {
				start: function(e) {
					var offsetX = e.pageX - select.X;
					$.events.touch(document,{
						move: function(e) {
							$.physics.shift_select(list,list2, {
								old : parseInt($("#chosenArea").css("left").replace(/px/,"")),
								new : e.pageX - offsetX,
								obj : $("#chosenArea") 
							});
						},
						end : function(e) {
							$.events.untouch(document,"move");		
							$.events.untouch("#chosenArea","start");
							list = [];
							list2 = [];
							$("#chosenArea").hide();
							$.physics.snap("mutli");
							var score = $.fitch.score();
							$.board.score(score);
							$.board.stats();
							if($.phylo.bestScore < score) {
								$.phylo.bestScore = score;
								$.helper.copy($.phylo.bestTrack, $.sequence.track);
								$.board.bestScore(score);
							}
							if(score >= $.sequence.par){
								$.board.approve();
							} else {
								$.board.unapprove();
							}
						},
					}); 
				}
			});
		}
	};	
})();
