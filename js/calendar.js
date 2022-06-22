const LOCAL_STORAGE_TASK_KEY = 'task.allTasks'
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [];

var calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth',
  height: 'auto',
  // aspectRatio: 2,
  // handleWindowResize: true,
  // contentHeight: 40,
  events: tasks
});

function saveEvents() {
  localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(calendar.getEvents()));
}

calendar.render();

