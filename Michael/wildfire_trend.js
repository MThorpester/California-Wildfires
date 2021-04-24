
//Data(Table) related filters.
var county_data = [];
var td = [];
var wildfire_td = [];
var wildfire_year_data = [];


//Variables for Series and Axis Arrays
var years = [];
var acres_burned = [];

//Drop down related filters
var optionitem = "";


//D3 Variables to manipulate DOM
var selector = d3.select("#selDataset");
var demographicSection = d3.select("#sample-metadata");

//API URL 
var base_url = 'http://35.193.188.227:8080/';


console.log(base_url)


//Get County Code Data for Drop Down List
d3.json(base_url + "county_codes").then((data) => {
    county_data = data;
    console.log(county_data);
    county_data.forEach(function(element){
        optionitem = selector.append("option");
        optionitem.text(element.county_description);
    });    
    });

d3.json(base_url + "yearly_stats_detail").then((data) => {
    wildfire_year_data = data;
    console.log(wildfire_year_data);
    });    




//populate drop down list
console.log('county')
console.log(county_data);
console.log(wildfire_year_data);


function optionChanged(id) {
   
    //Filter main dataset for Id selection
    td = wildfire_year_data.filter(d => {return(d.county_description == id)});
    wildfire_td = td.map(e => {return e});
    years = wildfire_td.map(e=>{return e.year});
    acres_burned = wildfire_td.map(e=>{return e.acres_burned});

    // console.log("Function Logging");
    // console.log(wildfire_td);
    console.log(years);
    console.log(acres_burned);

    
    var trace = {
        x: years,
        y: acres_burned,
        // text: otu_labels[0].slice(0,10).reverse(),
        type: "bar"
        // orientation:"h",
        // transform:[
        //     { type: "sort",
        //       target:"x"
        //     //   order: "descending"
        //    }
        //    ]
      };
      
      data = [trace]
    
      var layout = {
        title: "Acres Burned By Year",
        xaxis: { title: "Year",
                 type:"Category" },
        yaxis: { title: "Acres Burned",
                 type:"Linear",
                 }
      };
    
      Plotly.react("bar", data, layout);    
};

optionChanged("Overall");
// console.log(county_data);
// console.log(wildfire_year_data);
