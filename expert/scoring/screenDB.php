<?php
include '../../phpdb/dbExpertConnector.php';

$connector = new dbConnector();
$buffer = $connector->query("SELECT block_id,tree,treestring,sequences,base_score,game_par,game_highscore FROM bioblocks");

while ($myrow = $connector->fetchArray($buffer)) {

   /* misc variables */
   $blockid = $myrow['block_id'];
   $tree_string = $myrow['treestring'];
   
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

   $treefilename=$blockid.".tree";
   $seqfilename=$blockid.".fasta";

   $treefile = fopen($treefilename,'w');
   fwrite($treefile,$tree_string);
   fclose($treefile);

   $seqfile = fopen($seqfilename,'w');
   foreach ($fullsequences as $k => $s) {
     $cleanseq = str_replace('N','A',$s);	
     fwrite($seqfile,">$k\n$cleanseq\n");
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

   print_r($myrow['block_id'] . "\t" . $myrow['game_par'] . "\t" . $myrow['game_highscore'] . "\t" . $gamescore . "\t" . $bioscore . "\n");

   /* init */
   if (1) {
      if (($bioscore)&&($gamescore)) {
      	 $connector->query("UPDATE bioblocks SET base_score=$bioscore, bio_highscore=$bioscore, game_par=$gamescore, game_highscore=$gamescore WHERE block_id=$blockid");
	 //print_r("update puzzle " . $blockid . " --> " . $bioscore);
      }
   }
   
   unlink($treefilename);
   unlink($seqfilename);

}

?>