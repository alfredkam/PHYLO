(function() {
	//helper function
	$.helper =  {
		dump : function(grid) {
			var data = "";
			for(var i=0; i<grid.length;i++) {
				for(var j=0;j<grid[i].length;j++) {
					data+="&nbsp;"+grid[i][j];	
				}
				data+="<br>";
			}
			$("#dump").html(data);

		},
		get : function(pid) {
			var $_GET = {};

			document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			    function decode(s) {
				return decodeURIComponent(s.split("+").join(" "));
				}

			    $_GET[decode(arguments[1])] = decode(arguments[2]);
			});

			return $_GET[pid];
		},
	}
})();

