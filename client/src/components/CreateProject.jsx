import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tasks: [{ title: '', description: '', status: 'Not Started' }], // Initial task
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTasks = [...projectData.tasks];
    updatedTasks[index] = { ...updatedTasks[index], [name]: value };
    setProjectData({ ...projectData, tasks: updatedTasks });
  };

  const addTask = () => {
    setProjectData({
      ...projectData,
      tasks: [...projectData.tasks, { title: '', description: '', status: 'Not Started' }],
    });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Project created successfully:', result);
        navigate('/home');  // Redirect to home after project is created
      } else {
        const error = await response.json();
        console.error('Error creating project:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-project-container">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={projectData.title}
          onChange={handleProjectChange}
          required
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={projectData.description}
          onChange={handleProjectChange}
          required
        />

        <h3>Tasks</h3>
        {projectData.tasks.map((task, index) => (
          <div key={index} className="task-container">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={task.title}
              onChange={(e) => handleInputChange(e, index)}
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={task.description}
              onChange={(e) => handleInputChange(e, index)}
              required
            />
            <select
              name="status"
              value={task.status}
              onChange={(e) => handleInputChange(e, index)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addTask}>
          Add Task
        </button>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
