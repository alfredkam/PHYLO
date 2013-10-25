(function() {	
    //checks if login if not redirect back
    
    var url = "../../../phpdb/phyloExpertDB.php";
    var username = $.cookie.read("username");
    if (username!="") {
	var mode = 8;
	var data = "mode="+mode+"&user="+username;
	$.ajax({
		type: "POST",
		url : url,
	        data : data,
        }).done(function(re) {
       	    if (re!='succ') {
		bootbox.alert("You must first play 20 puzzles with the classic edition.",function(){
			window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
		    });
	    }
	}).fail(function() {
	    bootbox.alert("Could not connect to the server. Please try again later.");
	});
    } else {
	window.location = "http://phylo.cs.mcgill.ca/expert/welcome.php";
    }
    
})();
