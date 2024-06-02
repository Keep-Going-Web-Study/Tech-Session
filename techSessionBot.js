require("dotenv").config(); //이 코드는 Node.js가 시작될 때 .env 파일을 읽고 그 내용을 process.env로 로드하는 역할
const token = process.env.TECH_SESSION_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID_Tech_Session;
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 한국 시간대로 변환하여 날짜를 가져오는 함수
function getKoreanDate() {
  const now = new Date();
  now.setHours(now.getHours() + 9); // UTC 시간을 KST로 변환
  now.setDate(now.getDate() + 7); // 7일을 더함
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return { year, month, day };
}

// 봇이 시작되자마자 지정된 채널에서 스레드를 생성하고 작업이 끝나면 자동으로 로그아웃.
// 이렇게 하면 GitHub Actions에서 실행될 때 매번 새로운 스레드를 생성하고 종료할 수 있다.
client.once("ready", async () => {
  console.log("Ready!");

  const { year, month, day } = getKoreanDate();
  const threadName = `Topic ${year}-${month}-${day}`;
  const channels = await client.channels.fetch(channelId);

  if (channels.isTextBased()) {
    const thread = await channels.threads.create({
      name: threadName,
      autoArchiveDuration: 10080,
      type: "GUILD_PUBLIC_THREAD",
      reason: "주간 기술세션",
    });
    console.log(`Created thread: ${thread.name}`);
  }
  // 작업이 완료되면 봇 로그아웃
  client.destroy();
});

client.login(token);

// ------------ 아래는 노드스케쥴로 로컬에서 봇 실행하는 코드 ---------------------------------------------------------
// require("dotenv").config(); //이 코드는 Node.js가 시작될 때 .env 파일을 읽고 그 내용을 process.env로 로드하는 역할
// const token = process.env.TECH_SESSION_BOT_TOKEN;
// const channelId = process.env.DISCORD_CHANNEL_ID;
// const { Client, GatewayIntentBits } = require("discord.js");
// const schedule = require("node-schedule");
// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ],
// });

// client.once("ready", () => {
//   console.log("Ready!");

//   // 매주 토요일 21시 00분에 스레드 생성
//   schedule.scheduleJob(
//     { hour: 21, minute: 00, dayOfWeek: 6 },
//     async function () {
//       const date = new Date();
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       // const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
//       // const day = date.getDate();

//       const threadName = `Topic ${year}-${month}-${day}`;
//       const channels = await client.channels.fetch("channelId"); // tech-session채널 ID

//       if (channels.isTextBased()) {
//         const thread = await channels.threads.create({
//           name: threadName,
//           autoArchiveDuration: 10080, //스레드의 마지막 활동으로부터 7일동안(10080) 추가활동이 없으면 스레드가 닫히고 아카이브된다.
//           reason: "주간 기술세션",
//         });
//         console.log(`Created thread: ${thread.name}`);
//       }
//     }
//   );
// });

// client.login(token);

// // node techSessionBot.js
