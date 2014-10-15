function getData() {
  return getFileData();
}

function resizeDouble() {
  resize();
  resize();
}

function disableSelection(element) {
  if (typeof element.onselectstart != 'undefined') {
    element.onselectstart = function() { return false; };
  } else if (typeof element.style.MozUserSelect != 'undefined') {
    element.style.MozUserSelect = 'none';
  }
}

function resize() {
  document.all["grafZone"].style.width = document.documentElement.clientWidth - 200;
  document.all["grafBorder"].style.height = document.documentElement.clientHeight - 40;
  document.all["grafBorder"].style.width = document.documentElement.clientWidth - 240;
  document.all["grafPointer"].style.height = document.documentElement.clientHeight - 40;
  document.all["grafPointerVertical"].style.width = document.documentElement.clientWidth - 240;
  document.all["grafSelecter"].style.height = document.documentElement.clientHeight - 40;
  //document.all["alert"].style.top = (document.documentElement.clientHeight - 400) / 2;
  //document.all["alert"].style.left = (document.documentElement.clientWidth - 600) / 2;
  for (var pocitadlo = 1; pocitadlo <= (maxValue / 10); pocitadlo++) {
    document.all["VerticalLine" + pocitadlo].style.bottom = ((document.documentElement.clientHeight - 40) / (maxValue / 10)) * pocitadlo;
    document.all["VerticalLine" + pocitadlo].style.width = document.documentElement.clientWidth - 240;
  }
}

var oldA = 0;
var oldN = 0;

var first = true;
var scroll = 0;
var mode = 0;
var toMove = 0;
var values = getData().split(";");
var widthOfOneColumn = 100 / values.length;
var maxValue = 300;
var rightSideD = 0;
//for (var i = 0; i < values.length; i++) {
//  if (parseFloat(values[i]) > maxValue) {
//    maxValue = parseFloat(values[i]);
//  }
//}

function load() {
  var masterA = 0;                                                                                  
  var masterN = 0;

  for (var i = 0; i < values.length; i++) {
/*    if(parseFloat(values[i]) > maxValue) {
      for (var i = 0; i < values.length; i++) {
        if (parseFloat(values[i]) > maxValue) {
          maxValue = parseFloat(values[i]);
        }
      } 
      document.all["grafBorder"].innerHTML = "";
      load();
      return;
    }  */
    var N = getOverallLvLosses(parseFloat(values[i]))
    var A = parseFloat(values[i]) - N;
    masterA += A;
    masterN += N;
    var AHeight = ((A * 100) / maxValue);
    var NHeight = ((N * 100) / maxValue);

    document.all["grafBorder"].innerHTML += "<span class=\"grafColumnA\" style=\"height: " + AHeight + "%; left: " + i * widthOfOneColumn + "%; width: " + (widthOfOneColumn + 0.01) + "%;\"></span>";
    document.all["grafBorder"].innerHTML += "<span class=\"grafColumnN\" style=\"height: " + NHeight + "%; bottom: " + AHeight + "%; left: " + i * widthOfOneColumn + "%; width: " + (widthOfOneColumn + 0.01) + "%;\"></span>"
  }
  for (var pocitadlo = 1; pocitadlo <= (maxValue / 10); pocitadlo++) {
    if (pocitadlo % 10 == 0) {
      document.all["grafBorder"].innerHTML = document.all["grafBorder"].innerHTML + "<span class=\"grafLineVerticalStrong3\" id=\"VerticalLine" + pocitadlo + "\">" + pocitadlo * 10 + "</span>";
    } else {
      document.all["grafBorder"].innerHTML = document.all["grafBorder"].innerHTML + "<span class=\"grafLineVerticalStrong1\" id=\"VerticalLine" + pocitadlo + "\"></span>";
    }
  }
  if (first) {
    document.all["grafZone"].innerHTML = document.all["grafZone"].innerHTML + "<span id=\"grafSelecter\"></span>";
    document.all["grafZone"].innerHTML = document.all["grafZone"].innerHTML + "<span id=\"grafPointer\" onMouseDown=\"down(event)\" onMouseUp=\"up(event)\" onLoad=\"disableSelection(this)\"></span>";
    document.all["grafZone"].innerHTML = document.all["grafZone"].innerHTML + "<span id=\"grafPointerVertical\" onMouseDown=\"down(event)\" onMouseUp=\"up(event)\" onLoad=\"disableSelection(this)\"></span>";
    oldA = masterA;
    oldN = masterN;
  }
  first = false;
  resize();
  resize();
  
  var master = oldA + oldN;
  
  var widthOfMasterGrafPart = 165 / master;
  
  document.all["masterGrafOldA"].style.width = widthOfMasterGrafPart * oldA;
  document.all["masterGrafOldN"].style.width = widthOfMasterGrafPart * oldN;
  document.all["masterGrafOldA"].style.left = 15 + (widthOfMasterGrafPart * oldN);

  document.all["MasterOldA"].innerHTML = "<b>" + Math.round(oldA * 1000) / 1000 + "</b>";
  document.all["MasterOldN"].innerHTML = "<b>" + Math.round(oldN * 1000) / 1000 + "</b>";
  document.all["MasterOldP"].innerHTML = "<b>" + Math.round((oldN / master) * 100000) / 1000 + "%</b>";
  
  document.all["masterGrafA"].style.width = widthOfMasterGrafPart * masterA;
  document.all["masterGrafN"].style.width = widthOfMasterGrafPart * masterN;
  document.all["masterGrafA"].style.left = 15 + (widthOfMasterGrafPart * masterN);

  document.all["MasterA"].innerHTML = "<b>" + Math.round(masterA * 1000) / 1000 + "</b>";
  document.all["MasterN"].innerHTML = "<b>" + Math.round(masterN * 1000) / 1000 + "</b>";
  document.all["MasterP"].innerHTML = "<b>" + Math.round((masterN / master) * 100000) / 1000 + "%</b>";
  
}

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = move;
var tempX = 0
var tempY = 0

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
        var N2 = getOverallLvLosses(parseFloat(values[i]));
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
      var N = getOverallLvLosses(parseFloat(values[id]));
      var A = parseFloat(values[id]) - N;
      document.all["OverA"].innerHTML = Math.round(A * 1000) / 1000;
      document.all["OverN"].innerHTML = Math.round(N * 1000) / 1000;
    }
    document.all["grafPointer"].style.left = tempX - 1;
    document.all["grafPointerVertical"].style.top = document.documentElement.clientHeight - 20;
    
  } else if(mode == 1) {
    if (tempX < 20 || tempX >= document.documentElement.clientWidth - 220 || tempY < 20 || tempY >= document.documentElement.clientHeight - 20) {
      tempY = document.documentElement.clientHeight - 20;
      document.all["grafPointerVertical"].style.top = tempY - 1;
      document.all["grafPointer"].style.left = 18;
    } else {
      document.all["grafPointerVertical"].style.top = tempY - 1;
      document.all["grafPointer"].style.left = 18;
    }
  }
  
  return true;
}

