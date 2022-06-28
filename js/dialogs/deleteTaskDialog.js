const deleteTaskForm = document.querySelector('[data-delete-task-form]');

addEventsCloseDialog(deleteTaskDialog, deleteTaskForm);

deleteTaskForm.addEventListener('submit', e => {
    e.preventDefault();

    tasks = tasks.filter(task => task.id !== selectedTaskId);
    selectedTaskId = null;
    saveAndRender();
})
