import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { Client, GatewayIntentBits } from 'discord.js';

import { VerifyDiscordRequest, DiscordRequest, getRandomEmoji, getDateFromInput, FULL_DAYS, getCompliment } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { CHALLENGE_COMMAND, FLOW_COMMAND, TIME_COMMAND, WEEKLY_COMMAND, GAME_COMMAND, HasGuildCommands } from './commands.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const activeGames = {};
const foundSteamLinks = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function(req, res) {
  const { type, id, data, guild_id, channel_id } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === FLOW_COMMAND.name) {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: (await getCompliment()) + ' ' + getRandomEmoji(),
        },
      });
    }

    if (name === GAME_COMMAND.name) {
      console.log(channel_id);
      // const channel = client.channels.cache.get(channel_id);
      let channel;
      if (client.channels.cache.has(channel_id)) {
        console.log('Cached channel');
        channel = client.channels.cache.get(channel_id);
      } else {
        try {
          console.log('Fetching channel');
          channel = await client.channels.fetch(channel_id);
        } catch (error) {
          console.error('Error fetching channel:', error);
        }
      }

      let fetchedMessages = {size: 0};
      let messages = [];
      let lastMessageId;
      if (!channel.messages.cache || channel.messages.cache.size === 0) {
        try {
          console.log('Fetching messages');
          do {
            fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
            messages.push(...fetchedMessages.values());
            lastMessageId = fetchedMessages.last()?.id;
          } while (fetchedMessages.size > 0 && (!foundSteamLinks[channel_id] || foundSteamLinks[channel_id].size === 0 || messages.length <= 200));
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      } else {
        console.log('Cached messages: ' + channel.messages.cache.size);
        messages = channel.messages.cache.values();
        messages.length = channel.messages.cache.size;
      }

      // Filter for Steam game links
      const steamLinkRegex = /https?:\/\/store\.steampowered\.com\/app\/\d+(\/?[\w-]*\/?)/g;
      let steamLinks = [];
      messages.filter(msg => msg.author.id !== '1060455432843448360').forEach(msg => {
        const links = msg.content.match(steamLinkRegex);
        if (links) {
          steamLinks.push(...links);
        }
      });

      if (!foundSteamLinks[channel_id]) {
        foundSteamLinks[channel_id] = new Set();
      }
      steamLinks.forEach(link => {
        foundSteamLinks[channel_id].add(link);
      })
      const allSteamLinks = Array.from(foundSteamLinks[channel_id]);

      console.log(`Fetched ${messages.length} messages`);
      console.log(`Filtered ${steamLinks.length} Steam links. New total: ${allSteamLinks.length}`);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: allSteamLinks.length > 0 ? allSteamLinks[Math.floor(Math.random() * allSteamLinks.length)] : "No Steam games found",
        },
      });
    }

    // /time date:2023/02/08 1:30 pm est
    if (name === TIME_COMMAND.name) {
      console.log(data);
      const dateStrings = data.options[0].value;
      const timezone = data.options[1] ? data.options[1].value : null;
      let content = dateStrings.split(',').map(dateString => getDateFromInput(dateString, timezone, req.body.member.user.id)).join('\n');
      if (req.body.member.user.id != '467323668507131904') {
        content += "\n\\*times automatically converted to your time zone\\*\n";
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content },
      })
    }

    // /time date:2023/02/08 1:30 pm est
    if (name === WEEKLY_COMMAND.name) {
      const dateStrings = data.options[0].value;
      const timezone = data.options[1] ? data.options[1].value : null;
      let content = "\\# :xflowmTeeHee: Weekly Schedule :xflowmSip:"
      content += "\n\\*This schedule will include all stream times, podcast releases, and Discord events going on for the week and will be updated on Sundays. Keep in mind all times are subject to change (assume +/- 30 ish mins due to my fashionably late nature). All times appear in the timezone you use on your device.\\*\n\n:BeeBounce:\n\n";
      content += dateStrings.split(',').map(dateString => getDateFromInput(dateString, timezone, req.body.member.user.id)).join('\n');

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content },
      })
    }

    if (name === CHALLENGE_COMMAND.name && id) {
      const userId = req.body.member.user.id;
      const name = data.options[0].value;
      const targetId = data.options[1] ? data.options[1].value : 'undefined';
      let content = `Valorant agent battle challenge from <@${userId}>`;
      if (targetId !== 'undefined') {
        content = `<@${targetId}>. <@${userId}> has challanged you to a Valorant agent battle`
      }

      activeGames[id] = { id: userId, name };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  custom_id: `accept_button_${req.body.id}_target_${targetId}`,
                  label: 'Accept',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        }
      });
    }
  }

  /**
   * Handle interative component requests
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const userId = req.body.member.user.id;
    const componentId = data.custom_id;
    let responseData;
    let deleteOriginal;
    if (componentId.startsWith('accept_button_')) {
      const ids = componentId.split('_target_');
      const gameId = ids[0].replace('accept_button_', '');
      const targetId = ids[1];
      if (targetId != 'undefined' && targetId != userId) {
        responseData = {
          content: 'You are not the target for this challange',
          flags: InteractionResponseFlags.EPHEMERAL,
        };
      } else {
        deleteOriginal = true;
        responseData = {
          content: 'What is your Agent of choice?',
          flags: InteractionResponseFlags.EPHEMERAL,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: `select_choice_${gameId}`,
                  options: getShuffledOptions(),
                },
              ],
            },
          ],
        };
      }
    } else if (componentId.startsWith('select_choice_')) {
      deleteOriginal = true;
      const gameId = componentId.replace('select_choice_', '');
      if (activeGames[gameId]) {
        const name = data.values[0];
        const result = getResult(activeGames[gameId], { id: userId, name });
        delete activeGames[gameId];
        responseData = { content: result };
      }
    }

    try {
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: responseData,
      });

      const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
      if (deleteOriginal) await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err.response.data.message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    FLOW_COMMAND,
    CHALLENGE_COMMAND,
    TIME_COMMAND,
    // WEEKLY_COMMAND,
    GAME_COMMAND,
  ]);
});
