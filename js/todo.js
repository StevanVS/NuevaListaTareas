const listsContainer = document.querySelector('[data-lists]');
const listTemplate = document.querySelector('#list-template');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const tasksDisplayContainer = document.querySelector('[data-tasks-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.querySelector('#task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskTitleInput = document.querySelector('[data-new-task-title-input]');
const newTaskDateInput = document.querySelector('[data-new-task-date-input]');


const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


listsContainer.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();
    if (elementTag === 'li' || elementTag === 'span') {
        selectedListId = e.target.getAttribute('listId');
        saveAndRender();
        return;
    }
    if (elementTag === 'button' || elementTag === 'i') {
        lists = lists.filter(list => list.id !== e.target.getAttribute('listId'));
        if (selectedListId === e.target.getAttribute('listId')) {
            selectedListId = null;
        }
        saveAndRender();
        return;
    }
});

tasksContainer.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();
    if (elementTag === 'input') {

        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.getAttribute('taskid'));

        selectedTask.complete = e.target.checked;

        if (calendar.getEventById(e.target.getAttribute('taskid'))) {
            calendar.getEventById(e.target.getAttribute('taskid')).setExtendedProp('complete', e.target.checked);
        }

        saveAndRender();
        return;
    }
    if (elementTag === 'button' || elementTag === 'i') {

        // confirmDialog('Esta seguro de elimar esta tarea?');

        const selectedList = lists.find(list => list.id === selectedListId);
        selectedList.tasks = selectedList.tasks.filter(task => task.id !== e.target.getAttribute('taskid'));

        if (calendar.getEventById(e.target.getAttribute('taskid'))) {
            calendar.getEventById(e.target.getAttribute('taskid')).remove();
        }
        saveAndRender();
        return;
    }
});


newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    selectedListId = list.id;
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskTitleInput.value;
    const taskDate = newTaskDateInput.value;

    if (taskName == null || taskName === '') return;

    const task = createTask(taskName, taskDate);

    newTaskTitleInput.value = null;
    newTaskDateInput.value = null;

    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    calendar.addEvent(task);

    saveAndRender();
});


function createList(name) {
    return { id: 'list-' + Date.now().toString(), name: name, tasks: [] };
}

function createTask(name, date) {
    return {
        id: 'task-' + Date.now().toString(),
        title: name,
        start: date,
        complete: false
    };
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
    saveEvents();
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);

    if (selectedList == null) {
        tasksDisplayContainer.style.display = 'none';
    } else {
        sortTasks(selectedList);
        tasksDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function sortTasks(selectedList) {
    selectedList.tasks.sort((a, b) => a.complete - b.complete || new Date(a.start) - new Date(b.start));
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true).querySelector('li');
        taskElement.setAttribute('taskid', task.id);

        const taskElementChildrens = taskElement.querySelectorAll('*');
        taskElementChildrens.forEach(child => {
            child.setAttribute('taskid', task.id);
        });

        const checkboxElement = taskElement.querySelector('[data-task-checkbox]');
        checkboxElement.checked = task.complete;

        const taskTitleElement = taskElement.querySelector('[data-task-title]');
        taskTitleElement.innerText = task.title;

        const taskDateElement = taskElement.querySelector('[data-task-date]');
        if (task.start) {
            taskDateElement.innerText = getFormattedDate(task.start);
            if (isTaskOverdue(task.start)) {
                taskDateElement.style.color = '#d00';
            }
        } else {
            taskDateElement.parentElement.style.display = 'none';
        }

        tasksContainer.appendChild(taskElement);
    });
}

function getFormattedDate(date) {
    const taskDate = new Date(date + 'T00:00:00');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (taskDate.getTime() === today.getTime()) {
        return 'Hoy';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
        return 'Mañana';
    } else if (taskDate.getTime() === yesterday.getTime()) {
        return 'Ayer';
    }
    // weekday: 'long',
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return taskDate.toLocaleString('es-EC', options);
}

function isTaskOverdue(date) {
    const taskDate = new Date(date + 'T00:00:00');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (taskDate < today) return true;

    return false;
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.importNode(listTemplate.content, true).querySelector('li');
        listElement.setAttribute('listid', list.id);

        const listElementChildrens = listElement.querySelectorAll('*');
        listElementChildrens.forEach(child => {
            child.setAttribute('listid', list.id);
        })

        const listName = listElement.querySelector('span');
        listName.innerText = list.name;

        if (list.id === selectedListId) {
            listElement.classList.add('active');
        };

        listsContainer.appendChild(listElement);
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();
