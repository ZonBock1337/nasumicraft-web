<?php
header('Content-Type: application/json');

$files = array_filter(scandir(__DIR__), function($file) {
    return pathinfo($file, PATHINFO_EXTENSION) === 'html';
});

echo json_encode(array_values($files));
?>
