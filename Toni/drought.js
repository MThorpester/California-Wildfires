//svg dimensions
var margin = {top:100, right:700, bottom:150, left:600},
    width = 800,
    height = 500 

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
    console.log(data);

    //None, D0-D4; turn objects -> strings
    data.forEach(d =>{
        d.D0_sum = +d.D0_sum;});

    data.forEach(d =>{
        d.D1_sum = +d.D1_sum;});

    data.forEach(d =>{
        d.D2_sum = +d.D2_sum;});

    data.forEach(d =>{
        d.D3_sum = +d.D3_sum;});

    data.forEach(d =>{
        d.D4_sum = +d.D4_sum;});

    data.forEach(d =>{
        d.None_sum = +d.None_sum;});


    //extracting column data 
    var none = data.map(function(d){
        return{None_sum: d.None_sum}
    });

    var D0 = data.map(function(d){
        return{D0_sum: d.D0_sum}
    });

    var D1 = data.map(function(d){
        return{D1_sum: d.D1_sum}
    });

    var D2 = data.map(function(d){
        return{D2_sum: d.D2_sum}
    });
    
    var D3 = data.map(function(d){
        return{D3_sum: d.D3_sum}
    });

    var D4 = data.map(function(d){
        return{D4_sum: d.D4_sum}
    });    

    var subgroups = data.columns.slice(1)
    //years=groups
    var Years = d3.map(data, function(d){return(d.Years)}).keys()

    //add X Axis
    var x = d3.scaleBand()
        .domain(data.map(d=>d.Years))
        .range([0,width])
        .padding([0.1]);

    // add Y axis 
    var y = d3.scaleLinear()
        .domain([0,100])
        .range ([height,0]);

    //stack data 
    var stackedData = d3.stack()
        .keys(subgroups)
        (data);
    console.log(stackedData)

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    //.range(["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"])
    //.range(["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"])
    .range(["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"])

    // Percentages; Normalize the data -> sum of each group must be 100!
    dataNormalized = []
    data.forEach(function(d){
        // Compute the total
        tot = 0
        for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
        // Now normalize
        for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
    })

    //Display chart + bars
        // x axis
        svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

        //y axis
        svg.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(20,0)")
            .call(d3.axisLeft(y).ticks(10))

        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter()
                .append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                    .data(function(d) { return d; })
                    .enter().append("rect")
                    .attr("x", function(d) { return x(d.data.Years); })
                    .attr("y", function(d) { return y(d[0]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                    .attr("width",x.bandwidth())
            


});