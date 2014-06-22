#!/usr/bin/env node

/*
 * Does Follow for Twitter
 *
 * USAGE:
 * ./df.js <user1> <user2>
 */

var fs = require('fs'),
    async = require('async'),
    Twit = require('twit');

var T, name1, name2;

var doesFollow = function(id1, id2, flwrs1, flwrs2) {
  var f = function(id, flwrs) {
    // Check if the ID is in the Following list
    return flwrs.indexOf(+id) >= 1 ? ' follows ' : ' does not follow ';
  };

  console.log(name1 + f(id2, flwrs1) + name2);
  console.log(name2 + f(id1, flwrs2) + name1);
};

var getUserId = function(name, cb) {
  T.get('users/show', {screen_name: name}, function(err, data) {
    if (err) {
      console.log('Error fetching user: ' + name);
      console.log(err);
      cb(err);
      return;
    }

    cb(null, data.id_str);
  });
};

var getFollowing = function(name, cb) {
  T.get('friends/ids', {screen_name: name}, function(err, data) {
    if (err) {
      console.log('Error fetching friends for ' + name);
      console.log(err);
      cb(err);
      return;
    }

    // First 'friends/ids' req only returns the first 5000. Need to handle this.
    if (data.ids.length >= 5000) {
      console.log('Warning: ' + name + '\'s friend count is >= ' + data.ids.length);
    }

    cb(null, data.ids);
  });
};

var fetchData = function(cb) {
  var args = process.argv.slice(2);
  name1 = args[0];
  name2 = args[1];

  // Get the user IDs and following lists of the two users
  async.parallel([
    getUserId.bind(null, name1),
    getUserId.bind(null, name2),
    getFollowing.bind(null, name1),
    getFollowing.bind(null, name2)
  ],
  function(err, res) {
    cb(err, res);
  });
};

var authorize = function(keys, cb) {
  T = new Twit({
    consumer_key: keys[0],
    consumer_secret: keys[1],
    access_token: keys[2],
    access_token_secret: keys[3]
  });

  cb();
};

var readFile = function(cb) {
  fs.readFile('keys', 'utf8', function(err, data) {
    if (err) {
      console.log('Error reading keys file');
      cb(err);
      return;
    }

    data = data.split('\n');
    data.splice(4); // Get the first 4 items

    cb(err, data);
  });
};

async.waterfall([
  readFile,
  authorize,
  fetchData
],
function(err, res) {
  if (err) {
    console.log('Aborting due to error');
    return -1;
  }

  doesFollow(res[0], res[1], res[2], res[3]);
});

