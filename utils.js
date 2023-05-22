import 'dotenv/config';
import axios from 'axios';
import { verifyKey } from 'discord-interactions';
import addDays from 'date-fns/addDays/index.js'

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  }
}

export async function DiscordRequest(endpoint, options) {
  const url = `https://discord.com/api/v10/${endpoint}`;
  const headers = {
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    'Content-Type': 'application/json; charset=UTF-8',
    'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
  };

  try {
    return await axios({ url, headers, ...options });
  } catch (e) {
    throw e;
  }
}

export function getRandomBoolean() {
  return Math.floor(Math.random() * 2) === 0;
}

export function getRandomEmoji() {
  const emojiList = [	'😄','😃','😀','😊','☺','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','⬆','⬇','⬅','➡','🔠','🔡','🔤','↗','↖','↘','↙','↔','↕','🔄','◀','▶','🔼','🔽','↩','↪','ℹ','⏪','⏩','⏫','⏬','⤵','⤴','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','📶','🎦','🈁','🈯','🈳','🈵','🈴','🈲','🉐','🈹','🈺','🈶','🈚','🚻','🚹','🚺','🚼','🚾','🚰','🚮','🅿','♿','🚭','🈷','🈸','🈂','Ⓜ','🛂','🛄','🛅','🛃','🉑','㊙','㊗','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','❎','✅','✴'];
  return Math.floor(Math.random() * 5) === 1 ? '🫦' : emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getCompliment() {
  const complimentRes = await axios.get('https://complimentr.com/api');
  let compliment = complimentRes.data.compliment;
  const flow = getRandomBoolean();
  compliment = capitalize(compliment.replace('you are', flow ? 'Flow is' : 'Kavi is').replace('you have', flow ? 'Flow has' : 'Kavi has'))
  // if (compliment.includes('Flow has')) {
  //   const nonBodyParts = ['heart', 'mind', 'personality', 'radiance', 'ideas', 'thoughts', 'strengths', 'brain'];
  //   const bodyPartInCompliment = nonBodyParts.filter(t => compliment.includes(t)).length === 0;
  //   if (bodyPartInCompliment) {
  //     const complimentWords = compliment.split(' ');
  //     complimentWords[complimentWords.length - 1] = `~~${complimentWords[complimentWords.length - 1]}~~ ${nonBodyParts[Math.floor(Math.random() * 4)]}`;
  //     compliment = complimentWords.join(' ');
  //   }
  // }
  if (compliment.includes('9 out of 10')) {
    compliment += '. David Tennant agrees with them';
  }

  return compliment;
}

export const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_INITIALS = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

export function getDateFromInput(input, timezone) {
  let dateString = input.trim();
  dateString = dateString.replace('PM', 'pm');
  dateString = dateString.replace('AM', 'am');
  if (dateString.match(/\s\d+\s*[a|p]m/)) {
    dateString = dateString.replace(/\s*pm/, ':00 pm');
    dateString = dateString.replace(/\s*am/, ':00 am');
  }
  if (dateString.match(/\d[a|p]m/)) {
    dateString = dateString.replace('pm', ' pm');
    dateString = dateString.replace('am', ' am');
  }
  let timeEndIndex = dateString.indexOf(' am') === -1 ? dateString.indexOf(' pm') : dateString.indexOf(' am')
  timeEndIndex += 3;
  const game = timeEndIndex >= dateString.length ? '' : dateString.substring(timeEndIndex).trim();
  dateString = dateString.substring(0, timeEndIndex).trim();
  dateString += timezone ? ` ${timezone}` : ' edt';
  let date = new Date(dateString);
  if (isNaN(date.getTime())) {
    let dateIndex = -1;
    DAYS_INITIALS.forEach((day, i) => {
      if (dateString.toLowerCase().startsWith(day.toLowerCase())) {
        dateIndex = i;
      }
    });
    const resultDate = addDays(new Date(), dateIndex - new Date().getDay()).toLocaleDateString();
    date = new Date(resultDate + ' ' + dateString.split(' ').slice(1).join(' '));
  }

  return !isNaN(date.getTime()) ? `${FULL_DAYS[date.getHours() > 4 ? date.getDay() : date.getDay() - 1]} \\<t:${date.getTime() / 1000}:t>: ${game}` : 'Invalid Date passed in';
}
