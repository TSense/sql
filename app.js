var express = require('express');
var app = express();
var sql = require("mssql"); //docs: https://www.npmjs.com/package/mssql

// configurable variables
var configs = {
    limitLow: 0,
    limitHigh: 0,
    readInterval: 5
}

app.get('/', function (req, res) {
    
    var db = {
        user: 'dev',
        password: 'Tsense696969',
        server: 'remote.gpereira.tk',
        port: 1433, //don't use this when connecting to a named instance
        database: "teste"
    };
    // connect to your database
    sql.connect(db, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('SELECT * from dbo.tsense', function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset);

        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});