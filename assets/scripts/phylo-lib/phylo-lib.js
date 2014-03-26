/**
 * Newick format parser in JavaScript.
 *
 * Copyright (c) Jason Davies 2010.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Example tree (from http://en.wikipedia.org/wiki/Newick_format):
 *
 * +--0.1--A
 * F-----0.2-----B            +-------0.3----C
 * +------------------0.5-----E
 *                            +---------0.4------D
 *
 * Newick format:
 * (A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;
 *
 * Converted to JSON:
 * {
 *   name: "F",
 *   branchset: [
 *     {name: "A", length: 0.1},
 *     {name: "B", length: 0.2},
 *     {
 *       name: "E",
 *       length: 0.5,
 *       branchset: [
 *         {name: "C", length: 0.3},
 *         {name: "D", length: 0.4}
 *       ]
 *     }
 *   ]
 * }
 *
 * Converted to JSON, but with no names or lengths:
 * {
 *   branchset: [
 *     {}, {}, {
 *       branchset: [{}, {}]
 *     }
 *   ]
 * }
 */
/*
	Modified by: Alfred Kam
	Reason: For client - side usage
*/
(function() {
  function g() {}
  g.prototype.parse = function(s) {
    var ancestors = [];
    var tree = {};
    var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
    for (var i=0; i<tokens.length; i++) {
      var token = tokens[i];
      switch (token) {
        case '(': // new branchset
          var subtree = {};
          tree.branchset = [subtree];
          ancestors.push(tree);
          tree = subtree;
          break;
        case ',': // another branch
          var subtree = {};
          ancestors[ancestors.length-1].branchset.push(subtree);
          tree = subtree;
          break;
        case ')': // optional name next
          tree = ancestors.pop();
          break;
        case ':': // optional length next
          break;
        default:
          var x = tokens[i-1];
          if (x == ')' || x == '(' || x == ',') {
            tree.name = token;
          } else if (x == ':') {
            tree.length = parseFloat(token);
          }
      }
    }
    return tree;
  };
	var proto = g.prototype,
			attr = [["parse",proto.parse]];
	//common.exportSingleton("newick",g,attr);
	$.newick = {};
	$.newick.parse = proto.parse;
})();
/*
var str = "((((hg19,rheMac2),mm9),(bosTau4,(canFam2,pteVam1))),(loxAfr3,dasNov2));";
console.log(str);
var j = newick.parse(str);
var parse = function(j,c) {
	if(j.name.constructor.toString().indexOf("Array") == -1) {
		if(j.name != "")
			console.log("Depth "+c+" >"+j.name);
	} else {
		for(var i=0;i<j.name.length;i++)
			if(j.name[i] != "") 
				console.log("Depth "+c+" >"+j.name[i]);
	}
	if(j.branchset != undefined)
		if(j.branchset.constructor.toString().indexOf("Array") == -1)	
			parse(j.branchset,c+1);
		else
			for(var i=0;i<j.branchset.length;i++)
				parse(j.branchset[i],c+1);
}
parse(j,0);

var i=0;
var safe = [];
var buildTree = function(j,c) {
	if(j.name.constructor.toString().indexOf("Array") == -1) {
		if(j.name != "") { 
			return j.name;
			//console.log("Depth "+c+" >"+j.name);
		}
	} 
	if(j.branchset != undefined)
		if(j.branchset.constructor.toString().indexOf("Array") == -1) {	
			buildTree(j.branchset,c+1);
		} else {
			var x = buildTree(j.branchset[0],c+1);
			var y = buildTree(j.branchset[1],c+1);
			//if(x != "" && y != "") {
				if(typeof(x) == "string" && typeof(y) == "string") {
					if(x != "" && y != "") { 
						var d =  { "lv" : i++, "depth": c, "child" : 0,"node1": x , "node2": y}; 
						console.log(d);
						return d;
					}
				} else if((typeof(x) == "string" && typeof(y) == "object") || (typeof(x) =="object" && typeof(y) =="string")) {
					if(x == "") {
						if(safe.length < 1)	
							safe.push(y);
						else {
							x = safe.pop();
							if(typeof(y) == "object" && typeof(x) == "object") {
								var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(y) == "object") {
								var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : x, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(x) == "object") {
								var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : y, "node2" : x.lv};
								console.log(d);
								return d;
							}
						}
					} else if(y == "") {
						if(safe.length < 1)
							safe.push(x);
						else {
							y = safe.pop();
							if(typeof(y) == "object" && typeof(x) == "object") {
								var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(y) == "object") {
								var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : x, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(x) == "object") {
								var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : y, "node2" : x.lv};
								console.log(d);
								return d;
							}
						}
					} else {
							if(typeof(y) == "object" && typeof(x) == "object") {
								var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(y) == "object") {
								var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : x, "node2" : y.lv};
								console.log(d);
								return d;
							} else if(typeof(x) == "object") {
								var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : y, "node2" : x.lv};
								console.log(d);
								return d;
							}
					}
				} else if(typeof(x) == "object" && typeof(y) == "object") {
					var d = { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" :y.lv };
					console.log(d);
					return d;
				}
			//}
		//	for(var i=0;i<j.branchset.length;i++) {
		//		buildTree(j.branchset[i],c+1);
		//	}
		}
	return "";
}

buildTree(j,0); */

(function() {

	$.stage = {
		//the current stage
		current : -1,
		//end stage
		last : 0,
		//initiates the next stage
		round : function() {	
			//for testing
			if(this.current < this.last){
				this.current+=1;
				this.set(this.current);
			} else if(this.current === this.last) {
				this.end = true;
				$.timer.stop();
				document.getElementById("endGameSound").play();
				$.endGame.complete();
				return "end game";
			} 
		}, 
		//sets up the next stage
		set : function(x) {	
			if(x == 0)
				$.timer.start();
			$.engine.deActive();
			$(".boardRow").removeClass("current").removeClass("blocked");
			var show = function(n) {
				var tree = $.phylo.tree[n];
				if(tree.child == 0) {
					$("#row"+tree.node1).hide().show("slide",{direction: "right"}, 500);
					$("#row"+tree.node2).hide().show("slide",{direction: "right"}, 500);
				} else if(tree.child == 1) {
					$("#row"+tree.node1).hide().show("slide",{direction: "right"}, 500);
				}
			};
			var addClass = function(n) {
				var tree = $.phylo.tree[n];
				if(tree.child == 0) {
					$("#row"+tree.node1).removeClass("hidden").addClass("current");
					$("#row"+tree.node2).removeClass("hidden").addClass("current");
				} else if(tree.child == 1) {
					$("#row"+tree.node1).removeClass("hidden").addClass("current");
					addClass(tree.node2);
				} else if(tree.child == 2){
					addClass(tree.node1);
					addClass(tree.node2);
				}
			}
			this.splash(x);
			show(x);
			addClass(x);
			if(x == 0) {
				$("#bg").show("slide",{direction : "left"},400);
			}
			$(".boardRow").each(function() {
				if($(this).hasClass("hidden") == false && $(this).hasClass("current") == false) {
					$(this).addClass("blocked");
				}
			});
			var x = $.phylo.tree[x];
			$.engine.active();
			$.tree.buildAncestor();
			var tmp = [];
			$.phylo.bestTrack = [];
			for(var i=0;i<8;i++) {
				var t = [];
				for(var j=0;j<25;j++) 
					t.push(0);
				tmp.push(t);
				$.phylo.bestTrack.push(t);
			}
					
			$.helper.copy(tmp, $.sequence.track);
			//var tmp = $.sequence.track.slice(0);
			$.helper.copy($.sequence.track, $.phylo.origin);
			//$.sequence.track = $.phylo.origin.slice(0);
			//set par score
			var par = $.fitch.score();
			$.helper.copy($.sequence.track, tmp);
			//$.sequence.track = tmp.slice(0);
			$.sequence.par = par;
			$.board.par(par);
			var score = $.fitch.score();
			$.phylo.bestScore = score;
			$.board.score(score);
			//
			$.helper.copy($.phylo.bestTrack, $.sequence.track);
			//$.phylo.bestTrack = $.sequence.track.slice(0);
			$.board.bestScore(score);
			if(score >= par) {
				$.board.approve();
			} else {
				$.board.unapprove();
			}
			$.board.stats();
		},
		//to tell if the game ended yet
		end : false,
		//the next stage splash notification
		splash: function(x) {
			var stageString = "Stage"
			try {
				stageString = window.lang.body.play.gameselect["game board"]["field 3"]
			}
			catch(e){
			}
			$("#splash").html(stageString+" "+(x+1)).show();
			window.setTimeout(function(){
				$("#splash").fadeOut("fast");
			},800);
			
		}
	};
})();

