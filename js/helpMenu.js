const helpContainer = document.querySelector('[data-help-container]');
const helpMenu = document.querySelector('[data-help-menu]');


helpContainer.addEventListener('click', e => {
    helpMenu.classList.add('active');
    listsBlocker.classList.add('active');
})

// Array.from(helpMenu.children).forEach(item => {
//     item.addEventListener('click', e => {
//     })
// });

// helpMenu.addEventListener('click', e => {
//     closeDropDownMenus(listsBlocker)
//     saveAndRender();
// })