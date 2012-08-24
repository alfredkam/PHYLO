(function() {
	$.multiSelect = {
		//statsthe multi select listener
		active : function() {
			var self= this;
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
				Y: parseInt($("#selectBox").css("top").replace(/px/,"")),
				H: parseInt($("#selectBox").css("height").replace(/px/,"")),
				W: parseInt($("#selectBox").css("width").replace(/px/,"")),
			};	
			var select = {
				X: 0,
				Y: 0,
				H: 0,
				W: 0,
			}
			console.log(box);
			$(".current > .sequence").each(function() {
				//gets cordinates
				var curr = {
					X: parseInt($(this).css("left").replace(/px/,"")),
					Y: parseInt($(this).offset().top),
					H: parseInt($(this).css("height").replace(/px/,"")),
					W: parseInt($(this).css("width").replace(/px/,""))
				};
				if(curr.Y  < box.Y && box.Y < curr.Y+curr.H) {
					select.Y = curr.Y;							
				}
				if(curr.X < box.X && box.X < curr.X+curr.W) {
					select.X = curr.X;							
				}
				//gets if in the box
				if(box.Y < curr.Y && curr.Y < box.Y+box.H) {
					select.H = curr.Y+curr.H; 
				}
				if(box.X < curr.X && curr.X < box.X+box.W) {
					select.W = curr.X+curr.W;
				}
			});	
			console.log(select);			
		}
	};	
})();
