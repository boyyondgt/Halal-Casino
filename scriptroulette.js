document.addEventListener('DOMContentLoaded', function () {
    const rouletteWheel = document.querySelector('.roulette-wheel');
    const numButtons = 39; // 0 to 38
    const angleStep = 360 / numButtons;
    const radius = 216; // Adjust the radius as needed
    const innerRadius = 155; // Adjust the inner radius as needed
    let winningNumber = null;

    for (let i = 0; i < numButtons; i++) { //adds 1 to I every iteration
        const button = document.createElement('button');
        button.classList.add('roulette-button');
        button.textContent = i; // Button text. starts from 0

        // Set the color based on the number
        if (i === 0) {
            button.style.backgroundColor = 'green'; // sets 0 as green
        } else if (i % 2 === 0) {
            button.style.backgroundColor = 'red'; // sets even numbers as red
        } else {
            button.style.backgroundColor = 'black'; // sets odd numbers as black
        }

        const angle = i * angleStep;
        const x = radius * Math.cos(angle * (Math.PI / 180));
        const y = radius * Math.sin(angle * (Math.PI / 180));

        button.style.position = 'absolute';
        button.style.left = `calc(50% + ${x}px)`;
        button.style.top = `calc(50% - ${y}px)`;
        button.style.transform = `translate(-50%, -50%) rotate(-${angle}deg)`;

        button.addEventListener('click', () => spinRoulette(i));

        rouletteWheel.appendChild(button); // makes the buttons a part of the wheel
    }

    for (let i = 0; i < numButtons; i++) { //same as before
        const innerRect = document.createElement('div');
        innerRect.classList.add('inner-rectangle');

        const angle = i * angleStep;
        const x = innerRadius * Math.cos(angle * (Math.PI / 180));
        const y = innerRadius * Math.sin(angle * (Math.PI / 180));

        innerRect.style.position = 'absolute';
        innerRect.style.left = `calc(50% + ${x}px)`;
        innerRect.style.top = `calc(50% - ${y}px)`;
        innerRect.style.transform = `translate(-50%, -50%) rotate(-${angle}deg)`;

        rouletteWheel.appendChild(innerRect); // makes the inner rectangles a part of the wheel
    }

    const betButtons = document.querySelectorAll('.bet-button');
    betButtons.forEach(button => { //makes the roulette spin for every button press
        button.addEventListener('click', () => spinRoulette(button.textContent));
    });

    // Position the ball on the number 1 rectangle initially
    positionBall(1);

    function spinRoulette(bet) {
        const ball = document.querySelector('.roulette-ball');
        ball.style.animation = 'none';
        ball.offsetHeight; // Triggers reflow, which basicly means it recalculates the position of stuff
        ball.style.animation = 'roll 5s ease-out forwards';

        setTimeout(() => {
            const winningIndex = Math.floor(Math.random() * numButtons);
            winningNumber = winningIndex;
            console.log('Winning number:', winningNumber);
            // Additional logic to handle the winning number/color
            positionBall(winningNumber);
        }, 5000);
    }

    function positionBall(number) { //calculates the position and spins the ball while it is moving
        const angle = number * angleStep;
        const x = innerRadius * Math.cos(angle * (Math.PI / 180));
        const y = innerRadius * Math.sin(angle * (Math.PI / 180));

        const ball = document.querySelector('.roulette-ball');
        ball.style.left = `calc(50% + ${x}px)`;
        ball.style.top = `calc(50% - ${y}px)`;
        ball.style.transform = `translate(-50%, -50%)`;
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