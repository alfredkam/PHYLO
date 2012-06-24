/*
Developed By: Alfred Kam (www.cs.mcgill.ca/~akam2/), McGill MCB
Testing By: Daniel Kwak (www.cs.mcgill.ca/~dkwak/), McGill MCB 
Supervisors: Jerome Waldispuhl and Mathieu Blanchette, McGill University
Type: Desktop / Mobile Browser Edition
Supported Platforms: Android, iPod, iPhone, iPad, Chrome, Safari, FireFox
About: A McGill Phylo Project

Copyright Alfred Kam and McGill MCB

Version: 3.0.0.0
Last Updated Nov 2011
*/
var DEBUG = false;
var option = false;
var optionScale = 0;
var production = true;
(function() {
	//test tools
	(function() {
		function g() {}
		g.prototype.find = function(div) {
			if(document.getElementById(div) != undefined)
				console.log("found > "+div);	
		};
		var proto = g.prototype,
			attr = [["find",proto.find]];
		common.exportSingleton("test",g,attr);
	})();

	//generate gameID
	(function() {
		function g() {}
		var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		g.prototype.generate = function() {

			if(!window.production)
				return true;

			var code = "";
			for(var i=0;i<6;i++) {
				code+=str.charAt(Math.floor(Math.random()*str.length));
			}		
			this.code = code;

			if(window.location.hash.search("home") >-1)
				window.location.hash="#home/PLAY/"+code;
			if(common.checkDevice() !="other" && common.checkDevice() != "ipad")
				window.location.hash="#PLAY/"+code;
		};	
		g.prototype.get = function() {
			if(!window.production)
				return true;
			return this.code;
		};

		g.prototype.check = function() {
			var hash = window.location.hash;
			if(!window.production)
				return true;
			if(this.code == undefined)
				return false;

			if(hash.search(this.code) > -1 && hash.search("PLAY") > -1)
				return true;
			else
				return false;	
		};
	
		var proto = g.prototype,
			attr = [["generate", proto.generate],
				["get",proto.get],
				["check",proto.check]];
		common.exportSingleton("gameID",g,attr);
	})();

	//communication + parsing	
	(function() {
		function g() {
			//not needed just for testing
			this.generateRandomAncestor();	
		}

		g.prototype.setSettings = function(gs,gData,Grid,cache) {
			this.gs = gs;
			this.gData = gData;
			this.Grid = Grid;
			this.setStageMap();
			this.par = this.scorePar();
			fitch.setPar(this.par);
			this.randomMap();
			this.preSetGameSettings();
			animate.compactNodeLost = true;
			if(mcb.GET("dev") != "true")
				this.dumpMusic();
			mcb.setgs(gs);
			this.controller(0,cache);
			if(common.checkDevice() == "other" ^ common.checkDevice() == "ipad") {
			//	tutorial.fn.inGameTutorial();
			}
		};
		g.prototype.dumpMusic = function() {
			var data = "";
			var gs = this.gs;
			var data = "<audio autoplay='autoplay' loop='loop' id='game-audio' preload='auto' autobuffer style='display:none'><source src='http://www.cs.mcgill.ca/~jeromew/pub/Valent/Valent%20-%20The%20Buckle.mp3' />Your browser does not support audio element</audio><div id='audioPlayer'><a href='#' class='player' id='playaudio' style='display:none'><div><img src='../img/speaker_on.png' class='audioUnMute'/></div></a><a href='#' class='player' id='pause'><div><img src='../img/speaker_off.png' class='audioMute'/></div></a></div>";
			$("#sandbox").append(data);	
			if(common.checkDevice() == "other") {
				$("#footer").css({
					top : (gs.y+1.2)*gs.yPx+gs.yPx*gs.yMargin,
				});
			} else {
				if(common.checkDevice() == "ipad")
					$("#footer").show();
			}
			
			$("#audioPlayer").css({
				position:"absolute",
				top : (gs.y+1)*gs.yPx+gs.yPx*gs.yMargin,
				left: (gs.x-5.5)*gs.xPx,
				width: "5em",
				height :"5em",
				"zIndex" : 100
			});
			if(common.checkDevice() == "ipad") {
				$("#audioPlayer").css({
					left : (gs.x-6)*gs.xPx
				});
			}
			if(1024>window.innerWidth) {
				$("#audioPlayer").css({
					left : (gs.x-8.5)*gs.xPx,
				});
			}
			$(".audioMute").css({ height : "50px" });
			$(".audioUnMute").css({ height: "50px"});
			$("#pause div").css({
				position:"relative",
				width: "50px",
				height:"50px"
			});
			$("#playaudio div").css({
				position:"relative",
				width: "50px",
				height: "50px"
			});
			$("#pause").click(function() {
				document.getElementById("game-audio").volume=0;
				$(this).hide();
				$("#playaudio").show();
				mcb.cookie.create("phylo-music","mute",360);
			});
			$("#playaudio").click(function() {
				document.getElementById("game-audio").volume=1;
				$(this).hide();
				$("#pause").show();
				mcb.cookie.create("phylo-music","sound",360);
			});

			if(DEBUG)
				console.log(mcb);
			if(mcb.cookie.read("phylo-music") != null) {
				if(mcb.cookie.read("phylo-music") == "mute") {
					document.getElementById("game-audio").volume=0;
					$("#playaudio").show();
					$("#pause").hide();
				} else if(mcb.cookie.read("phylo-music") == "sound") {
					document.getElementById("game-audio").volume=1;
					$("#pause").show();
					$("#playaudio").hide();
				}
			}

		};

		g.prototype.intify = function(numstring) {
			if (numstring == 'x')
				return numstring;
			else
				return parseInt(numstring);
		};

		g.prototype.randomMap = function() {
			var grid = this.Grid.slice(0);
			var gs = this.gs;
			for(var i=0;i<8;i++) {
				tmp = grid[i].toString().split('x,').join('').split(',');
				while((a = tmp.length)<grid[i].length)
					tmp.splice(Math.floor(Math.random()*a),0,'x');
				tmp = tmp.map(this.intify);
				grid[i] = tmp.slice(0);
			}
			//redraw section
			for(var i=0;i<grid.length;i++)
				for(var j=0;j<grid[i].length;j++)
					if(grid[i][j] != "x")
						$("#"+grid[i][j]).css("left",gs.xPx*gs.xMargin+j*gs.xPx+2);
			gameIDE.updateGrid(grid);
			this.Grid = grid.slice(0);
			//reset the game...
			//write a new reset
			for(var i=0, tree = this.tree, len = tree.length; i<len; i++) {
				this.setStage(i);
				fitch.algo(grid,gs,this.gData,tree,i)
			} 
			for(var i=0, tree = this.tree, len = tree.length;i<len;i++) {
				tree[i].bestScore = tree[i].score;
			}
//			gameIDE.dumpGrid();
		};  		
		
		g.prototype.scorePar = function() {
			var tree = this.tree.slice(0);
			var Grid = this.Grid;
			var gs = this.gs;
			var gData = this.gData;
			var par = [];
			if(window.DEBUG) { 
				console.log(Grid);
				console.log(gData);
			}
			for(var i=0;i<tree.length;i++) {
				this.setStage(i);
				var x  = fitch.algo(Grid,gs,gData,tree,i);
				if(window.DEBUG) 
					console.log("@par stage "+i+" > "+x[i].score);
				par.push(x[i].score);
			}
			return par;
		};

		//preset game settings by setting a sequence as new
		g.prototype.preSetGameSettings = function() {
			$(".row").each(function() {
				$(this).addClass("new");
			});
		};
	
		//a stage map	
		g.prototype.setStageMap = function() {
			//common.checkDevuce() returns other for desktop u can find this on script.js
			if(common.checkDevice() == "other" ^ common.checkDevice() == "ipad") {
					this.tree = animate.getGameTree();
				} else 	{
					this.tree = animate.getGameTree();
				}
		};
		//sets up what to show for each stage
		g.prototype.showStageSeq = function(x) {
				if($("#row"+x).hasClass("blackout")) {
					$("#row"+x).removeClass("blackout");
					$("#row"+x).children().each(function() {
						if($(this).hasClass("blackoutseq")) 
							$(this).removeClass("blackoutseq");
					});
				}
				if($("#row"+x).hasClass("new"))
					$("#row"+x).removeClass("new");
				$("#row"+x).addClass("current");
		}
		//set up the stage
		g.prototype.setStage = function(x) {
			var tree = this.tree[x];
			if(tree.child == 0) {
				this.showStageSeq(tree.node1);
				this.showStageSeq(tree.node2);
			} else if(tree.child == 1) {
				this.showStageSeq(tree.node1);
				this.setStage(tree.node2);
			} else if(tree.child == 2) {
				this.setStage(tree.node1);
				this.setStage(tree.node2);
			}
		};
		//a fake thread to control stages
		//the core timer to control the game flow

		
		g.prototype.controller = function(x,cache) {
			$("#grids").touchstart(function(e) {
				e.preventDefault();
			});
			if(common.checkDevice() == "other")
				$("#footer").show();
			if(DEBUG)
				console.log(x);
			mcb.run("gameStart");
			var f = this;
			var opt = window.option;
			//gameIDE.dumpGrid();
			if(gameID.check() == false) {
				return;	
			}
			var round =  {
				start : function(x) {
					if(x < f.tree.length) {
						animate.stageAnimation(x+1);
						mcb.setStage(x);
						f.setStage(x);
						gameIDE.gameEngine(f.gs,f.gData,f.tree,x);
						if(x == 0 && mcb.cookie.read("phylo-tutorial-"+window.guest) !="complete") {
							if(common.checkDevice() == "ipad" ^ common.checkDevice() == "other")
								window.setTimeout(function(){ animate.tutorial();},1000);
							mcb.cookie.create("phylo-tutorial-"+window.guest,"complete",365);
						}
						if(opt) 
							animate.buildCompactTree();
						
					}
				},
				reset : function(x) { //reset sequence
					if(x < f.tree.length-1) {
						$(".row").each(function() {
							if($(this).hasClass("current")) {
								$(this).removeClass("current");
								$(this).addClass("blackout");
								$(this).children().each(function() {
									if($(this).hasClass("sequence"))
										$(this).addClass("blackoutseq");
								});
							}
						});
					} else {
						animate.endGameMenu(0);
					} 
				}
			};
			animate.timer();
			round.start(x);
			if(common.checkDevice() == "other" ^ common.checkDevice() == "ipad")  {
				window.setTimeout(function(){
					animate.multiSelect(cache,f.Grid,f.tree,f.gData)
				},0);
			}
			if(common.checkDevice() == "other") 
				$("#game-star").click(function() {
				//	if($("#game-star").hasClass("game-star-shadow")) { 
					if($("#game-star").hasClass("game-proceed")) { 
						round.reset(x);
						round.start(++x);
					} else {
						fitch.reset();
					}
				});
			else
				$("#game-star").touchstart(function() {
					//if($("#game-star").hasClass("game-star-shadow")) { 
					if($("#game-star").hasClass("game-proceed")) { 
						round.reset(x);
						round.start(++x);
					} else {
						fitch.reset();
					}
				});	
		};
		g.prototype.request = function() {
			
		};

		g.prototype.generateRandomAncestor = function() {
			this.ancestorList = this.getRandomSequence(6);
		};

		g.prototype.getRandomSequence = function(len) {
			var arr = new Array;
			for(var i=0;i<len;i++) {
				arr.push(this.generateSeq(Math.floor(Math.random()*10)+10,5));
			}
			return arr;
		};
		
		g.prototype.generateSeq = function(len,d) {
			var arr = ["A","G","U","T","_"];
			var str = "";
			for(var i=0;i<len;i++) {
				str+=arr[Math.floor(Math.random()*d)];
			}
			return str;
		};
		
		var proto = g.prototype,
			attr = [["init",new g],
				["request",proto.request],
				["getRandomAncestor",proto.getRandomAncestor],
				["getRandomSequence",proto.getRandomSequence],
				["gamePlan",proto.gamePlan],
				["getAncestor", proto.getAncestor],
				["generateSeq", proto.generateSeq]];
			common.exportSingleton("comm",g,attr);

	})();
	//fitch stuff
	(function() {
		var debug = false;
		function g() {}

		g.prototype.endGameScore = function() {
			return { "stage" : this.stage, "stageLength" : this.tree.length, "score" : this.tree[this.stage].score, "par" : this.par[this.stage]  };
		};

		g.prototype.debug = function(str) {
			if(document.getElementById("debug")==undefined) {
				$("#sandbox").append("debug");
				$("#debug").css("top","0");
				$("#debug").css("left","0");
			} else {
				$("#debug").html(str);
			}
		};
		//collects all the needed sequence for union / intersect analyiz 
		/* depreciated
		g.prototype.getInSeq = function(stage) {
			var tree = this.tree[stage];
			var grid = this.grid;
			var x = [];
			if(tree.child == 2) {
				var x = this.getInSeq(tree.node1);
				var y = this.getInSeq(tree.node2);
				return x.concat(y);	
			} else if(tree.child == 1) {
				x.push(grid[tree.node1]);
				//x.push(this.getInSeq(tree.node2));
				return x.concat(this.getInSeq(tree.node2));
			} else {
				var x = grid[tree.node1];
				var y = grid[tree.node2];
				for(var i=0;i<x.length;i++) {
					
				}
				return x;
			}
		}; */

		g.prototype.forward = function(stage,pos) {
			var tree = this.tree[stage];
			var grid = this.grid;
			if(tree.child == 2) {
				var x = this.forward(tree.node2,pos);
				var y = this.forward(tree.node1,pos);
				var a = [];
				var b = [];
				for(var i=0;i<x.length;i++) 
					for(var j=0;j<y.length;j++) {
						if(x[i] == y[j] && b.indexOf(x[i]) == -1)
							b.push(x[i]);
						if(a.indexOf(x[i]) == -1)
							a.push(x[i]);
						if(a.indexOf(y[j]) == -1)
							a.push(y[j]);
					}
				if(b.length < 1)
//					return x.concat(y);
					this.tree[stage].ancestorSet = a; //x.concat(y);
//					this.tree[stage].ancestorSet = x.concat(y);
				else
					//return b;
					this.tree[stage].ancestorSet = b;
				
			} else if(tree.child == 1) {
				var x = this.forward(tree.node2,pos);
				var y = this.trans(grid[tree.node1][pos]);
				if(x.indexOf(y) > -1) {
					//return [y];
					this.tree[stage].ancestorSet = [y];
				} else {
					//return x.concat([y]);
					this.tree[stage].ancestorSet = x.concat([y]);
				}
			} else  {
				var x = this.trans(grid[tree.node1][pos]);
				var y = this.trans(grid[tree.node2][pos]);
				if(y == x)
					//return [x];
					this.tree[stage].ancestorSet = [x];
			 	else 
					//return [x,y];
					this.tree[stage].ancestorSet = [x,y];
			}
			return this.tree[stage].ancestorSet;
		}

		g.prototype.backwardroot = function(stage) {
			var len = this.grid[0].length;
			var tree = this.tree[stage];
			var arr = [];
			this.tree[stage].ancestorFixed = [];
			for(var i=0;i<len;i++) {
				var x = this.forward(stage,i);
				if(DEBUG)
					console.log(x);
				if(x.length < 1) {
					this.tree[stage].ancestorFixed[i] = "x";
//					arr.push("x");
				}
				else if (x.length == 1 || x.indexOf("x") != 0) { 
					this.tree[stage].ancestorFixed[i] = x[0];
					//arr.push(x[Math.floor(Math.random()*x.length)]);
//					arr.push(x[0]);
				}
				else
//					arr.push(x[1]);
					this.tree[stage].ancestorFixed[i] = x[1];
				if(tree.child == 2) {
					this.backwards(tree.node1,this.tree[stage].ancestorFixed[i],i);
					this.backwards(tree.node2,this.tree[stage].ancestorFixed[i],i);
				} else if(tree.child == 1) {
					this.backwards(tree.node2,this.tree[stage].ancestorFixed[i],i);
				} else  {
				}
			}
			return;			
//			return arr;
		};
		
		g.prototype.backwards = function(stage,ancestorFix,i) {
			var tree = this.tree[stage];
			var x = this.tree[stage].ancestorSet;
			if(x.length < 1) {
				this.tree[stage].ancestorFixed[i] = "x";
			}
			else if (x.length == 1) { 
				this.tree[stage].ancestorFixed[i] = x[0];
			}
			else if (x.indexOf(ancestorFix) > -1) {
				this.tree[stage].ancestorFixed[i] = ancestorFix;
			}
			else if (x.indexOf("x") != 0) {
				this.tree[stage].ancestorFixed[i] = x[0];
			}
			else {
				this.tree[stage].ancestorFixed[i] = x[1];
			}
			if(tree.child == 2) {
				this.backwards(tree.node1,this.tree[stage].ancestorFixed[i],i);
				this.backwards(tree.node2,this.tree[stage].ancestorFixed[i],i);
			} else if(tree.child == 1) {
				this.backwards(tree.node2,this.tree[stage].ancestorFixed[i],i);
			} else  {
			}
			return;
		};

		// Old backward pass
		g.prototype.backward = function(stage) {
			var len = this.grid[0].length;
			var arr = [];
			for(var i=0;i<len;i++) {
				var x = this.forward(stage,i);
				if(x.length < 1)
					arr.push("x");
				else if (x.length == 1 || x.indexOf("x") != 0) { 
					//arr.push(x[Math.floor(Math.random()*x.length)]);
					arr.push(x[0]);
				}
				else
					arr.push(x[1]);
			}
			return arr;
		};

		//start of fitch
		g.prototype.trace = function(A,B,stage) {
			//assuming everything same length
			//var arr = this.forwardBackward(A,B,stage);
//			var arr = this.backward(stage);
			var arr = this.tree[stage].ancestorFixed;
			var log = function () {
				this.match =  0;
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
			logA = this.traceScore(arr,A,logA);
			logB = this.traceScore(arr,B,logB);

			var score = logA.match*weight.match + logA.mismatch*weight.mismatch + logA.open*weight.open + logA.extend*weight.extend +
					logB.match*weight.match + logB.mismatch*weight.mismatch + logB.open*weight.open + logB.extend*weight.extend;
			
			if(window.DEBUG) {
				console.log("@trace - score > "+score);
				console.log("@trace - ancester > "+arr);
				console.log(arr);
			}
			return { ancester: arr, score: score };  
	
		};

		g.prototype.trans = function(a) {
			//switch to domCache later for faster retreival
			if(a != "x") 
				return this.translate($("#"+a).css("background-color"));
			else
				return "x";
		};
		g.prototype.traceScore = function(arr,seq,log) {
			for(var i=0;i<arr.length;i++) {
				if (arr[i] == "x") {
//					continue;
					if (this.trans(seq[i]) != "x") {
						if (i != 0 && arr[i-1] == "x") {
							log.extend++;
						}
						else {
							log.open++;
						}
					}
						
				}
				else if (this.trans(seq[i]) == "x") {
					if (i != 0 && (seq[i-1] == "x" && arr[i-1] != "x")) {
						log.extend++;
					}
					else {
						log.open++;
					}
				}
				else if (this.trans(seq[i]) == arr[i] || seq[i] == arr[i]) {
					log.match++;
				}
				else {
					log.mismatch++;
				}
			}
			if(window.DEBUG)
				console.log(log.match + 'Match ' + log.mismatch + 'Mismatch ' + log.open + 'Open ' + log.extend + 'Extend ');
			return log;
		};

		g.prototype.score = function(stage) {
			var pos = this.tree[stage];
			var b = 0;
			var c = 0;
			if(window.DEBUG) {
			console.log("@score - depth - game lv > "+stage);
			}
			if(pos.child == 0) {
				var a = this.trace(this.grid[pos.node1],this.grid[pos.node2],stage);
			} else if(pos.child == 1) {
				var a = this.trace(this.grid[pos.node1],this.score(pos.node2),stage);
				b = this.tree[pos.node2].score;
			} else {
				var a = this.trace(this.score(pos.node1), this.score(pos.node2),stage);
				c = this.tree[pos.node1].score + this.tree[pos.node2].score;
			}
			a.score += b + c;
			//console.log(b + " <> "+c);	
			if(pos.score == undefined) {
				//pos.bestScore = a.score;
				pos.bestAncester = a.ancester;
				pos.ancester = a.ancester;
				pos.score = a.score;
				pos.seq1 = this.grid[pos.node1];
				pos.seq2 = this.grid[pos.node2];
			} else if(a.score > pos.score) {
				//pos.bestScore = a.score;
				pos.bestAncester = a.ancester;
				pos.ancester = a.ancester;
				pos.score = a.score;
				pos.seq1 = this.grid[pos.node1];
				pos.seq2 = this.grid[pos.node2];
			} else {
				pos.ancester = a.ancester;
				pos.score = a.score;
			}
			if(this.par != undefined) { 
				if(pos.score >= 0)
					$("#ctn-score-"+stage).html("+"+pos.score);
				else
					$("#ctn-score-"+stage).html("<span style='color:red'>"+pos.score+"</span>");
			}
			return a.ancester;
		}

		g.prototype.setPar = function(par) {
			this.par = par;
		};

		g.prototype.algo = function(grid, gs, gData, tree, stage) {				
			this.grid = grid;
			this.gs = gs;
			this.gData = gData;
			this.tree = tree;
			this.stage = stage;
			this.backwardroot(stage);
			var ancester = this.score(stage);
			if(DEBUG) {
				console.log(tree);
				console.log(grid);
			}
			if(this.tree[stage].bestScore == undefined)
				this.tree[stage].bestScore = -1000;
			if(window.DEBUG)
				console.log("@algo > "+this.tree[stage].score);
			if(this.tree[stage].score >= this.tree[stage].bestScore) {
				this.tree[stage].bestScore = this.tree[stage].score;
				this.bestGrid = [];
				//note array uses reference in js, this is the trick to fix it!!!
				for(var i=0;i<grid.length;i++) {
					this.bestGrid.push(grid[i].slice(0));	
				}
			}
			if(this.par != undefined) { 
				$("#score").html(window.lang[0].body.play.gameselect["game board"]["field 1"]+": "+this.tree[stage].score+"<br><label class='par'>"+window.lang[0].body.play.gameselect["game board"]["field 2"]+": "+this.par[stage]+"</label><br><label class='par'>"+window.lang[0].body.play.gameselect["game board"]["field 3"]+": "+(stage+1)+"/"+tree.length+"</label><br><label class='par'>"+window.lang[0].body.play.gameselect["game board"]["field 4"]+": "+tree[stage].bestScore+"</label>");
				//$("#score").html("Score: "+this.tree[stage].score+"<br><label class='par'>Par: "+this.par[stage]+"</label><br><label class='par'>Stage: "+(stage+1)+"/"+tree.length+"</label><br><label class='par'>Best Score: "+tree[stage].bestScore+"</label>");
				if(tree[stage].score >= this.par[stage]) {
				//	$("#game-star").addClass("game-star-shadow");
					//changed to
					$(".game-cycle").hide();
					$(".game-star").show();
					$("#game-star").addClass("game-proceed");
					//end of change
					$("#game-star").css("opacity","1");
					var f = this;
					for(var i=0;i<3;i++) {
						window.setTimeout(function() {
							f.starAnimation();	
						},1000*i);
					}
				} else {
				//	$("#game-star").removeClass("game-star-shadow");
					//changed to
					$(".game-cycle").show();
					$(".game-star").hide();
					$("#game-star").removeClass("game-proceed");
					//end of change
					$("#game-star").css("opacity","0.5");
				}
			}
			seq.buildRootAncester(gs.xPx,gs.yPx,gs,ancester);	
			animate.updateTree(this.tree,stage);
			return this.tree;
		};
		g.prototype.starAnimation = function() {
			var gs = this.gs;
			window.setTimeout(function() {
				if($("#game-star").hasClass("game-proceed") == false)
					return;
				$("#game-star").animate({
					top : -1*gs.xPx
				},200,function() {
					$(this).animate({
						top:""
					},200,function() {
						$(this).animate({
							top:-1*gs.xPx/2
						},180,function() {
							$(this).animate({
								top:""
							},150);
						});
					});	
				});
				
			},0);
		};

		//rebuilds the best scoring structure for the user
		g.prototype.reset = function() {
			var stage = this.stage;
			var gs = this.gs;
			for(var i=0;i<this.bestGrid.length;i++)
				for(var j=0;j<this.bestGrid[i].length;j++)
					if(this.bestGrid[i][j] != "x")
						$("#"+this.bestGrid[i][j]).css("left",gs.xPx*gs.xMargin+j*gs.xPx+2);
			this.grid = this.bestGrid.slice(0);
			gameIDE.updateGrid(this.grid);
			this.tree = fitch.algo(this.grid,this.gs,this.gData,this.tree,this.stage);
			if(this.par != undefined) { 
				console.log("dasd");
				//$("#score").html("Score: "+this.tree[stage].bestScore+"<br><label class='par'>Par: "+this.par[stage]+"</label><br><label class='par'>Stage: "+(stage+1)+"/"+tree.length+"</label><label class='par'>Best Score: "+tree[stage].bestScore+"</label>");
				$("#score").html(window.lang[0].body.play.gameselect["game board"]["field 1"]+": "+this.tree[stage].score+"<br><label class='par'>"+window.lang[0].body.play.gameselect["game board"]["field 2"]+": "+this.par[stage]+"</label><br><label class='par'>"+window.lang[0].body.play.gameselect["game board"]["field 3"]+": "+(stage+1)+"/"+tree.length+"</label><br><label class='par'>"+window.lang[0].body.play.gameselect["game board"]["field 4"]+": "+tree[stage].bestScore+"</label>");
				//$("#score").html("Score: "+this.tree[stage].bestScore+"<br><label class='par'>Par: "+this.par[stage]+"</label>");
				if(this.tree[stage].bestScore >= this.par[stage]) {
				//	$("#game-star").addClass("game-star-shadow");
					//changed to
					$(".game-cycle").hide();
					$(".game-star").show();
					$("#game-star").addClass("game-proceed");
					//end of change
					$("#game-star").css("opacity","1");
					for(var i=0;i<3;i++) {
						window.setTimeout(function() {
							f.starAnimation();	
						},1000*i);
					}
				} else {
					//$("#game-star").removeClass("game-star-shadow");
					//changed to
					$(".game-cycle").show();
					$(".game-star").hide();
					$("#game-star").removeClass("game-proceed");
					//end of change
					$("#game-star").css("opacity","0.5");
				}
			}
		};
		
		g.prototype.resetPosition = function(stage) {
			var tree = this.tree[stage];
			if(tree.child == 0) {
				this.format(tree.seq1,tree.node1);
				this.format(tree.seq2,tree.node2);	
			} else if (tree.child == 1) {
				this.resetPosition(tree.node1);
				this.format(tree.seq2,tree.node2);
			} else {
				this.resetPosition(tree.node1);
				this.resetPosition(tree.node2);
			}
		};
		
		g.prototype.format = function(seq,node) {
			console.log(node);
			var gs = this.gs;
			for(var i=0;i<seq.length;i++) {
				if(seq[i] != "x") 
					$("#"+seq[i]).css("left", gs.xPx*gs.xMargin + i*gs.xPx); 
			}	
		};

		g.prototype.translate = function(color) {
			if(color == "#71B2E2")
				return "A";
			if(color == "#9932CC")
				return "G";
			if(color == "#008000")
				return "C";
			if(color == "#FFA500")
				return "T";
			if(color == "rgb(153, 50, 204)")
				return "G";
			if(color == "rgb(0, 128, 0)")
				return "C";
			if(color == "rgb(113, 178, 226)")
				return "A";
			if(color == "rgb(255, 165, 0)")
				return "T";
			return null;
		}
		var proto = g.prototype,
			attr  = [["score",proto.score],
				 ["reset",proto.reset],
				 ["setPar",proto.setPar],
				 ["translate", proto.translate],
				 ["endGameScore", proto.endGameScore]
				];
		common.exportSingleton("fitch",g,attr);
	})();

	//render builds the sequence
	(function() {
		function s() {}
		s.prototype.color = "";
		s.prototype.translate = function(x) {
			if(x == "A") 
				return 1;
			if(x == "G")
				return 2;
			if(x == "C")
				return 3;
			if(x == "T")
				return 4;
			return null;
		};
		s.prototype.getColor = function(x) {
			switch(x) {
				case 1: 
					color = "#71B2E2";
					break;
				case 2: 
					color = "#9932CC";
					break;
				case 3:
					color = "#008000";
					break;
				case 4:
					color = "#FFA500";
					break;
				default:
					color = null;
					break;
			}
			return color;
		}
		//yBlock, xBlock are the size per cell
		//gs contains all the game setting values
		s.prototype.buildRootAncester = function(yBlock,xBlock,gs,gData) {
			if(document.getElementById("ancestor") == null) {
				var div = document.createElement("div");
				div.id = "ancestor";
				document.getElementById("sandbox").appendChild(div);
				$("#ancestor").addClass("ancestor");
			}
			var str='';	
			var color = function(x) {
				if(x =="A") 
					return "#71B2E2";
				else if( x == "G")
					return "#9932CC";
				else if( x == "C")
					return "#008000";
				else if( x == "T")
					return "#FFA500";
				else
					return "";
			};
			for(var i=0;i<gData.length;i++) {
				var top = (yBlock*(gs.yMargin)+yBlock*gs.y)+4;
				var left = (xBlock*gs.xMargin)+xBlock*i+2;
				str+="<div class='ancestorSequence' style='height:"+((yBlock-2)/2)+"px;width:"+(xBlock-2)+"px;left:"+left+"px;top:"+top+"px;background-color:"+color(gData[i])+"'></div>";
			}
			$("#ancestor").html(str);
		}

		s.prototype.build = function(yBlock,xBlock,gs,gData) {
			var str ="";
			for(var i=0;i<gData.length;i++) {
				str+="<div class='row' id='row"+i+"'>";
				var counter = 0;
				for(var j=0;j<gData[i].length;j++) {
					var c = gData[i].charAt(j);	
					if(c != "_") {
						var top = (yBlock*gs.yMargin)+yBlock*i+2;
						var left = (xBlock*gs.xMargin)+xBlock*j+2;
						str+= "<div class='sequence' id='"+(i*gs.seqLen+counter)+"' style='height:"+(yBlock-2)+"px;width:"+(xBlock-2)+"px;left:"+left+"px;top:"+top+"px;background-color:"+this.getColor(this.translate(c))+"'></div>";
						counter++;
					}
				}
				//build red line;
				var top = (yBlock*gs.yMargin)+yBlock*i+(yBlock/2.4);
				var left = (xBlock*gs.xMargin)+2;
 
				str+="<div class='redLine' id='red"+i+"' style='display:none;height:"+(yBlock/4)+"px;width:"+(xBlock*gs.x-2)+"px;left:"+left+"px;top:"+top+"px'></div>";
				str+="</div>";
			}
			return str;
		}

		var proto = s.prototype,
				attr = [["buildAncester",proto.buildAncester]];
				common.exportSingleton("seq",s,attr);
		
		//buiid background
		function b() {}
		b.prototype.build = function(xBlock,yBlock,gs) {
			var data = "<div>";
			for(var i=0;i<gs.y;i++) {
				for(var j=0;j<gs.x;j++) {
					var top = (yBlock*gs.yMargin)+yBlock*i;
					var left = (xBlock*gs.xMargin)+xBlock*j;
					data+= "<div class='bgGrid' style='top:"+top+"px;left:"+left+"px;height:"+(yBlock-2)+"px;width:"+(xBlock-2)+"px'></div>";	
				}
			}
			data+='</div>';
			return data;
		};

		//warning
		function w() {}
		w.prototype.alt = function(str) {
			bug.lightbox(str);	
		}

		//when game initiates this part needs to be called to build everything
		//then calls the controller to manage it
		function g() {}
		//configuration for the grids and positioning	
		g.prototype.renderConfig = function() {
			var doc = document, win = window;
			var xBlock = Math.abs(win.innerWidth/(25+1.2+1));
			if(window.option == true) {
				xBlock = Math.abs((win.innerWidth*0.8) / (25+1.2+1));
				window.optionScale = win.innerWidth*0.1;
			}
			var yBlock = xBlock;
			//game scale
			if(common.checkDevice() == "other") {
				var gs = {
					y : 10,
					x : 25,
					xMargin : 1.2,
					yMargin : 1.0,
					seqLen : 30,
					xPx : xBlock,
					yPx : yBlock
				};
			} else if(common.checkDevice() == "ipad") {
				var gs = {
					y : 10,
					x : 25,
					xMargin : 1.2,
					yMargin : 2.0,
					seqLen : 30,
					xPx : xBlock+4,
					yPx : yBlock+4
				};
		
			} else {
				xBlock = Math.abs(win.innerWidth/(25+1.2));
				yBlock = xBlock;
				var gs = {
					y : 8,
					x : 25,
					xMargin : 0.6,
					yMargin : 1.2,
					seqLen : 30,
					xPx : xBlock,
					yPx : yBlock
				};
			}
			return gs;
		};

		g.prototype.renderEngine = function(doc,win) {
			
				$("#playButton").remove();
				$("#splashLogo").remove();
			//console.log($("#sandbox").offset().top);
			//addtional stuff to support	
				
			//bug fix coz of noise data / old data
			if(doc.getElementById("compactTree") != undefined)
				$("#compactTree").remove();	
			gameID.generate();
			var warning = new w();
			var background = new b();
			var sequence = new s();
			var communication = comm.init;
			var createInSandBox = function(name) {
				var div = document.createElement("div");
				div.id = name;
				document.getElementById("sandbox").appendChild(div);
			};

			//var xBlock = Math.abs(win.innerWidth/(25+1.2+1));
			if(window.option == true) {
				//xBlock = Math.abs((win.innerWidth*0.8) / (25+1.2+1));
				$("#sandbox").css({
					left : win.innerWidth*0.1,
					position : "relative",
					width: 1024 - win.innerWidth*.1,
					"min-width": 1024 - win.innerWidth*.1,
					"max-width" : 1024 - win.innerWidth*.1
				});
				//window.optionScale = win.innerWidth*0.1;
			}
			//var yBlock = xBlock;
			
			//get Game scale
			var gs = this.renderConfig();
			//console.log(gs);

			var data = "";
			/* builds random game data
			//get Game Data;
			gData = communication.getRandomSequence(10); 				
			*/
			gData = animate.getSeq();
			//build background & config (grid)	
			data = background.build(gs.xPx,gs.yPx,gs);
			//build sequence
			data+= sequence.build(gs.xPx,gs.yPx,gs,gData);
			//prepare grid tracking
			this.prepareGridTracking(gData,gs);
			this.gData = gData;
			//this.dumpGrid();
			data+="<div id='fitch' class='fitch'><div id='score'></div></div>";
			//pushed out
			createInSandBox("grids");
			$("#grids").html(data);
			$(".bgGrid").each(function() {
				$(this).css("display","none");
			});
			//set some settings so have another fake thread to manage this game
			this.ancestor = communication;
			animate.init(gs);
			//footer.adjust("play",{ gs : gs});
			this.domCache = this.createDomCache(gs); 
			communication.setSettings(gs,gData,this.Grid,this.createDomCacheWithStyle(gs));
			//console.log(communication.ancestor);
		//	this.gameEngine(xBlock,yBlock,gs,gData);
		};

		
		g.prototype.getJsonAlignments = function() {
			var grid = this.Grid;
			var domCache = this.domCache;
			var str = "[";
			for(var i=0;i<grid.length;i++) {
				str+='"';
				for(var j=0;j<grid[0].length;j++) {
						//fitch.translate();
					if(grid[i][j] == "x") {
						str+="-";
					} else {
						str+=fitch.translate(domCache[grid[i][j]].backgroundColor);
					}
				}
				str+='"';
				if(i < grid.length-2)
					str+=',';
			}
			return '{ "alignments" : '+str+'] }';
		
		};
	
		function cell(id) {
			return document.getElementById(id).style;
		}
		function cell2(id) {
			return document.getElementById(id);
		}

		g.prototype.createDomCacheWithStyle = function(gs) {
			var arr = [],
					grid = this.Grid;		
			for(var i=0, y = gs.y, x = gs.x; i<y*x;i++) {
					arr.push(0);	
			}			
			for(var i=0, n = grid.length; i<n; i++) {
				for( var j=0, k = grid[i].length; j<k; j++) {
					if( grid[i][j] != "x") { 
						arr[grid[i][j]] = document.getElementById(grid[i][j]);//new cell2(grid[i][j]);
					}
				}
			}			
			for(var i=0, j = arr.length;i<j;i++)
				if(arr[i] == undefined)
					arr[i] = 0;
			return arr;
		}

		g.prototype.createDomCache = function(gs) {
			var arr = [],
					grid = this.Grid;		
			for(var i=0, y = gs.y, x = gs.x; i<y*x;i++) {
					arr.push(0);	
			}			
			for(var i=0, n = grid.length; i<n; i++) {
				for( var j=0, k = grid[i].length; j<k; j++) {
					if( grid[i][j] != "x") { 
						arr[grid[i][j]] = new cell(grid[i][j]);
					}
				}
			}			
			for(var i=0, j = arr.length;i<j;i++)
				if(arr[i] == undefined)
					arr[i] = 0;
			return arr;
		};

		g.prototype.dumpGrid = function() {
			if(document.getElementById("dumpGrid")==null) {
				var div = document.createElement("div");
				div.id = "dumpGrid";
				document.body.appendChild(div);	
				$("#dumpGrid").css("position","absolute");
				$("#dumpGrid").css("z-index", "101");
				$("#dumpGrid").css("border-style","solid");
				$("#dumpGrid").css("right","0");
			
			}	
			var data = "";
			for(var i=0;i<this.Grid.length;i++) {
				for(var j=0;j<this.Grid[i].length;j++) {
					data+="&nbsp;"+this.Grid[i][j];
				}
				data+="<br>";
			}
			$("#dumpGrid").html(data);
		}
		//a grid to track the location of the sequence
		g.prototype.prepareGridTracking = function(gData,gs) {
			this.Grid = [];	
			for(var i=0;i<gs.y;i++) {
				var arr = [];
				var counter=0;
				for(var j=0;j<gs.x;j++) {
					if(i< gData.length && j<gData[i].length) {
						if(gData[i].charAt(j) != "_") {
							arr.push(i*gs.seqLen+counter);
							counter++;
						} else 
							arr.push("x");
					} else 
						arr.push("x");
				}
				this.Grid.push(arr);
			}
		};

		g.prototype.updateGrid = function(grid) {
			this.Grid = grid.slice(0);
		};
		
		//this part initiates the events of moving and snapping 
		g.prototype.gameEngine = function(gs,gData,tree,stage){
			var engine = this;
				//desktop mode
			var xBlock = gs.xPx,
				yBlock = gs.yPx;
			tree = fitch.algo(engine.Grid,gs,engine.gData,tree,stage);
			/* kill all events, reinitalize them on each stage */
			if(common.checkDevice() == "other") {
				$(".sequence").each(function() {
					$(this).unbind("mouseup");
					$(this).unbind("mousedown");
				});
			} else {
				$(".sequence").each(function() {
					$(this).unbind("touchmove");
					$(this).unbind("touchend");
				});

			}
			$(".current").each(function() {
				var id = parseInt(this.id.replace(/row/,""));
				$(this).children().each(function() {
				if($(this).hasClass("sequence")) {
					var f = this;
					if(common.checkDevice() == "other") {
						
						$(this).mousedown(function(e) {
							$(document).mousemove(function(e) {
								e.preventDefault();  		//will this fix FF bug?
								$("#red"+id).show("fast");
								engine.move(f,e,gs);
								mcb.run("onMoveStart");
							});
							$(document).mouseup(function(e) {
								$("#red"+id).hide("fast");
								$(document).unbind("mousemove");
								$(document).unbind("mouseup");
								engine.snap(f,e,gs);
								tree = fitch.algo(engine.Grid,gs,engine.gData,tree,stage);
								mcb.run("onMoveStop");
								//engine.dumpGrid();
							});
						});
					} else {
						var s = this;
						var touchmove = function(e) {
							if($(s).hasClass("blackoutseq")) {
								return;
							}
							e.preventDefault();
							$("#red"+id).show("fast");
							$(e.changedTouches).each(function(){
								engine.move(f,this,gs);
								mcb.run("onMoveStart");
							});	
						};
						var touchend = function(e) {
							$(e.changedTouches).each(function() {
								if(!e.targetTouches.length) {
									$("#red"+id).hide("fast");
									engine.snap(f,this,gs);
									tree = fitch.algo(engine.Grid,gs,engine.gData,tree,stage);
								mcb.run("onMoveStop");
								};
							});	
						};
						this.ontouchmove = touchmove;
						this.ontouchend = touchend;
						this.ontouchstart = function() {
							$("#multiSelectBox").hide();
						};
						/* not work
						$(this).touchstart(function() {
							$("#red"+id).show("fast");
							engine.move(f,this,gs);
						});
						$(this).touchend(function() {
							$("#red"+id).hide("fast");
							engine.snap(f, this, gs);
							tree = fitch(engine.Grid,gs,engine,gData,tree,stage);
						}); */
					}
				}
				});
			});
		};
	
		//for loop version
		g.prototype.movePhysicsLoop = function(RIGHT, target,e,gs,c) {
			var pos = parseInt(target);
			var domCache = this.domCache;
			//var start = new Date().getMilliseconds();
			var oS = window.optionScale;
			if(RIGHT) {
				while(true) { 
				//	console.log(pos);
				//dom expensive calls
					//$("#"+pos).css("zIndex",100-c);
					domCache[pos].zIndex = 100-c;
					var scale = (c*gs.xPx) +gs.xPx/2;
					var x = e.pageX - oS + scale;
					var y = (gs.xPx*gs.xMargin)+ gs.xPx*gs.x;
					var move = ((e.pageX-oS)+c*gs.xPx-(gs.xPx/2));
					if(x > y) {
						break;
					}
					if(domCache[pos+1] != 0) {
						if(domCache[pos+1] == undefined) {
							domCache[pos].left = move + "px";
							break;
						}
						//if(((e.pageX-window.optionScale)+(c*gs.xPx)) > parseInt($("#"+(pos+1)).css("left"))-(gs.xPx*.5)) {
						if(((e.pageX-window.optionScale)+(c*gs.xPx)) > parseInt(domCache[pos+1].left)-(gs.xPx*.5)) {
							//$("#"+pos).css("left",move);
							domCache[pos].left = move + "px";
							c++;
						} else {
							//$("#"+pos).css("left",move);
							domCache[pos].left = move + "px";
							break; 
						}
					} else { 
						//$("#"+pos).css("left",move);
						domCache[pos].left = move + "px";
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
				//	console.log(pos);
					//$("#"+pos).css("zIndex",100+c);
					domCache[pos].zindex = 100+x;
					var scale = (c*gs.xPx) - (gs.xPx/2);
					var x = gs.xPx*gs.xMargin;
					var y = (e.pageX-oS)+ scale;
					var move = ((e.pageX-oS)+c*gs.xPx-(gs.xPx*0.5));
				//	if((gs.xPx*gs.xMargin) > (e.pageX-window.optionScale)+(c*gs.xPx)-gs.xPx/2) {
					if(x > y) {
						break;
					}
					//if(document.getElementById(pos-1) != undefined) {
					if(domCache[pos-1] != 0) { 
						if(domCache[pos-1] == undefined) {
							domCache[pos].left = move + "px";
							break;
						}
					//	if(parseInt($("#"+(pos-1)).css("left")) > ((e.pageX-window.optionScale)+(c*gs.xPx)-(gs.xPx*1.5))) {
						if(parseInt(domCache[pos-1].left) > ((e.pageX - oS)+(c*gs.xPx)-(gs.xPx*1.5))) {
						//	$("#"+pos).css("left",((e.pageX-window.optionScale)+c*gs.xPx-(gs.xPx*0.5)));
							domCache[pos].left = move + "px";
							c--;
						} else {
							//$("#"+pos).css("left",((e.pageX-window.optionScale)+c*gs.xPx-(gs.xPx*0.5)));
							domCache[pos].left = move + "px";
							break;
						}
					} else {
						//$("#"+pos).css("left",((e.pageX-window.optionScale)+c*gs.xPx-(gs.xPx*0.5)));
							domCache[pos].left = move + "px";
						break;
					}
					pos-=1;
				//	if(document.getElementById(pos) == undefined)
					if(domCache[pos] == undefined)
						break;
					if(domCache[pos] == 0)
						break;
				}
			}
			return;
		};


		//determining left or right
		g.prototype.move = function(f,e,gs) {
			//check if moving left or right
			var prevPageX = parseInt($(f).css('left').replace(/px/,""));
			if((e.pageX-window.optionScale)-(gs.xPx/2) > prevPageX) {//moving Right
			//	if(window.optimize)
					this.movePhysicsLoop(true,parseInt(f.id),e,gs,0);
			//	else
			//		this.movePhysics(true,parseInt(f.id),e,gs,0);				
			} else if((e.pageX-window.optionScale)-(gs.xPx/2) == prevPageX) {//moving Right
				return;
			} else { 
			//	if(window.optimize)
					this.movePhysicsLoop(false, parseInt(f.id),e,gs,0);	
			//	else
			//		this.movePhysics(false,parseInt(f.id),e,gs,0);
			} 
		};

		g.prototype.log = function(str) {
			if (!window['console']) {
			    // Enable console
			    if (window['loadFirebugConsole']) {
				window.loadFirebugConsole();
			    } else {
				// No console, use Firebug Lite
				var firebugLite = function(F,i,r,e,b,u,g,L,I,T,E){if(F.getElementById(b))return;E=F[i+'NS']&&F.documentElement.namespaceURI;E=E?F[i+'NS'](E,'script'):F[i]('script');E[r]('id',b);E[r]('src',I+g+T);E[r](b,u);(F[e]('head')[0]||F[e]('body')[0]).appendChild(E);E=new Image;E[r]('src',I+L);};
				firebugLite(document,'createElement','setAttribute','getElementsByTagName','FirebugLite','4','firebug-lite.js','releases/lite/latest/skin/xp/sprite.png','https://getfirebug.com/','#startOpened');
			    }
			} else {
			    // console is already available, no action needed.
				console.log("@log [BUG] > "+ str);
			}
		};

		//snapping algorithm
		g.prototype.snap = function(f,e,gs) {
		//	var start = new Date().getMilliseconds();
			var g = this;
			var getSeqLength = function(x) {
				var count = 0;
				for(var i=0;i<g.gData[x].length;i++) {
					if(g.gData[x][i] != "_")
						count++;
				}
				return count;
			};
			var getGridY = function(f) {
				var f = parseInt(f);
				for(var i=0;i<g.Grid.length;i++) {
					if(i*gs.seqLen <= f && f < i*gs.seqLen+30) {
						break;
					}	
				}
				return i;
			};
			var i = getGridY(f.id);
			var length = getSeqLength(i);
			var prevPos = -1;
			var domCache = this.domCache;
			var margin = gs.xPx*gs.xMargin;

			// a forward filter
			for(var x=0;x<length;x++) {
				//left
				var left = i*gs.seqLen+x;
				var minBorder = x*gs.xPx+margin;
				var maxBorder = (gs.x-(length-x))*gs.xPx+margin;
				//var cssLeft = parseInt($("#"+left).css("left"));
				var cssLeft = parseInt(domCache[left].left);
				//if(document.getElementById(left) != undefined) {
				if(domCache[left] != 0) {
				//	if(x*gs.xPx+margin < cssLeft && cssLeft < (gs.x-(length-x))*gs.xPx+margin) {
					if(minBorder < cssLeft && cssLeft < maxBorder) {
						var diff = (cssLeft-margin)%gs.xPx;
						var pos = Math.round((cssLeft-diff-margin)/gs.xPx + 1);
						if(diff > gs.xPx/2)
							pos+=1;	
						if(pos < x)
							pos+=1;
						if(pos > x)
							pos-=1;
					}
					if(x*gs.xPx+margin > cssLeft) {
						pos = x;
					} else if(cssLeft > (gs.x-(length-x))*gs.xPx+margin) {
						pos = gs.x-(length-x);
					}
					/*a bug fix */
					if(pos == prevPos)
						pos+=1;
					else if(prevPos > pos)
						pos = prevPos + 1;
					prevPos = pos;
					if(window.DEBUG)
						console.log("@snap > grid 2 > "+pos);
					/* end of bug fix */
					$("#"+left).animate({ left: pos*gs.xPx+margin+2},300);
					//$("#"+left).css("xIndex",100);
					domCache.zIndex = 100;
					var origin = g.Grid[i].indexOf(left);
					g.Grid[i][origin] = "x";
					g.Grid[i][Math.round(pos)] = Math.floor(left);
				}
			}
	//		var elapsed = new Date().getMilliseconds() - start;
	//		console.log("BenchMark: "+elapsed);
		};

		var proto = g.prototype,
			attr = [["renderEngine",proto.renderEngine],
				["renderConfig",proto.renderConfig],
				["dumpGrid", proto.dumpGrid],
				["gameEngine",proto.gameEngine],
				["updateGrid",proto.updateGrid],
				["getJsonAlignments",proto.getJsonAlignments],
				["snap",proto.snap]
				];
			common.exportSingleton("gameIDE",g,attr);

	})();	
	//some animations
	(function() {
		function g() {}
		//adds the lightbox child div to body
		g.prototype.registerLightbox = function() {
			if(document.getElementById("lightbox") == undefined) {
				var div = document.createElement("div");
				div.className = "lightbox";
				div.id = "lightbox";
				document.body.appendChild(div);
			}
		};
		//removes lightbox child
		g.prototype.killLightbox = function() {
			var doc = document;
			if(doc.getElementById("lightbox") != undefined) 
				doc.body.removeChild(doc.getElementById("lightbox"));
		};

		//get max doc height
		g.prototype.getDocHeight = function(){
		     var D = document;
		     return Math.max(Math.max(D.body.scrollHeight,    D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
		};	
		//get max doc width
		g.prototype.getDocWidth = function(){
		     var D = document;
		     return Math.max(Math.max(D.body.scrollWidth,    D.documentElement.scrollWidth), Math.max(D.body.offsetWidth, D.documentElement.offsetWidth), Math.max(D.body.clientWidth, D.documentElement.clientWidth));
		};	

		//adds the child div if does not exist as well as adding the lightbox content child
		g.prototype.buildLightbox = function() {
			this.registerLightbox();
			if(document.getElementById("lbContent") == undefined) {
				var div = document.createElement("div");
				div.id = "lbContent";
				div.className = "lbContent";
				document.getElementById("lightbox").appendChild(div);
			}
		};

		//the main caller for lightbox
		g.prototype.lbContent = function(handler) {
			if(document.getElementById("lbContent") == undefined)
				this.buildLightbox();
			handler();
		};

		g.prototype.sleep = function() {
			var doc = document,
				win = window;			
			var f = this;
			//bug here for tablet, tablet here cannot kick in

			if(win.innerHeight > win.innerWidth && common.checkDevice() != "other") {
				if(doc.getElementById("sleep") == undefined ) {
					var div = doc.createElement("div"); 
					div.id = "sleep";
					div.style.height = screen.height;
					div.style.width = screen.width;
					div.style.zIndex = "170";
					div.style.backgroundColor = "black";
					div.style.opacity = "0.9";
					div.style.position = "absolute";
					doc.getElementById("sandbox").appendChild(div);
					div.id = "sleepMsg";
					div.style.zIndex = "171";
					div.style.position = "absolute";
					doc.getElementById("sandbox").appendChild(div);
					var langText;
					if (mcb.GET("lang") == "fr")
						langText = "<p> SVP faites pivoter votre appareil mobile!</p>";
					else
						langText = "<p>Sorry for the interupt! Please rotate your device into landscape mode!</p>";
					$("#sleepMsg").html(langText);
					$("#sleepMsg").css("top", "5em");			
					$("#sleepMsg").css("fontSize","200%");
				}
				if(document.getElementById("menu").style.display != "none" && common.checkDevice() != "ipad" ) {
					console.log("why am i here?");
					$("#sleep").html("");
					$("#sleepMsg").html("");
					return;
				}
				win.setTimeout(function() {
					console.log("did i meet this");
					f.sleep();
				},1000);
			} else {
				$("#sleep").html("");
				$("#sleepMsg").html("");
				if(common.checkDevice() == "other" ^ common.checkDevice() == "ipad")
					this.splashLogo(doc,win);
				else
					this.displayGameMenu(doc,win);
				return;
			}
		};

		g.prototype.splashLogo = function(doc, win) {
				var img = new Image();
				var gs = gameIDE.renderConfig();
				$("#sandbox").css({
					"left" : "",
					"position" : ""
				});
				if(doc.getElementById("playButton") == undefined) {
					if(doc.getElementById("splashPageWrapper") == undefined) {
						var div2 = doc.createElement("div");
						div2.id = "splashPageWrapper";
						doc.getElementById("sandbox").appendChild(div2);
					}
					if(mcb.cookie.read("PhyloFBLogin") != null || mcb.cookie.read("PhyloLogin") != null) {
						var div = doc.createElement("div");
						div.id = "checkGuestContent";
						div.innerHTML = ((mcb.GET("lang")=="en")?"Welcome back! Not ":"Bienvenue! Non ")+(mcb.cookie.read("PhyloFBLogin")==null?mcb.cookie.read("PhyloLogin"):mcb.cookie.read("PhyloFBLogin").replace(/\/.*/,""))+"? <a href='#' id='logout'><span style='position:relative;top:0.2em;'>"+((mcb.GET("lang") == "en")?"Log Out":"déconnecter")+"</span></a>";
						doc.getElementById("splashPageWrapper").appendChild(div);	


						var left=(mcb.deviceType=="desktop")?'35%':'20%';
						$("#checkGuestContent").css({
							"top" : "0%",
							"left" : left,
							"zIndex": "151",
							"width" : "30%",
							"height" : "5px auto",	
							"position":"relative",
							"border-radius" : "0.5em",
							"-webkit-border-radius" : "0.5em",
							"-moz-border-raidus" : "0.5em",
							"-khtml-border-radius" : "0.5em",
							"backgroundColor" : "white",
							"color" : "black",
							"padding" : "0.2em 0 0.2em 0.2em"
						});		
						$("#logout").css({
							position:"absolute",
							right:0,	
							top:0,
						 	padding:"0em 2em",
							height:'100%',
							"backgroundColor" : "#71B2E2",
							"border-radius" : "0em 0.5em 0.5em 0",	
							"-webkit-border-radius" : "0em 0.5em 0.5em 0",	
							"-moz-border-radius" : "0em 0.5em 0.5em 0",	
							"-khtml-border-radius" : "0em 0.5em 0.5em 0",	
						});
					}
					img.src = "http://phylo.cs.mcgill.ca/img/phylo_front_logo.png";
					img.id = "splashLogo";
					//img.style.top = gs.yPx*gs.yMargin + "px";
					img.className = 'phylo_logo1';
					doc.getElementById("splashPageWrapper").appendChild(img);
					var div = doc.createElement("a");
					div.id = "playButton";
					div.className = "phylo_play";
					if (mcb.GET("lang") == "fr" ) div.innerHTML = "JOUEZ";
					else div.innerHTML = "PLAY";
					div.href = "#";
					doc.getElementById("splashPageWrapper").appendChild(div);
					$("#splashPageWrapper").css({
						"min-width" : 688
					});
				
					var just = 0;
					
					var scale = function() {
						if(window.innerWidth > 1024) {
							var x = window.innerWidth - parseInt($("#splashPageWrapper").css("width").replace(/px/,""));
							if(x < 0)
							x=0;
							$("#splashPageWrapper").css("left",x/2);
							if(window.innerWidth < 1473) {
								$("#playButton").css({
									top : window.innerHeight*.25,
									left : window.innerWidth*.45,
									position : "absolute",
									height : "5%",
								});
								$(".phylo_logo1").css({
									width : window.innerWidth,
									top : "-2.9em",
									position: "relative"
								});
								$(".phylo_logo2").css({
									left : "3em",
									width: window.innerWidth/3
								});
							}

						} else { //smaller than 1024
							if((window.innerWidth > 668) || just==0) {
								$("#splashPageWrapper").css({ left : ""});
								$("#footer").css("left","");
								if(document.getElementById("checkGuestContent") == undefined) {
									$(".phylo_logo1").css("top", "-.9em");	
								}
								$("#splashLogo").css({ 
									width : window.innerWidth,
									float: "left"
								 });
								$("#playButton").css({ 
									left : window.innerWidth / -1.7,
									float : "left",
									"top" : window.innerHeight*.35,
									"font-size" : "1.0em",
									"height" : "1.3em",
									position : "relative",
									zIndex : 10
								});
								$("#splashLogo2").css({
									float : "left",
									width : window.innerWidth /3,
									height:"",
									"min-width" : "0",
									"min-height" : "0",
									"left" : "3em"
								});
								$("#checkGuestContent").css({
									"left" : window.innerWidth /2.9
								});
							}	
						}
							window.foot = function() {
								if(document.getElementById("gameMenu") != undefined) {
									$("#footer").css({
										"left": x/2+100,
										"top": document.getElementById("gameMenu").offsetHeight + 110
									});

								} else {
									$("#footer").css({
										"left": x/2+100,
										"top": document.getElementById("splashLogo").offsetHeight
									});
								}
							};
							var foot = window.foot;
						if(document.getElementById("splashLogo") != undefined) {
							if(document.getElementById("splashLogo").offsetHeight == 0) {
								window.setTimeout(function() { foot(); },500);
							}  else 
								foot();
						}
						just = 1;
					};
					scale();
					$(window).resize(function() { scale(); });

					var f = this;
					try {
						login.init();
					} catch (err) {
						console.log("Login Code Broke");
						console.log(err);
					}
					$("#playButton").click(function() {
						f.displayGameMenu(doc,win);
						$("#splashPageWrapper").hide();
					});
				} else {
					$("#splashPageWrapper").show();
				}
		};

		g.prototype.displayHTML5GameMenu = function(doc,win)  {
			var gs = gameIDE.renderConfig();
			var canvas = doc.createElement("canvas");
			canvas.id = "gameMenuCanvas";
			doc.body.appendChild(canvas);
			if(window.option) {
				$("#gameMenuCanvas").css("left", win.innerWidth*0.1);
			}
			$("#gameMenuCanvas").css({
				position : "absolute",
				top : (gs.yMargin)*gs.xPx,
				height : gs.y*gs.xPx,
				width : gs.x*gs.yPx,
				zIndex : 150,
			});

			canvas = doc.getElementById("gameMenuCanvas");
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0,0,gs.x*gs.xPx,gs.y*gs.yPx);
			ctx.closePath();
			ctx.fill();
			console.log("height "+gs.y*gs.xPx + " width "+gs.x*gs.xPx);
			//var img = new Image();
			//img.onload = function() {
			//	ctx.drawImage(img,70,0,150,150);
			//};
			//img.src = "http://phylo.cs.mcgill.ca/img/logo.png";
			ctx.fillStyle = "red";
			ctx.font = "36pt Arial";
			ctx.fillText(" Failed...",50,40);
			ctx.fillText("< Play >",50,100);
			
		};

		g.prototype.getSeq = function() {
			return this.collectedSeq;
		};
		
		g.prototype.getGameTree = function() {
			if(window.DEBUG)
				console.log(this.format);
			return this.format;
		};

		g.prototype.buildGameTree = function(tree) {
			if(DEBUG)
				console.log(tree);
			    var i=0,k=0;
			    var safe = [];
			    this.format = [];
			    var format = this.format;
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
						    var d =  { "lv" : i++, "depth": c, "child" : 0,"node1": k++, "node2": k++,"p1": x , "p2": y}; 
						    format.push(d);
						  //  console.log(d);
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
								format.push(d);
						//	    console.log(d);
							    return d;
							} else if(typeof(y) == "object") {
							    var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : k++, "node2" : y.lv,"p1":x};
								format.push(d);
						//	    console.log(d);
							    return d;
							} else if(typeof(x) == "object") {
							    var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : k++, "node2" : x.lv,"p1":y};
								format.push(d);
						//	    console.log(d);
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
								format.push(d);
						//	    console.log(d);
							    return d;
							} else if(typeof(y) == "object") {
							    var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : k++, "node2" : y.lv,"p1":x};
								format.push(d);
						//	    console.log(d);
							    return d;
							} else if(typeof(x) == "object") {
							    var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : k++, "node2" : x.lv,"p1":y};
								format.push(d);
						//	    console.log(d);
							    return d;
							}
						    }
						} else {
							if(typeof(y) == "object" && typeof(x) == "object") {
							    var d =  { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" : y.lv};
								format.push(d);
						//	    console.log(d);
							    return d;
							} else if(typeof(y) == "object") {
							    var d = { "lv" : i++,"depth": c, "child" : 1, "node1" : k++, "node2" : y.lv,"p1":x};
								format.push(d);
						//	    console.log(d);
							    return d;
							} else if(typeof(x) == "object") {
							    var d = { "lv" : i++, "depth" : c, "child":1 , "node1" : k++, "node2" : x.lv,"p1":y};
								format.push(d);
						//	    console.log(d);
							    return d;
							}
						}
					    } else if(typeof(x) == "object" && typeof(y) == "object") {
						var d = { "lv" : i++,"depth": c, "child" : 2, "node1" : x.lv, "node2" :y.lv };
								format.push(d);
						//console.log(d);
						return d;
					    }
				    }
				return "";
			    }
			buildTree(tree,0);
					
		};
		g.prototype.endGameMenu = function(value) {

			//remove click event
			$("#game-star").unbind('click');

			var gs = this.gs;
			var f = this;
			var nice = false;
			if(value == 0) {
				nice = true;				
			} else {
				//check make sure game is gd or bad
			}			
			
			$("#sandbox").append("<div id='endGameMenu'><div id='endGameMenu-context'><div id='endGameMenu-body'></div></div></div>");
			

			$("#endGameMenu").css({
				"position" : "absolute",
				"top" : ($("#menu").css("display") == "block")?document.getElementById("menu").offsetHeight:0,
				"left" : -parseInt($("#sandbox").css("left")),
				"height" : parseInt(window.innerHeight) - $("#sandbox").offset().top,
				"width" : window.innerWidth,//parseInt(screen.availWidth)+parseInt($("#sandbox").css("left")),
				"background-color":"#000000",
				"opacity" : "0.95",
				"z-index": "180"
			});	

			if(common.checkDevice() == "ipad") {
				$("#endGameMenu").css({
					"width" : parseInt(screen.availWidth)+parseInt($("#sandbox").css("left"))*3
				});
			}
	
			$("#endGameMenu-context").css({
				"position" : "relative",
				"top" : ($("#menu").css("display") =="block")?parseInt($("#menu").css("height"))+parseInt($("#menu").css("top")):gs.yPx*gs.xMargin ,
				"left" : parseInt($("#sandbox").css("left")),
				"height" : gs.yPx*gs.y,
				"width" : gs.xPx*gs.x,
				"z-index" : "181",
				"border-style" : "solid",
				"border-width" : "1px",
				"border-color" : "#FFFFFF",
				"background-color" : "#303030"
			});

			
			var score = fitch.endGameScore();
			var content = "";	

			if(!nice) {
				if(score.stage  == score.stageLength-1 && score.score >= score.par)
					nice = true;
			}

			mcb.setWinLoose(nice);
			mcb.run("gameEnd");

			//console.log("hit...?");


			if(nice)
				context = lang[0].body.play.gameselect["end of game"]["field 3"];
			else { //failed
			/* gameID (diff from ingame ID) = this.seqID */
				//console.log(this.roundID);
				context = lang[0].body.play.gameselect["end of game"]["field 4"];
			}

			context +="<br>";
	
			var endGameContext = lang[0].body.play.gameselect["end of game"];
			//build text box
			$("#endGameMenu-context").html("<div id='endGameMenu-context-header'></div><div id='endGameMenu-context-body'></div><div id='endGameMenu-button'></div></div>");
			$("#endGameMenu-button").html("<a href='#' id='newGame' class='endGameMenu-button'>"+endGameContext["field 11"]+"</a><a href='#' id='replayGame' class='endGameMenu-button'>"+endGameContext["field 12"]+"</a>");
	
			var f = this;		
			$("#newGame").click(function() {
				//$("#sandbox").html("");
				//$("#sandbox").css("left","");
				//f.displayGameMenu(document,window);	
				var hash = "reload";
				window.location.hash = hash; 
			});
			$("#replayGame").click(function() {
				$("#sandbox").html("");
				$("#sandbox").css("left","");
				f.start(document,window);	
			});

			$(".endGameMenu-button").css({
				"padding-left": "20%",
				"padding-right": "20%"
			});


			if(common.checkDevice() != "other" && common.checkDevice() != "ipad") {

			} else {
				$("#endGameMenu-context-header").css({
					"position": "relative",		
					"top" : "0",
					"height" : "30%",
					"width" : "90%",
					"left" : "30%"
				});

				$("#endGameMenu-context-body").css({
					"position" : "relative",
					"left" : "5%",
					"height" : "70%",
					"width" : "90%",
					"overflow-y" :"scroll",
					"overflow-x" : "hidden"	
				});
			}
			
			document.getElementById("endGameMenu-context-header").appendChild(images.get("thankyou"));
			$("#thankyou").css({
				"height": "100%"
			});

			var roundID = this.roundID;
			var url = "../phpdb/phyloDB2.php";
			//loading.install();
			if(nice) {
				$.post(url,{ "mode" : 4, "id" : roundID, "user" : window.guest, "align" : gameIDE.getJsonAlignments(), "score" : score.score },function(data) {
				//	loading.uninstall();
					try {
					//	console.log(data);		
						var json = eval("["+data+"]");
					} catch(err) {
					//	console.log(data);
						if (mcb.GET("lang") == "fr")
							bug.lightbox("Oops! Le serveur a plant&eacute;!<br> Nous ne pouvions pas vous dire le r&eacute;sultat.<br>S'il vous pla&icirc;t r&eacute;essayer plus tard.");
						else
							bug.lightbox("Oops! The Server Crashed!<br> We couldnt tell you the result.<br>Please Try again later");
						console.log(data);
						return;
					}
					json = json[0];
					/*
					if (mcb.GET("lang") == "fr") {
						context+= "Vous avez jou&eacute; au niveau <label class='end-color'>"+f.roundID+"</label>. Rappelez-vous cette identit&eacute; si vous souhaitez jouer &agrave; ce niveau encore plus tard!<br> L'ADN de ce niveau a &eacute;t&eacute; li&eacute;e &agrave;: <label class='end-color'>"+json.disease_link+"</label>.<br><br>Ce niveau a &eacute;t&eacute; compl&eacute;t&eacute; <label class='end-color'>"+json.play_count+ "</label> fois.<br>Les autre joueurs n'ont pas r&eacute;ussi &agrave; compl&eacute;ter ce niveau <label class='end-color'>"+json.fail_count+"</label> fois.<br><br>Le meilleur score pour ce niveau est: <label class='end-color'>"+json.best_score+"</label>.<br>Le score moyen pour ce niveau est: <label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>.<br><br>";
						context+= "<label class='end-color'>"+json.highscore_user+"</label> a le meilleur score pour ce niveau.<br><br>";
					}
					else {
						context+= "You played level <label class='end-color'>"+f.roundID+"</label>. Remember this ID if you wish to play this level again later!<br> The DNA in this puzzle has been linked to: <label class='end-color'>"+json.disease_link+"</label>.<br><br>This level has been completed <label class='end-color'>"+json.play_count+ "</label> times.<br>Users have failed to reach this level <label class='end-color'>"+json.fail_count+"</label> times.<br><br>The high score for this level is: <label class='end-color'>"+json.best_score+"</label>.<br>The average score for this level is: <label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>.<br><br>";
						context+= "<label class='end-color'>"+json.highscore_user+"</label> has the highest score for this level.<br><br>";
					}
*/
					var endGameContext = lang[0].body.play.gameselect["end of game"];
				
					context+= endGameContext["field 5"].replace("***","<label class='end-color'>"+f.roundID+"</label>") +
						" <label class='end-color'>"+json.disease_link+"</label>.<br><br>"+endGameContext["field 6"].replace("***","<label class='end-color'>"+json.play_count+"</label>").replace(".",".<br>").replace("***","<label class='end-color'>"+json.fail_count+"</label>") +"<br><br>"+
						endGameContext["field 7"].replace("***","<label class='end-color'>"+json.best_score+"</label>")+"<br>"+
						endGameContext["field 8"].replace("***","<label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>") +"<br><br>"+
						endGameContext["field 9"].replace("***","<label class='end-color'>"+json.highscore_user+"</label>");

					$("#endGameMenu-context-body").html(context);
						
				}).error(function() {
			//		//loading.uninstall();
					if (mcb.GET("lang") == "fr")
						bug.lightbox("Oops! Pas de connexion.<br> Etes-vous connect&eacute; &agrave; Internet?");
					else
						bug.lightbox("Oops! We couldnt connect to the server.<br>We suspect you are not connected to the internet!");
				}); 
			} else {
				$.post(url,{ "mode" : 3, "id" : roundID },function(data) {
			//		loading.uninstall();
					try {
					//	console.log(data);		
						var json = eval("["+data+"]");
					} catch(err) {
					//	console.log(data);
						if (mcb.GET("lang") == "fr")
							bug.lightbox("Oops! Le serveur a plant&eacute;!<br> Nous ne pouvions pas vous dire le r&eacute;sultat.<br>S'il vous pla&icirc;t r&eacute;essayer plus tard.");
						else
							bug.lightbox("Oops! The Server Crashed!<br> We couldnt tell you the result.<br>Please Try again later");						console.log(data);
						return;
					}
					json = json[0];
					/*
					if (mcb.GET("lang") == "fr") {
						context+= "Vous avez jou&eacute; au niveau <label class='end-color'>"+f.roundID+"</label>. Rappelez-vous cette identit&eacute; si vous souhaitez jouer &agrave; ce niveau encore plus tard!<br>L'ADN de ce niveau a &eacute;t&eacute; li&eacute;e &agrave;: <label class='end-color'>"+json.disease_link+"</label>.<br><brCe niveau a &eacute;t&eacute; compl&eacute;t&eacute; <label class='end-color'>"+json.play_count+ "</label> fois.<br>Les autre joueurs n'ont pas r&eacute;ussi &agrave; compl&eacute;ter ce niveau <label class='end-color'>"+json.fail_count+"</label> fois.<br><br>Le meilleur score pour ce niveau est: <label class='end-color'>"+json.best_score+"</label>.<br>Le score moyen pour ce niveau est: <label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>.<br><br>";
						context+= "<label class='end-color'>"+json.highscore_user+"</label > a le meilleur score pour ce niveau.<br><br>";
					}
					else {					
					*/
					/*
						context+= "You played level <label class='end-color'>"+f.roundID+"</label>. Remember this ID if you wish to play this level again later!<br> The DNA in this puzzle has been linked to: <label class='end-color'>"+json.disease_link+"</label>.<br><br>This level has been completed <label class='end-color'>"+json.play_count+ "</label> times.<br>Users have failed to reach this level <label class='end-color'>"+json.fail_count+"</label> times.<br><br>The high score for this level is: <label class='end-color'>"+json.best_score+"</label>.<br>The average score for this level is: <label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>.<br><br>";
						context+= "<label class='end-color'>"+json.highscore_user+"</label> has the highestscore for this level.<br><br>";
					*/
					//}
					var endGameContext = lang[0].body.play.gameselect["end of game"];
					console.log(endGameContext);
						context += endGameContext["field 5"].replace("***","<label class='end-color'>"+f.roundID+"</label>") +
							"<label class='end-color'>"+json.disease_link+"</label>.<br><br>"+
							endGameContext["field 6"].replace("***","<label class='end-color'>"+json.play_count+"</label>").replace("***","<label class='end-color'>"+json.fail_count+"</label>")+"<br><br>"+
							endGameContext["field 7"].replace("***","<label class='end-color'>"+json.best_score+"</label>")+"<br><br>"+
							endGameContext["field 8"].replace("***","<label class='end-color'>"+Math.round(json.running_score/json.play_count)+"</label>")+"<br><br>"+
							endGameContext["field 9"].replace("***","<label class='end-color'>"+json.highscore_user+"</label>")+"<br><br>";
					$("#endGameMenu-context-body").html(context);
						
				}).error(function(){
			//		loading.uninstall();
					if (mcb.GET("lang") == "fr")
						bug.lightbox("Oops! Pas de connexion.<br> Etes-vous connect&eacute; &agrave; Internet?");
					else
						bug.lightbox("Oops! We couldnt connect to the server.<br>We suspect you are not connected to the internet!");
				}); 
			}
		};

		g.prototype.getDiseaseList = function() {
			 var disease = [["digestive",[95,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,748,749,750,751,752,753,754,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,2103,2104,2105,2106,2107,2108,2109,2110,2111,2112,2113,2114,2115,2116,2117,2118,2119,2120,2121,2122,2123,2124,2125,2126,2127,2128,2129,2130,2131,2132,2133,2134,2135,2136,2137,2138,2139,2140,2141,2142,2143,2144,2145,2146,2147,2148,2149,2150,2151,2152,2153,2154,2155,2156,2157,2158]],
        ["heart",[378,378,379,380,381,382,383,384,385,386,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,2008,2009,2010,2011,2012,2013,2014,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,999,1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040,1249,1250,1251,1252,1253,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1271,1272,1273,1274,1275,573,574,575,576,577,1390,1391,1392,1393,1394,1395,1175,1176,1177,1178,1179,1180,663,664,665,666,667,668,
                           669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692]],
        ["cancer",[124,124,125,126,127,128,129,130,131,132,133,134,135,136,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,506,507,508,509,510,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1812,1813,1814,1815,580,581,582,583,584,585,586,1535,1536,1537,1538,1539,1540,1541,1542,1543,1544,1545,1546,1547,1548,1549,1550,1551,1552,1553,1554,1555,1556,1557,1558,1559,1560,1561,1562,1563,1564,1565,1566,1567,1568,1569,1570,1571,1572,1573,1574,1575,1576,1577,1578,1579,1580,1581,1582,1583,1584,1585,1586,1587,1588,1589,1590,1591,1592,1593,1594,1595,1596,1597,1598,1599,1833,1834,1835,1836,1837,1838,1839,1840,1841,1842,1843,1844,1845,1846,1847,1848,1849,1850,1851,1852,1853,1854,1855,1856,1857,1858,1859,1860,1861,1862,1863,1864,1865,1866,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,601,602,603,604,605,1662,1663,1664,1665,1666,1667,1668,1669,1670,1671,1672,1673,1674,1675,1676,1677,1678,1679,1680,1681,1682,1683,1684,1685,1686,1687,1688,1689,1690,1691,1692,                            1693,1694,1695,1696,1697,1698,1699,1700,1701,1702,1703,1704,1705,1706,1707,1708,1709,1710,1711,1712,1713,1714,1715,1716,1717,1718,1719,1720,1721,1722,1723,1724,1725,1726,1727,1728,1729,1730,1731,1732,1733,1734,1735,1736,1737,1738,1739,1740,1741,1742,1743,1744,1745,1746,1747,1748,1749,1750,1751,1752,1753,1754,1755,1756,1757,1758,1759,1760,1761,1762,1763,1764,1765,1766,1767,1768,1769,658,659,660,661,693,694,695,696,697,511,512,513,514,515,516,517,1788,1789,1790,1791,1792,1793,1794,1795,1796,1797,1798,1799,1800,1801,1802,1803,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,802,803,804,805,806,807,808,809,810,811,812,305,306,307,308,309,310,311,312,313,314,315,316,317,1286,1287,1288,1289,1290,1291,1292,1293,1294,1295,1296,1297,1298,1299,1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311]],
        ["metabolic", [1773,1773,1774,1775,1776,1777,1778,1779,1780,1781,1782,1783,1784,1785,1786,1787,389,390,391,1804,1805,1806,1807,1808,1809,1810,1811,578,579,1531,1532,1533,1497,1498,1499,1500,1501,1502,1503,1504,1505,1506,1507,1508,1509,1510,1511,1512,1513,1514,1515,1516,1517,1518,1519,1520,1521,1522,1523,1524,1525,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1892,1893,1894,1895,1896,1897,1898,1899,1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1653,1654,1655,1656,1657,1658,1659,1660,1661,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,467,468,469,1611,1612,1613,1614,1615,1616,1617,1618,1619,1620,1621,1622,1623,1624,1625,1626,1627,1628,1629,1630,1631,1632,1633,1634,1635,1636,1637,1638,1639,1640,1641,1642,1643,1644,1645,1646,1647,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,480,481,1820,1821,1822,1823,1824,1825,556,4,5,6,7,8,9,
                               10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1134,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,1453,1454,1455,1456,1457,1458,1459,1460,1461,1462,1463,1464,1465,606,607,608,609,610]],
        ["blood", [252,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,1600,1601,1396,1397,1398,1399,1400,1401,1402,1403,1404,1405,1406,1407,1408,1409,1410,1411,1412,1413,1414,1415,1416,1417,1418,1419,1420,1421,1422,1423,1424,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,2159,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1425,1426,1427,1428,1472,1473,1474,1475,1476,1477,1478,1479,1480,1481,1482,1483,1484,1485,1486,1487,1488,1489,1490,1491,1492,1493]],
        ["sensory", [470,470,471,472,473,474,475,476,477,478,479,1312,1313,1314,1315,1316,1317,1318,1319,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349,1350,1351,1352,1353,1354,1355,1356,1357,1358,1359,1360,1361,1362,1363,1364,1365,1366,1367,1368,1369,1370,1371,1372,1373,1374,1375,1376,1377,1378,1379,1380,1381,1382,1383,1384,1385,1386,1387,1388,1186,1187,620,621,622,623,1197,1198,1199,1200,1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1230,1231,1232,1233,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,387,388,1120,1121,1122,1123,1124,1125,1126,1127,1128,1129,1130,1131,1132,1133,1081,1082,1083,1084,1085,1086,643,644,645,646,647,648,649,650,651]],
        ["brain",[1,1,2,3,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055,2056,2057,2058,2059,2060,2061,2062,2063,2064,2065,2066,2067,2068,2069,2070,2071,2072,2073,2074,2075,2076,2077,2078,2079,2080,2081,2082,2083,2084,2085,2086,2087,2088,1816,1817,1818,1819,2089,2090,2091,2092,2093,2094,2095,2096,2097,2098,2099,2100,2101,2102,501,502,503,504,505,1056,1057,1058,1059,1060,1061,779,780,781,782,783,784,785,786,787,788,1062,1063,1064,1065,1066,1067,158,159,160,161,162,163,164,165,1149,1150,1151,1152,1153,1154,1155,1156,1157,1158,1159,1160,1161,1162,1163,1164,1165,1166,1167,1168,1169,1170,1171,1172,1173,1174,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,
                           434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,118,119,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1146,1147,1148,543,544,545,546,547,548,549,550,551,552,553,789,790,791,792,793,794,795,796,797,798,799,800,801,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,1963,1964,1965,1966,1967,1968,1969,1970,1971]],	
        ["muscles", [252,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,1600,1601,1396,1397,1398,1399,1400,1401,1402,1403,1404,1405,1406,1407,1408,1409,1410,1411,1412,1413,1414,1415,1416,1417,1418,1419,1420,1421,1422,1423,1424,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,2159,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1425,1426,1427,1428,1472,1473,1474,1475,1476,1477,1478,1479,1480,1481,1482,1483,1484,1485,1486,1487,1488,1489,1490,1491,1492,1493]],
        ["lung", [252,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,1600,1601,1396,1397,1398,1399,1400,1401,1402,1403,1404,1405,1406,1407,1408,1409,1410,1411,1412,1413,1414,1415,1416,1417,1418,1419,1420,1421,1422,1423,1424,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,2159,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1425,1426,1427,1428,1472,1473,1474,1475,1476,1477,1478,1479,1480,1481,1482,1483,1484,1485,1486,1487,1488,1489,1490,1491,1492,1493]]];
			return disease;
		};
		

		g.prototype.displayGameMenu = function(doc,win) {
			$("#sandbox").css({"left":"", "position":""});

			var f = this;
			var gMenu = {
				random : function() {
					$("#gameContent").html("");
					var data = "";
					var color = ["#71B2E2","darkOrchid","green","orange"];
					for(var i=3;i<=8;i++)
						data+="<a href='#' class='gameOpt' style='background-color:"+color[((i-3)>3)?i-7:i-3]+";'>"+i+"</a>";
					data += "<div id='gameFootNote'><div class='g-line'>Easy</div><div id='gline' class='g-line'></div><div class='g-line'>Hard</div></div>";
					$("#gameContent").html(data);
					$(".gameOpt").click(function(){
					});
				},
				level: function() {
					$("#gameContent").html("");		
					var data = "<div id='game-level'>Enter Level ID:<br><input id='game-level-id' class='game-input' type='text'/><br><a href='#' id='game-level-submit'>Submit</a></div>";
					$("#gameContent").html(data);
					if(common.checkDevice() != "other" && common.checkDevice() != "ipad") {
						$("#game-level").css({
							"zIndex": "172",
							"position" : "relative",
							"top" : parseInt($("#gameContent").css("height"))*3/10,
							"left" : parseInt($("#gameContent").css("width"))*0.5/10
						});
				
					} else {
						$("#game-level").css({
							"zIndex": "172",
							"position" : "relative",
							"top" : parseInt($("#gameContent").css("height"))*2/10,
							"left" : parseInt($("#gameContent").css("width"))*2.5/10
						});
					}
					$("#game-level-submit").click(function() {
						//$("#gameMenu").hide();
						var url = "../phpdb/phyloDB2.php";
						var id = $.trim($("#game-level-id").val());
						if(id == "") {
							if (mcb.GET("lang") == "fr")
								bug.lightbox("Oops! SVP entrer un niveau valide");
							else
								bug.lightbox("Oops! Please enter a valid Level ID");
							return;
						}
						//loading.install();
						$.post(url, { "mode": 2,"id": id},function(data) {
							//loading.uninstall();
							if(data == "") {
								bug.lightbox("Incorrect ID");
							} else {
								data = data.replace("@","");		
								try {
									var json = eval("["+data+"]");
								} catch(err) {
									console.log(data);
									if (mcb.GET("lang") == "fr")
										bug.lightbox("Oops! Pas de connexion.<br> Etes-vous connect&eacute; &agrave; Internet?");
									else
										bug.lightbox("Oops! We couldnt connect to the server.<br>We suspect you are not connected to the internet!");
									return;
								}
								$("#gameMenu").hide();
								json = json[0].level;
								f.roundID = json.attributes.id;
								for(var i = 0;i<json.sequence.length;i++) {
									json.sequence[i] = (json.sequence[i].replace(/-/g,"_")).toUpperCase();
								}
								f.collectedSeq = json.sequence;
								if(window.DEBUG)
									console.log(json.tree);
								var tree = newick.parse(json.tree);
								f.buildGameTree(tree);
								f.start(doc,win);
							}
						}).error(function(){
							//loading.uninstall();
							if (mcb.GET("lang") == "fr")
								bug.lightbox("Oops! Pas de connexion.<br> Etes-vous connect&eacute; &agrave; Internet?");
							else
								bug.lightbox("Oops! We couldnt connect to the server.<br>We suspect you are not connected to the internet!");
						}); 
					});
				},
				disease : function() {
					var disease = f.getDiseaseList();
					$("#gameContent").html("");
					var data = "";
					var color = [
							["digestive","../img/digestive.png","150px",""],
							["heart", "../img/heart.png","110px","30px"],
							["cancer", "../img/cancer.png","100px","55px"],
							["metabolic", "../img/metabolic.png","100px",""],
							["blood","../img/blood.png","50px","10px"],
							["sensory","../img/sensory.png","60px","30px"],
							["brain","../img/brain.png","80px",""],
							["muscles","../img/muscles.png","60px",""],
							["lung","../img/lung.png","60px",""]];
					for(var i=0;i<color.length;i++) {
						/*if(i > 2) {
						data+="<a href='#' class='gameDisease' style='left:4em' id='d"+i+"'><img src='"+color[i][1]+"'/></a>";
						} else */
						data+="<a href='#' class='gameDisease' id='d"+i+"'><img src='"+color[i][1]+"' style='position:relative;left:"+color[i][3]+";height:"+color[i][2]+";padding-bottom:1em;'/></a>";
					}
					$("#gameContent").html(data);
					$(".gameDisease").click(function(){
						//loading.install();
						var url = "../phpdb/phyloDB2.php";
						var name = parseInt($(this).attr("id").replace(/d/,""));
						var id = disease[name][1][Math.floor(Math.random()*disease[name][1].length)];
						$.post(url, { "mode": 2,"id": id},function(data) {
							//loading.uninstall();
							if(data == "") {
								bug.lightbox("Incorrect ID");
							} else {
								data = data.replace("@","");		
								try {
									var json = eval("["+data+"]");
								} catch(err) {
									console.log(data);
									if (mcb.GET("lang") == "fr")
										bug.lightbox("Oops! Pas de connexion.<br> Etes-vous connect&eacute; &agrave; Internet?");
									else
										bug.lightbox("Oops! We couldnt connect to the server.<br>We suspect you are not connected to the internet!");
									return;
								}
								$("#gameMenu").hide();
								json = json[0].level;
								f.roundID = json.attributes.id;
								for(var i = 0;i<json.sequence.length;i++) {
									json.sequence[i] = (json.sequence[i].replace(/-/g,"_")).toUpperCase();
								}
								f.collectedSeq = json.sequence;
								if(window.DEBUG)
									console.log(json.tree);
								var tree = newick.parse(json.tree);
								f.buildGameTree(tree);
								f.start(doc,win);
							}
						}).error(function() {
							//loading.uninstall();
							if (mcb.GET("lang") == "fr")
								bug.lightbox("Oops! Pas de connexion.<br> Etes-vous connect&eacute; &agrave; Internet?");
							else
								bug.lightbox("Oops! We couldnt connect to the server.<br>We suspect you are not connected to the internet!");
						}); 
					});
				},	
				config : function() {
					//fixing the gameMenu	
					var gM = document.getElementById("gameMenu");
					var scal = function() {
						if(window.innerWidth < gM.offsetWidth) {
							gM.style.left = "0px";
						} else {
							gM.style.left = ((window.innerWidth - gM.offsetWidth ) /2) + "px"; 
						}
					};
					
					scal();
					window.foot();
					$(window).resize(function() { scal(); });
				} ,
				configMobile : function() {
					$("#gameMenu").css({
						"background":"url()",
						"left" : "0px"
					});		
					$("#footer").css("left" , "2em");

				}
			};
			//default tab

			window.gameMenuArray = [
					["en:Random", "fr:Aléatoire",gMenu.random],
					["en:Level ID","fr:ID Niveau",gMenu.level],
					["en:Disease", "fr:Maladie",gMenu.disease]
					//["en:Tutorial","fr:Tutoriel",tutorial.fn.menuTutorial]
					];
			var gameMenuArray = window.gameMenuArray;

			//start of menu building
			var lang = mcb.GET("lang");
			var data = "<div id='gameMenu'><div id='gameType'>";
			for(var i=0;i<gameMenuArray.length;i++) {
				for(var j=0;j<gameMenuArray[i].length-1;j++) {
					if(gameMenuArray[i][j].search(lang) > -1) {
						if(i==0) 
							data+="<div class='gameTab' style='z-Index:171;'>"+gameMenuArray[i][j].replace(lang+":","")+"</div>";
						else
							data+="<div class='gameTab'>"+gameMenuArray[i][j].replace(lang+":","")+"</div>";
						break;
					}	
				}
			}
			data+="</div><div id='gameContent'></div>";
			
			$("#sandbox").append(data);
			if(common.checkDevice() != "other" && common.checkDevice() !="ipad")
				gMenu.configMobile();
			else
				gMenu.config();
			gMenu.random();
			
			var gameSwitch = function() {
				var variable = $(this).html();
				for(var i=0;i<gameMenuArray.length;i++) {
					for(var j=0;j<gameMenuArray[i].length-1;j++) {
						if(gameMenuArray[i][j].search(variable) > -1) {
							$("#gameContent").html("");		
							try {
								gameMenuArray[i][gameMenuArray[i].length-1]();
							} catch(err) {
								console.log("Error loading gamemMenu of "+variable+" > "+err);
							}
							break;
						}
					}
				}
				$(".gameTab").each(function() {
					$(this).css("zIndex","");
				});
				$(this).css("zIndex","171");
			};
			$(".gameTab").bind("click",gameSwitch);
			//$(".gameTab").bind("mouseover",gameSwitch);
			//end of menu building
		};

		g.prototype.start = function(doc,win) {
			//usage
			var f = this;
			this.lbContent(function() {
				 var lb = document.getElementById("lbContent");
				lb.style.position = "absolute";
				lb.style.top = window.innerHeight *0.40 + "px";	
				lb.style.left = window.innerWidth * 0.45 +"px";
				
				var setSplash = function(x) {
					lb.innerHTML = x;
					lb.style.fontSize = "70px";	
					$("#lbContent").addClass("startSplash");
					//$("#lbContent").animate({ fontSize: "30px"},1000);
					if(x > 0)
						window.setTimeout(function() {
							setSplash(--x);
						},1100);
					else {
						f.killLightbox();			
						gameIDE.renderEngine(doc,win);
					} 
						
				};
				setSplash(3);
			});			
		};		

		//sets up the tree
		g.prototype.enableTree = function() {
			//lightbox on current content
			var f = this,
				gs = this.gs;
			$("#sandbox").append("<label id='treeButton'>Show Tree</label><div id='treeGroup' style='display:none;'><div id='treeBG'></div><div id='tree'></div></div>");
			$("#treeButton").css("top",gs.yPx*gs.yMargin+(gs.y+1.3)*gs.yPx);
			$("#treeButton").css("left",gs.xPx*gs.xMargin);
			$("#treeButton").css("height","1em");
			$("#treeButton").css("padding", "1px 1px 1px 1px");
			if(common.checkDevice() == "other") {
				$("#treeButton").css("width","4.8em");
			} else {
				$("#treeButton").css("width","6em");
			}
			$("#treeButton").css("backgroundColor","#FFFFFF");
			$("#treeButton").css("color","black");
			$("#tree").css("top",gs.yMargin*gs.yPx);
			$("#tree").css("left",gs.xMargin*gs.xPx);
			$("#tree").css("height",(gs.y+1)*gs.yPx+5);
			$("#tree").css("width",gs.x*gs.xPx+5);
			$("#treeBG").css("top",gs.yMargin*gs.yPx);
			$("#treeBG").css("left",gs.xMargin*gs.xPx);
			$("#treeBG").css("height",(gs.y+1)*gs.yPx+5);
			$("#treeBG").css("width",gs.x*gs.xPx+5);
			
			$("#treeButton").click(function() {
				if($("#treeButton").html() == "Show Tree") {
					f.buildTree();
					$("#treeGroup").show();
					$("#treeButton").html("Hide Tree");
				} else {
					$("#treeGroup").hide();
					$("#treeButton").html("Show Tree");
				}
			});	
		};

		//builds the tree on the fly
		g.prototype.buildTree = function() {
			$("#tree").html("");
			var gs = this.gs,
				f = this;
			var build = function(tree,stage,c) {
				var top = 0,
					left = gs.xMargin*gs.xPx+gs.xPx*c,
						tmp = 0,
							cDiagonel = true,
								line;
				if(tree[stage].child == 0) {
					if(tree[stage].node1 > tree[stage].node2)
						tmp = tree[stage].node2+(tree[stage].node1-tree[stage].node2)/2;
					else
						tmp = tree[stage].node1+(tree[stage].node2-tree[stage].node1)/2;	
					cDiagonel = false;
				} else if(tree[stage].child == 1) {
					tmp = build(tree,tree[stage].node2,c+3);
					if(tmp > tree[stage].node1)
						top = tree[stage].node1+((tmp - tree[stage].node1)/2);
					else
						top = tmp+(tree[stage].node1 - tmp)/2;
					tmp = top;		
				} else if(tree[stage].child == 2) {
					var l = build(tree,tree[stage].node1,c+3);
					var r = build(tree,tree[stage].node2,c+3);
					if(l > r)
						tmp = r+(l-r)/2;
					else
						tmp = l+(r-l)/2;
				}

				if(window.DEBUG)
					console.log("@build treeChild> "+tmp);
				
				top = (Math.ceil(tmp)-1.29)*gs.yPx+gs.yPx*gs.yMargin;
				$("#tree").append("<div class='treeChild' id='child"+stage+"'style='top:"+top+"px;left:"+left+"px'></div>");
				$("#child"+stage).mouseover(function() {
					f.buildAncester(gs.xPx,gs.yPx,gs,tree[stage].ancester);	
					$(this).removeClass("treeChild");
					$(this).addClass("onTreeChild");
					$("#treeAncester").show("slow");
					$(this).mouseleave(function() {
						$("#treeAncester").hide("slow");
						$(this).removeClass("onTreeChild");
						$(this).addClass("treeChild");
						$(this).unbind("mouseleave");
					});
				});

				if(cDiagonel) {
					if(tree[stage].child == 2) {
						line = f.createDiagonal(top,left,parseInt($("#child"+tree[stage].node1).css("top")),parseInt($("#child"+tree[stage].node1).css("left")));
						document.getElementById("tree").appendChild(line);
					}
					line = f.createDiagonal(top,left,parseInt($("#child"+tree[stage].node2).css("top")),parseInt($("#child"+tree[stage].node2).css("left")));
					document.getElementById("tree").appendChild(line);
					if(tree[stage].child == 1) {
						if(window.DEBUG)
							console.log("MINOR BUG - FIX WHEN HAVE TIME");
						animate.buildAnimal((c+1.5)*gs.xPx+gs.xMargin*gs.xPx,(tree[stage].node1+0.3)*gs.yPx,tree[stage].p1,"tree");
						line = f.createDiagonal(top,left, (tree[stage].node1+0.5)*gs.yPx, (c+1.5)*gs.xPx+gs.xMargin*gs.xPx);
						document.getElementById("tree").appendChild(line);
					}	
				} else{
					animate.buildAnimal((c+1.5)*gs.xPx+gs.xMargin*gs.xPx,(tree[stage].node1+0.3)*gs.yPx,tree[stage].p1,"tree");
					line = f.createDiagonal(top,left, (tree[stage].node1+0.5)*gs.yPx, (c+1.5)*gs.xPx+gs.xMargin*gs.xPx);
					document.getElementById("tree").appendChild(line);
					animate.buildAnimal((c+1.5)*gs.xPx+gs.xMargin*gs.xPx,(tree[stage].node2+0.3)*gs.yPx,tree[stage].p2,"tree");
					line = f.createDiagonal(top,left, (tree[stage].node2+0.5)*gs.yPx, (c+1.5)*gs.xPx+gs.xMargin*gs.xPx);
					document.getElementById("tree").appendChild(line);
				}
				return	Math.ceil(tmp);
			};
			build(this.tree,this.stage,0);			
		};

		g.prototype.buildAncester = function(yBlock,xBlock,gs,gData) {
			if(window.option == true) {
				if(document.getElementById("compactTreeAncester") == undefined) {
					var div = document.createElement("div");
					div.id = "compactTreeAncester";
					div.className = "ancestor";
					div.style.display = "none";
					document.getElementById("sandbox").appendChild(div);
				}
			} else {
				if(document.getElementById("treeAncester") == undefined) {
					var div = document.createElement("div");
					div.id = "treeAncester";
					div.className = "treeAncester";
					div.style.display = "none";
					div.style.width = gs.y*yBlock+"px";
					div.style.height = xBlock+4+"px";
					document.getElementById("tree").appendChild(div);
				}
			}
			var str='';	
			var color = function(x) {
				if(x =="A") 
					return "#71B2E2";
				else if( x == "G")
					return "#9932CC";
				else if( x == "C")
					return "#008000";
				else if( x == "T")
					return "#FFA500";
				else
					return "";
			};
			for(var i=0;i<gData.length;i++) {
				if(window.option == true) {
					if(common.checkDevice() == "other")
						var top = (yBlock*(gs.yMargin)+yBlock*gs.y)+4;//-(yBlock/2);
					else
						var top = (yBlock*(gs.yMargin)+yBlock*gs.y)+4-gs.xPx/2;//-(yBlock/2);
					var left = (xBlock*gs.xMargin)+xBlock*i+2;
					str+="<div class='ancestorSequence' style='height:"+((yBlock-2)/2)+"px;width:"+(xBlock-2)+"px;left:"+left+"px;top:"+top+"px;background-color:"+color(gData[i])+"'></div>";
				} else {
					var top = (yBlock*(gs.yMargin)+yBlock*(gs.y-1.15))+4;
					if(common.checkDevice() !="other" && common.checkDevice() != "ipad")	
						var left = (gs.xPx*gs.xMargin)+gs.xPx*(i-.5);
					else
						var left = (gs.xPx*gs.xMargin)+gs.xPx*(i-1.15);
					str+="<div class='treeAncestorSequence' style='height:"+((yBlock-2)/2)+"px;width:"+(xBlock-2)+"px;left:"+left+"px;top:"+top+"px;background-color:"+color(gData[i])+"'></div>";
				}
			}
			if(window.option == true) {
				$("#compactTreeAncester").html(str);
			} else {
				$("#treeAncester").html(str);
			}
		}
		//creates a diagonal and returns div element
		g.prototype.createAngle = function(y1, x1, y2, x2) {
			y1 = parseInt(y1);
			x1 = parseInt(x1);
			y2 = parseInt(y2);
			x2 = parseInt(x2);
			
			var vertical = document.createElement("div");
			var horizontal = document.createElement("div");
			vertical.className = "angle";
			horizontal.className = "angle";
			
			if(y2>y1) {
				//spans down
				vertical.style.top = y1+"px";
				vertical.style.left = x1+"px";
				vertical.style.height =  (y2-y1)+"px"; 
				vertical.style.borderLeft = "solid 2px #FFF";
				horizontal.style.top = y2+"px";
				horizontal.style.left = x1+"px";
				horizontal.style.width = (x2-x1)+"px";
				horizontal.style.height = "2px";
				horizontal.style.backgroundColor ="#FFFFFF";
			} else {
				//spans up
				vertical.style.top = y2+"px";
				vertical.style.left = x1+"px";
				vertical.style.height = (y1-y2)+"px";//-this.gs.xPx*.5+"px";
				vertical.style.borderLeft = "solid 2px #FFF";
				horizontal.style.top = y2+"px";
				horizontal.style.left = x1+"px";
				horizontal.style.width = (x2-x1) + "px";
				horizontal.style.height = "2px";
				horizontal.style.backgroundColor ="#FFFFFF";
			}

			return { "vertical" :vertical , "horizontal" : horizontal };
		};

		g.prototype.createDiagonal = function(y1,x1,y2,x2) {
			if(window.DEBUG) 
				console.log("@create Diag > "+ x1 + " <> " + y1 + " <> " + x2 + " <> " + y2); 
			y1 = parseInt(y1);
			x1 = parseInt(x1);
			y2 = parseInt(y2);
			x2 = parseInt(x2);
			var line = document.createElement("div");
			line.className = "line";
			var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
			line.style.width = length + "px";
			// Missing IF IE
			
			var angle = Math.atan((y2-y1)/(x2-x1));
			line.style.top = y1 + 0.5*length*Math.sin(angle) +5+ "px";
			line.style.left = x1 - 0.5*length*( 1 - Math.cos(angle))+2+"px";
			line.style.MozTransform = line.style.WebkitTransform = line.style.OTransform = "rotate("+ angle + "rad)";	
			
			return line;
		};

		//updates how the tree looks
		g.prototype.updateTree = function(tree, stage) {
			this.tree = tree;
			this.stage = stage;	
		};

		g.prototype.cssScore = function() {
			var gs = this.gs;
			$("#score").css("top",(gs.y+.7)*gs.yPx+gs.yPx*gs.yMargin);
			if(common.checkDevice() == "other") {
				$("#score").css("left",gs.xPx*gs.xMargin+(gs.x-4.5)*gs.xPx);
			} else {
				$("#score").css("left",gs.xPx*gs.xMargin+(gs.x-5)*gs.xPx);
			}
			if(1024 > window.innerWidth) {
				$("#score").css({
					"font-size" : ".75em",
					"left" : gs.xPx*gs.xMargin+(gs.x-4.5)*gs.xPx
				});
			}
		};

		g.prototype.timer = function() {
			var doc = document,
				win = window,
					div = doc.createElement("div"),
						gs = this.gs;
				div.id = "game-clock";
			div.style.top = (gs.y+.7)*gs.yPx+gs.yPx*gs.yMargin + "px";
			div.style.left = gs.xPx*gs.xMargin+(gs.x-2)*gs.xPx + "px";
			doc.getElementById("sandbox").appendChild(div);
			$("#game-clock").append("<div id='game-timer'>150s</div><div id='game-star'></div>");
			$("#game-star").css({
				"height" : gs.yPx,
				"width" :gs.xPx,
		//		"backgroundColor":"yellow",
		//		"opacity": "0.5"
			});


			$("#game-star").html("<img src='../img/star.png' class='game-star' style='display:none;'/><img src='../img/cycle.png' class='game-cycle' style='opacity:0.7'/>");

			$("#game-star-layer").css( {
				"height" :gs.yPx,
				"width" : gs.xPx
			});

			$(".game-cycle").mouseover(function() {
				$(this).css("opacity","1");
				$(".game-cycle").mouseout(function() {
					$(this).css("opacity","0.7");
					$(".game-cycle").unbind("mouseout");
				});
			});
			var endGameMenu = document.getElementById("endGameMenu");

			var time = function() {
				try {
					var x = parseInt(($("#game-timer").html()).replace(/s/,""));
				} catch(err) {
					//kill the multi select
					animate.killMultiSelect();
					return;
				}
				if(document.getElementById("endGameMenu") != undefined)
					return;
				if(document.getElementById("game-timer") != undefined && 0 < x) {
					try {
					if($("#tutorialContent").hasClass("tutorial-enabled") == false)
						x--;
					} catch(err) {
						console.log("error @ game-timer > "+err);
						x--;
					}
					$("#game-timer").html(x+"s");	
					window.setTimeout(function() {
						time();
					},1000);
				}
				if( x == 0) {
					//failed
					//kill multi select
					animate.killMultiSelect();
					animate.endGameMenu(1);
					//kill game
				}
			};
			time();
		
		};

		g.prototype.buildClock = function() {
			var doc = document,
				win = window,
					div = document.createElement("div"),
						gs = this.gs;
			div.id = 'clock';
			div.style.top = (gs.y+.7)*gs.yPx+gs.yPx*gs.yMargin + "px";
			div.style.left = gs.xPx*gs.xMargin+(gs.x-2)*gs.xPx + "px";
			doc.getElementById("sandbox").appendChild(div);
			$("#clock").append("<div id='clockbg'><div id='clockbgTopLeft'></div><div id='clockbgTopRight'></div><div id='clockbgBottomLeft'></div><div id='clockbgBottomRight'></div></div><div id='rotate'><div id='pie'></div><div id='pieCenter'></div></div>");
			var x = new Date();
			var rotate = {
				set: setInterval(function() {
					if(this.x == undefined)
						this.x = 0;
					else if( this.x == 361)
						this.x = 0;
					var s = ("rotate("+this.x+"deg)");
					$("#rotate").css({'-moz-transform' : s, '-webkit-transform' : s});
					this.x++;
				},0),
				init : function() {
					rotate.set;
				} 
			}
			rotate.init();
			if(common.checkDevice() == "other") 
				$("#pieCenter").click(function() {
					fitch.reset();
				});
			else
				$("#pieCenter").touchstart(function() {
					fitch.reset();
				});
		};
		
		//does all the initial settings
		g.prototype.init = function(gs) {
			this.gs = gs;
			if(!window.option)
				this.enableTree();
			this.cssScore();
			//this.buildClock();
		};
	
		g.prototype.testFontSize = function() {
			if(this.fontSize != undefined)
				return this.fontSize;
			if(document.getElementById("testFontSize") == undefined) {
				var doc = document;
				var div = doc.createElement("div");
				div.id = "testFontSize";
				div.style.display = "none";
				div.style.fontSize = "1em";
				//div.innerHTML = "test";
				doc.body.appendChild(div);		
				doc.getElementById("testFontSize").appendChild(doc.createTextNode('M'));
			}
			this.fontSize = document.getElementById("testFontSize").offsetHeight;
			return this.fontSize;
		};
		
		/* start of building compact Tree */
		g.prototype.buildCompactTreeNode = function(n1,n2,opts) {
			if(n2 > n1) {
				var tmp = n1;
				n1 = n2;
				n2 = tmp;
			}
			var dist = n1+((n1-n2)/2),
				gs = this.gs,
					line;

			if(DEBUG)
				console.log(opts);
			if(opts != 0)
				dist = n1+((n2-n1)/2);
			if(common.checkDevice() == "ipad") 
				var top = gs.yPx*1+gs.yPx*dist;
			else
				var top = gs.yPx*1.5+gs.yPx*dist;
			if(opts != 0)
				top+=gs.yPx;
			var left = (gs.xMargin-1.2)*gs.xPx + (window.optionScale*opts/5)*-1;

			//this technique does not work...
		//	console.log(this.testFontSize());
			
			//fake is for positioning

			var score = this.tree[this.stage].score;
			if(score >= 0)
				score = "+"+score;
			else
				score = "<span style='color:red'>"+score+"</span>";

			//modified default node height here 
			console.log("generate node");
			$("#compactTree").append("<div class='compactTreeNodeFake' id='ctnf"+this.stage+"'style='top:"+(top-gs.xPx)+"px;left:"+left+"px'></div>" +
						"<div class='compactTreeNode' id='ctn"+this.stage+"'style='top:"+(top-gs.xPx*1.15)+"px;left:"+(left-gs.yPx/6)+"px;height:"+gs.xPx/3+"px;width:"+gs.yPx/3+"px'></div>" +
						"<div class='compactTreeNodeScore' id='ctn-score-"+this.stage+"'style='top:"+(top-gs.xPx*1.6)+"px;left:"+(left-gs.yPx/1.6)+"px;height:"+gs.xPx/3+"px;width:"+gs.yPx/1.5+"px;font-size:"+gs.xPx/2.5+"px'>"+score+"</div>");
			var f = this;
			if(common.checkDevice() == "other") {
				$("#ctn"+this.stage).mouseover(function() {
					f.buildAncester(f.gs.xPx,f.gs.yPx,f.gs,f.tree[this.id.replace(/ctn/,"")].ancester);	
					$("#ancestor").hide();
				//	$(this).removeClass("compactTreeNode");
					$(this).addClass("onTreeNode");
					$("#compactTreeAncester").show("fast");
					$(this).mouseleave(function() {
						$("#compactTreeAncester").hide();
						$("#ancestor").show("fast");
						$(this).unbind("mouseleave");
					//	$(this).addClass("compactTreeNode");
						$(this).removeClass("onTreeNode");
					});
				});
			} else {
				$("#ctn"+this.stage).touchstart(function() {
					f.buildAncester(f.gs.xPx,f.gs.yPx,f.gs,f.tree[this.id.replace(/ctn/,"")].ancester);	
					$("#ancestor").hide();
					//$(this).removeClass("compactTreeNode");
					$(this).addClass("onTreeNode");
					$("#compactTreeAncester").show("fast");
					$(this).touchend(function() {
						$("#compactTreeAncester").hide();
						$("#ancestor").show("fast");
					//	$(this).addClass("compactTreeNode");
						$(this).removeClass("onTreeNode");
						$(this).unbind("mouseleave");
					});
				});
			}
		};	

		g.prototype.distLookUp = function(stage) {
			var tree = this.tree;
			if(tree[stage].child == 0) {
				if(tree[stage].node1 > tree[stage].node2)
					return { "score" : (tree[stage].node2 + ((tree[stage].node1-tree[stage].node2)/2)), "seed" : 1};
				else
					return { "score" : (tree[stage].node1 + ((tree[stage].node2-tree[stage].node1)/2)), "seed" : 1};	
			} else if(tree[stage].child == 1) {
				tmp = this.distLookUp(tree[stage].node2);
				if(tmp.score > tree[stage].node1)
					return { "score" : (tree[stage].node1 + ((tmp.score - tree[stage].node1)/2)) , "seed" : tmp.seed+1 };
				else
					return { "score" : (tmp.score + ((tree[stage].node1 - tmp.score)/2)) , "seed" : tmp.seed+1 }; 
			} else if(tree[stage].child == 2) {
				var l = this.distLookUp(tree[stage].node1);
				var r = this.distLookUp(tree[stage].node2);
				if( l.score > r.score)
					return { "score" : r.score +((l.score-r.score)/2) , "seed" : (l.seed > r.seed)?l.seed+1 : r.seed+1 };
				else
					return { "score" : l.score + ((r.score - l.score)/2) , "seed" : (l.seed > r.seed)?l.seed+1 :r.seed+1 };
			}
		}
		
		g.prototype.compactNodeLost = true;

		g.prototype.buildCompactTree = function() {

			if(document.getElementById("compactTree") == undefined) {
				$("#sandbox").append("<div id='compactTree'></div>");
			}
			var stage = this.stage,
				tree = this.tree[stage],
					line, x1, x2, y1 , y2, dy1, gs = this.gs;

			if(stage == 0) {
				if(this.compactNodeLost == true)
					this.compactNodeLost = false;
				else {
					return;
				}
			}
			
			var wildAdjustY = gs.yPx/2;
			if(common.checkDevice() == "ipad") 
				wildAdjustY = 0;

			if(tree.child == 0) {
				this.buildCompactTreeNode(tree.node1, tree.node2, 0);
				//node
				//x & y are node properties
				x = parseInt($("#ctnf"+stage).css("left"));
				y = parseInt($("#ctnf"+stage).css("top"))+1;		
				x1 = gs.xPx*(gs.xMargin-gs.xMargin*0.7);
				y1 = gs.yPx*gs.yMargin + gs.yPx*(tree.node1) + wildAdjustY;
				dy1 = gs.yPx*gs.yMargin + gs.yPx*(tree.node1-.3) + wildAdjustY;
				this.buildAnimal(x1+2,dy1,tree.p1,"compact");
				//line = this.createDiagonal(y,x, y1,x1);
				//document.getElementById("compactTree").appendChild(line);
				line = this.createAngle(y,x,y1,x1);
				document.getElementById("compactTree").appendChild(line.vertical);
				document.getElementById("compactTree").appendChild(line.horizontal);
				y1 = gs.yPx*gs.yMargin + gs.yPx*(tree.node2) + wildAdjustY;
				dy1 = gs.yPx*gs.yMargin + gs.yPx*(tree.node2-.3) + wildAdjustY;
				this.buildAnimal(x1+2,dy1,tree.p2,"compact");
				//line = this.createDiagonal(y,x,y1,x1);
				//document.getElementById("compactTree").appendChild(line);
				line = this.createAngle(y,x,y1,x1);
				document.getElementById("compactTree").appendChild(line.vertical);
				document.getElementById("compactTree").appendChild(line.horizontal);

			} else if(tree.child == 1) {
				var tmp = this.distLookUp(tree.node2);
				this.buildCompactTreeNode(tree.node1, tmp.score, tmp.seed);
				
				y1 = parseInt($("#ctnf"+tree.node1).css("top"));
				x1 = parseInt($("#ctnf"+tree.node1).css("left"));
				x = parseInt($("#ctnf"+stage).css("left"));
				y = parseInt($("#ctnf"+stage).css("top"))+1;
				if(isNaN(y1) && isNaN(y2)) {
					y1 = gs.yPx*gs.yMargin + gs.yPx*(tree.node1) + wildAdjustY;
					dy1 = gs.yPx*gs.yMargin + gs.yPx*(tree.node1-.3) + wildAdjustY;
					x1 = gs.xPx*(gs.xMargin-gs.xMargin*0.7);
					this.buildAnimal(x1+2,dy1,tree.p1,"compact");
				}
				if(window.DEBUG) {
					console.log("");
					console.log("*****ERROR DEBUG *****");
					console.log("tree child @ 1");
					console.log("y1 > "+y1);	
					console.log("x1 > "+x1);	
					console.log("nodes > "+tree.node1 +"<>"+tree.node2);
					console.log("*****END OF DEBUG *****");
					console.log("");
				}
				//line = this.createDiagonal(y,x,y1,x1);
				//document.getElementById("compactTree").appendChild(line);
				line = this.createAngle(y,x,y1,x1);
				document.getElementById("compactTree").appendChild(line.vertical);
				document.getElementById("compactTree").appendChild(line.horizontal);
				y2 = parseInt($("#ctnf"+tree.node2).css("top"));
				x2 = parseInt($("#ctnf"+tree.node2).css("left"));
				//line = this.createDiagonal(y,x,y2,x2);
				//document.getElementById("compactTree").appendChild(line);
				line = this.createAngle(y,x,y2,x2);
				document.getElementById("compactTree").appendChild(line.vertical);
				document.getElementById("compactTree").appendChild(line.horizontal);
			} else if(tree.child == 2) {
				var l = this.distLookUp(tree.node1);
				var r = this.distLookUp(tree.node2);
				this.buildCompactTreeNode(l.score, r.score, ((l.seed>r.seed)?l.seed:r.seed));	
			
				y1 = parseInt($("#ctnf"+tree.node1).css("top"));
				y2 = parseInt($("#ctnf"+tree.node2).css("top"));
				x1 = parseInt($("#ctnf"+tree.node1).css("left"));
				x2 = parseInt($("#ctnf"+tree.node2).css("left"));
				x = parseInt($("#ctnf"+stage).css("left"));
				y = parseInt($("#ctnf"+stage).css("top"))+1;

				//line = this.createDiagonal(y,x,y1,x1);		
				//document.getElementById("compactTree").appendChild(line);
				line = this.createAngle(y,x,y1,x1);
				document.getElementById("compactTree").appendChild(line.vertical);
				document.getElementById("compactTree").appendChild(line.horizontal);
				//line = this.createDiagonal(y,x,y2,x2);		
				//document.getElementById("compactTree").appendChild(line);
				line = this.createAngle(y,x,y2,x2);
				document.getElementById("compactTree").appendChild(line.vertical);
				document.getElementById("compactTree").appendChild(line.horizontal);
			}
		};

		g.prototype.buildAnimal = function(x,y,name,dom) {
			im = images.get(name);
			im.style.top = y+"px";
			im.style.left= x+"px";
			im.style.height = this.gs.yPx*.8 + "px";
			im.style.width = this.gs.xPx*.8 + "px";
			im.style.position = "absolute";
			
			if(dom =="compact") {
				document.getElementById("compactTree").appendChild(im);
			} else {
				document.getElementById("tree").appendChild(im);
			}
			
		}

		g.prototype.stageAnimation = function(stage) {
			this.stage = stage;
			var gs = this.gs;
			var shakeTop = gs.yMargin*gs.yPx + 5*gs.yPx;
			var shakeLeft = gs.xMargin*gs.xPx + 5*gs.xPx;
			var top = gs.yMargin*gs.yPx + 3*gs.yPx;
			var left = gs.xMargin*gs.xPx + 7*gs.xPx;
			var data = "";
	
			if(document.getElementById("stage-animation") == undefined) {
				data+="<div id='stage-animation' style='color:#980000;font-size:6em;top:"+top+"px;left:"+left+"px;position:absolute;z-index:210;width:6em;text-shadow:0px 0px 50px #000'>STAGE "+stage+"</div>";
				$("#sandbox").append(data);	
			} else {
				$("#stage-animation").html("STAGE "+stage);
			}

			window.setTimeout(function() {
				$(".bgGrid").each(function() {
					$(this).css("display","none");
				});
				$("#grids").css("position","absolute");
				$("#grids").css("top","-1em");
				$("#grids").css("left","1em");
	//			$("#stage-animation").css("top",shakeTop);
	//			$("#stage-animation").css("Left",shakeLeft);
				$("#stage-animation").css("display","");
			},0);

			window.setTimeout(function() {
	//			$("#stage-animation").css("top",top);
	//			$("#stage-animation").css("Left",left);
				window.setTimeout(function() {
					$("#stage-animation").css("display","none");
				},800);
			},100);
			
			window.setTimeout(function() {
				$(".bgGrid").each(function() {
					$(this).css("display","");
				});
				$("#grids").css("position","");
				$("#grids").css("top","");
				$("#grids").css("left","");
			},200);
			
		};
		//in game tutorial 
		g.prototype.tutorial = function() {
			var doc = document, win = window,gs = this.gs;
			if(doc.getElementById("tutorialContent") == undefined) {
				var div = doc.createElement("div");
				div.id = "tutorialContent";
				doc.body.appendChild(div);
				var div = doc.createElement("div");
				div.id = "tutorialContent-bg";
				doc.body.appendChild(div);
				$("#tutorialContent").css({
					"left" : "0px",
					"top" : "0px",
					"height" : win.innerHeight+"px",
					"width" : win.innerWidth+"px",
					"display" : "none",
					"zIndex" : "300",
					"position" : "absolute"
				});
				$("#tutorialContent-bg").css({
					"backgroundColor" : "#000000",
					"opacity" : "0.55",
					"left" : "0px",
					"top" : "0px",
					"height" : win.innerHeight+"px",
					"width" : win.innerWidth+"px",
					"display" : "none",
					"zIndex" : "299",
					"position" : "absolute"
				});
			}
			
			var show = {
				begin : function() {
					var tutorialtext;
					if (mcb.GET("lang") == "fr" ) tutorialtext = "z";
					else tutorialtext = "";
					$("#tutorialContent").append("<a id='tutorial-continue' href='#'>"+window.lang[0].body.play.gameselect["short tutorial"]["field 2"]+"</a><div id='tutorial-content-begin'><div class='arrow-left arrow-color'></div><div class='arrow-mid arrow-color'></div><div class='arrow-right arrow-color'></div></div>");
					$("#tutorialContent").addClass("tutorial-enabled");
					$("#tutorial-content-begin").css({
						"position" : "relative",
						"top" : gs.yMargin*gs.yPx + ((2/3)*gs.y*gs.xPx),
						"left" : gs.xMargin*gs.xPx+window.optionScale,
						"width" : gs.x*gs.xPx,
						"height" : "5em" 
					});
					$(".arrow-left").css({
						"width" : 0,
						"height" : 0,
						"border-top": (gs.xPx)+"px solid transparent",
						"border-bottom": (gs.xPx)+"px solid transparent",
						"border-right" : (gs.xPx)+"px solid red",
						"position" : "relative",
						"float" : "left"
					});
					$(".arrow-right").css({
						"width" : 0,
						"height" : 0,
						"border-top": (gs.xPx)+"px solid transparent",
						"border-bottom": (gs.xPx)+"px solid transparent",
						"border-left" : (gs.xPx)+"px solid red",
						"position" : "relative",
						"left" : "93.5%"
					});
					$(".arrow-mid").css({
						"width" : "90%",
						"height" :  gs.xPx,// "3em",
						"position" : "relative",
						"backgroundColor" : "red",
						"text-align" : "center",
						"float" : "left",
						"top" : gs.xPx/2
					});
					$("#tutorial-continue").css({
						"position" : "absolute",	
						"top" : gs.yMargin*gs.yPx + ((1/3)*gs.y*gs.xPx),
						"height" : "10px auto",
						"left" :  window.innerWidth*.45,
						"fontSize" : "1.5em",
						"left" : "43%",
						"padding" : "0.5em",
						"backgroundColor" : "#71B2E2",
						"zIndex" : "301",
						"border-radius" : "0.5em",
						"-webkit-border-radius" : "0.5em",
						"-moz-border-raidus" : "0.5em",
						"-khtml-border-radius" : "0.5em"
					});
					var tutorialtext = window.lang[0].body.play.gameselect["short tutorial"]["field 1"];
					
					$(".arrow-mid").html(tutorialtext);
					$(".arrow-mid div").css({
						"top":0,
						"position": "relative",
					});
					if(window.innerWidth < 1024) {
						$(".arrow-mid div").css({
							"font-size" : ".55em",	
							"top" : "-.1em"
						});
					}
					if(common.checkDevice() == "ipad") {
						$(".arrow-mid div").css({
							"top":0,
							"font-size" : ".9em"
						});
					}

					$("#tutorialContent").show();
					$("#tutorialContent-bg").show();
					$("#tutorial-continue").click(function() {
						$("#tutorial-content-begin").remove();
						$("#tutorial-continue").unbind("click");
						show.score();
					});
					//tablet tutorial fix
					/*
					if(window.innerWidth <= 1024) {
						$("#tutorial-content-begin").css({	
							"position" : "relative",
							"top" : gs.yMargin*gs.yPx + (gs.y*gs.xPx),
							"left" : gs.xMargin*gs.xPx*.5+window.optionScale,
						});
						$(".arrow-left").css({
							"width" : 0,
							"height" : 0,
							"top" : "-.65em",
							"border-top": (gs.xPx)+"px solid transparent",
							"border-bottom": (gs.xPx)+"px solid transparent",
							"border-right" : (gs.xPx)+"px solid red",
							"position" : "relative",
							"float" : "left"
						});
						$(".arrow-right").css({
							"width" : 0,
							"height" : 0,
							"border-top": (gs.xPx)+"px solid transparent",
							"border-bottom": (gs.xPx)+"px solid transparent",
							"border-left" : (gs.xPx)+"px solid red",
							"position" : "relative",
							"float" : "right",
							"top" : "-3.65em",
							"left" : "0.4em"
						});
					} */
				},
				score : function() {
					$("#tutorialContent").append("<div id='tutorial-score-circle'></div><div id='tutorial-score-content'></div><div id='tutorial-par-circle'></div><div id='tutorial-par-content'></div>");
					$("#tutorial-score-circle").css({
						"position" :"relative",	
						"height" : gs.xPx*4,
						"width" : gs.xPx*4,
						"border-radius" : gs.xPx*2,
						"-moz-border-radius" : gs.xPx*2,
						"-webkit-border-radius" : gs.xPx*2,
						"-khtml-border-radius" : gs.xPx*2,
						"backgroundColor" : "transparent",
						"border-style" : "solid",
						"border-color" : "#FFFFFF",
						"top" : parseInt($(".compactTreeNode").css("top").replace(/px/,"")) - gs.xPx*1.3,//(gs.yMargin-0.5)*gs.xPx,
						"left" : parseInt($(".compactTreeNode").css("left").replace(/px/,"")) + window.optionScale - gs.xPx*2//(gs.xMargin+0.2)*gs.xPx
					});
					$("#tutorial-par-circle").css({
						"position" :"relative",	
						"height" : gs.xPx*5.5,
						"width" : gs.xPx*5.5,
						"border-radius" : gs.xPx*3,
						"-moz-border-radius" : gs.xPx*3,
						"-webkit-border-radius" : gs.xPx*3,
						"-khtml-border-radius" : gs.xPx*3,
						"backgroundColor" : "transparent",
						"border-style" : "solid",
						"border-color" : "#FFFFFF",
						"top" : (gs.y/2)*gs.yPx + 1*gs.xPx,
						"left" : parseInt($("#game-clock").css("left").replace(/px/,"")) - window.optionScale*.13//gs.xMargin*gs.xPx+(gs.x-2)*gs.xPx
					});
					var tutorialtext = window.lang[0].body.play.gameselect["short tutorial"]["field 3"];
					$("#tutorial-score-content").html(tutorialtext);
					$("#tutorial-score-content").css({
						"top" : -gs.xPx,
						"left": gs.xMargin*gs.xPx+5.5*gs.xPx,
						"border-radius" : "0.5em",
						"-webkit-border-radius" : "0.5em",
						"-moz-border-raidus" : "0.5em",
						"-khtml-border-radius" : "0.5em",
						"padding" : "1em",
						"position" : "relative",
						"height" : gs.xPx+"px auto",
						"width" : (gs.x-2)*(gs.xPx),
						"backgroundColor" : "white",
						"color" : "black"
					});
					$("#tutorial-par-content").css({
						"border-radius" : "0.5em",
						"-webkit-border-radius" : "0.5em",
						"-moz-border-raidus" : "0.5em",
						"-khtml-border-radius" : "0.5em",
						"padding" : "1em",
						"top" : 2*gs.xPx,
						"left": gs.xMargin*gs.xPx+2*gs.xPx,
						"position" : "relative",
						"height" : gs.xPx+"px auto",
						"width" : (gs.x-6)*(gs.xPx),
						"backgroundColor" : "white",
						"color" : "black"
					});
					tutorialtext = window.lang[0].body.play.gameselect["short tutorial"]["field 4"];
					$("#tutorial-par-content").html(tutorialtext);
					$("#tutorialContent").show();
					$("#tutorialContent-bg").show();
					tutorialtext = window.lang[0].body.play.gameselect["short tutorial"]["field 5"];
					$("#tutorial-continue").html(tutorialtext);
					$("#tutorial-continue").css({
						"top" : "200px"		
					});
					$("#tutorial-par-circle").css({
						"top" : "100px"
					});				
					$("#tutorial-par-content").css({
						"top" : "0px"
					});
					$("#tutorial-continue").click(function() {
						$("#tutorialContent").hide();
						$("#tutorialContent-bg").hide();
						$("#tutorialContent").removeClass("tutorial-enabled");
						$("#tutorialContent").html("");
						if(window.guest != "guest" && window.guest != "undefined" && window.guest != undefined)
								mcb.cookie.create("phylo-tutorial-"+window.guest,"complete",365);
					});		
				}
			};
			show.begin();
		};
		/* end of building compact tree*/

		/* starting of multi sequence select */
		//kills it
		g.prototype.killMultiSelect = function() {
			var doc = document;
			try {
				$(doc).unbind("mousedown");
				$(doc).unbind("mouseup");
				if(window.selectTracking)
					$(doc).unbind("click");
			//	$(doc).unbind("click");
			} catch(err) {	
				console.log("killMultiSelect > "+err);
			}
			/* patch for killing tutorial*/
			try {
				$("#tutorialContent").remove();
				$("#tutorialContent-bg").remove();
			} catch(err) {

			}
		};
		//start of multi select
		g.prototype.multiSelect = function(cache,Grid,tree,gData) {
			this.Grid = Grid;
			this.tree = tree;
			this.gData = gData;
			window.selectTracking = false;
			this.domCache = cache;
			var doc = document, win = window;
			this.c = 0;
			var f = this;
			var mdt = 0;
			var mousedownTimeout;
			window.blockMultiSelect = false;
			var bMS = window.blockMultiSelect;
			if(common.checkDevice() == "other") {
				$(doc).dblclick(function(e) {
					f.onSelect(doc,win,e); 
				});		
			} else {
				this.doubleTab(doc,win);
			}
		};
		g.prototype.doubleTab = function(doc,win) {
				var gs = this.gs;
				var correction = $("#sandbox").css("left");
				correction = parseInt(correction);

				var div = doc.createElement("div");
				div.id = "doubleTabX";
				div.className = "mouseCircle";
				doc.getElementById("sandbox").appendChild(div);
				$("#doubleTabX").css({
					"width" : gs.xPx*2,
					"height" : gs.xPx*2,
					"border-radius" : gs.xPx,
					"-moz-border-radius" : gs.xPx,
					"-webkit-border-radius" : gs.xPx,
					"-khtml-border-radius" : gs.xPx,
				});						
				var div = doc.createElement("div");
				div.id = "doubleTabY";
				div.className = "mouseCircle";
				doc.getElementById("sandbox").appendChild(div);
				$("#doubleTabY").css({
					"width" : gs.xPx*2,
					"height" : gs.xPx*2,
					"border-radius" : gs.xPx,
					"-moz-border-radius" : gs.xPx,
					"-webkit-border-radius" : gs.xPx,
					"-khtml-border-radius" : gs.xPx,
				});						
				var div = doc.createElement("div"); 	
				div.id = "multiSelectSquare";
				doc.getElementById("sandbox").appendChild(div);
				$("#multiSelectSquare").css({
					"position" : "absolute",
					"border-style" : "solid",
					"opacity" : "0.6",
					"background-color" : "#800000",
					"border-color" : "red",
					"border-width" : "0.3em",
					"zIndex" : "120"
				});
				var div = doc.createElement("div"); 	
				div.id = "multiSelectBox";
				doc.getElementById("sandbox").appendChild(div);
				$("#multiSelectBox").css({
					"position" : "absolute",
					"border-style" : "solid",
					"opacity" : "0.6",
					"background-color" : "#800000",
					"border-color" : "red",
					"border-width" : "0.3em",
					"zIndex" : "120",
					"display" : "none"
				});
				$("#doubleTabX").hide();
				$("#doubleTabY").hide();
				$("#multiSelectSquare").hide();

				doc.ontouchstart = function(e) {
					if(e.touches.length == 2) {
						e.preventDefault();
						$("#doubleTabX").show();
						$("#doubleTabY").show();
						//to fix the accuracy of callerbration later	
						$("#doubleTabX").css({
							"top" : e.touches[0].pageY,
							"left" : e.touches[0].pageX-(correction+gs.xPx)
						});
						$("#doubleTabY").css({
							"top" : e.touches[1].pageY,
							"left" : e.touches[1].pageX-(correction+gs.xPx)
						});
						multiSelectSquare.style.display = "";
						$("#multiSelectBox").hide();
						f.onMultiSelectTouchMove(e,doubleTabY,correction);	
					} else {
						if(e.touches.length == 1) {
							var d1 = {
								top : parseInt(doubleTabX.style.top.replace(/px/,"")),
								left : parseInt(doubleTabX.style.left.replace(/px/,"")),
								width : parseInt(doubleTabX.style.width.replace(/px/,"")),
								height :  parseInt(doubleTabX.style.height.replace(/px/,""))
							};
							var d2 = {
								top : parseInt(doubleTabY.style.top.replace(/px/,"")),
								left : parseInt(doubleTabY.style.left.replace(/px/,"")),
								width : parseInt(doubleTabY.style.width.replace(/px/,"")),
								height :  parseInt(doubleTabY.style.height.replace(/px/,""))
							};
							var p = e.touches[0];	
							if(	((d1.left < (p.pageX - correction) && (p.pageX -correction) < (d1.left+d1.width))	&&
								(d1.top < p.pageY && p.pageY < d1.top+d1.height))  ||
								((d2.left < (p.pageX - correction) && (p.pageX -correction) < (d2.left+d2.width))	&&
								(d2.top < p.pageY && p.pageY < d2.top+d2.height))	) {

							} else  {
							//if(fr[0] == 0 && fr[1] == 0) {
								$("#doubleTabX").hide();
								$("#doubleTabY").hide();
								multiSelectSquare.style.display = "none";
							}
						}
					}
				};
				var fr = [0, 0];
				var doubleTabX = doc.getElementById("doubleTabX");
				var doubleTabY = doc.getElementById("doubleTabY");
				var multiSelectSquare = doc.getElementById("multiSelectSquare");
				var multiSelectBox = doc.getElementById("multiSelectBox");
				var dtx = 0, dty = 0;
				var f = this;
				doubleTabX.ontouchmove = function(e) {
						e.preventDefault();
						if(fr[0] == 0 || fr[0] != 2) {
							fr[0] = 1;	
							dtx = 0;
							f.onMultiSelectTouchMove(e,doubleTabY,correction);	
						} else {
							fr[1] = 1;
							dtx = 1;
						}
						var k = e.touches[dtx];	
						$("#doubleTabX").css({
							"top" : k.pageY-gs.xPx,
							"left" : k.pageX-(correction + gs.xPx)
						});
				};
				
				doubleTabY.ontouchmove = function(e) {
						e.preventDefault();
						if(fr[0] == 0 || fr[0] != 1) {
							fr[0] = 2;	
							dty = 0;
							f.onMultiSelectTouchMove(e,doubleTabX,correction);	
						} else {
							fr[1] = 2;
							dty = 1;
						}
						var k = e.touches[dty];	
						$("#doubleTabY").css({
							"top" : k.pageY-gs.xPx,
							"left" : k.pageX-(correction + gs.xPx)
						});
				};
				doubleTabX.ontouchend = function(e) {
					e.preventDefault();
					fr[dtx] = 0;
				};
				doubleTabY.ontouchend = function(e) {
					e.preventDefault();
					fr[dty] = 0;
				};
				var touchCaptured = "";
				multiSelectSquare.ontouchstart = function(e) {
					e.preventDefault();
					multiSelectSquare.style.display = "none";
					doubleTabX.style.display = "none";
					doubleTabY.style.display = "none";
					touchCaptured = f.onMultiSelectTouchCapture(doc,win);
					if(touchCaptured.selected == true) {
						var box = touchCaptured.box;
						multiSelectBox.style.left = box.left + "px";
						multiSelectBox.style.top = box.top + "px";
						multiSelectBox.style.height = (box.bottom-box.top) + "px";
						multiSelectBox.style.width = (box.right-box.left) + "px";
						multiSelectBox.style.display = "";	
					} else
						multiSelectBox.style.display = "none";
				};
				var os = window.optionScale;
				f.registered = "";
				multiSelectBox.ontouchmove = function(e) {
					e.preventDefault();
					f.multiSelectMove(touchCaptured.box, touchCaptured.captured, doc, win, e.touches[0], multiSelectBox.style, os);	
				};
				multiSelectBox.ontouchend = function(e) {
					f.registered = "";
					e.preventDefault();
					multiSelectBox.style.display = "none";
					f.multiSelectSnap(touchCaptured.box,touchCaptured.captured);
					f.tree = fitch.algo(f.Grid,f.gs,f.gData,f.tree,f.stage);
				};
	};
	g.prototype.onMultiSelectTouchCapture = function(doc,win) {
		var gs = this.gs;
		var area = {
			top : parseInt($("#multiSelectSquare").css("top")),
			left : parseInt($("#multiSelectSquare").css("left")),
			height : parseInt($("#multiSelectSquare").css("height")),
			width : parseInt($("#multiSelectSquare").css("width"))			
		}	

		win.selectTracking = false;
		var selectTracking = win.selectTracking;


		function hasClass(ele,cls) {
			return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
		}		

		function addClass(ele,cls) {
			if (!hasClass(ele,cls)) ele.className += " "+cls;
		}
		function removeClass(ele,cls) {
			if (hasClass(ele,cls)) {
				var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
				ele.className=$.trim(ele.className.replace(reg,' '));
			}
		}		

		var dom = this.domCache;
		var box = {
			left: "", right:"",top:"",bottom:""
		}
		var captured = [];
		
		for(var j=0, d = dom.length; j<d; j++) { 
				if(dom[j] != 0) {
					if(hasClass(dom[j].parentElement,"current") && !hasClass(dom[j].parentElement,"new")) {
						var cell = {
							left : parseInt(dom[j].style.left.replace(/px/,"")),
							top : parseInt(dom[j].style.top.replace(/px/,""))
						}
					
						if(area.left-gs.xPx < cell.left && cell.left < area.left+area.width
							&& area.top-gs.xPx < cell.top && cell.top < area.top+area.height) {
							selectTracking = true;
							captured.push(dom[j]);
							if(box.left == "") {
								box.left = cell.left;
								box.right = cell.left+gs.xPx;	
								box.top = cell.top;
								box.bottom = cell.top+gs.xPx;
							}
							if(cell.left < box.left)
								box.left = cell.left;
							if(box.right < cell.left+gs.xPx)
								box.right = cell.left+gs.xPx;
							if(cell.top < box.top)
								box.top = cell.top;
							if(box.bottom < cell.top+gs.xPx)
								box.bottom = cell.top+gs.xPx;
						}
					}
				}
		}
		box.right = box.right-8;
		box.bottom = box.bottom-8;
		return { selected : selectTracking , box : box, captured : captured };
	};
	g.prototype.onMultiSelectTouchMove = function(targets,doubleTab, correction) {
		var e = targets.touches[0];
		var pivotX = parseInt(doubleTab.style.left.replace(/px/,""));	
		var pivotY = parseInt(doubleTab.style.top.replace(/px/,""));	
		var gs = this.gs;
		if(e.pageX - correction >= pivotX && e.pageY >= pivotY) { //down right
			$("#multiSelectSquare").css({
				"top" : pivotY+gs.xPx,
				"left" : pivotX+gs.xPx,
				"height" : e.pageY - pivotY-gs.xPx,
				"width" : e.pageX - correction - pivotX-gs.xPx
			});	
		} else if( e.pageY >= pivotY && e.pageX < (pivotX+correction)) { //down left
			$("#multiSelectSquare").css({
				"top" : pivotY +gs.xPx,
				"left" : e.pageX - correction,
				"height" : e.pageY - pivotY-gs.xPx, 
				"width" : (pivotX+correction) - e.pageX+gs.xPx
			});
		} else if( e.pageY < pivotY && e.pageX < (pivotX+correction)) { //top left
			$("#multiSelectSquare").css({
				"top" : e.pageY,
				"left" : e.pageX - correction,
				"height" : pivotY - e.pageY+gs.xPx-2,
				"width" : pivotX+correction - e.pageX+gs.xPx-2
			});
		} else { //top right
			$("#multiSelectSquare").css({
				"top" : e.pageY,
				"left" : pivotX+gs.xPx,
				"height" : pivotY - e.pageY+gs.xPx, 
				"width" : e.pageX - correction - pivotX-gs.xPx
			});
		}	
	};
	//enables the select square
	g.prototype.onSelect = function(doc,win,e) {
		this.first = true;
		var first = this.first;
		this.registered = "";
		var gs = this.gs;
		//e.pageX , e.pageY
		if(doc.getElementById("multiSelectCircleLock") == undefined) {
			var div = doc.createElement("div"); 	
			div.id = "multiSelectCircleLock";
			div.className = "mouseCircle";
			doc.getElementById("sandbox").appendChild(div);
			$("#multiSelectCircleLock").css({
				"width" : gs.xPx*2,
				"height" : gs.xPx*2,
				"border-radius" : gs.xPx,
				"-moz-border-radius" : gs.xPx,
				"-webkit-border-radius" : gs.xPx,
				"-khtml-border-radius" : gs.xPx,
				"z-index" : 110
			});
			var div = doc.createElement("div"); 	
			div.id = "multiSelectCircleMove";
			div.className = "mouseCircle";
			doc.getElementById("sandbox").appendChild(div);
			$("#multiSelectCircleMove").css({
				"width" : gs.xPx*2,
				"height" : gs.xPx*2,
					"border-radius" : gs.xPx,
					"-moz-border-radius" : gs.xPx,
					"-webkit-border-radius" : gs.xPx,
					"-khtml-border-radius" : gs.xPx,
					"z-index" : 110
				});
				var div = doc.createElement("div"); 	
				div.id = "multiSelectSquare";
				doc.getElementById("sandbox").appendChild(div);
				$("#multiSelectSquare").css({
					"position" : "absolute",
					"border-style" : "solid",
					"opacity" : "0.6",
					"background-color" : "#800000",
					"border-color" : "red",
					"border-width" : "0.3em",
					"zIndex" : "119"
				});
				var div = doc.createElement("div");
				div.id = "multiSelectBox";
				doc.getElementById("sandbox").appendChild(div);
				$("#multiSelectBox").css({
					"position" : "absolute",
					"border-style" : "solid",
					"opacity" : "0.6",
					"background-color" : "#800000",
					"border-color" : "red",
					"border-width" : "0.2em",
					"zIndex" : "110"
				});
			}

			var correction = $("#sandbox").css("left");
			correction = parseInt(correction);
			if(isNaN(correction))
				correction = 0;
			$("#multiSelectCircleLock").css({
				"top" : e.pageY-gs.xPx*1.3,
				"left" : e.pageX-(correction + gs.xPx)
			});
			$("#multiSelectCircleMove").css({
				"top" : e.pageY-gs.xPx*1.3,
				"left" : e.pageX-(correction + gs.xPx)
			});
			//$("#multiSelectCircleLock").html("X: "+e.pageX+" - "+(correction+gs.xPx)+"<br>Y: "+e.pageY +" - "+(gs.xPx));
			$("#multiSelectCircleLock").show();
			$("#multiSelectCircleMove").show();
			$("#multiSelectSquare").show();
			
			var pivotX = e.pageX - correction,
				pivotY = e.pageY;
			$("#multiSelectSquare").css({
				"top" : pivotY,
				"left" : pivotX,
				"height" : 0,
				"width" : 0
			});

			$(doc).mousemove(function(e) {
				$("#multiSelectCircleMove").css({
					"top" : e.pageY-gs.xPx*1.3,
					"left" : e.pageX-(correction + gs.xPx)
				});
			//	$("#multiSelectCircleMove").html("X: "+e.pageX+" - "+(correction+gs.xPx)+"<br>Y: "+e.pageY +" - "+(gs.xPx));
				if(e.pageX - correction >= pivotX && e.pageY >= pivotY) { //down right
					$("#multiSelectSquare").css({
						"top" : pivotY-gs.xPx/5,
						"left" : pivotX,
						"height" : e.pageY - pivotY - gs.xPx/3,
						"width" : e.pageX - correction - pivotX - gs.xPx/5
					});	
				} else if( e.pageY >= pivotY && e.pageX < (pivotX+correction)) { //down left
					$("#multiSelectSquare").css({
						"top" : pivotY-gs.xPx/5,
						"left" : e.pageX - correction,
						"height" : e.pageY - pivotY - gs.xPx/3, 
						"width" : (pivotX+correction) - e.pageX - gs.xPx/8
					});
				} else if( e.pageY < pivotY && e.pageX < (pivotX+correction)) { //top left
					$("#multiSelectSquare").css({
						"top" : e.pageY-gs.xPx/3,
						"left" : e.pageX - correction,
						"height" : pivotY - e.pageY,
						"width" : pivotX+correction - e.pageX - gs.xPx/8
					});
				} else { //top right
					$("#multiSelectSquare").css({
						"top" : e.pageY-gs.xPx/3,
						"left" : pivotX,
						"height" : pivotY - e.pageY, 
						"width" : e.pageX - correction - pivotX
					});
				}	
			});
			var f = this;
			//kills the select gui & start calculation
			var handler = function(e) {
				//win.setTimeout(f.onSelectCapture(correction,doc,win),0);	
				win.setTimeout(function(){
					f.onSelectCapture(correction,doc,win);	
				},0);	
				$("#multiSelectCircleLock").hide();
				$("#multiSelectCircleMove").hide();
				$("#multiSelectSquare").hide();
				$(doc).unbind("mousemove");
				$(doc).unbind("mouseup",handler);
			}
			$(doc).unbind("mouseup",handler).bind("mouseup",handler);
		}
		//determine the selected cells
		g.prototype.onSelectCapture = function(correction,doc,win) {
			var gs = this.gs;
			var area = {
				top : parseInt($("#multiSelectSquare").css("top")),
				left : parseInt($("#multiSelectSquare").css("left")),
				height : parseInt($("#multiSelectSquare").css("height")),
				width : parseInt($("#multiSelectSquare").css("width"))			
			}	

			win.selectTracking = false;
			var selectTracking = win.selectTracking;


			function hasClass(ele,cls) {
				return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
			}		

			function addClass(ele,cls) {
				if (!hasClass(ele,cls)) ele.className += " "+cls;
			}
			function removeClass(ele,cls) {
				if (hasClass(ele,cls)) {
					var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
					ele.className=$.trim(ele.className.replace(reg,' '));
				}
			}		

			var dom = this.domCache;
			var box = {
				left: "", right:"",top:"",bottom:""
			}
			var captured = [];
			
			for(var j=0, d = dom.length; j<d; j++) {
					if(dom[j] != 0) {
						if(hasClass(dom[j].parentElement,"current") && !hasClass(dom[j].parentElement,"new")) {
							var cell = {
								left : parseInt(dom[j].style.left.replace(/px/,"")),
								top : parseInt(dom[j].style.top.replace(/px/,""))
							}
						
							if(area.left-gs.xPx < cell.left && cell.left < area.left+area.width
								&& area.top-gs.xPx < cell.top && cell.top < area.top+area.height) {
								selectTracking = true;
								captured.push(dom[j]);
								if(box.left == "") {
									box.left = cell.left;
									box.right = cell.left+gs.xPx;	
									box.top = cell.top;
									box.bottom = cell.top+gs.xPx;
								}
								if(cell.left < box.left)
									box.left = cell.left;
								if(box.right < cell.left+gs.xPx)
									box.right = cell.left+gs.xPx;
								if(cell.top < box.top)
									box.top = cell.top;
								if(box.bottom < cell.top+gs.xPx)
									box.bottom = cell.top+gs.xPx;
								///addClass(dom[j],"onSelectCaptured");
							}
						}
					}
			}
			box.right = box.right-6;
			box.bottom = box.bottom-6;
			var f = this;
			var os = window.optionScale;

			if(selectTracking) {
				$("#multiSelectBox").css({
					"top" : box.top,
					"left" : box.left,
					"width" : box.right-box.left,
					"height" : box.bottom-box.top,
					"display" : ""
				});
				var handler = function(e) {
					if(window.DEBUG) {
						console.log("***MultiSelect Hit Test***");
						console.log(box.left + " <> " + (e.pageX-os+gs.xPx/6));
						console.log(box.top + " <> " + (e.pageY-gs.xPx/3));
						console.log((e.pageX-os) + " <> "+ box.right);
						console.log((e.pageY-gs.xPx/3) + " <> " + box.bottom);
					}
					if(box.left <= e.pageX-os+gs.xPx/6 && e.pageX-os <= box.right
						&& box.top <= e.pageY-gs.xPx/3 && e.pageY-gs.xPx/3 <= box.bottom) {
						var msb = doc.getElementById("multiSelectBox").style;
						$(this).mousemove(function(x) {
							f.multiSelectMove(box,captured,doc,win,x,msb,os);
						});
						$(this).mouseup(function() {
							$(this).unbind("mousemove");
							$(this).unbind("mouseup");
							$("#multiSelectBox").hide();
							$(doc).unbind("mousedown",handler);
							f.multiSelectSnap(box,captured);
							captured = [];
							f.tree = fitch.algo(f.Grid,gs,f.gData,f.tree,f.stage);
						});
					 }else {
						$("#multiSelectBox").hide();
						captured = [];
						$(doc).unbind("mousedown",handler);
					}
				};
				$(doc).bind("mousedown",handler);
			}
			return;
		};

		g.prototype.stage = "";
		
		g.prototype.multiSelectSnap = function(box,captured) {
			var domCache = this.domCache;
			var gs = this.gs;
			var g = this;

			var getSeqLength = function(x) {
				var count = 0;
				for(var i=0;i<g.gData[x].length;i++) {
					if(g.gData[x][i] != "_")
						count++;
				}
				return count;
			};
			var getGridY = function(f) {
				var f = parseInt(f);
				for(var i=0;i<g.Grid.length;i++) {
					if(i*gs.seqLen <= f && f < i*gs.seqLen+30) {
						break;
					}	
				}
				return i;
			};		
			
			var margin = gs.xPx*gs.xMargin;	

			for(var i=0;i<g.Grid.length;i++) {
				try {
				var length = getSeqLength(i);
				} catch(err) { return; }
				var prevPos = -1;
				for(var x=0; x < length; x++) {
					//left
					var left = i*gs.seqLen+x;
					var minBorder = x*gs.xPx+margin;
					var maxBorder = (gs.x-(length-x))*gs.xPx+margin;
					//var cssLeft = parseInt($("#"+left).css("left"));
					var cssLeft = parseInt(domCache[left].style.left);
					//if(document.getElementById(left) != undefined) {
					if(domCache[left] != 0) {
					//	if(x*gs.xPx+margin < cssLeft && cssLeft < (gs.x-(length-x))*gs.xPx+margin) {
						if(minBorder < cssLeft && cssLeft < maxBorder) {
							var diff = (cssLeft-margin)%gs.xPx;
							var pos = Math.round((cssLeft-diff-margin)/gs.xPx + 1);
							if(diff > gs.xPx/2)
								pos+=1;	
							if(pos < x)
								pos+=1;
							if(pos > x)
								pos-=1;
						}
						if(x*gs.xPx+margin > cssLeft) {
							pos = x;
						} else if(cssLeft > (gs.x-(length-x))*gs.xPx+margin) {
							pos = gs.x-(length-x);
						}
						/*a bug fix */
						if(pos == prevPos)
							pos+=1;
						else if(prevPos > pos)
							pos = prevPos + 1;
						prevPos = pos;
						if(window.DEBUG)
							console.log("@snap > grid 2 > "+pos);
						/* end of bug fix */
						$("#"+left).animate({ left: pos*gs.xPx+margin+2},300);
						//$("#"+left).css("xIndex",100);
						domCache.zIndex = 100;
						var origin = g.Grid[i].indexOf(left);
						g.Grid[i][origin] = "x";
						g.Grid[i][Math.round(pos)] = Math.floor(left);
					}
				}
			}
		};

		g.prototype.multiSelectMove = function(box,captured,doc,win,e,msb,os) {
			var bMS = window.blockMultiSelect;
			bMS = true;
			var prevX = this.prevX;
			var left = parseInt(msb.left.replace(/px/,""));
			var x = parseInt(msb.width.replace(/px/,""));
			var dom = this.domCache;
			var gs = this.gs;
			var prevX = left;

			if(common.checkDevice() == "other") {
				var k = Math.round(e.pageX-os - left);
				var p = "";
				if(this.registered == "") {
					if(Math.abs(k-x) < 0)
						p = k-x;
					else
						p = x-k-x;
					this.registered = p;
				} else {
					p = this.registered;
				}
				var newX = e.pageX - os + p;
			} else {
				var k = e.pageX-os - left;
				if(this.registered == "") {
					this.registered = k;	
				} 
				var newX = e.pageX - os - this.registered;
			}

			if( gs.xPx*gs.xMargin < newX &&  newX+x < (gs.xPx*gs.xMargin)+(gs.xPx*gs.x))
				msb.left = newX +"px"; 
			else
				return;
				
			for(var i = 0, c = captured.length; i < c ;i++ ) {
				if(newX > prevX) {  //right
					var id = captured[i].id;
					var loop = function() {
						while(true) {
							try {
							var dX = parseInt(dom[id].style.left.replace(/px/,""));	
							var move = newX - prevX;
							if(dX+move+gs.xPx > (gs.xPx*gs.xMargin)+(gs.xPx*gs.x))
								return;
							dom[id].style.left = dX+move+"px";
							id++;
							if(captured.indexOf(dom[id]) > 0)
								return;
							if(dX+move+gs.xPx < parseInt(dom[id].style.left.replace(/px/,"")))	
								return;
							}catch(err) { return; }
						}		
					};
					loop();
				} else {
					var id = captured[i].id;
					var loop = function() {
						while(true) {
							try {
							var dX = parseInt(dom[id].style.left.replace(/px/,""));	
							var move = newX - prevX;
							if(dX+move < (gs.xPx*gs.xMargin))
								return;
							dom[id].style.left = dX+move+"px";
							id--;
							if(captured.indexOf(dom[id]) > 0)
								return;
							if(dX+move > parseInt(dom[id].style.left.replace(/px/,""))+gs.xPx)	
								return;
							}catch(err) { return; }
						}		
					};
					loop();
				}	
			}	
		};		

		/* end of multi sequence select */

		var proto = g.prototype,
			attr = [["start",proto.start],
				["enableTree",proto.enableTree],
				["updateTree", proto.updateTree],
				["init",proto.init],
				["sleep",proto.sleep],
				["buildCompactTree",proto.buildCompactTree],
				["buildAnimal",proto.buildAnimal],
				["getSeq", proto.getSeq],
				["getGameTree", proto.getGameTree],
				["timer", proto.timer],
				["stageAnimation",proto.stageAnimation],
				["tutorial",proto.tutorial],
				["multiSelect",proto.multiSelect],
				["start",proto.start],
				["buildGrameTree",proto.buildGameTree],
				
				];
		common.exportSingleton("animate",g,attr);
	})();
	(function() {
		function g() {};
		g.prototype.fn = "";
		var proto = g.prototype,
			attr = [["fn",proto.fn]];
		common.exportSingleton("tutorial",g,attr);
	})();
})();

