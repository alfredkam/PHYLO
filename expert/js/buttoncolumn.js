/**
 * @constructor
 */
function ButtonColumn(canvas){
    this.canvas = canvas;
    this.canvas.controller = this;
    this.ctx = canvas.getContext("2d");
    this.buttons = [];
    
    var icons = [new BCIcon({icon:"hdd", style:"white"}), new BCIcon({icon:"folder-open", style:"white"})];
    var data = [
        ["Save States"],
        [Language.get('bc-best'), null, icons[1], "Best"],
        [this.getScoreForState("Best")],
        ["1", icons[0], icons[1], "1"],
        [this.getScoreForState("1")],
        ["2", icons[0], icons[1], "2"],
        [this.getScoreForState("2")]
    ];
    var handlers = [
        [""],
        ["Best", null, function(){
            var json = localStorage.getItem(args['id'] + "-Best");
            if (json){
                var state = JSON.parse(json);
                loadState(state);
            }
        }],
        [],
        ////////////////////////////////
        ["1", function(){
            var state = getCurrentState();
            localStorage.setItem(args['id'] + "-1", JSON.stringify(state));
            this.setScoreForState("1", state.score);
        }, function(){
            var json = localStorage.getItem(args['id'] + "-1");
            if (json){
                var state = JSON.parse(json);
                loadState(state);
            }
        }],
        [],
        ////////////////////////////////
        ["2", function(){
            var state = getCurrentState();
            localStorage.setItem(args['id'] + "-2", JSON.stringify(state));
            this.setScoreForState("2", state.score);
        }, function(){
            var json = localStorage.getItem(args['id'] + "-2");
            if (json){
                var state = JSON.parse(json);
                loadState(state);
            }
        }],
        []
    ];
    
    for (var i in icons){
        icons[i].addListener("changed", function(){
            this.draw();
        }, this);
    }
    
    this.data = [];
    
    var row;
    for (var i = 0; i < data.length; i++){
        var top = i * G_H;
        row = [data[i][0]];
        // left button
        if (data[i][1]){
            button = new BCButton(
                ~~(canvas.width - BC_BUTTON_W * 2),
                ~~(top + (G_H - BC_BUTTON_H) / 2),
                data[i][1],
                BC_BUTTON_W,
                BC_BUTTON_H
            );
            this.buttons.push(button);
            row.push(button);
        }else{
            row.push(null);
        }
        
        // right button
        if (data[i][2]){
            button = new BCButton(
                ~~(canvas.width - BC_BUTTON_W),
                ~~(top + (G_H - BC_BUTTON_H) / 2),
                data[i][2],
                BC_BUTTON_W,
                BC_BUTTON_H
            );
            row.push(button);
            this.buttons.push(button);
        }else{
            row.push(null);
        }
        row.push(data[i][3]);
        this.data.push(row);
    }
    
    // set mouse handlers
    var handler = function(e){
        var offset = $(this).offset();
        var x = (e.pageX-offset.left);
        var y = (e.pageY-offset.top);
        var redraw = false;
        for(var i in this.controller.buttons){
            if (x > this.controller.buttons[i].x && x < this.controller.buttons[i].x + this.controller.buttons[i].width &&
                y > this.controller.buttons[i].y && y < this.controller.buttons[i].y + this.controller.buttons[i].height){
                if (this.controller.buttons[i].setOver(true)){
                    redraw = true;
                }
                if (e.type == "mousedown" && this.controller.buttons[i].setDown(true)){
                    redraw = true;
                }else if (e.type == "mouseup" && this.controller.buttons[i].setDown(false)){
                    redraw = true;
                }
                if (e.type == "mouseup"){
                    this.controller.buttons[i].fireEvent(new $.Event("clicked"));
                }
            }else{
                if (this.controller.buttons[i].setOver(false)){
                    redraw = true;
                }
            }
        }
        if (redraw){
            this.controller.draw();
        }
    };
    
    $(this.canvas).mousemove(handler);
    $(this.canvas).mousedown(handler);
    $(this.canvas).mouseup(handler);
    
    $(this.canvas).mouseout(function(e){
        var redraw = false;
        for(var i in this.controller.buttons){
            if (this.controller.buttons[i].setOver(false)){
                redraw = true;
            }
            if (this.controller.buttons[i].setDown(false)){
                redraw = true;
            }
        }
        if (redraw){
            this.controller.draw();
        }
    });
    
    for (var i = 0; i < handlers.length; i++){
        for (var j = 0; j < handlers[i].length; j++){
            if (this.data[i][j] != null && 
                    typeof this.data[i][j] == "object" &&
                    typeof handlers[i][j] == "function"){
                this.data[i][j].addListener("clicked", handlers[i][j], this);   
            }
        }
    }
}

ButtonColumn.prototype.setScoreForState = function(state, score){
    for (var i = 0; i < this.data.length - 1; i++){
        if (this.data[i][3] && this.data[i][3] == state){
            this.data[i+1][0] = score;
        }
    }
    this.draw();
}

ButtonColumn.prototype.getScoreForState = function(state){
    var json = localStorage.getItem(args['id'] + "-" + state);
    if (json){
        var state = JSON.parse(json);
        return state.score;
    }else{
        return null;
    }
}

