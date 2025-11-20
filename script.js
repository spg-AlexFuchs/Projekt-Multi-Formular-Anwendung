// --- Fahrrad speichern ---
async function fahrradspeichern() {
    const rad = {
        name: document.getElementById("bikename").value,
        preis: document.getElementById("bikeprice").value,
        zoll: document.getElementById("bikesize").value,
        farbe: document.getElementById("bikecolor").value
    };

    console.log("Sende an Server:", rad);

    await fetch("http://localhost:3000/fahrrad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rad)
    });
}


// --- Manuelle Dateneingabe ---
async function dateneingabe(name, preis, zoll, farbe) {
    const rad = { name, preis, zoll, farbe };

    await fetch("http://localhost:3000/fahrrad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rad)
    });

    console.log("Fahrrad hinzugefügt");
}


// --- Liste der Fahrräder laden ---
async function ladeFahrradListe() {
    const response = await fetch("http://localhost:3000/fahrrad");
    const bikes = await response.json();

    const select = document.getElementById("fahrradSelect");
    if (!select) return;

    select.innerHTML = "";

    bikes.forEach(bike => {
        const option = document.createElement("option");
        option.value = bike.id;
        option.textContent = bike.name;
        select.appendChild(option);
    });
}


// --- Details eines Fahrrads anzeigen ---
async function zeigeFahrradDetails(id) {
    const response = await fetch(`http://localhost:3000/fahrrad/${id}`);
    const bike = await response.json();

    const container = document.getElementById("fahrradDetails");

    container.innerHTML = `
        <div class="card p-3">
            <h3>${bike.name}</h3>
            <p><strong>Farbe:</strong> ${bike.farbe}</p>
            <p><strong>Zoll:</strong> ${bike.zoll}</p>
            <p><strong>Preis:</strong> ${bike.preis} €</p>
        </div>
    `;
}


// --- Chart hinzufügen ---
async function Charthinzufuegen() {
    try {
        const res = await fetch("http://localhost:3000/fahrrad/zoll");
        const data = await res.json();

        console.log("Statistik geladen:", data);

        const labels = data.map(e => e.size + " Zoll");
        const counts = data.map(e => e.count);

        const ctx = document.getElementById("bikeChart").getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Anzahl Fahrräder nach Größe",
                    data: counts,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch (err) {
        console.error("Fehler beim Laden der Statistik:", err);
    }
}


// --- Daten löschen ---
async function Datenloschen() {
    await fetch("http://localhost:3000/fahrrad", {
        method: "DELETE"
    });

    console.log("Alle Fahrräder gelöscht");
}


// --- Daten anzeigen ---
async function Datenanzeige() {
    const response = await fetch("http://localhost:3000/fahrrad");
    const raeder = await response.json();

    console.log("Daten vom Server:", raeder);
    return raeder;
}


// --- Seite initialisieren ---
document.addEventListener("DOMContentLoaded", () => {
    ladeFahrradListe();
    Charthinzufuegen();

    const select = document.getElementById("fahrradSelect");
    if (select) {
        select.addEventListener("change", () => {
            const id = select.value;
            if (id) zeigeFahrradDetails(id);
        });
    }
});

// --- Login Button Handler hinzufügen ---
document.addEventListener("DOMContentLoaded", function() {
    // 1. Das Element mit der ID des Login-Buttons aus home.html abrufen
    const loginButton = document.getElementById("navbarLoginElement");

    // 2. Event Listener hinzufügen, falls der Button existiert
    if (loginButton) {
        loginButton.addEventListener("click", function() {
            // 3. Weiterleitung zur Login-Seite im selben Verzeichnis
            window.location.href = "login.html"; 
        });
    }
});
