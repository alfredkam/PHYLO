(function() {
	var str =  navigator.userAgent.toLowerCase().search("MSIE 8.0")
	
	if(str.search(/MSIE (8.0|7.0|6.0|5.0)/) > -1) {
		console.log("IE");
	}
})();
