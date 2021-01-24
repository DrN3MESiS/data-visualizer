let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

let data = [25, 20, 15, 10, 5];

let rectangles = svg.selectAll("rect").data(data);

rectangles
  .enter()
  .append("rect")
  .attr("cx", (d, i) => {
    console.log(i);
    return i * 20;
  })
  .attr("cy", 200)
  .attr("r", (d) => {
    return d;
  })
  .attr("fill", "yellow");
