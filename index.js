const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
let isInitialized = false;
let currentDraw = null;

const lots = [
    { lotNumber: 11, sponsor: "FAIRMONT AMBASSADOR SEOUL", description: "One night stay at Fairmont Room with breakfast for 2" },
    { lotNumber: 12, sponsor: "NARU HOTEL SEOUL - MGALLERY AMBASSADOR", description: "One night at Premier River Suite with breakfast for 2" },
    { lotNumber: 13, sponsor: "THE AMBASSADOR SEOUL - A PULLMAN HOTEL", description: "One night stay at Superior Room with breakfast for 2" },
    { lotNumber: 14, sponsor: "NOVOTEL AMBASSADOR SEOUL YONGSAN", description: "1 Night at Superior room with breakfast for 2" },
    { lotNumber: 15, sponsor: "NOVOTEL AMBASSADOR SEOUL DONGDAEMUN", description: "One night at Executive Room with EFL benefits for 2" },
    { lotNumber: 16, sponsor: "NOVOTEL AMBASSADOR SUWON", description: "One night at Standard room with breakfast for 2" },
    { lotNumber: 17, sponsor: "IBIS AMBASSADOR SEOUL INSADONG", description: "One night at standard room" },
    { lotNumber: 20, sponsor: "IBIS AMBASSADOR SEOUL INSADONG", description: "Lunch Buffet for 2 persons" },
    { lotNumber: 21, sponsor: "JOSUN PALACE", description: "1 Night Stay in State Room for 2 persons, Breakfast included" },
    { lotNumber: 22, sponsor: "NEWB HOTEL SEOUL", description: "1 Night Stay at NEWV Suite for 2" },
    { lotNumber: 23, sponsor: "PERNOD RICARD", description: "Martell Chanteloup XXO" },
    { lotNumber: 24, sponsor: "FOUR SEASONS HOTEL", description: "The Market Kitchen Lunch Buffet for 2 guests" },
    { lotNumber: 25, sponsor: "Parfums de Marly", description: "GREENLEY EDP 75ml" },
    { lotNumber: 26, sponsor: "Parfums de Marly", description: "GREENLEY EDP 75ml" },
    { lotNumber: 27, sponsor: "GRAND HYATT SEOUL", description: "One Standard room night including breakfast for 2 persons" },
    { lotNumber: 28, sponsor: "CASTELBAJAC", description: "Boston bag" },
    { lotNumber: 29, sponsor: "ANDAZ SEOUL GANGNAM", description: "Andaz Weekend Long Brunch for Two Pax including a welcome glass of Champagne" },
    { lotNumber: 30, sponsor: "Parfums de Marly", description: "VALAYA EDP 30ml" },
    { lotNumber: 31, sponsor: "Parfums de Marly", description: "VALAYA EDP 30ml" },
    { lotNumber: 32, sponsor: "ANDAZ SEOUL GANGNAM", description: "Jogakbo Kitchen Modern Korean Dining Set Dinner for Two Pax including matching / pairing beverages" },
    { lotNumber: 33, sponsor: "THE SHILLA SEOUL", description: "The Parkview Buffet Gift Certificate for 2 persons" },
    { lotNumber: 34, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Avène" },
    { lotNumber: 35, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Avène" },
    { lotNumber: 36, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Avène" },
    { lotNumber: 37, sponsor: "Parfums de Marly", description: "VALAYA Hair Perfume 75ml" },
    { lotNumber: 38, sponsor: "Parfums de Marly", description: "VALAYA Hair Perfume 75ml" },
    { lotNumber: 39, sponsor: "Parfums de Marly", description: "VALAYA Hair Perfume 75ml" },
    { lotNumber: 40, sponsor: "Parfums de Marly", description: "VALAYA Hair Perfume 75ml" },
    { lotNumber: 41, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Ducray" },
    { lotNumber: 42, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Ducray" },
    { lotNumber: 43, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Ducray" },
    { lotNumber: 44, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Ducray" },
    { lotNumber: 45, sponsor: "GRAND HYATT SEOUL", description: "2 Restaurant credit voucher" },
    { lotNumber: 46, sponsor: "GRAND HYATT SEOUL", description: "2 Restaurant credit voucher" },
    { lotNumber: 47, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Klorane" },
    { lotNumber: 48, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Klorane" },
    { lotNumber: 49, sponsor: "PIERRE FABRE DERMO-COSMÉTIQUE", description: "Sets of Klorane" },
    { lotNumber: 50, sponsor: "MAISON SASSY", description: "SASSY Gift box" },
    { lotNumber: 51, sponsor: "MAISON SASSY", description: "SASSY Gift box" },
    { lotNumber: 52, sponsor: "TRACKMAN", description: "2 VOUCHERS OF 60 MINUTES TRACKMAN" },
    { lotNumber: 53, sponsor: "TRACKMAN", description: "2 VOUCHERS OF 60 MINUTES TRACKMAN" },
    { lotNumber: 54, sponsor: "TRACKMAN", description: "2 VOUCHERS OF 60 MINUTES TRACKMAN" },
    { lotNumber: 55, sponsor: "TRACKMAN", description: "2 VOUCHERS OF 60 MINUTES TRACKMAN" },
    { lotNumber: 56, sponsor: "TRACKMAN", description: "2 VOUCHERS OF 60 MINUTES TRACKMAN" },
    { lotNumber: 57, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 58, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 59, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 60, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 61, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 62, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 63, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 64, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 65, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 66, sponsor: "CAFES RICHARD", description: "CAFES RICHARD COFFEE" },
    { lotNumber: 67, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 68, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 69, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 70, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 71, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 72, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 73, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 74, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 75, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 76, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 77, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 78, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 79, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 80, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 81, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 82, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 83, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 84, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 85, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 86, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 87, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 88, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 89, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 90, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 91, sponsor: "TMONET", description: "Sets of Tickets for Théâtre des Lumières" },
    { lotNumber: 92, sponsor: "BOKSOONDOGA", description: "Boksoondoga Ceramic Cup" },
    { lotNumber: 93, sponsor: "BOKSOONDOGA", description: "Boksoondoga Ceramic Cup" },
    { lotNumber: 94, sponsor: "BOKSOONDOGA", description: "Boksoondoga Ceramic Cup" },
    { lotNumber: 95, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 96, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 97, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 98, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 99, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 100, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 101, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 102, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 103, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 104, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask" },
    { lotNumber: 105, sponsor: "LAITA", description: "Paysan Breton Gift Set" }

];

app.use(cors());
app.use(express.json());

async function initializeGoogleSheets() {
  try {
    const decodedKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('utf8');
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: decodedKey,
    });
    await doc.loadInfo();
    isInitialized = true;
    console.log(`🟢 Feuille chargée : ${doc.title}`);
  } catch (error) {
    console.error('🔴 Erreur lors de l\'initialisation Google Sheets:', error);
    throw error;
  }
}

app.get('/api/current-draw', async (req, res) => {
  try {
    if (!isInitialized) await initializeGoogleSheets();

    const resultSheet = doc.sheetsByTitle['Résultats'];
    const rows = await resultSheet.getRows();
    const results = {};

    for (const row of rows) {
      const ticket = row['Ticket'] || row['Numéro du ticket'];
      if (ticket) {
        results[ticket] = {
          lotNumber: row['Lot'] || row['Numéro du lot'],
          sponsor: row['Sponsor'],
          description: row['Description'],
          imageUrl: lots.find(l => l.lotNumber == row['Lot'])?.imageUrl || null,
        };
      }
    }
    res.json(results);
  } catch (error) {
    console.error('Erreur dans /api/current-draw:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du tirage' });
  }
});

app.post('/api/reset-draw', async (req, res) => {
  try {
    if (!isInitialized) await initializeGoogleSheets();

    const { password } = req.body;
    if (password !== process.env.RESET_PASSWORD) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const ticketSheet = doc.sheetsByTitle['Tickets'];
    const ticketRows = await ticketSheet.getRows();
    const tickets = ticketRows.map(r => r['Ticket'] || r['Numéro du ticket']).filter(Boolean);

    const shuffledTickets = tickets.sort(() => 0.5 - Math.random());
    const resultSheet = doc.sheetsByTitle['Résultats'];

    await resultSheet.clear();
    await resultSheet.setHeaderRow(['Numéro du ticket', 'Numéro du lot', 'Sponsor', 'Description']);

    const rows = [];
    for (let i = 0; i < Math.min(shuffledTickets.length, lots.length); i++) {
      const ticket = shuffledTickets[i];
      const lot = lots[i];
      rows.push({
        'Numéro du ticket': ticket,
        'Numéro du lot': lot.lotNumber,
        'Sponsor': lot.sponsor,
        'Description': lot.description
      });
    }
    await resultSheet.addRows(rows);
    currentDraw = null;

    res.json({ message: 'Tirage réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur dans /api/reset-draw:', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du tirage' });
  }
});

initializeGoogleSheets()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Impossible de lancer le serveur:', err);
  });


