(function() {
  $(document).ready(function() {
    // share highscore event
    var shareClick = function() {
        //check cookie
        if($.cookie.read("username")) {
            $(".login-btn").unbind("click");
            var name = $.cookie.read("username");
            var mode = $.cookie.read("loginmode");
            var c_logid = $.cookie.read("logid");
            if (mode=="facebook") {
                // FB login. Must check account and cookie data match and then extract full name.
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        // connected: we must check that account are the same
                        FB.api('/me', function(response) {
                            var fullname = response.name;
                            var fb_logid = response.id;
                            if (c_logid==fb_logid) {
                               // Post on FB wall
                               var publish = {
                                    method: 'feed',
                                    message: 'has improved a DNA alignment related to . Play Phylo and help genetic research too!',
                                    name: 'Phylo',
                                    caption: 'Play your DNA.',
                                    description: (
                                        'A challenging flash game in which every puzzle completed' +
                                        'contributes to mapping diseases within human DNA.'
                                    ),
                                    link: 'http://phylo.cs.mcgill.ca/',
                                    picture: 'http://phylo.cs.mcgill.ca/images/minilogo.png',
                                    actions: [
                                              { name: 'phylo', link: 'http://phylo.cs.mcgill.ca' }
                                              ],
                                };
                           
                               FB.ui(publish);
                           
                            } else {
                               alert("You seem to have been disconnected from your Facebook account. Please, login again.");
                               $.cookie.delete("username");
                               $.cookie.delete("loginmode");
                               $.cookie.delete("logid");
                               $("#logout").hide();
                               window.guest = 'guest';
                               $("#login-box").hide();
                               $(".login-btn").click(function() {
                                    eClick();
                                });
                               $("#login-tag").html("Login");
                               $(".showInLogin").hide();
                               return;
                            }
                        });
                    } else if (response.status === 'not_authorized') {
                        // not_authorized
                        alert("Phylo has not been authorized to connect with your Facebook account. Please, confirm.");
                        return;
                    } else {
                        // not_logged_in
                        alert("You are not logged in Facebook. Please, sign-in to Facebook and re-connect to Phylo.");
                        return;
                    }
                });
            } else {
                console.log("Login mode does not allow to share the highscore achievement.");
                return;
            }
        } else {
            alert("You seem to have been disconnected. Please, login again.");
            $.cookie.delete("username");
            $.cookie.delete("loginmode");
            $.cookie.delete("logid");
            $("#logout").hide();
            window.guest = 'guest';
            $("#login-box").hide();
            $(".login-btn").click(function() {
                eClick();
            });
            $("#login-tag").html("Login");
            $(".showInLogin").hide();
            return;
        }
    };
  });
})();
 
 