/*
*
* PHYLO Distribution Build v3.1.0
* http://phylo.cs.mcgill.ca
*
* Copyright 2013 McGill university, Alfred Kam, Jerome Waldispuhl and other contributors
* Under McGill Human-Computing Developer Licence
* https://github.com/McGill-CSB/PHYLO/blob/master/McGill-LICENCE.txt
*
*/function resizeBoxes(a){if(canvas)for(var b=0;b<pos.length;b++)for(var c=0;c<pos[b].length;c++)pos[b][c].top=Math.round(pos[b][c].top/G_H)*(a+G_BORDER_SIZE),pos[b][c].left=Math.round(pos[b][c].left/G_W)*(a+G_BORDER_SIZE);B_W=B_H=a,T_SIZE_V=G_W=G_H=a+G_BORDER_SIZE,S_W=G_W*G_COL,BC_BUTTON_H=G_W-2,T_H=BC_H=V_H=V_H=G_H*V_ROW,T_TOP=~~(G_W/2),VP_VP_W=VP_B_W*(V_W/G_W),$("#ancestor-selection-box").width(G_W).height(G_H).css({"border-width":B_W+"px"}),redrawEverything()}function redrawEverything(){if(canvas){for(recalc(),i=0;i<pos.length;i++)finalize(i);tcanvas.height=canvas.height=V_H;var a=$("#buttoncolumn-area").unbind().get(0);a.width=BC_W,a.height=BC_H,bc=new ButtonColumn(a),bc.draw(),pos.redraw=!0,fitchrecalcneeded=!0,recalcFitch(),draw(),drawTree(tctx)}}$(window).resize(function(){var a=.8*$(window).width()-T_W-BC_W;a>SIZE_MAX_WIDTH?a=SIZE_MAX_WIDTH:SIZE_MIN_WIDTH>a&&(a=SIZE_MIN_WIDTH),V_W=a,VP_W=a+T_W+BC_W,VP_B_W=VP_W/G_COL,SB_W=VP_W,VP_VP_W=VP_B_W*(V_W/G_W),resizeinfo.resize=!0,resizeinfo.canvas_width=a,resizeinfo.viewport_width=a+T_W+BC_W,resizeinfo.scorebar_width=SB_W,sb&&sb.draw()}),$(window).resize();