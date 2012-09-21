(function() {
	
	//checks if login if not redirect back
	if($.cookie.read("username")) {

	} else {
		window.location = "http://phylo.cs.mcgill.ca";
	}

})();
