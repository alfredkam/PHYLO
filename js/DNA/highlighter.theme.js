(function() {
	//$.phylo.tree[$.stage.current].ancestor[i]	
	$.highlighter = {
		set : function() {
			this.remove();
			var ancestor = $.phylo.tree[$.stage.current].ancestor;
			var track = $.sequence.track;
			var active = this.getActiveRows();
			console.log(ancestor);
			
			for(var i=0;i < active.length;i++) {
				for(j=0, arr = track[active[i]], len = track[active[i]].length;j< len;j++) {
					if(ancestor[j].toString().toLowerCase() != "x" && ancestor[j] != 0 
					&& (!$("#"+arr[j]).hasClass("nuc-"+ancestor[j].toString().toUpperCase()))) {
						console.log(ancestor[j].toString());
						$("#"+arr[j]).addClass("highlighter");
					}
				}
			}	
		},
		getActiveRows : function() {
			var row = [];
			$(".row").each(function() {
				if($(this).hasClass("current")) {
					row.push(parseInt($(this).attr("id").replace(/row/,"")));
				}
			});
			return row;
		},
		remove : function() {
			$(".sequence").removeClass("highlighter");	
		},
	};	

})();
