# Project Notes

I have auto-format on save setup, so if it looks like I went crazy with semi-colons, at least you'll know why. :)

## Setup

I hadn't used `yarn` in a while - and actually it wasn't on my machine. Installation was simple though, `npm install --global yarn`, which I got from their [docs](https://classic.yarnpkg.com/en/docs/install#mac-stable).

To install `mongodb`, I followed the [directions](https://docs.mongodb.com/v5.0/tutorial/install-mongodb-on-os-x/) for installing on macOS for version 5.0 (:fingers-crossed: I got a compatible version). I tried installing with brew, but got an error message saying my Command Line Tools are too outdated. I had to manually remove them, and reinstall. That took ~20 mins. After that, the installation when smoothly.

The instructions for how to start the `mongodb` process differed a little in the directions, so I added a new script to the webserver/packages.json to start it (`yarn mongodb` to run it).

## Objectives

I list them here in order that I completed them:

1. Seed the database. I used a NPM package, `mongoose-seed`, and created a file named `seed.js` in the root of the webserver project. It runs after the `mongodb` script automatically because I named the script `postmongodb`. I did this to ensure that Mongo DB was up and running before trying to seed it.
