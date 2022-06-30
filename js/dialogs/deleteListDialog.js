const deleteListForm = document.querySelector('[data-delete-list-form]');

addEventsCloseDialog(deleteListDialog, deleteListForm);

deleteListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listTarget = lists.find(list => list.id === e.target.getAttribute('listId'));
    tasks = tasks.filter(task => task.listid !== listTarget.id);
    lists = lists.filter(list => list.id !== listTarget.id);
    if (selectedListId === e.target.getAttribute('listId')) {
        selectedListId = 'inbox-list';
    }
    toastNotification(`Lista '${listTarget.name}' Eliminada`, '#aa001d')
    saveAndRender();
});