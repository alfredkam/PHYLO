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
         },
         template : tpl,
         moveQueue : [],
         currMove : 0,
         queueSize: 6,
         events:{
            "click #volume i":"toggleVolume",
            "newMove #moveListener":"newMove",
            "newGame #moveListener" : "newGame",
            "undoMove #moveListener" :"undoMove",
            "redoMove #moveListener" : "redoMove"

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
     });
     return IndexView;
});
        
