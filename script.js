function getData() {
  return getFileData();
}

function disableSelection(element) {                                                                //Disables selecting of an element
  if (typeof element.onselectstart != 'undefined') {                                                //                |
    element.onselectstart = function() { return false; };                                           //                |
  } else if (typeof element.style.MozUserSelect != 'undefined') {                                   //                |
    element.style.MozUserSelect = 'none';                                                           //--------------------------------
  }
}

function resize() { //body.onResize
  document.all["grafZone"].style.width = document.documentElement.clientWidth - 200;                //Things, which happeneds on window resize
  document.all["grafBorder"].style.height = document.documentElement.clientHeight - 40;             //                |
  document.all["grafBorder"].style.width = document.documentElement.clientWidth - 240;              //                |
  document.all["grafPointer"].style.height = document.documentElement.clientHeight - 40;            //                |
  document.all["grafPointerVertical"].style.width = document.documentElement.clientWidth - 240;     //                |
  document.all["grafSelecter"].style.height = document.documentElement.clientHeight - 40;           //--------------------------------
}

var first = true;
var scroll = 0;
var mode = 0;
var toMove = 0;                                                                                     //Variables and maxValue counting
var values = getData().split(";");                                                                  //                |
var widthOfOneColumn = 100 / values.length;                                                         //                |
var maxValue = 0;                                                                                   //                |
var rightSideD = 0;                                                                                 //                |
for (var i = 0; i < values.length; i++) {                                                           //                |
  if (parseFloat(values[i]) > maxValue) {                                                           //                |
    maxValue = parseFloat(values[i]);                                                               //                |
  }                                                                                                 //                |
}                                                                                                   //--------------------------------

function load() { //body.onLoad  
  var masterA = 0;                                                                                  
  var masterN = 0;
                                                                                                    //Drawing (adding and counting) columns of graf
  for (var i = 0; i < values.length; i++) {                                                         //                |
    var N = getActiveEnergy(maxValue, parseFloat(values[i]))                                        //                |
    var A = parseFloat(values[i]) - N;                                                              //                |
    masterA += A;                                                                                   //                |
    masterN += N;                                                                                   //                |
    var AHeight = ((A * 100) / maxValue);                                                           //                |
    var NHeight = ((N * 100) / maxValue);                                                           //                |
                                                                                                    //                |
    document.all["grafBorder"].innerHTML += "<span class=\"grafColumnA\" style=\"height: " + AHeight + "%; left: " + i * widthOfOneColumn + "%; width: " + (widthOfOneColumn + 0.01) + "%;\"></span>";
    document.all["grafBorder"].innerHTML += "<span class=\"grafColumnN\" style=\"height: " + NHeight + "%; bottom: " + AHeight + "%; left: " + i * widthOfOneColumn + "%; width: " + (widthOfOneColumn + 0.01) + "%;\"></span>"
  }                                                                                                 //                |
  if (first) {                                                                                      //                |
    document.all["grafZone"].innerHTML = document.all["grafZone"].innerHTML + "<span id=\"grafPointer\" onMouseDown=\"down()\" onMouseUp=\"up()\" onLoad=\"disableSelection(this)\"></span>";
    document.all["grafZone"].innerHTML = document.all["grafZone"].innerHTML + "<span id=\"grafPointerVertical\" onMouseDown=\"down()\" onMouseUp=\"up()\" onLoad=\"disableSelection(this)\"></span>";
    document.all["grafZone"].innerHTML = document.all["grafZone"].innerHTML + "<span id=\"grafSelecter\"></span>";
  }                                                                                                 //                |
  first = false;                                                                                    //                |
  resize();                                                                                         //                |
  resize();                                                                                         //--------------------------------
  
  var master = masterA + masterN;
  
  var heightOfMasterGrafPart = 100 / master;
  
  document.all["masterGrafA"].style.height = heightOfMasterGrafPart * masterA;                      //Counting columns of maser graf and master values
  document.all["masterGrafN"].style.height = heightOfMasterGrafPart * masterN;                      //                |
  document.all["masterGrafA"].style.top = 20 + (heightOfMasterGrafPart * masterN);                  //                |
                                                                                                    //                |
  document.all["MasterA"].innerHTML = "<b>" + Math.round(masterA * 1000) / 1000 + "</b>";           //                |
  document.all["MasterN"].innerHTML = "<b>" + Math.round(masterN * 1000) / 1000 + "</b>";           //--------------------------------
  
}

var IE = document.all?true:false                                                                    //Detecting mouseMove
if (!IE) document.captureEvents(Event.MOUSEMOVE)                                                    //                |
document.onmousemove = move;                                                                        //                |
var tempX = 0                                                                                       //                |
var tempY = 0                                                                                       //--------------------------------