ButtonColumn.prototype.draw = function(){
    var ctx = this.ctx;
    var width = this.canvas.width;
    var height = this.canvas.height;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    
    // draw grid
    var grad = ctx.createLinearGradient(0, 0, BC_BACKGROUND_GRID_W, 0);
    grad.addColorStop(0, G_COLOUR);
    grad.addColorStop(1, G_COLOUR_A);
    ctx.strokeStyle = grad;
    ctx.fillStyle = G_COLOUR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i <= G_ROW; i++){   // horizontal
        ctx.moveTo(-0.5, i * G_H + 0.5);
        ctx.lineTo(BC_BACKGROUND_GRID_W + 0.5, i * G_H + 0.5);
    }
    ctx.closePath();
    ctx.stroke();
    
    ctx.font = "10pt sans-serif";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    
    for (var i = 0; i < this.data.length; i++){
        var top = i * G_H;
        if (this.data[i][0] && typeof this.data[i][0] == "string"){
            ctx.fillText(this.data[i][0], 5, top + (G_H / 2));
        }else if (this.data[i][0] && typeof this.data[i][0] == "number"){
            ctx.save();
            ctx.font = "8pt sans-serif";
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText(Language.get('bc-score') + ": " + this.data[i][0], BC_W - BC_BUTTON_W / 3, top);
            ctx.restore();
        }
        if (this.data[i][1]){
            ctx.save();
            ctx.translate(this.data[i][1].x, this.data[i][1].y);
            this.data[i][1].draw(ctx);
            ctx.restore();
        }
        if (this.data[i][2]){
            ctx.save();
            ctx.translate(this.data[i][2].x, this.data[i][2].y);
            this.data[i][2].draw(ctx);
            ctx.restore();
        }
    }
}

/**
 * @constructor
 */
function BCButton(x, y, icon, width, height){
    this.x = x;
    this.y = y;
    this.icon = icon;
    this.width = width;
    this.height = height;
    this.listeners = [];
    this.over = false;
}

BCButton.prototype.fireEvent = function(event){
    event.target = this;
    for (var ind in this.listeners[event.type]){
        event.listenerId = ind;
        this.listeners[event.type][ind][0].call(this.listeners[event.type][ind][1], event);
    }
}

BCButton.prototype.setDown = function(value){
    if (value != this.down){
        this.down = value;
        return true;
    }
    return false;
}

BCButton.prototype.setOver = function(value){
    if (value != this.over){
        this.over = value;
        return true;
    }
    return false;
}

BCButton.prototype.addListener = function(event, handler, context){
    if (this.listeners[event] === undefined){
        this.listeners[event] = [];
    }
    this.listeners[event].push([handler, context]);
    return this.listeners[event].length - 1;
}

BCButton.prototype.removeListener = function(event, id){
    delete this.listeners[event][id];
}

BCButton.prototype.draw = function draw(ctx){
    ctx.clearRect(0, 0, this.width, this.height);
    
    if (this.down){
        ctx.fillStyle = BC_BUTTON_DOWN_COLOUR;
        ctx.fillRect(0, 0, this.width, this.height);
    }else if (this.over){
        ctx.fillStyle = BC_BUTTON_OVER_COLOUR;
        ctx.fillRect(0, 0, this.width, this.height);
    }
    
    if (this.icon && this.icon.image){
        var x = ~~((this.width - this.icon.width) / 2);
        var y = ~~((this.height - this.icon.height) / 2);
        ctx.drawImage(this.icon.image,
            this.icon.x,        //sx
            this.icon.y,
            this.icon.width,    //sw
            this.icon.height,
            x >= 0 ? x : 0,     //dx
            y >= 0 ? y : 0,
            this.icon.width,    //dw
            this.icon.height
        );
    }
}

/**
 * @constructor
 */
function BCIcon(arg){
    if (!BCIcon.inited){
        BCIcon.init();
    }
    if (arg.icon){
        this.x = BCIcon.coords[arg.icon].x;
        this.y = BCIcon.coords[arg.icon].y;
    }else{
        this.x = arg.x;
        this.y = arg.y;
    }
    this.style = typeof arg.style !== 'undefined' ? arg.style : "black";
    this.image = BCIcon.images[this.style];
    this.width = 14;
    this.height = 14;
    this.listeners = [];
    BCIcon.allInstances.push(this);
}

BCIcon.imageSrcs = {
    "black": "img/glyphicons-halflings.png",
    "white": "img/glyphicons-halflings.png" //modified to use black instead
};

BCIcon.coords = {
    "download": {"x": 120, "y": 24},
    "upload": {"x": 144, "y": 24},
    "folder-open": {"x": 408, "y": 120},
    "hdd": {"x": 0, "y": 144}
};

BCIcon.images = {};
BCIcon.inited = false;
BCIcon.allInstances = [];

BCIcon.init = function init(){
    BCIcon.inited = true;
    for (var key in BCIcon.imageSrcs){
        var img = new Image;
        img.key = key;
        img.onload = function(){
            for (var ind in BCIcon.allInstances){
                if (BCIcon.allInstances[ind].style == this.key){
                    BCIcon.allInstances[ind].image = this;
                    BCIcon.allInstances[ind].fireEvent(new $.Event("changed"));
                }
            }
        }
        img.onerror = function(){
            console.log("error loading BCIcon: " + this.key);
        }
        img.src = BCIcon.imageSrcs[key];
        BCIcon.images[key] = img;
    }
}

BCIcon.prototype.changeStyle = function(style){
    this.path = this.paths[style];
}

BCIcon.prototype.fireEvent = function(event){
    event.target = this;
    for (var ind in this.listeners[event.type]){
        event.listenerId = ind;
        this.listeners[event.type][ind][0].call(this.listeners[event.type][ind][1], event);
    }
}

BCIcon.prototype.addListener = function(event, handler, context){
    if (this.listeners[event] === undefined){
        this.listeners[event] = [];
    }
    this.listeners[event].push([handler, context]);
    return this.listeners[event].length - 1;
}

BCIcon.prototype.removeListener = function(event, id){
    delete this.listeners[event][id];
}
