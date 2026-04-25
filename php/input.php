<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $_SESSION['players'] = $_POST['players'];
    $_SESSION['nDice'] = $_POST['nDice'];
}

$diceWidth = 30;
$gap = 2;
$totalWidth = ($diceWidth * $_SESSION['nDice']) + ($_SESSION['nDice'] - 1) * $gap;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta description="Dice">
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
    </ul>
    <div id="game">
        <?php
            foreach($_SESSION['players'] as $index => $player) {
                $safeName = htmlspecialchars($player);

                echo "<div id='player" . ($index + 1) . "' class='player-box' style='width: " . $totalWidth . "vh;'>";
                echo "<h2 id='title" . ($index + 1) . "'>" . $safeName . "</h2>";
                for($i = 0; $i < $_SESSION['nDice']; $i++) {
                    echo "<div class='dice-box'>";
                    echo "<canvas></canvas>";
                    echo "<button id='p" . $index . "d" . $i . "'>Roll</button>";
                    echo "</div>";
                }
                echo "<button id='p" . $index . "all' class='rollAll'>Roll All</button>";
                echo "</div>";
            }
        ?>
    </div>
</body>
<script src="../js/game.js"></script>
</html>
