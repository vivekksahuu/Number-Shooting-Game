// Store the previous button clicked to reset its color later
let previousNumberPlayerButton = null;
let previousModeButton = null


$('.player-number-button-container').on("click", "button", function () {

    // If there is a previous button clicked, reset its background color
    if (previousNumberPlayerButton) {
        previousNumberPlayerButton.css('background-color', ''); // Reset to default
    }
    // Set the background color of the clicked button to green
    $(this).css('background-color', 'green');

    // Store the current button as the previous one for the next click
    previousNumberPlayerButton = $(this);
});

$('.game-mode-container').on("click", "button", function () {
    // If there is a previous button clicked, reset its background color
    if (previousModeButton) {
        previousModeButton.css('background-color', ''); // Reset to default
    }
    // Set the background color of the clicked button to green
    $(this).css('background-color', 'green');

    // Store the current button as the previous one for the next click
    previousModeButton = $(this);
});
