import {allTasks, task} from "./taskLogic.js"; /// import
 
let taskContainer = new allTasks(); // container for all tasks
taskContainer.initialize();



let baseDate = new Date(); // Initialize with the current date

window.onbeforeunload = function(event) {
    taskContainer.save();
}

// ... rest of your functions (navigateWeek, generateCalendarDays, etc.) ...

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    
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


// popup save btn
    document.querySelector(".save").addEventListener("click", function() {
        // get user input
        let title = document.getElementById("title").value;
        let description = document.getElementById("description").value;
        let dates = document.getElementById("datePicker").value;
        let startTime = document.getElementById("appt").value;
        let endTime = document.getElementById("appt_1").value;

        // turn dates into seperate integers and convert time into military time
        let year = parseInt(dates.slice(0,4));
        let month = parseInt(dates.slice(5, 7));
        let day = parseInt(dates.slice(8));
        let startmilitaryTime = parseInt(startTime.slice(0,2) + startTime.slice(3));
        let endMilitaryTime = parseInt(endTime.slice(0,2) + endTime.slice(3));

        // add task
        taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);
        
        // clear task list shown since the task list has changed
        document.getElementById("allTasks").innerHTML = '';

        // TO BE REMOVED AND/OR CHANGED-----------------------------------------------------------------
        // The current code currently does not have the means to get what day the user wants to see
        // so this program just displays the list of tasks on the same day as the task the user just added 
        let tasksOnAGivenDay = taskContainer.getTasks(year, month, day);

        document.getElementById("task_list").textContent = `Tasks for ${dates}`;
        
        for (let aTask of tasksOnAGivenDay) {
            let newTask = document.createElement("div");
            newTask.classList.add("task"); 
            newTask.innerHTML = `
                <h1>${aTask.title}</h1>
                <p>${aTask.description}</p>
                <p>${aTask.getStartTime()} - ${aTask.getEndTime()}</p>
            `;
            let button = document.createElement("button");
            button.classList.add("delete-button");
            button.textContent = "Delete";
            
            // Append button to task div
            newTask.appendChild(button);

            document.getElementById("allTasks").appendChild(newTask);
          

        }



        // ------------------------------------------------------------------------------------------------

        document.getElementById('popup').style.display = 'none';

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("datePicker").value = "";
        document.getElementById("appt").value = "";
        document.getElementById("appt_1").value = "";
        
    });

// popup cancel btn
    document.querySelector(".delete_btn").addEventListener("click", function() {
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("datePicker").value = "";
        document.getElementById("appt").value = "";
        document.getElementById("appt_1").value = "";
        document.getElementById('popup').style.display = 'none';
    });

// updating current month and year on the main page
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const d = new Date();
    let mnth = month[d.getMonth()];
    let year = d.getFullYear();
    document.getElementById("currentMonthYear").innerHTML = mnth + " " + year;
    

//----------------------------------------------------------------------------------------


        

        
//==================================================
// getting days in a month

function daysInMonth(month, year) {

    // Array of days in each month
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    // Check for February and leap year
    if (month === 2 && isLeapYear(year)) {
      return 29;
    } else {
      // Return days from array for other months
      return daysInMonths[month - 1]; 
    }
  
  }
  
  function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  

  //console.log(daysInMonth(2, 2025)); 