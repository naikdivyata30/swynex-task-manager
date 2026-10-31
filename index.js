
// Application state
let tasks = JSON.parse(localStorage.getItem("swynexTasks")) || [];

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const errorMessage = document.getElementById("errorMessage");
const emptyMessage = document.getElementById("emptyMessage");

// Save tasks in browser
function saveTasks() {
    localStorage.setItem("swynexTasks", JSON.stringify(tasks));
}

// Reusable function to create task card
function createTaskCard(task) {
    const card = document.createElement("div");

    card.className = task.completed
        ? "task-card completed"
        : "task-card";

    const info = document.createElement("div");
    info.className = "task-info";

    const heading = document.createElement("h3");
    heading.textContent = task.title;

    const date = document.createElement("p");
    date.textContent = "Created: " + task.date;

    const badge = document.createElement("span");
    badge.className = "priority";
    badge.textContent = task.priority + " Priority";

    info.appendChild(heading);
    info.appendChild(date);
    info.appendChild(badge);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed
        ? "Undo"
        : "Complete";

    completeButton.addEventListener("click", function () {
        toggleTask(task.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
    });

    actions.appendChild(completeButton);
    actions.appendChild(deleteButton);

    card.appendChild(info);
    card.appendChild(actions);

    return card;
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    const selectedFilter = filter.value;

    const filteredTasks = tasks.filter(function (task) {
        if (selectedFilter === "Pending") {
            return !task.completed;
        }

        if (selectedFilter === "Completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function (task) {
        taskList.appendChild(createTaskCard(task));
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateStats();
}

// Add new task with validation
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        errorMessage.textContent = "Please enter a task!";
        taskInput.focus();
        return;
    }

    if (title.length > 100) {
        errorMessage.textContent =
            "Task must be less than 100 characters!";
        return;
    }

    errorMessage.textContent = "";

    const newTask = {
        id: Date.now(),
        title: title,
        priority: priority.value,
        completed: false,
        date: new Date().toLocaleDateString()
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
});

// Complete or undo task
function toggleTask(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

// Update task statistics
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("completedTasks").textContent = completed;
}

// Filter tasks
filter.addEventListener("change", renderTasks);

// Initial display
renderTasks();
