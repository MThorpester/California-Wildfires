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

  module.exports = {
    getDetail
  };