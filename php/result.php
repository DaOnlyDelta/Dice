<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $players = $_SESSION['players'];
    $nDice = (int)$_SESSION['nDice'];
    // roll[playerIndex][dieIndex] comes from the game form submission.
    $submittedRolls = $_POST['roll'];
} else {
    header('Location: ../index.html');
    exit;
}

// Collect per-player stats for ordering.
$playerStats = [];

foreach ($players as $index => $displayName) {
    $playerRollsRaw = $submittedRolls[$index];

    $total = 0;
    for ($dieIndex = 0; $dieIndex < $nDice; $dieIndex++) {
        $val = (int)$playerRollsRaw[$dieIndex];

        $total += $val;
    }

    $playerStats[] = [
        'index' => (int)$index,
        'name' => $displayName,
        'total' => $total,
    ];
}

// Make an ordered leaderboard array (index = placement group).
// Example: $orderedPlayers[0] = [playerA, playerB] when they tie for 1st.
$orderedPlayers = [];
usort($playerStats, function (array $a, array $b): int {
    // Higher total ranks first; stable tie-breaker by original index.
    $byTotal = $b['total'] <=> $a['total'];
    if ($byTotal !== 0) {
        return $byTotal;
    }
    return $a['index'] <=> $b['index'];
});

$lastTotal = null;
foreach ($playerStats as $stat) {
    if ($lastTotal === null || $stat['total'] !== $lastTotal) {
        $orderedPlayers[] = [];
        $lastTotal = $stat['total'];
    }
    $orderedPlayers[count($orderedPlayers) - 1][] = $stat;
}

$_SESSION['orderedPlayers'] = $orderedPlayers;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Dice">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/result.css">
    <link rel="icon" type="image/x-icon" href="../img/icon.png">
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
    <h1>Results</h1>
    <div id="result">
        <div class="podium">
            <?php
            $topCount = min(3, count($orderedPlayers));
            $podiumPlayers = [];
            for ($i = 0; $i < $topCount; $i++) {
                $names = [];
                foreach ($orderedPlayers[$i] as $stat) {
                    $names[] = htmlspecialchars($stat['name'], ENT_QUOTES, 'UTF-8');
                }
                $podiumPlayers[$i] = implode(', ', $names);
            }

            $displayOrder = [];
            if ($topCount >= 2) {
                $displayOrder[] = ['rank' => 2, 'name' => $podiumPlayers[1]];
            }
            if ($topCount >= 1) {
                $displayOrder[] = ['rank' => 1, 'name' => $podiumPlayers[0]];
            }
            if ($topCount >= 3) {
                $displayOrder[] = ['rank' => 3, 'name' => $podiumPlayers[2]];
            }
            ?>
            <?php foreach ($displayOrder as $item): ?>
                <div class="podium-place rank-<?= $item['rank'] ?>">
                    <div class="podium-name"><?= $item['name'] ?></div>
                    <div class="podium-pillar">
                        <span class="podium-rank"><?= $item['rank'] ?></span>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <button type="button" id="home">Returning.. 10</button>
    <button type="button" id="stop">stop countdown</button>
</body>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
<script src="../js/result.js"></script>
</html>
