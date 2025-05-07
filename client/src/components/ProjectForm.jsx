// components/ProjectForm.jsx
import { useState } from 'react';

export default function ProjectForm({ onCreate, projectCount }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not Started');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (projectCount >= 4) {
      alert("You can't create more than 4 projects.");
      return;
    }

    const newProject = {
      title,
      description,
      status,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    onCreate(newProject);
    setTitle('');
    setDescription('');
    setStatus('Not Started');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md space-y-4 w-full max-w-md">
      <h2 className="text-xl font-semibold">Create New Project</h2>

      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full p-2 border rounded"
      ></textarea>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option>Not Started</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

      <button
        type="submit"
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
          projectCount >= 4 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={projectCount >= 4}
      >
        Create Project
      </button>
    </form>
  );
}
