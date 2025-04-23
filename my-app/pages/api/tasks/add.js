import connectDB from '../../../lib/mongodb';
import Task from '../../../models/Task';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    await connectDB();
    const { title, description, timeSpent } = req.body;

    const newTask = new Task({ title, description, timeSpent });
    try {
      await newTask.save();
      res.status(201).json({ message: 'Task added successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
