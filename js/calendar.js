function renderCalendar(tasks) {
  const documentStyle = getComputedStyle(document.documentElement);

  var calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    // aspectRatio: 2,
    handleWindowResize: true,
    // contentHeight: 40,
    locale: 'es',
    eventColor: documentStyle.getPropertyValue('--bg-primary-color'),
    eventTextColor: documentStyle.getPropertyValue('--text-primary-color'),

    events: tasks.filter(task => !task.complete)
  });
  calendar.render();
}
