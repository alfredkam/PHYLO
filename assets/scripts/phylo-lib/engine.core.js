(function() {
	$.engine = {
		//clears all touch event listeners
		deActive : function() {
			$(".current").each(function(){
				$(this).children().each(function() {
					if($(this).hasClass("sequence")) {
						var self = this;
						$.events.untouch(self,"start");
					}
				});
			});
		},
		//acitves the event listeners;
		active : function() {
			$.events.move();
		},
	};
})();
