<?
/*
 *  args:
 *      space =
 *          none : no spaces at all in sequences
 *          short : extra spaces taken out
 *      name = 
 *          specific seqeunce name
 */

if (!isset($_GET['name'])){
    $content = file_get_contents('generator/U2.seq');
}else{
    $content = file_get_contents("generator/{$_GET['name']}.seq");
}
$obj = unserialize($content);

shuffle($obj['sequences']);

array_splice($obj['sequences'], 8);
if (isset($_GET['space']) && $_GET['space'] == 'none'){
    foreach ($obj['sequences'] as $key => $val){
        $obj['sequences'][$key] = str_replace('.', '', $val);
    }
}

if (isset($_GET['space']) && $_GET['space'] == 'short'){
    $obj['sequences'] = removeBlanks($obj['sequences']);
}

echo json_encode($obj);

function removeBlanks($seqs){
    $maxlen = 0;
    $newseqs = array();
    foreach ($seqs as $seq){
        if (strlen($seq) > $maxlen){
            $maxlen = strlen($seq);
        }
        $newseqs[] = '';
    }
    for ($i = 0; $i < $maxlen; $i++){
        $space = true;
        foreach ($seqs as $seq){
            if (isset($seq{$i}) && $seq{$i} != '.'){
                $space = false;
                break;
            }
        }
        if (!$space){
            foreach($seqs as $key => $seq){
                if (isset($seq{$i})){
                    $newseqs[$key] .= $seq{$i};
                }
            }
        }
    }
    return $newseqs;
}

?>
