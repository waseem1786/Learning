import connectDB from '../../../lib/mongodb';
import Task from '../../../models/Task';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    await connectDB();

    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
