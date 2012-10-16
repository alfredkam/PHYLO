(function() {

	$("#customize").click(function(event) {
		event.stopPropagation();
		
		$(".customize").show();
		$(".customize-bg").css({
			width: document.width,
			height: document.height
		});
	});

	$(".customize-cancel").click(function() {
		$(".customize").hide();
	});
		
	$(".customize-tab a").click(function() {
		$(".customize-tab a").each(function(){
			$(this).removeClass("customize-tab-onselect");
		});	
		$(this).addClass("customize-tab-onselect");
	});

	$(".customize-theme-cell").click(function() {
		$(".customize-theme-cell").each(function() {
			$(this).removeClass("customize-theme-onpick");
		});
		$(this).addClass("customize-theme-onpick");
	});

})();


(function() {
		//color pad code from http://www.html5canvastutorials.com/labs/html5-canvas-color-picker/
	
            function getMousePos(canvas, evt){
                // get canvas position
                var obj = canvas;
                var top = 0;
                var left = 0;
                while (obj.tagName != 'BODY') {
                    top += obj.offsetTop;
                    left += obj.offsetLeft;
                    obj = obj.offsetParent;
                }
                
                // return relative mouse position
                var mouseX = evt.clientX - left + window.pageXOffset;
                var mouseY = evt.clientY - top + window.pageYOffset;
                return {
                    x: mouseX,
                    y: mouseY
                };
            }
            
            function drawColorSquare(canvas, color, imageObj){
                var colorSquareSize = 100;
                var padding = 10;
                var context = canvas.getContext("2d");
                context.beginPath();
                context.fillStyle = color;
                var squareX = (canvas.width - colorSquareSize + imageObj.width) / 2;
                var squareY = (canvas.height - colorSquareSize) / 2;
                context.fillRect(squareX, squareY, colorSquareSize, colorSquareSize);
                context.strokeRect(squareX, squareY, colorSquareSize, colorSquareSize);
            }
            
            function init(imageObj){
                var padding = 10;
                var canvas = document.getElementById("colorpad");
                var context = canvas.getContext("2d");
                var mouseDown = false;
                
                context.strokeStyle = "#444";
                context.lineWidth = 2;
                
                canvas.addEventListener("mousedown", function(){
                    mouseDown = true;
                }, false);
                
                canvas.addEventListener("mouseup", function(){
                    mouseDown = false;
                }, false);
                
                canvas.addEventListener("mousemove", function(evt){
                    var mousePos = getMousePos(canvas, evt);
                    var color = undefined;
                    
                    if (mouseDown &&
                    mousePos !== null &&
                    mousePos.x > padding &&
                    mousePos.x < padding + imageObj.width &&
                    mousePos.y > padding &&
                    mousePos.y < padding + imageObj.height) {
                        /*
                         * color picker image is 256x256 and is offset by 10px
                         * from top and bottom
                         */
                        var imageData = context.getImageData(padding, padding, imageObj.width, imageObj.width);
                        var data = imageData.data;
                        var x = mousePos.x - padding;
                        var y = mousePos.y - padding;
                        var red = data[((imageObj.width * y) + x) * 4];
                        var green = data[((imageObj.width * y) + x) * 4 + 1];
                        var blue = data[((imageObj.width * y) + x) * 4 + 2];
                        color = "rgb(" + red + "," + green + "," + blue + ")";
                    }
                    
                    if (color) {
                       // drawColorSquare(canvas, color, imageObj);
			$(".customize-theme-onpick").css({
				backgroundColor : color
			});
                    }
                }, false);
                
                context.drawImage(imageObj, padding, padding);
                //drawColorSquare(canvas, "white", imageObj);
            }
            
            window.onload = function(){
                var imageObj = new Image();
                imageObj.onload = function(){
                    init(this);
                };
                imageObj.src = "img/color_picker.png";
            };
        
})();
