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
const newTaskStartInput = document.querySelector('[data-new-task-start-input]');
const newTaskEndInput = document.querySelector('[data-new-task-end-input]');


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
        const selectedTask = getSelectedTask(e);
        selectedTask.complete = e.target.checked;

        if (calendar.getEventById(e.target.getAttribute('taskid'))) {
            calendar.getEventById(e.target.getAttribute('taskid')).setExtendedProp('complete', e.target.checked);
        }

        save();
        return;
    }
    if (elementTag === 'button' || elementTag === 'i') {
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

    console.log(newTaskStartInput.value);

    const taskName = newTaskTitleInput.value;
    const taskStart = newTaskStartInput.value;
    const taskEnd = newTaskEndInput.value;

    // VALIDAR SIN FECHA FINAL SI NO HAY FECHA DE INICIO
    if (taskName == null || taskName === '') return;

    const task = createTask(taskName, taskStart, taskEnd);

    newTaskTitleInput.value = null;
    newTaskStartInput.value = null;
    newTaskEndInput.value = null;

    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    calendar.addEvent(task);

    saveAndRender();
});


function createList(name) {
    return { id: 'list-' + Date.now().toString(), name: name, tasks: [] };
}

function createTask(name, start, end) {
    return {
        id: 'task-' + Date.now().toString(),
        title: name,
        start: start,
        end: end,
        complete: false
    };
}

function getSelectedTask(event) {
    const selectedList = lists.find(list => list.id === selectedListId);
    return selectedList.tasks.find(task => task.id === event.target.getAttribute('taskid'));
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
        tasksDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }


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

        const taskStartElement = taskElement.querySelector('[data-task-start]');
        if (task.start) {
            // taskStartElement.innerHTML = `<b>Fecha de Inicio: </b>
            taskStartElement.innerHTML = `<b>Inicio: </b>
                ${getFormattedDate(task.start)}`;
        } else {
            taskStartElement.style.display = 'none';
        }

        const taskEndElement = taskElement.querySelector('[data-task-end]');
        if (task.end) {
            // taskEndElement.innerHTML = `<b>Fecha Final: </b>
            taskEndElement.innerHTML = `<b>Final: </b>
            ${getFormattedDate(task.end)}`;
        } else {
            taskEndElement.style.display = 'none';
        }

        if (!task.start && !task.end) {
            taskStartElement.parentElement.remove();
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
