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
  { key: "ownirv2_company", name: "ownirv2 Company", description: "Explore the world of aggni members of ownirsV2 Company", cooldown: 16200000 },
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
    title: string;
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
    usage: "adventure register <name> | adventure <zone_key> | adventure list | adventure inventory | adventure trade",
  },
  style: {
    title: "**ADVENTURE** 🌍",
    titleFont: "double_struck",
    contentFont: "fancy_italic",
  },
  async entry(ctx: CommandContext) {
    const { output, input, usersDB, args } = ctx;
    const userID = input.sid;
    const subcommand = (args[0] || "").toLowerCase();

    if (!usersDB) {
      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: "Internal error: Data cache not initialized. Contact bot admin.",
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    const userData = await usersDB.getItem(userID);

    if (subcommand === "register") {
      if (!args[1]) {
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: "You need to provide a name!\nUse: adventure register <name>\n**Example**: adventure register Shadow_Warrior",
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
        );
      }

      const name = args.slice(1).join("_");

      if (userData?.adventure?.name) {
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: `You're already registered as ${userData.adventure.name}!`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
        );
      }

      const existing = await usersDB.queryItemAll(
        { "value.adventure.name": { $regex: `^${name}$`, $options: "i" } },
        "adventure"
      );
      if (Object.keys(existing).length > 0) {
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: `Name ${name} is already taken! Choose another.`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
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
        format({
          title: "**ADVENTURE** 🌍",
          content: `Registered as ${name}!\nStart exploring with: adventure <zone_key>\nCheck inventory with: inventory`,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    if (!userData || !userData.adventure?.name) {
      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: "You're not registered!\nUse: adventure register <name>\n**Example**: adventure register Shadow_Warrior",
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    if (subcommand === "list") {
      let content = "Adventurer List:\n";
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

      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: content,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    if (subcommand === "inventory") {
      const inventory = userData.adventure?.inventory || {};
      const items = Object.entries(inventory)
        .map(([key, { quantity }]) => `${key.replace("_", " ")}: ${quantity}`)
        .join(", ") || "None";
      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: `${userData.adventure.name}'s Inventory\n**Items**: ${items}`,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    if (subcommand === "trade") {
      if (args.length < 3) {
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: "Use: adventure trade <user_id> <item> <quantity> [optional_price]\n**Example**: adventure trade 123456789 crystal_shard 1 50\nNote: optional_price is in coins if trading for money.",
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
        );
      }

      const targetID = args[1];
      const itemKey = args[2].toLowerCase();
      const quantity = parseInt(args[3], 10);
      const price = args[4] ? parseInt(args[4], 10) : null;

      if (isNaN(quantity) || quantity <= 0) {
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: "Invalid quantity! Use a positive number.",
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
        );
      }

      const senderData = await usersDB.getItem(userID);
      const targetData = await usersDB.getItem(targetID);

      if (!senderData?.adventure?.inventory[itemKey] || senderData.adventure.inventory[itemKey].quantity < quantity) {
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: `You don't have enough ${itemKey.replace("_", " ")} to trade!\n**Current**: ${senderData?.adventure?.inventory[itemKey]?.quantity || 0}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
        );
      }

      if (price) {
        if (isNaN(price) || price <= 0) {
          return await output.reply(
            format({
              title: "**ADVENTURE** 🌍",
              content: "Invalid price! Use a positive number.",
              titleFont: "double_struck",
              contentFont: "fancy_italic",
            })
          );
        }
        const newSenderData: UserData = { ...senderData };
        newSenderData.money = (newSenderData.money || 0) + price;
        newSenderData.adventure!.inventory[itemKey].quantity -= quantity;
        if (newSenderData.adventure.inventory[itemKey].quantity === 0) {
          delete newSenderData.adventure.inventory[itemKey];
        }
        await usersDB.setItem(userID, newSenderData);
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: `Traded ${quantity} ${itemKey.replace("_", " ")} for ${price} coins!\n**New Coins**: ${newSenderData.money}`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
        );
      } else {
        if (!targetData || !targetData.adventure?.name) {
          return await output.reply(
            format({
              title: "**ADVENTURE** 🌍",
              content: "Target user is not registered or doesn't exist!",
              titleFont: "double_struck",
              contentFont: "fancy_italic",
            })
          );
        }
        const newSenderData: UserData = { ...senderData };
        const newTargetData: UserData = { ...targetData };
        newSenderData.adventure!.inventory[itemKey].quantity -= quantity;
        if (newSenderData.adventure.inventory[itemKey].quantity === 0) {
          delete newSenderData.adventure.inventory[itemKey];
        }
        newTargetData.adventure!.inventory[itemKey] = newTargetData.adventure.inventory[itemKey] || { quantity: 0 };
        newTargetData.adventure.inventory[itemKey].quantity += quantity;
        await usersDB.setItem(userID, newSenderData);
        await usersDB.setItem(targetID, newTargetData);
        return await output.reply(
          format({
            title: "**ADVENTURE** 🌍",
            content: `Traded ${quantity} ${itemKey.replace("_", " ")} to ${targetData.adventure.name}!`,
            titleFont: "double_struck",
            contentFont: "fancy_italic",
          })
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
      content += `> Use #adventure <zone_key> to explore\n**Example**: #adventure shadow_valley\n> Use #adventure list to see adventurers\n> Use #adventure inventory to view your items\n> Use #adventure trade to trade items`;

      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: content,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    const zoneKey = args[0].toLowerCase();
    const zone = zones.find((z) => z.key === zoneKey);

    if (!zone) {
      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: `Invalid zone key!\nUse: adventure to see zones\n**Example**: adventure shadow_valley`,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
      );
    }

    const lastAdventured = userData.adventure?.cooldowns?.[zoneKey]?.lastAdventured || 0;
    if (Date.now() < lastAdventured + zone.cooldown && !input.isAdmin) {
      const timeLeft = Math.ceil((lastAdventured + zone.cooldown - Date.now()) / 60000);
      return await output.reply(
        format({
          title: "**ADVENTURE** 🌍",
          content: `${userData.adventure.name} is on cooldown!\nTry again in ${timeLeft} minutes.`,
          titleFont: "double_struck",
          contentFont: "fancy_italic",
        })
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

    let content = `Adventured in ${zone.name}!\n**Event**: ${outcome.description}`;
    if (outcome.rewards.coins) content += `\n**Earned**: ${outcome.rewards.coins} coins`;
    if (outcome.rewards.itemKey) content += `\n**Found**: ${outcome.rewards.quantity} ${outcome.rewards.itemKey.replace("_", " ")}`;
    content += `\n> Check inventory with: inventory\n> Trade items with: trade`;

    return await output.reply(
      format({
        title: "**ADVENTURE** 🌍",
        content: content,
        titleFont: "double_struck",
        contentFont: "fancy_italic",
      })
    );
  },
};

export default command;
