(function() {
	$.multiSelect = {
		active : function() {
			var self= this;
			$("#game").unbind().dblclick(function(e) {
				self.startTheEvents(e);								
			});	
		},
		startTheEvents : function(e) {
			$("#selectBox").css({
				top: e.pageY,
				left: e.pageX
			});
			var origin = {
				top : e.pageY,
				left: e.pageX
			}
			$("#selectBox").show();
			$("#game").mousemove(function(e) {
				console.log(origin.left +">"+e.pageX + "<>"+origin.top+">" +e.pageY);
				$("#selectBox").css({
					height : origin.top-e.pageY,
					width: origin.left-e.pageX
				});	
			});
			$("#game").click(function() {
				$(this).unbind("mousemove");
				$(this).unbind("click");
			});
		},
	};	
})();
