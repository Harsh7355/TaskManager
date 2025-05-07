import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('Not Started');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8081/api/project/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setProjectCount(data.length);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (projectCount >= 4) {
      alert("You can't create more than 4 projects.");
      return;
    }

    const newProject = {
      title,
      description,
      status,
      tasks,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8081/api/project/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const savedProject = await response.json();
        setProjects([...projects, savedProject]);
        setProjectCount(projectCount + 1);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error creating project:', errorData);
        alert('Failed to create project.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8081/api/project/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects(projects.filter(p => p._id !== projectId));
        setProjectCount(projectCount - 1);
      } else {
        console.error('Failed to delete project');
        alert('Failed to delete project.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error occurred while deleting.');
    }
  };

  const handleAddTask = () => {
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('Not Started');
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTaskTitle(taskToEdit.title);
    setTaskDescription(taskToEdit.description);
    setTaskStatus(taskToEdit.status);
    handleDeleteTask(index);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Not Started');
    setTasks([]);
  };

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        <h2>Welcome to the Home Page</h2>

        <div className="project-box bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold">Create New Project</h2>

          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                id="projectTitle"
                placeholder="Enter Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md mt-1"
              />
            </div>

            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">Project Description</label>
              <textarea
                id="projectDescription"
                placeholder="Enter Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md mt-1"
              ></textarea>
            </div>

            <div>
              <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700">Project Status</label>
              <select
                id="projectStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mt-1"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="task-management">
              <h3 className="text-lg font-semibold mt-4">Manage Tasks</h3>

              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  placeholder="Enter Task Title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mt-1"
                />
              </div>

              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Task Description</label>
                <textarea
                  id="taskDescription"
                  placeholder="Enter Task Description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mt-1"
                ></textarea>
              </div>

              <div>
                <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">Task Status</label>
                <select
                  id="taskStatus"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md mt-1"
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              

              

              <button
                type="button"
                onClick={handleAddTask}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-600"
              >
                Add Task
              </button>

              {tasks.length > 0 && (
                <div className="tasks-list space-y-2 mt-4">
                  <h4 className="font-semibold">Current Tasks</h4>
                  {tasks.map((task, index) => (
                    <div key={index} className="task-item flex justify-between items-center p-4 border border-gray-200 rounded-md">
                      <div>
                        <h5 className="font-medium">{task.title}</h5>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTask(index)}
                          className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(index)}
                          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4 ${projectCount >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={projectCount >= 4}
            >
              Create Project
            </button>
          </form>
        </div>

        <div className="projects-list mt-6">
          {projects.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Projects</h3>
              {projects.map((project, index) => (
                <div key={index} className="project-item bg-white p-4 rounded-md shadow-sm mb-4">
                  <h4 className="font-semibold">{project.title}</h4>
                  <p>{project.description}</p>
                  <p>Status: {project.status}</p>
                  <p>Tasks:</p>
                  {project.tasks.length > 0 ? (
                    <ul>
                      {project.tasks.map((task, i) => (
                        <li key={i} className="p-2">{task.title} - {task.status}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tasks available.</p>
                  )}

                  {/* 🔴 Delete Button */}
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="mt-3 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
