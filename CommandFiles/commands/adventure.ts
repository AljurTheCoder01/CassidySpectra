import { format } from "cassidy-styler";

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
  { key: "shadow_valley", name: "Shadow Valley", description: "A misty valley with hidden relics.", cooldown: 3600000 },
  { key: "flame_peaks", name: "Flame Peaks", description: "Volcanic peaks with rare ores.", cooldown: 7200000 },
  { key: "mist_isles", name: "Mist Isles", description: "Foggy islands with ancient ruins.", cooldown: 14400000 },
  { key: "frost_caverns", name: "Frost Caverns", description: "Icy caves with frozen treasures.", cooldown: 5400000 },
  { key: "sand_dunes", name: "Sand Dunes", description: "Endless dunes hiding a lost caravan.", cooldown: 9000000 },
  { key: "sky_temples", name: "Sky Temples", description: "Floating temples with mystical artifacts.", cooldown: 10800000 },
  { key: "dark_forest", name: "Dark Forest", description: "A haunted forest with cursed relics.", cooldown: 7200000 },
  { key: "crystal_lake", name: "Crystal Lake", description: "A shimmering lake with magical crystals.", cooldown: 3600000 },
  { key: "thunder_cliffs", name: "Thunder Cliffs", description: "Stormy cliffs with electrified gems.", cooldown: 12600000 },
  { key: "abyss_ruins", name: "Abyss Ruins", description: "Sunken ruins with forgotten secrets.", cooldown: 16200000 },
  { key: "ownirv2_company", name: "ownirsv2 Company", description: "Explore the world of aggni members of ownirsV2 Company", cooldown: 16200000 },
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
  };
  input: {
    sid: string;
    isAdmin: boolean;
  };
  usersDB: UsersDB | null;
  args: string[];
}

