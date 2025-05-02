require('dotenv').config();

const port = process.env.PORT || 4000
let blockLinksEnabled = true; // Standard: Links blockieren aktiviert

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  PermissionsBitField,
  ActivityType
} = require('discord.js');

// Bot-Client initialisieren
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Slash-Commands definieren
const commands = [
  new SlashCommandBuilder()
    .setName('message')
    .setDescription('Schreibe eine Nachricht über ein Formular')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator), // Nur Admins

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Zeigt die Latenz des Bots'),

  new SlashCommandBuilder()
    .setName('hilfe')
    .setDescription('Zeigt eine Übersicht der Befehle'),

  new SlashCommandBuilder()
  .setName('blocklinks')
  .setDescription('Aktiviert oder deaktiviert das Blockieren von Links')
  .addBooleanOption(option =>
    option.setName('status')
      .setDescription('true = blockieren, false = erlauben')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
].map(cmd => cmd.toJSON());

// Wenn Bot bereit ist
client.once(Events.ClientReady, async readyClient => {
  console.log(`✅ Eingeloggt als ${readyClient.user.tag}`);

  // Präsenzstatus setzen
  readyClient.user.setPresence({
    activities: [{
      name: 'auf NasumiCraft | play.nasumicraft.de',
      type: ActivityType.Playing
    }],
    status: 'online'
  });

  // Slash-Commands registrieren
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash-Commands erfolgreich registriert.');
  } catch (err) {
    console.error('❌ Fehler beim Registrieren der Commands:', err);
  }
});

// Slash-Command Interaktionen
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    // /message (nur Admins)
    if (commandName === 'message') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({
          content: '❌ Du brauchst Administratorrechte, um diesen Befehl zu nutzen.',
          ephemeral: true
        });
      }

      const modal = new ModalBuilder()
        .setCustomId('messageModal')
        .setTitle('Nachricht senden');

      const input = new TextInputBuilder()
        .setCustomId('nachricht')
        .setLabel('Deine Nachricht')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder('Schreibe hier deine Nachricht...');

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);

      await interaction.showModal(modal);
    }

    // /ping
    if (commandName === 'ping') {
      await interaction.reply(`🏓 Pong! Latenz: \`${Date.now() - interaction.createdTimestamp}ms\``);
    }

    // /hilfe
    if (commandName === 'hilfe') {
      await interaction.reply({
        ephemeral: true,
        content: `**Verfügbare Befehle:**\n
- \`/message\` – Nachricht senden (nur Admins)
- \`/ping\` – Zeigt die Latenz
- \`/blocklinks\` - Blockiert Links die gesendet werden (true = aktiviert / false = deaktiviert)
- \`/hilfe\` – Zeigt diese Hilfe`
      });
    }

    // Blockiert Links
    if (commandName === 'blocklinks') {
  const status = interaction.options.getBoolean('status');
  blockLinksEnabled = status;

  await interaction.reply({
    content: `🔗 Link-Blockierung ist jetzt **${status ? 'aktiviert' : 'deaktiviert'}**.`,
    ephemeral: true
  });
 }
}

  // Modal-Eingabe verarbeiten
  if (interaction.isModalSubmit() && interaction.customId === 'messageModal') {
    const nachricht = interaction.fields.getTextInputValue('nachricht');
    await interaction.reply({ content: nachricht });
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return; // Bot ignorieren
  if (!blockLinksEnabled) return;

  const linkRegex = /(https?:\/\/[^\s]+)/g;
  if (linkRegex.test(message.content)) {
    try {
      await message.delete();
      await message.channel.send({
        content: `❌ ${message.author} Bitte sende keine Links!`
      });
    } catch (err) {
      console.error('Fehler beim Löschen der Nachricht:', err);
    }
  }
});

// Bot starten
client.login(process.env.BOT_TOKEN);
