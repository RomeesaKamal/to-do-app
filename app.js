// Selecting items by class Name or Id

const newTask = document.querySelector("#newTask");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector(".task-list");
const emptyImage = document.querySelector(".empty-img");

// Select the filter buttons and delete-all button

const filters = document.querySelectorAll(".filter");
const deleteAllButton = document.querySelector(".delete-all");

// Storing Task

document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks) {
    tasks = storedTasks;
    updateTasksList();
    updatestatus();
  }
});

 // Set the default active filter to "All Tasks"
 filters.forEach((filter) => {
  if (filter.getAttribute("data-filter") === "all") {
    filter.classList.add("active");
  } else {
    filter.classList.remove("active");
  }
});


// Empty Array

let tasks = [];

// Function For Save Task

const saveTask = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function for Adding Task

const addTask = () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text: text, completed: false });
    taskInput.value = ""; // Clear input field
    updateTasksList();
    updatestatus();
    saveTask();
    showAndHideImage();
  }
};

// Function for Progress Bar
const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTasksList();
  updatestatus();
  saveTask();
};

// Function for Deleting Task

const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTasksList();
  updatestatus();
  saveTask();
  showAndHideImage();
};

// Function for Editing Task

const editTask = (index) => {
  taskInput.value = tasks[index].text;
  tasks.splice(index, 1);
  updateTasksList();
  updatestatus();
  saveTask();
};

// Update Status Function

const updatestatus = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById("progress");
  progressBar.style.width = `${progress}%`;
  document.getElementById(
    "numbers"
  ).innerText = `${completedTasks} / ${totalTasks}`;

  if (tasks.length && completedTasks === totalTasks) {
    blastConfetti();
  }
};

//  Function for Update Task List

const updateTasksList = (filter = null) => {
  taskList.innerHTML = "";  
  const filteredTasks = filter === "completed"
  ? tasks.filter(task => task.completed)
  : filter === "incomplete"
  ? tasks.filter(task => !task.completed)
  : tasks; // Show all tasks if filter is null or "all"
  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
    <div class = "taskItem">
        <div class = "task ${task.completed ? "completed" : ""}">
        <input type = "checkbox" class = "checkbox" ${
          task.completed ? "checked" : ""
        } />
        <p> ${task.text} </p>
        </div>
        <div class="icons">
            <img src="./assests/edit.svg" onClick = "editTask(${index})"/>
            <img src="./assests/bin.svg"  onClick = "deleteTask(${index})"/>
        </div>
      </div>
    `;
    listItem.addEventListener("change", () => toggleTaskComplete(index));
    updatestatus();
    taskList.append(listItem);
  });
  showAndHideImage();
};

// Filter buttons functionality

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach((btn) => btn.classList.remove("active"));
    filter.classList.add("active");
      const filterType = filter.getAttribute("data-filter");
      updateTasksList(filterType === "all" ? null : filterType);
  });
  updatestatus();

});

// Clear all tasks

deleteAllButton.addEventListener("click", () => {
  tasks = [];
  updateTasksList();
  updatestatus();
  saveTask();
  showAndHideImage();
});

// Handle Image visibility

const showAndHideImage = () => {
  emptyImage.style.display = tasks.length === 0 ? "block" : "none";
};

newTask.addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

// Function for  Blast Confetti

const blastConfetti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};


