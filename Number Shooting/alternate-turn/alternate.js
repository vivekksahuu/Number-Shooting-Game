//Selectors
const winningPoint = $(".winning-point-container .point")

const thirdPlayerMainContainer = $(".third-player-main-container")
const fourthPlayerMainContainer = $(".fourth-player-main-container")

const firstPlayerName = $(".first-player-name")
const secondPlayerName = $(".second-player-name")
const thirdPlayerName = $(".third-player-name")
const fourthPlayerName = $(".fourth-player-name")

const shooterStand = $(".shooter-stand")

const laser = $(".laser")

const restartGame = $(".restart-game button")

//Global Varibales
let gameWinningPoint = 0
let activePlayerContainer = 0
let isScoreUpdated = false; // Flag to ensure the active player score is updated only once within the 1.2-second

//Retrieving data from the local storage object
const preGameInputsObject = JSON.parse(localStorage.getItem("preGameInputs"))
let names = JSON.parse(localStorage.getItem('preGameInputs')).playerNames;
let playersScore = new Array(names.length).fill(0); //[0, 0, 0, 0]

// Select the player containers and score displays dynamically
const allPlayerContainer = $(".main-container-design").slice(0, names.length);
const playerScore = $(".player-score").slice(0, names.length);


window.onload = function () {
    Two_OneShoot();
    Three_OneShoot();
    Four_OneShoot();
}

$(".player-name").css("text-transform", "capitalize")
function Two_OneShoot() {
    if (preGameInputsObject.playerCount == "Two" && preGameInputsObject.modeName == "One Shoot") {
        thirdPlayerMainContainer.css({ "display": "none" });
        fourthPlayerMainContainer.css({ "display": "none" });
        firstPlayerName.text(preGameInputsObject.playerNames[0]);
        secondPlayerName.text(preGameInputsObject.playerNames[1]);
        winningPoint.text(preGameInputsObject.gameWinningPoint);
        gameWinningPoint += parseInt(preGameInputsObject.gameWinningPoint, 10)
    }
}

function Three_OneShoot() {
    if (preGameInputsObject.playerCount == "Three" && preGameInputsObject.modeName == "One Shoot") {
        fourthPlayerMainContainer.css({ "display": "none" });
        firstPlayerName.text(preGameInputsObject.playerNames[0]);
        secondPlayerName.text(preGameInputsObject.playerNames[1]);
        thirdPlayerName.text(preGameInputsObject.playerNames[2])
        winningPoint.text(preGameInputsObject.gameWinningPoint);
        gameWinningPoint += parseInt(preGameInputsObject.gameWinningPoint, 10)
    }
}

function Four_OneShoot() {
    if (preGameInputsObject.playerCount == "Four" && preGameInputsObject.modeName == "One Shoot") {
        firstPlayerName.text(preGameInputsObject.playerNames[0]);
        secondPlayerName.text(preGameInputsObject.playerNames[1]);
        thirdPlayerName.text(preGameInputsObject.playerNames[2])
        fourthPlayerName.text(preGameInputsObject.playerNames[3])
        winningPoint.text(preGameInputsObject.gameWinningPoint);
        gameWinningPoint += parseInt(preGameInputsObject.gameWinningPoint, 10)
    }
}

function activePlayerFunction() {
    // Remove the active class from all boxes
    allPlayerContainer.removeClass("active");

    // Add the active class to the current box
    $(allPlayerContainer[activePlayerContainer]).addClass("active");
}

// Event which handles laser width and updates player score
shooterStand.on("click", function () {
    if (isScoreUpdated) return; // If active player click multiple times within 1.2s Ignore those multiple clicks

    const generateRandomNumber = Math.floor(Math.random() * (11 - 1) + 1);

    // Update laser width with animation
    laser.css("transition", "width 0.5s ease-in");
    laser.css("width", `${generateRandomNumber * 104}px`);

    // Update player score logic
    if (generateRandomNumber == 3 || generateRandomNumber == 5 || generateRandomNumber == 7 || generateRandomNumber == 9) {
        // If the random number is 3, 5, 7, or 9, don't add to the score, just display it
        $(allPlayerContainer[activePlayerContainer])
            .find(".player-score")
            .text(playersScore[activePlayerContainer]);
    } else {
        // Otherwise, add the random number to the player's score
        playersScore[activePlayerContainer] += generateRandomNumber;
        setTimeout(() => {
            $(allPlayerContainer[activePlayerContainer])
                .find(".player-score")
                .text(playersScore[activePlayerContainer]);
        }, 800);

    }

    // Set flag to prevent multiple clicks within 1.2 seconds
    isScoreUpdated = true;

    // Switch active player after 1.2 seconds
    setTimeout(() => {
        activePlayerContainer = (activePlayerContainer + 1) % allPlayerContainer.length;
        activePlayerFunction();
        // Reset laser width and transition 
        laser.css("width", "0px");
        laser.css("transition", "width 0.1s ease-in");

        // Reset the score update flag after 1.2 seconds
        isScoreUpdated = false;
    }, 1200); // After 1.2 seconds, allow the next score update

    // Game winning changes
    if (playersScore[activePlayerContainer] >= gameWinningPoint) {
        setTimeout(() => {
            $(allPlayerContainer[activePlayerContainer]).css("background-color", "green");
            restartGame.css("visibility", "visible");
            $(allPlayerContainer[activePlayerContainer]).find(".player-name").text(`${$(allPlayerContainer[activePlayerContainer]).find(".player-name").text()} Wins`);
            $(allPlayerContainer[activePlayerContainer]).find(".player-name").css({
                "text-align": "center",
                "font-size": "1em",
                "padding": ".5em"
            });
            $(allPlayerContainer[activePlayerContainer])
                .find(".player-score")
                .text(playersScore[activePlayerContainer]);
            shooterStand.off("click"); // Disable the click event
        }, 500);
    }
});

restartGame.click(function () {
    localStorage.clear();
    window.location.href = "../index"; // Redirect to setup page
});

activePlayerFunction();