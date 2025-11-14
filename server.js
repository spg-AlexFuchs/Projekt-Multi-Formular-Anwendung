// Da lad ma uns des Express-Framework owe – damid ma a gscheiten Webserver aufsetz'n kenna.
const express = require("express");

// Des is da CORS-Handler – sonst sudert da Browser, dass er ned zuafoin derf.
const cors = require("cors");

// Und do kummt da PrismaClient – des is unsa Zugang zur Datenbank.
const { PrismaClient } = require("@prisma/client");


// Do erstellen ma unsa Express-App – quasi unser Servergrundgerüst.
const app = express();

// Und do erzeugen ma unsa Prisma-Verbindung, sonsd red ma nimma mit da Datenbank.
const prisma = new PrismaClient();


// Do schalten ma CORS ein – sonst blockiert da Browser uns de Anfrogn.
app.use(cors({
    origin: "*",                         // Wir lass'n einfach olle zua, passt scho.
    methods: ["GET", "POST", "DELETE"],  // De Methoden, de ma erlauben.
    allowedHeaders: ["Content-Type"]     // Und de Header, de ma dulden.
}));


// Do sog ma zum Server: "Heast, wenn wer JSON schickt – moch a Objekt draus."
app.use(express.json());


// -------------------------------------------------------------------
// ROUTE 1: Fahrrad speichern (POST)
// Wird gnutzt, wenn da Benutzer a neues Rad einfoigt.
// -------------------------------------------------------------------
app.post("/fahrrad", async (req, res) => {
    try {
        // Do greif ma auf de Daten zua, de der Browser gschickt hat.
        const data = req.body;

        // Browser schickt olle Zahlen ois String – drum muass ma’s umwandeln.
        data.preis = parseFloat(data.preis); // Preis umwandeln auf Zahl.
        data.zoll = parseFloat(data.zoll);   // Zoll a umwandeln.

        // Do wird des neue Rad in da Datenbank eintragt.
        const result = await prisma.Fahrrad.create({ data });

        // Des Resultat schick ma wieda zruck zum Browser.
        res.json(result);

    } catch (error) {
        // Wenn wos explodiert, schreib ma’s da Konsole eini.
        console.error(error);

        // Und do kriegt da Browser a gscheite Fehlermeldung.
        res.status(500).json({ error: "Heast, da is wos beim Speichan schiefganga." });
    }
});


// -------------------------------------------------------------------
// ROUTE 2: Alle Fahrräder anzeigen (GET)
// Holt uns olle Räder aus da Datenbank.
// -------------------------------------------------------------------
app.get("/fahrrad", async (req, res) => {
    try {
        // Holt olle Fahrräder aus da DB.
        const räder = await prisma.Fahrrad.findMany();

        // Schickt’s zum Browser.
        res.json(räder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Heast, de Räder kann i net anzeigen." });
    }
});


// -------------------------------------------------------------------
// ROUTE 3: Alle Fahrräder löschen (DELETE)
// Ma haut olle Räder auf oamoi aus da Datenbank auße.
// -------------------------------------------------------------------
app.delete("/fahrrad", async (req, res) => {
    try {
        // Löscht olle Einträge aus da Fahrrad-Tabelle.
        await prisma.Fahrrad.deleteMany();

        // Sogt zum Browser: "Jo, is erledigt."
        res.json({ message: "Heast, olle Fahrräder san jetzt weg." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Heast, wos is denn do beim Löschen passiert?" });
    }
});


// Do starten ma den Server am Port 3000.
// Und geben a kleine Meldung aus, damid ma woass, dass er laft.
app.listen(3000, () =>
    console.log("Server laft. Schaug afoch auf: http://localhost:3000")
);
