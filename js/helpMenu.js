const helpContainer = document.querySelector('[data-help-container]');
const helpMenu = document.querySelector('[data-help-menu]');
const doc = document.querySelector('[data-doc]');


helpContainer.addEventListener('click', e => {
    helpMenu.classList.add('active');
    listsBlocker.classList.add('active');
})

doc.onclick = () => {
    window.location.href = './doc/doc.html';
}