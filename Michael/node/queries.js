const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: '35.223.159.208',
  database: 'wildfire',
  password: 'password',
  port: 5432,
});

const getDetail = (request, response) => {
    pool.query('SELECT * FROM public.wildfire_incidents', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  };

  const getCountyCodes = (request, response) => {
    pool.query('SELECT * FROM vw_COUNTY_CODES ORDER BY county_code::integer ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  };

  const getYearlyStats = (request, response) => {
    pool.query('SELECT * FROM public.vw_county_stats_yearly ORDER BY county_code::integer ASC,year', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  };


  const getYearlyStatsByCounty = (request, response) => {
    const county = request.params.county;
    pool.query('SELECT * FROM public.vw_county_stats_yearly WHERE county_description = $1 ORDER BY county_code::integer ASC,year',
      [county], 
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
  };



  module.exports = {
    getDetail,
    getCountyCodes,
    getYearlyStats,
    getYearlyStatsByCounty
  };