var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 800)
  .attr("height", 800);

var circle = svg
  .append("circle")
  .attr("cx", 400)
  .attr("cy", 400)
  .attr("r", 100)
  .attr("fill", "blue");

var rect = svg
  .append("rect")
  .attr("x", 400)
  .attr("y", 400)
  .attr("width", 100)
  .attr("height", 100)
  .attr("fill", "red");
