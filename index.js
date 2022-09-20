const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

// Database
const db = mysql.createConnection({
   host: process.env.DBIP,
   user: process.env.DBUSER,
   password: process.env.DBPASS,
   database: 'strafbakken'
});

db.connect( (error) => {
   if (error) console.error;
   console.log('Connect to the database');
})

// Routes
const app = express();

app.use('/', express.static('public'));

app.get('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {
      const query = 'SELECT * FROM strafbakken';
      db.query(query, (error, results) => {
         if (error) console.error;
         res.send(JSON.stringify(results));
      })
   } else {
      res.sendStatus(403);
   }
});

app.post('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {
      const query = 'UPDATE strafbakken SET bakken = bakken + 1 WHERE name = ?';
      db.query(query, [req.headers.name], (error) => {
         if (error) console.error;
         res.sendStatus(200);
      })
   } else {
      res.sendStatus(403);
   }
})

app.delete('/bakken', (req, res) => {
   if (req.headers.token == process.env.INLOG_PASS) {
      const query = 'UPDATE strafbakken SET bakken = bakken - 1 WHERE name = ?';
      db.query(query, [req.headers.name], (error) => {
         if (error) console.error;
         res.sendStatus(200);
      })
   } else {
      res.sendStatus(403);
   }
})

// Listen
app.listen(process.env.PORT || 8080);
console.log('Listening...');