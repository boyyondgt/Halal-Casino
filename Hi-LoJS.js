document.addEventListener('DOMContentLoaded', function () {
    const betButton = document.getElementById('bet-button');
    const higherButton = document.querySelector('.higher-button');
    const lowerButton = document.querySelector('.lower-button');
    const leftCardImage = document.getElementById('left-card');
    const rightCardImage = document.getElementById('right-card');
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const betInput = document.getElementById('bet-amount');
    const refreshDeckButton = document.getElementById('refresh-deck-button');

    let leftCardValue = null;
    let rightCardValue = null;
    let lastChangedCard = 'right'; // Track which card was last changed
    let currentBet = 0;
    const deckId = 'w4q4ub7yzaua'; // Replace with your actual deck ID

    betButton.addEventListener('click', function () {
        const betAmount = parseInt(betInput.value);
        if (validateBetAmount(betAmount)) {
            currentBet = betAmount;
            updateBalance(loadBalance() - betAmount);
            fetchCard('right');
        } else {
            showOverlay('Invalid bet amount!');
        }
    });

    higherButton.addEventListener('click', function () {
        fetchCard(lastChangedCard === 'right' ? 'left' : 'right', 'higher');
    });

    lowerButton.addEventListener('click', function () {
        fetchCard(lastChangedCard === 'right' ? 'left' : 'right', 'lower');
    });

    refreshDeckButton.addEventListener('click', function () {
        refreshDeck();
    });

    function fetchCard(position, choice) {
        const drawCardApi = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;

        fetch(drawCardApi)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const cardImageSrc = data.cards[0].image;
                    const cardValue = getCardValue(data.cards[0].value);

                    if (position === 'right') {
                        rightCardImage.src = cardImageSrc;
                        rightCardValue = cardValue;
                        lastChangedCard = 'right';
                    } else if (position === 'left') {
                        leftCardImage.src = cardImageSrc;
                        leftCardValue = cardValue;
                        lastChangedCard = 'left';
                    }

                    if (choice) {
                        checkResult(choice, position);
                    }
                } else {
                    console.error('Failed to draw card:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching card:', error);
            });
    }

    function getCardValue(value) {
        switch (value) {
            case 'ACE':
                return 1;
            case 'JACK':
                return 11;
            case 'QUEEN':
                return 12;
            case 'KING':
                return 13;
            default:
                return parseInt(value);
        }
    }

    function checkResult(choice, position) {
        let previousCardValue, currentCardValue;

        if (position === 'right') {
            previousCardValue = leftCardValue;
            currentCardValue = rightCardValue;
        } else { //used to see switch which card is being compared
            previousCardValue = rightCardValue;
            currentCardValue = leftCardValue;
        }

        if ((choice === 'higher' && currentCardValue > previousCardValue) ||
            (choice === 'lower' && currentCardValue < previousCardValue)) {
            showOverlay('Correct!');
            awardBet(currentBet);
        } else {
            showOverlay('Incorrect!');
            resetCards();
        }
    }

    function showOverlay(message) {
        overlayText.textContent = message;
        overlay.style.visibility = 'visible';
        setTimeout(() => {
            overlay.style.visibility = 'hidden';
        }, 2000);
    }

    function resetCards() {
        leftCardImage.src = 'hi-lo-back.png';
        rightCardImage.src = '';
        leftCardValue = null;
        rightCardValue = null;
        lastChangedCard = 'right'; // Reset to initial state
    }

    function validateBetAmount(amount) {
        const balance = loadBalance();
        return Number.isInteger(amount) && amount > 0 && amount <= balance;
    }

    function awardBet(amount) {
        const currentBalance = loadBalance();
        const newBalance = currentBalance + amount;
        updateBalance(newBalance);
    }

    function refreshDeck() {
        const shuffleDeckApi = `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`;

        fetch(shuffleDeckApi)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showOverlay('Deck reshuffled!');
                    resetCards();
                } else {
                    console.error('Failed to reshuffle deck:', data.error);
                }
            })
            .catch(error => {
                console.error('Error reshuffling deck:', error);
            });
    }

    // Call updateBalanceElement on page load
    updateBalanceElement();
    checkDailyBonus();
});

// Function to save balance to local storage
function saveBalance(balance) {
    localStorage.setItem('balance', balance);
}

// Function to load balance from local storage
function loadBalance() {
    return parseInt(localStorage.getItem('balance')) || 0;
}

// Function to update the balance element
function updateBalanceElement() {
    const balance = loadBalance();
    document.getElementById('balance').textContent = balance;
}

// Function to update the balance and save it to local storage
function updateBalance(newBalance) {
    saveBalance(newBalance);
    updateBalanceElement();
}

// Function to add 1000 to the balance and log the current day
function addDailyBonus() {
    const currentBalance = loadBalance();
    const newBalance = currentBalance + 1000;
    updateBalance(newBalance);

    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    localStorage.setItem('lastBonusDay', today);
}

// Function to check if a new day has started and add daily bonus if needed
function checkDailyBonus() {
    const lastBonusDay = localStorage.getItem('lastBonusDay');
    const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (lastBonusDay !== today) {
        addDailyBonus();
    }
}