<!DOCTYPE HTML> 
<html lang="en"> 
<head> 

<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="js/lib/JSON.js"></script> 
<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="js/consts.php"></script>
<script type="text/javascript" src="js/scorebar.js"></script>
</head> 
<body> 

<div id="page-wrapper">
<div id="page">

<div id="messagebox-wrapper">
    <b>start</b>
    <canvas id="scorebar-area" width="1000" height ="50"></canvas>
    <b>end</b>
    
    <script type="text/javascript">
    var sb = new ScoreBar($("#scorebar-area").get(0));
    sb.setScores({score: 210, best: 800, par: 200});
    sb.recalc();
    </script>
    <!--<table id="stats">
        <tr>
            <td><label for="stats-matches">Mismatches</label><span id="stats-matches"></span></td>
            <td><label for="stats-gapexts">Gap Extends</label><span id="stats-gapexts"></span></td>
            <td><label for="stats-stage">Stage</label><span id="stats-stage"><? echo ( isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '3871'); ?></span></td>
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
</body> 
</html> 
