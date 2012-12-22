(function() {
	var doc = document, win = window;
	var url = "/phpdb/phyloExpertDB.php";
	$.protocal = {
		//for login
		login : function(username, password, fn) {
			var mode = 7;
			var data = "mode="+mode+"&user="+username+"&pass="+password;
			$.ajax({
				type: "POST",
				url : url,
				data : data,
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
				data : data,
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
			var data = "mode="+mode+"&id="+$.phylo.id+"&user="+window.guest+"&align="+$.board.getJsonAlignments()+"&score="+$.phylo.currentScore;
            $.ajax({
				type: "POST",
				url : url,
				data : data,
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
				type : "POST",
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
				var dummy = '{"level":{"attributes":{"id":"400"},"sequence":["-TGGGG--ATCCAGCATGAG","-TGGGG--ATCCAGCATGAG","----------------CAGG","----------------GGAG","-TGAGG--ATCCACCCTGAG","TCGAGG--ATCCAACATGAG","--GAGG--GTCCGGCATGAG","-CGAGG--GGTCAGCGGGAG"],"tree":"(((hg19,rheMac2),(mm9,oryCun2)),(bosTau4,(equCab2,(felCat3,canFam2))));"}}';


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
		},
	};
})();
