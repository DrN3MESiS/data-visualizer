d3.csv("./data/ages.csv").then((data) => {
  console.log(data);
});

d3.tsv("./data/ages.tsv").then((data) => {
  console.log(data);
});

d3.json("./data/ages.json").then((data) => {
  console.log(data);
});
