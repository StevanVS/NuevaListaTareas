
newTaskBtn.addEventListener('click', e => {
    newTaskDateInput.value = '';
    if (selectedListId === 'today-list') {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        let month = today.getMonth();
        month++;
        month = month.toString().length === 1 ? `0${month}` : month; 

        newTaskDateInput.value = `${today.getFullYear()}-${month}-${today.getDate()}`;
    }

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
