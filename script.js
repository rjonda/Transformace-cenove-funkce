function resizeDouble() {
  resize();
  resize();
}

// Editable
var margin = 30;
var maxValue = 20;
var paintCorrection = 0.01; // %                   
///Ediatble

var selected = [];

var data = getMainData().split(";");
var boiler = getBoilerData().split("!");
var boilerCount = 0;
var isMouseDown = false;

var last_was_number = true;

var sumA = 0;
var sumN = 0;

for (var i = 0; i < boiler.length; i++) {
  if (parseFloat(boiler[i].split(";")[1]) > 0) {
    if (! last_was_number) {
      boilerCount++;
    }
    last_was_number = true;
  } else {
    last_was_number = false;
  }
}

var colorChange = (255 * 2) / boilerCount;

function resize() {
  document.getElementById("graph").style.width = (document.documentElement.clientWidth - 200 - (2 * margin)) + "px";
  document.getElementById("graph").style.height = (document.documentElement.clientHeight - (2 * margin)) + "px";
  document.getElementById("graph").style.top = (margin) + "px";
  document.getElementById("graph").style.left = (margin) + "px";
  
  document.getElementById("alert").style.top = (document.documentElement.clientHeight - 400) / 2;
  document.getElementById("alert").style.left = (document.documentElement.clientWidth - 600) / 2;
}

function load() {
  document.getElementById("dark").style.display = "none";
  document.getElementById("alert").style.display = "none";
  
  var boiler_number_total = -1;
  
  var widthOfOneCol = 100 / data.length;
  var id = "";
  
  for (var y = 0; y < (boiler.length / data.length); y++) {
    
    var boiler_number = -1;
    var last = 0;
    
    var count = 0;
    
    for (var i = 0; i < data.length; i++) {
      
      var RAW = boiler[i + (y * data.length)].split(";");
      var id = RAW[0];
      var val = RAW[1];
        
      if (parseFloat(val) > 0) {
      
        count++;
        
        if (last == 0) {
          boiler_number++;
          boiler_number_total++;
        }
      
        var contain = "";
        
        var color = getBgColor(boiler_number_total);                            
        var color_mode = getColorMode(boiler_number_total);
        
        var bottom = getBottomMargin(i);
      
        if (last == 0) {
          document.getElementById("boiler_list").innerHTML += "<div id=\"" + id + "_" + boiler_number + "_menu\" class=\"menu\" style=\"top: " + (boiler_number_total * 27) + "px; background-color: " + color + "; color: " + getForeColor(boiler_number_total) + ";\" onMouseOver=\"mouseOver(this)\" onMouseOut=\"mouseOut(this)\" onClick=\"mouseClick(this)\">ID: " + id + "_" + boiler_number + "</div>"
        }
        
        if(color_mode == "light") {
          document.getElementById("graph").innerHTML += "<div id=\"" + id + "_" + boiler_number + "_" + (count - 1) + "\" class=\"" + i + "\"><div class=\"col_light\" style=\"bottom: " + bottom + "%; left: " + (widthOfOneCol * i) + "%; width: " + (widthOfOneCol + paintCorrection) + "%; height: " + (100 * val) / maxValue + "%; background-color: " + color + "; \" onMouseOver=\"mouseOver(this)\" onMouseOut=\"mouseOut(this)\" onMouseDown=\"mouseDown(this)\" onMouseUp=\"mouseUp(this)\"></div></div>";
        } else {
          document.getElementById("graph").innerHTML += "<div id=\"" + id + "_" + boiler_number + "_" + (count - 1) + "\" class=\"" + i + "\"><div class=\"col_dark\" style=\"bottom: " + bottom + "%; left: " + (widthOfOneCol * i) + "%; width: " + (widthOfOneCol + paintCorrection) + "%; height: " + (100 * val) / maxValue + "%; background-color: " + color + "; \" onMouseOver=\"mouseOver(this)\" onMouseOut=\"mouseOut(this)\" onMouseDown=\"mouseDown(this)\" onMouseUp=\"mouseUp(this)\"></div></div>";
        }

        last += val;
        
        if (parseFloat(boiler[i + (y * data.length) + 1].split(";")[1]) == 0) {

          document.getElementById("data").innerHTML += "<div id=\"" + id + "_" + boiler_number + "_data\" class=\"hide\">" + count + "</div>";
        }
        
      } else {
        last = 0;
        count = 0;  
      }
    }
  }
  
  for (var i = 0; i < data.length; i++) {
    var bottom = getBottomMargin(i);
    var sum = parseFloat(data[i]);
  
    var N = getOverallLvLosses(sum);
    var A = sum - N - ((maxValue * bottom) / 100);
    
    document.getElementById("graph").innerHTML += "<div id=\"a_" + i + "\" class=\"" + i + "\"><div class=\"col_a\" style=\"bottom: " + bottom + "%; left: " + (widthOfOneCol * i) + "%; width: " + (widthOfOneCol + paintCorrection) + "%; height: " + (100 * A) / maxValue + "%\"></div></div>";
    document.getElementById("graph").innerHTML += "<div id=\"n_" + i + "\" class=\"" + i + "\"><div class=\"col_n\" style=\"bottom: " + (((100 * A) / maxValue) + bottom) + "%; left: " + (widthOfOneCol * i) + "%; width: " + (widthOfOneCol + paintCorrection) + "%; height: " + (100 * N) / maxValue + "%\"></div></div>";
  
    sumA += sum - N;
    sumN += N;
  }
  
  document.getElementById("sumGraph_a_old").innerHTML = Math.round(sumA * 1000) / 1000;
  document.getElementById("sumGraph_n_old").innerHTML = Math.round(sumN * 1000) / 1000;
  
  document.getElementById("sumGraph_graph_a_old").style.width = ((100 * sumA) / (sumA + sumN)) + "%";
  document.getElementById("sumGraph_graph_n_old").style.width = ((100 * sumN) / (sumA + sumN)) + "%";
  
  resizeDouble();
}

