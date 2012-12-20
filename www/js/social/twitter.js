(function() {
	var twit = {
		isAvailable : function() {
			console.notify("Waiting");
  			console.notify(PhoneGap);
            console.notify(window.plugins);

 			console.notify(window.plugins.twitter);
 			
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
  document.addEventListener("deviceready", onDeviceReady, false);
  function  onDeviceReady() {
 	console.notify("deviceready");
 }
//	function onDeviceReady() {
         
         if(twit.isAvailable()) {
         console.notify("@test1");
         }

 //	}

})();
