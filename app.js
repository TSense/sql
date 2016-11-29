var sql = require("mssql"); //docs: https://www.npmjs.com/package/mssql
var request = require("request");
var evilscan = require("evilscan");

//array of sensors ip
var sensors = [];

var options = {
    target: '192.168.1.0/24',
    port: '7568',
    status: 'O', // Timeout, Refused, Open, Unreachable
    banner: true
};

// configurable variables
var configs = {
    limitLow: 18.50,
    limitHigh: 23.50,
    readInterval: 5, // seconds
    scanInterval: 20
}

var db = {
    user: 'dev',
    password: 'arroz',
    server: '188.37.86.91',
    port: 1433, //don't use this when connecting to a named instance
    database: "tsense"
};

var scanner = new evilscan(options);

scanner.on('result', function (data) {
    sensors.push(data.ip); //TODO: filter for ESPS and not all ips with port 80 open
    console.log(data);
});
setInterval(function () {
    scanner.run();
}, configs.scanInterval * 1000);

// connect to your database
sql.connect(db, function (err) {
    if (err) console.log(err);

    setInterval(function () {
        sensors.forEach(function (sensor) {
            request("http://" + sensor + ":" + options.port, function (error, response, body) {
                if (!error) {
                    // create Request object
                    var request = new sql.Request();

                    // query to the database and get the records
                    request.query('INSERT INTO data ("device", "timestamp", "temperature", "humidity") VALUES (' + body.split(";")[0] + ', CURRENT_TIMESTAMP,' + body.split(";")[1] + ',' + body.split(";")[2] + ');', function (err, recordset) {

                        if (err) console.log(err)
                    });
                } else {
                    console.log(error);
                }
            });
        });

    }, configs.readInterval * 1000);
});
