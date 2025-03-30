// Pre Game Setup Page Selectors
const playerNumberButton = $(".player-number-button-container")
const playerNameInputs = $(".player-name-form-container input")
const firstPlayer = $(".first-player")
const secondPlayer = $(".second-player")
const thirdPLayer = $(".third-player")
const fourthPLayer = $(".fourth-player")
const startGameBtn = $(".start-btn button")
const setWinningPoint = $(".point-setting-container .input")
const gameModes = $(".game-mode-container")

//Game Paths
let gameRoutes = {
    "Two_Greedy": "../greedy-mode/greedy",
    "Three_Greedy": "../greedy-mode/greedy",
    "Four_Greedy": "../greedy-mode/greedy",
    "Two_One Shoot": "../alternate-turn/alternate",
    "Three_One Shoot": "../alternate-turn/alternate",
    "Four_One Shoot": "../alternate-turn/alternate",
};

//Display player name input field based on the number of player
playerNumberButton.on("click", "button", function () {
    if ($(this).text() == "Two") {
        thirdPLayer.css({ "display": "none" })
        fourthPLayer.css({ "display": "none" })

    } else if ($(this).text() == "Three") {
        thirdPLayer.css({ "display": "flex" })
        fourthPLayer.css({ "display": "none" })

    } else if ($(this).text() == "Four") {
        thirdPLayer.css({ "display": "flex" })
        fourthPLayer.css({ "display": "flex" })
    }
})

let preGameInputs = {} // Empty object to store all inputs from the pre game page

// Adding new key to empty object whose value will be: When selecting number of player, whichever button user last clicked on, that button text
playerNumberButton.on("click", "button", function () {
    preGameInputs.playerCount = $(this).text();
});

// Adding new key to object whose value will be: When selecting game mode, whichever button user last clicked on, that button text
gameModes.on("click", "button", function () {
    preGameInputs.modeName = $(this).text();
});


// On start game button click, store the player name and game winnig pont to object
startGameBtn.click(function (event) {
    event.preventDefault() //prevent from page  refreshing

    // Loop through the visible inputs feilds in player name container
    let allFilled = true;
    playerNameInputs.each(function () {
        if ($(this).is(':visible') && $(this).val().trim() === "") { //trim remove white space from string
            allFilled = false; // If any visible input is empty, set allFilled to false
        }
    });

    // If any visible input is empty, show the alert
    if (!allFilled) {
        alert("Enter all player names");
        return
    }

    // Adding new key in object. Initially the key value will be empty array. This empty array will going to store all player names
    preGameInputs.playerNames = [];

    playerNameInputs.each(function () {
        let playerName = $(this).val().trim(); //remove white space from the string
        if (playerName) {
            preGameInputs.playerNames.push(playerName);  // add all the player names to playerNames array
        }
    });

    preGameInputs.gameWinningPoint = setWinningPoint.text() //adding a new key to object 

    localStorage.setItem("preGameInputs", JSON.stringify(preGameInputs));

    // Construct the key to check in `gameRoutes`
    let playerCount = preGameInputs.playerCount; // E.g., "Two", "Three", or "Four"
    let mode = preGameInputs.modeName;          // E.g., "Greedy" or "One Shoot Per Round"
    let routeKey = `${playerCount}_${mode}`;
    if (gameRoutes[routeKey]) {
        startGameBtn.text("Best of Luck")
        startGameBtn.css("background-color", "green")
        window.location.href = gameRoutes[routeKey];
    } else {
        alert("Invalid game mode or player count.");
    }


});
