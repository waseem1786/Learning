import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // Import XMarkIcon from Heroicons v2

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // Track selected task
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State for details modal visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  // Add new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader when submitting

    const newTask = { title, description, timeSpent };
    try {
      const res = await fetch('/api/tasks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setTimeSpent('');
        fetchTasks(); // Reload tasks after adding
        setIsModalOpen(false); // Close modal after adding task
      } else {
        alert('Failed to add task. Please try again.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Hide loader when done
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

  // Pagination logic
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (page - 1) * tasksPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + tasksPerPage);

  // Search logic
  const filteredTasks = currentTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open detail modal
  const openDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  // Reset search query when clicking on the close icon
  const resetSearch = () => {
    setSearchQuery('');
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tasks..."
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={resetSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            {/* Add Task Button */}
            <button
              type="button"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition"
              onClick={() => setIsModalOpen(true)} // Open modal when button is clicked
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
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr
                  key={task._id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-200 transition duration-300 cursor-pointer`}
                  onClick={() => openDetailModal(task)} // Open modal on row click
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{task.title}</td>
                  <td className="px-6 py-4 text-gray-600">{task.description}</td>
                  <td className="px-6 py-4 text-gray-700">{task.timeSpent} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {tasks.length > 10 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Prev
            </button>
            <span className="text-lg text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              Next
            </button>
          </div>
        )}

        {/* Task Details Modal */}
        {isDetailModalOpen && selectedTask && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
            id="task-detail-modal"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-green-800 mb-6 text-center">Task Details</h3>
              <div className="space-y-4">
                <p><strong>Title:</strong> {selectedTask.title}</p>
                <p><strong>Description:</strong> {selectedTask.description}</p>
                <p><strong>Time Spent:</strong> {selectedTask.timeSpent} min</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDetailModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Adding Task */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
            id="task-modal"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-green-800 mb-6 text-center">Add New Task</h3>
              <form
                onSubmit={handleSubmit} // Simplified form submit
                className="space-y-5"
              >
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                  {title.length < 1 && <p className="text-sm text-red-600 mt-1">Task title is required.</p>}
                </div>

                <div>
                  <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-700">Time Spent (minutes)</label>
                  <input
                    type="text"
                    id="timeSpent"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                  {timeSpent.length < 1 && <p className="text-sm text-red-600 mt-1">Time spent is required.</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                  {description.length < 1 && <p className="text-sm text-red-600 mt-1">Description is required.</p>}
                </div>

                <div className="flex justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)} // Close modal on click
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className={`bg-green-500 text-white py-2 px-5 rounded-md ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
