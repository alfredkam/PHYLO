<!DOCTYPE HTML> 
<html lang="en"> 
<link href="css/trontastic/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css" />
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="css/DT_bootstrap.css" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="js/lib/JSON.js"></script>
<script type="text/javascript" src="js/jquery.dataTables.js"></script>
<script type="text/javascript" src="js/DT_bootstrap.js"></script>
<script type="text/javascript" src="js/lib/bootbox.min.js"></script>
<script type="text/javascript" src="js/validation/cookie.validation.js"></script>
<script type="text/javascript" src="js/validation/login2.validation.js"></script>
</head>
<body> 
<?php $THIS_PAGE = 'play'; include 'navbar.php'; ?>
  <div id="page-wrapper">
    <div id="page">

      <div id="header-wrapper">
        <div id="header">
	  HELLO
	</div>
      </div>
      <div id='inner-wrapper'>

      <h1>Puzzle Selection</h1>

      <p>
	This menu enables you to access any puzzle that is stored in our database. Click on the ID number and play!
	You can also click on the highscore to play the best solution that has been currently found by all other players.
	Improve this solution and get the highscore! Click on the column headers to sort the results according to your tastes
	and find the most interesting puzzle.
      </p>

      <div class="container" style="margin-top: 30px" >
	<?php include 'ajax/blockmenu.php' ?>
      </div>


      <h3>Legend:</h3>
      <ul>
        <li>ID = Identification number of the puzzle</li>
        <li>Difficulty = Number of sequences</li>
        <li>Disease = Disease category associated with the puzzle</li>
        <li>Owner = Username of the submitter of this puzzle</li>
        <li>Par = Original score of this puzzle</li>
        <li>Highscore = Best score submitted by all users</li>
        <li>Count = Number of times that this puzzle has been played</li>
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
