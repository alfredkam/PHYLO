<!DOCTYPE HTML> 
<html lang="en"> 
<head> 

<link href="css/style.php" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.min.js"></script> 
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
<? } ?>
</script>
<script type="text/javascript" src="js/in.js"></script> 
<script type="text/javascript" src="js/ui.js"></script> 

</head> 
<body> 
<div id="page-wrapper">
<div id="page">

<div id="header-wrapper"><div id="header"></div></div>
<div id="main-wrapper"><canvas id="drawing-area" width="1400" height="800"></canvas></div>

<div id="viewport-wrapper"><canvas id="viewport" width="1400" height="100"></canvas></div>

</div>
</div>
</body> 
</html> 
