const editTaskForm = document.querySelector('[data-edit-task-form]');
const editTaskTitleInput = document.querySelector('[data-edit-task-title-input]');
const editTaskDateInput = document.querySelector('[data-edit-task-date-input]');
const editTaskListInput = document.querySelector('[data-edit-task-list-input]');


function setTaskInputValues(task) {
    editTaskTitleInput.value = task.title;
    editTaskDateInput.value = task.start;
    editTaskListInput.value = task.listid;
}

addEventsCloseDialog(editTaskDialog, editTaskForm);

editTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const editedTask = createAndSetTaskValues(
        editTaskTitleInput,
        editTaskDateInput,
        editTaskListInput
    );

    if (!editedTask) {
        toastNotificationError('Es necesario escribir el nombre');
        return;
    }

    editedTask.complete = tasks.find(task => task.id === selectedTaskId).complete;
    tasks = tasks.filter(task => task.id !== selectedTaskId);
    tasks.push(editedTask);

    editTaskDialog.close();
    toastNotification(`Tarea '${editedTask.title}' Editada`)
    saveAndRender();
});