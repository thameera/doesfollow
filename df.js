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
  var f = function(id, flwrs, name1, name2) {
    if (flwrs.indexOf(id) >= 0) {
      console.log(name1 + ' follows ' + name2);
    } else {
      console.log(name1 + ' does not follow ' + name2);
    }
  };

  f(Number(id2), flwrs1, name1, name2);
  f(Number(id1), flwrs2, name2, name1);
};

var getUserId = function(name, cb) {
  //console.log('Getting user id for ' + name);
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
  //console.log('Getting friends for ' + name);
  T.get('friends/ids', {screen_name: name}, function(err, data) {
    if (err) {
      console.log('Error fetching friends for ' + name);
      console.log(err);
      cb(err);
      return;
    }

    if (data.ids.length >= 5000) {
      console.log('Warning: ' + name + '\'s friend count is ' + data.ids.length);
    }

    cb(null, data.ids);
  });
};

var fetchData = function(cb) {
  //console.log('Fetching data');
  var args = process.argv.slice(2);
  name1 = args[0];
  name2 = args[1];

  //console.log('Names are ' + name1 + ' and ' + name2 + '\n');

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
  //console.log('Authorizing');
  T = new Twit({
    consumer_key: keys[0],
    consumer_secret: keys[1],
    access_token: keys[2],
    access_token_secret: keys[3]
  });

  cb();
};

var readFile = function(cb) {
  //console.log('Reading file');
  fs.readFile('keys', 'utf8', function(err, data) {
    if (err) {
      console.log("Error reading keys file");
      cb(err);
      return;
    }

    data = data.split('\n');
    data.splice(4);

    cb(err, data);
  });
};

async.waterfall([
  function(cb) {
    readFile(cb);
  },
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

