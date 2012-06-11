window.DEBUG = true;
(function() {
	$(document).ready(function() {
	
		$.main = {
			init : function() {
				$.phylo = {
					seqLen : 25,
					x : 34,
					offSet : $("#gameBoard").css("left").replace(/px/,""),
					height : $("#tree").css("height").replace(/px/,"")
				};
				$.protocal.read();
				$.protocal.request();
			},
			callBack : function() {
				$.events.touch("#gameBoard",{
					start: function(e) {
					}, move : function(e) {
					}, end : function(e) {
					}
				});
				if(DEBUG)
					console.log($.phylo);
				$.phylo.tree = $.tree.build($.phylo.get.tree);
				$.board.build();
				$.sequence.build($.phylo.get.sequence);
				$.sequence.prepareTracking($.phylo.get.sequence);
				var random = $.sequence.randomize($.sequence.track);
				$.sequence.prepareTracking(random);
				$.phylo.domCache = $.sequence.createCache();
				$.physics.snapRandom();
				if(DEBUG)
					console.log($.phylo.tree);
				$.stage.last = $.phylo.tree[$.phylo.tree.length-1].lv;
				$.splash.countDown(function() {
					//start game
					$.stage.end = false;
					$.stage.round();	
					$.helper.dump($.sequence.track);
				});
			},
		};

		$.main.init();
	});
})();
