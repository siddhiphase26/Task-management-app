const db = require('../config/db');

// GET all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query; // For filtering bonus
        
        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        let params = [userId];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [tasks] = await db.execute(query, params);
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET single task
exports.getTaskById = async (req, res) => {
    try {
        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        
        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        res.json({ success: true, task: tasks[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.user.id;
        
        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }
        
        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
            [userId, title, description || '', status || 'pending']
        );
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            taskId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const { id } = req.params;
        
        const [result] = await db.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, status, id, req.user.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        res.json({ success: true, message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE task
exports.deleteTask = async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};