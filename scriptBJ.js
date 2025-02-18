// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6 (shuffle deck)
//https://deckofcardsapi.com/api/deck/is3y2ru9tdp6/draw/?count=2 (draw card)
//https://deckofcardsapi.com/api/deck/is3y2ru9tdp6/shuffle/ (reshuffle an existing deck)
//https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S (adding card to pile)
// Define the API URL
const ReshuffleApi ='https://deckofcardsapi.com/api/deck/is3y2ru9tdp6/shuffle/';
const DrawCardApi = 'https://deckofcardsapi.com/api/deck/is3y2ru9tdp6/draw/?count=4';
const DrawOneCardApi = 'https://deckofcardsapi.com/api/deck/is3y2ru9tdp6/draw/?count=1';
// Function to reshuffle the deck and log the data
function reshuffleDeck() {
  fetch(ReshuffleApi)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}
// Function to calculate the value of a card
function getCardValue(card) {
  if (card.value === 'KING') {
    return 13;
  } else if (card.value === 'QUEEN') {
    return 12;
  } else if (card.value === 'JACK') {
    return 11;
  } else if (card.value === 'ACE') {
    return 1; // or 11, depending on the game rules
  } else {
    return parseInt(card.value);
  }
}

// Function to draw cards and log the data
function drawCards() {
  fetch(DrawCardApi)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('First draw:', data);
      // Update dealer cards
      document.getElementById('dealer-card-2').src = data.cards[0].image;
      document.getElementById('dealer-card-3').src = data.cards[1].image;
      // Update player cards
      document.getElementById('player-card-2').src = data.cards[2].image;
      document.getElementById('player-card-3').src = data.cards[3].image;

      // Calculate and update card values
      const dealerValue = getCardValue(data.cards[0]) + getCardValue(data.cards[1]);
      const playerValue = getCardValue(data.cards[2]) + getCardValue(data.cards[3]);
      document.getElementById('dealer-card-value').textContent = dealerValue;
      document.getElementById('player-card-value').textContent = playerValue;

      // Check if dealer value is exactly 21
      if (dealerValue === 21) {
        // Player loses
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('busted-message').textContent = 'Dealer has 21, you lose!';
        document.getElementById('busted-message').style.display = 'block';
        setTimeout(resetGame, 5000);
        return;
      }

      // Check if player value is exactly 21
      if (playerValue === 21) {
        // Player wins
        document.getElementById('overlay').style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
        document.getElementById('busted-message').textContent = '21, you win!';
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('busted-message').style.display = 'block';
        playerWins()
        setTimeout(resetGame, 5000);
        return;
      }

      // Check if dealer value is over 21
      if (dealerValue > 21) {
        // Player wins
        document.getElementById('overlay').style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
        document.getElementById('busted-message').textContent = 'Dealer Busted, you win!';
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('busted-message').style.display = 'block';
        playerWins()
        setTimeout(resetGame, 5000);
        return;
      }

      // Check if player value is over 21
      if (playerValue > 21) {
        // Player loses
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('busted-message').textContent = 'Busted. Over 21';
        document.getElementById('busted-message').style.display = 'block';
        setTimeout(resetGame, 5000);
        return;
      }

      // Enable hit and stand buttons
      document.getElementById('hit-button').disabled = false;
      document.getElementById('stand-button').disabled = false;
      document.getElementById('hit-button').classList.remove('disabled');
      document.getElementById('stand-button').classList.remove('disabled');

      // Disable play button if player has 3 or more cards
      const playerCards = [
        document.getElementById('player-card-1'),
        document.getElementById('player-card-2'),
        document.getElementById('player-card-3'),
        document.getElementById('player-card-4'),
        document.getElementById('player-card-5')
      ];
      const playerCardCount = playerCards.filter(card => !card.src.includes('card-outline.png')).length;
      if (playerCardCount >= 3) {
        document.getElementById('play-button').disabled = true;
        document.getElementById('play-button').classList.add('disabled');
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

// Function to handle the hit action
function hit() {
  // Disable play button upon hitting for the first time
  document.getElementById('play-button').disabled = true;
  document.getElementById('play-button').classList.add('disabled');

  fetch(DrawOneCardApi)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Hit draw:', data);
      const cardImage = data.cards[0].image;
      const cardValue = getCardValue(data.cards[0]);

      // Update player cards in order: 1, 4, 5
      const playerCards = [
        document.getElementById('player-card-1'),
        document.getElementById('player-card-4'),
        document.getElementById('player-card-5')
      ];

      for (let i = 0; i < playerCards.length; i++) {
        if (playerCards[i].src.includes('card-outline.png')) {
          playerCards[i].src = cardImage;
          const currentValue = parseInt(document.getElementById('player-card-value').textContent);
          const newValue = currentValue + cardValue;
          document.getElementById('player-card-value').textContent = newValue;

          if (newValue > 21) {
            // Disable buttons and show busted message
            document.getElementById('hit-button').disabled = true;
            document.getElementById('stand-button').disabled = true;
            document.getElementById('hit-button').classList.add('disabled');
            document.getElementById('stand-button').classList.add('disabled');
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('busted-message').style.display = 'block';
            setTimeout(resetGame, 5000);
          } else if (newValue === 21) {
            // Disable buttons and show win message
            document.getElementById('hit-button').disabled = true;
            document.getElementById('stand-button').disabled = true;
            document.getElementById('hit-button').classList.add('disabled');
            document.getElementById('stand-button').classList.add('disabled');
            document.getElementById('overlay').style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
            document.getElementById('busted-message').textContent = '21, you win!';
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('busted-message').style.display = 'block';
            playerWins()
            setTimeout(resetGame, 5000);
          } else if (document.getElementById('player-card-5').src !== 'card-outline.png') {
            // Check if player card 5 has been drawn and player has exactly 5 cards
            const playerCards = [
              document.getElementById('player-card-1'),
              document.getElementById('player-card-2'),
              document.getElementById('player-card-3'),
              document.getElementById('player-card-4'),
              document.getElementById('player-card-5')
            ];
            const playerCardCount = playerCards.filter(card => !card.src.includes('card-outline.png')).length;
            if (playerCardCount === 5) {
              // Disable buttons and show 5 Card Charlie message
              document.getElementById('hit-button').disabled = true;
              document.getElementById('stand-button').disabled = true;
              document.getElementById('hit-button').classList.add('disabled');
              document.getElementById('stand-button').classList.add('disabled');
              document.getElementById('overlay').style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
              document.getElementById('busted-message').textContent = '5 Card Charlie!';
              document.getElementById('overlay').style.display = 'block';
              document.getElementById('busted-message').style.display = 'block';
              playerWins()
              setTimeout(resetGame, 5000);
            }
          }
          break;
        }
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}


// Function to handle the stand action
function stand() {
  // Disable hit and stand buttons
  document.getElementById('hit-button').disabled = true;
  document.getElementById('stand-button').disabled = true;
  document.getElementById('hit-button').classList.add('disabled');
  document.getElementById('stand-button').classList.add('disabled');

  let dealerValue = parseInt(document.getElementById('dealer-card-value').textContent);

  function drawDealerCard() {
    return fetch(DrawOneCardApi)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Dealer draw:', data);
        const cardImage = data.cards[0].image;
        const cardValue = getCardValue(data.cards[0]);

        // Update dealer cards in order: 4, 5
        const dealerCards = [
          document.getElementById('dealer-card-1'),
          document.getElementById('dealer-card-4'),
          document.getElementById('dealer-card-5')
        ];

        for (let i = 0; i < dealerCards.length; i++) {
          if (dealerCards[i].src.includes('card-outline.png')) {
            dealerCards[i].src = cardImage;
            dealerValue += cardValue;
            document.getElementById('dealer-card-value').textContent = dealerValue;
            break;
          }
        }

        if (dealerValue < 17) {
          return drawDealerCard();
        } else {
          return dealerValue;
        }
      });
  }

  drawDealerCard().then(dealerValue => {
    const playerValue = parseInt(document.getElementById('player-card-value').textContent);

    if (dealerValue > 21) {
      // Player wins
      document.getElementById('overlay').style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
      document.getElementById('busted-message').textContent = 'Dealer Busted, you win!';
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('busted-message').style.display = 'block';
      playerWins()
    } else if (dealerValue >= playerValue) {
      // Dealer wins
      document.getElementById('busted-message').textContent = 'lower than Dealer, you lose!';
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('busted-message').style.display = 'block';
    } else {
      // Player wins
      document.getElementById('overlay').style.backgroundColor = 'rgba(0, 255, 0, 0.7)';
      document.getElementById('busted-message').textContent = 'Higher than Dealer, you win!';
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('busted-message').style.display = 'block';
      playerWins()
    }
    setTimeout(resetGame, 5000);
  });
}

// Function to reset the game
function resetGame() {
  // Reset player and dealer cards
  const cardOutlines = document.querySelectorAll('.dealer-card-outline, .player-card-outline');
  cardOutlines.forEach(card => {
    card.src = 'card-outline.png';
  });

  // Reset card values
  document.getElementById('dealer-card-value').textContent = '0';
  document.getElementById('player-card-value').textContent = '0';

  // Hide overlay and messages
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('busted-message').style.display = 'none';
  document.getElementById('overlay').style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  document.getElementById('busted-message').textContent = 'Busted. Over 21';

  // Disable hit and stand buttons
  document.getElementById('hit-button').disabled = true;
  document.getElementById('stand-button').disabled = true;
  document.getElementById('hit-button').classList.add('disabled');
  document.getElementById('stand-button').classList.add('disabled');

  // Enable play button
  document.getElementById('play-button').disabled = false;
  document.getElementById('play-button').classList.remove('disabled');
  // Update balance element
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


// Function to award double the bet amount to the player
function awardDoubleBet(betAmount) {
  const currentBalance = loadBalance();
  const newBalance = currentBalance + (betAmount * 2);
  updateBalance(newBalance);
}


// Function to increment the balance by 1
function incrementBalance() {
  const currentBalance = loadBalance();
  const newBalance = currentBalance + 1;
  updateBalance(newBalance);
}

// Call updateBalanceElement and checkDailyBonus on page load
document.addEventListener('DOMContentLoaded', () => {
  updateBalanceElement();
  checkDailyBonus();
});

// Call updateBalanceElement on page load
document.addEventListener('DOMContentLoaded', () => {
  updateBalanceElement();
});

// Add event listeners for the buttons
document.addEventListener('DOMContentLoaded', () => {
  const shuffleButton = document.getElementById('blackjack-shuffle');
  if (shuffleButton) {
    shuffleButton.addEventListener('click', reshuffleDeck);
  }

  const playButton = document.getElementById('play-button');
  if (playButton) {
    playButton.addEventListener('click', () => {
      const betAmount = parseInt(document.getElementById('bet-amount').value);
      if (isNaN(betAmount) || betAmount <= 0) {
        alert('You can only bet a positive number, silly!');
        return;
      }
      let balance = loadBalance();
      if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
      }
      balance -= betAmount;
      updateBalance(balance);

      drawCards();
      // Enable hit and stand buttons
      document.getElementById('hit-button').disabled = false;
      document.getElementById('stand-button').disabled = false;
      document.getElementById('hit-button').classList.remove('disabled');
      document.getElementById('stand-button').classList.remove('disabled');
    });
  }

  const hitButton = document.getElementById('hit-button');
  if (hitButton) {
    hitButton.addEventListener('click', hit);
  }

  const standButton = document.getElementById('stand-button');
  if (standButton) {
    standButton.addEventListener('click', stand);
  }

  // Disable hit and stand buttons initially
  document.getElementById('hit-button').disabled = true;
  document.getElementById('stand-button').disabled = true;
  document.getElementById('hit-button').classList.add('disabled');
  document.getElementById('stand-button').classList.add('disabled');
  // Add event listener for the increment balance button
  const incrementBalanceButton = document.getElementById('increment-balance-button');
  if (incrementBalanceButton) {
    incrementBalanceButton.addEventListener('click', incrementBalance);
  }
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

function playerWins() {
  const betAmount = parseInt(document.getElementById('bet-amount').value);
  awardDoubleBet(betAmount);
}









