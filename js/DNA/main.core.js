(function() {
	$(document).ready(function() {
	
		$.main = {
			//unbinds all the previous data
			clear : function() {
				$.timer.stop();
				$.stage.current = -1;
				$("#countDown-text").html(3);
			},
			//configuration
			init : function(setting) {
				this.clear();
				$.endGame.runAway();
				$.phylo = {
					seqLen : 25,
					x : 34,
					offSet : 0,//$("#gameBoard").css("left").replace(/px/,""),
					height : $("#tree").css("height").replace(/px/,"")
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
					for(var j=0;j<25;j++) {
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

				$.customize.default();

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
				$.board.startListener();
			},
		};

	//	$.main.init();
	});
})();
