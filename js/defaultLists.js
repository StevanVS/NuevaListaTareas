const defaultListsContainer = document.querySelector('[data-default-lists]');
const defaultListTemplate = document.querySelector('#default-list-template');

const defaultLists = [{
    id: 'inbox-list',
    name: 'Bandeja de Entrada',
    icon: 'fa-solid fa-inbox'
}, {
    id: 'all-tasks-list',
    name: 'Todas',
    icon: 'fa-solid fa-layer-group'
}, {
    id: 'today-list',
    name: 'Para Hoy',
    icon: 'fa-solid fa-calendar'
}, {
    id: 'complete-tasks-list',
    name: 'Completadas',
    icon: 'fa-solid fa-square-check'
}];


function renderDefaultLists() {
    defaultLists.forEach(list => {
        const listElement = document.importNode(defaultListTemplate.content, true).querySelector('li');
        listElement.id = list.id;
        listElement.setAttribute('listid', list.id);

        const listElementChildrens = listElement.querySelectorAll('*');
        listElementChildrens.forEach(child => {
            child.setAttribute('listid', list.id);
        })

        const listNameElement = listElement.querySelector('span');
        listNameElement.innerText = list.name;

        const listIconElement = listElement.querySelector('i');
        listIconElement.classList.add(list.icon.split(' ')[0]);
        listIconElement.classList.add(list.icon.split(' ')[1]);

        if (list.id === selectedListId) {
            listElement.classList.add('active');
        };

        // listElement.addEventListener('click', e => console.log('a'));

        defaultListsContainer.appendChild(listElement);
    });
}