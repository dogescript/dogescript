// use express to just listen so heroku doesn't redeploy us constantly
var dotenv = require('dotenv');
dotenv.load();
console.log('Loaded env.');

const Heroku = require('heroku-client');
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

// restart the dyno
console.log('Restarting dino.');
heroku.delete('/apps/doge-eval-bot/dynos/web.1').then(app => {});

const express = require('express')
const app = express()
const port = 3000

app.get('/', (request, response) => {
  response.send('Hello from Express!')
});

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});