/* this scripts generates the board features */
(function() {
	//insert sound here
	//var lightUpSound = new Audio("assets/sounds/starLightUp.wav"); // buffers automatically when created
	//var starClickSound = new Audio("assets/sounds/startSound.wav");
	//moved the 2 lines to its respective function
	// var lighUpSound = document.getElementById("lightUpSound");
	// var starClickSound = document.getElementById("starClickSound");

	var doc = document,
		win = window;
	var musicList = [{
		name: "Valent - The Buckle",
		loc: "assets/sounds/Valent%20-%20The%20Buckle.mp3"
	}];
	$.board = {
		//generates the grid 
		build: function() {
			// var str = "";
			// for (var i = 0; i < $.phylo.rows; i++) {
			// 	str += "<div class='bgRow'>";
			// 	for (var j = 0; j < $.phylo.seqLen; j++) {
			// 		str += "<div class='bgCell' style='left:" + $.sequence.calcPos(j) + "px'></div>";
			// 		// str += "<div class='bgCell'></div>";
			// 	}
			// 	str += "</div>";
			// }
			//$("#gameBoard").html("<div id='bg'>" + str + "</div>");
			$("#gameBoard").html("<canvas width='827px' height='332px' id='canvasBG'></canvas>");
			this.redrawBG();
		},
		redrawBG : function() {
			var canvas = document.getElementById("canvasBG");
			var c = canvas.getContext("2d");
			c.globalAlpha = 1;
			c.clearRect(0,0,827,350);
			for(var i=0; i < $.phylo.seqLen + 1;i++) {
				c.beginPath();
				c.lineWidth = 2;
				c.moveTo($.sequence.calcPos(i)+1, 0);
				c.lineTo($.sequence.calcPos(i)+1, 350);
				c.strokeStyle = "#C4C4C4";
				c.stroke();	
				c.closePath();
			}
			for(var i=0; i < $.phylo.rows+1; i++) {
				c.beginPath();
				c.lineWidth = 2;
				c.moveTo(0, $.sequence.calcPos(i)+1);
				c.lineTo(827, $.sequence.calcPos(i)+1);
				c.strokeStyle = "#C4C4C4";
				c.stroke();	
				c.closePath();
			}
		},
		//updates and displays the score
		score: function(x) {
			$.phylo.currentScore = x;
			$("#userScore").html("Score: " + x);
			$.html5.score.setScore(x);
		},
		//updates and displays the best score
		bestScore: function(x) {
			$("#bestScore").html("Best: " + x);
			if ($.stage.current == $.stage.last) {
				if (x > $.sequence.par)
					$.protocal.sendHighScore();
			}
		},
		//displays the par
		par: function(x) {
			$("#parScore").html("Par: " + x);
		},
		//displays the current stats
		stats: function() {
			var ln = window.lang.body.play.gameselect["game board"];
			if ($.stage.stats == undefined)
				$("#statsPanel").html(ln["field 3"] + ": " + ($.stage.current + 1) + "/" + ($.stage.last + 1));
			else
				$("#statsPanel").html("<i class='icon-puzzle'></i> ID:&nbsp;&nbsp;" + $.phylo.id + "<br>" + ln["field 3"] + ": " + ($.stage.current + 1) + "/" + ($.stage.last + 1) + "<span class='gap'></span>" + ln["field 9"] + ": " + $.stage.stats.match + "<span class='gap'></span>" + ln["field 10"] + ": " + $.stage.stats.mismatch + "<span class='gap'></span>" + ln["field 11"] + ": " + $.stage.stats.open + "<span class='gap'></span>" + ln["field 12"] + ": " + $.stage.stats.extend + "<span class='gap'><span>" + ln["field 2"] + ": " + $.sequence.par);
		},
		//listens to events
		startListener: function() {
			var self = this;
			var starClickSound = document.getElementById("starClickSound");
			//disables background music
			if (window.DEV.disableMusic == false){

				$("#musicPlayerSpot").html("<audio loop='loop' id='game-audio' preload='auto' autobuffer style='display:none'><source src='assets/sounds/Valent%20-%20The%20Buckle.ogg' type='audio/ogg'/><source src='assets/sounds/Valent%20-%20The%20Buckle.mp3' type='audio/mp3'/>Your browser does not support audio element</audio>");
			}
			var sounds = ["#customize-music","#customize-countdown","#customize-redraw","#customize-star","#customize-fxOthers"];
			for(var i in sounds){
				$(sounds[i]).trigger("click");
				$(sounds[i]).trigger("click");

			}
			//disable this
			$("#scorePanel").hide();
			//volume control
			// $("#volume").on("click",function(){
			// 	$("#customize").trigger("click");
			// 	$("a.tag-music").trigger("click");
			// });
			/*$("#volumeOff").hide();
			//cookie for music
			if ($.cookie.read("music-level")) {
				try {
					var volume = $.cookie.read("music-level");
					document.getElementById("game-audio").volume = volume;
					document.getElementById("endGameSound").volume = volume;
					document.getElementById("redrawSound").volume = volume;

					lightUpSound.volume = volume;
					starClickSound.volume = volume;
					if (volume == 0) {
						$("#volumeOn").hide();
						$("#volumeOff").show();
					} else {
						$("#volumeOn").show();
						$("#volumeOff").hide();
					}
				} catch (err) {}
			}
			if (window.isMobile) {
				$("#volumeOn").hide();
				$("#volumeOff").hide();

			} else {
				$("#volumeOn").unbind().click(function() {
					$.cookie.create("music-level", 0, 365);
					document.getElementById("game-audio").volume = 0;
					lightUpSound.volume = 0;
					starClickSound.volume = 0;
					document.getElementById("endGameSound").volume = 0;
					document.getElementById("redrawSound").volume = 0;
					$("#volumeOn").hide();
					$("#volumeOff").show();
				});
				$("#volumeOff").unbind().click(function() {
					$.cookie.create("music-level", 1, 365);
					document.getElementById("game-audio").volume = 1;
					lightUpSound.volume = 1;
					starClickSound.volume = 1;
					document.getElementById("endGameSound").volume = 1;
					document.getElementById("redrawSound").volume = 1;
					$("#volumeOff").hide();
					$("#volumeOn").show()
				});
			}
			*/
			//roll back to best score
			$("#cycle").unbind().click(function() {
				$.helper.copy($.sequence.track, $.phylo.bestTrack);
				//$.sequence.track = $.phylo.bestTrack.slice(0);

				var score = $.fitch.score();
				$.board.score(score);
				$.physics.snapRandom();
				if ($.phylo.bestScore >= $.sequence.par)
					$.board.approve();
				self.stats();

			});
			if(DEBUG){
				console.log("bindings are done!");
			}
			$("#undo").unbind().click(function(){
				$("#moveListener").trigger("undoMove");
			});
			$("#redo").unbind().click(function(){
				$("#moveListener").trigger("redoMove");
			})
			//next stage
			$("#star").unbind().click(function() {
				starClickSound.play();
				if ($.phylo.currentScore >= $.sequence.par)
					$.stage.round();
			});
			//new scoring
			//$.html5.score.init();
		},
		//tinkers the css on the star
		approve: function() {
			var self = this;
			var lighUpSound = document.getElementById("lightUpSound");
			$("#star").addClass("pass");
			$("#star").animate({
				opacity: 1
			}, 300, function() {
				if ($.phylo.currentScore < $.sequence.par) {
					self.unapprove();
					return;
				}
				lightUpSound.play();
				$("#star").animate({
					opacity: 0.2
				}, 300, function() {
					if ($.phylo.currentScore < $.sequence.par) {
						self.unapprove();
						return;
					}
					$("#star").animate({
						opacity: 1
					}, 500, function() {
						if ($.phylo.currentScore < $.sequence.par) {
							self.unapprove();
							return;
						}
						$("#star").animate({
							opacity: 0.2
						}, 300, function() {
							if ($.phylo.currentScore < $.sequence.par) {
								self.unapprove();
								return;
							}
							$("#star").animate({
								opacity: 1
							}, 500, function() {
								if ($.phylo.currentScore < $.sequence.par) {
									self.unapprove();
									return;
								}
							});
						});
					});
				});
			});
		},
		//tinkers the css on the star 
		unapprove: function() {
			$("#star").removeClass("pass");
			$("#star").css({
				opacity: 0.4
			});
		},
		//builds json alignments of the current score (but its not json)
		getSubmissionAlignments: function() {
			var self = this;
			var track = $.sequence.track;
			var str = "[";
			for (var i = 0; i < track.length; i++) {
				str += '{"';
				for (var j = 0; j < track[i].length; j++) {
					if (track[i][j] == "x")
						str += "-";
					else if (i != 0 && track[i][j] == 0)
						str += "";
					else
						str += self.convertColor($("#" + track[i][j]));
				}
				str += '"}';
				if (i < track.length - 2)
					str += ',';
			}
			return '{"alignments" : ' + str + ']}';
		},
		//builds a json object of the current board
		getJsonAlignments : function(){
			var self = this;
			var track = $.extend(true,[],$.sequence.track);
			// var track = $.sequence.slice();
			// var arr = [];
			// for(var i =0; i<track.length;i++){
			// 	var str="";
			// 	for (var j = 0; j < track[i].length; j++) {
			// 		if (track[i][j] == "x")
			// 			str += "-";
			// 		else if (i != 0 && track[i][j] == 0)
			// 			str += "";
			// 		else
			// 			str += self.convertColor($("#" + track[i][j]));
			// 	}
			// 	arr[i] = str;
			// }
			return {alignments : track,
				stage: $.stage.current};
		},
		//translates the grid color to its respected nucletide
		convertColor: function(nuc) {
			if (nuc.hasClass("nuc-G"))
				return "G";
			if (nuc.hasClass("nuc-C"))
				return "C";
			if (nuc.hasClass("nuc-A"))
				return "A";
			if (nuc.hasClass("nuc-T"))
				return "T";
			return null;
		}
	};
})();
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
		}
	}
})();

(function () {
	// var sound = new Audio("assets/sounds/btn2.wav"); // buffers automatically when created

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
			document.getElementById("redrawSound").play();
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

(function() {
	//$.phylo.tree[$.stage.current].ancestor[i]	
	$.highlighter = {
		set : function() {
			//oops this module is for DNA only - return it
			if($.main.type != "DNA")
				return;
			//this.remove();
			$(".sequence").removeClass("highlighter-2");	
			var ancestor = $.phylo.tree[$.stage.current].ancestor;
			var track = $.sequence.track;
			var active = this.getActiveRows();

			for(var i=0;i < active.length;i++) {
				for(j=0, arr = track[active[i]], len = track[active[i]].length;j< len;j++) {
					try {
						//ancestor is not empty
						if(ancestor[j].toString().toLowerCase() != "x" && ancestor[j] != 0 
							//sequence is not equal to ancestor
						&& (!$("#"+arr[j]).hasClass("nuc-"+ancestor[j].toString().toUpperCase()))) {
							$("#"+arr[j]).addClass("highlighter-2");
						}
					} catch(err) {
						console.log("Warning : Cell(s) fell off the chart");	
						if(DEV.logging)
							console.notify("Warning : Cell(s) fell off the chart");	
					}
				}
			}	
		},
		getActiveRows : function() {
			var row = [];
			$(".boardRow").each(function() {
				if($(this).hasClass("current")) {
					row.push(parseInt($(this).attr("id").replace(/row/,"")));
				}
			});
			return row;
		},
		remove : function() {
			$(".sequence").removeClass("highlighter-2");	
			return;
		},
	};	

})();

(function() {
	//helper function
	//contains all the quickies
	$.helper =  {
		//prints out the tracking grid
		dump : function(grid) {
			var data = "";
			for(var i=0; i<grid.length;i++) {
				for(var j=0;j<grid[i].length;j++) {
					data+="&nbsp;"+grid[i][j];	
				}
				data+="<br>";
			}
			$("#dump").html(data);

		},
		//retrives the http variables
		get : function(pid) {
			var $_GET = {};

			document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			    function decode(s) {
				return decodeURIComponent(s.split("+").join(" "));
				}

			    $_GET[decode(arguments[1])] = decode(arguments[2]);
			});

			return $_GET[pid];
		},
		//copies the array
		copy : function(a,b) {
			for(var i=0;i<b.length;i++) 
				for(var j=0;j<b[i].length;j++) {
					try {
						a[i][j] = b[i][j];
					} catch(err) {
						try {
							a[i].push(b[i][j]);
						} catch (err) {
							var temp = [];
							temp.push(b[i][j]);
							a.push(temp);
						}
					}
				}
		},
		//alert box plugin
		popUp : function(msg,ans,op) {
			if(op != undefined) {
				if(op.cancel != undefined && op.cancel == false)
					$(".warning-cancel").hide();
			} else {
				$(".warning-cancel").show();
			}
			$(".warning-bg").css({
				height: $(document).height(),
				width: $(document).width()
			});
			$(".warning-bg").fadeIn();
			$(".warning").fadeIn();

			$(".warning-msg").html(msg);
			$(".warning-ok").unbind().click(function() {
				ans("ok");
				$(".warning").fadeOut();
				$(".warning-bg").fadeOut();
			});
			$(".warning-cancel").unbind().click(function() {
				ans("cancel");
				$(".warning").fadeOut();
				$(".warning-bg").fadeOut();
			});
		}
	}
	window.common = {
		//used by the depreciated functions to export singleton
		exportSingleton : function(name, obj, attr) {
			if(!window[name]) {
				var g = window[name] = new obj;
				for(var i=0;i<attr.length;i++) {
					try {
					g[attr[i][0]] = attr[i][1];
					} catch(err) {
					}
				}
			}
		}
	}
	String.prototype.toInt = function() {
		return parseInt(this.replace(/px/,""));
	};
})();


(function() {
	var doc = document, win = window;
	$.sequence = {
		//checks row length
		checkEachRowLength : function() {
			var arr = $.phylo.origin;
			$.phylo.eachRowLength = [];
			for(var i=0, ll = arr.length; i < ll;i++) {
				var counter = 0;
				for(var j=0, len = arr[i].length; j < len; j++) {
					if(arr[i][j] != "x")
						counter+=1; 
				}
				$.phylo.eachRowLength.push(counter);
			}
		},
		//retrives repsective nucleotide
		nuc : function(x) {
			if (x == "x") {
				return "x";
			}
			return this.nucleotide[x];
		}, 
		//retrives an array of nucleotide
		nucArray : function(arr) {
			var reArr = [];
			for(var i in arr) {
				if(arr[i] == "x") {
					reArr.push("x");
				} else {
					reArr.push(this.nuc(arr[i]));
				}
			}	
			return reArr;
		},
		//creates a dom cache of the grids but only contains style
		createCache : function() {
			var arr = [];		
			for(var i=0, y=$.phylo.rows, x = $.phylo.seqLen; i<y*x;i++) {
				arr.push(0);
			}

			$(".sequence").each(function() {
				var id = $(this).attr("id");
				arr[id] = document.getElementById(id).style;
			});
			return arr;
		},
		//creates a dom cache of the grid but includes parent
		createCache2 : function() {
			var arr = [];		
			for(var i=0, y=$.phylo.rows, x = $.phylo.seqLen; i<y*x;i++) {
				arr.push(0);
			}

			$(".sequence").each(function() {
				var id = $(this).attr("id");
				arr[id] = document.getElementById(id);
			});
			return arr;
		},
		//calculates the cell position
		calcPos : function(pos) {
			//console.log(pos);
			//return 32*pos;
			return 32*pos+(pos);
		},
		//builds the sequence
		build : function(seq) {
			var str = "";
			var self = this;
			this.posList = [];
			this.posListReverse = [];
			this.nucleotide = [];

			for(var i=0, y=$.phylo.rows, x = $.phylo.seqLen;i<y*x;i++) {
				this.posList.push(0);
				this.posListReverse.push(0);
				this.nucleotide.push(0);
			}

			for(var i=0;i<seq.length;i++) {
				str+="<div class='boardRow hidden' id='row"+i+"'>";
				var counter = 0;
				for(var j=0;j<seq[i].length;j++) {
					var c = seq[i].charAt(j);
					if(c !=  "_") {
						this.posList[i*$.phylo.seqLen+counter] = counter;	
						this.nucleotide[i*$.phylo.seqLen+counter] = seq[i].charAt(j);
						str+="<div class='sequence "+ this.colorTag(this.translate(c))+"' id='"+(i*$.phylo.seqLen+counter)+"' style='left:"+(this.calcPos(j))+"px;'></div>";
						counter++;
					}
				}	
				for(var k=0;k<counter;k++) {
					this.posListReverse[i*$.phylo.seqLen+k] = counter-k;
				}
				
				str+="<div class='red-line' id='red"+i+"'></div>";
				str+="</div>";
			} 
			$("#gameBoard").append("<div id='movingParts'>"+str+"<div>");
			$(".boardRow").css("height",self.calcPos(1));
		},
		//gets the color tag of respected nucletide 
		colorTag : function(x) {	
			if(x == 1) 
				return "nuc-A";
			if(x == 2)
				return "nuc-G";
			if(x == 3)
				return "nuc-C";
			if(x == 4)
				return "nuc-T";
		},		
		//gets the 
		//sets the color for the nucletide
		color : function(x) {
			return colorTag(x);
		},
		//determines the color for the nucletide
		translate : function(x) {
			if(x == "A") 
				return 1;
			if(x == "G")
				return 2;
			if(x == "C")
				return 3;
			if(x == "T")
				return 4;
			return null;
		},
		buildRootAncester : function() {

		},
		//initialize tranking array
		track : [],
		//prepares the grid for tracking the sequence position in real time
		prepareTracking : function(seq) {
			this.track = [];
			for(var i=0;i<seq.length;i++) {
				var arr = [];
				var counter = 0;
				for(var j=0;j<$.phylo.seqLen;j++) {
					if(i < seq.length && j<seq[i].length) {
						if(seq[i].charAt(j) != "_") {
							arr.push(i*$.phylo.seqLen+counter);
							counter+=1;
						} else
							arr.push("x");
					} else
						arr.push("x");
				}
				this.track.push(arr);
			}
		},
		//converts to number
		intify : function(numstring) {
			if (numstring == 'x')
				return numstring;
			else
				return parseInt(0);
		},
		//randomize the location of the sequence
		randomize : function(seq) {
			var arr = [];
			var tmp;
			if(DEBUG) {
				console.log(">> in random 1");
				console.log(seq);
			}	
			//sequence = arr
			for(var i=0;i<seq.length;i++) {
				tmp = [];
				for(var j=0;j<$.phylo.seqLen;j++) {
					if(seq[i][j] == "_")
						tmp.push("x");
					else {
						if(seq[i][j].toString() == "") {
							tmp.push("x");
						} else {
							tmp.push(seq[i][j]);
						}
					}
				}		
				arr.push(tmp);
			}
			
			if(DEBUG) {
				console.log(">> in random 2");
				console.log(arr);
			}

			//randomize arr
			for(var i=0;i<arr.length;i++) {
				tmp = arr[i].toString().split('x,').join('').split(',');
				while( (a=tmp.length)<$.phylo.seqLen)
					tmp.splice(Math.floor(Math.random()*a),0,'x');
				tmp = tmp.map($.sequence.intify);
				arr[i] = tmp.slice(0);
			}	

			//sequence <- arr;
			var seq = [];
			for(var i=0;i<arr.length;i++) {
				tmp = "";
				for(var j =0;j<arr[i].length;j++) {
					if(arr[i][j] == "x")
						tmp+="_";
					else
						tmp+=arr[i][j];
				}
				seq.push(tmp);
			}		
			return seq;
		}
	}
})();

