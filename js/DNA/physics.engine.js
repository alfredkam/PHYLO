(function() {
	$.physics = {
		// moving multiple objects at once
		shift_select : function(list,box) {
			var left = true;
			var posList = $.sequence.posList;
			var posListReverse = $.sequence.posListReverse;
			var domCache = $.phylo.domCache;
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
			//test assumtions and correct the assumption
			for(var cell in list) {
				var prev = parseInt($(list[cell]).css("left").replace(/px/,""));		
				var move = prev+ (box.new - box.old);
				var pos = parseInt($(list[cell]).attr("id")); 
				if(left) {
					if(checkList(pos-1))
						continue;
					while(true) {
						try {
							if(domCache[pos-1].left == undefined) {
								var child_move = parseInt(domCache[pos].left.replace(/px/,"")) + (box.new-box.old);
								if(child_move <= 0){//posList[pos]*$.phylo.x) {
									//max_distance = parseInt(domCache[pos].left.replace(/px/,""));
									max_distance = box.new - box.old - parseInt(domCache[pos].left.replace(/px/,""));
									if(parseInt(domCache[pos].left.replace(/px/,"")) <= $.sequence.calcPos(0))
										max_distance = 0;
								} 
								break;
							} else {
								var child_move = parseInt(domCache[pos].left.replace(/px/,"")) + (box.new-box.old);
								var child_move_inner = parseInt(domCache[pos-1].left.replace(/px/,""));
								if(child_move_inner+$.phylo.x < child_move)
									break;
							}
						} catch (err) {
							if(domCache[pos-1] == undefined) {
								var child_move = parseInt(domCache[pos].left.replace(/px/,"")) + (box.new-box.old);
								if(child_move <= 0){//posList[pos]*$.phylo.x) {
									max_distance = parseInt(domCache[pos].left.replace(/px/,""));
									if(parseInt(domCache[pos].left.replace(/px/,"")) <= 1)
										max_distance = 0;
								} 
								break;
							 } else {
								var child_move = parseInt(domCache[pos].left.replace(/px/,"")) + (box.new-box.old);
								var child_move_inner = parseInt(domCache[pos-1].left.replace(/px/,""));
								if(child_move_inner+$.phylo.x < child_move)
									break;
							}
						}
						pos-=1;
					}
				} else {
					if(checkList(pos+1))
						continue;
					while (true) {
						if(domCache[pos].left ==undefined ^ domCache[pos+1].left == undefined) { 
							var child_move = parseInt(domCache[pos].left.replace(/px/,"")) + (box.new-box.old);
							if(child_move >=  $.sequence.calcPos(24)) {
								max_distance = $.sequence.calcPos(24)-parseInt(domCache[pos].left.replace(/px/,"")); 
								if(parseInt(domCache[pos].left.replace(/px/,"")) >= $.sequence.calcPos(25)) {
									max_distance = 0;
								}
							}
							break;
						} else {
							var child_move = parseInt(domCache[pos].left.replace(/px/,"")) + (box.new-box.old);
							var child_move_inner = parseInt(domCache[pos+1].left.replace(/px/,""));
							if(child_move_inner > child_move+$.phylo.x)
								break;
						} 
						pos+=1;
					}
				}

			}
			
			if(max_distance == 0)
				return;

			//set the new obj position
			box.obj.css({
				left: box.new,
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
			/*
			box.obj.css({
				left : box.obj.new	
			}); */
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
			//	if(left%$.phylo.x >= ($.phylo.x/2)) {
				if($.sequence.calcPos(pos)-left <= 0) {
					pos+=1;
				}
				domCache[id].left = $.sequence.calcPos(pos)+"px";//(pos*$.phylo.x)+"px";
				track[getGridY(id)][pos] = id; 
			});
			if(DEBUG)
				$.helper.dump(track);
		}
	};
})();
