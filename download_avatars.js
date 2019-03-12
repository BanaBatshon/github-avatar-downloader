// imports the request and fs packages as well as the secret folder for the tiken
var request = require('request');
var fs = require('fs');
require('dotenv').config()


console.log('Welcome to the GitHub Avatar Downloader!');

//takes the repo owner and name and converts the body from text to js object. takes a callback function that is called to handle errors and the body from a certain url
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.GITHUB_TOKENsec
    }
  };

  request(options, function(err, response, body) {
    var contributers = JSON.parse (body);
    // console.log(contributers);
    cb(err, contributers)
  });

};
// takes the url and path of the contributer, downlaods their avatar and saves it to a folder with the other avatars
function downloadImageByURL(url, path) {
  request.get(url)
       .on('error', function (err) {
         throw err; 
       })
       .on('response', function (response) {
        console.log('Response Status Code: ', response.statusCode);
        console.log(" downloading image...");
      })
      .on('end', function (response) {
        console.log('download complete!', response)
      })
      if (fs.existsSync('./avatars')) {
        request.get(url).pipe(fs.createWriteStream(`./avatars/${path}.jpg`));
    } else {
      fs.mkdirSync('avatars');
      request.get(url).pipe(fs.createWriteStream(`./avatars/${path}.jpg`));
    }
      
}

// calls both functions to get each contributer's url then download their avatar. Allows the user to type the command through the terminal
getRepoContributors(process.argv[2], process.argv[3], function(err, result) {

  // prints an error if number of arguments or type of arguments is incorrecr
  if ((process.argv).length !== 4) {
    console.log("Error: please enter two arguments");
  } else {
  result.forEach(function(contributer) { console.log(contributer.avatar_url); 
  downloadImageByURL(contributer.avatar_url, contributer.login);
  });
  };
});