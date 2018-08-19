var http = require('http');
var url = require('url');
var mysql = require('mysql');
var express = require("express");
var api = express();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "31415926",
  database: "dbIP"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

api.get("/addFile/:hash/:data", async(req,response) =>{
  result = await con.query(`SELECT * FROM Files WHERE hash=?`,
  [req.params.hash],(err,rows)=>{
    if(rows.length!=0){
      response.sendStatus(401);
    }else{
      con.query('INSERT INTO Files VALUES(?,?)',
      [req.params.hash,req.params.data]);
      response.sendStatus(200);
    }
  });
});

api.get("/getFile/:hash",async(req,response) =>{
  await con.query(`SELECT file FROM Files WHERE hash=?`,
  [req.params.hash],(err,rows)=>{
    if(rows.length==0){
      response.sendStatus(404);
    }else{
      response.send(rows[0].file.toString('utf8'));
    }
  });
});

api.listen(8080);
