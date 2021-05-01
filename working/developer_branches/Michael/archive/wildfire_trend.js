
//*******Declare Global Variables  *******/
//Data(Table) related filters.
var county_data = [];
var wildfire_year_data = [];
var wildfire_year_incident_data = [];
var overall_stats_data = [];

//Drop down related filters
var optionitem = "";

//D3 Variables to manipulate DOM
var selector = d3.select("#selDataset");
var demographicSection = d3.select("#sample-metadata");

//API URL 
var base_url = 'http://35.193.188.227:8080/';



//*****Get Data From API *******/
//Get County Code Data for Drop Down List
d3.json(base_url + "county_codes").then((data) => {
    county_data = data;
    console.log(county_data);
    county_data.forEach(function(element){
        optionitem = selector.append("option");
        optionitem.text(element.county_description);
    });    
    });


//Get Wildfire Data at Year/County Grain 
d3.json(base_url + "yearly_stats_detail").then((data) => {
    wildfire_year_data = data;
    console.log(wildfire_year_data);
    });    


//Get Overall Data 
d3.json(base_url + "overall_stats").then((data) => {
    overall_stats_data = data;
    console.log(overall_stats_data);
    });    

d3.json(base_url + "yearly_stats_incident_level").then((data) => {
    wildfire_year_incident_data = data;
    console.log(wildfire_year_incident_data);
    });    
            


//populate drop down list


function optionChanged(id) {
   
    //********Declare Local Variables  *********/
    //Variables for Series and Axis Arrays
    var years = [];
    var acres_burned = [];
    var years_small = [];
    var acres_burned_pct_increase = [];
    var incidents_small = [];
    var incident_small_pct_increase = []
    var years_medium = [];
    var incidents_medium= [];
    var incident_medium_pct_increase = []
    var years_large = [];
    var incidents_large = [];
    var incident_large_pct_increase = [];

    //******Filter Main Global Data Arrays By County Selection.  Rebuild Axis and Category Arrays */
    td = overall_stats_data.filter(d => {return(d.county_description == id)});
    overall_stats_td = td.map(e => {return e});
    
    //Build Stack Barchart Axis and Category Arrays
    td = wildfire_year_incident_data.filter(d => {return(d.county_description == id & d.incident_level == "Large")});
    wildfire_year_incident_td = td.map(e => {return e});  
    years_large = wildfire_year_incident_td.map(e=>{return e.year});
    incidents_large = wildfire_year_incident_td.map(e=>{return e.total_fires});
    incident_large_pct_increase = wildfire_year_incident_td.map(e=>{return e.incident_pct + "%"});
  

    td = wildfire_year_incident_data.filter(d => {return(d.county_description == id & d.incident_level == "Medium")});
    wildfire_year_incident_td = td.map(e => {return e});  
    years_medium = wildfire_year_incident_td.map(e=>{return e.year});
    incidents_medium = wildfire_year_incident_td.map(e=>{return e.total_fires});
    incident_medium_pct_increase = wildfire_year_incident_td.map(e=>{return e.incident_pct + "%"});

    td = wildfire_year_incident_data.filter(d => {return(d.county_description == id & d.incident_level == "Small")});
    wildfire_year_incident_td = td.map(e => {return e});  
    years_small = wildfire_year_incident_td.map(e=>{return e.year});
    incidents_small = wildfire_year_incident_td.map(e=>{return e.total_fires});
    incident_small_pct_increase = wildfire_year_incident_td.map(e=>{return e.incident_pct + "%"});


   //Build Bar/Line Chart for total by year and add label.
   td = wildfire_year_data.filter(d => {return(d.county_description == id)});
   wildfire_year_td = td.map(e => {return e});  
   years = wildfire_year_td.map(e=>{return e.year}); 
   acres_burned = wildfire_year_td.map(e=>{return e.acres_burned});
   acres_burned_increase_rate = wildfire_year_td.map(e=>{return e.acres_burned_increase_rate + "%"}); 
   console.log(acres_burned_increase_rate)


   //**********Chart Configuration ************/

   //Acreage Burned Bar Chart Configuration
    var trace_bar = {
        x: years,
        y: acres_burned,
        type: "bar",
        name: "Acres Burned"
      };

      var trace_line = {
        x:years,
        y:acres_burned,
        type:"scatter",
        text:acres_burned_increase_rate,
        name:"%Year Increase/Decrease"
    };

    var layout_bar = {
      title: "Acres Burned By Year",
      xaxis: { title: "Year",
               type:"Category" },
      yaxis: { title: "Acres Burned",
               type:"Linear",
               }
    };

    var data_bar = [trace_bar,trace_line];
 
    //Stacked Bar Chart Configuration
    var trace_small = {
        x: years_small,
        y: incidents_small,
        text:incident_small_pct_increase,
        name: "Small",
        type: "bar"
      };

      var trace_medium = {
        x: years_medium,
        y: incidents_medium,
        text:incident_medium_pct_increase,
        name: "Medium",
        type: "bar"
      };     
    
      var trace_large = {
        x: years_large,
        y: incidents_large,
        text: incident_large_pct_increase,
        name: "Large",
        type: "bar"
      };     
      var data_stack = [trace_small,trace_medium,trace_large];

      var layout_stack = {
        title: "Fire Incidents By Year",
        xaxis: { title: "Year",
                 type:"Category" },
        yaxis: { title: "Incident Count",
                 type:"Linear",
                 },
        barmode: 'stack'
      };
 

      //Refresh Bar Chart
      Plotly.react("stackbar", data_stack, layout_stack);
      Plotly.react("bar", data_bar, layout_bar);       
};

optionChanged("Overall");
// console.log(county_data);
// console.log(wildfire_year_data);
