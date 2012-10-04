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
		//copies the array
		copy : function(a,b) {
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
		//alert box plugin
		popUp : function(msg,ans,op) {
			if(op != undefined) {
				if(op.cancel != undefined && op.cancel == false)
					$(".warning-cancel").hide();
			} else {
				$(".warning-cancel").show();
			}
			$(".warning-bg").css({
				height: $(document).height(),
				width: $(document).width(),
			});
			$(".warning-bg").fadeIn();
			$(".warning").fadeIn();

			$(".warning-msg").html(msg);
			$(".warning-ok").unbind().click(function() {
				ans("ok");
				$(".warning").fadeOut();
				$(".warning-bg").fadeOut();
			});
			$(".warning-cancel").unbind().click(function() {
				ans("cancel");
				$(".warning").fadeOut();
				$(".warning-bg").fadeOut();
			});
		},
	}
	window.common = {
		//used by the depreciated functions to export singleton
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
	String.prototype.toInt = function() {
		return parseInt(this.replace(/px/,""));
	};
})();

