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
/*async function AenderungSpeichern(event) {
    event.preventDefault(); // Verhindert komplettes Neuladen der Seite

    const id = document.getElementById("bikeId").value;

    const rad = {
        name: document.getElementById("bikename").value,
        preis: parseFloat(document.getElementById("bikeprice").value),
        zoll: parseFloat(document.getElementById("bikesize").value),
        farbe: document.getElementById("bikecolor").value
    };

    console.log("Speichere Fahrrad:", rad);

    // --- Wenn ID existiert → UPDATE (PUT) ---
    if (id) {
        await fetch(`http://localhost:3000/fahrrad/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rad)
        });
        console.log("Fahrrad erfolgreich aktualisiert");
    }

    // --- Wenn keine ID → NEUES Fahrrad (POST) ---
    else {
        await fetch(`http://localhost:3000/fahrrad`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rad)
        });
        console.log("Neues Fahrrad hinzugefügt");
    }

    ladeFahrradListe(); // Dropdown aktualisieren
}
*/
// --- Fahrrad speichern/aktualisieren ---
async function AenderungSpeichern(event) {
    // Verhindert, dass das Formular die Seite neu lädt
    event.preventDefault(); 

    const id = document.getElementById("bikeId").value;

    // ACHTUNG: Preise und Zoll MÜSSEN als Zahlen (Float) an den Server gesendet werden!
    const rad = {
        name: document.getElementById("bikename").value,
        preis: parseFloat(document.getElementById("bikeprice").value),
        zoll: parseFloat(document.getElementById("bikesize").value),
        farbe: document.getElementById("bikecolor").value
    };
    
    // Einfache Validierung
    if (isNaN(rad.preis) || isNaN(rad.zoll)) {
        alert("❌ Fehler: Bitte geben Sie für Preis und Zoll gültige Zahlen ein.");
        return;
    }

    let success = false;

    try {
        // --- Wenn ID existiert → UPDATE (PUT) ---
        if (id) {
            const response = await fetch(`http://localhost:3000/fahrrad/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rad)
            });
            
            if (response.ok) {
                alert("✅ Fahrrad erfolgreich aktualisiert!"); 
                success = true;
            } else {
                // Bei HTTP-Fehlern (z.B. 404, 500)
                alert(`❌ Fehler beim Aktualisieren: Status ${response.status}`);
            }
        }

        // --- Wenn keine ID → NEUES Fahrrad (POST) ---
        else {
            const response = await fetch(`http://localhost:3000/fahrrad`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rad)
            });
            
            if (response.ok) {
                alert("➕ Neues Fahrrad erfolgreich hinzugefügt!"); 
                success = true;
                // Optional: Formular nach erfolgreichem POST zurücksetzen
                document.getElementById("bikeForm").reset(); 
            } else {
                 alert(`❌ Fehler beim Hinzufügen: Status ${response.status}`);
            }
        }

        // Wenn erfolgreich gespeichert, die Dropdown-Liste neu laden
        if (success) {
            ladeFahrradListe(); 
        }

    } catch (err) {
        // Fehler, z.B. wenn der Server nicht erreichbar ist (CORS/NetworkError)
        alert("🛑 Verbindung zum Server fehlgeschlagen. Läuft der Node.js Server?");
        console.error("Speicherfehler:", err);
    }
}

// --- Liste der Fahrräder laden ---
async function ladeFahrradListe() {
    const response = await fetch("http://localhost:3000/fahrrad");
    const bikes = await response.json();

    const select = document.getElementById("fahrradSelect");
    if (!select) return;
    select.innerHTML = `<option value="">– Fahrrad wählen –</option>`;

    bikes.forEach(bike => {
        const option = document.createElement("option");
        option.value = bike.id;
        option.textContent = bike.name;
        select.appendChild(option);
    });
}

async function ladeEinzelnesFahrrad(id) {
    const response = await fetch(`http://localhost:3000/fahrrad/${id}`);
    const bike = await response.json();

    document.getElementById("bikeId").value = bike.id;
    document.getElementById("bikename").value = bike.name;
    document.getElementById("bikeprice").value = bike.preis;
    document.getElementById("bikesize").value = bike.zoll;
    document.getElementById("bikecolor").value = bike.farbe;
}


