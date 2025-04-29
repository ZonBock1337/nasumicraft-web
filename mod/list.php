<?php
header('Content-Type: application/json');

$modDir = __DIR__ . '/';
$modFiles = glob($modDir . '*.html'); // Nimm alle HTML-Dateien

$mods = [];

foreach ($modFiles as $filePath) {
    $content = file_get_contents($filePath);
    if ($content === false) continue;

    // Meta-Tags mit Regex auslesen
    preg_match('/<meta name="mod-name" content="([^"]*)"/i', $content, $name);
    preg_match('/<meta name="mod-version" content="([^"]*)"/i', $content, $version);
    preg_match('/<meta name="description" content="([^"]*)"/i', $content, $description);
    preg_match('/<meta name="license" content="([^"]*)"/i', $content, $license);
    preg_match('/<meta name="mod-image" content="([^"]*)"/i', $content, $image);
    preg_match('/<meta name="minecraft-version" content="([^"]*)"/i', $content, $mcversion);
    preg_match('/<meta name="mod-loader" content="([^"]*)"/i', $content, $loader);

    if ($name && $version) {
        $mods[] = [
            'name' => $name[1],
            'version' => $version[1],
            'description' => $description[1] ?? '',
            'license' => $license[1] ?? '',
            'image' => $image[1] ?? '',
            'minecraft_version' => $mcversion[1] ?? '',
            'mod_loader' => $loader[1] ?? '',
            'url' => basename($filePath)
        ];
    }
}

echo json_encode($mods, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
