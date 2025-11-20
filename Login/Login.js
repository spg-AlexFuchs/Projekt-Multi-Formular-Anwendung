document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Wird verarbeitet...";

    try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.status === "success") {
            // Setze sowohl localStorage als auch Session-Cookie
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', result.user.name);
            
            // Weiterleitung
            window.location.href = result.redirect;
        } else {
            document.getElementById("loginError").textContent = result.message;
            document.getElementById("loginError").style.display = 'block';
        }
    } catch (error) {
        console.error("Fehler:", error);
        document.getElementById("loginError").textContent = "Netzwerkfehler";
        document.getElementById("loginError").style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
    }
});