(function() {

	$.splash = {
		//does the splash screen count down to start the game
		countDown: function(fn) {
			var i = 3;
			$("#countDown-text").html(3);
			$.splash.count = function() {
				if ($.cookie.read("music-level")) {
					try {
						var volume = $.cookie.read("countdownVol");
						document.getElementById("startSound").volume = volume;
						document.getElementById("countdownSound").volume = volume;

					} catch (err) {}
				}

				if (i == 0) {
					document.getElementById("startSound").play();
					document.getElementById("game-audio").play();
					$("#countDown").fadeOut("fast");
					console.log($.cookie.read("hasPlayed"));
					if($.cookie.read("hasPlayed")===""){
						$("#moveListener").trigger("showTut");
					}
					fn();
				} else {
					$("#countDown-text").html(i);
					document.getElementById("countdownSound").play();
					if(DEBUG){
						console.log("counting down")
					}
					i -= 1;

					setTimeout($.splash.count, 1000);
				}
			}
			setTimeout($.splash.count, 1000);
		},
	}

})();
(function(){
	$.events = {
		//cell moving listener
		move : function() {
			$(".current").each(function() {
				var id = parseInt(this.id.replace(/row/,""));
				$(this).children().each(function() {
					if($(this).hasClass("sequence")) {
						var self = this;
						$.events.touch(self,{
							start: function(e) {
								$.events.touch(document, {
									//move start
									move: function(e) {
										$("#chosenArea").hide();
										$("#red"+id).show("fast");
										$.physics.move(self,e);
									},
									//move end
									end : function(e) {
										$("#red"+id).hide("fast");
										$.events.untouch(document, "move");
										$.events.untouch(document, "end");
										$.physics.snap();
										var score = $.fitch.score();

										if($.phylo.bestScore < score) {
											$.phylo.bestScore = score;
											$.helper.copy($.phylo.bestTrack, $.sequence.track);
											$.board.bestScore(score);
										}
										$.board.score(score);
										$.phylo.currentScore=score;
										$.board.stats();
										if(score >= $.sequence.par){
											$.board.approve();
										} else {
											$.board.unapprove();
										}
										$("#moveListener").trigger("newMove",{seq: $.sequence.track});
	
									}
								});
							}
						});
					} 
				});
			});
		},
		//listener for un touch
		untouch : function(element,type) {
			var touchStart = 'ontouchstart' in document.documentElement;
			var touchMove = 'ontouchmove' in document.documentElement;
			var touchEnd = 'ontouchend' in document.documentElement;
			var mouseDown = 'onmousedown' in document.documentElement;
			var mouseMove= 'onmousemove' in document.documentElement;
			var mouseUp = 'onmouseup' in document.documentElement;
			if(type == "start") {
				if(mouseDown)
					$(element).unbind("mousedown");
				if(touchStart)
					$(element).unbind("touchstart");
			}
			if(type == "move") {
				if(mouseMove)
					$(element).unbind("mousemove");
				if(touchMove)
					$(element).unbind("touchmove");
			}
			if(type == "end") {
				if(mouseUp)
					$(element).unbind("mouseup");
				if(touchEnd)
					$(element).unbind("touchend");
			}
		},
		//listener for touch
		touch : function(element, fn) {
			var touchStart = 'ontouchstart' in document.documentElement;
			var touchMove = 'ontouchmove' in document.documentElement;
			var touchEnd = 'ontouchend' in document.documentElement;
			var mouseDown = 'onmousedown' in document.documentElement;
			var mouseMove= 'onmousemove' in document.documentElement;
			var mouseUp = 'onmouseup' in document.documentElement;
			var self = this;
			if(fn.start != undefined) {
				if(mouseDown)
					$(element).mousedown(function(e) {
						fn.start(self.getFingerPos(e));			
					});
				if(touchStart)  {
					$(element).bind("touchstart",function(e) {
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.start(self.getFingerPos(e));
					});
				}
			}
			if(fn.move !=undefined) {
				if(mouseMove)
					$(element).mousemove(function(e) {
						fn.move(self.getFingerPos(e));
					});
				if(touchMove)
					$(element).bind("touchmove",function(e) {
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.move(self.getFingerPos(e));
					});
			}			
			if(fn.end !=undefined) {
				if(mouseUp)
					$(element).mouseup(function(e) {
						fn.end(self.getFingerPos(e));
					});
				if(touchEnd)
					$(element).bind("touchend",function(e) {	
						e.preventDefault();
						if(e.originalEvent.touches && e.originalEvent.touches.length) {
							e = e.originalEvent.touches[0];
						}
						fn.end(self.getFingerPos(e));	
					});
			}
		},
		//calculates the finger position
		getFingerPos : function(e) {
			var canvas = document.getElementById("game");
			var x = e.pageX - canvas.offsetLeft-185;
			var y = e.pageY - canvas.offsetTop;
			return { pageX : x , pageY: y}		
		},
		//calculates the finger position for selecting multi grids
		getMultiSelectFingerPos : function(e)  {
			var canvas = document.getElementById("game");
			var x = e.pageX - canvas.offsetLeft-5;
			var y = e.pageY - canvas.offsetTop-65;
			return { pageX : x , pageY: y}		
		}
	}
})();

