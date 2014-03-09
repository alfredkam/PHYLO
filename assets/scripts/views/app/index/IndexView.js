define([
        //LIBRARIES
         "jquery",
         "underscore",
         "backbone",
         "marionette",
         //TEMPLATES
         "text!tpl/app/index/Index.mustache",
         //this one is the jquery one
         "scripts/views/validation/cookie.validation"

], function(
        $, _, Backbone, Marionette,
        tpl
) {
     var IndexView = Marionette.ItemView.extend({
         initialize : function(options) {
            this.lang = options.lang || {};
            this.langKey = options.langKey || "EN";
         },
         template : tpl,
         moveQueue : [],
         currMove : 0,
         currScore:0,
         queueSize: 6,
         geneTree:{},
         events:{
            "click #volume i":"toggleVolume",
            "newMove #moveListener":"newMove",
            "newGame #moveListener" : "newGame",
            "undoMove #moveListener" :"undoMove",
            "redoMove #moveListener" : "redoMove",
            "showTut #moveListener" : "showTut",
            "newStage #moveListener" :"newStage"
         },
         showTut : function(e){
            var langKey = this.langKey;
            cookie.create("hasPlayed",true,365000000);
            bootbox.dialog({
                message:"Would you like to try out our tutorial?",
                title:"",
                buttons:{
                    success:{
                        label:"Okay!",
                        className:"btn-success",
                        callback: function(){
                            //console.log("dfdf");
                            window.location = "#!/"+langKey+"/Tutorial";
                        }
                    },
                    cancel:{
                        label:"I know what I'm doing!",
                        className:"btn-danger"
                    }
                }
            })
         },
         newMove: function(e,move){
            //a function to detect new move if the vboard is diffrent from the old board
            //also pushes something the board to the queue as well.
            //will need to experiment on what size to limit the queue to
            if(DEBUG){
                console.log("move made :");
                console.log(move.seq);

            // if(this.currMove!=0){
            //     console.log(JSON.stringify(move));

            }
            //deep copy
            this.moveQueue[this.currMove] = $.extend(true,[],move.seq);
            this.currMove++;
            if(this.moveQueue.length>this.currMove){
                console.log("length reduced");
                this.moveQueue = this.moveQueue.slice(this.moveQueue.length-this.queueSize>0?this.moveQueue.length-this.queueSize:0,this.currMove);
                this.currMove  = this.moveQueue.length;

            }
            if(DEBUG){
                console.log(this.currMove);
            }
            //} 
            this.undoRedoButtonsStatus();
            // this.diffHighlighting();
            this.currScore = $.fitch.score();
            this.blockHL();
         },

         blockHL :function(){
            var tree = $.phylo.tree;
            var stage = this.moveQueue[this.currMove - 1]; //contains the div
            var stageVal = $.sequence.nucleotide;
            var lvl = $.stage.current;
            var groups = [];
            var top = [];
            for (k = 0; k < 25; k++) {
                //instead of all of the tree, we do a few
                groups[k] = []
                for (var i = 0; i <= lvl; i++) {
                    //tree[i].node1 gives the row
                    //stage[x] = gives the corresponding row array
                    //give us the div number
                    var n1 = stage[tree[i].node1][k];
                    var n2 = stage[tree[i].node2][k];
                    if (tree[i].child === 0) {
                        // if (stageVal[n1] === stageVal[n2]) {
                        //     // $("#"+n1).addClass("hl"+col);
                        //     // $("#"+n2).addClass("hl"+col);
                        //     groups[k][i] = [stageVal[n1]];
                        // } else {
                        groups[k][i] = [stageVal[n1], stageVal[n2]];
                        // }

                    } else if (tree[i].child === 1) {
                        //n1 is the leave
                        groups[k][i] = $.extend(true,[],groups[k][tree[i].node2]);
                        groups[k][i] = _.union([stageVal[n1]],[groups[k][i]]);

                        
                    } else {
                        //merge the two together
                        groups[k][i] = _.union([groups[k][tree[i].node1]], [groups[k][tree[i].node2]]);
                    }
                }
            }
            console.log(top);
            console.log(groups);
            var visited={};
            var tops = this.getTops(lvl,stage);

        },
        getTops : function(lvl){
            //int lvl, $.phylo.tree stage
            // console.log(stage);
            var stage = $.phylo.tree;
            var findTop = function(node,depth,stage){
                var top =0;
                for (var i = 0; i <= lvl; i++) {
                    if ((stage[i].node1 === node || stage[i].node2 === node)) {
                        if (depth > stage[i].depth) {
                            depth = stage[i].depth;
                            top = i;
                            console.log(i,node,depth,lvl);

                            i = 0; //not sure how the tree is made
                        }
                        else if(depth===stage[i].depth){
                            top=i;
                        }
                    }
                }
                return {depth:depth,top:top};
            }
            var top ={};
            for(var i=0;i<=lvl;i++){
                var t1= findTop(stage[i].node1,stage[i].depth,stage);
                console.log(t1);
                var t2= findTop(stage[i].node2,stage[i].depth,stage);

                console.log(t2);
                top[t1.depth<t2.depth?t1.top:t2.top]=true;
                console.log(t1.deth<t2.depth?t1.top:t2.top);

            }

            console.log(top);

            return top;

        },
         newGame : function(){
            //quick reset for the move queue and position holder
            this.currMove = 0;
            this.moveQueue = [];
         },
         undoMove: function(){
            if(DEBUG){

                console.log(this.currMove);
            }

            if(this.currMove-2<0){
                return;
            }
            // console.log(this.currMove-2, this.moveQueue[this.currMove-2]);
            
            $.helper.copy($.sequence.track, this.moveQueue[this.currMove-2]);
            var score = $.fitch.score();
            $.board.score(score);
            $.physics.snapRandom();
            if ($.phylo.bestScore >= $.sequence.par)
                $.board.approve();
            $.board.stats();
            this.currMove--;
            this.undoRedoButtonsStatus();
            this.currScore = $.fitch.score();

        },
         redoMove: function(){
            if(DEBUG){

                console.log(this.currMove);
            }
            if(this.currMove+1>this.moveQueue.length){
                return;
            }
            // console.log(this.currMove, this.moveQueue[this.currMove]);

            $.helper.copy($.sequence.track, this.moveQueue[this.currMove]);
            var score = $.fitch.score();
            $.board.score(score);
            $.physics.snapRandom();
            if ($.phylo.bestScore >= $.sequence.par)
               $.board.approve();
           $.board.stats();
           this.currMove++;
           this.undoRedoButtonsStatus();
           this.currScore = $.fitch.score();
         },
         //a function to use so the buttons are in the right state
         undoRedoButtonsStatus : function(){
            //redo button
            if(this.currMove+1>this.moveQueue.length){
                $("#redo").removeClass("on");
            }
            else{
                $("#redo").addClass("on");
            }
            if(this.currMove-2<0){
                $("#undo").removeClass("on");
            }
            else{
                $("#undo").addClass("on");

            }
         },
         toggleVolume: function(e){
            var vol=0;
            if($(e.target).hasClass("icon-volume-up-1")){
                $(e.target).removeClass("icon-volume-up-1").addClass("icon-volume-off-1");
            }
            else{
                vol=1;

                $(e.target).addClass("icon-volume-up-1").removeClass("icon-volume-off-1");
            }
            var cusEvent = jQuery.Event( {type:"mute",  vol: vol } );
            $("#muteBtn").trigger(cusEvent);
            return false;
         },
         diffHighlighting : function(){
            if(this.currMove<=1){
                return;
            }
            var score = $.fitch.score();
            var lightCol = this.currScore<score?"rgba(33, 127, 29, 0.35)":"rgba(127, 29, 29, 0.35)";
            lightCol = score==this.currScore?"white":lightCol;
            $("#postMove").css("background-color",lightCol);
            var newMove = this.moveQueue[this.currMove-1];
            var oldMove = this.moveQueue[this.currMove-2];
            var len = oldMove.length;
            $("#postMove").html("");
            for(var i=0;i<len;i++){
                for(var j=0;j<oldMove[i].length;j++){
                    if(newMove[i][j]!=oldMove[i][j] && oldMove[i][j]!=="x"){
                        // console.log(i+":"+j+","+newMove[i][j]+"+"+oldMove[i][j]);
                        var d = document.createElement("div");
                        $(d).addClass($("#"+oldMove[i][j]).attr("class")+" nonSequence").removeClass("sequence").removeClass("highlighter-2");
                        $(d).attr("style","left: "+j*33+"px;");
                        $(d).appendTo($("#postMove"));
                    }
                }
            }
            this.lineHighlighting();
            return;
         },
         lineHighlighting : function(){
            var len = this.moveQueue[this.currMove-1].length;
            $(".glowTreeLine").removeClass("glowTreeLine");
            for(var i =0;i<len;i++){
                if(!$("#row"+i+" div.sequence").hasClass("highlighter-2")){
                    console.log(i);
                    $(".h"+i).addClass("glowTreeLine");
                    for(j=i+1;j<len;j++){
                        if (!$("#row"+j+" div.sequence").hasClass("highlighter-2")){
                            $("."+i+"v"+j).addClass("glowTreeLine");
                        }
                    }
                }
                //not sure if its worth it
            }
         },

     });
     return IndexView;
});
        
