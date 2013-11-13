<html>
<head>
<link href="css/shape.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/lib/jquery-1.7.1.min.js"></script>
</head>
<body>
<div id="wrapper">
<div id="top" onclick="alert('top')"></div>
<div id="left" onclick="alert('left')"></div>
<div id="bottom" onclick="alert('bottom')"></div>
<div id="right" onclick="alert('right')"></div>

<canvas id="gradtest" top="100" left="100" position="absolute"></canvas>
<script type="text/javascript">
var canv = document.getElementById("gradtest");
canv.width = 200;
canv.height = 200;
var ctx = canv.getContext('2d');
var grad = ctx.createLinearGradient(100, 100, 200, 200);
grad.addColorStop(0, "rgb(0,0,0)");
grad.addColorStop(1, "rgb(255,255,255)");
ctx.strokeStyle = grad;
ctx.beginPath();
ctx.moveTo(10,10);
ctx.lineTo(200,200);
ctx.closePath();
ctx.stroke();

console.log('hi');
$.ajax({
    url: "lang/en-us.json",
    dataType: "text",
    success: function(data){
        console.log('foo');
        console.log(data);
        console.log($.parseJSON(data));
    },
    error: function(a, b, c){
        console.log(b);
        console.log(c);
        console.log(a);
    }
});
</script>
</div>
</body>
</html>