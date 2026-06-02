import React, { useState, useEffect, useContext } from 'react';
import { taskService } from '../services/task.service';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // For admin calls if needed

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'PENDING' });

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      let data;
      if (user.role === 'ADMIN') {
        const response = await api.get('/admin/tasks');
        data = response.data;
      } else {
        data = await taskService.getAllTasks();
      }
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setIsEditing(true);
      setCurrentTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status
      });
    } else {
      setIsEditing(false);
      setCurrentTask(null);
      setFormData({ title: '', description: '', status: 'PENDING' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await taskService.updateTask(currentTask.id, formData);
      } else {
        await taskService.createTask(formData);
      }
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save task', error);
      alert('Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (user.role === 'ADMIN') {
          await api.delete(`/admin/tasks/${id}`);
        } else {
          await taskService.deleteTask(id);
        }
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task', error);
        alert('Error deleting task');
      }
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>{user.role === 'ADMIN' ? 'All System Tasks' : 'My Tasks'}</h2>
        <button className="btn" style={{ width: 'auto' }} onClick={() => handleOpenModal()}>
          + Create Task
        </button>
      </div>

      <div className="task-grid">
        {tasks.length === 0 ? (
          <p>No tasks found. Create one to get started!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
              <div className="task-meta">
                <span className="task-status">{task.status.replace('_', ' ')}</span>
                <span style={{color: '#95a5a6'}}>
                  {new Date(task.createdAt).toLocaleDateString()}
                  {user.role === 'ADMIN' && ` (User: ${task.userId})`}
                </span>
              </div>
              <div className="task-actions">
                <button className="btn btn-secondary" onClick={() => handleOpenModal(task)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isEditing ? 'Edit Task' : 'Create Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="4"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                ></textarea>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn" style={{ marginTop: 0 }}>Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
