const tasks = [
  {
    categoryName: "ROUTINE ACTIVITIES",
    activityTypes: [
      {
        activityName: "Projects",
        Tasks: [
          {
            taskName: "Update Recipes Project Backlog",
            taskDescription: "",
            days: ["monday"],
          },
          {
            taskName: "Update The dailyTasks sheet with the backlog tasks",
            taskDescription: "add the filtering feature to Done",
            days: ["monday"],
          },
        ],
      },
      {
        activityName: "Blog Posts",
        Tasks: [
          {
            taskName: "Publish The recent Blog Post Draft to hashnode",
            taskDescription: "",
            days: ["friday"],
          },
          {
            taskName: "Write a New headline in a Blog Post Draft",
            taskDescription: "",
            days: [
              "saturday",
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
            ],
          },
        ],
      },
    ],
  },
  {
    categoryName: "STUDYING",
    activityTypes: [
      {
        activityName: "Node Js Course",
        Tasks: [
          {
            taskName: "Plan The Node Js Course Progress By Month",
            taskDescription:
              "Set Up A Plan For The Next Month Of Node Js Learning",
            days: ["1"],
          },
          {
            taskName: "Study The First Node Js Lecture",
            taskDescription: "",
            days: ["2"],
          },
        ],
      },
      {
        activityName: "MongoDB",
        Tasks: [
          {
            taskName: "Plan The MongoDB Course Progress By Month",
            taskDescription:
              "Set Up A Plan For The Next Month Of Node Js Learning",
            days: ["30"],
          },
          {
            taskName: "Study The First MongoDB Lecture",
            taskDescription: "",
            days: ["15"],
          },
        ],
      },
    ],
  },
  {
    categoryName: "DAILY TASKS PROJECT",
    activityTypes: [
      {
        activityName: "Backlog",
        Tasks: [
          {
            taskName: "Add The New Features list",
            taskDescription: "",
            days: ["monday"],
          },
          {
            taskName: "Add The New PRs To InReview",
            taskDescription: "",
            days: ["7"],
          },
        ],
      },
      {
        activityName: "Coding",
        Tasks: [
          {
            taskName: "Work On The Sidebar",
            taskDescription: "Add The Sections Links",
            days: ["thursday"],
          },
          {
            taskName: "Refactor The Filtering Feature Code",
            taskDescription: "",
            days: ["friday"],
          },
        ],
      },
    ],
  },
  {
    categoryName: "CHINGU",
    activityTypes: [
      {
        activityName: "Voyage",
        Tasks: [
          {
            taskName: "Conduct The Project Planning Meeting",
            taskDescription:
              "Conduct The Project Planning Meeting To Discuss Our Ideas",
            days: ["monday"],
          },
          {
            taskName: "Create The UI/UX Design For The DailyTasks Project",
            taskDescription:
              "Create The UI/UX Design For The DailyTasks Project Based On The Team Discussion",
            days: ["monday", "tuesday", "wednesday"],
          },
        ],
      },
      {
        activityName: "Pair Programming",
        Tasks: [
          {
            taskName: "Create When2Meet Link",
            taskDescription: "Create When2Meet Link To Introduce Yourselves",
            days: ["thursday"],
          },
          {
            taskName: "Attend The Introduction Meeting With Someone",
            taskDescription: "",
            days: ["thursday"],
          },
        ],
      },
    ],
  },
];

const test = (t) => {
  try {
    console.log(t);
  } catch (error) {
    console.log(error);
  }
};

function hideAll() {

}

function showAdd() {
  console.log("inside showAdd");
  const addForm = document.getElementsByClassName("addForm");
  const show = ()=>addForm[0].style.visibility = "visible";
  show(addForm);

}

const showEdit = () => {
  console.log("edit button clicked");
};

const showDelete = () => {
  console.log("delete button clicked");
};

function addTask() {
  console.log("inside task note");
  save();
}

function form(){
  const name = document.getElementById("tname").value;
  const note = document.getElementById("tnote").value;
  const date = "01/19/2024";
  const time = "10:18PM";
  addElement(name, note, date, time);
};

function save(){
  console.log("save button clicked");
  form();
};

function addElement(name,note,date,time) {
  console.log("inside add element function");
  
  const data1 = 
        "<h1 class='card-title'>"+`${name}`+
        "</h1><p class='card-text'>"+`${note}`+
        "</p><p class='card-text'>"+`${date}`+
        "</p><p class='card-text'>"+`${time}`+
        "</p>";

  const data2 = 
  "<h1 class='card-title'>"+`${name} ${date} ${time}`+
  "</h1><p class='card-text'>"+`${note}`+"</p>";

  const [tasksDiv] = document.getElementsByClassName('tasks');
  const card = document.createElement('div');
  card.className = "card";
  tasksDiv.appendChild(card);

  const cardBody = document.createElement('div');
  cardBody.className = "card-body";
  card.appendChild(cardBody);
  card.innerHTML = data2;

}

/*
try{
	//get root div id
	const root = document.getElementById("root");
	//insert text to root div
	root.innerHTML = "Catagory Names:";
	//append new element to root div function
	const genElement = (element)=> root.appendChild(element);
	//get all tasks object
	const getTasks = ()=> tasks.slice().map((t)=> t.categoryName);
	const categoryName = getTasks();
	//console.log(categoryName);
	//get task per index
	const getTask = (id)=> getTasks()[id];
	//iterate through each index catagory name and lower case
	const categoryNames = categoryName.map((t)=> '<li>' + `${t.categoryName.toLowerCase()}` + '</li>');
	//console.log(categoryNames);
	//generate new div element
	const tasksClass = document.createElement("ul");
	//append class name to new div tag
	tasksClass.className = 'tasksClass';
	//apply catagory names to div element
	tasksClass.innerHTML = categoryNames;
	//render the element on the page
	//genElement(tasksClass);
	
	
	// function generateTaskElement(){
	// 	console.log('inside generateTaksElement function');
	// }
	
	

}catch(error){
	console.log(error)
};
*/
