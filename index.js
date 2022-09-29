const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

// Database
const conn = mysql.createConnection({
   host: process.env.DBIP,
   user: process.env.DBUSER,
   password: process.env.DBPASS,
   database: 'strafbakken'
});

function db_connect() {
   conn.connect( error => {
      if (error) throw error;
      console.log("Connected to the database");
   });
}

db_connect();

// Routes
const app = express();

app.use('/', express.static('public'));

app.get('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {

      // Check if db connection is still alive
      conn.ping( err => {
         if (err) {
            conn.end();
            db_connect();
         }
      });

      const query = 'SELECT * FROM strafbakken';
      conn.query(query, (error, results) => {
         if (error) {
            console.error(error);
            res.sendStatus(500);
         } else {
            res.send(JSON.stringify(results));
         }
      })
   } else {
      res.sendStatus(403);
   }
});

app.post('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {
      const query = 'UPDATE strafbakken SET bakken = bakken + 1 WHERE name = ?';
      conn.query(query, [req.headers.name], (error) => {
         if (error) {
            console.error(error);
            res.sendStatus(500);
         } else {
            res.sendStatus(200);
         }
      })
   } else {
      res.sendStatus(403);
   }
})

app.delete('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {
      const query = 'UPDATE strafbakken SET bakken = bakken - 1 WHERE name = ?';
      conn.query(query, [req.headers.name], (error) => {
         if (error) console.error;
         res.sendStatus(200);
      })
   } else {
      res.sendStatus(403);
   }
})

// Listen
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening on port ${port}...`);