import {allTasks, task} from "./taskLogic.js"; /// import
 
// task initialization/save----------------------------------------------
let taskContainer = new allTasks(); // container for all tasks
taskContainer.initialize();

window.onbeforeunload = function(event) {
    taskContainer.save();
}


// date logic------------------------------------------------------------
let baseDate = new Date(); // Initialize date displayed with the current date

// get today's date
const todayMonth = baseDate.getMonth();
const todayYear = baseDate.getFullYear();

const monthString = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
const weekString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// get number of days in a given month
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

// get day string (sunday, monday, etc.) of a certain day on the current selected month
function getDayString(dayNumber) {
    let date = new Date(baseDate.getFullYear(), baseDate.getMonth(), dayNumber);

    return weekString[date.getDay()];
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


// time logic---------------------------------------------------------------------------

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


// display---------------------------------------------------------------------------

// go to next month
document.querySelector("#next_month").addEventListener("click", function(event) {
    baseDate.setDate(1);
    if (baseDate.getMonth() === 11) {
        baseDate.setFullYear(baseDate.getFullYear() + 1);
        baseDate.setMonth(0);
    } else {
        baseDate.setMonth(baseDate.getMonth() + 1);
    }

    displayMonth();
});

// go to previous month
document.querySelector("#previous_month").addEventListener("click", function(event) {
    baseDate.setDate(1);
    if (baseDate.getMonth() === 0) {
        baseDate.setFullYear(baseDate.getFullYear() - 1);
        baseDate.setMonth(11);
    } else {
        baseDate.setMonth(baseDate.getMonth() - 1);
    }

    displayMonth();
});

// display month
function displayMonth() {
    let container = document.querySelector(".calendar-container");
    let dayCount = daysInMonth(baseDate.getMonth() + 1, baseDate.getFullYear());

    // reset month/day displayed
    container.innerHTML = '';
    document.getElementById("task_list").innerHTML = '';

    document.getElementById("currentMonthYear").innerHTML = monthString[baseDate.getMonth()] 
    + " " + baseDate.getFullYear();

    // user cannot see past months
    if (baseDate.getMonth() === todayMonth && baseDate.getFullYear() === todayYear) {
        document.getElementById("previous_month").style.display = "none";
    } else {
        document.getElementById("previous_month").style.display = "block";
    }

    // show all days
    for (let i = 1; i <= dayCount; i++) {
        let dayButton = document.createElement("button");
        let dayString = ('' + i) + "\n" + getDayString(i);

        dayButton.className = "calendar-day";
        dayButton.textContent = dayString;
        dayButton.addEventListener("click", () => {
            baseDate.setDate(1);
            baseDate.setFullYear(baseDate.getFullYear());
            baseDate.setMonth(baseDate.getMonth());
            baseDate.setDate(i);
            displayTasks();
        })

        container.appendChild(dayButton);
    }
}

// display tasks
function displayTasks () {
    document.getElementById("task_list").innerHTML = '';
    let tasksOnAGivenDay = taskContainer.getTasks(baseDate.getFullYear(), 
    baseDate.getMonth() + 1, baseDate.getDate());

    document.getElementById("task_list").innerHTML = `<h2 class="fs-3">Tasks for 
    ${monthString[baseDate.getMonth()]} ${baseDate.getDate()}${getOrdinalSuffix(baseDate.getDate())}, 
    ${baseDate.getFullYear()}</h2>`;

    if (tasksOnAGivenDay != null) {
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
                deleteTask(aTask);
            });

            let edit_button = document.createElement("button");

            edit_button.className = "btn btn-danger task_item_edit_button btn-sm";
            edit_button.textContent = "Edit";
            edit_button.addEventListener("click", () => { editTask(aTask) });
            
            // Append buttons to task div
            newTask.appendChild(edit_button);
            newTask.appendChild(delete_button);

            document.getElementById("task_list").appendChild(newTask);
        }
    }
}


