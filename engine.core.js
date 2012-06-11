(function() {
	$.engine = {
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
		active : function() {
			$.events.move();
		},
	};
})();
