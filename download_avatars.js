var request = require('request');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Token': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var contributers = JSON.parse (body);
    var result = [];
    contributers.forEach(function(element) { result.push(element.avatar_url)});
    cb(err, result)
  });
};

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

