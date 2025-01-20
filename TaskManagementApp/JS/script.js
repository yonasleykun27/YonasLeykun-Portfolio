const tasks = [];

// Set the minimum date for start and end date inputs
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').setAttribute('min', today);
    document.getElementById('end-date').setAttribute('min', today);
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === '12345') {
        document.getElementById('login-page').style.display = 'none';
        document.querySelector('.task-container').style.display = 'block';
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

document.getElementById('add-task-button').addEventListener('click', function () {
    document.getElementById('add-task-form').style.display = 'block';
});

document.getElementById('save-task').addEventListener('click', function () {
    const taskName = document.getElementById('task-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const progressStatus = document.getElementById('progress-status').value;
    const priority = document.getElementById('priority').value;

    if (!taskName.trim()) {
        alert('Task Name is mandatory.');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('End date must be after or equal to the start date.');
        return;
    }

    const task = {
        name: taskName,
        startDate,
        endDate,
        progress: progressStatus,
        priority,
    };

    tasks.push(task);
    updateTaskList();
    clearForm();
});

document.getElementById('priority-filter').addEventListener('change', function () {
    updateTaskList();
});

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    const taskListHeading = document.getElementById('task-list-heading');
    const filter = document.getElementById('priority-filter').value;
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => filter === 'All' || task.priority === filter);

    if (filteredTasks.length === 0) {
        taskListHeading.style.display = 'none';
        return;
    }

    taskListHeading.style.display = 'block';

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        filteredTasks.forEach((task, index) => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <h3>${task.name}</h3>
                <p><strong>Start Date:</strong> ${task.startDate}</p>
                <p><strong>End Date:</strong> ${task.endDate}</p>
                <p><strong>Progress:</strong> 
                    <span class="status ${task.progress.replace(' ', '')}">${task.progress}</span>
                </p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <button onclick="changeProgress(${index}, event)">Change Progress</button>
                ${task.progress === 'Finished' ? `<button class="delete-btn" onclick="deleteTask(${index})">Delete</button>` : ''}
            `;
            taskList.appendChild(card);
        });
    } else {
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Task Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Progress</th>
                    <th>Priority</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTasks
                    .map(
                        (task, index) => `
                    <tr>
                        <td>${task.name}</td>
                        <td>${task.startDate}</td>
                        <td>${task.endDate}</td>
                        <td><span class="status ${task.progress.replace(' ', '')}">${task.progress}</span></td>
                        <td>${task.priority}</td>
                        <td>
                            <button onclick="changeProgress(${index}, event)">Change Progress</button>
                            ${
                                task.progress === 'Finished'
                                    ? `<button class="delete-btn" onclick="deleteTask(${index})">Delete</button>`
                                    : ''
                            }
                        </td>
                    </tr>
                `
                    )
                    .join('')}
            </tbody>
        `;
        taskList.appendChild(table);
    }
}

function clearForm() {
    document.getElementById('task-name').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('progress-status').value = 'Not Started';
    document.getElementById('priority').value = 'Low';
    document.getElementById('add-task-form').style.display = 'none';
}

function changeProgress(taskIndex, event) {
    event.stopPropagation(); // Stop any bubbling event that might cause scrolling

    const task = tasks[taskIndex];
    task.progress = task.progress === 'Not Started' ? 'Started' : task.progress === 'Started' ? 'Finished' : 'Not Started';
    updateTaskList();
}

function deleteTask(taskIndex) {
    tasks.splice(taskIndex, 1);
    updateTaskList();
}