function mouseOver(obj) {

}

function mouseOut(obj) {

}

var IE = document.all?true:false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = mouseMove;
var mouseX = 0;
var mouseY = 0;

var startMouseX = 0;
var startMouseY = 0;

var moveColumns = 0;

function mouseMove(e) {
  if (IE) {
    mouseX = event.clientX + document.body.scrollLeft
    mouseY = event.clientY + document.body.scrollTop
  } else {
    mouseX = e.pageX
    mouseY = e.pageY
  }
  if (isMouseDown) {    
    var widthOfOneColPx = parseFloat(document.getElementById("graph").style.width) / data.length;
    
    var relativeMoveColumns = parseInt((mouseX - startMouseX) / widthOfOneColPx) - moveColumns;

    if (parseFloat(selected[0].className) + relativeMoveColumns >= 0 && parseFloat(selected[selected.length - 1].className) + relativeMoveColumns < data.length) {
      moveColumns = parseInt((mouseX - startMouseX) / widthOfOneColPx);
      moveBoilers(selected, relativeMoveColumns);
    }
    redrawColumns(selected);
    selectBoilers(selected, selected[0].id.split("_")[0] + "_" + selected[0].id.split("_")[1] + "_");
  }
}

function mouseDown(obj) {
  moveColumns = 0;
  startMouseX = mouseX;
  startMouseY = mouseY;

  isMouseDown = true;  
  mouseClick(obj);
}

function mouseUp(obj) {  
  isMouseDown = false;
}

function mouseClick(obj) {
  var process = obj.parentNode.id.split("_");
  if (obj.id.split("_").length > 1) {
    process = obj.id.split("_");
  }
  var id = process[0] + "_" + process[1] + "_";
  var count = parseInt(document.getElementById(id + "data").innerHTML);
  if (selected.length > 0) {
    unselectBoilers(selected, selected[0].id.split("_")[0] + "_" + selected[0].id.split("_")[1] + "_");
  }
  selected = [];
  for (var i = 0; i < count; i++) {
    selected.push(document.getElementById(id + i));
  }
  
  redrawColumns(selected);
  selectBoilers(selected, id)
}

function switchAlert(obj) {
  if (obj.id == "InputType-OwnData") {
    var cols = document.getElementsByClassName('moreOptions');
    for(i=0; i<cols.length; i++) {
      cols[i].style.display = "inline-block";
    }
  } else {
    var cols = document.getElementsByClassName('moreOptions');
    for(i=0; i<cols.length; i++) {
      cols[i].style.display = "none";
    }
  }
}

function buttonOverOut(obj, num) {
  if (num < 0) {
    obj.className = 'button'
  } else if (num > 0) {
    obj.className = 'buttonOver'
  }
}

function go() {
  if (document.getElementById("InputType-OwnData").checked) {
    document.getElementById("TrafoData-Label").innerHTML = document.getElementById("TrafoData-Label").innerHTML.replace("<img src=\"Images/error.png\">", "<span></span>");
    document.getElementById("BoilerData-Label").innerHTML = document.getElementById("BoilerData-Label").innerHTML.replace("<img src=\"Images/error.png\">", "<span></span>");
    document.getElementById("GrafData-Label").innerHTML = document.getElementById("GrafData-Label").innerHTML.replace("<img src=\"Images/error.png\">", "<span></span>");
    if ((parseInt(document.getElementById("TrafoData").value) > 0) && (!(document.getElementById("BoilerData").value == "")) && (!(document.getElementById("GrafData").value == ""))) {
      
      
      
    } else {
      if (!(parseInt(document.getElementById("TrafoData").value) > 0)) {
        document.getElementById("TrafoData-Label").innerHTML = document.getElementById("TrafoData-Label").innerHTML.replace("<span></span>", "<img src=\"Images/error.png\">");
      }
      if (document.getElementById("BoilerData").value == "") {
        document.getElementById("BoilerData-Label").innerHTML = document.getElementById("BoilerData-Label").innerHTML.replace("<span></span>", "<img src=\"Images/error.png\">");
      }
      if (document.getElementById("GrafData").value == "") {
        document.getElementById("GrafData-Label").innerHTML = document.getElementById("GrafData-Label").innerHTML.replace("<span></span>", "<img src=\"Images/error.png\">");
      }
    }
  } else {
    
  }
}

