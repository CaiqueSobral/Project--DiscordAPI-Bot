import Discord, { GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const token = process.env.TOKEN;
const bits = GatewayIntentBits;
const options = [bits.Guilds, bits.GuildMessages, bits.GuildMessageReactions];

const client = new Discord.Client({
  intents: options,
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});

client.on('ready', (client) => {
  console.log(`The bot ${client.user.tag} is now online!`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  message.reply('Opa, iae!');
});

client.login(token);

console.log('Bot is running');
