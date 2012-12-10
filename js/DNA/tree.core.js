(function() {
	$.tree = {
		//builds the tree
		build :  function(tree) {
			    var i=0,k=0;
			    var safe = [];
			    var format = [];//this.format;
			    var buildTree = function(j,c) {
			    	if (j.branchset == undefined) {
					return j.name;
				} else {
					var x = j.branchset[0];
					var y = j.branchset[1];
					if (x.branchset == undefined && y.branchset == undefined) {
						var d = { "lv" : i++, "depth" : c, "child" : 0, "node1" : k++, "node2" : k++, "p1": x.name, "p2" : y.name};
					} else if (x.branchset == undefined) {
						var d = { "lv" : -1, "depth" : c, "child" : 1, "node1" : k++, "node2" : -1, "p1" : x.name};
						d.node2 = buildTree(y,c+1).lv;
						d.lv = i++;
					} else if (y.branchset == undefined) {
						var d = { "lv" : -1, "depth" : c, "child" : 1, "node1" : -1, "node2" : -1, "p1" : y.name};
						d.node2 = buildTree(x,c+1).lv;
						d.node1 = k++;
						d.lv = i++;
					} else {
						var d = { "lv" : -1, "depth": c, "child" : 2, "node1" : -1, "node2" : -1};
						d.node1 = buildTree(x,c+1).lv;
						d.node2 = buildTree(y,c+1).lv;
						d.lv = i++;
					}
					format.push(d);
					return d;
				}
			    }
			buildTree(tree,0);
			return format;
		},
		//builds the phylogenetic tree
		buildAncestor : function() {
			var stage = $.stage.current;
			var data = "";
			var self = this;
			var maxDepth = ($.phylo.tree[0].depth >= 4 ? $.phylo.tree[0].depth : 4);
			var maxWidth = 178; 	
			var maxNodeWidth = 20;
			var assignWidth = (maxWidth - (maxDepth * maxNodeWidth))/maxDepth;
					
			//gets the average distance
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
			//the angle math
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
				mWidth-=32;
				if(n.child == 0) {
					//build top
					var hLeft = n.depth*assignWidth+34*.3;
					var hTop_1 = n.node1*34 + 34/2 - 2;
					var hTop_2 = n.node2*34 + 34/2 - 2;
					var vTop_1 = Math.abs(hTop_2-hTop_1);
					str+= "<div class='vLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
					//build bot		
					str+= "<div class='hLine' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
				} else if(n.child == 1) {
					var hLeft = n.depth*assignWidth+34*.3;
					var dist = getDist(n.node2);
					var hTop_1 = n.node1*34 + 34/2 - 2;
					var hTop_2 = dist.top;
					var hWidth = assignWidth*Math.abs((n.depth-dist.depth));
					var vTop_1 = Math.abs(hTop_2-hTop_1);
					
					str+= "<div class='vLine' style='top:"+(hTop_2>hTop_1?hTop_1:hTop_2)+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(mWidth-hLeft)+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(hWidth)+"px'></div>";
					
				} else if(n.child == 2) {
					var hLeft = n.depth*assignWidth+34*.3;
					var dist_1 = getDist(n.node1);
					var dist_2 = getDist(n.node2);
							
					var hTop_1 = dist_1.top;
					var hWidth_1 = assignWidth* Math.abs((n.depth-dist_1.depth));
					var hTop_2 = dist_2.top;
					var hWidth_2 = assignWidth*Math.abs((n.depth-dist_2.depth));
					var vTop_1 = hTop_2 - hTop_1;
					
					str+= "<div class='vLine' style='top:"+(hTop_1)+"px;left:"+hLeft+"px;height:"+vTop_1+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_1+"px;left:"+hLeft+"px;width:"+(hWidth_1)+"px'></div>";
					str+= "<div class='hLine' style='top:"+hTop_2+"px;left:"+hLeft+"px;width:"+(hWidth_2)+"px'></div>";
				}
			
				return str;
			};
			var build = function(stage) {
				var tree = $.phylo.tree[stage];					
				//console.log(tree);
				if(tree.child == 0) {
					data+="<div class='ancestorImg' style='top:"+(tree.node1)*34+"px'><img src='"+self.getImg(tree.p1)+"'/></div>";	
					data+="<div class='ancestorImg' style='top:"+(tree.node2)*34+"px'><img src='"+self.getImg(tree.p2)+"'/></div>";	
					data+="<div class='nodeImg' id='node"+stage+"' style='left:"+(tree.depth)*assignWidth+"px;top:"+((tree.node1+.5)*34+7)+"px'></div>";
					data+=buildAngle(tree);
					return;
				} else if(tree.child == 1) {
					var x = (tree.node1+getAvg(tree.node2))/2;
					x = x*34 + 7;
					data+="<div class='ancestorImg' style='top:"+(tree.node1)*34+"px'><img src='"+self.getImg(tree.p1)+"'/></div>";	
					data+="<div class='nodeImg' id='node"+stage+"' style='left:"+(tree.depth)*assignWidth+"px;top:"+x+"px'></div>";
					data+=buildAngle(tree);
				} else if(tree.child == 2) {
					var x = (getAvg(tree.node1)+getAvg(tree.node2))/2;
					x = x*34+7;
					data+="<div class='nodeImg' id='node"+stage+"' style='left:"+(tree.depth)*assignWidth+"px;top:"+x+"px'></div>";
					data+=buildAngle(tree);
				}
				return;
			}
			//generates the html tree
			for(var _stage=0;_stage<=stage;_stage++)
				build(_stage);
			//dumps the data to element node
			$("#tree").html(data);
		
			$(".nodeImg").hover(function() {
				var id = $(this).attr("id").replace(/node/,"");
				var seq= "";
				for(var i=0;i<$.phylo.tree[id].ancestor.length;i++) {
					var s = $.phylo.tree[id].ancestor[i];
					var sequence = $.sequence;
					if(s != "x" && s != 0) 
						seq+="<div class='ancestor "+$.sequence.colorTag($.sequence.translate(s))+"' style='left:"+$.sequence.calcPos(i)+"px;'></div>";	
				}
				
				$("#ancestorSeq").html(seq);
				$.customize.default();
				$("#ancestorSeq").show("slide",{direction : "left"},500);
			},function() {
				$("#ancestorSeq").hide();
			});
		},
		//transalates the code to animal name
		getImg : function(name) {
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
					
				}else if(name == "myLuc1" || name == "pteVam1" || "myoluc1"){
					
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
		},
		//gets the image
		collect : function(name) {
			return "img/animal/"+name.toLowerCase()+".png";
		}
	};
})();
