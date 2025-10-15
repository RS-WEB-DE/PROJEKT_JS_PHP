<?php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$id = $_POST['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Keine ID angegeben']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM parts WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler', 'message' => $e->getMessage()]);
}
