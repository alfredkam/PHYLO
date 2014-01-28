/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/!function(){var a="../../../phpdb/phyloExpertDB.php",b=$.cookie.read("username");if(""!=b){var c=8,d="mode="+c+"&user="+b;$.ajax({type:"POST",url:a,data:d}).done(function(a){"succ"!=a&&bootbox.alert("You must first play 20 puzzles with the classic edition.",function(){window.location="http://phylo.cs.mcgill.ca/expert/welcome.php"})}).fail(function(){bootbox.alert("Could not connect to the server. Please try again later.")})}else window.location="http://phylo.cs.mcgill.ca/expert/welcome.php"}();