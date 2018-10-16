function map(width_ratio = 0.45, height_ratio = 1) {

  /* country code */
  const OUR_COUNTRIES = ["BE", "BG", "CY", "CZ", "DK", "EE", "FI",
    "FR", "DE", "HU", "IE", "IT", "LT", "NL",
    "PL", "PT", "SK", "SI", "ES", "SE", "GB"];

  /* projection */
  const COORDINATES = [12, 59.6]; // longitude and latitude coordinates
  const SCALE = 650; //default is 150, higher means zoom in, lower means zoom out

  /* color scale */
  const COLOR_SCALE_DOMAIN = {
    ath: [-2, -1, 0, 1, 2],
    dr: [0, 25, 50, 75, 100]
  };

  const COLOR_SCALE_RANGE = {
    ath: ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'], // colorbrewer diverging
    dr: ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']  // colorbrewer sequencial single hue
  };

  let width = screen.width * width_ratio;
  let height = screen.height * height_ratio;

  let projection = d3.geo.mercator()
    .center(COORDINATES) // center map on coordinates
    .translate([width / 2, height / 2])
    .scale(SCALE);


  let div = d3.select("body")
    .append("div")
    .classed("map", true)
    .style("width", `${width_ratio*100}%`)
    .style("height", `${height_ratio*100}%`);

  let svg = div.append("svg")
    .attr("id", "map")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  d3.json("data/world_countries.json", function (error, map_data) {

    if (error) throw error;

    svg.append("g")
      .classed("countries", true)
      .classed("context", true)
      .selectAll("path")
      .data(map_data["features"])
      .enter()
      .append("path")
      .filter(function (d) { return !OUR_COUNTRIES.includes(d.properties["iso_a2"]); })
      .classed("context", true)
      .attr("code", function (d) { return d.properties["iso_a2"]; })
      .attr("name", function (d) { return d.properties["name_long"]; })
      .attr("d", d3.geo.path().projection(projection));

    add_map("ath");
    add_map("dr");

    function add_map(view) {

      let g = svg.append("g")
        .classed("countries", true)
        .classed(view, true)
        .attr("display", view === "ath" ? null : "none");

      d3.json("data/our_countries.json", function (error, data) {

        if (error) throw error;

        let color_scale = d3.scale.linear()
          .domain(COLOR_SCALE_DOMAIN[view])
          .range(COLOR_SCALE_RANGE[view]);

        g.selectAll("path")
          .data(data["features"])
          .enter()
          .append("path")
          .filter(function (d) {
            return OUR_COUNTRIES.includes(d.properties["iso_a2"]);
          })
          .classed("country", true)
          .attr("code", function (d) {
            return d.properties["iso_a2"];
          })
          .attr("name", function (d) {
            return d.properties["name_long"];
          })
          .attr("d", d3.geo.path().projection(projection))
          .style("fill", function (d) {
            return color_scale(d.properties[view])
          })
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
              // remove brush state
              d3.select("#parallel-coordinated-plot").classed("brushed", false);
              // remove brush
              resetbrush();
              let brush = d3.selectAll("#parallel-coordinated-plot .brush");
              brush.select(".extent").attr("height", 0);
              brush.select(".resize").attr("display", "none");
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

  });


  d3.selection.prototype.move_to_front = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };


  (function drop_shadow(svg) { // source: http://dahlström.net/svg/filters/arrow-with-dropshadow-lighter.svg

    let defs = svg.append("defs"); // put filter in defs element

    let filter = defs.append("filter")
      .attr("id", "drop-shadow") // create filter with id #drop-shadow
      .attr("svg_height", "130%"); // so that the shadow is not clipped

    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha") // opacity of graphic that this filter will be applied to
      .attr("stdDeviation", 4) // convolve that with a Gaussian with standard deviation 3
      /*.attr("result", "blur")*/; // store result in blur

    filter.append("feOffset")
    /*.attr("in", "blur")*/
      .attr("dx", 0) // translate output of Gaussian blur to the right
      .attr("dy", 1.5) // and downwards with 2px
      .attr("result", "offsetBlur"); // sore result in offsetBlur

    let feComponentTransfer = filter.append("feComponentTransfer");

    feComponentTransfer.append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.2);

    let feMerge = filter.append("feMerge"); // overlay original SourceGraphic over translated blurred opacity
                                            // by using feMerge filter, order of specifying inputs is important!
    feMerge.append("feMergeNode")
    /*.attr("in", "offsetBlur")*/;
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

  })(d3.select("svg#map")); // call right after definition

}