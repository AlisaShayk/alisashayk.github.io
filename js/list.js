function list(width_ratio = 0.13, height_ratio = 1) {
  /*marginL = {top: 30, right: 20, bottom: 30, left: 70},
    widthL = 100 - marginL.left - marginL.right,
    heightL = 500 - marginL.top - marginL.bottom;

  var ul = d3.select('body').append('div').classed('list', true).append('ul');

  d3.csv("data.csv", function(error, data) {
    var myArray = [];
    data.forEach(function(d,i){
      d.ATH = +d.ATH;
      d.Discrimination_Rate = +d.Discrimination_Rate;
      myArray.push([d.country, d.ATH, d.Discrimination_Rate]);
    });
    /!*console.log(myArray);*!/

    myArray.sort(function (a, b) {
      return b[0]-a[0];
    });

    var mydata=myArray.map( function(d){return d[0];} );

    /!*console.log(mydata);*!/

    ul.selectAll('li')
      .data(mydata)
      .enter()
      .append('li')
      .html(String);
  });*/



  /*ATH order when button ATH is pressed*/

    // d3.selectAll("li").remove(); //clean the list

  let margin = {
    left: 0.12 * screen.width * width_ratio,
    right: 0.12 * screen.width * width_ratio,
    top: 0.05 * screen.height * height_ratio,
    bottom: 0.05 * screen.height * height_ratio
  };
  let width = screen.width * width_ratio - margin.left - margin.right;
  let height = screen.height * height_ratio - margin.top - margin.bottom;

  let div = d3.select("body")
    .append("div")
    .classed("list",true)
    .style("width", `${width_ratio*100}%`)
    .style("height", `${height_ratio*100}%`);

  let svg = div.append("svg")
    .attr("id", "list")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.json("data/data.json", function (error, data) {

    if (error) throw error;

    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .classed("country", true)
      // .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return height/21*i;
      })
      .text(function (d) { return d["country_name"]; })
      .attr("code", function(d) { return d["iso_a2"];})
      .attr("name", function (d) { return d["country_name"]; })
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

  /*var ul = d3.select('body').append('div').classed('list', true).append('ul');

    d3.csv("data/data.csv", function(error, data) {
      var myArray = [];
      data.forEach(function(d,i){
        d.ATH = +d.ATH;
        d.Discrimination_Rate = +d.Discrimination_Rate;
        myArray.push([d.country, d.ATH, d.Discrimination_Rate]);
      });
      console.log(myArray);

      myArray.sort(function (a, b) { //sort by ATH
        return b[1]-a[1];
      });

      var mydata=myArray.map( function(d){return d[0];} );

      /!*console.log(mydata);*!/

      ul.selectAll('li')
        /!*.data(mydata)
        .enter()
        .append('li')
        .html(String)*!/
        .data(data)
        .enter()
        .append('li')
        .attr("code", function (d) { return d["iso_a2"]; })
        .attr("name", function (d) { return d["country"]; })
        .html(function (d) { return d["country"]; })
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
*/


  /*/!*DR order when button DR is pressed*!/
  var DR_order = function() {

    d3.selectAll("li").remove();//clean the list

    marginL = {top: 30, right: 20, bottom: 30, left: 70},
      widthL = 100 - marginL.left - marginL.right,
      heightL = 500 - marginL.top - marginL.bottom;

    var ul = d3.select('body').append('div').classed('list', true).append('ul');

    d3.csv("data/data.csv", function(error, data) {
      var myArray = [];
      data.forEach(function(d,i){
        d.ATH = +d.ATH;
        d.Discrimination_Rate = +d.Discrimination_Rate;
        myArray.push([d.country, d.ATH, d.Discrimination_Rate]);
      });
      /!*console.log(myArray);*!/

      myArray.sort(function (a, b) {
        return a[2]-b[2];
      });

      var mydata=myArray.map( function(d){return d[0];} );

      /!*console.log(mydata);*!/

      ul.selectAll('li')
        .data(mydata)
        .enter()
        .append('li')
        .html(String);
    });
  }*/
}