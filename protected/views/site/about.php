
<div id='context'>

</div>

<?php
	$getValue = "";
	if(isset($_GET["lang"]) && !empty($_GET["lang"])) {
				$getValue = strtoupper($_GET["lang"]);
	} else {
		$getValue = "EN";
	}
?>

<script src='/js/DNA/helper.core.js' type='text/javascript'></script>
<script src="/lang/<?php echo $getValue; ?>.js" type="text/javascript"></script>

<script type='text/javascript'>
	(function(){
			window.lang = <?php echo $getValue; ?>script.lang[0];
			var about = window.lang.body.play.about;
			console.log(about);
			var str = "<div class='wrapper'><div class='wrapper-inner'>";
			for(var i=1;i<=10;i+=2) {
				str+="<h1>"+about["field "+i]+"</h1><p>"+about["field "+(i+1)]+"</p>";
			}
			str+="</div></div>";
			$("#context").html(str);
	})();
			
</script>