function move(e) {
  if (IE) {
    tempX = event.clientX + document.body.scrollLeft
    tempY = event.clientY + document.body.scrollTop
  } else {
    tempX = e.pageX
    tempY = e.pageY
  }
  
  if(mode == 0 || mode == 2 || mode == 3 || mode == 4) {
    if(isdown && !(tempX < 20 || tempX >= document.documentElement.clientWidth - 220 || tempY < 20 || tempY >= document.documentElement.clientHeight - 20)) {                                                                                      
      if (tempX < 20) {tempX = 20;}                                                                   
      if (tempX >= document.documentElement.clientWidth - 220) {tempX = document.documentElement.clientWidth - 221}
      if (leftSide > tempX) {
        var iL = getCoordinateFromId(tempX, widthOfOneColumn, -1);
        var iR = getCoordinateFromId(leftSide, widthOfOneColumn, 1);
        var rightSide = roundCoordinates(iL, widthOfOneColumn);
        rightSideD = rightSide;
        document.all["grafSelecter"].style.width = Math.abs(rightSide - leftSide);
        document.all["grafSelecter"].style.left = rightSide;
      } else if (leftSide < tempX) {
        var iL = getCoordinateFromId(leftSide, widthOfOneColumn, -1);
        var iR = getCoordinateFromId(tempX, widthOfOneColumn, 1);
        var rightSide = roundCoordinates(iR, widthOfOneColumn);
        rightSideD = rightSide;
        document.all["grafSelecter"].style.width = rightSide - leftSide;
        document.all["grafSelecter"].style.left = leftSide;
      }

      var SelA = 0;
      var SelN = 0;

      for (var i = iL; i < iR; i++) {
        var N2 = getActiveEnergy(maxValue, parseFloat(values[i]));
        var A2 = parseFloat(values[i]) - N2;
        SelA += A2;
        SelN += N2;
      }
      document.all["SelA"].innerHTML = Math.round(SelA * 1000) / 1000;
      document.all["SelN"].innerHTML = Math.round(SelN * 1000) / 1000;
    }
    if (tempX < 20 || tempX >= document.documentElement.clientWidth - 220 || tempY < 20 || tempY >= document.documentElement.clientHeight - 20) {
      tempX = 18;
      document.all["OverA"].innerHTML = "N/A";
      document.all["OverN"].innerHTML = "N/A";
    } else {
      var id = getIdFromCoordinates (tempX, widthOfOneColumn);
      var N = getActiveEnergy(maxValue, parseFloat(values[id]));
      var A = parseFloat(values[id]) - N;
      document.all["OverA"].innerHTML = Math.round(A * 1000) / 1000;
      document.all["OverN"].innerHTML = Math.round(N * 1000) / 1000;
    }
    document.all["grafPointer"].style.left = tempX;
    document.all["grafPointerVertical"].style.top = document.documentElement.clientHeight - 20;
    
  } else if(mode == 1) {
    if (tempX < 20 || tempX >= document.documentElement.clientWidth - 220 || tempY < 20 || tempY >= document.documentElement.clientHeight - 20) {
      tempY = document.documentElement.clientHeight - 20;
      document.all["grafPointerVertical"].style.top = tempY;
      document.all["grafPointer"].style.left = 18;
    } else {
      document.all["grafPointerVertical"].style.top = tempY;
      document.all["grafPointer"].style.left = 18;
    }
  }
  
  return true;
}

function cut() {
  mode = 1;
  document.all["OverA"].innerHTML = "N/A";
  document.all["OverN"].innerHTML = "N/A";
}

function getIdFromCoordinates(tempX, widthOfOneColumn) {
  return Math.floor(((tempX - 20) / (document.documentElement.clientWidth - 240) * 100) / widthOfOneColumn);
}

function getCoordinateFromId(tempX, widthOfOneColumn, floorCeil) {
  var coord;
  if (floorCeil == -1) {
    coord = Math.floor(((tempX - 20) / (document.documentElement.clientWidth - 240) * 100) / widthOfOneColumn);
  } else if (floorCeil == 1) {
    coord = Math.ceil(((tempX - 20) / (document.documentElement.clientWidth - 240) * 100) / widthOfOneColumn);
  } else {
    coord = false;
  }
  return coord;
}

function roundCoordinates(coord, widthOfOneColumn) {
  return coord * widthOfOneColumn * ((document.documentElement.clientWidth - 240) / 100) + 20;
}

var isdown = false;
var leftSide = 0;

