// simple file operation
var fs = require('fs');
 
// var encoder = require('punycode');

// find the place of files
var path = require('path');

var htmldir = '/media/BeiDou/html/';

// server side about
var http = require('http');
var url = require('url');

// use the linux system tool --- the 'ls' and 'head' command
var child_process = require('child_process');
var util = require('util');

// we do not need the pic name argument, cause we have 
// it in the json file ahead already
// .........:)



// another way to pick up a pic
function generatePicName(picdir)
{
var exec = require('child_process').exec;
cmd = 'ls /media/BeiDou/html -t | sort -R | head -n 1 | tr -d [:cntrl:] > tmppicname';
exec(cmd);
}



function pushOnePic(picdir)
{
generatePicName(picdir);  // then it is in one file, we have to read it out
var tmpname = fs.readFileSync('tmppicname','utf-8');
return tmpname;
}


// simple functional test
// write image only if the url request for only images, (tip: see the format)
function htmlpush_server(){

http.createServer(function(req,res){

// judge from the request url information
var tmp = req.url;
var params = url.parse(tmp);
var htmlname = "";

if(params.query == 'index')
{
// push the image to the client side
// here we have to first generate the needed image name, or 
// in other words, pick up a pic randomly

	// actually we have two kinds of pictures , jpg and png format
	res.writeHead(200,{'Content-Type':'text/html'});
	htmlname = pushOnePic(htmldir);
	// testing point
	 console.log('the chosen html name is : '+htmlname);
	if(htmlname==""){

		res.write(fs.readFileSync('./html1.htm'));
		res.end('html sent...., with name of html1.htm :)');

	}
	else{
		res.write(fs.readFileSync(htmldir+htmlname));
		res.end('html sent...., with name of '+htmlname+' :)');
	}
	
}

}

).listen(1337);
console.log('Server running at http://you know the ip:1337/');

}

function main(argv)
{

  htmlpush_server();

}main(process.argv.slice(2));
