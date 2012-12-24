(function() {
	//counts how many seconds has passed
	$.timer = {
		elapsed : 0 ,
		active : false,
		count : function() {
			this.elapsed+=1;
		},
		start : function() {
			if($("#game").length != 0) {	
			this.elapsed  = 0;
			this.timer = setInterval('$.timer.count()',1000);
			this.active = true;
			}
		},
		stop : function() {
			clearInterval(this.timer);
			this.active = false;
		},
	}
})();
