var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');

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
      .pipe(fs.createWriteStream(`./avatarImages/${path}.jpg`));
}

getRepoContributors("jquery", "jquery", function(err, result) {
    result.forEach(function(contributer) { console.log(contributer.avatar_url); 
    downloadImageByURL(contributer.avatar_url, contributer.login);
  });
});
