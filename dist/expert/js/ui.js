var pos = new Array();
var ctx;
var canvas;
var tcanvas;
var tctx;
var viewport;
var vctx;
var vp;
var multisel;
var originaltree;
var ancestorpos = new Array();
var currenttree;
var overridetree;
var currentancestor;
var currentancestorn;
var globalredraw = {"fitch": false};
var bestscore = -10000;
var drawThread;
var calcThread;
var sb;
var bc;
var resetting = false;

var resizeinfo = {};

var msg;
var fitch;

var fitchrecalcneeded = false;

$(function(){
    //msg = new MessageBox("messagebox");
    initHTMLElements();
    getSequences(init);
});

function reset(sequence, raw){
    if (resetting){
        return;
    }
    resetting = true;
    clearInterval(drawThread);
    clearInterval(calcThread);
    
    pos = new Array();
    multisel = null;
    originaltree = raw;
    ancestorpos = new Array();
    globalredraw = {"fitch": false};
    currenttree = null;
    bestscore = -10000;
    
    // actual sequences
    for (var i = 0; i < sequence.length; i++){
        pos[i] = new Array();
        createRow(i, (i) * G_H, sequence[i]);
        finalize(i);
    }
    vp = new Array();
    fitchCalculator = new FitchCalculator();
    originaltree = raw;
    
    $(document).unbind();
    
    canvas = $("#drawing-area").unbind().get(0);
    canvas.width = V_W;
    canvas.height = V_H;
    ctx = canvas.getContext("2d");
    
    tcanvas = $("#tree-area").unbind().get(0);
    tcanvas.width = T_W;
    tcanvas.height = T_H;
    tctx = tcanvas.getContext("2d");
    
    viewport = $("#viewport").unbind().get(0);
    viewport.width = VP_W;
    viewport.height = VP_H;
    vctx = viewport.getContext("2d");
    
    var scorebar = $("#scorebar-area").unbind().get(0);
    scorebar.width = SB_W;
    scorebar.height = SB_H;
    sb = new ScoreBar(scorebar);
    sb.setScores({score: 0, best: 0, par: 0});
    
    var buttoncolumn = $("#buttoncolumn-area").unbind().get(0);
    buttoncolumn.width = BC_W;
    buttoncolumn.height = BC_H;
    bc = new ButtonColumn(buttoncolumn);
    bc.draw();
    
    if ($('#stats-par').text().length > 0){
        sb.setPar($('#stats-par').text());
    }
    
    setDrag();
    setViewportDrag();
    recalc();
    resetOverrideTree();
    vp.redraw = true;
    pos.redraw = true;
    drawThread = setInterval(draw,33);
    fitchrecalcneeded = true;
    recalcFitch();
    calcThread = setInterval(recalcFitch, 400);
    
    resetting = false;
}

function init(sequence, raw){
    loadImages(function(){
        reset(sequence, raw);
        sb.setPar($('#scores-score').text());
        $('#stats-par').text($('#scores-score').text());
    });
}

function loadImages(callback){
    var loadImage = function(path, appendTo, done){
        var img = new Image;
        img.onload = function(){
            done.count += 1;
            appendTo.push(this);
        }
        img.onerror = function(){
            done.count += 1;
        }
        img.src = path;
    };
    
    var done = {count: 0};
    var target = 0;
    // load tree images
    var img;
    for (var i = 0; i < T_IMAGES_NAMES.length; i++){
        loadImage(T_IMAGES_DIR + T_IMAGES_NAMES[i], T_IMAGES, done);
        target++;
    }

    function wait_callback(){
        if (done.count < target){
            console.log('still waiting');
            setTimeout(wait_callback, 20);
        }else{
            console.log('images loaded');
            callback();
        }
    }
    setTimeout(wait_callback, 0);
}

function findMaxLength(){
    var max = 0;
    for (var i = 0; i < pos.length; i++){
        if (pos[i][pos[i].length - 1].left > max){
            max = pos[i][pos[i].length - 1].left;
        }
    }
    var c = Math.ceil(max / G_W + 1);
    console.log("max " + c);
    return c;
}

function GameState(stage, tree, override){
    var overrideToArray = function rec(tree){
        if (tree == undefined){
            return tree;
        }else{
            return {
		"0": rec(tree[0]), 
                "1": rec(tree[1]), 
                "ancestor": tree.value
	    };
        }
    }
    this.user=window.guest;
    this.stage = stage;
    this.tree = tree;
    this.score = sb.currentScore;
    this.overridetree = overrideToArray(override);
}

function getCurrentState(){
    var tree = extractCurrentTree();
    var out = new GameState(args['id'], tree, window.overridetree);
    return out;
}

function loadState(state){
    args['id'] = state.stage;
    var parsed = parseInput(state.tree);
    reset(parsed, state.tree);
}

