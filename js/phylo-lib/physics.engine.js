(function() {
	$.physics = {
		// moving multiple objects at once
		shift_select : function(list, list_nonObj, box) {
			var left = true;
			var posList = $.sequence.posList;
			var posListReverse = $.sequence.posListReverse;
			var domCache = $.phylo.domCache;
			var sequence_track = $.sequence.track;

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
				if(box.new + obj_w > $.sequence.calcPos($.phylo.seqLen))
					box.new = $.sequence.calcPos($.phylo.seqLen) - obj_w;
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
			for(var i=0, len = list.length;i<len;i++) {
				var r = $(list[i]).parent().attr("id").toString().replace(/row/,"");
				if(!(r in row)) {
					row.push(r);
				}
			}

			var leastPos = 0;
			var nucTemp = list_nonObj[0];
			var maxPos = $.phylo.seqLen;

			if(left) {
				//determine the left most boundary
				var ithPos = 827;
				for(var r=0;r<row.length;r++) {
					var nuc = sequence_track[row[r]];
					var counter = 0;
					var ifBreak = false;
					for(var i=0,len = nuc.length;i<len;i++) {
						if(nuc[i] != "x") {
							for(var j=0;j<list_nonObj.length;j++) {
								if(nuc[i] == list_nonObj[j]) {
									if(leastPos <= counter) {
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
				nucTemp = list_nonObj[list_nonObj.length-1];
				var ithPos = 0;
				maxPos = 0;
				for(var r=0;r<row.length;r++) {
					var nuc = sequence_track[row[r]];
					var counter = 1;
					var ifBreak = false;
					for(var i=nuc.length-1;i>=0;i--) {
						if(nuc[i] != "x") {
							for(var j=$.phylo.seqLen-1; j >= 0; j--) {
								if(nuc[i] == list_nonObj[j] && nuc[i] != undefined) {
									if(counter >= maxPos) {
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
			
			//for(var cell in list) {
			for(var cell = 0, len = list.length;cell < len; cell++) {
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
						var seed = pos % $.phylo.seqLen;
						if(domCache[pos] == undefined ^ domCache[pos] == 0) 
							break;
						if(domCache[pos-1] == undefined ^ domCache[pos-1] == 0) {
							var est_px = parseInt(domCache[pos].left.replace(/px/,"")) + max_distance;
							if(est_px < $.sequence.calcPos(seed))
								domCache[pos].left = $.sequence.calcPos(seed)+"px";
							else
								domCache[pos].left = est_px + "px";
							break;
						} else {
							//check next step
							var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
							var nextStep = parseInt(domCache[pos-1].left.replace(/px/,""))+$.phylo.x;
							var est_px = currentStep+max_distance;
							if(est_px < $.sequence.calcPos(seed))
								domCache[pos].left = $.sequence.calcPos(seed)+"px";
							else
								domCache[pos].left = est_px +"px";
							pos-=1;
							if(!(est_px < nextStep))
								break;
						}
					}
				} else {
					while(true) {
						var rrow = Math.floor(pos/$.phylo.seqLen); 
						var seed = $.phylo.seqLen - ($.phylo.eachRowLength[rrow] - (pos % $.phylo.seqLen));
						if(domCache[pos] == undefined ^ domCache[pos] == 0)
							break;
						if(domCache[pos+1] == undefined ^ domCache[pos+1] == 0) {
							var est_px = parseInt(domCache[pos].left.replace(/px/,""))+max_distance;	
							if(est_px > $.sequence.calcPos(seed)) 
								domCache[pos].left = $.sequence.calcPos(seed) + "px";	
							else 
								domCache[pos].left = est_px + "px";
							break;
						} else {
							//check next step
							var currentStep = parseInt(domCache[pos].left.replace(/px/,""));
							var nextStep = parseInt(domCache[pos+1].left.replace(/px/,""));
							var est_px = currentStep+max_distance+$.phylo.x;	
							if(est_px-$.phylo.x > $.sequence.calcPos(seed)) 
								domCache[pos].left = $.sequence.calcPos(seed) + "px";
							else 
								domCache[pos].left = (currentStep+max_distance) + "px";
							pos+=1;
							if(!(est_px > nextStep))
								break;
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
					if(move >=  ($.phylo.seqLen-posListReverse[pos])*$.phylo.x-22) {
						move = ($.phylo.seqLen-posListReverse[pos])*$.phylo.x-22;
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
		snap : function(type) {
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
				//calculates assumtption
				if($.sequence.calcPos(pos)-left <= 0) {
					pos+=1;
				}
				//check if out of [left] bound
				if(pos < 0)
					pos=0;
				//check if assumption is correct if not fix it
				while(track[row][pos] != "x" && pos < $.phylo.seqLen*2) {
					pos+=1;
				}
				//found it went out of [right] bound
				if(pos >= $.phylo.seqLen) {
					var i=track[row].length;
					var temp = id;
					//Note: this condition of while loop excutes the fasted
					while(i--) {
						if(track[row][i] != "x") {
							temp = track[row][i];
							track[row][i] = id;
							domCache[id].left = $.sequence.calcPos(i)+"px";
						/*	$("#"+id).animate({
								left : $.sequence.calcPos(i)
							},100);*/
							id = temp;
						} else {
							track[row][i] = id;	
							domCache[id].left = $.sequence.calcPos(i)+"px";	
							/*
							$("#"+id).animate({
								left : $.sequence.calcPos(i) + "px",
							},300);*/
							break;		
						}
					}
				} else {
					domCache[id].left = $.sequence.calcPos(pos)+"px";
					/*
					$("#"+id).animate({
						left : $.sequence.calcPos(pos) + "px",
					},300);  */
					track[row][pos] = id; 
				}
			});
			if(DEBUG)
				$.helper.dump(track);
		}
	};
})();
