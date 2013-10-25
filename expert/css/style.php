<?
header("Content-Type: text/css");

$NOECHO = true;

include('../js/consts.php');

$boxSize = 20;
$borderWidth = 1;
$totalSize = $boxSize + $borderWidth * 2;
$unit = 'px';

$boxAreaWidth = $totalSize*40;
$boxAreaHeight = $totalSize*10;

//grid
$gridBorderWidth = 1;
$gridSize = $totalSize - $gridBorderWidth * 1;

// textarea
$textAreaPaddingSize = 3;
$textAreaHeight = 100 - 2 * $textAreaPaddingSize;
$textAreaWidth = $boxAreaWidth - 2 * $textAreaPaddingSize;

// background-image : url('../imgs/boxoutline.png');
echo <<<CSS
* {
    margin: 0;
    padding: 0;
    border: 0;
    font-family: sans-serif;
    font-size: 1em;
    font-weight: normal;
    font-style: normal;
    text-decoration: none;
    color: #EFEFEF;
    
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}

input, .selectable{
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    -o-user-select: text;
    user-select: text;
}

#stats label{
    color: #eee;
}

.grid {
    z-index: -10;
    position: absolute !important;
    float: left;
    border-spacing: 0{$unit};
    padding: 0{$unit} 0{$unit} 0{$unit} 0{$unit};
    border-color: #777777;
    border-style: solid;
    border-width: {$gridBorderWidth}{$unit};
    width: {$gridSize}{$unit};
    height: {$gridSize}{$unit};
}

.draggable {
    width: {$boxSize}{$unit};
    height: {$boxSize}{$unit};
    float: left;
    margin: {$borderWidth}{$unit};
    border-width: 0{$unit};
}

.dragging {
    width: {$boxSize}{$unit};
    height: {$boxSize}{$unit};
    background: #222222 !important;
    float: left;
    border-style: double;
    border-width: {$borderWidth}{$unit};
}

.box0 {
    background: red;
    border-color: red;
}

.box1 {
    background: green;
    border-color: green;
}

.box2 {
    background: yellow;
    border-color: yellow;
}

.box3 {
    background: blue;
    border-color: blue;
}

.box4 {
    background: white;
    border-color: white;
}

.rowcontainer {
    height: {$totalSize}{$unit};
}

.boxarea{
    height: {$boxAreaHeight}{$unit};
    width: {$boxAreaWidth}{$unit};
}

#main-wrapper{
}

#viewport-wrapper{
}

#messagebox-wrapper{
}

#canvas-overlay{
    position: relative;
    top: -320{$unit};
    left: 0px;
    z-index: 20;
}

#drawing-area{
    top: 0px;
    left: 0px;
}

#rowdrag-area{
    top: 0px;
    left: 0px;
}

input,textarea{
    background: #DDDDDD;
    color: #222222;
    border: 1px solid #EFEFEF;
}

input.login {
    margin: 5px 10px 5px 10px;
}

li.submitlogin {
    margin: -15px 0px 0px 5px;
}

a.my-login-button {
    display: inline;
}

.navbar .nav li > a.my-login-button:hover {
	background-color:#FFFFFF;
}

.modal-body {
    color: #000000;
}

#messagebox{
    width: {$textAreaWidth}{$unit};
    height: {$textAreaHeight}{$unit};
    padding: {$textAreaPaddingSize}{$unit};
}

#header{
    height: 100{$unit};
}

#page-wrapper{
    width: 80%;
    margin: auto;
}
    
#page{
    min-width: {$SIZE_MIN_WIDTH};    
}

#canvas-container{
    white-space: nowrap;
}

#selection-box{
    position: absolute;
    background: rgba(100,100,155,0.3);
    border: 2px solid #FF0022;
    z-order: 100;
    width: 100px;
    height: 100px;
    display: none;
}

#stats td{
    width: 150px;
    padding: 0px 20px 0px 0px;
}

#ancestor-selection-box {
    border-top: {$boxSize}{$unit} solid rgba(200, 0, 0, 0.5);
    border-bottom: {$boxSize}{$unit} solid rgba(0, 200, 0, 0.5);
    border-left: {$boxSize}{$unit} solid rgba(0, 0, 200, 0.5);
    border-right: {$boxSize}{$unit} solid rgba(200, 0, 200, 0.5);
    position: absolute;
    top: 0px;
    left: 0px;
    width: {$boxSize}{$unit};
    height: {$boxSize}{$unit};
    display: none;
}

#button-container{
    display: inline-block;
    width: {$BC_W}{$unit};
    height: {$BC_H}{$unit};
    
    vertical-align: top;
}

.btn-save,.btn-load{
    border: 1{$unit} solid rgb(200,200,200);
    background: rgba(0,0,0,0);
    width: 22{$unit};
    height: 22{$unit};
    float: right;
}

.btn-load{
    float: right;
}
    
#btns td{
    /*border: 1{$unit} solid rgb(240,240,240);*/
    width: 22{$unit};
    height: 21{$unit};
    vertical-align: middle;
    text-align: center;
    
    padding: 1px 0px 0px 0px;
}
    
#btns td.btn-border-gradient{
/*
    background-color: #da4f49;
    *background-color: #bd362f;
background-color: #da4f49;
*background-color: rgba(0,0,0,0);*/
background-image: -ms-linear-gradient(left, #f0f0f0, #888888);
background-image: -webkit-linear-gradient(left, #f0f0f0, #888888);
background-image: -o-linear-gradient(left, #f0f0f0, #888888);
background-image: -moz-linear-gradient(left, #f0f0f0, #888888);
background-image: linear-gradient(left, #f0f0f0, #888888);
background-repeat: repeat-y;
}

#btns td.btn-border-solid{
    background-color: #f0f0f0;
}
    
div.btn-inside{
    background-color: #888888;
    height: 21px;
}
    
#btns tr{
    height: 22{$unit};
}
    
#btns td.btn-label{
border-left-color: -ms-linear-gradient(top, #ffffff, #e6e6e6);
border-left-color: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#e6e6e6));
border-left-color: -webkit-linear-gradient(top, #ffffff, #e6e6e6);
border-left-color: -o-linear-gradient(top, #ffffff, #e6e6e6);
border-left-color: linear-gradient(top, #ffffff, #e6e6e6);
border-left-color: -moz-linear-gradient(top, #ffffff, #e6e6e6);

}

#btns td i{
    margin-top: 2px;    
}
    
#button-container label{
    height: 22{$unit};
    display: inline-block;
    margin: 0;
}

#stats-toggle{
    cursor: pointer;
    cursor: hand;
}

#stats-submit{
    float: right;
}

.textbox{
    border-width: 1px;
    border-style: solid;
    border-color: #556666;
    border-radius: 0px;
    background-color: #222233;
    color: #ffffff;
}

.welcome {
    font-size: 16px;
}

li.welcome {
    margin-top: 5px;
    margin-bottom: 5px;
}

label {
      /* erase bootstrap definition */
      color: #EFEFEF;
}

.logo {
   padding-left: 40px;
   padding-top: 5px;
}

body{
    background: #334455;
}
CSS;
/**
body{
    background: #222233;
}
 
 */
?>
