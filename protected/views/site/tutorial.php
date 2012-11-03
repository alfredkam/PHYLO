
<!--

<iframe src="http://phylo.cs.mcgill.ca/tutorial/'+window.langOpt.toUpperCase()+'/index.html" width="840" height="550" class="iframe-tutorial"></iframe>
-->
<?php
	
	$getValue = "";
	if(isset($_GET["lang"]) && !empty($_GET["lang"])) {
				$getValue = strtoupper($_GET["lang"]);
	} else {
		$getValue = "EN";
	}
?>

<div class='wrapper'>
	<iframe src="http://phylo.cs.mcgill.ca/tutorial/<?php echo $getValue; ?>/index.html" width="840" height="550" class="iframe-tutorial"></iframe>
</div>