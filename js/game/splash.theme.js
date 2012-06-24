(function() {
	$.splash = {
		countDown : function(fn) {
			var i=1;
			$.splash.count = function() {
				if(i==4) {
					$("#countDown").fadeOut("fast");
					fn();
				} else {
					$("#countDown-text").html(i);
					i+=1;
					setTimeout($.splash.count,1000);
				}
			}
			setTimeout($.splash.count,1000);
		},
	}

})();
