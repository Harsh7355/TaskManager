// routes/projects.js
const express = require('express');
const Project = require('../models/project');
const router = express.Router();
const mongoose=require('mongoose');
const verifyUser = require('../middleware/verifyuser');

// Create a new project with tasks
router.post('/projects', verifyUser, async (req, res) => {
  const { title, description, tasks } = req.body;  // Tasks will be included in the request body
  const userId = req.userId;  // Get the userId from the middleware

  try {
    // Fetch all projects for this user
    const userProjects = await Project.find({ userId });

    // Check if the user has 4 or more projects
    if (userProjects.length >= 4) {
      return res.status(400).json({ message: "You can't create more than 4 projects." });
    }

    // Create new project with tasks
    const newProject = new Project({
      userId,
      title,
      description,
      tasks,  // Tasks passed from the frontend
    });

    await newProject.save();
    res.status(201).json(newProject);  // Send back the created project
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error. Could not create project.' });
  }
});

// Get all projects for the logged-in user
router.get('/projects', verifyUser, async (req, res) => {
  const userId = req.userId;

  try {
    const projects = await Project.find({ userId });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
});

// Update a specific project for the logged-in user
router.put('/projects/:id', verifyUser, async (req, res) => {
  const userId = req.userId;
  const projectId = req.params.id;
  const updatedData = req.body;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      updatedData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
});
// Delete a specific project for the logged-in user
router.delete('/projects/:id', verifyUser, async (req, res) => {
  const userId = req.userId;
  const projectId = req.params.id;

  try {
    const project = await Project.findOneAndDelete({ _id: projectId, userId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
});

module.exports = router;
