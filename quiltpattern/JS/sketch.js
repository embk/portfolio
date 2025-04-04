var myColors = [];

var myWeftColors = [];

var maxColors = 5;

var maxWeftColors = 5;

var w = 30; // width of rect in pattern
var h = 30; // height of rect in pattern

var warp = [];
var weft = [];

var warpCount = 30; //initial number of warp ends
var weftCount = 30; // initial number of weft ends

var warpRapport = 5; // initial no. of repeating warp
var weftRapport = 5; // initial no. of repeating weft

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");


var colorpick1;
var colorpick2;
var colorpick3;
var colorpick4;
var colorpick5;

var colorpickweft1;
var colorpickweft2;
var colorpickweft3;
var colorpickweft4;
var colorpickweft5;

var patternRepeat;

var weaveChoose;


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



  colorpickweft1 = document.getElementById("colweft1");
  colorpickweft2 = document.getElementById("colweft2");
  colorpickweft3 = document.getElementById("colweft3");
  colorpickweft4 = document.getElementById("colweft4");
  colorpickweft5 = document.getElementById("colweft5");

  colorpickweft1.value = myWeftColors[0];
  colorpickweft2.value = myWeftColors[1];
  colorpickweft3.value = myWeftColors[2];
  colorpickweft4.value = myWeftColors[3];
  colorpickweft5.value = myWeftColors[4];

  colorpickweft1.addEventListener("change", colweft1Change, false);
  colorpickweft2.addEventListener("change", colweft2Change, false);
  colorpickweft3.addEventListener("change", colweft3Change, false);
  colorpickweft4.addEventListener("change", colweft4Change, false);
  colorpickweft5.addEventListener("change", colweft5Change, false);

  var b = document.getElementById("numberColors");
  b.addEventListener("change", numberCol, false);

  var f = document.getElementById("numberColorsWeft");
  f.addEventListener("change", numberColWeft, false);

  var t = document.getElementById("chooseDent");
  t.addEventListener("change", heddleDent, false);

  var f = document.getElementById("chooseNumRepWarp");
  f.addEventListener("change", numRepeatWarp, false);

  var d = document.getElementById("chooseNumRepWeft");
  d.addEventListener("change", numRepeatWeft, false);

  var h = document.getElementById("chooseWeave");
  h.addEventListener("change", weaveWeave, false);

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

  /*console.log("number col: ", b);*/

  maxColors = b;
  makePattern();
}

function numberColWeft(event) {

  f = event.target.value;

  /*console.log("number colWeft: ", f);*/

  maxWeftColors = f;
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

function colweft1Change(event) {
  myWeftColors[0] = event.target.value;
  makePattern();

}

function colweft2Change(event) {
  myWeftColors[1] = event.target.value;
  makePattern();
}

function colweft3Change(event) {
  myWeftColors[2] = event.target.value;
  makePattern();
}

function colweft4Change(event) {
  myWeftColors[3] = event.target.value;
  makePattern();
}

function colweft5Change(event) {
  myWeftColors[4] = event.target.value;
  makePattern();
}

function randomColor() {
  for (i = 0; i < 5; i++) {
    myColors[i] = '#' + (Math.floor(Math.random() * 2 ** 24)).toString(16).padStart(6, '0');
    document.getElementById("col" + (i + 1)).value = myColors[i];
    myWeftColors[i] = myColors[i];
    document.getElementById("colweft" + (i + 1)).value = myWeftColors[i];
  }

  /*console.log("random colors: ", myColors);*/
  makePattern();
}


function heddleDent(event) {
  warpCount = event.target.value;
  weftCount = event.target.value;
  makeGrid();
  makePattern();
}


function weaveWeave(event) {
  weave = event.target.value;
  console.log("weave", weave);
  if (weave=="plain") {
      makePattern();

  }else if(weave=="twill"){
    makeTwillPattern();
  }
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

  /*console.log("make grid", warpCount, " x ", weftCount);*/

  //dynamical count of warp und weft
  for (i = 0; i < warpCount; i++) {
    warp.push(0);
  }

  for (i = 0; i < weftCount; i++) {
    weft.push(0);
  }

  c.width = (warp.length + 4) * w;
  c.height = (weft.length + 4) * h;

}

function makePattern() {
  ctx.clearRect(0, 0, c.width, c.height);
  warp2();
  weft2();
  pattern();
  document.getElementById("check").style.background = "#ffffff";

}

function makeTwillPattern() {
  ctx.clearRect(0, 0, c.width, c.height);
  warp2();
  weft2();
  twillPattern();
  document.getElementById("check").style.background = "#ffffff";

}

function fixedWarp() {
  ctx.clearRect(0, 0, c.width, c.height);
  warpAgain();
  weft2();
  pattern();
  document.getElementById("check").style.background = "#ffffff";
}


function saveImage() {

  var canvas = document.getElementById("myCanvas");

  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(myCanvas.msToBlob(), "canvas-image.jpeg");
  } else {

    var image = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "pattern.jpeg";
    link.href = image;
    link.click();
  }
}


