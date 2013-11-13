<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// define("ROOT_PATH", "/home/mcb/phylo/public_html");
// include $ROOT_PATH.'/phpdb/dbExpertConnector.php';
include "/home/mcb/phylo/public_html/phpdb/dbExpertConnector.php"

function build($tree, &$seqs){
    if (gettype($tree) == 'array'){
        $tree[0] = build($tree[0], $seqs);
        $tree[1] = build($tree[1], $seqs);
    }else{
        $tree = strtoupper(array_shift($seqs));
    }
    return $tree;
}

function DFS($mytree,&$myseqs) {
         if (count($mytree)==1) {
            array_push($myseqs,str_replace('.','-',$mytree));
         }
         else {
              DFS($mytree['0'],&$myseqs);
              DFS($mytree['1'],&$myseqs);
         }
}

/* define arguments to submit */

$id = $_POST['stage'];
$user = $_POST['user'];
$score = $_POST['score'];
$fulltree = $_POST['tree'];

/* retrieve missing data */
$connector = new dbConnector();

/* id syntax: s<num> from bioblocks & x<num> from expertblocks                           */
/* if it starts with x, one must look into the expertblock data to know the bioblocks id */
$prefix=$id[0];
$suffix=substr($id,1);
if ($prefix=='s') {
    $buffer = $connector->query("SELECT tree,treestring FROM bioblocks WHERE block_id = $suffix");
    $xarray = $connector->fetchArray($buffer);
    $tree_string = $xarray['treestring'];
    $tree_struct = $xarray['tree'];
    $bio_id = $suffix;
} elseif ($prefix=='x') {
    $buffer = $connector->query("SELECT bioblock_id,tree,treestring FROM expertblocks WHERE block_id = $suffix");
    $xarray = $connector->fetchArray($buffer);
    $tree_string = $xarray['treestring'];
    $tree_struct = $xarray['tree'];
    $bio_id = $xarray['bioblock_id'];
}

/* build species list */

$speclist=array();
$newid="";
for ($i=0; $i<=strlen($tree_struct);$i++) {
    $carac = substr($tree_struct,$i,1);
    //array_push($speclist,$carac);
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

$sequences = array();
DFS($fulltree,&$sequences);

if (count($speclist) != count($sequences)) {
   print_r("Species and sequence lists do not match");
   return;
}

$fullsequences = array_combine($speclist,$sequences);

/* compute real score */

$dirid = $id . "_" . $user ;
$blockid = time();

chdir('/tmp/');
if (! file_exists($dirid)) {
   exec("mkdir $dirid");
   exec("chmod 777 $dirid");
}
chdir("/tmp/$dirid");

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
exec("chmod * $seqfile");

//$output = exec("/home/mcb/blanchem/phylo2/evaluateAlignment $treefilename $seqfilename",$outputarray,$returnvar);
$output = exec("python /home/mcb/phylo/public_html/expert/scoring/score.py x $treefilename $seqfilename",$outputarray,$returnvar);
preg_match_all("/:[\t ]*(?P<score>[0-9.]+)$/",$output,$matches);
$fullscore = $matches['score'][0];

/* submit */

$url = 'http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php';

$fields = array(
            'mode'=> '13',
            'id'=> urlencode($id),
	    'user'=> $user,
	    'align'=> json_encode(array('sequence'=>$sequences)),
	    'score'=> $score,
	    'bioid' => $bio_id,
	    'tree' => $tree_struct,
	    'treestring' => $tree_string,
	    'bioscore' => $fullscore,
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

print_r($result);

?>
