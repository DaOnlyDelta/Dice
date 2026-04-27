<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $players = $_POST['players'];
    $nDice = (int)$_POST['nDice'];
} else {
    header('Location: ../index.html');
    exit;
}

$playersSafe = [];
foreach ($players as $index => $player) {
    $nameRaw = trim($player);
    $displayName = ($nameRaw === '') ? ('Player ' . ($index + 1)) : $nameRaw;
    $safeName = htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8');
    $playersSafe[] = $safeName;
}

$_SESSION['players'] = $playersSafe;
$_SESSION['nDice'] = $nDice;

$diceWidth = 30;
$gap = 2;
$totalWidth = ($diceWidth * $nDice) + ($nDice - 1) * $gap;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Dice">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/game.css">
    <title>Dice</title>
</head>
<body>
    <ul class="bg-cubes">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
    <form id="game" method="POST" action="result.php">
        <?php
            foreach($playersSafe as $index => $player) {
                echo "<div id='player" . ($index + 1) . "' class='player-box' style='width: " . $totalWidth . "vh;'>";
                echo "<h2 id='title" . ($index + 1) . "'>" . $player . "</h2>";
                for($i = 0; $i < $nDice; $i++) {
                    echo "<div class='dice-box'>";
                    echo "<canvas></canvas>";
                    echo "<input type='hidden' class='die-result' name='roll[" . $index . "][" . $i . "]' value=''>";
                    echo "<button type='button' id='p" . $index . "d" . $i . "'>Roll</button>";
                    echo "</div>";
                }
                echo "<button type='button' id='p" . $index . "all' class='rollAll'>Roll All</button>";
                echo "</div>";
            }
        ?>
        <input type="submit" value="Results">
    </form>
</body>
<script src="../js/game.js"></script>
</html>
