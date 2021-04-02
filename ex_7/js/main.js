/*
 *    main.js
 */
const margin = { top: 10, right: 10, bottom: 150, left: 100 };

const width = 600;
const height = 400;

const g = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

let data = [];

const updateFrame = (data, x, y, xAxis, yAxis, flag) => {
  const value = flag ? "revenue" : "profit";

  let monthNames = data.map((e) => e.month);
  let maxRevenue = d3.max(data, (d) => {
    return d.revenue;
  });
  x.domain(monthNames);
  y.domain([0, maxRevenue]);

  const bottomAxis = d3.axisBottom(x).ticks(monthNames.length).tickValues(monthNames).tickPadding(2);

  xAxis.call(bottomAxis).selectAll("text").attr("x", "15").attr("text-anchor", "end").style("fill", "black");

  const leftAxis = d3
    .axisLeft(y)
    .ticks(5)
    .tickFormat((d) => {
      return "$" + d;
    });
  yAxis.call(leftAxis).selectAll("text").style("fill", "black");

  /** Update Data */
  const tangles = g.selectAll("rect").data(data);
  tangles.exit().remove();

  tangles
    .attr("x", (d) => {
      return x(d.month);
    })
    .attr("y", (d) => {
      return y(d[value]);
    })
    .attr("width", x.bandwidth)
    .attr("height", (d) => {
      return height - y(d[value]);
    });

  tangles
    .enter()
    .append("rect")

    .attr("x", (d) => {
      return x(d.month);
    })
    .attr("y", (d) => {
      return y(d[value]);
    })
    .attr("width", x.bandwidth)
    .attr("height", (d) => {
      return height - y(d[value]);
    })
    .attr("fill", value === "revenue" ? "yellow" : "orange");
};

const main = async () => {
  console.log("Main start");

  /** Load Data */
  try {
    data = await d3.json("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/projects/brewery/data/revenues.json");
  } catch (e) {
    console.error("ERR" + e);
    return;
  }

  /** Process and Ranges*/

  data = data.map((d) => {
    d.revenue = parseFloat(d.revenue);
    d.profit = parseFloat(d.profit);
  });

  const x = d3.scaleBand().range([0, width]).paddingInner(0.3).paddingOuter(0.3);
  const y = d3.scaleLinear().range([height, 0]);
  const xAxis = g
    .append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")");

  const yAxis = g.append("g").attr("class", "left axis");

  /** Labeling */
  g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .style("fill", "black")
    .text("Revenue (dlls.)");

  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom / 3)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .text("Month");

  let flag = true;

  // Rendering

  d3.interval(() => {
    var newData = flag ? data : data.slice(1);
    updateFrame(newData, x, y, xAxis, yAxis, flag);
    flag = !flag;
  }, 1000);
  updateFrame(data, x, y, xAxis, yAxis, flag);
};

main();
