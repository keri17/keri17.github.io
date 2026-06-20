<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Drop and recreate database
    $pdo->exec("DROP DATABASE IF EXISTS library_ms");
    $pdo->exec("CREATE DATABASE library_ms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database reset successfully\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>