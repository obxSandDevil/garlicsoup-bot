var Discord = require('discord.js');
var auth = require('./auth.json');
var logger = require('winston');
var request = require('request');
var client = new Discord.Client();

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});

logger.level = 'debug';

var update_hashrate = function(){
  request({
    url: "https://pool.garlicsoup.xyz/api/stats",
    json: true,
  }, function(err, response, data){
    if (err) logger.error(err.message);

    if (data){
      hashrate_string = data.pools.garlicoin.hashrateString +"/s";

      logger.info("setting hash rate to "+ hashrate_string);
      client.user.setPresence({game: {name: hashrate_string, type: 0}});
    }
  });
}

client.on('ready', function(){
  logger.info('Logged in as: '+ client.user.username +' - ('+ client.user.id +')');

  update_hashrate();

  update_interval = setInterval(function(){
    update_hashrate();
  }, 60 * 1000);
});

client.login(auth.token);
