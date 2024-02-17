import {AllTasks, Task} from "./newTaskLogic.js"; /// import
 
// task initialization/save----------------------------------------------
let taskContainer = new AllTasks(); // container for all tasks


// date logic------------------------------------------------------------

// currently displayed date initialized to the current date
let baseDate = new Date(); 

// get today's date
const todayMonth = baseDate.getMonth();
const todayYear = baseDate.getFullYear();
const todayDay = baseDate.getDate()

// store month/date strings
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

// check if yeare is a leap year
function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}

// get day string (sunday, monday, etc.) of a certain day on the current selected month
function getDayString(dayNumber) {
    let date = new Date(baseDate.getFullYear(), baseDate.getMonth(), dayNumber);

    return weekString[date.getDay()];
}

// get day suffix
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}

// turn date numbers into yyyy-mm-dd format
function turnIntoDate(date) {
    let monthNumberString = date.getMonth() + 1;
    let dayString = date.getDate();

    if (("" + monthNumberString).length == 1) {
        monthNumberString = "0" + monthNumberString;
    }

    if (("" + dayString).length == 1) {
        dayString = "0" + dayString;
    }
  
    return `${date.getFullYear()}-${monthNumberString}-${dayString}`;
}

// time logic---------------------------------------------------------------------------

function setTime(date, hour, minute, amPm) {
    if (amPm === "pm") {
        hour = parseInt(hour) + 12;
    } else {
        hour = parseInt(hour);
    }

    if (hour === 24) {
        hour = 0;
    }

    date.setHours(hour);
    date.setMinutes(parseInt(minute));
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
    // container to put in days
    let container = document.querySelector(".calendar-container");

    // how many days are in the chosen month
    let dayCount = daysInMonth(baseDate.getMonth() + 1, baseDate.getFullYear());

    // reset month/day displayed
    container.innerHTML = '';
    document.getElementById("task_list").innerHTML = '';

    // show chosen month and year
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

        dayButton.className = "btn btn-lg calendar-day";
        dayButton.type = "button";
        dayButton.textContent = dayString;

        // functionality when clicked/show all tasks when clicked
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
    // clear out current shown task list
    document.getElementById("task_list").innerHTML = '';

    // get task list on chosen date
    let tasksOnAGivenDay = taskContainer.getTasks(baseDate);

    // show current month, day, and year
    document.getElementById("task_list").innerHTML = `<h2 class="fs-3">Tasks for 
    ${monthString[baseDate.getMonth()]} ${baseDate.getDate()}${getOrdinalSuffix(baseDate.getDate())}, 
    ${baseDate.getFullYear()}</h2>`;

    console.log(tasksOnAGivenDay);

    // for each task, show title, description, times and create edit and 
    // delete buttons
    for (let aTask of tasksOnAGivenDay) {
        console.log(aTask);
        console.log(aTask.startTime);
        if (aTask.includesWeekDay(baseDate.getDay())) {
            document.getElementById("task_list").appendChild(createTaskDisplay(aTask));
        } 
    }

}

function createTaskDisplay(task) {
    let taskDisplay = document.createElement("div");

    taskDisplay.className = "col bg-white text-black text-center p-2";
    taskDisplay.innerHTML = `
        <h1>${task.category}-${task.type}:${task.title}</h1>
        <p>${task.description}</p>
        <p>${task.startTime} - ${task.endTime}</p>
    `;

    // delete button
    let delete_button = document.createElement("button");

    delete_button.className = "btn btn-danger task_item_delete_button btn-sm";
    delete_button.textContent = "Delete";

    delete_button.addEventListener("click", () => { 
        deleteTask(task);
    });

    // edit button
    let edit_button = document.createElement("button");

    edit_button.className = "btn btn-danger task_item_edit_button btn-sm";
    edit_button.textContent = "Edit";
    edit_button.addEventListener("click", () => { editTask(task) });

    let taskStatus_checkBox = document.createElement('input');
    taskStatus_checkBox.type = "checkbox";

    if (task.isFinished(baseDate)) {
        console.log("finished")
        taskStatus_checkBox.checked = true;
    } else {
        taskStatus_checkBox.checked = false;
    }

    taskStatus_checkBox.addEventListener('change', function() {
        if (this.checked) {
            console.log(baseDate)
            task.addFinished(baseDate);
        } else {
            console.log(baseDate)
            task.removeFinished(baseDate);
        }
    });
    
    // Append checkbox/buttons to task 
    taskDisplay.appendChild(taskStatus_checkBox);
    taskDisplay.appendChild(edit_button);
    taskDisplay.appendChild(delete_button);

    return taskDisplay;
}

// new task---------------------------------------------------------------------------

