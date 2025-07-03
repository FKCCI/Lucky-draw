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
  { lotNumber: 9, sponsor: "VINESSEN", description: "Vouchers for wine bottles – Redeemable at Vinessen store" },
  { lotNumber: 10, sponsor: "GRAND HYATT", description: "One night stay at Grand Suite for 2 guest with club benefit" },
  { lotNumber: 11, sponsor: "PERNOD RICARD", description: "Martell Chanteloup XXO" },
  { lotNumber: 12, sponsor: "NOVOTEL AMBASSADOR SEOUL DONGDAEMUN HOTELS & RESIDENCES", description: "One night stay in a Superior Double Room including breakfast for 2" },
  { lotNumber: 13, sponsor: "SOFITEL AMBASSADOR SEOUL", description: "One night Stay in a Luxury Room including breakfast for 2" },
  { lotNumber: 14, sponsor: "MINISH", description: "Vouchers for dental SPA in MINISH Dental Hospital" },
  { lotNumber: 15, sponsor: "MINISH", description: "Vouchers for dental SPA in MINISH Dental Hospital" },
  { lotNumber: 16, sponsor: "THE SHILLA SEOUL", description: "The Parkview Buffet Gift Certificate for 2 persons" },
  { lotNumber: 17, sponsor: "IBIS AMBASSADOR SEOUL INSADONG", description: "One night stay in a Superior Room including breakfast for 2" },
  { lotNumber: 18, sponsor: "SEOUL WINES & SPIRITS", description: "1 Set of Duval Leroy Duval Leroy Brut Reserve NV + Duval Leroy Rose Prestige 1er Cru NV" },
  { lotNumber: 19, sponsor: "NOVOTEL AMBASSADOR SUWON", description: "One night stay in a Superior Room including breakfast for 2" },
  { lotNumber: 20, sponsor: "ODT", description: "PROMISE by odt. 100ml (created with Nathalie Lorson, master perfumer, Grasse France)" },
  { lotNumber: 21, sponsor: "PARFUMS de MARLY (BLUEBELL)", description: "Delina Body Set (Body Cream 200ml, Hair Perfume 75ml)" },
  { lotNumber: 22, sponsor: "PARFUMS de MARLY (BLUEBELL)", description: "Valaya Body Set (Body Cream 200ml, Hair Perfume 75ml)" },
  { lotNumber: 23, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "RENE FURTER Set (Color Glow Essence, Tonucia Toning Mask, Triphasic Serum, Astera Head Spa)" },
  { lotNumber: 24, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "RENE FURTER Set (Color Glow Essence, Tonucia Toning Mask, Triphasic Serum, Astera Head Spa)" },
  { lotNumber: 25, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "RENE FURTER Set (Color Glow Essence, Tonucia Toning Mask, Triphasic Serum, Astera Head Spa)" },
  { lotNumber: 26, sponsor: "ODT", description: "PROMISE by odt. 50ml (created with Nathalie Lorson, master perfumer, Grasse France)" },
  { lotNumber: 27, sponsor: "ODT", description: "EMBER by odt. 50ml (created with Maurice Roucel, master perfumer, Paris France)" },
  { lotNumber: 28, sponsor: "ODT", description: "CRUSH by odt. 50ml (created with Emilie Coppermann, master perfumer, Paris France)" },
  { lotNumber: 29, sponsor: "FRANCE GOURMET", description: "1 caviar Prunier Saint James gift set" },
  { lotNumber: 30, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt" },
  { lotNumber: 31, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt" },
  { lotNumber: 32, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt" },
  { lotNumber: 33, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt" },
  { lotNumber: 34, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt" },
  { lotNumber: 35, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt" },
  { lotNumber: 36, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)" },
  { lotNumber: 37, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)" },
  { lotNumber: 38, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)" },
  { lotNumber: 39, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)" },
  { lotNumber: 40, sponsor: "POSITIVE ME", description: "Positive Me Legging" },
  { lotNumber: 41, sponsor: "POSITIVE ME", description: "Positive Me Legging" },
  { lotNumber: 42, sponsor: "POSITIVE ME", description: "Positive Me Legging" },
  { lotNumber: 43, sponsor: "POSITIVE ME", description: "Positive Me Legging" },
  { lotNumber: 44, sponsor: "POSITIVE ME", description: "Positive Me Legging" },
  { lotNumber: 45, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "KLORANE Set (Mango Butter Shampoo, Quinine Serum, Peony Conditioner)" },
  { lotNumber: 46, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "KLORANE Set (Mango Butter Shampoo, Quinine Serum, Peony Conditioner)" },
  { lotNumber: 47, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "KLORANE Set (Mango Butter Shampoo, Quinine Serum, Peony Conditioner)" },
  { lotNumber: 48, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)" },
  { lotNumber: 49, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)" },
  { lotNumber: 50, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)" },
  { lotNumber: 51, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)" },
  { lotNumber: 52, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)" },
  { lotNumber: 53, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 54, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 55, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 56, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 57, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 58, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 59, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 60, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 61, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 62, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 63, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 64, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 65, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 66, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 67, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 68, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 69, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 70, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 71, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 72, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières" },
  { lotNumber: 73, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 74, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 75, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 76, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 77, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 78, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 79, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 80, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 81, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 82, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set" },
  { lotNumber: 83, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 84, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 85, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 86, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 87, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 88, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 89, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 90, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 91, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 92, sponsor: "MINISH", description: "Toothbrush and Toothpaste set" },
  { lotNumber: 93, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 94, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 95, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 96, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 97, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 98, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 99, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 100, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 101, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 102, sponsor: "LINA'S", description: "Mobile coupon" },
  { lotNumber: 103, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 104, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 105, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 106, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 107, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 108, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 109, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 110, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 111, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 112, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)" },
  { lotNumber: 113, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
  { lotNumber: 114, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
  { lotNumber: 115, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
  { lotNumber: 116, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
  { lotNumber: 117, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" }
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

