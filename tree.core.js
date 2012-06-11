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
				if(n.child == 0) {
					//build top
					var hLeft = n.depth*34+34*.3;
					var hTop_1 = n.node1*34 + 34/2 - 2;
					var hTop_2 = n.node2*34 + 34/2 - 2;
					var vTop_1 = Math.abs(hTop_2-hTop_1);
					str+= "<div class='vLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
					//build bot		
					str+= "<div class='hLine' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
				} else if(n.child == 1) {
					var hLeft = n.depth*34+34*.3;
					var dist = getDist(n.node2);
					var hTop_1 = n.node1*34 + 34/2 - 2;
					var hTop_2 = dist.top;
					var hWidth = 34*Math.abs((n.depth-dist.depth));
					var vTop_1 = Math.abs(hTop_2-hTop_1);
					
					str+= "<div class='vLine' style='top:"+(hTop_2>hTop_1?hTop_1:hTop_2)+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(hWidth)+"px'></div>";
					
				} else if(n.child == 2) {
					var hLeft = n.depth*34+34*.3;
					var dist_1 = getDist(n.node1);
					var dist_2 = getDist(n.node2);
							
					var hTop_1 = dist_1.top;
					var hWidth_1 = 34* Math.abs((n.depth-dist_1.depth));
					var hTop_2 = dist_2.top;
					var hWidth_2 = 34*Math.abs((n.depth-dist_2.depth));
					var vTop_1 = hTop_2 - hTop_1;
					
					str+= "<div class='vLine' style='top:"+(hTop_1)+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(hWidth_1)+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(hWidth_2)+"px'></div>";
				}
			
				return str;
			};
			var build = function(stage) {
				var tree = $.phylo.tree[stage];					
				if(tree.child == 0) {
					data+="<div class='ancestorImg' style='top:"+(tree.node1)*34+"px'><img src=''/></div>";	
					data+="<div class='ancestorImg' style='top:"+(tree.node2)*34+"px'><img src=''/></div>";	
					data+="<div class='nodeImg' style='left:"+(tree.depth)*34+"px;top:"+((tree.node1+.5)*34+7)+"px'></div>";
					data+=buildAngle(tree);
					return;
				} else if(tree.child == 1) {
					var x = (tree.node1+getAvg(tree.node2))/2;
					x = x*34 + 7;
					data+="<div class='ancestorImg' style='top:"+(tree.node1)*34+"px'><img src=''/></div>";	
					data+="<div class='nodeImg' style='left:"+(tree.depth)*34+"px;top:"+x+"px'></div>";
					data+=buildAngle(tree);
					build(tree.node2);
				} else if(tree.child == 2) {
					var x = (getAvg(tree.node1)+getAvg(tree.node2))/2;
					x = x*34+7;
					data+="<div class='nodeImg' style='left:"+(tree.depth)*34+"px;top:"+x+"px'></div>";
					data+=buildAngle(tree);
					build(tree.node1);
					build(tree.node2);
				}
				return;
			}
			build(stage);
			if(DEBUG)
				console.log(data);
			$("#tree").html(data);
		},
	};
})();
