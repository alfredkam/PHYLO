<?php

//$id = $_GET['id'];

$url = 'http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php';

$fields = array(
            'mode'=>'11',
        );
$fields_string="";
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string,'&');

$postdata = http_build_query($fields);
$opts = array('http' =>
	array(
		'method' => 'POST',
		'header' => 'Content-type: application/x-www-form-urlencoded',
		'content' => $postdata
));
$result = file_get_contents($url, false, stream_context_create($opts));
$blockmenu = json_decode($result,true);

?>

<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="example" >
<thead>
<tr><td></td><td width=50>ID</td><td width=70>Difficulty</td><td>Disease</td><td>Owner</td><td></td><td width=70>Par</td><td></td><td width=70>Highscore</td><td width=50>Count</td></tr>
</thead>
<tbody>
<?php
foreach ($blockmenu as $level_id => $info) {
	echo "<tr><td>" . $level_id . "</td><td><a href=\"interactive-dev.php?id=s" . $level_id . "\">" . $level_id . "</a></td><td>" . $info['numseqs']. "</td><td>" . $info['disease_category']. "</td><td>" . $info['submitter'] .  "</td><td>" . $info['game_par']. "</td><td><a href=\"interactive-dev.php?id=s" . $level_id . "\">" . $info['game_par'] . "</a></td><td>" . $info['game_highscore'] . "</td><td><a href=\"interactive-dev.php?id=x" . $info['expertid_highscore'] . "\">" . $info['game_highscore'] . "</a></td><td>" . $info['play_count'] . "</td></tr>\n";
}
?>
</tbody>
</table>
