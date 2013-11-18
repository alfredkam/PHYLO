<?php

function RgbToHsl($rgb) {
    $r = $rgb['r'] / 255.0;
    $g = $rgb['g'] / 255.0;
    $b = $rgb['b'] / 255.0;

    $maxC = max($r, $g, $b);
    $minC = min($r, $g, $b);

    $l = ($maxC + $minC) / 2.0;

    if ($maxC == $minC) {
        $s = 0;
        $h = 0;
    } else {
        if ($l < .5) {
            $s = ($maxC - $minC) / ($maxC + $minC);
        } else {
            $s = ($maxC - $minC) / (2.0 - $maxC - $minC);
        }
        if ($r == $maxC)
            $h = ($g - $b) / ($maxC - $minC);
        if ($g == $maxC)
            $h = 2.0 + ($b - $r) / ($maxC - $minC);
        if ($b == $maxC)
            $h = 4.0 + ($r - $g) / ($maxC - $minC);

        $h = $h / 6.0;
    }

    $h = (int) round(360.0 * $h);
    $s = (int) round(100.0 * $s);
    $l = (int) round(100.0 * $l);

    return array('h' => $h, 's' => $s, 'l' => $l);
}

function HslToRgb($hsl) {
    $h = $hsl['h'] / 360.0;
    $s = $hsl['s'] / 100.0;
    $l = $hsl['l'] / 100.0;

    if ($s == 0) {
        $r = $l;
        $g = $l;
        $b = $l;
    } else {
        if ($l < .5) {
            $t2 = $l * (1.0 + $s);
        } else {
            $t2 = ($l + $s) - ($l * $s);
        }
        $t1 = 2.0 * $l - $t2;

        $rt3 = $h + 1.0 / 3.0;
        $gt3 = $h;
        $bt3 = $h - 1.0 / 3.0;

        if ($rt3 < 0)
            $rt3 += 1.0;
        if ($rt3 > 1)
            $rt3 -= 1.0;
        if ($gt3 < 0)
            $gt3 += 1.0;
        if ($gt3 > 1)
            $gt3 -= 1.0;
        if ($bt3 < 0)
            $bt3 += 1.0;
        if ($bt3 > 1)
            $bt3 -= 1.0;

        if (6.0 * $rt3 < 1)
            $r = $t1 + ($t2 - $t1) * 6.0 * $rt3;
        elseif (2.0 * $rt3 < 1)
            $r = $t2;
        elseif (3.0 * $rt3 < 2)
            $r = $t1 + ($t2 - $t1) * ((2.0 / 3.0) - $rt3) * 6.0;
        else
            $r = $t1;

        if (6.0 * $gt3 < 1)
            $g = $t1 + ($t2 - $t1) * 6.0 * $gt3;
        elseif (2.0 * $gt3 < 1)
            $g = $t2;
        elseif (3.0 * $gt3 < 2)
            $g = $t1 + ($t2 - $t1) * ((2.0 / 3.0) - $gt3) * 6.0;
        else
            $g = $t1;

        if (6.0 * $bt3 < 1)
            $b = $t1 + ($t2 - $t1) * 6.0 * $bt3;
        elseif (2.0 * $bt3 < 1)
            $b = $t2;
        elseif (3.0 * $bt3 < 2)
            $b = $t1 + ($t2 - $t1) * ((2.0 / 3.0) - $bt3) * 6.0;
        else
            $b = $t1;
    }

    $r = (int) round(255.0 * $r);
    $g = (int) round(255.0 * $g);
    $b = (int) round(255.0 * $b);

    return array('r' => $r, 'g' => $g, 'b' => $b);
}

// Viewport properties
// Change these to alter properties of the viewport (overview at bottom of screen)
$VP_W = 1000;
$VP_H = 100;
$VP_B_W = 3;
$VP_B_H = 3;

// Grid count properties
// Change these to alter the size of the main area
$G_ROW = 12;
$G_COL = 600;

// Change to alter max/min size of playing area from window resize
$SIZE_MAX_WIDTH = 1000;
$SIZE_MIN_WIDTH = 300;

// Box properties
// Change these to alter the size of individual boxes
// Note: B_W and B_H are changed via javascript in htmlelements.js
$B_W = 20;
$B_H = 20;
$G_BORDER_SIZE = 2;
$G_W = $B_W + $G_BORDER_SIZE;
$G_H = $B_H + $G_BORDER_SIZE;

$S_W = $G_W * $G_COL;
$S_H = $G_H * $G_ROW;

$B_H_ALPHA = 0.7;

// View area properties
// V_COL is set programatically via window resize code
$V_ROW = 12;
$V_COL = 40;

$V_W = $V_COL * $G_W;
$V_H = $V_ROW * $G_H;

