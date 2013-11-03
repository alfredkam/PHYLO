
<!DOCTYPE HTML> 
<html lang="en"> 
<head>
<link href="css/trontastic/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css" />
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="js/lib/JSON.js"></script> 
<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="js/consts.js"></script>
<script type="text/javascript">
var args = {};
args.id="s1";
</script>
<script type="text/javascript" src="js/noconsole.js"></script>
<script type="text/javascript" src="js/settings.js"></script>
<script type="text/javascript" src="js/msg.js"></script>
<script type="text/javascript" src="js/lang.js"></script>
<script type="text/javascript" src="js/fitch.js"></script>
<script type="text/javascript" src="js/in.js"></script>
<script type="text/javascript" src="js/scorebar.js"></script>
<script type="text/javascript" src="js/buttoncolumn.js"></script>
<script type="text/javascript" src="js/ui.js"></script>
<script type="text/javascript" src="js/window.js"></script>
<script type="text/javascript" src="js/htmlelements.js"></script>
<script type="text/javascript" src="js/lib/bootbox.min.js"></script>
<script type="text/javascript" src="js/validation/cookie.validation.js"></script>
<script type="text/javascript" src="js/validation/login2.validation.js"></script>
</head> 
<body> 
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
<div id='appBackground'></div>
<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <ul class="nav logo">
                <h3>PHYLO | DNA Puzzles</h3>
        </ul>
        <div class="container">
            <ul class="nav">
                <li id='menu-home'><a href='welcome'>Home</a></li><li id='menu-play' class='active'><a href='playmenu'>Play</a></li><li id='menu-history'><a href='history'>History</a></li><li id='menu-about'><a href='about'>About</a></li>            </ul>
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
<div id="page-wrapper">
<div id="page">

<div id="header-wrapper">
    <div id="header">
      
    </div>
</div>
<div id='inner-wrapper'>
<div id="main-wrapper">
    <canvas id="scorebar-area" width="1400" height="100"></canvas>
    <div id="canvas-container">
        <div id='ancestor-selection-box'></div>
        <canvas id="tree-area" width="200" height="800"></canvas><canvas id="drawing-area" width="1400" height="800"></canvas><canvas id="buttoncolumn-area" width="1400" height="800"></canvas>
    </div>
</div>

<div id="viewport-wrapper"><canvas id="viewport" width="1400" height="100"></canvas></div>

<div id="messagebox-wrapper">
    <button id="stats-toggle" class="btn" data-toggle="collapse" data-target="#stats-div">Toggle Details</button>
    <button id="stats-submit" class="btn">Submit My Best Score</button>
    <div id="stats-div" class="collapse in">
    <table id="stats">
        <tr>
            <td><label for="stats-stage">Stage</label></td>
            <td><label for="stats-par">Par</label></td>
            <td><label for="stats-mismatches">Matches</label></td>
            <td><label for="stats-matches">Mismatches</label></td>
            <td><label for="stats-gaps">Gaps</label></td>
            <td><label for="stats-gapexts">Gap Extends</label></td>
            <td><label for="scores-score">Score:</label></td>
            <td><label for="scores-best">Best:</label></td>
        </tr>
        <tr>
            <td><span id="stats-stage">s1</span></td>
            <td><span id="stats-par">0</span></td>
            <td><span id="stats-mismatches"></span></td>
            <td><span id="stats-matches"></span></td>
            <td><span id="stats-gaps"></span></td>
            <td><span id="stats-gapexts"></span></td>
            <td><span id="scores-score"></span></td>
            <td><span id="scores-best"></span></td>
        </tr>
    </table>
    </div>
    <!--
    <div id="stats" class="row">
        <div class="span2"><label for="stats-mismatches">Matches</label><span id="stats-mismatches"></span></div>
        <div class="span2"><label for="stats-matches">Mismatches</label><span id="stats-matches"></span></div>
        <div class="span2"><label for="stats-gaps">Gaps</label><span id="stats-gaps"></span></div>
        <div class="span2"><label for="stats-gapexts">Gap Extends</label><span id="stats-gapexts"></span></div>
        <div class="span2"><label for="scores-score">Score:</label><span id="scores-score"></span></div>
        <div class="span2"><label for="scores-best">Best:</label><span id="scores-best"></span></div>
        <div class="span2"><label for="stats-stage">Stage</label><span id="stats-stage">s1</span></div>
        <div class="span2"><label for="stats-par">Par</label><span id="stats-par">0</span></div>
    </div>-->

    <!--<table id="stats">
        <tr>
            <td><label for="stats-matches">Mismatches</label><span id="stats-matches"></span></td>
            <td><label for="stats-gapexts">Gap Extends</label><span id="stats-gapexts"></span></td>
            <td><label for="stats-stage">Stage</label><span id="stats-stage">s1</span></td>
        </tr>
        <tr>
            <td><label for="stats-mismatches">Matches</label><span id="stats-mismatches"></span></td>
            <td><label for="stats-gaps">Gaps</label><span id="stats-gaps"></span></td>
            <td><label for="stats-par">Par</label><span id="stats-par"></span></td>
        </tr>
    </table>-->
</div>

</div>
<div id="selection-box"></div>
</div>
</div>

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-27559307-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>

</body> 
</html> 
