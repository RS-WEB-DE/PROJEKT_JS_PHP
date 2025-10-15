<?php

header('Content-Type: application/json; charset=utf-8');


require_once __DIR__ . '/db.php';


try {
    $stmt = $pdo->query("SELECT id, name, price, img FROM parts ORDER BY id ASC");
    $parts = $stmt->fetchAll();

    echo json_encode($parts, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler', 'message' => $e->getMessage()]);
}
