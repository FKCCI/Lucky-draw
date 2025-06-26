// index.js
const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
let sheetTickets;
let sheetResults;

const initGoogleSheet = async () => {
  try {
    console.log('🟢 Tentative d\'authentification Google Sheets...');

    const decodedKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('utf8');

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: decodedKey,
    });
    await doc.loadInfo();
    console.log(`🟢 Feuille chargée : ${doc.title}`);
    sheetTickets = doc.sheetsByTitle['Tickets'];
    sheetResults = doc.sheetsByTitle['Résultats'];
  } catch (err) {
    console.error('🔴 Erreur lors de l\'initialisation Google Sheets:', err);
    throw err;
  }
};

app.get('/api/current-draw', async (req, res) => {
  try {
    await sheetResults.loadCells();
    const rows = await sheetResults.getRows();
    const results = {};

    for (const row of rows) {
      const ticket = row.get('Ticket');
      if (ticket) {
        results[ticket] = {
          lotNumber: row.get('Lot'),
          sponsor: row.get('Sponsor'),
          description: row.get('Description'),
          imageUrl: row.get('Image'),
        };
      }
    }

    res.json(results);
  } catch (err) {
    console.error('Erreur dans /api/current-draw:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du tirage' });
  }
});

app.post('/api/reset-draw', async (req, res) => {
  try {
    const password = req.body.password;
    if (password !== process.env.RESET_PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe invalide' });
    }

    const rows = await sheetResults.getRows();
    for (const row of rows) {
      await row.delete();
    }

    res.json({ message: 'Tirage réinitialisé avec succès' });
  } catch (err) {
    console.error('Erreur dans /api/reset-draw:', err);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
  }
});

initGoogleSheet()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Impossible de lancer le serveur:', err);
  });

