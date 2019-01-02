// Width and height
var chart_width     =   800;
var chart_height    =   600;

//define a projection, for us map, we most likely use geoAlberUsa
var projection = d3.geoAlbersUsa()
    .scale([chart_width])
    .translate([chart_width/2, chart_height/2]);


//define a geo path and bind current projection to it
var path = d3.geoPath(projection);

// Create SVG element
var svg             =   d3.select("#chart")
    .append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height);

//read data, bind data - in this case, bind data.features(us states) to geoPath
//draw the map with binded data and geo path(projection) defined before
// d3.json("us.json").then(function(data){
//     svg.selectAll('path')
//     .data(data.features)
//     .enter()
//     .append('path')
//     .attr('d', path)
//     .attr('fill', '#58CCE1')
//     .attr('stroke', '#fff')
//     .attr('stroke-width', 1);

d3.json("districts.json").then(function(data){
    svg.selectAll('path')
    .data(topojson.feature(data, data.objects.districts).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', function(){
        // var num = d.id;
        return getRandomColor();//num? color(num):'#ddd';
      })
    
    //getRandomColor())
    .attr('stroke', '#fff')
    .attr('stroke-width', 1);
});


  // .attr('fill', '#58CCE1')
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }