<link rel='stylesheet' href='<?php echo Yii::app()->request->baseUrl; ?>css/ranking.css'/>
	<div id='ranking'>
	
	</div>
	<?php
	
	$getValue = "";
	if(isset($_GET["lang"]) && !empty($_GET["lang"])) {
				$getValue = strtoupper($_GET["lang"]);
	} else {
		$getValue = "EN";
	}
?>
<!-- plugin for ranking table -->
		<script type="text/javascript" language="javascript" src="<?php echo Yii::app()->request->baseUrl; ?>js/jquery/jquery.dataTables.js"></script>
		<script type='text/javascript'>
			(function() {
				 $.ajax({
					url : "http://phylo.cs.mcgill.ca/phpdb/fullrankingsget.php?lang=<?php echo $getValue; ?>",
					type : "post",
				}).done(function(re) {
	               	 $("#ranking").html(re);
	               	 $.getScript("/js/ranking/ranking.js");
	              	 $.hashbang.panelReady();
            	});
			})();
		</script>