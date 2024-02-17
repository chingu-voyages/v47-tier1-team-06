import {allTasks, task} from "./taskLogic.js"; /// import
 
// task initialization/save----------------------------------------------
let taskContainer = new allTasks(); // container for all tasks
taskContainer.initialize();

window.onbeforeunload = function(event) {
    taskContainer.save();
}


// date logic------------------------------------------------------------

// currently displayed date initialized to the current date
let baseDate = new Date(); 

// get today's date
const todayMonth = baseDate.getMonth();
const todayYear = baseDate.getFullYear();
const todayDay = baseDate.getDate()

// store month/dat strings
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

// turn time information (hour, minute, ampm) into military time
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
    let tasksOnAGivenDay = taskContainer.getTasks(baseDate.getFullYear(), 
    baseDate.getMonth() + 1, baseDate.getDate());

    // show current month, day, and year
    document.getElementById("task_list").innerHTML = `<h2 class="fs-3">Tasks for 
    ${monthString[baseDate.getMonth()]} ${baseDate.getDate()}${getOrdinalSuffix(baseDate.getDate())}, 
    ${baseDate.getFullYear()}</h2>`;

    // if there are tasks within the list
    if (tasksOnAGivenDay != null) {

        // for each task, show title, description, times and create edit and 
        // delete buttons
        for (let aTask of tasksOnAGivenDay) {
            let newTask = document.createElement("div");
            newTask.className = "card col bg-white text-black text-center p-2";
            newTask.innerHTML = `
                <div class="card-header text-center">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                            <h2>${aTask.title}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">${aTask.description}</di>
                <div class="card-body">${aTask.getStartTime()} - ${aTask.getEndTime()}</div>
            `;

            // <h1>${aTask.title}</h1>
            // <p>${aTask.description}</p>
            // <p>${aTask.getStartTime()} - ${aTask.getEndTime()}</p>

            // Task buttons
            let edit_button = document.createElement("button");
            let delete_button = document.createElement("button");
            edit_button.className = "btn btn-danger task_item_edit_button btn-sm";
            edit_button.textContent = "Edit";
            
            delete_button.className = "btn btn-danger task_item_delete_button btn-sm";
            delete_button.textContent = "Delete";

            edit_button.addEventListener("click", () => { editTask(aTask) });
            delete_button.addEventListener("click", () => { 
                deleteTask(aTask);
            });

            // Icon buttons for tasks
            let completed_icon = document.createElement("i");
            let edit_icon = document.createElement("i");
            let delete_icon = document.createElement("i");
            completed_icon.className = "fa-solid fa-square-check fa-lg taskIcon completedIcon";
            edit_icon.className = "fa-solid fa-pen-to-square fa-lg taskIcon editIcon";
            delete_icon.className = "fa-solid fa-trash-can fa-lg taskIcon deleteIcon";

            completed_icon.addEventListener("click", () => { 
                confirm("Mark Task Completed?") ? alert("Task Marked Completed"): alert("Task Not Completed");
            });
            
            edit_icon.addEventListener("click", () => { editTask(aTask) });
            
            delete_icon.addEventListener("click", () => { 
                confirm("Delete this task?") ? deleteTask(aTask) : alert("Delete Task Canceled");
            });

            let iconButton_container = document.createElement('div');
            iconButton_container.className = "container-fluid align-middle text-center taskIconContainer";


            iconButton_container.append(completed_icon);
            iconButton_container.append(edit_icon);
            iconButton_container.append(delete_icon);

            newTask.appendChild(iconButton_container);

            // Append Icon buttons to task
            // newTask.appendChild(completed_icon);
            // newTask.appendChild(edit_icon);
            // newTask.appendChild(delete_icon);

            // Append buttons to task 
            // newTask.appendChild(edit_button);
            // newTask.appendChild(delete_button);

            // Append task to task container
            

// Edit & Delete Icon
            // let edit_icon = document.querySelector("#edit_icon");
            // edit_icon.addEventListener("click", () => { editTask(aTask)  });
            // let delete_icon = document.querySelector("#delete_icon");
            // delete_icon.addEventListener("click", () => { 

            //     if(confirm("Delete this task?")){
            //         deleteTask(aTask);
            //     }
            //     else{
            //         alert("Delete Task Canceled");
            //     }
                
            // });

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

    // turn dates into seperate integers
    let year = parseInt(dates.slice(0,4));
    let month = parseInt(dates.slice(5, 7));
    let day = parseInt(dates.slice(8));

    // check for any bad inputs
    if (checkInputs(title, description, dates, year, month, day, parseInt(startTimeHour), 
    parseInt(startTimeMinute), startTimeAmPm, parseInt(endTimeHour), parseInt(endTimeMinute), 
    endTimeAmPm) === false) {
        return;
    } else {
        for (let element of document.getElementsByClassName("hideContainer")){
            element.style.display="flex";
        }
    }

    // convert time into military time
    let startmilitaryTime = turnIntoMilitaryTime(startTimeHour, startTimeMinute, startTimeAmPm);
    let endMilitaryTime = turnIntoMilitaryTime(endTimeHour, endTimeMinute, endTimeAmPm);
    
    // add task
    taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);

    // if the current date shown is the date of the task added, redraw/update task list
    if (year === baseDate.getFullYear() && month === baseDate.getMonth() + 1 && day === baseDate.getDate()) {
        displayTasks();
    }
    
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
    taskContainer.removeTask(taskDelete, baseDate.getFullYear(), 
    baseDate.getMonth() + 1, baseDate.getDate());

    // show task list again with updated list
    displayTasks();
}

