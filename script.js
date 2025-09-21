const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");
const addBtn = document.getElementById("addBtn");

// Load tasks on start
window.onload = () => {
  let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.forEach(task =>
    renderTask(task.text, task.completed, task.date, task.priority)
  );
};

// Add Task
addBtn.addEventListener("click", () => {
  let text = taskInput.value.trim();
  let date = taskDate.value;
  let priority = taskPriority.value;

  if (text === "") return;

  renderTask(text, false, date, priority);
  saveTasks();

  taskInput.value = "";
  taskDate.value = "";
});

// Render Task
function renderTask(text, isCompleted, date, priority) {
  let li = document.createElement("li");
  li.classList.add(priority);
  if (isCompleted) li.classList.add("completed");

  // Task info (text + date)
  let taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");

  let taskText = document.createElement("span");
  taskText.textContent = text;

  let taskDateEl = document.createElement("span");
  taskDateEl.classList.add("task-date");
  taskDateEl.textContent = date ? date : "No Date";

  taskInfo.appendChild(taskText);
  taskInfo.appendChild(taskDateEl);

  // Actions
  let actions = document.createElement("div");
  actions.classList.add("actions");

  // Edit
  let editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.onclick = () => {
    let newText = prompt("Edit task:", taskText.textContent);
    if (newText) {
      taskText.textContent = newText;
      saveTasks();
    }
  };

  // Complete
  let completeBtn = document.createElement("button");
  completeBtn.innerHTML = "✔️";
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    if (li.classList.contains("completed")) {
      completedList.appendChild(li);
    } else {
      taskList.appendChild(li);
    }
    saveTasks();
  };

  // Delete
  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "❌";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  actions.append(editBtn, completeBtn, deleteBtn);
  li.append(taskInfo, actions);

  if (isCompleted) {
    completedList.appendChild(li);
  } else {
    taskList.appendChild(li);
  }
}

// Save to LocalStorage
function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#taskList li, #completedList li").forEach(li => {
    tasks.push({
      text: li.querySelector(".task-info span").textContent,
      date: li.querySelector(".task-date").textContent !== "No Date"
        ? li.querySelector(".task-date").textContent
        : "",
      priority: li.classList.contains("high")
        ? "high"
        : li.classList.contains("medium")
        ? "medium"
        : "low",
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
