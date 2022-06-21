const linksContainer = document.querySelector('[data-nav-links]');
let allLinks = Array.from(linksContainer.children);

allLinks.forEach(link => {
    link.addEventListener('click', e => {
        hideAllPages();
        link.classList.add('active');
        const pageTargetElement = document.querySelector(`.${link.getAttribute('link-target')}`);
        pageTargetElement.style.display = 'flex';
        if (link.getAttribute('link-target') === 'calendar') {
            calendar.render();
        }
    });
});

function hideAllPages() {
    allLinks.forEach(link => {
        link.classList.remove('active');
        const pageTargetElement = document.querySelector(`.${link.getAttribute('link-target')}`);
        pageTargetElement.style.display = 'none';
    });
}
