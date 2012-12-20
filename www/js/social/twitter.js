(function() {
	var twit = {
		isAvailable : function() {
			console.notify("Waiting for twitter");
			window.plugins.twitter.isTwitterAvailable(function(r) {
				console.notify(r);
			});
		},
	}
    document.addEventListener("deviceready", function(){
        if(twit.isAvailable()) {
                           
        }
                           
    }, false);

})();
