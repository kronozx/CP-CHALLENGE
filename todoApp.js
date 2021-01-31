const input = document.querySelector('#task-input');
const inputButton = document.querySelector('#task-submit-button');
const newTask = document.querySelector('#new-task');
const tasksCompleteDiv = document.querySelector('.tasks-complete');
const tasksUl = document.querySelector('.tasks-list');
// ----Modal Elements--------
const modalBackground = document.querySelector('.modal-background');
const modalButton = document.querySelector('#modal-button');
const dismissModalBtn = document.querySelector('.dismiss-modal');
const clearModalBtn = document.querySelector('#modal-clear-button');
let numberOfTasksCompleted = document.querySelector('#tasks-completed-num');
let taskModalSpan = document.querySelector('#task-modal-span');
// ----Achievements Elements-------------
const myAchievements = document.querySelector('.my-achievements');
const modalAchievementsBg = document.querySelector('.modal-achievements-background');
const modalAchievementsBtn = document.querySelector('#modal-achievements-button');
const modalAchievementsClearBtn = document.querySelector('#modal-achievements-clear-button');
// ----- Dark Mode Elements ------------------
const darkModeSwitch = document.querySelector('.dark-mode-switch');

window.onload = () => {
    getTasksFromLocal();
    if (localStorage['completedTasks']) {
        updateNumTasks();
        myAchievements.classList.add('my-achievements-visible');
    }
}

inputButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (input.value) {
        addTask();
    }
});

tasksUl.addEventListener("click", actionsTask);
// Modal Listeners - Completed Tasks
modalButton.addEventListener("click", dismissModal);
dismissModalBtn.addEventListener("click", dismissModal);
clearModalBtn.addEventListener("click", clearCompletedTasks);
// Modal Listeners - Achievements
myAchievements.addEventListener("click", displayAchievements);
modalAchievementsBtn.addEventListener("click", dismissAchievementsModal);
modalAchievementsClearBtn.addEventListener("click", clearAchievements);
// Dark Mode Listener
darkModeSwitch.addEventListener("click", darkMode);

function addTask() {
    const task = input.value;
    // Create todo Div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    // Create LI inside todoDiv
    const todoLi = document.createElement('li');
    todoLi.classList.add('todo-item');
    todoLi.innerText = `${task}`;
    todoDiv.appendChild(todoLi); 
    // Save Task to Local Storage
    saveTasksLocal(task);
    // Create Mark as Complete Button
    const completedBtn = document.createElement('button');
    completedBtn.innerHTML = '<i class="fas fa-check"></i>';
    completedBtn.classList.add('complete-btn');
    todoDiv.appendChild(completedBtn);
    // Create Edit Button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="far fa-edit"></i>';
    editBtn.classList.add('edit-btn');
    todoDiv.appendChild(editBtn); 
    // Create Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i';
    deleteBtn.classList.add('delete-btn');
    todoDiv.appendChild(deleteBtn); 

    tasksUl.appendChild(todoDiv);
    // Animate Div
    setTimeout(function() {
        todoDiv.classList.add('show');
        console.log(todoDiv.className); 
      }, 10);
    // Reset Input to ''
    input.value = '';
}

function actionsTask(e) {
    const elemClicked = e.target;
    let parentElem = elemClicked.parentElement;
    // Delete Task
    if (elemClicked.classList[0] === "delete-btn") {
        parentElem.classList.add('fade');
        // Remove task from LocalStorage
        removeTasksFromLocal(parentElem);
        // Remove task after animation
        parentElem.addEventListener('transitionend', function() {
            parentElem.remove();
        });
    }

    // Complete Task
    if (elemClicked.classList[0] === "complete-btn") {
        let liContent = parentElem.children[0].innerText;
        parentElem.classList.add('completed');
        // Remove Completed Task from localStorage['tasks']
        removeTasksFromLocal(parentElem);
        // Save task to LocalStorage into completedTasks array
        addCompleteTasksToLocal(liContent);
        parentElem.addEventListener('transitionend', function() {
            parentElem.remove();
            displayModal();
            updateNumTasks();
            myAchievementsOnOff();
        });
    }

    // Edit Task
    if (elemClicked.classList[0] === "edit-btn") {
        const liContent = parentElem.children[0].innerText;
        // Hide Items when editing with display: none
        let li = parentElem.children[0];
        let completedButton = parentElem.children[1];
        let editButton = parentElem.children[2];
        let deleteButton = parentElem.children[3];
        li.style.display = "none";
        completedButton.style.display = "none";
        editButton.style.display = "none";
        deleteButton.style.display = "none";
        const editForm = document.createElement('form');
        editForm.classList.add('editForm');
        const inputEdit = document.createElement('input');
        inputEdit.value = liContent;
        const inputEditBtn = document.createElement('button');
        inputEditBtn.innerHTML = `<i class="far fa-edit"></i>`;
        inputEditBtn.addEventListener('click', editTask);
        editForm.appendChild(inputEdit);
        editForm.appendChild(inputEditBtn);
        parentElem.appendChild(editForm);
        // Place cursor at the end of the edit input
        // Set focus on the edit input
        inputEdit.focus();

    }
}

