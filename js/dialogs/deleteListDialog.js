const deleteListForm = document.querySelector('[data-delete-list-form]');

addEventsCloseDialog(deleteListDialog, deleteListForm);

deleteListForm.addEventListener('submit', e => {
    e.preventDefault();
    tasks = tasks.filter(task => task.listid !== e.target.getAttribute('listId'));
    lists = lists.filter(list => list.id !== e.target.getAttribute('listId'));
    if (selectedListId === e.target.getAttribute('listId')) {
        selectedListId = null;
    }
    saveAndRender();
});