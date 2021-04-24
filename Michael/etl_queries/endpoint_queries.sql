-- End point /details
SELECT * FROM public.wildfire_incidents order by duration_interval

CREATE VIEW vw_COUNTY_CODES
AS
(
  SELECT A.*
  FROM
  (
	  SELECT '0' AS county_code, 'ALL' AS county_description
	  UNION
	  SELECT * 
	  FROM public.county_codes 
  ) A
  ORDER BY A.county_code::integer ASC
);

SELECT 
   a.*
  ,COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0) AS acres_burned_prior_year
  ,CASE
     WHEN COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0) = 0 THEN 0
	 ELSE
	    (a.acres_burned - COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0))  / (COALESCE(LAG(a.acres_burned) OVER (PARTITION BY a.county_code ORDER BY a.year),0) * 1.0000)
   END AS acres_burned_pct_increase
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
	FROM public.wildfire_incidents w
	INNER JOIN 
		 public.county_codes cc
	 ON cc.county_code = split_part(w.county_ids,',',1)
	GROUP BY cc.county_code, cc.county_description,archive_year
) a
ORDER BY county_code::int, year;



  module.exports = {
    getDetail,
    getCountyCodes
  };