<?php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php'; 


$name = $_POST['name'] ?? null;
$price = $_POST['price'] ?? null;
$img = $_POST['img'] ?? null;

if (!$name || !$price || !$img) {
    http_response_code(400);
    echo json_encode(['error' => 'Fehlende Felder']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO parts (name, price, img) VALUES (?, ?, ?)");
    $stmt->execute([$name, $price, $img]);

    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler', 'message' => $e->getMessage()]);
}
