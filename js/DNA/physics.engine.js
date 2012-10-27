(function() {
	$.physics = {
		// moving multiple objects at once
		shift_select : function(list, list_nonObj, box) {
			var left = true;
			var posList = $.sequence.posList;
			var posListReverse = $.sequence.posListReverse;
			var domCache = $.phylo.domCache;
			var track = $.sequence.track;
			var max_distance = box.new-box.old;
			if(box.new - box.old > 0) {
				left = false;
			}
			//update data to check if the selected obj pivot exceeded the maximum board length 
			var obj_w = parseInt(box.obj.css("width").replace(/px/,""));
			if(left) {
				if(box.new < 0) {
					box.new = box.old;
				}
			} else {
				if(box.new + obj_w > $.sequence.calcPos(25))
					box.new = $.sequence.calcPos(25) - obj_w;
			}

			//check if in list
			var checkList = function(id) {
				for(var cell in list) {
					if($(list[cell]).attr("id") == id)
						return true; 
				}
				return false;
			}
			//find its row			
			var row = [];
			for(var cell in list ) {
				var r = $(list[cell]).parent().attr("id").toString().replace(/row/,"");
				if(!(r in row)) {
					row.push(r);
				}
			}

			var leastPos = 0;
			var nucTemp = 0;
			var maxPos = 25;
			if(left) {
				//determine the left most boundary
				var ithPos = 827;
				for(var r in row) {
					var nuc = track[r];
					var counter = 0;
					var ifBreak = false;
					for(var i=0,len = nuc.length;i<len;i++) {
						if(nuc[i] != "x") {
							for(var j=0;j<list_nonObj.length;j++) {
								if(nuc[i] == list_nonObj[j]) {
									if(leastPos <= counter && ithPos > parseInt(domCache[list_nonObj[j]].left.replace(/px/,""))) {
										leastPos = counter;
										nucTemp = list_nonObj[j];
										ithPos = parseInt(domCache[list_nonObj[j]].left.replace(/px/,""));
									}
									ifBreak = true;
									break;
								}
							}
							if(ifBreak)
								break;
							counter+=1;
						}
					}
				}
				var curr = domCache[nucTemp].left.replace(/px/,"");
				var min = $.sequence.calcPos(leastPos);
				var diff = curr - min;	
				if(parseInt(curr)+max_distance < min) {
					max_distance = -1*diff;	
				}
			} else {
				//right
				//determine the right most boudary	
				var ithPos = 0;
				for(var r in row) {
					var nuc = track[r];
					var counter = 1;
					var ifBreak = false;
					for(var i=nuc.length-1;i>=0;i--) {
						if(nuc[i] != "x") {
							for(var j=$.phylo.seqLen-1; j >= 0; j--) {
								if(nuc[i] == list_nonObj[j]) {
									if(parseInt(domCache[list_nonObj[j]].left.replace(/px/,"")) > ithPos) {
										maxPos = counter;
										nucTemp = list_nonObj[j];
										ithPos = parseInt(domCache[list_nonObj[j]].left.replace(/px/,""));
									}
									ifBreak = true;
									break;
								}
							}
							if(ifBreak)
								break;
							counter+=1;
						}
					}
				}

				maxPos = $.phylo.seqLen - maxPos;
			
				var curr = domCache[nucTemp].left.replace(/px/,"");
				var max = $.sequence.calcPos(maxPos);
				var diff = max-curr;	
				if(parseInt(curr)+max_distance > max) {
					max_distance = diff;	
				}
			}

			if(max_distance == 0)
				return;

			//set the new obj position
			box.obj.css({
				left: box.old+max_distance,
			});
			
			
			for(var cell in list) {
				var prev = parseInt($(list[cell]).css("left").replace(/px/,""));		
				var move = prev+ (box.new - box.old);
				var pos = parseInt($(list[cell]).attr("id")); 
				if(left) {
					if(domCache[pos-1] != undefined && domCache[pos-1].left != undefined) {
						if(checkList(pos-1)) {
							$(list[cell]).css({
								left : prev+max_distance,
							});
							continue;
						}	
					}
					
				} else {
					if(domCache[pos+1] != undefined && domCache[pos+1].left != undefined) {
						if(checkList(pos+1)) {
							$(list[cell]).css({
								left : prev+max_distance,
							});
							continue;
						}	
					}

				}
				if(left) {
					while(true) {
						try {
							if(domCache[pos] == undefined ^ domCache[pos].left == undefined) 
								break;
							if(domCache[pos-1] == undefined ^ domCache[pos-1].left == undefined) {
								//last step
								domCache[pos].left = (parseInt(domCache[pos].left.replace(/px/,"")) + max_distance) + "px"; 
								break;
							} else {
								//check next step
								var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
								var nextStep = parseInt(domCache[pos-1].left.replace(/px/,""));
								if((currentStep+max_distance) < nextStep+$.phylo.x) {
									domCache[pos].left = (currentStep+max_distance) + "px";
								} else { 
									domCache[pos].left = (currentStep+max_distance) + "px";
									break;
								}
								pos-=1;
							}
						} catch(err) {
							if(domCache[pos] == undefined) 
								break;
							if(domCache[pos-1] == undefined) {
								//last step
								domCache[pos].left = (parseInt(domCache[pos].left.replace(/px/,"")) + max_distance) + "px"; 
								break;
							} else {
								//check next step
								var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
								var nextStep = parseInt(domCache[pos-1].left.replace(/px/,""));
								if((currentStep+max_distance) < nextStep+$.phylo.x) {
									domCache[pos].left = (currentStep+max_distance) + "px";
								} else { 
									domCache[pos].left = (currentStep+max_distance) + "px";
									break;
								}
								pos-=1;
							}

						}
					}
				} else {
					while(true) {
						if(domCache[pos].left == undefined)
							break;
						if(domCache[pos+1].left == undefined) {
							domCache[pos].left = (parseInt(domCache[pos].left.replace(/px/,"")) + max_distance) + "px"; 
							break;
						} else {
							//check next step
							var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
							var nextStep = parseInt(domCache[pos+1].left.replace(/px/,""));
							if(nextStep < (currentStep+max_distance)+$.phylo.x) {
								domCache[pos].left = (currentStep+max_distance) + "px";
							} else {
								domCache[pos].left = (currentStep+max_distance) + "px";
								break;
							}
							pos+=1;
						}
					}
				}
			}
			return true;
		},
		//determine if moving left or right 
		move : function(self,e) {
			var prevPageX = parseInt($(self).css('left').replace(/px/,""));
			var offSet = parseInt($.phylo.offSet);
			if((e.pageX-offSet) - ($.phylo.x/2) > prevPageX) {	
				this.shift(true,parseInt(self.id),e,0);
			} else if((e.pageX-offSet) - ($.phylo.x/2) == prevPageX) {
				return;
			} else {
				this.shift(false,parseInt(self.id),e,0);
			}
		},
		//updates the css of the cell that is moving left or right
		shift : function(RIGHT, target, e, c) {
			var domCache = $.phylo.domCache;
			var pos = parseInt(target);
			var offSet = parseInt($.phylo.offSet);
			var posList = $.sequence.posList;
			var posListReverse = $.sequence.posListReverse;
			if(RIGHT) {
				while(true) {
					domCache[pos].zIndex = 100-c;
					var x = e.pageX;
					var y = ($.phylo.x*$.phylo.seqLen)+offSet;
					var move = e.pageX+(c-.5)*$.phylo.x-offSet;
					//the right border boundary
					if(move >=  (25-posListReverse[pos])*$.phylo.x-22) {
						move = (25-posListReverse[pos])*$.phylo.x-22;
					}
					if(domCache[pos+1] != 0) {
						if(domCache[pos+1] == undefined) {
							domCache[pos].left = move+"px";
							break;
						}
						if(e.pageX-offSet + c*$.phylo.x > parseInt(domCache[pos+1].left)-$.phylo.x/2) {
							domCache[pos].left = move+"px";
							c+=1;
						} else {
							domCache[pos].left = move+"px";
							break;
						}
					} else {
						domCache[pos].left = move +"px";
						break;
					}
					pos+=1;
					if(domCache[pos] == 0)
						break;
					if(domCache[pos] == undefined)
						break;
				}
			} else {	//left
				while(true) {
					var x = offSet;
					var y = e.pageX;
					var move = e.pageX+(c-.5)*$.phylo.x-offSet;
					if(x >= y) 
						break;
					//left boundary
					if(move < posList[pos]*$.phylo.x) {
						move = posList[pos]*$.phylo.x;
					}
					//need this if?
					if(posList[pos]*$.phylo.x >= parseInt(domCache[pos].left)) {
						break;
					}
					if(domCache[pos-1] != 0) {
						if(domCache[pos-1] == undefined) {
							domCache[pos].left = move + "px";
							break;
						}
						if(parseInt(domCache[pos-1].left) > (e.pageX-offSet)+(c*$.phylo.x)-$.phylo.x*3/2) {
							domCache[pos].left = move + "px";
							c--;
						} else {
							domCache[pos].left = move + "px";
							break;
						}
					} else {
						domCache[pos].left = move + "px";
						break;
					}
					pos-=1;
					if(domCache[pos] == undefined)
						break;
					if(domCache[pos] == 0)
						break;
				}
			}
		},
		//snaps the cell after randomizing the grid
		snapRandom : function() {
			var track = $.sequence.track;
			var domCache = $.phylo.domCache;
			for(var i=0;i<track.length;i++) {
				for(var j=0;j<track[i].length;j++) {
					if(track[i][j] != "x") {
						domCache[track[i][j]].left = $.sequence.calcPos(j)+"px";
					}
				}	
			}	
		},
		//snaps the cell after shifting
		snap : function() {
			var getGridY = function(f) {
				var f = parseInt(f);
				for(var i=0;i<$.sequence.track.length;i++) {
					if(i*$.phylo.seqLen <= f && f < i*$.phylo.seqLen+$.phylo.seqLen) {
						break;
					}	
				}
		//		var i = parseInt($("#"+f).parent().attr("id").replace(/row/,""));
				
				return i;
			};
			var track = $.sequence.track;
			var domCache = $.phylo.domCache;
			var posList = $.sequence.posList;
			for(var i=0;i<track.length;i++) {
				for(var j=0;j<track[i].length;j++)
					track[i][j] = "x";
			}
			$(".sequence").each(function() {
				var id = $(this).attr("id");
				var left = parseInt(domCache[id].left)-1;
				var pos = parseInt(left/$.phylo.x);
				var row = getGridY(id);
			//	if(left%$.phylo.x >= ($.phylo.x/2)) {
				if($.sequence.calcPos(pos)-left <= 0) {
					pos+=1;
				}
				//found new pos now check if correct assumption
				if(track[row][pos] != "x") {
					pos+=1;
				}
				//found it went out of array
				if(pos >= $.phylo.seqLen) {
					var i=track[row].length;
					var temp = id;
					while(i--) {
						if(track[row][i] != "x") {
							//temp = track[row][i];	
							//track[row][i] = temp;  
							temp = track[row][i];
							track[row][i] = id;
							domCache[id].left = $.sequence.calcPos(i)+"px";//(pos*$.phylo.x)+"px";
							id = temp;
						} else {
							track[row][i] = id;	
							domCache[id].left = $.sequence.calcPos(i)+"px";	
							break;		
						}
					}
				} else {
					domCache[id].left = $.sequence.calcPos(pos)+"px";//(pos*$.phylo.x)+"px";
					track[row][pos] = id; 
				}
			});
			if(DEBUG)
				$.helper.dump(track);
		}
	};
})();
