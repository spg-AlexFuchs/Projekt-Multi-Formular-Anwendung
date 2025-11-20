<?php
session_start();
header('Content-Type: application/json');

// Debug-Ausgabe
error_log("Session check - User: " . ($_SESSION['user_name'] ?? 'none'));

echo json_encode([
    'loggedIn' => isset($_SESSION['user_id']),
    'user' => [
        'name' => $_SESSION['user_name'] ?? '',
        'email' => $_SESSION['user_email'] ?? ''
    ]
]);
?>