function getBgColor(y) {
  var result = "";

  var starting = "rgb(";
  var ending = ")";
  var separator = ", ";
  
  var colo = Math.floor(colorChange * y);
  if (colo > 255) {
    colo -= 255;
    result = starting + colo + separator + colo + separator + "255" + ending;
  } else {
    result = starting + "0" + separator + "0" + separator + colo + ending;
  }
  
  return result;
}

function getForeColor(y) {
  var result = "";

  var light = "rgb(255, 255, 255)";
  var dark = "rgb(0, 0, 0)";
  
  var colo = Math.floor(colorChange * y);
  if (colo > 255) {
    result = dark;
  } else {
    result = light;
  }
  
  return result;
}

function getColorMode(y) {
  var result = "";

  var light = "light";
  var dark = "dark";
  
  var colo = Math.floor(colorChange * y);
  if (colo > 255) {
    result = light;
  } else {
    result = dark;
  }
  
  return result;
}

function getBottomMargin(classname) {
  var objs = document.getElementsByClassName(classname);
  var bottom = 0;
  if (objs.length > 0) {
    var obj = objs[objs.length - 1].getElementsByTagName("div")[0];
    bottom = parseFloat(obj.style.height);
    bottom += parseFloat(obj.style.bottom);
  }
  return bottom;
}

function redrawColumns(list) {
  sumA = 0;
  sumN = 0;
  for (var i = 0; i < data.length; i++) {
    var bottom = 0;
    var underMain = 0;
    var realtiveId = i - parseFloat(list[0].className);
    if(realtiveId >= 0 && realtiveId < list.length) {
      bottom = parseFloat(list[realtiveId].getElementsByTagName("div")[0].style.height);
      list[realtiveId].getElementsByTagName("div")[0].style.bottom = "0";
    }
    var elements = document.getElementsByClassName(i)
    for (var y = 0; y < elements.length; y++) {
      var element = elements[y];
      if(realtiveId >= 0 && realtiveId < list.length) {
        if(element != list[realtiveId]) {
          element.getElementsByTagName("div")[0].style.bottom = bottom + "%";
          bottom += parseFloat(element.getElementsByTagName("div")[0].style.height);
        }
      } else {
        element.getElementsByTagName("div")[0].style.bottom = bottom + "%";
        bottom += parseFloat(element.getElementsByTagName("div")[0].style.height);
      }
      if (!("a_" + i == element.id || "n_" + i == element.id)) {
        underMain += parseFloat(element.getElementsByTagName("div")[0].style.height);
      }
    }
    
    var sum = (maxValue * bottom) / 100;
  
    var N = getOverallLvLosses(sum)
    var A = sum - N;
    document.getElementById("n_" + i).getElementsByTagName("div")[0].style.height = ((100 * N) / maxValue) + "%";
    document.getElementById("n_" + i).getElementsByTagName("div")[0].style.bottom = ((100 * A) / maxValue) + "%";
    document.getElementById("a_" + i).getElementsByTagName("div")[0].style.height = (((100 * A) / maxValue) - underMain) + "%";
    document.getElementById("a_" + i).getElementsByTagName("div")[0].style.bottom = underMain + "%";
    
    sumA += A;
    sumN += N;
  }
  
  document.getElementById("sumGraph_a_new").innerHTML = Math.round(sumA * 1000) / 1000;
  document.getElementById("sumGraph_n_new").innerHTML = Math.round(sumN * 1000) / 1000;
  
  document.getElementById("sumGraph_graph_a_new").style.width = ((100 * sumA) / (sumA + sumN)) + "%";
  document.getElementById("sumGraph_graph_n_new").style.width = ((100 * sumN) / (sumA + sumN)) + "%";
}

function selectBoilers(list, id) {
  var selecter = document.getElementById("selecter");
  selecter.style.left = (parseFloat(list[0].getElementsByTagName("div")[0].style.left) - 0.15) + "%";
  selecter.style.backgroundColor = list[0].getElementsByTagName("div")[0].style.backgroundColor;
  var width = 0;  
  for (var i = 0; i < list.length; i++) {
    width += parseFloat(list[i].getElementsByTagName("div")[0].style.width);
  }
  selecter.style.width = width + "%";
  selecter.style.display = "block";

  document.getElementById(id + "menu").className = "menu_selected";
}

function unselectBoilers(list, id) {
  document.getElementById("selecter").style.display = "none";

  document.getElementById(id + "menu").className = "menu";
}

function moveBoilers(list, move) {
  for (var i = 0; i < list.length; i++) {
    var col = parseFloat(list[i].className);
    col += move;
    list[i].className = col;
    list[i].getElementsByTagName("div")[0].style.left = (col * (100 / data.length)) + "%";
  }
}