$B_XOFFSET = ($G_W - $B_W) / 2.0;
$B_YOFFSET = ($G_H - $B_H) / 2.0;

// Tree properties
// Change these to alter size of the tree (left side of screen)
$T_W = 175;
$T_H = $S_H;
$T_LEVEL_SIZE = 15;
$T_TOP = $G_H / 2 + 0;
$T_RIGHT = 30;
$T_IMAGES_DRAW_W = 30;


// Score bar properties
// Chnage these to alter size of the score bar (top of screen)
$SB_W = $VP_W;
$SB_H = 50;

// Button column properties
// Chnage these to alter size of the button column (right side of screen)
$BC_W = 100;
$BC_H = $V_H;
$BC_BUTTON_W = (int)($G_W * 1.5);
$BC_BUTTON_H = $G_H - 2;

$B_COLOURS = array(
    array('r' => 99, 'g' => 182, 'b' => 250),
    array('r' => 0, 'g' => 153, 'b' => 51),
    array('r' => 153, 'g' => 0, 'b' => 204),
    array('r' => 242, 'g' => 122, 'b' => 13),
);

$B_COLOURS_S = array();
foreach ($B_COLOURS as $clr){
    $light = RgbToHsl($clr);
    $light['l'] = $light['l'] + (100 - $light['l']) * 0.5;
    $B_COLOURS_S[] = HslToRgb($light);
}

$B_COLOURS_H = array();
foreach ($B_COLOURS as $clr){
    $light = RgbToHsl($clr);
    $light['l'] = $light['l'] + (100 - $light['l']) * 0.1;
    $B_COLOURS_H[] = HslToRgb($light);
}

$BS_COLOURS_H = array();
foreach ($B_COLOURS as $clr){
    $light = RgbToHsl($clr);
    $light['l'] = $light['l'] * 0.6;
    $BS_COLOURS_H[] = HslToRgb($light);
}

$str = <<<TEXT
var norand = false;

var SIZE_MIN_WIDTH = $SIZE_MIN_WIDTH;
var SIZE_MAX_WIDTH = $SIZE_MAX_WIDTH;

var S_MINX = 0;	// screen min x
var S_MINY = 0;	// screen min y
var V_W = $V_W;	// viewer width
var V_H = $V_H;	// viewer height

var T_W = $T_W; // tree area width
var T_H = $T_H; // tree area height
var T_SIZE_H = $T_LEVEL_SIZE;   // size of one level in the tree
var T_THICKNESS = 1;
var T_COLOUR = "rgb(240,240,240)";
var T_COLOUR_S = "rgb(240,50,50)";
var T_TOP = $T_TOP;     // distance from top of canvas to star drawing
var T_RIGHT = $T_RIGHT;
var T_SIZE_V = $G_H;    // distance between nodes of the same level
var T_BACKGROUND_GRID_W = $T_IMAGES_DRAW_W * 1.3;
var T_ANCESTOR_BUTTON_W = 8;
var T_ANCESTOR_BUTTON_H = 8;

var T_IMAGES_DIR = "img/tree/";
var T_IMAGES_NAMES = ["ape.png", "bat.png", "beaver.png", "bird.png",
                "cat.png", "chimp.png", "cow.png", "dog.png",
                "dolphin.png", "elephant.png", "frog.png", "gopher.png",
                "horse.png", "human.png", "kangaroo.png", "lizard.png",
                "monkey.png", "mouse.png", "opossum.png", "rabbit.png",
                "ram.png", "rat.png", "shark.png", "sloth.png", "snake.png",
                "squirrel.png", "wolf.png"];
var T_IMAGES = [];
var T_IMAGES_W = 100;
var T_IMAGES_H = 86;
var T_IMAGES_DRAW_W = $T_IMAGES_DRAW_W;
var T_IMAGES_DRAW_H = $T_IMAGES_DRAW_W;

var S_W = $S_W;	// screen width
var S_H = $S_H;	// screen height
var B_W = $B_W;	// box width
var B_H = $B_H;	// box height
var G_BORDER_SIZE = $G_BORDER_SIZE; // difference between box size and grid size
var G_H = $G_H;	// grid width
var G_W = $G_W;	// grid height
var G_ROW = $G_ROW;	// grid row
var G_COL = $G_COL;	// grid col
var G_COLOUR = "rgb(240,240,240)";	//grid colour
var G_COLOUR_A = "rgba(240,240,240,0)";	//grid colour, full alpha

var V_ROW = $V_ROW;
var V_COL = $V_COL;

