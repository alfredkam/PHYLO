<?php
$teststr = <<<TEXT
{
    "header": ["Rank", "Player", "Score"],
    "rank": [
        ["", ["1", "Alice", "100"]],
        ["", ["2", "Brent", "95"]],
        ["", ["3", "Cody", "90"]],
        ["", ["4", "Daniel", "85"]],
        ["empty"],
        ["string", "Hello lol fooosdkfjs dflkjds flkjdsflk dsklfj sdlkf jdslk jflkds jflkds jfdslkf jdslk jflkdsjf"],
        ["empty"],
        ["highlight", ["5", "Edward", "80"]],
        ["empty"],
        ["string", "Dude"],
        ["empty"],
        ["", ["6", "Frank", "70"]],
        ["", ["7", "Grace", "60"]],
        ["", ["8", "Hugo", "50"]],
        ["", ["9", "Ian", "40"]]
    ]
}
TEXT;
echo $teststr;
//echo json_encode(array("header" => array( "A", "B", "C" ), "body" => array( "A", "B", "C" )));
//echo json_decode($teststr);
?>
