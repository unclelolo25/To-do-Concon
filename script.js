document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    loadTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = ''; // Clear input after adding
        }
    });

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

    function addTask(text) {
        const id = Date.now().toString();
        const task = { id, text, completed: false };
        saveTask(task);
        renderTask(task);
        Swal.fire({
            title: 'Task Added!',
            text: 'Your task has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => renderTask(task));
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.text}</span>
            <div>
                <button class="edit-btn btn btn-warning btn-sm">Edit</button>
                <button class="delete-btn btn btn-danger btn-sm">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function deleteTask(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                let tasks = getTasks();
                tasks = tasks.filter(task => task.id !== id);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                document.querySelector(`li[data-id="${id}"]`).remove();
                Swal.fire(
                    'Deleted!',
                    'Your task has been deleted.',
                    'success'
                );
            }
        });
    }

    function editTask(id) {
        Swal.fire({
            title: 'Edit task',
            input: 'text',
            inputValue: document.querySelector(`li[data-id="${id}"] span`).textContent,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const newText = result.value;
                if (newText) {
                    let tasks = getTasks();
                    tasks = tasks.map(task => task.id === id ? { ...task, text: newText } : task);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    document.querySelector(`li[data-id="${id}"] span`).textContent = newText;
                    Swal.fire(
                        'Updated!',
                        'Your task has been updated.',
                        'success'
                    );
                }
            }
        });
    }

    function toggleTaskCompletion(id) {
        let tasks = getTasks();
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const taskElement = document.querySelector(`li[data-id="${id}"]`);
        const checkbox = taskElement.querySelector('.checkbox');
        const text = taskElement.querySelector('span');

        if (checkbox.checked) {
            text.style.textDecoration = 'line-through';
        } else {
            text.style.textDecoration = 'none';
        }
    }
});
