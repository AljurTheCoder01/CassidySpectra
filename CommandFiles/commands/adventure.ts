// btw liyan, ikw na mag review and pm moko if may concern ka or else, gagawin ko if may error sa code 
import { SpectralCMDHome, CassCheckly } from "@cassidy/spectral-home";
import { UNIRedux, FontSystem } from "@cassidy/unispectra";


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
  { key: "ownirv2_company", name: "ownirsv2 Company", description: "Explore the world of aggni members of ownirsV2 Company ", cooldown: 16200000 },
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

export const meta = {
  name: "adventure",
  description: "Manage your adventure, explore zones, and collect rewards.",
  author: "Aljur Pogoy",
  version: "1.0.0",
  usage: "{prefix}adventure <action> [args]",
  category: "Adventure",
  permissions: [0],
  noPrefix: false,
  waitingTime: 1,
  otherNames: ["adv"],
  requirement: "3.0.0",
  icon: "🌍",
  cmdType: "cplx_g",
};

export const style: CassidySpectra.CommandStyle = {
  title: {
    content: `🌍 Adventure`,
    line_bottom: "default",
    text_font: "double_struck",
  },
  content: {
    text_font: "fancy",
    line_bottom_inside_x: "default",
    content: null,
  },
  footer: {
    content: "Made with 🤍 by **Aljur Pogoy**",
    text_font: "fancy",
  },
};

/**
 * @param {CommandContext} ctx
 * @returns {Promise<void>}
 */