// --- Details eines Fahrrads anzeigen ---
async function zeigeFahrradDetails(id) {
    const response = await fetch(`http://localhost:3000/fahrrad/${id}`);
    const bike = await response.json();

    const container = document.getElementById("fahrradDetails");
    if (!container) return;
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

        const canvas = document.getElementById("bikeChart");
        
        if (!canvas) return; 
        
        const ctx = canvas.getContext("2d");

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
async function loescheEinzelnesFahrrad() {
    const id = document.getElementById("bikeId").value;
    
    if (!id) {
        alert("Bitte wählen Sie zuerst ein Fahrrad zum Löschen aus!");
        return;
    }

    // Bestätigungs-Pop-up
    if (confirm("Sind Sie sicher, dass Sie dieses Fahrrad löschen wollen?")) {
        try {
            const response = await fetch(`http://localhost:3000/fahrrad/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("🗑️ Fahrrad erfolgreich gelöscht!");
                // Felder leeren und Liste aktualisieren
                document.getElementById("bikeForm").reset(); 
                document.getElementById("bikeId").value = "";
                // Die Details aus der Anzeige entfernen (falls vorhanden)
                const details = document.getElementById("fahrradDetails");
                if (details) details.innerHTML = '';
                
                ladeFahrradListe(); // Dropdown aktualisieren
            } else {
                alert(`❌ Fehler beim Löschen des Fahrrads: Status ${response.status}`);
            }
        } catch (err) {
            alert("🛑 Verbindung zum Server fehlgeschlagen.");
            console.error("Löschfehler:", err);
        }
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


// --- Seite initialisieren (Der EINZIGE DOMContentLoaded Block) ---
// Füge DIESEN NEUEN BLOCK in den DOMContentLoaded-Block in script.js ein:

document.addEventListener("DOMContentLoaded", () => {
    ladeFahrradListe();
    Charthinzufuegen();

    // Logik 1: Standard 'change' Listener für das select Element
    const select = document.getElementById("fahrradSelect");
    if (select) {
        select.addEventListener("change", () => {
            const id = select.value;
            if (id) zeigeFahrradDetails(id);
        });
    }

    const bikeForm = document.getElementById("bikeForm");
    if (bikeForm) {
        // Bei Klick auf "Speichern" wird die Funktion AenderungSpeichern aufgerufen
        bikeForm.addEventListener("submit", AenderungSpeichern);
    }
    
    // Füge auch den Listener für den Löschen-Button hinzu
    const deleteBtn = document.getElementById("deleteBike");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", loescheEinzelnesFahrrad); // Wir definieren loescheEinzelnesFahrrad gleich
    }

    // Logik 2: Zusätzlicher Listener, falls im Code doppelt
    // Wir lassen ihn drin, sichern ihn aber ab.
    if (select) {
        select.addEventListener("change", (e) => {
            const id = e.target.value;
            if (id) ladeEinzelnesFahrrad(id);
        });
    }

    // Logik 3: LOGIN/LOGOUT-BUTTONS Logik absichern
    const loginButton = document.getElementById("navbarLoginElement");
    const logoutBtn = document.getElementById("navbarLogoutElement");

    // NEU: Die Handler müssen auch abgesichert werden.
    if (loginButton) {
        loginButton.addEventListener("click", function() {
            window.location.href = "login.html"; 
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.clear();
            checkLoginStatus();
            window.location.href = "home.html";
        });
    }

    // Logik 4: Statusprüfung Funktion
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        
        // Prüfe die Existenz der Buttons HIER DRINNE
        const loginBtn = document.getElementById("navbarLoginElement");
        const logoutBtn = document.getElementById("navbarLogoutElement");

        if (isLoggedIn) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }
    
    // Logik 5: Aufruf der Statusprüfung
    checkLoginStatus(); 

});


