<!DOCTYPE HTML> 
<html lang="en"> 
<head> 

<link href="css/trontastic/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css" />
<link href="css/style.php" rel="stylesheet" type="text/css" />
<script type="text/javascript">
var args = {};
<? if (isset($_GET['id'])){ ?>
args.id="<? echo htmlspecialchars($_GET['id']); ?>";
<? } ?>
</script>
<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="js/JSON.js"></script>
<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="js/consts.php"></script>
<script type="text/javascript" src="js/fitch.js"></script>
</head> 
<body> 
<div id="page-wrapper">
<div id="page">

<div id="header-wrapper"><div id="header"></div></div>
<div id="main-wrapper">
    <div id="canvas-container">
        <canvas id="rowdrag-area" width="20" height="800"></canvas><canvas id="drawing-area" width="1400" height="800"></canvas>
    </div>
</div>

<div id="viewport-wrapper"><canvas id="viewport" width="1400" height="100"></canvas></div>

<div id="messagebox-wrapper"><textarea id="messagebox" width="1400" height="200" readonly="readonly"></textarea></div>



</div>
<div id="selection-box"></div>
</div>
</body> 
</html> 
