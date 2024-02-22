/** Task class
 * task that can repeated by week (every sunday, monday, etc)
 * or by month (every 15th) from a certain range of start Date to end Date.
 * Additionally, the task records which days it was completed.
 */
class Task {
    #category;
    #type;
    #title;
    #description;
    #priority;
    #start;
    #end;
    #finished;
    #days;

    /** task constructor
     * @param category string category of task
     * @param type string type of task
     * @param title string title of task
     * @param description string description of task
     * @param priority string priority of task
     * @param start Date start date of task
     * @param end Date end date of task
     * @param days Array of days when the task will repeated. takes int 
     * days (1 - 31) and string weekdays (sunday - saturday)
     */
    constructor(category, type, title, description, priority, start, end, days) {
        this.#category = category;
        this.#type = type;
        this.#title = title;
        this.#description = description;
        this.#priority = priority;
        this.#start = start;
        this.#end = end;
        this.#finished = new Array();
        this.#days = new Set();

        for (let i = 0; i < days.length; i++) {
            if (isNaN(parseInt(days[i]))) {
                this.#days.add(days[i]);
            } else {
                this.#days.add(parseInt(days[i]));
            }
        }
    }

    /** get category
     * @return string category of task
     */
    get category() {
        return this.#category;
    }

    /** get type
     * @return string type of task
     */
    get type() {
        return this.#type;
    }

    /** get title
     * @return string title of task
     */
    get title() {
        return this.#title;
    }

    /** get description
     * @return string description of task
     */
    get description() {
        return this.#description;
    }

    /** get priority
     * @return string priority of task
     */
    get priority() {
        return this.#priority;
    }

    /** get start date
     * @return Date start date of task
     */
    get start() {
        return this.#start;
    }

    /** get end date
     * @return Date end date of task
     */
    get end() {
        return this.#end;
    }

    /** get startTime
     * @return string start time of task (00:00 ampm format)
     */
    get startTime() {
        return this.#convertTime(this.#start);
    }

    /** get endTime
     * @return string end time of task (00:00 ampm format)
     */
    get endTime() {
        return this.#convertTime(this.#end);
    }

    /** get days
     * @return Set of days when the task will repeated. days 
     * (1 - 31) and string weekdays (sunday - saturday)
     */
    get days() {
        return this.#days;
    }

    /** get finished
     * @return Array of Dates when task is completed
     */
    get finished() {
        return this.#finished;
    }

    /** adds completion date
     * @param newDate Date when task is completed
     */
    addFinished(newDate) {
        this.#finished.push(new Date(newDate));
        this.#finished.sort(compareDates);
    }

     /** removes completion date
     * @param removeDate Date when task was completed
     */
    removeFinished(removeDate){
        for (let i = 0; i < this.#finished.length; i++) {
            if (compareDates(this.#finished[i], removeDate) === 0) {
                this.#finished.splice(i, 1);
                break;
            }
        }
    }

     /** checks whether the task was finished on the date or not
     * @param findDate Date to check completion
     * @return whether the task was finished on the date or not
     */
    isFinished(findDate) {
        for (let i = 0; i < this.#finished.length; i++) {
            if (compareDates(this.#finished[i], findDate) === 0) {
                return true;
            }
        }

        return false;
    }

     /** checks whether the task repeats on the day
     * @param day string weekday or int day
     * @return whether the task repeats on the day
     */
    includesDay(day) {
        return this.#days.has(day);
    }

     /** get string time (12:00 am - 11:59 pm) from (00:00 - 23:59)
     * @param date Date with time information
     * @return string time (12:00 am - 11:59 pm)
     */
    #convertTime(date) {
        let timeString;
        let isAm;
        let hour = date.getHours();
        let minutes = date.getMinutes();

        if (hour > 12) {
            hour = hour - 12;
            isAm = false;
        } else if (hour === 12) {
            isAm = false;
        } else if (hour === 0) {
            hour = 12;
            isAm = true;
        } else {
            isAm = true;
        }

        if (("" + minutes).length === 1) {
            minutes = "0" + ("" + minutes);
        }

        timeString = ("" + hour) + ":" + ("" + minutes);
        timeString = isAm ? timeString + " am" : timeString + " pm";

        return timeString;
    }
}

/** AllTasks class
 * task container that saves and gets task data from local storage/JSON example file.
 * It can get an array of tasks on a certain day, create and add a new task, and remove
 * a task.
 */
class AllTasks {
    #allTasks;

