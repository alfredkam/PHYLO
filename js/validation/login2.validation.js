(function() {
	
	//checks if login if not redirect back
	if($.cookie.read("username")) {
        var loginmode = $.cookie.read("mode");
        if (loginmode=='fb') {
            FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        // connected                                                                                                                   
                    } else if (response.status === 'not_authorized') {
                        // not_authorized                                                                                                              
                        bootbox.alert("Phylo has not been authorized to connect with your Facebook account. Please, confirm.");
                    } else {
                        // not_logged_in                                                                                                               
                        bootbox.alert("You are not logged in Facebook. Please, sign-in to Facebook and re-connect to Phylo.");
                    }
                });
        }
	} else {
		window.location = "http://phylo.cs.mcgill.ca";
	}

})();
