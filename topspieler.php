<?php
$mysqli = new mysqli("193.135.10.237", "dbb6175733", "k43koorniqxk5w3fs8z03el50i7fqjux", "plan");

if ($mysqli->connect_error) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}

$sql = "
  SELECT name, ROUND(seconds_total / 3600, 2) AS stunden
  FROM plan_users
  ORDER BY seconds_total DESC
  LIMIT 10
";

$result = $mysqli->query($sql);

$spieler = [];

while($row = $result->fetch_assoc()) {
    $spieler[] = $row;
}

header('Content-Type: application/json');
echo json_encode($spieler);

$mysqli->close();
