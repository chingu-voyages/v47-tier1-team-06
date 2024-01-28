let baseDate = new Date(); // Initialize with the current date

// ... rest of your functions (navigateWeek, generateCalendarDays, etc.) ...

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    generateCalendarDays(); // Generate the calendar days on page load
    updateCurrentMonthDisplay(); // Update the display to show the current month and year

    // Click event listener for the calendar icon
    document.querySelector('.calendar.bottomOption').addEventListener('click', function() {
        const datePicker = document.getElementById('datePicker');
        // Optional: You might want to toggle visibility or apply some style changes before clicking
        datePicker.style.display = 'block'; // Make it visible if it's initially hidden
        datePicker.click(); // Programmatically click the hidden date input
    });
});

// Function to handle date picking from the date input
function datePicked(input) {
    const selectedDate = new Date(input.value);
    baseDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    generateCalendarDays(); // Update the calendar days based on the picked date
    // Optional: Hide the date picker again if you want
    input.style.display = 'none';
}

// Function to update the current month display
function updateCurrentMonthDisplay() {
    const currentMonthYear = document.getElementById('currentMonthYear');
    currentMonthYear.textContent = baseDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
}

function createCalendarDayElement(date) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);

    dayDiv.innerHTML = `
        <p class="task-date">${dayOfMonth}${ordinalSuffix} ${dayOfWeek}</p>
        <ul class="task-list">
            <li class="task-item">
                <span class="task-name">Show</span>
            </li>
        </ul>
    `;
    return dayDiv;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.calendar.bottomOption').addEventListener('click', function() {
        const datePicker = document.getElementById('datePicker');
        datePicker.click();
    });
});
function datePicked(input) {
    const selectedDate = new Date(input.value);
    baseDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    generateCalendarDays();
}
function updateCurrentMonthDisplay() {
    const currentMonthYear = document.getElementById('currentMonthYear');
    currentMonthYear.textContent = baseDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
}


// popup addtask btn
    document.querySelector(".taskAdd").addEventListener("click", function() {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
       

        var newTask = document.createElement("div");
        newTask.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
          
        `;

        document.getElementById("task_list").appendChild(newTask);
        document.getElementById('popup').style.display = 'none';

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
    });
// popup delete btn
    document.querySelector(".delete_btn").addEventListener("click", function() {
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
    });

// updating current month and year on the main page
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const d = new Date();
    let mnth = month[d.getMonth()];
    let year = d.getFullYear();
    document.getElementById("currentMonthYear").innerHTML = mnth + " " + year;