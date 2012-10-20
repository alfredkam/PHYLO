(function () {
	$.html5 = {};
	$.html5.score = {
		settings : {
			wBox: 827,
			hBox: 50,
			w : 827/12.5,
		},
		setScore : function(newScore) {
					
		},
		init : function() {
			this.draw(15);
		},
		draw : function(score) {
			var canvas = document.getElementById("score");
			var c = canvas.getContext("2d");
			c.globalAlpha = 1;			
			this.drawScale(c);
		},
		drawScale : function(c) {
			var self = this;
			c.beginPath();
			for(var i=1;i<13;i++) {
				c.moveTo(self.settings.w*i,0);
				c.lineTo(self.settings.w*i,50);
			}
			c.strokeStyle = "white";
			c.stroke();
			c.closePath();
		},
	};
})();
