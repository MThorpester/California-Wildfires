# California-Wildfires
**Have California wildfires become larger, more frequent and more destructive in recent years?**
We set out to answer this question by creating a dashboard to analyze and visualize historical California wildfire data and identify trends. The dashboard can be accessed [here](https://mthorpester.github.io/California-Wildfires/ "California Wildfire Dashboard").<br>This project uses:
- [csv2json](https://github.com/mapbox/csv2geojson/  "csv2json GitHub repo") and PostgreSQL to extract, transform and load Wildfire Incident data,
- PostgreSQL and NodeJS on the Google Cloud to serve up an API for querying the Wildfire Incident data, and 
- Plotly, Leafly, Bootstrap, Javascript, HTML and CSS to create the interactive dashboard. 
 

**Findings**: Based on analysis using this dashboard the project concluded that California wildfires have indeed become more frequent and more destructive, although we would need additional data to determine whether, in fact, they have become larger. 

## Data Sources
The key dataset used was a CSV file that was originally scraped from htps://www.fire.ca.gov:
-  https://www.kaggle.com/ananthu017/california-wildfire-incidents-20132020 <br>

In addition, a CSV dataset covering percentages of California in different levels of drought status from 2000-2021 was utilized:
- https://droughtmonitor.unl.edu/Data/DataTables.aspx <br>


## Dashboard
The dashboard enables users to explore California wildfire incident data from 2013-2019 using several visualizations:
- **Wildfire Summary** stats are rolled up for all of California, or for specific counties, including the total number of fires, total acres burned, total structures destroyed, total structures damaged, and total fatalities. 
- the **Wildfire Map** view displays wildfire incidents by location. Individual years can be toggled on and off, and the wildfires are displayed using different icons based on the size of the fire.
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
- /yearly_stats_county/:county
    - <span style="color:red">Is this working or just an experiment???????????</span>.
- /yearly_stats_incident_level
    - Summary records based on incident level (Small, Medium, Large) for each county (and all CA) for each year. 
- /overall_stats
    - Summary stats by county for the entire period (2013-2019)

## Project Artifacts
The project files are organized into the following folders:
- California-Wildfires
    
- several Javascript filel in  (app.js)
- an HTML file (index.html)
- the state data (state_stats.csv)
- Bootstrap, CSS, and Jquery files.

All of the resources used to produce the dataset are in the Resources folder - including COVID_Data_Prep.ipynb

## Getting Started

To run this application simply launch the index.html file using live server or visit the hosted version [here](https://mthorpester.github.io/D3-Challenge/D3_data_journalism/main.html "My Interactive D3 Scatter plot").


## Part I: Exploratory Climate Analysis
This part of the project analyzes Hawaii precipitation and weather station data, and produces visualizations of rainfall and temperature patterns. It also supports the planning of visits to Hawaii with:
- local precipitation summaries for each of the local weather stations and
- temperature dailies for a flexible range of trip dates.

It consists of:
- a SQLite database (Resources/Hawaii.sqlite)
- a Jupyter notebook (sqlalchemy-challenge/climate_analysis.ipnyb) that uses SQLAlchemy, Python Pandas and MatPlotlib to analyze and visualize this data.
- Bar charts, a histogram and an area chart that are visible within the notebook and also stored as .png files in the sqlalchemy-challenge folder.

## Part II: Climate App
This part of the project surfaces several SQLAlchemy precipitation and temperature queries in an API using a Python Flask app:
- / 
    - Home page
- /api/v1.0/precipitation
    - Daily precipitation totals for last year
- /api/v1.0/stations
    - Active weather stations
- /api/v1.0/tobs
    - Daily temperature observations for the WAIHEE weather station
- /api/v1.0/trip/yyyy-mm-dd
    - Min, average & max temperatures for the range beginning with the provided start date through 08/23/17
- /api/v1.0/trip/yyyy-mm-dd/yyyy-mm-dd
    - Min, average & max temperatures for the range beginning with the provided start - end date range

It consists of:
- a SQLite database (Resources/Hawaii.sqlite)
- a Flask app (sqlalchemy-challenge/app.py).