function up() {
  console.log(mode);
  if (mode == 0 || mode == 2) {
    isdown = false;
  } else if (mode == 4) {
    isdown = false;
    var countOfColumnsInside = 0;
    for (var i = 0; i < values.length; i++) {
      var PixXL = i * ((document.documentElement.clientWidth - 240) / values.length) + 20;
      var PixXR = (i + 1) * ((document.documentElement.clientWidth - 240) / values.length) + 20;
      if (((leftSide <= rightSideD) && ((Math.round(PixXL * 10000) / 10000 >= Math.round(leftSide * 10000) / 10000) && (Math.round(PixXR * 10000) / 10000 <= Math.round(rightSideD * 10000) / 10000))) || ((leftSide >= rightSideD) && ((Math.round(PixXL * 10000) / 10000 >= Math.round(rightSideD * 10000) / 10000) && (Math.round(PixXR * 10000) / 10000 <= Math.round(leftSide * 10000) / 10000)))) {
        countOfColumnsInside+=1;
      }
    }
    for (var i = 0; i < values.length; i++) {
      var PixXL = i * ((document.documentElement.clientWidth - 240) / values.length) + 20;
      var PixXR = (i + 1) * ((document.documentElement.clientWidth - 240) / values.length) + 20;
      if (((leftSide <= rightSideD) && ((Math.round(PixXL * 10000) / 10000 >= Math.round(leftSide * 10000) / 10000) && (Math.round(PixXR * 10000) / 10000 <= Math.round(rightSideD * 10000) / 10000))) || ((leftSide >= rightSideD) && ((Math.round(PixXL * 10000) / 10000 >= Math.round(rightSideD * 10000) / 10000) && (Math.round(PixXR * 10000) / 10000 <= Math.round(leftSide * 10000) / 10000)))) {
        values[i] = parseFloat(values[i]) + (toMove / countOfColumnsInside);
      }
    }
    mode = 0;
    document.all["grafSelecter"].style.backgroundColor="rgba(0,0,153,0.4)";
    document.all["grafBorder"].innerHTML = "";
    load();
  }
}

function down() {
  console.log(mode);
  if (!(tempX < 20 || tempX >= document.documentElement.clientWidth - 220 || tempY < 20 || tempY >= document.documentElement.clientHeight - 20)) {
    if (mode == 0 || mode == 2 || mode == 3) {
      leftSide = roundCoordinates(getCoordinateFromId (tempX, widthOfOneColumn, -1), widthOfOneColumn);
      rightSideD = leftSide;
      document.all["grafSelecter"].style.left = leftSide;
      document.all["grafSelecter"].style.width = 0;
      document.all["SelA"].innerHTML = "N/A";
      document.all["SelN"].innerHTML = "N/A";
      isdown = true;
      if (mode == 2) {
        mode = 3;
        document.all["grafSelecter"].style.backgroundColor="rgba(153,0,0,0.4)";
      }
      if (mode == 3) {
        mode = 4;
        document.all["grafSelecter"].style.backgroundColor="rgba(153,0,0,0.4)";
      }
    } else if (mode == 1) {
      toMove = 0;
      var clickedValue = (maxValue - (maxValue * ((tempY - 20) / (document.documentElement.clientHeight - 40)))); 
      for (var i = 0; i < values.length; i++) {
        var PixXL = i * ((document.documentElement.clientWidth - 240) / values.length) + 20;
        var PixXR = (i + 1) * ((document.documentElement.clientWidth - 240) / values.length) + 20;
        if (((leftSide <= rightSideD) && ((Math.round(PixXL * 10000) / 10000 >= Math.round(leftSide * 10000) / 10000) && (Math.round(PixXR * 10000) / 10000 <= Math.round(rightSideD * 10000) / 10000))) || ((leftSide >= rightSideD) && ((Math.round(PixXL * 10000) / 10000 >= Math.round(rightSideD * 10000) / 10000) && (Math.round(PixXR * 10000) / 10000 <= Math.round(leftSide * 10000) / 10000)))) {
          if(clickedValue > values[i]) {
            toMove += parseFloat(values[i]);
            values[i] = 0;
          } else {
            toMove += clickedValue;
            values[i] = parseFloat(values[i]) - clickedValue;
          }
        }
      }
      document.all["grafBorder"].innerHTML = "";
      load();
      mode = 2;
    }
  }
  return false;
}

if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
    up();
    leftSide = 0;
    document.all["grafSelecter"].style.left = leftSide;
    document.all["grafSelecter"].style.width = 0;
    document.all["SelA"].innerHTML = "N/A";
    document.all["SelN"].innerHTML = "N/A";
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function() {
    up();
    leftSide = 0;
    document.all["grafSelecter"].style.left = leftSide;
    document.all["grafSelecter"].style.width = 0;
    document.all["SelA"].innerHTML = "N/A";
    document.all["SelN"].innerHTML = "N/A";
    window.event.returnValue = false;
  });
}

/*
this.addEventListener('mousewheel',function(event){
    
    if(event.wheelDelta > 0) {
      scroll ++;
    } else if(event.wheelDelta < 0) {
      scroll --;
    }
    
    console.log(scroll);
    
    return true;
}, false);
*/