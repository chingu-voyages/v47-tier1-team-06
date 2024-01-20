document.addEventListener("DOMContentLoaded", function () {

    // var calendar1 = new Calendar(calendarEl, {
    //   timeZone: "PST",
    //   events: [
    //     {
    //       id: "a",
    //       title: "my event",
    //       start: "2018-09-01",
    //     },
    //   ],
    // });

    // var calendar2 = new Calendar(calendarEl, {
    //   events: [
    //     {
    //       // this object will be "parsed" into an Event Object
    //       title: "The Title", // a property!
    //       start: "2018-09-01", // a property!
    //       end: "2018-09-02", // a property! ** see important note below about 'end' **
    //     },
    //   ],
    // });

    var calendarEl = document.getElementById("calendar");
    var calendar0 = new FullCalendar.Calendar(calendarEl, {
       initialView: "dayGridWeek",
    //   events: [
    //     {
    //       // this object will be "parsed" into an Event Object
    //       title: "The Title", // a property!
    //       start: "2018-09-01", // a property!
    //       end: "2018-09-02", // a property! ** see important note below about 'end' **
    //     },
    //   ],
    });

    calendar0.changeView("listDay", {
      
    });

    console.log(calendar0);

    calendar0.render();
  });