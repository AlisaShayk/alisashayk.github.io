var g;

function parallel_coordinate_plot(width_ratio = 0.42, height_ratio = 0.65) {

  var margin = {
    left: 0.1 * screen.width * width_ratio,
    right: 0.1 * screen.width * width_ratio,
    top: 0.05 * screen.height * height_ratio,
    bottom: 0.13 * screen.height * height_ratio
  };

  var width = screen.width * width_ratio - margin.left - margin.right;
  var height = screen.height * height_ratio - margin.top - margin.bottom;


  var dimensions = [
    /*{
      name: "country",
      scale: d3.scale.ordinal().rangePoints([0, height]),
      type: "string"

    },*/
    {
      name: "ATH",
      scale: d3.scale.linear().range([height, 0]).domain([-2,2]),
      type: "number",
      beautiful_name: "Attitudes towards homosexuals"
    },
    {
      name: "Discrimination_Rate",
      scale: d3.scale.linear().range([height, 0]).domain([0,100]),
      type: "number",
      beautiful_name: "Discrimination rate"
    },
    {
      name: "education",
      scale: d3.scale.linear().range([height, 0]).domain([0,8]),
      type: "number",
      beautiful_name: "Education"
    },
    {
      name: "civil rights",
      scale: d3.scale.linear().range([height, 0]).domain([-4,21]),
      type: "number",
      beautiful_name: "Civil rights"
    },
    {
      name: "religiosity",
      scale: d3.scale.linear().range([height, 0]).domain([0,10]),
      type: "number",
      beautiful_name: "Religiosity"
    },
    {
      name: "social conservatism",
      scale: d3.scale.linear().range([height, 0]).domain([1,5]),
      type: "number",
      beautiful_name: "Social conservatism"
    },


  ];


  var x = d3.scale.ordinal().domain(dimensions.map(function(d) { return d.name; })).rangePoints([0, width]),
    y = {},
    dragging = {};

  var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

  /*var svg = d3.select("body")
    .append("div")
    .classed("parallel-coordinated-plot",true)
    .append("svg")
    .attr("id", "parallel-coordinated-plot")
    .attr()
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/

  var div = d3.select("body")
    .append("div")
    .classed("parallel-coordinated-plot",true)
    .style("width", `${width_ratio*100}%`)
    .style("height", `${height_ratio*100}%`);

  var svg = div.append("svg")
    .attr("id", "parallel-coordinated-plot")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //LOAD DATA for PARALLEL COORDINATES




  d3.csv("data/data.csv", function(error, data) {

    //Create the dimensions depending on attribute "type" (number|string)
    //The x-scale calculates the position by attribute dimensions[x].name
    /*dimensions.forEach(function(dimension) {
      dimension.scale.domain(dimension.type === "number"
        ? d3.extent(data, function(d) { return +d[dimension.name]; })
        : data.map(function(d) { return d[dimension.name]; }).sort());
    });*/
    /*console.log(dimensions[1]);*/


    /*// Add grey background lines for context.
        background = svg.append("g")
          .attr("class", "background")
          .selectAll("path")
          .data(data)
          .enter().append("path")
          .attr("d", path);*/

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter().append("path")
      .attr("d", path)
      .classed("country", true)
      .attr("code", function (d) { return d["iso_a2"]; })
      .attr("name", function (d) { return d["country"]; })
      .on("mouseover", function () {
        if (d3.select(this).classed("selected")) { // mouse over only for selected countries
          d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
            .classed("hovered", true)
            .move_to_front();
        }
      })
      .on("mouseout", function () {
        // if (d3.select(this).classed("selected")) { // mouse over only for selected countries
        d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
          .classed("hovered", false)
          .move_to_front();
        d3.selectAll(".selected")
          .move_to_front();
        // }
      });


    // Add a group element for each dimension.
    g = svg.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("class", function(d) { return d.name})
      .classed("dimension", true)
      .attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d.name)}; })
        .on("dragstart", function(d) {
          dragging[d.name] = x(d.name);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions.map(function(d) { return d.name; }));
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d.name];
          transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
          transition(foreground).attr("d", path);
          background
            .attr("d", path)
            .transition()
            .delay(500)
            .duration(0)
            .attr("visibility", null);
        })
      );


    // Add an axis and title.
    g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(d.scale)); })
      .append("text")
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .attr("y", height)
      .text(function(d) { return d.beautiful_name; });

    g.selectAll((".axis-label"))
      .attr("dy", "0.71em")
      .call(wrap, x.rangeBand());

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }


    const COLOR_SCALE_RANGE = {
      ath: ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'], // colorbrewer diverging
      dr: ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']  // colorbrewer sequencial single hue
    };

    add_legend("ATH", COLOR_SCALE_RANGE["ath"]);
    add_legend("Discrimination_Rate", COLOR_SCALE_RANGE["dr"]);


    function add_legend(view, scale_range) {

      let legend = svg.select(`.dimension.${view}`)
        .append("g")
        .classed("legend", true)
        .attr("display", view === "ATH" ? null : "none");

      let gradient = legend.append("defs")
        .append('linearGradient')
        .attr('id', `gradient${view}`)
        .attr('x1', '0%') // bottom
        .attr('y1', '100%')
        .attr('x2', '0%') // to top
        .attr('y2', '0%')
        .attr('spreadMethod', 'pad');

      let pct = linspace(0, 100, scale_range.length).map(function(d) {
        return Math.round(d) + '%';
      });

      let colourPct = d3.zip(pct, scale_range);

      colourPct.forEach(function(d) {
        gradient.append('stop')
          .attr('offset', d[0])
          .attr('stop-color', d[1])
          .attr('stop-opacity', 1);
      });

      legend.append("rect")
        // .attr('x', -4)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('width', 7)
        .attr('height', height)
        .style('fill', `url(#gradient${view})`)
        .style("stroke", "#b4b4b4")
        .style("stroke", "#b4b4b4");

      function linspace(start, end, n) {
        var out = [];
        var delta = (end - start) / (n - 1);

        var i = 0;
        while(i < (n - 1)) {
          out.push(start + (i * delta));
          i++;
        }

        out.push(end);
        return out;
      }
    }


    // Add and store a brush for each axis.
    g.append("g")
      .attr("class", "brush")
      .each(function(d) { // for each of these brush elements, add
        d3.select(this).call(d.scale.brush = d3.svg.brush().y(d.scale).on("brushstart", brushstart).on("brush", brush));

      })
      .selectAll("rect") // creates rectangles
      .attr("x", -8)
      .attr("width", 16);
  });

  function position(d) {
    var v = dragging[d.name];
    return v == null ? x(d.name) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(dimension) {
      var v = dragging[dimension.name];
      var tx = v == null ? x(dimension.name) : v;
      // console.log(d[dimension.name]);
      // console.log([tx, dimension.scale(+d[dimension.name])]);
      return [tx, dimension.scale(+d[dimension.name])];
    }));

  }

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }


  // Handles a brush event, toggling the display of foreground lines.
  function brush() {

    d3.selectAll(".country.selected")
      .classed("selected", false);

    var actives = dimensions.filter(function(p) { return !p.scale.brush.empty(); })
    // active dimensions (as objects), i.e. those that have a non empty brush
    // console.log("actives ", actives);

    if (actives.length > 0) {

      // add brushed state
      d3.select("#parallel-coordinated-plot").classed("brushed", true);
      // add brush
      d3.selectAll("#parallel-coordinated-plot .brush .resize").attr("display", null);


      let extents = actives.map(function (p) {
        return p.scale.brush.extent();
      });
      // coordinates of the brush: 2 numbers on the scale, bottom and up
      // console.log("extents ", extents);
      // foreground is a selection of all the path this plot
      /*foreground.classed("selected", function (d) { // put as selected all brushed paths
        // "every" checks that for every dimension,
        // the value of a country is inside the brush
        return actives.every(function (p, i) {

          return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];

        }) ? true : false;


      });*/

      let to_select = foreground.filter(function(d) { // put as selected all brushed paths
        return actives.every(function (p, i) {
          return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];
        });
      });
      console.log("++to select ", to_select);
      to_select.each( function() {
        // console.log("code ", d3.select(this).attr("code"));
        d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
          .classed("selected", true)
          .move_to_front();
      });

      let to_deselect = foreground.filter(function(d) { // put as selected all brushed paths
        return actives.every(function (p, i) {
          return !(extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1]);
        });
      });
      console.log("--to deselect ", to_deselect);
      to_deselect.each( function() {
        // console.log("code ", d3.select(this).attr("code"));
        d3.selectAll(`[code=${d3.select(this).attr("code")}]`)
          .classed("selected", false)
      });

    }

  }

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

}

function resetbrush() {
  g.each(function (d) {
    d.scale.brush
      .clear()
      .event(d3.select(".brush"));
  });
}