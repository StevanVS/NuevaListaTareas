const editListForm = document.querySelector('[data-edit-list-form]');
const editListTitleInput = document.querySelector('[data-edit-list-title-input]');


function setListInputValues(list) {
    editListTitleInput.value = list.name;
}

addEventsCloseDialog(editListDialog, editListForm);

editListForm.addEventListener('submit', e => {
    e.preventDefault();
    const editedList = createAndSetListValues(
        editListTitleInput
    );

    if (!editedList) {
        toastNotificationError('Es necesario escribir el nombre');
        return;
    }

    lists = lists.filter(list => list.id !== e.target.getAttribute('listId'));
    lists.push(editedList);

    editListDialog.close();
    toastNotification(`Lista '${editedList.name}' Editada`);
    saveAndRender();
});