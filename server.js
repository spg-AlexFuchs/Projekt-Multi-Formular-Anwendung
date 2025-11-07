// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Importieren der Datenbankfunktion aus script.js
const { dateneingabe } = require('./script');

const app = express();
const port = 3000;

// Middleware, um Formulardaten zu verarbeiten
app.use(bodyParser.urlencoded({ extended: true }));

// **Wichtig:** Statische Dateien (CSS) im Ordner html_files bedienen
app.use(express.static(path.join(__dirname, 'html_files')));
// Das bedeutet, dass z.B. die Datei style.css über /style.css erreichbar ist.

// Route für die Startseite (home.html)
app.get('/', (req, res) => {
    // Senden von home.html aus dem Unterordner
    res.sendFile(path.join(__dirname, 'html_files', 'home.html'));
});

// Route für das Formular (Fahrrad hinzufügen)
app.get('/fahrrad-hinzufuegen', (req, res) => {
    // Senden von Fahrrad_Hinzufuegen.html
    res.sendFile(path.join(__dirname, 'html_files', 'Fahrrad_Hinzufuegen.html'));
});

// **Die POST-Route für das Formular**
app.post('/fahrrad-hinzufuegen', async (req, res) => {
    const { name, preis, zoll, farbe } = req.body;

    try {
        await dateneingabe(name, preis, zoll, farbe);
        // Nach erfolgreicher Eingabe auf die Startseite umleiten
        res.redirect('/');
    } catch (error) {
        console.error("🔴 Fehler beim Speichern des Fahrrads:", error);
        res.status(500).send("Ein Fehler ist beim Speichern der Daten aufgetreten.");
    }
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});