//species / prefetch list
(function() {
	function g() { 
		this.ty = new Image();
		this.ty.src = "http://phylo.cs.mcgill.ca/img/thankyou.png"; 
		this.ty.id = 'thankyou';
	}

	g.prototype.get = function (name) {
		if(name == "thankyou") {
			return this.ty; 
		}
		if(name == "hg19" || name == "GRCh37"){
				
				return this.collect("Human");
				
			}else if(name == "panTro2" || name == "gorGor1"){
				
				return this.collect("ape");
				
			}else if(name == "ponAbe2" || name == "rheMac2" ||
					 name == "papHam1" || name == "calJac1" ||
					 name == "tarSyr1" || name == "micMur1" ||
					 name == "otoGar1"){
				
				return this.collect("Monkey");
				
			}else if(name == "tupBel1" || name == "mm9" ||
					 name == "rn4" || name == "dipOrd1" ||
					 name == "cavPor3" || name == "eriEur1" ||
					 name == "sorAra1"){
				
				return this.collect("Mouse");
							
			}else if(name == "speTri1"){
				
				return this.collect("Squirell");
				
			}else if(name == "oryCun2"){
				
				return this.collect("Rabbit");
				
			}else if(name == "ochPri2"){
				
				return this.collect("Ram");
				
			}else if(name == "turTru2"){
				
				return this.collect("Dolphin");
				
			}else if(name == "bosTau4"){
				
				return this.collect("Cow");
				
			}else if(name == "equCab2"){
				
				return this.collect("Horse")
				
			}else if(name == "felCat3"){
				
				return this.collect("Cat");
				
			}else if(name == "canFam2"){
				
				return this.collect("Dog");
				
			}else if(name == "myLuc1" || name == "pteVam1"){
				
				return this.collect("bat");
				
			}else if(name == "loxAfr3"){
				
				return this.collect("Elephant");
				
			}else if(name == "proCap1" || name == "echTel1" ||
					 name == "dasNov2" || name == "ornAna1"){
				
				return this.collect("Beaver");
				
			}else if(name == "choHof1"){
				
				return this.collect("Sloth");
				
			}else if(name == "macEug"){
				
				return this.collect("Kangaroo");
				
			}else if(name == "monDom5"){
				
				return this.collect("Opossum");
				
			}else if(name == "galGal3" || name == "taeGut1"){
				
				return this.collect("bird");
				
			}else if(name == "anoCar1"){
				
				return this.collect("Lizard");
				
			}else if(name == "xenTro2" || name == "tetNig2" ||
					 name == "fr2" || name == "gasAcu1" ||
					 name == "oryLat2" || name == "danRer6"){
				
				return this.collect("Fish");
				
			}else if(name == "petMar1"){
				
				return this.collect("Eel");
				
			}else{
				return this.collect(name);
			}
	};

	g.prototype.collect = function(value) {
		var im = new Image();
		var f = this;
		im.src = "http://phylo.cs.mcgill.ca/img/"+value.toLowerCase()+".png";
		im.onError = function() { f.report(value);  }//function() { f.report(value); };
		im.className = 'animal';
		return im; 
	};
	g.prototype.report = function(value) {
		//sent error
		console.log(value);
	};
	
	var proto = g.prototype,
		attr = [["get", proto.get]];
	common.exportSingleton("images",g,attr); 
})();


