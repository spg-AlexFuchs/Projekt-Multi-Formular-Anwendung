<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'email' => $_SESSION['email'] ?? 'Nutzer'
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
?>