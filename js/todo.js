const defaultListsContainer = document.querySelector('[data-default-lists]');
const listsContainer = document.querySelector('[data-lists]');
const listTemplate = document.querySelector('#list-template');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const tasksDisplayContainer = document.querySelector('[data-tasks-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.querySelector('#task-template');
const newTaskBtn = document.querySelector('[data-new-task-btn]');
const newTaskDialog = document.querySelector('[data-new-task-dialog]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskTitleInput = document.querySelector('[data-new-task-title-input]');
const newTaskDateInput = document.querySelector('[data-new-task-date-input]');

const LOCAL_STORAGE_TASK_KEY = 'todo.tasks';
const LOCAL_STORAGE_LIST_KEY = 'todo.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'todo.selectedListId';
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [];
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
let defaultLists = [];


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

        const selectedTask = tasks.find(task => task.id === e.target.getAttribute('taskid'));
        selectedTask.complete = e.target.checked;

        saveAndRender();
        return;
    }

    if (elementTag === 'button' || elementTag === 'i') {
        tasks = tasks.filter(task => task.id !== e.target.getAttribute('taskid'));

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
    console.log(taskDate);
    const task = createTask(
        taskName,
        taskDate,
        selectedListId.startsWith('list-') ? selectedListId : ''
    );

    newTaskTitleInput.value = null;
    newTaskDateInput.value = null;

    tasks.push(task);
    saveAndRender();
});

Array.from(defaultListsContainer.children).forEach(listElement => {
    listElement.addEventListener('click', e => {
        selectedListId = listElement.id;
        console.log(selectedListId);
        saveAndRender();
    });

    let list = createList(listElement.innerText);
    list.id = listElement.id;
    defaultLists.push(list);
});

function createList(name) {
    return { id: 'list-' + Date.now().toString(), name: name };
}

function createTask(name, date, listid) {
    return {
        id: 'task-' + Date.now().toString(),
        title: name,
        start: date,
        complete: false,
        listid: listid || 'inbox-list'
    };
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(tasks));
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = getSelectedList();

    if (selectedList == null) {
        tasksDisplayContainer.style.display = 'none';
    } else {
        sortTasks();
        tasksDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        clearElement(tasksContainer);
        const listTasks = getTasks();
        renderTasks(listTasks);
    }
}

function getTasks() {
    let listTasks;
    newTaskBtn.style.display = '';
    switch (selectedListId) {
        case 'all-tasks-list':
            listTasks = tasks;
            break;
        case 'today-list':
            const today = new Date(new Date().setHours(0, 0, 0, 0));
            listTasks = tasks.filter(task => new Date(
                task.start + 'T00:00:00').getTime() === today.getTime());
            break;
        case 'complete-tasks-list':
            newTaskBtn.style.display = 'none';
            listTasks = tasks.filter(task => task.complete === true);
            break;
        default:
            listTasks = tasks.filter(task => task.listid === selectedListId);
    }
    return listTasks;
}

function getSelectedList() {
    let selectedList;

    selectedList = defaultLists.find(list => list.id === selectedListId) ||
        lists.find(list => list.id === selectedListId);

    return selectedList;
}

function sortTasks() {
    tasks.sort((a, b) => a.complete - b.complete || new Date(a.start) - new Date(b.start));
}

function renderTasks(listTasks) {
    listTasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true).querySelector('li');
        taskElement.setAttribute('taskid', task.id);

        const taskElementChildrens = taskElement.querySelectorAll('*');
        taskElementChildrens.forEach(child => {
            child.setAttribute('taskid', task.id);
        });

        const checkboxElement = taskElement.querySelector('[data-task-checkbox]');
        checkboxElement.checked = task.complete;

        if (checkboxElement.checked) taskElement.classList.add('complete')
        else taskElement.classList.remove('complete');

        const taskTitleElement = taskElement.querySelector('[data-task-title]');
        taskTitleElement.innerText = task.title;

        const taskListElement = taskElement.querySelector('[data-task-list-name]');
        let list = lists.find(list => list.id === task.listid) ||
            defaultLists.find(list => list.id === task.listid);
        taskListElement.innerText = list.name;

        const taskDateElement = taskElement.querySelector('[data-task-date]');
        if (task.start) {
            taskDateElement.innerText = getFormattedDate(task.start);
            if (isTaskOverdue(task.start) && !checkboxElement.checked) {
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

    const today = new Date(new Date().setHours(0, 0, 0, 0));

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