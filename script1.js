// Add any interactive JavaScript functionalities here

document.addEventListener('DOMContentLoaded', function() {
    // Example: Add event listeners for navigation links
    const navLinks = document.querySelectorAll('.side-header nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            location.href = this.getAttribute('href');
        });
    });
    const navigateButton = document.getElementById('navigate-button');
    if (navigateButton) {
        navigateButton.addEventListener('click', function() {
            location.href = 'index (1).html';
        });
    }
});