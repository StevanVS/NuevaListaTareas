const newTaskBtn = document.querySelector('[data-new-task-btn]');
const newTaskDialog = document.querySelector('[data-new-task-dialog]');

newTaskBtn.addEventListener('click', e => {
    newTaskDialog.showModal();
});

newTaskDialog.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'dialog') {
        closeDialog();
    }
});

newTaskForm.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();
    if (elementTag === 'button') {
        closeDialog();
    }
});

newTaskStartInput.addEventListener('input', e => {
    newTaskEndInput.parentElement.style.display = 'block';
});

function closeDialog() {
    newTaskDialog.close();
    newTaskEndInput.parentElement.style.display = 'none';
}

newTaskEndInput.parentElement.style.display = 'none';


// newTaskDialog.showModal();
