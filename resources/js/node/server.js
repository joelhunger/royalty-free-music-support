var express = require("express");
var cors = require('cors');
var app = express();
const passport = require('passport');  
app.use(cors());
app.use(passport.initialize());  
app.use(passport.session());  


const LocalStrategy = require('passport-local').Strategy;
const user = {  
  username: 'jhunger',
  password: 'p00pb00ger',
  id: 1
}

/*passport.use(new LocalStrategy(  
  function(username, password, done) {
	  console.log(username);
    findUser(username, function (err, user) {
		console.log(username);
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }
      if (password !== user.password  ) {
        return done(null, false)
      }
      return done(null, user)
    });
  }
));*/


var server = app.listen(52456, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("RF Management app listening at http://%s:%s", host, port)
});

function getRootFolder() {
	return __dirname;
	// return "X:";
}

function getSongRootFolder() {
	var path = require('path');
	return path.join("X:", "Mixdowns");
}

function getDatabaseFileByNameFullPath(fileNameNoExtension) {
	var path = require('path');
	var fileNameWithExtension = fileNameNoExtension + '.json';
	var rootFolder = getRootFolder();
	return path.join(rootFolder, 'db', fileNameWithExtension);
}

function handleReadFileRequest(request, response) {
	var fileNameNoExtension = '';
	request.on('data', function(data) {
		var parsedData = JSON.parse(data);
		fileNameNoExtension = parsedData.fileName;
	});
	
	request.on('end', function () {
		var filePath = getDatabaseFileByNameFullPath(fileNameNoExtension);

		fs = require('fs')
		fs.readFile(filePath, 'utf8', function (err,data) {
		  if (err) {
			return console.log(err);
		  }
		  response.end(data);
		});
	});
}

function handleWriteFileRequest(request, response) {
	var jsonString = '';
	var fileNameNoExtension = '';
	request.on('data', function (data) {
		var parsedData = JSON.parse(data);
		fileNameNoExtension = parsedData.fileName;
		jsonString += JSON.stringify(parsedData.data);
	});

	request.on('end', function () {
		var filePath = getDatabaseFileByNameFullPath(fileNameNoExtension);
		
		fs = require('fs')
		fs.writeFile(filePath, jsonString, 'utf8', function (err,data) {
		  if (err) {
			  response.writeHead(500, { 'Content-Type': 'application/json' }); 
			  response.json(data);
			return console.log(err);
		  } else {
			  response.writeHead(200, { 'Content-Type': 'application/json' }); 
			  response.json(data);
		  }
		});
	});	
}

app.get('/testyo',
  passport.authenticate('local', { session: false }),
  function(req, res) {
    res.json(req.user);
  });

//app.post('/signup', passport.authenticate('local', {
//        successRedirect : '/profile', // redirect to the secure profile section
//        failureRedirect : '/signup', // redirect back to the signup page if there is an error
//    }));

app.post('/signupt', function(request, response) {
	
	var isValidated = false;
	request.on('data', function(data) {
		var parsedData = JSON.parse(data);
			console.log(parsedData.userName);
			console.log(parsedData.password);
		if ('jhunger' == parsedData.userName && 'p00pb00ger' == parsedData.password)
		{
			isValidated = true;
		}
	});
	
	request.on('end', function() {
		if (isValidated)
		{
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end("True\n");
		}
		else
		{
			response.writeHead(403, {"Content-Type": "text/plain"});
			response.end("False\n");
		}
	});	
});

app.get('/amIUp', function(request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Yeah\n");
});

app.post('/readDatabaseFile', function(request, response) {
	handleReadFileRequest(request, response);
});

app.post('/writeDatabaseFile', function(request, response) {	
    handleWriteFileRequest(request, response);
});

app.post('/getSongFile-attempt1', function(request, response) {
	var fileName;
	var songFolder;

	request.on('data', function(data) {
		var parsedData = JSON.parse(data);
		fileName = parsedData.fileName;
		songFolder = parsedData.songFolder;
	});
	
	request.on('end', function() {
		
		var path = require('path');
		var rootFolder = getSongRootFolder();
		
		var filePath = path.join(rootFolder, songFolder);
		filePath = path.join(filePath, fileName);
		console.log(filePath);
		
		var fs = require('fs');
		fs.createReadStream(filePath).pipe(response);
	});
	
});

app.post('/getSongFile', function(request, response) {
	var fileName;
	var songFolder;

	request.on('data', function(data) {
		var parsedData = JSON.parse(data);
		fileName = parsedData.fileName;
		songFolder = parsedData.songFolder;
	});
	
	request.on('end', function() {
		var path = require('path');
		var rootFolder = getSongRootFolder();
		
		var filePath = path.join(rootFolder, songFolder);
		filePath = path.join(filePath, fileName);
		console.log(filePath);

		response.download(filePath); 
		
	});		
});



