(function() {
	//helper function
	//contains all the quickies
	$.helper =  {
		//prints out the tracking grid
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
		//retrives the http variables
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
		copy : function(a,b) {
				/*
			a = [];
			for(var i=0;i<b.length;i++) {
				var temp = [];
				for(var j=0;j<b[i].length;j++) {
					temp.push(b[i][j]);	
				}
				a.push(temp);
			}
			*/

			for(var i=0;i<b.length;i++) 
				for(var j=0;j<b[i].length;j++) {
					try {
						a[i][j] = b[i][j];
					} catch(err) {
						try {
							a[i].push(b[i][j]);
						} catch (err) {
							var temp = [];
							temp.push(b[i][j]);
							a.push(temp);
						}
					}
				}
		},
		setHash : function() {
			
		},
		removeHash : function() {

		},
	}
	window.common = {
		exportSingleton : function(name, obj, attr) {
			if(!window[name]) {
				var g = window[name] = new obj;
				for(var i=0;i<attr.length;i++) {
					try {
					g[attr[i][0]] = attr[i][1];
					} catch(err) {
					}
				}
			}
		}
	}
})();

