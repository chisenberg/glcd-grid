var canvas;
var context;
var img;

var pixelsize ;
var width ;
var height;

var bs;

function getInputValues(){
    pixelsize = $("#input_pixelsize").val();
    width = $("#input_width").val();
    height = $("#input_height").val();

    bs = new BitSet;
    bs = bs.setRange(0,width*height,0);
    canvas.width  = width*pixelsize;
    canvas.height = height*pixelsize;
    conv2hex();
    drawGrid();
}


function drawGrid() {
    context.beginPath();
    context.fillStyle = "white";
    context.lineWidth = 2;
    context.strokeStyle = '#aaa';
    for (var row = 0; row < height; row++) {
        for (var column = 0; column < width; column++) {
            var x = column * pixelsize;
            var y = row * pixelsize;
            context.rect(x, y, pixelsize, pixelsize);
            context.fill();
            context.stroke();
        }
    }
    context.closePath();
}

function redraw(){
    if($('#candraw').is(":checked")){
        context.drawImage(img,0,0);
    }
    drawGrid();
    
    context.fillStyle = "black";
    for (var row = 0; row < height; row++) {
        for (var column = 0; column < width; column++) {
            if(bs.get(row*width + column) == 1){
                context.fillRect(column*pixelsize, row*pixelsize, pixelsize, pixelsize);    
            }            
        }
    }
    
}

function draw(x,y, val){
    context.fillStyle = val == 1 ? "black" : "white";
    var minipixel = pixelsize -2;
    context.fillRect(x*pixelsize+1, y*pixelsize+1, minipixel, minipixel);
}


function conv2hex(){
    var byte_array=[];
    for (var byteline = 0; byteline < height; byteline+=8) {
        for (var column = 0; column < width; column++) {
            var my_byte = 0x00;
            for (var row = 0; row < 8; row++) {
                if(byteline+row >= height) break;
                if(bs.get( ((byteline+row) * width) + column))
                    my_byte |=  1 << row;
            }
            byte_array.push(my_byte);
        }
    }
    var outsrt = "";
    for(var b in byte_array){
        if( b%width == 0  && b >= width ) outsrt += "\n";
        outsrt += "0x" + byte_array[b].toString(16) + ", ";
    }
    $("#output").val(outsrt);
}

function mouseHandler(e) {
    var x = Math.floor(e.offsetX/pixelsize);
    var y = Math.floor(e.offsetY/pixelsize);
    var bitvalue = e.which == 3 ? 0 : 1;
    if(x < width && y < height){
        bs = bs.set( y*width+x , bitvalue);
        //redraw();
        draw(x,y,bitvalue);
    } 
    conv2hex();
    return false;
}



$(document).ready(function() {
    //button listener
    $("#setbutton").click(getInputValues);

    //canvas things
    canvas = document.getElementById("mycanvas"),
    context = canvas.getContext("2d");
    canvas.onmousedown=mouseHandler;

    //get initial values
    getInputValues();
    
});
