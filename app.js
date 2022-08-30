import Discord from 'discord.js';
import 'dotenv/config';

const token = process.env.TOKEN;

const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds],
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});

client.on('ready', (client) => {
  console.log(`The bot ${client.user.tag} is now online!`);
});

client.login(token);

console.log('Bot is running');