// functionality of edit button/when button clicked, show edit popup
function editTask(taskDelete) {
    document.getElementById("popup_edit_container").style.display = 'block';

    // put in task information into the inputs
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

    // add functionality to save button
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

    // check for any bad inputs
    if (checkInputs(title, description, dates, year, month, day, parseInt(startTimeHour), 
    parseInt(startTimeMinute), startTimeAmPm, parseInt(endTimeHour), parseInt(endTimeMinute), 
    endTimeAmPm) === false) {
        return editTask(taskDelete);
    } 

    let startmilitaryTime = turnIntoMilitaryTime(startTimeHour, startTimeMinute, startTimeAmPm);
    let endMilitaryTime = turnIntoMilitaryTime(endTimeHour, endTimeMinute, endTimeAmPm);

    // replace task with edited task
    taskContainer.removeTask(taskDelete, baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate());
    taskContainer.addTask(title, description, year, month, day, startmilitaryTime, endMilitaryTime);

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

// clear out edit inputs
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

// check for input validity (return false if the inputs are not valid)
function checkInputs(title, description, dates, year, month, day, startHour, startMinute, 
    startAmPm, endHour, endMinute, endAmPM) {

    // check if not everything is filled in
    if (title === '' || description === '' || dates === '' || startHour === '' || startMinute === ''
    || startAmPm === '' || endHour === '' || endMinute === '' || endAmPM === '') {
        alert('You need to fill out everything.');
    } 
    // check if date is in the past
    else if (year < todayYear || (year === todayYear && month < todayMonth + 1) || 
    (year === todayYear && month === todayMonth + 1 && day < todayDay)) {
        alert('The input date is in the past.');
    } 
    // check if date is too far into the future
    else if (year > todayYear + 11) {
        alert('Please select a reasonable date.');
    } 
    // check if hours and minutes are not within range
    else if (startHour.value < 1 || startHour.value > 12
        || startMinute.value < 0 || startMinute.value > 59
        || endHour.value < 1 || endHour.value > 12
        || endMinute.value < 0 || endMinute.value > 59) {
            alert('please enter valid time in this format  - 00:00');
    } 
    // check if end time starts before start time
    else if (startAmPm === 'pm' && endAmPM === 'am') {
        alert('please enter valid start and end time');
    } else if ((startAmPm === endAmPM) && ((startHour > endHour) || 
    ((startHour === endHour) && startMinute > endMinute))) {
        alert('please enter valid start and end time');
    } else {
        return true;
    }

    return false;
}

// display current month when page loads------------------------------------------------
displayMonth();