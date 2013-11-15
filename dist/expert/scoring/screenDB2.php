<?php
include '../../phpdb/dbExpertConnector.php';

$connector = new dbConnector();
$buffer = $connector->query("SELECT block_id,bioblock_id,tree,treestring,sequences,full_score,submitted_score FROM expertblocks");
$buffer2 = $connector->query("SELECT block_id,base_score,bio_highscore,game_par,game_highscore FROM bioblocks");

$bioblocktable = array();
while ($myrow = $connector->fetchArray($buffer2)) {
      $id = $myrow['block_id'];
      $bioblocktable[$id] = array();
      $bioblocktable[$id]['bio_par'] = $myrow['base_score'];
      $bioblocktable[$id]['bio_hs'] = $myrow['bio_highscore'];
      $bioblocktable[$id]['game_par'] = $myrow['game_par'];
      $bioblocktable[$id]['game_hs'] = $myrow['game_highscore'];
      $bioblocktable[$id]['count'] = 0;
}

while ($myrow = $connector->fetchArray($buffer)) {

   /* misc variables */
   $blockid = $myrow['block_id'];
   $tree_string = $myrow['treestring'];
   $refid = $myrow['bioblock_id'];

   /* build species list */
   $tree_struct = $myrow['tree'];
   $speclist=array();
   $newid="";
   for ($i=0; $i<=strlen($tree_struct);$i++) {
       $carac = substr($tree_struct,$i,1);
       if ($carac=='(' or $carac==')' or $carac==',') {
       	  if ($newid!="") {
             array_push($speclist,$newid);
             $newid="";
       	  }
       } else {
       	 $newid .= $carac;
       }
   }
   
   /* build sequence array */
   
   $fulldataseqs = json_decode($myrow['sequences'],true);
   $sequences = $fulldataseqs['sequence'];
   
   /* combine */

   $fullsequences = array_combine($speclist,$sequences);

   /* compute real score */

   $treefilename = $blockid . ".tree";
   $seqfilename = $blockid . ".fasta";

   $treefile = fopen($treefilename,'w');
   fwrite($treefile,$tree_string);
   fclose($treefile);

   $seqfile = fopen($seqfilename,'w');
   foreach ($fullsequences as $k => $s) {
       fwrite($seqfile,">$k\n$s\n");
   }
   fclose($seqfile);


   /* compute game score */
   $output = exec("python score.py F $treefilename $seqfilename",$outputarray,$returnvar);
   preg_match_all("/:[\t ]*(?P<score>[0-9.]+)$/",$output,$matches);
   $gamescore = $matches['score'][0];

   /* compute Ancestor score */
   $output = exec("python score.py x $treefilename $seqfilename",$outputarray,$returnvar);
   preg_match_all("/:[\t ]*(?P<score>[0-9.]+)$/",$output,$matches);
   $bioscore = $matches['score'][0];

   if (0) {
      print_r($myrow['block_id'] . "\t" . $refid . "\t" . $gamescore . " (" . $bioblocktable[$refid]['game_par'] . "," . $bioblocktable[$refid]['game_hs'] . ")\t" . $bioscore . " (" . $bioblocktable[$refid]['bio_par'] . "," . $bioblocktable[$refid]['bio_hs'] . ")\n");
   }
   
   if (1) {
      if ($bioscore>=$bioblocktable[$refid]['bio_hs'] && $bioscore>=$bioblocktable[$refid]['bio_par']) {
      	 $connector->query("UPDATE bioblocks SET bio_highscore=$bioscore, expertid_bio_highscore=$blockid WHERE block_id=$refid");
      	 print_r("BIOL: Block " . $refid . " improved: " . $bioblocktable[$refid]['bio_hs'] . " --> " . $bioscore . "\n");
      	 $bioblocktable[$refid]['bio_hs']=$bioscore;
   	 }
   
      if ($gamescore>=$bioblocktable[$refid]['game_hs'] && $gamescore>=$bioblocktable[$refid]['game_par']) {
         $connector->query("UPDATE bioblocks SET game_highscore=$gamescore, expertid_highscore=$blockid WHERE block_id=$refid");
      	 print_r("GAME: Block " . $refid . " improved: " . $bioblocktable[$refid]['game_hs'] . " --> " . $gamescore . "\n");
      	 $bioblocktable[$refid]['bio_hs']=$bioscore;
   	 }
   }

   $bioblocktable[$refid]['count'] += 1;

   /* clean */
   unlink($treefilename);
   unlink($seqfilename);

}

/* update counter */
foreach ($bioblocktable as $id => $cell) {
    $counter = $cell['count'];
    $connector->query("UPDATE bioblocks SET play_count=$counter WHERE block_id=$id");
}

?>