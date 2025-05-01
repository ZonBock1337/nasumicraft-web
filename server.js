import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Discord-API-Token und andere Daten
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.SECRET_TOKEN;
const BOT_TOKEN = process.env.BOT_TOKEN;
const REDIRECT_URI = 'https://mc.nasumicraft.de/secrets/reward';
const DISCORD_API_URL = 'https://discord.com/api/v10';

app.post('/reward', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Discord-Username ist erforderlich' });
    }

    try {
        // Suche nach Benutzer-ID anhand des Discord-Nutzernamens
        const searchUserResponse = await fetch(`${DISCORD_API_URL}/guilds/1269311377105748162/members/search?query=${username}`, {
            method: 'GET',
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        const userData = await searchUserResponse.json();

        if (userData.length === 0) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }

        const userID = userData[0].user.id; // Die ID des Benutzers
        const roleID = '1367584279583916052';  // Deine Role-ID

        // Rolle zuweisen
        const addRoleResponse = await fetch(`${DISCORD_API_URL}/guilds/1269311377105748162/members/${userID}/roles/${roleID}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (addRoleResponse.ok) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, error: 'Fehler beim Zuweisen der Rolle' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Fehler beim Kommunizieren mit der Discord API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
