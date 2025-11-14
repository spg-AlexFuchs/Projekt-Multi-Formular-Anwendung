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


async function dateneingabe(name, preis, zoll, farbe) {
    const rad = { name, preis, zoll, farbe };

    await fetch("http://localhost:3000/fahrrad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rad)
    });

    console.log("Fahrrad hinzugefügt");
}


async function ladeFahrradListe() {
    const response = await fetch("http://localhost:3000/fahrrad");
    const bikes = await response.json();

    const select = document.getElementById("fahrradSelect");
    select.innerHTML = ""; // alte Einträge entfernen

    bikes.forEach(bike => {
        const option = document.createElement("option");
        option.value = bike.id;
        option.textContent = bike.name;
        select.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", ladeFahrradListe);

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



async function Datenloschen() {
    await fetch("http://localhost:3000/fahrrad", {
        method: "DELETE"
    });

    console.log("Alle Fahrräder gelöscht");
}


async function Datenanzeige() {
    const response = await fetch("http://localhost:3000/fahrrad");
    const raeder = await response.json();

    console.log("Daten vom Server:", raeder);
    return raeder;
}

document.addEventListener("DOMContentLoaded", () => {
    ladeFahrradListe();

    const select = document.getElementById("fahrradSelect");
    select.addEventListener("change", (event) => {
        const id = event.target.value;

        if (id) {
            zeigeFahrradDetails(id);
        }
    });
});
