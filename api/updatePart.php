<?php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? null;
$price = $_POST['price'] ?? null;
$img = $_POST['img'] ?? null;

if (!$id || !$name || !$price || !$img) {
    http_response_code(400);
    echo json_encode(['error' => 'Fehlende Felder']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE parts SET name = ?, price = ?, img = ? WHERE id = ?");
    $stmt->execute([$name, $price, $img, $id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler', 'message' => $e->getMessage()]);
}
