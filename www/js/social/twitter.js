(function() {
	var twit = {
		isAvailable : function() {
			console.notify("Waiting");
            console.log(window.plugins);

 			console.log(window.plugins.twitter);
 			
			window.plugins.twitter.isTwitterAvailable(function(r) {
				console.log(r);
			});
		},
        isSetup : function() {
 			console.notify("waiting...");
 			window.plugins.twitter.isTwitterSetup(function(r) {
                console.notify(r);
            });
        },
        
	}
    document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
         
         if(twit.isAvailable()) {
        	console.notify("@test1");
         }

	}

})();
