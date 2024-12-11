//Selectors
const winningPoint = $(".winning-point-container .point")

const thirdPlayerMainContainer = $(".third-player-main-container")
const fourthPlayerMainContainer = $(".fourth-player-main-container")

const firstPlayerName = $(".first-player-name")
const secondPlayerName = $(".second-player-name")
const thirdPlayerName = $(".third-player-name")
const fourthPlayerName = $(".fourth-player-name")

const switchPlayerBtn = $('.player-switch-btn')

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
let playerTemporaryScore = new Array(names.length).fill(0); //[0, 0, 0, 0]

// Select the player containers and score displays dynamically
const allPlayerContainer = $(".main-container-design").slice(0, names.length);
const playerScore = $(".player-score").slice(0, names.length);


window.onload = function () {
    TwoGreedy();
    ThreeGreedy();
    FourGreedy()
}

$(".player-name").css("text-transform", "capitalize")
function TwoGreedy() {
    if (preGameInputsObject.playerCount == "Two" && preGameInputsObject.modeName == "Greedy") {
        thirdPlayerMainContainer.css({ "display": "none" });
        fourthPlayerMainContainer.css({ "display": "none" });
        firstPlayerName.text(preGameInputsObject.playerNames[0]);
        secondPlayerName.text(preGameInputsObject.playerNames[1]);
        winningPoint.text(preGameInputsObject.gameWinningPoint);
        gameWinningPoint += parseInt(preGameInputsObject.gameWinningPoint, 10)
    }
}

function ThreeGreedy() {
    if (preGameInputsObject.playerCount == "Three" && preGameInputsObject.modeName == "Greedy") {
        fourthPlayerMainContainer.css({ "display": "none" });
        firstPlayerName.text(preGameInputsObject.playerNames[0]);
        secondPlayerName.text(preGameInputsObject.playerNames[1]);
        thirdPlayerName.text(preGameInputsObject.playerNames[2])
        winningPoint.text(preGameInputsObject.gameWinningPoint);
        gameWinningPoint += parseInt(preGameInputsObject.gameWinningPoint, 10)
    }
}

function FourGreedy() {
    if (preGameInputsObject.playerCount == "Four" && preGameInputsObject.modeName == "Greedy") {
        firstPlayerName.text(preGameInputsObject.playerNames[0]);
        secondPlayerName.text(preGameInputsObject.playerNames[1]);
        thirdPlayerName.text(preGameInputsObject.playerNames[2])
        fourthPlayerName.text(preGameInputsObject.playerNames[3])
        winningPoint.text(preGameInputsObject.gameWinningPoint);
        gameWinningPoint += parseInt(preGameInputsObject.gameWinningPoint, 10)
    }
}

function activePlayerFunction() {
    //Remove the active class from all boxes
    allPlayerContainer.removeClass("active");

    // Add the active class to the current box
    $(allPlayerContainer[activePlayerContainer]).addClass("active");
}

shooterStand.on("click", function () {
    if (isScoreUpdated) return; // If active player click multiple times within 1.2s Ignore those multiple clicks

    const generateRandomNumber = Math.floor(Math.random() * (11 - 1) + 1)
    laser.css({
        "transition": "width 0.5s ease-in",
        "width": `${generateRandomNumber * 102}px`,
        "opacity": "0.8",
    })

    if (generateRandomNumber == 3 || generateRandomNumber == 5 || generateRandomNumber == 7 || generateRandomNumber == 9) {
        playerTemporaryScore[activePlayerContainer] = playersScore[activePlayerContainer];
        $(allPlayerContainer[activePlayerContainer])
            .find(".player-score")
            .text(playerTemporaryScore[activePlayerContainer]); // Display the last saved score

        // Set flag to prevent multiple clicks within 1.2 seconds
        isScoreUpdated = true;

        // Switch active player
        setTimeout(() => {
            activePlayerContainer = (activePlayerContainer + 1) % allPlayerContainer.length;
            activePlayerFunction();
            disableSwitchButtonForAllPlayers();
            enableSwitchButtonForActivePlayer();
            laser.css("width", `${generateRandomNumber * 0}px`)
            // Reset the score update flag after 1.2 seconds
            isScoreUpdated = false;
        }, 1000);

    } else {
        playerTemporaryScore[activePlayerContainer] += generateRandomNumber;
        $(allPlayerContainer[activePlayerContainer])
            .find(".player-score")
            .text(playerTemporaryScore[activePlayerContainer]); // Display the updated temporary score
    }

    // Convert the player's score to a number using parseInt or parseFloat
    if (playerTemporaryScore[activePlayerContainer] >= gameWinningPoint) {

        setTimeout(() => {
            $(allPlayerContainer[activePlayerContainer]).css("background-color", "green");
            restartGame.css("visibility", "visible");
            $(allPlayerContainer[activePlayerContainer]).find(".player-name").text(`${$(allPlayerContainer[activePlayerContainer]).find(".player-name").text()} Wins`);
            $(allPlayerContainer[activePlayerContainer]).find(".player-name").css({
                "text-align": "center",
                "font-size": "1em",
                "padding": ".5em"
            });
            shooterStand.off("click"); // Disable the click event
        }, 500);
    }

})


// Button click event handler
switchPlayerBtn.click(function () {

    // Check if the clicked button belongs to the active player
    const currentPlayerContainer = $(this).closest('.main-container-design');

    // If the current player is active, proceed with switching
    if (currentPlayerContainer.is(allPlayerContainer[activePlayerContainer])) {
        playersScore[activePlayerContainer] = playerTemporaryScore[activePlayerContainer];
        // Switch to the next player
        activePlayerContainer = (activePlayerContainer + 1) % allPlayerContainer.length;

        // Wait for 1 second to switch player and reset laser width
        setTimeout(() => {
            activePlayerFunction();  // Call the function to visually switch the active player
            laser.css("width", "0px");  // Reset laser width
            disableSwitchButtonForAllPlayers(); // Disable all player buttons
            enableSwitchButtonForActivePlayer(); // Enable switch button for the new active player
        }, 700); // 1 second delay for smooth transition
    }
});

// Function to disable the switch button for all players
function disableSwitchButtonForAllPlayers() {
    $(".player-switch-btn").prop('disabled', true); // Disable the button for all players
}

// Function to enable the switch button for the active player only
function enableSwitchButtonForActivePlayer() {
    $(allPlayerContainer[activePlayerContainer]).find('.player-switch-btn').prop('disabled', false); // Enable button for active player
}


restartGame.click(function () {
    localStorage.clear()
    window.location.href = "../index"
})

// Initially disable all player buttons
disableSwitchButtonForAllPlayers();
enableSwitchButtonForActivePlayer();
activePlayerFunction()



