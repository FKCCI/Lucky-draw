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

// DÉFINITION UNIQUE DES LOTS
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
    
    if (!sheetTickets) {
      console.error('🔴 Feuille "Tickets" non trouvée');
    }
    if (!sheetResults) {
      console.error('🔴 Feuille "Résultats" non trouvée');
    }
    
  } catch (err) {
    console.error('🔴 Erreur lors de l\'initialisation Google Sheets:', err);
    throw err;
  }
};

app.get('/api/current-draw', async (req, res) => {
  try {
    console.log('📥 Requête GET /api/current-draw reçue');
    const rows = await sheetResults.getRows();
    console.log(`📊 ${rows.length} lignes trouvées dans les résultats`);
    
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
    console.log(`✅ ${Object.keys(results).length} tickets gagnants trouvés`);
    res.json(results);
  } catch (err) {
    console.error('🔴 Erreur dans /api/current-draw:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du tirage' });
  }
});

app.post('/api/reset-draw', async (req, res) => {
  try {
    console.log('🔄 Début du reset du tirage...');
    
    const password = req.body.password;
    console.log('🔑 Vérification du mot de passe...');
    
    if (password !== process.env.RESET_PASSWORD) {
      console.log('❌ Mot de passe invalide');
      return res.status(401).json({ error: 'Mot de passe invalide' });
    }
    
    console.log('✅ Mot de passe valide');

    // 1. Supprimer tous les anciens résultats
    console.log('🗑️ Suppression des anciens résultats...');
    const oldRows = await sheetResults.getRows();
    console.log(`📊 ${oldRows.length} anciennes lignes à supprimer`);
    
    for (const row of oldRows) {
      await row.delete();
    }
    console.log('✅ Anciens résultats supprimés');

    // 2. Récupérer tous les tickets
    console.log('🎫 Récupération des tickets...');
    const ticketRows = await sheetTickets.getRows();
    const tickets = ticketRows.map(row => row['Numéro du ticket']).filter(Boolean);
    console.log(`📊 ${tickets.length} tickets trouvés:`, tickets);

    if (tickets.length === 0) {
      console.log('❌ Aucun ticket trouvé');
      return res.status(400).json({ error: 'Aucun ticket trouvé dans la feuille' });
    }

    // 3. Mélanger les deux
    console.log('🎲 Mélange des tickets et lots...');
    const shuffledTickets = [...tickets].sort(() => Math.random() - 0.5);
    const shuffledLots = [...lots].sort(() => Math.random() - 0.5);

    // 4. Attribuer les lots
    console.log('🎯 Attribution des lots...');
    const assignments = [];
    const count = Math.min(shuffledTickets.length, shuffledLots.length);
    console.log(`🔢 Attribution de ${count} lots`);
    
    for (let i = 0; i < count; i++) {
      assignments.push({
        'Numéro du ticket': shuffledTickets[i],
        'Numéro du lot': shuffledLots[i].lotNumber,
        'Sponsor': shuffledLots[i].sponsor,
        'Description': shuffledLots[i].description,
        'Image': shuffledLots[i].imageUrl || ''
      });
    }

    // 5. Écrire dans Google Sheet Résultats
    console.log('💾 Écriture des résultats...');
    for (let i = 0; i < assignments.length; i++) {
      const entry = assignments[i];
      console.log(`📝 Ajout: Ticket ${entry['Numéro du ticket']} -> Lot ${entry['Numéro du lot']}`);
      await sheetResults.addRow(entry);
    }

    console.log('🎉 Tirage réinitialisé avec succès!');
    res.json({ 
      message: 'Tirage réinitialisé et lots attribués avec succès.',
      assignedCount: assignments.length,
      totalTickets: tickets.length
    });

  } catch (err) {
    console.error('🔴 Erreur dans /api/reset-draw:', err);
    console.error('🔴 Stack trace:', err.stack);
    res.status(500).json({ 
      error: 'Erreur lors de la réinitialisation',
      details: err.message 
    });
  }
});

// Endpoint de test pour vérifier la connexion
app.get('/api/health', (req, res) => {
  console.log('💓 Health check');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    sheets: {
      tickets: !!sheetTickets,
      results: !!sheetResults
    }
  });
});

initGoogleSheet()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur le port ${PORT}`);
      console.log(`🌐 URL: https://lucky-draw-hjrp.onrender.com`);
    });
  })
  .catch(err => {
    console.error('🔴 Impossible de lancer le serveur:', err);
    process.exit(1);
  });

