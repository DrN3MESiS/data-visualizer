let svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.csv(
  "https://raw.githubusercontent.com/gcastillo56/d3Lab/master/resources/data/ages.csv"
).then((data) => {
  data.forEach((d) => {
    d.age = +d.age;
  });

  console.log(data);
});

d3.tsv(
  "https://raw.githubusercontent.com/gcastillo56/d3Lab/master/resources/data/ages.tsv"
).then((data) => {
  data.forEach((d) => {
    d.age = +d.age;
  });

  console.log(data);
});

try {
  d3.json(
    "https://raw.githubusercontent.com/gcastillo56/d3Lab/master/resources/data/ages.json"
  ).then((data) => {
    try {
      data.forEach((d) => {
        d.age = +d.age;
      });
    } catch (error) {
      console.error(
        "Something happened while parsing the age number > " + error
      );
    }

    let circles = svg.selectAll("circle").data(data);

    circles
      .enter()
      .append("circle")
      .attr("cx", (d, i) => {
        return i * 25 + 10;
      })
      .attr("cy", 200)
      .attr("r", (d) => {
        return d.age;
      })
      .attr("fill", "blue");

    console.log(data);
  });
} catch (error) {
  console.error("Something happened! > " + error);
}
