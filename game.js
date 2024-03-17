// JavaScript code for drawing on the canvas
window.onload = function() {
    // Get the canvas element and its 2D rendering context
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    // Get audio elements
    var backgroundMusic = document.getElementById("backgroundMusic");
    var collisionSound = document.getElementById("collisionSound");

    // Start playing background music
    backgroundMusic.play();

    // Define player properties
    var playerWidth = 50;
    var playerHeight = 50;
    var playerX = canvas.width / 2 - playerWidth / 2; // Initial X position
    var playerY = canvas.height / 2 - playerHeight / 2; // Initial Y position
    var playerSpeed = 5;
    var score = 0;

    // Define obstacle properties
    var obstacleWidth = 30;
    var obstacleHeight = 30;
    var obstacleSpeed = 2;
    var obstacles = [];

    // Draw the player
    function drawPlayer() {
        ctx.fillStyle = "blue"; // Set player color to blue
        ctx.fillRect(playerX, playerY, playerWidth, playerHeight); // Draw the player rectangle
    }

    // Draw obstacles
    function drawObstacles() {
        ctx.fillStyle = "red"; // Set obstacle color to red
        obstacles.forEach(function(obstacle) {
            ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight); // Draw each obstacle rectangle
        });
    }

    // Create new obstacles
    function createObstacle() {
        var obstacle = {
            x: canvas.width,
            y: Math.random() * (canvas.height - obstacleHeight),
        };
        obstacles.push(obstacle);
    }

    // Update game state
    function update() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        drawPlayer();

        // Draw obstacles
        drawObstacles();

        // Update obstacle positions and check for collision with player
        obstacles.forEach(function(obstacle, index) {
            obstacle.x -= obstacleSpeed; // Move obstacle to the left
            if (obstacle.x + obstacleWidth < 0) {
                obstacles.splice(index, 1); // Remove obstacle if it's offscreen
                score++; // Increase score when obstacle passes the player
            }

            // Check for collision with player
            if (playerX < obstacle.x + obstacleWidth &&
                playerX + playerWidth > obstacle.x &&
                playerY < obstacle.y + obstacleHeight &&
                playerY + playerHeight > obstacle.y) {
                // Collision detected
                score -= 10; // Decrease score
                obstacles.splice(index, 1); // Remove obstacle
                collisionSound.currentTime = 0; // Rewind to the beginning
                collisionSound.play(); // Play collision sound
            }
        });

        // Display score
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }

    // Handle keyboard input
    window.addEventListener("keydown", function(event) {
        // Move the player based on arrow key presses
        switch(event.key) {
            case "ArrowUp":
                if (playerY > 0) playerY -= playerSpeed;
                break;
            case "ArrowDown":
                if (playerY < canvas.height - playerHeight) playerY += playerSpeed;
                break;
            case "ArrowLeft":
                if (playerX > 0) playerX -= playerSpeed;
                break;
            case "ArrowRight":
                if (playerX < canvas.width - playerWidth) playerX += playerSpeed;
                break;
        }
    });

    // Handle mouse click
    canvas.addEventListener("click", function(event) {
        // Move player to the mouse click position
        playerX = event.offsetX - playerWidth / 2;
        playerY = event.offsetY - playerHeight / 2;
    });

    // Main game loop
    function gameLoop() {
        update(); // Update game state
        if (Math.random() < 0.02) createObstacle(); // Randomly create new obstacles
        requestAnimationFrame(gameLoop); // Call game loop recursively
    }

    // Start the game loop
    gameLoop();
};
