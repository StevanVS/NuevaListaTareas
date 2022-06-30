
function toastNotification(text, color) {
    Toastify({
        text: text,
        duration: 2000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        style: {
            fontSize: "1.2rem",
            background: color || "var(--bg-primary-color)",
            transition: "var(--transition)"
        }
    }).showToast();
}

function toastNotificationError(text) {
    Toastify({
        text: text,
        duration: 2000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        style: {
            fontSize: "1.2rem",
            background: '#aa001d',
            transition: "var(--transition)"
        }
    }).showToast();
}