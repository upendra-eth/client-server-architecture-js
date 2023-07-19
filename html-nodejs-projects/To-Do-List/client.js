const taskForm = document.getElementById('taskForm');
const taskTable = document.getElementById('taskTable');

// Function to fetch tasks from the server
function fetchTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskTable.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Action</th>
                </tr>
                ${tasks.map(task => `
                    <tr>
                        <td>${task.id}</td>
                        <td>${task.name}</td>
                        <td>
                            <button onclick="deleteTask(${task.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            `;
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Function to add a new task
function addTask(taskName) {
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: taskName })
    })
    .then(response => {
        if (response.status === 201) {
            fetchTasks();
        }
    })
    .catch(error => console.error('Error adding task:', error));
}

// Function to handle form submission
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim();

    if (taskName !== '') {
        addTask(taskName);
        taskInput.value = '';
    }
});

// Function to delete a task
function deleteTask(id) {
    // Implement the logic to delete a task on the server and then fetch the updated tasks
    // Use the fetch API to send a DELETE request to the server with the task ID
    // After successfully deleting the task, call fetchTasks() to refresh the table
}

// Fetch tasks when the page loads
fetchTasks();