    /** AllTasks constructor
     */
    constructor() {
        this.#allTasks = new Array();
    }

    /** saves task data and stores into local storage with name everyTask
     */
    save() {
        let allTaskSave = new Array();

        for (let task of this.#allTasks) {
            allTaskSave.push(this.#createSavableObject(task));
        }

        localStorage.setItem("everyTask", JSON.stringify(allTaskSave));
    }

    /** turns task data into a task object
     * @param task Task to be saved
     * @return task object
     */
    #createSavableObject(task) {
        let savableTask = {
            category: task.category,
            type: task.type,
            title: task.title, 
            description: task.description,
            priority: task.priority,
            start: this.#createSavableDate(task.start),
            end: this.#createSavableDate(task.end),
            finished: this.#createSavableFinished(task.finished),
            days: this.#createSavableDays(task.days)
        };

        return savableTask;
    }

    /** turns a set of repeated days into a savable array
     * @param days set of repeated days
     * @return savable array 
     */
    #createSavableDays(days) {
        let savableDays = new Array();

        for (let day of days) {
            savableDays.push(day);
        }

        return savableDays;
    }

    /** creates a list of Dates into a list of Date objects
     * @param dates list of Dates
     * @return list of Date objects
     */
    #createSavableFinished(dates) {
        let finishedArray = new Array();

        for (let date of dates) {
            finishedArray.push(this.#createSavableDate(date));
        }

        return finishedArray;
    }

