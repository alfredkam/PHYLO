<!-- <style href='css/phylo-theme.css' rel='stylesheet' type='text/css'></style> -->
<script type="text/javascript" src="js/lib/bootbox.min.js"></script>
<div id="fb-root"></div>
<script>
  // Additional JS functions here
//  window.fbAsyncInit = function() {
//    FB.init({
//      appId      : '254079141380941', // App ID
//      channelUrl : '//phylo.cs.mcgill.ca/channel.html', // Channel File
//      status     : true, // check login status
//      cookie     : true, // enable cookies to allow the server to access the session
//      xfbml      : true  // parse XFBML
//    });
//  };
  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
</script>
<script src='js/validation/cookie.validation.js' type='text/javascript'></script>
<script src='js/validation/login.validation.js' type='text/javascript'></script>
<script src='js/validation/protocal.core.js' type='text/javascript'></script>
<script>
  $('.dropdown-menu').find('form').click(function (e) {
    e.stopPropagation();
});
</script>
<link href='css/zocial.css' rel='stylesheet' type='text/css' />
<style>
.zocial{
	margin: 5px;
	width: 258px;
}
</style> 
<?php
    /*
     * Prior to including this file to display the navbar, do the following:
     *  - set $THIS_PAGE to an item that corresponds to the first string of 
     * items in the $MENU array.
     * 
     */
    $MENU = array(
        array("home", "welcome", "Home"),
        array("play", "playmenu", "Play"),
        array("history", "history", "History"),
        array("about", "about", "About"),
    );
    $ACTIVE_STRING = ' class=\'active\'';

    // will be useful for social login
    $CURRENT_URL = (!empty($_SERVER['HTTPS'])) ? "https://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'] : "http://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
?>
<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <ul class="nav logo">
                <h3>PHYLO | DNA Puzzles</h3>
        </ul>
        <div class="container">
            <ul class="nav">
                <?php
                    foreach($MENU as $item){
                        printf("<li id='menu-%s'%s><a href='%s'>%s</a></li>", 
                                $item[0], 
                                $THIS_PAGE == $item[0] ? $ACTIVE_STRING : "", 
                                $item[1], 
                                $item[2]);
                    }
                ?>
            </ul>
            <ul class="nav pull-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="icon-wrench icon-white"></i>
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- 
			     <li class="nav-header">Language</li>
                             <li id="options-language-english"><a data-target="#">English</a></li>
                             <li id="options-language-french"><a data-target="#">French</a></li>
			     <li class="divider"></li>
			-->
                        <li class="nav-header">Box Size</li>
                        <li id="options-size-small"><a data-target="#">Small</a></li>
                        <li id="options-size-medium"><a data-target="#">Medium</a></li>
                        <li id="options-size-large"><a data-target="#">Large</a></li>
                        <li id="options-size-xlarge"><a data-target="#">Extra Large</a></li>
                        <li class="divider" />
                        <li class="nav-header">Misc</li>
                        <li id="options-misc-subscore"><a data-target="#">Show Scores on Tree</a></li>
                    </ul>
                </li>
            </ul>
            <div class="showlogin">
                <ul class="nav pull-right">
                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <i>Login</i>
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
		    	<form>
                         <li><input id='username' class='login' type='text' placeholder='Username'/></li>
                         <li><input id='password' class='login' type='password' placeholder='Password'/></li>
			</form>
			<button class="btn btn-primary login-btn">Login</button><button class="btn cancel-btn">Cancel</button>
			<a href="#" class="zocial facebook">Signin with Facebook</a>
		       	<a href="#" class="zocial twitter">Signin with Twitter</a>  
			<a href="#" class="zocial google">Signin with Google</a>
			<a href="#" class="zocial linkedin">Signin with LinkedIn</a>
			<li><a href="http://phylo.cs.mcgill.ca/reset.php">Forgot password?</a></li>
		    </ul>  
                  </li>
		</ul>
	     </div>
	     <div class="showlogout">
	     	  <ul class="nav pull-right">
		      <li class="dropdown">
		          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
			     <i id="login-tag"></i>
			     <b class="caret"></b>
			  </a>
			  <ul class="dropdown-menu">
			      <li><a href="#" class="logout">Logout</a></li>
			</ul>
		      </li>
		  </ul>
	     </div>
	     <!--
	     <ul class="nav pull-right">
	     	<li class="dropdown">
		    <a href="#" data-toggle="dropdown">
		    <div class="login-tag"></div>
		    </a>
		</li>
	     </ul>-->
<!--
            <form class="navbar-search pull-right">
                <input id="stage-redirect" type="text" class="textbox span1" placeholder="Stage">
            </form>
-->
        </div>
    </div>
</div>
<div id='appBackground'></div>
