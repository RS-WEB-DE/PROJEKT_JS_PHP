<?php


$env = parse_ini_file(__DIR__ . '/../.env');

return [
  'host' => $env['DB_HOST'] ?? '127.0.0.1',
  'dbname' => $env['DB_NAME'] ?? '',
  'user' => $env['DB_USER'] ?? '',
  'pass' => $env['DB_PASS'] ?? '',
  'charset' => $env['DB_CHARSET'] ?? 'utf8mb4'
];


?>


?>
