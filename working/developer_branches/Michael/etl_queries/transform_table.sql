create table test as
DROP TABLE public.wildfire_incidents;


CREATE TABLE wildfire_incidents
as
SELECT 
   "AcresBurned"::INTEGER as acres_burned
  ,"Active" as active
  ,"AdminUnit" as admin_unit
  ,COALESCE("AirTankers"::INTEGER,0) AS air_tankers
  ,"ArchiveYear" archive_year
  ,"CalFireIncident" as cal_fire_incident
  ,"CanonicalUrl" as canon
  ,"Counties" as counties
  ,"CountyIds" as county_ids
  ,COALESCE("CrewsInvolved"::INTEGER,0) AS crews_involved
  ,COALESCE("Dozers"::INTEGER,0) AS dozers
  ,COALESCE("Engines"::INTEGER,0) AS engines
  ,TO_DATE(SUBSTRING("Started",1,10),'YYYY-MM-DD') AS started
  ,TO_DATE(SUBSTRING("Extinguished",1,10),'YYYY-MM-DD') AS extinguished
  ,TO_TIMESTAMP("Started",'YYYY-MM-DD"T"HH24:MI:SS"Z"') as started_tz
  ,TO_TIMESTAMP("Extinguished",'YYYY-MM-DD"T"HH24:MI:SS"Z"') as extinguished_tz
  ,TO_TIMESTAMP("Started",'YYYY-MM-DD"T"HH24:MI:SS"Z"') - TO_TIMESTAMP("Extinguished",'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS duration_interval
  ,COALESCE("Fatalities"::INTEGER,0) AS fatalities
  ,COALESCE("Featured") as featured
  ,"Final" as final
  ,"FuelType" as fuel_type
  ,COALESCE("Helicopters"::INTEGER,0) AS helicopters
  ,COALESCE("Injuries"::INTEGER,0)  AS injuries
  ,"Latitude"::NUMERIC AS latitude
  ,"Longitude"::NUMERIC AS longitude
  ,"Location" as location
  ,"MajorIncident" as major_incident
  ,"PercentContained"::NUMERIC as percent_contained
  ,"Public" as public
  ,"Status" as status
  ,COALESCE("StructuresDamaged"::INTEGER,0) as structures_damaged
  ,COALESCE("StructuresDestroyed"::INTEGER,0) AS structures_destroyed
  ,COALESCE("StructuresEvacuated"::INTEGER,0) AS structures_evaculated
  ,COALESCE("StructuresThreatened"::INTEGER,0) AS structures_threatened
  ,TO_DATE(SUBSTRING("Updated",1,10),'YYYY-MM-DD') AS updated
  ,COALESCE("WaterTenders"::INTEGER,0) AS water_tenders
 FROM public."WildfireIncidents"



SELECT *
FROM public."WildfireIncidents";