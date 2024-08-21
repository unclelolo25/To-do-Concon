document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Load and display tasks on initial load
    loadTasks();

    // Event listener for adding a new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = ''; // Clear input after adding
        }
    });

    // Event delegation for task actions
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const taskId = target.closest('li').dataset.id;

        if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('edit-btn')) {
            editTask(taskId);
        } else if (target.classList.contains('checkbox')) {
            toggleTaskCompletion(taskId);
        }
    });

    // Function to add a task
    function addTask(text) {
        const id = Date.now().toString();
        const task = { id, text, completed: false };
        saveTask(task);
        renderTask(task);
    }

    // Function to save a task to local storage
    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to get tasks from local storage
    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // Function to load and display tasks from local storage
    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => renderTask(task));
    }

    // Function to render a task item
    function renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.classList.toggle('completed', task.completed);
        li.innerHTML = `
            <div class="checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
            </div>
            <span>${task.text}</span>
            <div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    // Function to delete a task
    function deleteTask(id) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.querySelector(`li[data-id="${id}"]`).remove();
    }

    // Function to edit a task
    function editTask(id) {
        const newText = prompt('Edit task:');
        if (newText) {
            let tasks = getTasks();
            tasks = tasks.map(task => task.id === id ? { ...task, text: newText } : task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            const taskItem = document.querySelector(`li[data-id="${id}"]`);
            taskItem.querySelector('span').textContent = newText;
        }
    }

    // Function to toggle task completion
    function toggleTaskCompletion(id) {
        let tasks = getTasks();
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const taskItem = document.querySelector(`li[data-id="${id}"]`);
        taskItem.classList.toggle('completed', tasks.find(task => task.id === id).completed);
        taskItem.querySelector('.checkbox input').checked = tasks.find(task => task.id === id).completed;
    }
});
