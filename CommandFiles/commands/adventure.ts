#system install adventure.ts import { format } from "cassidy-styler";

const UNIRedux = { arrow: "➤" }; // Placeholder; replace with actual UNIRedux if available

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
  async entry(ctx: CommandContext) {
    const { output, input, usersDB, args } = ctx;
    const userID = input.sid;
    const subcommand = (args[0] || "").toLowerCase();

    if (!usersDB) {
      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content: "Internal error: Data cache not initialized. Contact bot admin.",
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply("Internal error: Data cache not initialized. Contact bot admin.");
      }
    }

    const userData = await usersDB.getItem(userID);

    if (subcommand === "register") {
      if (!args[1]) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content:
                "You need to provide a name!\n" +
                "Use: adventure register <name>\n" +
                "Example: adventure register Shadow_Warrior",
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(
            "You need to provide a name!\n" +
            "Use: adventure register <name>\n" +
            "Example: adventure register Shadow_Warrior"
          );
        }
      }

      const name = args.slice(1).join("_");

      if (userData?.adventure?.name) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content: `You're already registered as ${userData.adventure.name}!`,
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(`You're already registered as ${userData.adventure.name}!`);
        }
      }

      const existing = await usersDB.queryItemAll(
        { "value.adventure.name": { $regex: `^${name}$`, $options: "i" } },
        "adventure"
      );
      if (Object.keys(existing).length > 0) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content: `Name ${name} is already taken! Choose another.`,
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(`Name ${name} is already taken! Choose another.`);
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
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content:
              `Registered as ${name}!\n` +
              "Start exploring with: adventure <zone_key>\n" +
              "Check inventory with: adventure inventory",
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(
          `Registered as ${name}!\n` +
          "Start exploring with: adventure <zone_key>\n" +
          "Check inventory with: adventure inventory"
        );
      }
    }

    if (!userData || !userData.adventure?.name) {
      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content:
              "You're not registered!\n" +
              "Use: adventure register <name>\n" +
              "Example: adventure register Shadow_Warrior",
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(
          "You're not registered!\n" +
          "Use: adventure register <name>\n" +
          "Example: adventure register Shadow_Warrior"
        );
      }
    }

    if (subcommand === "list") {
      let content = "**Adventurer List**:\n";
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
          content += `**User ID**: ${userId}\n`;
          content += `**Inventory**: ${items}\n`;
          content += `**Coins**: ${data.money || 0}\n\n`;
        }
      }

      if (!content.includes("『")) {
        content += "No adventurers registered yet!\n";
      }

      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content,
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(content);
      }
    }

    if (subcommand === "inventory") {
      let content = `**Adventurer**: ${userData.adventure.name}\n`;
      const inventory = userData.adventure.inventory || {};
      const items = Object.entries(inventory)
        .map(([key, { quantity }]) => `${key.replace("_", " ")}: ${quantity}`)
        .join(", ") || "No items yet!";
      content += `**Items**: ${items}\n`;
      content += `**Coins**: ${userData.money || 0}\n`;
      content += `> Trade items with: adventure trade <item> <quantity> <target_userID>`;

      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content,
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(content);
      }
    }

    if (subcommand === "trade") {
      if (args.length < 4) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content:
                "You need to provide item, quantity, and target user ID!\n" +
                "Use: adventure trade <item> <quantity> <target_userID>\n" +
                "Example: adventure trade crystal_shard 2 123456",
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(
            "You need to provide item, quantity, and target user ID!\n" +
            "Use: adventure trade <item> <quantity> <target_userID>\n" +
            "Example: adventure trade crystal_shard 2 123456"
          );
        }
      }

      const itemKey = args[1].toLowerCase();
      const quantity = parseInt(args[2]);
      const targetUserID = args[3];

      if (isNaN(quantity) || quantity <= 0) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content: `Invalid quantity! Must be a positive number.`,
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(`Invalid quantity! Must be a positive number.`);
        }
      }

      const userInventory = userData.adventure.inventory || {};
      if (!userInventory[itemKey] || userInventory[itemKey].quantity < quantity) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content:
                `You don't have enough ${itemKey.replace("_", " ")}!\n` +
                "Check your inventory with: adventure inventory",
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(
            `You don't have enough ${itemKey.replace("_", " ")}!\n` +
            "Check your inventory with: adventure inventory"
          );
        }
      }

      const targetUserData = await usersDB.getItem(targetUserID);
      if (!targetUserData || !targetUserData.adventure?.name) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content: `Target user ${targetUserID} not found or not registered!`,
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(`Target user ${targetUserID} not found or not registered!`);
        }
      }

      if (targetUserID === userID) {
        try {
          return await output.reply(
            format({
              title: "〘 🌍 〙 ADVENTURE",
              titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
              titleFont: "double_struck",
              contentFont: "fancy_italic",
              content: `You can't trade with yourself!`,
            })
          );
        } catch (e) {
          console.error("Format error:", e);
          return await output.reply(`You can't trade with yourself!`);
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
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content:
              `**${userData.adventure.name} traded!**\n` +
              `Traded: ${quantity} ${itemKey.replace("_", " ")} to ${targetUserData.adventure.name} (ID: ${targetUserID})\n` +
              `> Check inventory with: adventure inventory`,
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(
          `**${userData.adventure.name} traded!**\n` +
          `Traded: ${quantity} ${itemKey.replace("_", " ")} to ${targetUserData.adventure.name} (ID: ${targetUserID})\n` +
          `> Check inventory with: adventure inventory`
        );
      }
    }

    if (!args[0]) {
      let content = "Adventure Zones:\n";
      zones.forEach((z) => {
        const lastAdventured = userData.adventure?.cooldowns?.[z.key]?.lastAdventured || 0;
        const timeLeft = lastAdventured + z.cooldown - Date.now();
        content += `🌍 『 ${z.name} 』\n`;
        content += `**Key**: ${z.key}\n`;
        content += `**Description**: ${z.description}\n`;
        content += `**Cooldown**: ${(z.cooldown / 3600000).toFixed(1)} hours\n`;
        content += `**Status**: ${timeLeft > 0 ? `On cooldown (${Math.ceil(timeLeft / 60000)} min)` : "Ready"}\n\n`;
      });
      content += `> Use #adventure <zone_key> to explore\n` +
                 `*Example: #adventure shadow_valley\n` +
                 `*> Use #adventure list to see adventurers\n` +
                 `*> Check inventory with: adventure inventory\n` +
                 `*> Trade items with: adventure trade`;

      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content,
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(content);
      }
    }

    const zoneKey = args[0].toLowerCase();
    const zone = zones.find((z) => z.key === zoneKey);

    if (!zone) {
      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content:
              `Invalid zone key!\n` +
              "Use: adventure to see zones\n" +
              "Example: adventure shadow_valley",
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(
          `Invalid zone key!\n` +
          "Use: adventure to see zones\n" +
          "Example: adventure shadow_valley"
        );
      }
    }

    const lastAdventured = userData.adventure?.cooldowns?.[zoneKey]?.lastAdventured || 0;
    if (Date.now() < lastAdventured + zone.cooldown && !input.isAdmin) {
      const timeLeft = Math.ceil((lastAdventured + zone.cooldown - Date.now()) / 60000);
      try {
        return await output.reply(
          format({
            title: "〘 🌍 〙 ADVENTURE",
            titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
            content:
              `**${userData.adventure.name} is on cooldown!**\n` +
              `Try again in ${timeLeft} minutes.`,
          })
        );
      } catch (e) {
        console.error("Format error:", e);
        return await output.reply(
          `**${userData.adventure.name} is on cooldown!**\n` +
          `Try again in ${timeLeft} minutes.`
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

    let content = `**Adventured in ${zone.name}!**\n` +
                  `**Event**: ${outcome.description}\n`;
    if (outcome.rewards.coins) content += `**Earned**: ${outcome.rewards.coins} coins\n`;
    if (outcome.rewards.itemKey) content += `**Found**: ${outcome.rewards.quantity} ${outcome.rewards.itemKey.replace("_", " ")}\n`;
    content += `> Check inventory with: adventure inventory\n` +
               `*> Trade items with: adventure trade`;

    try {
      return await output.reply(
        format({
          title: "〘 🌍 〙 ADVENT genealogical treeURE",
          titlePattern: `{emojis} ${UNIRedux.arrow} {word}`,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
          content,
        })
      );
    } catch (e) {
      console.error("Format error:", e);
      return await output.reply(content);
    }
  },
};

export default command;
