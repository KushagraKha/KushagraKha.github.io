document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.main-text');

    container.addEventListener('mouseover', () => {
        container.style.backgroundColor = 'white';
        container.style.color = 'black';
        container.style.fontSize = '50px';
        container.style.transition = 'background-color 0.3s, color 0.3s';
    });

    container.addEventListener('mouseout', () => {
        container.style.backgroundColor = 'transparent';
        container.style.fontSize = '40px';
        container.style.color = 'white';
    });
});