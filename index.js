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
  {
    lotNumber: '1',
    sponsor: 'Michelin',
    description: 'Un bon d’achat de 100,000W chez un restaurateur Michelin',
    imageUrl: 'https://fkcci.com/images/1.png',
  },
  {
    lotNumber: '2',
    sponsor: 'Pernod Ricard',
    description: 'Une bouteille de Champagne',
    imageUrl: 'https://fkcci.com/images/2.png',
  },
  {
    lotNumber: '3',
    sponsor: 'Air France',
    description: 'Une miniature d’avion Air France de collection',
    imageUrl: 'https://fkcci.com/images/3.png',
  },
  {
    lotNumber: '4',
    sponsor: 'Pierre Hermé',
    description: 'Un coffret de macarons',
    imageUrl: 'https://fkcci.com/images/4.png',
  },
  {
    lotNumber: '5',
    sponsor: 'Clarins',
    description: 'Un set de cosmétique Clarins',
    imageUrl: 'https://fkcci.com/images/5.png',
  },
  {
    lotNumber: '6',
    sponsor: 'Accor',
    description: 'Un bon pour une nuit dans un hôtel du groupe Accor',
    imageUrl: 'https://fkcci.com/images/6.png',
  },
  {
    lotNumber: '7',
    sponsor: 'LVMH',
    description: 'Un goodie offert par LVMH',
    imageUrl: 'https://fkcci.com/images/7.png',
  },
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
    const rows = await sheetResults.getRows();
    const results = {};

    for (const row of rows) {
      const ticket = row.get('Ticket');
      if (ticket) {
        results[ticket] = {
          lotNumber: row.get('Lot'),
          sponsor: row.get('Sponsor'),
          description: row.get('Description'),
          imageUrl: lots.find(l => l.lotNumber === row.get('Lot'))?.imageUrl || '',
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

    // Vider la feuille Résultats
    const oldRows = await sheetResults.getRows();
    for (const row of oldRows) {
      await row.delete();
    }

    const ticketRows = await sheetTickets.getRows();
    const ticketNumbers = ticketRows.map(row => row.Ticket);

    if (tickets.length < lots.length) {
      return res.status(400).json({ error: 'Pas assez de tickets pour tous les lots.' });
    }

    // Tirage aléatoire des tickets
    const shuffledTickets = tickets.sort(() => 0.5 - Math.random()).slice(0, lots.length);

    for (let i = 0; i < lots.length; i++) {
      const lot = lots[i];
      const ticket = shuffledTickets[i];
      await sheetResults.addRow({
        Ticket: ticket,
        Lot: lot.lotNumber,
        Sponsor: lot.sponsor,
        Description: lot.description,
      });
    }

    res.json({ message: 'Tirage réinitialisé et lots attribués avec succès.' });
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



