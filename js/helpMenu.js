const helpContainer = document.querySelector('[data-help-container]');
const helpMenu = document.querySelector('[data-help-menu]');
const docBtn = document.querySelector('[data-doc-btn]');
const supportBtn = document.querySelector('[data-support-btn]');
const supportDialog = document.querySelector('[data-support-dialog]');
const closeBtn = document.querySelector('[data-close-support]');


helpContainer.addEventListener('click', e => {
    helpMenu.classList.add('active');
    listsBlocker.classList.add('active');
})

docBtn.onclick = () => {
    window.location.href = './doc/doc.html';
}

supportBtn.onclick = () => {
    helpMenu.classList.remove('active');
    addEventsCloseDialog(supportDialog);
    supportDialog.showModal();
}

closeBtn.onclick = () => {
    supportDialog.close();
}