// popup save btn
document.querySelector("#add_task_button").addEventListener("click", function(event) {
    event.preventDefault();
    // get user input
    let category = document.getElementById("task_category").value;
    let type = document.getElementById("task_type").value;
    let title = document.getElementById("task_title_input").value;
    let description = document.getElementById("task_description_input").value;
    let startDate = document.getElementById("startDatePicker").value;
    let startTimeHour = document.getElementById("task_start_time_hour").value;
    let startTimeMinute = document.getElementById("task_start_time_minute").value;
    let startTimeAmPm = document.getElementById("task_start_time_ampm").value;
    let endDate = document.getElementById("endDatePicker").value;
    let endTimeHour = document.getElementById("task_end_time_hour").value;
    let endTimeMinute = document.getElementById("task_end_time_minute").value;
    let endTimeAmPm = document.getElementById("task_end_time_ampm").value;

    let checkboxes = document.getElementsByName('weekday');
    let weekDayList = new Array();

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            weekDayList.push(i);
        }
    }

    if (!(checkValidInputs(category, type, title, description, startDate, endDate,
        startTimeHour, startTimeMinute, startTimeAmPm, endTimeHour, endTimeMinute,
        endTimeAmPm, weekDayList))) {
            return;
    } 

    // turn dates into seperate integers
    let startYear = parseInt(startDate.slice(0,4));
    let startMonth = parseInt(startDate.slice(5, 7));
    let startDay = parseInt(startDate.slice(8));

    let endYear = parseInt(endDate.slice(0,4));
    let endMonth = parseInt(endDate.slice(5, 7));
    let endDay = parseInt(endDate.slice(8));

    // set task dates and times
    let startTask= new Date(startYear, startMonth - 1, startDay);
    setTime(startTask, startTimeHour, startTimeMinute, startTimeAmPm);
    let endTask =  new Date(endYear, endMonth - 1, endDay);
    setTime(endTask, endTimeHour, endTimeMinute, endTimeAmPm);

    if (!(checkDateTime(startTask, endTask))) {
            return;
    } else {
        for (let element of document.getElementsByClassName("hideContainer")){
            element.style.display="flex";
        }
    }

    // add task
    taskContainer.newTask(category, type, title, description, startTask, endTask, weekDayList);

    displayTasks();
    
    // clear out popup and hide popup
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

// functionality of delete button/delete task
function deleteTask(taskDelete) {
    // remove task
    taskContainer.removeTask(taskDelete);

    // show task list again with updated list
    displayTasks();
}

// functionality of edit button/when button clicked, show edit popup
function editTask(taskDelete) {
    document.getElementById("popup_edit_container").style.display = 'block';

    // put in task information into the inputs
    document.getElementById("edit-task_category").value = taskDelete.category;
    document.getElementById("edit-task_type").value = taskDelete.type;
    document.getElementById("edit-title").value = taskDelete.title;
    document.getElementById("edit-description").value = taskDelete.description;
    document.getElementById("edit-startDatePicker").value = turnIntoDate(taskDelete.start);
    document.getElementById("edit-task_start_time_hour").value = getHour(taskDelete.startTime);
    document.getElementById("edit-task_start_time_minute").value = getMinutes(taskDelete.startTime);
    document.getElementById("edit-task_start_time_ampm").value = getAmPm(taskDelete.startTime);
    document.getElementById("edit-endDatePicker").value = turnIntoDate(taskDelete.end);
    document.getElementById("edit-task_end_time_hour").value = getHour(taskDelete.endTime);
    document.getElementById("edit-task_end_time_minute").value = getMinutes(taskDelete.endTime);
    document.getElementById("edit-task_end_time_ampm").value = getAmPm(taskDelete.endTime);

    let checkboxes = document.getElementsByName('edit-weekday');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = taskDelete.includesWeekDay(i);
    }

    // add functionality to save button
    document.querySelector("#save_edit_task_button").addEventListener("click", function editEventHandler() { 
        saveEditsMade(taskDelete)
        this.removeEventListener('click', editEventHandler);
    });
}

