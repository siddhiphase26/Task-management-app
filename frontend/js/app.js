// Check authentication
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

// Display user info
const user = JSON.parse(localStorage.getItem('user'));
document.getElementById('username').textContent = `Welcome, ${user.username}`;

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

// Task Management
let editingTaskId = null;

// Load tasks
async function loadTasks(status = '') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '<div class="loading">Loading tasks...</div>';
    
    try {
        const endpoint = status ? `/tasks?status=${status}` : '/tasks';
        const data = await apiCall(endpoint);
        
        if (data.tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks found</h3>
                    <p>Start by adding a new task above!</p>
                </div>
            `;
            return;
        }
        
        taskList.innerHTML = data.tasks.map(task => `
            <div class="task-item">
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <span class="task-status status-${task.status}">${task.status}</span>
                </div>
                <p class="task-description">${escapeHtml(task.description) || 'No description'}</p>
                <div class="task-meta">
                    Created: ${new Date(task.created_at).toLocaleString()}
                </div>
                <div class="task-actions">
                    <button class="btn btn-edit" onclick="editTask(${task.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        taskList.innerHTML = `<div class="message error">Error loading tasks: ${error.message}</div>`;
    }
}

// Filter tasks
document.getElementById('statusFilter').addEventListener('change', (e) => {
    loadTasks(e.target.value);
});

// Add/Update task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    
    try {
        if (editingTaskId) {
            await apiCall(`/tasks/${editingTaskId}`, {
                method: 'PUT',
                body: JSON.stringify({ title, description, status })
            });
            editingTaskId = null;
            document.getElementById('submitBtn').textContent = 'Add Task';
            document.getElementById('cancelBtn').style.display = 'none';
        } else {
            await apiCall('/tasks', {
                method: 'POST',
                body: JSON.stringify({ title, description, status })
            });
        }
        
        document.getElementById('taskForm').reset();
        loadTasks(document.getElementById('statusFilter').value);
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Cancel edit
document.getElementById('cancelBtn').addEventListener('click', () => {
    editingTaskId = null;
    document.getElementById('taskForm').reset();
    document.getElementById('submitBtn').textContent = 'Add Task';
    document.getElementById('cancelBtn').style.display = 'none';
});

// Edit task
async function editTask(id) {
    try {
        const data = await apiCall(`/tasks/${id}`);
        const task = data.task;
        
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('status').value = task.status;
        
        editingTaskId = id;
        document.getElementById('submitBtn').textContent = 'Update Task';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        alert('Error loading task: ' + error.message);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        await apiCall(`/tasks/${id}`, {
            method: 'DELETE'
        });
        loadTasks(document.getElementById('statusFilter').value);
    } catch (error) {
        alert('Error deleting task: ' + error.message);
    }
}

// Utility function
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial load
loadTasks();