function extractCurrentTree(){
    var seqs = new Array(pos.length);
    //var original = folder.getOriginal();
    var seqLength = findMaxLength();   //FitchCalculator.seqLength(originaltree)+100;
    var idMatrix = ['A', 'T', 'C', 'G'];
    for (var i = 0; i < pos.length; i++){
        var arr = new Array(seqLength);
        var j;
        for (j = 0; j < seqLength; j++){
            arr[j] = ".";
        }
        for (j = 0; j < pos[i].length; j++){
            arr[~~((pos[i][j].left + (G_W/2)) / G_W)] = idMatrix[pos[i][j].kind];
        }
        seqs[i] = arr.join("");
    }
    var tree = FitchCalculator.buildTree(originaltree,seqs);
    return tree;
}

function recalcFitch(){
    if (fitchrecalcneeded){
        fitchrecalcneeded = false;
        var tree = extractCurrentTree();
        var output = fitch.getFinalTree(tree, overridetree);
        //console.log("Tree \n" + JSON.stringify(tree, null, '\t'));
        //console.log("Ancestor: " + output.ancestor);
        if (currentancestor){
            currentancestorn = FitchCalculator.treeops.getNodeIndex(currenttree, currentancestor);
            if (currentancestorn < 0){
                currentancestorn = 0;
            }
        }else{
            currentancestorn = 0;
        }
        currentancestor = FitchCalculator.treeops.findNthNode(output.tree, currentancestorn);
	if (currentancestor){
            createAncestorRow(currentancestor.stringancestor);
        }else{
            createAncestorRow(output.ancestor);
        }
        $('#stats-matches').text(output.info['match']);
        $('#stats-gapexts').text(output.info['gap_ext']);
        $('#stats-mismatches').text(output.info['mismatch']);
        $('#stats-gaps').text(output.info['gap_open']);
        $('#scores-score').text(output.score);
        sb.setScore(output.score);
        if (output.score > bestscore){
            $('#scores-best').text(output.score);
            bestscore = output.score;
            
            var str = localStorage.getItem(args['id'] + "-Best");
            if ((str && JSON.parse(str).score < bestscore) ||
		!str){
                var state = getCurrentState();
                console.log(state);
                localStorage.setItem(args['id'] + "-Best", JSON.stringify(state));
                bc.setScoreForState("Best", state.score);
            }
        }
        currenttree = output.tree;
        //folder.setSeqs(seqs);
        //var ret = folder.score();
        //var diff = folder.diffOriginal(ret.fold);
        //msg.println("Score: " + ret.score + ", Diff: " + diff.difference + ", Extra" + diff.extra + ", Missing: " + diff.missing);
        //msg.println(original);
        //msg.println(ret.fold);
        //createFold(parseFoldOutput(ret.fold));
        pos.redraw = true;
        globalredraw.fitch = true;
    }
}

function createAncestorRow(ancestor){
    var parsed = new Array();
    var arow = new Array();
    var j;
    var k;
    for (j = 0, k = 0; j < ancestor.length; j++, k++){
        switch(ancestor.charAt(j)){
            case 'A':
                parsed[k] = {id:0, colCount:j};
                break;
            case 'U':
            case 'T':
                parsed[k] = {id:1, colCount:j};
                break;
            case 'C':
                parsed[k] = {id:2, colCount:j};
                break;
            case 'G':
                parsed[k] = {id:3, colCount:j};
                break;
            default:
                k--;
        }
    }
    
    for (j = 0; j < parsed.length; j++){
        if (parsed[j].id > 3){
            continue;
        }
        arow[j] = new Array();
        arow[j].row = V_ANCESTOR_ROW;
        arow[j].left = parsed[j].colCount * G_W;
        arow[j].top = V_ANCESTOR_ROW * G_H;
        arow[j].redraw = true;
        arow[j].kind = parsed[j].id;
    }
    ancestorpos = arow;
}

function parseFoldOutput(fold){
    var parsedFold = new Array();
    var stack = new Array();
    for (var i = 0, j = 0; i < fold.length; i++){
        switch(fold.charAt(i)){
            case '<':
                stack.push(i);
                break;
            case '>':
                parsedFold[j++] = {'0': stack.pop(), '1':i};
                break;
            default:
                break;
        }
    }
    parsedFold.sort(function(a,b){return a[0] - b[0];});
    return parsedFold;
}

