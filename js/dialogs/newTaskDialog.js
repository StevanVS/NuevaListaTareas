const newTaskDialog = document.querySelector('[data-new-task-dialog]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskTitleInput = document.querySelector('[data-new-task-title-input]');
const newTaskDateInput = document.querySelector('[data-new-task-date-input]');
const newTaskListInput = document.querySelector('[data-new-task-list-input]');


newTaskBtn.addEventListener('click', e => {
    newTaskDateInput.value = '';
    if (selectedListId === 'today-list') {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        let month = today.getMonth();
        month++;
        month = month.toString().length === 1 ? `0${month}` : month;

        newTaskDateInput.value = `${today.getFullYear()}-${month}-${today.getDate()}`;
    }

    appendListOptions(newTaskListInput);
    
    newTaskDialog.showModal();
});

addEventsCloseDialog(newTaskDialog, newTaskForm);

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const task = createAndSetTaskValues(
        newTaskTitleInput,
        newTaskDateInput,
        newTaskListInput
    );
    tasks.push(task);
    toastNotification(`Nueva Tarea '${task.title}' Creada`);
    saveAndRender();
});