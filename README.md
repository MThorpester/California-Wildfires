# California-Wildfires
**Have California wildfires become larger, more frequent and more destructive in recent years?**
We set out to answer this question by creating a dashboard to analyze and visualize historical California wildfire data and identify trends. The dashboard can be accessed [here](http://35.193.188.227/ "California Wildfire Dashboard").<br>This project uses:
- [csv2json](https://github.com/mapbox/csv2geojson/  "csv2json GitHub repo") and PostgreSQL to extract, transform and load Wildfire Incident data,
- PostgreSQL and NodeJS on the Google Cloud to serve up an API for querying the Wildfire Incident data, and 
- Plotly, Leafly, Bootstrap, Javascript, HTML and CSS to create the interactive dashboard. 
 

**Findings**: Based on analysis using this dashboard the project concluded that California wildfires have indeed become more frequent and more destructive, although we would need additional data to determine whether, in fact, they have become larger. 

## Data Sources
The key dataset used was a CSV file containing wildfire incidents from 2013-2019 that was originally scraped from https://www.fire.ca.gov:
-  https://www.kaggle.com/ananthu017/california-wildfire-incidents-20132020 <br>

In addition, a CSV dataset covering percentages of California in different levels of drought status from 2000-2021 was explored:
- https://droughtmonitor.unl.edu/Data/DataTables.aspx <br>


## Dashboard
The dashboard enables users to explore California wildfire incident data from 2013-2019 using several visualizations:
- **Wildfire Summary** stats are rolled up for all of California, or for specific counties, including the total number of fires, total acres burned, total structures destroyed, total structures damaged, and total fatalities. 
- the **Wildfire Map** view displays wildfire incidents by location. Individual years can be toggled on and off, and the wildfires are displayed using different colored icons based on the size of the fire.
- the **Wildfire Incidents by Year** chart displays the number of wildfires by year, categorized by size of the fire (small, medium, large). It can be viewed for all of California or for individual counties.
- the **Average Acres Burned per Wildfire** chart and the **Acres Burned by Year** chart display the average size of wildfires for each year and the total acres burned per year. They can be viewed for all of California or for individual counties.
- the **Destruction Metrics by Year** chart displays the numbers of fatalities, structures damaged and destroyed by year. It can be viewed for all of California or for individual counties.

## Wildfire 1.0 API
Several different PostgreSQL views are exposed by the NodeJS app as API endpoints at https://localhost:8080/:
- / 
    - API documentation
- /detail
    - detailed Wildfire Incident records for each wildfire that started in California between 2013 & 2019.
 - /county_codes
    - Returns the county code along with the name of the county for all counties in California.
- /yearly_stats_detail
    - Returns summary stats for each county for each year, including All California (county_code = 0). 
- /yearly_stats_incident_level
    - Summary records based on incident level (Small, Medium, Large) for each county (and all CA) for each year. 
- /overall_stats
    - Summary stats by county for the entire period (2013-2019)

## Project Artifacts
Key project files are organized into the following folders:
- California-Wildfires: dashboard homepage (index.html)
- California-Wildfires/Project Docs
- California-Wildfires/assets: html files for map and analysis pages
- California-Wildfires/db_assets: files for ETL queries and the nodeJS app
- California-Wildfires/static
- California-Wildfires/static/js: javascript files for map and analysis pages
- California-Wildfires/static/img: homepage image and map icons
- California-Wildfires/static/data: GeoJSON wildfire incidents file
- California-Wildfires/static/css: css file for all html pages

## Getting Started

To run this application simply launch the index.html file using live server or visit the hosted version [here](http://35.193.188.227/ "California Wildfire Dashboard").


