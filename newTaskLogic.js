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
        this.#finished.push(newDate);
        this.#finished.sort(compareDates)
    }

    removeFinished(removeDate){
        for (let i = 0; i < this.#finished.length; i++) {
            if (this.#finished[i] === removeDate) {
                this.#finished.splice(i, 1);
                break;
            }
        }
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
        let time = date.getHours();

        if (time > 12) {
            time = time - 12;
            isAm = false;
        } else if (time === 12) {
            isAm = false;
        } else if (time === 0) {
            time = 12;
            isAm = true;
        } else {
            isAm = true;
        }

        timeString = ("" + time) + ("" + date.getMinutes());
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

export {AllTasks, Task};