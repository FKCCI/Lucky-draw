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

const lots = [
  { lotNumber: 1, sponsor: "MICHELIN KOREA", description: "1 Set of 4 Tires", imageUrl: "https://raw.githubusercontent.com/MuzanJacksonnn/LuckyDrawGala2024/main/images/Coupon%20Racinee.jpg" },
  { lotNumber: 2, sponsor: "PERNOD RICARD", description: "Martell Chanteloup XXO" },
  { lotNumber: 3, sponsor: "GRAND HYATT SEOUL", description: "One standard room night including breakfast for 2 persons" },
  { lotNumber: 4, sponsor: "PIERRE-FABRE", description: "Sets of Pierre Fabre Dermo Cosmétique Products / 3 AVENE" },
  { lotNumber: 5, sponsor: "NAOS", description: "Institut Esthederm Voucher" },
  { lotNumber: 6, sponsor: "BLUEBELL", description: "1 PARFUMS de MARLY Delina EDP 75ml" },
  { lotNumber: 7, sponsor: "NOTREDAME DE PARIS", description: "VIP Tickets" },
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
      const ticket = row['Numéro du ticket'];
      if (ticket) {
        results[ticket] = {
          lotNumber: row['Numéro du lot'],
          sponsor: row['Sponsor'],
          description: row['Description'],
          imageUrl: lots.find(l => l.lotNumber == row['Numéro du lot'])?.imageUrl || null,
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

    // 1. Supprimer tous les anciens résultats
    const oldRows = await sheetResults.getRows();
    for (const row of oldRows) {
      await row.delete();
    }

    // 2. Récupérer tous les tickets
    const ticketRows = await sheetTickets.getRows();
    const tickets = ticketRows.map(row => row['Numéro du ticket']).filter(Boolean);

    // 3. Définir les lots ici :
    const lots = [
      {
        lotNumber: '1',
        sponsor: 'LVMH',
        description: 'Sac de luxe',
        imageUrl: 'https://exemple.com/sac.jpg'
      },
      {
        lotNumber: '2',
        sponsor: 'Air France',
        description: 'Billet aller-retour Paris-Séoul',
        imageUrl: 'https://exemple.com/vol.jpg'
      },
      {
        lotNumber: '3',
        sponsor: 'Pierre Hermé',
        description: 'Coffret macarons',
        imageUrl: 'https://exemple.com/macarons.jpg'
      }
      // Ajoute ici tous tes autres lots
    ];

    // 4. Mélanger les deux
    const shuffledTickets = tickets.sort(() => Math.random() - 0.5);
    const shuffledLots = lots.sort(() => Math.random() - 0.5);

    // 5. Attribuer les lots
    const assignments = [];
    const count = Math.min(shuffledTickets.length, shuffledLots.length);
    for (let i = 0; i < count; i++) {
      assignments.push({
        Ticket: shuffledTickets[i],
        Lot: shuffledLots[i].lotNumber,
        Sponsor: shuffledLots[i].sponsor,
        Description: shuffledLots[i].description,
        Image: shuffledLots[i].imageUrl
      });
    }

    // 6. Écrire dans Google Sheet Résultats
    for (const entry of assignments) {
      await sheetResults.addRow(entry);
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


