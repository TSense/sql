var sql = require("mssql"); //docs: https://www.npmjs.com/package/mssql
var request = require("request");
var evilscan = require("evilscan")

//array of sensors ip
var sensors = [];

var options = {
    target:'192.168.1.0/24',
    port:'7568',
    status:'TRUO', // Timeout, Refused, Open, Unreachable
    banner:true
};
 
var scanner = new evilscan(options);
 
scanner.on('result',function(data) {
    sensors.push(data.ip); //TODO: filter for ESPS and not all ips with port 80 open
    console.log(data);
});

scanner.run(); // Run this whenever needed to recheck for new ESP's'

// configurable variables
var configs = {
    limitLow: 18.50,
    limitHigh: 23.50,
    readInterval: 5 // seconds
}
   
var db = {
    user: 'dev',
    password: 'Tsense696969',
    server: '188.37.86.91',
    port: 1433, //don't use this when connecting to a named instance
    database: "teste"
};

// connect to your database
sql.connect(db, function (err) {

    if (err) console.log(err);

    setInterval(function(){
        request("http://192.168.111.98/", function (error, response, body) {
            if (!error) {
                // create Request object
                var request = new sql.Request();

                // query to the database and get the records
                request.query('INSERT INTO data ("device", "timestamp", "temperature", "humidity") VALUES ('+body.split(";")[0]+', CURRENT_TIMESTAMP,'+body.split(";")[1]+','+body.split(";")[1]+');', function (err, recordset) {

                    if (err) console.log(err)
                });
            } else {
                console.log(error);
            }
        });
    }, configs.readInterval*1000);
});
