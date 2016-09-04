/**
 * Created by hansel.ramos on 9/3/2016.
 */

var serialport = require('serialport');
var http = require('http');

var SerialPort = serialport.SerialPort;

var options = {
    host: 'localhost',
    port: 3000,
    path: '/lights/==',
    method: 'GET'
};

var sp = new SerialPort('COM3', {
    baudrate: 9600,
    parser: serialport.parsers.readline("\n")
});

sp.on ('open', function () {
    console.log("Open");
    sp.on ('data', function( data ) {
        //console.log("data " + data.toString());
    });
    setInterval(function(){
        http.request(options, function(res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (result) {
                var lights = JSON.parse(result);
                for(var i = 0; i<lights.length; i++){
                    //console.log(lights[i]);
                    if(lights[i].value){
                        sp.write(lights[i].on, function(){
                            //console.log("sended: "+lights[i].on);
                        });
                    }else{
                        sp.write(lights[i].off, function(){
                            //console.log("sended: "+lights[i].off);
                        });
                    }
                }
            });
        }).end();

    },250);
});