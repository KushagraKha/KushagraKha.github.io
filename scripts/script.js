document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.main-text');

    elements.forEach(container => {
        container.addEventListener('mouseover', () => {
            container.style.backgroundColor = 'white';
            container.style.color = 'black';
            container.style.fontSize = '40px';
            container.style.transition = 'color 0.3s, font-size 0.3s';
        });

        container.addEventListener('mouseout', () => {
            container.style.backgroundColor = 'transparent';
            container.style.fontSize = '25px';
            container.style.color = 'white';
        });
    });
});
