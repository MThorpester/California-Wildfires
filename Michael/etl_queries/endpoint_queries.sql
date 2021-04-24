-- End point /details
SELECT * FROM public.wildfire_incidents order by duration_interval

CREATE OR REPLACE VIEW vw_COUNTY_CODES
AS
(
  SELECT A.*
  FROM
  (
	  SELECT '0' AS county_code, 'Overall' AS county_description
	  UNION
	  SELECT * 
	  FROM public.county_codes 
  ) A
  ORDER BY A.county_code::integer ASC
);

CREATE VIEW vw_county_stats_yearly
AS
SELECT final.*
FROM 
(
	SELECT 
	   a.*
	  ,COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0) AS acres_burned_prior_year
	  ,CASE
		 WHEN COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0) = 0 THEN 0
		 ELSE
			(a.acres_burned - COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0))  / (COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0) * 1.0000)
	   END AS acres_burned_increase_rate
	  ,ROW_NUMBER() OVER (PARTITION BY a.year ORDER BY a.acres_burned DESC) acres_burned_year_rank
	FROM 
	(
		SELECT 
			cc.county_code
		   ,cc.county_description
		   ,archive_year AS year
		   ,count(*) AS total_fires
		   ,SUM(w.acres_burned) AS acres_burned
		   ,AVG(duration_interval) AS avg_duration
		   ,SUM(fatalities) AS total_fatalities
		   ,SUM(structures_destroyed) AS structures_destroyed
		   ,SUM(structures_damaged) AS structures_damaged
		   ,SUM(CASE WHEN major_incident = 'TRUE' THEN 1 ELSE 0 END) AS major_incidents
		FROM public.wildfire_incidents w
		INNER JOIN 
			 public.county_codes cc
		 ON cc.county_code = split_part(w.county_ids,',',1)
		GROUP BY cc.county_code, cc.county_description,archive_year
	) a

	UNION
	
	SELECT 
	   a.*
	  ,COALESCE(LAG(a.acres_burned) OVER (ORDER BY a.year),0) AS acres_burned_prior_year
	  ,CASE
		 WHEN COALESCE(LAG(a.acres_burned) OVER (ORDER BY a.year),0) = 0 THEN 0
		ELSE
			(a.acres_burned - COALESCE(LAG(a.acres_burned) OVER (ORDER BY a.year),0))  / (COALESCE(LAG(a.acres_burned) OVER (ORDER BY a.year),0) * 1.0000)
	   END AS acres_burned_increase_rate
	  ,ROW_NUMBER() OVER ( ORDER BY a.acres_burned DESC) acres_burned_year_rank
	FROM 
	(
		SELECT 
			'0' AS county_code
		   ,'Overall' AS county_description
		   ,archive_year AS year
		   ,count(*) AS total_fires
		   ,SUM(w.acres_burned) AS acres_burned
		   ,AVG(duration_interval) AS avg_duration
		   ,SUM(fatalities) AS total_fatalities
		   ,SUM(structures_destroyed) AS structures_destroyed
		   ,SUM(structures_damaged) AS structures_damaged
		   ,SUM(CASE WHEN major_incident = 'TRUE' THEN 1 ELSE 0 END) AS major_incidents
		FROM public.wildfire_incidents w
		INNER JOIN 
			 public.county_codes cc
		 ON cc.county_code = split_part(w.county_ids,',',1)
		GROUP BY archive_year
	) a
) final
ORDER BY final.county_code::int, year;

