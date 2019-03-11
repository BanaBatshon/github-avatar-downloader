var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Token': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, response, body) {
    var contributers = JSON.parse (body);
    cb(err, contributers)
  });

};

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
      .pipe(fs.createWriteStream('./avatar.jpg'));
}

getRepoContributors("jquery", "jquery", function(err, result) {
    result.forEach(function(contributer) { console.log(contributer.avatar_url); });

});
downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");
