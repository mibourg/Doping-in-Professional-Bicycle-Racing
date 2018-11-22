var json = {};

var jsonRequest = new XMLHttpRequest();
jsonRequest.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", true);
jsonRequest.responseType = "";
jsonRequest.onload = function () {
  var json = JSON.parse(jsonRequest.responseText);
  makeGraph(json);
  console.log(json);
};
jsonRequest.send();

function makeGraph(json) {
  var width = 1000;
  var height = 600;

  var svg = d3.select("#visualization").
  append("svg").
  attr("width", width).
  attr("height", height).
  attr("background-color", "blue");

  var title = svg.append("text").
  attr("id", "title").
  text("Doping in Professional Bicycle Racing").
  attr("y", "55").
  attr("x", width / 2 / 2);

  var subtitle = svg.append("text").
  attr("id", "subtitle").
  text("35 Fastest Times Up Alpe d'Huez in the Tour de France").
  attr("y", 80).
  attr("x", width / 2 / 2 + 65);

  var years = [];
  var timesInSeconds = [];

  for (var i = 0; i < json.length; i++) {
    years[i] = json[i].Year;
    timesInSeconds[i] = json[i].Seconds;
  }

  var x = d3.scaleLinear().range([0, width - 125]);

  var y = d3.scaleTime().range([0, height - 125]);

  var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

  var yAxis = d3.axisLeft(y).tickFormat(function (d) {return parseInt(d / 60) + ":" + (d % 60).toString().padEnd(2, "0");});

  x.domain([d3.min(years) - 2, d3.max(years) + 1]);

  svg.append("g").
  attr("id", "x-axis").
  call(xAxis).
  attr("transform", "translate(90, " + (height - 20) + ")");

  y.domain([d3.min(timesInSeconds) - 20, d3.max(timesInSeconds) + 20]);

  svg.append("g").
  attr("id", "y-axis").
  call(yAxis).
  attr("transform", "translate(90,105)");

  svg.append("text").
  attr("id", "y-axis-title").
  text("Time in Minutes").
  attr("transform", "translate(40, 414) rotate(270)");

  var div = d3.select("body").
  append("div").
  attr("id", "tooltip").
  style("opacity", "0");

  svg.selectAll(".dot").
  data(json).
  enter().
  append("circle").
  attr("class", "dot").
  attr("r", 6).
  attr("cx", function (d) {
    return x(d.Year) + 90;
  }).
  attr("cy", function (d) {
    return y(d.Seconds) + 105;
  }).
  attr("fill", function (d) {
    return d.Doping.length !== 0 ? "#f46d43" : "#66bd63";
  }).
  on("mouseover", function (d) {
    d3.select(this).
    attr("r", 7.5);
    div.html(d.Name + " - " + d.Nationality + "<br />" +
    "Time: " + d.Time + " in " + d.Year + "<br />" +
    d.Doping);
    div.style("opacity", 1);
    div.style("left", d3.event.pageX + 20 + "px");
    div.style("top", d3.event.pageY - 25 + "px");
  }).
  on("mouseout", function (d) {
    d3.select(this).
    attr("r", 6);
    div.html("");
    div.style("opacity", 0);
  });

  svg.append("text").
  text("Doping allegations").
  attr("transform", "translate(802, 200)").
  attr("font-family", "\"Karla\", sans-serif");

  svg.append("rect").
  attr("fill", "#f46d43").
  attr("transform", "translate(952.5, 185)").
  attr("width", "20").
  attr("height", "20");

  svg.append("text").
  text("No doping allegations").
  attr("transform", "translate(780, 230)").
  attr("font-family", "\"Karla\", sans-serif");;

  svg.append("rect").
  attr("fill", "#66bd63").
  attr("transform", "translate(952.5, 215)").
  attr("width", "20").
  attr("height", "20");
}