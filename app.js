import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';

import { VerifyDiscordRequest, DiscordRequest, getRandomEmoji, getDateFromInput, FULL_DAYS, getCompliment } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import { CHALLENGE_COMMAND, FLOW_COMMAND, TIME_COMMAND, HasGuildCommands } from './commands.js';

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
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: (await getCompliment()) + ' ' + getRandomEmoji(),
        },
      });
    }

    // /time date:2023/02/08 1:30 pm est
    if (name === TIME_COMMAND.name) {
      const dateStrings = req.body.data.options[0].value;
      let content = dateStrings.split(',').map(dateString => {
        const date = getDateFromInput(dateString);
        return !isNaN(date.getTime()) ? `${FULL_DAYS[date.getDay()]} \\<t:${date.getTime() / 1000}:t>: ` : 'Invalid Date passed in';
      }).join('\n');
      content += "\n*times automatically converted to your time zone*\n";

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content },
      })
    }

    if (name === CHALLENGE_COMMAND.name && id) {
      const userId = req.body.member.user.id;
      const name = req.body.data.options[0].value;
      const targetId = req.body.data.options[1] ? req.body.data.options[1].value : 'undefined';
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

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    // FLOW_COMMAND,
    CHALLENGE_COMMAND,
    // TIME_COMMAND,
  ]);
});
