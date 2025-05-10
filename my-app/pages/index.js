import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid'; // Import TrashIcon for delete

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // For the custom delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); // Track the task being deleted

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('/api/tasks/get');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Delete Task
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskToDelete._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchTasks(); // Reload tasks after deletion
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
      } else {
        alert('Failed to delete task. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmation = (task) => {
    setTaskToDelete(task); // Set the task to be deleted
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  // Close delete confirmation modal
  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null); // Reset task to delete
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <a href="#" className="flex items-center">
            <img src="/logo.jpg" alt="Learning Tracker" className="h-12 w-12 mr-3 rounded-full shadow-lg" />
            <span className="text-4xl font-bold text-green-900 tracking-tight">Learning Tracker</span>
          </a>
          <div className="flex gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search Tasks..."
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Add Task Button */}
            <button
              type="button"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Task
            </button>
          </div>
        </header>

        {/* Task Table */}
        <div className="overflow-hidden bg-white shadow-xl rounded-xl">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Description</th>
                <th className="px-6 py-4 text-left">Time Spent</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={task._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-200 transition duration-300 cursor-pointer`}>
                  <td className="px-6 py-4 font-medium text-gray-800">{task.title}</td>
                  <td className="px-6 py-4 text-gray-600">{task.description}</td>
                  <td className="px-6 py-4 text-gray-700">{task.timeSpent} min</td>
                  <td className="px-6 py-4 text-gray-700">
                    <button
                      onClick={() => openDeleteConfirmation(task)} // Open the confirmation modal
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Custom Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-red-600 mb-6 text-center">Delete Task</h3>
              <p className="text-center text-gray-700">Are you sure you want to delete this task?</p>
              <div className="flex justify-center gap-6 pt-4">
                <button
                  type="button"
                  onClick={closeDeleteConfirmation} // Close the confirmation modal
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete} // Confirm deletion
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
