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

const updateFrame = (data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year) => {
  const curData = data[year]
  // BOTTOM AXIS
  const bottomAxis = d3.axisBottom(xScale).ticks(3).tickValues([400,4000,40000]).tickFormat((d) => {
    return "$" + d;
  })
  xAxis.call(bottomAxis).selectAll("text").attr("x", "15").attr("text-anchor", "end").style("fill", "black");
  
  // LEFT AXIS
  const leftAxis = d3
    .axisLeft(yScale)
  yAxis.call(leftAxis).selectAll("text").style("fill", "black");


  /** Update Data */
  const cyr = g.selectAll("circle").data(curData);
  cyr.exit().remove();

  cyr
    .attr("cx", (d) => {
      return xScale(d.income);
    })
    .attr("cy", (d) => {
      return yScale(d.life_exp);
    })
    .attr("fill", (d) => { return colorScale(d.continent) })
    .attr("r", (d) => { return Math.sqrt(areaScale(d.population)/Math.PI) });

  cyr
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xScale(d.income);
    })
    .attr("cy", (d) => {
      return yScale(d.life_exp);
    })
    .attr("fill", (d) => { return colorScale(d.continent) })
    .attr("r", (d) => { return Math.sqrt(areaScale(d.population)/Math.PI) });
};

const main = async () => {
  console.log("Main start");

  /** Load Data */
  try {
    data = await d3.json("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/projects/leaf_project/data/data.json");
  } catch (e) {
    console.error("ERR" + e);
    return;
  }

  /** Process and Ranges*/

  let continentNames = new Set()
  let ages = new Set()
  
  data = data.map((year) => {
    return year["countries"]
      .filter((country) => {
        var dataExists = country.income && country.life_exp;

        return dataExists;
      })
      .map((country) => {
        continentNames.add(country.continent)
        country.income = +country.income;

        country.life_exp = +country.life_exp;
        ages.add(Math.ceil(country.life_exp))

        return country;
      });
  });

  const xScale = d3.scaleLog().range([0, width]).domain([142, 150000])
  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 90])
  const areaScale = d3.scaleLinear().domain([2000, 1_400_000_000]).range([25*Math.PI, 1500*Math.PI])
  const colorScale = d3.scaleOrdinal().range(d3.schemePastel1).domain(continentNames.values());

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
    .text("Life Expectancy (Years)");

  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom / 3)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .text("GDP Per Capita ($)");

  let year = 0
  d3.interval(() => {
    updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
    year++;
    if(year >= data.length){ 
      year = 0
    }
  }, 1000);
  updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
};

main();
