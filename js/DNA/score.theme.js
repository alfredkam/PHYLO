(function () {
	$.html5 = {};
	$.html5.score = {
		settings : {
			wBox: 827,
			hBox: 50,
			w : 827/13.5,
			current : "#FF0000",
			par : "#FFB6C1",
			best : "#66CD00",
		},
		setScore : function(newScore) {
			this.draw(newScore);			
		},
		draw : function(score) {
			var self = this;
			var canvas = document.getElementById("score");
			var c = canvas.getContext("2d");
			c.globalAlpha = 1;			
			c.clearRect(0,0,self.settings.wBox,self.settings.hBox);
			this.setBorder();
			this.drawCurrent(c);
			this.drawPar(c);
			this.drawBest(c);
			this.drawScale(c);
			this.drawKey(c);
		},
		drawKey : function(c) {
			var self = this;
			c.beginPath();	
			c.fillStyle = self.settings.par;
			c.fillRect(0,15,10,5);
			c.font = "9pt Helvetica";
			c.fillStyle = "white";
			c.fillText("Par",16, 20);
			c.fillStyle = self.settings.current;
			c.fillRect(0,30,10,5);	
			c.font = "9pt Helvetica";
			c.fillStyle = "white";
			c.fillText("Score", 16, 35);
			c.fillStyle = self.settings.best;
			c.fillRect(0,45,10,5);
			c.font = "9pt Helvetica";
			c.fillStyle = "white";
			c.fillText("Best",16, 50);
			c.font = "20pt Helvetica";
			c.fillStyle = self.settings.current;
			c.fillText($.phylo.currentScore,780,35);
			c.closePath();
		},
		drawScale : function(c) {
			var self = this;
			c.beginPath();
			for(var i=1;i<13;i++) {
				if(i<=self.midPoint) {
					var change;
					if(self.midPoint == 4) {
						change = (self.midPoint-i)*5;
					} else {
						change = (self.midPoint-i)*3;
					}
					c.moveTo(self.settings.w*i,0+change);
					c.lineTo(self.settings.w*i,50-change);
				} else {
					var change;
					if(self.midPoint == 4) { 
						change = i*1.5;
					} else {
						change = ((i-self.midPoint))*5;
					}
					c.moveTo(self.settings.w*i,0+change);
					c.lineTo(self.settings.w*i,50-change);
				}
				if(i==1) {
					c.font = "9pt Helvetica";
					c.fillStyle = "white";
					c.fillText(self.minBorder,self.settings.w*i+3,50);
				}
				if(i==self.midPoint) {
					c.font = "9pt Helvetica";
					c.fillStyle = "white";
					c.fillText("0",self.settings.w*i+3,50);
				}
				if(i==12) {
					c.font = "9pt Helvetica";
					c.fillStyle = "white";
					c.fillText(self.maxBorder,self.settings.w*i+3,50);
				}
			}
			c.strokeStyle = "white";
			c.stroke();
			c.closePath();
		},
		getDistance : function(score) {
			var self = this;
			if(score < 0) {
				var max = self.settings.w*self.midPoint;  
				var min = self.settings.w*1;
				return -1*(max-min)/(Math.abs(self.minBorder))*Math.abs(score);						
			} else if(score >= 0 ) {
				var min = self.settings.w*self.midPoint;
				var max = self.settings.w*12;
				if(score < self.maxBorder) {
					return (max-min)/self.maxBorder*score;
				} else {
					return self.settings.wBox-min;
				}
			}
		},
		setBorder : function() {
			var par = $.sequence.par;
			var self = this;
			if(par < 10) {
				self.maxBorder = 30;
				self.midPoint = 8; 
				self.minBorder = par - 50;
			} else {
				self.maxBorder = par+20;	
				self.midPoint = 4;
				self.minBorder = -30;
			}
		},
		drawPar : function(c) {
			var par = $.sequence.par;
			var self = this;
			var dist;
			c.beginPath();
			c.fillStyle = self.settings.par;
			dist = self.getDistance(par);
			c.fillRect(self.settings.w*self.midPoint,8,dist,2);
			c.fillRect(self.settings.w*self.midPoint+dist+((dist<0)?0:-2),2,2,7);
			c.closePath();
		},
		drawBest : function(c) {
			var best = $.phylo.bestScore;				
			if(best == undefined)
				best = $.phylo.currentScore;
			var dist;
			var self = this;
			dist = self.getDistance(best);
			c.beginPath();
			c.fillStyle = self.settings.best;
			c.fillRect(self.settings.w*self.midPoint,35,dist,2);
			c.fillRect(self.settings.w*self.midPoint+dist+((dist<0)?0:-2),35,2,10);
			c.closePath();
		},
		drawCurrent : function(c) {
			var curr = $.phylo.currentScore;
			var dist;
			var self = this;
			dist = self.getDistance(curr);
			c.beginPath();
			c.fillStyle = self.settings.current;
			c.fillRect(self.settings.w*self.midPoint,10,dist,25);
			c.closePath();
		},
	};
})();
