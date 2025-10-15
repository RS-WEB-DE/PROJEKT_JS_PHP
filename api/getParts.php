<?php

header('Content-Type: application/json; charset=utf-8');

$config = require __DIR__ . '/config.php';

$dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";

try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    $pdo = new PDO($dsn, $config['user'], $config['pass'], $options);

    $stmt = $pdo->query("SELECT id, name, price, img FROM parts ORDER BY id ASC");
    $parts = $stmt->fetchAll();

    echo json_encode($parts, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler', 'message' => $e->getMessage()]);
}
