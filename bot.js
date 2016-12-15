const Discord = require('discord.js');
const yt = require('ytdl-core');
const bot = new Discord.Client();
const token = require('./tokens.json');
const conf = require('./config.json');

var started = new Date().getTime();

// the bot has ran properly!
bot.on('ready', () => {
  console.log('CakeBot has been baked!');
  console.log('CakeBot has restarted at ' + started + '!');
  console.log('Username: ' + bot.user.username);
  bot.user.setGame("Cake!");
  bot.user.setAvatar('avatar.jpg');
  console.log('Avatar set correctly!');
  console.log('We are now ready to start!');
});

bot.on("disconnected", function() {
	console.log('CakeBot has crashed, attempting to reconnect!');
	bot.login(token.logintoken);
	console.log('Reconnecting');
})

bot.on('message', message => {
		
	var prefix = "!"
	if(message.author.bot) return;
		
  // setting up the help command
  if (message.content === prefix + 'help') {
    message.channel.sendMessage("Hello " + message.author + " I am CakeBot, a multipurpose bot baked at 420°C!\n" +
	"!help displays this help menu!\n" +
	"!play will play a song (currently in testing)\n" +
	"!status will display my uptime and other information!\n" +
	"!stop will stop the currently playing song!\n" +
	"I am still in early development so expect new features soon"); 
  }
  
	if (message.content.startsWith(prefix + 'play')){
	
	
	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) {
      return message.channel.sendMessage("You didn't provide a video for me to play!");
    }
	
	let args = message.content.split(" ").slice(1);
	let url = args[0];
	

	
	
	if(!voiceChannel != null){
		voiceChannel.join().then(connection => {
			let stream = yt(url, {audioonly:true});
			const dispatcher = connection.playStream(stream);

			yt.getInfo(url, function(err, info) {
				message.channel.sendMessage("Now playing " + info.title + "!");
			});
					
	
	dispatcher.on('end', () => {
	stream.destroy();
	voiceChannel.leave();
	
	
	yt.getInfo(url, function(err, info) {
	message.channel.sendMessage("Finished playing " + info.title);
										});
								
							})		
						})
				}
				
	}
	
	if (message.content == conf.prefix + "stop") {
	message.member.voiceChannel.leave();
	};

	
	if (message.content == conf.prefix + "status") {
		message.channel.sendMessage("Current Uptime: " + (Math.round(bot.uptime / (1000*60*60))) + " Hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds.");
	}
	
 }); 
 
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});

// log our bot in
bot.login(token.logintoken);
