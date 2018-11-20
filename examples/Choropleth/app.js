
var url_edu = "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
var url_county="https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";

var tooltip = d3.select("body").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);


var width = 1100,
    height = 800;

var path = d3.geoPath();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

 var color_Style=['blue',"aqua",'green',"greenyellow ",'orange','red']  ;
   


 


d3.json(url_edu, function(data) {


  
  var Search=function(id,a,b){
    console.log(id,a,b)
    var n=parseInt((a+b)/2);
    var x=data[a]["fips"];
    var y=data[b]["fips"];
    var z=data[n]["fips"];
    
    if (id===y){
      return b;
    }
    else if (id===x){
      return a;
    }
    else if(id===z){
      return n;
    }
    else if(id>z){ 
      return Search(id,n,b);
    }
     else if(id<z){
      return Search(id,a,n);
    }
    else{
      return -1;
    }
  }


  
d3.json(url_county, function(topology) {
  
 // console.log(data)
  min_value=d3.min(data.map(function(d){return d.bachelorsOrHigher;}))
  max_value=d3.max(data.map(function(d){return d.bachelorsOrHigher;}))
 
  var array=new Array();
           var r=(max_value-min_value)/6;
           for(var i =0;i<=6;i++){
             array.push(min_value+i*r); 
           }
  color_Scale = d3.scaleQuantize()
                   .domain([min_value, max_value])
                   .range(color_Style);


  
svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(topology, topology.objects.counties).features)
      .enter().append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill",function(d,i) {
          var pto = data.filter((elem ) =>elem.fips === d.id)
          if(pto[0]){
              return color_Scale(pto[0].bachelorsOrHigher)
          }
     })
      .attr("data-fips", (d,i)=> d.id)
      .attr("data-education",function(d,i) {
          var pto = data.filter((elem ) =>elem.fips === d.id);
          if(pto[0]){
              return pto[0].bachelorsOrHigher
        }

       } )
      .attr("data-area",function(d,i) {
          var pto = data.filter((elem ) => elem.fips === d.id);
          if(pto[0]){
              return pto[0].area_name
        }

       } )
      
        .on('mouseover', function(d, i) {
      
      d3.select(this).style("fill", "white");
      tooltip.transition()
              .duration(100)
              .style('opacity', .9);
      tooltip.html("Name: "+this.getAttribute("data-area")+"<br>"+"Education: "+this.getAttribute("data-education")+"%")
              .attr("data-education", this.getAttribute("data-education"))
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 30) + "px")
              .style('transform', 'translateX(60px)');
    
    })
    .attr("transform", "translate(100,100 )")
    .on('mouseout', function(d,i) {
    
      d3.select(this).style("fill", color_Scale(this.getAttribute("data-education")))
       tooltip.transition()
              .duration(100)
              .style('opacity', 0);
    });
  

  
   var g = svg.append("g")
    .attr("class", "key")
    .attr("id", "legend")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color_Style)
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d,i) { return 30*i+100 })
    .attr("y", function(d,i) { return 10 })
    .attr("width", 30)
    .attr("fill", function(d) { return d; });


  
    var linearcolor_Scale = d3.scaleLinear()
    .domain([min_value, max_value])
    .range([0, 180]);

  var xAxis = d3.axisBottom()
    .scale(linearcolor_Scale)
    .tickFormat(d3.format("d"))
    .tickValues(array);
  var xAxisGroup = svg.append('g')
    .attr('transform', 'translate(100, 60)')
    .call(xAxis);
  
  
  
  
  
  
  
  
  
  });
            
  });

 
   
