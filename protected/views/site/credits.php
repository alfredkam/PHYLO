

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
(function() {
		window.lang = <?php echo $getValue; ?>script.lang[0];
		var credits = window.lang.body.play.credit;
			var str = "<div class='wrapper'><div class='wrapper-inner'>";
			str+= "<h2>"+credits["field 1"]+"</h2>"+
				'<ul><li><a href="mailto:jerome.waldispuhl@mcgill.ca">Jérôme Waldispühl</a></li><li><a href="mailto:blanchem@mcb.mcgill.ca">Mathieu Blanchette</a></li></ul>'+
				"<h2>"+credits["field 8"]+"</h2>"+
				'<ul><li>Luis Sarmenta</li></ul>'+
				"<h2>"+credits["field 2"]+"</h2>"+
				'<ul><li><a href="mailto:alfred.kam@mail.mcgill.ca">Alfred Kam</a></li><li><a href="mailto:daniel.kwak@mail.mcgill.ca">Daniel Kwak</a></li><li><a href="mailto:clarence@mail.mcgill.ca">Clarence Leung</a></li><li><a href="mailto:chu.wu2@mail.mcgill.ca">Chu Wu</a></li><li><a href="mailto:eleyine.zarour@mail.mcgill.ca">Eleyine Zarour</a></li></ul>'+
				"<h2>"+credits["field 3"]+"</h2>"+
				'<ul><li><a href="mailto:akawry@cs.mcgill.ca">Alex Kawrykow</a></li><li><a href="mailto:grouma@cs.mcgill.ca">Gary Roumanis</a></li></ul>'+
                                "<h2>"+credits["field 9"]+"</h2>"+
                                '<ul><li>Badea Alexandru (Romanian/Română)</li><li>Gustavo Hime &amp; Susana Pereira (Portuguese/Português)</li><li>Erez Garty &amp; <a href=\"http://davidson.weizmann.ac.il/\">The Davidson Institute of Science Education</a> (Hebrew/עברית)</li><li>Efraín Martínez (Spanish/Español)</li><li>James Junzhi Wen (Chinese/简体中文)</li></ul>'+
				"<h2>"+credits["field 4"]+"</h2>"+
				'<ul> <li><a href="http://www.nserc-crsng.gc.ca/">Natural Sciences and Engineering Research Council of Canada</a></li><li><a href="http://www.nokia.com/">Nokia</a></li>  <li><a href="http://www.cs.mcgill.ca/">McGill School of Computer Science</a></li> </ul>'+
				"<h2>"+credits["field 5"]+"</h2>"+
				'<ul><li><a href="http://www.facebook.com/group.php?gid=127713783941517">Facebook</a></li> <li><a href="https://plus.google.com/u/0/b/111453047184263548841/111453047184263548841/posts">Google+</a></li></ul>'+
				"<h2>"+credits["field 6"]+"</h2>"+
				'<ul><li>Xavier Garozzo / Jérôme Barel / Jérôme Waldispühl</li>   </ul>'+
				"<h2>"+credits["field 7"]+"</h2>"+
				'<ul><li>Andrew Bogecho, Katherine Gombay, Kailesh Mussai, William Raillant-Clark, James Shubin, Ron Simpson.</li>  </ul>';
			str+"</div></div>";

			$("#context").html(str);
			
})();

</script>

