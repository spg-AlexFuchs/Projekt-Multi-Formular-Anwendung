const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ----------------------------
// Fahrrad speichern
// ----------------------------
app.post("/fahrrad", async (req, res) => {
    try {
        const data = req.body;
        const result = await prisma.Fahrrad.create({ data });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fehler beim Speichern" });
    }
});

// ----------------------------
// Alle Fahrräder anzeigen
// ----------------------------
app.get("/fahrrad", async (req, res) => {
    try {
        const räder = await prisma.Fahrrad.findMany();
        res.json(räder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fehler beim Anzeigen" });
    }
});

// ----------------------------
// Alle Fahrräder löschen
// ----------------------------
app.delete("/fahrrad", async (req, res) => {
    try {
        await prisma.Fahrrad.deleteMany();
        res.json({ message: "Alle Fahrräder gelöscht" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Fehler beim Löschen" });
    }
});

app.listen(3000, () =>
    console.log("Server rennt auf http://localhost:3000")
);