(function(){
	var doc = document, win = window;
	var url = "/phpdb/openPhyloClassicDB.php";
	$.protocal = {
		//for login
		login : function(username, password, fn) {
			var mode = 7;
			var data = "mode="+mode+"&user="+username+"&pass="+password;
			$.ajax({
				type: "POST",
				url : url,
				data : data
			}).done(function(re) {
				fn(re);		
			}).fail(function() {
				$("div.login-warning").show().html("Could not connect to server, please try again later");
			});
		},
		//for register
		register : function(username, displayname, password, email,network,network_id, fn) {
			var mode = 6;
            var data = "mode="+mode+"&user="+username+"&displayname="+displayname+"&pass="+password+"&email="+email+"&network="+network+"&network_id="+network_id;
			$.ajax({
				type: "POST",
				url : url,
				data : data
			}).done(function(re) {
				fn(re);		
			}).fail(function() {
				$("div.login-warning").show().html("Could not connect to server, please try again later");
			});
		},
		//sends end game score
		sendEndGameScore : function(status,fn) {
			var mode = 3;
			if(status == "completed") {
				mode = 4;
			}
			var data = "mode="+mode+"&id="+$.phylo.id+"&user="+window.username+"&align="+$.board.getSubmissionAlignments()+"&score="+$.phylo.currentScore;
            $.ajax({
				type: "POST",
				url : url,
				data : data
			}).done(function(re) {
				var json = eval("["+re+"]")[0];
				fn(json);
			}).fail(function() {
				console.log(">> failed to connect to database to submit end game score");
				console.log(">> loading end game dummy data");
				if(DEV.logging)  {
					devTools.prompts.notify({ type:"error", title:"warning", text: "failed to connect to database to submit end game score"});
					devTools.prompts.notify({ type:"error", title:"warning", text: "loading end game dummy data"});
				}
				//fail to connect
				var dummy = '{"0":"CONGENITAL PTOSIS","disease_link":"CONGENITAL PTOSIS","1":"67","play_count":"67","2":"13","fail_count":"13","3":"42","best_score":"42","4":"1375","running_score":"1375","5":"unki2aut","highscore_user":"unki2aut"}';
				var json = eval("["+dummy+"]")[0];
				fn(json);
			});
			
		},
		//sends highscore to server
		sendHighScore : function() {
			//this function is currently turned off.
			return;
			var self = this;
			var data = "mode=4&id="+$.phylo.id+"&user="+window.username+"&align="+$.board.getSubmissionAlignments()+"&score="+$.phylo.bestScore;
			$.ajax({
				type : "POST",
				url : url,
				data : data 

			}).done(function() {

			}).fail(function() {
				//if fail, should set up some protocal to resnd
				console.log(">> failed to send highscore");
			});	
		},
		//gets puzzle info
		getPuzzleInfo : function() {
			var data = "mode=3&id="+$.phylo.id;

			$.ajax({
				type : "POST",
				url : url,
				data : data	
			}).done(function(re) {
				var json = {};
				try {
					json = eval("["+re+"]")[0];
				} catch (err) {
					if(DEBUG)
						console.log("@getPuzzleInfo error parsing");
					return;
				}
			}).fail(function() {

			});
		},
		//reads the settings
		read : function(setting) {
			if(setting == undefined) {
				this.type = $.helper.get("type");
				this.score = $.helper.get(this.type);
			} else {
				//console.log(setting);
				var type = setting.type;
				this.tp = 0;
				this.score = setting.num;
				this.tp = type;
			}
		},
		//replay with the previous puzzle
		replay : function() {
			var data = $.protocal.previousData;
			if(DEBUG)
				console.log(data);
			try {
				var j = eval("["+data+"]")[0].level;
			} catch(err) {
				if(DEBUG)
					console.log(err);
				return;
			}
			$.phylo.id = j.attributes.id;
			for(var i =0;i<j.sequence.length;i++) {
				j.sequence[i] = (j.sequence[i].replace(/-/g,"_")).toUpperCase();
			}	
			$.phylo.get = {};
			$.phylo.get.sequence = j.sequence;
			
			if(DEBUG) {
				j.sequence;
				j.tree;
			}
			$.phylo.get.treeString = j.tree;
			var tree = $.newick.parse(j.tree); 
			$.phylo.get.tree = tree;
			$.main.callBack();
		},
		//request a new puzzle
		request : function(setting) {	
			var str ="";
			var type = this.tp;
			var score = this.score;
	
			if(type == "random") {
				str+= "mode=1&diff="+score;

			} else if(type == "disease") {
				mode = 2;
				str+= "mode=2&id="+score;

			} else if(type == "level") {
				mode = 2;
				str+= "mode=2&id="+score;
			}

			$.ajax({
				url : url,
				data : str,
				type : "POST"
			}).done(function(data) {
				data = data.replace("@","");
				$.protocal.previousData = data;
				if(DEBUG ^ DEV.logging)
					console.log(data);
				try {
					var j = eval("["+data+"]")[0].level;
				} catch(err) {
					if(DEBUG)
						console.log(err);
					return;
				}
				$.phylo.id = j.attributes.id;
				for(var i =0;i<j.sequence.length;i++) {
					j.sequence[i] = (j.sequence[i].replace(/-/g,"_")).toUpperCase();
				}	
				//Detect backend error
				var numOfSeq = j.sequence.length;
				var numOfNodes = j.tree.replace(/(\(|\)|\;)/,"").split(",").length;

				if(DEV.logging) {
					devTools.prompts.notify({ title : "Puzzle Id", text : $.phylo.id});
				}

				if(numOfSeq != numOfNodes) {
					console.log(">> Detected Error -> Puzzle ("+$.phylo.id+") Sequence given ("+numOfSeq+") != phylo tree nodes ("+numOfNodes+")");
					if(DEV.logging)	
						devTools.prompts.notify({ type:"error", title:"warning", text: "Puzzle: "+$.phylo.id +"<br> #Seq("+numOfSeq+") / #Nodes("+numOfNodes+") mismatch"});
					// $.ajax({
					// 	url : "https://api.github.com/repos/McGill-CSB/PHYLO/issues",
					// 	type : "POST",
					// 	dataType : "json",
					// 	data :  {
					// 		title : "Puzzle Defect : "+$.phylo.id,
					// 		body : "This is an automated message - Puzzle ("+$.phylo.id+") Sequence given ("+numOfSeq+") != phylo tree nodes ("+numOfNodes+")"
					// 	}
					// }).done(function(re){
					// 	console.log(re);
					// });
				}

				// $.ajax({
				// 	url : "https://api.github.com/repos/McGill-CSB/PHYLO/issues",
				// 	type : "POST",
				// 	dataType : "json",
				// 	data :  {
				// 		title : "[TEST] Puzzle Defect : "+$.phylo.id,
				// 		body : "This is an automated message - Puzzle ("+$.phylo.id+") Sequence given ("+numOfSeq+") != phylo tree nodes ("+numOfNodes+")"
				// 	}
				// }).done(function(re){
				// 	console.log(re);
				// });

				$.phylo.get = {};
				$.phylo.get.sequence = j.sequence;
				
				if(DEBUG) {
					j.sequence;
					j.tree;
				}
				$.phylo.get.treeString = j.tree;
				var tree = $.newick.parse(j.tree); 
				$.phylo.get.tree = tree;
				$.main.callBack();

			}).fail(function() {
			/* this part runs the dummy data */
			//	var dummy = '{"level":{"attributes":{"id":"3071"},"sequence":["-----GAGGATCCAGC-----","-----GAGGCTCAAGC-----","TTTTGAAAACTAGATA-----","-----GGAGTCTAAAA-----","-----AGGCGCTAAAAACAAA","------GGAACTCCAA-----","-----AGGGCGAAAAC-----","-----AGGCTCCAATG-----"],"tree":"((((hg19,rheMac2),mm9),(bosTau4,(canFam2,pteVam1))),(loxAfr3,dasNov2));"}}';
				//var dummy = '{"level":{"attributes":{"id":"1926"},"sequence":["---agagtgactcccag----","----gagagatatagag----","---GGGTGAAGGGGTGG----","-TCGAGATTCCCCCGAAGACA","---agagtgacccccag----"],"tree":"((((hg19,rheMac2),mm9),canFam2),loxAfr3);"}} ';
				//var dummy = '{"level":{"attributes":{"id":"1462"},"sequence":["CCTT-CGAAG-----TAAGAA","CCTT-CGAAG-----TGAGAA","CCC--TGGTG-----TAAGAT","GAGG-CAGGC-----------","gcag-cgggc---agcgggcg"],"tree":"(((hg19,rheMac2),mm9),(bosTau4,canFam2));"}}';
				//var dummy = '{"level":{"attributes":{"id":"1354"},"sequence":["CAGA-------------TGCG","CGGG-------------AG--","GGGTTCCAccccgcccccggg","GGGG-------------CGGG","GGCC-------------TACG","--GC-------------TTGG"],"tree":"(((hg19,mm9),(canFam2,pteVam1)),(loxAfr3,dasNov2));"}}';
				//var dummy = '{"level":{"attributes":{"id":"172"},"sequence":["----AGCGG---GG---AGTG","----TGAGA---GG---TGTA","----GGTGG---AG-------","----GAAAG---AG---CGAG","----GGGGA---TG---CGGG","GGGACCCCG---GG---AGGC","GGGTCCCAG---AG-------"],"tree":"(((hg19,mm9),(bosTau4,(canFam2,pteVam1))),(loxAfr3,dasNov2));"}}';
				//var dummy = '{"level":{"attributes":{"id":"513"},"sequence":["------CTC-ATGCAGTGAAA","------CCC-ATGCAG-----","------GCT-CCGAGG-----","-AGCTCTCT-GCCGGG-----"],"tree":"(((hg19,rheMac2),mm9),loxAfr3);"}}';
				//var dummy = '{"level":{"attributes":{"id":"1505"},"sequence":["---TCC----CAG-----CTG","CCCTCC----CAA-----CTC","---CCT----CAGCGGGCCC-","-----------------AGCC","---Tctgccctcacggaacac"],"tree":"(((hg19,rheMac2),(bosTau4,canFam2)),loxAfr3);"}}';
				//var dummy = '{"level":{"attributes":{"id":"3394"},"sequence":["----A-----------CTTCT","----A-----------CTTCT","----G----AGTGGGCCTGGG","----GTACCTGCGCGTCCAGG"],"tree":"((hg19,rheMac2),(bosTau4,canFam2));"}}';
				//var dummy = '{"level":{"attributes":{"id":"18"},"sequence":["cggcgcgcgccg---------","tggtgtgtgtgt---------","AGCCGCCAGCGC---------","AGGAGCCCATCT---------","TTGGGC-CTCTC---------","gTGCGCGCACTC---------","ACACACACACGCAGGgggagg"],"tree":"(((hg19,(galGal3,taeGut1)),xenTro2),((tetNig2,fr2),gasAcu1));"}}';
				//var dummy = '{"level":{"attributes":{"id":"4010"},"sequence":["ggcgccccAG-----------","---GATCTGG-----------","----ACCCAC-----------","----CAAGTG-----------","---GGTTAGG-----------","ggcgccccAG-----------"],"tree":"((((hg19,rheMac2),mm9),(canFam2,pteVam1)),loxAfr3);"}}';
				//var dummy = '{"level":{"attributes":{"id":"114"},"sequence":["----------TTATTTTT-A","----------TTATTTTT-A","----------TTATTTTT-G","----------TTATTTTT-A","CTGCAAGTGGTTATTTGTAA","CTATACATGATTTTTAAA-A","CTATAA----ATGCTTTT-G"],"tree":"((((((hg19,panTro2),ponAbe2),rheMac2),micMur1),oryCun2),bosTau4);"}}';
				//var dummy = '{"level":{"attributes":{"id":"400"},"sequence":["-TGGGG--ATCCAGCATGAG","-TGGGG--ATCCAGCATGAG","----------------CAGG","----------------GGAG","-TGAGG--ATCCACCCTGAG","TCGAGG--ATCCAACATGAG","--GAGG--GTCCGGCATGAG","-CGAGG--GGTCAGCGGGAG"],"tree":"(((hg19,rheMac2),(mm9,oryCun2)),(bosTau4,(equCab2,(felCat3,canFam2))));"}}';
				// var dummy = '{"level":{"attributes":{"id":"117"},"sequence":["GACTCCGGTCT---------","GACTCCGGTCT---------","GACTCCGTCAC---------","GACTCCGTCACAAACAAACA","GGCTCTG-TCT---------"],"tree":"(((panTro2,ponAbe2),(rheMac2,papHam1)),otoGar1);"}}';
				// var dummy = '{"level":{"attributes":{"id":"3"},"sequence":["---------------GGCGCA","ACGGCAAT-------GTGGGC","CCAGTGACCAGGCCCGAGGCC","CAGGGTTCTGACCACAGAACC"],"tree":"(hg19,(bosTau4,(canFam2,pteVam1)));"}}';
				var dummy = '{"level":{"attributes":{"id":"126"},"sequence":["CGGCCGCCGGGGG-------","CGGCCGCCGGGGG-------","CGGCCGCCGGGGG-------","CAACCCGTGGGTG-------","CGACCCGTGGATG-------","GCGGCGGCGGGCG-------","CGGCCGGCTGGGG-------","CCCCCCTCTCGGG-------","TCCCCCGAGGGAGGCGACCC"],"tree":"(((((hg19,gorGor1),papHam1),(((mm9,rn4),dipOrd1),cavPor3)),macEug1),ornAna1);"}}';


				console.log(">> Cannnot connect to database");
				console.log(">> loading dummy data");
				if(DEV.logging)  {
					devTools.prompts.notify({ type:"error", title:"warning", text: "Cannot connect to database"});
					devTools.prompts.notify({ type:"error", title:"warning", text: "loading dummy data"});
				}
				$.protocal.previousData = dummy;
				try {
					var j = eval("["+dummy+"]")[0].level;
				} catch(err) {
					if(DEBUG)
						console.log(err);
					return;
				}
				$.phylo.id = j.attributes.id;
				for(var i =0;i<j.sequence.length;i++) {
					j.sequence[i] = (j.sequence[i].replace(/-/g,"_")).toUpperCase();
				}	
				var numOfSeq = j.sequence.length;
				var numOfNodes = j.tree.replace(/(\(|\)|\;)/,"").split(",").length;
				if(numOfSeq != numOfNodes) {
					console.log(">> Detected Error -> Sequence given ("+numOfSeq+") != phylo tree nodes ("+numOfNodes+")");
					if(DEV.logging)	
						devTools.prompts.notify({ type:"error", title:"warning", text: "Puzzle: "+$.phylo.id +"<br> #Seq("+numOfSeq+") / #Nodes("+numOfNodes+") mismatch"});
				}
				$.phylo.get = {};
				$.phylo.get.sequence = j.sequence;
				
				if(DEBUG) {
					j.sequence;
					j.tree;
				}
				$.phylo.get.treeString = j.tree;
				var tree = $.newick.parse(j.tree); 
				$.phylo.get.tree = tree;
				$.main.callBack();
			});
		}
	};
})();

(function() {
	$.multiSelect = {
		//statsthe multi select listener
		active : function() {
			var self= this;
			$("#movingParts").append("<div id='chosenArea'></div>");
			$("#game").unbind().dblclick(function(e) {
				$("#chosenArea").hide();

				e = $.events.getMultiSelectFingerPos(e);
				self.startTheEvents(e);								
			});	
		},
		//deactive it 
		deactive : function() {
			$("#game").unbind();	
		},
		//start the select capture
		startTheEvents : function(e) {
			var self = this;
			$("#selectBox").css({
				top: e.pageY,
				left: e.pageX,
				height: 0,
				width : 0
			});
			var origin = {
				Y : e.pageY,
				X: e.pageX
			}
			$("#selectBox").show();
			$("#game").mousemove(function(e) {
				e = $.events.getMultiSelectFingerPos(e);
				if(e.pageY-origin.Y > 0 && e.pageX - origin.X > 0 ) {
					//bottom right
					$("#selectBox").css({
						height : e.pageY-origin.Y,
						width: e.pageX - origin.X
					});	
				} else if(e.pageY-origin.Y < 0 && e.pageX - origin.X < 0 ) {
					//top left
					$("#selectBox").css({
						top : e.pageY-10,
						left: e.pageX,
						height: origin.Y-e.pageY,
						width: origin.X -e.pageX,
					});
				} else if(e.pageY-origin.Y < 0 && e.pageX - origin.X > 0) {
					//top right
					$("#selectBox").css({
						top:e.pageY,
						height: origin.Y - e.pageY,
						width: e.pageX - origin.X
					});
				} else if(e.pageY-origin.Y > 0 && e.pageX - origin.X < 0) {
					//bottom left
					$("#selectBox").css({
						left:e.pageX,
						height : e.pageY - origin.Y,
						width: origin.X - e.pageX,
					});
				} 
			});
			$("#game").click(function() {
				$(this).unbind("mousemove");
				$(this).unbind("click");
				//snaps the capture	
				self.capture();
				$("#selectBox").hide();
			});
		},
		//captures the select grids
		capture : function() {
			var box = {
				X: parseInt($("#selectBox").css("left").replace(/px/,"")) - parseInt($("#tree").css("width").replace(/px/,""))-4,
				Y: parseInt($("#selectBox").css("top").replace(/px/,"")) - 150,
				H: parseInt($("#selectBox").css("height").replace(/px/,"")),
				W: parseInt($("#selectBox").css("width").replace(/px/,"")),
			};	
			var select = {
				X: 1000,
				Y: 1000,
				H: -1,
				W: -1,
			}
			var list = [];
			var list2 = [];
			$(".current > .sequence").each(function() {
				var self = this;
				//gets cordinates
				var row = parseInt($(this).parent().attr("id").replace(/row/,""));
				var curr = {
					X: parseInt($(this).css("left").replace(/px/,"")),
					Y: 33*row,//(window.isFF?35.5:34.5)*row,
					H: parseInt($(this).css("height").replace(/px/,"")),
					W: parseInt($(this).css("width").replace(/px/,""))
				};
				//gets if in the box
				if(
					( 	//first row just sitting on border level  -- exclude far left && far right
						curr.Y <= box.Y && box.Y <= curr.Y+curr.H
						&& box.X <= curr.X && curr.X <= box.X+box.W
					) 	||
					(	//when red box inside the cell
						curr.Y <= box.Y && box.Y+box.H <= curr.Y+curr.H 
				     		&& curr.X <= box.X && box.X+box.W <= curr.X+curr.W
					)	||
					(	//capturing it when redbox area greater then selected cells
						box.Y <= curr.Y && curr.Y <= box.Y+box.H 
				     		&& box.X <= curr.X && curr.X <= box.X+box.W
					)	||
					(	//top left corner
						curr.Y <= box.Y && box.Y <= curr.Y+curr.H 
						&& curr.X <= box.X && box.X <= curr.X+curr.W
					)	||
					(	//top right corner
						curr.Y <= box.Y && box.Y <= curr.Y+curr.H 
						&& curr.X <= box.X+box.W && box.X+box.W <= curr.X+curr.W

					)	||
					(	//bottom left
						box.Y <= curr.Y && curr.Y <= box.Y+box.H
						&& curr.X <= box.X && box.X <= curr.X+curr.W
					)	||
					(	//bottom right
						box.Y <= curr.Y && curr.Y <= box.Y+box.H
						&& curr.X <= box.X+box.W && box.X+box.W <= curr.X+curr.W
					)	|| 
					(	//last row just sitting on border level -- exclude far left && far right
						curr.Y <= box.Y+box.H && box.Y+box.H <= curr.Y+curr.H
						&& box.X <= curr.X && curr.X  <= box.X+box.W	
					)
				) {
					list.push(self);
					list2.push($(self).attr("id"));
					if(curr.X < select.X) {
						select.X = curr.X;
					}	
					if(curr.Y < select.Y) {
						console.log(curr);
						select.Y = $("#"+$(self).attr("id")).offset().top-199;//curr.Y;
					}
					if(curr.Y+curr.H > select.H) {
						select.H = curr.Y+curr.H;
					}
					if(curr.X+curr.W > select.W) {
						select.W = curr.X+curr.W;
					}

				}
			});	
			select.H -= select.Y;
			select.W -= select.X;

			if(list.length == 0) {
				$("#chosenArea").hide();
				return;
			}
			$("#chosenArea").css({
				top : select.Y-25,
				left : select.X,
				width : select.W,
				height : select.H+25,
			});
			$("#chosenArea").show();

			//moving the red box
			$.events.touch("#chosenArea", {
				start: function(e) {
					var offsetX = e.pageX - select.X;
					$.events.touch(document,{
						move: function(e) {
							$.physics.shift_select(list,list2, {
								old : parseInt($("#chosenArea").css("left").replace(/px/,"")),
								new : e.pageX - offsetX,
								obj : $("#chosenArea") 
							});
						},
						end : function(e) {
							$.events.untouch(document,"move");		
							$.events.untouch("#chosenArea","start");
							list = [];
							list2 = [];
							$("#chosenArea").hide();
							$.physics.snap("mutli");
							var score = $.fitch.score();
							$.board.score(score);
							$.board.stats();
							if($.phylo.bestScore < score) {
								$.phylo.bestScore = score;
								$.helper.copy($.phylo.bestTrack, $.sequence.track);
								$.board.bestScore(score);
							}
							if(score >= $.sequence.par){
								$.board.approve();
							} else {
								$.board.unapprove();
							}
						},
					}); 
				}
			});
		}
	};	
})();

