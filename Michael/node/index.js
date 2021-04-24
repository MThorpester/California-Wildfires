const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const app = express()
const port = 8080
const db = require('./queries')

var httpServer = http.createServer(app);

httpServer.listen(8080);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres Wildfire API'})
  });


  // app.listen(port, () => {
  //   console.log(`App running on port ${port}.`)
  // });

  app.get('/detail', db.getDetail);
  app.get('/county_codes',db.getCountyCodes);
  app.get('/yearly_stats_detail',db.getYearlyStats);
  app.get('/yearly_stats_county/:county',db.getYearlyStatsByCounty);
