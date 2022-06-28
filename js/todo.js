const listsContainer = document.querySelector('[data-lists]');
const listTemplate = document.querySelector('#list-template');
const newListForm = document.querySelector('[data-new-list-form]');
const titleInput = document.querySelector('[data-new-list-input]');
const tasksDisplayContainer = document.querySelector('[data-tasks-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.querySelector('#task-template');
const newTaskBtn = document.querySelector('[data-new-task-btn]');
const editTaskDialog = document.querySelector('[data-edit-task-dialog]');
const editListDialog = document.querySelector('[data-edit-list-dialog]');
const deleteTaskDialog = document.querySelector('[data-delete-task-dialog]');
const deleteListDialog = document.querySelector('[data-delete-list-dialog]');
const optionsBtnTemplate = document.querySelector('#options-btn-template');
const tasksBlocker = document.querySelector('[data-blocker]');
const listsBlocker = document.querySelector('[data-lists-blocker]');

const LOCAL_STORAGE_TASK_KEY = 'todo.tasks';
const LOCAL_STORAGE_LIST_KEY = 'todo.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'todo.selectedListId';
const LOCAL_STORAGE_SELECTED_TASK_ID_KEY = 'todo.selectedTaskId';
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [];
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
let selectedTaskId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TASK_ID_KEY);


tasksBlocker.addEventListener('click', e => {
    const openMenus = [...document.querySelectorAll('[data-options-menu].active')];
    openMenus.forEach(menu => menu.classList.remove('active'));
    tasksBlocker.classList.remove('active');
});

listsBlocker.addEventListener('click', e => {
    const openMenus = [...document.querySelectorAll('[data-options-menu].active')];
    openMenus.forEach(menu => menu.classList.remove('active'));
    listsBlocker.classList.remove('active');
});

defaultListsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() !== 'lu') {
        selectedListId = e.target.getAttribute('listid');
        saveAndRender();
    }
});

listsContainer.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();

    if (e.target.hasAttribute('list') || elementTag === 'span') {
        selectedListId = e.target.getAttribute('listId');
        saveAndRender();
        return;
    }

    if (e.target.hasAttribute('data-options-btn')) {
        const listElement = document.querySelector(
            `li[listid=${e.target.getAttribute('listId')}]`
        );

        const menuElement = listElement.querySelector('[data-options-menu]');
        positionOptionMenu(
            listElement.querySelector('[data-options-btn-container]'),
            menuElement
        );

        menuElement.classList.add('active');
        listsBlocker.classList.add('active');

        menuElement.addEventListener('click', e => {
            if (e.target.hasAttribute('data-edit-btn')) {
                editListDialog.querySelector('form').setAttribute(
                    'listid', e.target.getAttribute('listId')
                );
                editListDialog.showModal();
                saveAndRender();
            }
            if (e.target.hasAttribute('data-delete-btn')) {
                deleteListDialog.querySelector('form').setAttribute(
                    'listid', e.target.getAttribute('listId')
                );
                deleteListDialog.showModal();
                saveAndRender();
            }
            listsBlocker.classList.remove('active');
        });
        return;
    }

});

tasksContainer.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();

    if (elementTag !== 'ul') selectedTaskId = e.target.getAttribute('taskid');

    if (elementTag === 'input') {
        const selectedTask = tasks.find(task => task.id === selectedTaskId);
        selectedTask.complete = e.target.checked;
        saveAndRender();
    }

    if (e.target.hasAttribute('data-options-btn')) {
        const taskElement = document.querySelector(
            `li[taskid=${selectedTaskId}]`
        );
        const menuElement = taskElement.querySelector('[data-options-menu]');
        positionOptionMenu(
            taskElement.querySelector('[data-options-btn-container]'),
            menuElement
        );
        menuElement.classList.add('active');
        tasksBlocker.classList.add('active');

        menuElement.addEventListener('click', e => {
            if (e.target.hasAttribute('data-edit-btn')) {
                appendListOptions(editTaskListInput);
                setTaskInputValues(tasks.find(task => task.id === selectedTaskId));
                editTaskDialog.showModal();
                saveAndRender();
            }
            if (e.target.hasAttribute('data-delete-btn')) {
                deleteTaskDialog.showModal();
                saveAndRender();
            }
            tasksBlocker.classList.remove('active');
        });
        return;
    }
});

newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const list = createAndSetListValues(titleInput);
    lists.push(list);
    saveAndRender();
});

function positionOptionMenu(relativeEl, menuEl) {
    const vh = window.innerHeight;
    const y = window.scrollY + relativeEl.getBoundingClientRect().top;

    if (y > vh * (3 / 4)) {
        menuEl.classList.add('up');
        menuEl.classList.remove('down');
    }
    else {
        menuEl.classList.add('down');
        menuEl.classList.remove('up');
    }
}

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
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TASK_ID_KEY, selectedTaskId);
}

function render() {
    clearElement(defaultListsContainer);
    renderDefaultLists();

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
        const listTasks = filterTasks();
        renderTasks(listTasks);
    }
}

function filterTasks() {
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

        taskElement.appendChild(getOptionsBtn());

        const taskElementChildrens = taskElement.querySelectorAll('*');
        taskElementChildrens.forEach(child => {
            child.setAttribute('taskid', task.id);
        });

        const checkboxElement = taskElement.querySelector('[data-task-checkbox]');
        checkboxElement.checked = task.complete;

        if (checkboxElement.checked) taskElement.classList.add('complete');

        const taskTitleElement = taskElement.querySelector('[data-task-title]');
        taskTitleElement.innerText = task.title;

        const taskListElement = taskElement.querySelector('[data-task-list-name]');
        let list = lists.find(list => list.id === task.listid) ||
            defaultLists.find(list => list.id === task.listid);
        if (list) taskListElement.innerText = list.name;

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
        listElement.setAttribute('list', '');

        listElement.appendChild(getOptionsBtn());

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

function getOptionsBtn() {
    return document.importNode(optionsBtnTemplate.content, true).querySelector('div');
}

function appendListOptions(inputSelectEl) {
    clearElement(inputSelectEl);
    [defaultLists[0], ...lists].forEach(list => {
        const listOptionElement = document.createElement('option');
        listOptionElement.value = list.id;
        listOptionElement.innerText = list.name;

        if (list.id === selectedListId) {
            listOptionElement.setAttribute('selected', '');
        }

        inputSelectEl.appendChild(listOptionElement);
    });
}

function addEventsCloseDialog(dialogEl, formEl) {
    dialogEl.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            dialogEl.close();
        }
    });

    formEl.addEventListener('click', e => {
        const elementTag = e.target.tagName.toLowerCase();
        if (elementTag === 'button') dialogEl.close();

    });
}

function createAndSetTaskValues(titleInput, dateInput, listInput) {
    const taskName = titleInput.value;
    const taskDate = dateInput.value;
    const taskList = listInput.value;

    if (taskName == null || taskName === '') return;
    const task = createTask(
        taskName,
        taskDate,
        taskList
    );

    titleInput.value = null;
    dateInput.value = null;

    return task;
}

function createAndSetListValues(titleInput) {
    const listName = titleInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    selectedListId = list.id;
    titleInput.value = null;
    return list;
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();