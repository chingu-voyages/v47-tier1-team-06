import {AllTasks, Task} from "./taskLogic.js"; // import
 
// task initialization/save----------------------------------------------
let taskContainer = new AllTasks(); // container for all tasks
taskContainer.initialize(); // initialize task data/ if no data exists take data from json example

window.onbeforeunload = function(event) {
    taskContainer.save();
}


// date logic------------------------------------------------------------

// current date initialized to the today's date
let baseDate = new Date(); 

// whether the baseDate is displayed or not. starts false as the use has
// not picked any day yet
let displayed = false; 

// get today's date
const todayMonth = baseDate.getMonth();
const todayYear = baseDate.getFullYear();

// store month/date strings
const monthString = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
const weekString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekFullString = new Set(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]);


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
function getTimeDetails(time12HourFormat) {
    let hour = "";
    let minutes = "";
    let amPm = "";

    if (time12HourFormat.length === 7) {
        hour = time12HourFormat.slice(0, 1);
        minutes = time12HourFormat.slice(2, 4);
        amPm = time12HourFormat.slice(5);
    } else {
        hour = time12HourFormat.slice(0, 2);
        minutes = time12HourFormat.slice(3, 5);
        amPm = time12HourFormat.slice(6);
    }

    return {
        hour: hour,
        minutes: minutes,
        amPm: amPm
    };
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

    // current date is not displayed/user has not picked any day of the current month yet
    displayed = false;

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

    // current date is not displayed/user has not picked any day of the current month yet
    displayed = false;

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

        let year = baseDate.getFullYear();
        let month = baseDate.getMonth();
        let date = i+1;
        let dayButtonDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1);
        let tasksOnDayButton = taskContainer.getTasks(dayButtonDate);
        if (tasksOnDayButton.length > 0) {
            dayButton.classList.add("event-marker");
        }



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
    // user has picked a day, so the current date is displayed
    displayed = true; 

    // clear out current shown task list
    document.getElementById("task_list").innerHTML = '';

    // get task list on chosen date
    let tasksOnAGivenDay = taskContainer.getTasks(baseDate);

    // show current month, day, and year
    document.getElementById("task_list").innerHTML = `<h2 class="fs-3">Tasks for 
    ${monthString[baseDate.getMonth()]} ${baseDate.getDate()}${getOrdinalSuffix(baseDate.getDate())}, 
    ${baseDate.getFullYear()}</h2>`;

    // for each task, show title, description, times and create edit and 
    // delete buttons
    for (let aTask of tasksOnAGivenDay) {
        document.getElementById("task_list").appendChild(createTaskDisplay(aTask));
    }
}

// display task
function createTaskDisplay(task) {
    let taskDisplay = document.createElement("div");

    taskDisplay.className = "card col bg-white text-black text-center p-2";
    taskDisplay.innerHTML = `

    <div class="card-header text-center">
        <div class="container">
            <div class="row">
                <div class="col-12">
                <h2>${task.category} - ${task.type}: ${task.title}</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="card-body">${task.description}</di>
    <div class="card-body">${task.startTime} - ${task.endTime}</div>
    `;

    // edit and delete button
    let edit_icon = document.createElement("i");
    let delete_icon = document.createElement("i");
    edit_icon.className = "fa-solid fa-pen-to-square fa-lg taskIcon editIcon";
    delete_icon.className = "fa-solid fa-trash-can fa-lg taskIcon deleteIcon";

    edit_icon.addEventListener("click", () => { editTask(task) });
            
    delete_icon.addEventListener("click", () => { 
        confirm("Delete this task?") ? deleteTask(task) : alert("Delete Task Canceled");
    });

    // complete/incomplete checkbox
    let completed_icon = document.createElement('input');
    completed_icon.className = "fa-solid fa-square-check fa-lg taskIcon completedIcon";
    completed_icon.type = "checkbox";

    // check if task is finished on selected day
    if (task.isFinished(baseDate)) {
        completed_icon.checked = true;
    } else {
        completed_icon.checked = false;
    }

    completed_icon.addEventListener('change', function() {
        if (this.checked) {
            task.addFinished(baseDate);
            alert("Marked as Finished");
        } else {
            task.removeFinished(baseDate);
            alert("Marked as Unfinished");
        }
    });

    // icon/checkbox container
    let iconButton_container = document.createElement('div');
    iconButton_container.className = "container-fluid align-middle text-center taskIconContainer";

    iconButton_container.append(completed_icon);
    iconButton_container.append(edit_icon);
    iconButton_container.append(delete_icon);

    taskDisplay.appendChild(iconButton_container);

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
    let priority = document.getElementById("selectPriority").value;
    let startDate = document.getElementById("startDatePicker").value;
    let startTimeHour = document.getElementById("task_start_time_hour").value;
    let startTimeMinute = document.getElementById("task_start_time_minute").value;
    let startTimeAmPm = document.getElementById("task_start_time_ampm").value;
    let endDate = document.getElementById("endDatePicker").value;
    let endTimeHour = document.getElementById("task_end_time_hour").value;
    let endTimeMinute = document.getElementById("task_end_time_minute").value;
    let endTimeAmPm = document.getElementById("task_end_time_ampm").value;

    let checkboxes = document.getElementsByName('weekday'); // get all weekday checkboxes
    let dayList = new Array(); // get days where the task will be repeated

    
    // if checkbox for numbered days is checked, get all days in textbox seperated by spaces
    if (document.getElementById("monthlyDays").checked) {
        dayList = document.getElementById("task_monthDays").value.split(" ");
    }

    // get all weekdays
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            dayList.push(checkboxes[i].value);
        }
    }

    // check input validity
    if (!(checkValidInputs(category, type, title, description, priority, startDate, 
        endDate, startTimeHour, startTimeMinute, startTimeAmPm, endTimeHour, endTimeMinute, 
        endTimeAmPm, dayList))) {
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

    // check time/dates
    if (!(checkDateTime(startTask, endTask))) {
        return;
    } else {
        for (let element of document.getElementsByClassName("hideContainer")){
            element.style.display="flex";
        }
    }

  
    // add task
    taskContainer.newTask(category, type, title, description, priority, startTask, endTask, dayList);
   

    if (displayed) {
        displayTasks();
        displayMonth();
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
});

