class Task {
    #category;
    #type;
    #title;
    #description;
    #start;
    #end;
    #finished;

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

class StandardTask extends Task {
    constructor(category, type, title, description, start, end) {
        super(category, type, title, description, start, end);
    }
}

class DailyTask extends Task {
    #weekDays = [false, false, false, false, false, false, false];

    constructor(category, type, title, description, start, end) {
        super(category, type, title, description, start, end);
    }

    addWeekDay(weekDay) {
        this.#weekDays[weekDay] = true;
    }

    removeWeekDay(weekDay) {
        this.#weekDays[weekDay] = false;
    }
}