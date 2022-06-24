function errorToast(message) {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        // confirmButtonText: 'Cool'
    })
}

function confirmDialog(message) {
    Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}