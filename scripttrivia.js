document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch trivia question based on selected category
    function fetchTriviaQuestion(category) {
        const categoryMap = {
            general: 9,
            books: 10,
            film: 11,
            music: 12,
            theatre: 13,
            television: 14,
            videogames: 15,
            boardgames: 16,
            nature: 17,
            computers: 18,
            math: 19,
            myths: 20,
            sports: 21,
            geography: 22,
            history: 23,
            politics: 24,
            art: 25,
            celebrities: 26,
            animals: 27,
            vehicles: 28,
            comics: 29,
            gadgets: 30,
            anime: 31,
            cartoons: 32
        };

        const categoryId = categoryMap[category];
        const apiUrl = `https://opentdb.com/api.php?amount=1&category=${categoryId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const questionData = data.results[0];
                displayTriviaQuestion(questionData);
            })
            .catch(error => console.error('Error fetching trivia question:', error));
    }

    // Function to display trivia question and answers
    function displayTriviaQuestion(questionData) {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        const questionText = document.createElement('p');
        questionText.innerHTML = questionData.question; // Use innerHTML to decode HTML entities
        questionContainer.appendChild(questionText);

        const answers = [...questionData.incorrect_answers, questionData.correct_answer];
        shuffleArray(answers);

        answers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.textContent = answer;
            answerButton.classList.add('answer-button');
            answerButton.addEventListener('click', () => {
                checkAnswer(answer, questionData.correct_answer);
                questionContainer.remove(); // Remove the question and answers
            });
            questionContainer.appendChild(answerButton);
        });

        const triviaControls = document.querySelector('.trivia-controls');
        triviaControls.insertAdjacentElement('afterend', questionContainer);
    }

    // Function to shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to check if the selected answer is correct
    function checkAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer === correctAnswer) {
            alert('Correct!');
            const currentBalance = loadBalance();
            const newBalance = currentBalance + 5;
            updateBalance(newBalance);
        } else {
            alert('Incorrect!');
        }
    }

    // Event listener for the "Generate Text" button
    document.getElementById('generate-text').addEventListener('click', () => {
        const selectedCategory = document.getElementById('trivia-category').value;
        fetchTriviaQuestion(selectedCategory);
    });

    // BELOW ARE FUNCTIONS PURELY RELATED TO LOADING AND UPDATING BALANCE. THEY ARE THE SAME ON EVERY PAGE

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

    // Call updateBalanceElement and checkDailyBonus on page load
    updateBalanceElement();
    checkDailyBonus();
});