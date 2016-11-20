var express = require('express');
var app = express();

app.get('/', function (req, res) {

    var sql = require("mssql");
    var config = {
        user: 'dev',
        password: 'Tsense696969',
        server: 'remote.gpereira.tk',
        database: "teste"
        // If you are on Microsoft Azure, you need this:  
        //options: {encrypt: true, database: 'AdventureWorks'}  
    };
    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('INSERT * from dbo.tsense', function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset);

        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});