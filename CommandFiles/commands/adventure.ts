const UNISpectra = { 
  charm: "✦", 
  standardLine: "•───────────────•" 
}; // Placeholder; replace with: import { UNISpectra } from "@cassidy/unispectra"

interface Zone {
  key: string;
  name: string;
  description: string;
  cooldown: number;
}

interface Outcome {
  type: string;
  description: string;
  rewards: {
    coins?: number;
    itemKey?: string;
    quantity?: number;
  };
}

const zones: Zone[] = [
  { key: "shadow_valley", name: "𝗦𝗵𝗮𝗱𝗼𝘄 𝗩𝗮𝗹𝗹𝗲𝘆", description: "𝖠 𝗆𝗂𝗌𝗍𝗒 𝗏𝖺𝗅𝗅𝖾𝗒 𝗐𝗂𝗍𝗁 𝗁𝗂𝖽𝖽𝖾𝗇 𝗋𝖾𝗅𝗂𝖼𝗌.", cooldown: 3600000 }, // 1.0 hours
  { key: "flame_peaks", name: "𝗙𝗹𝗮𝗺𝗲 𝗣𝗲𝗮𝗸𝘀", description: "𝖵𝗈𝗅𝖼𝖺𝗇𝗂𝖼 𝗉𝖾𝖺𝗄𝗌 𝗐𝗂𝗍𝗁 𝗋𝖺𝗋𝖾 𝗈𝗋𝖾𝗌.", cooldown: 7200000 }, // 2.0 hours
  { key: "mist_isles", name: "𝗠𝗶𝘀𝘁 𝗜𝘀𝗹𝗲𝘀", description: "𝖥𝗈𝗀𝗀𝗒 𝗂𝗌𝗅𝖺𝗇𝖽𝗌 𝗐𝗂𝗍𝗁 𝖺𝗇𝖼𝗂𝖾𝗇𝗍 𝗋𝗎𝗂𝗇𝗌.", cooldown: 14400000 }, // 4.0 hours
  { key: "frost_caverns", name: "𝗙𝗿𝗼𝘀𝘁 𝗖𝗮𝘃𝗲𝗿𝗻𝘀", description: "𝖨𝖼𝗒 𝖼𝖺𝗏𝖾𝗌 𝗐𝗂𝗍𝗁 𝖿𝗋𝗈𝗓𝖾𝗇 𝗍𝗋𝖾𝖺𝗌𝗎𝗋𝖾𝗌.", cooldown: 5400000 }, // 1.5 hours
  { key: "sand_dunes", name: "𝗦𝗮𝗻𝗱 𝗗𝘂𝗻𝗲𝘀", description: "𝖤𝗇𝖽𝗅𝖾𝗌𝗌 𝖽𝗎𝗇𝖾𝗌 𝗁𝗂𝖽𝗂𝗇𝗀 𝖺 𝗅𝗈𝗌𝗍 𝖼𝖺𝗋𝖺𝗏𝖺𝗇.", cooldown: 9000000 }, // 2.5 hours
  { key: "sky_temples", name: "𝗦𝗸𝘆 𝗧𝗲𝗺𝗽𝗹𝗲𝘀", description: "𝖥𝗅𝗈𝖺𝗍𝗂𝗇𝗀 𝗍𝖾𝗆𝗉𝗅𝖾𝗌 𝗐𝗂𝗍𝗁 𝗆𝗒𝗌𝗍𝗂𝖼𝖺𝗅 𝖺𝗋𝗍𝗂𝖿𝖺𝖼𝗍𝗌.", cooldown: 10800000 }, // 3.0 hours
  { key: "dark_forest", name: "𝗗𝗮𝗿𝗸 𝗙𝗼𝗿𝗲𝘀𝘁", description: "𝖠 𝗁𝖺𝗎𝗇𝗍𝖾𝖽 𝖿𝗈𝗋𝖾𝗌𝗍 𝗐𝗂𝗍𝗁 𝖼𝗎𝗋𝗌𝖾𝖽 𝗋𝖾𝗅𝗂𝖼𝗌.", cooldown: 7200000 }, // 2.0 hours
  { key: "crystal_lake", name: "𝗖𝗿𝘆𝘀𝘁𝗮𝗹 𝗟𝗮𝗸𝗲", description: "𝖠 𝗌𝗁𝗂𝗆𝗆𝖾𝗋𝗂𝗇𝗀 𝗅𝖺𝗄𝖾 𝗐𝗂𝗍𝗁 𝗆𝖺𝗀𝗂𝖼𝖺𝗅 𝖼𝗋𝗒𝗌𝗍𝖺𝗅𝗌.", cooldown: 3600000 }, // 1.0 hours
  { key: "thunder_cliffs", name: "𝗧𝗵𝘂𝗻𝗱𝗲𝗿 𝗖𝗹𝗶𝗳𝗳𝘀", description: "𝖲𝗍𝗈𝗋𝗆𝗒 𝖼𝗅𝗂𝖿𝖿𝗌 𝗐𝗂𝗍𝗁 𝖾𝗅𝖾𝖼𝗍𝗋𝗂𝖿𝗂𝖾𝖽 𝗀𝖾𝗆𝗌.", cooldown: 12600000 }, // 3.5 hours
  { key: "abyss_ruins", name: "𝗔𝗯𝘆𝘀𝘀 𝗥𝘂𝗶𝗻𝘀", description: "𝖲𝗎𝗇𝗄𝖾𝗇 𝗋𝗎𝗂𝗇𝗌 𝗐𝗂𝗍𝗁 𝖿𝗈𝗋𝗀𝗈𝗍𝗍𝖾𝗇 𝗌𝖾𝖼𝗋𝖾𝗍𝗌.", cooldown: 16200000 }, // 4.5 hours
  { key: "ownirv2_company", name: "𝗼𝘄𝗻𝗶𝗿𝘃𝟮 𝗖𝗼𝗺𝗽𝗮𝗻𝘆", description: "𝖤𝗑𝗉𝗅𝗈𝗋𝖾 𝗍𝗁𝖾 𝗐𝗈𝗋𝗅𝖽 𝗈𝖿 𝖺𝗀𝗀𝗇𝗂 𝗆𝖾𝗆𝖻𝖾𝗋𝗌 𝗈𝖿 𝗈𝗐𝗇𝗂𝗋𝗌𝖵𝟤 𝖢𝗈𝗆𝗉𝖺𝗇𝗒", cooldown: 16200000 }, // 4.5 hours
];

