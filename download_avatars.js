// imports the request and fs packages as well as the secret folder for the tiken
var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');

//takes the repo owner and name and converts the body from text to js object. takes a callback function that is called to handle errors and the body from a certain url
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, response, body) {
    var contributers = JSON.parse (body);
    console.log(contributers);
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
      .pipe(fs.createWriteStream(`./avatars/${path}.jpg`));
}

// calls both functions to get each contributer's url then download their avatar. Allows the user to type the command through the terminal
getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  result.forEach(function(contributer) { console.log(contributer.avatar_url); 
  downloadImageByURL(contributer.avatar_url, contributer.login);
});
});