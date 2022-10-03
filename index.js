const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

// Database
function connect_db() {
   const connection = mysql.createConnection({
      host: process.env.DBIP,
      user: process.env.DBUSER,
      password: process.env.DBPASS,
      database: 'strafbakken'
   });
   
   connection.connect( error => {
      if (error) {
         console.error(error);
         return res.statusStatus(500);
      }
   });

   return connection;
}

// Routes
const app = express();

app.use('/', express.static('public'));

app.get('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {

      // Make db connection
      const conn = connect_db();

      // Query
      const query = 'SELECT * FROM strafbakken';
      conn.query(query, (error, results) => {
         if (error) {
            console.error(error);
            res.sendStatus(500);
            conn.destroy();
         } else {
            res.send(JSON.stringify(results));
            conn.end();
         }
      });

   } else {
      res.sendStatus(403);
   }
});

app.post('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {

      // Make db connection
      const conn = connect_db();

      // Query
      const query = 'UPDATE strafbakken SET bakken = bakken + 1 WHERE name = ?';
      conn.query(query, [req.headers.name], (error) => {
         if (error) {
            console.error(error);
            res.sendStatus(500);
            conn.destroy();
         } else {
            res.sendStatus(200);
            conn.end();
         }
      });

   } else {
      res.sendStatus(403);
   }
})

app.delete('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {

      // Make db connection
      const conn = connect_db();

      // Query
      const query = 'UPDATE strafbakken SET bakken = bakken - 1 WHERE name = ?';
      conn.query(query, [req.headers.name], (error) => {
         if (error) {
            console.error(error);
            res.sendStatus(500);
            conn.destroy();
         } else {
            res.sendStatus(200);
            conn.end();
         }
      });

   } else {
      res.sendStatus(403);
   }
})

// Listen
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening on port ${port}...`);