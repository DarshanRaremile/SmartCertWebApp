var express = require('express')
  ,getRoutes = require('./routes/routeController.js')
  ,config = require("./Config/config")
  ,bodyparser = require('body-parser')
  ,mongoose = require("mongoose")
  ,test = require("./test/apptest"),
  fileUpload = require('express-fileupload')
  ,fs = require("fs")
  ,https = require("https");

var app = express();
var router = express.Router();
var sslOptions = {
  key:fs.readFileSync("key.pem","utf8"),
  cert:fs.readFileSync("cert.pem","utf8"),
  passphrase:"xanbellraremile"
};

mongoose.Promise = require('bluebird');
mongoose.connect(config.databaseUrls,{
  useMongoClient: true
});

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json({limit: '50mb'}));
app.use(fileUpload());
app.use("/",express.static("views/dist"));
app.use("/view/certificates/*",express.static("views/dist"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
   /* var allowedOrigins = ["http://ec2-13-126-1-214.ap-south-1.compute.amazonaws.com:3000",'http://localhost:4201',"http://localhost:4200"];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();*/
});
getRoutes.assign(router);
test.assign(router);
app.use("/",router);
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next();
});

https.createServer(sslOptions,app).listen(config.port,function () {
  console.log('App listening on port '+ config.port);
});