interface Command {
  meta: {
    name: string;
    otherNames: string[];
    version: string;
    author: string;
    description: string;
    category: string;
    usage: string;
  };
  style: {
    title: {
      text_font: string;
      content: string;
      line_bottom: string;
    };
    footer: {
      content: string;
      text_font: string;
    };
    titleFont: string;
    contentFont: string;
  };
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
    usage: "adventure register <name> | adventure <zone_key> | adventure list | adventure inventory | adventure trade <item> <quantity> <target_user>",
  },
  style: {
    title: {
      text_font: "bold",
      content: "",
      line_bottom: "default",
    },
    footer: {
      content: "",
      text_font: "fancy",
    },
    titleFont: "bold",
    contentFont: "fancy",
  },
  async entry(ctx: CommandContext) {
    const { output, input, usersDB, args } = ctx;
    const userID = input.sid;
    const subcommand = (args[0] || "").toLowerCase();

    if (!usersDB) {
      return await output.reply(
        "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
        "𝖨𝗇𝗍𝖾𝗋𝗇𝖺𝗅 𝖾𝗋𝗋𝗈𝗋: 𝖣𝖺𝗍𝖺 𝖼𝖺𝖼𝗁𝖾 𝗇𝗈𝗍 𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗓𝖾𝖽. 𝖢𝗈𝗇𝗍𝖺𝖼𝗍 𝖻𝗈𝗍 𝖺𝖽𝗆𝗂𝗇.\n" +
        "━━━━━━━ ✕ ━━━━━━\n" +
        "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
      );
    }

    const userData = await usersDB.getItem(userID);

    if (subcommand === "register") {
      if (!args[1]) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          "𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗇𝖺𝗆𝖾!\n" +
          "𝖴𝗌𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 <𝗇𝖺𝗆𝖾>\n" +
          "𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 𝖲𝗁𝖺𝖽𝗈𝗐_𝖶𝖺𝗋𝗋𝗂𝗈𝗋\n" +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const name = args.slice(1).join("_");

      if (userData?.adventure?.name) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          `𝖸𝗈𝗎'𝗋𝖾 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽 𝖺𝗌 ${userData.adventure.name}!\n` +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const existing = await usersDB.queryItemAll(
        { "value.adventure.name": { $regex: `^${name}$`, $options: "i" } },
        "adventure"
      );
      if (Object.keys(existing).length > 0) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          `𝖭𝖺𝗆𝖾 ${name} 𝗂𝗌 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝗍𝖺𝗄𝖾𝗇! 𝖢𝗁𝗈𝗈𝗌𝖾 𝖺𝗇𝗈𝗍𝗁𝖾𝗋.\n` +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const newUserData: UserData = {
        ...userData,
        name,
        adventure: { name, inventory: {}, cooldowns: {} },
        money: userData?.money || 0,
      };

      await usersDB.setItem(userID, newUserData);

      return await output.reply(
        "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
        `𝖱𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽 𝖺𝗌 ${name}!\n` +
        "𝖲𝗍𝖺𝗋𝗍 𝖾𝗑𝗉𝗅𝗈𝗋𝗂𝗇𝗀 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 <𝗓𝗈𝗇𝖾_𝗄𝖾𝗒>\n" +
        "𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒\n" +
        "━━━━━━━ ✕ ━━━━━━\n" +
        "𝗗𝗲𝘃�_e𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
      );
    }

    if (!userData || !userData.adventure?.name) {
      return await output.reply(
        "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
        "𝖸𝗈𝗎'𝗋𝖾 𝗇𝗈𝗍 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽!\n" +
        "𝖴𝗌𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 <𝗇𝖺𝗆𝖾>\n" +
        "𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋 𝖲𝗁𝖺𝖽𝗈𝗐_𝖶𝖺𝗋𝗋𝗂𝗈𝗋\n" +
        "━━━━━━━ ✕ ━━━━━━\n" +
        "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
      );
    }

    if (subcommand === "list") {
      let content = "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
                    "➤ 𝔸𝕕𝕧𝕖𝕟𝕥𝕦𝕣𝕖\n━━━━━━━━━━━━━━━\n" +
                    "𝗔𝗱𝘃𝗲𝗻𝘁𝘂𝗿𝗲𝗿 𝗟𝗶𝘀𝘁:\n━━━━━━━━━━━━━━━\n";
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
          content += `🌍 『 ${data.adventure.name} 』\n`;
          content += `𝗨𝘀𝗲𝗿 𝗜𝗗: ${userId}\n`;
          content += `𝗜𝗻𝘃𝗲𝗻𝘁𝗼𝗿𝘆: ${items}\n`;
          content += `𝗖𝗼𝗶𝗻𝘀: ${data.money || 0}\n\n`;
        }
      }

      if (!content.includes("『")) {
        content += "𝖭𝗈 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾𝗋𝗌 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽 𝗒𝖾𝗍!\n";
      }
      content += "━━━━━━━ ✕ ━━━━━━\n𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy";

      return await output.reply(content);
    }

    if (subcommand === "inventory") {
      let content = "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
                    "➤ 𝔸𝕕𝕧𝕖𝕟𝕥𝕦𝕣𝕖\n━━━━━━━━━━━━━━━\n" +
                    `𝗔𝗱𝘃𝗲𝗻𝘁𝘂𝗿𝗲𝗿: ${userData.adventure.name}\n━━━━━━━━━━━━━━━\n`;
      const inventory = userData.adventure.inventory || {};
      const items = Object.entries(inventory)
        .map(([key, { quantity }]) => `${key.replace("_", " ")}: ${quantity}`)
        .join(", ") || "No items yet!";
      content += `𝗜𝘁𝗲𝗺𝘀: ${items}\n`;
      content += `𝗖𝗼𝗶𝗻𝘀: ${userData.money || 0}\n`;
      content += `> 𝖳𝗋𝗮𝗱𝗲 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾 <𝗂𝗍𝖾𝗆> <𝗊𝗎𝖺𝗇𝗍𝗂𝗍𝗒> <𝗍𝖺𝗋𝗀𝖾𝗍_𝗎𝗌𝖾𝗋>\n` +
                 `━━━━━━━ ✕ ━━━━━━\n𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy`;

      return await output.reply(content);
    }

    if (subcommand === "trade") {
      if (args.length < 4) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          "𝖸𝗈𝗎 𝗇𝖾𝖾𝖽 𝗍𝗈 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗂𝗍𝖾𝗆, 𝗊𝗎𝖺𝗇𝗍𝗂𝗍𝗒, 𝖺𝗇𝖽 𝗍𝖺𝗋𝗀𝖾𝗍 𝗎𝗌𝖾𝗋!\n" +
          "𝖴𝗌𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾 <𝗂𝗍𝖾𝗆> <𝗊𝗎𝖺𝗇𝗍𝗂𝗍𝗒> <𝗍𝖺𝗋𝗀𝖾𝗍_𝗎𝗌𝖾𝗋>\n" +
          "𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾 𝖼𝗋𝗒𝗌𝗍𝖺𝗅_𝗌𝗁𝖺𝗋𝖽 𝟤 𝖲𝗁𝖺𝖽𝗈𝗐_𝖶𝖺𝗋𝗋𝗂𝗈𝗋\n" +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const itemKey = args[1].toLowerCase();
      const quantity = parseInt(args[2]);
      const targetName = args.slice(3).join("_");

      if (isNaN(quantity) || quantity <= 0) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          `𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗊𝗎𝖺𝗇𝗍𝗂𝗍𝗒! 𝖬𝗎𝗌𝗍 𝖻𝖾 𝖺 𝗉𝗈𝗌𝗂𝗍𝗂𝗏𝖾 𝗇𝗎𝗆𝖻𝖾𝗋.\n` +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const userInventory = userData.adventure.inventory || {};
      if (!userInventory[itemKey] || userInventory[itemKey].quantity < quantity) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          `𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝖾𝗇𝗈𝗎𝗀𝗁 ${itemKey.replace("_", " ")}!\n` +
          "𝖢𝗁𝖾𝖼𝗄 𝗒𝗈𝗎𝗋 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒\n" +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const targetUsers = await usersDB.queryItemAll(
        { "value.adventure.name": { $regex: `^${targetName}$`, $options: "i" } },
        "adventure",
        "money"
      );
      const targetUserEntry = Object.entries(targetUsers).find(([_, data]) => data.adventure?.name?.toLowerCase() === targetName.toLowerCase());

      if (!targetUserEntry) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          `𝖳𝖺𝗋𝗀𝖾𝗍 𝗎𝗌𝖾𝗋 ${targetName} 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗈𝗋 𝗇𝗈𝗍 𝗋𝖾𝗀𝗂𝗌𝗍𝖾𝗋𝖾𝖽!\n` +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
      }

      const [targetUserID, targetUserData] = targetUserEntry;

      if (targetUserID === userID) {
        return await output.reply(
          "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
          `𝖸𝗈𝗎 𝖼𝖺𝗇'𝗍 𝗍𝗋𝖺𝖽𝖾 𝗐𝗂𝗍𝗁 𝗒𝗈𝗎𝗋𝗌𝖾𝗅𝖿!\n` +
          "━━━━━━━ ✕ ━━━━━━\n" +
          "𝗗𝗲𝘃𝗲�_l𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
        );
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

      return await output.reply(
        "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
        `**${userData.adventure.name} 𝗍𝗋𝖺𝖽𝖾𝖽!**\n` +
        `𝗧𝗿𝗮𝗱𝗲𝗱: ${quantity} ${itemKey.replace("_", " ")} 𝗍𝗈 ${targetName}\n` +
        `> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒\n` +
        `━━━━━━━ ✕ ━━━━━━\n` +
        `𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy`
      );
    }

    if (!args[0]) {
      let content = "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
                    "➤ 𝔸𝕕𝕧𝕖𝕟𝕥𝕦𝕣𝕖\n━━━━━━━━━━━━━━━\n" +
                    "𝘼𝙙𝙫𝙚𝙣𝙩𝙪𝙧𝙚 𝙕𝙤𝙣𝙚𝙨:\n━━━━━━━━━━━━━━━\n";
      zones.forEach((z) => {
        const lastAdventured = userData.adventure?.cooldowns?.[z.key]?.lastAdventured || 0;
        const timeLeft = lastAdventured + z.cooldown - Date.now();
        content += `🌍 『 ${z.name} 』\n`;
        content += `𝗞𝗲𝘆: ${z.key}\n`;
        content += `𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${z.description}\n`;
        content += `𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${(z.cooldown / 3600000).toFixed(1)} 𝗁𝗈𝗎𝗿𝘀\n`;
        content += `𝗦𝘁𝗮𝘁𝘂𝘀: ${timeLeft > 0 ? `On cooldown (${Math.ceil(timeLeft / 60000)} min)` : "𝖱𝖾𝖺𝖽𝗒"}\n`;
        content += `━━━━━━━━━━━━━━━\n`;
      });
      content += `> 𝖴𝗌𝖾 #𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 <𝗓𝗈𝗇𝖾_𝗄𝖾𝗒> 𝗍𝗈 𝖾𝗑𝗉𝗅𝗈𝗋𝖾\n` +
                 `*𝖤𝗑𝖺𝗆𝗉𝗅𝖾: #𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗌𝗁𝖺𝖽𝗈𝗐_𝗏𝖺𝗅𝗅𝖾𝗒\n` +
                 `*> 𝖴𝗌𝖾 #𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗅𝗶𝘀𝘁 𝗍𝗈 𝗌𝖾𝖾 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾𝗋𝗌\n` +
                 `*> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒\n` +
                 `*> 𝖳𝗋𝖺𝖽𝖾 𝗂𝗍𝖾𝗆𝗌 𝗐𝗂𝗍𝗁: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗋𝖺𝖽𝖾\n` +
                 `━━━━━━━ ✕ ━━━━━━\n𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy`;

      return await output.reply(content);
    }

    const zoneKey = args[0].toLowerCase();
    const zone = zones.find((z) => z.key === zoneKey);

    if (!zone) {
      return await output.reply(
        "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
        `𝖨𝗇𝗏𝖺𝗅𝗂𝖽 𝗓𝗈𝗇𝖾 𝗄𝖾𝗒!\n` +
        "𝖴𝗌𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗍𝗈 𝗌𝖾𝖾 𝗓𝗈𝗇𝖾𝗌\n" +
        "𝖤𝗑𝖺𝗆𝗉𝗅𝖾: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗌𝗁𝖺𝖽𝗈𝗐_𝗏𝖺𝗅𝗅𝖾𝗒\n" +
        "━━━━━━━ ✕ ━━━━━━\n" +
        "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
      );
    }

    const lastAdventured = userData.adventure?.cooldowns?.[zoneKey]?.lastAdventured || 0;
    if (Date.now() < lastAdventured + zone.cooldown && !input.isAdmin) {
      const timeLeft = Math.ceil((lastAdventured + zone.cooldown - Date.now()) / 60000);
      return await output.reply(
        "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
        `**${userData.adventure.name} 𝗂𝗌 𝗈𝗇 𝖼𝗈𝗈𝗅𝖽𝗈𝗐𝗇!**\n` +
        `𝖳𝗋𝗒 𝖺𝗀𝖺𝗂𝗇 𝗂𝗇 ${timeLeft} 𝗆𝗂𝗇𝗎𝗍𝖾𝗌.\n` +
        "━━━━━━━ ✕ ━━━━━━\n" +
        "𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy"
      );
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

    let content = "〘 🌍 〙 **ADVENTURE**\n━━━━━━━━━━━━━━━\n" +
                  `**𝖠𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾𝖽 𝗂𝗇 ${zone.name}!**\n` +
                  `𝗘𝘃𝗲𝗻𝘁: ${outcome.description}\n`;
    if (outcome.rewards.coins) content += `𝗘𝗮𝗿𝗻𝗲𝗱: ${outcome.rewards.coins} 𝖼𝗈𝗶𝗻𝘀\n`;
    if (outcome.rewards.itemKey) content += `𝗙𝗼𝘂𝗻𝗱: ${outcome.rewards.quantity} ${outcome.rewards.itemKey.replace("_", " ")}\n`;
    content += `> 𝖢𝗁𝖾𝖼𝗄 𝗂𝗇𝗏𝖾𝗇𝗍𝗈𝗋𝗒 𝗐𝗶𝘁𝗵: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝗶𝗻𝘃𝗲𝗻𝘁𝗼𝗿𝘆\n` +
               `*> 𝖳𝗿𝗮𝗱𝗲 𝗶𝘁𝗲𝗺𝘀 𝘄𝗶𝘁𝗵: 𝖺𝖽𝗏𝖾𝗇𝗍𝗎𝗋𝖾 𝘁𝗿𝗮𝗱𝗲\n` +
               `━━━━━━━ ✕ ━━━━━━\n` +
               `𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆: Aljur Pogoy`;

    return await output.reply(content);
  },
};

export default command;
