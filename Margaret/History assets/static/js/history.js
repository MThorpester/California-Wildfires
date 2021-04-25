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
      
    // Read in JSON samples, getting all of the County names and using them to build the dropdown menu options
    d3.json(base_url + "county_codes").then((results => {
        console.log("County codes: ", results);
        results.forEach((county => {
            selection
            .append("option")
            .text(county.county_description);
        }));

        // Call the BuildCharts function with the initial County name
        var initial_county = selection.property("value");
        BuildCharts(initial_county);
       
    }));
}
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
function BuildCharts(selectedCounty) {
  
    //------------------------------------------
    // Retrieve the Data
    //------------------------------------------
    var base_url = 'http://35.193.188.227:8080/';
    d3.json(base_url + "yearly_stats_detail").then((results) => {
        // wildfire_year_data = data;
        // console.log(wildfire_year_data);

       //------------------------------------------
       // Create the Metadata Card
       //------------------------------------------
       // Select the Metadata card in Index.html
       var metadataCard = d3.select("#sample-metadata");

       // Retrieve selected subjects metadata and grab the washing frequency for later
       var countyMetadata = results.filter(county => county.county_description == selectedCounty);
       console.log("countyMetadata: ",countyMetadata);

       // Aggregate key metrics for years 2013-2019 to display on metdata card
       var meta_total_fires = 0;
       var meta_acres_burned = 0;
       var meta_structures_destroyed = 0;
       var meta_structures_damaged = 0;
       var meta_total_fatalities = 0;

       countyMetadata.forEach(function(year) {

           meta_total_fires =  meta_total_fires + parseInt(year.total_fires);
           meta_acres_burned = meta_acres_burned + parseInt(year.acres_burned);
           meta_structures_destroyed = meta_structures_destroyed + parseInt(year.structures_destroyed);
           meta_structures_damaged = meta_structures_damaged + parseInt(year.structures_damaged);
           meta_total_fatalities = meta_total_fatalities + parseInt(year.total_fatalities);
       });

       var all_years_summary = {
        "Total number of fires: ": meta_total_fires,
        "Total acres burned: " : meta_acres_burned,
        "Total structures destroyed: " : meta_structures_destroyed,
        "Total structures damaged: " : meta_structures_damaged,
        "Total fatalities: " : meta_total_fatalities
       }

       // Create a list group in the Demographic Info card with some special styling  
       var metadataList = metadataCard.append("ul").attr("class", "list-group list-group-flush metadata-fields");

       // Iterate through each key-value pair getting the values to build the Demographic Info card
       Object.entries(all_years_summary).forEach(([key, value]) => {
           var metadataItem = metadataList.append("li").
           attr("class", "list-group-item p-1 details-text").
           text(`${key}: ${value}`);
       });
   
    });
}

init();



