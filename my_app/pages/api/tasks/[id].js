import connectDB from '../../../lib/mongodb'; // Make sure you have this connection function
import Task from '../../../models/Task'; // Import Task model

const handler = async (req, res) => {
  if (req.method === 'DELETE') {
    await connectDB();

    const { id } = req.query; // Get the task ID from the query parameters

    try {
      // Delete task by ID
      const deletedTask = await Task.findByIdAndDelete(id);
      
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