CREATE VIEW vw_county_stats_yearly_incident_level
AS
SELECT final.*
FROM 
(
	SELECT 
	   a.*
	FROM 
	(
		SELECT 
			cc.county_code
		   ,cc.county_description
		   ,archive_year AS year
		   ,CASE
		     WHEN w.acres_burned <= 100 THEN 'Small'
		     WHEN w.acres_burned <= 10000 THEN 'Medium'
		     WHEN w.acres_burned > 10000 THEN 'Large'
		    END AS incident_level
		   ,count(*) AS total_fires
		   ,SUM(w.acres_burned) AS acres_burned
		   ,AVG(duration_interval) AS avg_duration
		   ,SUM(fatalities) AS total_fatalities
		   ,SUM(structures_destroyed) AS structures_destroyed
		   ,SUM(structures_damaged) AS structures_damaged
		   ,SUM(CASE WHEN major_incident = 'TRUE' THEN 1 ELSE 0 END) AS major_incidents
		FROM public.wildfire_incidents w
		INNER JOIN 
			 public.county_codes cc
		 ON cc.county_code = split_part(w.county_ids,',',1)
		GROUP BY cc.county_code, cc.county_description,archive_year
		         ,CASE
		     		WHEN w.acres_burned <= 100 THEN 'Small'
		     		WHEN w.acres_burned <= 10000 THEN 'Medium'
		     		WHEN w.acres_burned > 10000 THEN 'Large'
		    		END 
	) a

	UNION
	
	SELECT 
	   a.*
	FROM 
	(
		SELECT 
			'0' AS county_code
		   ,'Overall' AS county_description
		   ,archive_year AS year
		   ,CASE
		     WHEN w.acres_burned <= 100 THEN 'Small'
		     WHEN w.acres_burned <= 10000 THEN 'Medium'
		     WHEN w.acres_burned > 10000 THEN 'Large'
		    END AS incident_level		
		   ,count(*) AS total_fires
		   ,SUM(w.acres_burned) AS acres_burned
		   ,AVG(duration_interval) AS avg_duration
		   ,SUM(fatalities) AS total_fatalities
		   ,SUM(structures_destroyed) AS structures_destroyed
		   ,SUM(structures_damaged) AS structures_damaged
		   ,SUM(CASE WHEN major_incident = 'TRUE' THEN 1 ELSE 0 END) AS major_incidents
		FROM public.wildfire_incidents w
		INNER JOIN 
			 public.county_codes cc
		 ON cc.county_code = split_part(w.county_ids,',',1)
		GROUP BY archive_year
				,CASE
				   WHEN w.acres_burned <= 100 THEN 'Small'
				   WHEN w.acres_burned <= 10000 THEN 'Medium'
				   WHEN w.acres_burned > 10000 THEN 'Large'
				 END
	) a
) final
ORDER BY final.county_code::int, year;


CREATE VIEW vw_county_stats_overall
AS
SELECT final.*
FROM 
(
	SELECT 
	   a.*
	FROM 
	(
		SELECT 
			cc.county_code
		   ,cc.county_description
		   ,count(*) AS total_fires
		   ,SUM(w.acres_burned) AS acres_burned
		   ,AVG(duration_interval) AS avg_duration
		   ,SUM(fatalities) AS total_fatalities
		   ,SUM(structures_destroyed) AS structures_destroyed
		   ,SUM(structures_damaged) AS structures_damaged
		   ,SUM(CASE WHEN major_incident = 'TRUE' THEN 1 ELSE 0 END) AS major_incidents
		FROM public.wildfire_incidents w
		INNER JOIN 
			 public.county_codes cc
		 ON cc.county_code = split_part(w.county_ids,',',1)
		GROUP BY cc.county_code, cc.county_description
	) a

	UNION
	
	SELECT 
	   a.*
	FROM 
	(
		SELECT 
			'0' AS county_code
		   ,'Overall' AS county_description
		   ,count(*) AS total_fires
		   ,SUM(w.acres_burned) AS acres_burned
		   ,AVG(duration_interval) AS avg_duration
		   ,SUM(fatalities) AS total_fatalities
		   ,SUM(structures_destroyed) AS structures_destroyed
		   ,SUM(structures_damaged) AS structures_damaged
		   ,SUM(CASE WHEN major_incident = 'TRUE' THEN 1 ELSE 0 END) AS major_incidents
		FROM public.wildfire_incidents w
		INNER JOIN 
			 public.county_codes cc
		 ON cc.county_code = split_part(w.county_ids,',',1)
	) a
) final
ORDER BY final.county_code::int;

