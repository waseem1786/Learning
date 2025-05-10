import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        fetchTasks();
        setIsModalOpen(false);
      } else {
        alert('Failed to add task. Please try again.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (page - 1) * tasksPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + tasksPerPage);

  const filteredTasks = currentTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTasks();
      } else {
        alert('Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete._id);
      closeDeleteModal();
    }
  };

  const openDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  const resetSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <a href="#" className="flex items-center">
            <img src="/logo.jpg" alt="Learning Tracker" className="h-12 w-12 mr-3 rounded-full shadow-lg" />
            <span className="text-4xl font-bold text-green-900 tracking-tight">Learning Tracker</span>
          </a>
          <div className="flex gap-4">
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
            <button
              type="button"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Task
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
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
                <tr
                  key={task._id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-200 transition duration-300`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{task.title}</td>
                  <td className="px-6 py-4 text-gray-600">{task.description}</td>
                  <td className="px-6 py-4 text-gray-700">{task.timeSpent} min</td>
                  <td className="px-6 py-4 text-gray-500">
                    <button
                      onClick={() => openDeleteModal(task)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
            id="task-modal"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-green-800 mb-6 text-center">Add New Task</h3>
              <form
                onSubmit={handleSubmit}
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
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Task Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    rows="3"
                  ></textarea>
                </div>

                <div className="flex justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className={`bg-green-500 text-white py-2 px-5 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Confirm Deletion</h3>
              <p className="text-gray-600 mt-4 text-center">Are you sure you want to delete this task?</p>
              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="bg-red-500 text-white font-medium px-5 py-2 rounded-md"
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