function editTask(e) {
    e.preventDefault();
    // Get Form Element which is parent of edit task button
    const parentEditBtn = this.parentElement;
    // Get task edited value from input 
    const inputEditElem = parentEditBtn.children[0];
    const taskEdited = inputEditElem.value; 
    // Get li to change value of current task
    const formParentElem = parentEditBtn.parentElement;
    // Restore li and Buttons
    let taskToEdit = formParentElem.children[0];
    let completedBtn = formParentElem.children[1];
    let editBtn = formParentElem.children[2];
    let deleteBtn = formParentElem.children[3];
    taskToEdit.style.display = 'flex';
    completedBtn.style.display = 'flex';
    editBtn.style.display = 'flex';
    deleteBtn.style.display = 'flex';
    let taskCurrentValue = taskToEdit.innerText;
    taskToEdit.innerText = taskEdited;
    // Remove Edit Form
    parentEditBtn.remove();
    // Save task changes on LocalStorage
    editTaskInLocalStorage(taskCurrentValue, taskEdited);  
} 

function saveTasksLocal(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocal() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task) {
            // Create todo Div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        todoDiv.classList.add('show');
        // Create LI inside todoDiv
        const todoLi = document.createElement('li');
        todoLi.classList.add('todo-item');
        todoLi.innerText = task;
        todoDiv.appendChild(todoLi); 
        // Create Mark as Complete Button
        const completedBtn = document.createElement('button');
        completedBtn.innerHTML = '<i class="fas fa-check"></i>';
        completedBtn.classList.add('complete-btn');
        todoDiv.appendChild(completedBtn);
        // Create Edit Button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="far fa-edit"></i>';
        editBtn.classList.add('edit-btn');
        todoDiv.appendChild(editBtn); 
        // Create Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i';
        deleteBtn.classList.add('delete-btn');
        todoDiv.appendChild(deleteBtn); 

        tasksUl.appendChild(todoDiv);
    });
}

function removeTasksFromLocal(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    const taskIndex = task.children[0].innerText;
    tasks.splice(tasks.indexOf(taskIndex), 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addCompleteTasksToLocal(task) {
    let completedTasks;
    if (localStorage.getItem('completedTasks') === null) {
        completedTasks = [];
    } else {
        completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    }
    completedTasks.push(task);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function editTaskInLocalStorage(task, editedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskToEditIndex = tasks.indexOf(task);
    tasks[taskToEditIndex] = editedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayModal() {
    modalBackground.classList.add('background-active');
}

function dismissModal() {
    modalBackground.classList.remove('background-active');
    myAchievementsOnOff();
}
// Find number of tasks to edit spans in Modal
function updateNumTasks() {
    // Parse completedTasks
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    let numTasks = completedTasks.length;        
    numberOfTasksCompleted.innerText = '';
    taskModalSpan.innerText = '';

    if (numTasks === 1) {
        taskModalSpan.innerText = ' task ';
    } else {
        taskModalSpan.innerText = ' tasks ';
    }
    numberOfTasksCompleted.innerText = numTasks;
    const modalUl = document.querySelector('#modal-ul');
    modalUl.innerText = '';
    // Append li's to Modal ul
    completedTasks.forEach(function(task) {
    const modalLi = document.createElement('li');
    modalLi.classList.add('modal-li');
    modalLi.innerHTML = `<i class="fas fa-flag-checkered"></i>${task}`;
    modalUl.appendChild(modalLi); 
    });    
}

function clearCompletedTasks() {
    // Clear localStorage completedTasks
    localStorage.removeItem('completedTasks');
    console.log(localStorage);
    dismissModal();
    myAchievementsOnOff();
}

function myAchievementsOnOff() {
    if (localStorage['completedTasks']) {
        myAchievements.classList.add('my-achievements-visible');    
    } else {
        myAchievements.classList.remove('my-achievements-visible');
    }
}

function displayAchievements() {
    modalAchievementsBg.classList.add('modal-achievements-bg-active');
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
    const modalAchievementsUl = document.querySelector('#modal-achievements-ul');
    modalAchievementsUl.innerText = '';
    // Append li's to Modal Achievements ul
    completedTasks.forEach(function(task) {
    const modalAchievementsLi = document.createElement('li');
    modalAchievementsLi.classList.add('modal-achievements-li');
    modalAchievementsLi.innerHTML = `<i class="fas fa-flag-checkered"></i>${task}`;
    modalAchievementsUl.appendChild(modalAchievementsLi); 
    });
}

function dismissAchievementsModal() {
    modalAchievementsBg.classList.remove('modal-achievements-bg-active');
}

function clearAchievements() {
    console.log("clearAchievements() called");
    localStorage.removeItem('completedTasks');
    console.log(localStorage);
    dismissAchievementsModal();
    myAchievementsOnOff();
}

// Dark Mode
function darkMode() {
    document.body.classList.toggle('dark');
}