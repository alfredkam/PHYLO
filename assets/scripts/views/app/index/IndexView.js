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
        initialize: function(options) {
            // this.lang = options.lang || {};
            this.langKey = options.langKey || "EN";
        },
        template: tpl,
        moveQueue: [],
        currMove: 0,
        // currScore: 0,
        queueSize: 6,
        geneTree: {},
        tutStages :["objective","penalty","tree","stage"],
        tutStage:0,
        events: {
            "click #volume i": "toggleVolume",
            "newMove #moveListener": "newMove",
            "newGame #moveListener": "newGame",
            "undoMove #moveListener": "undoMove",
            "redoMove #moveListener": "redoMove",
            "showTut #moveListener": "showTut",
            "newStage #moveListener": "newStage",
            "click .clickNext":"showTut",
            "click #memo span" :"showMemo"
        },
        showMemo : function(e){
            var image = "<img src='assets/img/guide/memo.png'/>";
            var msg=this.model.get("guide")["memo"];
            bootbox.dialog({
                className:"wideModal",
                message:image+msg,
                buttons: {
                    okay:{
                        label:"Ok"
                    }
                }
            });
        },
        showTut: function(e) {
            if(this.tutStage+1>this.tutStages.length){
                this.tutStage=0;
                return false;
            }
            console.log(this.tutStage);

            var self =this;
            var prevClass = this.tutStage===0?"disabled":"btn-danger";
            var nextLabel = this.tutStage+1===this.tutStages.length?"Okay":"->";
            var langKey = this.langKey;
            var image = "<img src='assets/img/guide/guide-"+this.tutStages[this.tutStage]+".png'/>";
            cookie.create("hasPlayed", true, 365000000);
            bootbox.dialog({
                className:"wideModal",
                message: image+"<p>"+this.model.get("guide")[this.tutStages[this.tutStage]]+"</p>",
                title: "",
                buttons: {
                    previous: {
                        label: "<-",
                        className: prevClass,
                        callback:function(){
                            self.showPreviousTut();
                        }
                    },
                    next: {
                        label: nextLabel,
                        className: "btn-success clickNext",
                        callback:function(){
                            self.showTut();
                        }
                    },
                }
            });
            this.tutStage++;
            return false;
        },
        showPreviousTut: function(e) {
            this.tutStage -= 2;

            if (this.tutStages<=-1) {
                this.tutStage = 0;
                return false;
            }
            var self = this;
            console.log(this.tutStage);
            var prevClass = this.tutStage === 0 ? "disabled" : "btn-danger";
            var nextLabel = this.tutStage+1 >this.tutStages.length ? "Okay" : "->";
            var image = "<img src='assets/img/guide/guide-"+this.tutStages[this.tutStage]+".png'/>";
            cookie.create("hasPlayed", true, 365000000);
            bootbox.dialog({
                className:"wideModal",
                message: image+"<p>"+this.model.get("guide")[this.tutStages[this.tutStage]]+"</p>",
                title: "",
                buttons: {
                    previous: {
                        label: "<-",
                        className: prevClass,
                        callback: function() {
                            self.showPreviousTut();
                        }
                    },
                    next: {
                        label: nextLabel,
                        className: "btn-success clickNext",
                        callback: function() {
                            self.showTut();
                        }
                    },
                }
            });
            this.tutStage+=1;
            return false;
        },
        newMove: function(e, move) {
            //a function to detect new move if the vboard is diffrent from the old board
            //also pushes something the board to the queue as well.
            //will need to experiment on what size to limit the queue to
            if (DEBUG) {
                console.log("move made :");
                console.log(move.seq);

                // if(this.currMove!=0){
                //     console.log(JSON.stringify(move));

            }
            //deep copy
            this.moveQueue[this.currMove] = $.extend(true, [], move.seq);
            this.currMove++;
            if (this.moveQueue.length > this.currMove) {
                this.moveQueue = this.moveQueue.slice(this.moveQueue.length - this.queueSize > 0 ? this.moveQueue.length - this.queueSize : 0, this.currMove);
                this.currMove = this.moveQueue.length;
            }
            if (DEBUG) {
                console.log(this.currMove);
            }
            this.undoRedoButtonsStatus();
            // this.diffHighlighting();
            // this.lineHighlighting();

            // this.currScore = $.fitch.score();
            // this.blockTree();
        },
        serializeData: function(){
            console.log(this.model.toJSON());
            return this.model.toJSON();
        },
        blockTree: function() {
            var tree = $.phylo.tree;
            var stage = this.moveQueue[this.currMove - 1]; //contains the div
            var stageVal = $.sequence.nucleotide;
            var lvl = $.stage.current;
            var tops = this.getTops(lvl);
            var groups = [];
            var highlightNo = 0;
            var alignments = $.board.getJsonAlignments().alignments;
            $("#hlCSS").html("");
            this.removeCSS();
            for (k = 0; k < 25; k++) {
                //instead of all of the tree, we do a few
                groups[k] = []
                for (var i = 0; i <= lvl; i++) {
                    groups[k][i] = {
                        G: [],
                        C: [],
                        A: [],
                        T: [],
                        "": []
                    };
                    //tree[i].node1 gives the row
                    //stage[x] = gives the corresponding row array
                    var n1 = stageVal[stage[tree[i].node1][k]];
                    var n2 = stageVal[stage[tree[i].node2][k]];
                    if (n1 === undefined) {
                        n1 = "";
                    }
                    if (n2 === undefined) {
                        n2 = "";
                    }
                    if (tree[i].child === 0) {
                        // groups[k][i] = [stageVal[n1], stageVal[n2]];
                        // groups[k][i][n1].push(tree[i].node1);
                        // groups[k][i][n1].push(tree[i].node1);
                        if (alignments[tree[i].node1][k] !== "x") {
                            groups[k][i][n1].push(alignments[tree[i].node1][k]);
                        }
                        // groups[k][i][n2].push(tree[i].node2);
                        if (alignments[tree[i].node2][k] !== "x") {
                            groups[k][i][n2].push(alignments[tree[i].node2][k]);
                        }

                    } else if (tree[i].child === 1) {
                        //n1 is the leave
                        // groups[k][i] = $.extend(true,[],groups[k][tree[i].node2]);
                        // groups[k][i] = _.union([stageVal[n1]],[groups[k][i]]);
                        if (alignments[tree[i].node1][k] !== "x") {
                            groups[k][i][n1].push(alignments[tree[i].node1][k]);
                        } //copy the values over
                        var loc = tree[i].node2;
                        for (var a in groups[k][i]) {
                            // group[k][i][a]+=groups[k][loc][a];
                            groups[k][i][a] = _.union(groups[k][i][a], groups[k][loc][a]);
                        }
                    } else {
                        // groups[k][i] = _.union([groups[k][tree[i].node1]], [groups[k][tree[i].node2]]);
                        var loc1 = tree[i].node1;
                        var loc2 = tree[i].node2;
                        for (var a in groups[k][i]) {
                            groups[k][i][a] = _.union(groups[k][i][a], groups[k][loc1][a]);
                            groups[k][i][a] = _.union(groups[k][i][a], groups[k][loc2][a]);
                        }
                    }
                    delete groups[k][i][""];
                    if (tops[i]) {
                        highlightNo = this.groupHighlight(groups[k][i], highlightNo);
                    }
                }
            }
        },
        groupHighlight: function(group, highlightNo) {
            //we first find max
            var max = -1;
            var maxLoc = 0;
            for (var i in group) {
                if (max < group[i].length) {
                    maxLoc = i;
                    max = group[i].length;
                }
            }
            if (max > 1) {
                console.log(group);

                for (var i = 0; i < group[maxLoc].length; i++) {
                    console.log(group[maxLoc][i]);
                    $("#" + group[maxLoc][i]).addClass("hl-" + highlightNo);
                }
                this.addCSS(".hl-" + highlightNo + "{ " +
                    "outline-color: " +
                    'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ');' + "outline-style: solid;" +
                    "outline-width: 2px;" + "}");
                highlightNo++;
            }
            return highlightNo;
        },
        addCSS: function(str) {
            $("#hlCSS").append(str);
        },
        removeCSS: function() {
            var x = $("[class*='hl-']");
            for (var i = 0; i < x.length; i++) {
                x[i].className = x[i].className.replace(/\bhl.\d{1,3}-*?\b/g, '');
            }
        },
        getTops: function(lvl) {
            var stage = $.phylo.tree;
            var tops = {};
            for (var i = 0; i <= lvl; i++) {
                if (stage[i].child === 0) {
                    tops[i] = true;
                }
                if (stage[i].child === 1) {
                    tops[i] = true;
                    tops[stage[i].node2] = false;
                }
                if (stage[i].child === 2) {
                    tops[i] = true;
                    tops[stage[i].node2] = false;
                    tops[stage[i].node1] = false;
                }
            }
            return tops;
        },
        newGame: function() {
            //quick reset for the move queue and position holder
            this.currMove = 0;
            this.moveQueue = [];
        },
        undoMove: function() {
            if (DEBUG) {
                console.log(this.currMove);
            }
            if (this.currMove - 2 < 0) {
                return;
            }
            // console.log(this.currMove-2, this.moveQueue[this.currMove-2]);

            $.helper.copy($.sequence.track, this.moveQueue[this.currMove - 2]);
            var score = $.fitch.score();
            $.board.score(score);
            $.physics.snapRandom();
            if ($.phylo.bestScore >= $.sequence.par)
                $.board.approve();
            $.board.stats();
            this.currMove--;
            this.undoRedoButtonsStatus();
            // this.currScore = $.fitch.score();
        },
        redoMove: function() {
            if (DEBUG) {

                console.log(this.currMove);
            }
            if (this.currMove + 1 > this.moveQueue.length) {
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
            // this.currScore = $.fitch.score();
        },
        //a function to use so the buttons are in the right state
        undoRedoButtonsStatus: function() {
            //redo button
            if (this.currMove + 1 > this.moveQueue.length) {
                $("#redo").removeClass("on");
            } else {
                $("#redo").addClass("on");
            }
            if (this.currMove - 2 < 0) {
                $("#undo").removeClass("on");
            } else {
                $("#undo").addClass("on");
            }
        },
        toggleVolume: function(e) {
            var vol = 0;
            if ($(e.target).hasClass("icon-volume-up-1")) {
                $(e.target).removeClass("icon-volume-up-1").addClass("icon-volume-off-1");
            } else {
                vol = 1;

                $(e.target).addClass("icon-volume-up-1").removeClass("icon-volume-off-1");
            }
            var cusEvent = jQuery.Event({
                type: "mute",
                vol: vol
            });
            $("#muteBtn").trigger(cusEvent);
            return false;
        },
        diffHighlighting: function() {
            if (this.currMove <= 1) {
                return;
            }
            var alignments = $.sequence.track;
            var newMove = this.moveQueue[this.currMove - 1];
            var oldMove = this.moveQueue[this.currMove - 2];
            var len = oldMove.length;
            $(".sequence").removeClass("glowShadow");
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < oldMove[i].length; j++) {
                    if (newMove[i][j] != oldMove[i][j] && newMove[i][j] !== "x") {
                        console.log(alignments[i][j]);
                        console.log(i,j);
                        $("#"+alignments[i][j]).toggleClass("glowShadow",true);
                    }
                }
            }
            return;
        },
        lineHighlighting: function() {
            var len = this.moveQueue[this.currMove - 1].length;
            $(".glowTreeLine").removeClass("glowTreeLine");
            for (var i = 0; i < len; i++) {
                if (!$("#row" + i + " div.sequence").hasClass("highlighter-2")) {
                    // console.log(i);
                    $(".h" + i).addClass("glowTreeLine");
                    for (j = i + 1; j < len; j++) {
                        if (!$("#row" + j + " div.sequence").hasClass("highlighter-2")) {
                            $("." + i + "v" + j).addClass("glowTreeLine");
                        }
                    }
                }
            }
        },

    });
    return IndexView;
});