$(window).resize(function(){
    var width = $(window).width() * 0.8 - T_W - BC_W;
    if (width > SIZE_MAX_WIDTH){
        width = SIZE_MAX_WIDTH;
    }else if (width < SIZE_MIN_WIDTH){
        width = SIZE_MIN_WIDTH;
    }
    
    V_W = width;	// viewer width
    
    // viewport
    VP_W = width + T_W + BC_W;	// viewer width

    VP_B_W = VP_W / G_COL;
    
    SB_W = VP_W;
    VP_VP_W = VP_B_W * (V_W / G_W);
    
    resizeinfo.resize = true;
    resizeinfo.canvas_width = width;
    resizeinfo.viewport_width = width + T_W + BC_W;
    resizeinfo.scorebar_width = SB_W;
    
    if(sb){
        sb.draw();
    }
});

function resizeBoxes(boxsize){
    if (canvas){
        for (var i = 0; i < pos.length; i++){
            for (var j = 0; j < pos[i].length; j++){
                pos[i][j].top = Math.round(pos[i][j].top / G_H) * (boxsize + G_BORDER_SIZE);
                pos[i][j].left = Math.round(pos[i][j].left / G_W) * (boxsize + G_BORDER_SIZE);
            }
        }
    }
    
    B_W = B_H = boxsize;
    T_SIZE_V = G_W = G_H = boxsize + G_BORDER_SIZE;
    BC_BUTTON_H = G_W - 2;
    //BC_BUTTON_W = ~~(1.5 * BC_BUTTON_H);
    T_H = BC_H = V_H = V_H = G_H * V_ROW;
    T_TOP = ~~(G_W / 2);
    VP_VP_W = VP_B_W * (V_W / G_W);
    
    $('#ancestor-selection-box')
        .width(G_W)
        .height(G_H)
        .css({
            "border-width": B_W + "px"
        });
    
    redrawEverything();
}

function redrawEverything(){
    if (canvas){
        recalc();
        for (i = 0; i < pos.length; i++){
            finalize(i);
        }
    
        tcanvas.height = canvas.height = V_H;

        var buttoncolumn = $("#buttoncolumn-area").unbind().get(0);
        buttoncolumn.width = BC_W;
        buttoncolumn.height = BC_H;
        bc = new ButtonColumn(buttoncolumn);
        bc.draw();

        pos.redraw = true;
        fitchrecalcneeded = true;
        recalcFitch();
        draw();
        drawTree(tctx);
    }
}

$(window).resize();