const outcomes: Outcome[] = [
  { type: "loot", description: "Discovered a hidden cache!", rewards: { coins: 150, itemKey: "crystal_shard", quantity: 2 } },
  { type: "enemy", description: "Fought off a bandit ambush!", rewards: { coins: 100 } },
  { type: "obstacle", description: "Navigated a treacherous path!", rewards: { coins: 50 } },
  { type: "treasure", description: "Unearthed an ancient chest!", rewards: { coins: 200, itemKey: "golden_amulet", quantity: 1 } },
  { type: "beast", description: "Defeated a wild beast guarding treasure!", rewards: { coins: 120, itemKey: "beast_fang", quantity: 3 } },
  { type: "trap", description: "Escaped a deadly trap with minor loot!", rewards: { coins: 80, itemKey: "rusty_key", quantity: 1 } },
  { type: "mystic", description: "Encountered a mystic spirit and gained wisdom!", rewards: { coins: 100, itemKey: "spirit_essence", quantity: 2 } },
  { type: "riddle", description: "Solved a riddle to unlock a secret stash!", rewards: { coins: 180, itemKey: "silver_coin", quantity: 5 } },
];

interface AdventureData {
  name?: string;
  inventory: Record<string, { quantity: number }>;
  cooldowns: Record<string, { lastAdventured: number }>;
}

interface UserData {
  money?: number;
  name?: string;
  adventure?: AdventureData;
}

interface UsersDB {
  getItem: (userID: string) => Promise<UserData | null>;
  setItem: (userID: string, data: UserData) => Promise<void>;
  queryItemAll: (
    query: Record<string, any>,
    ...fields: string[]
  ) => Promise<Record<string, UserData>>;
}

