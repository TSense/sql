var dgram = require('dgram');
var VESP = require('./validEspString');

var clearString=process.hrtime()[1];

//console.log(VESP.do(clearString.toString()));
ESPs=[];
var broadcastAddress = "192.168.1.255";


setInterval(function(){
    console.log("ESPs: "+ ESPs);
}, 5000);

VESP.setVerbose(false);


var client = dgram.createSocket("udp4");
client.bind();    
client.on("listening", function () {
    client.setBroadcast(true);
    setInterval(function(){
		message=VESP.getString();
        client.send(message, 0, message.length, 4210, broadcastAddress);
    },10000);
    
    //console.log("I sent: "+message);
    client.on("message", function(msg, rinfo){
		//console.log(rinfo);
        if(VESP.validString(rinfo.address, msg.toString())){
            console.log("Valid ESP found on "+rinfo.address);
            if(ESPs.indexOf(rinfo.address)==-1)
                ESPs.push(rinfo.address);
        }
		//console.log(rinfo.address);
        //client.close();
    });
    
});