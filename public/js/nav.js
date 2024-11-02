document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    // Remove all active classes initially
    const resetActiveStates = () => {
        navItems.forEach(nav => {
            const link = nav.querySelector('.nav-link');
            link.classList.remove('active');
            link.setAttribute('aria-current', 'false');
        });
    };

    // Set active state for current page
    const setCurrentPageActive = () => {
        const currentPath = window.location.pathname;
        resetActiveStates();
        
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    };

    // Initial setup
    setCurrentPageActive();

    // Handle click events
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const clickedLink = item.querySelector('.nav-link');
            if (!clickedLink.classList.contains('active')) {
                resetActiveStates();
                clickedLink.classList.add('active');
                clickedLink.setAttribute('aria-current', 'page');
            }
        });
    });

    // Handle navigation events
    window.addEventListener('popstate', setCurrentPageActive);
});
