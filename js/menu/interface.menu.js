/* old script will phase out */

(function() {
	//config 
	(function() {
		function g() {}
		g.prototype.desktopSettings = {
			width: function() {
				return 1024;
			},
			height: function() {
				return 450;
			},
			numberOfSequence: 10,
			sequenceLength : 25,
			box : function() {
				var x = this.boxWidth()/this.sequenceLength;
				var y = this.boxHeight()/this.numberOfSequence;
				if(x < y)
					return x;
				else
					return y;
			},
			boxLeft : function() {
				return this.width()/5;
			},
			boxWidth: function() {
				return this.width()/5*4;
			},	
			boxHeight: function() {
				return 400;
			},
			color : [ "rgb(113, 178, 226)", "rgb(153, 50, 204)","rgb(0, 128, 0)", "rgb(255, 165, 0)"],
		};

		g.prototype.determineSettings = function() {
			return this.desktopSettings;
		};

		var proto = g.prototype,
			attr = [
				["sequence",proto.sequence],
				["desktopSettings",proto.desktopSettings]
				];
		common.exportSingleton("config",g,attr);		
	})();
	//initalize for both desktop and tablet
	(function() {
		function a() {}
		a.prototype.background = function(settings) {
			var data = "<div id='background'>";
			for(var i=0; i<settings.numberOfSequence;i++) {
				for(var j=0;j<settings.sequenceLength;j++) {
					data+= "<div class='bgBox' style='top:"+(i*settings.box())+"px;left:"+(j*settings.box()+settings.boxLeft())+"px;'></div>";
				}
			}	
			$("#sandbox").append(data+"</div>");
			$(".bgBox").css({
				width: settings.box(),
				height: settings.box(),
			});
		};

		a.prototype.buildCube = function() {

		};
		
		var proto = a.prototype,
			attr = [
				["background", proto.background]
				];
		common.exportSingleton("generate",a,attr);

		String.prototype.trim = function() {
			return $.trim(this);
		};

		function init() {
			//initalizie sandbox
			var settings = config.determineSettings();
			$("#sandbox").css({
				"width" : settings.width(),
				"height" : settings.height()
			});	
			generate.background(settings);
		}

	})();
	
	(function() {
		function g() {};
		g.prototype.start = function() {
			$("#sandbox").html("");
			var doc = document, win = window;
			var settings = config.determineSettings();
			this.loadBackground(doc,win,settings);
			$("#sandbox").css({
				width : settings.width(),
				height : settings.height()
			});
			//this.loadStroke(doc,win,settings);
			this.loadMenu(doc,win,settings);
			this.listenToReload();
			/* temp fix */
			$.hashbang.checkIfAutoStart();
		};
		g.prototype.restart = function() {
			var doc = document, win = window;
			var settings = config.determineSettings();
			this.loadMenu(doc,win,settings);
		};
		g.prototype.loadBackground = function(doc,win,settings) {
			
			var canvas = doc.createElement('canvas');
			var sandbox = doc.getElementById("sandbox");
			canvas.id = 'draw';
			canvas.style.position = "relative";
			canvas.style.zIndex = 2;
			canvas.style.top = 0;
			canvas.style.left = 0;
			canvas.width = settings.width();
			canvas.height = settings.height();
		
			sandbox.appendChild(canvas);
		};
		//depreciated
		/* but its a cool way to start a game */
		/*
		g.prototype.loadStroke = function(doc,win,settings) {
			var ctx = doc.getElementById('draw').getContext('2d');
			var selection = [];

			var f = this;
			var stroke = function(ctx) {
				ctx.beginPath();
				ctx.fillStyle = "#E80000";
				ctx.fillRect(0,313,1024,25);
				ctx.fillStyle = "rgb(113, 178, 226)";
				var x = 170;
				var y = 300;
				ctx.fillRect(170,300,200,50);
				ctx.font = "20pt Helvetica";
				ctx.fillStyle = "white";
				ctx.fillText("Slide To Play",190,335);
				ctx.closePath();
				var offset = 0;
				this.onOver = function(eX,eY) {
					
				};
				this.offset = 0;
				this.onMouseDown = function(eX,eY) {
					if( x <= eX && eX <= x+200 &&
						y <= eY && eY <= y+50) {
						if(offset == 0 ) 
							offset = eX-x;
						if(eX-offset > 0 && 824 > eX-offset) {
							ctx.beginPath();
							ctx.fillStyle = "#E80000";
							ctx.clearRect(x,300,200,50);
							ctx.fillRect(x,313,200,25);
							ctx.fillStyle = "rgb(113, 178, 226)";
							ctx.fillRect(eX-offset,300,200,50);
							ctx.font = "20pt Helvetica";
							ctx.fillStyle = "white";
							ctx.fillText("Slide To Play",eX-offset+20,335);
							x = eX-offset;
							if( x > 500) {
								//start menu
								$('#draw').unbind("mouseup");
								$('#draw').unbind("mousedown");
								$('#draw').unbind("mousemove");
								f.loadMenu(doc,win,settings);
							}
						}
						ctx.closePath();
					} else {

					}
				};
				this.onUnbind = function() {
					offset = 0;
				}
			};
			f.loadMenu(doc,win,settings);
			
			selection.push(new stroke(ctx));

			$('#draw').mousedown(function(e) {
				$('#draw').mousemove(function(e) {
					var k = getCursorPosition(e);
					for(var i=0;i<selection.length;i++) {
						selection[i].onMouseDown(k[0],k[1]);		
					}
				});
			});
			$('#draw').mouseup(function(e){
				$('#draw').unbind("mousemove");
				for(var i=0;i<selection.length;i++) {
					selection[i].onUnbind();		
				}
			});
		}; */

		g.prototype.loadMenu = function(doc,win,settings) {
			var f = this;
			$("#splashLogo").remove();
			var ctx = doc.getElementById('draw').getContext('2d');
			ctx.beginPath();
			ctx.clearRect(0,0,settings.width(),settings.height());
			
			var banner = new Image();
			var bannerValues = {
				x : 500,
				y : 85,
				w : 400,
				h : 150

			}
			banner.onload = function() {
				ctx.drawImage(banner,bannerValues.x,bannerValues.y,bannerValues.w,bannerValues.h);
			};
			banner.src = '/img/phylo_logo.png';

			ctx.closePath();
			var selection = [];

			var login = function(ctx) {
				/*
				ctx.beginPath();
				ctx.fillStyle = "rgb(113, 178, 226)";
				ctx.fillRect(0,0,120,50);
				ctx.closePath();		
				*/
				this.onOver = function() {

				};
				this.onClick = function() {
	
				};
			};


			selection.push(new login(ctx));

			var menuStr = [window.lang.body.play.gameselect.levelselect.random["field 2"],window.lang.body.play.gameselect.levelselect["level id"]["field 2"],window.lang.body.play.gameselect.levelselect.disease["field 1"]];
			var cell = function(ctx,x,y,i) {
				ctx.beginPath();			
				ctx.fillStyle = settings.color[i];
				ctx.fillRect(x,y,settings.box(),settings.box());
				ctx.fillStyle = "white";
				ctx.font = "19pt Helvetica";
				ctx.fillText(menuStr[i],x+100,y+25);
				ctx.closePath();
				this.onOver =  function(eX,eY) {
					ctx.beginPath();
					ctx.clearRect(x-5,y-5,settings.box()*1.3+900, settings.box()*1.3);
					ctx.drawImage(banner,bannerValues.x,bannerValues.y,bannerValues.w,bannerValues.h);
					if( x-5 <= eX && eX <= x+5+settings.box()*1.3+900 
					&& y-5 <= eY && eY <= y+5+settings.box()*1.3) {
						var offset = (eY-y) < 0? 0: (eY-y);
						if(offset > settings.box()*1.3/2)
							offset-=settings.box()*1.3/2*-1;
						//determine scale
						var scale = Math.sin(offset/settings.box()*1.3);
						ctx.fillStyle = settings.color[i];
					 	ctx.fillRect(x-5*scale,y-5*scale,settings.box()*(1+.2*scale),settings.box()*(1+.2*scale));	
						ctx.fillStyle = "white";
						ctx.font = (19+6*scale)+"pt Helvetica";
						ctx.fillText(menuStr[i],x+100,y+25);
					} else {
						ctx.fillStyle = settings.color[i];
						ctx.fillRect(x,y,settings.box(),settings.box());
						ctx.fillStyle = "white";
						ctx.font = "19pt Helvetica";
						ctx.fillText(menuStr[i],x+100,y+25);
					}
					ctx.closePath();
				};
				this.onClick = function(eX,eY) {
					if( x-5 <= eX && eX <= x+5+settings.box()*1.3+900 
					&& y-5 <= eY && eY <= y+5+settings.box()*1.3) {
						switch(i) {
							case 1:
								ctx.beginPath();
								ctx.clearRect(140,60,900,400);
								ctx.closePath();
								selection = [];
								selection.push(new login(ctx));
								ctx.beginPath();
								ctx.fillStyle = "white";
								ctx.font = "20pt Helvetica";
								ctx.fillText(lang.body.play.gameselect.levelselect["level id"]["field 3"], 245, 100);
								ctx.closePath();
								selection.push(new levelselect(ctx));
								window.setTimeout(function() {
									selection.push(new back(ctx));
								},50);
								return;
							case 2:
								var diseaseorder =  [
									["digestive","img/disease/digestive.png","150px",""],
									["heart", "img/disease/heart.png","110px","30px"],
									["cancer", "img/disease/cancer.png","100px","55px"],
									["metabolic", "img/disease/metabolic.png","100px",""],
									["blood","img/disease/blood.png","50px","10px"],
									["sensory","img/disease/sensory.png","60px","30px"],
									["brain","img/disease/brain.png","80px",""],
									["muscles","img/disease/muscles.png","60px",""],
									["lung","img/disease/lung.png","60px",""]
									];
								ctx.beginPath();
								ctx.textAlign = "center";
								ctx.clearRect(0, 0,1024,450);
								ctx.fillStyle = "white";
								ctx.font = "20pt Helvetica";	
								ctx.fillText(lang.body.play.gameselect.levelselect.disease["field 1"],settings.width()/2, 100);
								ctx.textAlign = "left";
								ctx.closePath();
								selection = [];
								//selection.push(new login(ctx));
								for(var j=0; j<diseaseorder.length; j++) {
									selection.push(new disease(ctx,diseaseorder[j],j));	
								}
								window.setTimeout(function() {
									selection.push(new back(ctx));
								},50);
								return;
							case 0:
								ctx.beginPath();
								ctx.textAlign = "center";
								ctx.clearRect(0,0,1024,450);
								ctx.fillStyle = "white";
								ctx.font = "20pt Helvetica";	
								ctx.fillText(lang.body.play.gameselect.levelselect.random["field 1"], settings.width()/2,120);
								ctx.fillText(lang.body.play.gameselect.levelselect.random["field 3"], settings.width()/2,240);
								ctx.textAlign = "left";
								ctx.closePath();
								selection = [];
								selection.push(new login(ctx));
								selection.push(new login(ctx));
								for(var j=3;j<=8;j++) {
									selection.push(new random(ctx,j));
								}
								window.setTimeout(function() {
									selection.push(new back(ctx));
								},50);
								return;
						}
					}
				};
			} 


			var levelselect = function(ctx) {	
				$("#level_inputbox").show();
				ctx.beginPath();
				ctx.save();
				ctx.fillStyle = "rgb(153,50,204)";
				ctx.fillRect(250,220,170,50);
				ctx.fillStyle = "white";
				ctx.font = '19pt Helvetica';
				ctx.textAlign = "center";
				ctx.fillText(lang.body.play.gameselect.levelselect["level id"]["field 4"],335,252);
				ctx.textAlign = "left";
				ctx.restore();
				ctx.closePath();
				this.onClick = function(eX, eY) {
					if(250 < eX && eX < 370 &&
						220 < eY && eY < 270 ){
						var id = parseInt($("#level_inputbox").val().trim());
						if(isNaN(id)) {
							$.helper.popUp("Numbers Only!", function(status) {
								
							}, {
								cancel : false,
							});
							return;
						}
						$.ajax({
							url : "../phpdb/phyloExpertDB.php", 
							data : "mode=2&id="+id,
							type : "POST",
						}).done(function(data) {
							if(data == "" ) {
								//$.invalid.level();
								$.helper.popUp("Invalid level!", function(status) {
									
								}, {
									cancel : false,
								});
								
							} else {
								$("#draw").hide();
								$("#menu").hide();
								$.main.init({
									type: "disease",
									num: id,		
								});	
							}
							return;
						}).fail(function(data) {
								$("#draw").hide();
								$("#menu").hide();
								$.main.init({
									type: "disease",
									num: id,		
								});	

						});
					}	
				};
				this.onOver = function(eX,eY) {
					ctx.beginPath();
					ctx.save();
					if(250 < eX && eX < 370 &&
						220 < eY && eY < 270 ){

					ctx.fillStyle = "white";
					ctx.fillRect(250,220,170,50);
					ctx.fillStyle = "rgb(153,50,204)";
					ctx.font = '19pt Helvetica';
					ctx.textAlign = "center";
					ctx.fillText(lang.body.play.gameselect.levelselect["level id"]["field 4"],335,252);
					ctx.textAlign = "left";
					} else {
					ctx.fillStyle = "rgb(153,50,204)";
					ctx.fillRect(250,220,170,50);
					ctx.fillStyle = "white";
					ctx.font = '19pt Helvetica';
					ctx.textAlign = "center";
					ctx.fillText(lang.body.play.gameselect.levelselect["level id"]["field 4"],335,252);
					ctx.textAlign = "left";

					}
					ctx.restore();
					ctx.closePath();
				};		
			};

			var disease = function(ctx, items, i) {
				var img = new Image();
				img.src = items[1];
				img.onload = function() {
					ctx.beginPath();
					ctx.drawImage(img, 335+110*(i>=3?(i>=6?i-6:i-3):i), 150+(i>=3?(i>=6?200:100):0), 70, 70);
					ctx.closePath();
				};
				this.onClick = function(eX, eY) {
					if( 335+110*(i>=3?(i>=6?i-6:i-3):i) < eX && eX < 405+110*(i>=3?(i>=6?i-6:i-3):i) &&
						150+(i>=3?(i>=6?200:100):0) < eY && eY < 220+(i>=3?(i>=6?200:100):0)) {
						$("#draw").hide();		
						/*
						$("#frame").show();
						var hash = window.location.hash.toUpperCase();
						hash = hash.replace('#',"").toLowerCase();
						document.getElementById('frame').src = 'http://phylo.cs.mcgill.ca/js/index2.html?lang='+hash+'&type=disease&disease='+id+'#home';
						*/
						var id = diseaseList[i][1][Math.floor(Math.random()*diseaseList[i][1].length)];
						$("#menu").hide();
						$.main.init({
							type: "disease",
							num: id,		
						});	
						return;
					}
				};
				this.onOver = function(eX, eY) {

				};
			};

			var random = function(ctx, i) {
				var color= [ "rgb(113, 178, 226)", "rgb(153, 50, 204)","rgb(0, 128, 0)", "rgb(255, 165, 0)"];
				ctx.beginPath();
				ctx.save();
				ctx.fillStyle = color[((i-3)>=4?(i-3)-4:i-3)];
				ctx.fillRect(100+70*i, 150, 50,50);
				ctx.fillStyle = 'white';
				ctx.font = '19pt Helvetica';
				ctx.fillText(i,118+70*i,185);
				ctx.restore();
				ctx.closePath();
				this.onOver = function(eX,eY) {
					if(100+70*i < eX && eX < 150+70*i &&
						150 < eY && eY< 200) {
						ctx.beginPath();
						ctx.save();
						ctx.fillStyle = "white";
						ctx.fillRect(100+70*i, 150, 50,50);
						ctx.fillStyle = '#EF4136';
						ctx.font = '19pt Helvetica';
						ctx.fillText(i,118+70*i,185);
						ctx.restore();
						ctx.closePath();

					} else {
						ctx.beginPath();
						ctx.save();
						ctx.fillStyle = color[((i-3)>=4?(i-3)-4:i-3)];
						ctx.fillRect(100+70*i, 150, 50,50);
						ctx.fillStyle = 'white';
						ctx.font = '19pt Helvetica';
						ctx.fillText(i,118+70*i,185);
						ctx.restore();
						ctx.closePath();
					}
				};
				this.onClick = function(eX, eY) {
					if(100+70*i <eX && eX < 150+70*i  &&
						150 < eY && eY< 200) {
						$("#draw").hide();		
						$("#menu").hide();
						$.main.init({
							type: "random",
							num: i,		
						});	
						return;
					}
				};
				 
			};

			var back = function(ctx) {
				ctx.beginPath();
				ctx.save();
				ctx.fillStyle = "#EF4136";
				ctx.fillRect(150,120,50,110);
				ctx.fillStyle = 'white';
				ctx.rotate(1.56);
				ctx.font = '19pt Helvetica';
				ctx.textAlign = "center";
				ctx.fillText(lang.header["field 9"],175,-165);
				ctx.textAlign = "left";
				ctx.restore();
				ctx.closePath();
				this.onOver = function(eX,eY) {
					if(150 < eX && eX < 200 &&
						120 < eY && eY < 230) {
						ctx.beginPath();
						ctx.save();
						ctx.fillStyle = "white";
						ctx.fillRect(150,120,50,110);
						ctx.fillStyle = "#EF4136";
						ctx.rotate(1.56);
						ctx.font = '19pt Helvetica';
						ctx.textAlign = "center";
						ctx.fillText(lang.header["field 9"],175,-165);
						ctx.textAlign = "left";
						ctx.restore();
						ctx.closePath();
					} else {
						ctx.beginPath();
						ctx.save();
						ctx.fillStyle = "#EF4136";
						ctx.fillRect(150,120,50,110);
						ctx.fillStyle = 'white';
						ctx.rotate(1.56);
						ctx.font = '19pt Helvetica';
						ctx.textAlign = "center";
						ctx.fillText(lang.header["field 9"],175,-165);
						ctx.textAlign = "left";
						ctx.restore();
						ctx.closePath();
					}
				
				};	
				this.onClick = function(eX,eY) {
					if(150 < eX && eX < 200 &&
						120 < eY && eY < 230) {
						ctx.beginPath();
						ctx.clearRect(0,60,1024,400);
						ctx.closePath();
						selection = [];
						selection.push(new login(ctx));
						//selection.push(new highscore(ctx));
						for(var i=0;i<3;i++) {
							selection.push(new cell(ctx,150,120+(50*i),i));
						}
						var banner = new Image();
						banner.onload = function() {
							ctx.drawImage(banner,bannerValues.x,bannerValues.y,bannerValues.w,bannerValues.h);
						};
						$('#draw').mousemove(function(e) {
							var k = getCursorPosition(e);
							for(var i=0;i<selection.length;i++) {
								selection[i].onOver(k[0],k[1]);		
							}
						});
						banner.src = 'img/phylo_logo.png';
						$("#level_inputbox").val("").hide();
					}
				};
			};

			for(var i=0;i<3;i++) {
				selection.push(new cell(ctx,150,120+(50*i),i));
			}

			$('#draw').unbind().mousemove(function(e) {
				var k = getCursorPosition(e);
				for(var i=0;i<selection.length;i++) {
					selection[i].onOver(k[0],k[1]);		
				}
			}).click(function(e) {
				var k = getCursorPosition(e);
				for(var i=0;i<selection.length;i++) {
					selection[i].onClick(k[0],k[1]);		
				}
			});
		};

		g.prototype.listenToReload = function() {
			/*
			window.setInterval(function() {
				if(window.frames["frame"].window.location.hash.search(/reload/) > -1) {
					device.start();	
				}
			},1000); */
		};

		function getCursorPosition(e) {
			var gCanvasElement = document.getElementsByClassName("container")[0];
			var menu = document.getElementById("mid-panel");
			var x;
			var y;
			if (e.pageX || e.pageY) {
				x = e.pageX;
				y = e.pageY;
			} else {
				x = e.clientX + document.body.scrollLeft +
				    document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop +
				    document.documentElement.scrollTop;
			}
			// Convert to coordinates relative to the canvas
			x -= gCanvasElement.offsetLeft;
			y -= menu.offsetTop;
			return [x,y]
		}
			
		var proto = g.prototype,
			attr = [
				["start",proto.start],
				["restart",proto.restart]
				];
		common.exportSingleton("interactiveMenu",g,attr);
	})();
})()
