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
  REST,
  Routes
} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName('message')
    .setDescription('Schreibe eine Nachricht über ein Formular')
].map(command => command.toJSON());

client.once(Events.ClientReady, async () => {
  console.log(`Eingeloggt als ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash-Commands registriert.');
  } catch (err) {
    console.error('Fehler beim Registrieren:', err);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'message') {
      const modal = new ModalBuilder()
        .setCustomId('messageModal')
        .setTitle('Nachricht senden');

      const input = new TextInputBuilder()
        .setCustomId('nachricht')
        .setLabel('Deine Nachricht')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setPlaceholder('Mehrzeilige Nachricht...');

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

client.login(process.env.BOT_TOKEN);
