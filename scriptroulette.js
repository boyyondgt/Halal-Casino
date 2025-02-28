document.addEventListener('DOMContentLoaded', function () {
    const rouletteWheel = document.querySelector('.roulette-wheel');
    const numButtons = 39; // 0 to 38
    const angleStep = 360 / numButtons;
    const radius = 216; // Adjust the radius as needed
    const innerRadius = 155; // Adjust the inner radius as needed
    let winningNumber = null;
    let betType = null;
    let betAmount = 0;

    // Add roulette buttons to the wheel
    for (let i = 0; i < numButtons; i++) {
        const button = document.createElement('button');
        button.classList.add('roulette-button');
        button.textContent = i;

        // Set the color based on the number
        if (i === 0) {
            button.style.backgroundColor = 'green';
        } else if (i % 2 === 0) {
            button.style.backgroundColor = 'red';
        } else {
            button.style.backgroundColor = 'black';
        }

        const angle = i * angleStep;
        const x = radius * Math.cos(angle * (Math.PI / 180));
        const y = radius * Math.sin(angle * (Math.PI / 180));

        button.style.position = 'absolute';
        button.style.left = `calc(50% + ${x}px)`;
        button.style.top = `calc(50% - ${y}px)`;
        button.style.transform = `translate(-50%, -50%) rotate(-${angle}deg)`;

        rouletteWheel.appendChild(button);
    }

    // Add inner rectangles to the wheel
    for (let i = 0; i < numButtons; i++) {
        const innerRect = document.createElement('div');
        innerRect.classList.add('inner-rectangle');

        const angle = i * angleStep;
        const x = innerRadius * Math.cos(angle * (Math.PI / 180));
        const y = innerRadius * Math.sin(angle * (Math.PI / 180));

        innerRect.style.position = 'absolute';
        innerRect.style.left = `calc(50% + ${x}px)`;
        innerRect.style.top = `calc(50% - ${y}px)`;
        innerRect.style.transform = `translate(-50%, -50%) rotate(-${angle}deg)`;

        rouletteWheel.appendChild(innerRect);
    }

    // Add event listeners to bet buttons
    document.getElementById('bet-red').addEventListener('click', () => placeBet('red'));
    document.getElementById('bet-black').addEventListener('click', () => placeBet('black'));
    document.getElementById('bet-green').addEventListener('click', () => placeBet('green'));
    document.getElementById('bet-number').addEventListener('click', () => {
        const number = prompt('Enter the number you want to bet on (0-38):');
        if (number !== null && !isNaN(number) && number >= 0 && number <= 38) {
            placeBet(number);
        } else {
            alert('Invalid number. Please enter a number between 0 and 38.');
        }
    });

    // Position the ball on the number 1 rectangle initially
    positionBall(1);

    function placeBet(type) {
        const betAmountElement = document.getElementById('bet-amount');
        if (!betAmountElement) {
            alert('Bet amount input not found.');
            return;
        }

        betAmount = parseInt(betAmountElement.value, 10);
        const balance = loadBalance();

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
            alert('Invalid bet amount. Please enter a valid number within your balance.');
            return;
        }

        updateBalance(balance - betAmount);
        betType = type;
        spinRoulette();
    }

    function spinRoulette() {
        const ball = document.querySelector('.roulette-ball');
        let currentNumber = 0;
        const slowDownStart = 39; // When to start slowing down
        let spinCount = 0;

        const winningIndex = Math.floor(Math.random() * numButtons);
        winningNumber = winningIndex;
        console.log('Winning number:', winningNumber);

        // Calculate total spins based on the winning number
        const remainingSpins = (winningNumber - currentNumber + numButtons) % numButtons;
        const totalSpins = slowDownStart + remainingSpins;

        const spinInterval = setInterval(() => {
            if (spinCount < totalSpins) {
                if (spinCount >= slowDownStart) {
                    // Slow down the spin
                    setTimeout(() => {
                        currentNumber = (currentNumber + 1) % numButtons;
                        positionBall(currentNumber);
                    }, (spinCount - slowDownStart) * 50);
                } else {
                    currentNumber = (currentNumber + 1) % numButtons;
                    positionBall(currentNumber);
                }
                spinCount++;
            } else {
                clearInterval(spinInterval);
                // Ensure the ball stops one position before the winning number
                setTimeout(() => {
                    positionBall((winningNumber + numButtons) % numButtons); // Adjust to stop one space before
                    // After a short delay, position the ball on the winning number
                    setTimeout(() => {
                        positionBall(winningNumber);
                        checkWin();
                    }, 500); // Adjust the delay as needed to ensure smooth stopping
                }, 500); // Adjust the delay as needed to ensure smooth stopping
            }
        }, 100);
    }

    function positionBall(number) {
        const angle = number * angleStep;
        const x = innerRadius * Math.cos(angle * (Math.PI / 180));
        const y = innerRadius * Math.sin(angle * (Math.PI / 180));

        const ball = document.querySelector('.roulette-ball');
        ball.style.left = `calc(50% + ${x}px)`;
        ball.style.top = `calc(50% - ${y}px)`;
        ball.style.transform = `translate(-50%, -50%)`;
    }

    function checkWin() {
        const balance = loadBalance();
        let multiplier = 0;

        if (betType === 'red' || betType === 'black') {
            if ((betType === 'red' && winningNumber % 2 === 0 && winningNumber !== 0) ||
                (betType === 'black' && winningNumber % 2 !== 0)) {
                multiplier = 2;
            }
        } else if (betType === 'green' && winningNumber === 0) {
            multiplier = 36;
        } else if (!isNaN(parseInt(betType, 10)) && parseInt(betType, 10) === winningNumber) {
            multiplier = 35;
        }

        if (multiplier > 0) {
            const winnings = betAmount * multiplier;
            updateBalance(balance + winnings);
            console.log(`You won! Your winnings: ${winnings}`);
            alert(`You won! Your winnings: ${winnings}`);
        } else {
            console.log('You lost!');
            alert('You lost!');
        }
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
    document.getElementById('balance').textContent = `Balance: ${balance}`;
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

// Call updateBalanceElement and checkDailyBonus on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceElement();
    checkDailyBonus();
});

// Call updateBalanceElement on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceElement();
});