import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';

import { VerifyDiscordRequest, DiscordRequest, getRandomEmoji, capitalize, getRandomBoolean } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { CHALLENGE_COMMAND, FLOW_COMMAND, TIME_COMMAND, HasGuildCommands } from './commands.js';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function(req, res) {
  const { type, id, data } = req.body;

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
      const complimentRes = await axios.get('https://complimentr.com/api');
      const compliment = complimentRes.data.compliment;
      if (compliment.includes("9 out of 10")) {
        compliment += ". David Tennant agrees too";
      }
      const flow = getRandomBoolean();
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: capitalize(compliment.replace('you are', flow ? 'Flow is' : 'Kavi is').replace('you have', flow ? 'Flow has' : 'Kavi has')) + ' ' + getRandomEmoji(),
        },
      });
    }

    if (name === TIME_COMMAND.name) {
      const dateString = req.body.data.options[0].value;
      const date = new Date(dateString);

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `\\<t:${date.getTime() / 1000}:t>`
        }
      })
    }

    if (name === CHALLENGE_COMMAND.name && id) {
      const userId = req.body.member.user.id;
      const name = req.body.data.options[0].value;

      activeGames[id] = { id: userId, name };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Valorant agent battle challenge from <@${userId}>`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  custom_id: `accept_button_${req.body.id}`,
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
    const componentId = data.custom_id;
    let responseData;
    if (componentId.startsWith('accept_button_')) {
      const gameId = componentId.replace('accept_button_', '');
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
    } else if (componentId.startsWith('select_choice_')) {
      const gameId = componentId.replace('select_choice_', '');
      if (activeGames[gameId]) {
        const userId = req.body.member.user.id;
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
      await DiscordRequest(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error('Error sending message:', err.response.data.message);
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    FLOW_COMMAND,
    CHALLENGE_COMMAND,
    TIME_COMMAND,
  ]);
});