// edit task-------------------------------------------------------------

// functionality of delete button/delete task
function deleteTask(taskDelete) {
    // remove task
    taskContainer.removeTask(taskDelete);

    // show task list again with updated list
    displayTasks();
    displayMonth();
}

// functionality of edit button/when button clicked, show edit popup
function editTask(taskDelete) {
    document.getElementById("popup_edit_container").style.display = 'block';

    // put in task information into the inputs
    document.getElementById("edit-task_category").value = taskDelete.category;
    document.getElementById("edit-task_type").value = taskDelete.type;
    document.getElementById("edit-title").value = taskDelete.title;
    document.getElementById("edit-description").value = taskDelete.description;
    document.getElementById("edit-selectPriority").value = taskDelete.priority;
    document.getElementById("edit-startDatePicker").value = turnIntoDate(taskDelete.start);
    document.getElementById("edit-task_start_time_hour").value = getTimeDetails(taskDelete.startTime);
    document.getElementById("edit-task_start_time_minute").value = getTimeDetails(taskDelete.startTime);
    document.getElementById("edit-task_start_time_ampm").value = getTimeDetails(taskDelete.startTime);
    document.getElementById("edit-endDatePicker").value = turnIntoDate(taskDelete.end);
    document.getElementById("edit-task_end_time_hour").value = getTimeDetails(taskDelete.endTime);
    document.getElementById("edit-task_end_time_minute").value =getTimeDetails(taskDelete.endTime);
    document.getElementById("edit-task_end_time_ampm").value = getTimeDetails(taskDelete.endTime);

   
    // get all weekday checkboxes
    let checkboxes = document.getElementsByName('edit-weekday');

    // check if the task includes sunday, monday, etc.
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = taskDelete.includesDay(checkboxes[i].value);
    }

    // get all repeated days
    let days = taskDelete.days;

    // get numbered days checkbox
    let daycheckBox =  document.getElementById("edit-task_monthDays");

    // if task includes numbered days, input days in numbered days checkbox
    for (let day of days) {
        if (!(isNaN(parseInt(day)))) {
            daycheckBox.value = daycheckBox.value + " " + ("" + day);
        }
    }

    // if task includes numbered days, check numbered days checkbox
    if (daycheckBox.value != "") {
        document.getElementById("edit-monthlyDays").checked = true;
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
    let priority = document.getElementById("edit-selectPriority").value;
    let startDate = document.getElementById("edit-startDatePicker").value;
    let startTimeHour = document.getElementById("edit-task_start_time_hour").value;
    let startTimeMinute = document.getElementById("edit-task_start_time_minute").value;
    let startTimeAmPm = document.getElementById("edit-task_start_time_ampm").value;
    let endDate = document.getElementById("edit-endDatePicker").value;
    let endTimeHour = document.getElementById("edit-task_end_time_hour").value;
    let endTimeMinute = document.getElementById("edit-task_end_time_minute").value;
    let endTimeAmPm = document.getElementById("edit-task_end_time_ampm").value;

    let checkboxes = document.getElementsByName('edit-weekday'); // get all weekday checkboxes
    let dayList = new Array(); // days when task is repeated

    // if numbered days checkbox is checked, get all days seperated by days
    if (document.getElementById("edit-monthlyDays").checked) {
        dayList = document.getElementById("edit-task_monthDays").value.split(" ");
    }

    // add weekdays to repeated days
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            dayList.push(checkboxes[i].value);
        }
    }

    // check for invalid inputs
    if (!(checkValidInputs(category, type, title, description, priority, startDate, 
        endDate, startTimeHour, startTimeMinute, startTimeAmPm, endTimeHour, endTimeMinute, 
        endTimeAmPm, dayList))) {
        return editTask(taskDelete);
    }

    for (let day of dayList) {
        console.log(day)
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

    // check dates/times
    if (!(checkDateTime(startTask, endTask))) {
        return editTask(taskDelete);
    } 

    // replace task with edited task
    taskContainer.removeTask(taskDelete);
    taskContainer.newTask(category, type, title, description, priority, startTask, endTask, dayList);

    // update task list with edits made
    displayTasks();
    displayMonth();

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
    document.getElementById("selectPriority").value = "";
    document.getElementById("startDatePicker").value = "";
    document.getElementById("task_start_time_hour").value = "";
    document.getElementById("task_start_time_minute").value = "";
    document.getElementById("task_start_time_ampm").value = "";
    document.getElementById("endDatePicker").value = "";
    document.getElementById("task_end_time_hour").value = "";
    document.getElementById("task_end_time_minute").value = "";
    document.getElementById("task_end_time_ampm").value = "";

    // all weekday checkboxes are checked by default
    let checkboxes = document.getElementsByName('weekday');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }

    // numbered day checkbos is not checked by default
    document.getElementById("monthlyDays").checked = false;
    document.getElementById("task_monthDays").value = "";
}