    /** turn Date into date object
     * @param date Date to be saved
     * @return date object
     */
    #createSavableDate(date) {
        let savableDate = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes()
        }

        return savableDate;
    }

    /** get saved task data. If no task data found, use the JSON file example
     */
    initialize() {
        let savedTasksString = localStorage.getItem("everyTask");

        // if the data exists
        if (savedTasksString !== null) {
            let savedTasks = JSON.parse(savedTasksString);

            for (let savedTask of savedTasks) {
                this.#allTasks.push(this.getTaskData(savedTask));
            }
            
        } 
        // if the everyTask item does not exist, load data from example JSON file
        else {
            fetch("./tasks-example.json").then((response) => 
            response.json()).then((data) => {
                this.#getExampleData(data);
            })
        }
    }

    /** create Task from task data
     * @param task task data
     * @return Task
     */
    getTaskData(task) {
        let taskCategory = task.category;
        let taskType = task.type;
        let taskTitle = task.title;
        let taskDescription = task.description;
        let taskPriority = task.priority;
        let startObj = task.start;
        let endObj = task.end;
        let finishedObjs = task.finished;
        let taskDays = task.days;

        let taskObject = new Task(taskCategory, taskType, taskTitle, taskDescription, taskPriority, 
        this.getDate(startObj), this.getDate(endObj), taskDays);
        
        for (let finished of finishedObjs) {
            taskObject.addFinished(this.getDate(finished));
        }

        return taskObject;
    }

    /** create Date from date data
     * @param date date data
     * @return Date
     */
    getDate(date) {
        let dateObject = new Date(date.year, date.month, date.day, date.hour, date.minute);

        return dateObject;
    }

    /** Create and add tasks from JSON file. All tasks created will span two months.
     * @param data JSON file
     */
    #getExampleData(data) {
        for (let taskCategory of data) {
            let categoryName = taskCategory.categoryName;

            for (let taskType of taskCategory.activityTypes) {
                let typeName = taskType.activityName;

                for (let task of taskType.Tasks) {
                    let taskName = task.taskName;
                    let taskDescription = task.taskDescription;
                    let days = new Array();
                    let startTask = new Date();
                    let endTask = new Date();

                    // set start date to start of current month
                    startTask.setDate(1);
                    startTask.setMinutes(0);
                    startTask.setHours(0);

                    // set end date to end of current month
                    endTask.setDate(1);
                    endTask.setMonth(endTask.getMonth() + 3);
                    endTask.setDate(0);
                    endTask.setHours(23);
                    endTask.setMinutes(59);
                    
                    for (let day of task.days) {
                        if (isNaN(parseInt(day))) {
                            days.push(day);
                        } else {
                            days.push(parseInt(day));
                        }
                    }

                    this.newTask(categoryName, typeName, taskName, taskDescription, "Needs Focus Time",
                    startTask, endTask, days);
                }
            }
        }
    }

    /** create and add new Task
     * @param category string category of task
     * @param type string type of task
     * @param title string title of task
     * @param description string description of task
     * @param priority string priority of task
     * @param start Date start date of task
     * @param end Date end date of task
     * @param days Array of days when the task will repeated. takes int 
     */
    newTask(category, type, title, description, priority, start, end, days) {
        let newTask = new Task(category, type, title, description, priority, start, end, days);
        this.#allTasks.push(newTask);
    }

    /** remove task
     * @param taskRemove Task to be removed
     */
    removeTask(taskRemove) {
        for (let i = 0; i < this.#allTasks.length; i++) {
            if (sameTask(taskRemove, this.#allTasks[i])) {
                this.#allTasks.splice(i, 1);
                break;
            }
        }
    }

    /** get tasks on a particular date
     * @param date Date to get tasks
     * @return Array of tasks
     */
    getTasks(date) {
        let tasksOnDate = new Array();

        for (let i = 0; i < this.#allTasks.length; i++) {
            if (compareDates(this.#allTasks[i].start, date) < 1 && 
            compareDates(this.#allTasks[i].end, date) > -1 &&
               (this.#allTasks[i].includesDay(getWeekString(date.getDay())) || 
               this.#allTasks[i].includesDay(date.getDate()))) {
                tasksOnDate.push(this.#allTasks[i]);
            } 
        }

        tasksOnDate.sort(comparePriority);

        return tasksOnDate;
    }
}

/** compare tasks for equality
 * @param task1 Task
 * @param task2 Task
 * @return boolean whether the tasks are equal
 */
function sameTask(task1, task2) {
    return task1.category === task2.category && task1.type === task2.type && 
    task1.title === task2.title && task1.description === task2.description 
    && task1.priority === task2.priority && compareDates(task1.start, task2.start) === 0 && 
    compareDates(task1.end, task2.end) === 0;
}

/**compare dates
 * @param date1 Date
 * @param date2 Date
 * @return int how dates compare (return 1 if date1 > date2, return -1
 * if date1 < date2, return 0 if (date1 === date2)) it terms of entire dates.
 */
function compareDates(date1, date2) {
    if (date1.getFullYear() === date2.getFullYear() && 
    date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
        return 0;
    } else if (date1 < date2){
        return -1;
    } else  {
        return 1;
    } 
}

/** compare tasks
 * @param task1 Task
 * @param task2 Task
 * @return int how tasks compare (return 1 if task1 > task2, return -1
 * if task1 < task2, return 0 if (task1 == task2)). Compare priority then compare
 * start times.
 */
function comparePriority(task1, task2) {
    if (getPriorityValue(task1.priority) < getPriorityValue(task2.priority)){
        return -1;
    } else if (getPriorityValue(task1.priority) > getPriorityValue(task2.priority)) {
        return 1;
    } else {
        return compareStartTimes(task1.start, task2.start);
    }
}

/** compare start times
 * @param date1 Date
 * @param date2 Date
 * @return int how dates compare (return 1 if date1 > date2, return -1
 * if date1 < date2, return 0 if (date1 == date2)) when it comes to start times
 */
function compareStartTimes(date1, date2) {
    if (date1.getHours() > date2.getHours()) {
        return 1;
    } else if (date1.getHours() < date2.getHours()) {
        return -1;
    } else if (date1.getMinutes() < date2.getMinutes()) {
        return -1;
    } else if (date1.getMinutes() > date2.getMinutes()) {
        return 1;
    } else {
        return 0;
    }
}

/** get weekday string equivalent of a weekday index/number
 * @param weekDayNumber weekday index/number
 * @return weekday string
 */
function getWeekString(weekDayNumber) {
    switch (weekDayNumber) {
        case 0: return "sunday";
        case 1: return "monday";
        case 2: return "tuesday";
        case 3: return "wednesday";
        case 4: return "thursday";
        case 5: return "friday";
        case 6: return "saturday";
    }

    return "";
}

/** get priority value (1 (most important) - 5 (least important))
 * @param priority string priority
 */
function getPriorityValue(priority) {
    switch (priority) {
        case "Urgent": return 1;
        case "Important!": return 2;
        case "For Later": return 3;
        case "Blocked": return 4;
        case "Needs Focus Time": return 5;
    }

    return 0;
}

export {AllTasks, Task, getWeekString};