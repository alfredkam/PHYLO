(function() {
	var twit = {
		isAvailable : function() {
			console.notify("Waiting");
			window.plugins.twitter.isTwitterAvailable(function(r) {
				console.notify(r);
			});
		},
        isSetup : function() {
 			console.notify("waitin...");
 			window.plugins.twitter.isTwitterSetup(function(r) {
                console.notify(r);
            });
        },
        
	}
    document.addEventListener("deviceready", function(){
        if(twit.isAvailable()) {
                console.notify("@test1");
        }
    }, false);

})();
