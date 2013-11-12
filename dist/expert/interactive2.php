<!DOCTYPE HTML> 
<html lang="en"> 
<head> 

<link href="css/trontastic/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css" />
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
<link href="css/style.php" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="js/lib/JSON.js"></script> 
<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="js/consts.php"></script>
<script type="text/javascript">
var args = {};
<? if (isset($_GET['rand'])){ ?>
args.rand=true;
<? } if (isset($_GET['space']) && ($_GET['space'] == 'short' || $_GET['space'] == 'none')){ ?>
args.space="<? echo htmlspecialchars($_GET['space']); ?>";
<? } if (isset($_GET['name']) && preg_match("/^[A-Za-z0-9_.-]+$/", $_GET['name']) == 1){ ?>
args.name="<? echo htmlspecialchars($_GET['name']); ?>";
<? } if (isset($_GET['id'])){ ?>
args.id="<? echo htmlspecialchars($_GET['id']); ?>";
<? } else { ?>
args.id='3871';
<? } if (isset($_GET['subscore'])){ ?>
args.ui_showscore="<? echo htmlspecialchars($_GET['subscore']); ?>";
<? } ?>
</script>
<script type="text/javascript" src="js/msg.js"></script>
<script type="text/javascript" src="js/lang.js"></script>
<script type="text/javascript" src="js/fitch.js"></script>
<script type="text/javascript" src="js/in.js"></script>
<script type="text/javascript" src="js/scorebar.js"></script>
<script type="text/javascript" src="js/buttoncolumn.js"></script>
<script type="text/javascript" src="js/ui.js"></script>
<script type="text/javascript" src="js/window.js"></script>
<script type="text/javascript" src="js/htmlelements.js"></script>
</head> 
<body> 

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <ul class="nav">
                <li class="active"><a href="#">Play!</a></li>
                <li><a href="#">Home</a></li>
                <li><a href="#">Highscores</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <ul class="nav pull-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        English
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a data-target="#">English</a></li>
                        <li><a data-target="#">French</a></li>
                    </ul>
                </li>
            </ul>
            <form class="navbar-search pull-right">
                <input id="stage-redirect" type="text" class="search-query span1" placeholder="Stage">
            </form>
        </div>
    </div>
</div>  
<div id="page-wrapper">
<div id="page">

<div id="header-wrapper">
    <div id="header">
      
    </div>
</div>
<div id="main-wrapper">
    <canvas id="scorebar-area" width="1400" height="100"></canvas>
    <div id="canvas-container">
        <div id='ancestor-selection-box'></div>
        <canvas id="tree-area" width="200" height="800"></canvas><canvas id="drawing-area" width="1400" height="800"></canvas><canvas id="buttoncolumn-area" width="1400" height="800"></canvas>
    </div>
</div>

<div id="viewport-wrapper"><canvas id="viewport" width="1400" height="100"></canvas></div>

<div id="messagebox-wrapper">
    <div id="stats" class="row">
        <div class="span2"><label for="stats-mismatches">Matches</label><span id="stats-mismatches"></span></div>
        <div class="span2"><label for="stats-matches">Mismatches</label><span id="stats-matches"></span></div>
        <div class="span2"><label for="stats-gaps">Gaps</label><span id="stats-gaps"></span></div>
        <div class="span2"><label for="stats-gapexts">Gap Extends</label><span id="stats-gapexts"></span></div>
        <div class="span2 offset2">
            <div id="scores" class="row">
                <div class="span2"><label for="scores-score">Score:</label><span id="scores-score"></span></div>
                <div class="span2"><label for="scores-best">Best:</label><span id="scores-best"></span></div>
                <div class="span2"><label for="stats-stage">Stage</label><span id="stats-stage"><? echo ( isset($_GET['id']) ? htmlspecialchars($_GET['id']) : $_GET['id'] = '3871'); ?></span></div>
                <div class="span2"><label for="stats-par">Par</label><span id="stats-par">0</span></div>
            </div>
        </div>
    </div>

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
