var myColors = [];

var maxColors = 8;

var w = 70; // width of square in pattern
var h = 70; // height of square in pattern

var warp = [];
var weft = [];

var warpCount = 10; //initial number of warp ends
var weftCount = 10; // initial number of weft ends


var c = document.getElementById("colorCanvas");
var ctx = c.getContext("2d");

var colorpick1;
var colorpick2;
var colorpick3;
var colorpick4;
var colorpick5;

window.addEventListener("load", startup, false);

function startup() {

  randomColor();

  /*colorpick1 = document.getElementById("col1");
  colorpick2 = document.getElementById("col2");
  colorpick3 = document.getElementById("col3");
  colorpick4 = document.getElementById("col4");
  colorpick5 = document.getElementById("col5");

  colorpick1.value = myColors[0];
  colorpick2.value = myColors[1];
  colorpick3.value = myColors[2];
  colorpick4.value = myColors[3];
  colorpick5.value = myColors[4];

  colorpick1.addEventListener("change", col1Change, false);
  colorpick2.addEventListener("change", col2Change, false);
  colorpick3.addEventListener("change", col3Change, false);
  colorpick4.addEventListener("change", col4Change, false);
  colorpick5.addEventListener("change", col5Change, false);*/


  makeGrid();
  makePatternNoStroke();
}

function randomColor() {
  for (i = 0; i < 5; i++) {
    myColors[i] = '#' + (Math.floor(Math.random() * 2 ** 24)).toString(16).padStart(6, '0');
    /*document.getElementById("col" + (i + 1)).value = myColors[i];*/
  }

  /*console.log("random colors: ", myColors);*/
  makePatternNoStroke();
}


/*function col1Change(event) {
  myColors[0] = event.target.value;
    makePatternNoStroke();

}

function col2Change(event) {
  myColors[1] = event.target.value;
  makePatternNoStroke();
}

function col3Change(event) {
  myColors[2] = event.target.value;
  makePatternNoStroke();
}

function col4Change(event) {
  myColors[3] = event.target.value;
  makePatternNoStroke();
}

function col5Change(event) {
  myColors[4] = event.target.value;
  makePatternNoStroke();
}*/




function makeGrid() {
  warp = [];
  weft = [];

  /*console.log("make grid", warpCount, " x ", weftCount);*/

  //dynamical count of warp und weft
  for (i = 0; i < warpCount; i++) {
    warp.push(0);
  }

  for (i = 0; i < weftCount; i++) {
    weft.push(0);
  }

  c.width = (warp.length + 2) * w;
  c.height = (weft.length + 2) * h;

}



function makePatternNoStroke() {
  warp2();
  weft2();
  patternNoStroke();
}


function saveImage() {

  var canvas = document.getElementById("colorCanvas");

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(colorCanvas.msToBlob(), "canvas-image.jpeg");
  } else {

    var image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "pattern.jpeg";
    link.href = image;
    link.click();
  }
}



function warp2() {
  ctx.clearRect(0, 0, c.width, c.height);

  for (var i = 0; i < warp.length; i++) {
    warp[i] = myColors[Math.floor(Math.random() * maxColors)];
  }

}

function weft2() {
  for (var i = 0; i < weft.length; i++) {
    weft[i] = myColors[Math.floor(Math.random() * maxColors)];
  }

}



function patternNoStroke() {

  for (y = 0; y < warp.length; y += 2) {

    for (x = 0; x < warp.length; x += 2) {

      ctx.lineWidth = "1";

      ctx.fillStyle = warp[x];
      ctx.fillRect((x + 1) * w, y * h + h, w, h);



      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 2) * w, y * h + h, w, h);


    }
  }

  for (a = 1; a < warp.length; a += 2) {

    for (b = 0; b < warp.length; b += 2) {

      ctx.lineWidth = "1";

      ctx.fillStyle = weft[a];
      ctx.fillRect((b + 1) * w, a * h + h, w, h);


      /*console.log("weft2", weft);*/

      ctx.fillStyle = warp[b + 1];
      ctx.fillRect((b + 2) * w, a * h + h, w, h);


      /*console.log("warp2", warp);*/
    }
  }
}
