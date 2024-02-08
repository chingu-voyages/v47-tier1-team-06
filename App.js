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
    // document.querySelector('.calendar.bottomOption').addEventListener('click', function() {
    //     const datePicker = document.getElementById('datePicker');
        // Optional: You might want to toggle visibility or apply some style changes before clicking
        // datePicker.style.display = 'block'; // Make it visible if it's initially hidden
        // datePicker.click(); // Programmatically click the hidden date input
    // });

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

// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('.calendar.bottomOption').addEventListener('click', function() {
//         const datePicker = document.getElementById('datePicker');
//         datePicker.click();
//     });
// });


// popup save btn
    document.querySelector("#add_task_button").addEventListener("click", function(event) {
        event.preventDefault();
        // get user input
        let title = document.getElementById("task_title_input").value;
        let description = document.getElementById("task_description_input").value;
        let dates = document.getElementById("datePicker").value;
        let startTimeHour = document.getElementById("task_start_time_hour").value;
        let startTimeMinute = document.getElementById("task_start_time_minute").value;
        let startTimeAmPm = document.getElementById("task_start_time_ampm").value;
        let endTimeHour = document.getElementById("task_end_time_hour").value;
        let endTimeMinute = document.getElementById("task_end_time_minute").value;
        let endTimeAmPm = document.getElementById("task_end_time_ampm").value;

        if (title === '' || description === '' || dates === '' || startTimeHour === '' || startTimeMinute === ''
        || startTimeAmPm === '' || endTimeHour === '' || endTimeMinute === '' || endTimeAmPm === '') {
            alert('You need to fill out everything.');
            document.getElementById("popup_main_container").style.display = "block";
            document.querySelector(".hideContainer").style.display = "none";
           return;
        } else {
           
            document.querySelector(".hideContainer").style.display = "flex";
        }
    
        // turn dates into seperate integers and convert time into military time
        let year = parseInt(dates.slice(0,4));
        let month = parseInt(dates.slice(5, 7));
        let day = parseInt(dates.slice(8));
        let startmilitaryTime = turnIntoMilitaryTime(startTimeHour, startTimeMinute, startTimeAmPm);
        let endMilitaryTime = turnIntoMilitaryTime(endTimeHour, endTimeMinute, endTimeAmPm);


        
        // add task
        taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);
        

        // TO BE REMOVED AND/OR CHANGED-----------------------------------------------------------------
        // The current code currently does not have the means to get what day the user wants to see
        // so this program just displays the list of tasks on the same day as the task the user just added 

        displayTasks(year, month, day);

        // ------------------------------------------------------------------------------------------------

        document.getElementById('popup_main_container').style.display = 'none';
        // document.getElementsById("#hideContainer").style.display = '';
        document.getElementById("task_title_input").value = "";
        document.getElementById("task_description_input").value = "";
        document.getElementById("datePicker").value = "";
        document.getElementById("task_start_time_hour").value = "";
        document.getElementById("task_start_time_minute").value = "";
        document.getElementById("task_start_time_ampm").value = "";
        document.getElementById("task_end_time_hour").value = "";
        document.getElementById("task_end_time_minute").value = "";
        document.getElementById("task_end_time_ampm").value = "";
        
    });

    function turnIntoMilitaryTime(hour, minute, ampm) {
        let militaryTime = 0;

        if (ampm === "pm") {
            militaryTime = militaryTime + 12;
        }

        militaryTime = militaryTime + parseInt(hour);
        militaryTime = militaryTime * 100;
        militaryTime = militaryTime + parseInt(minute);

        return militaryTime;
    }

    // display tasks on a given date
    function displayTasks (year, month, day, ) {
        document.getElementById("task_list").innerHTML = '';
        let tasksOnAGivenDay = taskContainer.getTasks(year, month, day);

        document.getElementById("task_list").innerHTML = `<h2 class="fs-3">Tasks for ${monthString[month - 1]} ${day}${getOrdinalSuffix(day)}, ${year}</h2>`;
        
        for (let aTask of tasksOnAGivenDay) {
            let newTask = document.createElement("div");
            newTask.className = "col bg-white text-black text-center p-2";
            newTask.innerHTML = `
                <h1>${aTask.title}</h1>
                <p>${aTask.description}</p>
                <p>${aTask.getStartTime()} - ${aTask.getEndTime()}</p>
            `;

            let delete_button = document.createElement("button");

            delete_button.className = "btn btn-danger task_item_delete_button btn-sm";
            delete_button.textContent = "Delete";

            // delete task
            delete_button.addEventListener("click", () => { 
                deleteTask(aTask, year, month, day);
            });

            let edit_button = document.createElement("button");

            edit_button.className = "btn btn-danger task_item_edit_button btn-sm";
            edit_button.textContent = "Edit";
            edit_button.addEventListener("click", () => { editTask(aTask, year, month, day) });
            
            // Append buttons to task div
            newTask.appendChild(edit_button);
            newTask.appendChild(delete_button);

            document.getElementById("task_list").appendChild(newTask);

        }
    }

    // delete task
    function deleteTask(taskDelete, year, month, day) {
        taskContainer.removeTask(taskDelete, year, month, day);
        displayTasks(year, month, day);
    }

    // edit task
    // ----------------------------------------------------------------------------------------------
    function editTask(taskDelete, year, month, day) {
        document.getElementById("popup_edit_container").style.display = 'block';

        document.getElementById("edit-title").value = taskDelete.title;
        document.getElementById("edit-description").value = taskDelete.description;
        document.getElementById("edit-datePicker").value = turnIntoDate(year, month, day);

        document.getElementById("edit-task_start_time_hour").value = getHour(taskDelete.getStartTime());
        document.getElementById("edit-task_start_time_minute").value = getMinutes(taskDelete.getStartTime());
        document.getElementById("edit-task_start_time_ampm").value = getAmPm(taskDelete.getStartTime());
        document.getElementById("edit-task_end_time_hour").value = getHour(taskDelete.getEndTime());
        document.getElementById("edit-task_end_time_minute").value = getMinutes(taskDelete.getEndTime());
        document.getElementById("edit-task_end_time_ampm").value = getAmPm(taskDelete.getEndTime());

        document.querySelector("#save_edit_task_button").addEventListener("click", function editEventHandler() { 
            saveEditsMade(taskDelete, year, month, day)
            this.removeEventListener('click', editEventHandler);
        });
    }

    // turn year, month, date numbers into yyyy-mm-dd format
    function turnIntoDate(year, month, day) {
        let monthNumberString = month;
        let dayString = day;

        if (("" + monthNumberString).length == 1) {
            monthNumberString = "0" + monthNumberString;
        }

        if (("" + dayString).length == 1) {
            dayString = "0" + dayString;
        }

        return `${year}-${monthNumberString}-${dayString}`;
    }

     // get hour from string time
    function getHour(time12HourFormat) {
        let hour = "";

        if (time12HourFormat.length == 7) {
            hour = time12HourFormat.slice(0,1);
        } else {
            hour = time12HourFormat.slice(0,2);
        }

        return hour;
    }


    // get minutes from string time
    function getMinutes(time12HourFormat) {
        let minutes = "";

        if (time12HourFormat.length == 7) {
            minutes = time12HourFormat.slice(2,4);
        } else {
            minutes = time12HourFormat.slice(3,5);
        }

        return minutes;
    }

    // get am/pm from string time
    function getAmPm(time12HourFormat) {
        let amPm = "";

        if (time12HourFormat.length == 7) {
            amPm = time12HourFormat.slice(5);
        } else {
            amPm = time12HourFormat.slice(6);
        }

        return amPm;
    }

    // edit save button
   function saveEditsMade(taskDelete, beforeEditYear, beforeEditMonth, beforeEditDay) {

        // get user input
        let title = document.getElementById("edit-title").value;
        let description = document.getElementById("edit-description").value;
        let dates = document.getElementById("edit-datePicker").value;
        let startTimeHour = document.getElementById("edit-task_start_time_hour").value;
        let startTimeMinute = document.getElementById("edit-task_start_time_minute").value;
        let startTimeAmPm = document.getElementById("edit-task_start_time_ampm").value;
        let endTimeHour = document.getElementById("edit-task_end_time_hour").value;
        let endTimeMinute = document.getElementById("edit-task_end_time_minute").value;
        let endTimeAmPm = document.getElementById("edit-task_end_time_ampm").value;

        // turn dates into seperate integers and convert time into military time
        let year = parseInt(dates.slice(0,4));
        let month = parseInt(dates.slice(5, 7));
        let day = parseInt(dates.slice(8));
        let startmilitaryTime = turnIntoMilitaryTime(startTimeHour, startTimeMinute, startTimeAmPm);
        let endMilitaryTime = turnIntoMilitaryTime(endTimeHour, endTimeMinute, endTimeAmPm);

        // replace task with edited task
        taskContainer.removeTask(taskDelete, beforeEditYear, beforeEditMonth, beforeEditDay);
        taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);


        displayTasks(beforeEditYear, beforeEditMonth, beforeEditDay);
     
        document.getElementById('popup_edit_container').style.display = 'none';
     
        document.getElementById("edit-title").value = "";
        document.getElementById("edit-description").value = "";
        document.getElementById("edit-datePicker").value = "";
        document.getElementById("edit-task_start_time_hour").value = "";
        document.getElementById("edit-task_start_time_minute").value = "";
        document.getElementById("edit-task_start_time_ampm").value = "";
        document.getElementById("edit-task_end_time_hour").value = "";
        document.getElementById("edit-task_end_time_minute").value = "";
        document.getElementById("edit-task_end_time_ampm").value = "";        
    }

    // edit popup cancel btn
        document.querySelector("#cancel_edit_task_button").addEventListener("click", function() {
  
        document.getElementById("edit-title").value = "";
        document.getElementById("edit-description").value = "";
        document.getElementById("edit-datePicker").value = "";
        document.getElementById("edit-task_start_time_hour").value = "";
        document.getElementById("edit-task_start_time_minute").value = "";
        document.getElementById("edit-task_start_time_ampm").value = "";
        document.getElementById("edit-task_end_time_hour").value = "";
        document.getElementById("edit-task_end_time_minute").value = "";
        document.getElementById("edit-task_end_time_ampm").value = "";
        document.getElementById('popup_edit_container').style.display = 'none';
    });
    // ------------------------------------------------------------------------------------------------


// popup cancel btn
    document.querySelector("#cancel_task_button").addEventListener("click", function() {
        document.getElementById("task_title_input").value = "";
        document.getElementById("task_description_input").value = "";
        document.getElementById("datePicker").value = "";

        document.getElementById("task_start_time_hour").value = "";
        document.getElementById("task_start_time_minute").value = "";
        document.getElementById("task_start_time_ampm").value = "";
        document.getElementById("task_end_time_hour").value = "";
        document.getElementById("task_end_time_minute").value = "";
        document.getElementById("task_end_time_ampm").value = "";


        document.getElementById('popup_main_container').style.display = 'none';
        document.getElementById('addTask_container').style.display = 'flex';
        document.getElementById('calender_container').style.display = 'flex';
        document.getElementById('task_container').style.display = 'flex';
    });

// updating current month and year on the main page
    const monthString = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const d = new Date();
    let mnth = monthString[d.getMonth()];
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