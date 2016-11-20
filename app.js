var Connection = require('tedious').Connection;  
    var config = {  
        userName: 'dev',  
        password: 'Tsense696969',  
        server: 'remote.gpereira.tk'
        // If you are on Microsoft Azure, you need this:  
        //options: {encrypt: true, database: 'AdventureWorks'}  
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
        console.log("Connected");  
    });