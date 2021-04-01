let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 1000);

const main = async () => {
  let data = [];
  try {
    data = await d3.json(
      "https://raw.githubusercontent.com/gcastillo56/d3Lab/master/resources/data/buildings.json"
    );
  } catch (error) {
    console.error("Error parsing data > " + error);
    return;
  }

  data.forEach((d) => {
    d.height = parseFloat(d.height);
  });

  let rectangles = svg.selectAll("rect").data(data);

  rectangles
    .enter()
    .append("rect")
    .attr("x", (d, i) => {
      return i * 50 + 10;
    })
    .attr("y", 0)
    .attr("width", 30)
    .attr("height", (d) => {
      return d.height;
    })
    .attr("fill", "red");
};

main();
