var http = require('http');
var url = require('url');
var mysql = require('mysql');
var express = require("express");
var api = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var formidable = require('formidable');

api.use(express.static('/home/kyle/Pictures/'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({
  extended: true,
}));

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

api.post("/addFile/", async(req,response) =>{
  console.log("addFile");
  var form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
      await con.query(`SELECT * FROM Files WHERE hash=?`,
      [fields.hash],(err,rows)=>{
        if(rows.length!=0){
          response.sendStatus(400);
        }else{
          var oldpath = files.image.path;
          var name=files.image.name;
          var res=name.split(".");
          var newpath = '/home/kyle/Pictures/'+fields.hash+"."+res[1];
          var savepath=fields.hash+"."+res[1];
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            response.end();
          });
          con.query('INSERT INTO Files VALUES(?,?)',
          [fields.hash,savepath]);
          response.sendStatus(200);
        }
      });
    });
});

api.get("/getFile/:hash",async(req,response) =>{
  console.log("getFile");
  await con.query(`SELECT path FROM Files WHERE hash=?`,
  [req.params.hash],(err,rows)=>{
    if(rows.length==0){
      response.sendStatus(404);
    }else{
      response.send(rows[0].path.toString('utf8'));
    }
  })
});

api.get("/getFiles/:hashes",async(req,response) =>{
  console.log("getFiles");
  var obj = JSON.parse(req.params.hashes);
  var result={
    paths: []
  };
  var count=0;
  var values="(";
  for(i in obj.hashes){
    values+="'"+obj.hashes[i]+"',";
    count++;
  }
  values=values.substr(0,values.length-1);
  values+=")";
  console.log(values);
  await con.query(`SELECT path FROM Files WHERE hash IN `+values,
  [values],(err,rows)=>{
    if(rows.length<count){
      response.sendStatus(404);
      return;
    }else{
      for(i in rows){
        result.paths.push(rows[i].path.toString('utf8'));
      }
        response.send(JSON.stringify(result));
    }
  });
});

api.get("/checkFile/:hash",async(req,response) =>{
  console.log("checkFile");
  await con.query(`SELECT path FROM Files WHERE hash=?`,
  [req.params.hash],(err,rows)=>{
    if(rows.length==0){
      response.sendStatus(204);
    }else{
      response.sendStatus(201);
    }
  })
});

api.get("/getAdress",(req,response) =>{
  response.send("adress goes here");
});

api.listen(10101);