// edit save button
function saveEditsMade(taskDelete) {
    // get user input
    let category = document.getElementById("edit-task_category").value;
    let type = document.getElementById("edit-task_type").value;
    let title = document.getElementById("edit-title").value;
    let description = document.getElementById("edit-description").value;
    let startDate = document.getElementById("edit-startDatePicker").value;
    let startTimeHour = document.getElementById("edit-task_start_time_hour").value;
    let startTimeMinute = document.getElementById("edit-task_start_time_minute").value;
    let startTimeAmPm = document.getElementById("edit-task_start_time_ampm").value;
    let endDate = document.getElementById("edit-endDatePicker").value;
    let endTimeHour = document.getElementById("edit-task_end_time_hour").value;
    let endTimeMinute = document.getElementById("edit-task_end_time_minute").value;
    let endTimeAmPm = document.getElementById("edit-task_end_time_ampm").value;

    let checkboxes = document.getElementsByName('edit-weekday');
    let weekDayList = new Array();

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            weekDayList.push(i);
        }
    }

    // turn dates into seperate integers
    let startYear = parseInt(startDate.slice(0,4));
    let startMonth = parseInt(startDate.slice(5, 7));
    let startDay = parseInt(startDate.slice(8));

    let endYear = parseInt(endDate.slice(0,4));
    let endMonth = parseInt(endDate.slice(5, 7));
    let endDay = parseInt(endDate.slice(8));

    // set task dates and times
    let startTask= new Date(startYear, startMonth - 1, startDay);
    setTime(startTask, startTimeHour, startTimeMinute, startTimeAmPm);
    let endTask =  new Date(endYear, endMonth - 1, endDay);
    setTime(endTask, endTimeHour, endTimeMinute, endTimeAmPm);


    // replace task with edited task
    taskContainer.removeTask(taskDelete);
    console.log(category);
    console.log(type);
    console.log(title);
    console.log(description);
    console.log(startTask);
    console.log(endTask);
    console.log(weekDayList);
    taskContainer.newTask(category, type, title, description, startTask, endTask, weekDayList);

    // update task list with edits made
    displayTasks();

    // clear out popup and hide
    document.getElementById('popup_edit_container').style.display = 'none';
    clearOutEdit();    
}

// edit popup cancel btn
document.querySelector("#cancel_edit_task_button").addEventListener("click", function() {
    clearOutEdit();
    document.getElementById('popup_edit_container').style.display = 'none';
});


// helper functions--------------------------------------------------------------------------

// clear out task add inputs
function clearOutTaskAdd() {
    document.getElementById("task_category").value = "";
    document.getElementById("task_type").value = "";
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("startDatePicker").value = "";
    document.getElementById("task_start_time_hour").value = "";
    document.getElementById("task_start_time_minute").value = "";
    document.getElementById("task_start_time_ampm").value = "";
    document.getElementById("endDatePicker").value = "";
    document.getElementById("task_end_time_hour").value = "";
    document.getElementById("task_end_time_minute").value = "";
    document.getElementById("task_end_time_ampm").value = "";

    let checkboxes = document.getElementsByName('weekday');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}

// clear out edit inputs
function clearOutEdit() {
    document.getElementById("edit-task_category").value = "";
    document.getElementById("edit-task_type").value = "";
    document.getElementById("edit-title").value = "";
    document.getElementById("edit-description").value = "";
    document.getElementById("edit-startDatePicker").value = "";
    document.getElementById("edit-task_start_time_hour").value = "";
    document.getElementById("edit-task_start_time_minute").value = "";
    document.getElementById("edit-task_start_time_ampm").value = "";
    document.getElementById("edit-endDatePicker").value = "";
    document.getElementById("edit-task_end_time_hour").value = "";
    document.getElementById("edit-task_end_time_minute").value = "";
    document.getElementById("edit-task_end_time_ampm").value = "";  

    let checkboxes = document.getElementsByName('edit-weekday');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }
}

// check for input validity (return false if the inputs are not valid)
function checkValidInputs(category, type, title, description, startDates, endDates, startHour, startMinute, 
    startAmPm, endHour, endMinute, endAmPM, weekdays) {
    let hasWeekdaySelected = false;

    for (let i = 0; i < weekdays.length; i++) {
        if (weekdays[i]) {
            hasWeekdaySelected = true;
        }
    }

    // check if not everything is filled in
    if (category === "" || type === "" || title === '' || description === '' || startDates === '' || 
    endDates === '' || startHour === '' || startMinute === '' || startAmPm === '' || endHour === '' 
    || endMinute === '' || endAmPM === '') {
        alert('You need to fill out everything.');
    } else if (!(hasWeekdaySelected)) {
        alert('You need to select at least one weekday.');
    }
    // check if hours and minutes are not within range
    else if (startHour.value < 1 || startHour.value > 12
        || startMinute.value < 0 || startMinute.value > 59
        || endHour.value < 1 || endHour.value > 12
        || endMinute.value < 0 || endMinute.value > 59) {
            alert('please enter valid time in this format  - 00:00');
    } else {
        return true;
    }

    return false;
}

function checkDateTime(start, end) {
    let currentDate = new Date();
    let futureLimit = new Date();
    futureLimit.setFullYear(futureLimit.getFullYear() + 5);

    if (start > end) {
        alert('please enter valid start and end times/dates');
    } else if (end < currentDate) {
        alert('the entered time/date is in the past');
    } else if (end > futureLimit) {
        alert('please enter a reasonable date');
    } else {
        return true;
    }

    return false;
}

// display current month when page loads------------------------------------------------
displayMonth();
taskContainer.test();