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
            //if(DEBUG){
            console.log("move made :");
            console.log(move.seq);

            // if(this.currMove!=0){
            //     console.log(JSON.stringify(move));

            // }
            //deep copy
            this.moveQueue[this.currMove] = $.extend(true,[],move.seq);
            this.currMove++;
            //}            
         },
         newGame : function(){
            //quick reset for the move queue and position holder
            this.currMove = 0;
            this.moveQueue = [];
         },
         undoMove: function(){
            if(this.currMove-2<0){
                return;
            }
            console.log(this.currMove-2, this.moveQueue[this.currMove-2]);
            
            $.helper.copy($.sequence.track, this.moveQueue[this.currMove-2]);
                            var score = $.fitch.score();
                            $.board.score(score);
                            $.physics.snapRandom();
                            if ($.phylo.bestScore >= $.sequence.par)
                                $.board.approve();
                            $.board.stats()
            this.currMove--;
         },
         redoMove: function(){
            if(this.currMove+1>this.moveQueue.length){
                            return;
                        }
            console.log(this.currMove, this.moveQueue[this.currMove]);
                       
                       $.helper.copy($.sequence.track, this.moveQueue[this.currMove]);
                                       var score = $.fitch.score();
                                       $.board.score(score);
                                       $.physics.snapRandom();
                                       if ($.phylo.bestScore >= $.sequence.par)
                                           $.board.approve();
                                       $.board.stats();
                                       this.currMove++;
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
        
