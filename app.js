var sql = require("mssql"); //docs: https://www.npmjs.com/package/mssql
var request = require("request");
var evilscan = require("evilscan");

//array of sensors ip
var sensors = [];

var options = {
    target: '192.168.1.0/24', // scans on all ips
    port: '7568', // uncommon port
    status: 'O', // Timeout, Refused, Open, Unreachable
    concurrency: 20, //Number of scans at the same time
    banner: true
};

// configurable variables
var configs = {
    limitLow: 18.50,
    limitHigh: 23.50,
    readInterval: 5, // seconds
    scanInterval: 20 // seconds
}

// database credentials
var db = {
    user: 'dev',
    password: 'arroz',
    server: '188.37.86.91',
    port: 1433, //don't use this when connecting to a named instance
    database: "tsense"
};

// Function for validating the input from an ESP

function valid_esp(text) {
    if (!(typeof text === 'string' || text instanceof String)) {
        //console.log("failed type test!");
        return false;
    } else {
        if (text.charAt(17) != ";") {
            //console.log("failed ``;`` test!");
            return false;
        } else {
            if (!(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(text.split(';')[0]))) {
                //console.log("failed regex!");
                return false;
            }
            else {
                if (text.split(';').length != 3) {
                    // console.log("number of elements in splitted array didn't check!");
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }
}

var scanner = new evilscan(options);

scanner.on('result', function (data) {
    if (valid_esp(data.banner)) {
        sensors.push(data.ip);
        console.log("Added:");
    } else {
        console.log("Not added:");
    }
    console.log(data);
});

// Scans for new ESP
setInterval(function () {
    scanner.run();
}, configs.scanInterval * 1000);

// connect database
sql.connect(db, function (err) {
    if (err) console.log(err);

    setInterval(function () {
        var req_config = new sql.Request();
                    // query to the database and get the configurations
                    req_config.query('SELECT * FROM config', function (err, recordset) {
                        if (err) console.log(err);
                        console.log(recordset);
                    });
        sensors.forEach(function (sensor) {
            request("http://" + sensor + ":" + options.port + "?templow=" + configs.limitLow + "&temphigh=" + configs.limitHigh, function (error, response, body) {
                if (!error) {
                    // create Request object
                    var req_data = new sql.Request();
                    // query to the database and get the records
                    req_data.query('INSERT INTO data ("device", "timestamp", "temperature", "humidity") VALUES (\'' + body.split(";")[0] + '\', CURRENT_TIMESTAMP,' + body.split(";")[1] + ',' + body.split(";")[2] + ');', function (err, recordset) {
                        if (err) console.log(err)
                    });
                } else {
                    // Remove ESP if it loses connection
                    if (error.code == 'ECONNREFUSED') {
                        sensors.splice(sensors.indexOf(error.address), 1);
                    }
                    console.log(error);
                }
            });
        });
    }, configs.readInterval * 1000);
});