//where the code starts now
(function() {
	$(document).ready(function() {
		var div = document.createElement("div");
			div.id = "sandbox";
		document.body.appendChild(div);
		window.option = true;

		var hash = mcb.GET("lang").toUpperCase();
		var active = function() {
			var score = "";
			var mode = "";
			var url = "../phpdb/phyloDB2.php";
			var f = animate;
			var doc = document, win = window;
			var load = function(data) {
				data = data.replace("@","");		
				try {
					var json = eval("["+data+"]");
				} catch(err) {
					console.log(data);
					//bug.lightbox(window.lang[0].bug2);
					return;
				}
				json = json[0].level;
				f.roundID = json.attributes.id;
				for(var i = 0;i<json.sequence.length;i++) {
					json.sequence[i] = (json.sequence[i].replace(/-/g,"_")).toUpperCase();
				}
				f.collectedSeq = json.sequence;
				if(window.DEBUG)
					console.log(json.tree);
				var tree = newick.parse(json.tree);
				f.buildGameTree(tree);
				f.start(doc,win);
			}
			if(mcb.GET("type") == "random") {
				score = mcb.GET("random");
				mode = 1;
				$.post(url, { "mode" : mode, "diff": score },function(data) {
					load(data);
				}).error(function() {
					bug.lightbox(window.lang[0].bug1);
				}); 
				return;
			} else if(mcb.GET("type") == "disease") {
				score = mcb.GET("disease");
				mode = 2;
			} else if(mcb.GET("type") == "level") {
				score = mcb.GET("level");
				mode = 2;
			} else {
				console.log("notwor");
				return;
			}
			//loading.install();
			$.post(url, { "mode" : mode, "id": score },function(data) {
				load(data);
			}).error(function() {
				bug.lightbox(window.lang[0].bug1);
			}); 
		};

		
		//mini lang manager
		var script = document.createElement("script");
		script.id = hash+"_transcript";
		script.src = "../lang/"+hash+".js";
		script.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(script);
		script.onload = function() {
			var avaliable = function() {
				if(window[hash+"script"] != undefined) {
					window.lang = window[hash+"script"].lang;
					active();
				} else {
					setTimeout(function() {
						avaliable();
					},50);
				}
				
			}
			avaliable();
		};
	
	});
})();