export async function entry(ctx) {
  const { input, output, db, args, prefix, fonts } = ctx;
  const [, ...actionArgs] = args;

  const home = new SpectralCMDHome(
    {
      argIndex: 0,
      isHypen: false,
      async home({ output, input, db }, { itemList }) {
        const cache = await db.getCache(input.senderID);
        return output.reply(
          `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
            `🌍 | Hello **${cache?.name || "Unregistered"}**! Welcome to ${fonts.applyFonts("Adventure", "double_struck")}!\n` +
            `Please choose one of our **quests**:\n\n` +
            `${UNIRedux.arrow} ${fonts.applyFonts("All Options", "fancy_italic")}\n` +
            `${itemList.replace(/^/gm, `${UNIRedux.arrowFromT} `)}\n\n` +
            `📜 | **Status**: ${cache?.adventure?.name ? `Registered as ${cache.adventure.name}` : "Not yet registered"}\n` +
            `💰 | **Coins**: ${cache?.balance ?? 0}\n` +
            `${UNIRedux.standardLine}\n` +
            `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
        );
      },
    },
    [
      {
        key: "list",
        description: "Displays all adventure zones.",
        aliases: ["-l"],
        async handler() {
          const userData: UserData = (await db.getCache(input.senderID)) || { adventure: { inventory: {}, cooldowns: {} } };
          let content = [
            `👤 **${userData.name || "Unregistered"}** (Adventure)`,
            `${UNIRedux.standardLine}`,
            `${UNIRedux.arrow} ${fonts.applyFonts("Adventure Zones", style.content.text_font)}`,
          ];
          zones.forEach((z) => {
            const lastAdventured = userData.adventure.cooldowns[z.key]?.lastAdventured || 0;
            const timeLeft = lastAdventured + z.cooldown - Date.now();
            content.push(
              `🌍 『 ${z.name} 』`,
              `**Key:** ${z.key}`,
              `**Description:** ${z.description}`,
              `**Cooldown:** ${z.cooldown / 3600000} hours`,
              `**Status:** ${timeLeft > 0 ? `On cooldown (${Math.ceil(timeLeft / 60000)} min)` : "Ready"}`,
              `${UNIRedux.standardLine}`
            );
          });
          content.push(
            `Use ${prefix}adventure <zone_key> to explore`,
            `${UNIRedux.standardLine}`,
            `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
          );
          return output.reply(
            `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n${content.join("\n")}`
          );
        },
      },
      {
        key: "userlist",
        description: "Lists all registered adventurers.",
        aliases: ["-u"],
        async handler() {
          const allUsers = await db.getAllCache();
          let content = [
            `👤 **${(await db.getCache(input.senderID))?.name || "Unregistered"}** (Adventure)`,
            `${UNIRedux.standardLine}`,
            `${UNIRedux.arrow} ${fonts.applyFonts("Adventurer List", style.content.text_font)}`,
          ];
          for (const [userId, userData] of Object.entries(allUsers)) {
            if (userData.adventure?.name) {
              const inventory = userData.adventure.inventory || {};
              const items = Object.entries(inventory)
                .map(([key, { quantity }]) => `${key.replace("_", " ")}: ${quantity}`)
                .join(", ") || "None";
              content.push(
                `🌍 『 ${userData.adventure.name} 』`,
                `**User ID:** ${userId}`,
                `**Inventory:** ${items}`,
                `**Coins:** ${userData.balance || 0}`,
                `${UNIRedux.standardLine}`
              );
            }
          }
          if (!content.some((line) => line.includes("『"))) {
            content.push(`No adventurers registered yet!`);
          }
          content.push(
            `${UNIRedux.standardLine}`,
            `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
          );
          return output.reply(
            `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n${content.join("\n")}`
          );
        },
      },
      {
        key: "register",
        description: "Register as an adventurer.",
        aliases: ["-r"],
        args: ["<name>"],
        validator: new CassCheckly([{ index: 0, type: "string", required: true, name: "name" }]),
        async handler() {
          const name = actionArgs.join("_");
          let userData: UserData = (await db.getCache(input.senderID)) || { adventure: { inventory: {}, cooldowns: {} } };

          if (userData.adventure?.name) {
            return output.reply(
              `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
                `👤 **${userData.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
                `❌ You're already registered as ${userData.adventure.name}!\n${UNIRedux.standardLine}\n` +
                `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
            );
          }

          try {
            const existing = await db.db("users").findOne({ "data.adventure.name": { $regex: `^${name}$`, $options: "i" } });
            if (existing) {
              return output.reply(
                `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
                  `👤 **${userData.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
                  `❌ Name ${name} is already taken! Choose another.\n${UNIRedux.standardLine}\n` +
                  `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
              );
            }
          } catch (error) {
            console.warn(`[Adventure] Failed to check name uniqueness for ${name}: ${error.message}`);
          }

          userData.adventure.name = name;
          try {
            await db.set(input.senderID, userData);
          } catch (error) {
            console.warn(`[Adventure] DB update failed for user ${input.senderID}: ${error.message}`);
          }

          return output.reply(
            `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
              `👤 **${userData.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
              `✅ Registered as ${name}!\n` +
              `Start exploring with ${prefix}adventure <zone_key>\n` +
              `Check inventory with ${prefix}adventure inventory\n${UNIRedux.standardLine}\n` +
              `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
          );
        },
      },
      {
        key: "explore",
        description: "Explore a zone to gain rewards.",
        aliases: ["-e"],
        args: ["<zone_key>"],
        validator: new CassCheckly([{ index: 0, type: "string", required: true, name: "zone_key" }]),
        async handler() {
          const zoneKey = actionArgs[0]?.toLowerCase();
          const zone = zones.find((z) => z.key === zoneKey);

          if (!zone) {
            return output.reply(
              `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
                `👤 **${(await db.getCache(input.senderID))?.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
                `❌ Invalid zone key! Use "${prefix}adventure list" to see zones.\n${UNIRedux.standardLine}\n` +
                `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
            );
          }

          let userData: UserData = (await db.getCache(input.senderID)) || { adventure: { inventory: {}, cooldowns: {} } };

          if (!userData.adventure.name) {
            return output.reply(
              `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
                `👤 **${userData.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
                `❌ You're not registered! Use "${prefix}adventure register <name>".\n${UNIRedux.standardLine}\n` +
                `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
            );
          }

          const lastAdventured = userData.adventure.cooldowns[zoneKey]?.lastAdventured || 0;
          if (Date.now() < lastAdventured + zone.cooldown) {
            const timeLeft = (lastAdventured + zone.cooldown - Date.now()) / 60000;
            return output.reply(
              `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
                `👤 **${userData.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
                `❌ **${userData.adventure.name}** is on cooldown! Try again in ${Math.ceil(timeLeft)} minutes.\n${UNIRedux.standardLine}\n` +
                `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
            );
          }

          const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
          userData.adventure.cooldowns[zoneKey] = { lastAdventured: Date.now() };
          userData.balance = (userData.balance || 0) + (outcome.rewards.coins || 0);

          if (outcome.rewards.itemKey) {
            if (!userData.adventure.inventory[outcome.rewards.itemKey]) {
              userData.adventure.inventory[outcome.rewards.itemKey] = { quantity: 0 };
            }
            userData.adventure.inventory[outcome.rewards.itemKey].quantity += outcome.rewards.quantity || 0;
          }

          try {
            await db.set(input.senderID, userData);
          } catch (error) {
            console.warn(`[Adventure] DB update failed for user ${input.senderID}: ${error.message}`);
          }

          let content = [
            `👤 **${userData.name || "Unregistered"}** (Adventure)`,
            `${UNIRedux.standardLine}`,
            `${UNIRedux.arrow} ${fonts.applyFonts(`Adventured in ${zone.name}!`, style.content.text_font)}`,
            `Event: ${outcome.description}`,
          ];
          if (outcome.rewards.coins) content.push(`Earned ${outcome.rewards.coins} coins`);
          if (outcome.rewards.itemKey) content.push(`Found ${outcome.rewards.quantity} ${outcome.rewards.itemKey.replace("_", " ")}`);
          content.push(
            `Use "${prefix}adventure inventory" to check inventory`,
            `Use "${prefix}adventure trade" to trade items`,
            `${UNIRedux.standardLine}`,
            `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
          );

          return output.reply(
            `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n${content.join("\n")}`
          );
        },
      },
      {
        key: "inventory",
        description: "Check your adventure inventory.",
        aliases: ["-i"],
        async handler() {
          const userData = await db.getCache(input.senderID);
          return output.reply(
            `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
              `👤 **${userData?.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
              `❌ Inventory checking is not yet implemented.\n` +
              `Please contact the developer for updates.\n${UNIRedux.standardLine}\n` +
              `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
          );
        },
      },
      {
        key: "trade",
        description: "Trade items with other adventurers.",
        aliases: ["-t"],
        async handler() {
          const userData = await db.getCache(input.senderID);
          return output.reply(
            `${fonts.applyFonts(style.title.content, style.title.text_font)}\n${UNIRedux.standardLine}\n` +
              `👤 **${userData?.name || "Unregistered"}** (Adventure)\n${UNIRedux.standardLine}\n` +
              `❌ Trading is not yet implemented.\n` +
              `Please contact the developer for updates.\n${UNIRedux.standardLine}\n` +
              `${fonts.applyFonts(style.footer.content, style.footer.text_font)}`
          );
        },
      },
    ]
  );

  return home.runInContext(ctx);
}
