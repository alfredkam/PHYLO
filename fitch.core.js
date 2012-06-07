(function(){
	$.fitch = {
		algo : function() {

		},
		
		score : function() {
			$.fitch.forwardBackward();
			var score = $.fitch.scoreRecurse($.stage.current);
			return score;
		},

		getLen : function(stage) {
			var self = this;
			console.log(stage);
			if ($.phylo.tree[stage].child >= 2) {
				return self.getLen($.phylo.tree[stage].node1);
			} else {
				return $.sequence.track[$.phylo.tree[stage].node1].length;
			}
		},
		
		forwardBackward : function() {
			var self = this;
			var stage = $.stage.current;
			var len = self.getLen(stage);
			$.phylo.tree[stage].ancestor = [];
			for(var i=0;i<len;i++) {
				if (DEBUG) {
					console.log("Forward-backward pass at index "+i);
				}
				var x = $.fitch.forward(stage,i);
				if(x.length < 1) {
					$.phylo.tree[stage].ancestor[i] = "x";
				}
				else if (x.length == 1 || x.indexOf("x") != 0) { 
					$.phylo.tree[stage].ancestor[i] = x[0];
				}
				else
					$.phylo.tree[stage].ancestor[i] = x[1];
				if($.phylo.tree[stage].child >= 2) {
					self.backward($.phylo.tree[stage].node1,$.phylo.tree[stage].ancestor[i],i);
				}
				if($.phylo.tree[stage].child >= 1) {
					self.backward($.phylo.tree[stage].node2,$.phylo.tree[stage].ancestor[i],i);
				}
			}
			return;			
		},
		
		backward : function (stage, fixed, i) {
			var x = $.phylo.tree[stage].ancestorSet;
			if(x.length < 1) {
				$.phylo.tree[stage].ancestor[i] = "x";
			}
			else if (x.length == 1) { 
				$.phylo.tree[stage].ancestor[i] = x[0];
			}
			else if (x.indexOf(fixed) > -1) {
				$.phylo.tree[stage].ancestor[i] = fixed;
			}
			else if (x.indexOf("x") != 0) {
				$.phylo.tree[stage].ancestor[i] = x[0];
			}
			else {
				$.phylo.tree[stage].ancestor[i] = x[1];
			}
			if($.phylo.tree[stage].child >= 2) {
				$.fitch.backward($.phylo.tree[stage].node1,$.phylo.tree[stage].ancestor[i],i);
			}
			if($.phylo.tree[stage].child >= 1) {
				$.fitch.backward($.phylo.tree[stage].node2,$.phylo.tree[stage].ancestor[i],i);
			}
			return;
		},

		forward : function (stage, position) {
			var self = this;
			$.phylo.tree[stage].ancestor = [];
			if($.phylo.tree[stage].child == 2) {
				var x = self.forward($.phylo.tree[stage].node2,position);
				var y = self.forward($.phylo.tree[stage].node1,position);
				var a = [];
				var b = [];
				for(var i=0;i<x.length;i++) 
					if(a.indexOf(x[i]) == -1)
						a.push(x[i]);
					for(var j=0;j<y.length;j++) {
						if(x[i] == y[j] && b.indexOf(x[i]) == -1)
							b.push(x[i]);
						if(a.indexOf(y[j]) == -1)
							a.push(y[j]);
					}
				if(b.length < 1)
					$.phylo.tree[stage].ancestorSet = a;
				else
					$.phylo.tree[stage].ancestorSet = b;
				
			} else if($.phylo.tree[stage].child == 1) {
				var x = self.forward($.phylo.tree[stage].node2,position);
				var y = $.sequence.track[$.phylo.tree[stage].node1][position];
				if(x.indexOf(y) > -1) {
					$.phylo.tree[stage].ancestorSet = [y];
				} else {
					$.phylo.tree[stage].ancestorSet = x.concat([y]);
				}
			} else  {
				var x = $.sequence.track[$.phylo.tree[stage].node1][position];
				var y = $.sequence.track[$.phylo.tree[stage].node2][position];
				if(y == x)
					$.phylo.tree[stage].ancestorSet = [x];
			 	else 
					$.phylo.tree[stage].ancestorSet = [x,y];
			}
			return $.phylo.tree[stage].ancestorSet;
		},
		
		scoreRecurse : function(stage) {
			if ($.phylo.tree[stage].child == 0) {
				var a = $.sequence.track[$.phylo.tree[stage].node1];
				var b = $.sequence.track[$.phylo.tree[stage].node2];
			} else if ($.phylo.tree[stage].child == 1) {
				var a = $.sequence.track[$.phylo.tree[stage].node1];
				var b = $.phylo.tree[$.phylo.tree[stage].node2].ancestor;
			} else {
				var a = $.phylo.tree[$.phylo.tree[stage].node1].ancestor;
				var b = $.phylo.tree[$.phylo.tree[stage].node2].ancestor;
			}

			var log = function() {
				this.match = 0;
				this.mismatch = 0;
				this.open = 0;
				this.extend = 0;
			};

			var logA = new log();
			var logB = new log();

			var weight = {
				match : 1,
				mismatch : -1,
				open : -5,
				extend : -1
			};

			var trace = function(arr,seq,log) {
				for(var i=0;i<arr.length;i++) {
					if (arr[i] == "x") {
						if (seq[i] != "x") {
							if (i != 0 && arr[i-1] == "x") {
								log.extend++;
							}
							else {
								log.open++;
							}
						}
							
					}
					else if (seq[i] == "x") {
						if (i != 0 && (seq[i-1] == "x" && arr[i-1] != "x")) {
							log.extend++;
						}
						else {
							log.open++;
						}
					}
					else if (seq[i] == arr[i] || seq[i] == arr[i]) {
						log.match++;
					}
					else {
						log.mismatch++;
					}
				}
				return log;
			};

			logA = trace($.phylo.tree[stage].ancestor, a, logA);
			logB = trace($.phylo.tree[stage].ancestor, b, logB);

			var score = 	logA.match	*	weight.match	+
					logA.mismatch	*	weight.mismatch	+
					logA.open	*	weight.open	+
					logA.extend	*	weight.extend	+
					logB.match	*	weight.match	+
					logB.mismatch	*	weight.mismatch	+
					logB.open	*	weight.open	+
					logB.extend	*	weight.extend;
			if ($.phylo.tree[stage].child >= 2) {
				score += $.fitch.scoreRecurse($.phylo.tree[stage].node1);
			}
			if ($.phylo.tree[stage].child >= 1) {
				score += $.fitch.scoreRecurse($.phylo.tree[stage].node2);
			}
			$.phylo.tree[stage].score = score;
			return score;
		},
		
		ancestor : [],
		bestTrack : [],
		bestScore : []
	};
})();