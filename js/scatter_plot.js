function  scatter_plot(width_ratio = 0.42, height_ratio = 0.35) {

  let margin = {
    left: 0.1 * screen.width * width_ratio,
    right: 0.1 * screen.width * width_ratio,
    top: 0.10 * screen.height * height_ratio,
    bottom: 0.05 * screen.height * height_ratio
  };
  let width = screen.width * width_ratio - margin.left - margin.right;
  let height = screen.height * height_ratio - margin.top - margin.bottom;

  // setup x
  let x_scale = d3.scale.linear()
    .range([0, width])
    .domain([1,100]);
  let x_axis = d3.svg.axis()
    .scale(x_scale)
    .orient("bottom")
    .ticks(10);

  // setup y
  let y_scale = d3.scale.linear()
    .range([height, 0])
    .domain([-2,2]);
  let y_axis = d3.svg.axis()
    .scale(y_scale)
    .orient("left")
    .ticks(5);


  let div = d3.select("body")
    .append("div")
    .classed("scatter-plot",true)
    .style("width", `${width_ratio*100}%`)
    .style("height", `${height_ratio*100}%`);

  let svg = div.append("svg")
    .attr("id", "scatter-plot")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  //LOAD DATA for SCATTER PLOT
  
  d3.json("data/data.json", function (error, data) {

    if (error) throw error;

    // x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y_scale.range()[0]/2 + ")")
      .call(x_axis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -35)
      .style("text-anchor", "end")
      .text("Discrimination rate");

    svg.select(".x.axis .label")
      .attr("dy", "0.71em")
      .call(wrap, 100);

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

    // y-axis
    svg.append("g")
      .attr("class", "y axis")
      .call(y_axis)
      .append("text")
      .attr("class", "label")
      .attr("x", 15)
      .attr("y", 0)
      .style("text-anchor", "start")
      .text("Attitudes towards homosexuals");

    svg.select(".y.axis .label")
      .attr("dy", "0.71em")
      .call(wrap, 100);

    // draw dots
    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .classed("country", true)
      .attr("code", function(d) { return d["iso_a2"];})
      .attr("name", function (d) { return d["country_name"]; })
      // .attr("class", "dot")
      .attr("r", "0.3em")
      .attr("cx", function(d) { return x_scale(d["dr"]);})
      .attr("cy", function(d) { return y_scale(d["ath"]);})
      .on("mouseover", function () {
        d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
          .classed("hovered", true)
          .move_to_front();
      })
      .on("mouseout", function () {
        d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
          .classed("hovered", false)
          .move_to_front();
        d3.selectAll(".selected")
          .move_to_front();
      })
      .on("click", function () {
        // if brushed before, deselect brush
        if (d3.select("#parallel-coordinated-plot").classed("brushed")) {
          // remove brushed state
          d3.select("#parallel-coordinated-plot").classed("brushed", false);
          // remove brush
          resetbrush();
          d3.selectAll("#parallel-coordinated-plot .brush .extent").attr("height", 0);
          d3.selectAll("#parallel-coordinated-plot .brush .resize").attr("display", "none");
          // deselect countries
          d3.selectAll(".country.selected")
            .classed("selected", false);
          // select clicked country
          d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
            .classed("selected", true);
        }
        // otherwise handle click
        else {
          if (d3.select(this).classed("selected")) { // already selected
            d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
              .classed("selected", false);
          } else {
            d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
              .classed("selected", true)
              .move_to_front();
          }
        }
      });
  });

}