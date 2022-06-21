const newTaskBtn = document.querySelector('[data-new-task-btn]');
const newTaskDialog = document.querySelector('[data-new-task-dialog]');

newTaskBtn.addEventListener('click', e => {
    newTaskDialog.showModal();
});

newTaskDialog.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'dialog') {
        newTaskDialog.close();
    }
});

newTaskForm.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();
    if (elementTag === 'button') {
        newTaskDialog.close();
    }
});

// newTaskDialog.showModal();
