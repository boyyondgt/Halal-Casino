// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6 (shuffle deck)
//https://deckofcardsapi.com/api/deck/is3y2ru9tdp6/draw/?count=2 (draw card)
//https://deckofcardsapi.com/api/deck/m0e67myvskeh/shuffle/ (reshuffle an existing deck)
//https://deckofcardsapi.com/api/deck/<<deck_id>>/pile/<<pile_name>>/add/?cards=AS,2S (adding card to pile)
// Define the API URL m0e67myvskeh

// back of card image https://deckofcardsapi.com/static/img/back.png
const ReshuffleApi ='https://deckofcardsapi.com/api/deck/m0e67myvskeh/shuffle/';
const DrawOneCardApi = 'https://deckofcardsapi.com/api/deck/m0e67myvskeh/draw/?count=1';


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


