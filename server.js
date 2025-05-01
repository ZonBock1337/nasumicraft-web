require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  PermissionsBitField,
  REST,
  Routes
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Slash-Command erstellen (nur Administratoren erlaubt)
const commands = [
  new SlashCommandBuilder()
    .setName('message')
    .setDescription('Schreibe eine Nachricht über ein Formular')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
].map(command => command.toJSON());

// Wenn Bot ready ist
client.once(Events.ClientReady, async () => {
  console.log(`✅ Eingeloggt als ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash-Commands registriert.');
  } catch (err) {
    console.error('❌ Fehler beim Registrieren der Commands:', err);
  }
});

// Wenn jemand einen Befehl nutzt
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'message') {
      // Überprüfen ob der Benutzer Admin ist
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: 'Du brauchst Administratorrechte, um diesen Befehl zu nutzen.', ephemeral: true });
      }

      // Modal (Formular) erstellen
      const modal = new ModalBuilder()
        .setCustomId('messageModal')
        .setTitle('Nachricht senden');

      const input = new TextInputBuilder()
        .setCustomId('nachricht')
        .setLabel('Deine Nachricht')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder('Mehrzeilige Nachricht hier schreiben...');

      const row = new ActionRowBuilder().addComponents(input);
      modal.addComponents(row);
      await interaction.showModal(modal);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === 'messageModal') {
      const message = interaction.fields.getTextInputValue('nachricht');
      await interaction.reply({ content: message });
    }
  }
});

// Bot einloggen
client.login(process.env.BOT_TOKEN);
