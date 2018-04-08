var dotenv = require('dotenv');
dotenv.load();

const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })

// restart the dyno
heroku.delete('/apps/doge-eval-bot/dynos/web.1').then(app => {});
