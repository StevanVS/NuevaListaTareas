
  var calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    //   height: 'auto',
    // aspectRatio: 2,
    handleWindowResize: true,
    contentHeight: 40,
    
  });
  
  calendar.render();
