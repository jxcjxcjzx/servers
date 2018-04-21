// simple file operation
var fs = require('fs');
 
// var encoder = require('punycode');

// find the place of files
var path = require('path');

var picdir = '/media/BeiDou/pic/';

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
// before this change we met with some problem that
// we can not rename the corresponding picture, cause
// of in the following command we specify the directory to look at.
// so we have to change this, and here now the way is not what we like
cmd = 'ls /media/BeiDou/pic -t | sort -R | head -n 1 | tr -d [:cntrl:] > tmppicname';
exec(cmd);
}


// the function for renaming the picture
function renamePic(src,des)
{
if(src!=""&&des!=""&&src.length>4)
{
// make the format of the pic name the same
// till now we only give support to png and jpg format
if(des.length>4&&(des.substring(des.length-4,des.length-3)=="."))
{
var _srccut = src.substring(src.length-4,src.length);
var _desnorm = des.substring(0,des.length-4)+_srccut;
}
else{
var _srccut = src.substring(src.length-4,src.length);
var _desnorm = des+_srccut;
}
console.log('src pic name is: '+src);
console.log('des pic name is: '+_desnorm);
fs.rename(src,_desnorm);

}

}

function pushOnePic(picdir)
{
generatePicName(picdir);  // then it is in one file, we have to read it out
var tmpname = fs.readFileSync('tmppicname','utf-8');
return tmpname;
}


// simple functional test
// write image only if the url request for only images, (tip: see the format)
function picnamer_server(){

http.createServer(function(req,res){

// see the request
// console.log(req);

// judge from the request url information
var tmp = req.url;
var params = url.parse(tmp);
var postData = "";
req.addListener("data",function(postDataChunk){
	postData+=postDataChunk;
	// cause the name is not very long, so we cut it short
	var _strcut = postData.substring(5,postData.length);  // this is the name of the picture
	// console.log('old name is: '+picname);
	// console.log('new name is: '+_strcut);
	// do the renaming operation
	renamePic(picdir+picname,picdir+_strcut);
//	postData = "";
});
if(params.query == 'index')   // push the index html page
{
	res.write(fs.readFileSync('./index.html'));
	res.end('html sent....:) ');
}
else{
if(params.query == 'upload')   // change the name of the picture
{
  // clean up all the data	
	postData = "";
	res.end('post received ....:) ');
}
else if(params.query == 'indexone')
{
// push the image to the client side
// here we have to first generate the needed image name, or 
// in other words, pick up a pic randomly

	// actually we have two kinds of pictures , jpg and png format
	res.writeHead(200,{'Content-Type':'image/png'});
	picname = pushOnePic(picdir);
	// testing point
	 console.log('the chosen pic name is : '+picname);
	if(picname==""){
		// in case we didn't get the name	
		// do the name reading again
		// in case we didn't have chance to 
		// get the name, prepare a name ahead
		res.write(fs.readFileSync('./image1.png'));
		res.end('image sent...., with name of image1.png :)');
	}
	else{
		res.write(fs.readFileSync('/media/BeiDou/pic/'+picname));
		res.end('image sent...., with name of '+picname+':)');
	}
	
}

}

}).listen(1337);
console.log('Server running at http://you know the ip:1337/');

}

function main(argv)
{

  picnamer_server();

}main(process.argv.slice(2));
