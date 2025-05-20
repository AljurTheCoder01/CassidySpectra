import { UNISpectra } from "@cassidy/unispectra"

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
      line_bottom: "default",
      text_font: "double_struck",
    },
    content: {
      text_font: "fancy",
      line_bottom_inside_x: "default",
      content: null,
    },
    footer: {
      content: "Developed by: Aljur Pogoy",
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
          `❌ Internal error: Data cache not initialized. Contact bot admin. ${UNISpectra.charm}`,
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply(`❌ Internal error: Data cache not initialized. Contact bot admin. ${UNISpectra.charm}`);
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
          ].join("\n"));
        }
      }

      const name = args.slice(1).join("_");

      if (userData?.adventure?.name) {
        try {
          return await output.replyStyled(
            `❌ You're already registered as **${userData.adventure.name}**! ${UNISpectra.charm}`,
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply(`❌ You're already registered as **${userData.adventure.name}**! ${UNISpectra.charm}`);
        }
      }

      const existing = await usersDB.queryItemAll(
        { "value.adventure.name": { $regex: `^${name}$`, $options: "i" } },
        "adventure"
      );
      if (Object.keys(existing).length > 0) {
        try {
          return await output.replyStyled(
            `❌ Name **${name}** is already taken! Choose another. ${UNISpectra.charm}`,
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply(`❌ Name **${name}** is already taken! Choose another. ${UNISpectra.charm}`);
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
        `**Coins**: ${data.money || 0} 💵`
        `${UNISpectra.standardLine}`,
        `> Trade items with: adventure trade <item> <quantity> <target_userID>`,
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
          ].join("\n"));
        }
      }

      const itemKey = args[1].toLowerCase();
      const quantity = parseInt(args[2]);
      const targetUserID = args[3];

      if (isNaN(quantity) || quantity <= 0) {
        try {
          return await output.replyStyled(
            `❌ Invalid quantity! Must be a positive number. ${UNISpectra.charm}`,
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply(`❌ Invalid quantity! Must be a positive number. ${UNISpectra.charm}`);
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
            ].join("\n"),
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply([
            `❌ You don't have enough **${itemKey.replace("_", " ")}**! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Check your inventory with: adventure inventory`,
          ].join("\n"));
        }
      }

      const targetUserData = await usersDB.getItem(targetUserID);
      if (!targetUserData || !targetUserData.adventure?.name) {
        try {
          return await output.replyStyled(
            `❌ Target user **${targetUserID}** not found or not registered! ${UNISpectra.charm}`,
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply(`❌ Target user **${targetUserID}** not found or not registered! ${UNISpectra.charm}`);
        }
      }

      if (targetUserID === userID) {
        try {
          return await output.replyStyled(
            `❌ You can't trade with yourself! ${UNISpectra.charm}`,
            command.style
          );
        } catch (e) {
          console.error("ReplyStyled error:", e);
          return await output.reply(`❌ You can't trade with yourself! ${UNISpectra.charm}`);
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
        ].join("\n"));
      }
    }

    if (!args[0]) {
      let content = [`📋 **Adventure Zones** ${UNISpectra.charm}`];
      zones.forEach((z) => {
        const lastAdventured = userData.adventure?.cooldowns?.[z.key]?.lastAdventured || 0;
        const timeLeft = lastAdventured + z.cooldown - Date.now();
        content.push(
          `${UNISpectra.standardLine}`,
          `🌍 **${z.name}**`,
          `**Key**: ${z.key}`,
          `**Description**: ${z.description}`,
          `**Cooldown**: ${(z.cooldown / 3600000).toFixed(1)} hours`,
          `**Status**: ${timeLeft > 0 ? `On cooldown (${Math.ceil(timeLeft / 60000)} min)` : "Ready"}`
        );
      });
      content.push(
        `${UNISpectra.standardLine}`,
        `> Use #adventure <zone_key> to explore`,
        `*Example: #adventure shadow_valley`,
        `*> Use #adventure list to see adventurers`,
        `*> Check inventory with: adventure inventory`,
        `*> Trade items with: adventure trade`
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
        ].join("\n"));
      }
    }

    const lastAdventured = userData.adventure?.cooldowns?.[zoneKey]?.lastAdventured || 0;
    if (Date.now() < lastAdventured + zone.cooldown && !input.isAdmin) {
      const timeLeft = Math.ceil((lastAdventured + zone.cooldown - Date.now()) / 60000);
      try {
        return await output.replyStyled(
          [
            `❌ **${userData.adventure.name}** is on cooldown! ${UNISpectra.charm}`,
            `${UNISpectra.standardLine}`,
            `Try again in ${timeLeft} minutes.`,
          ].join("\n"),
          command.style
        );
      } catch (e) {
        console.error("ReplyStyled error:", e);
        return await output.reply([
          `❌ **${userData.adventure.name}** is on cooldown! ${UNISpectra.charm}`,
          `${UNISpectra.standardLine}`,
          `Try again in ${timeLeft} minutes.`,
        ].join("\n"));
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
      `✅ Adventured in **${zone.name}**! ${UNISpectra.charm}`,
      `${UNISpectra.standardLine}`,
      `**Event**: ${outcome.description}`,
      outcome.rewards.coins ? `**Earned**: ${outcome.rewards.coins} coins 💵` : "",
      outcome.rewards.itemKey ? `**Found**: ${outcome.rewards.quantity} **${outcome.rewards.itemKey.replace("_", " ")}**` : "",
      `${UNISpectra.standardLine}`,
      `> Check inventory with: adventure inventory`,
      `*> Trade items with: adventure trade`,
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
