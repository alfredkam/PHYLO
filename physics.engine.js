(function() {
	$.physics = {
		move : function(self,e) {
			var prevPageX = parseInt($(self).css('left').replace(/px/,""));
			var offSet = parseInt($.phylo.offSet);
			if((e.pageX-offSet) - ($.phylo.x/2) > prevPageX) 	
				this.shift(true,parseInt(self.id),e,0);
			else if((e.pageX-offSet) - ($.phylo.x/2) == prevPageX) {
				return;
			} else {
				this.shift(false,parseInt(self.id),e,0);
			}
		},
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
					if(move >=  (25-posListReverse[pos])*$.phylo.x) {
						move = (25-posListReverse[pos])*$.phylo.x;
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
				var left = parseInt(domCache[id].left);
				var pos = parseInt(left/$.phylo.x);
				if(left%$.phylo.x > ($.phylo.x/2)) {
					pos+=1;
				}
				domCache[id].left = $.sequence.calcPos(pos)+"px";//(pos*$.phylo.x)+"px";
				track[getGridY(id)][pos] = id; 
			});
			$.helper.dump(track);
		}
	};
})();