function cut() {
  if (document.all["SelA"].innerHTML == "N/A") {
    window.alert("Nic není vybráno!")
  } else {
    mode = 1;
    document.all["cutButton"].style.display = "none";
    document.all["pasteButton"].style.display = "none";
    document.all["OverA"].innerHTML = "N/A";
    document.all["OverN"].innerHTML = "N/A";
  }
}

function paste() {
  if (document.all["SelA"].innerHTML == "N/A") {
    window.alert("Nic není vybráno!")
  } else {
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
    document.all["Cuted"].innerHTML = "N/A";
    document.all["cutButton"].style.display = "block";
    document.all["pasteButton"].style.display = "none";
    document.all["grafBorder"].innerHTML = "";
    load();
  }
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

function up(e) {
  if (e.which == 1) {
    if (mode == 0 || mode == 2) {
      isdown = false;
    }
  }
}

function down(e) {
  e = e || window.event;
  if (e.which == 1) {
    if (!(tempX < 20 || tempX >= document.documentElement.clientWidth - 220 || tempY < 20 || tempY >= document.documentElement.clientHeight - 20)) {
      if (mode == 0 || mode == 2 || mode == 3) {
        leftSide = roundCoordinates(getCoordinateFromId (tempX, widthOfOneColumn, -1), widthOfOneColumn);
        rightSideD = leftSide;
        document.all["grafSelecter"].style.left = leftSide;
        document.all["grafSelecter"].style.width = 0;
        document.all["SelA"].innerHTML = "N/A";
        document.all["SelN"].innerHTML = "N/A";
        isdown = true;
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
        document.all["Cuted"].innerHTML = Math.round(toMove * 1000) / 1000;
        document.all["grafBorder"].innerHTML = "";
        load();
        mode = 0;
        document.all["cutButton"].style.display = "none";
        document.all["pasteButton"].style.display = "block";
      }
    }
  } else {
    showMenu();
  }
  return false;
}

function buttonOverOut(obj, num) {
  if (num < 0) {
    obj.style.backgroundColor = '#EEEEEE';
  } else if (num > 0) {
    obj.style.backgroundColor = '#999999';
  }
}

function showMenu() {
  
}

if (document.addEventListener) {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function() {
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