// new task---------------------------------------------------------------------------

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
    let baseDate = new Date(); 
    let dateInput = new Date(dates);
    let max = new Date();
    max.setFullYear(max.getFullYear() + 3);
    
    if (dateInput < baseDate) {
        alert('The input date is in the past.');
        return;
    }

    if (dateInput > max) {
        alert('Please select a date within the next 3 years.');
        return;
    }

    if (task_start_time_hour.value < 1 || task_start_time_hour.value > 12
        || task_start_time_minute.value < 0 || task_start_time_minute.value > 59
        || task_end_time_hour.value < 1 || task_end_time_hour.value > 12
        || task_end_time_minute.value < 0 || task_end_time_minute.value > 59) {
            alert('please enter valid time in this format  - 00:00');
            return;
        }


    if (title === '' || description === '' || dates === '' || startTimeHour === '' || startTimeMinute === ''
    || startTimeAmPm === '' || endTimeHour === '' || endTimeMinute === '' || endTimeAmPm === '') {
        alert('You need to fill out everything.');
        return;
    } else {
        for (let element of document.getElementsByClassName("hideContainer")){
            element.style.display="flex";
        }
    }

    // turn dates into seperate integers and convert time into military time
    let year = parseInt(dates.slice(0,4));
    let month = parseInt(dates.slice(5, 7));
    let day = parseInt(dates.slice(8));
    let startmilitaryTime = turnIntoMilitaryTime(startTimeHour, startTimeMinute, startTimeAmPm);
    let endMilitaryTime = turnIntoMilitaryTime(endTimeHour, endTimeMinute, endTimeAmPm);


    
    // add task
    taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);

    if (year === baseDate.getFullYear() && month === baseDate.getMonth() + 1 && day === baseDate.getDate()) {
        displayTasks();
    }
    
    document.getElementById('popup_main_container').style.display = 'none';
    clearOutTaskAdd();
    
});

// popup cancel btn
    document.querySelector("#cancel_task_button").addEventListener("click", function() {
        clearOutTaskAdd();

        document.getElementById('popup_main_container').style.display = 'none';
        document.getElementById('addTask_container').style.display = 'flex';
        document.getElementById('calender_container').style.display = 'flex';
        document.getElementById('task_container').style.display = 'flex';
    });


// edit task-------------------------------------------------------------

// delete task
function deleteTask(taskDelete) {
    taskContainer.removeTask(taskDelete, baseDate.getFullYear(), 
    baseDate.getMonth() + 1, baseDate.getDate());
    displayTasks();
}

function editTask(taskDelete) {
    document.getElementById("popup_edit_container").style.display = 'block';

    document.getElementById("edit-title").value = taskDelete.title;
    document.getElementById("edit-description").value = taskDelete.description;
    document.getElementById("edit-datePicker").value = turnIntoDate(baseDate.getFullYear(), 
    baseDate.getMonth() + 1, baseDate.getDate());
    document.getElementById("edit-task_start_time_hour").value = getHour(taskDelete.getStartTime());
    document.getElementById("edit-task_start_time_minute").value = getMinutes(taskDelete.getStartTime());
    document.getElementById("edit-task_start_time_ampm").value = getAmPm(taskDelete.getStartTime());
    document.getElementById("edit-task_end_time_hour").value = getHour(taskDelete.getEndTime());
    document.getElementById("edit-task_end_time_minute").value = getMinutes(taskDelete.getEndTime());
    document.getElementById("edit-task_end_time_ampm").value = getAmPm(taskDelete.getEndTime());

    document.querySelector("#save_edit_task_button").addEventListener("click", function editEventHandler() { 
        saveEditsMade(taskDelete)
        this.removeEventListener('click', editEventHandler);
    });
}

// edit save button
function saveEditsMade(taskDelete) {

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
    taskContainer.removeTask(taskDelete, baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate());
    taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);


    displayTasks();

    document.getElementById('popup_edit_container').style.display = 'none';
    
    clearOutEdit();    
}

// edit popup cancel btn
document.querySelector("#cancel_edit_task_button").addEventListener("click", function() {
    clearOutEdit();
});


// helper functions--------------------------------------------------------------------------
function clearOutTaskAdd() {
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("datePicker").value = "";
    document.getElementById("task_start_time_hour").value = "";
    document.getElementById("task_start_time_minute").value = "";
    document.getElementById("task_start_time_ampm").value = "";
    document.getElementById("task_end_time_hour").value = "";
    document.getElementById("task_end_time_minute").value = "";
    document.getElementById("task_end_time_ampm").value = "";
}

function clearOutEdit() {
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

// display current month when page loads------------------------------------------------
displayMonth();