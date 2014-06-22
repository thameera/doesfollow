# DoesFollow

A stalking machine. Check if two users follow each other on Twitter.

## How to install

You need to have nodejs/npm installed.

1. Clone the repo

```
git clone https://github.com/thameera/doesfollow
cd doesfollow
```

2. Install the dependencies

```
npm install
```

3. Create an app in https://dev.twitter.com and create a `keys` file in the cloned directory. It should have the consumer_key, consumer_secret, access_token and access_token_secret in four lines in that order.

4. Good to go!

You can check two users with `node df.js <user1> <user2>`

```
$ node df.js thameera angustweets

thameera follows angustweets
angustweets does not follow thameera
```

## TODO

* Make it work when the friend count of a user exceeds 5000

