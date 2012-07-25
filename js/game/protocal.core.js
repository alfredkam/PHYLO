(function() {
	var doc = document, win = window;
	var url = "../phpdb/phyloDB2.php";
	$.protocal = {
		sendHighScore : function() {

			var self = this;
			var data = "mode=4&id="+$.phylo.id+"&user="+window.guest+"&align="+$.board.getJsonAlignments()+"&score="+$.phylo.bestScore;

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

			//console.log(str);

			$.ajax({
				url : url,
				data : str,
				type : "POST",
			}).done(function(data) {
				console.log(data);
				data = data.replace("@","");
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

			}).fail(function() {
			//	var dummy = '{"level":{"attributes":{"id":"3071"},"sequence":["-----GAGGATCCAGC-----","-----GAGGCTCAAGC-----","TTTTGAAAACTAGATA-----","-----GGAGTCTAAAA-----","-----AGGCGCTAAAAACAAA","------GGAACTCCAA-----","-----AGGGCGAAAAC-----","-----AGGCTCCAATG-----"],"tree":"((((hg19,rheMac2),mm9),(bosTau4,(canFam2,pteVam1))),(loxAfr3,dasNov2));"}}';
				var dummy = '{"level":{"attributes":{"id":"1926"},"sequence":["---agagtgactcccag----","----gagagatatagag----","---GGGTGAAGGGGTGG----","-TCGAGATTCCCCCGAAGACA","---agagtgacccccag----"],"tree":"((((hg19,rheMac2),mm9),canFam2),loxAfr3);"}} ';
				console.log(">> Cannnot connect to database");
				console.log(">> loading dummy data");
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
		},
	};
})();