// closure handling mouse events to allow dragging
function setDrag(){
    var currentBox = null;
    var clickX = 0;
    var clickY = 0;
    var isMouseDown = false;
    var mode = "";
    var draggedrow = 0;
    var draggedrowpos = 0;
    var oldancestor;
    
    $(document).mousedown(function(e){
        console.log(mode);
        if (mode != "select"){
            var offset = $(canvas).offset();
            var x = (e.pageX-offset.left) - S_MINX;
            var y = (e.pageY-offset.top) - S_MINY;
            var row = ~~(y / G_H);
            currentBox = null;
            isMouseDown = true;
            if (row != V_ANCESTOR_ROW){  // currently row 8 specially reserved for ancestor
                if (row >= 0 && row < pos.length){
                    for (var i = 0; i < pos[row].length; i++){
                        if (pos[row][i].left + G_W > x && pos[row][i].left < x){
                            currentBox = pos[row][i];
                            currentBox.drag = true;
                            clickX = x - pos[row][i].left;
                            if (multisel){
                                multisel.x = x;
                                multisel.y = y;
                                for (i = 0; i < pos.length; i++){
                                    for (var j = 0; j < pos[i].length; j++){
                                        if (pos[i][j].selected){
                                            pos[i][j].drag = true;
                                            pos[i][j].oldleft = pos[i][j].left;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                if (currentBox == null){
                    // dragging the background
                    clickX = x;
                }
                mode = "main";
            }else{  // mouse down on ancestor row
                // find the box that mouse is over
                // Determine the box the mouse is over, and display the change div
                $('#ancestor-selection-box')
                    .css({
                        top: V_ANCESTOR_ROW * G_H + offset.top - B_W, 
                        left: (~~(x / G_W) * G_W) + offset.left + S_MINX - B_W
                    })
                    .show();
                mode = "ancestor-change";
            }
        }
    });

    $(document).mouseup(function(e){
        isMouseDown = false;
        switch(mode){
        case "main":
            // will be null if this is a drag on the background to move
            if (currentBox != null){
                currentBox.drag = false;
                if (!multisel){
                    finalize(currentBox.row);
                }else{
                    for (var i = 0; i < pos.length; i++){
                        finalize(i);
                    }
                }
                resetOverrideTree();
                currentBox = null;
            }else{
                for (var i = 0; i < pos.length; i++){
                    for (var j = 0; j < pos[i].length; j++){
                        pos[i][j].selected = false;
                        pos[i][j].drag = false;
                    }
                }
                multisel = null;
                mode = "";
                pos.redraw = true;
            }
            break;
        case "viewport":
            S_MINX = ~~S_MINX;
            vp.redraw = true;
            pos.redraw = true;
            break;
        case "select":
            $('#selection-box').hide();
            multisel.state = "selected";
            mode = "";
            break;
        case "ancestor-change":
            var location = ancestorGetDistances(e.pageX, e.pageY);
            var offset = $(canvas).offset();
            var seloffset = $('#ancestor-selection-box').offset();
            $('#ancestor-selection-box').hide();
            var arr = {'top': 1, 'left': 0, 'bottom': 3, 'right': 2};
            var value;
            if (location[location.dir] > 0.7){
                value = arr[location.dir];
            }else{
                value = 4;
            }
            setOverride(currentancestor, ~~((seloffset.left - offset.left - S_MINX + G_W) / G_W), value);
            fitchrecalcneeded = true;
            oldancestor = null;
            mode = "";
            break;
        }
    });
    
    $(document).mousemove(function(e){
        if (e.which === 0){
            isMouseDown = false;
        }
        if (isMouseDown){
            switch (mode){
            case "main":
                if (currentBox != null){
                    var x = (e.pageX-$(canvas).offset().left);
                    if (!multisel){
                        currentBox.left = x - S_MINX - clickX;
                    }else{
                        var diff = multisel.x + S_MINX - x;
                        for (var i = 0; i < pos.length; i++){
                            for (var j = 0; j < pos[i].length; j++){
                                if (pos[i][j].selected){
                                    pos[i][j].left = pos[i][j].oldleft - diff;
                                }
                            }
                        }
                        pos.redraw = true;
                    }
                    /*
                    if (x < V_LMOVE && S_MINX > -(S_W - V_RMOVE)){
                        S_MINX -= 1;
                    }else if (x > V_W - V_LMOVE && S_MINX < 0){
                        S_MINX += 1;
                    }
                    */
                    fitchrecalcneeded = true;
                    recalc();
                }else{
                    var x = (e.pageX-$(canvas).offset().left);
                    S_MINX = -(clickX - x);
                    S_MINX = Math.min(Math.max(-S_W + V_W, S_MINX), 0);
                    VP_VP_LEFT = -(S_MINX / G_W * VP_B_W);
                    pos.redraw = true;
                }
                break;
            case "ancestor-change":
                var offset = $(canvas).offset();
                var x = (e.pageX-offset.left) - S_MINX;
                var y = (e.pageY-offset.top) - S_MINY;
                ancestorSetBorderColours(ancestorGetDistances(e.pageX, e.pageY));
                break;
            case "viewport":
                //console.log("viewport drag");
                var x = (e.pageX-$(viewport).offset().left);
                VP_VP_LEFT = Math.min(Math.max(0, x - VP_VP_W / 2), VP_W - VP_VP_W);
                S_MINX = -(VP_VP_LEFT / VP_B_W * G_W);

                vp.redraw = true;
                pos.redraw = true;
                break;
            }
        }else{
            switch(mode){
            case "select":
                if (multisel.state == "start"){
                    multisel.p2.x = e.pageX;
                    multisel.p2.y = e.pageY;
                    var top = multisel.p1.y > multisel.p2.y ? multisel.p2.y : multisel.p1.y;
                    var left = multisel.p1.x > multisel.p2.x ? multisel.p2.x : multisel.p1.x;
                    var width = Math.abs(multisel.p1.x - multisel.p2.x);
                    var height = Math.abs(multisel.p1.y - multisel.p2.y);
                    var offset = $(canvas).offset();
                    var fromrow = ~~((top - offset.top - S_MINY) / G_H);
                    var torow = ~~((top + height - offset.top - S_MINY) / G_H);
                    currentBox.offset({top: top, left: left}).width(width).height(height);
                    for (var i = 0; i < pos.length; i++){
                        for (var j = 0; j < pos[i].length; j++){
                            pos[i][j].selected = false;
                        }
                    }
                    for (var i = ((fromrow >= 0) ? fromrow : 0); 
                        i < pos.length && i <= torow; i++){
                        var j;
                        for (j = 0; j < pos[i].length; j++){
                            if (pos[i][j].left + offset.left + S_MINX + G_W > left){
                                break;
                            }
                        }
                        for (; j < pos[i].length && pos[i][j].left + offset.left + S_MINX < width + left; j++){
                            pos[i][j].selected = true;
                        }
                    }
                    pos.redraw = true;
                }
                break;
            }
        }
    });
    
    $(document).dblclick(function(e){
        if (multisel){
            for (var i = 0; i < pos.length; i++){
                for (var j = 0; j < pos[i].length; j++){
                    pos[i][j].selected = false;
                    pos[i][j].drag = false;
                }
            }
            multisel = null;
            mode = "";
            pos.redraw = true;
        }else{
            currentBox = $('#selection-box').show().offset({top: e.pageY, left:e.pageX}).width(0).height(0);
            mode = 'select';
            multisel = {state: 'start', p1: {x: e.pageX, y: e.pageY}, p2: {x: e.pageX, y: e.pageY}};
        }
    });
    
    $(viewport).mousedown(function(e){
        if (mode != "select"){
            var x = (e.pageX-$(viewport).offset().left);
            isMouseDown = true;
            clickX = x;
            mode = "viewport";
            return false;
        }
    });
    
    $(tcanvas).mousemove(function(e){
        var find = function rec(tree, x, y){
            if (tree instanceof Object && tree[0] != undefined){
                if (tree.ancestorlocation
                    && tree.ancestorlocation.left < x 
                    && tree.ancestorlocation.left + tree.ancestorlocation.width > x
                    && tree.ancestorlocation.top < y
                    && tree.ancestorlocation.top + tree.ancestorlocation.height > y){
                    return tree;
                }else{
                    var r = rec(tree[0], x, y);
                    if (r != null){
                        return r;
                    }
                    r = rec(tree[1], x, y);
                    return r;
                }
            }else{
                return null;
            }
        }
        var find2 = function rec(tree, x, y){
            FitchCalculator.treeops.findNode(tree, function(node){
                return node.ancestorlocation
                        && node.ancestorlocation.left < x 
                        && node.ancestorlocation.left + node.ancestorlocation.width > x
                        && node.ancestorlocation.top < y
                        && node.ancestorlocation.top + node.ancestorlocation.height > y;
            });
        }
        var offset = $(tcanvas).offset();
        var found = find(currenttree, e.pageX - offset.left, e.pageY - offset.top);

        if (found != null){
            if (found != currentancestor){
                oldancestor = currentancestor;
                currentancestor = found;
                drawTree(tctx);
                createAncestorRow(currentancestor.stringancestor);
                pos.redraw = true;
            }
        }else{
            if (currentancestor != oldancestor && oldancestor != null){
                currentancestor = oldancestor;
                drawTree(tctx);
                createAncestorRow(currentancestor.stringancestor);
                pos.redraw = true;
            }
            oldancestor = null;
        }
    });
    
    $(tcanvas).mousedown(function(e){
        oldancestor = currentancestor;
    });
}

function setOverride(node, changelocation, changevalue){
    var find = function rec(tree, followtree, node){
        if (tree instanceof Object && tree[0] != undefined){
            if (node == tree){
                return followtree;
            }else{
                var r = rec(tree[0], followtree[0], node);
                if (r != null){
                    return r;
                }
                r = rec(tree[1], followtree[1], node);
                return r;
            }
        }else{
            return null;
        }
    }
    console.log(changelocation, changevalue);
    var overridenode = find(currenttree, overridetree, node);
    if (overridenode != null){
        overridenode.value[changelocation] = changevalue;
    }
}

function resetOverrideTree(){
    var seqLength = FitchCalculator.seqLength(originaltree)+20;
    
    var fill = function rec(tree, length){
        if (tree instanceof Object && tree[0] != undefined){
            rec(tree[0], length);
            rec(tree[1], length);
            tree.value = new Array(length);
        }
	else if (tree instanceof Object){
	    tree.value = new Array(length);
	}
    }
    var seqs = new Array(pos.length);
    overridetree = FitchCalculator.buildTree(originaltree,seqs);
    fill(overridetree, seqLength);
    overridetree.set = false;
}

function ancestorGetDistances(x, y){
    var offset = $('#ancestor-selection-box').offset();
    var cx = offset.left + B_W * 1.5;
    var cy = offset.top + B_H * 1.5;
    var minDistance = 0.2;
    var maxDistance = 1;
    var output = {top: -0.2, left: -0.2, bottom: -0.2, right: -0.2};
    var dx = x - cx;
    var dy = y - cy;
    var angle = -(Math.atan2(dy, dx));
    var distance = Math.min(Math.max(Math.sqrt(dx * dx + dy * dy) / (B_W * 2), minDistance), maxDistance);
    if (Math.abs(angle) < Math.PI / 4){ // right
        output.right = 1;
        output.dir = 'right';
    }else if (Math.abs(angle) > Math.PI * 0.75){    // left
        output.left = 1;
        output.dir = 'left';
    }else if (angle > 0){   // top
        output.top = 1;
        output.dir = 'top';
    }else{              // bottom
        output.bottom = 1;
        output.dir = 'bottom';
    }
    output.top = output.top * distance + 0.4;
    output.left = output.left * distance + 0.4;
    output.right = output.right * distance + 0.4;
    output.bottom = output.bottom * distance + 0.4;
    //console.log(output.dir, output['top']);
    return output;
}

function ancestorSetBorderColours(directions){
    $('#ancestor-selection-box').css({
        'border-top-color': B_COLOUR_A[0] + directions.top + ')',
        'border-left-color': B_COLOUR_A[1] + directions.left + ')',
        'border-bottom-color': B_COLOUR_A[2] + directions.bottom + ')',
        'border-right-color': B_COLOUR_A[3] + directions.right + ')'
    });
}

// closure handling mouse events to allow dragging of viewport
function setViewportDrag(){
    //var clickX = 0;
    //var isMouseDown = false;
}

function createRow(row, top, sequence) {
    if (args['rand'] != undefined){
        var rowPos = generateRandomRowPositions(sequence.length, S_W - G_W);
    }
    for (var j = 0; j < sequence.length; j++){
        if (sequence[j].id > 3){
            continue;
        }
        pos[row][j] = new Array();
        pos[row][j].row = row;
        if (args['rand']){
            pos[row][j].left = S_MINX + rowPos[j];
        }else{
            pos[row][j].left = sequence[j].colCount * G_W;
        }
        pos[row][j].top = top;
        pos[row][j].redraw = true;
        pos[row][j].kind = sequence[j].id;
    }
}
function generateRandomRowPositions(count, maxWidth) {
    var ret = new Array();
    for (var i = 0; i < count; i++){
        ret[i] = Math.floor(Math.random() * maxWidth);
    }
    ret = ret.sort(function(a,b){return a - b;});
    return ret;
}
function finalize(row) {
    for (var j = 0; j < pos[row].length; j++){
        pos[row][j].left = ~~((pos[row][j].left + (G_W/2)) / G_W) * G_W;
        pos[row][j].redraw = true;
    }
}
function recalc() {
    var afterDrag = false;
    var prevPos = 0;
    var i, j;
    for (i = 0; i < pos.length; i++){
        // pushing to the left
        afterDrag = false;
        prevPos = S_W;
        for (j = pos[i].length - 1; j >= 0; j--){
            if (pos[i][j].drag){
                afterDrag = true;
                pos[i][j].redraw = true;
            }else{
                if (afterDrag){     
                    if (pos[i][j].left > prevPos - G_W){
                        pos[i][j].left = prevPos - G_W;
                        pos[i][j].redraw = true;
                    }
                }
            }
            prevPos = pos[i][j].left;
        }
        // pushing to the right
        afterDrag = false;
        prevPos = -G_W;
        for (j = 0; j < pos[i].length; j++){
            if (pos[i][j].drag){
                afterDrag = true;
                pos[i][j].redraw = true;
            }else{
                if (afterDrag){
                    if (pos[i][j].left < prevPos + G_W){
                        pos[i][j].left = prevPos + G_W;
                        pos[i][j].redraw = true;
                    }
                }
            }
            prevPos = pos[i][j].left;
        }
        // fix left side
        afterDrag = false;
        prevPos = -G_W;
        for (j = 0; j < pos[i].length; j++){
            if (pos[i][j].left < prevPos + G_W){
                pos[i][j].left = prevPos + G_W;
                pos[i][j].redraw = true;
            }
            prevPos = pos[i][j].left;
        }
        // fix right side
        afterDrag = false;
        prevPos = S_W;
        for (j = pos[i].length - 1; j >= 0; j--){
            if (pos[i][j].left > prevPos - G_W){
                pos[i][j].left = prevPos - G_W;
                pos[i][j].redraw = true;
            }
            prevPos = pos[i][j].left;
        }
    }
}

function drawRow(ctx, j, h){
    for (var i = 0; i < pos[j].length; i++){
        // only draw visible boxes
        if (pos[j][i].left + S_MINX + B_XOFFSET >= -G_W && pos[j][i].left + S_MINX + B_XOFFSET + G_W <= V_W + G_W){
            if (!h){
                if (pos[j][i].selected){
                    ctx.fillStyle = B_COLOUR_S[pos[j][i].kind];
                }else{
                    ctx.fillStyle = B_COLOUR[pos[j][i].kind];
                }
                ctx.fillRect(pos[j][i].left + S_MINX + B_XOFFSET, pos[j][i].top + S_MINY + B_YOFFSET, B_W, B_H);
            }else{
                // highlight
                ctx.fillStyle = B_COLOUR_H[pos[j][i].kind];
                ctx.fillRect(pos[j][i].left + S_MINX + B_XOFFSET, pos[j][i].top + S_MINY + B_YOFFSET, B_W, B_H);
                ctx.strokeStyle = BS_COLOUR_H[pos[j][i].kind];
                ctx.strokeRect(pos[j][i].left + S_MINX + B_XOFFSET, pos[j][i].top + S_MINY + B_YOFFSET, B_W, B_H);
            }
        }
        pos[j][i].redraw = false;
    }
}

function drawAncestorRow(ctx, j){
    for (var i = 0; i < ancestorpos.length; i++){
        // only draw visible boxes
        if (ancestorpos[i].left + S_MINX + B_XOFFSET >= -G_W && ancestorpos[i].left + S_MINX + B_XOFFSET + G_W <= V_W + G_W){
            ctx.fillStyle = B_COLOUR[ancestorpos[i].kind];
            ctx.fillRect(ancestorpos[i].left + S_MINX + B_XOFFSET, ancestorpos[i].top + S_MINY + B_YOFFSET, B_W, B_H);
        }
        ancestorpos[i].redraw = false;
    }
}

/**
Draw function for the page.
Responsible for drawing both the Main canvas with context ctx and the viewport canvas with context vctx.
 */
function draw(){
    if (resizeinfo.resize){
        canvas.width = resizeinfo.canvas_width;
        viewport.width = resizeinfo.viewport_width;
        resizeinfo.resize = false;
        pos.redraw = true;
    }
    if (pos.redraw){
        // the whole thing needs a redraw
        // clear the bg without disturbing the transformation matrix
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        generateGrid(ctx);
        
        for (var j = 0; j < pos.length; j++){
            drawRow(ctx, j);
        }
        drawAncestorRow(ctx);
        
        pos.redraw = false;
        drawViewport(true);
    }else{
        // just some elements need redraw
        var redraw = false;
        // clear necessary backgrounds
        ctx.save();
        for (var j = 0; j < pos.length; j++){
            var i;
            for (i = 0; i < pos[j].length && !pos[j][i].redraw; i++){};
            if (i < pos[j].length){
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, G_H * j + S_MINY, V_W, G_H);
                redraw = true;
                pos[j].redraw = true;
            }
        }
        ctx.restore();
        
        if (redraw){
            generateGrid(ctx);
            for (var j = 0; j < pos.length; j++){
                // only draw rows with changes
                if (pos[j].redraw){
                    for (var i = 0; i < pos[j].length; i++){
                        // only draw visible boxes
                        if (pos[j][i].left + S_MINX + B_XOFFSET >= -G_W && pos[j][i].left + S_MINX + B_XOFFSET + G_W <= V_W + G_W){
                            if (pos[j][i].selected){
                                ctx.fillStyle = B_COLOUR_S[pos[j][i].kind];
                            }else{
                                ctx.fillStyle = B_COLOUR[pos[j][i].kind];
                            }
                            ctx.fillRect(pos[j][i].left + S_MINX + B_XOFFSET, pos[j][i].top + S_MINY + B_YOFFSET, B_W, B_H);
                        }
                        pos[j][i].redraw = false;
                    }
                    pos[j].redraw = false;
                }
            }
            drawAncestorRow(ctx);
            drawViewport(true);
        }else{
            drawViewport(false);
        }
    }
    if (globalredraw.fitch){
        drawTree(tctx);
        globalredraw.fitch = false;
    }
}

function drawViewport(redraw){
    if (redraw || vp.redraw){
        {
            // clear the bg without disturbing the transformation matrix
            vctx.save();
            vctx.setTransform(1, 0, 0, 1, 0, 0);
            vctx.clearRect(0, 0, viewport.width, viewport.height);
            vctx.restore();
        }

        //generateGrid(vctx);
        var left = 0;
        for (var j = 0; j < pos.length; j++){
            for (var i = 0; i < pos[j].length; i++){
                vctx.fillStyle = B_COLOUR[pos[j][i].kind];
                left = ~~(pos[j][i].left / G_W)
                vctx.fillRect(left * VP_B_W, j * VP_B_H, VP_B_W, VP_B_H);
            }
        }

        // draw overlay
        vctx.fillStyle = VP_OVERLAY_COLOUR;
        vctx.fillRect(0, 0, VP_VP_LEFT, VP_VP_H);
        vctx.fillRect(VP_VP_LEFT + VP_VP_W, 0, VP_W - VP_VP_LEFT - VP_VP_W, VP_VP_H);
        vctx.strokeStyle = VP_BORDER_COLOUR;
        vctx.lineWidth = VP_BORDER_WIDTH;
        vctx.strokeRect(VP_VP_LEFT, 0, VP_VP_W, VP_VP_H);
        
        vp.redraw = false;
    }
}

function generateGrid(ctx) {
    ctx.beginPath();
    // horizontal lines
    for (var i = 0; i <= G_ROW; i++){
        ctx.moveTo(-0.5, S_MINY + i * G_H + 0.5);
        ctx.lineTo(V_W + 0.5, S_MINY + i * G_H + 0.5);
    }
    // vertical lines
    var limit = ~~(V_W / G_W) + 1;
    for (var j = 0; j <= limit; j++){
        ctx.moveTo((S_MINX % G_W) + j * G_W + 0.5, S_MINY + 0.5);
        ctx.lineTo((S_MINX % G_W) + j * G_W + 0.5, S_MINY + G_ROW * G_H - 1 + 0.5);
    }
    /* Draw according to G_COL
    // horizontal lines
    for (var i = 0; i <= G_ROW; i++){
        ctx.moveTo(S_MINX + 0.5, S_MINY + i * G_H + 0.5);
        ctx.lineTo(S_MINX + G_COL * G_W - 1 + 0.5, S_MINY + i * G_H + 0.5);
    }
    // vertical lines
    for (var j = 0; j <= G_COL; j++){
        ctx.moveTo(S_MINX + j * G_W + 0.5, S_MINY + 0.5);
        ctx.lineTo(S_MINX + j * G_W + 0.5, S_MINY + G_ROW * G_H - 1 + 0.5);
    }
    */
    ctx.lineWidth = 1;
    ctx.strokeStyle = G_COLOUR;
    ctx.stroke();
    ctx.closePath();
}

function drawTree(ctx){
    var trace = function rec(tree, out, count){
        if (tree instanceof Object && tree[0] != undefined){
            var depth = 0;
            out[0] = {};
            out[1] = {};
            var r0 = rec(tree[0], out[0], count);
            var r1 = rec(tree[1], out[1], count);
            depth = Math.max(r0.depth, depth);
            depth = Math.max(r1.depth, depth);
            out.depth = depth + 1;
            out.height = (r0.height + r1.height) / 2;
            out.from = r0.height;
            out.to = r1.height;
            out.node = tree;
            return out;
        }else{
            out.depth = 0;
            out.height = count[0];
            count[0] += 1;
            return out;
        }
    }
    
    var walkTreeImages = function rec(tree, count){
        if (tree instanceof Object && tree[0] != undefined){
            // recurse on the other 2 braches
            count = rec(tree[0], tree.depth, count);
            count = rec(tree[1], tree.depth);
        }else{
            // draw images
            ctx.drawImage(T_IMAGES[count],
                        0,      // sx
                        0,      // sy
                        T_IMAGES[count].width,      // sw
                        T_IMAGES[count].height,
                        T_W - 30,       // dx
                        T_TOP + ~~(tree.height * T_SIZE_V) - T_IMAGES_DRAW_H / 2,
                        T_IMAGES_DRAW_W,    // dw
                        T_IMAGES_DRAW_H
                    );
        }
        return count + 1;
    }
    
    var walkTreeSkeleton = function rec(tree, parentdepth){
        if (tree instanceof Object && tree[0] != undefined){
            // recurse on the other 2 braches
            rec(tree[0], tree.depth);
            rec(tree[1], tree.depth);
            // draw vertical line
            ctx.moveTo(T_W - (tree.depth * T_SIZE_H + T_RIGHT), T_TOP + ~~(tree.from * T_SIZE_V));
            ctx.lineTo(T_W - (tree.depth * T_SIZE_H + T_RIGHT), T_TOP + ~~(tree.to * T_SIZE_V));
            // draw horizontal line
            ctx.moveTo(T_W - (tree.depth * T_SIZE_H + T_RIGHT), T_TOP + ~~(tree.height * T_SIZE_V));
            ctx.lineTo(T_W - ((parentdepth) * T_SIZE_H + T_RIGHT), T_TOP + ~~(tree.height * T_SIZE_V));
        }else{
            // draw horizontal line
            ctx.moveTo(T_W - (tree.depth * T_SIZE_H + T_RIGHT), T_TOP + ~~(tree.height * T_SIZE_V));
            ctx.lineTo(T_W - ((parentdepth) * T_SIZE_H + T_RIGHT), T_TOP + ~~(tree.height * T_SIZE_V));
        }
    }
    
    var walkTreeBoxes = function rec(tree, selected){
        if (tree instanceof Object && tree[0] != undefined){
            // recurse on the other 2 braches
            rec(tree[0], selected);
            rec(tree[1], selected);
            // draw box for clicking
            if ((!selected && tree.node != currentancestor) ||
                (selected && tree.node == currentancestor)){
                ctx.rect(T_W - (tree.depth * T_SIZE_H + T_RIGHT) - T_ANCESTOR_BUTTON_W / 2,
                        T_TOP + ~~(tree.height * T_SIZE_V) - T_ANCESTOR_BUTTON_H / 2, 
                        T_ANCESTOR_BUTTON_W,
                        T_ANCESTOR_BUTTON_H);
            }
            tree.node.ancestorlocation = {
                                    'top': (T_TOP + ~~(tree.height * T_SIZE_V) - T_ANCESTOR_BUTTON_W / 2), 
                                    'left': (T_W - (tree.depth * T_SIZE_H + T_RIGHT) - T_ANCESTOR_BUTTON_W / 2), 
                                    'width': T_ANCESTOR_BUTTON_W, 
                                    'height': T_ANCESTOR_BUTTON_H
                                };
        }
    }
    
    var walkTreeScore = function rec(tree){
        if (tree instanceof Object && tree[0] != undefined){
            // recurse on the other 2 braches
            rec(tree[0]);
            rec(tree[1]);
            var strscore;
            if (tree.node.score > 0){
                strscore = "+" + tree.node.score;
            }else{
                strscore = "" + tree.node.score;
            }
            // draw text
            ctx.fillText(strscore, T_W - (tree.depth * T_SIZE_H + T_RIGHT) - 3, T_TOP + ~~(tree.height * T_SIZE_V));
        }
    }

    var tracedtree = {};
    trace(currenttree, tracedtree, [0]);
    
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, tcanvas.width, tcanvas.height);
    ctx.restore();
    
    // draw background
    //      grid
    var grad = ctx.createLinearGradient(T_W, 0, T_W - T_BACKGROUND_GRID_W, 0);
    grad.addColorStop(0, G_COLOUR);
    grad.addColorStop(1, G_COLOUR_A);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i <= G_ROW; i++){   // horizontal
        ctx.moveTo(T_W - T_BACKGROUND_GRID_W + 0.5, i * G_H + 0.5);
        ctx.lineTo(T_W + 0.5, i * G_H + 0.5);
    }
    ctx.closePath();
    ctx.stroke();
    
    walkTreeImages(tracedtree, 0);
    
    // ancestor text
    ctx.font = "12px sans-serif";
    ctx.textBaseline = 'middle';
    ctx.textAlign = "right";
    ctx.fillStyle = T_COLOUR;
    ctx.fillText("Ancestor", T_W - 5, G_H * V_ANCESTOR_ROW + G_H / 2);
    
    // tree skeleton
    ctx.fillStyle = T_COLOUR;
    ctx.strokeStyle = T_COLOUR;
    ctx.beginPath();
    walkTreeSkeleton(tracedtree, 8);
    ctx.closePath();
    ctx.lineWidth = T_THICKNESS;
    ctx.lineCap = "square";
    ctx.stroke();
    ctx.fill();
    
    ctx.fillStyle = T_COLOUR;
    ctx.beginPath();
    walkTreeBoxes(tracedtree, false);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = T_COLOUR_S;
    ctx.beginPath();
    walkTreeBoxes(tracedtree, true);
    ctx.closePath();
    ctx.fill();
    
    if (args['ui_showscore']){
        ctx.font = "10px sans-serif";
        ctx.textBaseline = 'bottom';        // set baseline to bottom for less calculation
        ctx.textAlign = "right";
        ctx.fillStyle = T_COLOUR;
        walkTreeScore(tracedtree);
    }
}
