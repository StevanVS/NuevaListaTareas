hotkeys('alt+t', (e, h) => {
    openNewTaskDialog();
})

hotkeys('alt+l', (e, h) => {
    newListNameInput.focus();
})

hotkeys('shift+alt+l', (e, h) => {
    openDeleteListDialog(selectedListId);
})