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

const lots = [
  { lotNumber: 1, sponsor: "Veolia", description: "Gourde isotherme", imageUrl: "https://i.imgur.com/g1oYtMN.png" },
  { lotNumber: 2, sponsor: "Decathlon", description: "Sac de sport", imageUrl: "https://i.imgur.com/kdl7K7A.png" },
  { lotNumber: 3, sponsor: "Accor", description: "Bon cadeau", imageUrl: "https://i.imgur.com/af4FXDl.png" },
  { lotNumber: 4, sponsor: "Air France", description: "Maquette avion", imageUrl: "https://i.imgur.com/gZ0EN0m.png" },
  { lotNumber: 5, sponsor: "Yves Rocher", description: "Kit cosmétique", imageUrl: "https://i.imgur.com/Ed2MIbx.png" },
  { lotNumber: 6, sponsor: "L'Oréal", description: "Kit beauté", imageUrl: "https://i.imgur.com/d6pFwzF.png" },
  { lotNumber: 7, sponsor: "Evian", description: "Kit tennis Evian", imageUrl: "https://i.imgur.com/PUklO5a.png" },
  { lotNumber: 8, sponsor: "LVMH", description: "Parfum", imageUrl: "https://i.imgur.com/BtcPiPu.png" },
  { lotNumber: 9, sponsor: "Club Med", description: "Goodies", imageUrl: "https://i.imgur.com/wV5rNzW.png" },
  { lotNumber: 10, sponsor: "Michelin", description: "Guide Michelin", imageUrl: "https://i.imgur.com/1VeQpje.png" },
];

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
      const ticket = row['Ticket'];
      if (ticket) {
        results[ticket] = {
          lotNumber: row['Lot'],
          sponsor: row['Sponsor'],
          description: row['Description'],
          imageUrl: row['Image'],
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

    const existingRows = await sheetResults.getRows();
    for (const row of existingRows) {
      await row.delete();
    }

    const ticketRows = await sheetTickets.getRows();
    const tickets = ticketRows.map(row => row['Numéro du ticket']).filter(Boolean);

    const shuffledTickets = tickets.sort(() => Math.random() - 0.5);
    const shuffledLots = lots.sort(() => Math.random() - 0.5);

    const nbAssignments = Math.min(shuffledTickets.length, shuffledLots.length);
    const assignments = [];

    for (let i = 0; i < nbAssignments; i++) {
      assignments.push({
        Ticket: shuffledTickets[i],
        Lot: shuffledLots[i].lotNumber,
        Sponsor: shuffledLots[i].sponsor,
        Description: shuffledLots[i].description,
        Image: shuffledLots[i].imageUrl,
      });
    }

    for (const entry of assignments) {
      await sheetResults.addRow(entry);
    }

    res.json({ message: 'Tirage réinitialisé avec attribution des lots' });
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

