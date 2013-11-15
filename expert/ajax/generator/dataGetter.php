<?php
if (PHP_SAPI !== 'cli'){
    die("can only run from cli");
}

$options = getopt('fi::');

if (!isset($options['i'])){
    die("Usage: php {$argv[0]} [-f] -i SEQUENCCENAME\n");
}

$data = array();

// set the type argument
if (isset($options['f'])){
    $data['type'] = 'full';
}else{
    $data['type'] = 'seed';
}

$data['fmt'] = 'stockholm';

$data['name'] = $options['i'];


$response = doPOST('http://rfam.janelia.org/cgi-bin/getalignment',
        http_build_query($data)
    );

$lines = split("\n", $response);

$data = array();
$control = array();

foreach ($lines as $line){
    if (strlen($line) > 2 && $line{0} == '#'){
        // line is a control line
        $count = preg_match("/^#=([A-Z_]{1,5})[ \t]+([A-Za-z_]+)[ \t]+([^\r]*)$/",
                             $line, $matches); 
        if ($count > 0){
            if (!isset($control[$matches[1]])){
                $control[$matches[1]] = array();
            }
            if (!isset($control[$matches[1]][$matches[2]])){
                $control[$matches[1]][$matches[2]] = array();
            }
            $control[$matches[1]][$matches[2]][] = $matches[3];
        }
    }else{
        // line is a data line
        if (strlen($line) > 5){     // skip empty lines
            $count = preg_match("/^([^ \t\r]+)[ \t]+([^ \r\t]+)$/", $line, $matches);
            if ($count > 0){
                if (!isset($data[$matches[1]])){
                    $data[$matches[1]] = array();
                }
                $data[$matches[1]][] = $matches[2];
            }
        }
    }
}

$obj['sequences'] = array();
foreach ($data as $key => $val){
    $obj['sequences'][] = implode($val);
}
$obj['fold'] = implode($control['GC']['SS_cons']);

echo serialize($obj);

function doPOST($url, $data, $optional_headers = null)
{
    $params = array('http' => array(
        'method' => 'POST',
        'content' => $data
    ));
    if ($optional_headers !== null) {
        $params['http']['header'] = $optional_headers;
    }
    $ctx = stream_context_create($params);
    $fp = @fopen($url, 'rb', false, $ctx);
    if (!$fp) {
        throw new Exception("Problem with $url, $php_errormsg");
    }
    $response = @stream_get_contents($fp);
    if ($response === false) {
        throw new Exception("Problem reading data from $url, $php_errormsg");
    }
    return $response;
}