var B_COLOUR = ["rgb({$B_COLOURS[0]['r']},{$B_COLOURS[0]['g']},{$B_COLOURS[0]['b']})", 
                "rgb({$B_COLOURS[1]['r']},{$B_COLOURS[1]['g']},{$B_COLOURS[1]['b']})",
                "rgb({$B_COLOURS[2]['r']},{$B_COLOURS[2]['g']},{$B_COLOURS[2]['b']})",
                "rgb({$B_COLOURS[3]['r']},{$B_COLOURS[3]['g']},{$B_COLOURS[3]['b']})"];        // regular colour
var B_COLOUR_A = ["rgba({$B_COLOURS[0]['r']},{$B_COLOURS[0]['g']},{$B_COLOURS[0]['b']},",
                    "rgba({$B_COLOURS[1]['r']},{$B_COLOURS[1]['g']},{$B_COLOURS[1]['b']},", 
                    "rgba({$B_COLOURS[2]['r']},{$B_COLOURS[2]['g']},{$B_COLOURS[2]['b']},",
                    "rgba({$B_COLOURS[3]['r']},{$B_COLOURS[3]['g']},{$B_COLOURS[3]['b']},"];        // regular colour that allows alpha
var B_COLOUR_S = ["rgb({$B_COLOURS_S[0]['r']},{$B_COLOURS_S[0]['g']},{$B_COLOURS_S[0]['b']})",
                    "rgb({$B_COLOURS_S[1]['r']},{$B_COLOURS_S[1]['g']},{$B_COLOURS_S[1]['b']})", 
                    "rgb({$B_COLOURS_S[2]['r']},{$B_COLOURS_S[2]['g']},{$B_COLOURS_S[2]['b']})", 
                    "rgb({$B_COLOURS_S[3]['r']},{$B_COLOURS_S[3]['g']},{$B_COLOURS_S[3]['b']})"];      // colour of selected
var B_COLOUR_H = ["rgba({$B_COLOURS_H[0]['r']},{$B_COLOURS_H[0]['g']},{$B_COLOURS_H[0]['b']},$B_H_ALPHA)",
                "rgba({$B_COLOURS_H[0]['r']},{$B_COLOURS_H[0]['g']},{$B_COLOURS_H[0]['b']},$B_H_ALPHA)",
                "rgba({$B_COLOURS_H[0]['r']},{$B_COLOURS_H[0]['g']},{$B_COLOURS_H[0]['b']},$B_H_ALPHA)",
                "rgba({$B_COLOURS_H[0]['r']},{$B_COLOURS_H[0]['g']},{$B_COLOURS_H[0]['b']},$B_H_ALPHA)"];  // colour of currently dragged
var BS_COLOUR_H = ["rgb({$BS_COLOURS_H[0]['r']},{$BS_COLOURS_H[0]['g']},{$BS_COLOURS_H[0]['b']})",
                    "rgb({$BS_COLOURS_H[1]['r']},{$BS_COLOURS_H[1]['g']},{$BS_COLOURS_H[1]['b']})",
                    "rgb({$BS_COLOURS_H[2]['r']},{$BS_COLOURS_H[2]['g']},{$BS_COLOURS_H[2]['b']})",
                    "rgb({$BS_COLOURS_H[3]['r']},{$BS_COLOURS_H[3]['g']},{$BS_COLOURS_H[3]['b']})"];     // stroke colour of currently dragged

var B_XOFFSET = $B_XOFFSET;
var B_YOFFSET = $B_YOFFSET;

var V_LMOVE = 50;	// range for viewer shift on drag
var V_RMOVE = 50;	// range for viewer shift on drag, right side

// viewport
var VP_B_W = $VP_B_W;
var VP_B_H = $VP_B_H;
var VP_OVERLAY_COLOUR = "rgba(100,130,130,0.6)";
var VP_BORDER_COLOUR = "rgb(200, 20, 20)";
var VP_BORDER_WIDTH = 2;

var VP_W = $G_COL * $VP_B_W;	// viewer width
var VP_H = $G_ROW * $VP_B_H;	// viewer height

var VP_VP_W = $VP_B_W * $V_COL;
var VP_VP_H = $VP_B_H * $V_ROW;
var VP_VP_LEFT = 0;
var VP_VP_TOP = 0;

var SB_W = $SB_W;
var SB_H = $SB_H;

var BC_W = $BC_W;
var BC_H = $T_H;
var BC_BACKGROUND_GRID_W = {$BC_W};
var BC_BUTTON_W = $BC_BUTTON_W;
var BC_BUTTON_H = $BC_BUTTON_H;
var BC_BUTTON_OVER_COLOUR = "rgb(200,200,200)";
var BC_BUTTON_DOWN_COLOUR = "rgb(150,150,150)";

var LANG_DIR = "lang/";
var LANG_EXT = ".json";
var LANG;

var V_ANCESTOR_ROW = 11;     // which row the ancestor appears

TEXT;

if (!isset($NOECHO)) echo $str;
