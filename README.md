# DoesFollow

A stalking machine. Check if two users follow each other on Twitter.

## How to install

You need to have nodejs/npm installed.

##### Clone the repo and install dependencies

```
git clone https://github.com/thameera/doesfollow
cd doesfollow
npm install
```

##### Create an app

Create an app in https://dev.twitter.com and create a `keys` file in the cloned directory. It should have your new app's `consumer_key`, `consumer_secret`, `access_token` and `access_token_secret` in four lines in that order.

##### Good to go!

You can check two users with `node df.js <user1> <user2>`

```
$ node df.js thameera angustweets

thameera follows angustweets
angustweets does not follow thameera
```

## TODO

* Make it work when the friend count of a user exceeds 5000

