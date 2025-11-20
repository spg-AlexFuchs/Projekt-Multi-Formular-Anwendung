<?php
// Session mit erweiterten Cookie-Parametern starten
session_start([
    'cookie_lifetime' => 86400, // 1 Tag Gültigkeit
    'cookie_path' => '/Spengerguide/', // WICHTIG: Auf Ihren Basis-Pfad anpassen
    'cookie_secure' => false,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax'
]);

header('Content-Type: application/json');

// Debugging
file_put_contents('login.log', date('Y-m-d H:i:s')." - Login Attempt: ".$_POST['email']."\n", FILE_APPEND);

$db = new mysqli("127.0.0.1", "root", "", "test");
if ($db->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Datenbankverbindung fehlgeschlagen']));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $db->real_escape_string($_POST['email']);
    $password = $_POST['password'];

    $stmt = $db->prepare("SELECT id, passwort, vorname FROM nutzer WHERE email = ?");
    if (!$stmt) {
        file_put_contents('login.log', "DB Prepare Error: ".$db->error."\n", FILE_APPEND);
        die(json_encode(['status' => 'error', 'message' => 'Datenbankfehler']));
    }

    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        file_put_contents('login.log', "Execute Error: ".$stmt->error."\n", FILE_APPEND);
        die(json_encode(['status' => 'error', 'message' => 'Abfragefehler']));
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        file_put_contents('login.log', "User not found: ".$email."\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Falsche Email oder Passwort']);
        exit();
    }

    $user = $result->fetch_assoc();
    
    if (!password_verify($password, $user['passwort'])) {
        file_put_contents('login.log', "Wrong password for: ".$email."\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Falsche Email oder Passwort']);
        exit();
    }

    // Session-Daten setzen
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['vorname'];
    $_SESSION['user_email'] = $email;
    $_SESSION['last_active'] = time(); // Aktualisierte Zeitmarke

    // Cookie manuell setzen für bessere Kontrolle
    setcookie(
        session_name(),
        session_id(),
        [
            'expires' => time() + 86400,
            'path' => '/Spengerguide/', // WICHTIG: Muss mit cookie_path übereinstimmen
            'domain' => $_SERVER['HTTP_HOST'],
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]
    );

    file_put_contents('login.log', "Login success - ID: ".$user['id']." Session: ".session_id()."\n", FILE_APPEND);
    
    echo json_encode([
        'status' => 'success',
        'redirect' => '/Spengerguide/index.html',
        'user' => [
            'name' => $user['vorname'],
            'email' => $email
        ],
        'session_expires' => time() + 86400 // Zur Info für den Client
    ]);
    exit();
}

echo json_encode(['status' => 'error', 'message' => 'Ungültige Anfrage']);
?>