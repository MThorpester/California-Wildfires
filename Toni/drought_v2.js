//svg dimensions
var margin = {top:100, right:700, bottom:150, left:600},
    width = 1000,
    height = 600 

//append svg object to the body of the page
var svg=d3.select("#bar")
    .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load in data
d3.csv("cali_drought.csv").then((data)=>{droughtData = data;

    //print out data
 
    //None, D0-D4; turn objects -> strings
    // data.forEach(d =>{
    //     d.D0_sum = +d.D0_sum;});

    // data.forEach(d =>{
    //     d.D1_sum = +d.D1_sum;});

    // data.forEach(d =>{
    //     d.D2_sum = +d.D2_sum;});

    // data.forEach(d =>{
    //     d.D3_sum = +d.D3_sum;});

    // data.forEach(d =>{
    //     d.D4_sum = +d.D4_sum;});

    // data.forEach(d =>{
    //     d.None_sum = +d.None_sum;});

    var subgroups = data.columns.slice(1)
    dataNormalized = []
    data.forEach(function(d){
        // Compute the total
        tot = 0
        for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
        // Now normalize
        for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
    })
    console.log(data);

    //extracting column data 
    var none = data.map(function(d){
        return d.None_sum
    });

    var D0 = data.map(function(d){
        return d.D0_sum
    });

    var D1 = data.map(function(d){
        return d.D1_sum
    });

    var D2 = data.map(function(d){
        return d.D2_sum
    });
    
    var D3 = data.map(function(d){
        return d.D3_sum
    });

    var D4 = data.map(function(d){
        return d.D4_sum
    });    
    var Years = d3.map(data, function(d){return(d.Years)}).keys();
    
    // console.log(Years)
    // console.log(D4)
    // console.log(D1)

   //Stacked Bar Chart Configuration
   var trace_none = {
    x: Years,
    y: none,
    // text:incident_small_pct_increase,
    name: "None",
    type: "bar",
    marker: {color: "#008000"}
  };

  var trace_D0 = {
    x: Years,
    y: D0,
    // text:incident_medium_pct_increase,
    name: "D0",
    type: "bar",
    marker: {color: "#ff7f27"}
  };     

  var trace_D1 = {
    x: Years,
    y: D1,
    // text: incident_large_pct_increase,
    name: "D1",
    type: "bar",
    marker: {color: "#808000"}
  };     

  var trace_D1 = {
    x: Years,
    y: D1,
    // text: incident_large_pct_increase,
    name: "D1",
    type: "bar",
    marker: {color: "#F0E68C"}
  };     

  var trace_D2 = {
    x: Years,
    y: D2,
    // text: incident_large_pct_increase,
    name: "D2",
    type: "bar",
    marker: {color: "#FFD700"}
  };     

  var trace_D3 = {
    x: Years,
    y: D3,
    // text: incident_large_pct_increase,
    name: "D3",
    type: "bar",
    marker: {color: "#B22222"}
  };  
  
  var trace_D4 = {
    x: Years,
    y: D4,
    // text: incident_large_pct_increase,
    name: "D4",
    type: "bar",
    marker: {color: "#8B0000"}
  };  

  var data_stack = [trace_none,trace_D0,trace_D1,trace_D2,trace_D3,trace_D4];
  
  var layout_stack = {
    title: "Drought Cateory % By Year",
    xaxis: { title: "Year",
             type:"Category" },
    yaxis: { title: "Drought Category%",
             type:"Linear",
             },
    barmode: 'stack'
  };
   
  Plotly.react("bar", data_stack, layout_stack);


});