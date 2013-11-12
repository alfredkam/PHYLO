<?php

$user=$_COOKIE['username'];

$url = 'http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php';

$fields = array(
            'mode'=>'12',
	    'user'=>$user,
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
$dbresult = json_decode($result,true);

$blockmenu = array();
foreach ($dbresult['submissions'] as $level_id => $info) {
  $bioblock_id = $info['bioblock_id'];
  if (! array_key_exists($bioblock_id,$blockmenu)) {
    $blockmenu[$bioblock_id]['numseqs'] = $dbresult['bioblocks'][$bioblock_id]['numseqs'];
    $blockmenu[$bioblock_id]['game_par'] = $dbresult['bioblocks'][$bioblock_id]['game_par'];
    $blockmenu[$bioblock_id]['game_highscore'] = $dbresult['bioblocks'][$bioblock_id]['game_highscore'];
    $blockmenu[$bioblock_id]['highscore_id'] = $dbresult['bioblocks'][$bioblock_id]['expertid_highscore'];
    $blockmenu[$bioblock_id]['submitted_score'] = $info['submitted_score'];
    $blockmenu[$bioblock_id]['submit_id'] = $level_id;
    $blockmenu[$bioblock_id]['disease_category'] = $dbresult['bioblocks'][$bioblock_id]['disease_category'];    
    $blockmenu[$bioblock_id]['play_count'] = 1;
  } else {
    if ( $blockmenu[$bioblock_id]['submitted_score'] < $info['submitted_score']) {
      $blockmenu[$bioblock_id]['submitted_score'] = $info['submitted_score'];
      $blockmenu[$bioblock_id]['submit_id'] = $level_id;
    }
    $prevcount = $blockmenu[$bioblock_id]['play_count'];
    $blockmenu[$bioblock_id]['play_count'] = $prevcount + 1;
  }
}

?>

<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="example" >
<thead>
<tr><td></td><td width=50>ID</td><td width=60>Difficulty</td><td>Disease</td><td width=50>Play</td><td></td><td width=100>Par</td><td></td><td width=100>Highscore</td><td></td><td width=100>My score</td><td></td><td width=50></td></tr>
</thead>
<tbody>
<?php
foreach ($blockmenu as $level_id => $info) {
	if ($info['submitted_score']>=$info['game_highscore']) {
	   $hsflag = "<img src=\"img/gold_medal.png\" style=\"width:18px;padding-left:16px\" />";
	   $hscount = 1;
	} else {
	   $hsflag = "";
	   $hscount = 0;
	}
	echo "<tr><td>" . $level_id . "</td><td><a href=\"interactive-dev.php?id=s" . $level_id . "\">" . $level_id . "</a></td><td>" . $info['numseqs']. "</td><td>" . $info['disease_category'] . "</td><td>" . $info['play_count'] . "</td><td>" . $info['game_par']. "</td><td><a href=\"interactive-dev.php?id=s" . $level_id . "\">" . $info['game_par'] . "</a></td><td>" . $info['game_highscore'] . "</td><td><a href=\"interactive-dev.php?id=x" . $info['highscore_id'] . "\">" . $info['game_highscore'] . "</a></td><td>" . $info['submitted_score'] . "</td><td><a href=\"interactive-dev.php?id=x" . $info['submit_id'] . "\">" . $info['submitted_score'] . "</a></td><td>" . $hscount . "</td><td>" . $hsflag . "</td></tr>\n";
}
?>
</tbody>
</table>
