import data from "./tasks-example.json" assert { type: "json" };

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

    get category() {
        return this.#category;
    }

    get type() {
        return this.#type;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get priority() {
        return this.#priority;
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get startTime() {
        return this.#convertTime(this.#start);
    }

    get endTime() {
        return this.#convertTime(this.#end);
    }

    get days() {
        return this.#days;
    }

    get finished() {
        return this.#finished;
    }

    addFinished(newDate) {
        this.#finished.push(new Date(newDate));
        this.#finished.sort(compareDates);
    }

    removeFinished(removeDate){
        for (let i = 0; i < this.#finished.length; i++) {
            if (compareDates(this.#finished[i], removeDate) === 0) {
                this.#finished.splice(i, 1);
                break;
            }
        }
    }

    isFinished(findDate) {
        for (let i = 0; i < this.#finished.length; i++) {
            if (compareDates(this.#finished[i], findDate) === 0) {
                return true;
            }
        }

        return false;
    }

    includesDay(day) {
        return this.#days.has(day);
    }

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


class AllTasks {
    #allTasks;

    constructor() {
        this.#allTasks = new Array();
    }

    save() {
        let allTaskSave = new Array();

        for (let task of this.#allTasks) {
            allTaskSave.push(this.#createSavableObject(task));
        }

        localStorage.setItem("everyTask", JSON.stringify(allTaskSave));
    }

    // store all task data into an object
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

    #createSavableDays(days) {
        let savableDays = new Array();

        for (let day of days) {
            savableDays.push(day);
        }

        return savableDays;
    }

    #createSavableFinished(dates) {
        let finishedArray = new Array();

        for (let date of dates) {
            finishedArray.push(this.#createSavableDate(date));
        }

        return finishedArray;
    }

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

    initialize() {
        let savedTasksString = localStorage.getItem("everyTask");

        // if the data exists
        if (savedTasksString !== null) {
            let savedTasks = JSON.parse(savedTasksString);

            for (let savedTask of savedTasks) {
                this.#allTasks.push(this.getTaskData(savedTask));
            }
            
        } else {
            this.#getExampleData();
        }
    }

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

    getDate(date) {
        let dateObject = new Date(date.year, date.month, date.day, date.hour, date.minute);

        return dateObject;
    }

    #getExampleData() {
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

                    startTask.setDate(1);
                    startTask.setMinutes(0);
                    startTask.setHours(0);

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

    newTask(category, type, title, description, priority, start, end, days) {
        let newTask = new Task(category, type, title, description, priority, start, end, days);
        this.#allTasks.push(newTask);
    }

    removeTask(taskRemove) {
        for (let i = 0; i < this.#allTasks.length; i++) {
            if (sameTask(taskRemove, this.#allTasks[i])) {
                this.#allTasks.splice(i, 1);
                break;
            }
        }
    }

    getTasks(date) {
        let tasksOnDate = new Array();

        for (let i = 0; i < this.#allTasks.length; i++) {
            if (this.#allTasks[i].start <= date && this.#allTasks[i].end >= date &&
               (this.#allTasks[i].includesDay(getWeekString(date.getDay())) || 
               this.#allTasks[i].includesDay(date.getDate()))) {
                tasksOnDate.push(this.#allTasks[i]);
            } 
        }

        tasksOnDate.sort(comparePriority);

        return tasksOnDate;
    }
}

function sameTask(task1, task2) {
    return task1.category === task2.category && task1.type === task2.type && 
    task1.title === task2.title && task1.description === task2.description 
    && task1.priority === task2.priority && compareDates(task1.start, task2.start) === 0 && 
    compareDates(task1.end, task2.end) === 0;
}

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

function comparePriority(task1, task2) {
    if (getPriorityValue(task1.priority) < getPriorityValue(task2.priority)){
        return -1;
    } else if (getPriorityValue(task1.priority) > getPriorityValue(task2.priority)) {
        return 1;
    } else {
        return compareStartTimes(task1.start, task2.start);
    }
}

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

export {AllTasks, Task};