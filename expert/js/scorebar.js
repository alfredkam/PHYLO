/**
 * @constructor
 */
function ColourConversion(){
    return true;
}

/**
 * Given an RGB array ([r,g,b] where r, g, b are in [0,255]) and an alpha
 * value a ([0,1]), return the string representation in the form
 * rgba(r, g, b, a)
 */
ColourConversion.rgbToRgbaString = function rgbToRgba(rgb, a){
    return "rgba(" + ~~(rgb[0] + 0.5) + "," + ~~(rgb[1] + 0.5) + "," + ~~(rgb[2] + 0.5) + "," + a + ")";
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 * @author http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 * 
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
ColourConversion.rgbToHsl = function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r:h = (g - b) / d + (g < b ? 6 : 0);break;
            case g:h = (b - r) / d + 2;break;
            case b:h = (r - g) / d + 4;break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 * @author http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
ColourConversion.hslToRgb = function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

/**
 * @constructor
 */
function ScoreBar(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.currentScore = 10;
    this.bestScore = 0;
    this.parScore = 0;
    
    this.params = {
        animate: {
            from: {
                left: 0,
                right: 0,
                grid: 10,
                bestScore: 0,
                parScore: 0,
                currentScore: 0
            },
            to: {
                left: 0,
                right: 0,
                grid: 10,
                bestScore: 0,
                parScore: 0,
                currentScore: 0
            },
            current: {
                left: 0,
                right: 0,
                grid: 10,
                bestScore: 0,
                parScore: 0,
                currentScore: 0
            },
            interval: 20,
            duration: 500,
            handle: null,    // pointer to handle from setInterval
            start: null,    // start time of the animation
            circIn: function circIn(progress){
                return 1 - Math.sin(Math.acos(progress));
            },
            circOut: function circOut(progress){
                return Math.sin(Math.acos(1 - progress));
            },
            circInOut: function circInOut(progress){
                if (progress < 0.5){
                    return 0.5 - Math.sin(Math.acos(2 * progress)) / 2;
                }else{
                    return 0.5 + Math.sin(Math.acos(2 - 2 * progress)) / 2;
                }
            },
            step: function step(delta, params){
                params.animate.current.left = params.animate.from.left + 
                    (params.animate.to.left - params.animate.from.left) * delta;
                params.animate.current.right = params.animate.from.right + 
                    (params.animate.to.right - params.animate.from.right) * delta;
                params.animate.current.currentScore = params.animate.from.currentScore + 
                    (params.animate.to.currentScore - params.animate.from.currentScore) * delta;
                params.animate.current.bestScore = params.animate.from.bestScore + 
                    (params.animate.to.bestScore - params.animate.from.bestScore) * delta;
                params.animate.current.parScore = params.animate.from.parScore + 
                    (params.animate.to.parScore - params.animate.from.parScore) * delta;
                // down to the nearest power of 10 as grid markers.
                params.animate.current.grid = Math.pow(10, Math.floor(Math.log(params.animate.current.right - params.animate.current.left) / Math.log(10) - 0.4));
            }
        },
        barHeight: 0.4,
        leftBlank: 100,
        rightBlank: 100,
        colours: {
            gridLine: "rgba(200,200,200,0.3)",
            gridText: "rgba(200,200,200,0.9)",
            bestScoreLine: "rgb(120,250,120)",
            parScoreLine: "rgb(120,120,250)",
            bestScoreText: "rgb(120,250,120)",
            parScoreText: "rgb(120,120,250)",
            parBackground: "",
            barLow: [0, 1, 0.5],  // in HSL
            barMid: [0.2, 1, 0.5],
            barHigh: [0.44, 1, 0.5],
            barRange: 30,
            barAlpha: 0.9,
            barTextFill: "white",
            barTextShadow: "rgba(0,0,0,0.9)",
            scoreText: "rgba(74,74,74,0.9)"//"rgba(220,220,220,0.9)"
        }
    };
    this.listeners = {
        "best-click": []
    };
    this.params.animate.draw = this.draw;
    return true;
}

ScoreBar.alignToPixel = function(n){
    return (~~n) + 0.5;
}

ScoreBar.prototype.getBarColour = function(score){
    if (score === undefined){
        score = this.params.animate.current.currentScore;
    }
    var range = this.params.colours.barRange;
    var percent = Math.abs(score - this.parScore) / range;
    if (percent > 1){
        percent = 1;
    }
    var from = this.params.colours.barMid;
    var to = this.params.colours.barLow;
    if (score >= this.parScore){
        to = this.params.colours.barHigh;
    }
    return ColourConversion.rgbToRgbaString(
        ColourConversion.hslToRgb(
            percent * (to[0] - from[0]) + from[0],
            percent * (to[1] - from[1]) + from[1],
            percent * (to[2] - from[2]) + from[2]
        ),
        this.params.colours.barAlpha
    );
}

ScoreBar.prototype.draw = function(){
    if (typeof resizeinfo !== 'undefined' && resizeinfo.resize){
        this.canvas.width = resizeinfo.scorebar_width;
    }
    var ctx = this.ctx;
    var width = this.canvas.width;
    var height = this.canvas.height;
    var animate = this.params.animate;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    
    width -= this.params.leftBlank + this.params.rightBlank;
    var scale = width / (animate.current.right - animate.current.left);
    var zero = Math.abs(Math.min(animate.current.left, 0)) / (animate.current.right - animate.current.left);
    var zeroPixel = zero * width + this.params.leftBlank;
    
    // draw grid
    ctx.font = "10pt sans-serif";
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'center';
    ctx.strokeStyle = this.params.colours.gridLine;
    ctx.fillStyle = this.params.colours.gridText;
    ctx.lineWidth = 1;
    ctx.beginPath();
    var left = zeroPixel;
    while (left <= this.canvas.width){
        ctx.moveTo(ScoreBar.alignToPixel(left), 0);
        ctx.lineTo(ScoreBar.alignToPixel(left), height);
        ctx.fillText("" + Math.round((left - zeroPixel) / scale * 10) / 10, left, height);
        left += animate.current.grid * scale;
    }
    left = zeroPixel;
    while (left >= 0){
        ctx.moveTo(ScoreBar.alignToPixel(left), 0);
        ctx.lineTo(ScoreBar.alignToPixel(left), height);
        ctx.fillText(Math.round((left - zeroPixel) / scale * 10) / 10, left, height);
        left -= animate.current.grid * scale;
    }
    ctx.closePath();
    ctx.stroke();
    
    // draw bar
    left = this.params.animate.current.currentScore * scale;
    ctx.fillStyle = this.getBarColour();
    ctx.textBaseline = 'middle';
    var rect = ScoreBar.getRect.call(this, this.params.animate.current.currentScore, scale, zeroPixel);
    ctx.beginPath();
    ctx.rect(rect.left, rect.top, rect.width, rect.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = this.params.colours.barTextFill;
    ctx.lineWidth = 2;
    ctx.save();
    ctx.shadowColor = this.params.colours.barTextShadow;
    ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 2;
    ctx.fillText(Math.round(this.params.animate.current.currentScore), left / 2 + zeroPixel , height / 2);
    ctx.restore();
    
    // draw best
    left = ScoreBar.alignToPixel(zeroPixel + this.params.animate.current.bestScore * scale);
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = this.params.colours.bestScoreText;
    ctx.fillText(Language.get('sb-best') + ": " + Math.round(this.params.animate.current.bestScore), width + this.params.leftBlank + 10, 0);
    ctx.beginPath();
    ctx.moveTo(left, 0);
    ctx.lineTo(left, height);
    ctx.closePath();
    ctx.strokeStyle = this.params.colours.bestScoreLine;
    ctx.stroke();
    
    // draw par
    left = ScoreBar.alignToPixel(zeroPixel + this.params.animate.current.parScore * scale);
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.params.colours.parScoreText;
    ctx.fillText(Language.get('sb-par') + ": " + Math.round(this.params.animate.current.parScore), width + this.params.leftBlank + 10, height / 2);
    ctx.beginPath();
    ctx.moveTo(left, 0);
    ctx.lineTo(left, height);
    ctx.closePath();
    ctx.strokeStyle = this.params.colours.parScoreLine;
    ctx.stroke();
    
    // draw Score
    ctx.save();
    ctx.font = "22pt sans-serif";
    ctx.fillStyle = this.params.colours.scoreText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.round(this.params.animate.current.currentScore), this.params.leftBlank / 2, height / 2);
    ctx.restore();
}

ScoreBar.getRect = function(score, scale, zeroPixel){
    var rect = {};
    var height = this.canvas.height;
    
    rect.top = (height * (1 - this.params.barHeight)) / 2;
    rect.height = this.params.barHeight * height;
    rect.left = Math.min(score * scale + zeroPixel, zeroPixel);
    rect.width = Math.abs(score * scale);
    return rect;
}

ScoreBar.prototype.recalc = function(){
    var animate = function animate(context) {
        var anim = context.params.animate;
        if (anim.handle != null){
            clearInterval(anim.handle);
            anim.handle = null;
        }
        anim.start = new Date;
        anim.handle = setInterval(function() {
            var timePassed = new Date - anim.start;
            var progress = timePassed / anim.duration;

            if (progress > 1){
                progress = 1;
            }
            anim.step(anim.circInOut(progress), context.params);
            context.draw();
            if (progress == 1) {
                clearInterval(anim.handle);
                anim.handle = null;
            }
        }, anim.interval);
    }

        
    var min = Math.min(this.currentScore, this.bestScore, this.parScore) * 1.2;
    var max = Math.max(this.currentScore, this.bestScore, this.parScore) * 1.2;
    if (min > 0){
        min = 0;
    }
    if (max < 0){
        max = 0;
    }
    if (max - min < 10){
        var t = 5 - (max - min) / 2
        max += t;
        min -= t;
    }
    this.params.animate.from.left = this.params.animate.current.left;
    this.params.animate.from.right = this.params.animate.current.right;
    this.params.animate.from.grid = this.params.animate.current.grid;
    this.params.animate.from.currentScore = this.params.animate.current.currentScore;
    this.params.animate.from.bestScore = this.params.animate.current.bestScore;
    this.params.animate.from.parScore = this.params.animate.current.parScore;
    this.params.animate.to.left = min;
    this.params.animate.to.right = max;
    this.params.animate.to.grid = 
        Math.pow(10, Math.floor(Math.log(max - min) / Math.log(10)) - 2);
    this.params.animate.to.currentScore = this.currentScore;
    this.params.animate.to.bestScore = this.bestScore;
    this.params.animate.to.parScore = this.parScore;
    
    animate(this);
}

ScoreBar.prototype.setScores = function(newScores, redraw){
    redraw = typeof redraw !== 'undefined' ? redraw : true;
    if (newScores.score !== undefined){
        this.setScore(newScores.score, false);
    }
    if (newScores.best !== undefined){
        this.setBest(newScores.best, false);
    }
    if (newScores.par !== undefined){
        this.setPar(newScores.par, false);
    }
    if (redraw){
        this.recalc();
    }
}

ScoreBar.prototype.setScore = function(newScore, redraw){
    redraw = typeof redraw !== 'undefined' ? redraw : true;
    this.currentScore = newScore;
    if (newScore > this.bestScore){
        this.setBest(newScore, false);
    }
    if (redraw){
        this.recalc();
    }
}

ScoreBar.prototype.setBest = function(newBest, redraw){
    redraw = typeof redraw !== 'undefined' ? redraw : true;
    this.bestScore = newBest;
    if (redraw){
        this.recalc();
    }
}

ScoreBar.prototype.setPar = function(newPar, redraw){
    redraw = typeof redraw !== 'undefined' ? redraw : true;
    this.parScore = newPar;
    if (redraw){
        this.recalc();
    }
}

ScoreBar.prototype.fireEvent = function(event){
    event.target = this;
    for (var ind in this.listeners[event.type]){
        event.listenerId = ind;
        this.listeners[event.type][ind][0].call(this.listeners[event.type][ind][1], event);
    }
}

ScoreBar.prototype.addListener = function(event, handler, context){
    if (this.listeners[event] === undefined){
        this.listeners[event] = [];
    }
    this.listeners[event].push([handler, context]);
    return this.listeners[event].length - 1;
}

ScoreBar.prototype.removeListener = function(event, id){
    delete this.listeners[event][id];
}
