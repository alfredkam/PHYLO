(function() {
	var url = "/phpdb/phyloExpertDB.php";
	function g() {};
	g.prototype.offline = {
		init : function(s) {

		},
		makeId : function() {
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		    for( var i=0; i < 10; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		}, 
		//sets 
		setIframe : function(s) {
			var iframe = document.createElement("iframe");
			var self = this;
			iframe.height = 0;
			iframe.width = 0;
			iframe.src = ""; 
			iframe.id = "phylo_"+self.makeId();
		},
		getTestPuzzle : function() {
			var arr = [
						
				];
			return arr[Math.floor((Math.random()*arr.length)+1)];
		},
		savePuzzle : function() {

		},
		retrieveMutliPuzzle : function() {

		},
	};
	g.prototype.prompt = {
		msg : function(msg) {
				
		},
		stack : function() {

		},
		log : function(msg) {
			console.log(msg);
		},
	};
	g.prototype.test = {
		jax : function(link, callBack) {
			$.ajax({
				type : "GET",
				url : url+url,
			}).done(function(r) {
				callBack(r);
			}).fail(function() {
				console.log("Test Fail > "+url);
			});
		},
		puzzles : function() {
			var self = this;
			for(var i=0;i<1000;i++) {
				//so dont bombard the network
				window.setTimeout(function() {
					self.jax(
						"?mode=2&id="+i,
						function(re) {
							try {
							var json = eval("["+re+"]")[0].level;
							} catch(err) {
								console.log("eval puzzle fail > "+i);
							}
							var numOfSeq = j.sequence.length;
							var numOfNodes = j.tree.replace(/(\(|\)|\;)/,"").split(",").length;
							if(numOfSeq != numOfNodes)
								console.log("#Node/#Seq Mismatch > "+i);
						}
					);
				}, 50);
			}
		}
	}
	var proto = g.prototype,
		attr = [
			["offline", proto.offline],
			["prompts", proto.prompt],
			["test",proto.test],
			];
	//export singlenton
	var exportSingleton =  function(name, obj, attr) {
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
	exportSingleton("devTools",g,attr);
})();
