(function() {
	$.timer = {
		bgColor : "black",
		fillColor : "white",	
		timeInterval : 5,
		timeElapsed : 0,
		timeLimit : 90000,
		startAngle : -Math.PI/2,
		canvasInterval : null,
		cavasSize: 66,
		state : 90,
		start : function() {
			//not support in IE
			if(window.attachEvent)
				return false;
			var canvas = document.getElementById("timer");	
			var drawX = drawY = radius = this.canvasSize / 2;
			var c = canvas.getContext("2d");	
			c.globalAlpha = 1;
			c.beginPath();
			c.arc(drawX, drawY, radius, 0, Math.PI*2, true);
			c.closePath();
			c.fillStyle = this.bgColor;  
			c.fill();
			c.beginPath();
			c.arc(drawX,drawY, radius-5, 0, Math.PI*2, true);
			c.closePath();
			c.fillStyle = this.bgColor;
			c.fill();
			
			this.wedgeSize = (this.timeInterval / this.timeLimit) * Math.PI * 2;
			this.canvasInterval = setInterval('$.timer.update()',this.timerInterval);
			this.numberInterval = setInterval('$.timer.numberUpdate()', 1000);
		},
		numberUpdate : function() {
			this.state-=1;
			if(this.state == 0) {
				clearInterval(this.numberInterval);
			}
		},
		update : function() {
			if(this.timeElapsed >= (this.timeLimit)) {
				clearInterval(this.canvasInterval);	
				$.endGame.init("lose");
				//do something here
			}

			var drawX = drawY = radius = this.cavasSize / 2;
			var endAngle = this.startAngle + this.wedgeSize;
			var canvas = document.getElementById("timer");
			var c = canvas.getContext("2d");
			c.beginPath();
			c.moveTo(drawX, drawY);
			c.arc(drawX, drawY, radius, this.startAngle, endAngle, false);
			c.closePath();
			c.fillStyle = this.fillColor;
			c.fill();
			c.beginPath();
			c.arc(drawX,drawY, radius-5, 0, Math.PI*2, true);
			c.closePath();
			c.fillStyle = this.bgColor;
			c.fill();
			c.beginPath();
			if(this.state <= 15) 
				c.fillStyle = "#EF4136"; 
			else 
				c.fillStyle = this.fillColor;
				
	
			c.font = '20pt Helvetica';
			c.textBaseline = 'bottom';
			c.fillText(this.state,32,50);
			c.textAlign = 'center';
			c.closePath();
			this.timeElapsed = this.timeElapsed + this.timeInterval;
			this.wedgeSize = (this.timeElapsed / this.timeLimit) * Math.PI * 2;
		},
		stop : function() {
			clearInterval(this.numberInterval);
			clearInterval(this.canvasInterval);		
			this.timeInterval = 5;
			this.timeElapsed = 0;
			this.timeLimit = 90000;
			this.startAngle = -Math.PI/2;
			this.canvasInterval = null;
			this.state = 90;
		}
	};

})();
