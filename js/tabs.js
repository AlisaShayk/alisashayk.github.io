function tabs() {


  const tab_width = "50%";
  const tab_height = "6%";

  let svg = d3.select("#map");

  let tab_ath = svg.append("g")
    .classed("tab", true)
    .classed("ath", true);

  tab_ath.append("text")
    .text("Attitudes towards homosexuals")
    .attr("x", "25%")
    .attr("y", "4%")
    .style("text-anchor", "middle");

  tab_ath.append("text")
    .classed("question", true)
    .text("Level of agreement on")
    .attr("x", "5%")
    .attr("y", "9%")
    .style("text-anchor", "start");
  tab_ath.append("text")
    .classed("question", true)
    .text("homosexuals being free to live their own life as they wish")
    .attr("x", "5%")
    .attr("y", "9%")
    .attr("dy", "1.2em")
    .style("text-anchor", "start");

  tab_ath.append("rect")
    .attr("width", tab_width)
    .attr("height", tab_height)
    .on("click", view_ath);

  let tab_dr = svg.append("g")
    .classed("tab", true)
    .classed("dr", true);

  tab_dr.append("text")
    .text("Discrimination rate")
    .attr("x", "75%")
    .attr("y", "4%")
    .style("text-anchor", "middle");

  tab_dr.append("text")
    .classed("question", true)
    .text("Percentage of homosexuals who felt discriminated or harassed")
    .attr("x", "95%")
    .attr("y", "9%")
    .style("text-anchor", "end");
  tab_dr.append("text")
    .classed("question", true)
    .text("on the grounds of sexual orientation")
    .attr("x", "95%")
    .attr("y", "9%")
    .attr("dy", "1.2em")
    .style("text-anchor", "end");

  tab_dr.append("rect")
    .attr("x", tab_width)
    .attr("width", tab_width)
    .attr("height", tab_height)
    .on("click", view_dr);

  view_ath();

  function view_ath() {
    // tab
    tab_dr.classed("selected", false);
    tab_ath.classed("selected", true);

    // map
    d3.select("#map .countries.dr")
      .attr("display", "none");
    d3.select("#map .countries.ath")
      .attr("display", null);

    // legend
    d3.select("#parallel-coordinated-plot .dimension.Discrimination_Rate .legend")
      .attr("display", "none");
    d3.select("#parallel-coordinated-plot .dimension.ATH .legend")
      .attr("display", null);
  }

  function view_dr() {
    //tab
    tab_ath.classed("selected", false);
    tab_dr.classed("selected", true);

    // map
    d3.select("#map .countries.ath")
      .attr("display", "none");
    d3.select("#map .countries.dr")
      .attr("display", null);

    // legend
    d3.select("#parallel-coordinated-plot .dimension.ATH .legend")
      .attr("display", "none");
    d3.select("#parallel-coordinated-plot .dimension.Discrimination_Rate .legend")
      .attr("display", null);
  }

  d3.selection.prototype.move_to_front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };


  function wrap(text, width) {

      let
        words = text.text().split(/\s+/).reverse();
      console.log(words);
      let
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
        console.log(line);
        tspan.text(line.join(" "));
        console.log(tspan.node().getComputedTextLength())
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
  }

}
