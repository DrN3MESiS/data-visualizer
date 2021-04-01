const margin = { top: 10, right: 10, bottom: 100, left: 100 };
const width = 600;
const height = 300;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom);

const g = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

const setupEnvironment = (x, y, data) => {
  const bottomAxis = d3
    .axisBottom(x)
    .ticks(data.length)
    .tickValues(data)
    .tickPadding(5);

  g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  const leftAxis = d3
    .axisLeft(y)
    .ticks(5)
    .tickFormat((d) => {
      return d + "m";
    });
  g.append("g").attr("class", "left axis").call(leftAxis);

  g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("fill", "red")
    .text("Height (m)");

  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill", "red")
    .text("The word's tallest buildings");
};

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

  let topHeight = 0;
  const dataNames = data.map((v) => {
    if (v.height > topHeight) {
      topHeight = v.height;
    }
    return v.name;
  });

  const color = d3.scaleOrdinal().domain(dataNames).range(d3.schemeSet3);

  const x = d3
    .scaleBand()
    .domain(dataNames)
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const y = d3.scaleLinear().domain([0, topHeight]).range([height, 0]);

  setupEnvironment(x, y, dataNames);

  data.forEach((d) => {
    d.height = parseFloat(d.height);
  });

  let rectangles = g.selectAll("rect").data(data);

  rectangles
    .enter()
    .append("rect")
    .attr("x", (d, i) => {
      return x(d.name);
    })
    .attr("y", (d) => {
      return y(d.height);
    })
    .attr("width", 30)
    .attr("height", (d) => {
      return height - y(d.height);
    })
    .attr("fill", (d) => color(d.name));
};

main();