(function() {
	$.lang = {

		//initialize and get the languages file, then executes call back function

		init : function(callBack) {
            return callBack();

            ///  **** NOTE ****
            //
            //depreciated this entire script, handled through marionette/backbone model
            //
            //
            //


			//checks if language file is already loaded.
			//if not loaded, load it into the dom
            
            //moved hash to be outside so it can be used in all cases
   //          var hash;
   //          try {
   //              hash = $.helper.get("lang").toString().toUpperCase().replace(/!.*/,"");
   //              console.log("Language hash set " + hash);
   //          } catch(err) {
   //              // BEGIN FIXME (Quick hack to detect language)
   //              var userLang = navigator.language || navigator.userLanguage;
   //              var language = userLang.substring(0,2).toUpperCase();
   //              console.log("Browser language detected: " + language);
   //              switch (language) {
   //                  case "EN":
   //                  case "FR":
   //                  case "SP":
   //                  case "DE":
   //                  case "PT":
   //                  case "RO":
   //                  case "RU":
   //                  case "KO":
   //                  case "HE":
   //                      hash= language;
   //                      break;
   //                  case "ZH":
   //                      var languageExtension = headers['Accept-Language'].substring(0,5).toUpperCase();
   //                      console.log("Browser extended language: " + languageExtension);
   //                      if (languageExtension == "ZH-HK") {
   //                          hash = "ZH-HK";
   //                      } else {
   //                          hash = "ZH-CN";
   //                      };
   //                      break;
   //                  default:
   //                      hash = "EN";
   //                      break;
   //              }
   //              // END FIXME
   //              console.log("Language not specified. Set to default value: " + hash);
   //          }
 
			// if($("#langFile").length == 0) {
			// 	var script = document.createElement("script");
			// 	script.id = "langFile";
			// 	script.src = "../lang/"+hash+".js";
			// 	script.type = "text/javascript";
			// 	document.getElementsByTagName("head")[0].appendChild(script);
	
			// 	script.onload = function() {
			// 		var available = function() {
			// 			if(window[hash+"script"] != undefined) {
			// 				window.langOpt = hash;
			// 				window.lang = window[hash+"script"].lang[0];
			// 				callBack();
			// 			} else {
			// 				window.setTimeout(function(){
			// 					available();
			// 				},50);
			// 			}
			// 		};
			// 		available();
			// 	};
			// 	script.onerror = function() {
			// 		console.log(">> Cannot connect to get language files");
			// 		console.log(">> Loading local lang files");
			// 		var _script = document.createElement("script");
			// 		_script.src = "lang/EN.js";
			// 		_script.type = "text/javascript";
			// 		document.getElementsByTagName("head")[0].appendChild(_script);
			// 		window.langOpt = "EN";
					
			// 		_script.onload = function() {
			// 			window.lang = window["ENscript"].lang[0];
			// 			callBack();
			// 		};
			// 	};
			// } else {
			// 	//does the callback
			// 	var wait = function() {
			// 		if(window.lang == undefined) 
			// 			setTimeout(function(){ wait(); },100);
			// 		else 
			// 			callBack();
			// 	}
			// 	wait();
			// }
		},
	}

})();

(function(){
    var submitterURl = "http://phylo.cs.mcgill.ca/profile/index.php?user=";
	$.endGame = {
		//displays message of completing the game
		complete : function() {
			var self = this;
			$.multiSelect.deactive();
			$.protocal.sendEndGameScore("completed", function(data) {
				self.events();
				self.score("completed",data.best_score);
                self.submitterLocation = submitterURl+(data.submitter?data.submitter:"jerome");
                self.submitter = data.submitter;
                var puzzlesLeft = ((20 - data.puzzles_completed) > 0 ? 20-data.puzzles_completed : 0);          //
                var endMsg = window.lang.body.play.gameselect["end of game"];
				//var msg = "<b>Congratulations!</b> You have solved the puzzle";
				var msg = endMsg["headerMessage"];
				$("#endGame-text").html(msg);
				$("#endGame-learnMore-content").html(self.learnMore(data));
                if(window.guest != "guest" && window.guest != "") {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br>"+
                            endMsg["completeXMessage"].replace("***",puzzlesLeft) +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                } else {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                }
				$("#endGame").fadeIn();
                csb.complete()
			});

		},
		//displays message of bailing out
		bail : function() {
			var self = this;
			$.multiSelect.deactive();
			$.protocal.sendEndGameScore("bail", function(data) {
				self.events();
                // console.log(data);
				self.score("bail",data.best_score);
                self.submitter = data.submitter;
                // data.puzzles_completed = 21;
                // window.guest = "test";
                self.submitterLocation = submitterURl+(data.submitter?data.submitter:"jerome");
				//var msg = "Too bad! You did not succeed to solve this puzzle!";
                var puzzlesLeft = ((20 - data.puzzles_completed) > 0 ? 20-data.puzzles_completed : 0);          //
                var endMsg = window.lang.body.play.gameselect["end of game"];
				var msg = endMsg["headerMessage"];
				$("#endGame-text").html(msg);
				//$("#endGame-learnMore-content").html("This disease is related to diseases etc, you are helping...etc");
				$("#endGame-learnMore-content").html(self.learnMore(data));
                if(window.guest != "guest" && window.guest != "") {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br>"+
                            endMsg["completeXMessage"].replace("***",puzzlesLeft) +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                } else {
                    $("#endGame-learnMode-footerContent").html(
                            endMsg["replayMessage"] +
                        "<br><b>"+
                            endMsg["thankyouMessage"]+"<b>"
                    );
                }
				$("#endGame").fadeIn();
                csb.complete()
			});

        },
        split: function(string) {
            var pair = string.split(":");
            return "<tr><td>" + $.trim(pair[0]) + "&nbsp;&nbsp;&nbsp;:</td><td>&nbsp;&nbsp;&nbsp;" + $.trim(pair[1]) + "</td></tr>";
        },
        learnMore: function(json) {
            var context = "<table>";
            var self = this;
            // try {
            var endGameContext = window.lang.body.play.gameselect["end of game"];
            //     if (endGameContext.levelId) {

                    context+=self.split(endGameContext["levelId"].replace("***","<b>"+$.phylo.id+"</b>"));
                    context+=self.split(endGameContext["userScore"].replace("***","<b>"+$.phylo.currentScore+"</b>"));
                    context+=self.split(endGameContext["avgScore"].replace("***","<b>"+Math.round(json.running_score / json.play_count)+"</b>"));
                    context+=self.split(endGameContext["highscore"].replace("***","<b>"+json.best_score+"</b>"));
                    context+=self.split(endGameContext["highscoreHolder"].replace("***","<b>"+json.highscore_user+"</b>"));
                    context+=self.split(endGameContext["dnaAssociation"].replace("***","<b>"+(json.disease_link || window.lang.body.footer.unclassified)+"</b>"));
                    context+=self.split(endGameContext["completions"].replace("***","<b>"+json.play_count+"</b>"));
                    context+="<tr><td>"+endGameContext["submitter"]+"&nbsp;&nbsp;&nbsp;:</td><td>&nbsp;&nbsp;&nbsp;<a href='"+self.submitterLocation+"'>"+(self.submitter?self.submitter:"jerome")+"</a></td></tr>";
                    context+="</table>";
            //     } else {
            //         context = endGameContext["field 5"].replace("***", "<label class='end-color'>" + $.phylo.id + "</label>") +
            //             " <label class='end-color'>" + json.disease_link + "</label>.  " + endGameContext["field 6"].replace("***", "<label class='end-color'>" + json.play_count + "</label>").replace(".", ".<br>").replace("***", "<label class='end-color'>" + json.fail_count + "</label>") +
            //             endGameContext["field 7"].replace("***", "<label class='end-color'>" + json.best_score + "</label>") + " " +
            //             endGameContext["field 8"].replace("***", "<label class='end-color'>" + Math.round(json.running_score / json.play_count) + "</label>") + " <br>" +
            //             endGameContext["field 9"].replace("***", "<label class='end-color'>" + json.highscore_user + "</label>");
            //     }
            // } catch (err) {
            //     console.log("@endgame",err);
            //     context = "This disease is related to disease etc, you are helping...etc";
            // }
            return context;
        },
        //scores the game
        score: function(status, highscore) {
            //remove background music... make it stop!
            $("#musicPlayerSpot").html("");
            //gets current score		
            var setDefault = "<i class='icon-star-empty'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>";
            $("#endGame-score-result").html(setDefault);
            $("#endGame-share").show();
            if (status == "bail")
                return;
            var currentScore = $.phylo.currentScore;
            var par = $.sequence.par;
            if (par < currentScore && currentScore < highscore) {
                setDefault = "<i class='icon-star-1'></i><i class='icon-star-1'></i><i class='icon-star-empty'></i>";
            } else if (highscore <= currentScore) {
                setDefault = "<i class='icon-star-1'></i><i class='icon-star-1'></i><i class='icon-star-1'></i>";
            } else { //exactly par score
                setDefault = "<i class='icon-star-1'></i><i class='icon-star-empty'></i><i class='icon-star-empty'></i>";
            }
            $("#endGame-score-result").html(setDefault);
        },
        // share highscore on social network
        share: function() {
            console.log("@share function");
            if ($.cookie.read("username")) {
                var username = $.cookie.read("username");
                var fullname = $.cookie.read("fullname");
                var provider = $.cookie.read("loginmode");
                var c_logid = $.cookie.read("logid");
                // console.log("Social provider",provider);
                if ((provider == "Facebook") || (provider == "Twitter") || (provider == "LinkedIn") || (provider == "Google")) {

                    $.protocal.sendEndGameScore("info", function(data) {

                        var puzzle_disease = data.disease_link;
                        var puzzle_highscore = data.best_score;
                        // console.log("@protocal after send end game jax", puzzle_disease);
                        if (provider == "Facebook") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 7"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                } else {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 8"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 9"] + ".\n" + window.lang.body.social["field 20"];
                                } else {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 10"] + ".";
                                }
                            }
                            var caption = window.lang.body.social["field 31"];
                            var data = "provider=" + provider + "&id=" + c_logid + "&caption=" + caption + "&description=" + messageToPrompt;
                        } else if (provider == "Twitter") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = window.lang.body.social["field 20"] + " phylo.cs.mcgill.ca";
                                } else {
                                    var messageToPrompt = window.lang.body.social["field 20"] + " phylo.cs.mcgill.ca";
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = window.lang.body.social["field 20"] + " phylo.cs.mcgill.ca";
                                } else {
                                    var messageToPrompt = window.lang.body.social["field 20"] + " phylo.cs.mcgill.ca";
                                }
                            }
                            var data = "provider=" + provider + "&id=" + c_logid + "&description=" + messageToPrompt;
                        } else if (provider == "LinkedIn") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 15"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                } else {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 16"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 17"] + ".\n" + window.lang.body.social["field 20"];
                                } else {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 18"] + ".\n" + window.lang.body.social["field 20"];
                                }
                            } //var caption = window.lang.body.social["field 26"];
                            //var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
                            var data = "provider=" + provider + "&id=" + c_logid + "&description=" + messageToPrompt;
                        } else if (provider == "Google") {
                            if (puzzle_disease) {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 15"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                } else {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 16"].replace("***", puzzle_disease) + "\n" + window.lang.body.social["field 20"];
                                }
                            } else {
                                if ($.phylo.currentScore >= puzzle_disease) {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 17"] + ".\n" + window.lang.body.social["field 20"];
                                } else {
                                    var messageToPrompt = fullname.replace("+", " ") + " " + window.lang.body.social["field 18"] + ".\n" + window.lang.body.social["field 20"];
                                }
                            }
                            //var caption = window.lang.body.social["field 26"];
                            //var data = "provider="+provider+"&id="+c_logid+"&caption="+caption+"&description="+message;
                            var data = "provider=" + provider + "&id=" + c_logid + "&description=" + messageToPrompt;
                        }
                        var options = {
                            message: window.lang.body.social["field 22"] + "<br/>via "+provider +"<br/>\n" + messageToPrompt,
                            buttons: {
                                confirm: {
                                    label: window.lang.body.social["field 25"],
                                    class : "btn-success",
                                    callback: function() {
                                        $.ajax({
                                            type: "POST",
                                            url: "http://phylo.cs.mcgill.ca/phpdb/social/feed.php",
                                            data: data,
                                        }).done(function(re) {
                                            //bootbox.alert("Your achievement has been posted!");
                                        }).fail(function() {
                                            bootbox.alert(window.lang.body.social["field 23"]);
                                        });
                                    }
                                },
                                cancel : {
                                    label: window.lang.body.social["field 27"],
                                }
                            }
                        };
                        // console.log("bootbox message",options.message);
                        bootbox.dialog(options);
                    });
                } 
                else if (provider === "Classic") {
                    var options = {
                        message: window.lang.body.social["field 44"],
                        buttons: {
                            ok: {
                                
                            },
                        }
                    };
                    bootbox.dialog(options);
                } else {
                    if (DEBUG)
                        console.log(window.lang.body.social["field 28"].replace("***", provider));
                    return;
                }
            } else {
                bootbox.alert(window.lang.body.social["field 29"]);
                // delete cookie (just to be safe)
                $.cookie.delete("username");
                $.cookie.delete("fullname");
                $.cookie.delete("loginmode");
                $.cookie.delete("logid");
                $("#logout").hide();
                window.guest = 'guest';
                $("#login-box").hide();
                $(".login-btn").click(function() {
                    eClick();
                });
                $("#login-tag").html(window.lang.body.play.gameselect.login["field 2"]);
                $(".showInLogin").hide();
                return;
            }
        },
		//events for the end game messages
		//new game or replay game
        events: function() {
            var self = this;
            langFiles = window.lang.body.play.gameselect["end of game"];
            // $("#endGame-learnMore-content").hide();

                    $("#endGame-new button").html(langFiles["field 11"]).unbind().click(function() {
                        //window.location.reload(true);
                        $("#game").hide();
                        $("#endGame").fadeOut();
                        interactiveMenu.restart();
                        $("#draw").show();
                        $("#menu").fadeIn();
                        //window.location.hash = "#!play";
                    });

                    $("#endGame-replay button").html(langFiles["field 12"]).unbind().click(function() {
                        $.main.clear();
                        $("#endGame").fadeOut();
                        $("#tree").html("");
                        $("#gameBoard").html("<img src='assets/img/loading.gif'/>");
                        $.protocal.replay();
                        $("#countDown-text").html("<img src='assets/img/loading.gif'/>");
                        $("#countDown").fadeIn();
                    });

                    // $("#endGame-submitter button").html(langFiles["submitter"]).unbind().click(function(){
                    //     window.location = self.submitterLocation;
                    // });

                    $("#endGame-share button").html(langFiles["field 13"]).unbind().click(function() {
                        if (DEBUG)
                            console.log("Click share event");
                        $.endGame.share('test');
                    });
        },
        //a pop up message to check if really want to bail out from the game
        runAway: function() {
            $("#runaway").unbind().click(function() {
                // $.helper.popUp(window.lang.body.misc["field 19"], function(status) {
                //  if(status == "ok") {
                //      $.endGame.bail();
                //      $.timer.active = false;
                //  }
                // });
                options = {
                    message: window.lang.body.misc["field 19"],
                    buttons: {
                        confirm: {
                            label: window.lang.body.misc["field 18"],
                            callback: function() {
                                $.timer.active = false;
                                $.endGame.bail();
                            }
                        },
                        cancel: {
                            label: window.lang.body.misc["field 16"],
                        }
                    }
                };
                bootbox.dialog(options);

            });
        }

    };
})();

