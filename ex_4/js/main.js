let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

const color = d3
  .scaleOrdinal()
  .domain([
    "Burj Khalifa",
    "Shanghai Tower",
    "Abraj Al-Bait Clock Tower",
    "Ping An Finance Centre",
    "Golding Finance 117",
    "Lotte World Tower",
    "One World Trade Center",
    "Guangzhou CTF Finance Center",
    "Tianjin CTF Finance Center",
    "China Zun",
  ])
  .range([
    "RED",
    "BLUE",
    "YELLOW",
    "ORANGE",
    "INDIGO",
    "RED",
    "BLUE",
    "YELLOW",
    "ORANGE",
    "INDIGO",
  ]);

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

  const x = d3
    .scaleBand()
    .domain(data)
    .range([0, 400])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const y = d3.scaleLinear().domain([0, 828]).range([0, 400]);

  data.forEach((d) => {
    d.height = parseFloat(d.height);
  });

  console.log(`data`, data);

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
      return y(d.height);
    })
    .attr("fill", (d) => color(d.name));
};

main();
