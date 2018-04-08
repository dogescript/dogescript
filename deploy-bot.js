var dotenv = require('dotenv');
dotenv.load();
console.log('Loaded env.');

const Heroku = require('heroku-client');
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN });

// restart the dyno
console.log('Restarting dino.');
heroku.delete('/apps/doge-eval-bot/dynos/web.1').then(app => {});