(function() {
	$.physics = {
		// moving multiple objects at once
		shift_select : function(list, list_nonObj, box) {
			var left = true;
			var posList = $.sequence.posList;
			var posListReverse = $.sequence.posListReverse;
			var domCache = $.phylo.domCache;
			var sequence_track = $.sequence.track;

			var max_distance = box.new-box.old;
			if(box.new - box.old > 0) {
				left = false;
			}
			//update data to check if the selected obj pivot exceeded the maximum board length 
			var obj_w = parseInt(box.obj.css("width").replace(/px/,""));
			if(left) {
				if(box.new < 0) {
					box.new = box.old;
				}
			} else {
				if(box.new + obj_w > $.sequence.calcPos($.phylo.seqLen))
					box.new = $.sequence.calcPos($.phylo.seqLen) - obj_w;
			}

			//check if in list
			var checkList = function(id) {
				for(var cell in list) {
					if($(list[cell]).attr("id") == id)
						return true; 
				}
				return false;
			}
			//find its row			
			var row = [];
			for(var i=0, len = list.length;i<len;i++) {
				var r = $(list[i]).parent().attr("id").toString().replace(/row/,"");
				if(!(r in row)) {
					row.push(r);
				}
			}

			var leastPos = 0;
			var nucTemp = list_nonObj[0];
			var maxPos = $.phylo.seqLen;

			if(left) {
				//determine the left most boundary
				var ithPos = 827;
				for(var r=0;r<row.length;r++) {
					var nuc = sequence_track[row[r]];
					var counter = 0;
					var ifBreak = false;
					for(var i=0,len = nuc.length;i<len;i++) {
						if(nuc[i] != "x") {
							for(var j=0;j<list_nonObj.length;j++) {
								if(nuc[i] == list_nonObj[j]) {
									if(leastPos <= counter) {
										leastPos = counter;
										nucTemp = list_nonObj[j];
										ithPos = parseInt(domCache[list_nonObj[j]].left.replace(/px/,""));
									} 
									ifBreak = true;
									break;
								}
							}
							if(ifBreak)
								break;
							counter+=1;
						}
					}
				}
				var curr = domCache[nucTemp].left.replace(/px/,"");
				var min = $.sequence.calcPos(leastPos);
				var diff = curr - min;	
				if(parseInt(curr)+max_distance < min) {
					max_distance = -1*diff;	
				}
			} else {
				//right
				//determine the right most boudary	
				nucTemp = list_nonObj[list_nonObj.length-1];
				var ithPos = 0;
				maxPos = 0;
				for(var r=0;r<row.length;r++) {
					var nuc = sequence_track[row[r]];
					var counter = 1;
					var ifBreak = false;
					for(var i=nuc.length-1;i>=0;i--) {
						if(nuc[i] != "x") {
							for(var j=$.phylo.seqLen-1; j >= 0; j--) {
								if(nuc[i] == list_nonObj[j] && nuc[i] != undefined) {
									if(counter >= maxPos) {
										maxPos = counter;
										nucTemp = list_nonObj[j];
										ithPos = parseInt(domCache[list_nonObj[j]].left.replace(/px/,""));
									}
									ifBreak = true;
									break;
								}
							}
							if(ifBreak)
								break;
							counter+=1;
						}
					}
				}

				maxPos = $.phylo.seqLen - maxPos;
			
				var curr = domCache[nucTemp].left.replace(/px/,"");
				var max = $.sequence.calcPos(maxPos);
				var diff = max-curr;	
				if(parseInt(curr)+max_distance > max) {
					max_distance = diff;	
				}
			}
			if(max_distance == 0)
				return;

			//set the new obj position
			box.obj.css({
				left: box.old+max_distance,
			});
			
			//for(var cell in list) {
			for(var cell = 0, len = list.length;cell < len; cell++) {
				var prev = parseInt($(list[cell]).css("left").replace(/px/,""));		
				var move = prev+ (box.new - box.old);
				var pos = parseInt($(list[cell]).attr("id")); 
				if(left) {
					if(domCache[pos-1] != undefined && domCache[pos-1].left != undefined) {
						if(checkList(pos-1)) {
							$(list[cell]).css({
								left : prev+max_distance,
							});
							continue;
						}	
					}
				} else {
					if(domCache[pos+1] != undefined && domCache[pos+1].left != undefined) {
						if(checkList(pos+1)) {
							$(list[cell]).css({
								left : prev+max_distance,
							});
							continue;
						}	
					}
				}
				if(left) {
					while(true) {
						var seed = pos % $.phylo.seqLen;
						if(domCache[pos] == undefined ^ domCache[pos] == 0) 
							break;
						if(domCache[pos-1] == undefined ^ domCache[pos-1] == 0) {
							var est_px = parseInt(domCache[pos].left.replace(/px/,"")) + max_distance;
							if(est_px < $.sequence.calcPos(seed))
								domCache[pos].left = $.sequence.calcPos(seed)+"px";
							else
								domCache[pos].left = est_px + "px";
							break;
						} else {
							//check next step
							var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
							var nextStep = parseInt(domCache[pos-1].left.replace(/px/,""))+$.phylo.x;
							var est_px = currentStep+max_distance;
							if(est_px < $.sequence.calcPos(seed))
								domCache[pos].left = $.sequence.calcPos(seed)+"px";
							else
								domCache[pos].left = est_px +"px";
							pos-=1;
							if(!(est_px < nextStep))
								break;
						}
					}
				} else {
					while(true) {
						var rrow = Math.floor(pos/$.phylo.seqLen); 
						var seed = $.phylo.seqLen - ($.phylo.eachRowLength[rrow] - (pos % $.phylo.seqLen));
						if(domCache[pos] == undefined ^ domCache[pos] == 0)
							break;
						if(domCache[pos+1] == undefined ^ domCache[pos+1] == 0) {
							var est_px = parseInt(domCache[pos].left.replace(/px/,""))+max_distance;	
							if(est_px > $.sequence.calcPos(seed)) 
								domCache[pos].left = $.sequence.calcPos(seed) + "px";	
							else 
								domCache[pos].left = est_px + "px";
							break;
						} else {
							//check next step
							var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
							var nextStep = parseInt(domCache[pos+1].left.replace(/px/,""));
							var est_px = currentStep+max_distance+$.phylo.x;	
							if(est_px-$.phylo.x > $.sequence.calcPos(seed)) 
								domCache[pos].left = $.sequence.calcPos(seed) + "px";
							else 
								domCache[pos].left = (currentStep+max_distance) + "px";
							pos+=1;
							if(!(est_px > nextStep))
								break;
						}
					}
				}
			}
			return true;
		},
		//determine if moving left or right 
		move : function(self,e) {
			var prevPageX = parseInt($(self).css('left').replace(/px/,""));
			var offSet = parseInt($.phylo.offSet);
			if((e.pageX-offSet) - ($.phylo.x/2) > prevPageX) {	
				this.shift(true,parseInt(self.id),e,0);
			} else if((e.pageX-offSet) - ($.phylo.x/2) == prevPageX) {
				return;
			} else {
				this.shift(false,parseInt(self.id),e,0);
			}
		},
		//updates the css of the cell that is moving left or right
		shift : function(RIGHT, target, e, c) {
			var domCache = $.phylo.domCache;
			var pos = parseInt(target);
			var offSet = parseInt($.phylo.offSet);
			var posList = $.sequence.posList;
			var posListReverse = $.sequence.posListReverse;
			if(RIGHT) {
				while(true) {
					domCache[pos].zIndex = 100-c;
					var x = e.pageX;
					var y = ($.phylo.x*$.phylo.seqLen)+offSet;
					var move = e.pageX+(c-.5)*$.phylo.x-offSet;
					//the right border boundary
					if(move >=  ($.phylo.seqLen-posListReverse[pos])*$.phylo.x-22) {
						move = ($.phylo.seqLen-posListReverse[pos])*$.phylo.x-22;
					}
					if(domCache[pos+1] != 0) {
						if(domCache[pos+1] == undefined) {
							domCache[pos].left = move+"px";
							break;
						}
						if(e.pageX-offSet + c*$.phylo.x > parseInt(domCache[pos+1].left)-$.phylo.x/2) {
							domCache[pos].left = move+"px";
							c+=1;
						} else {
							domCache[pos].left = move+"px";
							break;
						}
					} else {
						domCache[pos].left = move +"px";
						break;
					}
					pos+=1;
					if(domCache[pos] == 0)
						break;
					if(domCache[pos] == undefined)
						break;
				}
			} else {	//left
				while(true) {
					var x = offSet;
					var y = e.pageX;
					var move = e.pageX+(c-.5)*$.phylo.x-offSet;
					if(x >= y) 
						break;
					//left boundary
					if(move < posList[pos]*$.phylo.x) {
						move = posList[pos]*$.phylo.x;
					}
					//need this if?
					if(posList[pos]*$.phylo.x >= parseInt(domCache[pos].left)) {
						break;
					}
					if(domCache[pos-1] != 0) {
						if(domCache[pos-1] == undefined) {
							domCache[pos].left = move + "px";
							break;
						}
						if(parseInt(domCache[pos-1].left) > (e.pageX-offSet)+(c*$.phylo.x)-$.phylo.x*3/2) {
							domCache[pos].left = move + "px";
							c--;
						} else {
							domCache[pos].left = move + "px";
							break;
						}
					} else {
						domCache[pos].left = move + "px";
						break;
					}
					pos-=1;
					if(domCache[pos] == undefined)
						break;
					if(domCache[pos] == 0)
						break;
				}
			}
		},
		//snaps the cell after randomizing the grid
		snapRandom : function() {
			var track = $.sequence.track;
			var domCache = $.phylo.domCache;
			for(var i=0;i<track.length;i++) {
				for(var j=0;j<track[i].length;j++) {
					if(track[i][j] != "x") {
						domCache[track[i][j]].left = $.sequence.calcPos(j)+"px";
					}
				}	
			}	
		},
		//snaps the cell after shifting
		snap : function(type) {
			var getGridY = function(f) {
				var f = parseInt(f);
				for(var i=0;i<$.sequence.track.length;i++) {
					if(i*$.phylo.seqLen <= f && f < i*$.phylo.seqLen+$.phylo.seqLen) {
						break;
					}	
				}
		//		var i = parseInt($("#"+f).parent().attr("id").replace(/row/,""));
				
				return i;
			};
			var track = $.sequence.track;
			var domCache = $.phylo.domCache;
			var posList = $.sequence.posList;
			for(var i=0;i<track.length;i++) {
				for(var j=0;j<track[i].length;j++)
					track[i][j] = "x";
			}
			$(".sequence").each(function() {
				var id = $(this).attr("id");
				var left = parseInt(domCache[id].left)-1;
				var pos = parseInt(left/$.phylo.x);
				var row = getGridY(id);
				//calculates assumtption
				if($.sequence.calcPos(pos)-left <= 0) {
					pos+=1;
				}
				//check if out of [left] bound
				if(pos < 0)
					pos=0;
				//check if assumption is correct if not fix it
				while(track[row][pos] != "x" && pos < $.phylo.seqLen*2) {
					pos+=1;
				}
				//found it went out of [right] bound
				if(pos >= $.phylo.seqLen) {
					var i=track[row].length;
					var temp = id;
					//Note: this condition of while loop excutes the fasted
					while(i--) {
						if(track[row][i] != "x") {
							temp = track[row][i];
							track[row][i] = id;
							domCache[id].left = $.sequence.calcPos(i)+"px";
						/*	$("#"+id).animate({
								left : $.sequence.calcPos(i)
							},100);*/
							id = temp;
						} else {
							track[row][i] = id;	
							domCache[id].left = $.sequence.calcPos(i)+"px";	
							/*
							$("#"+id).animate({
								left : $.sequence.calcPos(i) + "px",
							},300);*/
							break;		
						}
					}
				} else {
					domCache[id].left = $.sequence.calcPos(pos)+"px";
					/*
					$("#"+id).animate({
						left : $.sequence.calcPos(pos) + "px",
					},300);  */
					track[row][pos] = id; 
				}
			});
			if(DEBUG)
				$.helper.dump(track);
		}
	};
})();

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

