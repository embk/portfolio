var myColors = [];

var maxColors = 5;

var w = 50; // width of rect in pattern
var h = 50; // height of rect in pattern

var warp = [];
var weft = [];

var warpCount = 120; //initial number of warp ends
var weftCount = 120; // initial number of weft ends

var warpRapport = 5; // initial no. of repeating warp
var weftRapport = 5; // initial no. of repeating weft

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var colorpick1;
var colorpick2;
var colorpick3;
var colorpick4;
var colorpick5;

var patternRepeat;


window.addEventListener("load", startup, false);

function startup() {

  randomColor();

  //console.log("starting up");

  colorpick1 = document.getElementById("col1");
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
  colorpick5.addEventListener("change", col5Change, false);

  var b = document.getElementById("numberColors");
  b.addEventListener("change", numberCol, false);

  var t = document.getElementById("chooseDent");
  t.addEventListener("change", heddleDent, false);

  var f = document.getElementById("chooseNumRepWarp");
  f.addEventListener("change", numRepeatWarp, false);

  var d = document.getElementById("chooseNumRepWeft");
  d.addEventListener("change", numRepeatWeft, false);

  patternRepeat = document.querySelector(`input[name="rapport"]`);
  patternRepeat.addEventListener("change", function() {
    if (this.checked) {
      repeat();
      patternRepeat.style.background = "#ff00ff";
    }
  });

  makeGrid();
  makePattern();
}

function numberCol(event) {

  b = event.target.value;

  console.log("number col: ", b);

  maxColors = b;
  makePattern();
}

function col1Change(event) {
  myColors[0] = event.target.value;
  makePattern();

}

function col2Change(event) {
  myColors[1] = event.target.value;
  makePattern();
}

function col3Change(event) {
  myColors[2] = event.target.value;
  makePattern();
}

function col4Change(event) {
  myColors[3] = event.target.value;
  makePattern();
}

function col5Change(event) {
  myColors[4] = event.target.value;
  makePattern();
}

function randomColor() {
  for (i=0; i<5; i++){
    myColors [i] = '#' + (Math.floor(Math.random() * 2 ** 24)).toString(16).padStart(6, '0');
    document.getElementById("col" + (i+1)).value = myColors[i];

  }

  console.log("random colors: ", myColors);
  makePattern();
}

function heddleDent(event) {
  warpCount = event.target.value;
  weftCount = event.target.value;
  makeGrid();
  makePattern();
}


function numRepeatWarp(event) {
  warpRapport = event.target.value;
  /*console.log("warpRapport:", warpRapport);*/
  makeGrid();
  makePattern();
}

function numRepeatWeft(event) {
  weftRapport = event.target.value;
  makeGrid();
  makePattern();
}


function makeGrid() {
  warp = [];
  weft = [];

  console.log("make grid", warpCount, " x ", weftCount);

  //dynamical count of warp und weft
  for (i = 0; i < warpCount; i++) {
    warp.push(0);
  }

  for (i = 0; i < weftCount; i++) {
    weft.push(0);
  }

  c.width = (warp.length + 3) * w;
  c.height = (weft.length + 4) * h;

}

function makePattern() {
  warp2();
  weft2();
  pattern();
  document.getElementById("check").style.background = "#ffffff";

}

function fixedWarp() {
  weft2();
  pattern();
}


function saveToPng() {

  var canvas = document.getElementById("myCanvas");

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(myCanvas.msToBlob(), "canvas-image.png");
  } else {

    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "pattern.png";
    link.href = image;
    link.click();
  }
}


function repeat() {

  var warpRepeat = warpCount / warpRapport;
  var weftRepeat = weftCount / weftRapport;

  ctx.beginPath();
  ctx.lineWidth = "15";
  ctx.strokeStyle = "#ff00ff";
  ctx.lineCap = "round";
  ctx.moveTo(w, h);
  ctx.lineTo((w * 3) + w * warpRepeat, h);
  ctx.lineTo((w * 3) + w * warpRepeat, h * weftRepeat + h * 3);
  ctx.lineTo(w, h * weftRepeat + h * 3);
  ctx.lineTo(w, h);
  ctx.stroke();
}










function warp2() {
  ctx.clearRect(0, 0, c.width, c.height);

  for (var i = 0; i < warp.length / warpRapport; i++) {
    warp[i] = myColors[Math.floor(Math.random() * maxColors)];
    ctx.lineWidth = "1";
    ctx.fillStyle = warp[i];
    ctx.fillRect((i + 3) * w, h, w, h);
    ctx.strokeStyle = "#6C6C6C";
    ctx.strokeRect((i + 3) * w, h, w, h);
  }

  for (i = warp.length / warpRapport; i < warp.length; i++) {
    warp[i] = warp[i - warp.length / warpRapport];
    ctx.lineWidth = "1";
    ctx.fillStyle = warp[i];
    ctx.fillRect((i + 3) * w, h, w, h);
    ctx.strokeStyle = "#6C6C6C";
    ctx.strokeRect((i + 3) * w, h, w, h);
  }
}

function weft2() {
  for (var i = 0; i < weft.length / weftRapport; i++) {
    weft[i] = myColors[Math.floor(Math.random() * maxColors)];
    ctx.lineWidth = "1";
    ctx.fillStyle = weft[i];
    ctx.fillRect(w, (i + 3) * h, w, h);
    ctx.strokeStyle = "#6C6C6C";
    ctx.strokeRect(w, (i + 3) * h, w, h);
  }
  for (i = weft.length / weftRapport; i < weft.length; i++) {
    weft[i] = weft[i - weft.length / weftRapport];
    ctx.lineWidth = "1";
    ctx.fillStyle = weft[i];
    ctx.fillRect(w, (i + 3) * h, w, h);
    ctx.strokeStyle = "#6C6C6C";
    ctx.strokeRect(w, (i + 3) * h, w, h);
  }
}


function pattern() {

  for (y = 0; y < warp.length; y += 2) {

    for (x = 0; x < warp.length; x += 2) {

      ctx.lineWidth = "1";

      ctx.fillStyle = warp[x];
      ctx.fillRect((x + 3) * w, y * h + h * 3, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, y * h + h * 3, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 4) * w, y * h + h * 3, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, y * h + h * 3, w, h);
    }
  }

  for (a = 1; a < warp.length; a += 2) {

    for (b = 0; b < warp.length; b += 2) {

      ctx.lineWidth = "1";

      ctx.fillStyle = weft[a];
      ctx.fillRect((b + 3) * w, a * h + h * 3, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((b + 3) * w, a * h + h * 3, w, h);

      ctx.fillStyle = warp[b + 1];
      ctx.fillRect((b + 4) * w, a * h + h * 3, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((b + 4) * w, a * h + h * 3, w, h);
    }
  }
}
