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

// DÉFINITION DES LOTS
const lots = [
{ lotNumber: 9, sponsor: "VINESSEN", description: "Vouchers for wine bottles – Redeemable at Vinessen store", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/9.%20VINESSEN_Vouchers%20for%20wine%20bottles%20%E2%80%93%20Redeemable%20at%20Vinessen%20store.JPG?raw=true" },
{ lotNumber: 10, sponsor: "GRAND HYATT", description: "One night stay at Grand Suite for 2 guest with club benefit", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/10.%20GRAND%20HYATT_One%20night%20stay%20at%20Grand%20Suite%20for%202%20guest%20with%20club%20benefit.png?raw=true" },
{ lotNumber: 11, sponsor: "PERNOD RICARD", description: "Martell Chanteloup XXO", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/11.%20PERNOD%20RICARD_Martell%20Chanteloup%20XXO.png?raw=true" },
{ lotNumber: 12, sponsor: "NOVOTEL AMBASSADOR SEOUL DONGDAEMUN HOTELS & RESIDENCES", description: "One night stay in a Superior Double Room including breakfast for 2", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/12.%20NOVOTEL%20AMBASSADOR%20SEOUL%20DONGDAEMUN%20HOTELS%20&%20RESIDENCES_One%20night%20stay%20in%20a%20Superior%20Double%20Room%20including%20breakfast%20for%202.png?raw=true" },
{ lotNumber: 13, sponsor: "SOFITEL AMBASSADOR SEOUL", description: "One night Stay in a Luxury Room including breakfast for 2", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/13.%20SOFITEL%20AMBASSADOR%20SEOUL_One%20night%20Stay%20in%20a%20Luxury%20Room%20including%20breakfast%20for%202.png?raw=true" },
{ lotNumber: 14, sponsor: "MINISH", description: "Vouchers for dental SPA in MINISH Dental Hospital", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/14~15.%20MINISH_Vouchers%20for%20dental%20SPA%20in%20MINISH%20Dental%20Hospital.png?raw=true" },
{ lotNumber: 15, sponsor: "MINISH", description: "Vouchers for dental SPA in MINISH Dental Hospital", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/14~15.%20MINISH_Vouchers%20for%20dental%20SPA%20in%20MINISH%20Dental%20Hospital.png?raw=true" },
{ lotNumber: 16, sponsor: "THE SHILLA SEOUL", description: "The Parkview Buffet Gift Certificate for 2 persons", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/16.%20the%20shilla.jpg?raw=true" },
{ lotNumber: 17, sponsor: "IBIS AMBASSADOR SEOUL INSADONG", description: "One night stay in a Superior Room including breakfast for 2", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/17.%20IBIS%20AMBASSADOR%20SEOUL%20INSADONG_One%20night%20stay%20in%20a%20Superior%20Room%20including%20breakfast%20for%202.png?raw=true" },
{ lotNumber: 18, sponsor: "SEOUL WINES & SPIRITS", description: "1 Set of Duval Leroy Duval Leroy Brut Reserve NV + Duval Leroy Rose Prestige 1er Cru NV", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/18.%20SEOUL%20WINES%20&%20SPIRITS_1%20Set%20of%20Duval%20Leroy%20Duval%20Leroy%20Brut%20Reserve%20NV%20+%20Duval%20Leroy%20Rose%20Prestige%201er%20Cru%20NV.png?raw=true" },
{ lotNumber: 19, sponsor: "NOVOTEL AMBASSADOR SUWON", description: "One night stay in a Superior Room including breakfast for 2", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/19.%20NOVOTEL%20AMBASSADOR%20SUWON_One%20night%20stay%20in%20a%20Superior%20Room%20including%20breakfast%20for%202.png?raw=true" },
{ lotNumber: 20, sponsor: "ODT", description: "PROMISE by odt. 100ml (created with Nathalie Lorson, master perfumer, Grasse France)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/20.%20ODT_PROMISE%20by%20odt.%20100ml%20(created%20with%20Nathalie%20Lorson,%20master%20perfumer,%20Grasse%20France).png?raw=true" },
{ lotNumber: 21, sponsor: "PARFUMS de MARLY (BLUEBELL)", description: "Delina Body Set (Body Cream 200ml, Hair Perfume 75ml)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/21.%20PARFUMS%20de%20MARLY%20(BLUEBELL)_Delina%20Body%20Set%20(Body%20Cream%20200ml,%20Hair%20Perfume%2075ml).png?raw=true" },
{ lotNumber: 22, sponsor: "PARFUMS de MARLY (BLUEBELL)", description: "Valaya Body Set (Body Cream 200ml, Hair Perfume 75ml)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/22.%20PARFUMS%20de%20MARLY%20(BLUEBELL)_Valaya%20Body%20Set%20(Body%20Cream%20200ml,%20Hair%20Perfume%2075ml).png?raw=true" },
{ lotNumber: 23, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "RENE FURTER Set (Color Glow Essence, Tonucia Toning Mask, Triphasic Serum, Astera Head Spa)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/23~25.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_RENE%20FURTER%20Set%20(Color%20Glow%20Essence,%20Tonucia%20Toning%20Mask,%20Triphasic%20Serum,%20Astera%20Head%20Spa).png?raw=true" },
{ lotNumber: 24, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "RENE FURTER Set (Color Glow Essence, Tonucia Toning Mask, Triphasic Serum, Astera Head Spa)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/23~25.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_RENE%20FURTER%20Set%20(Color%20Glow%20Essence,%20Tonucia%20Toning%20Mask,%20Triphasic%20Serum,%20Astera%20Head%20Spa).png?raw=true" },
{ lotNumber: 25, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "RENE FURTER Set (Color Glow Essence, Tonucia Toning Mask, Triphasic Serum, Astera Head Spa)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/23~25.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_RENE%20FURTER%20Set%20(Color%20Glow%20Essence,%20Tonucia%20Toning%20Mask,%20Triphasic%20Serum,%20Astera%20Head%20Spa).png?raw=true" },
{ lotNumber: 26, sponsor: "MERCURE SEOUL MAGOK", description: "One night stay in a Superior King Room including breakfast for 2", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/26.%20One%20night%20stay%20in%20a%20Superior%20King%20Room%20including%20breakfast%20for%202.jpg?raw=true" },
{ lotNumber: 27, sponsor: "ODT", description: "PROMISE by odt. 50ml (created with Nathalie Lorson, master perfumer, Grasse France)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/27.%20odt.%20PROMISE%20100ml%20square%201.jpg?raw=true" },
{ lotNumber: 28, sponsor: "ODT", description: "EMBER by odt. 50ml (created with Maurice Roucel, master perfumer, Paris France)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/28.%20odt.%20EMBER%20100ml%20square%201.jpg?raw=true" },
{ lotNumber: 29, sponsor: "ODT", description: "CRUSH by odt. 50ml (created with Emilie Coppermann, master perfumer, Paris France)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/29.%20odt.%20CRUSH%20100ml%20square%201.jpg?raw=true" },
{ lotNumber: 30, sponsor: "FRANCE GOURMET", description: "1 caviar Prunier Saint James gift set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/30.%20FRANCE%20GOURMET_1%20caviar%20Prunier%20Saint%20James%20gift%20set.png?raw=true" },
{ lotNumber: 31, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/31~36.%20POSITIVE%20ME_Positive%20Me%20Sweatshirt.png?raw=true" },
{ lotNumber: 32, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/31~36.%20POSITIVE%20ME_Positive%20Me%20Sweatshirt.png?raw=true" },
{ lotNumber: 33, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/31~36.%20POSITIVE%20ME_Positive%20Me%20Sweatshirt.png?raw=true" },
{ lotNumber: 34, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/31~36.%20POSITIVE%20ME_Positive%20Me%20Sweatshirt.png?raw=true" },
{ lotNumber: 35, sponsor: "POSITIVE ME", description: "Positive Me Sweatshirt", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/31~36.%20POSITIVE%20ME_Positive%20Me%20Sweatshirt.png?raw=true" },
{ lotNumber: 37, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)", imageUrl: "https://raw.githubusercontent.com/FKCCI/Lucky-draw/refs/heads/main/image%20site/37%7E40.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_AVENE%20Set%20(Cicalfate%20Cream%2C%20Hydrance%20Boost%20Serum%2C%20Eau%20Thermale%2C%20Cleanance%20Cleasing%20Gel).jfif" },
{ lotNumber: 38, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)", imageUrl: "https://raw.githubusercontent.com/FKCCI/Lucky-draw/refs/heads/main/image%20site/37%7E40.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_AVENE%20Set%20(Cicalfate%20Cream%2C%20Hydrance%20Boost%20Serum%2C%20Eau%20Thermale%2C%20Cleanance%20Cleasing%20Gel).jfif" },
{ lotNumber: 39, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)", imageUrl: "https://raw.githubusercontent.com/FKCCI/Lucky-draw/refs/heads/main/image%20site/37%7E40.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_AVENE%20Set%20(Cicalfate%20Cream%2C%20Hydrance%20Boost%20Serum%2C%20Eau%20Thermale%2C%20Cleanance%20Cleasing%20Gel).jfif" },
{ lotNumber: 40, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "AVENE Set (Cicalfate Cream, Hydrance Boost Serum, Eau Thermale, Cleanance Cleasing Gel)", imageUrl: "https://raw.githubusercontent.com/FKCCI/Lucky-draw/refs/heads/main/image%20site/37%7E40.%20PIERRE%20FABRE%20DERMO-COSMETIQUE_AVENE%20Set%20(Cicalfate%20Cream%2C%20Hydrance%20Boost%20Serum%2C%20Eau%20Thermale%2C%20Cleanance%20Cleasing%20Gel).jfif" },
{ lotNumber: 41, sponsor: "POSITIVE ME", description: "Positive Me Legging", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/41~45.%20POSITIVE%20ME_Positive%20Me%20Legging.png?raw=true" },
{ lotNumber: 42, sponsor: "POSITIVE ME", description: "Positive Me Legging", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/41~45.%20POSITIVE%20ME_Positive%20Me%20Legging.png?raw=true" },
{ lotNumber: 43, sponsor: "POSITIVE ME", description: "Positive Me Legging", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/41~45.%20POSITIVE%20ME_Positive%20Me%20Legging.png?raw=true" },
{ lotNumber: 44, sponsor: "POSITIVE ME", description: "Positive Me Legging", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/41~45.%20POSITIVE%20ME_Positive%20Me%20Legging.png?raw=true" },
{ lotNumber: 45, sponsor: "POSITIVE ME", description: "Positive Me Legging", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/41~45.%20POSITIVE%20ME_Positive%20Me%20Legging.png?raw=true" },
{ lotNumber: 46, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "KLORANE Set (Mango Butter Shampoo, Quinine Serum, Peony Conditioner)", imageUrl: "" },
{ lotNumber: 47, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "KLORANE Set (Mango Butter Shampoo, Quinine Serum, Peony Conditioner)", imageUrl: "" },
{ lotNumber: 48, sponsor: "PIERRE FABRE DERMO-COSMETIQUE", description: "KLORANE Set (Mango Butter Shampoo, Quinine Serum, Peony Conditioner)", imageUrl: "" },
{ lotNumber: 49, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/49~53.%20BBQ_BBQ%20Dining%20Vouchers%20(For%20use%20at%20BBQ%20Village%20Songnidangil)2.JPG?raw=true" },
{ lotNumber: 50, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/49~53.%20BBQ_BBQ%20Dining%20Vouchers%20(For%20use%20at%20BBQ%20Village%20Songnidangil)2.JPG?raw=true" },
{ lotNumber: 51, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/49~53.%20BBQ_BBQ%20Dining%20Vouchers%20(For%20use%20at%20BBQ%20Village%20Songnidangil)2.JPG?raw=true" },
{ lotNumber: 52, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/49~53.%20BBQ_BBQ%20Dining%20Vouchers%20(For%20use%20at%20BBQ%20Village%20Songnidangil)2.JPG?raw=true" },
{ lotNumber: 53, sponsor: "BBQ", description: "BBQ Dining Vouchers (For use at BBQ Village Songnidangil)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/49~53.%20BBQ_BBQ%20Dining%20Vouchers%20(For%20use%20at%20BBQ%20Village%20Songnidangil)2.JPG?raw=true" },
{ lotNumber: 54, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 55, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 56, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 57, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 58, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 59, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 60, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 61, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 62, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 63, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 64, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 65, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 66, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 67, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 68, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 69, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 70, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 71, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 72, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 73, sponsor: "TMONET", description: "VIP Invitation Tickets of Théâtre des Lumières", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/54~73.%20TMONET_VIP%20Invitation%20Tickets%20of%20Th%C3%A9%C3%A2tre%20des%20Lumi%C3%A8res.png?raw=true" },
{ lotNumber: 74, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 75, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 76, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 77, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 78, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 79, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 80, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 81, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 82, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 83, sponsor: "GABO TRADING", description: "Provence Organic Jam Gift Set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/74~83.%20GABO%20TRADING_Provence%20Organic%20Jam%20Gift%20Set.png?raw=true" },
{ lotNumber: 84, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 85, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 86, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 87, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 88, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 89, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 90, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 91, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 92, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 93, sponsor: "MINISH", description: "Toothbrush and Toothpaste set", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/84~93.%20MINISH_Toothbrush%20and%20Toothpaste%20set.png?raw=true" },
{ lotNumber: 94, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 95, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 96, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 97, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 98, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 99, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 100, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 101, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 102, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 103, sponsor: "LINA'S", description: "Mobile coupon", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/94~103.%20LINA'S_Mobile%20coupon.png?raw=true" },
{ lotNumber: 104, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 105, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 106, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 107, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 108, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 109, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 110, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 111, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 112, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 113, sponsor: "PARIS SUNRISE", description: "Michel Delacroix, The Artist Forever Ticket 10 couple (20ea)", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/104~113.%20PARIS%20SUNRISE_Michel%20Delacroix,%20The%20Artist%20Forever%20Ticket%2010%20couple%20(20ea)%20.png?raw=true" },
{ lotNumber: 114, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/114~118.%20BOKSOONDOGA_Boksoondoga%20Facial%20Treatment%20Mask.png?raw=true" },
{ lotNumber: 115, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/114~118.%20BOKSOONDOGA_Boksoondoga%20Facial%20Treatment%20Mask.png?raw=true" },
{ lotNumber: 116, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/114~118.%20BOKSOONDOGA_Boksoondoga%20Facial%20Treatment%20Mask.png?raw=true" },
{ lotNumber: 117, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/114~118.%20BOKSOONDOGA_Boksoondoga%20Facial%20Treatment%20Mask.png?raw=true" },
{ lotNumber: 118, sponsor: "BOKSOONDOGA", description: "Boksoondoga Facial Treatment Mask", imageUrl: "https://github.com/FKCCI/Lucky-draw/blob/main/image%20site/114~118.%20BOKSOONDOGA_Boksoondoga%20Facial%20Treatment%20Mask.png?raw=true" }
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
    
    if (!sheetTickets) console.error('🔴 Feuille "Tickets" non trouvée');
    if (!sheetResults) console.error('🔴 Feuille "Résultats" non trouvée');
  } catch (err) {
    console.error('🔴 Erreur lors de l\'initialisation Google Sheets:', err);
    throw err;
  }
};

app.get('/api/current-draw', async (req, res) => {
  try {
    console.log('📥 Requête GET /api/current-draw reçue');
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

    if (password !== process.env.RESET_PASSWORD) {
      console.log('❌ Mot de passe invalide');
      return res.status(401).json({ error: 'Mot de passe invalide' });
    }
    console.log('✅ Mot de passe valide');

    // 1. Vider la feuille Résultats
    console.log('🧨 Vidage complet de la feuille Résultats...');
    await sheetResults.clear();
    console.log('✅ Feuille Résultats vidée');

    // 2. Réécriture de l'en-tête
    await sheetResults.setHeaderRow([
      'Numéro du ticket',
      'Numéro du lot',
      'Sponsor',
      'Description',
      'Image'
    ]);
    console.log('✅ En-tête réécrit');

    // 3. Récupérer tous les tickets
    const ticketRows = await sheetTickets.getRows();
    const tickets = ticketRows.map(row => row['Numéro du ticket']).filter(Boolean);
    if (tickets.length === 0) {
      console.log('❌ Aucun ticket trouvé');
      return res.status(400).json({ error: 'Aucun ticket trouvé dans la feuille' });
    }

    // 4. Mélanger
    const shuffledTickets = [...tickets].sort(() => Math.random() - 0.5);
    const shuffledLots = [...lots].sort(() => Math.random() - 0.5);
    const count = Math.min(shuffledTickets.length, shuffledLots.length);

    // 5. Attribuer les lots
    const assignments = [];
    for (let i = 0; i < count; i++) {
      assignments.push({
        'Numéro du ticket': shuffledTickets[i],
        'Numéro du lot': shuffledLots[i].lotNumber,
        'Sponsor': shuffledLots[i].sponsor,
        'Description': shuffledLots[i].description,
        'Image': shuffledLots[i].imageUrl || ''
      });
    }

    // 6. Trier par numéro de ticket
assignments.sort((a, b) => {
  const numA = parseInt(a['Numéro du ticket']);
  const numB = parseInt(b['Numéro du ticket']);
  return numA - numB;
});

// 7. Écriture batch
console.log(`💾 Insertion en batch de ${assignments.length} lignes...`);
await sheetResults.addRows(assignments);
console.log('✅ Tirage réinitialisé avec succès');

    res.json({ 
      message: 'Tirage réinitialisé avec succès',
      assignedCount: assignments.length,
      totalTickets: tickets.length
    });

  } catch (err) {
    console.error('🔴 Erreur dans /api/reset-draw:', err);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation', details: err.message });
  }
});

app.get('/api/health', (req, res) => {
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
      console.log(`🌐 Application prête sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('🔴 Impossible de lancer le serveur:', err);
    process.exit(1);
  });
