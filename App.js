
function showTaskDetails(taskName, taskDate) {
    const detailsContainer = document.getElementById('taskDetails');
    const taskItem = document.querySelector('#resizableInput');
    taskItem.value = "Task: " + `${taskName}` + " Date: " + `${taskDate}`;
    
}

function addNewTask() {
    const task = prompt("Enter a new task");
    if (task) {
        addTaskToList(task);
    }
}

function addTaskToList(task) {
    const taskList = document.getElementsByClassName('list')[0]; 
    const newTask = document.createElement("li");
    newTask.innerHTML = "&#10003; " + task;
    taskList.appendChild(newTask);
}

function addTaskForDate(date) {
    const task = prompt("Enter task for " + date);
    if (task) {
        addTaskToList(task + " - " + date);
    }
}

