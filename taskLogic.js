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

    /* compareTasks: function to compare two tasks for sorting based on start time (1: task1 > task 2, 
        1: task1 < task 2, 0: task1 == task 2). Note that this only compares in hours and minutes. 
        Make sure that they are on the same day, month, and year first
    
    Parameters:
        task1 (task): task being compared
        task2 (task): task being compared
    
    */
    function compareTasks( task1, task2 ) { 
        if ( task1.startTime < task2.startTime ){
            return -1;
        } else if (task1.startTime > task2.startTime) {
            return 1;
        } else {
            return 0;
        }
    } 

    // sameTask: checks for equality
    function sameTask(task1, task2) {
        return task1.title === task2.title && task1.description === task2.description &&
        task1.year === task2.year && task1.month === task2.month && task1.day ===
        task2.day && task1.startTime === task2.startTime && task1.endTime === task2.endTime;
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
        addTask(title, description, year, month, day, startTime, endTime) {
            this.#addTaskYear(this.taskYear, title, description, year, month, day, startTime, endTime);
            this.#organizeTasks(year, month, day);
        }

        // removeTask: removes a task
        // taskRemove parameter: task to be removed
        removeTask(taskRemove, year, month, day) {
            // gets the list of tasks based
            let taskList = this.getTasks(year, month, day);
            let index = this.findTask(taskList, taskRemove); // index of the task

            // if found, remove task
            if (index >= 0) {
                taskList.splice(index, 1);
            }
        }

        // findTask: finds task in array using binary search
        findTask(taskList, taskFind) {
            let low = 0; // lowest index
            let high = (taskList.length - 1); // highest index

            while (low <= high) {
                let middle = (low + high) / 2; // finds middle index
                middle = middle | 0; // round down

                // if task occurs earlier
                if (compareTasks(taskFind, taskList[middle]) == -1) {
                    high = middle - 1;
                } 
                // if task occurs later
                else if (compareTasks(taskFind, taskList[middle]) == 1) {
                    low = middle + 1;
                } 
                // the start time is the dame
                else {
                    let index = middle;

                    // search left
                    while (index >=  0 && compareTasks(taskList[index], taskFind) == 0) {
                        if (sameTask(taskList[index], taskFind)) {
                            return index;
                        } 
                        index--;
                    }

                    index = middle; // go back to middle

                    // search right
                    while (index <= (taskList.length - 1) && compareTasks(taskList[index], taskFind) == 0) {
                        if (sameTask(taskList[index], taskFind)) {
                            return index;
                        }

                        index++;
                    }

                }
            }

            return -1; // nothing found
        }

        // getTasks: get all tasks on a given day
        // return value: an array of task objects
        getTasks(year, month, day) {
            if (this.taskYear.has(year) && this.taskYear.get(year).has(month) && 
            this.taskYear.get(year).get(month).has(day)) {
                return this.taskYear.get(year).get(month).get(day);
            } else {
                return null;
            }
        }

        // initialize: get saved tasks 
        initialize() {
            let savedTasksString = localStorage.getItem("allTasks");

            // if the data exists
            if (savedTasksString !== null) {
                let savedTasks = JSON.parse(savedTasksString);

                // the local storage cannot retrieve the
                // data types so new objects is needed to be created
                for (let savedTask of savedTasks) {
                    this.addTask(savedTask.title, savedTask.description, savedTask.year,
                        savedTask.month, savedTask.day, savedTask.startTime, savedTask.endTime);
                }
            } 

           
        }

        // save: save tasks
        save() {
            let allTaskSave = new Array();

            // store all task data in an array (the local storage only stores in string format.
            // Additionally, JSON.stringify cannot stringify hashmaps)
            for (let [yearKey, monthMap] of this.taskYear) {
                for (let [monthKey, dayMap] of monthMap) {
                    for (let [dayKey, taskArray] of dayMap) {
                        for (let taskSave of taskArray) {
                            allTaskSave.push(this.#createSavableObject(yearKey, monthKey, dayKey, taskSave));
                        }
                    }
                }
            }

            localStorage.setItem("allTasks", JSON.stringify(allTaskSave));
        }

        // store all task data into an object
        #createSavableObject(year, month, day, taskObject) {
            let savableTask = {
                year: year,
                month: month,
                day: day, 
                title: taskObject.title,
                description: taskObject.description,
                startTime: taskObject.startTime,
                endTime: taskObject.endTime
            };

            return savableTask;
        }

        // organizes tasks based on start time, the earlier the task, the closer it is to the start
        // of the array
        #organizeTasks(year, month, day) {
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

    export {allTasks, task};