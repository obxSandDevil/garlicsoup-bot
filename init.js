const Discord = require('discord.js');
const auth = require('./auth.json');
const logger = require('winston');
const request = require('request');
const client = new Discord.Client();

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true,
});

logger.level = 'debug';

function updateHashrate() {
  request({
    url: "https://pool.garlicsoup.xyz/api/stats",
    json: true,
  }, function(err, response, data) {
    if (err) logger.error(err.message);

    if (data) {
      const hashRateString = `${data.pools.garlicoin.hashrateString}/s`;

      logger.info(`setting hash rate to ${hashRateString}`);
      client.user.setPresence({ game: { name: hashRateString, type: 0 }});
    }
  });
}

client.on('ready', function(){
  logger.info('Logged in as: '+ client.user.username +' - ('+ client.user.id +')');

  updateHashrate();

  setInterval(updateHashrate, 60 * 1000);
});

client.login(auth.token);
