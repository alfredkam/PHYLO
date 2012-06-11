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
				var random = $.sequence.randomize($.phylo.get.sequence);
				$.sequence.build(random);
				$.sequence.prepareTracking(random);
				if(DEBUG)
					console.log($.phylo.tree);
				$.stage.last = $.phylo.tree[$.phylo.tree.length-1].lv;
				$.phylo.domCache = $.sequence.createCache();
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
