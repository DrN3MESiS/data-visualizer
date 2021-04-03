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

let yearLabel = null;
let t = d3.transition().duration(750);

const updateFrame = (data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year) => {
  let curData = data[year];
  $("#year")[0].innerHTML = +(year + 1800);
  yearLabel.text(+(year + 1800));
  var continent = $("#continent-select").val();

  curData = curData.filter((d) => {
    if (continent == "all") {
      return true;
    } else {
      return d.continent == continent;
    }
  });

  // BOTTOM AXIS
  const bottomAxis = d3
    .axisBottom(xScale)
    .ticks(3)
    .tickValues([400, 4000, 40000])
    .tickFormat((d) => {
      return "$" + d;
    });
  xAxis.transition(t).call(bottomAxis).selectAll("text").attr("x", "15").attr("text-anchor", "end").style("fill", "black");

  // LEFT AXIS
  const leftAxis = d3.axisLeft(yScale);
  yAxis.call(leftAxis).selectAll("text").style("fill", "black");

  //TIP
  let tip = d3
    .tip()
    .attr("class", "d3-tip")
    .html((d) => {
      var text = "<strong>Country:</strong>";

      text += "<span style='color:red'> " + d.country + "</span><br>";

      text += "<strong>Continent:</strong> ";

      text += "<span style='color:red;text-transform:capitalize'>" + d.continent + "</span><br>";

      text += "<strong>Life Expectancy:</strong>";

      text += "<span style='color:red'>" + d3.format(".2f")(d.life_exp) + "</span><br>";

      text += "<strong>GDP Per Capita:</strong>";

      text += "<span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";

      text += "<strong>Population:</strong>";

      text += "<span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";

      return text;
    });
  g.call(tip);

  /** Update Data */
  const cyr = g.selectAll("circle").data(curData, (d) => {
    return d.country;
  });

  cyr.exit().transition(t).remove();

  cyr
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xScale(d.income);
    })
    .attr("cy", (d) => {
      return yScale(d.life_exp);
    })
    .attr("fill", (d) => {
      return colorScale(d.continent);
    })
    .attr("r", (d) => {
      return Math.sqrt(areaScale(d.population) / Math.PI);
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    .merge(cyr)
    .transition(t)
    .attr("cx", (d) => {
      return xScale(d.income);
    })
    .attr("cy", (d) => {
      return yScale(d.life_exp);
    })
    .attr("fill", (d) => {
      return colorScale(d.continent);
    })
    .attr("r", (d) => {
      return Math.sqrt(areaScale(d.population) / Math.PI);
    });

  $("#date-slider").slider("value", +(year + 1800));
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

  let continentNames = new Set();
  let ages = new Set();

  data = data.map((year) => {
    return year["countries"]
      .filter((country) => {
        var dataExists = country.income && country.life_exp;

        return dataExists;
      })
      .map((country) => {
        continentNames.add(country.continent);
        country.income = +country.income;

        country.life_exp = +country.life_exp;
        ages.add(Math.ceil(country.life_exp));

        return country;
      });
  });

  const xScale = d3.scaleLog().range([0, width]).domain([142, 150000]);
  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 90]);
  const areaScale = d3
    .scaleLinear()
    .domain([2000, 1_400_000_000])
    .range([25 * Math.PI, 1500 * Math.PI]);
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

  yearLabel = g
    .append("text")
    .attr("class", "x axis-label")
    .attr("x", width - 35)
    .attr("y", height)
    .attr("font-size", "35px")
    .attr("text-anchor", "middle")
    .style("fill", "black");

  // Continent Labels
  let legend = g.append("g").attr("transform", "translate(" + (width - 10) + "," + (height - 125) + ")");

  [...continentNames.values()].map((continent, i) => {
    let legendRow = legend.append("g").attr("transform", "translate(0, " + i * 20 + ")");
    legendRow.append("rect").attr("width", 10).attr("height", 10).attr("fill", colorScale(continent));
    legendRow.append("text").attr("x", -10).attr("y", 10).attr("text-anchor", "end").style("text-transform", "capitalize").text(continent);
  });

  let year = 0;
  let interval = null;

  const step = () => {
    year = year < 214 ? year + 1 : 0;

    updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
  };

  $("#play-button").on("click", () => {
    let button = $("#play-button");

    if (button.text() == "Play") {
      button.text("Pause");

      interval = setInterval(step, 100);
    } else {
      button.text("Play");

      clearInterval(interval);
    }
  });

  $("#reset-button").on("click", () => {
    if (interval) {
      clearInterval(interval);
      let button = $("#play-button");
      button.text("Play");
    }

    year = 0;
    updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
  });

  $("#date-slider").slider({
    max: 2014,
    min: 1800,
    step: 1,
    animate: "fast",
    slide: (event, ui) => {
      // Events
      year = ui.value - 1800;
      updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
    },
  });

  $("#continent-select").on("change", () => {
    updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
  });

  updateFrame(data, xScale, yScale, areaScale, colorScale, xAxis, yAxis, year);
};

main();
