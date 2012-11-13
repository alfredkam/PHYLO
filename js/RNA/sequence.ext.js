(function() {
	$.sequence.buildRNA = function(seq) {
		var str = "";
		this.posList = [];
		this.posListReverse = [];
		this.nucleotide = [];

		for(var i=0, y=$.phylo.rows, x = $.phylo.seqLen;i<y*x;i++) {
			this.posList.push(0);
			this.posListReverse.push(0);
			this.nucleotide.push(0);
		}
	
		for(var i=0;i<seq.length;i++) {
			str+="<div class='boardRow hidden' id='row"+i+"'>";
			var counter = 0;
			for(var j=0;j<seq[i].length;j++) {
				var c = seq[i].charAt(j);
				if(c !=  "_") {
					this.posList[i*$.phylo.seqLen+counter] = counter;	
					this.nucleotide[i*$.phylo.seqLen+counter] = seq[i].charAt(j);
					str+="<div class='sequence "+ this.structureTag(c)+"' id='"+(i*25+counter)+"' style='left:"+(this.calcPos(j))+"px;'></div>";
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
	};
	$.sequence.structureTag = function(c) {
		console.log(c);	
		if(c == ".") 
			return "dot";
		else if(c == "(")
			return "openBracket";
		else if(c == ")")
			return "closeBracket";
	};
	$.sequence.prepareRNATracking = function(seq) { 
		//need to change the conditions to match rna
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
	}
})();
