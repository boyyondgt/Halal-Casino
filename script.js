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
    return localStorage.getItem('balance') || 0;
  }
  
  // Function to update the balance element
  function updateBalanceElement() {
    const balance = loadBalance();
    document.getElementById('balance').textContent = balance;
  }