
document.addEventListener('DOMContentLoaded', function () {
    const rouletteWheel = document.querySelector('.roulette-wheel');
    const numButtons = 38;
    const angleStep = 360 / numButtons;
    const radius = 200; // Adjust the radius as needed

    for (let i = 0; i < numButtons; i++) {
        const button = document.createElement('button');
        button.classList.add('roulette-button');
        button.textContent = i + 1; // Button text can be adjusted as needed

        const angle = i * angleStep;
        const x = radius * Math.cos(angle * (Math.PI / 180));
        const y = radius * Math.sin(angle * (Math.PI / 180));

        button.style.position = 'absolute';
        button.style.left = `calc(50% + ${x}px)`;
        button.style.top = `calc(50% - ${y}px)`;
        button.style.transform = `translate(-50%, -50%) rotate(-${angle}deg)`;

        rouletteWheel.appendChild(button);
    }
});