(function(){
	$.fitch = {
		//calls to get the score
		score : function() {

			//oops its not DNA - we do not use this scoring algorithm
			if($.main.type != "DNA")
				return;
			// forwardBackward does a tree traversal for each sequence nucleotide, forwardBackward2 does a sequence traversal for each tree node.
			// Not sure which is faster
			if($.stage.stats == undefined)
				$.stage.stats = {};
			$.stage.stats.match = 0
			$.stage.stats.mismatch = 0;
			$.stage.stats.open = 0; 
			$.stage.stats.extend = 0;
			$.fitch.forwardBackward();
			//$.fitch.forwardBackward2();
			var score = $.fitch.scoreRecurse($.stage.current);
			return score;
		},
		//gets the sequence length
		getLen : function() {
			return $.phylo.seqLen;
		},
		//forward and backward pass	
		forwardBackward : function() {
			var stage = $.stage.current;
			var len = $.fitch.getLen();
			for(var i=0;i<len;i++) {
				var x = $.fitch.forward(stage,i);
				if(x.length < 1) {
					$.phylo.tree[stage].ancestor[i] = "x";
				}
				else if (x.length == 1 || x.indexOf("x") != 0) { 
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
			}
			return;			
		},
		//forward pass
		forward : function (stage, position) {
			if (position == 0) {
				$.phylo.tree[stage].ancestor = [];
				$.phylo.tree[stage].ancestorSet = [];
			}
			if($.phylo.tree[stage].child == 2) {
				var x = $.fitch.forward($.phylo.tree[stage].node2,position);
				var y = $.fitch.forward($.phylo.tree[stage].node1,position);
				var a = [];
				var b = [];
				for(var i=0;i<x.length;i++) {
					if(a.indexOf(x[i]) == -1)
						a.push(x[i]);
					for(var j=0;j<y.length;j++) {
						if(x[i] == y[j] && b.indexOf(x[i]) == -1)
							b.push(x[i]);
						if(a.indexOf(y[j]) == -1)
							a.push(y[j]);
					}
				}
				if(b.length < 1)
					$.phylo.tree[stage].ancestorSet[position] = a;
				else
					$.phylo.tree[stage].ancestorSet[position] = b;
				
			} else if($.phylo.tree[stage].child == 1) {
				var x = $.fitch.forward($.phylo.tree[stage].node2,position);
				var y = $.sequence.nuc($.sequence.track[$.phylo.tree[stage].node1][position]);
				if(x.indexOf(y) > -1) {
					$.phylo.tree[stage].ancestorSet[position] = [y];
				} else {
					$.phylo.tree[stage].ancestorSet[position] = x.concat([y]);
				}
			} else  {
				var x = $.sequence.nuc($.sequence.track[$.phylo.tree[stage].node1][position]);
				var y = $.sequence.nuc($.sequence.track[$.phylo.tree[stage].node2][position]);
				if(y == x)
					$.phylo.tree[stage].ancestorSet[position] = [x];
			 	else 
					$.phylo.tree[stage].ancestorSet[position] = [x,y];
			}
			return $.phylo.tree[stage].ancestorSet[position];
		},
		//backward pass
		backward : function (stage, fixed, i) {
			var x = $.phylo.tree[stage].ancestorSet[i];
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
		//second version for forward and backward pass
		forwardBackward2 : function() {
			var stage = $.stage.current;
			var len = $.fitch.getLen();
			var x = $.fitch.forward2(stage,i);
			for(var i=0;i<len;i++) {
				if(x[i].length < 1) {
					$.phylo.tree[stage].ancestor[i] = "x";
				}
				else if (x[i].length == 1 || x[i].indexOf("x") != 0) { 
					$.phylo.tree[stage].ancestor[i] = x[i][0];
				}
				else {
					$.phylo.tree[stage].ancestor[i] = x[i][1];
				}
			}
			if($.phylo.tree[stage].child >= 2) {
				$.fitch.backward2($.phylo.tree[stage].node1,$.phylo.tree[stage].ancestor);
			}
			if($.phylo.tree[stage].child >= 1) {
				$.fitch.backward2($.phylo.tree[stage].node2,$.phylo.tree[stage].ancestor);
			}
			return;			
		},
		//second version for forward pass
		forward2 : function (stage) {
			var len = $.fitch.getLen();
			$.phylo.tree[stage].ancestor = [];
			$.phylo.tree[stage].ancestorSet = [];
			if($.phylo.tree[stage].child == 2) {
				var x = $.fitch.forward2($.phylo.tree[stage].node2);
				var y = $.fitch.forward2($.phylo.tree[stage].node1);
				for(var position=0;position<len;position++) {
					var a = [];
					var b = [];
					for(var i=0;i<x[position].length;i++) {
						if(a.indexOf(x[position][i]) == -1)
							a.push(x[position][i]);
						for(var j=0;j<y.length;j++) {
							if(x[position][i] == y[position][j] && b.indexOf(x[position][i]) == -1)
								b.push(x[position][i]);
							if(a.indexOf(y[position][j]) == -1)
								a.push(y[position][j]);
						}
					}
					if(b.length < 1)
						$.phylo.tree[stage].ancestorSet[position] = a;
					else
						$.phylo.tree[stage].ancestorSet[position] = b;
				}
				
			} else if($.phylo.tree[stage].child == 1) {
				var x = $.fitch.forward2($.phylo.tree[stage].node2);
				var y = $.sequence.nucArray($.sequence.track[$.phylo.tree[stage].node1]);
				for(var position=0;position<len;position++) {
					if(x[position].indexOf(y[position]) > -1) {
						$.phylo.tree[stage].ancestorSet[position] = [y[position]];
					} else {
						$.phylo.tree[stage].ancestorSet[position] = x[position].concat([y[position]]);
					}
				}
			} else  {
				var x = $.sequence.nucArray($.sequence.track[$.phylo.tree[stage].node1]);
				var y = $.sequence.nucArray($.sequence.track[$.phylo.tree[stage].node2]);
				for(var position=0;position<len;position++) {
					if(y == x)
						$.phylo.tree[stage].ancestorSet[position] = [x[position]];
					else 
						$.phylo.tree[stage].ancestorSet[position] = [x[position],y[position]];
				}
			}
			return $.phylo.tree[stage].ancestorSet;
		},
		//second version for backward pass	
		backward2 : function (stage, fixed) {
			var x = $.phylo.tree[stage].ancestorSet;
			var len = $.fitch.getLen()
			for(var i=0;i<len;i++) {
				if(x[i].length < 1) {
					$.phylo.tree[stage].ancestor[i] = "x";
				}
				else if (x[i].length == 1) { 
					$.phylo.tree[stage].ancestor[i] = x[i][0];
				}
				else if (x[i].indexOf(fixed[i]) > -1) {
					$.phylo.tree[stage].ancestor[i] = fixed[i];
				}
				else if (x[i].indexOf("x") != 0) {
					$.phylo.tree[stage].ancestor[i] = x[i][0];
				}
				else {
					$.phylo.tree[stage].ancestor[i] = x[i][1];
				}
			}
			if($.phylo.tree[stage].child >= 2) {
				$.fitch.backward2($.phylo.tree[stage].node1,$.phylo.tree[stage].ancestor);
			}
			if($.phylo.tree[stage].child >= 1) {
				$.fitch.backward2($.phylo.tree[stage].node2,$.phylo.tree[stage].ancestor);
			}
			return;
		},

		//recursive function to score
		scoreRecurse : function(stage) {
			if ($.phylo.tree[stage].child == 0) {
				var a = $.sequence.nucArray($.sequence.track[$.phylo.tree[stage].node1]);
				var b = $.sequence.nucArray($.sequence.track[$.phylo.tree[stage].node2]);
			} else if ($.phylo.tree[stage].child == 1) {
				var a = $.sequence.nucArray($.sequence.track[$.phylo.tree[stage].node1]);
				var b = $.phylo.tree[$.phylo.tree[stage].node2].ancestor;
			} else {
				var a = $.phylo.tree[$.phylo.tree[stage].node1].ancestor;
				var b = $.phylo.tree[$.phylo.tree[stage].node2].ancestor;
			}
			
			function tabulate(a) {
				var weight = {
					match : 1,
					mismatch : -1,
					open : -4,
					extend : -1
				};
				return (a.match		*	weight.match	+
						a.mismatch	*	weight.mismatch	+
						a.open		*	weight.open		+
						a.extend	*	weight.extend);
			}
			
			function trace(arr,seq) {
				var log = {
					match : 0,
					mismatch : 0,
					open : 0,
					extend : 0
				};
				
			function isGap(nucleotide) {
				return nucleotide == "x";
			};

			var sizeArr = arr.length - arr.filter(isGap).length;
			var sizeSeq = seq.length - seq.filter(isGap).length;
			var countArr = 0;
			var countSeq = 0;
			var gapMemory = 0;

				for(var i=0;i<arr.length;i++) {
					if (arr[i] != "x" || seq[i] != "x") {
						if (arr[i] != "x" && seq[i] != "x") {
							if (seq[i] == arr[i]) {
								log.match++;
							} else {
								log.mismatch++;
							}
							countArr++;
							countSeq++;
							gapMemory = 0;
						} else if (arr[i] != "x" && seq[i] == "x") {
							if (countSeq > 0 && countSeq < sizeSeq) {
								if (gapMemory == 1) {
									log.extend++;
								} else {
									log.open++;
									gapMemory = 1;
								}
							}
							countArr++;
						} else if (arr[i] == "x" && seq[i] != "x") {
							if (countArr > 0 && countArr < sizeArr) {
								if (gapMemory == 2) {
									log.extend++;
								} else {
									log.open++;
									gapMemory = 2;
								}
							}
							countSeq++;
						}
					}
				}
				return log;
			};

			var logA = trace($.phylo.tree[stage].ancestor, a);
			var logB = trace($.phylo.tree[stage].ancestor, b);

			var score = tabulate(logA) + tabulate(logB);
			$.stage.stats.match += parseInt(logA.match) + parseInt(logB.match);
			$.stage.stats.mismatch += parseInt(logA.mismatch)+parseInt(logB.mismatch);
			$.stage.stats.open += parseInt(logA.open) + parseInt(logB.open);
			$.stage.stats.extend += parseInt(logA.extend) + parseInt(logB.extend);

			if ($.phylo.tree[stage].child >= 2) {
				score += $.fitch.scoreRecurse($.phylo.tree[stage].node1);
			}
			if ($.phylo.tree[stage].child >= 1) {
				score += $.fitch.scoreRecurse($.phylo.tree[stage].node2);
			}

			$.phylo.tree[stage].score = score;
			return score;
		},
		
	};
})();

(function() {
	$.tree = {
		//builds the tree
		build :  function(tree) {
			    var i=0,k=0;
			    var safe = [];
			    var format = [];//this.format;
			    var buildTree = function(j,c) {
			    	if (j.branchset == undefined) {
					return j.name;
				} else {
					var x = j.branchset[0];
					var y = j.branchset[1];
					if (x.branchset == undefined && y.branchset == undefined) {
						var d = { "lv" : i++, "depth" : c, "child" : 0, "node1" : k++, "node2" : k++, "p1": x.name, "p2" : y.name};
					} else if (x.branchset == undefined) {
						var d = { "lv" : -1, "depth" : c, "child" : 1, "node1" : k++, "node2" : -1, "p1" : x.name};
						d.node2 = buildTree(y,c+1).lv;
						d.lv = i++;
					} else if (y.branchset == undefined) {
						var d = { "lv" : -1, "depth" : c, "child" : 1, "node1" : -1, "node2" : -1, "p1" : y.name};
						d.node2 = buildTree(x,c+1).lv;
						d.node1 = k++;
						d.lv = i++;
					} else {
						var d = { "lv" : -1, "depth": c, "child" : 2, "node1" : -1, "node2" : -1};
						d.node1 = buildTree(x,c+1).lv;
						d.node2 = buildTree(y,c+1).lv;
						d.lv = i++;
					}
					format.push(d);
					return d;
				}
			    }
			buildTree(tree,0);
			return format;
		},
		//builds the phylogenetic tree
		buildAncestor : function() {
			var stage = $.stage.current;
			var data = "";
			var self = this;
			var maxDepth = ($.phylo.tree[0].depth >= 4 ? $.phylo.tree[0].depth : 4);
			var maxWidth = 178; 	
			var maxNodeWidth = 20;
			var assignWidth = (maxWidth - (maxDepth * maxNodeWidth))/maxDepth;
					
			//gets the average distance
			var getAvg = function(node){
				var n = $.phylo.tree[node];
				if(n.child == 0) {
					return (n.node1+n.node2)/2;
				} else if(n.child == 1) {
					return(n.node1+getAvg(n.node2))/2;
				} else if(n.child == 2) {
					return(getAvg(n.node1)+getAvg(n.node2))/2;
				}
			};
			//the angle math
			var buildAngle = function(n) {
				var str ="";
				//change to collect from css
				var getDist = function(_n,depth) {
					var t = $.phylo.tree[_n];
					if(t.child == 0) {
						return { top : (t.node1+.5)*34+7+8, depth : t.depth};
					} else if(t.child == 1) {
						var x = (t.node1+getAvg(t.node2))/2;
						x = x*34 + 7 + 8;
						return { top : x, depth : t.depth};
					} else if(t.child == 2) {
						var x = (getAvg(t.node1)+getAvg(t.node2))/2;
						x = x*34+7 + 8;
						return { top : x, depth : t.depth};			
					}
				}
				
				var mWidth = 178;
				mWidth-=32;
				var vName = n.node1<n.node2?n.node1+"v"+n.node2:n.node2+"v"+n.node1;
				if(n.child == 0) {
					//build top
					var hLeft = n.depth*assignWidth+34*.3;
					var hTop_1 = n.node1*34 + 34/2 - 2;
					var hTop_2 = n.node2*34 + 34/2 - 2;
					var vTop_1 = Math.abs(hTop_2-hTop_1);
					str+= "<div class='vLine "+vName+"' style='top:"+hTop_1+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine h"+n.node1+"' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
					//build bot		
					str+= "<div class='hLine h"+n.node2+"' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
				} else if(n.child == 1) {
					var hLeft = n.depth*assignWidth+34*.3;
					var dist = getDist(n.node2);
					var hTop_1 = n.node1*34 + 34/2 - 2;
					var hTop_2 = dist.top;
					var hWidth = assignWidth*Math.abs((n.depth-dist.depth));
					var vTop_1 = Math.abs(hTop_2-hTop_1);
					
					str+= "<div class='vLine "+vName+"' style='top:"+(hTop_2>hTop_1?hTop_1:hTop_2)+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine h"+n.node1+"' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
					str+= "<div class='hLine h"+n.node2+"' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(hWidth)+"px'></div>";
					
				} else if(n.child == 2) {
					var hLeft = n.depth*assignWidth+34*.3;
					var dist_1 = getDist(n.node1);
					var dist_2 = getDist(n.node2);
							
					var hTop_1 = dist_1.top;
					var hWidth_1 = assignWidth* Math.abs((n.depth-dist_1.depth));
					var hTop_2 = dist_2.top;
					var hWidth_2 = assignWidth*Math.abs((n.depth-dist_2.depth));
					var vTop_1 = hTop_2 - hTop_1;
					
					str+= "<div class='vLine "+vName+"' style='top:"+(hTop_1)+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine h"+n.node1+"' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(hWidth_1)+"px'></div>";
					str+= "<div class='hLine  h"+n.node2+"' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(hWidth_2)+"px'></div>";
				}
			
				return str;
			};
			var build = function(stage) {
				var tree = $.phylo.tree[stage];					
				//console.log(tree);
				if(tree.child == 0) {
					data+="<div class='ancestorImg' style='top:"+(tree.node1)*34+"px'><img src='"+self.getImg(tree.p1)+"'/></div>";	
					data+="<div class='ancestorImg' style='top:"+(tree.node2)*34+"px'><img src='"+self.getImg(tree.p2)+"'/></div>";	
					data+="<div class='nodeImg' id='node"+stage+"' style='left:"+(tree.depth)*assignWidth+"px;top:"+((tree.node1+.5)*34+7)+"px'></div>";
					data+=buildAngle(tree);
					return;
				} else if(tree.child == 1) {
					var x = (tree.node1+getAvg(tree.node2))/2;
					x = x*34 + 7;
					data+="<div class='ancestorImg' style='top:"+(tree.node1)*34+"px'><img src='"+self.getImg(tree.p1)+"'/></div>";	
					data+="<div class='nodeImg' id='node"+stage+"' style='left:"+(tree.depth)*assignWidth+"px;top:"+x+"px'></div>";
					data+=buildAngle(tree);
				} else if(tree.child == 2) {
					var x = (getAvg(tree.node1)+getAvg(tree.node2))/2;
					x = x*34+7;
					data+="<div class='nodeImg' id='node"+stage+"' style='left:"+(tree.depth)*assignWidth+"px;top:"+x+"px'></div>";
					data+=buildAngle(tree);
				}
				return;
			}
			//generates the html tree
			for(var _stage=0;_stage<=stage;_stage++)
				build(_stage);
			//dumps the data to element node
			$("#tree").html(data);
		
			$(".nodeImg").hover(function() {
				var id = $(this).attr("id").replace(/node/,"");
				var seq= "";
				for(var i=0;i<$.phylo.tree[id].ancestor.length;i++) {
					var s = $.phylo.tree[id].ancestor[i];
					var sequence = $.sequence;
					if(s != "x" && s != 0) 
						seq+="<div class='ancestor "+$.sequence.colorTag($.sequence.translate(s))+"' style='left:"+$.sequence.calcPos(i)+"px;'></div>";	
				}
				
				$("#ancestorSeq").html(seq);
				// $.customize.default();
				$("#ancestorSeq").show("slide",{direction : "left"},500);
			},function() {
				$("#ancestorSeq").hide();
			});
		},
		//transalates the code to animal name
		getImg : function(name) {
			if(name == "thankyou") {
				return this.ty; 
			}
			if(name == "hg19" || name == "GRCh37" || name == "human" || name == "Human"){
					
					return this.collect("Human");
					
			} else if(name == "panTro2" || name == "gorGor1" || name == "ape" || name == "Ape"){
				
				return this.collect("ape");
				
			} else if(name == "ponAbe2" || name == "rheMac2" ||
					 name == "papHam1" || name == "calJac1" ||
					 name == "tarSyr1" || name == "micMur1" ||
					 name == "otoGar1" || name == "monkey" || name == "Monkey"){
				
				return this.collect("Monkey");
				
			} else if(name == "tupBel1" || name == "mm9" ||
					 name == "rn4" || name == "dipOrd1" ||
					 name == "cavPor3" || name == "eriEur1" ||
					 name == "sorAra1" || name == "mouse" || name == "Mouse"){
				
				return this.collect("Mouse");
							
			} else if(name == "speTri1" || name == "squirrel" || name == "Squirrel"){
				
				return this.collect("Squirell");
				
			} else if(name == "oryCun2" || name == "rabbit" || name == "Rabbit"){
				
				return this.collect("Rabbit");
				
			} else if(name == "ochPri2" || name == "ram" || name == "Ram"){
				
				return this.collect("Ram");
				
			} else if(name == "turTru2" || name == "dolphin" || name == "Dolphin"){
				
				return this.collect("Dolphin");
				
			} else if(name == "bosTau4" || name == "cow" || name == "Cow" || name == "taurus" || name == "Taurus"){
				
				return this.collect("Cow");
				
			} else if(name == "equCab2" || name == "horse" || name == "Horse" || name == "donkey" || name == "Donkey"){
				
				return this.collect("Horse")
				
			} else if(name == "felCat3" || name == "cat" || name == "Cat" ||
                      name == "lion" || name == "Lion" || name == "tiger" || name == "Tiger" ||
                      name == "panther" || name == "Panther" || name == "jaguar" || name == "Jaguar" ||
                      name == "lynx" || name == "Lynx"){
				
				return this.collect("Cat");
				
			} else if(name == "canFam2" || name == "dog" || name == "Dog" || name == "wolf" || name == "Wolf"){
				
				return this.collect("Dog");
				
			} else if(name == "myLuc1" || name == "pteVam1" || "myoluc1" || name == "bat" || name == "Bat"){
				
				return this.collect("bat");
				
			} else if(name == "loxAfr3" || name == "elephant" || name == "Elephant"){
				
				return this.collect("Elephant");
				
			} else if(name == "proCap1" || name == "echTel1" ||
                      name == "dasNov2" || name == "ornAna1" || name == "beaver" || name == "Beaver"){
				
				return this.collect("Beaver");
				
			} else if(name == "choHof1" || name == "sloth" || name == "Sloth"){
				
				return this.collect("Sloth");
				
			} else if(name == "macEug" || name == "Kangaroo" || name == "Kangaroo"){
				
				return this.collect("Kangaroo");
				
			} else if(name == "monDom5" || name == "opossum" || name == "Opossum"){
				
				return this.collect("Opossum");
				
			} else if(name == "galGal3" || name == "taeGut1" || name == "bird" || name == "Bird"){
				
				return this.collect("bird");
				
			} else if(name == "anoCar1" || name == "lizard" || name == "Lizard"){
				
				return this.collect("Lizard");
				
			} else if(name == "xenTro2" || name == "tetNig2" ||
					 name == "fr2" || name == "gasAcu1" ||
					 name == "oryLat2" || name == "danRer6" || name == "fish" || name == "Fish"){
				
				return this.collect("Fish");
				
			} else if(name == "petMar1" || name == "eel" || name == "Eel"){
				
				return this.collect("Eel");
				
			} else {
				return this.collect("unknown");
			}
		},
		//gets the image
		collect : function(name) {
			return "assets/img/animal/"+name.toLowerCase()+".svg";
		}
	};
})();

(function() {
	$(document).ready(function() {
	
		$.main = {
			type : "DNA",
			//unbinds all the previous data
			clear : function() {
				$.timer.stop();
				$.stage.current = -1;
			//	$("#countDown-text").html(3);
				$("#countDown-text").html('<img src="img/loading.gif>');
				$("#countDown").show();
				$("#endGame").hide();
				/*
				$("#tree").html();
				var canvas  = document.getElementById("score");
				var c = canvas.getContext("2d");
				c.clearRect(0,0,$.html5.score.settings.wBox, $.html5.score.settings.hBox);
				*/
			},
			//configuration
			init : function(setting) {
				this.clear();
				if($("#tree").css("height") == undefined) {
					height = 178;
				} else {
					height = $("#tree").css("height").replace(/px/,"");
				}
				$.endGame.runAway();
				$.phylo = {
					seqLen : 25,
					x : 34,
					offSet : 0,//$("#gameBoard").css("left").replace(/px/,""),
					height : height,//$("#tree").css("height").replace(/px/,""),
					rows : 10,
				};
                
                $.lang.init(function() {
					$("#game").show();
					$.protocal.read(setting);
					$.protocal.request();
					//$.endGame.init("lose");
				});
                
			},
			//call back on protocal complete
			//sets the layout and activates the game
			callBack : function() {
				//sets the gameBoard to be nonMovable on touch devices.
				$.events.touch("#gameBoard",{
					start: function(e) {
					}, move : function(e) {
					}, end : function(e) {
					}
				});
				var mouseMove = "onmousemove" in document.documentElement;

				if(DEBUG)
					console.log($.phylo);
				$.phylo.tree = $.tree.build($.phylo.get.tree);
				$.board.build();
				$.sequence.build($.phylo.get.sequence);
				$.sequence.prepareTracking($.phylo.get.sequence);

				$.phylo.origin = [];
				for(var i=0;i<8;i++){
					var t = [];
					for(var j=0;j<$.phylo.seqLen;j++) {
						t.push(0);		
					}
					$.phylo.origin.push(t);
				}

				$.helper.copy($.phylo.origin, $.sequence.track);
				//$.phylo.origin = $.sequence.track.slice(0);
				if(DEBUG) {
					console.log("Before Random");
					console.log($.sequence.track);
				}
				var random = $.sequence.randomize($.sequence.track);
				$.sequence.prepareTracking(random);
				if(DEBUG) {
					console.log("Randomized Sequence");
					console.log(random);
				}
				$.phylo.domCache = $.sequence.createCache();
				$.physics.snapRandom();

				if(DEBUG) {
					console.log("original")
					console.log($.phylo.origin);
					console.log("tracked");
					console.log($.sequence.track);
					console.log($.phylo.tree);
				}
				$.stage.last = $.phylo.tree[$.phylo.tree.length-1].lv;

				// $.customize.default();

				if(window.DEV.disableSplash) {
					$("#countDown").hide();
					$.stage.end = false;
					$.stage.round();	
					if(DEBUG)
						$.helper.dump($.sequence.track);
					if(mouseMove) {
						$.multiSelect.active();
					}
				} else {
					$("#countDown").show();
					$.splash.countDown(function() {
						//start game
						$.stage.end = false;
						$.stage.round();	
						if(DEBUG)
							$.helper.dump($.sequence.track);
						if(mouseMove) {
							$.multiSelect.active();
						}
					});
				}
				$.sequence.checkEachRowLength();
				$.board.startListener();
				//create first step for undo/redo
				$("moveListener").trigger("newGame");
				$("#moveListener").trigger("newMove",{seq: $.sequence.track});

			},
		};

	//	$.main.init();
	});
})();
