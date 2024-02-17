import data from "./tasks-example.json" assert { type: "json" };

class Task {
    #category;
    #type;
    #title;
    #description;
    #start;
    #end;
    #finished;

    // Sunday - Saturday
    #weekDays = [false, false, false, false, false, false, false];

    constructor(category, type, title, description, start, end) {
        this.#category = category;
        this.#type = type;
        this.#title = title;
        this.#description = description;
        this.#start = start;
        this.#end = end;
        this.#finished = new Array();
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

    get weekDays() {
        return this.#weekDays;
    }

    addFinished(newDate) {
        this.#finished.push(new Date(newDate));
        this.#finished.sort(compareDates)
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
        console.log(this.#finished)
        for (let i = 0; i < this.#finished.length; i++) {
            if (compareDates(this.#finished[i], findDate) === 0) {
                return true;
            }
        }

        return false;
    }

    addWeekDay(weekDay) {
        this.#weekDays[weekDay] = true;
    }

    removeWeekDay(weekDay) {
        this.#weekDays[weekDay] = false;
    }

    includesWeekDay(weekDay) {
        return this.#weekDays[weekDay];
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

function compareDates(date1, date2) {
     if (date1 < date2){
        return -1;
    } else if (date1 > date2) {
        return 1;
    } else {
        return 0;
    }
}

class AllTasks {
    #allTasks;

    constructor() {
        this.#allTasks = new Array();
    }

    test() {
        for (let taskCategory of data) {
            let categoryName = taskCategory.categoryName;
            for (let taskType of taskCategory.activityTypes) {
                let typeName = taskType.activityName;
                for (let task of taskType.Tasks) {
                    let taskName = task.taskName;
                    let taskDescription = task.taskDescription;

                    let startTask = new Date();
                    startTask.setDate(1);

                    let endTask = new Date();
                    endTask.setDate(1);
                    endTask.setMonth(endTask.getMonth() + 1);
                    endTask.setDate(0);

                    let today = new Date();

                    let weekdays = [];

                    for (let day of task.days) {
                        if (isNaN(parseInt(day))) {
                            weekdays.push(getWeekNumbers(day));
                        } else {
                            weekdays = [0, 1, 2, 3, 4, 5, 6];

                            if (parseInt(day) < today.getDate() || parseInt(day)) {
                                startTask.setMonth(startTask.getMonth() + 1);
                                endTask.setDate(1);
                                endTask.setMonth(endTask.getMonth() + 2);
                                endTask.setDate(0);
                            }

                            while (parseInt(day) > endTask.getDate()) {
                                startTask.setMonth(startTask.getMonth() + 1);
                                endTask.setDate(1);
                                endTask.setMonth(endTask.getMonth() + 2);
                                endTask.setDate(0);
                            }


                            startTask.setDate(parseInt(day));
                            endTask.setDate(parseInt(day));

                            break;
                        }

                        
                    }

                    startTask.setMinutes(0);
                    startTask.setHours(0);
                    endTask.setHours(23);
                    endTask.setMinutes(59);

                    console.log(taskName);
                    console.log(startTask);
                    console.log(endTask);

                    this.newTask(categoryName, typeName, taskName, taskDescription, startTask,
                        endTask, weekdays);
                }
               
            }
        }

        console.log(this.#allTasks);
    }

    save() {
        
    }

    initialize() {
        let savedTasksString = localStorage.getItem("everyTask");

        // if the data exists
        if (savedTasksString !== null) {
            let savedTasks = JSON.parse(savedTasksString);

            
        } else {
            this.#getExampleData();
        }
    }

    #getExampleData() {
        console.log(data);

        for (let taskCategory of data) {
            let categoryName = taskCategory.categoryName;

            for (let taskType of taskCategory.activityTypes) {
                let typeName = taskType.activityName;

                for (let task of taskType.Tasks) {
                    let taskName = task.taskName;
                    let taskDescription = task.taskDescription;
                    let startTask = new Date();
                    startTask.setDate(1);

                    let endTask = new Date();
                    endTask.setDate(1);
                    endTask.setMonth(endTask.getMonth() + 1);
                    endTask.setDate(0);

                    let today = new Date();

                    let weekdays = [false, false, false, false, false, false, false];

                    console.log(taskName);
                    
                    for (let day of task.days) {
                        if (isNaN(parseInt(day))) {
                            weekdays[getWeekNumbers(day)] = true;
                        } else {
                            weekdays = [true, true, true, true, true, true, true];

                            if (parseInt(day) < today.getDate() || parseInt(day)) {
                                startTask.setMonth(startTask.getMonth() + 1);
                                endTask.setDate(1);
                                endTask.setMonth(endTask.getMonth() + 1);
                                endTask.setDate(0);
                            }

                            while (parseInt(day) > endTask.getDate()) {
                                startTask.setMonth(startTask.getMonth() + 1);
                                endTask.setDate(1);
                                endTask.setMonth(endTask.getMonth() + 1);
                                endTask.setDate(0);
                            }

                            startTask.setDate(parseInt(day));
                            startTask.setMinutes(0);
                            startTask.setHours(0);
                            endTask.setDate(parseInt(day));
                            endTask.setMinutes(23);
                            endTask.setHours(59);

                            break;
                        }
                    }

                    this.newTask(categoryName, typeName, taskName, taskDescription, startTask,
                        endTask, weekdays);
                }
            }
        }

        console.log(this.#allTasks);
    }



    newTask(category, type, title, description, start, end, weekDays) {
        let newTask = new Task(category, type, title, description, start, end);

        for (let i = 0; i < weekDays.length; i++) {
            newTask.addWeekDay(weekDays[i]);
        }

        this.#allTasks.push(newTask);
        this.#allTasks.sort(compareTasks);
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
            if (this.#allTasks[i].start <= date && this.#allTasks[i].end >= date) {
                tasksOnDate.push(this.#allTasks[i]);
            } else if (this.#allTasks[i].start > date) {
                break;
            }
        }

        return tasksOnDate;
    }
}

function compareTasks(task1, task2) {
    return compareDates(task1.start, task2.start);
}

function sameTask(task1, task2) {
    return task1.category === task2.category && task1.type === task2.type && 
    task1.title === task2.title && task1.description === task2.description 
    && task1.start === task2.start && task1.end === task2.end;
}

function getWeekNumbers(weekDayNumber) {
    switch (weekDayNumber) {
        case "sunday": return 0;
        case "monday": return 1;
        case "tuesday": return 2;
        case "wednesday": return 3;
        case "thursday": return 4;
        case "friday": return 5;
        case "saturday": return 6;
    }

    return -1;
}

export {AllTasks, Task};