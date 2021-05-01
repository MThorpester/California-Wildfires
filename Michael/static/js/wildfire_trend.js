
//------------------------------------------
// Declare Global Variables
//------------------------------------------
//Data(Table) related filters.
var county_data = [];
var wildfire_year_data = [];
var wildfire_year_incident_data = [];
var overall_stats_data = [];
var fatalitiesg = [];
//Drop down related filters
var optionitem = "";

//D3 Variables to manipulate DOM
var demographicSection = d3.select("#sample-metadata");


//------------------------------------------
// Initialization
//------------------------------------------
//This function initializes the page and loads the default charts:
//  - retrieves the County names from the endpoint to populate the dropdown menu
//  - calls the BuildCharts function for the first county in the list (which is all California)

function init() {
  // Select the dropdown menu element
  var selection = d3.select("#selDataset"); 
  
  //API URL 
  var base_url = 'http://35.193.188.227:8080/';
   
 //Nested calls to API to grab wildfile data at different levels of granularity
 //Last nested API call build chart to assure all data gathered before BuildChart called.
 d3.json(base_url + "county_codes").then((results => {
   console.log("County codes: ", results);
   results.forEach((county => {
       selection
       .append("option")
       .text(county.county_description);
   }));
     //Get Wildfire Data at Year/County Grain 
   d3.json(base_url + "yearly_stats_detail").then((data) => {
     wildfire_year_data = data;
     console.log(wildfire_year_data);
     d3.json(base_url + "overall_stats").then((data) => {
      overall_stats_data = data;
      console.log(overall_stats_data);
      d3.json(base_url + "overall_stats").then((data) => {
        overall_stats_data = data;
        console.log(overall_stats_data);
        d3.json(base_url + "yearly_stats_incident_level").then((data) => {
          wildfire_year_incident_data = data;
          console.log(wildfire_year_incident_data);
          var initial_county = selection.property("value");
          BuildCharts("Overall");
          });  
        });   
      });    
     });    
 }));

};


//------------------------------------------
// New Menu Item Selection
//------------------------------------------
// This function gets executed when a change is detected in the selected dropdown value
// Note: it is invoked directly from the Index.html file
function optionChanged(selectedCounty) {
  // Clear out the previous scounty's metadata from the body of the card 
  var oldMetadata = d3.selectAll(".metadata-fields");
  oldMetadata.remove();

  // Build the Charts
  BuildCharts(selectedCounty);
}

//------------------------------------------
// Build the Charts
//------------------------------------------ 
//This function retrieves and prepares the necessary data for the subject id and builds the Plotly charts
function BuildCharts(id) {
   
    //********Declare Local Variables  *********/
    //Variables for Series and Axis Arrays
    var years = [];
    var acres_burned = [];
    var avg_acres_burned = [];
    var fatalities = [];
    var structures_destroyed = [];
    var structures_damaged = [];

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
    
    //------------------------------------------
    // Create the Metadata Card
    //------------------------------------------

     
    //------------------------------------------
    // Create the Metadata Card
    //------------------------------------------
    //Filter overall global data array by selection.
    td = overall_stats_data.filter(d => {return(d.county_description == id)});
    overall_stats_td = td.map(e => {return e});
    console.log(overall_stats_td);
    // Select the Metadata card in Index.html
    var metadataCard = d3.select("#sample-metadata");
    var all_years_summary = {
      "Total number of fires: ": overall_stats_td[0].total_fires,
      "Total acres burned: " : overall_stats_td[0].acres_burned,
      "Total structures destroyed: " : overall_stats_td[0].structures_destroyed,
      "Total structures damaged: " : overall_stats_td[0].structures_damaged,
      "Total fatalities: " : overall_stats_td[0].total_fatalities
     };

    // Create a list group in the Demographic Info card with some special styling  
    var metadataList = metadataCard.append("ul").attr("class", "list-group list-group-flush metadata-fields")
    // Iterate through each key-value pair getting the values to build the Demographic Info card
    Object.entries(all_years_summary).forEach(([key, value]) => {
        var metadataItem = metadataList.append("li").
        attr("class", "list-group-item p-1 details-text").
        text(`${key}: ${value}`);
    });    

    //------------------------------------------
    // Filter Main Global Data Arrays By County Selection.  Rebuild Axis and Category Arrays
    //------------------------------------------
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
   
   //Build Avaeage Bunred Acres Dataset
   avg_acres_burned = wildfire_year_td.map(e=>{return e.avg_acres_burned});

   //Build Grouped Bar Chart 
   fatalities = wildfire_year_td.map(e=>{return e.total_fatalities});
   structures_damaged = wildfire_year_td.map(e=>{return e.structures_damaged});
   structures_destroyed = wildfire_year_td.map(e=>{return e.structures_destroyed});

   console.log(fatalities);
   console.log(fatalitiesg);
   

    //------------------------------------------
    // Chart Configuration 
    //------------------------------------------
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
      //Average Acreage Burned Bar Chart Configuration
      var trace_avg_bar = {
        x: years,
        y: avg_acres_burned,
        type: "bar",
        name: "Average Acres Burned"
      };


    var layout_avg_bar = {
      title: "Average Acres Burned By Year",
      xaxis: { title: "Year",
               type:"Category" },
      yaxis: { title: "Average Acres Burned",
               type:"Linear",
               }
    };

    var data_avg_bar = [trace_avg_bar];
 
    //Stacked Bar Chart Configuration
    var trace_small = {
        x: years_small,
        y: incidents_small,
        text:incident_small_pct_increase,
        name: "Small",
        type: "bar",
        marker: {color: "#ffb727"}
      };

      var trace_medium = {
        x: years_medium,
        y: incidents_medium,
        text:incident_medium_pct_increase,
        name: "Medium",
        type: "bar",
        marker: {color: "#ff7f27"}
      };     
    
      var trace_large = {
        x: years_large,
        y: incidents_large,
        text: incident_large_pct_increase,
        name: "Large",
        type: "bar",
        marker: {color: "#88001b"}
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
 
    //Grouped Bar Chart Configuration
    var trace_fatalities = {
      x: years,
      y: fatalities,
      name: "Fatalities",
      type: "bar"
    };

    var trace_structures_damaged = {
      x: years,
      y: structures_damaged,
      name: "Structures Damaged",
      type: "bar"
    };

    var trace_structures_destroyed = {
      x: years,
      y: structures_destroyed,
      name: "Structures Destroyed",
      type: "bar"
    };

    var data_destruction = [trace_fatalities,trace_structures_damaged,trace_structures_destroyed];

    var layout_destruction = {
      title: "Destruction Metrics By Year",
      xaxis: { title: "Year",
               type:"Category" },
      yaxis: { title: "Volume",
               type:"log"
               }
    };
   

    //------------------------------------------
    // Rebuild Bar Chart
    //------------------------------------------
      Plotly.react("stackbar", data_stack, layout_stack);
      Plotly.react("bar", data_bar, layout_bar);  
      Plotly.react("bar-avg", data_avg_bar, layout_avg_bar); 
      Plotly.react("cluster",data_destruction,layout_destruction);     
};

init();

