(function () {
	$.html5 = {};
	$.html5.score = {
		settings : {
			wBox: 827,
			hBox: 50,
			w : 827/14.5,
			par : "#FF0000",
			current : "#6495ED",
			best : "#66CD00",
			color : "#6D6D6D",
			prev : 0,
			prevMid : 4
		},
		setScore : function(newScore) {
			this.draw(newScore);			
		},
		draw_old : function(score) {
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
			this.dra4Key(c);
			
			this.settings.prev = $.phylo.currentScore;
			this.settings.prevPar = $.sequence.par;
		},
		draw : function(score) {
			$.highlighter.set();
			//give it 1s to complete all the drawings... 
			var self = this;
			var canvas = document.getElementById("score");
			var c = canvas.getContext("2d");
			c.globalAlpha = 1;			
			c.clearRect(0,0,self.settings.wBox,self.settings.hBox);
			this.setBorder();
			this.drawScale2(c);
			//this.drawDelay(c);
			
			this.settings.prev = $.phylo.currentScore;
		},
		drawDelay : function(c) {
			var self = this;
			var curr = $.phylo.currentScore;
			var dist = self.getDistance(curr);
			var prevDist = self.getDistance(self.settings.prev);
			
			var diff = prevDist - dist;
			
			//while(Math.round(prevDist+change) != Math.round(dist)) {
			var recurr = function(change) {
				c.beginPath();
				c.clearRect(0,0,765,self.settings.hBox);
				c.fillStyle = self.settings.current;
				c.fillRect(self.settings.w*self.midPoint,5,prevDist + change,30);
				c.closePath();
				if(diff > 0) {
					change -= 8;
				} else {
					change += 8;
				}
				self.drawPar(c);
				self.drawBest(c);
				self.drawScale(c);
				self.drawKey(c);
				if(diff < 0 && (prevDist+change) < dist) {
					window.setTimeout(function(){ recurr(change) } , 1);
				} else if(diff > 0 && (prevDist+change) > dist) {
					window.setTimeout(function(){ recurr(change) } , 1);
				} else {
					c.beginPath();
					c.clearRect(0,0,765,self.settings.hBox);
					c.fillStyle = self.settings.current;
					c.fillRect(self.settings.w*self.midPoint,5, dist,30);
					c.closePath();
					self.drawPar(c);
					self.drawBest(c);
					self.drawScale(c);
					self.drawKey(c);
				}
			}
			recurr(0);

			
			var prev = self.settings.prev;
			var current = $.phylo.currentScore;
			var diff2 = prev - current;
			
			var scoreDelay = function(change) {
				c.beginPath();
				c.clearRect(765,0,62,50);
				c.font = "20pt Helvetica";
				c.fillStyle = self.settings.current;
				c.fillText(prev+change,770,35);
				c.closePath();
				if(diff2 > 0) {
					change -= 1;
				} else {
					change += 1;
				}
				if(diff2 < 0 && (prev+change) < current) {
					window.setTimeout(function() { scoreDelay(change) } , 1 );	
				} else if(diff > 0 && (prev+change) > current) {
					window.setTimeout(function() { scoreDelay(change) } , 1 );	
				} else {
					c.beginPath();
					c.clearRect(765,0,62,50);
					c.font = "20pt Helvetica";
					c.fillStyle = self.settings.current;
					c.fillText(current,770,35);
					c.closePath();
				} 
			};
			scoreDelay(0);
		},
		drawKey : function(c) {
			var self = this;
			var ln = window.lang.body.play.gameselect["game board"];
			var labelColor = '#6D6D6D'
			c.beginPath();	
			c.fillStyle = self.settings.par;
			c.fillRect(0,13,10,5);
			c.font = "10.5pt Helvetica";
			c.fillStyle = self.settings.color;
			c.fillText(ln["field 2"],16, 20);
			c.fillStyle = self.settings.current;
			c.fillRect(0,27,10,5);	
			c.font = "10.5pt Helvetica";
			c.fillStyle = self.settings.color;
			c.fillText(ln["field 1"], 16, 35);
			c.fillStyle = self.settings.best;
			c.fillRect(0,42,10,5);
			c.font = "10pt Helvetica";
			c.fillStyle = self.settings.color;
			c.fillText(ln["field 4"],16, 50);
			/*
			c.font = "20pt Helvetica";
			c.fillStyle = self.settings.current;
			c.fillText($.phylo.currentScore,770,35);
			*/
			c.closePath();
		},
		drawScale2 : function(c) {
			var self = this;
			if((self.midPoint - self.settings.prevMid) == 0 ) {
				self.drawDelay(c);
				return;
			}
			
			var delay = function(curr) {
				c.beginPath();
				c.clearRect(0,0,765,self.settings.hBox);
				var labelColor = '#6D6D6D';
				for(var i=2;i<14;i++) {
					if(i<=curr) {
						var change;
						if(curr == 5) {
							change = (curr-i)*5;
						} else {
							change = (curr-i)*3;
						}
						c.moveTo(self.settings.w*i,0+change);
						c.lineTo(self.settings.w*i,50-change);
					} else {
						var change;
						if(curr == 5) { 
							change = i*1.5;
						} else {
							change = ((i-curr))*5;
						}
						c.moveTo(self.settings.w*i,0+change);
						c.lineTo(self.settings.w*i,50-change);
					}
					if(i==2) {
						c.font = "9pt Helvetica";
						c.fillStyle = self.settings.color;
						c.fillText(self.minBorder,self.settings.w*i+3,50);
					}
					if(i==curr) {
						c.font = "9pt Helvetica";
						c.fillStyle = self.settings.color;
						c.fillText("0",self.settings.w*i+3,50);
					}
					if(i==13) {
						c.font = "9pt Helvetica";
						c.fillStyle = self.settings.color;
						c.fillText(self.maxBorder,self.settings.w*i+3,50);
					}
				}
				c.strokeStyle = self.settings.color;
				c.stroke();
				c.closePath();
				self.drawKey(c);
				if(self.midPoint > self.settings.prevMid && curr != self.midPoint) {
					window.setTimeout(function() { delay(curr+1) },20);
				} else if(self.midPoint < self.settings.prevMid && curr != self.midPoint) {
					window.setTimeout(function() { delay(curr-1) },20);
				} else {
					self.settings.prevMid = self.midPoint;
					self.drawDelay(c);
				}
			}
			delay(parseInt(self.settings.prevMid));

		},
		drawScale : function(c) {
			var scaleColor = '#6D6D6D';
			var self = this;
			c.beginPath();
			for(var i=2;i<14;i++) {
				if(i<=self.midPoint) {
					var change;
					if(self.midPoint == 5) {
						change = (self.midPoint-i)*5;
					} else {
						change = (self.midPoint-i)*3;
					}
					c.moveTo(self.settings.w*i,0+change);
					c.lineTo(self.settings.w*i,50-change);
				} else {
					var change;
					if(self.midPoint == 5) { 
						change = i*1.5;
					} else {
						change = ((i-self.midPoint))*5;
					}
					c.moveTo(self.settings.w*i,0+change);
					c.lineTo(self.settings.w*i,50-change);
				}
				if(i==2) {
					c.font = "9pt Helvetica";
					c.fillStyle = self.settings.color;
					c.fillText(self.minBorder,self.settings.w*i+3,50);
				}
				if(i==self.midPoint) {
					c.font = "9pt Helvetica";
					c.fillStyle = self.settings.color;
					c.fillText("0",self.settings.w*i+3,50);
				}
				if(i==13) {
					c.font = "9pt Helvetica";
					c.fillStyle = self.settings.color;
					c.fillText(self.maxBorder,self.settings.w*i+3,50);
				}
			}
			c.strokeStyle = self.settings.color;
			c.stroke();
			c.closePath();
		},
		getDistance : function(score) {
			var self = this;
			if(score < 0) {
				var max = self.settings.w*self.midPoint;  
				var min = self.settings.w*2;
				var x = -1*(max-min)/(Math.abs(self.minBorder))*Math.abs(score);						
				if( -1*(max-min) >= x ) {
					return -1*(max-min) - 10;
				} else 
					return x;
					
			} else if(score >= 0 ) {
				var min = self.settings.w*self.midPoint;
				var max = self.settings.w*13;
				//bug here -- need fix
				if(score <= self.maxBorder) {
					return (max-min)/self.maxBorder*score;
				} else {
					return self.settings.wBox-min-self.settings.w*1.2;
				}
			}
		},
		setBorder : function() {
			var par = $.sequence.par;
			var self = this;
			if(par < 10) {
				self.maxBorder = 30;
				self.midPoint = 9; 
				self.minBorder = par - 50;
			} else {
				self.maxBorder = par+20;	
				self.midPoint = 5;
				self.minBorder = -30;
			}
		},
		drawPar : function(c) {
			var par = $.sequence.par;
			var self = this;
			var dist;
			c.beginPath();
			c.fillStyle = self.settings.par;
			c.strokeStyle = self.settings.par;
			dist = self.getDistance(par);
			c.moveTo(self.settings.w*self.midPoint+dist-5,0);
			c.lineTo(self.settings.w*self.midPoint+dist+5,0);
			c.lineTo(self.settings.w*self.midPoint+dist,5);
			c.lineTo(self.settings.w*self.midPoint+dist-5,0);
			c.stroke();
			c.fill();
			c.closePath();
		},
		drawBest : function(c) {
			var best = $.phylo.bestScore;				
			var dist;
			var self = this;
			dist = self.getDistance(best);
			c.beginPath();
			c.fillStyle = self.settings.best;
			c.strokeStyle = self.settings.best;
			c.moveTo(self.settings.w*self.midPoint+dist-5,40);
			c.lineTo(self.settings.w*self.midPoint+dist+5,40);
			c.lineTo(self.settings.w*self.midPoint+dist,35);
			c.lineTo(self.settings.w*self.midPoint+dist-5,40);
			c.stroke();
			c.fill();
			c.closePath();
		},
		drawCurrent : function(c) {
			var curr = $.phylo.currentScore;
			var dist;
			var self = this;
			dist = self.getDistance(curr);
			c.beginPath();
			c.fillStyle = self.settings.current;
			c.fillRect(self.settings.w*self.midPoint,5,dist,30);
			c.closePath();
		},
	};
})();
