const linksContainer = document.querySelector('[data-nav-links]');
let allLinks = Array.from(linksContainer.children);

const LOCAL_STORAGE_SELECTED_PAGE_KEY = 'todo.selectedPage';
let selectedPage = localStorage.getItem(LOCAL_STORAGE_SELECTED_PAGE_KEY);

allLinks.forEach(link => {
    link.addEventListener('click', e => {
        hideAllPages();

        showPage(link);
        
        selectedPage = link.getAttribute('link-target');
        localStorage.setItem(LOCAL_STORAGE_SELECTED_PAGE_KEY, selectedPage);
    });
});

function showPage(link) {
    link.classList.add('active');
    const pageTargetElement = document.querySelector(
        `[data-${link.getAttribute('link-target')}]`);
    pageTargetElement.style.display = 'flex';
    if (link.getAttribute('link-target') === 'calendar') {
            renderCalendar(tasks);
        }
}

function hideAllPages() {
    allLinks.forEach(link => {
        link.classList.remove('active');
        const pageTargetElement = document.querySelector(
            `[data-${link.getAttribute('link-target')}]`);
        pageTargetElement.style.display = 'none';
    });
}

if (selectedPage) {
    const selectedLink = document.querySelector(`[link-target="${selectedPage}"]`);
    showPage(selectedLink);
}