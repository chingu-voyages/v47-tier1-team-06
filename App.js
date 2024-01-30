let baseDate = new Date(); // Initialize with the current date

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
function datePicked(input) {
    const selectedDate = new Date(input.value);
    baseDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
}
function updateCurrentMonthDisplay() {
    const currentMonthYear = document.getElementById('currentMonthYear');
    currentMonthYear.textContent = baseDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
}


// popup addtask btn
    document.querySelector(".save").addEventListener("click", function() {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const dates = document.getElementById("datePicker").value;
        const startTime = document.getElementById("appt").value;
        const endTime = document.getElementById("appt_1").value;
        
        const newTask = document.createElement("li");
        newTask.className= "task";
        newTask.innerHTML = `
            <i class="fa-solid fa-thumbtack fa-xl"></i>
            <h1>${title}</h1>
            <p>${dates}</p>
            <p>${description}</p>
            <p>${startTime}</p>
            <p>${endTime}</p>
        `;

        // const newTask = document.createElement("li");
        console.log(newTask);


        // const textInput = document.getElementById("resizableInput").value = 
        // title + " " + description + " " + dates + " " + startTime + " " + endTime ;
        // console.log(textInput);

        // document.getElementById("task_list").appendChild(newTask);
        const task_list = document.querySelector(".task_list").appendChild(newTask);
        console.log(task_list);
        
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


// Task logic
// ----------------------------------------------------------------------------------------------------
    /* task class to store task information
    Parameters:
        title (string): title of task
        description (string): description of task
        startTime (integer): when the task starts. Please use military time (12:01 am = 0001, 
            2:00 am = 0200, 11:00 am = 1100, 4:00 pm = 1600)
        endTime (integer): when the task ends. Please use military time (12:01 am = 0001, 
            2:00 am = 0200, 11:00 am = 1100, 4:00 pm = 1600)
    */
    class task {
        // constructor
        constructor(title, description, startTime, endTime) {
            this.title = title;
            this.description = description;
            this.startTime = startTime;
            this.endTime = endTime;
        }

        // getStartTime: returns string of start time in 12 hour notation
        getStartTime() {
            return this.#convertTime(this.startTime);
        }

        // getEndTime: returns string of end time in 12 hour notation
        getEndTime() {
            return this.#convertTime(this.endTime);
        }

         // convertTime: private method of converting military time into 
         // 12 hour notation
         // returns string in format: 12:00 am
        #convertTime(militaryTime) {
            let time = militaryTime; // new time
            let am = true; // whether the time is am or pm

            // change military time into 12 our notation
            if (time >= 1300) {
                time = time - 1200;
                am = false;
            } else if (time >= 1200) {
                am = false;
            } else if (time < 100) {
                time = time + 1200;
            }

            // add :
            if (("" + time).length == 3) {
                time = ("" + time).slice(0, 1) + ":" + ("" + time).slice(1);
            } else {
                time = ("" + time).slice(0, 2) + ":" + ("" + time).slice(2);
            }

            // add am/pm
            if (am) {
                time = time + " am";
            } else {
                time = time + " pm";
            }

            return time;
        }
    }

    /* compareTasks: function to compare two tasks for sorting based on start time (0: task1 > task 2, 
        1: task1 < task 2). Note that this only compares in hours and minutes. Make sure that they
        are on the same day, month, and year first
    
    Parameters:
        task1 (task): task being compared
        task2 (task): task being compared
    
    */
    function compareTasks( task1, task2 ) {
        if ( task1.startTime < task2.startTime ){
            return -1;
        } else {
            return 0;
        }
    } 

    /* class containing all tasks. Contains a map of years as the key value. Each year contains 
        a map of months as the key value. Each month contains a map of days as the key value. Each day
        contains an array of tasks. yearMap[2024] = 2024Map. 2024Map[7] = julyOf2024Map. 
        julyOf2024Map[9] = 9nth-OfJuly-In2024-Array. 9nth-OfJuly-In2024-Array[0] = FirstTaskOfTheDay;
        Parameters:
            title (string): title of task
            description (string): description of task
            year (integer): year of task (2024)
            month (integer): month of task (use 7 for July)
            day (integer): day of task
            startTime (integer): when the task starts. Please use military time (12:01 am = 0001, 
                2:00 am = 0200, 11:00 am = 1100, 4:00 pm = 1600)
            endTime (integer): when the task ends. Please use military time (12:01 am = 0001, 
                2:00 am = 0200, 11:00 am = 1100, 4:00 pm = 1600)
        */
    class allTasks {
        // constructor
        constructor() {
            this.taskYear = new Map();
        }

        // addTask: add task

        addTask(title, description, dates, startTime, endTime) {
            this.#addTaskYear(this.taskYear, title, description, dates, startTime, endTime);
        }

       

       
        

        // getTasks: get all tasks on a given day
        // return value: an array of task objects
        getTasks(year, month, day) {
            return this.taskYear.get(year).get(month).get(day);
        }


        // organizes tasks based on start time, the earlier the task, the closer it is to the start
        // of the array
        organizeTasks(year, month, day) {
            let taskList = this.taskYear.get(year).get(month).get(day);
            taskList.sort(compareTasks);
        }

        // addTask-: private methods for adding a task, helping method addTask
        #addTaskYear(taskYear, title, description, year, month, day, startTime, endTime) {
            if (!(taskYear.has(year))) {
                taskYear.set(year, new Map());
            }

            this.#addTaskMonth(taskYear.get(year), title, description, month, day, startTime, endTime);
        }

        #addTaskMonth (year, title, description, month, day, startTime, endTime) {
            if (!(year.has(month))) {
                year.set(month, new Map());
            }

            this.#addTaskDay(year.get(month), title, description, day, startTime, endTime);
        }

        #addTaskDay(month, title, description, day, startTime, endTime) {
            if (!(month.has(day))) {
                month.set(day, new Array());
            }

            this.#addTaskTime(month.get(day), title, description, startTime, endTime);
        }

        #addTaskTime(day, title, description, startTime, endTime) {
            let newTask = new task(title, description, startTime, endTime);

            day.push(newTask);
        }
    }
    // ----------------------------------------------------------------------------------------------------


