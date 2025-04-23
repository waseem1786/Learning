import { useState, useEffect } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, timeSpent }),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      setTimeSpent('');
      fetchTasks(); // Reload tasks
    }
  };

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks/get');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Learning Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          required
        />
        <input
          type="text"
          value={timeSpent}
          onChange={(e) => setTimeSpent(e.target.value)}
          placeholder="Time Spent"
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <h2>Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Time Spent: {task.timeSpent}</p>
            <p>Status: {task.completed ? 'Completed' : 'In Progress'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