function repeat() {

  var warpRepeat = warpCount / warpRapport;
  var weftRepeat = weftCount / weftRapport;

  ctx.beginPath();
  ctx.lineWidth = "7";
  ctx.strokeStyle = "#ff00ff";
  ctx.lineCap = "round";
  ctx.moveTo(w + (w * 2), h * (weft.length + 2));
  ctx.lineTo((w * 3) + w * warpRepeat, h * (weft.length + 2));
  ctx.lineTo((w * 3) + w * warpRepeat, h * (weft.length + 3));
  ctx.lineTo(w + (w * 2), h * (weft.length + 3));
  ctx.lineTo(w + (w * 2), h * (weft.length + 2));
  ctx.stroke();


  ctx.beginPath();
  ctx.lineWidth = "7";
  ctx.strokeStyle = "#ff00ff";
  ctx.lineCap = "round";
  ctx.moveTo(w, h * (weft.length + 1));
  ctx.lineTo(w + w, h * (weft.length + 1));
  ctx.lineTo(w + w, h * ((weft.length + 1) - weftRepeat));
  ctx.lineTo(w, h * ((weft.length + 1) - weftRepeat));
  ctx.lineTo(w, h * (weft.length + 1));
  ctx.stroke();

}

function warpAgain(){


    for (var i = 0; i < warp.length / warpRapport; i++) {

      ctx.lineWidth = "1";
      ctx.fillStyle = warp[i];
      ctx.fillRect((i + 3) * w, h, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((i + 3) * w, h, w, h);
    }

    for (i = warp.length / warpRapport; i < warp.length; i++) {

      ctx.lineWidth = "1";
      ctx.fillStyle = warp[i];
      ctx.fillRect((i + 3) * w, h, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((i + 3) * w, h, w, h);
    }

}



function warp2() {

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
    /*console.log("i1", i);*/
    weft[i] = myWeftColors[Math.floor(Math.random() * maxWeftColors)];
    ctx.lineWidth = "1";
    ctx.fillStyle = weft[i];
    ctx.fillRect(w, (i + 3) * h, w, h);
    ctx.strokeStyle = "#6C6C6C";
    ctx.strokeRect(w, (i + 3) * h, w, h);
  }
  for (i = weft.length / weftRapport; i < weft.length; i++) {
    /*console.log("i2", i);*/
    weft[i] = weft[i - weft.length / weftRapport];
    ctx.lineWidth = "1";
    ctx.fillStyle = weft[i];
    ctx.fillRect(w, (i + 3) * h, w, h);
    ctx.strokeStyle = "#6C6C6C";
    ctx.strokeRect(w, (i + 3) * h, w, h);
  }
}




/*
function pattern() {

  for (y = 0; y < weft.length; y += 2) {



    for (x = 0; x < warp.length; x += 2) {


      ctx.lineWidth = "1";

      ctx.fillStyle = warp[x];
      ctx.fillRect((x + 3) * w, y * h + h, w, h);

      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, y * h + h, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 4) * w, y * h + h, w, h);
        console.log(y * h + h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, y * h + h, w, h);
    }
  }

  for (y = 1; y < weft.length; y += 2) {



    for (x = 0; x < warp.length; x += 2) {


      ctx.lineWidth = "1";

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 3) * w, y * h + h, w, h);

      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, y * h + h, w, h);

      ctx.fillStyle = warp[x + 1];
      ctx.fillRect((x + 4) * w, y * h + h, w, h);

      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, y * h + h, w, h);
    }
  }
}*/



function pattern() {

  for (y = 0; y < weft.length; y += 2) {

    var yPos = y * h + h * 3;



    console.log("yPos1", yPos);

    for (x = 0; x < warp.length; x += 2) {


      ctx.lineWidth = "1";

      ctx.fillStyle = warp[x];
      ctx.fillRect((x + 3) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, yPos, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 4) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, yPos, w, h);
    }
  }

  for (y = 1; y < weft.length; y += 2) {

    var yPos = y * h + h * 3;

    console.log("yPos2", yPos);

    for (x = 0; x < warp.length; x += 2) {

      ctx.lineWidth = "1";

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 3) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, yPos, w, h);

      ctx.fillStyle = warp[x + 1];
      ctx.fillRect((x + 4) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, yPos, w, h);
    }
  }
}


function twillPattern() {


  for (y = 0; y < weft.length; y += 3) {
    /*console.log("y1", y);*/

    var yPos = y * h + h * 3;


    console.log("y1", yPos);

    for (x = 0; x < warp.length; x += 3) {

      ctx.lineWidth = "1";

      ctx.fillStyle = warp[x];
      ctx.fillRect((x + 3) * w, yPos, w, h);
      /*console.log("fillRect", yPos);*/
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, yPos, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 4) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, yPos, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 5) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 5) * w, yPos, w, h);
    }
  }
  for (y = 1; y < weft.length; y += 3) {
    console.log("y2", y);

    var yPos = y * h + h * 3;

    for (x = 0; x < warp.length; x += 3) {

      ctx.lineWidth = "1";

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 3) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 3) * w, yPos, w, h);


      ctx.fillStyle = warp[x+1];
      ctx.fillRect((x + 4) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, yPos, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 5) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 5) * w, yPos, w, h);
    }
  }
  for (y = 2; y < weft.length; y += 3) {
  console.log("y3", y);

    var yPos = y * h + h * 3;

    for (x = 0; x < warp.length; x += 3) {

      ctx.lineWidth = "1";

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 3) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x+ 3) * w, yPos, w, h);

      ctx.fillStyle = weft[y];
      ctx.fillRect((x + 4) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 4) * w, yPos, w, h);

      ctx.fillStyle = warp[x+2];
      ctx.fillRect((x + 5) * w, yPos, w, h);
      ctx.strokeStyle = "#6C6C6C";
      ctx.strokeRect((x + 5) * w, yPos, w, h);
    }
  }
}
