import { getAgentChoices } from './game.js';
import { capitalize, DiscordRequest } from './utils.js';

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.data;

    if (data) {
      console.log(`Installing "${command.name}"`);
      InstallGuildCommand(appId, guildId, command);
      console.log(`Installed "${command.name}"`);
    }
  } catch (err) {
    console.error(err.response.data.message);
  }
}

export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  try {
    await DiscordRequest(endpoint, { method: 'POST', data: command });
  } catch (err) {
    console.error(err.response.data.message);
  }
}

function createCommandChoices() {
  const choices = getAgentChoices();
  return choices.map(choice => ({
    name: capitalize(choice),
    value: choice.toLowerCase(),
  }));
}

export const FLOW_COMMAND = {
  name: 'flow',
  description: 'Tell me something about our Queen Flow',
  type: 1,
}

export const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of valorant agent battles',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Choose your Agent',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
}
