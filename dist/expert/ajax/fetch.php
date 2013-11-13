<?php

function build($tree, &$seqs){
    if (gettype($tree) == 'array'){
        $tree[0] = build($tree[0], $seqs);
        $tree[1] = build($tree[1], $seqs);
    }else{
        $tree = strtoupper(array_shift($seqs));
    }
    return $tree;
}

// block id
$id = $_GET['id'];
// mode: original or from submission
//$mode = $_GET['mode'];

$url = 'http://phylo.cs.mcgill.ca/phpdb/phyloExpertDB.php';

$fields = array(
            'mode'=>'10',
            'id'=>urlencode($id),
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
$obj = json_decode($result, true);

$tree = $obj['level']['tree'];
$tree = preg_replace('/([A-Za-z0-9]+)/i', '"$1"', str_replace(array('(', ')', ';') , array('[', ']', ''), $tree));

$treeobj = json_decode($tree, true);

$seqs = $obj['level']['sequence'];

$fancy = build($treeobj, $seqs);

$out = json_encode($fancy);

/* tree structure is encoded in the seq data as list */
/* WARNING: interface wont work if sequences are too long. If needed, use command below to check. */
/* echo strlen($obj['level']['sequence'][0]); */


echo $out;

?>
