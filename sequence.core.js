(function() {
	var doc = document, win = window;
	$.sequence = {
		//retrives repsective nucleotide
		nuc : function(x) {
			if (x == "x") {
				return "x";
			}
			return this.nucleotide[x];
		}, 
		//retrives an array of nucleotide
		nucArray : function(arr) {
			var reArr = [];
			for(var i in arr) {
				if(arr[i] == "x") {
					reArr.push("x");
				} else {
					reArr.push(this.nuc(arr[i]));
				}
			}	
			return reArr;
		},
		createCache : function() {
			var arr = [];		
			for(var i=0, y=10, x = $.phylo.seqLen; i<y*x;i++) {
				arr.push(0);
			}

			$(".sequence").each(function() {
				var id = $(this).attr("id");
				arr[id] = document.getElementById(id).style;
			});
			return arr;
		},
		calcPos : function(pos) {
			return 32*pos+(pos+1)*1.5;
		},
		build : function(seq) {
			var str = "";
			this.posList = [];
			this.posListReverse = [];
			this.nucleotide = [];

			for(var i=0, y=10, x = $.phylo.seqLen;i<y*x;i++) {
				this.posList.push(0);
				this.posListReverse.push(0);
				this.nucleotide.push(0);
			}

			for(var i=0;i<seq.length;i++) {
				str+="<div class='row' id='row"+i+"'>";
				var counter = 0;
				for(var j=0;j<seq[i].length;j++) {
					var c = seq[i].charAt(j);
					if(c !=  "_") {
						this.posList[i*$.phylo.seqLen+counter] = counter;	
						this.nucleotide[i*$.phylo.seqLen+counter] = seq[i].charAt(j);
						str+="<div class='sequence' id='"+(i*25+counter)+"' style='left:"+(this.calcPos(j))+"px;background-color:"+this.color(this.translate(c))+"'></div>";
						counter++;
					}
				}	
				for(var k=0;k<counter;k++) {
					this.posListReverse[i*$.phylo.seqLen+k] = counter-k;
				}
				
				str+="<div class='red-line' id='red"+i+"'></div>";
				str+="</div>";
			} 
			$("#gameBoard").append("<div id='movingParts'>"+str+"<div>");
		},
		color : function(x) {
			switch(x) {
				case 1: 
					color = "#71B2E2";
					break;
				case 2: 
					color = "#9932CC";
					break;
				case 3:
					color = "#008000";
					break;
				case 4:
					color = "#FFA500";
					break;
				default:
					color = null;
					break;
			}
			return color;
		},
		translate : function(x) {
			if(x == "A") 
				return 1;
			if(x == "G")
				return 2;
			if(x == "C")
				return 3;
			if(x == "T")
				return 4;
			return null;
		},
		buildRootAncester : function() {

		},
		track : [],
		prepareTracking : function(seq) {
			this.track = [];
			for(var i=0;i<seq.length;i++) {
				var arr = [];
				var counter = 0;
				for(var j=0;j<$.phylo.seqLen;j++) {
					if(i < seq.length && j<seq[i].length) {
						if(seq[i].charAt(j) != "_") {
							arr.push(i*$.phylo.seqLen+counter);
							counter+=1;
						} else
							arr.push("x");
					} else
						arr.push("x");
				}
				this.track.push(arr);
			}
		},
		intify : function(numstring) {
			if (numstring == 'x')
				return numstring;
			else
				return parseInt(numstring);
		},
		randomize : function(seq) {
			console.log(seq);
			var arr = [];
			var tmp;
			//sequence = arr
			for(var i=0;i<seq.length;i++) {
				tmp = [];
				for(var j=0;j<$.phylo.seqLen;j++) {
					if(seq[i][j] == "_")
						tmp.push("x");
					else {
						tmp.push((seq[i][j]=="")?"x":seq[i][j]);
					}
				}		
				arr.push(tmp);
			}

			//randomize arr
			for(var i=0;i<arr.length;i++) {
				tmp = arr[i].toString().split('x,').join('').split(',');
				while( (a=tmp.length)<$.phylo.seqLen)
					tmp.splice(Math.floor(Math.random()*a),0,'x');
				console.log(tmp);
				tmp = tmp.map($.sequence.intify);
				console.log(tmp);
				arr[i] = tmp.slice(0);
			}	

			console.log(arr);
		
			//sequence <- arr;
			var seq = [];
			for(var i=0;i<arr.length;i++) {
				tmp = "";
				for(var j =0;j<arr[i].length;j++) {
					if(arr[i][j] == "x")
						tmp+="_";
					else
						tmp+=arr[i][j];
				}
				seq.push(tmp);
			}		

			return seq;
		}
	}
})();