interface CommandContext {
  output: {
    reply: (message: string) => Promise<void>;
    replyStyled: (message: string, style: CassidySpectra.CommandStyle) => Promise<void>;
  };
  input: {
    sid: string;
    isAdmin: boolean;
  };
  usersDB: UsersDB | null;
  args: string[];
}

interface CassidySpectra {
  CommandMeta: {
    name: string;
    otherNames: string[];
    version: string;
    author: string;
    description: string;
    category: string;
    usage: string;
  };
  CommandStyle: {
    title: {
      content: string;
      line_bottom: string;
      text_font: string;
    };
    content: {
      text_font: string;
      line_bottom_inside_x: string;
      content: null;
    };
    footer: {
      content: string;
      text_font: string;
    };
  };
}

interface Command {
  meta: CassidySpectra.CommandMeta;
  style: CassidySpectra.CommandStyle;
  entry: (ctx: CommandContext) => Promise<void>;
}

const command: Command = {
  meta: {
    name: "adventure",
    otherNames: ["explore"],
    version: "1.0.0",
    author: "Aljur Pogoy",
    description: "Register as an adventurer or explore mystical zones to gain rewards and items!",
    category: "Adventure Games",
    usage: "adventure register <name> | adventure <zone_key> | adventure list | adventure inventory | adventure trade <item> <quantity> <target_userID>",
  },
  style: {
    title: {
      content: `${UNISpectra.charm} ADVENTURE 〘 🌍 〙`,
      line_bottom: "━━━━━━━━━━━━━━━",
      text_font: "double_struck",
    },
    content: {
      text_font: "fancy",
      line_bottom_inside_x: "default",
      content: null,
    },
    footer: {
      content: "𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒",
      text_font: "fancy",
    },
  },
  async entry(ctx: CommandContext) {
    const { output, input, usersDB, args } = ctx;
    const userID = input.sid;
    const subcommand = (args[0] || "").toLowerCase();

    if (!usersDB) {
      try {
        return await output.replyStyled(
          [
            `❌ Internal error: Data cache not initialized. Contact bot admin. ${UNISpectra.charm}`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply([
          `❌ Internal error: Data cache not initialized. Contact bot admin. ${UNISpectra.charm}`,
          `━━━━━━━ ✕ ━━━━━━`,
          `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
        ].join("\n"));
      }
    }

    const userData = await usersDB.getItem(userID);

    if (subcommand === "register") {
      if (!args[1]) {
        try {
          return await output.replyStyled(
            [
              `❌ You need to provide a name! ${UNISpectra.charm}`,
              `${UNISpectra.standardLine}`,
              `Use: adventure register <name>`,
              `Example: adventure register Shadow_Warrior`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ You need to provide a name! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Use: adventure register <name>`,
            `Example: adventure register Shadow_Warrior`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const name = args.slice(1).join("_");

      if (userData?.adventure?.name) {
        try {
          return await output.replyStyled(
            [
              `❌ You're already registered as **${userData.adventure.name}**! ${UNISpectra.charm}`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ You're already registered as **${userData.adventure.name}**! ${UNISpectra.charm}`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const existing = await usersDB.queryItemAll(
        { "value.adventure.name": { $regex: `^${name}$`, $options: "i" } },
        "adventure"
      );
      if (Object.keys(existing).length > 0) {
        try {
          return await output.replyStyled(
            [
              `❌ Name **${name}** is already taken! Choose another. ${UNISpectra.charm}`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ Name **${name}** is already taken! Choose another. ${UNISpectra.charm}`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const newUserData: UserData = {
        ...userData,
        name,
        adventure: { name, inventory: {}, cooldowns: {} },
        money: userData?.money || 0,
      };

      await usersDB.setItem(userID, newUserData);

      try {
        return await output.replyStyled(
          [
            `✅ Registered as **${name}**! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Start exploring with: adventure <zone_key>`,
            `Check inventory with: adventure inventory`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply([
          `✅ Registered as **${name}**! ${UNISpectra.charm}`,
          `${UNISpectra.standardLine}`,
          `Start exploring with: adventure <zone_key>`,
          `Check inventory with: adventure inventory`,
          `━━━━━━━ ✕ ━━━━━━`,
          `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
        ].join("\n"));
      }
    }

    if (!userData || !userData.adventure?.name) {
      try {
        return await output.replyStyled(
          [
            `❌ You're not registered! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Use: adventure register <name>`,
            `Example: adventure register Shadow_Warrior`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply([
          `❌ You're not registered! ${UNISpectra.charm}`,
          `${UNISpectra.standardLine}`,
          `Use: adventure register <name>`,
          `Example: adventure register Shadow_Warrior`,
          `━━━━━━━ ✕ ━━━━━━`,
          `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
        ].join("\n"));
      }
    }

    if (subcommand === "list") {
      let content = [`📋 **Adventurer List** ${UNISpectra.charm}`];
      const allUsers = await usersDB.queryItemAll(
        { "value.adventure.name": { $exists: true } },
        "adventure",
        "money"
      );

      for (const [userId, data] of Object.entries(allUsers)) {
        if (data.adventure?.name) {
          const inventory = data.adventure.inventory || {};
          const items = Object.entries(inventory)
            .map(([key, { quantity }]) => `${key.replace("_", " ")}: ${quantity}`)
            .join(", ") || "None";
          content.push(
            `${UNISpectra.standardLine}`,
            `🌍 **${data.adventure.name}**`,
            `**User ID**: ${userId}`,
            `**Inventory**: ${items}`,
            `**Coins**: ${data.money || 0} 💵`
          );
        }
      }

      if (content.length === 1) {
        content.push(`${UNISpectra.standardLine}`, `No adventurers registered yet! ${UNISpectra.charm}`);
      }

      content.push(
        `━━━━━━━ ✕ ━━━━━━`,
        `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
      );

      try {
        return await output.replyStyled(content.join("\n"), command.style);
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply(content.join("\n"));
      }
    }

    if (subcommand === "inventory") {
      const inventory = userData.adventure.inventory || {};
      const items = Object.entries(inventory)
        .map(([key, { quantity }]) => `${key.replace("_", " ")}: ${quantity}`)
        .join(", ") || "No items yet!";
      const content = [
        `👤 **${userData.adventure.name}** ${UNISpectra.charm}`,
        `${UNISpectra.standardLine}`,
        `**Items**: ${items}`,
        `**Coins**: ${userData.money || 0} 💵`,
        `${UNISpectra.standardLine}`,
        `> 𝖳𝗋𝖺𝖽𝖾 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾 <𝗂𝗍𝖾𝗆> <𝗊𝗎𝖺𝗇𝗍𝗂𝗍𝗒> <𝗍𝖺𝗋𝗀𝖾𝗍_𝗎𝗌𝖾𝗋𝖨𝖣>`,
        `━━━━━━━ ✕ ━━━━━━`,
        `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
      ];

      try {
        return await output.replyStyled(content.join("\n"), command.style);
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply(content.join("\n"));
      }
    }

    if (subcommand === "trade") {
      if (args.length < 4) {
        try {
          return await output.replyStyled(
            [
              `❌ You need to provide item, quantity, and target user ID! ${UNISpectra.charm}`,
              `${UNISpectra.standardLine}`,
              `Use: adventure trade <item> <quantity> <target_userID>`,
              `Example: adventure trade crystal_shard 2 123456`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ You need to provide item, quantity, and target user ID! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Use: adventure trade <item> <quantity> <target_userID>`,
            `Example: adventure trade crystal_shard 2 123456`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const itemKey = args[1].toLowerCase();
      const quantity = parseInt(args[2]);
      const targetUserID = args[3];

      if (isNaN(quantity) || quantity <= 0) {
        try {
          return await output.replyStyled(
            [
              `❌ Invalid quantity! Must be a positive number. ${UNISpectra.charm}`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ Invalid quantity! Must be a positive number. ${UNISpectra.charm}`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const userInventory = userData.adventure.inventory || {};
      if (!userInventory[itemKey] || userInventory[itemKey].quantity < quantity) {
        try {
          return await output.replyStyled(
            [
              `❌ You don't have enough **${itemKey.replace("_", " ")}**! ${UNISpectra.charm}`,
              `${UNISpectra.standardLine}`,
              `Check your inventory with: adventure inventory`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ You don't have enough **${itemKey.replace("_", " ")}**! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Check your inventory with: adventure inventory`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const targetUserData = await usersDB.getItem(targetUserID);
      if (!targetUserData || !targetUserData.adventure?.name) {
        try {
          return await output.replyStyled(
            [
              `❌ Target user **${targetUserID}** not found or not registered! ${UNISpectra.charm}`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ Target user **${targetUserID}** not found or not registered! ${UNISpectra.charm}`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      if (targetUserID === userID) {
        try {
          return await output.replyStyled(
            [
              `❌ You can't trade with yourself! ${UNISpectra.charm}`,
              `━━━━━━━ ✕ ━━━━━━`,
              `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ You can't trade with yourself! ${UNISpectra.charm}`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"));
        }
      }

      const newUserData: UserData = { ...userData };
      newUserData.adventure!.inventory[itemKey].quantity -= quantity;
      if (newUserData.adventure!.inventory[itemKey].quantity === 0) {
        delete newUserData.adventure!.inventory[itemKey];
      }

      const newTargetUserData: UserData = { ...targetUserData };
      newTargetUserData.adventure!.inventory = newTargetUserData.adventure!.inventory || {};
      newTargetUserData.adventure!.inventory[itemKey] = {
        quantity: (newTargetUserData.adventure!.inventory[itemKey]?.quantity || 0) + quantity,
      };

      await usersDB.setItem(userID, newUserData);
      await usersDB.setItem(targetUserID, newTargetUserData);

      try {
        return await output.replyStyled(
          [
            `✅ **${userData.adventure.name} traded!** ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Traded: ${quantity} **${itemKey.replace("_", " ")}** to **${targetUserData.adventure.name}** (ID: ${targetUserID})`,
            `Check inventory with: adventure inventory`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply([
          `✅ **${userData.adventure.name} traded!** ${UNISpectra.charm}`,
          `${UNISpectra.standardLine}`,
          `Traded: ${quantity} **${itemKey.replace("_", " ")}** to **${targetUserData.adventure.name}** (ID: ${targetUserID})`,
          `Check inventory with: adventure inventory`,
          `━━━━━━━ ✕ ━━━━━━`,
          `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
        ].join("\n"));
      }
    }

    if (!args[0]) {
      let content = [`📋 𝗔𝗱𝘃𝗲𝗻𝘁𝘂𝗿𝗲 𝗭𝗼𝗻𝗲𝘀 ${UNISpectra.charm}`];
      zones.forEach((z) => {
        const lastAdventured = userData.adventure?.cooldowns?.[z.key]?.lastAdventured || 0;
        const timeLeft = lastAdventured + z.cooldown - Date.now();
        const hours = (z.cooldown / 3600000).toFixed(1);
        const hourLabel = parseFloat(hours) === 1 ? "hour" : "hours";
        content.push(
          `${UNISpectra.standardLine}`,
          `🌍 ${z.name}`,
          `𝗞𝗲𝘆: ${z.key}`,
          `𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${z.description}`,
          `𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${hours} ${hourLabel}`,
          `𝗦𝘁𝗮𝘁𝘂𝘀: ${timeLeft > 0 ? `𝖮𝗇 𝖼𝗈𝗈𝗅𝖽𝗈𝗐𝗇 (${Math.ceil(timeLeft / 60000)} 𝗆𝗂𝗇)` : "𝖱𝖾𝖺𝖽𝗒"}`
        );
      });
      content.push(
        `${UNISpectra.standardLine}`,
        `> 𝖴𝗌𝖾 #𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 <𝗓𝗈𝗇𝖾_𝗄𝖾𝗒> 𝗍𝗈 𝖾𝗑𝗉𝗅𝗈𝗋𝖾`,
        `*𝖤𝗑𝖺𝗆𝗉𝗅𝖾: #𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗌𝗁𝖺𝖽𝗈𝗐_𝗏𝖺𝗅𝗅𝖾𝗒`,
        `*> 𝖴𝗌𝖾 #𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗅𝗂𝗌𝗍 𝗍𝗈 𝗌𝖾𝖾 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾𝗋𝗌`,
        `*> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒`,
        `*> 𝖳𝗋𝖺𝖽𝖾 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂�_t𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾`,
        `━━━━━━━ ✕ ━━━━━━`,
        `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
      );

      try {
        return await output.replyStyled(content.join("\n"), command.style);
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply(content.join("\n"));
      }
    }

    const zoneKey = args[0].toLowerCase();
    const zone = zones.find((z) => z.key === zoneKey);

    if (!zone) {
      try {
        return await output.replyStyled(
          [
            `❌ Invalid zone key! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Use: adventure to see zones`,
            `Example: adventure shadow_valley`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply([
          `❌ Invalid zone key! ${UNISpectra.charm}`,
          `${UNISpectra.standardLine}`,
          `Use: adventure to see zones`,
          `Example: adventure shadow_valley`,
          `━━━━━━━ ✕ ━━━━━━`,
          `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
        ].join("\n"));
      }
    }

    const lastAdventured = userData.adventure?.cooldowns?.[zoneKey]?.lastAdventured || 0;
    if (Date.now() < lastAdventured + zone.cooldown && !input.isAdmin) {
      const timeLeftMinutes = Math.ceil((lastAdventured + zone.cooldown - Date.now()) / 60000);
      let cooldownText: string;
      if (timeLeftMinutes >= 60) {
        const hours = Math.ceil(timeLeftMinutes / 60);
        cooldownText = `${hours} ${hours === 1 ? "hour" : "hours"}`;
      } else {
        cooldownText = `${timeLeftMinutes} ${timeLeftMinutes === 1 ? "minute" : "minutes"}`;
      }
      try {
        return await output.replyStyled(
          [
            `⌛ You already explore **${zone.name.replace(/[\u{1D5D4}-\u{1D5ED}]/gu, '')}**! Please wait for ${cooldownText} ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒`,
            `*> 𝖳�_r𝗮𝖽𝖾 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply(
          [
            `⌛ You already explore **${zone.name.replace(/[\u{1D5D4}-\u{1D5ED}]/gu, '')}**! Please wait for ${cooldownText} ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒`,
            `*> 𝖳𝗋𝖺𝖽𝖾 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾`,
            `━━━━━━━ ✕ ━━━━━━`,
            `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
          ].join("\n")
        );
      }
    }

    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const newUserData: UserData = { ...userData };

    newUserData.adventure!.cooldowns = newUserData.adventure!.cooldowns || {};
    newUserData.adventure!.cooldowns[zoneKey] = { lastAdventured: Date.now() };
    newUserData.money = (newUserData.money || 0) + (outcome.rewards.coins || 0);

    if (outcome.rewards.itemKey) {
      newUserData.adventure!.inventory = newUserData.adventure!.inventory || {};
      newUserData.adventure!.inventory[outcome.rewards.itemKey] = {
        quantity: (newUserData.adventure!.inventory[outcome.rewards.itemKey]?.quantity || 0) + (outcome.rewards.quantity || 0),
      };
    }

    await usersDB.setItem(userID, newUserData);

    const content = [
      `✅ Adventured in **${zone.name.replace(/[\u{1D5D4}-\u{1D5ED}]/gu, '')}**! ${UNISpectra.charm}`,
      `${UNISpectra.standardLine}`,
      `**Event**: ${outcome.description}`,
      outcome.rewards.coins ? `**Earned**: ${outcome.rewards.coins} coins 💵` : "",
      outcome.rewards.itemKey ? `**Found**: ${outcome.rewards.quantity} **${outcome.rewards.itemKey.replace("_", " ")}**` : "",
      `${UNISpectra.standardLine}`,
      `> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒`,
      `*> 𝖳𝗋𝖺𝖽𝖾 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾`,
      `━━━━━━━ ✕ ━━━━━━`,
      `𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝖽 𝖻𝗒: 𝖠𝗅𝗃𝗎𝗋 𝖯𝗈𝗀𝗈𝗒`
    ].filter(Boolean);

    try {
      return await output.replyStyled(content.join("\n"), command.style);
    } catch (e) {
      console.error("ReplyStyled error:", e);
      return await output.reply(content.join("\n"));
    }
  },
};

export default command;
