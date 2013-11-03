<!DOCTYPE HTML> 
<html lang="en"> 
<head>
<link href="css/trontastic/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css" />
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="css/DT_bootstrap.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="js/lib/JSON.js"></script>
<script type="text/javascript" src="js/jquery.dataTables.js"></script>
<script type="text/javascript" src="js/DT2_bootstrap.js"></script>
<script type="text/javascript" src="js/lib/bootbox.min.js"></script>
<script type="text/javascript" src="js/validation/cookie.validation.js"></script>
<script type="text/javascript" src="js/validation/login2.validation.js"></script>
</head>
<body> 
<?php $THIS_PAGE = 'history'; include 'navbar.php'; ?>
  <div id="page-wrapper">
    <div id="page">

      <div id="header-wrapper">
        <div id="header">
	</div>
      </div>
      <div id='inner-wrapper'>
      <h1>Puzzle Selection</h1>

      <p>
	This menu displays all puzzles that you have played. A star on the rightmost column indicates that you have the highscore.
	As in the game menu, you can click on the headers to sort the puzzles according to your taste, and then click on the ID number
	or the scores to access directly the puzzles. Here, You can improve the highscore but you can also continue to improve your own
	personal best score for this puzzle and find your own path to beat the highscore!
      </p>

      <div class="container" style="margin-top: 30px" >
	<?php include 'ajax/experthistory.php'; ?>
      </div>

 
      <h3>Legend:</h3>
      <ul>
	<li>ID = Identification number of the puzzle</li>
	<li>Difficulty = Number of sequences</li> 
	<li>Disease = Disease category associated with the puzzle</li>
	<li>Play = Number of times you played this puzzle</li>
	<li>Par = Original score of this puzzle</li>
	<li>Highscore = Best score submitted by all users</li>
	<li>My Score = Your best score for this puzzle</li>
      </ul>
      <p>
	<b>N.B.:</b> Click on the scores to access the puzzles
      </p>

    </div>
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
