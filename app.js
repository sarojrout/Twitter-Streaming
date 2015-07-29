var express = require('express'),
	 app = express().use(express.static(__dirname + '/public')),
     http = require('http').Server(app),
     io = require('socket.io')(http),
	twitter = require('twitter');
	
	var google = 0,total = 0;
	
	http.listen(3000,function(){
		console.log('listening on 3000')
	});

	var twit = new twitter({
	  consumer_key: '<your consumer key>',
	  consumer_secret: '<your consumer secret>',
	  access_token_key: '<your access token key>',
	  access_token_secret: '<your access token secret>'
	});

	twit.stream('statuses/filter',{ track:'google' }, function(stream){
		console.log('is it connecting to twitter')
		stream.on('data',function(data){
			console.log(data.user.screen_name+':'+data.text);
			var text = data.text.toLowerCase();
			if(text.indexOf('google') !=-1){
				google++
				total++
			}
			io.sockets.emit('tweet',{
			user: data.user.screen_name,
			text:data.text,
			google: google
			});
		
			});
			
		});
		app.get('/', function(req,res){
				res.sendfile(__dirname+'/index.html');
	});