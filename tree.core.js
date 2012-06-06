(function() {
	$.tree = {
		build :  function(tree) {
			    var i=0,k=0;
			    var safe = [];
			    //this.format = [];
			    var format = [];//this.format;
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
			return format;
		},
		buildAncestor : function() {
			var stage = $.stage.current;
			var data = "";
			
			var build = function(stage) {
				var tree = $.phylo.tree[stage];		
				if(tree.child == 0) {
					data+="<div class='ancestorImg'><img src=''/></div>";	
					data+="<div class='ancestorImg'><img src=''/></div>";	
				} else if(tree.child == 1) {
					data+="<div class='ancestorImg'><img src=''/></div>";	
					build(stage-1);
				} else if(tree.child == 2) {

				}
			}
			build(stage);
			$("#tree").html(data);
		},
	};
})();
