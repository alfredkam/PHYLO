var norand = false;

var SIZE_MIN_WIDTH = 300;
var SIZE_MAX_WIDTH = 1000;

var S_MINX = 0;	// screen min x
var S_MINY = 0;	// screen min y
var V_W = 880;	// viewer width
var V_H = 220;	// viewer height

var T_W = 135; // tree area width
var T_H = 220; // tree area height
var T_SIZE_H = 15;   // size of one level in the tree
var T_THICKNESS = 1;
var T_COLOUR = "rgb(240,240,240)";
var T_COLOUR_S = "rgb(240,50,50)";
var T_TOP = 11;     // distance from top of canvas to star drawing
var T_RIGHT = 30;
var T_SIZE_V = 22;    // distance between nodes of the same level
var T_BACKGROUND_GRID_W = 30 * 1.3;
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
var T_IMAGES_DRAW_W = 30;
var T_IMAGES_DRAW_H = 30;

var S_W = 6446;	// screen width
var S_H = 220;	// screen height
var B_W = 20;	// box width
var B_H = 20;	// box height
var G_BORDER_SIZE = 2; // difference between box size and grid size
var G_H = 22;	// grid width
var G_W = 22;	// grid height
var G_ROW = 10;	// grid row
var G_COL = 293;	// grid col
var G_COLOUR = "rgb(240,240,240)";	//grid colour
var G_COLOUR_A = "rgba(240,240,240,0)";	//grid colour, full alpha

var V_ROW = 10;
var V_COL = 40;

var B_COLOUR = ["rgb(99,182,250)", 
                "rgb(0,153,51)",
                "rgb(153,0,204)",
                "rgb(242,122,13)"];        // regular colour
var B_COLOUR_A = ["rgba(99,182,250,",
                    "rgba(0,153,51,", 
                    "rgba(153,0,204,",
                    "rgba(242,122,13,"];        // regular colour that allows alpha
var B_COLOUR_S = ["rgb(176,218,253)",
                    "rgb(77,255,136)", 
                    "rgb(217,102,255)", 
                    "rgb(249,189,134)"];      // colour of selected
var B_COLOUR_H = ["rgba(113,188,251,0.7)",
                "rgba(113,188,251,0.7)",
                "rgba(113,188,251,0.7)",
                "rgba(113,188,251,0.7)"];  // colour of currently dragged
var BS_COLOUR_H = ["rgb(6,114,202)",
                    "rgb(0,92,31)",
                    "rgb(92,0,122)",
                    "rgb(145,74,8)"];     // stroke colour of currently dragged

var B_XOFFSET = 1;
var B_YOFFSET = 1;

var V_LMOVE = 50;	// range for viewer shift on drag
var V_RMOVE = 50;	// range for viewer shift on drag, right side

// viewport
var VP_B_W = 3;
var VP_B_H = 3;
var VP_OVERLAY_COLOUR = "rgba(100,130,130,0.6)";
var VP_BORDER_COLOUR = "rgb(200, 20, 20)";
var VP_BORDER_WIDTH = 2;

var VP_W = 293 * 3;	// viewer width
var VP_H = 10 * 3;	// viewer height

var VP_VP_W = 3 * 40;
var VP_VP_H = 3 * 10;
var VP_VP_LEFT = 0;
var VP_VP_TOP = 0;

var SB_W = 1000;
var SB_H = 50;

var BC_W = 100;
var BC_H = 220;
var BC_BACKGROUND_GRID_W = 100;
var BC_BUTTON_W = 33;
var BC_BUTTON_H = 20;
var BC_BUTTON_OVER_COLOUR = "rgb(200,200,200)";
var BC_BUTTON_DOWN_COLOUR = "rgb(150,150,150)";

var LANG_DIR = "lang/";
var LANG_EXT = ".json";
var LANG;

var V_ANCESTOR_ROW = 9;     // which row the ancestor appears
