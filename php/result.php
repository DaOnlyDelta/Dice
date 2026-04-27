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
        <svg class="scrollArrow" id="scrollArrowUp" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>

        <div id="resultsList">
        <?php
            foreach ($orderedPlayers as $placementIndex => $tiedPlayers) {
                $placementIndex = (int)$placementIndex;
                $placementClass = '';
                if ($placementIndex === 0) {
                    $placementClass = 'first';
                } else if ($placementIndex === 1) {
                    $placementClass = 'second';
                } else if ($placementIndex === 2) {
                    $placementClass = 'third';
                }

                foreach ($tiedPlayers as $stat) {
                    $rank = (int)$placementIndex + 1;
                    $name = htmlspecialchars((string)($stat['name'] ?? ''), ENT_QUOTES, 'UTF-8');
                    $total = (int)($stat['total'] ?? 0);

                    echo '<div class="result-row">';
                    echo '<span' . ($placementClass !== '' ? ' class="' . $placementClass . '"' : '') . '>' . $rank . '</span>';
                    echo '<span>' . $name . '</span>';
                    echo '<span>' . $total . '</span>';
                    echo '</div>';
                }
            }
        ?>
        </div>

        <svg class="scrollArrow" id="scrollArrowDown" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>
    </div>
    <button type="button" id="home">Home</button>
</body>
<script src="../js/result.js"></script>
</html>
