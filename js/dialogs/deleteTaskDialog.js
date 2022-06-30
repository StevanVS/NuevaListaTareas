const deleteTaskForm = document.querySelector('[data-delete-task-form]');

addEventsCloseDialog(deleteTaskDialog, deleteTaskForm);

deleteTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const task = tasks.find(task => task.id === selectedTaskId)
    tasks = tasks.filter(task => task.id !== selectedTaskId);
    deleteTaskDialog.close();
    toastNotificationError(`Tarea '${task.title}' Eliminada`)
    selectedTaskId = null;
    saveAndRender();
})