// clear out edit inputs
function clearOutEdit() {
    document.getElementById("edit-task_category").value = "";
    document.getElementById("edit-task_type").value = "";
    document.getElementById("edit-title").value = "";
    document.getElementById("edit-description").value = "";
    document.getElementById("edit-selectPriority").value = "";
    document.getElementById("edit-startDatePicker").value = "";
    document.getElementById("edit-task_start_time_hour").value = "";
    document.getElementById("edit-task_start_time_minute").value = "";
    document.getElementById("edit-task_start_time_ampm").value = "";
    document.getElementById("edit-endDatePicker").value = "";
    document.getElementById("edit-task_end_time_hour").value = "";
    document.getElementById("edit-task_end_time_minute").value = "";
    document.getElementById("edit-task_end_time_ampm").value = "";  

    // all weekday checkboxes are checked by default
    let checkboxes = document.getElementsByName('edit-weekday');

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
    }

    // numbered day checkbos is not checked by default
    document.getElementById("edit-monthlyDays").checked = false;
    document.getElementById("edit-task_monthDays").value = "";
}

// check for input validity (return false if the inputs are not valid)
function checkValidInputs(category, type, title, description, priority, startDates, 
    endDates, startHour, startMinute, startAmPm, endHour, endMinute, endAmPM, days) {
    let validDays = new Array(); // store all valid inputs
    
    // find all valid inputs
    for (let day of days) {
        if (isNaN(parseInt(day)) && weekFullString.has(day)) {
            validDays.push(day);
        } else if (parseInt(day) >= 1 && parseInt(day) <= 31) {
            console.log(day)
            validDays.push(parseInt(day));
        }
    }

    // remove all invalid inputs from repeat days array
    for (let i = 0; i < validDays.length; i ++) {
        days[i] = validDays[i];
    }
    days.length = validDays.length;

    // check if anything was not filled out
    if (category === "" || type === "" || title === '' || description === '' || priority === ''
    || startDates === '' ||  endDates === '' || startHour === '' || startMinute === '' || 
    startAmPm === '' || endHour === '' || endMinute === '' || endAmPM === '') {
        alert('You need to fill out everything.');
    } 
    // check if there are any valid repeats left
    else if (days.length === 0) {
        alert('You need to have at least valid one day to repeat.');
    }
    // check if hours and minutes are not within range
    else if (parseInt(startHour) < 1 || parseInt(startHour) > 12
        || parseInt(startMinute) < 0 || parseInt(startMinute) > 59
        || parseInt(endHour) < 1 || parseInt(endHour) > 12
        || parseInt(endMinute) < 0 || parseInt(endMinute) > 59) {
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

    // check if start date takes place after end date
    if (start > end) {
        alert('please enter valid start and end dates');
    } 
    // check if task is in the past
    else if (end < currentDate) {
        alert('the entered time/date is in the past');
    } 
    // check is task is too far in the future
    else if (end > futureLimit) {
        alert('please enter a reasonable date');
    } else if (end.getHours() < start.getHours() || (end.getHours() === start.getHours() 
    && end.getMinutes() < start.getMinutes())) {
        alert("please enter valid start and end times")
    } else {
        return true;
    }

    return false;
}

// display current month when page loads------------------------------------------------
displayMonth();