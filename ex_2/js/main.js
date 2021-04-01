let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

let data = [25, 20, 15, 10, 5];

let rectangles = svg.selectAll("circle").data(data);

rectangles
  .enter()
  .append("rect")
  .attr("x", (d, i) => {
    return i * 100;
  })
  .attr("y", 350)
  .attr("width", 40)
  .attr("height", (d) => {
    console.log(`Height: `, d);
    return d;
  })
  .attr("fill", "red");
